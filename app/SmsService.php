<?php
/**
 * SMS service & OTP management.
 * Pure PHP, zero external dependencies, compatible with shared hosting (cPanel).
 */
class SmsService
{
    const OTP_TTL = 180; // 3 minutes
    const THROTTLE_LIMIT = 4;
    const THROTTLE_WINDOW = 600;

    public static function isOtpEnabled()
    {
        try {
            $db = App::db();
            $val = $db->val('SELECT v FROM kv WHERE k = ?', array('otp_enabled'));
            if ($val !== null && $val !== '') {
                return (bool) (int) $val;
            }
        } catch (Throwable $e) {}
        return false;
    }

    public static function setOtpEnabled($enabled)
    {
        $db = App::db();
        $db->exec(
            'INSERT INTO kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
            array('otp_enabled', $enabled ? '1' : '0')
        );
    }

    public static function normalizePhone($phone)
    {
        $phone = Farsi::normalizeCode($phone);
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (strpos($phone, '0098') === 0) {
            $phone = '0' . substr($phone, 4);
        } elseif (strpos($phone, '98') === 0 && strlen($phone) === 12) {
            $phone = '0' . substr($phone, 2);
        }
        if (strlen($phone) === 10 && strpos($phone, '9') === 0) {
            $phone = '0' . $phone;
        }
        return $phone;
    }

    public static function isValidIranianPhone($phone)
    {
        $p = self::normalizePhone($phone);
        return (bool) preg_match('/^09[0-9]{9}$/', $p);
    }

    public static function generateOtp($phone)
    {
        $db = App::db();
        Schema::upgrade($db);
        $phone = self::normalizePhone($phone);

        // Throttle check
        $recent = (int) $db->val(
            'SELECT COUNT(*) FROM otp_codes WHERE phone = ? AND created_at >= ?',
            array($phone, date('Y-m-d H:i:s', time() - self::THROTTLE_WINDOW))
        );
        if ($recent >= self::THROTTLE_LIMIT) {
            throw new RuntimeException('تعداد درخواست‌های پیامک برای این شماره زیاد است. لطفاً چند دقیقه دیگر تلاش کنید.');
        }

        $code = str_pad((string) random_int(10000, 99999), 5, '0', STR_PAD_LEFT);
        $now = App::now();
        $expires = date('Y-m-d H:i:s', time() + self::OTP_TTL);

        $db->exec(
            'INSERT INTO otp_codes (phone, code, created_at, expires_at, is_used) VALUES (?, ?, ?, ?, 0)',
            array($phone, $code, $now, $expires)
        );

        self::send($phone, $code);
        return $code;
    }

    public static function verifyOtp($phone, $code)
    {
        $db = App::db();
        $phone = self::normalizePhone($phone);
        $code = trim(Farsi::normalizeCode($code));

        $row = $db->one(
            'SELECT * FROM otp_codes WHERE phone = ? AND is_used = 0 AND expires_at >= ? ORDER BY id DESC LIMIT 1',
            array($phone, App::now())
        );

        if (!$row || !hash_equals((string) $row['code'], (string) $code)) {
            return false;
        }

        $db->exec('UPDATE otp_codes SET is_used = 1 WHERE id = ?', array($row['id']));
        return true;
    }

    public static function send($phone, $code)
    {
        $db = App::db();
        $provider = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_provider'), 'log');
        $apiKey = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_api_key'), '');
        $sender = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_sender'), '');

        // Store last code in kv for easy test/debug when running on localhost or shared host without balance
        $db->exec(
            'INSERT INTO kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
            array('last_otp_' . $phone, $code)
        );

        if ($provider === 'kavenegar' && $apiKey !== '') {
            $url = 'https://api.kavenegar.com/v1/' . urlencode($apiKey) . '/sms/send.json';
            $data = array(
                'receptor' => $phone,
                'message'  => "کد تایید شما در آزمون آنلاین:\n" . $code,
            );
            if ($sender !== '') {
                $data['sender'] = $sender;
            }
            self::postHttp($url, $data);
            return;
        }

        if (($provider === 'farazsms' || $provider === 'ippanel') && $apiKey !== '') {
            $url = 'https://api2.ippanel.com/api/v1/sms/send/webservice/single';
            $body = json_encode(array(
                'recipient' => array($phone),
                'sender'    => $sender !== '' ? $sender : '+98club',
                'message'   => "کد تایید آزمون آنلاین: " . $code,
            ));
            self::postJson($url, $body, array('apikey: ' . $apiKey));
            return;
        }

        // Default 'log' mode
        App::log("SMS to {$phone}: Code is {$code}");
    }

    private static function postHttp($url, array $fields)
    {
        $body = http_build_query($fields);
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $body,
                CURLOPT_TIMEOUT        => 8,
                CURLOPT_SSL_VERIFYPEER => false,
            ));
            curl_exec($ch);
            curl_close($ch);
        } else {
            $opts = array(
                'http' => array(
                    'method'  => 'POST',
                    'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
                    'content' => $body,
                    'timeout' => 8,
                ),
            );
            @file_get_contents($url, false, stream_context_create($opts));
        }
    }

    private static function postJson($url, $jsonBody, array $headers = array())
    {
        $headers[] = 'Content-Type: application/json';
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $jsonBody,
                CURLOPT_HTTPHEADER     => $headers,
                CURLOPT_TIMEOUT        => 8,
                CURLOPT_SSL_VERIFYPEER => false,
            ));
            curl_exec($ch);
            curl_close($ch);
        } else {
            $opts = array(
                'http' => array(
                    'method'  => 'POST',
                    'header'  => implode("\r\n", $headers) . "\r\n",
                    'content' => $jsonBody,
                    'timeout' => 8,
                ),
            );
            @file_get_contents($url, false, stream_context_create($opts));
        }
    }
}
