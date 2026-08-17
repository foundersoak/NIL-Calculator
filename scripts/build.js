#!/usr/bin/env node
/* ============================================================
   NIL ValueCalc - static page generator
   Reads data/athletes.json and generates:
     - /athlete/<slug>/index.html   (one per athlete)
     - /team/<slug>/index.html      (one per team, aggregates roster)
     - /athletes/index.html         (directory of all athletes + teams)
     - sitemap.xml                  (regenerated)
   Run:  node scripts/build.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'athletes.json'), 'utf8'));
const GUIDES = require('./guides-content.js');

/* ---- Config: change SITE_URL to your custom domain when you have one ---- */
const SITE_URL = 'https://howmuchnil.com'; // no trailing slash
const ADSENSE_CLIENT = 'ca-pub-6381950276439830';
const FORMSPREE = 'https://formspree.io/f/mkoangpz';

/* Analytics + Search Console: paste your IDs here, leave '' to disable. Applies site-wide on rebuild. */
const GA4_ID = 'G-WFXLBN94GQ'; // Google Analytics 4 Measurement ID, e.g. 'G-XXXXXXXXXX'
const GSC_VERIFICATION = '';  // Search Console "HTML tag" verification token (the content="..." value)
const UPDATED = DATA.updated || new Date().toISOString().slice(0, 10);

/* Asset version: hash of CSS+JS+DATA so browsers re-fetch when any change.
   Including the data file means a values-only update (e.g. new valuations)
   still busts the cached search index that calculator.js loads. */
const crypto = require('crypto');
const ASSET_VER = (() => {
  try {
    const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'styles.css'));
    const js = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'calculator.js'));
    const data = fs.readFileSync(path.join(ROOT, 'data', 'athletes.json'));
    return crypto.createHash('md5').update(css).update(js).update(data).digest('hex').slice(0, 8);
  } catch (e) { return String(Date.now()); }
})();

/* ---------- helpers ---------- */
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const moneyShort = n => {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + Math.round(n);
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const totalFollowers = a => Object.values(a.followers || {}).reduce((s, v) => s + (v || 0), 0);
/* Compact, deliberately-rounded follower display (e.g. 8312 -> "8.3K", 1394000 -> "1.4M").
   Follower data is approximate, so we never show false precision. */
const fmtFollowers = n => {
  n = +n || 0;
  if (n <= 0) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e5) return Math.round(n / 1e3) + 'K';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(n));
};
/* "As of" label for follower figures, derived from the dataset's updated date. */
const FOLLOWERS_AS_OF = (() => {
  const d = new Date((DATA.updated || '') + 'T00:00:00');
  return isNaN(d) ? '2026' : d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
})();

/* Four-pillar breakdown for a known valuation (mirrors calculator.js weighting).
   The influence share scales with audience size (log scale): ~1M followers reads
   social-led (45%), a small following reads performance-led (38%). Sums to 100. */
function breakdown(a) {
  const t = Math.max(0, Math.min(1, (Math.log10(totalFollowers(a) + 1) - 3) / 3));
  return [
    { key: 'influence', label: 'Influence (social)', pct: (12 + 33 * t) / 100 },
    { key: 'exposure', label: 'Exposure (program/market)', pct: (28 - 8 * t) / 100 },
    { key: 'performance', label: 'Performance', pct: (38 - 23 * t) / 100 },
    { key: 'brand', label: 'Brand & sport', pct: (22 - 2 * t) / 100 }
  ];
}

/* GA4 + Search Console verification markup (empty until IDs are set above). */
function analyticsSnippet() {
  let out = '';
  if (GSC_VERIFICATION) out += `<meta name="google-site-verification" content="${GSC_VERIFICATION}" />`;
  if (GA4_ID) out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');</script>`;
  return out;
}

/* ---------- shared HTML chunks ---------- */
function head(opts) {
  const { title, desc, canonical, prefix, jsonld, noindex } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${analyticsSnippet()}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  ${noindex ? '<meta name="robots" content="noindex" />' : ''}
  <meta name="theme-color" content="#166534" />
  <meta name="nil-base" content="${prefix}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="${prefix}assets/img/favicon.png" />
  <link rel="apple-touch-icon" href="${prefix}assets/img/apple-touch-icon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}assets/css/styles.css?v=${ASSET_VER}" />
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
  <header class="site-header">
    <div class="container mast">
      <a class="brand" href="/">
        <img class="brand-logo" src="${prefix}assets/img/logo.png" alt="" width="44" height="44" />
        <span class="brand-block">
          <span class="brand-text">HowMuch<span class="brand-accent">NIL</span></span>
          <span class="brand-tag">College athlete NIL valuations</span>
        </span>
      </a>
      <div class="hdr-search">
        <input id="hdr-search-input" type="search" placeholder="Search a player or team" autocomplete="off" aria-label="Search players" />
        <div class="search-results" id="hdr-search-results" hidden></div>
      </div>
    </div>
  </header>
  <nav class="subnav">
    <div class="container subnav-in">
      <a href="/athletes/">Athletes</a>
      <a href="/#top25">Top 25</a>
      <a href="/guides/">Articles</a>
      <a href="/#calculator">Calculator</a>
      <a href="/about.html">About</a>
    </div>
  </nav>
  <main>`;
}

/* Ad units are OFF until real AdSense slot IDs exist: the placeholder slots
   never fill, which left an empty grey block on every page. To turn ads back
   on, set ADS_ENABLED = true, put a real unit ID in AD_SLOT_INLINE, and
   uncomment the two blocks in index.html. */
const ADS_ENABLED = false;
const AD_SLOT_INLINE = '2222222222';

function adUnit() {
  if (!ADS_ENABLED) return '';
  return `<div class="container ad-wrap"><p class="ad-label">Advertisement</p>
    <ins class="adsbygoogle ad-inline" style="display:block" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${AD_SLOT_INLINE}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
}

