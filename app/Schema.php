<?php
/**
 * Reads schema.sql and returns individual SQL statements.
 */
class Schema
{
    public static function statements()
    {
        $file = ROOT_DIR . '/schema.sql';
        if (!is_file($file)) {
            throw new RuntimeException('schema.sql not found');
        }
        $sql = file_get_contents($file);

        // remove comment-only lines
        $lines = preg_split('/\r\n|\r|\n/', $sql);
        $clean = array();
        foreach ($lines as $line) {
            $t = trim($line);
            if ($t === '' || strpos($t, '--') === 0) {
                continue;
            }
            $clean[] = $line;
        }
        $sql = implode("\n", $clean);

        $parts = explode(';', $sql);
        $out = array();
        foreach ($parts as $part) {
            $part = trim($part);
            if ($part !== '') {
                $out[] = $part;
            }
        }
        return $out;
    }

    public static function upgrade(Db $db)
    {
        // Add phone column to student_codes if missing
        try {
            $hasPhone = (int) $db->val(
                "SELECT COUNT(*) FROM information_schema.COLUMNS 
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'student_codes' AND COLUMN_NAME = 'phone'"
            );
            if ($hasPhone === 0) {
                $db->exec("ALTER TABLE student_codes ADD COLUMN phone VARCHAR(20) NULL DEFAULT NULL AFTER class_name, ADD KEY idx_phone (phone)");
            }
        } catch (Throwable $e) {
            App::log('schema upgrade phone: ' . $e->getMessage());
        }

        // Ensure otp_codes table exists
        try {
            $db->exec("CREATE TABLE IF NOT EXISTS otp_codes (
              id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
              phone VARCHAR(20) NOT NULL,
              code VARCHAR(10) NOT NULL,
              created_at DATETIME NOT NULL,
              expires_at DATETIME NOT NULL,
              is_used TINYINT(1) NOT NULL DEFAULT 0,
              KEY idx_phone_exp (phone, expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        } catch (Throwable $e) {
            App::log('schema upgrade otp_codes: ' . $e->getMessage());
        }
    }
}
