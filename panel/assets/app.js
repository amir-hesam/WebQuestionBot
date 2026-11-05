(function () {
  'use strict';

  var STORAGE_KEY = 'telebot-panel-theme';

  function storedTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if (document.body) {
      document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    }
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-label', theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک');
      buttons[i].innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  var saved = storedTheme();
  var current = saved || 'dark';

  if (document.documentElement) {
    if (current === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(current);

    document.addEventListener('click', function (event) {
      var toggle = event.target.closest ? event.target.closest('[data-theme-toggle]') : null;
      if (!toggle) {
        return;
      }
      event.preventDefault();
      current = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, current);
      } catch (e) {}
      applyTheme(current);
    });

    document.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('[data-copy-link]') : null;
      if (!btn) return;
      var url = window.location.origin + window.location.pathname.replace(/\/panel\/.*$/, '/');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var old = btn.textContent;
          btn.textContent = '✅ کپی شد!';
          setTimeout(function () { btn.textContent = old; }, 2000);
        });
      } else {
        window.prompt('آدرس پرتال آزمون برای ارسال به دانش‌آموزان:', url);
      }
    });

    document.addEventListener('input', function (event) {
      var searchInput = event.target.closest ? event.target.closest('[data-filter-table]') : null;
      if (!searchInput) return;
      var tableSelector = searchInput.getAttribute('data-filter-table');
      var table = document.querySelector(tableSelector);
      if (!table) return;
      var term = searchInput.value.trim().toLowerCase();
      var rows = table.querySelectorAll('tbody tr');
      for (var i = 0; i < rows.length; i++) {
        var text = rows[i].textContent.toLowerCase();
        rows[i].style.display = (term === '' || text.indexOf(term) !== -1) ? '' : 'none';
      }
    });
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') {
      return;
    }

    if (form.getAttribute('data-confirm')) {
      if (!window.confirm(form.getAttribute('data-confirm'))) {
        event.preventDefault();
        return;
      }
    }

    if (form.getAttribute('data-busy') === '1') {
      var buttons = form.querySelectorAll('button[type="submit"]');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (!buttons[i].getAttribute('data-label')) {
          buttons[i].setAttribute('data-label', buttons[i].textContent);
        }
        buttons[i].textContent = 'در حال ارسال...';
      }
    }
  });
})();
