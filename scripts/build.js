#!/usr/bin/env node
/* ============================================================
   NIL ValueCalc — static page generator
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
  <link rel="stylesheet" href="${prefix}assets/css/styles.css" />
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
        <a class="nav-cta" href="${prefix}index.html#calculator">Estimate yours</a>
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
      <p>Deal breakdowns, valuation updates and athlete brand tips — free.</p>
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
      <p>© ${new Date().getFullYear()} NIL ValueCalc. NIL valuations are estimates of 12-month earning potential based on public data and our model — not amounts paid, and not endorsed by the athletes or schools. Informational only; not financial, legal or tax advice. Not affiliated with the NCAA. Data updated ${UPDATED}.</p>
    </div>
  </footer>
  <script src="${prefix}assets/js/calculator.js" defer></script>
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
    ? `How Much Did ${a.name} Make in NIL? (College Value: ${moneyShort(a.valuation)})`
    : `How Much Does ${a.name} Make in NIL? (2026 Value: ${moneyShort(a.valuation)})`;
  const desc = a.former
    ? `${a.name}'s NIL valuation at ${esc(team.name)} was about ${money(a.valuation)} before turning pro${a.nowWith ? ` (now ${esc(a.nowWith)})` : ''}. See the ${a.sport.toLowerCase()} star's social following and how the figure is calculated.`
    : `${a.name}'s estimated 2026 NIL valuation is ${money(a.valuation)}. See the ${esc(team.name)} ${a.sport.toLowerCase()} star's social following, valuation breakdown and how it's calculated.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "name": a.name, "jobTitle": `${a.position}, ${team.name}`,
        "affiliation": { "@type": "SportsTeam", "name": team.name }, "url": url },
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Athletes", "item": `${SITE_URL}/athletes/` },
        { "@type": "ListItem", "position": 2, "name": team.name, "item": `${SITE_URL}/team/${a.team}/` },
        { "@type": "ListItem", "position": 3, "name": a.name, "item": url }
      ]},
      { "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": `How much ${a.former ? 'did' : 'does'} ${a.name} make in NIL?`,
          "acceptedAnswer": { "@type": "Answer", "text": a.former
            ? `${a.name}'s NIL valuation while at ${team.name} was estimated around ${money(a.valuation)} over a 12-month window before turning professional${a.nowWith ? ` (now with ${a.nowWith})` : ''}. This is an estimate, not a confirmed salary.`
            : `${a.name}'s estimated NIL valuation for 2026 is approximately ${money(a.valuation)} over a 12-month window. This is an estimate of earning potential, not a confirmed salary.` } },
        { "@type": "Question", "name": `What team ${a.former ? 'did' : 'does'} ${a.name} play for?`,
          "acceptedAnswer": { "@type": "Answer", "text": a.former
            ? `${a.name} played ${a.position} for the ${team.name}${a.nowWith ? ` and is now with ${a.nowWith}` : ''}.`
            : `${a.name} plays ${a.position} for the ${team.name}.` } }
      ]}
    ]
  };

  return head({ title, desc, canonical: url, prefix, jsonld }) + `
    <section class="container narrow athlete-hero">
      <nav class="crumbs"><a href="${prefix}athletes/index.html">Athletes</a> › <a href="${prefix}team/${a.team}/index.html">${esc(team.name)}</a> › <span>${esc(a.name)}</span></nav>
      <h1>How much ${a.former ? 'did' : 'does'} ${esc(a.name)} make in NIL?</h1>
      <p class="athlete-sub">${a.former ? 'Former ' : ''}${esc(a.position)} · ${esc(team.name)}${team.conference ? ' · ' + esc(team.conference) : ''}${a.former && a.nowWith ? ` · <strong>Now: ${esc(a.nowWith)}</strong>` : ''}</p>
      <div class="valuation-hero">
        <div>
          <span class="result-eyebrow">${a.former ? 'Final college NIL valuation' : 'Estimated 2026 NIL valuation'}</span>
          <div class="big-number">${money(a.valuation)}</div>
          <p class="val-note">${a.reported ? 'Based on publicly reported figures' : 'Modeled estimate'} · ${a.former ? 'final season in college' : '12-month earning potential'}${a.source ? ` · <a href="${a.sourceUrl}" rel="nofollow noopener" target="_blank">Source: ${esc(a.source)}</a>` : ''}</p>
        </div>
      </div>
      <p class="athlete-blurb">${esc(a.blurb || '')}</p>
    </section>
    ${adUnit()}
    <section class="container narrow">
      <h2>Why ${esc(a.name)} is worth this much</h2>
      ${breakdownBars(a)}
      <h2>Social media following</h2>
      ${socialTable(a) || '<p>We\'ll add social numbers soon.</p>'}
      ${totalFollowers(a) ? `<p class="muted">That's about ${totalFollowers(a).toLocaleString('en-US')} followers in all (rough number).</p>` : ''}

      <h2>How we get this number</h2>
      <p>An NIL value is a guess at how much money a player could make in one year. It is not a paycheck. We look at four things: their <strong>fans</strong> (social media), their <strong>stage</strong> (school and league), their <strong>game</strong> (how they play), and their <strong>brand</strong> (their sport and story).</p>

      <div class="cta-inline">
        <p><strong>Want your own number?</strong> See what your NIL could be worth in 30 seconds.</p>
        <a class="btn btn-primary" href="${prefix}index.html#calculator">Try the calculator</a>
      </div>
    </section>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- team page ---------- */
