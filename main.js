(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(a, b, x) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function token(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }
  function isDark() { return root.getAttribute('data-scheme') === 'dark'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ================= theme, clock, year ================= */
  $('#scheme').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-scheme', next);
    try { localStorage.setItem('s3-scheme', next); } catch (e) {}
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0A0C10' : '#ECEEF1');
    document.dispatchEvent(new CustomEvent('schemechange'));
  });
  function amsParts() {
    try {
      var p = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Amsterdam' }).format(new Date()).split(':');
      return [+p[0] % 24, +p[1]];
    } catch (e) { var d = new Date(); return [d.getHours(), d.getMinutes()]; }
  }
  function fmt(h) { var hh = Math.floor(h) % 24, mm = Math.floor((h - Math.floor(h)) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
  function tick() { var p = amsParts(); $('#clock').textContent = 'AMS ' + fmt(p[0] + p[1] / 60); }
  tick(); setInterval(tick, 30000);
  $('#year').textContent = String(new Date().getFullYear());

  /* ================= timeline filter ================= */
  $$('.filters .chip').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      $$('.filters .chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.rel').forEach(function (r) { r.hidden = f !== 'all' && r.getAttribute('data-k') !== f; });
    });
  });

  /* ================= copy email ================= */
  $('#copy').addEventListener('click', function () {
    var btn = this, txt = $('#email').textContent;
    function done(ok) { btn.textContent = ok ? 'Copied' : 'Select'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents($('#email'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); done(false);
    }
    try { navigator.clipboard.writeText(txt).then(function () { done(true); }, fallback); } catch (e) { fallback(); }
  });

  /* ================= ask me anything: answers written from the CV ================= */
  var EMAIL = 'stellan.tulfer@gmail.com';
  var ANSWERS = {
    who: "I'm Stellan Tulfer, a third-year Artificial Intelligence student at the University of Amsterdam with a GPA of 8.5, and a Working Student AI at REVOCIVIC in Amsterdam. I build with machine learning by day and have as much fun as possible by night, endlessly curious about where AI takes us next.",
    now: "At REVOCIVIC I create and manage municipality software. I use GenAI to speed up development and streamline delivery, and I translate complex public-sector requirements into practical AI-powered solutions.\n\nThis year I'm also doing a 30 EC minor in Managing Digital Innovation at the Vrije Universiteit Amsterdam.",
    why: "What keeps me hooked is the pace. Every few months there's a new model, a new technique, a new use case that genuinely amazes me. I'm not chasing one fixed destination in AI. I'm passionate about the whole field and its future, and I want to be building at that edge as it moves.",
    study: "I'm in my third year of the BSc Artificial Intelligence at the University of Amsterdam, which I started in September 2024 (GPA 8.5). It's machine learning, neural networks and the math behind them, built with Python and PyTorch, with NLP and computer vision on top. Linear algebra, calculus and probability theory every day.\n\nThis year I'm also doing the Managing Digital Innovation minor at VU Amsterdam (30 EC).\n\nBefore that I did VWO-ATH at Montessori Lyceum Flevoland in Almere and graduated with a 7.6 across Economics & Society and Culture & Society.",
    work: "Four jobs so far:\n• Working Student AI at REVOCIVIC, Amsterdam (May 2026 – now)\n• Kitchen Staff at Loetje, Almere (Oct 2024 – Jul 2026)\n• Supermarket Employee at DekaMarkt, Almere (Oct 2023 – Oct 2024)\n• Delivery Driver at Kwalitaria, Almere (Jul 2022 – Jul 2023)",
    skills: "Python programming, machine learning, data analysis, statistical methods, interpreting data and problem solving. In practice that means designing, training and evaluating models, and turning raw numbers into narratives that drive decisions.",
    after: "When I'm not behind a keyboard I'm usually at the gym, on a run, or out exploring somewhere new. Travelling is my favourite. Games, going out, good dinners out and quality time with people fill the rest. Different setting, same habits: show up, stay curious, keep moving.",
    langs: "Dutch is my native language, my English is fluent, and my German is conversational. Hoi, hi, hallo.",
    nl: "Ja! Nederlands is mijn moedertaal. Engels spreek ik vloeiend en Duits op gespreksniveau. Groetjes uit Almere.",
    loetje: "From October 2024 to July 2026 I worked in the kitchen at Loetje in Almere: preparing menu items on my own and working with the kitchen team to keep service efficient, organized and consistently high-quality.",
    marathon: "In April 2026 I ran the Rotterdam Marathon: 42.195 km through the city, over the Erasmus Bridge and back to the Coolsingel. The training meant months of long runs next to my studies and kitchen shifts at Loetje.\n\nIt's pretty much how I approach everything: show up, put in the kilometres, push a little further.",
    hobbies: "The gym and running, and running got me all the way to a marathon in Rotterdam. Travelling is my favourite. Add games, going out, good dinners and quality time with friends.",
    activities: "A normal week: lectures at UvA plus my minor at the VU, building AI-powered municipality software at REVOCIVIC, and in between the gym, a few runs and a night out or dinner with friends. When the calendar has room, a trip somewhere new.",
    interests: "AI first: machine learning, neural networks, NLP, computer vision and generative AI, and how it actually lands in real organisations. That last part is why I picked the Managing Digital Innovation minor.\n\nOutside tech: travel, new places, sports and good food.",
    passions: "Two, really. AI: the pace of the field genuinely amazes me, and I want to be building at that edge as it moves. And moving: training, running, travelling.\n\nBoth come down to the same thing: stay curious, keep pushing a little further.",
    facts: "Quick facts:\n• Based in Almere, Flevoland\n• 3rd-year BSc Artificial Intelligence at UvA, GPA 8.5\n• Working Student AI at REVOCIVIC since May 2026\n• Minor Managing Digital Innovation at the VU (30 EC)\n• VWO-ATH at Montessori Lyceum Flevoland, 7.6\n• Dutch native, English fluent, German conversational\n• Ran the Rotterdam Marathon in April 2026\n• Four jobs so far: delivery, supermarket, kitchen, AI",
    funfact: [
      "The ground I live on used to be the bottom of the sea. Flevoland is the largest artificial island in the world, and the polder Almere is built on was only pumped dry in 1968.",
      "The word \"robot\" comes from the Czech \"robota\", meaning forced labour. It was first used in Karel Čapek's 1920 play R.U.R.",
      "A marathon is 42.195 km because of the 1908 London Olympics. The course was stretched so it could start at Windsor Castle and finish in front of the royal box.",
      "The Netherlands has more bikes than people, roughly 23 million bicycles for about 18 million Dutch."
    ],
    contact: "Say hoi. Email " + EMAIL + " or find me on LinkedIn at linkedin.com/in/stellan-tulfer. Whether it's a question, a project, or just a good conversation about where AI is heading, my inbox is open.",
    fallback: "Good question, but that one isn't on my CV. Ask me directly: " + EMAIL + "."
  };
  var QUESTIONS = {
    who: 'Who are you?', now: 'What are you working on?', why: 'Why AI?', facts: 'Give me some quick facts', contact: 'How do I reach you?',
    study: 'What do you study?', work: 'Show me your experience', skills: 'What are you good at?', loetje: 'What did you do at Loetje?',
    marathon: 'Tell me about your marathon', hobbies: 'What are your hobbies?', activities: 'What does your week look like?', interests: 'What are you interested in?', passions: 'What are you passionate about?', after: 'What do you do after hours?',
    funfact: 'Tell me a fun fact', langs: 'Which languages do you speak?', nl: 'Spreek je Nederlands?'
  };
  var CATS = [
    { id: 'about', label: 'About', qs: ['who', 'now', 'why', 'facts', 'funfact', 'contact'] },
    { id: 'work', label: 'Study & work', qs: ['study', 'work', 'skills', 'loetje'] },
    { id: 'life', label: 'Life', qs: ['marathon', 'hobbies', 'activities', 'interests', 'passions', 'after'] },
    { id: 'fun', label: 'Fun', qs: ['funfact', 'langs', 'nl'] }
  ];
  var ROUTES = [
    ['nl', /nederlands|spreek|hoe gaat|wie ben je|moedertaal|dank/i],
    ['funfact', /fun ?fact|random fact|surprise me|tell me something/i],
    ['marathon', /marathon|rotterdam|42|race|finish line/i],
    ['facts', /\bfacts?\b|quick|tl;?dr|summar|key points|in short/i],
    ['passions', /passion/i],
    ['interests', /interest|curious about|fascinat/i],
    ['hobbies', /hobby|hobbies/i],
    ['activities', /activit|\bweek\b|routine|typical day|schedule/i],
    ['loetje', /loetje|kitchen|cook|restaurant|chef|keuken/i],
    ['contact', /contact|email|e-mail|mail|reach|hire|linkedin|get in touch|connect/i],
    ['now', /now|current|working on|revocivic|present|today/i],
    ['why', /why|passion|future|motivat|hooked|love about/i],
    ['study', /study|uva|university|educat|gpa|grade|school|vwo|minor|\bvu\b|degree|course|learn/i],
    ['work', /experience|career|jobs?\b|work|history|kwalitaria|dekamarkt|supermarket|deliver|cv|resume/i],
    ['skills', /skill|python|pytorch|machine|\bml\b|data|stat|good at|can you do|tools?/i],
    ['after', /hobby|hobbies|fun|free time|weekend|gym|run|travel|game|dinner|after hours|going out|sport/i],
    ['langs', /language|dutch|english|german|deutsch|speak/i],
    ['who', /who|about|yourself|introduce|hello|hi\b|hoi|hey|name|stellan/i]
  ];
  function route(text) { for (var i = 0; i < ROUTES.length; i++) if (ROUTES[i][1].test(text)) return ROUTES[i][0]; return 'fallback'; }

  var turns = {};
  function answer(key) {
    var a = ANSWERS[key] || ANSWERS.fallback;
    if (Array.isArray(a)) {
      var n = turns[key] || 0; turns[key] = n + 1;
      return (key === 'funfact' ? (n === 0 ? 'I love fun facts, so here\'s one. ' : 'Another one. ') : '') + a[n % a.length];
    }
    return a;
  }

  var msgs = $('#msgs'), streaming = false;
  function addUser(text) {
    var d = document.createElement('div'); d.className = 'msg user'; d.textContent = text; msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function addBot(key, instant) {
    var d = document.createElement('div'); d.className = 'msg bot';
    d.innerHTML = '<span class="av" aria-hidden="true">ST</span><div class="txt"></div>';
    msgs.appendChild(d);
    var txt = $('.txt', d), full = answer(key);
    if (instant || reducedMotion) { txt.textContent = full; msgs.scrollTop = msgs.scrollHeight; return; }
    streaming = true;
    txt.innerHTML = '<span class="thinking"><i></i><i></i><i></i></span>';
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function () {
      var i = 0;
      (function step() {
        i = Math.min(full.length, i + 2 + ((Math.random() * 4) | 0));
        txt.textContent = full.slice(0, i);
        var c = document.createElement('span'); c.className = 'cursor'; txt.appendChild(c);
        msgs.scrollTop = msgs.scrollHeight;
        if (i < full.length) setTimeout(step, 16 + Math.random() * 22);
        else { txt.textContent = full; streaming = false; }
      })();
    }, 380);
  }
  function ask(text, key) { if (streaming) return; addUser(text); addBot(key || route(text)); }
  /* question menu: pick a topic, then a question */
  var asked = {}, curCat = 'about', tabsEl = $('#qtabs'), listEl = $('#prompts');
  function showCat(id, focus) {
    curCat = id;
    $$('.qtab', tabsEl).forEach(function (t) {
      var on = t.getAttribute('data-cat') === id;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    var cat = CATS.filter(function (c) { return c.id === id; })[0];
    listEl.setAttribute('aria-labelledby', 'qtab-' + id);
    listEl.innerHTML = '';
    cat.qs.forEach(function (k, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (asked[k] ? ' asked' : ''); b.textContent = QUESTIONS[k];
      b.style.animationDelay = (i * 35) + 'ms';
      b.addEventListener('click', function () { if (streaming) return; asked[k] = true; b.classList.add('asked'); ask(QUESTIONS[k], k); });
      listEl.appendChild(b);
    });
  }
  CATS.forEach(function (c) {
    var t = document.createElement('button');
    t.type = 'button'; t.className = 'qtab'; t.id = 'qtab-' + c.id; t.setAttribute('role', 'tab'); t.setAttribute('data-cat', c.id);
    t.innerHTML = esc(c.label) + ' <b>' + c.qs.length + '</b>';
    t.addEventListener('click', function () { showCat(c.id); });
    tabsEl.appendChild(t);
  });
  tabsEl.addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault();
    var i = CATS.map(function (c) { return c.id; }).indexOf(curCat);
    showCat(CATS[(i + d + CATS.length) % CATS.length].id, true);
  });
  showCat('about');
  $('#composer').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#askbox').value.trim();
    if (!v || streaming) return;
    $('#askbox').value = '';
    ask(v);
  });
  function seedChat() { msgs.innerHTML = ''; asked = { who: true }; turns = {}; addUser(QUESTIONS.who); addBot('who', true); if (tabsEl) showCat(curCat); }
  $('#reset').addEventListener('click', function () { if (!streaming) seedChat(); });
  seedChat();

  /* ================= places in Stellan's world (all from the CV) ================= */
  var PLACES = [
    { id: 'home', label: 'Home', isle: 'Almere', name: 'Home', sub: 'Almere, NL', text: 'Based in Almere, Flevoland.', act: 'wave' },
    { id: 'gym', label: 'Gym', isle: 'Almere', name: 'Gym & running', sub: 'After hours', text: 'Show up, put in the reps, push a little further. Running too.', act: ['pushups', 'pullups', 'curl', 'run'] },
    { id: 'uva', label: 'UvA', isle: 'Amsterdam', name: 'University of Amsterdam', sub: 'BSc Artificial Intelligence · Sep 2024 – now · GPA 8.5 / 10', text: 'Machine learning, neural networks, and the math that powers them. Python and PyTorch, NLP and computer vision.', act: 'type' },
    { id: 'vu', label: 'VU', isle: 'Amsterdam', name: 'Vrije Universiteit Amsterdam', sub: 'Minor: Managing Digital Innovation · Year 3 · 30 EC', text: 'How digital technologies like AI, blockchain, IoT and cloud reshape organizations, work, and business models.', act: 'think' },
    { id: 'revocivic', label: 'REVOCIVIC', isle: 'Amsterdam', name: 'REVOCIVIC', sub: 'Working Student AI · May 2026 – now', text: 'Creating and managing municipality software, using GenAI to speed up delivery, and turning public-sector requirements into practical AI-powered solutions.', act: 'type' }
  ];
  var byId = {};
  PLACES.forEach(function (p) { byId[p.id] = p; });
  /* Stellan's day: 09–17 UvA, VU and REVOCIVIC · 17–22 and 07–09 home or the gym · 22–07 asleep at home */
  function phaseOf(h) { return h >= 9 && h < 17 ? 'work' : (h >= 22 || h < 7) ? 'sleep' : 'free'; }
  function phaseInfo(h) {
    var ph = phaseOf(h);
    if (ph === 'work') return { ph: ph, tag: 'by day', k: 'By day · 09–17', h: 'I build with machine learning', ids: ['uva', 'vu', 'revocivic'] };
    if (ph === 'sleep') return { ph: ph, tag: 'asleep', k: 'Night · 22–07', h: 'Asleep at home', ids: ['home'] };
    var morning = h < 12;
    return { ph: ph, tag: morning ? 'morning' : 'evening', k: morning ? 'Morning · 07–09' : 'Evening · 17–22', h: 'At home or the gym', ids: ['gym', 'home'] };
  }

  var placesEl = $('#places');
  PLACES.forEach(function (p) {
    var b = document.createElement('button');
    b.className = 'chip'; b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('data-place', p.id);
    b.textContent = p.label;
    placesEl.appendChild(b);
  });


  /* ================= Bolt's terminal ================= */
  var term = $('#term');
  var RUNS = {
    wave:     { out: ['hoi.'] },
    type:     { out: ['Working Student AI · REVOCIVIC · Amsterdam · May 2026 – now', 'municipality software · GenAI-assisted delivery'] },
    pushups:  { out: ['gym → push-ups', '3 reps'] },
    pullups:  { out: ['gym → pull-ups', '3 reps'] },
    curl:     { out: ['gym → curls', '3 reps · training… ▓▓▓▓░'], wear: 'spark' },
    run:      { out: ['after hours → running', 'show up, stay curious, keep moving'] },
    dance:    { out: ['after hours → going out', 'dance floor located'], wear: 'wear-shades' },
    cook:     { out: ['Kitchen Staff · Loetje · Almere · Oct 2024 – Jul 2026', 'pancake flipped'], wear: 'wear-chef' },
    graduate: { out: ['VWO-ATH · Montessori Lyceum Flevoland · GPA 7.6', 'cap thrown'], wear: 'wear-cap' },
    carry:    { out: ['Supermarket Employee · DekaMarkt · Almere · Oct 2023 – Oct 2024', 'crate restocked'] },
    deliver:  { out: ['Delivery Driver · Kwalitaria · Almere · Jul 2022 – Jul 2023', 'order delivered'] },
    think:    { out: ['curious by default.'] }
  };
  var CMD_LABEL = {};
  $$('#cmds .cmd').forEach(function (b) { CMD_LABEL[b.getAttribute('data-run')] = b.textContent; });
  function line(html) {
    var d = document.createElement('div'); d.innerHTML = html; term.appendChild(d);
    while (term.children.length > 40) term.removeChild(term.firstChild);
    term.scrollTop = term.scrollHeight;
  }
  line('<span class="d">Pick a command, or click Bolt.</span>');
  var stageBolt = null;
  function runCmd(name) {
    var r = RUNS[name]; if (!r) return;
    line('<span class="p">bolt@stellan</span> <span class="d">~/routines $</span> ' + esc(CMD_LABEL[name] || name));
    r.out.forEach(function (o, i) {
      setTimeout(function () { line('<span class="d">› </span>' + esc(o) + (i === r.out.length - 1 ? ' <span class="ok">✓</span>' : '')); }, 260 + i * 380);
    });
    $$('#cmds .cmd').forEach(function (b) { b.classList.toggle('run', b.getAttribute('data-run') === name); });
    $('#stage-now').textContent = CMD_LABEL[name] || name;
    if (stageBolt) stageBolt.run(name, r.wear);
  }
  $$('#cmds .cmd').forEach(function (b) { b.addEventListener('click', function () { runCmd(b.getAttribute('data-run')); }); });
  var WORKOUT = ['pushups', 'pullups', 'dance'], wk = 0;

  /* Bolt on his own stage */
  function initStage(THREE) {
    var host = $('#stage');
    var canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Bolt the robot. Click for a workout.');
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); } catch (e) { return null; }
    if (!renderer.getContext()) return null;
    host.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.8));
    var key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(-3, 6, 6); scene.add(key);
    var rim = new THREE.PointLight(0xff5b1f, 1.2, 16); rim.position.set(2.8, 3.6, -2.5); scene.add(rim);
    var bolt = makeBolt(THREE); scene.add(bolt.world);
    var VIEW_H = 6.8, lookY = VIEW_H / 2 - 0.85, camera = new THREE.PerspectiveCamera(28, 1, 0.1, 80);
    function resize() {
      var W = host.clientWidth || 1, H = host.clientHeight || 1;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      var vh = Math.max(VIEW_H, 6.3 / (W / H));
      camera.position.set(0, lookY + 1.1, vh / (2 * Math.tan(14 * Math.PI / 180)));
      camera.lookAt(0, lookY, 0);
      camera.updateProjectionMatrix();
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);
    function theme() { var a = token('--signal') || '#FF5B1F'; bolt.setTheme(a, isDark()); rim.color.set(a); }
    theme();
    document.addEventListener('schemechange', theme);
    var active = false;
    visibleLoop(host, function (t, dt) {
      bolt.step(t, dt, 0);
      if (active && !bolt.busy(t)) {
        active = false;
        $('#stage-now').textContent = 'idle';
        $$('#cmds .cmd').forEach(function (b) { b.classList.remove('run'); });
      }
      renderer.render(scene, camera);
    });
    canvas.addEventListener('click', function () { runCmd(WORKOUT[wk++ % WORKOUT.length]); });
    return { run: function (name, wear) { bolt.act(name, wear); active = true; } };
  }

  /* ================= three.js ================= */
  function withThree(cb) {
    if (window.THREE) return cb(window.THREE);
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
    s.onload = function () { cb(window.THREE || null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }
  function visibleLoop(el, frame) {
    var on = true, last = performance.now();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (l) { var was = on; on = l[0].isIntersecting; if (on && !was) { last = performance.now(); requestAnimationFrame(loop); } }).observe(el);
    function loop(now) {
      if (!on) return;
      var dt = Math.min((now - last) / 1000, 0.1); last = now;
      frame(now / 1000, dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  var world = null;
  withThree(function (THREE) {
    if (THREE) { try { world = initWorld(THREE); } catch (e) { console.error(e); world = null; } }
    if (!world) { root.classList.add('no-webgl'); world = initWorldFallback(); }
    if (THREE) { try { stageBolt = initStage(THREE); } catch (e) { console.error(e); stageBolt = null; } }
    if (stageBolt && 'IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (l) { if (l[0].isIntersecting && !seen) { seen = true; setTimeout(function () { runCmd('wave'); }, 400); } }, { threshold: 0.4 }).observe($('#stage'));
    }
  });

  /* without WebGL: the card, chips and clock still work */
  function initWorldFallback() {
    var sel = null;
    function render() {
      var p = amsParts(), h = p[0] + p[1] / 60, info = phaseInfo(h);
      $('#tod-now').innerHTML = '<b>' + fmt(h) + '</b> AMS · ' + info.tag;
      cardFor(sel, info, function (id) { sel = id; render(); }, function () { sel = null; render(); });
    }
    $$('#places .chip').forEach(function (b) { b.addEventListener('click', function () { sel = b.getAttribute('data-place'); render(); }); });
    render();
    return {};
  }

  /* the overlay card: either the selected place or what day/night means */
  function cardFor(id, info, pick, close) {
    var card = $('#world-card');
    $$('#places .chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-place') === id)); });
    if (id && byId[id]) {
      var p = byId[id];
      card.innerHTML = '<div class="k"><span>' + esc(p.isle) + '</span><button class="x" type="button" aria-label="Close">×</button></div>' +
        '<h3>' + esc(p.name) + '</h3><div class="sub">' + esc(p.sub) + '</div><p>' + esc(p.text) + '</p>';
      $('.x', card).addEventListener('click', close);
    } else {
      var m = info;
      card.innerHTML = '<div class="k"><span>' + m.k + '</span></div><h3>' + m.h + '</h3><div class="go"></div>';
      var go = $('.go', card);
      m.ids.forEach(function (pid) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = byId[pid].label;
        b.addEventListener('click', function () { pick(pid); });
        go.appendChild(b);
      });
    }
  }

  /* ================= THE WORLD: Almere ⇄ Amsterdam in miniature ================= */
  function initWorld(THREE) {
    var stage = $('#world-stage'), canvas = $('canvas', stage), labelsEl = $('#world-labels'), card = $('#world-card');
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); } catch (e) { return null; }
    if (!renderer.getContext()) return null;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var cam = new THREE.OrthographicCamera(-6, 6, 4, -4, 0.1, 200);
    var hemi = new THREE.HemisphereLight(0xffffff, 0x6b7a90, 0.8); scene.add(hemi);
    var sunL = new THREE.DirectionalLight(0xffffff, 0.8); scene.add(sunL); scene.add(sunL.target);
    var moonL = new THREE.DirectionalLight(0x9fb6ff, 0); moonL.position.set(-4, 8, -3); scene.add(moonL);

    var M = {
      wall: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
      roof: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
      top: new THREE.MeshStandardMaterial({ roughness: 1 }),
      base: new THREE.MeshStandardMaterial({ roughness: 1 }),
      road: new THREE.MeshStandardMaterial({ roughness: 1 }),
      tree: new THREE.MeshStandardMaterial({ roughness: 1 }),
      water: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 }),
      ink: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
      accent: new THREE.MeshBasicMaterial(),
      win: new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
      bulb: new THREE.MeshBasicMaterial(),
      line: new THREE.MeshBasicMaterial({ side: THREE.BackSide }),
      hot: new THREE.MeshBasicMaterial({ side: THREE.BackSide }),
      cloud: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
    };
    var T = 0.028, pickables = [];

    function rrShape(w, h, r) {
      var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    /* a slab with rounded corners in plan view (w along x, d along z, h tall) */
    function slab(w, h, d, r) {
      var g = new THREE.ExtrudeGeometry(rrShape(w, d, r), { depth: h, bevelEnabled: false, curveSegments: 10 });
      g.rotateX(Math.PI / 2); g.center();
      return g;
    }
    /* a mesh plus an outline hull, inside a group placed at (x, y, z) */
    function solid(geo, mat, x, y, z, t, place, parent) {
      var g = new THREE.Group(); g.position.set(x, y, z);
      var m = new THREE.Mesh(geo, mat); g.add(m);
      if (t) {
        geo.computeBoundingBox();
        var s = new THREE.Vector3(); geo.boundingBox.getSize(s);
        var o = new THREE.Mesh(geo, M.line);
        o.scale.set((s.x + 2 * t) / Math.max(s.x, 1e-3), (s.y + 2 * t) / Math.max(s.y, 1e-3), (s.z + 2 * t) / Math.max(s.z, 1e-3));
        g.add(o);
        if (place) place.hulls.push(o);
      }
      if (place) { m.userData.place = place.id; pickables.push(m); }
      (parent || scene).add(g);
      return g;
    }

    /* windows: one merged mesh for every building */
    var winPos = [];
    function quad(cx, cy, cz, ux, uy, uz, vx, vy, vz) {
      winPos.push(cx - ux - vx, cy - uy - vy, cz - uz - vz, cx + ux - vx, cy + uy - vy, cz + uz - vz, cx + ux + vx, cy + uy + vy, cz + uz + vz,
                  cx - ux - vx, cy - uy - vy, cz - uz - vz, cx + ux + vx, cy + uy + vy, cz + uz + vz, cx - ux + vx, cy - uy + vy, cz - uz + vz);
    }
    function windows(x, z, w, h, d, floors, cols, y0) {
      y0 = y0 || 0;
      var fh = h / floors, colsD = Math.max(1, Math.round(cols * d / w));
      for (var f = 0; f < floors; f++) {
        var cy = y0 + fh * (f + 0.55), hh = fh * 0.22;
        for (var c = 0; c < cols; c++) {
          var cx = x - w / 2 + w * (c + 0.5) / cols, hw = w / cols * 0.26;
          quad(cx, cy, z + d / 2 + 0.006, hw, 0, 0, 0, hh, 0);
          quad(cx, cy, z - d / 2 - 0.006, hw, 0, 0, 0, hh, 0);
        }
        for (var c2 = 0; c2 < colsD; c2++) {
          var cz = z - d / 2 + d * (c2 + 0.5) / colsD, hd = d / colsD * 0.26;
          quad(x + w / 2 + 0.006, cy, cz, 0, 0, hd, 0, hh, 0);
          quad(x - w / 2 - 0.006, cy, cz, 0, 0, hd, 0, hh, 0);
        }
      }
    }
    function prism(w, rh, d) {
      var s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, rh); s.closePath();
      var g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.center(); return g;
    }
    function block(place, x, z, w, h, d, floors, cols) {
      solid(new THREE.BoxGeometry(w, h, d), M.wall, x, h / 2, z, T, place);
      if (floors) windows(x, z, w, h, d, floors, cols);
      if (place) place.top = Math.max(place.top || 0, h);
    }
    function house(place, x, z, w, h, d, rh, ridgeX) {
      solid(new THREE.BoxGeometry(w, h, d), M.wall, x, h / 2, z, T, place);
      var roof = solid(ridgeX ? prism(d + 0.05, rh, w + 0.05) : prism(w + 0.05, rh, d + 0.05), M.roof, x, h + rh / 2, z, T, place);
      if (ridgeX) roof.rotation.y = Math.PI / 2;
      windows(x, z, w, h, d, 1, 2);
      if (place) place.top = Math.max(place.top || 0, h + rh);
    }
    function tree(x, z, s) {
      s = s || 1;
      solid(new THREE.CylinderGeometry(0.03 * s, 0.035 * s, 0.14 * s, 6), M.ink, x, 0.07 * s, z, 0);
      solid(new THREE.ConeGeometry(0.16 * s, 0.4 * s, 8), M.tree, x, 0.33 * s, z, T * 0.8);
    }
    var bulbs = [];
    function lamp(x, z) {
      solid(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 5), M.ink, x, 0.16, z, 0);
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), M.bulb); b.position.set(x, 0.33, z); scene.add(b); bulbs.push(b);
    }

    /* ----- ground: a floating tray of water, two islands, a bridge and a rail line ----- */
    solid(slab(9.6, 0.36, 4.4, 0.5), M.base, 0, -0.55, 0, T);
    solid(slab(9.3, 0.04, 4.1, 0.4), M.water, 0, -0.35, 0, 0);
    var ISLE = { Almere: -2.55, Amsterdam: 2.55 };
    solid(slab(3.4, 0.42, 3.0, 0.4), M.top, ISLE.Almere, -0.21, 0, T);
    solid(slab(3.4, 0.42, 3.0, 0.4), M.top, ISLE.Amsterdam, -0.21, 0, T);
    solid(new THREE.BoxGeometry(1.8, 0.1, 0.5), M.top, 0, -0.05, 0, T);
    [-0.45, 0.45].forEach(function (x) { solid(new THREE.CylinderGeometry(0.06, 0.07, 0.32, 8), M.top, x, -0.26, 0, T * 0.8); });
    [-0.23, 0.23].forEach(function (z) { solid(new THREE.BoxGeometry(1.8, 0.07, 0.02), M.ink, 0, 0.035, z, 0); });
    [-0.05, 0.05].forEach(function (z) { solid(new THREE.BoxGeometry(8.4, 0.016, 0.018), M.ink, 0, 0.008, z, 0); });
    function station(x) {
      solid(new THREE.BoxGeometry(0.6, 0.05, 0.16), M.road, x, 0.025, 0.2, T * 0.6);
      [-0.25, 0.25].forEach(function (dx) { solid(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 5), M.ink, x + dx, 0.19, 0.25, 0); });
      solid(new THREE.BoxGeometry(0.64, 0.025, 0.22), M.accent, x, 0.34, 0.22, T * 0.6);
    }

    /* ----- places ----- */
    PLACES.forEach(function (p) { p.hulls = []; p.top = 0; });
    var A = ISLE.Almere, B = ISLE.Amsterdam;
    // Almere: home, the gym and a running track
    house(byId.home, A - 0.65, -0.78, 0.8, 0.55, 0.62, 0.36, true);
    solid(new THREE.BoxGeometry(0.1, 0.26, 0.1), M.wall, A - 0.4, 0.84, -0.9, T, byId.home);
    block(byId.gym, A + 0.7, 0.72, 0.9, 0.6, 0.7, 1, 4);
    var dumb = new THREE.Group(); dumb.position.set(A + 0.7, 0.71, 0.72); scene.add(dumb);
    solid(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 6), M.ink, 0, 0, 0, 0, null, dumb).rotation.z = Math.PI / 2;
    [-0.25, 0.25].forEach(function (x) { solid(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 14), M.accent, x, 0, 0, 0, null, dumb).rotation.z = Math.PI / 2; });
    byId.gym.top = 0.82;
    solid(slab(1.05, 0.012, 0.62, 0.3), M.accent, A - 0.75, 0.006, 0.8, 0);
    solid(slab(0.8, 0.014, 0.38, 0.18), M.top, A - 0.75, 0.008, 0.8, 0);
    // Amsterdam: UvA, VU and REVOCIVIC
    block(byId.uva, B - 0.75, -0.8, 1.1, 0.8, 0.7, 3, 5);
    block(byId.vu, B + 0.75, -0.85, 0.9, 1.25, 0.45, 5, 5);
    block(byId.revocivic, B + 0.35, 0.8, 0.62, 1.55, 0.62, 6, 2);
    station(A - 1.12); station(B + 1.12);
    // greenery + lamps
    [[A - 1.4, -0.3], [A + 0.2, -1.15], [A + 1.4, -0.75], [A - 1.4, 1.25], [B - 0.8, 0.75], [B - 1.35, 1.12], [B + 1.05, 1.12], [B + 1.45, -0.3]].forEach(function (t, i) { tree(t[0], t[1], 0.9 + (i % 3) * 0.12); });
    [[A - 1.15, -0.17], [A + 0.65, -0.44], [B - 1.45, -0.17], [B + 1.2, -0.17]].forEach(function (l) { lamp(l[0], l[1]); });

    var winGeo = new THREE.BufferGeometry();
    winGeo.setAttribute('position', new THREE.Float32BufferAttribute(winPos, 3));
    scene.add(new THREE.Mesh(winGeo, M.win));

    /* streets: each place's spot, then the corners on the way to its island's hub */
    var ROUTE = {
      home: [[A - 0.3, -0.24]],
      gym: [[A + 0.7, 1.3], [A + 1.35, 1.3], [A + 1.35, -0.24]],
      uva: [[B - 0.95, -0.24]],
      vu: [[B + 0.5, -0.3]],
      revocivic: [[B + 0.35, 1.36], [B - 0.15, 1.42]]
    };
    var HUB = { Almere: [A + 0.05, -0.24], Amsterdam: [B - 0.15, -0.26] };
    var SPOT = {};
    Object.keys(ROUTE).forEach(function (k) { SPOT[k] = ROUTE[k][0]; });
    var CENTER = {};
    PLACES.forEach(function (p) {
      var b = new THREE.Box3();
      p.hulls.forEach(function (h) { b.expandByObject(h.parent); });
      var c = new THREE.Vector3(); b.getCenter(c); CENTER[p.id] = [c.x, c.z];
    });

    /* ----- moving things: train, boat, clouds, stars ----- */
    var train = new THREE.Group(); scene.add(train);
    for (var ci = 0; ci < 2; ci++) {
      var car = new THREE.Group(); car.position.x = (ci - 0.5) * 0.54; train.add(car);
      solid(new THREE.BoxGeometry(0.5, 0.2, 0.22), M.wall, 0, 0.12, 0, T, null, car);
      solid(new THREE.BoxGeometry(0.5, 0.035, 0.226), M.accent, 0, 0.06, 0, 0, null, car);
      var w1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.228), M.win); w1.position.y = 0.15; car.add(w1);
    }
    train.position.set(A - 1.12, 0, 0);
    var boat = new THREE.Group(); scene.add(boat);
    solid(new THREE.BoxGeometry(0.26, 0.05, 0.1), M.wall, 0, 0.04, 0, T * 0.6, null, boat);
    var clouds = new THREE.Group(); scene.add(clouds);
    [[-3.0, 2.0, -1.2], [0.8, 2.3, -1.8], [3.4, 1.9, 0.6]].forEach(function (c) {
      var g = new THREE.Group(); g.position.set(c[0], c[1], c[2]); clouds.add(g);
      [[0, 0, 0, 0.32], [0.3, -0.04, 0.05, 0.24], [-0.28, -0.05, -0.02, 0.22]].forEach(function (p) {
        var s = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 8), M.cloud); s.scale.y = 0.55; s.position.set(p[0], p[1], p[2]); g.add(s);
      });
    });
    var starGeo = new THREE.BufferGeometry(), sp = [];
    var srnd = 3; function rnd() { srnd = (srnd * 16807) % 2147483647; return srnd / 2147483647; }
    for (var si = 0; si < 180; si++) { var th = rnd() * Math.PI * 2, ph = 0.25 + rnd() * 1.1, R = 11; sp.push(Math.cos(th) * Math.cos(ph) * R, Math.sin(ph) * R - 1, Math.sin(th) * Math.cos(ph) * R); }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    var starMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, transparent: true, depthWrite: false });
    scene.add(new THREE.Points(starGeo, starMat));

    /* beacons over the places that match day / night */
    var beaconGeo = new THREE.OctahedronGeometry(0.075);
    PLACES.forEach(function (p) {
      var c = CENTER[p.id];
      p.beacon = new THREE.Mesh(beaconGeo, M.accent); p.beacon.position.set(c[0], p.top + 0.3, c[1]); p.beacon.visible = false; scene.add(p.beacon);
    });

    /* ----- Bolt lives here ----- */
    var bolt = makeBolt(THREE);
    var holder = new THREE.Group(); scene.add(holder);
    bolt.world.scale.setScalar(0.14); holder.add(bolt.world);
    /* Bolt is drawn after the world; whatever of him a building hides shows through as a flat silhouette */
    var ghostMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthFunc: THREE.GreaterDepth, depthWrite: false,
      stencilWrite: true, stencilRef: 1, stencilFunc: THREE.NotEqualStencilFunc, stencilZPass: THREE.ReplaceStencilOp });
    var padParts = []; bolt.pad.traverse(function (o) { padParts.push(o); });
    holder.traverse(function (o) { o.layers.set(2); if (o.isMesh && !o.material.transparent && padParts.indexOf(o) < 0) o.layers.enable(1); });
    scene.traverse(function (o) { if (o.isLight) o.layers.enableAll(); });
    renderer.autoClear = false;
    var at = 'home', trip = null;
    holder.position.set(SPOT.home[0], 0, SPOT.home[1]);

    /* ----- colours ----- */
    var C = {};
    function col(h) { return new THREE.Color(h); }
    function applyTheme() {
      var dark = isDark();
      M.wall.color.set(dark ? '#262B34' : '#FFFFFF');
      M.roof.color.set(dark ? '#1E222A' : '#EDEFF2');
      M.top.color.set(dark ? '#1C2028' : '#F7F8FA');
      M.base.color.set(dark ? '#14171D' : '#DCE1E7');
      M.road.color.set(dark ? '#30363F' : '#D5DAE1');
      M.tree.color.set(dark ? '#2F6B52' : '#9FD3B5');
      M.ink.color.set(dark ? '#AEB5C0' : '#0B0D12');
      M.line.color.set(dark ? '#AEB5C0' : '#0B0D12');
      M.hot.color.set(token('--signal') || '#FF5B1F');
      M.accent.color.set(token('--signal') || '#FF5B1F'); ghostMat.color.copy(M.accent.color);
      M.cloud.color.set('#FFFFFF');
      starMat.color.set('#FFFFFF');
      C.waterDay = col(dark ? '#2B4664' : '#A9C8E3'); C.waterNight = col(dark ? '#0E1726' : '#1B2A44');
      C.winDay = col(dark ? '#3A4250' : '#D5DEE8'); C.winNight = col('#FFC66B');
      C.bulbDay = col(dark ? '#59606C' : '#BFC5CE'); C.bulbNight = col('#FFD68A');
      bolt.setTheme(token('--signal') || '#FF5B1F', dark);
    }
    applyTheme();
    document.addEventListener('schemechange', applyTheme);
    var SKY = {
      dayTop: col('#BFD9F2'), dayBot: col('#F3F6FA'), duskTop: col('#E9A07E'), duskBot: col('#F8DCC4'),
      nightTop: col('#0B1424'), nightBot: col('#202C46')
    };

    /* ----- labels ----- */
    var labels = [];
    PLACES.forEach(function (p) {
      var e = document.createElement('span'); e.className = 'wl'; e.textContent = p.label; labelsEl.appendChild(e);
      labels.push({ el: e, place: p, pos: new THREE.Vector3(CENTER[p.id][0], p.top + 0.12, CENTER[p.id][1]) });
    });
    ['Almere', 'Amsterdam'].forEach(function (n) {
      var e = document.createElement('span'); e.className = 'wl isle'; e.textContent = n.toUpperCase(); labelsEl.appendChild(e);
      labels.push({ el: e, isle: true, pos: new THREE.Vector3(ISLE[n] + (n === 'Almere' ? -0.95 : -0.7), -0.2, 1.58) });
    });

    /* ----- camera: orbit by dragging, always fitted to the panel ----- */
    var selected = null, hover = null, mode = 'day', gymN = 0;
    var curInfo = phaseInfo(amsParts()[0] + amsParts()[1] / 60);
    var W = 1, H = 1, portrait = false, cardW = 330, cardH = 150;
    var yaw = 0.55, pitch = 0.62, vyaw = 0, drag = null, lastInput = 0;
    var fr = { l: -6, r: 6, t: 4, b: -4 }, frT = { l: -6, r: 6, t: 4, b: -4 }, firstFit = true;
    var corners = [];
    [-4.85, 4.85].forEach(function (x) { [-2.25, 2.25].forEach(function (z) { [-0.75, 1.65].forEach(function (y) { corners.push(new THREE.Vector3(x, y, z)); }); }); });
    function resize() {
      var narrow = (stage.clientWidth || 1) <= 760;
      if (narrow !== stage.classList.contains('narrow')) { stage.classList.toggle('narrow', narrow); renderCard(); }
      W = stage.clientWidth || 1; H = stage.clientHeight || 1;
      renderer.setSize(W, H, false);
      cardW = card.hidden ? 0 : card.offsetWidth; cardH = card.hidden ? 0 : card.offsetHeight;
      var wasPortrait = portrait; portrait = W / H < 1.05;
      if (firstFit || wasPortrait !== portrait) yaw = portrait ? 1.42 : 0.55;
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    var _v = new THREE.Vector3();
    function placeCamera() {
      cam.position.set(Math.sin(yaw) * Math.cos(pitch) * 30, Math.sin(pitch) * 30 + 0.2, Math.cos(yaw) * Math.cos(pitch) * 30);
      cam.lookAt(0, 0.2, 0);
      cam.updateMatrixWorld();
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      corners.forEach(function (c) {
        _v.copy(c).applyMatrix4(cam.matrixWorldInverse);
        minX = Math.min(minX, _v.x); maxX = Math.max(maxX, _v.x); minY = Math.min(minY, _v.y); maxY = Math.max(maxY, _v.y);
      });
      // keep the scene clear of the info card (left on wide panels, bottom on narrow ones)
      var wide = W > 760, insetL = wide && cardW ? Math.min(cardW + 24, W * 0.42) : 0, insetB = wide || !cardH ? 0 : cardH + 18;
      var aw = W - insetL - 12, ah = H - insetB - 24;
      var s = Math.max((maxX - minX) / aw, (maxY - minY) / ah) * 1.04;
      var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      var x0 = insetL + aw / 2, y0 = 12 + ah / 2;
      frT.l = cx - x0 * s; frT.r = frT.l + W * s; frT.t = cy + y0 * s; frT.b = frT.t - H * s;
      var k = firstFit ? 1 : 0.18;
      firstFit = false;
      fr.l += (frT.l - fr.l) * k; fr.r += (frT.r - fr.r) * k; fr.t += (frT.t - fr.t) * k; fr.b += (frT.b - fr.b) * k;
      cam.left = fr.l; cam.right = fr.r; cam.top = fr.t; cam.bottom = fr.b;
      cam.updateProjectionMatrix();
    }

    /* ----- selection ----- */
    function setHot(id, on) { if (byId[id]) byId[id].hulls.forEach(function (h) { h.material = on ? M.hot : M.line; }); }
    function refreshHot() { PLACES.forEach(function (p) { setHot(p.id, p.id === selected || p.id === hover); }); }
    var override = 0, arrivedAt = 0, boltPlaced = false;
    function v3(p) { return new THREE.Vector3(p[0], 0, p[1]); }
    function goTo(id, auto) {
      var p = byId[id]; if (!p) return;
      var act = p.act;
      if (Array.isArray(act)) act = act[gymN++ % act.length];
      if (auto && id === 'home') act = null;
      var wear = p.wear || (act === 'curl' ? 'spark' : null);
      // back on schedule: the card follows him again
      if (auto && selected && selected !== id) { selected = null; refreshHot(); renderCard(); }
      bolt.setSleep(false);
      var now = performance.now() / 1000;
      if (at === id && !trip) { if (act) bolt.act(act, wear); arrivedAt = now; return; }
      var from = holder.position.clone(); from.y = 0;
      var kind, pts;
      if ((from.x < 0 ? 'Almere' : 'Amsterdam') === p.isle) {
        // same island: walk the streets
        kind = 'walk';
        var lead = !trip && byId[at] && byId[at].isle === p.isle ? ROUTE[at].slice(1).map(v3) : [];
        pts = [from].concat(lead, [v3(HUB[p.isle])], ROUTE[id].slice().reverse().map(v3));
      } else {
        // other island: hop over the water on the hover-pad
        kind = 'fly'; pts = [from, v3(ROUTE[id][0])];
      }
      pts = pts.filter(function (q, i) { return i === 0 || q.distanceTo(pts[i - 1]) > 0.02; });
      var len = 0; for (var i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1]);
      var dur = reducedMotion ? 0.01 : kind === 'fly' ? 0.9 + len * 0.16 : len / (playing ? 1.8 : 0.7);
      trip = { kind: kind, pts: pts, len: len, t0: now, dur: Math.max(dur, 0.01), id: id, act: act, wear: wear,
               sleepAfter: id === 'home' && phaseOf(hour) === 'sleep' };
      at = id;
    }
    function select(id) {
      selected = id; refreshHot();
      renderCard();
      if (id) { override = performance.now() + 15000; goTo(id); }
    }
    function renderCard() {
      cardFor(selected, curInfo, function (pid) { select(pid); }, function () { select(null); });
      card.hidden = stage.classList.contains('narrow') && !selected;
      cardW = card.hidden ? 0 : card.offsetWidth; cardH = card.hidden ? 0 : card.offsetHeight;
    }
    $$('#places .chip').forEach(function (b) { b.addEventListener('click', function () { lastInput = performance.now(); select(b.getAttribute('data-place')); }); });

    /* ----- pointer ----- */
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function pick(e) {
      var r = stage.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, cam);
      var hit = ray.intersectObjects(pickables, false)[0];
      return hit ? hit.object.userData.place : null;
    }
    function nearBolt(e) {
      var r = stage.getBoundingClientRect();
      _v.copy(holder.position); _v.y += 0.3; _v.project(cam);
      var bx = (_v.x * 0.5 + 0.5) * W, by = (-_v.y * 0.5 + 0.5) * H;
      return Math.hypot(e.clientX - r.left - bx, e.clientY - r.top - by) < 26;
    }
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.world-card')) return;
      drag = { x: e.clientX, moved: 0 }; stage.classList.add('dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });
    stage.addEventListener('pointermove', function (e) {
      lastInput = performance.now();
      if (drag) {
        var dx = e.clientX - drag.x; drag.x = e.clientX; drag.moved += Math.abs(dx);
        yaw -= dx * 0.008; vyaw = -dx * 0.008;
        return;
      }
      if (e.pointerType === 'touch') return;
      var id = pick(e);
      if (id !== hover) { hover = id; refreshHot(); }
      stage.style.cursor = id || nearBolt(e) ? 'pointer' : '';
    });
    stage.addEventListener('pointerleave', function () { if (hover) { hover = null; refreshHot(); } });
    function endDrag(e) {
      if (!drag) return;
      var moved = drag.moved; drag = null; stage.classList.remove('dragging');
      if (moved < 6 && e && e.type === 'pointerup') {
        if (nearBolt(e)) { override = performance.now() + 8000; bolt.setSleep(false); bolt.act('wave'); return; }
        var id = pick(e);
        select(id || null);
      }
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', function () { drag = null; stage.classList.remove('dragging'); });

    /* ----- time of day ----- */
    var slider = $('#tod'), liveBtn = $('#live'), playBtn = $('#play');
    var live = true, playing = false, played = 0, hour = 12, lastLive = 0;
    function liveHour() { var p = amsParts(); return p[0] + p[1] / 60; }
    hour = liveHour();
    function setLive(on) { live = on; liveBtn.setAttribute('aria-pressed', String(on)); if (on) { playing = false; hour = liveHour(); } }
    slider.addEventListener('input', function () { setLive(false); playing = false; hour = +slider.value; });
    liveBtn.addEventListener('click', function () { setLive(true); });
    playBtn.addEventListener('click', function () { setLive(false); playing = true; played = 0; if (reducedMotion) { hour = (hour + 6) % 24; playing = false; } });
    $$('.tod-link').forEach(function (b) {
      b.addEventListener('click', function () { setLive(false); playing = false; hour = +b.getAttribute('data-hour'); });
    });

    var sunEl = $('#sun'), moonEl = $('#moon'), todEl = $('#tod-now');
    var lastLabel = '', lastMode = null, lastCardW = 0;

    /* ----- frame ----- */
    var t0 = performance.now() / 1000;
    visibleLoop(stage, function (t, dt) {
      var motion = !reducedMotion;
      if (live && t - lastLive > 1) { hour = liveHour(); lastLive = t; }
      if (playing) { var adv = dt * 1.9; hour = (hour + adv) % 24; played += adv; if (played >= 24) playing = false; }
      if (document.activeElement !== slider) slider.value = String(Math.round(hour * 4) / 4);

      /* day, dusk, night */
      var a = (hour - 6) / 12 * Math.PI, e = Math.sin(a);
      var day = smooth(-0.12, 0.3, e), dusk = Math.exp(-Math.pow(e / 0.24, 2));
      sunL.position.set(Math.cos(a) * 8, Math.max(0.6, e * 8), 4); sunL.intensity = 0.95 * day;
      sunL.color.setRGB(1, 0.82 + 0.18 * smooth(0, 0.5, e), 0.66 + 0.34 * smooth(0, 0.5, e));
      hemi.intensity = 0.28 + 0.6 * day; moonL.intensity = 0.4 * (1 - day);
      hemi.color.setRGB(0.62 + 0.38 * day, 0.68 + 0.32 * day, 0.85 + 0.15 * day);
      M.water.color.copy(C.waterNight).lerp(C.waterDay, day);
      M.win.color.copy(C.winDay).lerp(C.winNight, 1 - day);
      M.bulb.color.copy(C.bulbDay).lerp(C.bulbNight, 1 - day);
      M.cloud.opacity = 0.9 * day; starMat.opacity = 1 - day;
      var top = SKY.nightTop.clone().lerp(SKY.dayTop, day).lerp(SKY.duskTop, dusk * 0.7);
      var bot = SKY.nightBot.clone().lerp(SKY.dayBot, day).lerp(SKY.duskBot, dusk * 0.7);
      stage.style.setProperty('--sky-top', '#' + top.getHexString());
      stage.style.setProperty('--sky-bot', '#' + bot.getHexString());
      var ps = (hour - 6) / 12, pm = ((hour - 18 + 24) % 24) / 12;
      sunEl.style.opacity = ps > 0 && ps < 1 ? String(smooth(0, 0.06, ps) * smooth(1, 0.94, ps)) : '0';
      sunEl.style.left = (8 + ps * 84) + '%'; sunEl.style.top = (62 - Math.sin(Math.PI * clamp(ps, 0, 1)) * 50) + '%';
      moonEl.style.opacity = pm > 0 && pm < 1 ? String(smooth(0, 0.06, pm) * smooth(1, 0.94, pm)) : '0';
      moonEl.style.left = (8 + pm * 84) + '%'; moonEl.style.top = (62 - Math.sin(Math.PI * clamp(pm, 0, 1)) * 50) + '%';

      var info = phaseInfo(hour);
      curInfo = info;
      var label = fmt(hour) + '|' + info.tag;
      if (label !== lastLabel) { lastLabel = label; todEl.innerHTML = (day > 0.5 ? '☀' : '☾') + ' <b>' + fmt(hour) + '</b> AMS · ' + info.tag; }
      if (info.k !== lastMode) { lastMode = info.k; if (!selected) renderCard(); }
      PLACES.forEach(function (p, i) {
        var on = p.id === selected || (!selected && info.ids.indexOf(p.id) >= 0);
        p.beacon.visible = on;
        if (on) { p.beacon.position.y = p.top + 0.32 + (motion ? 0.05 * Math.sin(t * 2.4 + i) : 0); p.beacon.rotation.y = motion ? t * 1.6 : 0; p.beacon.scale.setScalar(p.id === selected ? 1.4 : 1); }
      });

      /* traffic */
      if (motion) {
        var cyc = 14, q = (t % cyc) / cyc, ping = q < 0.5 ? smooth(0.05, 0.45, q) : 1 - smooth(0.55, 0.95, q);
        train.position.x = (A - 1.12) + ping * ((B + 1.12) - (A - 1.12));
        boat.position.set(Math.sin(t * 0.16) * 3.5, -0.34, 1.8); boat.rotation.y = Math.cos(t * 0.16) > 0 ? 0 : Math.PI;
        clouds.children.forEach(function (c, i) { c.position.x = ((c.position.x + dt * (0.12 + i * 0.04) + 6) % 12) - 6; });
      }

      /* Bolt is wherever Stellan would be at this hour */
      if (!boltPlaced) {
        boltPlaced = true;
        var id0 = info.ph === 'work' ? info.ids[(Math.random() * info.ids.length) | 0] : 'home';
        at = id0; holder.position.set(SPOT[id0][0], 0, SPOT[id0][1]); arrivedAt = t;
        if (info.ph === 'sleep') bolt.setSleep(true, true);
      }
      var flying = 0, walking = 0, dirX = 0, dirZ = 0;
      if (trip) {
        var pr = clamp((t - trip.t0) / trip.dur, 0, 1);
        if (trip.kind === 'fly') {
          var ez = pr < 0.5 ? 2 * pr * pr : 1 - Math.pow(-2 * pr + 2, 2) / 2;
          holder.position.lerpVectors(trip.pts[0], trip.pts[1], ez);
          holder.position.y = Math.sin(Math.PI * pr) * (0.35 + trip.len * 0.08);
          dirX = trip.pts[1].x - trip.pts[0].x; dirZ = trip.pts[1].z - trip.pts[0].z;
          flying = Math.sin(Math.PI * pr);
        } else {
          var dd = pr * trip.len, k = 1;
          for (; k < trip.pts.length - 1; k++) { var seg = trip.pts[k].distanceTo(trip.pts[k - 1]); if (dd <= seg) break; dd -= seg; }
          var a0 = trip.pts[k - 1], a1 = trip.pts[k], sl = a1.distanceTo(a0) || 1;
          holder.position.lerpVectors(a0, a1, clamp(dd / sl, 0, 1)); holder.position.y = 0;
          dirX = a1.x - a0.x; dirZ = a1.z - a0.z;
          walking = pr < 1 ? 1 : 0;
        }
        if (Math.abs(dirX) + Math.abs(dirZ) > 0.001) {
          var want = Math.atan2(dirX, dirZ), dw = Math.atan2(Math.sin(want - holder.rotation.y), Math.cos(want - holder.rotation.y));
          holder.rotation.y += dw * (motion ? Math.min(1, dt * 9) : 1);
        }
        if (pr >= 1) {
          if (trip.act) bolt.act(trip.act, trip.wear);
          if (trip.sleepAfter) bolt.setSleep(true);
          trip = null; arrivedAt = t;
        }
      } else {
        var face = yaw, diff = Math.atan2(Math.sin(face - holder.rotation.y), Math.cos(face - holder.rotation.y));
        holder.rotation.y += diff * (motion ? Math.min(1, dt * 4) : 1);
      }
      /* autopilot: follow the schedule unless someone just picked a place */
      if (!trip && performance.now() > override && performance.now() - lastInput > 6000) {
        if (info.ph === 'sleep') {
          if (at !== 'home') goTo('home', true); else if (!bolt.busy(t)) bolt.setSleep(true);
        } else {
          bolt.setSleep(false);
          var dwell = info.ph === 'work' ? 4 : 6;
          if (info.ids.indexOf(at) < 0) goTo(info.ids[(Math.random() * info.ids.length) | 0], true);
          else if (!bolt.busy(t) && t - arrivedAt > dwell && info.ids.length > 1) {
            var pool = info.ids.filter(function (id) { return id !== at; });
            goTo(pool[(Math.random() * pool.length) | 0], true);
          }
        }
      }
      bolt.step(t, dt, flying, walking);

      /* orbit */
      if (!drag) {
        yaw += vyaw; vyaw *= 0.92;
        if (motion && performance.now() - lastInput > 4000) yaw += Math.sin(t * 0.25) * 0.0008;
      }
      placeCamera();

      /* labels: nearest first, skip overlaps */
      var placed = [], items = [];
      labels.forEach(function (L) {
        _v.copy(L.pos).project(cam);
        L.sx = (_v.x * 0.5 + 0.5) * W; L.sy = (-_v.y * 0.5 + 0.5) * H; L.z = _v.z;
        items.push(L);
      });
      items.sort(function (x, y) {
        var px = x.isle ? 2 : x.place.id === selected ? 3 : 0, py = y.isle ? 2 : y.place.id === selected ? 3 : 0;
        return py - px || x.z - y.z;
      });
      items.forEach(function (L) {
        var el = L.el;
        if (!L.w) L.w = el.offsetWidth || 60;
        var rx = L.sx - L.w / 2, ry = L.sy - 22, ok = rx > 2 && rx + L.w < W - 2 && ry > 2 && ry < H - 18;
        for (var i = 0; i < placed.length && ok; i++) {
          var o = placed[i];
          if (rx < o[0] + o[2] + 4 && rx + L.w + 4 > o[0] && ry < o[1] + 18 && ry + 18 > o[1]) ok = false;
        }
        if (ok) {
          placed.push([rx, ry, L.w]);
          el.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
          el.style.opacity = '1';
          if (!L.isle) el.classList.toggle('hot', L.place.id === selected || L.place.id === hover);
        } else if (el.style.opacity !== '0') el.style.opacity = '0';
      });

      renderer.clear();
      cam.layers.set(0); renderer.render(scene, cam);
      cam.layers.set(1); scene.overrideMaterial = ghostMat; renderer.render(scene, cam); scene.overrideMaterial = null;
      cam.layers.set(2); renderer.render(scene, cam);
      cam.layers.set(0);
    });

    renderCard();
    setTimeout(function () { if (!selected && phaseOf(hour) !== 'sleep') bolt.act('wave'); }, 900);
    return { select: select };
  }

  /* ================= BOLT: the robot rig (shared with the earlier versions) ================= */
  function makeBolt(THREE) {
    var scene = new THREE.Scene();
    var VIEW_H = 6.8, BELOW = 0.85, ASPECT = 0.74;
    var camera = new THREE.PerspectiveCamera(28, ASPECT, 0.1, 80);
    var dist = VIEW_H / (2 * Math.tan(14 * Math.PI / 180));
    var lookY = VIEW_H / 2 - BELOW;
    camera.position.set(0, lookY + 1.1, dist);
    camera.lookAt(0, lookY, 0);
    camera.updateMatrixWorld();
    function fracY(y) { var v = new THREE.Vector3(0, y, 0).project(camera); return (1 - v.y) / 2; }
    var FY = fracY(0), TOPY = fracY(4.4);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.8));
    var key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(-3, 6, 6); scene.add(key);
    var rim = new THREE.PointLight(0x00e5a0, 1.3, 16); rim.position.set(2.8, 3.6, -2.5); scene.add(rim);

    var M = {
      fill: new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.12 }),
      hat: new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
      lens: new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.6 }),
      line: new THREE.MeshBasicMaterial({ side: THREE.BackSide }),
      glow: new THREE.MeshBasicMaterial({}),
      tip: new THREE.MeshBasicMaterial({ transparent: true }),
      ring: new THREE.MeshBasicMaterial({ transparent: true })
    };

    /* --- modelling helpers: rounded boxes and a constant-width outline hull --- */
    function rrShape(w, h, r) {
      var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    function roundedBox(w, h, d, r, b) {
      var g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(0.01, r - b)), {
        depth: Math.max(0.01, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 8
      });
      g.center();
      return g;
    }
    var T = 0.055;
    function part(geo, mat, t) {
      var g = new THREE.Group();
      g.add(new THREE.Mesh(geo, mat));
      if (t) {
        geo.computeBoundingBox();
        var s = new THREE.Vector3(); geo.boundingBox.getSize(s);
        var o = new THREE.Mesh(geo, M.line);
        o.scale.set((s.x + 2 * t) / s.x, (s.y + 2 * t) / s.y, (s.z + 2 * t) / s.z);
        g.add(o);
      }
      return g;
    }

    /* --- the hover-pad --- */
    var world = new THREE.Group(); scene.add(world);
    var pad = new THREE.Group(); world.add(pad);
    var padDisc = part(new THREE.CylinderGeometry(1.25, 1.12, 0.14, 40), M.fill, T);
    padDisc.position.y = -0.07; pad.add(padDisc);
    var padRing = new THREE.Mesh(new THREE.TorusGeometry(1.19, 0.045, 8, 56), M.ring);
    padRing.rotation.x = Math.PI / 2; padRing.position.y = -0.15; pad.add(padRing);
    var gc = document.createElement('canvas'); gc.width = gc.height = 128;
    var gctx = gc.getContext('2d'), grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
    gctx.fillStyle = grad; gctx.fillRect(0, 0, 128, 128);
    var glowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false });
    var padGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), glowMat);
    padGlow.rotation.x = -Math.PI / 2; padGlow.position.y = -0.6; world.add(padGlow);

    /* --- the rig --- */
    var root = new THREE.Group(); root.rotation.order = 'ZYX'; world.add(root);
    var hips = new THREE.Group(); hips.position.y = 1.12; root.add(hips);
    hips.add(part(roundedBox(0.92, 0.32, 0.62, 0.14, 0.05), M.fill, T));
    var torso = new THREE.Group(); torso.position.y = 0.1; hips.add(torso);
    var chest = part(roundedBox(1.25, 1.0, 0.8, 0.3, 0.1), M.fill, T);
    chest.position.y = 0.52; torso.add(chest);
    var chestLight = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 18), M.tip);
    chestLight.rotation.x = Math.PI / 2; chestLight.position.set(0.3, 0.74, 0.42); torso.add(chestLight);

    function limb(len, r) {
      var pivot = new THREE.Group();
      var seg = part(new THREE.CylinderGeometry(r, r * 0.9, len, 14), M.fill, T * 0.8);
      seg.position.y = -len / 2; pivot.add(seg);
      pivot.add(part(new THREE.SphereGeometry(r * 1.12, 16, 12), M.fill, T * 0.8));
      var end = new THREE.Group(); end.position.y = -len; pivot.add(end);
      return { pivot: pivot, end: end };
    }
    var arms = {}, legs = {};
    [1, -1].forEach(function (s) {           // +1 = Bolt's left (screen right)
      var up = limb(0.55, 0.12);
      up.pivot.position.set(s * 0.74, 0.87, 0); up.pivot.rotation.order = 'ZXY'; torso.add(up.pivot);
      var lo = limb(0.5, 0.11); up.end.add(lo.pivot);
      var hand = new THREE.Group(); hand.position.y = -0.56; lo.pivot.add(hand);
      hand.add(part(new THREE.SphereGeometry(0.16, 16, 12), M.fill, T * 0.8));
      arms[s] = { sh: up.pivot, el: lo.pivot, hand: hand };
      var th = limb(0.47, 0.135); th.pivot.position.set(s * 0.3, -0.04, 0); hips.add(th.pivot);
      var sn = limb(0.45, 0.125); th.end.add(sn.pivot);
      var foot = part(roundedBox(0.44, 0.22, 0.64, 0.1, 0.05), M.fill, T * 0.8);
      foot.position.set(0, -0.5, 0.1); sn.pivot.add(foot);
      legs[s] = { hip: th.pivot, knee: sn.pivot };
    });
    var neck = part(new THREE.CylinderGeometry(0.15, 0.17, 0.24, 14), M.fill, T * 0.8);
    neck.position.y = 1.08; torso.add(neck);
    var headPivot = new THREE.Group(); headPivot.position.y = 1.16; torso.add(headPivot);
    var head = new THREE.Group(); head.position.y = 0.8; headPivot.add(head);

    /* --- head (same face as the line-art Bolt) --- */
    head.add(part(roundedBox(2.0, 1.6, 1.2, 0.5, 0.14), M.fill, 0.07));
    var earGeo = roundedBox(0.56, 0.74, 0.3, 0.14, 0.06);
    [-1, 1].forEach(function (sx) {
      var ear = part(earGeo, M.fill, T);
      ear.rotation.y = Math.PI / 2; ear.position.set(sx * 1.17, -0.04, 0); head.add(ear);
    });
    var antenna = new THREE.Group();
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.46, 10), M.glow); stem.position.y = 1.02;
    var tip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 12), M.tip); tip.position.y = 1.32;
    antenna.add(stem, tip); head.add(antenna);
    var eyes = new THREE.Group();
    var eyeGeo = new THREE.SphereGeometry(0.17, 20, 14);
    var eyeL = new THREE.Mesh(eyeGeo, M.glow), eyeR = new THREE.Mesh(eyeGeo, M.glow);
    eyeL.position.set(-0.44, 0.1, 0.6); eyeR.position.set(0.44, 0.1, 0.6);
    eyes.add(eyeL, eyeR); head.add(eyes);
    var mouthFlat = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 10), M.glow);
    mouthFlat.rotation.z = Math.PI / 2; mouthFlat.position.set(0, -0.36, 0.61);
    var mouthHappy = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.05, 8, 24, Math.PI), M.glow);
    mouthHappy.rotation.z = Math.PI; mouthHappy.position.set(0, -0.2, 0.61);
    var mouthO = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.05, 8, 20), M.glow);
    mouthO.position.set(0, -0.37, 0.61);
    head.add(mouthFlat, mouthHappy, mouthO);

    /* --- accessories on the head --- */
    var chef = new THREE.Group();
    var band = part(new THREE.CylinderGeometry(0.6, 0.56, 0.42, 28), M.hat, T); band.position.y = 0.98; chef.add(band);
    [[-0.38, 1.4, 0.05, 0.36], [0.38, 1.4, 0.05, 0.36], [0, 1.52, -0.16, 0.4], [0, 1.44, 0.24, 0.33]].forEach(function (p) {
      var puff = part(new THREE.SphereGeometry(p[3], 20, 14), M.hat, T); puff.position.set(p[0], p[1], p[2]); chef.add(puff);
    });
    var cap = new THREE.Group(), capBody = new THREE.Group(); cap.add(capBody);
    var skull = part(new THREE.CylinderGeometry(0.72, 0.8, 0.36, 28), M.fill, T); skull.position.y = 0.92; capBody.add(skull);
    var board = part(new THREE.BoxGeometry(2.05, 0.08, 2.05), M.fill, T * 0.7); board.rotation.y = Math.PI / 4; board.position.y = 1.13; capBody.add(board);
    var button = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), M.glow); button.position.y = 1.2; capBody.add(button);
    var cord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 8), M.glow); cord.rotation.z = Math.PI / 2; cord.position.set(0.72, 1.19, 0); capBody.add(cord);
    var hang = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), M.glow); hang.position.set(1.43, 0.92, 0); capBody.add(hang);
    var tassel = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 12), M.glow); tassel.position.set(1.43, 0.6, 0); capBody.add(tassel);
    var shades = new THREE.Group();
    var lensGeo = roundedBox(0.7, 0.46, 0.1, 0.15, 0.03);
    [-0.44, 0.44].forEach(function (x) {
      var lens = part(lensGeo, M.lens, 0.035); lens.position.set(x, 0.11, 0.66); shades.add(lens);
    });
    var bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), M.glow);
    bridge.rotation.z = Math.PI / 2; bridge.position.set(0, 0.17, 0.66); shades.add(bridge);
    var spark = new THREE.Group();
    var bs = new THREE.Shape();
    bs.moveTo(0.12, 0.42); bs.lineTo(-0.15, 0.0); bs.lineTo(0.02, 0.0); bs.lineTo(-0.1, -0.42);
    bs.lineTo(0.18, 0.06); bs.lineTo(0.02, 0.06); bs.closePath();
    var sparkMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bs, { depth: 0.06, bevelEnabled: false }), M.glow);
    sparkMesh.position.set(1.12, 1.25, 0.1); sparkMesh.rotation.z = -0.2; spark.add(sparkMesh);
    var accs = { 'wear-chef': chef, 'wear-cap': cap, 'wear-shades': shades, spark: spark };
    Object.keys(accs).forEach(function (k) { var g = accs[k]; g.visible = false; g.userData.k = 0; head.add(g); });

    /* --- props for the moves --- */
    var props = {};
    function prop(name, obj, parent) { obj.visible = false; obj.userData.k = 0; (parent || world).add(obj); props[name] = obj; return obj; }

    var bar = new THREE.Group();                                    // pull-up bar
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.55, 12), M.glow);
    rod.rotation.z = Math.PI / 2; rod.position.set(0, 3.2, 0.75); bar.add(rod);
    [-1.75, 1.75].forEach(function (x) {
      var post = part(new THREE.CylinderGeometry(0.06, 0.07, 3.25, 10), M.fill, T * 0.8); post.position.set(x, 1.6, 0.75); bar.add(post);
    });
    prop('bar', bar);

    var laptop = new THREE.Group(); laptop.position.set(0, 1.55, 1.02);   // in Bolt's own space
    laptop.add(part(roundedBox(1.3, 0.07, 0.82, 0.08, 0.02), M.fill, T * 0.7));
    var lid = new THREE.Group(); lid.position.set(0, 0.03, 0.41); lid.rotation.x = 0.22; laptop.add(lid);
    var lidPanel = part(roundedBox(1.3, 0.86, 0.05, 0.08, 0.015), M.fill, T * 0.7); lidPanel.position.y = 0.43; lid.add(lidPanel);
    var logo = new THREE.Mesh(new THREE.CircleGeometry(0.09, 20), M.tip); logo.position.set(0, 0.45, 0.032); lid.add(logo);
    prop('laptop', laptop, root);

    var pan = new THREE.Group();                                   // frying pan, follows the right hand
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 8), M.glow);
    handle.rotation.z = Math.PI / 2; handle.position.x = -0.25; pan.add(handle);
    var dish = part(new THREE.CylinderGeometry(0.36, 0.3, 0.08, 24), M.fill, T * 0.8); dish.position.x = -0.78; pan.add(dish);
    var cake = part(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), M.hat, T * 0.6); cake.position.set(-0.78, 0.07, 0); pan.add(cake);
    prop('pan', pan);

    var crate = new THREE.Group(); crate.position.set(0, 1.42, 0.8);      // shop crate, in Bolt's own space
    crate.add(part(roundedBox(1.0, 0.62, 0.62, 0.06, 0.03), M.fill, T * 0.8));
    [-0.15, 0.15].forEach(function (y) {
      var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.04, 0.02), M.glow); stripe.position.set(0, y, 0.33); crate.add(stripe);
    });
    prop('crate', crate, root);

    var pizza = new THREE.Group();                                 // delivery box, balanced on the right hand
    pizza.rotation.x = 0.35;
    var pbox = part(roundedBox(1.0, 0.13, 1.0, 0.04, 0.02), M.hat, T * 0.8); pbox.position.y = 0.2; pizza.add(pbox);
    var pstripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.06), M.glow); pstripe.position.set(0, 0.28, 0.2); pizza.add(pstripe);
    prop('pizza', pizza);

    var bell = new THREE.Group();                                  // dumbbell, follows the right hand
    var bh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.52, 8), M.glow); bh.rotation.z = Math.PI / 2; bell.add(bh);
    [-0.25, 0.25].forEach(function (x) {
      var pl = part(new THREE.CylinderGeometry(0.19, 0.19, 0.11, 18), M.fill, T * 0.8); pl.rotation.z = Math.PI / 2; pl.position.x = x; bell.add(pl);
    });
    prop('bell', bell);


    /* --- two-bone IK for the arms (hands on the floor, the bar, a crate, a keyboard) --- */
    var A_LEN = 0.55, B_LEN = 0.56;
    var _t = new THREE.Vector3(), _p = new THREE.Vector3(), _u = new THREE.Vector3(), _pv = new THREE.Vector3(),
        _up = new THREE.Vector3(), _e = new THREE.Vector3(), _tc = new THREE.Vector3(), _fo = new THREE.Vector3(),
        _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3(), _tmp = new THREE.Vector3(),
        _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
    function solveIK(arm, targetW, poleW, w) {
      var Tl = torso.worldToLocal(_t.copy(targetW));
      var Pl = torso.worldToLocal(_p.copy(poleW));
      var S = arm.sh.position;
      _u.subVectors(Tl, S);
      var d = clamp(_u.length(), 0.08, A_LEN + B_LEN - 0.002);
      _u.normalize();
      var A = Math.acos(clamp((A_LEN * A_LEN + d * d - B_LEN * B_LEN) / (2 * A_LEN * d), -1, 1));
      _pv.subVectors(Pl, S); _pv.sub(_tmp.copy(_u).multiplyScalar(_pv.dot(_u)));
      if (_pv.lengthSq() < 1e-6) _pv.set(0, -1, 0);
      _pv.normalize();
      _up.copy(_u).multiplyScalar(Math.cos(A)).add(_tmp.copy(_pv).multiplyScalar(Math.sin(A))).normalize();
      _e.copy(S).add(_tmp.copy(_up).multiplyScalar(A_LEN));
      _tc.copy(S).add(_tmp.copy(_u).multiplyScalar(d));
      _fo.subVectors(_tc, _e).normalize();
      _y.copy(_up).negate();
      _z.copy(_fo).sub(_tmp.copy(_up).multiplyScalar(_fo.dot(_up)));
      if (_z.lengthSq() < 1e-6) _z.copy(_pv).negate();
      _z.normalize();
      _x.crossVectors(_y, _z).normalize();
      _m.makeBasis(_x, _y, _z);
      _q.setFromRotationMatrix(_m);
      var bend = Math.acos(clamp(_up.dot(_fo), -1, 1));
      arm.sh.quaternion.slerp(_q, w);
      arm.el.rotation.x += (-bend - arm.el.rotation.x) * w;
    }

    /* --- poses --- */
    var NUM = ['x', 'y', 'rx', 'ry', 'rz', 'hry', 'hrz', 'trx', 'trz', 'lsx', 'lsy', 'lsz', 'lel', 'rsx', 'rsy', 'rsz', 'rel',
               'lhx', 'lhz', 'lkn', 'rhx', 'rhz', 'rkn', 'nx', 'ny', 'nz', 'pad', 'look', 'ikW'];
    function basePose() {
      return { x: 0, y: 0, rx: 0, ry: 0, rz: 0, hry: 0, hrz: 0, trx: 0, trz: 0,
        lsx: 0, lsy: 0, lsz: 0.12, lel: -0.15, rsx: 0, rsy: 0, rsz: -0.12, rel: -0.15,
        lhx: 0, lhz: 0.02, lkn: 0, rhx: 0, rhz: -0.02, rkn: 0,
        nx: 0, ny: 0, nz: 0, pad: 1, look: 1, ikW: 0, ikMode: null, face: null, props: {}, lt: 0, name: 'idle' };
    }
    function sm(a, b, x) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
    function env(t, d, a, b) { return sm(0, a, t) * (1 - sm(d - b, d, t)); }
    function mix(a, b, k) { return a + (b - a) * k; }
    function walk(p, t, w, amp) {
      var s1 = Math.sin(t * w);
      p.lhx = amp * s1; p.rhx = -p.lhx;
      p.lkn = amp * 1.3 * Math.max(0, s1); p.rkn = amp * 1.3 * Math.max(0, -s1);
      p.y += amp * 0.14 * Math.abs(Math.cos(t * w));
    }

    var DUR = { wave: 2.8, think: 3.4, type: 4.2, cook: 3.8, carry: 3.4, deliver: 3.4, graduate: 3.4, curl: 3.8,
                run: 3.8, point: 2.8, pushups: 4.6, pullups: 4.8, dance: 4.6, overclock: 1.8, cheer: 2.2 };
    var MOVES = {
      idle: function (p, t) {
        p.trx = 0.025 * Math.sin(t * 1.3); p.hrz = 0.03 * Math.sin(t * 0.6);
        p.lsz = 0.12 + 0.03 * Math.sin(t * 1.3); p.rsz = -p.lsz;
      },
      wave: function (p, t, d) {
        var e = env(t, d, 0.35, 0.5), w = Math.sin(t * 10);
        p.rsz = mix(p.rsz, -1.45, e); p.rsy = -1.5 * e; p.rsx = -0.25 * e;
        p.rel = mix(p.rel, -(1.35 + 0.4 * w), e); p.nz = 0.1 * e; p.hrz = -0.04 * e; p.face = 'happy';
      },
      think: function (p, t, d) {
        var e = env(t, d, 0.4, 0.5);
        p.rsx = -0.55 * e; p.rsz = mix(p.rsz, 0.3, e); p.rel = mix(p.rel, -2.25, e);
        p.lsx = -0.45 * e; p.lsz = mix(p.lsz, -0.15, e); p.lel = mix(p.lel, -1.35, e);
        p.nx = -0.18 * e; p.nz = 0.14 * e; p.look = 1 - 0.8 * e; p.hrz = 0.04 * e;
      },
      type: function (p, t, d) {
        var e = env(t, d, 0.45, 0.5);
        p.props.laptop = 1; p.ikMode = 'keys'; p.ikW = e;
        p.nx = 0.28 * e; p.look = 1 - 0.75 * e; p.trx = 0.05 * e;
      },
      cook: function (p, t, d) {
        var e = env(t, d, 0.4, 0.5), ph = (t % 1.25) / 1.25, flick = ph < 0.2 ? Math.sin(ph / 0.2 * Math.PI) : 0;
        p.props.pan = 1;
        p.rsz = mix(p.rsz, -0.55, e); p.rsx = -0.55 * e; p.rel = mix(p.rel, -0.55, e);
        p.rsx -= 0.4 * flick * e; p.flip = ph; p.face = 'happy'; p.nx = 0.12 * e; p.ny = -0.3 * e; p.look = 1 - e;
        p.lsz = mix(p.lsz, 0.55, e); p.lsy = 1.4 * e; p.lel = mix(p.lel, -1.6, e);
      },
      carry: function (p, t, d) {
        var e = env(t, d, 0.4, 0.5);
        p.props.crate = 1; p.ikMode = 'crate'; p.ikW = e;
        walk(p, t, 6, 0.3 * e); p.trx = -0.05 * e;
      },
      deliver: function (p, t, d) {
        var e = env(t, d, 0.4, 0.5);
        p.props.pizza = 1;
        p.rsz = mix(p.rsz, -1.15, e); p.rsy = -1.5 * e; p.rsx = -0.1 * e; p.rel = mix(p.rel, -1.75, e);
        walk(p, t, 9, 0.45 * e); p.lsx = -0.5 * Math.sin(t * 9) * e; p.lel = mix(p.lel, -1.2, e); p.face = 'happy';
      },
      graduate: function (p, t, d) {
        var toss = sm(0.5, 0.75, t) * (1 - sm(1.9, 2.4, t));
        p.lsz = mix(p.lsz, 2.55, toss); p.rsz = mix(p.rsz, -2.55, toss); p.lsx = p.rsx = -0.2 * toss;
        var jump = t > 0.45 && t < 0.95 ? Math.sin((t - 0.45) / 0.5 * Math.PI) : 0;
        p.y = 0.4 * jump; p.lkn = p.rkn = 0.45 * jump; p.lhx = p.rhx = -0.2 * jump;
        p.cap = t; p.face = 'happy'; p.nx = -0.2 * toss; p.look = 1 - toss;
      },
      curl: function (p, t, d) {
        var e = env(t, d, 0.35, 0.5);
        var c = t > 0.4 && t < d - 0.45 ? 0.5 - 0.5 * Math.cos((t - 0.4) / 0.98 * Math.PI * 2) : 0;
        p.props.bell = 1;
        p.rsx = -0.12 * e; p.rsz = mix(p.rsz, -0.2, e); p.rel = mix(p.rel, -(0.2 + 2.0 * c), e);
        p.lsz = mix(p.lsz, 0.6, e); p.lsy = 1.4 * e; p.lel = mix(p.lel, -1.6, e);
        p.trx = -0.05 * c * e; p.face = c > 0.85 ? 'surprised' : null; p.nx = 0.12 * c;
      },
      run: function (p, t, d) {
        var e = env(t, d, 0.4, 0.5), w = 9.5, s1 = Math.sin(w * t);
        p.ry = -0.85 * e; p.trx = 0.16 * e;
        p.lhx = 0.75 * s1 * e; p.rhx = -p.lhx;
        p.lkn = (0.25 + 1.0 * Math.max(0, s1)) * e; p.rkn = (0.25 + 1.0 * Math.max(0, -s1)) * e;
        p.lsx = -0.8 * s1 * e; p.rsx = 0.8 * s1 * e; p.lel = p.rel = mix(-0.15, -1.45, e);
        p.lsz = mix(p.lsz, 0.1, e); p.rsz = mix(p.rsz, -0.1, e);
        p.y = 0.14 * Math.abs(Math.cos(w * t)) * e; p.look = 1 - 0.6 * e; p.face = 'happy';
      },
      point: function (p, t, d) {
        var e = env(t, d, 0.3, 0.5), hop = t < 0.45 ? Math.sin(t / 0.45 * Math.PI) : 0;
        p.y = 0.4 * hop; p.lkn = p.rkn = 0.3 * hop;
        p.rsz = mix(p.rsz, -1.5, e); p.rsx = -0.4 * e; p.rel = mix(p.rel, -0.08, e);
        p.ny = -0.45 * e; p.look = 1 - e; p.face = 'happy'; p.lsz = mix(p.lsz, 0.2, e);
      },
      pushups: function (p, t, d) {
        var b = sm(0.05, 0.75, t) * (1 - sm(d - 0.75, d - 0.05, t));
        var rep = t > 0.8 && t < d - 0.8 ? 0.5 - 0.5 * Math.cos((t - 0.8) / 1.0 * Math.PI * 2) : 0;
        var phi = 0.3 - 0.19 * rep;
        p.rx = Math.PI / 2 * b; p.ry = -Math.PI / 2 * b; p.rz = -phi * b;
        p.x = 1.9 * b; p.y = 0.41 * b;
        p.lsz = mix(p.lsz, 0, b); p.rsz = mix(p.rsz, 0, b); p.lhz = p.rhz = 0;
        p.ikMode = 'floor'; p.ikW = sm(0.3, 0.75, t) * (1 - sm(d - 0.75, d - 0.35, t));
        p.nx = -0.35 * b; p.look = 1 - b; p.pad = 1 + 0.8 * b; p.face = rep > 0.75 ? 'surprised' : null;
      },
      pullups: function (p, t, d) {
        p.props.bar = 1;
        var up = sm(0.1, 0.5, t) * (1 - sm(d - 0.9, d - 0.5, t));
        var hang = sm(0.5, 0.85, t) * (1 - sm(d - 1.05, d - 0.65, t));
        var rep = t > 0.85 && t < d - 1.05 ? 0.5 - 0.5 * Math.cos((t - 0.85) / 0.95 * Math.PI * 2) : 0;
        var crouch = sm(0.15, 0.4, t) * (1 - sm(0.45, 0.6, t)) + sm(d - 0.65, d - 0.45, t) * (1 - sm(d - 0.35, d - 0.05, t));
        p.lsz = mix(p.lsz, 2.6, up); p.rsz = mix(p.rsz, -2.6, up); p.lsx = p.rsx = -0.3 * up;
        p.lel = p.rel = mix(-0.15, -0.3, up);
        p.y = -0.18 * crouch + hang * (0.58 + 0.55 * rep);
        p.lkn = p.rkn = 0.6 * crouch + hang * 0.9; p.lhx = p.rhx = -hang * 0.45;
        p.ikMode = 'bar'; p.ikW = hang;
        p.look = 1 - hang * 0.8; p.face = rep > 0.7 ? 'happy' : null;
      },
      dance: function (p, t, d) {
        var e = env(t, d, 0.3, 0.5), w = Math.PI * 2 * 2.1, beat = Math.floor(t * 2.1);
        var half = Math.sin(w * t / 2), bounce = 0.5 - 0.5 * Math.cos(w * t);
        p.x = 0.2 * half * e; p.hrz = 0.12 * half * e; p.trz = -0.08 * half * e;
        p.y = -0.06 * bounce * e; p.lkn = p.rkn = 0.28 * bounce * e; p.lhx = p.rhx = -0.14 * bounce * e;
        p.nx = 0.12 * Math.sin(w * t) * e; p.face = 'happy'; p.look = 1 - e;
        if (t < 2.0) {
          var hi = beat % 2 === 0;
          p.rsz = mix(p.rsz, hi ? -2.5 : 0.35, e); p.rsx = (hi ? -0.2 : -0.7) * e; p.rel = mix(p.rel, hi ? -0.05 : -0.3, e);
          p.lsz = mix(p.lsz, 0.75, e); p.lsy = 1.4 * e; p.lel = mix(p.lel, -1.7, e);
        } else if (t < 3.6) {
          var pump = 0.5 + 0.5 * Math.sin(w * t);
          p.lsz = mix(p.lsz, 2.5, e); p.rsz = mix(p.rsz, -2.5, e);
          p.lel = p.rel = mix(-0.15, -0.5 - 0.9 * pump, e); p.lsy = 1.5 * e; p.rsy = -1.5 * e;
        } else {
          p.ry = Math.PI * 2 * sm(3.6, d - 0.15, t);
          p.lsz = mix(p.lsz, 1.3, e); p.rsz = mix(p.rsz, -1.3, e);
        }
      },
      overclock: function (p, t) {
        var q = clamp(t / 1.6, 0, 1), ez = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2, fl = Math.sin(t * 20);
        p.ry = ez * Math.PI * 4; p.rz = Math.sin(q * Math.PI * 6) * 0.2 * (1 - q); p.y = 0.6 * Math.sin(Math.PI * q);
        p.lsz = 1.6 + 0.4 * fl; p.rsz = -1.6 + 0.4 * fl; p.lkn = p.rkn = 0.5 * Math.sin(Math.PI * q);
        p.face = 'surprised'; p.look = 0;
      },
      cheer: function (p, t, d) {
        var e = env(t, d, 0.25, 0.5), hop = t < 0.5 ? Math.sin(t / 0.5 * Math.PI) : 0;
        p.y = 0.35 * hop; p.lkn = p.rkn = 0.3 * hop;
        p.lsz = mix(p.lsz, 2.4, e); p.rsz = mix(p.rsz, -2.4, e); p.lel = p.rel = mix(-0.15, -0.35, e); p.face = 'happy';
      }
    };

    function applyPose(p, yaw, pitch, bank) {
      root.position.set(p.x, p.y, 0);
      root.rotation.set(p.rx, p.ry, p.rz + bank);
      hips.rotation.set(0, p.hry, p.hrz);
      torso.rotation.set(p.trx, 0, p.trz);
      arms[1].sh.rotation.set(p.lsx, p.lsy, p.lsz); arms[1].el.rotation.set(p.lel, 0, 0);
      arms[-1].sh.rotation.set(p.rsx, p.rsy, p.rsz); arms[-1].el.rotation.set(p.rel, 0, 0);
      legs[1].hip.rotation.set(p.lhx, 0, p.lhz); legs[1].knee.rotation.set(p.lkn, 0, 0);
      legs[-1].hip.rotation.set(p.rhx, 0, p.rhz); legs[-1].knee.rotation.set(p.rkn, 0, 0);
      headPivot.rotation.set(p.nx + pitch * p.look, p.ny + yaw * p.look, p.nz);
      pad.scale.set(p.pad, 1, 1 + (p.pad - 1) * 0.2);
    }

    var _sw = new THREE.Vector3(), _tg = new THREE.Vector3(), _pl = new THREE.Vector3(), _hw = new THREE.Vector3();
    function doIK(p, t) {
      if (!p.ikMode || p.ikW < 0.002) return;
      world.updateMatrixWorld(true);
      [1, -1].forEach(function (s) {
        var arm = arms[s];
        arm.sh.getWorldPosition(_sw); world.worldToLocal(_sw);
        switch (p.ikMode) {
          case 'floor':
            _tg.set(_sw.x - 0.08, 0.16, _sw.z); _pl.set(_sw.x + 0.8, _sw.y + 1.2, _sw.z); break;
          case 'bar':
            _tg.set(s * 1.15, 3.2, 0.75); _pl.set(_sw.x + s * 1.6, _sw.y - 0.8, _sw.z + 0.4); break;
          case 'crate':
            _tg.set(s * 0.52, 1.42, 0.8).applyMatrix4(root.matrix); _pl.set(_sw.x + s * 1.2, _sw.y - 0.9, _sw.z - 0.2); break;
          case 'keys':
            var tap = Math.sin(t * 17 + (s > 0 ? 0 : 1.7));
            _tg.set(s * 0.3 + 0.03 * tap, 1.66 + 0.05 * Math.max(0, tap), 0.85).applyMatrix4(root.matrix);
            _pl.set(_sw.x + s * 0.9, _sw.y - 1.0, _sw.z - 0.2); break;
        }
        world.localToWorld(_tg); world.localToWorld(_pl);
        solveIK(arm, _tg, _pl, p.ikW);
      });
    }


    var flags = { set: {}, contains: function (k) { return !!this.set[k]; } }, timers = {};
    function flag(k, ms) {
      flags.set[k] = true; clearTimeout(timers[k]);
      timers[k] = setTimeout(function () { delete flags.set[k]; }, ms || 900);
    }
    var activity = { name: 'idle', t0: 0 };
    (function blinkLoop() { if (!reducedMotion) flag('blink', 150); setTimeout(blinkLoop, 2600 + Math.random() * 3200); })();
    var cur = basePose(), st = { eyeY: 1, eyeS: 1, ey: 0 };

    /* sleeping mask (closed eyes printed on it) and floating Zs */
    var mask = new THREE.Group();
    var band = part(roundedBox(2.06, 0.5, 0.12, 0.22, 0.04), M.lens, 0.04); band.position.set(0, 0.1, 0.64); mask.add(band);
    [-0.44, 0.44].forEach(function (x) {
      var lid = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 6, 18, Math.PI), M.glow);
      lid.rotation.z = Math.PI; lid.position.set(x, 0.17, 0.71); mask.add(lid);
    });
    mask.visible = false; mask.userData.k = 0; head.add(mask); accs['wear-mask'] = mask;
    var zsh = new THREE.Shape();
    zsh.moveTo(-0.22, 0.22); zsh.lineTo(0.22, 0.22); zsh.lineTo(0.22, 0.14); zsh.lineTo(-0.1, -0.14); zsh.lineTo(0.22, -0.14);
    zsh.lineTo(0.22, -0.22); zsh.lineTo(-0.22, -0.22); zsh.lineTo(-0.22, -0.14); zsh.lineTo(0.1, 0.14); zsh.lineTo(-0.22, 0.14); zsh.closePath();
    var zGeo = new THREE.ExtrudeGeometry(zsh, { depth: 0.06, bevelEnabled: false }); zGeo.center();
    var zs = [0, 1, 2].map(function () {
      var z = new THREE.Mesh(zGeo, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }));
      z.visible = false; world.add(z); return z;
    });
    var sleeping = false, sleepK = 0;
    function setSleep(on, instant) { sleeping = !!on; if (instant) sleepK = on ? 1 : 0; }
    function sleepPose(p, t, b) {
      p.rx = mix(p.rx, -Math.PI / 2, b); p.ry = mix(p.ry, Math.PI / 2, b); p.rz = mix(p.rz, 0, b);
      p.x = mix(p.x, 1.9, b); p.y = mix(p.y, 0.43 + 0.012 * Math.sin(t * 1.2), b);
      p.lsx = mix(p.lsx, 0, b); p.rsx = mix(p.rsx, 0, b); p.lsy = mix(p.lsy, 0, b); p.rsy = mix(p.rsy, 0, b);
      p.lsz = mix(p.lsz, 0.18, b); p.rsz = mix(p.rsz, -0.18, b); p.lel = mix(p.lel, -0.1, b); p.rel = mix(p.rel, -0.1, b);
      p.lhx = mix(p.lhx, 0, b); p.rhx = mix(p.rhx, 0, b); p.lkn = mix(p.lkn, 0, b); p.rkn = mix(p.rkn, 0, b);
      p.nx = mix(p.nx, 0, b); p.ny = mix(p.ny, 0, b); p.nz = mix(p.nz, 0, b); p.look *= 1 - b; p.pad = mix(p.pad, 1.8, b);
    }
    function backOut(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

    function setTheme(accentHex, dark) {
      M.fill.color.set(dark ? '#1B1F27' : '#FFFFFF');
      M.hat.color.set(dark ? '#ECEEF1' : '#FFFFFF');
      M.lens.color.set('#0B0D12');
      [M.line, M.glow, M.tip, M.ring].forEach(function (m) { m.color.set(accentHex); });
      zs.forEach(function (z) { z.material.color.set(accentHex); });
      rim.color.set(accentHex);
      glowMat.color.set(dark ? accentHex : '#000000');
      glowMat.opacity = dark ? 0.22 : 0.1;
    }
    function act(name, wear) {
      if (reducedMotion || !MOVES[name]) return;
      activity = { name: name, t0: performance.now() / 1000 };
      ['wear-chef', 'wear-cap', 'wear-shades', 'spark'].forEach(function (k) { delete flags.set[k]; });
      if (wear) flag(wear, (DUR[name] || 3) * 1000 + 300);
      flag(name === 'think' ? 'look-u' : 'happy', (DUR[name] || 2) * 800);
    }
    function busy(t) { return activity.name !== 'idle' && t - activity.t0 < (DUR[activity.name] || 0); }

    function step(t, dt, fly, walking) {
      var c = flags, f = Math.min(dt * 60, 3), motion = !reducedMotion;
      var name = activity.name, lt = t - activity.t0, d = DUR[name] || 0;
      if (name !== 'idle' && (lt > d || lt < -0.5)) { name = 'idle'; activity = { name: 'idle', t0: 0 }; }
      lt = Math.max(0, lt);
      var tp = basePose();
      MOVES.idle(tp, t);
      if (name !== 'idle' && motion) { tp.name = name; MOVES[name](tp, lt, d); }
      if (fly > 0.01 && motion) {
        tp.lsz += 0.6 * fly; tp.rsz -= 0.6 * fly; tp.lkn += 0.5 * fly; tp.rkn += 0.5 * fly;
        tp.lhx -= 0.3 * fly; tp.rhx -= 0.3 * fly; tp.face = 'happy';
      }
      if (walking > 0 && motion) {
        walk(tp, t, 8.5, 0.42 * walking);
        tp.lsx = -0.55 * Math.sin(t * 8.5) * walking; tp.rsx = -tp.lsx; tp.lel = tp.rel = -0.4;
      }
      var wantSleep = sleeping && name === 'idle' && !(fly > 0.01) && !(walking > 0);
      sleepK += ((wantSleep ? 1 : 0) - sleepK) * (motion ? Math.min(1, dt * 1.6) : 1);
      if (sleepK > 0.001) sleepPose(tp, t, sleepK);
      if (sleepK > 0.5) flags.set['wear-mask'] = true; else delete flags.set['wear-mask'];
      while (cur.ry - tp.ry > Math.PI) cur.ry -= Math.PI * 2;
      while (cur.ry - tp.ry < -Math.PI) cur.ry += Math.PI * 2;
      var rate = motion ? 1 - Math.pow(1 - 0.26, f) : 1;
      NUM.forEach(function (k) { cur[k] += (tp[k] - cur[k]) * rate; });
      if (tp.ikMode) cur.ikMode = tp.ikMode; else if (cur.ikW < 0.01) cur.ikMode = null;
      cur.face = tp.face; cur.props = tp.props; cur.name = tp.name;

      applyPose(cur, 0, c.contains('look-u') ? -0.24 : 0, 0);
      doIK(cur, t);

      var happy = c.contains('happy') || cur.face === 'happy', surprised = c.contains('surprised') || cur.face === 'surprised';
      st.eyeY += ((c.contains('blink') ? 0.12 : 1) - st.eyeY) * (motion ? 0.45 : 1);
      st.eyeS += ((surprised ? 1.25 : 1) - st.eyeS) * (motion ? 0.2 : 1);
      st.ey += ((c.contains('look-u') ? 0.07 : 0) - st.ey) * (motion ? 0.25 : 1);
      eyeL.scale.set(st.eyeS, st.eyeS * st.eyeY, 0.5 * st.eyeS); eyeR.scale.copy(eyeL.scale);
      eyes.position.set(0, st.ey, 0);
      mouthHappy.visible = happy && !surprised; mouthO.visible = surprised; mouthFlat.visible = !happy && !surprised;

      Object.keys(accs).forEach(function (k2) {
        var g = accs[k2], on = c.contains(k2);
        g.userData.k = motion ? clamp(g.userData.k + (on ? 1 : -1) * dt * (on ? 3.2 : 6), 0, 1) : (on ? 1 : 0);
        g.visible = g.userData.k > 0.01;
        g.scale.setScalar(Math.max(0.001, on ? backOut(g.userData.k) : g.userData.k));
      });
      eyes.visible = !c.contains('wear-shades') && !c.contains('wear-mask');
      antenna.visible = !(c.contains('wear-chef') || c.contains('wear-cap'));
      if (c.contains('spark') && motion) sparkMesh.visible = Math.floor(t * 8) % 2 === 0;
      if (cur.name === 'graduate' && motion) {
        var ct = clamp((lt - 0.7) / 1.4, 0, 1), arc = Math.sin(Math.PI * ct);
        capBody.position.y = 1.05 * arc; capBody.rotation.y = Math.PI * 3 * ct;
      } else { capBody.position.y = 0; capBody.rotation.set(0, 0, 0); }
      zs.forEach(function (z, i) {
        z.visible = sleepK > 0.85;
        if (!z.visible) return;
        var q = motion ? (t * 0.4 + i / 3) % 1 : 0.3 + i * 0.25;
        z.position.set(-1.1 + q * 0.9, 1.25 + q * 1.9, 0.3);
        z.scale.setScalar(0.6 + q * 0.9);
        z.rotation.z = -0.25 + q * 0.3;
        z.material.opacity = Math.sin(Math.PI * q) * (sleepK - 0.85) / 0.15;
      });

      world.updateMatrixWorld(true);
      Object.keys(props).forEach(function (k3) {
        var g = props[k3], on = !!cur.props[k3];
        g.userData.k = motion ? clamp(g.userData.k + (on ? 1 : -1) * dt * (on ? 3.5 : 5), 0, 1) : 0;
        g.visible = g.userData.k > 0.01;
        g.scale.setScalar(Math.max(0.001, on ? backOut(g.userData.k) : g.userData.k));
      });
      if (pan.visible || pizza.visible || bell.visible) {
        arms[-1].hand.getWorldPosition(_hw); world.worldToLocal(_hw);
        pan.position.copy(_hw); pizza.position.copy(_hw); bell.position.copy(_hw);
        var ph = cur.flip || 0, flick = ph < 0.2 ? Math.sin(ph / 0.2 * Math.PI) : 0;
        pan.rotation.z = -0.35 * flick;
        var ca = ph > 0.08 && ph < 0.85 ? Math.sin(Math.PI * (ph - 0.08) / 0.77) : 0;
        cake.position.y = 0.07 + 1.1 * ca; cake.rotation.z = ph > 0.08 && ph < 0.85 ? Math.PI * 2 * (ph - 0.08) / 0.77 : 0;
      }
      world.position.y = motion ? 0.06 * Math.sin(t * 1.6) : 0;
      var pulse = motion ? 0.65 + 0.35 * Math.sin(t * 2.85) : 1;
      M.tip.opacity = pulse; tip.scale.setScalar(0.9 + pulse * 0.2);
      M.ring.opacity = clamp(0.55 + 0.25 * Math.sin(t * 3) + fly * 0.4, 0, 1);
    }
    return { world: world, pad: pad, act: act, step: step, setTheme: setTheme, busy: busy, setSleep: setSleep };
  }
})();
