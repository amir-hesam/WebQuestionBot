(function () {
  'use strict';

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  var view = document.getElementById('view');
  var bottomNav = document.getElementById('bottomNav');
  var toastEl = document.getElementById('toast');
  var themeBtn = document.getElementById('themeBtn');
  var topbar = document.querySelector('.topbar');
  var THEME_KEY = 'miniapp-theme';

  var ICONS = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"></path><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"></path><path d="M8 7h8M8 11h5"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2.5"></rect><path d="M8 10V7.5a4 4 0 0 1 8 0V10"></path></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 5 11 7-11 7V5Z"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.34 5.66"></path><path d="M20 4v7h-7"></path></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16"></path><path d="M8 15v-4M12 15V7M16 15v-6"></path></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="m11 18-6-6 6-6"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.8 2.8L16.5 9"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m9 9 6 6M15 9l-6 6"></path></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"></path></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2"></path><path d="M5 5h14l-1.2 14H6.2L5 5Z"></path><path d="M9 10v5M15 10v5"></path></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"></path><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3"></path><path d="M12 12v4M9 20h6M10 20v-2h4v2"></path></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 11 8-7 8 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"></circle><path d="M5.5 20a6.5 6.5 0 0 1 13 0"></path></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"></circle><path d="m11 12 9-9M17 3l4 4M14 6l3 3"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.35-4.35"></path></svg>'
  };

  var state = {
    home: null,
    tab: 'exams',
    screen: 'home',
    exam: null,
    entryQuiz: null,
    result: null,
    timerId: null,
    deadline: 0,
    busy: false,
    finishing: false,
    toastTimer: null,
    config: null,
    student: null,
    authTab: 'code',
    otpStep: 1,
    otpPhone: '',
    searchQuery: '',
    activeFilter: 'all'
  };

  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fa(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[0-9]/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d));
    });
  }

  function faDur(seconds) {
    if (seconds === null || seconds === undefined) {
      return 'بدون محدودیت';
    }
    var total = Math.max(0, Math.floor(Number(seconds) || 0));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }
    return fa(h > 0 ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s));
  }

  function normalizeCode(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/[۰-۹]/g, function (d) {
        return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
      })
      .replace(/[٠-٩]/g, function (d) {
        return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      })
      .replace(/[\s\-_]+/g, '')
      .toUpperCase();
  }

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme, persist) {
    theme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    if (persist) {
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#070b16' : '#eef2f9');
    }
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک');
    }
    if (tg) {
      try {
        if (tg.setHeaderColor) {
          tg.setHeaderColor(theme === 'dark' ? '#070b16' : '#eef2f9');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor(theme === 'dark' ? '#070b16' : '#eef2f9');
        }
      } catch (e) {}
    }
  }

  function haptic(style) {
    try {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style || 'light');
      }
    } catch (e) {}
  }

  function toast(message, type) {
    if (!toastEl) {
      return;
    }
    toastEl.textContent = String(message || '');
    toastEl.className = 'toast show' + (type ? ' ' + type : '');
    if (state.toastTimer) {
      window.clearTimeout(state.toastTimer);
    }
    state.toastTimer = window.setTimeout(function () {
      toastEl.className = 'toast' + (type ? ' ' + type : '');
    }, 3200);
  }

  function api(action, payload) {
    var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    var body = payload || {};
    if (tg && tg.initData) {
      headers['X-Telegram-Init-Data'] = tg.initData;
      body.init_data = tg.initData;
    }
    var request;
    try {
      request = window.fetch('api.php?action=' + encodeURIComponent(action), {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        credentials: 'same-origin',
        cache: 'no-store'
      });
    } catch (e) {
      return Promise.reject(new Error('اتصال به سرور برقرار نشد.'));
    }
    return request.then(function (response) {
      return response.json().catch(function () {
        return null;
      }).then(function (json) {
        if (!response.ok || !json || json.ok !== true) {
          var message = json && json.error && json.error.message
            ? json.error.message
            : 'خطا در ارتباط با سرور. دوباره تلاش کنید.';
          var error = new Error(message);
          error.code = json && json.error ? json.error.code : 'http_' + response.status;
          error.status = response.status;
          error.meta = json && json.meta ? json.meta : {};
          throw error;
        }
        return json.data;
      });
    }, function () {
      throw new Error('اتصال به سرور برقرار نشد. اینترنت را بررسی کنید.');
    });
  }

  function syncChrome() {
    var isHome = state.screen === 'home';
    var showBack = state.screen === 'entry' || state.screen === 'exam' || state.screen === 'result';
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.classList.toggle('hidden', !state.student || state.screen === 'exam');
    }
    var userBadge = document.getElementById('userBadge');
    var userName = document.getElementById('userName');
    var userCode = document.getElementById('userCode');
    var userAvatar = document.getElementById('userAvatar');
    if (userBadge) {
      if (state.student && state.screen !== 'auth') {
        userBadge.classList.remove('hidden');
        var fullName = (state.student.first_name + ' ' + (state.student.last_name || '')).trim();
        if (userName) userName.textContent = fullName;
        if (userCode) userCode.textContent = state.student.code ? 'کد: ' + state.student.code : '';
        if (userAvatar) userAvatar.textContent = (state.student.first_name || 'د').charAt(0);
      } else {
        userBadge.classList.add('hidden');
      }
    }
    if (bottomNav) {
      bottomNav.classList.toggle('hidden', !isHome);
      var tabs = bottomNav.querySelectorAll('[data-tab]');
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === state.tab);
      }
    }
    if (tg) {
      try {
        if (tg.BackButton) {
          if (showBack) {
            tg.BackButton.show();
          } else {
            tg.BackButton.hide();
          }
        }
      } catch (e) {}
      try {
        if (tg.setClosingConfirmation) {
          tg.setClosingConfirmation(state.screen === 'exam');
        }
      } catch (e) {}
    }
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerDisplay() {
    var el = document.getElementById('timerPill');
    if (!el || !state.exam) {
      return;
    }
    var remaining = state.exam.remaining;
    if (remaining === null || remaining === undefined) {
      el.classList.remove('warn');
      el.innerHTML = ICONS.clock + '<span>آزاد</span>';
      return;
    }
    var left = Math.max(0, Math.floor(Number(remaining) || 0));
    el.classList.toggle('warn', left <= 60);
    el.innerHTML = ICONS.clock + '<span>' + esc(faDur(left)) + '</span>';
  }

  function startTimer() {
    stopTimer();
    if (!state.exam) {
      return;
    }
    updateTimerDisplay();
    if (state.exam.remaining === null || state.exam.remaining === undefined) {
      return;
    }
    state.deadline = Date.now() + (Number(state.exam.remaining) || 0) * 1000;
    state.timerId = window.setInterval(function () {
      if (!state.exam) {
        stopTimer();
        return;
      }
      var left = Math.round((state.deadline - Date.now()) / 1000);
      state.exam.remaining = Math.max(0, left);
      updateTimerDisplay();
      if (left <= 0) {
        stopTimer();
        autoFinish();
      }
    }, 1000);
  }

  function renderLoading(message) {
    state.screen = 'loading';
    view.innerHTML = '<div class="boot"><div class="spinner" aria-hidden="true"></div><p>'
      + esc(message || 'در حال بارگذاری…') + '</p></div>';
    syncChrome();
  }

  function renderAuth() {
    state.screen = 'auth';
    stopTimer();
    var otpOn = state.config && state.config.otp_enabled;

    var html = '<div class="auth-layout">';

    // Academic / Official Portal Info on Desktop
    html += '<div class="auth-showcase">';
    html += '<div class="portal-badge"><span class="badge-dot"></span> پرتال سنجش و داوطلبان</div>';
    html += '<h2 class="showcase-title">سامانه برگزاری و تصحیح آزمون‌های آنلاین</h2>';
    html += '<p class="showcase-desc">محیطی استاندارد و بدون حاشیه برای شرکت در آزمون‌های کلاسی و هماهنگ، همراه با محاسبه دقیق زمان سرور و صدور کارنامه مستند.</p>';

    html += '<div class="portal-points">';
    html += '<div class="portal-point">';
    html += '<div class="point-icon">' + ICONS.key + '</div>';
    html += '<div class="point-text"><strong>ورود مستقیم با کد داوطلبی</strong><p>تنها با وارد کردن کد اختصاصی دریافتی از مدرسه یا استاد، به آزمون‌های خود دسترسی پیدا کنید.</p></div>';
    html += '</div>';

    html += '<div class="portal-point">';
    html += '<div class="point-icon">' + ICONS.clock + '</div>';
    html += '<div class="point-text"><strong>تایمر خودکار و ایمن سرور</strong><p>مدیریت دقیق زمان آزمون و ذخیره پیوسته پاسخ‌ها بدون نگرانی از قطعی لحظه‌ای اینترنت.</p></div>';
    html += '</div>';

    html += '<div class="portal-point">';
    html += '<div class="point-icon">' + ICONS.chart + '</div>';
    html += '<div class="point-text"><strong>کارنامه و مرور سوالات</strong><p>مشاهده درصد نمره، تعداد پاسخ‌های درست و غلط و مرور گزینه‌های صحیح بلافاصله پس از اتمام آزمون.</p></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Auth Card
    html += '<section class="card auth-card">';
    html += '<div class="auth-header">';
    html += '<div class="auth-brand-badge">' + ICONS.book + '</div>';
    html += '<h1 class="auth-title">ورود به جلسه آزمون</h1>';
    html += '<p class="auth-subtitle">برای ورود و مشاهده فهرست آزمون‌ها، اطلاعات خود را وارد کنید.</p>';
    html += '</div>';

    if (otpOn) {
      html += '<div class="auth-nav">';
      html += '<button type="button" class="auth-nav-btn ' + (state.authTab === 'code' ? 'active' : '') + '" data-auth-tab="code">کد دانش‌آموزی</button>';
      html += '<button type="button" class="auth-nav-btn ' + (state.authTab === 'otp' ? 'active' : '') + '" data-auth-tab="otp">ثبت‌نام با پیامک</button>';
      html += '</div>';
    }

    if (state.authTab === 'code' || !otpOn) {
      html += '<form id="codeAuthForm" class="form-grid">';
      html += '<div class="field">';
      html += '<label for="studentCodeInput">کد دانش‌آموزی اختصاصی</label>';
      html += '<input type="text" id="studentCodeInput" name="student_code" class="auth-input-code" placeholder="مثال: AB12" required autocomplete="off" autofocus maxlength="16">';
      html += '</div>';
      html += '<div class="auth-hint">' + ICONS.info + '<span>کد دانش‌آموزی صادرشده توسط مرکز آزمون یا برگزارکننده را وارد کنید.</span></div>';
      html += '<button type="submit" class="btn primary block auth-submit-btn">ورود به پرتال آزمون ' + ICONS.arrowLeft + '</button>';
      html += '</form>';
    } else {
      // OTP Registration / Login
      if (state.otpStep === 1) {
        html += '<form id="otpPhoneForm" class="form-grid">';
        html += '<div class="field">';
        html += '<label for="phoneInput">شماره موبایل دانش‌آموز</label>';
        html += '<input type="tel" id="phoneInput" name="phone" class="auth-input-phone" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value="' + esc(state.otpPhone) + '" required autofocus>';
        html += '</div>';
        html += '<div class="auth-hint">' + ICONS.info + '<span>کد تایید ۵ رقمی جهت احراز هویت به این شماره پیامک خواهد شد.</span></div>';
        html += '<button type="submit" class="btn primary block auth-submit-btn">ارسال کد تایید ' + ICONS.arrowLeft + '</button>';
        html += '</form>';
      } else {
        html += '<form id="otpVerifyForm" class="form-grid">';
        html += '<div class="auth-phone-badge">';
        html += '<span>شماره: <strong>' + esc(fa(state.otpPhone)) + '</strong></span>';
        html += '<button type="button" class="btn ghost small" data-action="change-phone">ویرایش شماره</button>';
        html += '</div>';
        html += '<div class="field">';
        html += '<label for="otpCodeInput">کد تایید ۵ رقمی</label>';
        html += '<input type="number" id="otpCodeInput" name="otp_code" class="auth-input-otp" placeholder="۱۲۳۴۵" required autofocus maxlength="5">';
        html += '</div>';
        html += '<div class="form-row-2">';
        html += '<div class="field"><label>نام</label><input type="text" name="first_name" placeholder="نام" required></div>';
        html += '<div class="field"><label>نام خانوادگی</label><input type="text" name="last_name" placeholder="نام خانوادگی" required></div>';
        html += '</div>';
        html += '<div class="field">';
        html += '<label>پایه / کلاس / رشته <span class="optional">(اختیاری)</span></label>';
        html += '<input type="text" name="class_name" placeholder="مثال: دوازدهم تجربی">';
        html += '</div>';
        html += '<button type="submit" class="btn primary block auth-submit-btn" style="margin-top:6px;">تایید و ورود ' + ICONS.check + '</button>';
        html += '</form>';
      }
    }

    html += '</section>';
    html += '</div>';
    view.innerHTML = html;
    syncChrome();
  }

  function renderOutside(message) {
    renderAuth();
  }

  function renderError(error) {
    if (error && (error.code === 'unauthorized' || error.code === 'expired')) {
      renderOutside(error.message);
      return;
    }
    state.screen = 'error';
    stopTimer();
    view.innerHTML = '<section class="card state-card">'
      + '<div class="state-icon">' + ICONS.info + '</div>'
      + '<h2>مشکلی پیش آمد</h2>'
      + '<p>' + esc(error && error.message ? error.message : 'خطای نامشخص. دوباره تلاش کنید.') + '</p>'
      + '<button type="button" class="btn primary" data-action="reload">' + ICONS.refresh + ' تلاش دوباره</button>'
      + '</section>';
    syncChrome();
  }

  function averagePercent(history) {
    if (!history || history.length === 0) {
      return 0;
    }
    var sum = 0;
    for (var i = 0; i < history.length; i++) {
      sum += Number(history[i].percent) || 0;
    }
    return Math.round(sum / history.length);
  }

  function quizCard(quiz) {
    var active = Number(quiz.attempt_id) > 0;
    var meta = '<span class="card-chip">' + ICONS.book + ' ' + esc(fa(quiz.question_count)) + ' سوال</span>';
    meta += '<span class="card-chip">' + ICONS.clock + ' ' + (Number(quiz.time_limit) > 0
      ? esc(faDur(quiz.time_limit))
      : 'بدون محدودیت') + '</span>';
    if (quiz.has_code) {
      meta += '<span class="card-chip locked">' + ICONS.lock + ' نیازمند کد ورود</span>';
    }
    var button = active
      ? '<button type="button" class="btn warning block" data-action="resume" data-attempt-id="' + Number(quiz.attempt_id) + '">' + ICONS.play + ' ادامه آزمون</button>'
      : '<button type="button" class="btn primary block" data-action="start" data-quiz-id="' + Number(quiz.id) + '">' + ICONS.play + ' ورود به آزمون</button>';

    return '<article class="card quiz-card">'
      + '<div class="quiz-card-header">'
      + '<span class="quiz-status-pill ' + (active ? 'live' : '') + '">' + (active ? 'در حال انجام' : 'آزمون آنلاین') + '</span>'
      + '</div>'
      + '<h3 class="quiz-title">' + esc(quiz.title) + '</h3>'
      + (quiz.description ? '<p class="quiz-desc">' + esc(quiz.description) + '</p>' : '')
      + '<div class="quiz-chips">' + meta + '</div>'
      + '<div class="quiz-card-footer">' + button + '</div>'
      + '</article>';
  }

  function activeCard(attempt) {
    var countdown = attempt.remaining === null || attempt.remaining === undefined
      ? 'بدون محدودیت'
      : faDur(attempt.remaining) + ' باقی‌مانده';
    return '<article class="card active-card">'
      + '<div class="active-head">'
      + '<span class="pulse-indicator" aria-hidden="true"></span>'
      + '<div class="active-info"><h3>' + esc(attempt.title) + '</h3>'
      + '<p class="active-meta">' + esc(attempt.student_name || '') + ' · سوال '
      + esc(fa(Number(attempt.current_index) + 1)) + ' از ' + esc(fa(attempt.total)) + '</p>'
      + '</div></div>'
      + '<div class="active-foot">'
      + '<span class="timer-badge">' + ICONS.clock + ' ' + esc(countdown) + '</span>'
      + '<button type="button" class="btn primary small" data-action="resume" data-attempt-id="'
      + Number(attempt.attempt_id) + '">' + ICONS.play + ' ادامه آزمون</button>'
      + '</div>'
      + '</article>';
  }

  function historyCard(item) {
    var pct = Number(item.percent) || 0;
    var cls = pct >= 80 ? 'good' : (pct >= 50 ? 'warn' : 'bad');
    var date = formatDate(item.finished_at);
    return '<button type="button" class="card history-card" data-action="open-result" data-attempt-id="'
      + Number(item.attempt_id) + '">'
      + '<div class="history-score ' + cls + '">' + esc(fa(pct)) + '٪</div>'
      + '<div class="history-info"><h3>' + esc(item.title) + '</h3>'
      + '<p class="history-meta"><span>' + esc(fa(item.score)) + ' پاسخ درست از ' + esc(fa(item.total)) + '</span>'
      + (date ? '<span>· ' + esc(date) + '</span>' : '')
      + '</p></div>'
      + '<span class="chevron">' + ICONS.chevron + '</span>'
      + '</button>';
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }
    var date = new Date(String(value).replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      return String(value);
    }
    try {
      return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return String(value);
    }
  }

  function renderHome() {
    if (!state.home) {
      return;
    }
    var data = state.home;
    var quizzes = data.quizzes || [];
    var active = data.active || [];
    var history = data.history || [];
    var student = state.student || {};
    var name = student.first_name ? (student.first_name + (student.last_name ? ' ' + student.last_name : '')) : (tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : 'دانش‌آموز');
    var code = student.code || '';
    var avg = averagePercent(history);

    var html = '<section class="dash-header">'
      + '<div class="dash-welcome">'
      + '<div class="dash-welcome-text">'
      + '<h1>سلام، ' + esc(name) + '</h1>'
      + '<p class="dash-sub">میز کار داوطلب · فهرست آزمون‌های فعال و سوابق نمرات</p>'
      + '</div>';
    if (code) {
      html += '<div class="student-code-badge" data-action="copy-code" data-code="' + esc(code) + '" title="برای کپی کد کلیک کنید">'
        + '<span>کد داوطلب: <strong>' + esc(code) + '</strong></span>'
        + '<button type="button" class="btn-copy">کپی</button>'
        + '</div>';
    }
    html += '</div>'
      + '<div class="dash-metrics">'
      + '<div class="dash-metric-card">'
      + '<span class="metric-val">' + esc(fa(quizzes.length)) + '</span>'
      + '<span class="metric-title">آزمون در دسترس</span>'
      + '</div>'
      + '<div class="dash-metric-card">'
      + '<span class="metric-val">' + esc(fa(history.length)) + '</span>'
      + '<span class="metric-title">آزمون تکمیل‌شده</span>'
      + '</div>'
      + '<div class="dash-metric-card">'
      + '<span class="metric-val">' + esc(fa(avg)) + '٪</span>'
      + '<span class="metric-title">میانگین نمرات</span>'
      + '</div>'
      + '</div></section>';

    if (state.tab === 'history') {
      html += '<section class="section">'
        + '<div class="section-head"><h2>کارنامه‌ها و سوابق آزمون‌ها</h2>'
        + '<button type="button" class="link-btn" data-action="refresh">' + ICONS.refresh + ' بروزرسانی</button></div>';
      if (history.length === 0) {
        html += '<div class="empty-state">' + ICONS.empty + '<h3>هنوز نتیجه‌ای ثبت نشده است</h3>'
          + '<p>پس از شرکت در اولین آزمون، کارنامه و درصد نمره شما در این بخش قرار می‌گیرد.</p></div>';
      } else {
        html += '<div class="history-list">';
        for (var i = 0; i < history.length; i++) {
          html += historyCard(history[i]);
        }
        html += '</div>';
      }
      html += '</section>';
    } else {
      if (active.length > 0) {
        html += '<section class="section">'
          + '<div class="section-head"><h2>آزمون‌های در حال انجام</h2><span class="count-badge">'
          + esc(fa(active.length)) + ' مورد</span></div><div class="active-list">';
        for (var a = 0; a < active.length; a++) {
          html += activeCard(active[a]);
        }
        html += '</div></section>';
      }

      html += '<section class="section">'
        + '<div class="section-head"><h2>آزمون‌های فعال و در دسترس</h2>'
        + '<button type="button" class="link-btn" data-action="refresh">' + ICONS.refresh + ' بروزرسانی</button></div>';

      if (quizzes.length > 2 || state.searchQuery) {
        html += '<div class="search-box">'
          + '<span class="search-icon">' + ICONS.search + '</span>'
          + '<input type="text" id="quizSearch" class="search-input" placeholder="جستجو بر اساس عنوان یا موضوع آزمون..." value="' + esc(state.searchQuery || '') + '">'
          + '</div>';
      }

      var qterm = (state.searchQuery || '').trim().toLowerCase();
      var filtered = [];
      for (var f = 0; f < quizzes.length; f++) {
        if (!qterm) {
          filtered.push(quizzes[f]);
        } else {
          var t = (quizzes[f].title || '').toLowerCase();
          var d = (quizzes[f].description || '').toLowerCase();
          if (t.indexOf(qterm) !== -1 || d.indexOf(qterm) !== -1) {
            filtered.push(quizzes[f]);
          }
        }
      }

      if (filtered.length === 0) {
        html += '<div class="empty-state">' + ICONS.empty + '<h3>آزمونی یافت نشد</h3>'
          + '<p>' + (qterm ? 'موردی منطبق با عبارت جستجوی شما پیدا نشد.' : 'در حال حاضر آزمون فعالی برای این دوره ثبت نشده است.') + '</p></div>';
      } else {
        html += '<div class="quiz-grid">';
        for (var q = 0; q < filtered.length; q++) {
          html += quizCard(filtered[q]);
        }
        html += '</div>';
      }
      html += '</section>';
    }

    state.screen = 'home';
    view.innerHTML = html;
    syncChrome();
  }

  function renderEntry(quiz) {
    state.screen = 'entry';
    var hasCode = !!quiz.has_code;
    var stCode = (state.student && state.student.code) ? state.student.code : '';
    var stName = (state.student && state.student.first_name) ? (state.student.first_name + ' ' + (state.student.last_name || '')) : '';
    var meta = '<span class="meta-pill">' + ICONS.book + esc(fa(quiz.question_count)) + ' سوال</span>'
      + '<span class="meta-pill">' + ICONS.clock
      + (Number(quiz.time_limit) > 0 ? esc(faDur(quiz.time_limit)) : 'بدون محدودیت') + '</span>'
      + (hasCode ? '<span class="meta-pill locked">' + ICONS.lock + ' نیازمند کد ورود</span>' : '');

    var studentFieldHtml = '';
    if (stCode) {
      studentFieldHtml = '<label class="field"><span>کد دانش‌آموزی احراز شده</span>'
        + '<input type="text" name="student_code" dir="ltr" inputmode="text" autocomplete="off" spellcheck="false" required value="' + esc(stCode) + '" readonly style="background:var(--surface-2);font-weight:700;color:var(--brand);">'
        + '<small>ورود تایید شده به نام <b>' + esc(stName || stCode) + '</b></small></label>';
    } else {
      studentFieldHtml = '<label class="field"><span>کد دانش‌آموزی</span>'
        + '<input type="text" name="student_code" dir="ltr" inputmode="text" autocomplete="off" spellcheck="false" required placeholder="مثلاً ST92K">'
        + '<small>کدی که برگزارکننده برای شما ایجاد کرده است.</small></label>';
    }

    view.innerHTML = '<div class="screen-head">'
      + '<button type="button" class="back-btn" data-action="back-home">' + ICONS.arrowRight + ' بازگشت به داشبورد</button>'
      + '</div>'
      + '<section class="card entry-card">'
      + '<p class="eyebrow">آماده‌سازی آزمون</p>'
      + '<h1>' + esc(quiz.title) + '</h1>'
      + (quiz.description ? '<p class="entry-desc">' + esc(quiz.description) + '</p>' : '')
      + '<div class="entry-meta">' + meta + '</div>'
      + '<form id="entryForm" novalidate>'
      + '<div class="form-grid">'
      + (hasCode ? ('<label class="field"><span>کد عبور اختصاصی این آزمون</span>'
        + '<input type="text" name="exam_code" dir="ltr" inputmode="text" autocomplete="off" spellcheck="false" required placeholder="مثلاً EXAM99" autofocus>'
        + '<small>کد ورود به این آزمون را از معلم یا مدرسه دریافت کنید.</small></label>') : '')
      + studentFieldHtml
      + '</div>'
      + '<p class="form-error" id="entryError" role="alert"></p>'
      + '<button type="submit" class="btn primary block entry-submit">' + ICONS.play + ' شروع آزمون</button>'
      + '</form></section>';
    window.scrollTo(0, 0);
    syncChrome();
  }

  function showEntryError(message) {
    var el = document.getElementById('entryError');
    if (!el) {
      toast(message, 'err');
      return;
    }
    el.textContent = String(message || '');
    el.classList.add('show');
  }

  function renderExam() {
    if (!state.exam) {
      return;
    }
    var exam = state.exam;
    var question = exam.question;
    var options = question.options || [];
    var answered = {};
    for (var i = 0; i < (exam.answered_ids || []).length; i++) {
      answered[String(exam.answered_ids[i])] = true;
    }
    var progress = exam.total > 0 ? Math.round(((exam.index + 1) / exam.total) * 100) : 0;

    var optionsHtml = '';
    for (var o = 0; o < options.length; o++) {
      var option = options[o];
      var cls = 'option';
      if (option.selected) {
        cls += ' selected';
      }
      if (question.revealed) {
        if (option.correct) {
          cls += ' correct';
        } else if (option.wrong) {
          cls += ' wrong';
        }
      }
      var mark = '';
      if (question.revealed && option.correct) {
        mark = '<span class="option-mark">' + ICONS.check + '</span>';
      } else if (question.revealed && option.wrong) {
        mark = '<span class="option-mark">' + ICONS.close + '</span>';
      }
      optionsHtml += '<button type="button" class="' + cls + '" data-action="answer" data-question-id="'
        + Number(question.id) + '" data-option="' + esc(option.key) + '" aria-pressed="'
        + (option.selected ? 'true' : 'false') + '">'
        + '<span class="option-radio"><span class="radio-dot"></span></span>'
        + '<span class="option-label">' + esc(option.label) + '</span>'
        + '<span class="option-text">' + esc(option.text) + '</span>'
        + mark + '</button>';
    }

    var note = '';
    if (question.revealed) {
      if (question.selected === question.correct) {
        note = '<div class="answer-note good">' + ICONS.check + '<span>پاسخ صحیح بود.</span></div>';
      } else {
        note = '<div class="answer-note bad">' + ICONS.close + '<span>گزینه صحیح: '
          + esc(question.correct_label || question.correct) + '</span></div>';
      }
    }

    var palette = '';
    var ids = exam.question_ids || [];
    if (ids.length > 0) {
      for (var p = 0; p < ids.length; p++) {
        var pcls = 'palette-btn';
        if (answered[String(ids[p])]) {
          pcls += ' answered';
        }
        if (p === exam.index) {
          pcls += ' current';
        }
        palette += '<button type="button" class="' + pcls + '" data-action="nav" data-index="' + p
          + '" aria-label="سوال ' + esc(fa(p + 1)) + '">' + esc(fa(p + 1)) + '</button>';
      }
    } else {
      for (var n = 0; n < exam.total; n++) {
        palette += '<button type="button" class="palette-btn' + (n === exam.index ? ' current' : '')
          + '" data-action="nav" data-index="' + n + '" aria-label="سوال ' + esc(fa(n + 1)) + '">'
          + esc(fa(n + 1)) + '</button>';
      }
    }

    view.innerHTML = '<div class="exam-shell">'
      + '<header class="exam-top">'
      + '<div class="exam-top-info">'
      + '<h1 class="exam-title">' + esc(exam.quiz.title) + '</h1>'
      + '<p class="exam-student">' + esc(exam.student.name) + (exam.student.code ? ' · کد: ' + esc(exam.student.code) : '') + '</p>'
      + '</div>'
      + '<div class="exam-top-actions">'
      + '<div class="timer-pill" id="timerPill">' + ICONS.clock + '<span>—</span></div>'
      + '<button type="button" class="btn-leave" data-action="leave-exam" title="خروج از آزمون">' + ICONS.arrowRight + ' خروج</button>'
      + '</div>'
      + '</header>'
      + '<div class="exam-progress-bar"><div class="exam-progress-fill" id="examProgress"></div></div>'
      + '<div class="exam-content-grid">'
      + '<section class="card question-card">'
      + '<div class="q-header">'
      + '<span class="q-index-badge">سوال ' + esc(fa(exam.index + 1)) + ' از ' + esc(fa(exam.total)) + '</span>'
      + '</div>'
      + '<div class="q-text">' + esc(question.text) + '</div>'
      + '<div class="options">' + optionsHtml + '</div>'
      + note
      + '</section>'
      + '<aside class="card palette-card">'
      + '<div class="palette-head"><span>پاسخ‌نامه سوالات</span><b>' + esc(fa(exam.answered_count)) + ' از ' + esc(fa(exam.total)) + '</b></div>'
      + '<div class="palette">' + palette + '</div>'
      + '</aside>'
      + '</div>'
      + '</div>'
      + '<div class="exam-actions"><div class="exam-actions-inner">'
      + '<button type="button" class="btn ghost nav-btn" data-action="nav" data-index="' + (exam.index - 1)
      + '"' + (exam.can_prev ? '' : ' disabled') + '>' + ICONS.arrowRight + ' سوال قبل</button>'
      + '<button type="button" class="btn danger-outline finish-btn" data-action="finish">ثبت و پایان آزمون</button>'
      + '<button type="button" class="btn primary nav-btn" data-action="nav" data-index="' + (exam.index + 1)
      + '"' + (exam.can_next ? '' : ' disabled') + '>سوال بعد ' + ICONS.arrowLeft + '</button>'
      + '</div></div>';

    var bar = document.getElementById('examProgress');
    if (bar) {
      bar.style.width = progress + '%';
    }
    updateTimerDisplay();
    window.scrollTo(0, 0);
    syncChrome();
  }

  function badSelect(selected) {
    if (!selected) {
      return '<div class="comparison-box empty"><span>پاسخ شما:</span><strong>بدون پاسخ</strong></div>';
    }
    return '<div class="comparison-box wrong"><span>پاسخ انتخابی شما:</span><strong>'
      + esc(selected.label) + ') ' + esc(selected.text) + '</strong></div>';
  }

  function renderResult(result) {
    stopTimer();
    state.result = result;
    state.exam = null;
    state.screen = 'result';
    state.finishing = false;
    state.busy = false;

    var pct = Number(result.percent) || 0;
    var statusText = pct >= 80 ? 'بسیار عالی' : (pct >= 50 ? 'پذیرفته شده' : 'نیاز به تلاش مجدد');
    var statusClass = pct >= 80 ? 'good' : (pct >= 50 ? 'warn' : 'bad');
    var title = result.finish_reason === 'timeout' ? 'زمان آزمون به پایان رسید' : 'آزمون به اتمام رسید';
    if (result.finish_reason === 'admin') {
      title = 'آزمون توسط مدیر بسته شد';
    }

    var html = '<section class="card transcript-card">'
      + '<div class="transcript-head">'
      + '<div class="transcript-info">'
      + '<span class="status-badge ' + statusClass + '">' + statusText + '</span>'
      + '<h1>' + esc(result.quiz.title) + '</h1>'
      + '<p class="transcript-sub">داوطلب: <strong>' + esc(result.student.name) + '</strong>'
      + (result.student.code ? ' · کد داوطلب: <code>' + esc(result.student.code) + '</code>' : '') + '</p>'
      + '</div>'
      + '<div class="transcript-score-box ' + statusClass + '">'
      + '<span class="score-percent">' + esc(fa(pct)) + '٪</span>'
      + '<span class="score-label">درصد نمره</span>'
      + '</div>'
      + '</div>'
      + '<div class="transcript-metrics">'
      + '<div class="metric-cell"><span class="val green">' + esc(fa(result.score)) + '</span><span class="lbl">پاسخ‌های درست</span></div>'
      + '<div class="metric-cell"><span class="val red">' + esc(fa(result.total - result.score)) + '</span><span class="lbl">پاسخ‌های نادرست</span></div>'
      + '<div class="metric-cell"><span class="val">' + esc(fa(result.total)) + '</span><span class="lbl">کل سوالات</span></div>'
      + '<div class="metric-cell"><span class="val">' + esc(faDur(result.spent)) + '</span><span class="lbl">زمان صرف‌شده</span></div>'
      + '</div></section>';

    if (result.show_details) {
      var wrong = result.wrong || [];
      if (wrong.length === 0) {
        html += '<section class="section"><div class="empty-state success">' + ICONS.check
          + '<h3>پاسخ‌نامه کامل و بدون خطا!</h3><p>شما به تمامی سوالات این آزمون پاسخ صحیح داده‌اید.</p></div></section>';
      } else {
        html += '<section class="section">'
          + '<div class="section-head"><h2>مرور سوالات و پاسخ‌های تشریحی</h2><span class="count-badge">'
          + esc(fa(wrong.length)) + ' پاسخ نادرست</span></div>';
        for (var i = 0; i < wrong.length; i++) {
          var item = wrong[i];
          html += '<article class="card review-item">'
            + '<div class="review-head"><span class="review-num">' + esc(fa(item.n)) + '</span>'
            + '<p class="review-q">' + esc(item.question) + '</p></div>'
            + '<div class="review-comparison">'
            + badSelect(item.selected)
            + '<div class="comparison-box correct"><span>پاسخ صحیح گزینه:</span><strong>'
            + esc(item.correct.label) + ') ' + esc(item.correct.text) + '</strong></div>'
            + '</div></article>';
        }
        html += '</section>';
      }
    }

    html += '<div class="transcript-actions">'
      + '<button type="button" class="btn primary" data-action="back-home">' + ICONS.home + ' بازگشت به داشبورد</button>'
      + '<button type="button" class="btn ghost" data-action="print-result">🖨️ چاپ کارنامه رسمی / ذخیره PDF</button>'
      + '<button type="button" class="btn ghost" data-action="go-history">' + ICONS.chart + ' سوابق نمرات</button>'
      + '</div>';

    view.innerHTML = html;
    haptic('medium');
    window.scrollTo(0, 0);
    syncChrome();
  }

  function handleExamPayload(data) {
    if (!data) {
      return;
    }
    if (data.finished) {
      renderResult(data.result);
      return;
    }
    if (state.screen !== 'exam' && state.screen !== 'loading') {
      return;
    }
    state.exam = data.exam;
    state.screen = 'exam';
    renderExam();
    startTimer();
  }

  function loadExam(attemptId) {
    renderLoading('در حال آماده‌سازی آزمون…');
    api('state', { attempt_id: attemptId }).then(function (data) {
      handleExamPayload(data);
    }).catch(function (error) {
      toast(error.message, 'err');
      goHome();
    });
  }

  function openResult(attemptId) {
    renderLoading('در حال دریافت نتیجه…');
    api('result', { attempt_id: attemptId }).then(function (result) {
      renderResult(result);
    }).catch(function (error) {
      toast(error.message, 'err');
      goHome();
    });
  }

  function openEntry(quizId) {
    var quiz = null;
    var list = state.home && state.home.quizzes ? state.home.quizzes : [];
    for (var i = 0; i < list.length; i++) {
      if (Number(list[i].id) === Number(quizId)) {
        quiz = list[i];
        break;
      }
    }
    if (!quiz) {
      toast('این آزمون در دسترس نیست.', 'err');
      return;
    }
    if (Number(quiz.attempt_id) > 0) {
      loadExam(Number(quiz.attempt_id));
      return;
    }
    state.entryQuiz = quiz;
    state.finishing = false;
    renderEntry(quiz);
  }

  function submitEntry(form) {
    if (state.busy || !state.entryQuiz) {
      return;
    }
    var quiz = state.entryQuiz;
    var examCode = normalizeCode(form.elements.exam_code ? form.elements.exam_code.value : '');
    var studentCode = normalizeCode(form.elements.student_code ? form.elements.student_code.value : '');
    var errorEl = document.getElementById('entryError');
    if (errorEl) {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }
    if (quiz.has_code && examCode === '') {
      showEntryError('کد آزمون را وارد کن.');
      return;
    }
    if (studentCode === '') {
      showEntryError('کد دانش‌آموزی را وارد کن.');
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    state.busy = true;
    if (button) {
      button.disabled = true;
      button.innerHTML = ICONS.clock + ' در حال شروع…';
    }

    api('enter', {
      quiz_id: quiz.id,
      exam_code: examCode,
      student_code: studentCode
    }).then(function (data) {
      if (data.finished) {
        return api('result', { attempt_id: data.attempt_id }).then(function (result) {
          renderResult(result);
        });
      }
      loadExam(data.attempt_id);
      return null;
    }).catch(function (error) {
      showEntryError(error.message);
      toast(error.message, 'err');
      if (button && form.isConnected) {
        button.disabled = false;
        button.innerHTML = ICONS.play + ' شروع آزمون';
      }
    }).then(function () {
      state.busy = false;
    });
  }

  function answerQuestion(questionId, option) {
    if (state.busy || !state.exam) {
      return;
    }
    state.busy = true;
    api('answer', {
      attempt_id: state.exam.attempt_id,
      question_id: questionId,
      option: option
    }).then(function (data) {
      haptic('light');
      handleExamPayload(data);
    }).catch(function (error) {
      toast(error.message, 'err');
    }).then(function () {
      state.busy = false;
    });
  }

  function navigateExam(index) {
    if (state.busy || !state.exam) {
      return;
    }
    var target = Number(index);
    if (isNaN(target) || target < 0 || target >= state.exam.total || target === state.exam.index) {
      return;
    }
    state.busy = true;
    api('navigate', {
      attempt_id: state.exam.attempt_id,
      index: target
    }).then(function (data) {
      handleExamPayload(data);
    }).catch(function (error) {
      toast(error.message, 'err');
    }).then(function () {
      state.busy = false;
    });
  }

  function finishExam() {
    if (state.busy || state.finishing || !state.exam) {
      return;
    }
    var attemptId = state.exam.attempt_id;
    state.busy = true;
    state.finishing = true;
    api('finish', { attempt_id: attemptId }).then(function (data) {
      handleExamPayload(data);
    }).catch(function (error) {
      state.finishing = false;
      state.busy = false;
      toast(error.message, 'err');
    });
  }

  function autoFinish() {
    if (!state.exam || state.finishing) {
      return;
    }
    state.finishing = true;
    state.busy = true;
    api('finish', { attempt_id: state.exam.attempt_id }).then(function (data) {
      handleExamPayload(data);
      state.busy = false;
    }).catch(function () {
      state.busy = false;
      state.finishing = false;
      goHome();
    });
  }

  function confirmFinish() {
    if (!state.exam) {
      return;
    }
    var message = 'آزمون را تمام می‌کنی؟ سوالات بی‌پاسخ غلط حساب می‌شوند.';
    if (tg && tg.showConfirm) {
      tg.showConfirm(message, function (confirmed) {
        if (confirmed) {
          finishExam();
        }
      });
      return;
    }
    if (window.confirm(message)) {
      finishExam();
    }
  }

  function askLeaveExam() {
    var message = 'آزمون در جریان است. بدون پایان دادن به آن خارج می‌شوی؟';
    function leave() {
      state.busy = false;
      goHome();
    }
    if (tg && tg.showConfirm) {
      tg.showConfirm(message, function (confirmed) {
        if (confirmed) {
          leave();
        }
      });
      return;
    }
    if (window.confirm(message)) {
      leave();
    }
  }

  function goHome() {
    stopTimer();
    state.exam = null;
    state.result = null;
    state.entryQuiz = null;
    state.finishing = false;
    state.busy = false;
    state.screen = 'home';
    if (state.home) {
      renderHome();
    } else {
      renderLoading('در حال بارگذاری…');
    }
    api('home').then(function (data) {
      state.home = data;
      state.screen = 'home';
      renderHome();
    }).catch(function (error) {
      if (!state.home) {
        renderError(error);
      } else {
        toast(error.message, 'err');
      }
    });
  }

  function loadHome() {
    renderLoading('در حال بارگذاری…');
    api('home').then(function (data) {
      state.home = data;
      state.screen = 'home';
      renderHome();
    }).catch(function (error) {
      renderError(error);
    });
  }

  function refreshHome() {
    if (state.screen !== 'home') {
      return;
    }
    api('home').then(function (data) {
      state.home = data;
      renderHome();
    }).catch(function (error) {
      toast(error.message, 'err');
    });
  }

  function handleBack() {
    if (state.screen === 'home' || state.screen === 'outside') {
      return;
    }
    if (state.screen === 'exam') {
      askLeaveExam();
      return;
    }
    goHome();
  }

  function bindEvents() {
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark', true);
        haptic('light');
      });
    }

    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        api('logout').then(function () {
          state.student = null;
          if (state.config) {
            state.config.logged_in = false;
          }
          toast('با موفقیت خارج شدید.', 'info');
          renderAuth();
        });
      });
    }

    if (bottomNav) {
      bottomNav.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('[data-tab]') : null;
        if (!button) {
          return;
        }
        state.tab = button.getAttribute('data-tab') === 'history' ? 'history' : 'exams';
        if (state.screen === 'home') {
          renderHome();
        } else {
          goHome();
        }
      });
    }

    if (view) {
      view.addEventListener('click', function (event) {
        var target = event.target.closest ? event.target.closest('[data-action]') : null;
        if (!target) {
          return;
        }
        if (target.hasAttribute('disabled')) {
          return;
        }
        var action = target.getAttribute('data-action');
        if (action === 'reload') {
          loadHome();
        } else if (action === 'refresh') {
          refreshHome();
        } else if (action === 'start') {
          openEntry(Number(target.getAttribute('data-quiz-id')));
        } else if (action === 'resume') {
          loadExam(Number(target.getAttribute('data-attempt-id')));
        } else if (action === 'open-result') {
          openResult(Number(target.getAttribute('data-attempt-id')));
        } else if (action === 'print-result') {
          window.print();
        } else if (action === 'back-home') {
          goHome();
        } else if (action === 'go-history') {
          state.tab = 'history';
          goHome();
        } else if (action === 'answer') {
          answerQuestion(Number(target.getAttribute('data-question-id')), target.getAttribute('data-option'));
        } else if (action === 'nav') {
          navigateExam(Number(target.getAttribute('data-index')));
        } else if (action === 'finish') {
          confirmFinish();
        } else if (action === 'leave-exam') {
          askLeaveExam();
        } else if (action === 'change-phone') {
          state.otpStep = 1;
          renderAuth();
        } else if (action === 'logout') {
          api('logout').then(function () {
            state.student = null;
            if (state.config) {
              state.config.logged_in = false;
            }
            toast('با موفقیت خارج شدید.', 'info');
            renderAuth();
          });
        } else if (action === 'copy-code') {
          var codeToCopy = target.getAttribute('data-code');
          if (codeToCopy) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(codeToCopy).then(function () {
                toast('کد دانش‌آموزی با موفقیت کپی شد: ' + codeToCopy, 'ok');
              }).catch(function () {
                toast('کد دانش‌آموزی: ' + codeToCopy, 'info');
              });
            } else {
              toast('کد دانش‌آموزی: ' + codeToCopy, 'info');
            }
          }
        }
      });

      view.addEventListener('input', function (event) {
        if (event.target && event.target.id === 'quizSearch') {
          state.searchQuery = event.target.value;
          var quizzes = (state.home && state.home.quizzes) ? state.home.quizzes : [];
          var qterm = state.searchQuery.trim().toLowerCase();
          var filtered = [];
          for (var i = 0; i < quizzes.length; i++) {
            if (!qterm) {
              filtered.push(quizzes[i]);
            } else {
              var t = (quizzes[i].title || '').toLowerCase();
              var d = (quizzes[i].description || '').toLowerCase();
              if (t.indexOf(qterm) !== -1 || d.indexOf(qterm) !== -1) {
                filtered.push(quizzes[i]);
              }
            }
          }
          var grid = view.querySelector('.quiz-grid');
          if (grid) {
            if (filtered.length === 0) {
              grid.innerHTML = '<div class="empty" style="grid-column: 1/-1;">' + ICONS.empty + '<h3>آزمونی یافت نشد</h3><p>هیچ آزمونی با عبارت جستجو پیدا نشد.</p></div>';
            } else {
              var qhtml = '';
              for (var q = 0; q < filtered.length; q++) {
                qhtml += quizCard(filtered[q]);
              }
              grid.innerHTML = qhtml;
            }
          }
        }
      });

      view.addEventListener('click', function (event) {
        var tabBtn = event.target.closest ? event.target.closest('[data-auth-tab]') : null;
        if (tabBtn) {
          state.authTab = tabBtn.getAttribute('data-auth-tab');
          renderAuth();
        }
      });

      view.addEventListener('submit', function (event) {
        if (!event.target) return;
        if (event.target.id === 'entryForm') {
          event.preventDefault();
          submitEntry(event.target);
        } else if (event.target.id === 'codeAuthForm') {
          event.preventDefault();
          var codeInput = event.target.querySelector('[name="student_code"]');
          var codeVal = codeInput ? codeInput.value.trim() : '';
          if (!codeVal) return;
          renderLoading('در حال بررسی کد...');
          api('student_login', { code: codeVal }).then(function (res) {
            state.student = res.student;
            toast('خوش آمدید ' + (res.student.first_name || ''), 'ok');
            loadHome();
          }).catch(function (err) {
            toast(err.message || 'کد دانش‌آموزی نامعتبر است.', 'err');
            renderAuth();
          });
        } else if (event.target.id === 'otpPhoneForm') {
          event.preventDefault();
          var phoneInput = event.target.querySelector('[name="phone"]');
          var phoneVal = phoneInput ? phoneInput.value.trim() : '';
          if (!phoneVal) return;
          state.otpPhone = phoneVal;
          renderLoading('در حال ارسال پیامک...');
          api('send_otp', { phone: phoneVal }).then(function (res) {
            state.otpStep = 2;
            toast('کد تایید ارسال شد.', 'ok');
            renderAuth();
          }).catch(function (err) {
            toast(err.message || 'خطا در ارسال پیامک.', 'err');
            renderAuth();
          });
        } else if (event.target.id === 'otpVerifyForm') {
          event.preventDefault();
          var form = event.target;
          var otpCode = form.querySelector('[name="otp_code"]').value.trim();
          var first = form.querySelector('[name="first_name"]').value.trim();
          var last = form.querySelector('[name="last_name"]').value.trim();
          var cls = form.querySelector('[name="class_name"]') ? form.querySelector('[name="class_name"]').value.trim() : '';
          renderLoading('در حال تایید و ثبت‌نام...');
          api('verify_otp', {
            phone: state.otpPhone,
            code: otpCode,
            first_name: first,
            last_name: last,
            class_name: cls
          }).then(function (res) {
            state.student = res.student;
            toast('ثبت‌نام با موفقیت انجام شد. کد شما: ' + res.student.code, 'ok');
            loadHome();
          }).catch(function (err) {
            toast(err.message || 'کد تایید نامعتبر است.', 'err');
            renderAuth();
          });
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 6);
      }
    }, { passive: true });

    window.addEventListener('beforeunload', function (event) {
      if (state.screen === 'exam') {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    });

    window.addEventListener('keydown', function (event) {
      if (state.screen !== 'exam' || !state.exam) return;
      var tag = event.target ? event.target.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      var key = event.key;
      if (key >= '1' && key <= '4') {
        var optIndex = parseInt(key, 10) - 1;
        var options = view.querySelectorAll('.options .option');
        if (options && options[optIndex]) {
          options[optIndex].click();
        }
      } else if (key === 'ArrowLeft') {
        if (state.exam.can_next) {
          navigateExam(state.exam.index + 1);
        }
      } else if (key === 'ArrowRight') {
        if (state.exam.can_prev) {
          navigateExam(state.exam.index - 1);
        }
      }
    });
  }

  function initTelegram() {
    if (!tg) {
      return false;
    }
    try {
      tg.ready();
      tg.expand();
    } catch (e) {}
    try {
      if (tg.BackButton && tg.BackButton.onClick) {
        tg.BackButton.onClick(handleBack);
      }
    } catch (e) {}
    try {
      if (tg.onEvent) {
        tg.onEvent('themeChanged', function () {
          if (!storedTheme()) {
            setTheme(tg.colorScheme === 'dark' ? 'dark' : 'light', false);
          }
        });
      }
    } catch (e) {}
    return true;
  }

  function boot() {
    var theme = storedTheme();
    if (!theme) {
      theme = tg && tg.colorScheme === 'dark' ? 'dark' : 'light';
    }
    setTheme(theme, false);
    bindEvents();
    initTelegram();

    renderLoading('در حال بررسی نشست...');
    api('config').then(function (cfg) {
      state.config = cfg;
      if (cfg.student) {
        state.student = cfg.student;
      }
      if (cfg.logged_in) {
        loadHome();
      } else {
        renderAuth();
      }
    }).catch(function (err) {
      if (tg && tg.initData) {
        loadHome();
      } else {
        renderAuth();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
