// FixTok marketing site locale (he | en) — shared key with app.fix-tok.com
(function () {
  'use strict';

  var LOCALE_KEY = 'fixtok_locale';
  var DEFAULT_LOCALE = 'he';

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function writeCookie(value) {
    var maxAge = 60 * 60 * 24 * 365;
    document.cookie =
      LOCALE_KEY + '=' + encodeURIComponent(value) +
      '; path=/; max-age=' + maxAge + '; SameSite=Lax';
  }

  function getLocale() {
    try {
      var stored = readCookie(LOCALE_KEY) || localStorage.getItem(LOCALE_KEY);
      return stored === 'en' ? 'en' : DEFAULT_LOCALE;
    } catch (e) {
      return DEFAULT_LOCALE;
    }
  }

  function persistLocale(locale) {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch (e) { /* ignore */ }
    writeCookie(locale);
  }

  function applyDocumentLocale(locale) {
    var html = document.documentElement;
    html.lang = locale === 'en' ? 'en' : 'he';
    html.dir = locale === 'en' ? 'ltr' : 'rtl';
  }

  function t(key) {
    if (getLocale() !== 'en') return null;
    var pack = window.FIXTOK_I18N_EN;
    return pack && pack[key] != null ? pack[key] : null;
  }

  function applyTranslations() {
    var locale = getLocale();
    applyDocumentLocale(locale);
    if (locale !== 'en') return;

    var pack = window.FIXTOK_I18N_EN || {};

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (pack[key] != null) el.textContent = pack[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (pack[key] != null) el.innerHTML = pack[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      spec.split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0].trim();
        var key = parts[1].trim();
        if (pack[key] != null) el.setAttribute(attr, pack[key]);
      });
    });

    if (pack['meta.title']) {
      var isContact = /contact\.html?$/.test(location.pathname);
      document.title = pack[isContact ? 'contact.meta.title' : 'meta.title'] || pack['meta.title'];
    }
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      var descKey = /contact\.html?$/.test(location.pathname) ? 'contact.meta.description' : 'meta.description';
      if (pack[descKey]) desc.setAttribute('content', pack[descKey]);
    }
  }

  function updateSwitcherUI() {
    var locale = getLocale();
    document.querySelectorAll('.lang-switcher__btn').forEach(function (btn) {
      var code = btn.getAttribute('data-locale');
      var active = code === locale;
      btn.classList.toggle('lang-switcher__btn--active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setLocale(locale) {
    var next = locale === 'en' ? 'en' : DEFAULT_LOCALE;
    if (next === getLocale()) return;
    persistLocale(next);
    window.location.reload();
  }

  function mountLanguageSwitcher() {
    document.querySelectorAll('.nav__right').forEach(function (right) {
      if (right.querySelector('.lang-switcher')) return;

      var sw = document.createElement('div');
      sw.className = 'lang-switcher';
      sw.setAttribute('role', 'group');
      sw.setAttribute('aria-label', 'Language');

      sw.innerHTML =
        '<button type="button" class="lang-switcher__btn" data-locale="he" aria-label="עברית" title="עברית">עב</button>' +
        '<span class="lang-switcher__divider" aria-hidden="true">|</span>' +
        '<button type="button" class="lang-switcher__btn" data-locale="en" aria-label="English" title="English">EN</button>';

      sw.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-locale]');
        if (!btn) return;
        setLocale(btn.getAttribute('data-locale'));
      });

      right.insertBefore(sw, right.firstChild);
    });
    updateSwitcherUI();
  }

  window.FixTokLocale = {
    getLocale: getLocale,
    setLocale: setLocale,
    applyTranslations: applyTranslations,
    mountLanguageSwitcher: mountLanguageSwitcher,
  };

  function init() {
    mountLanguageSwitcher();
    applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