function teamPage(slug, team, roster) {
  const prefix = '../../';
  const url = `${SITE_URL}/team/${slug}/`;
  const sorted = roster.slice().sort((x, y) => y.valuation - x.valuation);
  const total = sorted.reduce((s, a) => s + a.valuation, 0);
  const title = `${team.name} NIL Roster Value 2026 — Player-by-Player Breakdown`;
  const desc = `The ${team.name} have an estimated combined NIL roster value of ${moneyShort(total)} for 2026. See every player's NIL valuation, ranked.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "SportsTeam", "name": team.name, "sport": team.sport, "url": url,
    "member": sorted.map(a => ({ "@type": "Person", "name": a.name, "url": `${SITE_URL}/athlete/${a.slug}/` }))
  };
  const rows = sorted.map((a, i) =>
    `<tr><td>${i + 1}</td><td><a href="${prefix}athlete/${a.slug}/index.html">${esc(a.name)}</a>${a.former ? ' <span class="muted">(former)</span>' : ''}</td><td>${esc(a.position)}</td><td class="num">${money(a.valuation)}</td></tr>`).join('');

  return head({ title, desc, canonical: url, prefix, jsonld }) + `
    <section class="container narrow athlete-hero">
      <nav class="crumbs"><a href="${prefix}athletes/index.html">Athletes</a> › <span>${esc(team.name)}</span></nav>
      <h1>${esc(team.name)} NIL roster value</h1>
      <p class="athlete-sub">${esc(team.conference)}${team.conference ? ' · ' : ''}${esc(team.sport)} · 2026</p>
      <div class="valuation-hero">
        <div>
          <span class="result-eyebrow">Estimated combined roster NIL value</span>
          <div class="big-number">${money(total)}</div>
          <p class="val-note">Sum of tracked players' estimated 12-month NIL valuations</p>
        </div>
      </div>
    </section>
    ${adUnit()}
    <section class="container narrow">
      <h2>${esc(team.name)} players by NIL value</h2>
      <table class="data-table ranked"><thead><tr><th>#</th><th>Player</th><th>Position</th><th class="num">Est. NIL value</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="muted">These are estimates of what each player could earn in a year, not what the school spent. We add more players over time.</p>
      <div class="cta-inline">
        <p><strong>Want another player?</strong> See what anyone's NIL could be worth.</p>
        <a class="btn btn-primary" href="${prefix}index.html#calculator">Try the calculator</a>
      </div>
    </section>
    ${emailCapture(prefix)}
  ` + foot(prefix);
}

/* ---------- athletes directory ---------- */
function directoryPage(athletes, teams) {
  const prefix = '../';
  const url = `${SITE_URL}/athletes/`;
  const title = `College Athlete NIL Valuations 2026 — Browse by Player & Team`;
  const desc = `Browse estimated 2026 NIL valuations for top college athletes and team rosters. See how much your favorite players make in NIL.`;
  const sorted = athletes.slice().sort((x, y) => y.valuation - x.valuation);
  const cards = sorted.map(a => {
    const team = teams[a.team] || {};
    return `<a class="athlete-card" href="${prefix}athlete/${a.slug}/index.html">
      <span class="ac-rank">${moneyShort(a.valuation)}</span>
      <strong>${esc(a.name)}</strong>
      <span class="ac-meta">${esc(a.position)} · ${esc(team.name || '')}${a.former ? ' · former' : ''}</span>
    </a>`;
  }).join('');
  const teamList = Object.keys(teams).filter(slug => athletes.some(a => a.team === slug)).map(slug =>
    `<a class="team-chip" href="${prefix}team/${slug}/index.html">${esc(teams[slug].name)} roster value</a>`).join('');

  return head({ title, desc, canonical: url, prefix, jsonld: {
    "@context": "https://schema.org", "@type": "CollectionPage", "name": title, "url": url
  }}) + `
    <section class="container narrow athlete-hero">
      <h1>College athlete NIL valuations</h1>
      <p class="athlete-sub">Estimated 2026 NIL values for top players and teams.</p>
    </section>
    ${adUnit()}
    <section class="container">
      <h2>Top athletes by NIL value</h2>
      <div class="athlete-grid">${cards}</div>
      <h2 style="margin-top:2rem">Team roster values</h2>
      <div class="team-chips">${teamList}</div>
      <div class="cta-inline" style="margin-top:2rem">
        <p><strong>Don't see someone?</strong> Estimate any athlete's NIL value with the calculator.</p>
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

Object.keys(teams).forEach(slug => {
  const roster = athletes.filter(a => a.team === slug);
  if (roster.length) writeFile(path.join('team', slug, 'index.html'), teamPage(slug, teams[slug], roster));
});

writeFile(path.join('athletes', 'index.html'), directoryPage(athletes, teams));

/* sitemap */
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/athletes/`,
  `${SITE_URL}/privacy.html`,
  `${SITE_URL}/terms.html`,
  ...athletes.map(a => `${SITE_URL}/athlete/${a.slug}/`),
  ...Object.keys(teams).filter(s => athletes.some(a => a.team === s)).map(s => `${SITE_URL}/team/${s}/`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('  wrote sitemap.xml (' + urls.length + ' urls)');
console.log('Done.');
