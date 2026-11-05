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

    var html = '<div class="auth-container">';

    // Showcase Section on Desktop
    html += '<div class="auth-showcase">';
    html += '<span class="showcase-pill"><span class="pulse-dot"></span> سامانه هوشمند آزمون آنلاین</span>';
    html += '<h2 class="showcase-title">سنجش دقیق و سریع با کارنامه تحلیلی هوشمند</h2>';
    html += '<p class="showcase-desc">محیطی مدرن و بدون استرس برای برگزاری آزمون‌های تستی. بدون نیاز به فرآیندهای پیچیده ثبت‌نام، تنها با داشتن کد اختصاصی وارد شوید.</p>';

    html += '<div class="showcase-cards">';
    html += '<div class="showcase-card">';
    html += '<div class="showcase-card-icon">⚡️</div>';
    html += '<div class="showcase-card-info"><h4>کارنامه و نتیجه آنی</h4><p>محاسبه نمره، درصد و وضعیت پاسخ‌ها بلافاصله پس از اتمام آزمون</p></div>';
    html += '</div>';

    html += '<div class="showcase-card">';
    html += '<div class="showcase-card-icon">⏱️</div>';
    html += '<div class="showcase-card-info"><h4>تایمر زنده و خودکار</h4><p>ذخیره‌سازی هوشمند پاسخ‌ها در سرور و حفظ امنیت زمان آزمون</p></div>';
    html += '</div>';

    html += '<div class="showcase-card">';
    html += '<div class="showcase-card-icon">🎯</div>';
    html += '<div class="showcase-card-info"><h4>مرور سوالات و پاسخ‌ها</h4><p>بررسی پاسخ درست گزینه‌ها جهت رفع اشکال و یادگیری بهتر</p></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Auth Card
    html += '<section class="auth-card">';
    html += '<div class="auth-header">';
    html += '<div class="auth-icon">';
    html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>';
    html += '</div>';
    html += '<h1 class="auth-title">ورود به آزمون</h1>';
    html += '<p class="auth-subtitle">جهت ورود و مشاهده آزمون‌ها مشخصات خود را وارد کنید</p>';
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
      html += '<span>کد دانش‌آموزی اختصاصی</span>';
      html += '<input type="text" name="student_code" class="auth-input-code" placeholder="مثلاً: AB12" required autocomplete="off" autofocus maxlength="16">';
      html += '</div>';
      html += '<div class="auth-hint">' + ICONS.info + '<span>کد دانش‌آموزی اختصاصی دریافتی از معلم، مدرسه یا برگزارکننده را وارد کنید.</span></div>';
      html += '<button type="submit" class="btn primary block auth-submit-btn">ورود به پرتال آزمون ' + ICONS.arrowLeft + '</button>';
      html += '</form>';
    } else {
      // OTP Registration / Login
      if (state.otpStep === 1) {
        html += '<form id="otpPhoneForm" class="form-grid">';
        html += '<div class="field">';
        html += '<span>شماره موبایل دانش‌آموز</span>';
        html += '<input type="tel" name="phone" class="auth-input-phone" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value="' + esc(state.otpPhone) + '" required autofocus>';
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
        html += '<span>کد تایید پیامک‌شده</span>';
        html += '<input type="number" name="otp_code" class="auth-input-otp" placeholder="۱۲۳۴۵" required autofocus maxlength="5">';
        html += '</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
        html += '<div class="field"><span>نام</span><input type="text" name="first_name" placeholder="نام" required></div>';
        html += '<div class="field"><span>نام خانوادگی</span><input type="text" name="last_name" placeholder="نام خانوادگی" required></div>';
        html += '</div>';
        html += '<div class="field">';
        html += '<span>پایه / کلاس / رشته <small class="optional">(اختیاری)</small></span>';
        html += '<input type="text" name="class_name" placeholder="مثلاً: دوازدهم تجربی">';
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
    var meta = '<span class="meta-pill">' + ICONS.book + esc(fa(quiz.question_count)) + ' سوال</span>';
    meta += '<span class="meta-pill">' + ICONS.clock + (Number(quiz.time_limit) > 0
      ? esc(faDur(quiz.time_limit))
      : 'بدون محدودیت') + '</span>';
    if (quiz.has_code) {
      meta += '<span class="meta-pill locked">' + ICONS.lock + ' کد ورود دارد</span>';
    }
    var button = active
      ? '<button type="button" class="btn soft" data-action="resume" data-attempt-id="' + Number(quiz.attempt_id) + '">' + ICONS.play + ' ادامه آزمون</button>'
      : '<button type="button" class="btn primary" data-action="start" data-quiz-id="' + Number(quiz.id) + '">' + ICONS.play + ' شرکت در آزمون</button>';
    var hint = active
      ? '<span class="hint">در حال انجام</span>'
      : '<span class="hint">کد دانش‌آموزی لازم است</span>';
    return '<article class="card quiz-card">'
      + '<div class="quiz-top">'
      + '<span class="quiz-icon">' + ICONS.book + '</span>'
      + '<div class="quiz-main"><h3>' + esc(quiz.title) + '</h3>'
      + (quiz.description ? '<p class="quiz-desc">' + esc(quiz.description) + '</p>' : '')
      + '</div></div>'
      + '<div class="quiz-meta">' + meta + '</div>'
      + '<div class="quiz-foot">' + hint + button + '</div>'
      + '</article>';
  }

  function activeCard(attempt) {
    var countdown = attempt.remaining === null || attempt.remaining === undefined
      ? 'بدون محدودیت'
      : faDur(attempt.remaining) + ' باقی‌مانده';
    return '<article class="card active-card">'
      + '<div class="active-top">'
      + '<span class="pulse-dot" aria-hidden="true"></span>'
      + '<div class="quiz-main"><h3>' + esc(attempt.title) + '</h3>'
      + '<p class="active-meta">' + esc(attempt.student_name || '') + ' · سوال '
      + esc(fa(Number(attempt.current_index) + 1)) + ' از ' + esc(fa(attempt.total)) + '</p>'
      + '</div></div>'
      + '<div class="active-foot">'
      + '<span class="countdown-pill">' + ICONS.clock + esc(countdown) + '</span>'
      + '<button type="button" class="btn primary small" data-action="resume" data-attempt-id="'
      + Number(attempt.attempt_id) + '">' + ICONS.play + ' ادامه</button>'
      + '</div>'
      + '</article>';
  }

  function historyCard(item) {
    var pct = Number(item.percent) || 0;
    var cls = pct >= 80 ? '' : (pct >= 50 ? ' warn' : ' bad');
    var date = formatDate(item.finished_at);
    return '<button type="button" class="card history-card" data-action="open-result" data-attempt-id="'
      + Number(item.attempt_id) + '">'
      + '<span class="score-badge' + cls + '">' + esc(fa(pct)) + '٪</span>'
      + '<span class="history-main"><h3>' + esc(item.title) + '</h3>'
      + '<p class="history-sub"><span>' + esc(fa(item.score)) + ' از ' + esc(fa(item.total)) + '</span>'
      + (date ? '<span>' + esc(date) + '</span>' : '')
      + '</p></span>'
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

    var html = '<section class="hero-modern">'
      + '<div class="hero-top-row">'
      + '<div class="hero-greeting">'
      + '<h1>سلام، ' + esc(name) + ' 👋</h1>'
      + '<p>به پرتال آزمون خوش آمدید. آزمون‌ها و کارنامه‌های شما در یک نگاه آماده است.</p>'
      + '</div>';
    if (code) {
      html += '<div class="student-tag" title="کپی کد دانش‌آموزی" data-action="copy-code" data-code="' + esc(code) + '" style="cursor:pointer;">'
        + '<span>کد شما: <b>' + esc(code) + '</b></span>'
        + '<button type="button" class="btn ghost small" style="padding:2px 8px;font-size:11px;min-height:24px;">کپی</button>'
        + '</div>';
    }
    html += '</div>'
      + '<div class="stat-row-modern">'
      + '<div class="stat-card-modern">'
      + '<div class="stat-icon-wrap" style="background:var(--brand-soft);color:var(--brand);">' + ICONS.book + '</div>'
      + '<div class="stat-data"><strong>' + esc(fa(quizzes.length)) + '</strong><span>آزمون فعال</span></div>'
      + '</div>'
      + '<div class="stat-card-modern">'
      + '<div class="stat-icon-wrap" style="background:var(--ok-soft);color:var(--ok);">' + ICONS.check + '</div>'
      + '<div class="stat-data"><strong>' + esc(fa(history.length)) + '</strong><span>تکمیل‌شده</span></div>'
      + '</div>'
      + '<div class="stat-card-modern">'
      + '<div class="stat-icon-wrap" style="background:var(--warn-soft);color:var(--warn);">' + ICONS.trophy + '</div>'
      + '<div class="stat-data"><strong>' + esc(fa(avg)) + '٪</strong><span>میانگین نمرات</span></div>'
      + '</div>'
      + '</div></section>';

    if (state.tab === 'history') {
      html += '<section class="section">'
        + '<div class="section-head"><h2>کارنامه‌ها و نتایج من</h2>'
        + '<button type="button" class="link-btn" data-action="refresh">' + ICONS.refresh + ' بروزرسانی</button></div>';
      if (history.length === 0) {
        html += '<div class="empty">' + ICONS.empty + '<h3>هنوز نتیجه‌ای ثبت نشده</h3>'
          + '<p>پس از شرکت در اولین آزمون، کارنامه تحلیلی در این بخش نمایش داده می‌شود.</p></div>';
      } else {
        html += '<div class="stack">';
        for (var i = 0; i < history.length; i++) {
          html += historyCard(history[i]);
        }
        html += '</div>';
      }
      html += '</section>';
    } else {
      if (active.length > 0) {
        html += '<section class="section">'
          + '<div class="section-head"><h2>آزمون در حال انجام</h2><span class="count">'
          + esc(fa(active.length)) + ' مورد</span></div><div class="stack">';
        for (var a = 0; a < active.length; a++) {
          html += activeCard(active[a]);
        }
        html += '</div></section>';
      }

      html += '<section class="section">'
        + '<div class="section-head"><h2>آزمون‌های در دسترس</h2>'
        + '<button type="button" class="link-btn" data-action="refresh">' + ICONS.refresh + ' بروزرسانی</button></div>';

      if (quizzes.length > 2 || state.searchQuery) {
        html += '<div class="search-wrap">'
          + '<input type="text" id="quizSearch" class="search-input" placeholder="جستجوی سریع در نام آزمون..." value="' + esc(state.searchQuery || '') + '">'
          + '<span class="search-icon">' + ICONS.search + '</span>'
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
        html += '<div class="empty">' + ICONS.empty + '<h3>آزمونی یافت نشد</h3>'
          + '<p>' + (qterm ? 'هیچ آزمونی با عبارت جستجوی شما تطابق ندارد.' : 'در حال حاضر آزمون جدیدی فعال نیست.') + '</p></div>';
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
        + '<span class="option-label">' + esc(option.label) + '</span>'
        + '<span class="option-text">' + esc(option.text) + '</span>'
        + mark + '</button>';
    }

    var note = '';
    if (question.revealed) {
      if (question.selected === question.correct) {
        note = '<div class="answer-note good">' + ICONS.check + '<span>پاسخ درست بود.</span></div>';
      } else {
        note = '<div class="answer-note bad">' + ICONS.close + '<span>پاسخ درست: '
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
      + '<button type="button" class="icon-btn" data-action="leave-exam" aria-label="خروج از آزمون">'
      + ICONS.arrowRight + '</button>'
      + '<div class="exam-top-main"><h1>' + esc(exam.quiz.title) + '</h1>'
      + '<p>' + esc(exam.student.name) + (exam.student.code ? ' · ' + esc(exam.student.code) : '') + '</p></div>'
      + '<div class="timer-pill" id="timerPill">' + ICONS.clock + '<span>—</span></div>'
      + '</header>'
      + '<section class="card progress-card">'
      + '<div class="progress-label"><span>سوال ' + esc(fa(exam.index + 1)) + ' از ' + esc(fa(exam.total))
      + '</span><b>' + esc(fa(exam.answered_count)) + ' پاسخ داده‌شده</b></div>'
      + '<div class="progress"><span id="examProgress"></span></div>'
      + '</section>'
      + '<section class="card question-card">'
      + '<span class="q-index">سوال ' + esc(fa(exam.index + 1)) + ' از ' + esc(fa(exam.total)) + '</span>'
      + '<p class="q-text">' + esc(question.text) + '</p>'
      + '<div class="options">' + optionsHtml + '</div>'
      + note
      + '</section>'
      + '<section class="card palette-card">'
      + '<div class="palette-head"><span>نمای کلی سوال‌ها</span><b>'
      + esc(fa(exam.answered_count)) + ' / ' + esc(fa(exam.total)) + '</b></div>'
      + '<div class="palette">' + palette + '</div>'
      + '</section>'
      + '</div>'
      + '<div class="exam-actions"><div class="exam-actions-inner">'
      + '<button type="button" class="btn nav-arrow" data-action="nav" data-index="' + (exam.index - 1)
      + '" aria-label="سوال قبلی"' + (exam.can_prev ? '' : ' disabled') + '>' + ICONS.arrowRight + '</button>'
      + '<button type="button" class="btn finish-btn" data-action="finish">پایان آزمون</button>'
      + '<button type="button" class="btn nav-arrow" data-action="nav" data-index="' + (exam.index + 1)
      + '" aria-label="سوال بعدی"' + (exam.can_next ? '' : ' disabled') + '>' + ICONS.arrowLeft + '</button>'
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
      return '<div class="answer-box empty"><span>پاسخ تو</span><strong>بدون پاسخ</strong></div>';
    }
    return '<div class="answer-box bad"><span>پاسخ تو</span><strong>'
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
    var ringClass = pct >= 80 ? 'good' : (pct >= 50 ? 'warn' : 'bad');
    var title = result.finish_reason === 'timeout' ? 'زمان آزمون تمام شد' : 'آزمون تمام شد';
    if (result.finish_reason === 'admin') {
      title = 'آزمون توسط ادمین بسته شد';
    }

    var html = '<section class="result-hero">'
      + '<p class="eyebrow">' + esc(title) + '</p>'
      + '<div class="score-ring ' + ringClass + '" id="scoreRing"><strong>' + esc(fa(pct)) + '٪</strong></div>'
      + '<h1>' + esc(result.quiz.title) + '</h1>'
      + '<p class="result-sub">' + esc(result.student.name)
      + (result.student.code ? ' · ' + esc(result.student.code) : '') + '</p>'
      + '<div class="result-stats">'
      + '<div class="result-stat"><strong>' + esc(fa(result.score)) + '</strong><span>پاسخ درست</span></div>'
      + '<div class="result-stat"><strong>' + esc(fa(result.total)) + '</strong><span>کل سوال</span></div>'
      + '<div class="result-stat"><strong>' + esc(faDur(result.spent)) + '</strong><span>زمان صرف‌شده</span></div>'
      + '</div></section>';

    if (result.show_details) {
      var wrong = result.wrong || [];
      if (wrong.length === 0) {
        html += '<section class="section"><div class="empty">' + ICONS.trophy
          + '<h3>عالی بود!</h3><p>همه پاسخ‌ها درست بود.</p></div></section>';
      } else {
        html += '<section class="section wrong-section">'
          + '<div class="section-head"><h2>مرور پاسخ‌های نادرست</h2><span class="count">'
          + esc(fa(wrong.length)) + ' مورد</span></div>';
        for (var i = 0; i < wrong.length; i++) {
          var item = wrong[i];
          html += '<article class="wrong-item">'
            + '<div class="wrong-head"><span class="wrong-num">' + esc(fa(item.n)) + '</span>'
            + '<p>' + esc(item.question) + '</p></div>'
            + '<div class="wrong-grid">'
            + badSelect(item.selected)
            + '<div class="answer-box good"><span>پاسخ درست</span><strong>'
            + esc(item.correct.label) + ') ' + esc(item.correct.text) + '</strong></div>'
            + '</div></article>';
        }
        html += '</section>';
      }
    }

    html += '<div class="result-actions">'
      + '<button type="button" class="btn primary block" data-action="back-home">' + ICONS.home + ' بازگشت به خانه</button>'
      + '<button type="button" class="btn ghost block" data-action="print-result">🖨️ چاپ کارنامه / ذخیره PDF</button>'
      + '<button type="button" class="btn ghost block" data-action="go-history">' + ICONS.chart + ' دیدن همه نتایج</button>'
      + '</div>';

    view.innerHTML = html;
    var ring = document.getElementById('scoreRing');
    if (ring) {
      ring.style.setProperty('--pct', String(Math.max(0, Math.min(100, pct))));
    }
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
