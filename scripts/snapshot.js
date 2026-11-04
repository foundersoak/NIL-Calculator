#!/usr/bin/env node
/* ============================================================
   Monthly snapshot of valuations and audience.

   Writes data/history/<YYYY-MM>.json with, per athlete:
     [valuation, low, high, totalFollowers]
   Re-running in the same month overwrites that month's file, so the
   snapshot always reflects the last state of the month. Snapshots are
   what make "biggest movers" and valuation trend lines possible.

   Run:  node scripts/snapshot.js            (current month)
         node scripts/snapshot.js 2026-08    (label explicitly)
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { load, DATA_DIR } = require('./lib/data');

const month = process.argv[2] || new Date().toISOString().slice(0, 7);
if (!/^\d{4}-\d{2}$/.test(month)) { console.error('Month must be YYYY-MM'); process.exit(1); }

const data = load({ validate: true });
const totalFollowers = a => Object.values(a.followers || {}).reduce((s, v) => s + (v || 0), 0);

const athletes = {};
for (const a of data.athletes) {
  athletes[a.slug] = [a.valuation, a.low || Math.round(a.valuation * 0.8), a.high || Math.round(a.valuation * 1.25), totalFollowers(a)];
}

const out = { month, takenAt: new Date().toISOString().slice(0, 10), dataUpdated: data.updated, fields: ['valuation', 'low', 'high', 'followers'], athletes };
const dir = path.join(DATA_DIR, 'history');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, month + '.json');
fs.writeFileSync(file, JSON.stringify(out) + '\n');
console.log(`Snapshot ${month}: ${Object.keys(athletes).length} athletes -> ${path.relative(process.cwd(), file)}`);
