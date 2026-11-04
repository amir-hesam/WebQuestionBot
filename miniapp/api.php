<?php
/**
 * JSON API for student exam portal.
 * Pure web session based, zero external dependencies.
 */

require dirname(__DIR__) . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store, no-cache, must-revalidate');

function miniapp_respond($data, $status = 200)
{
    http_response_code((int) $status);
    echo json_encode(array('ok' => true, 'data' => $data), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function miniapp_fail($message, $status = 400, $code = 'bad_request', array $extra = array())
{
    http_response_code((int) $status);
    $body = array(
        'ok' => false,
        'error' => array(
            'code' => (string) $code,
            'message' => (string) $message,
        ),
    );
    if (count($extra) > 0) {
        $body['meta'] = $extra;
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function miniapp_input(array $payload, $key, $default = null)
{
    return array_key_exists($key, $payload) ? $payload[$key] : $default;
}

try {
    if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
        miniapp_fail('درخواست باید POST باشد.', 405, 'method_not_allowed');
    }

    $raw = file_get_contents('php://input');
    $payload = array();
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    }
    if (count($payload) === 0 && count($_POST) > 0) {
        $payload = $_POST;
    }

    $action = isset($_GET['action']) ? trim((string) $_GET['action']) : '';
    if ($action === '' && isset($payload['action'])) {
        $action = trim((string) $payload['action']);
    }
    if (!preg_match('/^[a-z_]+$/', $action)) {
        miniapp_fail('عملیات نامعتبر است.', 400, 'bad_action');
    }

    if (!MiniApp::enabled()) {
        miniapp_fail('سامانه آزمون غیرفعال است.', 404, 'disabled');
    }

    StudentAuth::start();
    $studentObj = StudentAuth::student();
    $studentId = $studentObj ? (int) $studentObj['id'] : 0;

    // Public actions
    switch ($action) {
        case 'config':
            $cfg = App::cfg('miniapp', array());
            $title = is_array($cfg) && isset($cfg['title']) && trim((string) $cfg['title']) !== ''
                ? trim((string) $cfg['title'])
                : 'سامانه آزمون آنلاین';

            miniapp_respond(array(
                'title'       => $title,
                'otp_enabled' => SmsService::isOtpEnabled(),
                'logged_in'   => ($studentId > 0),
                'student'     => $studentObj ? array(
                    'id'         => (int) $studentObj['id'],
                    'code'       => (string) $studentObj['code'],
                    'first_name' => (string) $studentObj['first_name'],
                    'last_name'  => (string) $studentObj['last_name'],
                    'class_name' => (string) $studentObj['class_name'],
                    'phone'      => (string) $studentObj['phone'],
                ) : null,
            ));

        case 'student_login':
            $code = (string) miniapp_input($payload, 'code', '');
            try {
                $student = StudentAuth::loginByCode($code);
                miniapp_respond(array(
                    'student' => array(
                        'id'         => (int) $student['id'],
                        'code'       => (string) $student['code'],
                        'first_name' => (string) $student['first_name'],
                        'last_name'  => (string) $student['last_name'],
                        'class_name' => (string) $student['class_name'],
                    ),
                ));
            } catch (Throwable $e) {
                miniapp_fail($e->getMessage(), 422, 'login_failed');
            }

        case 'send_otp':
            if (!SmsService::isOtpEnabled()) {
                miniapp_fail('ثبت‌نام با پیامک در حال حاضر غیرفعال است.', 403, 'otp_disabled');
            }
            $phone = (string) miniapp_input($payload, 'phone', '');
            if (!SmsService::isValidIranianPhone($phone)) {
                miniapp_fail('شماره موبایل نامعتبر است (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).', 422, 'bad_phone');
            }
            try {
                $code = SmsService::generateOtp($phone);
                miniapp_respond(array('sent' => true, 'phone' => SmsService::normalizePhone($phone)));
            } catch (Throwable $e) {
                miniapp_fail($e->getMessage(), 429, 'otp_error');
            }

        case 'verify_otp':
            if (!SmsService::isOtpEnabled()) {
                miniapp_fail('ثبت‌نام با پیامک غیرفعال است.', 403, 'otp_disabled');
            }
            $phone = (string) miniapp_input($payload, 'phone', '');
            $code = (string) miniapp_input($payload, 'code', '');
            $firstName = (string) miniapp_input($payload, 'first_name', '');
            $lastName = (string) miniapp_input($payload, 'last_name', '');
            $className = (string) miniapp_input($payload, 'class_name', '');

            if (!SmsService::verifyOtp($phone, $code)) {
                miniapp_fail('کد تایید اشتباه است یا منقضی شده است.', 422, 'invalid_otp');
            }

            try {
                $student = StudentAuth::registerOrLoginPhone($phone, $firstName, $lastName, $className);
                miniapp_respond(array(
                    'student' => array(
                        'id'         => (int) $student['id'],
                        'code'       => (string) $student['code'],
                        'first_name' => (string) $student['first_name'],
                        'last_name'  => (string) $student['last_name'],
                        'class_name' => (string) $student['class_name'],
                        'phone'      => (string) $student['phone'],
                    ),
                ));
            } catch (Throwable $e) {
                miniapp_fail($e->getMessage(), 422, 'verify_failed');
            }

        case 'logout':
            StudentAuth::logout();
            miniapp_respond(array('logged_out' => true));
    }

    // Authenticated actions
    if ($studentId <= 0) {
        miniapp_fail('لطفاً ابتدا با کد دانش‌آموزی خود وارد شوید.', 401, 'unauthorized');
    }

    switch ($action) {
        case 'home':
            miniapp_respond(MiniApp::home(0, $studentId));

        case 'enter':
            $quizId = (int) miniapp_input($payload, 'quiz_id', 0);
            $examCode = (string) miniapp_input($payload, 'exam_code', '');
            $studentCode = (string) miniapp_input($payload, 'student_code', '');
            if ($studentCode === '' && $studentObj) {
                $studentCode = (string) $studentObj['code'];
            }
            miniapp_respond(MiniApp::enter(0, $quizId, $examCode, $studentCode));

        case 'state':
            $attemptId = (int) miniapp_input($payload, 'attempt_id', 0);
            miniapp_respond(MiniApp::examState(0, $attemptId, $studentId));

        case 'answer':
            $attemptId = (int) miniapp_input($payload, 'attempt_id', 0);
            $questionId = (int) miniapp_input($payload, 'question_id', 0);
            $option = (string) miniapp_input($payload, 'option', '');
            miniapp_respond(MiniApp::answer(0, $attemptId, $questionId, $option, $studentId));

        case 'navigate':
            $attemptId = (int) miniapp_input($payload, 'attempt_id', 0);
            $index = (int) miniapp_input($payload, 'index', 0);
            miniapp_respond(MiniApp::navigate(0, $attemptId, $index, $studentId));

        case 'finish':
            $attemptId = (int) miniapp_input($payload, 'attempt_id', 0);
            miniapp_respond(MiniApp::finish(0, $attemptId, $studentId));

        case 'result':
            $attemptId = (int) miniapp_input($payload, 'attempt_id', 0);
            miniapp_respond(MiniApp::result(0, $attemptId, $studentId));

        default:
            miniapp_fail('عملیات ناشناخته است.', 404, 'unknown_action');
    }
} catch (MiniAppError $e) {
    miniapp_fail($e->getMessage(), $e->status(), $e->errorCode(), $e->extra());
} catch (Throwable $e) {
    App::log('api error: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    miniapp_fail('خطای سرور رخ داد. دوباره تلاش کنید.', 500, 'server_error');
}
