/* ============================================================
   NIL ValueCalc — calculator, email, consent
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Engagement slider live label ---------- */
  var engagement = document.getElementById('engagement');
  var engValue = document.getElementById('eng-value');
  if (engagement && engValue) {
    var sync = function () { engValue.textContent = engagement.value + '%'; };
    engagement.addEventListener('input', sync);
    sync();
  }

  /* ---------- Valuation model ----------
     Annual estimate blends four pillars brands actually weigh:
     Influence (engaged social reach), Exposure (division/market),
     Performance (on-field role), Brand (sport marketability).
     Calibrated to publicly reported NIL deal ranges. Estimate only.
  ------------------------------------------------------------ */
  var PLATFORM_RATE = {        // annual $ per engaged follower
    instagram: 2.0,
    tiktok: 1.2,
    x: 1.0,
    youtube: 4.5
  };

  var DIVISION = {             // exposure multiplier + intangible brand floor ($)
    power: { mult: 1.40, floor: 9000 },
    d1:    { mult: 1.20, floor: 2800 },
    d2:    { mult: 0.70, floor: 700  },
    d3:    { mult: 0.48, floor: 250  },
    naia:  { mult: 0.45, floor: 200  },
    juco:  { mult: 0.55, floor: 300  },
    hs:    { mult: 0.38, floor: 150  }
  };

  function num(id) {
    var v = parseFloat((document.getElementById(id) || {}).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function compute() {
    var sportMult = parseFloat(document.getElementById('sport').value) || 1;
    var perfMult = parseFloat(document.getElementById('performance').value) || 1;
    var marketMult = parseFloat(document.getElementById('market').value) || 1;
    var div = DIVISION[document.getElementById('division').value] || DIVISION.d1;
    var eng = (parseFloat(engagement.value) || 0) / 100;

    var ig = num('instagram') * eng * PLATFORM_RATE.instagram;
    var tt = num('tiktok')    * eng * PLATFORM_RATE.tiktok;
    var xx = num('x')         * eng * PLATFORM_RATE.x;
    var yt = num('youtube')   * eng * PLATFORM_RATE.youtube;
    var socialBase = ig + tt + xx + yt;

    // Pillar contributions (for the breakdown bars)
    var influence   = socialBase * sportMult;
    var exposure    = (socialBase * (div.mult - 1)) + div.floor;        // visibility lift + base
    var performance = socialBase * (perfMult - 1) + div.floor * (perfMult - 1);
    var brand       = socialBase * (marketMult - 1) + div.floor * 0.4 * sportMult;

    var total = (socialBase + div.floor) * sportMult * div.mult * perfMult * marketMult;

    // Normalize pillar bars to proportions of a positive baseline
    var parts = {
      influence: Math.max(influence, 1),
      exposure: Math.max(exposure, 1),
      performance: Math.max(performance, 1),
      brand: Math.max(brand, 1)
    };
    var sum = parts.influence + parts.exposure + parts.performance + parts.brand;

    return {
      total: total,
      low: total * 0.6,
      high: total * 1.55,
      bars: [
        { key: 'influence',   label: 'Influence (social)', pct: parts.influence / sum },
        { key: 'exposure',    label: 'Exposure (level/market)', pct: parts.exposure / sum },
        { key: 'performance', label: 'Performance', pct: parts.performance / sum },
        { key: 'brand',       label: 'Brand & sport', pct: parts.brand / sum }
      ]
    };
  }

  /* ---------- Animated counter ---------- */
  function animateMoney(el, to) {
    var start = 0, dur = 900, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = money(start + (to - start) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Render ---------- */
  var form = document.getElementById('nil-form');
  var emptyEl = document.getElementById('result-empty');
  var filledEl = document.getElementById('result-filled');
  var amountEl = document.getElementById('result-amount');
  var rangeEl = document.getElementById('result-range');
  var barsEl = document.getElementById('result-bars');
  var estimateField = document.getElementById('nil_estimate_field');

  function render(r) {
    emptyEl.hidden = true;
    filledEl.hidden = false;
    animateMoney(amountEl, r.total);
    rangeEl.textContent = 'Likely range: ' + money(r.low) + ' – ' + money(r.high) + ' / year';
    if (estimateField) estimateField.value = money(r.total);

    barsEl.innerHTML = '';
    r.bars.forEach(function (b) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML =
        '<div class="bar-head"><span>' + b.label + '</span><span>' + Math.round(b.pct * 100) + '%</span></div>' +
        '<div class="bar-track"><div class="bar-fill ' + b.key + '" style="width:0%"></div></div>';
      barsEl.appendChild(row);
      requestAnimationFrame(function () {
        row.querySelector('.bar-fill').style.width = (b.pct * 100) + '%';
      });
    });
    filledEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      render(compute());
    });
  }

  /* ---------- Email forms (graceful, no-backend-friendly) ---------- */
  function wireEmail(formId, successId) {
    var f = document.getElementById(formId);
    if (!f) return;
    f.addEventListener('submit', function (e) {
      // If the action still points at the placeholder, don't hit the network —
      // just show success so the UX works before you connect Formspree/Mailchimp.
      var placeholder = /your-form-id/.test(f.getAttribute('action') || '');
      if (placeholder) {
        e.preventDefault();
        f.style.display = 'none';
        if (successId) {
          var s = document.getElementById(successId);
          if (s) s.hidden = false;
        } else {
          var note = document.createElement('p');
          note.className = 'email-success';
          note.textContent = "✅ You're subscribed! (Connect your email provider to start collecting.)";
          f.parentNode.appendChild(note);
        }
      }
      // Otherwise let it POST normally to your real endpoint.
    });
  }
  wireEmail('email-form', 'email-success');
  wireEmail('cta-email-form', null);

  /* ---------- Share ---------- */
  var shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var amount = amountEl.textContent;
      var text = 'My estimated NIL value is ' + amount + '/year 🏆 Find yours:';
      var url = location.href.split('#')[0];
      if (navigator.share) {
        navigator.share({ title: 'My NIL Value', text: text, url: url }).catch(function () {});
      } else {
        navigator.clipboard.writeText(text + ' ' + url).then(function () {
          shareBtn.textContent = '✅ Link copied!';
          setTimeout(function () { shareBtn.textContent = '🔗 Share my result'; }, 2000);
        });
      }
    });
  }

  /* ---------- Lightweight consent notice ----------
     For EEA/UK traffic, also enable Google's certified CMP in the AdSense
     dashboard (Privacy & messaging → GDPR). This banner is the baseline notice. */
  if (!localStorage.getItem('nil_consent')) {
    var bar = document.createElement('div');
    bar.id = 'consent-bar';
    bar.innerHTML =
      '<p>We use cookies for analytics and to show ads that keep this tool free. ' +
      'See our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="consent-actions">' +
      '<button id="consent-decline" type="button">Decline</button>' +
      '<button id="consent-accept" type="button">Accept</button></div>';
    document.body.appendChild(bar);
    var close = function (val) {
      localStorage.setItem('nil_consent', val);
      bar.remove();
    };
    document.getElementById('consent-accept').addEventListener('click', function () { close('accepted'); });
    document.getElementById('consent-decline').addEventListener('click', function () { close('declined'); });
  }

  /* ---------- Initialize AdSense units ---------- */
  try {
    var ads = document.querySelectorAll('.adsbygoogle');
    for (var i = 0; i < ads.length; i++) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch (e) { /* AdSense not loaded (e.g. local dev) — ignore */ }
})();