function emailCapture(prefix) {
  return `<section class="container narrow">
    <div class="email-capture light">
      <h4>Get the NIL newsletter</h4>
      <p>Deal breakdowns, valuation updates and athlete brand tips. Free.</p>
      <form class="email-form" action="${FORMSPREE}" method="POST">
        <input type="hidden" name="newsletter" value="yes" />
        <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
        <button type="submit" class="btn btn-primary">Subscribe</button>
      </form>
      <p class="privacy-note"><a href="/privacy.html">Privacy</a> · No spam, unsubscribe anytime.</p>
    </div>
  </section>`;
}

function foot(prefix) {
  return `</main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="/"><img class="brand-logo brand-logo-sm" src="${prefix}assets/img/logo.png" alt="" width="34" height="34" /><span class="brand-text">HowMuch<span class="brand-accent">NIL</span></span></a>
        <p class="footer-tag">Know the value. Follow the money.</p>
      </div>
      <nav class="footer-links">
        <a href="/athletes/">Athletes</a>
        <a href="/guides/">Articles</a>
        <a href="/#calculator">Calculator</a>
        <a href="/about.html">About</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </div>
    <div class="container footer-bottom">
      <p>© ${new Date().getFullYear()} HowMuchNIL. NIL valuations are estimates of 12-month earning potential based on public data and our model, not amounts paid, and not endorsed by the athletes or schools. Informational only; not financial, legal or tax advice. Not affiliated with the NCAA. Data updated ${UPDATED}.</p>
    </div>
  </footer>
  <script src="${prefix}assets/js/calculator.js?v=${ASSET_VER}" defer></script>
</body>
</html>`;
}

function breakdownBars(a) {
  return `<div class="result-bars static">` + breakdown(a).map(b =>
    `<div class="bar-row"><div class="bar-head"><span>${b.label}</span><span>${Math.round(b.pct * 100)}%</span></div>
     <div class="bar-track"><div class="bar-fill ${b.key}" style="width:${(b.pct * 100).toFixed(0)}%"></div></div></div>`).join('') + `</div>`;
}

/* Social section: table for 2+ platforms, a sentence for 1, omitted entirely for 0.
   No caption restating the total; one dated note only. */
function socialSection(a) {
  const first = esc(a.name.split(' ')[0]);
  const f = a.followers || {};
  const links = Object.fromEntries(handleLinks(a));
  const plats = [
    ['Instagram', 'instagram', f.instagram], ['TikTok', 'tiktok', f.tiktok],
    ['X / Twitter', 'x', f.x], ['YouTube', 'youtube', f.youtube]
  ].filter(p => p[2]);
  if (!plats.length) return '';
  const label = (p) => links[p[1]] ? `<a href="${links[p[1]]}" rel="nofollow noopener" target="_blank">${p[0]}</a>` : p[0];
  let body;
  if (plats.length === 1) {
    const p = plats[0];
    body = `<p>${first}'s public social presence is about ~${fmtFollowers(p[2])} followers on ${label(p)}. Follower figures are approximate, as of ${FOLLOWERS_AS_OF}.</p>`;
  } else {
    body = `<table class="data-table"><thead><tr><th>Platform</th><th>Followers (approx.)</th></tr></thead><tbody>` +
      plats.map(p => `<tr><td>${label(p)}</td><td>~${fmtFollowers(p[2])}</td></tr>`).join('') +
      `</tbody></table>
      <p class="muted">Follower figures are approximate, as of ${FOLLOWERS_AS_OF}.</p>`;
  }
  return `<h2>${first}'s social media following</h2>
      ${body}`;
}

/* Unique, data-derived summary per athlete (keeps pages distinct + accurate). */
function uniqueSummary(a, team) {
  const first = esc(a.name.split(' ')[0]);
  const name = esc(a.name);
  const tname = esc(team.name);
  const pos = esc((a.position || 'athlete').toLowerCase());
  const sport = esc((a.sport || '').toLowerCase());
  const conf = team.conference ? esc(team.conference) : '';
  const parts = [];
  if (a.former) {
    parts.push(`${name} is a former ${tname} ${pos}${a.nowWith ? `, now with ${esc(a.nowWith)}` : ''}.`);
  } else {
    parts.push(`${name} is a ${pos} for the ${tname}${conf ? ` in the ${conf}` : ''}.`);
  }
  const tot = totalFollowers(a);
  if (tot > 0) {
    const f = a.followers || {};
    const lead = [['Instagram', f.instagram], ['TikTok', f.tiktok], ['X', f.x], ['YouTube', f.youtube]]
      .filter(p => p[1] > 0).sort((x, y) => y[1] - x[1])[0];
    parts.push(`${first} has about ${fmtFollowers(tot)} followers across social media${lead ? `, led by ${fmtFollowers(lead[1])} on ${lead[0]}` : ''}, a core driver of ${sport} NIL value.`);
  }
  parts.push(a.reported
    ? `${first}'s figure reflects publicly reported figures, per ${esc(a.source || 'public reporting')}.`
    : `${first}'s figure is a modeled estimate based on audience, on-field role, market and sport.`);
  return parts.join(' ');
}

