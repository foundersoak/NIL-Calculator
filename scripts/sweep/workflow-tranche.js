export const meta = {
  name: 'fb-roster-tranche',
  description: 'Scrape + enrich official football rosters for a tranche of top-fanbase programs',
  phases: [
    { title: 'Scrape', detail: 'full roster from official athletics site', model: 'opus' },
    { title: 'Tier & research', detail: 'tier all players; NIL + socials for top 20', model: 'opus' },
    { title: 'Socials 21-40', detail: 'verify followers for next 20 players', model: 'opus' },
  ],
}

const A = typeof args === 'string' ? JSON.parse(args) : args
const TEAMS = A.teams
const OUT = A.outDir

const SCRAPE_SCHEMA = {
  type: 'object',
  required: ['teamSlug', 'playerCount', 'season', 'sourceUrl', 'path', 'flags'],
  properties: {
    teamSlug: { type: 'string' },
    playerCount: { type: 'number' },
    season: { type: 'string' },
    sourceUrl: { type: 'string' },
    path: { type: 'string' },
    flags: { type: 'array', items: { type: 'string' } },
  },
}
const TIER_SCHEMA = {
  type: 'object',
  required: ['teamSlug', 'path', 'researchedCount', 'tierCounts', 'flags'],
  properties: {
    teamSlug: { type: 'string' },
    path: { type: 'string' },
    researchedCount: { type: 'number' },
    tierCounts: {
      type: 'object',
      properties: {
        star: { type: 'number' }, starter: { type: 'number' }, rotation: { type: 'number' },
        depth: { type: 'number' }, walkon: { type: 'number' },
      },
    },
    flags: { type: 'array', items: { type: 'string' } },
  },
}
const SOC_SCHEMA = {
  type: 'object',
  required: ['teamSlug', 'path', 'verifiedCount', 'zeroedCount', 'flags'],
  properties: {
    teamSlug: { type: 'string' },
    path: { type: 'string' },
    verifiedCount: { type: 'number' },
    zeroedCount: { type: 'number' },
    flags: { type: 'array', items: { type: 'string' } },
  },
}

function scrapePrompt(t) {
  return `Collect the complete official 2026 football roster for ${t.name} (${t.school}).

START HERE: ${t.url} (the school's OFFICIAL athletics site; most are on the Sidearm Sports or WMT platforms). If that exact path 404s, find the football roster page elsewhere on the SAME official domain.

HOW TO FETCH: Load WebSearch/WebFetch via ToolSearch if needed. Try WebFetch first. If it fails or returns a JS shell, use Bash curl (outbound HTTPS goes through a pre-configured proxy automatically; use a normal browser User-Agent header; NEVER disable TLS verification). Sidearm sites usually embed full roster JSON in the page source (look for roster data in script tags) or serve it from an api route; WMT sites render tables/cards you can parse. Print-friendly or table views (?view=table, /roster/print) often help.

EXTRACT EVERY PLAYER on the roster - a 2026 FBS roster is roughly 90-130 players. Do not truncate or sample. For each player capture: name, jersey (number or null), position (exactly as listed), class (as listed, e.g. "R-So."), height, weight, hometown (city, state), lastSchool (high school or previous college if shown).

SEASON CHECK: today is late July 2026; you want the 2026 (fall) roster. If the page clearly still shows an older season and no 2026 roster exists, scrape what is there and add flag "prior-season-roster".

RULES:
- OFFICIAL SITE ONLY. If unreachable after genuinely trying several approaches (WebFetch, curl with browser UA, alternate paths on the same domain), write no file, add flag "official-unreachable", and return.
- Add flag "suspiciously-small" if you find fewer than 60 players.

OUTPUT: Write valid JSON to ${OUT}/${t.slug}-roster.json with shape:
{"school":"${t.school}","teamSlug":"${t.slug}","season":"...","sourceUrl":"...","players":[{"name":...,"jersey":...,"position":...,"class":...,"height":...,"weight":...,"hometown":...,"lastSchool":...}]}
Validate it parses (node -e). Your structured return: teamSlug="${t.slug}", playerCount, season, sourceUrl, path, flags.`
}

