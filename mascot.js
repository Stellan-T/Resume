/* "Bolt" — the line-art robot companion.
   Lives bottom-right, idles, reacts to sections / theme / clicks.
   Pure SVG + CSS classes; sits out entirely under prefers-reduced-motion. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- build ---------- */
  var bot = document.createElement('button');
  bot.className = 'bot';
  bot.type = 'button';
  bot.setAttribute('aria-label', "Bolt, the site's robot companion — click to interact");
  bot.innerHTML =
    '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<g class="bot-inner">' +
        // antenna
        '<line x1="36" y1="16" x2="36" y2="10" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle class="antenna-tip bot-fill" cx="36" cy="7.5" r="2.6"/>' +
        // spark (skills reaction)
        '<polyline class="acc acc-spark" points="46,4 42,10 46,10 42,16" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        // ears
        '<rect x="11.5" y="26" width="5" height="11" rx="2.5" stroke-width="2.5" fill="none"/>' +
        '<rect x="55.5" y="26" width="5" height="11" rx="2.5" stroke-width="2.5" fill="none"/>' +
        // head
        '<rect class="bot-head" x="17" y="16" width="38" height="31" rx="10" stroke-width="2.5"/>' +
        // eyes
        '<circle class="bot-eye bot-fill" cx="29" cy="30" r="3.2"/>' +
        '<circle class="bot-eye bot-fill" cx="43" cy="30" r="3.2"/>' +
        // mouths (one visible at a time)
        '<path class="mouth-flat" d="M31 38.5 H41" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path class="mouth-happy" d="M30 37.5 Q36 43 42 37.5" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle class="mouth-o" cx="36" cy="39" r="2.8" fill="none" stroke-width="2.5"/>' +
        // chef toque (Loetje reaction)
        '<g class="acc acc-chef">' +
          '<path class="bot-head" d="M25 15 v-4 q-4-7 3-8 q1-4 8-4 q7 0 8 4 q7 1 3 8 v4 Z" stroke-width="2.5" stroke-linejoin="round"/>' +
        '</g>' +
        // graduation cap (education reaction)
        '<g class="acc acc-cap">' +
          '<polygon class="bot-head" points="36,3 56,10 36,17 16,10" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path d="M53 11.5 v7" fill="none" stroke-width="2" stroke-linecap="round"/>' +
          '<circle class="bot-fill" cx="53" cy="20.5" r="1.8"/>' +
        '</g>' +
        // sunglasses (light-mode reaction)
        '<g class="acc acc-shades">' +
          '<rect class="bot-fill" x="23" y="25.5" width="11" height="8" rx="2.5"/>' +
          '<rect class="bot-fill" x="38" y="25.5" width="11" height="8" rx="2.5"/>' +
          '<path d="M34 28.5 H38 M17 27 L23 28 M55 27 L49 28" fill="none" stroke-width="2" stroke-linecap="round"/>' +
        '</g>' +
      '</g>' +
    '</svg>';

  var bubble = document.createElement('div');
  bubble.className = 'bot-bubble';
  bubble.setAttribute('aria-hidden', 'true');

  document.body.appendChild(bot);
  document.body.appendChild(bubble);

  /* ---------- tiny state machine ---------- */
  var bubbleTimer, poseTimer, accTimer;
  var POSES = ['blink', 'look-l', 'look-r', 'look-u', 'happy', 'surprised', 'hop', 'overclock'];
  var ACCS = ['wear-chef', 'wear-cap', 'wear-shades', 'spark'];

  function say(text, ms) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, ms || 2600);
  }

  function pose(cls, ms) {
    POSES.forEach(function (p) { bot.classList.remove(p); });
    if (!cls) return;
    bot.classList.add(cls);
    clearTimeout(poseTimer);
    poseTimer = setTimeout(function () { bot.classList.remove(cls); }, ms || 900);
  }

  function wear(cls, ms) {
    ACCS.forEach(function (a) { bot.classList.remove(a); });
    if (!cls) return;
    bot.classList.add(cls);
    clearTimeout(accTimer);
    accTimer = setTimeout(function () { bot.classList.remove(cls); }, ms || 3000);
  }

  /* ---------- idle life ---------- */
  function idle() {
    var roll = Math.random();
    if (roll < 0.5) pose('blink', 160);
    else if (roll < 0.66) pose('look-l', 900);
    else if (roll < 0.82) pose('look-r', 900);
    else pose('look-u', 900);
    setTimeout(idle, 2800 + Math.random() * 3500);
  }

  /* ---------- section reactions ---------- */
  var reactions = {
    hero:       function () { pose('happy', 1600); say('hoi.'); },
    about:      function () { pose('look-u', 1400); say('curious by default.'); },
    experience: function () { pose('happy', 1400); say('GenAI by day…'); },
    loetje:     function () { wear('wear-chef', 3200); pose('happy', 3200); say('…kitchen by night.', 3200); },
    education:  function () { wear('wear-cap', 3200); pose('happy', 3200); say('GPA 8.5 — verified.', 3200); },
    skills:     function () { wear('spark', 3000); say('training… ▓▓▓▓░', 3000); },
    languages:  function () { say('hoi · hi · hallo'); },
    fun:        function () { pose('happy', 1600); say('work hard, travel harder.'); },
    connect:    function () { pose('hop', 500); say('say hoi →', 3200); }
  };

  var lastSection = null;
  function react(name) {
    if (name === lastSection || reducedMotion) return;
    lastSection = name;
    if (reactions[name]) reactions[name]();
  }

  if ('IntersectionObserver' in window && !reducedMotion) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) react(entry.target.getAttribute('data-section'));
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('[data-section]').forEach(function (el) {
      sectionObserver.observe(el);
    });

    var loetje = document.getElementById('entry-loetje');
    if (loetje) {
      var loetjeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) react('loetje');
        });
      }, { threshold: 0.6 });
      loetjeObserver.observe(loetje);
    }
  }

  /* ---------- theme reaction ---------- */
  document.addEventListener('themechange', function (e) {
    if (reducedMotion) return;
    if (e.detail.theme === 'light') {
      wear('wear-shades', 3000);
      pose('happy', 3000);
      say('ah — bright mode.', 3000);
    } else {
      wear(null);
      pose('blink', 200);
      say('night mode. cozy.');
    }
  });

  /* ---------- clicks + easter egg ---------- */
  var quips = ['beep.', 'hoi!', '01001000 01101001', 'still learning.', 'loss: decreasing ↓'];
  var clicks = 0;
  bot.addEventListener('click', function () {
    clicks++;
    if (clicks >= 5) {
      clicks = 0;
      pose('overclock', 1600);
      wear('spark', 1600);
      setTimeout(function () { pose('happy', 2000); }, 1650);
      say('⚡ overclocked! achievement unlocked: persistent visitor.', 4200);
    } else {
      pose('hop', 500);
      say(quips[(clicks - 1) % quips.length], 1800);
    }
  });

  /* ---------- boot ---------- */
  if (!reducedMotion) {
    setTimeout(function () { react('hero'); }, 1400);
    setTimeout(idle, 3200);
  }
})();
