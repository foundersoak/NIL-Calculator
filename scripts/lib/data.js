'use strict';
/* ============================================================
   Data layer: one loader and one saver for the athlete database.

   Layout on disk:
     data/meta.json               { updated }
     data/teams.json              { <team-slug>: {name, conference, sport} }
     data/athletes/<group>.json   { group, athletes: [...] }   one file per sport group
     data/history/<YYYY-MM>.json  monthly snapshots (see scripts/snapshot.js)

   Every script that reads or writes athletes goes through load()/save()
   so the split stays invisible to the rest of the codebase.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const ATHLETES_DIR = path.join(DATA_DIR, 'athletes');

/* Sport -> file group. Unknown sports land in "other". */
const SPORT_GROUP = {
  'Football': 'football',
  "Men's Basketball": 'mens-basketball',
  "Women's Basketball": 'womens-basketball',
  'Baseball': 'baseball',
};
const GROUP_ORDER = ['football', 'mens-basketball', 'womens-basketball', 'baseball', 'other'];

const groupFor = sport => SPORT_GROUP[sport] || 'other';
const groupPath = group => path.join(ATHLETES_DIR, group + '.json');

function readJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/* All data files that feed the build, in a stable order (used for cache hashing). */
function dataFiles() {
  const files = [path.join(DATA_DIR, 'meta.json'), path.join(DATA_DIR, 'teams.json')];
  for (const g of GROUP_ORDER) { const p = groupPath(g); if (fs.existsSync(p)) files.push(p); }
  return files;
}

function load(opts) {
  const { validate = false } = opts || {};
  const meta = readJson(path.join(DATA_DIR, 'meta.json'), {});
  const teams = readJson(path.join(DATA_DIR, 'teams.json'), {});
  const athletes = [];
  for (const g of GROUP_ORDER) {
    const file = readJson(groupPath(g), null);
    if (file && Array.isArray(file.athletes)) athletes.push(...file.athletes);
  }
  const data = { updated: meta.updated || '', teams, athletes };
  if (validate) {
    const { validate: run } = require('./schema');
    const errors = run(data);
    if (errors.length) {
      const err = new Error(`Data validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n  - ` + errors.slice(0, 40).join('\n  - ') + (errors.length > 40 ? `\n  ... and ${errors.length - 40} more` : ''));
      err.validationErrors = errors;
      throw err;
    }
  }
  return data;
}

/* Writes the split files. Athlete order within each group is preserved
   as given (append order), so diffs stay local to what changed. */
function save(data) {
  fs.mkdirSync(ATHLETES_DIR, { recursive: true });
  const groups = {};
  for (const g of GROUP_ORDER) groups[g] = [];
  for (const a of data.athletes) groups[groupFor(a.sport)].push(a);
  for (const g of GROUP_ORDER) {
    const p = groupPath(g);
    if (!groups[g].length) { if (fs.existsSync(p)) fs.unlinkSync(p); continue; }
    fs.writeFileSync(p, JSON.stringify({ group: g, athletes: groups[g] }, null, 2) + '\n');
  }
  const teamsSorted = {};
  for (const k of Object.keys(data.teams).sort()) teamsSorted[k] = data.teams[k];
  fs.writeFileSync(path.join(DATA_DIR, 'teams.json'), JSON.stringify(teamsSorted, null, 2) + '\n');
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify({ updated: data.updated }, null, 2) + '\n');
}

module.exports = { load, save, dataFiles, groupFor, GROUP_ORDER, DATA_DIR, ATHLETES_DIR };
