/* ============================================================
   NIL ValueCalc - calculator, player lookup, email gate
   ============================================================ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var BASE = (document.querySelector('meta[name="nil-base"]') || {}).content || '';
  /* Cache-buster for the data index: reuse the ?v= hash on our own <script> src. */
  var ASSET_VER = (function () {
    try {
      var sc = document.currentScript;
      if (!sc) { var all = document.getElementsByTagName('script'); for (var i = 0; i < all.length; i++) { if (/calculator\.js/.test(all[i].src)) { sc = all[i]; break; } } }
      var m = sc && sc.src.match(/[?&]v=([a-z0-9]+)/i);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  })();

  /* ---------- Footer year ---------- */
  var yearEl = $('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Engagement slider live label ---------- */
  var engagement = $('engagement');
  var engValue = $('eng-value');
  if (engagement && engValue) {
    var sync = function () { engValue.textContent = engagement.value + '%'; };
    engagement.addEventListener('input', sync);
    sync();
  }

  /* ---------- Position options per sport (NIL premium varies by position) ---------- */
  var POSITIONS = {
    'Football': [['Quarterback', 1.5], ['Wide Receiver', 1.2], ['Running Back', 1.15], ['Edge / Defensive Line', 1.1], ['Linebacker', 1.05], ['Defensive Back', 1.05], ['Tight End', 1.05], ['Offensive Line', 0.9], ['Other', 1.0]],
    "Men's Basketball": [['Guard', 1.2], ['Wing / Forward', 1.1], ['Center', 1.05]],
    "Women's Basketball": [['Guard', 1.2], ['Wing / Forward', 1.1], ['Center', 1.05]],
    'Baseball': [['Pitcher', 1.15], ['Shortstop', 1.1], ['Catcher', 1.1], ['Two-Way Player', 1.15], ['Outfielder', 1.0], ['Infielder', 1.0]],
    'Softball': [['Pitcher', 1.15], ['Catcher', 1.1], ['Infielder', 1.05], ['Outfielder', 1.0]],
    'Gymnastics': [['All-Around', 1.1], ['Specialist', 1.0]],
    '_default': [['Athlete', 1.0]]
  };
  var sportSel = $('sport'), posSel = $('position-sel');
  function fillPositions() {
    if (!sportSel || !posSel) return;
    var name = sportSel.options[sportSel.selectedIndex].text;
    var list = POSITIONS[name] || POSITIONS._default;
    posSel.innerHTML = list.map(function (o) { return '<option value="' + o[1] + '">' + o[0] + '</option>'; }).join('');
  }
  if (sportSel && posSel) { sportSel.addEventListener('change', fillPositions); fillPositions(); }

  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function moneyShort(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  }
  function range(lo, hi) { return moneyShort(lo) + ' to ' + moneyShort(hi); }

  /* ---------- Email unlock state (one-time per browser) ---------- */
  function isUnlocked() { return localStorage.getItem('nil_unlocked') === '1'; }
  function setUnlocked() { localStorage.setItem('nil_unlocked', '1'); }

  /* AJAX-submit an email form to its Formspree action, then run cb on success.
     Falls back to just unlocking if the endpoint is a placeholder. */
  function submitEmail(form, cb) {
    var action = form.getAttribute('action') || '';
    var emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !emailInput.checkValidity()) { emailInput.reportValidity(); return; }
    if (/your-form-id|XXXX/.test(action) || !action) { cb(); return; }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Unlocking…'; }
    fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function () { cb(); })
      .catch(function () { cb(); })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Unlock'; } });
  }

  /* ---------- Valuation model (manual mode) ----------
     total = (engaged social + division floor) × sport × division × performance × market.
  ------------------------------------------------------------ */
  var PLATFORM_RATE = { instagram: 2.0, tiktok: 1.2, x: 1.0, youtube: 4.5 };
  var DIVISION = {
    power: { mult: 1.40, floor: 9000 }, d1: { mult: 1.20, floor: 2800 },
    d2: { mult: 0.70, floor: 700 }, d3: { mult: 0.48, floor: 250 },
    naia: { mult: 0.45, floor: 200 }, juco: { mult: 0.55, floor: 300 }, hs: { mult: 0.38, floor: 150 }
  };
  function num(id) { var v = parseFloat(($(id) || {}).value); return isNaN(v) || v < 0 ? 0 : v; }

  function compute() {
    var sportSel = $('sport');
    var sportMult = parseFloat(sportSel.value) || 1;
    var sportName = sportSel.options[sportSel.selectedIndex].text;
    var perfMult = parseFloat($('performance').value) || 1;
    var posEl = $('position-sel');
    var posMult = posEl ? (parseFloat(posEl.value) || 1) : 1;
    var marketMult = $('market') ? (parseFloat($('market').value) || 1) : 1;
    var div = DIVISION[$('division').value] || DIVISION.d1;
    var eng = engagement ? (parseFloat(engagement.value) || 0) / 100 : 0.04;
    var roleMult = perfMult * posMult;

    var ig = num('instagram') * eng * PLATFORM_RATE.instagram;
    var tt = num('tiktok') * eng * PLATFORM_RATE.tiktok;
    var xx = num('x') * eng * PLATFORM_RATE.x;
    var yt = num('youtube') * eng * PLATFORM_RATE.youtube;
    var socialBase = ig + tt + xx + yt;

    var total = (socialBase + div.floor) * sportMult * div.mult * roleMult * marketMult;

    var followTotal = num('instagram') + num('tiktok') + num('x') + num('youtube');
    var t = Math.max(0, Math.min(1, ((Math.log(followTotal + 1) / Math.LN10) - 3) / 3));

    return {
      value: total, low: total * 0.6, high: total * 1.55, sport: sportName,
      bars: [
        { key: 'influence', label: 'Influence (social)', pct: (12 + 33 * t) / 100 },
        { key: 'exposure', label: 'Exposure (level/market)', pct: (28 - 8 * t) / 100 },
        { key: 'performance', label: 'Performance', pct: (38 - 23 * t) / 100 },
        { key: 'brand', label: 'Brand & sport', pct: (22 - 2 * t) / 100 }
      ]
    };
  }

  /* ---------- Bars + counter ---------- */
  function renderBars(container, bars) {
    container.innerHTML = '';
    bars.forEach(function (b) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = '<div class="bar-head"><span>' + b.label + '</span><span>' +
        Math.round(b.pct * 100) + '%</span></div>' +
        '<div class="bar-track"><div class="bar-fill ' + b.key + '" style="width:0%"></div></div>';
      container.appendChild(row);
      requestAnimationFrame(function () {
        row.querySelector('.bar-fill').style.width = (b.pct * 100) + '%';
      });
    });
  }
  function animateMoney(el, to) {
    var dur = 900, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = money(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Shared athlete index loader + similarity ---------- */
  var _index = null, _indexCbs = [];
  function loadIndex(cb) {
    if (_index) { cb(_index); return; }
    _indexCbs.push(cb);
    if (_indexCbs.length > 1) return;
    fetch(BASE + 'assets/data/athletes-index.json' + (ASSET_VER ? '?v=' + ASSET_VER : ''))
      .then(function (r) { return r.json(); })
      .then(function (data) { _index = data; _indexCbs.forEach(function (f) { f(data); }); _indexCbs = []; })
      .catch(function () { _index = []; _indexCbs.forEach(function (f) { f([]); }); _indexCbs = []; });
  }
  function similarPlayers(res) {
    if (!_index || res.lookup) return [];
    var pool = _index.filter(function (p) { return !p.former; });
    var same = pool.filter(function (p) { return p.sport === res.sport; });
    var src = same.length >= 3 ? same : pool;
    return src.map(function (p) { return { p: p, d: Math.abs(p.value - res.value) }; })
      .sort(function (a, b) { return a.d - b.d; })
      .slice(0, 3).map(function (x) { return x.p; });
  }

  /* ============================================================
     HOMEPAGE CALCULATOR (two modes, gated result)
     ============================================================ */
  var resultCard = $('result');
  if (resultCard) {
    var emptyEl = $('result-empty');
    var gateEl = $('result-gate');
    var filledEl = $('result-filled');
    var gateForm = $('gate-form');
    var pending = null; // last computed/looked-up result awaiting reveal

    function renderFilled(res) {
      if ($('result-eyebrow')) $('result-eyebrow').textContent = res.eyebrow || 'Estimated annual NIL value';
      animateMoney($('result-amount'), res.value);
      $('result-range').textContent = 'Likely range: ' + range(res.low, res.high) + ' / year';
      renderBars($('result-bars'), res.bars || []);
      var sim = $('result-similar');
      if (sim) {
        var players = similarPlayers(res);
        if (players.length) {
          sim.hidden = false;
          sim.innerHTML = '<h4>Closest players in our database</h4>' +
            '<div class="sim-list">' + players.map(function (p) {
              return '<a class="sim-card" href="' + BASE + 'athlete/' + p.slug + '/index.html">' +
                '<strong>' + p.name + '</strong><span>' + p.position + ' · ' + p.team + '</span>' +
                '<span class="sim-range">' + range(p.low, p.high) + '</span></a>';
            }).join('') + '</div>';
        } else { sim.hidden = true; sim.innerHTML = ''; }
      }
      if (filledEl.scrollIntoView) filledEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* Populate the hidden lead fields on the gate form so each email carries context. */
    function setF(id, v) { var el = $(id); if (el) el.value = (v == null ? '' : v); }
    function fillLeadFields(res) {
      var rng = moneyShort(res.low) + ' to ' + moneyShort(res.high);
      setF('nil_estimate_field', rng);
      setF('f_mode', res.lookup ? 'Player lookup' : 'Manual estimate');
      setF('f_athlete', res.name || '');
      setF('f_team', res.team || '');
      setF('f_sport', res.sport || '');
      setF('f_position', res.position || '');
      if (res.lookup) {
        setF('f_details', (res.name || '') + (res.team ? ' · ' + res.team : '') + (res.position ? ' (' + res.position + ')' : '') + ' · est ' + rng);
        setF('f_subject', 'NIL unlock: ' + (res.name || 'player'));
      } else {
        setF('f_details', [res.sport, res.position, res.level, res.performance].filter(Boolean).join(' · ') +
          (res.followsum ? ' · ' + res.followsum.toLocaleString('en-US') + ' followers' : '') + ' · est ' + rng);
        setF('f_subject', 'NIL estimate: ' + (res.sport || 'athlete') + ' ' + rng);
      }
    }

    function present(res) {
      pending = res;
      fillLeadFields(res);
      if (emptyEl) emptyEl.hidden = true;
      if (isUnlocked()) {
        if (gateEl) gateEl.hidden = true;
        filledEl.hidden = false;
        renderFilled(res);
      } else {
        filledEl.hidden = true;
        if (gateEl) {
          gateEl.hidden = false;
          if (gateEl.scrollIntoView) gateEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    if (gateForm) {
      gateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitEmail(gateForm, function () {
          setUnlocked();
          if (gateEl) gateEl.hidden = true;
          filledEl.hidden = false;
          if (pending) renderFilled(pending);
        });
      });
    }

    /* --- Mode B: manual estimate --- */
    var form = $('nil-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var res = compute();
        res.eyebrow = 'Estimated annual NIL value';
        var posEl = $('position-sel'), divEl = $('division'), perfEl = $('performance');
        res.position = posEl ? posEl.options[posEl.selectedIndex].text : '';
        res.level = divEl ? divEl.options[divEl.selectedIndex].text : '';
        res.performance = perfEl ? perfEl.options[perfEl.selectedIndex].text : '';
        res.followsum = num('instagram') + num('tiktok') + num('x') + num('youtube');
        present(res);
      });
    }

    /* --- Mode A: player lookup --- */
    var searchInput = $('player-search-input');
    if (searchInput) {
      var resultsBox = $('search-results');
      loadIndex(function (list) {
        function close() { resultsBox.hidden = true; resultsBox.innerHTML = ''; }
        searchInput.addEventListener('input', function () {
          var q = searchInput.value.trim().toLowerCase();
          if (q.length < 2) { close(); return; }
          var hits = list.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1 ||
            (p.team && p.team.toLowerCase().indexOf(q) > -1); }).slice(0, 8);
          if (!hits.length) { resultsBox.hidden = false; resultsBox.innerHTML = '<div class="search-empty">No match. Try the “Estimate any athlete” tab.</div>'; return; }
          resultsBox.hidden = false;
          resultsBox.innerHTML = hits.map(function (p) {
            return '<button type="button" class="search-item" data-slug="' + p.slug + '">' +
              '<strong>' + p.name + '</strong><span>' + p.position + ' · ' + p.team +
              (p.former ? ' · former' : '') + '</span></button>';
          }).join('');
          Array.prototype.forEach.call(resultsBox.querySelectorAll('.search-item'), function (btn) {
            btn.addEventListener('click', function () {
              var p = list.filter(function (x) { return x.slug === btn.dataset.slug; })[0];
              if (!p) return;
              searchInput.value = p.name;
              close();
              var sel = $('lookup-selected');
              if (sel) {
                sel.hidden = false;
                sel.innerHTML = '<p class="lookup-name">Selected: <strong>' + p.name + '</strong>, ' +
                  p.position + ', ' + p.team + '</p>' +
                  '<a class="lookup-full" href="' + BASE + 'athlete/' + p.slug + '/index.html">View full profile ›</a>';
              }
              present({
                value: p.value, low: p.low, high: p.high, sport: p.sport,
                name: p.name, team: p.team, position: p.position, slug: p.slug,
                eyebrow: (p.former ? 'Estimated college NIL value' : 'Estimated 2026 NIL value') + ': ' + p.name,
                bars: null, lookup: true
              });
            });
          });
        });
        document.addEventListener('click', function (e) {
          if (!resultsBox.contains(e.target) && e.target !== searchInput) close();
        });
      });
    }
  }

  /* ---------- Tabs ---------- */
  function showTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.calc-tab'), function (t) {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.calc-panel'), function (p) {
      p.hidden = p.dataset.panel !== name;
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.calc-tab'), function (tab) {
    tab.addEventListener('click', function () { showTab(tab.dataset.tab); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.to-estimate'), function (lnk) {
    lnk.addEventListener('click', function (e) { e.preventDefault(); showTab('estimate'); });
  });

  // Warm the index on pages with the calculator
  if (resultCard) loadIndex(function () {});

  /* ============================================================
     ATHLETE PAGE GATE
     ============================================================ */
  var gate = document.querySelector('.nil-gate');
  if (gate) {
    var locked = gate.querySelector('.gate-locked');
    var reveal = gate.querySelector('.gate-reveal');
    var gForm = gate.querySelector('.gate-form');

    function renderReveal() {
      var lo = +gate.dataset.low, hi = +gate.dataset.high, val = +gate.dataset.value;
      var bars = [];
      try { bars = JSON.parse(gate.dataset.bars || '[]'); } catch (e) {}
      reveal.innerHTML =
        '<span class="result-eyebrow">' + (locked.querySelector('.result-eyebrow') ?
          locked.querySelector('.result-eyebrow').textContent.replace('🔒 ', '') : 'Estimated NIL value') + '</span>' +
        '<div class="big-number"></div>' +
        '<p class="result-range">Likely range: ' + range(lo, hi) + ' / year</p>' +
        '<p class="val-note">' + (gate.dataset.note || '') + '</p>' +
        '<div class="result-bars"></div>';
      animateMoney(reveal.querySelector('.big-number'), val);
      renderBars(reveal.querySelector('.result-bars'), bars);
      locked.hidden = true;
      reveal.hidden = false;
    }

    if (isUnlocked()) {
      renderReveal();
    } else if (gForm) {
      gForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitEmail(gForm, function () { setUnlocked(); renderReveal(); });
      });
    }
  }

  /* ---------- Newsletter forms (no result gate) ---------- */
  function wireNewsletter(formId, successId) {
    var f = $(formId);
    if (!f) return;
    f.addEventListener('submit', function (e) {
      var placeholder = /your-form-id|XXXX/.test(f.getAttribute('action') || '');
      if (placeholder) {
        e.preventDefault();
        f.style.display = 'none';
        var s = successId && $(successId);
        if (s) s.hidden = false;
        else {
          var note = document.createElement('p');
          note.className = 'email-success';
          note.textContent = "✅ You're subscribed!";
          f.parentNode.appendChild(note);
        }
      }
    });
  }
  wireNewsletter('email-form', 'email-success');
  wireNewsletter('cta-email-form', null);

  /* ---------- Share ---------- */
  var shareBtn = $('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var amount = ($('result-amount') || {}).textContent || '';
      var text = 'NIL value estimate: ' + amount + '/year 🏆 Find any player’s value:';
      var url = location.href.split('#')[0];
      if (navigator.share) {
        navigator.share({ title: 'NIL Value', text: text, url: url }).catch(function () {});
      } else {
        navigator.clipboard.writeText(text + ' ' + url).then(function () {
          shareBtn.textContent = '✅ Link copied!';
          setTimeout(function () { shareBtn.textContent = '🔗 Share this result'; }, 2000);
        });
      }
    });
  }

  /* ---------- Consent ----------
     Handled by Google's certified CMP (configured in AdSense), which shows a
     consent prompt to EEA/UK/CH visitors automatically. We intentionally do
     not render our own banner here to avoid a duplicate prompt. */

  /* ---------- AdSense ---------- */
  try {
    var ads = document.querySelectorAll('.adsbygoogle');
    for (var i = 0; i < ads.length; i++) { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
  } catch (e) { /* ignore */ }
})();
