/* Signal Lab — page behavior: theme toggle, clock, typed hero line, scroll reveals */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F5F7F9' : '#0D1117');
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ---------- Amsterdam clock ---------- */
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    try {
      var time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam'
      }).format(new Date());
      clock.textContent = 'AMS ' + time;
    } catch (e) {
      clock.textContent = '';
    }
  }
  tick();
  setInterval(tick, 30000);

  /* ---------- typed hero line ---------- */
  var typed = document.getElementById('typed');
  if (typed) {
    var text = typed.getAttribute('data-text') || '';
    if (reducedMotion) {
      typed.textContent = text;
    } else {
      var i = 0;
      (function type() {
        if (i <= text.length) {
          typed.textContent = text.slice(0, i);
          i++;
          setTimeout(type, i < 4 ? 350 : 26);
        }
      })();
    }
  }

  /* ---------- scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