/* ---------- athlete page enrichment helpers ---------- */
const LEVEL_LABEL = { power: 'NCAA Division I (Power conference)', d1: 'NCAA Division I', d2: 'NCAA Division II', d3: 'NCAA Division III', naia: 'NAIA', juco: 'JUCO', hs: 'High school' };
const ROLE_LABEL = { star: 'Star / headline name', starter: 'Projected starter', rotation: 'Rotation / two-deep candidate', depth: 'Roster depth', walkon: 'Roster depth' };
const capFirst = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const HANDLE_URL = {
  instagram: h => `https://www.instagram.com/${h}/`,
  tiktok: h => `https://www.tiktok.com/@${h}`,
  x: h => `https://x.com/${h}`,
  youtube: h => `https://www.youtube.com/@${h}`
};
function handleLinks(a) {
  const out = [];
  for (const [plat, fn] of Object.entries(HANDLE_URL)) {
    const raw = a.handles && a.handles[plat];
    if (raw) out.push([plat, fn(String(raw).replace(/^@/, ''))]);
  }
  return out;
}

function quickFacts(a, team) {
  const rows = [['Sport', a.sport], ['Position', a.position], ['School', team.name]];
  if (team.conference) rows.push(['Conference', team.conference]);
  rows.push(['Level', LEVEL_LABEL[a.level] || 'College']);
  if (a.former && a.nowWith) rows.push(['Now with', a.nowWith]);
  return `<table class="data-table facts"><tbody>` +
    rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('') + `</tbody></table>`;
}

/* ESPN-style label-over-value strip under the athlete header. */
function statStrip(a) {
  const cells = [];
  if (a.class) cells.push(['Class', capFirst(a.class)]);
  if (a.jersey) cells.push(['Jersey', '#' + a.jersey]);
  if (a.roleTier && ROLE_LABEL[a.roleTier] && !a.former) cells.push(['2026 role', ROLE_LABEL[a.roleTier]]);
  if (a.hometown) cells.push(['Hometown', a.hometown]);
  if (!cells.length) return '';
  return `<div class="stat-strip">` + cells.map(c =>
    `<div class="stat-cell"><span class="stat-label">${esc(c[0])}</span><span class="stat-value">${esc(c[1])}</span></div>`).join('') + `</div>`;
}

/* Visible FAQ content. Two genuinely distinct questions only; no restatement
   of data shown elsewhere on the page. FAQPage JSON-LD is deliberately NOT
   emitted: Google retired FAQ rich results for all sites in May 2026. */
function faqItems(a, team, lo, hi) {
  const name = a.name, first = a.name.split(' ')[0];
  const doesDid = a.former ? 'did' : 'does';
  const yr = a.former ? '' : '2026 ';
  return [
    { q: `How much ${doesDid} ${name} make in NIL?`,
      a: `${name}'s ${yr}estimated NIL value falls between ${moneyShort(lo)} and ${moneyShort(hi)}, ${a.reported ? `anchored to publicly reported figures${a.source ? `, per ${a.source}` : ''}` : 'a modeled estimate of 12-month name, image and likeness earning potential'}. The exact figure and the full breakdown are free on this page with an email.` },
    { q: `Is that ${first}'s salary or net worth?`,
      a: `No. The figure estimates what ${first} could earn from name, image and likeness deals over 12 months, such as endorsements, appearances and social media. It is not a salary, not a signed contract, and not ${first}'s net worth. ${a.reported ? 'It is anchored to publicly reported figures.' : 'The deals an athlete actually signs can differ from any estimate.'}` }
  ];
}

/* Up to 4 players in a similar valuation range (links only, value stays gated). */
function comparables(a) {
  const same = DATA.athletes.filter(x => x.slug !== a.slug && x.sport === a.sport && !x.former && !x.thin);
  same.sort((x, y) => Math.abs(x.valuation - a.valuation) - Math.abs(y.valuation - a.valuation));
  const picks = same.slice(0, 6);
  if (!picks.length) return '';
  const items = picks.map(p => {
    const pt = DATA.teams[p.team] || {};
    const plo = p.low || Math.round(p.valuation * 0.8), phi = p.high || Math.round(p.valuation * 1.25);
    return `<li><span class="rk-who"><a href="/athlete/${p.slug}/">${esc(p.name)}</a><span class="rk-sub">${esc(p.position)} · ${esc(pt.name || p.team)}</span></span><span class="rank-val">${moneyShort(plo)} to ${moneyShort(phi)}</span></li>`;
  }).join('');
  return `<div class="module">
      <div class="module-hd">Similar NIL profiles</div>
      <div class="module-bd"><ol class="rank-list rail-list">${items}</ol></div>
    </div>`;
}

