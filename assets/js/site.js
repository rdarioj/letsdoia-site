(function () {
  var LD = window.LD || {};
  var WA = '393921473519';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@letsdoia.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  function waLink(text) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }

  /* Navegación */
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var burger = document.querySelector('.nav__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Titulares palabra por palabra */
  document.querySelectorAll('.split').forEach(function (el) {
    el.querySelectorAll('.line, .split-inner').forEach(function (line) {
      var html = '';
      line.childNodes.forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (part) {
            html += /^\s+$/.test(part) || !part ? part : '<span class="w"><span>' + part + '</span></span>';
          });
        } else {
          html += '<span class="w"><span>' + node.outerHTML + '</span></span>';
        }
      });
      line.innerHTML = html;
    });
    var i = 0;
    el.querySelectorAll('.w > span').forEach(function (s) { s.style.transitionDelay = (i++ * 0.055) + 's'; });
  });

  /* Revelado */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal, .split').forEach(function (el) {
    if (io && !reduce) io.observe(el); else el.classList.add('is-in');
  });

  /* Contadores */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    var pre = el.getAttribute('data-pre') || '';
    var suf = el.getAttribute('data-suf') || '';
    if (reduce) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + v.toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.6 }) : null;
  document.querySelectorAll('[data-count]').forEach(function (el) { if (cio) cio.observe(el); else animateCount(el); });

  /* Brillo que sigue al cursor */
  var hero = document.querySelector('.hero');
  var glow = document.querySelector('.cursor-glow');
  if (hero && glow && !reduce && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - r.left) + 'px';
      glow.style.top = (e.clientY - r.top) + 'px';
    });
  }

  /* Marquee sin cortes */
  document.querySelectorAll('.marquee__track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* Diagnóstico */
  var quiz = document.querySelector('[data-quiz]');
  if (quiz && LD.quiz) {
    var answers = {};
    var steps = quiz.querySelectorAll('.quiz__step');
    var bar = quiz.querySelector('.quiz__progress i');
    function show(i) {
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      if (bar) bar.style.width = Math.min(100, ((i + 1) / steps.length) * 100) + '%';
    }
    function resultKey() {
      if (answers.stage === 'none') return 'launch';
      if (answers.stage === 'other') return answers.pain === 'b2b' ? 'b2b' : 'migrate';
      return answers.pain || 'convert';
    }
    function renderResult() {
      var key = resultKey();
      var r = LD.quiz.results[key];
      var box = quiz.querySelector('.result');
      var urgency = LD.quiz.timing[answers.timing] || '';
      box.querySelector('.result__badge').textContent = r.badge;
      box.querySelector('h3').textContent = r.title;
      box.querySelector('p').textContent = r.text + ' ' + urgency;
      box.querySelector('ul').innerHTML = r.items.map(function (x) { return '<li>' + x + '</li>'; }).join('');
      var msg = LD.quiz.waIntro + ' ' + r.title + '. ' + LD.quiz.waStage + ': ' + (LD.quiz.labels[answers.stage] || '') + '. ' + LD.quiz.waPain + ': ' + (LD.quiz.labels[answers.pain] || '') + '.';
      box.querySelector('[data-wa]').setAttribute('href', waLink(msg));
      var formBtn = box.querySelector('[data-to-form]');
      formBtn.onclick = function () {
        var chip = document.querySelector('.chips input[value="' + r.need + '"]');
        if (chip) chip.checked = true;
        var ta = document.querySelector('#f-msg');
        if (ta && !ta.value) ta.value = msg;
      };
      show(steps.length - 1);
      track('quiz_complete', { result: key });
    }
    quiz.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var step = b.closest('.quiz__step');
        answers[step.getAttribute('data-key')] = b.getAttribute('data-v');
        var idx = Array.prototype.indexOf.call(steps, step);
        if (idx === steps.length - 2) renderResult(); else show(idx + 1);
      });
    });
    var restart = quiz.querySelector('.restart');
    if (restart) restart.addEventListener('click', function () { answers = {}; show(0); });
    show(0);
  }

  /* Calculadora */
  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var range = calc.querySelector('input[type="range"]');
    var outRev = calc.querySelector('[data-rev]');
    var outMonth = calc.querySelector('[data-month]');
    var outYear = calc.querySelector('[data-year]');
    var lift = 0.1;
    var fmt = new Intl.NumberFormat(LD.locale || 'es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    function paint() {
      var v = parseInt(range.value, 10);
      outRev.textContent = fmt.format(v);
      outMonth.textContent = '+' + fmt.format(Math.round(v * lift));
      outYear.textContent = '+' + fmt.format(Math.round(v * lift * 12));
      var pct = ((v - range.min) / (range.max - range.min)) * 100;
      range.style.background = 'linear-gradient(90deg, var(--fire) ' + pct + '%, var(--ink-3) ' + pct + '%)';
    }
    range.addEventListener('input', paint);
    calc.querySelectorAll('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        calc.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        lift = parseFloat(b.getAttribute('data-lift'));
        paint();
        track('calc_scenario', { lift: lift });
      });
    });
    paint();
  }

  /* Formulario */
  var formBox = document.querySelector('.form');
  var form = formBox ? formBox.querySelector('form') : null;
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var needs = Array.prototype.map.call(form.querySelectorAll('input[name="need"]:checked'), function (x) { return x.value; });
      var val = function (n) { var el = form.elements.namedItem(n); return el && el.value ? el.value.trim() : ''; };
      var data = {
        nombre: val('name'),
        email: val('email'),
        tienda: val('store'),
        necesita: needs.join(', '),
        mensaje: val('message'),
        idioma: LD.lang || 'es',
        _subject: 'Nueva consulta desde letsdoia.com — ' + val('name'),
        _template: 'table',
        _captcha: 'false'
      };
      if (val('_honey')) return;
      btn.disabled = true;
      btn.dataset.label = btn.innerHTML;
      btn.textContent = LD.sending || 'Enviando…';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        formBox.classList.add('is-sent');
        track('generate_lead', { method: 'form', need: data.necesita });
      }).catch(function () {
        var body = Object.keys(data).filter(function (k) { return k[0] !== '_'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n');
        window.location.href = 'mailto:info@letsdoia.com?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(body);
        btn.disabled = false;
        btn.innerHTML = btn.dataset.label;
      });
    });
  }

  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.addEventListener('click', function () { track('generate_lead', { method: 'whatsapp' }); });
  });
  document.querySelectorAll('a[href*="calendly"]').forEach(function (a) {
    a.addEventListener('click', function () { track('generate_lead', { method: 'calendly' }); });
  });
})();
