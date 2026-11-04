<?php
/**
 * Web session authentication for students taking exams via browser.
 * Zero dependency, pure PHP session with secure cookie handling.
 */
class StudentAuth
{
    const SESSION_NAME = 'TELEBOTSTUDENT';
    private static $started = false;

    public static function isHttps()
    {
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO'])
            && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
            return true;
        }
        return false;
    }

    public static function start()
    {
        if (self::$started) {
            return;
        }
        self::$started = true;

        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.gc_maxlifetime', '86400');

        session_name(self::SESSION_NAME);
        $params = array(
            'lifetime' => 86400 * 30, // 30 days
            'path'     => '/',
            'domain'   => '',
            'secure'   => self::isHttps(),
            'httponly' => true,
            'samesite' => 'Lax',
        );
        if (PHP_VERSION_ID >= 70300) {
            session_set_cookie_params($params);
        } else {
            session_set_cookie_params(86400 * 30, '/; samesite=Lax', '', self::isHttps(), true);
        }
        session_start();

        if (!is_array($_SESSION)) {
            $_SESSION = array();
        }
    }

    public static function check()
    {
        self::start();
        return !empty($_SESSION['student_id']);
    }

    public static function student()
    {
        self::start();
        if (!self::check()) {
            return null;
        }
        $db = App::db();
        $student = $db->one(
            'SELECT * FROM student_codes WHERE id = ? AND is_active = 1',
            array((int) $_SESSION['student_id'])
        );
        if (!$student) {
            self::logout();
            return null;
        }
        return $student;
    }

    public static function studentId()
    {
        $s = self::student();
        return $s ? (int) $s['id'] : 0;
    }

    public static function loginByCode($code)
    {
        self::start();
        $db = App::db();
        Schema::upgrade($db);
        $norm = Codes::normalize($code);
        if ($norm === '') {
            throw new RuntimeException('کد دانش‌آموزی را وارد کنید.');
        }

        $student = Codes::findByCode($db, $norm);
        if (!$student) {
            throw new RuntimeException('کد دانش‌آموزی وارد شده معتبر نیست.');
        }
        if (!(int) $student['is_active']) {
            throw new RuntimeException('این کد دانش‌آموزی غیرفعال است.');
        }

        session_regenerate_id(true);
        $_SESSION['student_id'] = (int) $student['id'];
        $_SESSION['student_code'] = (string) $student['code'];
        $_SESSION['logged_at'] = time();

        return $student;
    }

    public static function registerOrLoginPhone($phone, $firstName = '', $lastName = '', $className = '')
    {
        self::start();
        $db = App::db();
        Schema::upgrade($db);
        $phone = SmsService::normalizePhone($phone);

        $student = $db->one('SELECT * FROM student_codes WHERE phone = ?', array($phone));
        if ($student) {
            if (!(int) $student['is_active']) {
                throw new RuntimeException('حساب کاربری شما غیرفعال شده است.');
            }
            session_regenerate_id(true);
            $_SESSION['student_id'] = (int) $student['id'];
            $_SESSION['student_code'] = (string) $student['code'];
            $_SESSION['logged_at'] = time();
            return $student;
        }

        // New student registration
        $first = trim((string) $firstName);
        $last = trim((string) $lastName);
        if ($first === '' || $last === '') {
            throw new RuntimeException('نام و نام‌خانوادگی برای ثبت‌نام الزامی است.');
        }

        $code = Codes::generateUnique($db, (int) App::cfg('code_length', 6));
        $db->exec(
            'INSERT INTO student_codes (code, first_name, last_name, class_name, phone, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, 1, ?)',
            array($code, $first, $last, trim((string) $className), $phone, App::now())
        );

        $id = $db->id();
        $student = $db->one('SELECT * FROM student_codes WHERE id = ?', array($id));

        session_regenerate_id(true);
        $_SESSION['student_id'] = (int) $student['id'];
        $_SESSION['student_code'] = (string) $student['code'];
        $_SESSION['logged_at'] = time();

        return $student;
    }

    public static function logout()
    {
        self::start();
        unset($_SESSION['student_id'], $_SESSION['student_code'], $_SESSION['logged_at']);
        session_regenerate_id(true);
    }
}
