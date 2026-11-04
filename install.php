<?php
/**
 * One-time installer & diagnostics for QuestionBot Web.
 * Open: install.php?key=YOUR_ADMIN_KEY
 */

require __DIR__ . '/app/bootstrap.php';

function h($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function base_url()
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    $scheme = $https ? 'https' : 'http';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $dir = str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/'));
    $dir = rtrim($dir, '/');
    return $scheme . '://' . $host . $dir;
}

$key = isset($_GET['key']) ? (string) $_GET['key'] : '';
$adminKey = (string) App::cfg('admin_key', '');
if ($adminKey === '' || $key === '' || !hash_equals($adminKey, $key)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "403 Forbidden\n\nبرای دسترسی به این صفحه پارامتر ?key=YOUR_ADMIN_KEY را به انتهای آدرس اضافه کنید (در config.php تنظیم می‌شود).";
    exit;
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : '';
$messages = array();

if ($action !== '') {
    try {
        $db = App::db();
        if ($action === 'migrate') {
            $db->migrate();
            $messages[] = array('ok', 'جدول‌های دیتابیس با موفقیت ساخته/به‌روزرسانی شدند.');
        } elseif ($action === 'test_db') {
            $val = $db->val('SELECT DATABASE()');
            $messages[] = array('ok', 'اتصال به دیتابیس «' . $val . '» با موفقیت برقرار است.');
        } else {
            $messages[] = array('err', 'عملیات ناشناخته.');
        }
    } catch (Throwable $e) {
        $messages[] = array('err', $e->getMessage());
    }
}

$phpOk = version_compare(PHP_VERSION, '7.4.0', '>=');
$ext = array(
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'curl'      => extension_loaded('curl'),
    'json'      => extension_loaded('json'),
    'mbstring'  => extension_loaded('mbstring'),
    'openssl'   => extension_loaded('openssl'),
);

$cfg = App::cfg();
$dbCfg = isset($cfg['db']) && is_array($cfg['db']) ? $cfg['db'] : array();
$dbOk = !empty($dbCfg['name']) && strpos((string) $dbCfg['name'], 'cpaneluser_') !== 0
    && strpos((string) $dbCfg['pass'], 'CHANGE_ME') === false;

$dbStatus = null;
$tables = 0;
try {
    $db = App::db();
    $val = $db->val('SELECT DATABASE()');
    $tables = (int) $db->val('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()', array(), 0);
    $dbStatus = 'متصل به دیتابیس «' . $val . '» — ' . Farsi::digits($tables) . ' جدول';
} catch (Throwable $e) {
    $dbStatus = 'خطا: ' . $e->getMessage();
}

$panelUrl = base_url() . '/panel/';
$siteUrl = base_url() . '/';
$cronFinish = base_url() . '/cron_finish.php?key=' . urlencode($adminKey);
$exportUrl = base_url() . '/export.php?key=' . urlencode($adminKey) . '&quiz_id=1';

$linkBase = 'install.php?key=' . urlencode($adminKey) . '&action=';
$links = array(
    'migrate' => $linkBase . 'migrate',
    'test_db' => $linkBase . 'test_db',
);
?><!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>نصب و راه‌اندازی سامانه آزمون آنلاین</title>
<style>
 body{font-family:Tahoma,sans-serif;background:#0f172a;color:#f8fafc;margin:0;padding:24px;line-height:1.6}
 .wrap{max-width:760px;margin:0 auto}
 h1{font-size:24px;margin-bottom:8px}
 .muted{color:#94a3b8;font-size:14px}
 .card{background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;box-shadow:0 4px 6px -1px rgba(0,0,0,0.3)}
 .btn{display:inline-block;padding:10px 18px;background:#38bdf8;color:#0f172a;text-decoration:none;border-radius:8px;font-weight:bold;margin:4px 4px 4px 0}
 .btn.alt{background:#334155;color:#f8fafc}
 .btn.ok{background:#22c55e;color:#0f172a}
 table{width:100%;border-collapse:collapse;margin-top:12px}
 td{padding:10px;border-bottom:1px solid #334155}
 tr:last-child td{border-bottom:none}
 .ok{color:#4ade80}
 .warn{color:#facc15}
 .err{color:#f87171}
 code{background:#0f172a;padding:2px 8px;border-radius:4px;font-size:13px;word-break:break-all}
 .alert{padding:12px 16px;border-radius:8px;margin:12px 0}
 .alert.ok{background:#14532d;color:#86efac}
 .alert.err{background:#7f1d1d;color:#fca5a5}
</style>
</head>
<body>
<div class="wrap">
 <h1>نصب و بررسی وضعیت سامانه آزمون</h1>
 <p class="muted">راه‌اندازی آسان و بدون نیاز به SSH برای هاست اشتراکی</p>

 <?php foreach ($messages as $m): ?>
  <div class="alert <?php echo $m[0] === 'ok' ? 'ok' : 'err'; ?>"><?php echo h($m[1]); ?></div>
 <?php endforeach; ?>

 <div class="card">
  <h2>عملیات اصلی</h2>
  <p>برای بار اول دکمه زیر را بزنید تا جدول‌های دیتابیس ساخته شوند:</p>
  <p>
   <a class="btn ok" href="<?php echo h($links['migrate']); ?>">ساخت / به‌روزرسانی جدول‌های دیتابیس</a>
   <a class="btn alt" href="<?php echo h($links['test_db']); ?>">تست اتصال دیتابیس</a>
  </p>
 </div>

 <div class="card">
  <h2>وضعیت پیش‌نیازها</h2>
  <table>
   <tr><td>نسخه PHP</td><td class="<?php echo $phpOk ? 'ok' : 'err'; ?>"><?php echo h(PHP_VERSION); ?></td></tr>
   <tr><td>افزونه‌ها</td><td>
    <?php foreach ($ext as $name => $on): ?>
     <span class="<?php echo $on ? 'ok' : 'err'; ?>"><?php echo h($name); ?><?php echo $on ? ' ✓' : ' ✗'; ?></span>
    <?php endforeach; ?>
   </td></tr>
   <tr><td>اطلاعات اتصال دیتابیس</td><td class="<?php echo $dbOk ? 'ok' : 'warn'; ?>"><?php echo $dbOk ? 'تنظیم شده' : 'بررسی اطلاعات در config.php'; ?></td></tr>
   <tr><td>وضعیت دیتابیس</td><td class="<?php echo $tables > 0 ? 'ok' : 'warn'; ?>"><?php echo h($dbStatus); ?></td></tr>
  </table>
 </div>

 <div class="card">
  <h2>لینک‌های دسترسی سریع</h2>
  <p>
   <a class="btn" href="<?php echo h($panelUrl); ?>" target="_blank">ورود به پنل مدیریت وب</a>
   <a class="btn alt" href="<?php echo h($siteUrl); ?>" target="_blank">مشاهده سایت دانش‌آموزان</a>
  </p>
  <p style="font-size:13px;margin-top:12px">
   نام کاربری پیش‌فرض: <code><?php echo h(PanelAccess::username()); ?></code><br>
   رمز عبور پیش‌فرض: <code>admin1234</code> (در <code>config.php</code> یا پنل مدیریت قابل تغییر است)
  </p>
 </div>

 <div class="card">
  <h2>کران‌جاب‌ها (در cPanel &rarr; Cron Jobs)</h2>
  <p style="font-size:13px">برای پایان خودکار آزمون‌های زمان‌دار در سرور، یک کران‌جاب هر دقیقه تنظیم کنید:</p>
  <code><?php echo h('wget -q -O /dev/null "' . $cronFinish . '"'); ?></code>
 </div>
</div>
</body>
</html>