/* Right-rail module: top teammates by estimated value, linking the team page. */
function teammates(a, team) {
  const mates = DATA.athletes.filter(x => x.slug !== a.slug && x.team === a.team && !x.former && !x.thin)
    .sort((x, y) => y.valuation - x.valuation).slice(0, 6);
  if (!mates.length) return '';
  const items = mates.map(p => {
    const plo = p.low || Math.round(p.valuation * 0.8), phi = p.high || Math.round(p.valuation * 1.25);
    return `<li><span class="rk-who"><a href="/athlete/${p.slug}/">${esc(p.name)}</a><span class="rk-sub">${esc(p.position)}</span></span><span class="rank-val">${moneyShort(plo)} to ${moneyShort(phi)}</span></li>`;
  }).join('');
  return `<div class="module">
      <div class="module-hd">Top ${esc(team.name)} valuations</div>
      <div class="module-bd"><ol class="rank-list rail-list">${items}</ol>
      <p class="mod-more"><a href="/team/${a.team}/">Full ${esc(team.name)} roster</a></p></div>
    </div>`;
}
function athletePage(a) {
  const team = DATA.teams[a.team] || { name: a.team, conference: '', sport: a.sport };
  const prefix = '../../';
  const url = `${SITE_URL}/athlete/${a.slug}/`;
  const fn = a.name.split(' ')[0];
  const title = a.former
    ? `${a.name} NIL Value: How Much Did ${fn} Make in NIL?`
    : `${a.name} NIL Value 2026: How Much Does ${fn} Make in NIL?`;
  const desc = a.former
    ? `What was ${a.name}'s NIL value at ${team.name}? See the ${a.sport.toLowerCase()} ${a.position.toLowerCase()}'s estimated NIL valuation, social following and how it is figured${a.nowWith ? `, now that ${fn} is with ${a.nowWith}` : ''}.`
    : `What is ${a.name}'s NIL value? See the ${team.name} ${a.position.toLowerCase()}'s estimated 2026 NIL valuation, social following and how it is calculated. Free.`;
  const person = { "@type": "Person", "name": a.name, "jobTitle": `${a.position}, ${team.name}`,
    "affiliation": { "@type": "SportsTeam", "name": team.name }, "url": url };
  const sameAs = handleLinks(a).map(h => h[1]);
  if (sameAs.length) person.sameAs = sameAs;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Athletes", "item": `${SITE_URL}/athletes/` },
        { "@type": "ListItem", "position": 2, "name": a.name, "item": url }
      ]},
      /* Paywalled-content markup per Google's gated-content guidance: the exact
         figure is real text in the DOM, hidden until email unlock. */
      { "@type": "WebPage", "url": url, "name": title, "isAccessibleForFree": "False",
        "hasPart": { "@type": "WebPageElement", "isAccessibleForFree": "False", "cssSelector": ".gate-exact" } }
    ]
  };

  const lo = a.low || Math.round(a.valuation * 0.8);
  const hi = a.high || Math.round(a.valuation * 1.25);
  const barsJson = esc(JSON.stringify(breakdown(a).map(b => ({ key: b.key, label: b.label, pct: b.pct }))));
  const note = (a.reported ? 'Based on publicly reported figures' : 'Modeled estimate') + (a.former ? ' · final season in college' : ' · 12-month earning potential');

  return head({ title, desc, canonical: url, prefix, jsonld, noindex: !!a.thin }) + `
    <section class="container athlete-hero">
      <nav class="crumbs"><a href="/athletes/">Athletes</a> › <span>${esc(a.name)}</span></nav>
      <h1>How much ${a.former ? 'did' : 'does'} ${esc(a.name)} make in NIL?</h1>
      <p class="athlete-sub">${a.former ? 'Former ' : ''}${esc(a.position)} · ${esc(team.name)}${team.conference ? ' · ' + esc(team.conference) : ''}${a.former && a.nowWith ? ` · <strong>Now: ${esc(a.nowWith)}</strong>` : ''}</p>
      <p class="athlete-blurb">${esc(a.blurb || '')}</p>
      ${statStrip(a)}
    </section>
    <div class="container athlete-cols">
      <div class="a-gate">

      <div class="nil-gate" data-value="${a.valuation}" data-low="${lo}" data-high="${hi}"
           data-name="${esc(a.name)}" data-reported="${a.reported ? 1 : 0}"
           data-note="${esc((a.reported ? 'Based on publicly reported figures' : 'Modeled estimate') + (a.former ? ' · final season in college' : ' · 12-month earning potential'))}"
           data-bars="${barsJson}">
        <div class="gate-locked">
          <span class="result-eyebrow">${a.former ? 'Final college NIL valuation' : 'Estimated 2026 NIL valuation'}</span>
          <div class="gate-range">${moneyShort(lo)} <span class="range-to">to</span> ${moneyShort(hi)}</div>
          <p class="gate-asof">Estimated range as of ${FOLLOWERS_AS_OF}. ${a.reported ? 'Anchored to publicly reported figures.' : 'Modeled estimate, not a confirmed deal.'}</p>
          ${breakdownBars(a)}
          <div class="gate-exact" hidden>
            <div class="big-number"><span data-nosnippet>${money(a.valuation)}</span></div>
            <p class="gate-note">${esc(note)}</p>
          </div>
          <p class="gate-pitch">Enter your email to see ${esc(a.name.split(' ')[0])}'s exact estimated figure and the full breakdown. Free.</p>
          <form class="gate-form email-form" action="${FORMSPREE}" method="POST">
            <input type="hidden" name="_subject" value="NIL unlock: ${esc(a.name)}" />
            <input type="hidden" name="mode" value="Athlete page" />
            <input type="hidden" name="athlete" value="${esc(a.name)}" />
            <input type="hidden" name="team" value="${esc(team.name)}" />
            <input type="hidden" name="sport" value="${esc(a.sport)}" />
            <input type="hidden" name="position" value="${esc(a.position)}" />
            <input type="hidden" name="page" value="athlete/${a.slug}" />
            <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
            <button type="submit" class="btn btn-primary">Unlock the value</button>
            <select name="role" class="gate-role" aria-label="I am a">
              <option value="" selected>I am a… (optional)</option>
              <option>Fan</option>
              <option>Athlete</option>
              <option>Parent or guardian</option>
              <option>Agent or advisor</option>
              <option>Brand or collective</option>
            </select>
            <label class="consent-check"><input type="checkbox" name="newsletter" value="yes" checked /> Also send me the free newsletter: college sports, NIL deals and valuation updates</label>
          </form>
          <p class="privacy-note">No spam. Unsubscribe anytime. <a href="/privacy.html">Privacy</a>.</p>
        </div>
        <div class="gate-reveal" hidden></div>
      </div>
    ${adUnit()}
      </div>
      <aside class="a-rail">
        ${comparables(a)}
        ${teammates(a, team)}
      </aside>
      <div class="a-prose">
      <h2>What ${a.former ? 'was' : 'is'} ${esc(a.name)}'s NIL value?</h2>
      <p>As of ${FOLLOWERS_AS_OF}, ${esc(a.name)}'s estimated NIL value falls between ${moneyShort(lo)} and ${moneyShort(hi)}. ${uniqueSummary(a, team)}</p>
      ${quickFacts(a, team)}

      ${socialSection(a)}

      ${team.nilContext ? `<h2>NIL at ${esc(team.name)}</h2>
      <p>${esc(team.nilContext)}</p>` : ''}

      <h2>How NIL value is calculated</h2>
      <p>An NIL value is an estimate of what an athlete could earn from name, image and likeness over 12 months, not a salary or a confirmed deal. We weigh audience (social reach and engagement), performance and role, school and market, and the sport and position.${a.reported && a.source ? ` Where a public figure exists, we sense-check against it; this valuation is anchored to <a href="${a.sourceUrl}" rel="nofollow noopener" target="_blank">${esc(a.source)}</a>.` : ` No exact NIL figure is publicly disclosed for ${esc(a.name.split(' ')[0])}, so the value shown here is a modeled estimate.`} <a href="/guide/how-nil-valuations-work/">See how NIL valuations work</a>.</p>


      <h2>${esc(a.name.split(' ')[0])} NIL FAQ</h2>
      <div class="faq">${faqItems(a, team, lo, hi).map(it => `<h3>${esc(it.q)}</h3><p>${esc(it.a)}</p>`).join('')}</div>

      <div class="cta-inline">
        <p><strong>Curious about another player?</strong> Look one up or estimate any athlete in seconds.</p>
        <a class="btn btn-primary" href="/#calculator">Open the NIL calculator</a>
      </div>
      </div>
    </div>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- athletes directory ---------- */

/* Team pages: roster table plus the team's NIL context. One per program. */
const CONF_ORDER = ['SEC', 'Big Ten', 'Big 12', 'ACC'];
function teamAthletes(slug) {
  return DATA.athletes.filter(a => a.team === slug).sort((x, y) => y.valuation - x.valuation);
}

const confSlug = c => String(c).toLowerCase().replace(/[^a-z0-9]+/g, '-');
function teamJump(prefix, current) {
  const groups = {};
  Object.entries(DATA.teams).forEach(([slug, t]) => {
    const conf = CONF_ORDER.includes(t.conference) ? t.conference : 'Other';
    (groups[conf] = groups[conf] || []).push([slug, t.name]);
  });
  const opts = [...CONF_ORDER, 'Other'].filter(c => groups[c]).map(conf =>
    `<optgroup label="${esc(conf)}">${groups[conf].sort((a, b) => a[1].localeCompare(b[1])).map(([slug, name]) =>
      `<option value="/team/${slug}/"${slug === current ? ' selected' : ''}>${esc(name)}</option>`).join('')}</optgroup>`).join('');
  return `<select class="team-jump" aria-label="Go to a team"><option value="">Go to a team…</option>${opts}</select>`;
}

function teamPage(slug) {
  const team = DATA.teams[slug];
  const roster = teamAthletes(slug);
  const prefix = '../../';
  const url = `${SITE_URL}/team/${slug}/`;
  const title = `${team.name} NIL Valuations 2026: Full Roster Estimates`;
  const desc = `Estimated NIL value ranges for ${roster.length} ${team.name} athletes, with roles, classes and social reach. Updated ${FOLLOWERS_AS_OF}.`;
  const rows = roster.map(a => {
    const lo = a.low || Math.round(a.valuation * 0.8), hi = a.high || Math.round(a.valuation * 1.25);
    return `<tr><td>${a.thin ? esc(a.name) : `<a href="/athlete/${a.slug}/">${esc(a.name)}</a>`}${a.former ? ' <span class="muted">(former)</span>' : ''}</td><td>${esc(a.position)}</td><td>${esc(a.class ? capFirst(a.class) : '')}</td><td>${a.roleTier && ROLE_LABEL[a.roleTier] ? esc(ROLE_LABEL[a.roleTier]) : ''}</td><td class="num">${moneyShort(lo)} to ${moneyShort(hi)}</td></tr>`;
  }).join('');
  return head({ title, desc, canonical: url, prefix, jsonld: {
    "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", "name": title, "url": url },
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Athletes", "item": `${SITE_URL}/athletes/` },
        { "@type": "ListItem", "position": 2, "name": team.name, "item": url }
      ]}
    ]
  }}) + `
    <section class="container athlete-hero">
      <nav class="crumbs crumbs-row"><span><a href="/athletes/">Athletes</a> › <span>${esc(team.name)}</span></span> ${teamJump(prefix, slug)}</nav>
      <h1>${esc(team.name)} NIL valuations</h1>
      <p class="athlete-sub">${roster.length} athletes${team.conference ? ' · ' + esc(team.conference) : ''} · estimated ranges as of ${FOLLOWERS_AS_OF}</p>
      ${team.nilContext ? `<p class="how-prose team-context">${esc(team.nilContext)}</p>` : ''}
    </section>
    ${adUnit()}
    <section class="container">
      <div class="table-scroll"><table class="data-table roster-table">
        <thead><tr><th>Athlete</th><th>Position</th><th>Class</th><th>2026 role</th><th>Est. range</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="muted">The exact estimate and breakdown for each athlete are free on their page with an email.</p>
    </section>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

