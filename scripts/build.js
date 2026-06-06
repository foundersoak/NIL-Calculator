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

/* ---- Config: change SITE_URL to your custom domain when you have one ---- */
const SITE_URL = 'https://foundersoak.github.io/NIL-Calculator'; // no trailing slash
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';
const FORMSPREE = 'https://formspree.io/f/mkoangpz';
const UPDATED = DATA.updated || new Date().toISOString().slice(0, 10);

/* Asset version: hash of CSS+JS so browsers re-fetch when either changes. */
const crypto = require('crypto');
const ASSET_VER = (() => {
  try {
    const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'styles.css'));
    const js = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'calculator.js'));
    return crypto.createHash('md5').update(css).update(js).digest('hex').slice(0, 8);
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

/* Four-pillar breakdown for a known valuation (mirrors calculator.js weighting). */
function breakdown(a) {
  const f = a.followers || {};
  const eng = (a.engagement || 3) / 100;
  const social = (f.instagram || 0) * eng * 2 + (f.tiktok || 0) * eng * 1.2 +
                 (f.x || 0) * eng * 1 + (f.youtube || 0) * eng * 4.5;
  // Proportional split, weighted toward influence for social-heavy athletes.
  const parts = {
    influence: Math.max(social, 1) * 1.0,
    exposure: Math.max(social, 1) * 0.55 + 1,
    performance: Math.max(social, 1) * 0.45 + 1,
    brand: Math.max(social, 1) * 0.5 + 1
  };
  const sum = parts.influence + parts.exposure + parts.performance + parts.brand;
  return [
    { key: 'influence', label: 'Influence (social)', pct: parts.influence / sum },
    { key: 'exposure', label: 'Exposure (program/market)', pct: parts.exposure / sum },
    { key: 'performance', label: 'Performance', pct: parts.performance / sum },
    { key: 'brand', label: 'Brand & sport', pct: parts.brand / sum }
  ];
}

/* ---------- shared HTML chunks ---------- */
function head(opts) {
  const { title, desc, canonical, prefix, jsonld } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#0b1120" />
  <meta name="nil-base" content="${prefix}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}assets/css/styles.css?v=${ASSET_VER}" />
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="${prefix}index.html">
        <span class="brand-mark" aria-hidden="true">NIL</span>
        <span class="brand-text">Value<span class="brand-accent">Calc</span></span>
      </a>
      <nav class="nav-links">
        <a href="${prefix}athletes/index.html">Athletes</a>
        <a href="${prefix}index.html#calculator">Calculator</a>
        <a href="${prefix}index.html#how">How it works</a>
        <a class="nav-cta" href="${prefix}index.html#calculator">Look up a player</a>
      </nav>
    </div>
  </header>
  <main>`;
}

function adUnit() {
  return `<div class="container ad-wrap"><p class="ad-label">Advertisement</p>
    <ins class="adsbygoogle ad-inline" style="display:block" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="2222222222" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
}

function emailCapture(prefix) {
  return `<section class="container narrow">
    <div class="email-capture light">
      <h4>Get the NIL newsletter 📩</h4>
      <p>Deal breakdowns, valuation updates and athlete brand tips. Free.</p>
      <form class="email-form" action="${FORMSPREE}" method="POST">
        <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
        <button type="submit" class="btn btn-primary">Subscribe</button>
      </form>
      <p class="privacy-note"><a href="${prefix}privacy.html">Privacy</a> · No spam, unsubscribe anytime.</p>
    </div>
  </section>`;
}

