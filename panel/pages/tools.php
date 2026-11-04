<?php
if (!defined('TELEBOT_PANEL')) {
    exit;
}

$pageTitle = 'تنظیمات و ابزارها';
$db = App::db();
$notice = null;

if (Panel::isPost()) {
    $action = Panel::post('action');

    if ($action === 'finalize_expired') {
        $ids = $db->all(
            "SELECT id FROM attempts WHERE status = 'in_progress' AND deadline IS NOT NULL AND deadline <= ?",
            array(App::now())
        );
        $count = 0;
        foreach ($ids as $row) {
            try {
                Timer::finalize((int) $row['id'], 'timeout');
                $count++;
            } catch (Throwable $e) {
                App::log('panel finalize expired: ' . $e->getMessage());
            }
        }
        Panel::flashRedirect('ok', 'تعداد ' . Farsi::digits($count) . ' تلاش منقضی پایان یافت.', Panel::url('tools'));
    } elseif ($action === 'clear_throttle') {
        $db->exec('DELETE FROM kv WHERE k LIKE ?', array('panel\\_login\\_%'));
        Panel::flashRedirect('ok', 'سوابق تلاش‌های ناموفق ورود پاک شد.', Panel::url('tools'));
    } elseif ($action === 'save_web_settings') {
        $otpEnabled = Panel::post('otp_enabled') === '1';
        $smsProvider = trim((string) Panel::post('sms_provider', 'log'));
        $smsApiKey = trim((string) Panel::post('sms_api_key', ''));
        $smsSender = trim((string) Panel::post('sms_sender', ''));
        $staticPass = trim((string) Panel::post('static_password', ''));

        SmsService::setOtpEnabled($otpEnabled);
        $db->exec('INSERT INTO kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', array('sms_provider', $smsProvider));
        $db->exec('INSERT INTO kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', array('sms_api_key', $smsApiKey));
        $db->exec('INSERT INTO kv (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', array('sms_sender', $smsSender));

        if ($staticPass !== '') {
            PanelAccess::setStaticPassword($staticPass);
        }

        Panel::flashRedirect('ok', 'تنظیمات وب، پیامک و رمز پنل با موفقیت ذخیره شد.', Panel::url('tools'));
    } else {
        Panel::flashRedirect('err', 'عملیات نامعتبر بود.', Panel::url('tools'));
    }
}

$dbVersion = '—';
try {
    $dbVersion = (string) $db->pdo()->getAttribute(PDO::ATTR_SERVER_VERSION);
} catch (Throwable $e) {
    $dbVersion = 'نامشخص';
}

$expiredCount = (int) $db->val(
    "SELECT COUNT(*) FROM attempts WHERE status = 'in_progress' AND deadline IS NOT NULL AND deadline <= ?",
    array(App::now()),
    0
);
$inProgressCount = (int) $db->val(
    "SELECT COUNT(*) FROM attempts WHERE status = 'in_progress'",
    array(),
    0
);

$otpActive = SmsService::isOtpEnabled();
$currProvider = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_provider'), 'log');
$currApiKey = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_api_key'), '');
$currSender = (string) $db->val('SELECT v FROM kv WHERE k = ?', array('sms_sender'), '');
$hasStaticPass = PanelAccess::hasStaticPassword();
?>
<?php if (is_array($notice)): ?>
  <div class="alert <?php echo $notice[0] === 'ok' ? 'ok' : 'err'; ?>"><?php echo Panel::h($notice[1]); ?></div>
<?php endif; ?>