function directoryPage(athletes, teams) {
  const prefix = '../';
  const url = `${SITE_URL}/athletes/`;
  const title = `College Athlete NIL Valuations 2026: Browse by Team & Conference`;
  const desc = `Estimated NIL valuations for ${athletes.length.toLocaleString('en-US')} college athletes, organized by conference and team. Every Power Four football roster plus baseball, basketball and more.`;
  const bySlugCount = {};
  athletes.forEach(a => { bySlugCount[a.team] = (bySlugCount[a.team] || 0) + 1; });
  const confs = {};
  Object.entries(teams).forEach(([slug, t]) => {
    const conf = CONF_ORDER.includes(t.conference) ? t.conference : 'Other conferences & sports';
    (confs[conf] = confs[conf] || []).push([slug, t]);
  });
  const sections = [...CONF_ORDER, 'Other conferences & sports'].filter(c => confs[c]).map(conf => {
    const rows = confs[conf].sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([slug, t]) => {
      const top = teamAthletes(slug).find(x => !x.thin);
      return `<tr><td><a href="/team/${slug}/">${esc(t.name)}</a></td><td>${esc(t.sport === 'Multiple' ? 'Football & more' : t.sport)}</td><td class="num">${bySlugCount[slug] || 0}</td><td>${top ? `<a href="/athlete/${top.slug}/">${esc(top.name)}</a>` : ''}</td></tr>`;
    }).join('');
    return `<div class="module conf-module" id="conf-${confSlug(conf)}">
      <div class="module-hd">${esc(conf)}</div>
      <div class="module-bd"><div class="table-scroll"><table class="data-table">
        <thead><tr><th>Team</th><th>Sports</th><th class="num">Athletes</th><th>Top valuation</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div>
    </div>`;
  }).join('');
  return head({ title, desc, canonical: url, prefix, jsonld: {
    "@context": "https://schema.org", "@type": "CollectionPage", "name": title, "url": url
  }}) + `
    <section class="container athlete-hero">
      <h1>College athlete NIL valuations</h1>
      <p class="athlete-sub">${athletes.length.toLocaleString('en-US')} athletes across ${Object.keys(teams).length} programs. Pick a team, or search any player from the bar above.</p>
      <div class="jump-bar">
        ${[...CONF_ORDER, 'Other conferences & sports'].map(c => `<a class="jump-pill" href="#conf-${confSlug(c)}">${esc(c === 'Other conferences & sports' ? 'Other' : c)}</a>`).join('')}
        ${teamJump(prefix)}
      </div>
    </section>
    ${adUnit()}
    <section class="container">
      ${sections}
    </section>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- guide article ---------- */
function guidePage(g) {
  const prefix = '../../';
  const url = `${SITE_URL}/guide/${g.slug}/`;
  const jsonld = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": g.title, "description": g.desc,
    "datePublished": g.date, "dateModified": g.date,
    "author": { "@type": "Organization", "name": "HowMuchNIL" },
    "publisher": { "@type": "Organization", "name": "HowMuchNIL" },
    "mainEntityOfPage": url
  };
  return head({ title: `${g.title} | HowMuchNIL`, desc: g.desc, canonical: url, prefix, jsonld }) + `
    <section class="container narrow article">
      <nav class="crumbs"><a href="/">Home</a> › <a href="/guides/">Articles</a> › <span>${esc(g.title)}</span></nav>
      <h1>${esc(g.title)}</h1>
      <p class="article-meta">Updated ${g.date}</p>
      ${g.body}
      <div class="cta-inline">
        <p><strong>Curious about a specific player?</strong> Look anyone up, or estimate any athlete in seconds.</p>
        <a class="btn btn-primary" href="/#calculator">Open the NIL calculator</a>
      </div>
    </section>
    ${adUnit()}
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- guides index ---------- */
function guidesIndex() {
  const prefix = '../';
  const url = `${SITE_URL}/guides/`;
  const items = [...GUIDES].sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(g =>
    `<li><a class="hl-title" href="/guide/${g.slug}/">${esc(g.title)}</a><span class="hl-meta">${esc(g.date || '')}</span><p class="hl-dek">${esc(g.desc)}</p></li>`).join('');
  const top = [...DATA.athletes].filter(a => !a.former).sort((a, b) => b.valuation - a.valuation).slice(0, 10).map(a => {
    const lo = a.low || a.valuation * 0.8, hi = a.high || a.valuation * 1.25;
    return `<li><a href="/athlete/${a.slug}/">${esc(a.name)}</a><span class="rank-val">${moneyShort(lo)} to ${moneyShort(hi)}</span></li>`;
  }).join('');
  return head({
    title: 'NIL Articles and Rankings | HowMuchNIL',
    desc: 'NIL transfer rankings, deal breakdowns and the numbers behind college sports money: the highest-paid athletes, how valuations work, and what revenue sharing changed.',
    canonical: url, prefix,
    jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", "name": "NIL Articles", "url": url }
  }) + `
    <section class="container athlete-hero">
      <h1>NIL articles and rankings</h1>
      <p class="athlete-sub">Transfer rankings, deal breakdowns and the numbers behind college sports money.</p>
    </section>
    <div class="container portal-grid two-col">
      <div class="portal-col portal-main">
        <div class="module">
          <div class="module-hd">All articles</div>
          <div class="module-bd"><ul class="headline-list">${items}</ul></div>
        </div>
      </div>
      <div class="portal-col">
        <div class="module">
          <div class="module-hd">Top NIL valuations</div>
          <div class="module-bd"><ol class="rank-list">${top}</ol>
          <p class="mod-more"><a href="/athletes/">View all athletes</a></p></div>
        </div>
        <div class="module nl-module">
          <div class="module-hd">The NIL newsletter</div>
          <div class="module-bd">
            <p class="mod-note">Deal breakdowns, valuation updates and new athletes added to the database. Free.</p>
            <form class="cta-form" id="cta-email-form" action="${FORMSPREE}" method="POST">
              <input type="hidden" name="newsletter" value="yes" />
              <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
              <button class="btn btn-primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ` + foot(prefix);
}