function foot(prefix) {
  return `</main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="${prefix}index.html"><span class="brand-mark" aria-hidden="true">NIL</span><span class="brand-text">Value<span class="brand-accent">Calc</span></span></a>
        <p class="footer-tag">Know the value. Follow the money.</p>
      </div>
      <nav class="footer-links">
        <a href="${prefix}athletes/index.html">Athletes</a>
        <a href="${prefix}index.html#calculator">Calculator</a>
        <a href="${prefix}privacy.html">Privacy</a>
        <a href="${prefix}terms.html">Terms</a>
      </nav>
    </div>
    <div class="container footer-bottom">
      <p>© ${new Date().getFullYear()} NIL ValueCalc. NIL valuations are estimates of 12-month earning potential based on public data and our model, not amounts paid, and not endorsed by the athletes or schools. Informational only; not financial, legal or tax advice. Not affiliated with the NCAA. Data updated ${UPDATED}.</p>
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

function socialTable(a) {
  const f = a.followers || {};
  const rows = [
    ['Instagram', f.instagram], ['TikTok', f.tiktok], ['X / Twitter', f.x], ['YouTube', f.youtube]
  ].filter(r => r[1]).map(r => `<tr><td>${r[0]}</td><td>${(r[1]).toLocaleString('en-US')}</td></tr>`).join('');
  return rows ? `<table class="data-table"><thead><tr><th>Platform</th><th>Followers (approx.)</th></tr></thead><tbody>${rows}</tbody></table>` : '';
}

/* ---------- athlete page ---------- */
function athletePage(a) {
  const team = DATA.teams[a.team] || { name: a.team, conference: '', sport: a.sport };
  const prefix = '../../';
  const url = `${SITE_URL}/athlete/${a.slug}/`;
  const title = a.former
    ? `How Much Did ${a.name} Make in NIL? | ${team.name} ${a.sport}`
    : `How Much Does ${a.name} Make in NIL? | ${team.name} ${a.sport}`;
  const desc = a.former
    ? `${a.name}, former ${esc(team.name)} ${a.sport.toLowerCase()} star${a.nowWith ? ` (now ${esc(a.nowWith)})` : ''}. See the social following, NIL factors and unlock the estimated college NIL valuation, free.`
    : `${a.name}, ${esc(team.name)} ${a.sport.toLowerCase()}. See the social following and NIL factors, and unlock ${a.name.split(' ')[0]}'s estimated 2026 NIL valuation. Free.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "name": a.name, "jobTitle": `${a.position}, ${team.name}`,
        "affiliation": { "@type": "SportsTeam", "name": team.name }, "url": url },
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Athletes", "item": `${SITE_URL}/athletes/` },
        { "@type": "ListItem", "position": 2, "name": a.name, "item": url }
      ]},
      { "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": `How much ${a.former ? 'did' : 'does'} ${a.name} make in NIL?`,
          "acceptedAnswer": { "@type": "Answer", "text": a.former
            ? `${a.name}'s estimated college NIL valuation is based on social following, on-field performance and market. Unlock the figure with our free NIL calculator. It's an estimate of earning potential, not a confirmed salary.`
            : `${a.name}'s estimated 2026 NIL valuation is based on social following, on-field performance and market reach. Unlock the figure with our free NIL calculator. It's an estimate of earning potential, not a confirmed salary.` } },
        { "@type": "Question", "name": `What team ${a.former ? 'did' : 'does'} ${a.name} play for?`,
          "acceptedAnswer": { "@type": "Answer", "text": a.former
            ? `${a.name} played ${a.position} for the ${team.name}${a.nowWith ? ` and is now with ${a.nowWith}` : ''}.`
            : `${a.name} plays ${a.position} for the ${team.name}.` } }
      ]}
    ]
  };

  const lo = a.low || Math.round(a.valuation * 0.8);
  const hi = a.high || Math.round(a.valuation * 1.25);
  const barsJson = esc(JSON.stringify(breakdown(a).map(b => ({ key: b.key, label: b.label, pct: b.pct }))));

  return head({ title, desc, canonical: url, prefix, jsonld }) + `
    <section class="container narrow athlete-hero">
      <nav class="crumbs"><a href="${prefix}athletes/index.html">Athletes</a> › <span>${esc(a.name)}</span></nav>
      <h1>How much ${a.former ? 'did' : 'does'} ${esc(a.name)} make in NIL?</h1>
      <p class="athlete-sub">${a.former ? 'Former ' : ''}${esc(a.position)} · ${esc(team.name)}${team.conference ? ' · ' + esc(team.conference) : ''}${a.former && a.nowWith ? ` · <strong>Now: ${esc(a.nowWith)}</strong>` : ''}</p>
      <p class="athlete-blurb">${esc(a.blurb || '')}</p>

      <div class="nil-gate" data-value="${a.valuation}" data-low="${lo}" data-high="${hi}"
           data-name="${esc(a.name)}" data-reported="${a.reported ? 1 : 0}"
           data-note="${esc((a.reported ? 'Based on publicly reported figures' : 'Modeled estimate') + (a.former ? ' · final season in college' : ' · 12-month earning potential'))}"
           data-bars="${barsJson}">
        <div class="gate-locked">
          <span class="result-eyebrow">🔒 ${a.former ? 'Final college NIL valuation' : 'Estimated 2026 NIL valuation'}</span>
          <div class="big-number blurred" aria-hidden="true">$•,•••,•••</div>
          <p class="gate-pitch">Enter your email to unlock ${esc(a.name.split(' ')[0])}'s estimated NIL value, the likely range, and the full breakdown. Free.</p>
          <form class="gate-form email-form" action="${FORMSPREE}" method="POST">
            <input type="hidden" name="unlock_athlete" value="${esc(a.name)}" />
            <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
            <button type="submit" class="btn btn-primary">Unlock the value</button>
          </form>
          <p class="privacy-note">No spam. Unsubscribe anytime. <a href="${prefix}privacy.html">Privacy</a>.</p>
        </div>
        <div class="gate-reveal" hidden></div>
      </div>
    </section>
    ${adUnit()}
    <section class="container narrow">
      <h2>Social media following</h2>
      ${socialTable(a) || '<p>We\'ll add social numbers soon.</p>'}
      ${totalFollowers(a) ? `<p class="muted">That's about ${totalFollowers(a).toLocaleString('en-US')} followers in all (rough number).</p>` : ''}

      <h2>How we estimate ${esc(a.name.split(' ')[0])}'s NIL value</h2>
      <p>An NIL value is an estimate of how much a player could earn in a year. It is not a salary or a confirmed deal. We weigh four things brands care about: <strong>fans</strong> (social reach and engagement), <strong>stage</strong> (school, conference and market), <strong>game</strong> (on-field role and performance), and <strong>brand</strong> (sport and story).${a.source ? ` Where a public figure exists, we sense-check against it (<a href="${a.sourceUrl}" rel="nofollow noopener" target="_blank">${esc(a.source)}</a>).` : ''}</p>

      <div class="cta-inline">
        <p><strong>Curious about another player?</strong> Look one up or estimate any athlete in seconds.</p>
        <a class="btn btn-primary" href="${prefix}index.html#calculator">Open the NIL calculator</a>
      </div>
    </section>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- athletes directory ---------- */
