#!/usr/bin/env node
/* ============================================================
   Football roster sweep — deterministic per-team merge.

   Usage: node merge-team.js <team-slug>

   Reads  <sweepDir>/out/<slug>-tiered.json  (agent output)
   Writes <repo>/data/incoming.json          (for scripts/add-athletes.js)

   - Researched players (agents found NIL/social data): use their numbers.
   - Everyone else: consistent coded rubric (tier x position x program).
   - Existing slug, same team  -> update-mode (preserve valuation/blurb/
     source/reported/low/high; refresh followers/position/class/etc.)
   - Existing slug, diff team, same sport -> REVIEW list (possible
     transfer vs. distinct person) — skipped, resolved by hand.
   - Existing slug, diff sport -> new record with "-<school>" slug suffix.
   - Duplicate names within one roster -> jersey-number suffix.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', '..');
const SWEEP = __dirname;
const OUT = path.join(SWEEP, 'out');

const teamArg = process.argv[2];
if (!teamArg) { console.error('usage: node merge-team.js <team-slug>'); process.exit(1); }

const cfg = JSON.parse(fs.readFileSync(path.join(SWEEP, 'teams.json'), 'utf8'));
const team = cfg.teams.find(t => t.slug === teamArg);
if (!team) { console.error('unknown team ' + teamArg); process.exit(1); }

const tieredPath = path.join(OUT, team.slug + '-tiered.json');
const tiered = JSON.parse(fs.readFileSync(tieredPath, 'utf8'));
const db = JSON.parse(fs.readFileSync(path.join(REPO, 'data', 'athletes.json'), 'utf8'));
const bySlug = new Map(db.athletes.map(a => [a.slug, a]));

/* ---------- helpers (slugify copied from add-athletes.js) ---------- */
const slugify = s => String(s).toLowerCase()
  .replace(/['’.]/g, '').replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function hash01(s) { // deterministic 0..1 per player
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return (h % 10000) / 10000;
}

const POS_FULL = {
  QB: 'Quarterback', RB: 'Running Back', FB: 'Fullback', WR: 'Wide Receiver',
  TE: 'Tight End', OL: 'Offensive Lineman', EDGE: 'Edge Rusher',
  DL: 'Defensive Lineman', LB: 'Linebacker', CB: 'Cornerback', S: 'Safety',
  DB: 'Defensive Back', ATH: 'Athlete', K: 'Kicker', P: 'Punter', LS: 'Long Snapper'
};

function inferGroup(raw) {
  const p = String(raw || '').toUpperCase().replace(/[^A-Z/]/g, '');
  if (/QB/.test(p)) return 'QB';
  if (/RB|HB|TB/.test(p)) return 'RB';
  if (/FB/.test(p)) return 'FB';
  if (/WR|REC/.test(p)) return 'WR';
  if (/TE/.test(p)) return 'TE';
  if (/OT|OG|OL|IOL|^C$|C\b|GUARD|TACKLE|CENTER|OFFENSIVELINE/.test(p)) return 'OL';
  if (/EDGE|RUSH|JACK|BANDIT/.test(p)) return 'EDGE';
  if (/DE\b/.test(p)) return 'EDGE';
  if (/DT|NT|NG|DL|DEFENSIVELINE/.test(p)) return 'DL';
  if (/ILB|MLB|OLB|LB|BACKER/.test(p)) return 'LB';
  if (/CB|CORNER/.test(p)) return 'CB';
  if (/FS|SS|SAF|^S$|NICKEL|STAR\b/.test(p)) return 'S';
  if (/DB/.test(p)) return 'DB';
  if (/PK|^K$|KICK/.test(p)) return 'K';
  if (/^P$|PUNT/.test(p)) return 'P';
  if (/LS|SNAP/.test(p)) return 'LS';
  return 'ATH';
}

const CLASS_MAP = [
  [/^(r|rs)[- ]?(fr|freshman)/i, 'redshirt freshman'],
  [/^(r|rs)[- ]?(so|soph)/i, 'redshirt sophomore'],
  [/^(r|rs)[- ]?(jr|junior)/i, 'redshirt junior'],
  [/^(r|rs)[- ]?(sr|senior)/i, 'redshirt senior'],
  [/^(fr|freshman)/i, 'freshman'],
  [/^(so|soph)/i, 'sophomore'],
  [/^(jr|junior)/i, 'junior'],
  [/^(sr|senior)/i, 'senior'],
  [/^(gr|grad|graduate)/i, 'graduate'],
  [/^(5th|fifth)/i, 'fifth-year'],
  [/^(6th|sixth)/i, 'sixth-year']
];
function normClass(c) {
  if (!c) return '';
  const s = String(c).trim();
  for (const [re, out] of CLASS_MAP) if (re.test(s)) return out;
  return s.toLowerCase();
}

/* ---------- valuation rubric (House-era P4 football) ---------- */
/* team.progMult (teams.json) overrides the rank tiers - used for G5 programs;
   team.level (default 'power') sets the athletes' division level. */
const PROG_MULT = team.progMult != null ? team.progMult :
                  team.rank <= 5 ? 1.30 : team.rank <= 10 ? 1.18 :
                  team.rank <= 15 ? 1.08 : team.rank <= 20 ? 1.00 : 0.92;
const LEVEL = team.level || 'power';
const TIER_BASE = { star: 400000, starter: 160000, rotation: 60000, depth: 25000, walkon: 9000 };
const POS_MULT = { QB: 2.4, RB: 1.05, FB: 0.7, WR: 1.15, TE: 0.95, OL: 0.9, EDGE: 1.15,
                   DL: 1.0, LB: 0.95, CB: 1.1, S: 0.95, DB: 1.0, ATH: 1.0, K: 0.55, P: 0.5, LS: 0.4 };

function rubricValue(tier, group, slug) {
  const base = TIER_BASE[tier] || TIER_BASE.depth;
  const jitter = 0.88 + 0.24 * hash01(slug);            // ±12%, deterministic
  let v = base * (POS_MULT[group] || 1) * PROG_MULT * jitter;
  v = Math.max(v, 4000);
  if (v >= 100000) v = Math.round(v / 5000) * 5000;
  else if (v >= 20000) v = Math.round(v / 1000) * 1000;
  else v = Math.round(v / 500) * 500;
  return v;
}

/* ---------- blurb generation for non-researched players ---------- */
function lastName(name) {
  const parts = String(name).trim().split(/\s+/)
    .filter(w => !/^(jr\.?|sr\.?|ii|iii|iv|v)$/i.test(w));
  return parts[parts.length - 1] || name;
}
const possessive = n => /s$/i.test(n) ? `${n}'` : `${n}'s`;
function blurbFor(p, posFull, cls) {
  const ln = lastName(p.name);
  const from = p.hometown ? ` out of ${p.hometown}` : '';
  const clsTxt = cls ? cls + ' ' : '';
  const pos = posFull.toLowerCase();
  const t = hash01(p.name + team.slug);
  const role =
    p.tier === 'starter'  ? ` and is projected to play a key role for the ${team.nickname} in 2026` :
    p.tier === 'rotation' ? ` and is competing for a spot in the ${possessive(team.nickname)} two-deep this fall` : '';
  let out;
  if (t < 0.34) out = `${ln} is a ${clsTxt}${pos} for the ${team.name}${from}${role}.`;
  else if (t < 0.67) out = `A ${clsTxt}${pos}${from}, ${ln} is on the ${possessive(team.name)} 2026 football roster${role}.`;
  else out = `${p.name} is a ${clsTxt}${pos} on the 2026 ${team.name} football roster${from}${role}.`;
  return out.replace(/\.\.+$/, '.'); // hometowns ending in an abbreviation ("Ga.") otherwise double the final period
}

/* ---------- build incoming records ---------- */
const ON3_FB = 'https://www.on3.com/nil/rankings/player/college/football/';
const EST_SOURCE = 'Estimate (On3 does not publicly disclose a figure)';

const outAthletes = [];
const review = [];
const seenBatch = new Set();
let added = 0, updated = 0, rubricCount = 0, researchedCount = 0;

for (const p of tiered.players) {
  if (!p.name) continue;
  const group = p.positionGroup && POS_FULL[p.positionGroup] ? p.positionGroup : inferGroup(p.position);
  const posFull = POS_FULL[group] || 'Athlete';
  const cls = normClass(p.class);
  const tier = ['star', 'starter', 'rotation', 'depth', 'walkon'].includes(p.tier) ? p.tier : 'depth';
  let slug = slugify(p.name);

  const existing = bySlug.get(slug);
  if (existing) {
    if (existing.team === team.slug) {
      // update-mode: refresh soft fields, preserve the enriched core
      const rec = {
        slug, name: existing.name, sport: 'Football',
        position: posFull, team: team.slug, level: LEVEL,
        valuation: existing.valuation, low: existing.low, high: existing.high,
        reported: existing.reported, source: existing.source, sourceUrl: existing.sourceUrl,
        blurb: existing.blurb,
        engagement: (p.researched && p.engagement != null) ? p.engagement : existing.engagement,
        followers: (p.researched && p.followers) ? p.followers : existing.followers,
        roleTier: tier
      };
      if (cls) rec.class = cls;
      if (p.hometown) rec.hometown = p.hometown;
      if (p.jersey != null) rec.jersey = String(p.jersey);
      if (p.handles) rec.handles = p.handles;
      outAthletes.push(rec); updated++;
      continue;
    }
    if (existing.sport === 'Football') {
      review.push({ name: p.name, slug, existingTeam: existing.team, newTeam: team.slug, tier });
      continue; // resolved by hand (transfer vs. distinct person)
    }
    slug = slug + '-' + team.suffix; // same name, different sport -> distinct page
  }
  if (seenBatch.has(slug)) slug = slug + '-' + (p.jersey != null ? String(p.jersey) : group.toLowerCase());
  seenBatch.add(slug);

  const researched = !!p.researched && p.followers;
  const rec = {
    slug, name: p.name, sport: 'Football', position: posFull,
    team: team.slug, level: LEVEL, roleTier: tier,
    followers: Object.assign({ instagram: 0, tiktok: 0, x: 0, youtube: 0 }, researched ? p.followers : {}),
    engagement: (researched && p.engagement != null) ? p.engagement : 5,
    valuation: (p.valuation != null && !isNaN(+p.valuation)) ? Math.round(+p.valuation) : rubricValue(tier, group, slug),
    reported: !!p.reported,
    source: p.source || (p.valuation != null ? (p.valuationNote || EST_SOURCE) : EST_SOURCE),
    sourceUrl: p.sourceUrl || ON3_FB,
    blurb: p.blurb || blurbFor(p, posFull, cls)
  };
  if (p.valuation != null) researchedCount++; else rubricCount++;
  if (cls) rec.class = cls;
  if (p.hometown) rec.hometown = p.hometown;
  if (p.jersey != null) rec.jersey = String(p.jersey);
  if (p.handles) rec.handles = p.handles;
  outAthletes.push(rec); added++;
}

/* ---------- team entry ---------- */
const outTeams = {};
const dbTeam = db.teams[team.slug];
if (!dbTeam) {
  outTeams[team.slug] = { name: team.name, conference: team.conference, sport: 'Football' };
} else if (dbTeam.sport !== 'Football' && dbTeam.sport !== 'Multiple') {
  outTeams[team.slug] = { name: dbTeam.name, conference: dbTeam.conference, sport: 'Multiple' };
}

fs.writeFileSync(path.join(REPO, 'data', 'incoming.json'),
  JSON.stringify({ teams: outTeams, athletes: outAthletes }, null, 2) + '\n');

console.log(`[${team.slug}] incoming.json written: ${added} new, ${updated} updates ` +
  `(${researchedCount} researched vals, ${rubricCount} rubric vals)` +
  (Object.keys(outTeams).length ? ` | team entry: ${JSON.stringify(outTeams)}` : ''));
if (review.length) {
  console.log('REVIEW (skipped, same slug on a different team — possible transfers):');
  review.forEach(r => console.log(`  - ${r.name} (${r.slug}): db=${r.existingTeam} vs roster=${r.newTeam} [${r.tier}]`));
}
