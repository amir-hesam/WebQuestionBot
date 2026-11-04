<?php
if (!isset($error)) {
    $error = '';
}
if (!isset($panelEnabled)) {
    $panelEnabled = false;
}
if (!isset($panelError)) {
    $panelError = '';
}
if (!isset($flashes) || !is_array($flashes)) {
    $flashes = array();
}
?><!DOCTYPE html>
<html lang="fa" dir="rtl" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ورود به پنل مدیریت</title>
<link rel="stylesheet" href="assets/style.css?v=2">
<script src="assets/app.js?v=2" defer></script>
</head>
<body class="login-body">
<main class="login-card">
  <div class="login-brand">
    <span class="brand-mark">📝</span>
    <div>
      <h1>پنل مدیریت آزمون آنلاین</h1>
      <p class="muted">ورود برای مدیریت دانش‌آموزان، آزمون‌ها و نتایج</p>
    </div>
  </div>

  <?php foreach ($flashes as $flash): ?>
    <div class="alert <?php echo Panel::h($flash[0]); ?>"><?php echo Panel::h($flash[1]); ?></div>
  <?php endforeach; ?>

  <?php if ($panelError !== ''): ?>
    <div class="alert err"><?php echo Panel::h($panelError); ?></div>
  <?php endif; ?>

  <?php if ($error !== ''): ?>
    <div class="alert err"><?php echo Panel::h($error); ?></div>
  <?php endif; ?>

  <form method="post" action="index.php" class="stack" autocomplete="on">
    <?php echo PanelAuth::csrfField(); ?>
    <label>
      نام کاربری
      <input type="text" name="user" value="<?php echo Panel::h(PanelAccess::username()); ?>" autocomplete="username" required>
    </label>
    <label>
      رمز عبور
      <input type="password" name="pass" autocomplete="current-password" required>
    </label>
    <button class="btn primary" type="submit">ورود به پنل مدیریت</button>
  </form>

  <p class="login-help muted">
    ورود با نام‌کاربری و رمز عبور ادمین (تعیین‌شده در <code>config.php</code> یا بخش تنظیمات).
  </p>
  <div class="login-actions">
    <button class="btn ghost small" type="button" data-theme-toggle>تغییر تم</button>
  </div>
</main>
</body>
</html>