/* ---------- write helpers ---------- */
function writeFile(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log('  wrote', rel);
}

/* ---------- run ---------- */
const athletes = DATA.athletes || [];
const teams = DATA.teams || {};
console.log(`Generating from ${athletes.length} athletes, ${Object.keys(teams).length} teams...`);

athletes.forEach(a => writeFile(path.join('athlete', a.slug, 'index.html'), athletePage(a)));

writeFile(path.join('athletes', 'index.html'), directoryPage(athletes, teams));
Object.keys(DATA.teams).forEach(slug => writeFile(path.join('team', slug, 'index.html'), teamPage(slug)));
console.log('  wrote', Object.keys(DATA.teams).length, 'team pages');

GUIDES.forEach(g => writeFile(path.join('guide', g.slug, 'index.html'), guidePage(g)));
writeFile(path.join('guides', 'index.html'), guidesIndex());

/* Live athlete count, rounded down to a clean number for the homepage copy. */
const COUNT_LABEL = Math.floor(DATA.athletes.length / 10) * 10 + '+';

/* Left-rail portal module: trending (top-searched) and recently added players. */
const TRENDING_SLUGS = ['tre-phelps', 'carson-tinney', 'arch-manning', 'jeremiah-smith', 'brendan-sorsby', 'aj-dybantsa', 'lj-mercurius', 'anthony-pack-jr', 'malachi-toney', 'whit-weeks'];
const bySlugAll = new Map(DATA.athletes.map(a => [a.slug, a]));
const trendLinks = TRENDING_SLUGS.map(sl => bySlugAll.get(sl)).filter(Boolean)
  .map(a => `<a href="/athlete/${a.slug}/">${esc(a.name)}</a>`).join(', ');
