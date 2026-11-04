'use strict';
/* ============================================================
   Schema check for the athlete database. Zero dependencies.
   Returns a list of human-readable problems; empty means valid.
   The build refuses to run when this returns anything, so a bad
   record can never reach the live site.
   ============================================================ */

const SPORTS = new Set(['Football', "Men's Basketball", "Women's Basketball", 'Baseball', 'Softball', 'Golf', 'Gymnastics']);
const LEVELS = new Set(['power', 'd1', 'd2', 'd3', 'naia', 'juco', 'hs']);
const ROLE_TIERS = new Set(['star', 'starter', 'rotation', 'depth', 'walkon']);
/* Sports whose rosters are tiered; roleTier is required for these.
   Basketball joins this set once the roster sweep assigns tiers. */
const TIERED_SPORTS = new Set(['Football']);
const PLATFORMS = new Set(['instagram', 'tiktok', 'x', 'youtube']);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isInt = n => Number.isInteger(n);
const isBool = v => typeof v === 'boolean';

function validate(data) {
  const errors = [];
  const teams = data.teams || {};
  const athletes = data.athletes || [];

  if (data.updated && !DATE_RE.test(data.updated)) errors.push(`meta.updated "${data.updated}" is not YYYY-MM-DD`);

  for (const [slug, t] of Object.entries(teams)) {
    if (!SLUG_RE.test(slug)) errors.push(`team "${slug}": bad slug`);
    if (!t || !t.name) errors.push(`team "${slug}": missing name`);
  }

  const seen = new Set();
  athletes.forEach((a, i) => {
    const who = a && (a.slug || a.name) ? `${a.slug || a.name}` : `#${i}`;
    const e = msg => errors.push(`${who}: ${msg}`);
    if (!a || typeof a !== 'object') { errors.push(`#${i}: not an object`); return; }

    if (!a.slug || !SLUG_RE.test(a.slug)) e('bad or missing slug');
    else if (seen.has(a.slug)) e('duplicate slug');
    else seen.add(a.slug);

    if (!a.name || typeof a.name !== 'string') e('missing name');
    if (!SPORTS.has(a.sport)) e(`unknown sport "${a.sport}"`);
    if (!a.position || typeof a.position !== 'string') e('missing position');
    if (!a.team) e('missing team');
    else if (!teams[a.team]) e(`team "${a.team}" is not in teams.json`);

    if (!isInt(a.valuation) || a.valuation <= 0) e(`valuation must be a positive integer (got ${a.valuation})`);
    if (a.low != null && (!isInt(a.low) || a.low <= 0)) e('low must be a positive integer');
    if (a.high != null && (!isInt(a.high) || a.high <= 0)) e('high must be a positive integer');
    if (isInt(a.low) && isInt(a.high) && isInt(a.valuation) && !(a.low <= a.valuation && a.valuation <= a.high)) e(`low <= valuation <= high violated (${a.low} / ${a.valuation} / ${a.high})`);

    if (a.level != null && !LEVELS.has(a.level)) e(`unknown level "${a.level}"`);
    if (a.roleTier != null && !ROLE_TIERS.has(a.roleTier)) e(`unknown roleTier "${a.roleTier}"`);
    if (TIERED_SPORTS.has(a.sport) && !a.former && a.roleTier == null) e('roleTier required for this sport');

    if (a.followers != null) {
      if (typeof a.followers !== 'object') e('followers must be an object');
      else for (const [k, v] of Object.entries(a.followers)) {
        if (!PLATFORMS.has(k)) e(`unknown follower platform "${k}"`);
        if (v != null && (typeof v !== 'number' || v < 0)) e(`followers.${k} must be a non-negative number`);
      }
    }
    for (const f of ['thin', 'former', 'reported']) if (a[f] != null && !isBool(a[f])) e(`${f} must be true/false`);
    if (a.updated != null && !DATE_RE.test(a.updated)) e(`updated "${a.updated}" is not YYYY-MM-DD`);
    if (typeof a.blurb !== 'string' || !a.blurb.trim()) e('missing blurb');
    if (a.reported && !a.source) e('reported valuations need a source');
  });

  return errors;
}

module.exports = { validate, SPORTS, LEVELS, ROLE_TIERS, TIERED_SPORTS };
