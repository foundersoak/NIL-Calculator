#!/usr/bin/env node
/* ============================================================
   NIL ValueCalc — add athletes from a research run
   ------------------------------------------------------------
   You NEVER edit HTML. All pages are generated from
   data/athletes.json. This importer lets each research run be a
   simple append:

     1. Put new players in  data/incoming.json
        (see data/incoming.example.json for the format)
     2. Run:  npm run add        (or: node scripts/add-athletes.js)

   It validates, fills defaults, de-dupes by slug, adds any new
   teams, merges into data/athletes.json, and rebuilds the site.
   Re-importing a slug UPDATES that athlete (safe to re-run).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'athletes.json');
const INCOMING_PATH = path.join(ROOT, 'data', process.argv[2] || 'incoming.json');

function die(msg) { console.error('\n❌ ' + msg + '\n'); process.exit(1); }

const slugify = s => String(s).toLowerCase()
  .replace(/['’.]/g, '')              // drop apostrophes / periods
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')        // everything else → hyphen
  .replace(/^-+|-+$/g, '');

if (!fs.existsSync(INCOMING_PATH)) {
  die(`No incoming file at ${INCOMING_PATH}.\n   Create data/incoming.json (copy data/incoming.example.json) and try again.`);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
let incoming;
try { incoming = JSON.parse(fs.readFileSync(INCOMING_PATH, 'utf8')); }
catch (e) { die('incoming.json is not valid JSON: ' + e.message); }

// Accept either {teams?, athletes:[...]} or a bare [...] array.
const incTeams = (incoming && incoming.teams) || {};
const incAthletes = Array.isArray(incoming) ? incoming : (incoming.athletes || []);
if (!incAthletes.length) die('No athletes found in incoming file.');

// 1) Merge teams.
let teamsAdded = 0;
for (const slug of Object.keys(incTeams)) {
  if (!data.teams[slug]) { data.teams[slug] = incTeams[slug]; teamsAdded++; }
  else Object.assign(data.teams[slug], incTeams[slug]); // allow updates (e.g. sport → Multiple)
}

// 2) Merge athletes.
const bySlug = new Map(data.athletes.map(a => [a.slug, a]));
let added = 0, updated = 0;
const problems = [];

incAthletes.forEach((raw, i) => {
  const a = Object.assign({}, raw);
  if (!a.name) { problems.push(`#${i + 1}: missing "name"`); return; }
  a.slug = a.slug || slugify(a.name);

  for (const f of ['sport', 'position', 'team']) {
    if (!a[f]) problems.push(`${a.name}: missing "${f}"`);
  }
  if (a.valuation == null || isNaN(+a.valuation)) problems.push(`${a.name}: missing/invalid "valuation"`);
  if (a.team && !data.teams[a.team]) {
    problems.push(`${a.name}: team "${a.team}" not found — add it under "teams" in the incoming file.`);
  }
  if (problems.length && problems[problems.length - 1].startsWith(a.name)) return;

  // Defaults + derived fields.
  a.level = a.level || 'power';
  a.engagement = a.engagement != null ? a.engagement : 5;
  a.followers = Object.assign({ instagram: 0, tiktok: 0, x: 0, youtube: 0 }, a.followers || {});
  a.reported = !!a.reported;
  a.valuation = Math.round(+a.valuation);
  a.low = a.low || Math.round(a.valuation * 0.8);
  a.high = a.high || Math.round(a.valuation * 1.25);

  if (bySlug.has(a.slug)) {
    Object.assign(bySlug.get(a.slug), a); updated++;
  } else {
    data.athletes.push(a); bySlug.set(a.slug, a); added++;
  }
});

if (problems.length) {
  die('Fix these issues in the incoming file, then re-run:\n   - ' + problems.join('\n   - '));
}

data.updated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
console.log(`\n✅ Merged: ${added} added, ${updated} updated, ${teamsAdded} new team(s).`);
console.log(`   Dataset now has ${data.athletes.length} athletes across ${Object.keys(data.teams).length} teams.`);

// 3) Rebuild the site.
console.log('\n🔨 Rebuilding site...');
execFileSync('node', [path.join(__dirname, 'build.js')], { stdio: 'inherit' });

// 4) Archive the incoming file so it isn't re-imported by accident.
const archive = INCOMING_PATH.replace(/\.json$/, `.imported-${data.updated}.json`);
fs.renameSync(INCOMING_PATH, archive);
console.log(`\n📦 Archived ${path.basename(INCOMING_PATH)} → ${path.basename(archive)}`);
console.log('   Review with `git diff`, then commit & push.\n');