const recentLinks = [...DATA.athletes].filter(a => !a.thin).slice(-10).reverse()
  .map(a => `<a href="/athlete/${a.slug}/">${esc(a.name)}</a>`).join(', ');
const PORTAL_LEFT = `<div class="module">
  <div class="module-hd">${DATA.athletes.length.toLocaleString('en-US')} college athletes</div>
  <div class="module-bd">
    <p class="mod-note">Estimated NIL value ranges for every Power Four football roster, plus baseball, basketball, softball and more. Updated ${FOLLOWERS_AS_OF}.</p>
    <p class="mod-label">Trending player pages</p>
    <p class="linklist">${trendLinks}</p>
    <p class="mod-label">Recently updated</p>
    <p class="linklist">${recentLinks}</p>
    <p class="mod-more"><a href="/athletes/">Browse all athletes</a></p>
  </div>
</div>`;

const ARTICLES_COMPACT = `<ul class="headline-list compact">${[...GUIDES].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8).map(g =>
  `<li><a class="hl-title" href="/guide/${g.slug}/">${esc(g.title)}</a></li>`).join('')}</ul>
<p class="mod-more"><a href="/guides/">All articles</a></p>`;

/* ESPN-style headline list of latest articles, stamped between ARTICLES markers. */
const latest = [...GUIDES].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 6);
const ARTICLES_LIST = `<ul class="headline-list">${latest.map(g =>
  `<li><a class="hl-title" href="/guide/${g.slug}/">${esc(g.title)}</a><span class="hl-meta">${esc(g.date || '')}</span><p class="hl-dek">${esc(g.desc || '')}</p></li>`).join('')}</ul>`;