<div class="card">
  <div class="card-head">
    <h2>تنظیمات وب‌سایت، ثبت‌نام پیامکی و رمز ادمین</h2>
  </div>
  <form method="post" class="stack">
    <?php echo PanelAuth::csrfField(); ?>
    <input type="hidden" name="action" value="save_web_settings">

    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:bold;">
      <input type="checkbox" name="otp_enabled" value="1"<?php echo $otpActive ? ' checked' : ''; ?> style="width:20px;height:20px;">
      فعال‌سازی ثبت‌نام دانش‌آموزان با شماره پیامک (OTP)
    </label>
    <p class="small-text muted">
      اگر فعال باشد، دانش‌آموزان در سایت می‌توانند علاوه بر کد اختصاصی، با شماره موبایل ثبت‌نام کنند.
    </p>

    <div class="form-grid">
      <label>
        سامانه پیامک
        <select name="sms_provider">
          <option value="log"<?php echo $currProvider === 'log' ? ' selected' : ''; ?>>حالت تستی / لاگ (بدون هزینه و پیش‌فرض)</option>
          <option value="kavenegar"<?php echo $currProvider === 'kavenegar' ? ' selected' : ''; ?>>کاوه‌نگار (Kavenegar)</option>
          <option value="ippanel"<?php echo in_array($currProvider, array('ippanel', 'farazsms')) ? ' selected' : ''; ?>>فراز اس‌ام‌اس / IPPanel</option>
        </select>
      </label>
      <label>
        کلید وب‌سرویس پیامک (API Key)
        <input type="text" name="sms_api_key" value="<?php echo Panel::h($currApiKey); ?>" placeholder="مثلاً: 67345...">
      </label>
      <label>
        شماره فرستنده پیامک (اختیاری)
        <input type="text" name="sms_sender" value="<?php echo Panel::h($currSender); ?>" placeholder="مثلاً: 10008663">
      </label>
    </div>

    <label>
      تغییر رمز عبور ورود به پنل مدیریت
      <input type="password" name="static_password" placeholder="<?php echo $hasStaticPass ? 'رمز عبور تنظیم شده است (برای تغییر، رمز جدید بنویسید)' : 'یک رمز عبور جدید وارد کنید'; ?>">
    </label>

    <div>
      <button class="btn primary" type="submit">ذخیره تنظیمات</button>
    </div>
  </form>
</div>

<div class="card">
  <div class="card-head">
    <h2>نگهداری آزمون‌ها</h2>
  </div>
  <dl class="detail-list">
    <div>
      <dt>آزمون‌های در جریان</dt>
      <dd><?php echo Farsi::digits($inProgressCount); ?></dd>
    </div>
    <div>
      <dt>آزمون‌های منقضی‌شده</dt>
      <dd><?php echo Farsi::digits($expiredCount); ?></dd>
    </div>
  </dl>
  <div class="row">
    <form method="post">
      <?php echo PanelAuth::csrfField(); ?>
      <input type="hidden" name="action" value="finalize_expired">
      <button class="btn primary" type="submit"<?php echo $expiredCount > 0 ? '' : ' disabled'; ?>>
        پایان آزمون‌های منقضی (<?php echo Farsi::digits($expiredCount); ?>)
      </button>
    </form>
    <form method="post">
      <?php echo PanelAuth::csrfField(); ?>
      <input type="hidden" name="action" value="clear_throttle">
      <button class="btn ghost" type="submit">رفع محدودیت تلاش‌های ورود</button>
    </form>
  </div>
</div>

<div class="card">
  <div class="card-head">
    <h2>مشخصات هاست و سرور</h2>
  </div>
  <dl class="detail-list">
    <div>
      <dt>نسخه PHP</dt>
      <dd><?php echo Panel::h(PHP_VERSION); ?></dd>
    </div>
    <div>
      <dt>نسخه MySQL</dt>
      <dd><?php echo Panel::h($dbVersion); ?></dd>
    </div>
    <div>
      <dt>منطقه زمانی سرور</dt>
      <dd><?php echo Panel::h(date_default_timezone_get()); ?></dd>
    </div>
    <div>
      <dt>افزونه mbstring</dt>
      <dd><?php echo function_exists('mb_strlen') ? 'فعال' : 'غیرفعال'; ?></dd>
    </div>
    <div>
      <dt>افزونه cURL</dt>
      <dd><?php echo function_exists('curl_init') ? 'فعال' : 'غیرفعال'; ?></dd>
    </div>
    <div>
      <dt>فایل لاگ خطا</dt>
      <dd class="small-text">
        <?php
        $logFile = ROOT_DIR . '/error.log';
        if (is_file($logFile) && is_readable($logFile)) {
            $size = filesize($logFile);
            echo 'موجود (' . Panel::h(Farsi::digits((string) $size)) . ' بایت)';
        } else {
            echo 'خالی / بدون خطا';
        }
        ?>
      </dd>
    </div>
  </dl>
</div>