function tierPrompt(t, scr) {
  return `You are enriching the ${t.name} 2026 football roster for an NIL valuation database. Read ${scr.path} (${scr.playerCount} players).

STEP 1 - TIER EVERY PLAYER. Research the team's projected 2026 depth chart (WebSearch: spring game reports, beat writer depth chart projections, 247Sports/On3 team pages, transfer portal news; load WebSearch/WebFetch via ToolSearch if needed). Assign each player exactly one tier:
- "star": national-name NIL athletes (typically 1-5 per team)
- "starter": projected starters / key contributors (~20-28)
- "rotation": two-deep or meaningful rotation (~25-35)
- "depth": scholarship depth unlikely to play much
- "walkon": walk-ons
Also add "positionGroup" for every player: one of QB, RB, FB, WR, TE, OL, EDGE, DL, LB, CB, S, DB, K, P, LS, ATH.

STEP 2 - RESEARCH THE TOP 20. Pick the 20 most prominent players (stars first, then highest-profile starters). For each:
- NIL value: check On3 NIL valuation pages (on3.com player profiles / NIL rankings) and news of reported deals. If you find a credible figure or a defensible anchor, set "valuation" (number, USD/yr) and "valuationNote" (short basis, e.g. "Estimate (On3 NIL valuation ~$1.2M; not exactly disclosed)"). Set "reported": true ONLY if an actual figure was publicly reported. If no anchor found, OMIT valuation entirely - do not guess a number.
- Social followers: find their REAL Instagram / TikTok / X / YouTube accounts (verify identity: school/football references, verified tags, follower magnitude sanity). Set "followers": {"instagram":N,"tiktok":N,"x":N,"youtube":N} (0 for platforms not found - never fabricate), "handles": {platform: "@handle"} for found accounts, "engagement": 4-7 (5 = typical; 6-7 only for highly active, high-engagement accounts).
- "blurb": 1-2 factual sentences, name-led, present tense (role, 2025 production, transfer origin if relevant). Example style: "Smith is Ohio State's returning starting left tackle and an All-Big Ten selection in 2025."
- Mark each of these 20 with "researched": true.

OUTPUT: Write ${OUT}/${t.slug}-tiered.json = the full roster file with your added fields on every player (tier, positionGroup on all; researched/followers/engagement/handles/valuation/valuationNote/reported/blurb on the top 20). Keep all original roster fields. Validate JSON parses. Structured return: teamSlug="${t.slug}", path, researchedCount, tierCounts, flags (note anything odd, e.g. "no-depth-chart-found").`
}

function socialsPrompt(t, tier) {
  return `Follower-verification pass for ${t.name} 2026 football (players ranked 21-40 by prominence). Read ${tier.path}.

Select the next 20 players by prominence that do NOT have "researched": true (order: remaining stars/starters first, then rotation; skip walkons). For each, search for their real Instagram / TikTok / X / YouTube accounts (WebSearch "<name> ${t.school} football instagram" etc.; load WebSearch/WebFetch via ToolSearch if needed). Verify identity via bio references to ${t.school}/football, hometown, or verified tags. Follower counts from search snippets or profile fetches are fine. If not confidently found after a couple of searches, record zeros and move on - NEVER fabricate counts or attribute a same-name stranger's account.

For each of the 20, set on the player: "researched": true, "followers": {"instagram":N,"tiktok":N,"x":N,"youtube":N}, "handles" for found accounts, "engagement" (4-7, default 5). If you happen upon credible NIL value info, add "valuation"/"valuationNote" too (optional).

UPDATE ${tier.path} IN PLACE using node (read JSON, mutate only those 20 players, write back). Preserve every other byte of structure. Validate it still parses and the player count is unchanged. Structured return: teamSlug="${t.slug}", path, verifiedCount (players where you found at least one real account), zeroedCount, flags.`
}

const scrapes = {}, tiers = {}, socials = {}

await pipeline(
  TEAMS,
  async t => {
    const r = await agent(scrapePrompt(t), {
      label: 'scrape:' + t.slug, phase: 'Scrape',
      model: 'opus', effort: 'high', schema: SCRAPE_SCHEMA,
    })
    scrapes[t.slug] = r
    if (!r || r.flags.includes('official-unreachable')) {
      log('SKIP ' + t.slug + ': official site unreachable')
      throw new Error('unreachable')
    }
    log(t.slug + ': scraped ' + r.playerCount + ' players (' + r.season + ')')
    return r
  },
  async (scr, t) => {
    const r = await agent(tierPrompt(t, scr), {
      label: 'tier:' + t.slug, phase: 'Tier & research',
      model: 'opus', effort: 'high', schema: TIER_SCHEMA,
    })
    tiers[t.slug] = r
    if (!r) throw new Error('tier failed')
    log(t.slug + ': tiered, ' + r.researchedCount + ' researched')
    return r
  },
  async (tier, t) => {
    const r = await agent(socialsPrompt(t, tier), {
      label: 'socials:' + t.slug, phase: 'Socials 21-40',
      model: 'opus', effort: 'high', schema: SOC_SCHEMA,
    })
    socials[t.slug] = r
    if (r) log(t.slug + ': socials done, ' + r.verifiedCount + ' verified')
    return r
  }
)

return { scrapes, tiers, socials }