function directoryPage(athletes, teams) {
  const prefix = '../';
  const url = `${SITE_URL}/athletes/`;
  const title = `College Athlete NIL Valuations 2026: Browse by Player & Team`;
  const desc = `Browse estimated 2026 NIL valuations for top college athletes and team rosters. See how much your favorite players make in NIL.`;
  const sorted = athletes.slice().sort((x, y) => y.valuation - x.valuation);
  const cards = sorted.map(a => {
    const team = teams[a.team] || {};
    return `<a class="athlete-card" href="${prefix}athlete/${a.slug}/index.html">
      <span class="ac-tag">${esc(a.sport)}</span>
      <strong>${esc(a.name)}</strong>
      <span class="ac-meta">${esc(a.position)} · ${esc(team.name || '')}${a.former ? ' · former' : ''}</span>
      <span class="ac-cta">View NIL value ›</span>
    </a>`;
  }).join('');
  return head({ title, desc, canonical: url, prefix, jsonld: {
    "@context": "https://schema.org", "@type": "CollectionPage", "name": title, "url": url
  }}) + `
    <section class="container narrow athlete-hero">
      <h1>College athlete NIL valuations</h1>
      <p class="athlete-sub">Browse top players and unlock each one's estimated 2026 NIL value, free.</p>
    </section>
    ${adUnit()}
    <section class="container">
      <h2>Browse athletes</h2>
      <div class="athlete-grid">${cards}</div>
      <div class="cta-inline" style="margin-top:2rem">
        <p><strong>Don't see someone?</strong> Look up a player or estimate any athlete with the calculator.</p>
        <a class="btn btn-primary" href="${prefix}index.html#calculator">Open the NIL calculator</a>
      </div>
    </section>
    ${emailCapture(prefix)}
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

/* Stamp the current asset version onto the hand-written static pages too. */
['index.html', 'privacy.html', 'terms.html'].forEach(f => {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return;
  const out = fs.readFileSync(fp, 'utf8')
    .replace(/(assets\/css\/styles\.css|assets\/js\/calculator\.js)(\?v=[a-z0-9]+)?/g, `$1?v=${ASSET_VER}`);
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
  `${SITE_URL}/privacy.html`,
  `${SITE_URL}/terms.html`,
  ...athletes.map(a => `${SITE_URL}/athlete/${a.slug}/`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('  wrote sitemap.xml (' + urls.length + ' urls)');
console.log('Done.');