/* Homepage top-25 valuations table, stamped between TOP25 markers. */
const top25 = [...DATA.athletes].filter(a => !a.former).sort((x, y) => y.valuation - x.valuation).slice(0, 25);
const TOP25_RAIL = `<ol class="rank-list">${top25.slice(0, 10).map((a, i) => {
  const lo = a.low || Math.round(a.valuation * 0.8), hi = a.high || Math.round(a.valuation * 1.25);
  return `<li><a href="/athlete/${a.slug}/">${esc(a.name)}</a><span class="rank-val">${moneyShort(lo)} to ${moneyShort(hi)}</span></li>`;
}).join('')}</ol>
<p class="mod-more"><a href="/athletes/">View all athletes</a></p>`;

/* Stamp the current asset version onto the hand-written static pages too. */
['index.html', 'about.html', 'privacy.html', 'terms.html', 'contact.html'].forEach(f => {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return;
  const out = fs.readFileSync(fp, 'utf8')
    .replace(/(assets\/css\/styles\.css|assets\/js\/calculator\.js)(\?v=[a-z0-9]+)?/g, `$1?v=${ASSET_VER}`)
    .replace(/<!-- ANALYTICS:START -->[\s\S]*?<!-- ANALYTICS:END -->/, `<!-- ANALYTICS:START -->${analyticsSnippet()}<!-- ANALYTICS:END -->`)
    .replace(/<!-- COUNT:START -->[\s\S]*?<!-- COUNT:END -->/g, `<!-- COUNT:START -->${COUNT_LABEL}<!-- COUNT:END -->`)
    .replace(/<!-- TOP25:START -->[\s\S]*?<!-- TOP25:END -->/g, `<!-- TOP25:START -->${TOP25_RAIL}<!-- TOP25:END -->`)
    .replace(/<!-- ARTICLES:START -->[\s\S]*?<!-- ARTICLES:END -->/g, `<!-- ARTICLES:START -->${ARTICLES_LIST}<!-- ARTICLES:END -->`)
    .replace(/<!-- PORTAL:START -->[\s\S]*?<!-- PORTAL:END -->/g, `<!-- PORTAL:START -->${PORTAL_LEFT}<!-- PORTAL:END -->`);
  fs.writeFileSync(fp, out);
  console.log('  stamped', f, '→ v=' + ASSET_VER);
});

/* client-side search / similar-players index (consumed by calculator.js) */
const index = athletes.map(a => {
  const team = teams[a.team] || {};
  return {
    slug: a.slug, name: a.name, team: team.name || a.team, sport: a.sport,
    position: a.position, former: !!a.former, nowWith: a.nowWith || '',
    value: a.valuation, low: a.low || Math.round(a.valuation * 0.8), high: a.high || Math.round(a.valuation * 1.25)
  };
}).sort((x, y) => y.value - x.value);
writeFile(path.join('assets', 'data', 'athletes-index.json'), JSON.stringify(index));

/* sitemap */
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/athletes/`,
  `${SITE_URL}/about.html`,
  `${SITE_URL}/privacy.html`,
  `${SITE_URL}/terms.html`,
  `${SITE_URL}/guides/`,
  ...Object.keys(DATA.teams).map(t => `${SITE_URL}/team/${t}/`),
  ...GUIDES.map(g => `${SITE_URL}/guide/${g.slug}/`),
  ...athletes.filter(a => !a.thin).map(a => `${SITE_URL}/athlete/${a.slug}/`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('  wrote sitemap.xml (' + urls.length + ' urls)');
console.log('Done.');
