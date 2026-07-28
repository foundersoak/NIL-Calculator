# Football roster sweep — top-25 fanbase programs

Session handoff state for the "gigantic football roster sweep". Everything needed to
run (or resume) the sweep lives in this directory. **Requires an environment with
Full network access** (the original session's Trusted-level proxy blocked all
athletics sites — that is the only reason tranche 1 hasn't run yet).

## Goal & locked decisions (approved by Thomas)

- Add **full official 2026 rosters (~105 players each)** for the top 25 college
  football fanbases → ~2,400-2,600 new athletes in `data/athletes.json`.
- Fanbase ranking: Tony Altimore fanbase study for ranks 1-15 (verified via
  WebSearch); consensus next tier for 16-25 (Altimore's #14 Stanford/Syracuse
  treated as population-model artifact, excluded). Full list + ranks + official
  roster URLs: `teams.json`.
- **Social verification: top ~40 players per team** (top 20 get NIL research +
  socials, next 20 get socials only). Everyone else: zeros + defaults.
- Research/scrape agents run as **Opus on high effort**.
- One commit per team (style: `Add full <School> football roster (N players)`),
  push after each tranche of 5.

## Pipeline (per tranche of 5 teams)

1. **Workflow** `workflow-tranche.js` (launch via the Workflow tool, passing the
   file's content as `script`, or scriptPath if already persisted). Args:
   `{"outDir": "<abs path to scripts/sweep/out>", "teams": [ ...5 team objects from teams.json... ]}`.
   Tranches by rank: 1-5, 6-10, 11-15, 16-20, 21-25.
   Per team it runs 3 opus/high agents: scrape official roster → tier all players +
   research NIL/socials for top 20 → verify socials for players 21-40.
   Output: `out/<team-slug>-roster.json` and `out/<team-slug>-tiered.json`.
2. **Merge** (deterministic, per team):
   `node scripts/sweep/merge-team.js <team-slug>` → writes `data/incoming.json`
   (researched valuations pass through; everyone else gets the coded rubric:
   tier base × position multiplier × fanbase-rank multiplier ± deterministic 12%
   jitter; blurbs code-generated in site style).
   Then `node scripts/add-athletes.js` (validates, merges, rebuilds site).
3. **Resolve the REVIEW list** merge-team prints (same slug already in DB on a
   different team = possible transfer vs. distinct person — decide by hand:
   transfers → update existing record's team; distinct people → re-add with a
   `-<school>` slug suffix).
4. Commit per team, push per tranche (`git push -u origin <branch>`).

## Safety rails already built into merge-team.js

- Existing athletes (e.g. Arch Manning) keep valuation/blurb/source; only
  followers/position/class refresh.
- Slug collisions vs other sports auto-suffixed; duplicate names within a
  roster suffixed by jersey.
- New team entries auto-added; existing single-sport teams flip to
  `sport: "Multiple"`.

## Flags to watch in workflow results

- `official-unreachable` — network still blocked or site down; do NOT substitute
  unofficial sources, fix access instead.
- `prior-season-roster` — site still shows pre-2026 roster; re-sweep that team
  in August.
- `suspiciously-small` — fewer than 60 players scraped; re-check the page.

## Status

- [x] Tranche 1 (ranks 1-5): OSU, Notre Dame, Texas, Penn State, Michigan
      — done 2026-07-28. 554 new athletes + 9 updates, zero REVIEW items, all
      rosters official 2026 (119/113/110/112/109). Notes for final QA:
      - Departed players are KEPT for SEO and marked `former: true` +
        `nowWith` (Thomas approved 2026-07-28). Caleb Downs (Cowboys) and
        Drew Allar (Steelers) are handled; when a sweep finds a DB athlete
        missing from the official roster, mark them former the same way.
      - Penn State players 21-40: DONE 2026-07-28 (count-only backfill pass;
        exact X counts, verified IG). Brezina IG handle typo on the official
        roster page fixed (@cd.breznia -> @cd.brezina11, via his X bio).
      - Search/count tips from agents: Yahoo (search.yahoo.com/search?p=)
        tolerates parallel WebFetch when the WebSearch budget runs out
        (DuckDuckGo CAPTCHAs, Brave 429s). EXACT X follower counts:
        api.fxtwitter.com/<handle> returns user.followers as an integer.
        IG counts: og:description via curl with a Googlebot UA (needs
        10-20s spacing; direct WebFetch 429s).
- [x] Tranche 2 (6-10): Florida, Oregon, Alabama, Wisconsin*, USC
      — done 2026-07-28. 544 new + 4 updates (DB total 1,557). REVIEW items
      resolved: Dylan Raiola = transfer, existing record moved
      Nebraska→Oregon (tranche 4's Nebraska sweep will find him gone);
      Christian Pierce = two distinct players, USC safety added as
      christian-pierce-usc. Ryan Williams renamed to Ryan Coleman-Williams
      for 2026: fresh research merged into the established ryan-williams
      slug (SEO), duplicate page removed. August re-sweeps: Florida + USC
      published spring rosters; Oregon roster missing confirmed additions
      (Iheanacho, 4 PWOs). Wisconsin NIL coverage is thin: only 1 valuation
      anchor found (Colton Joseph), rest rubric.
- [x] Tranche 3 (11-15): LSU, Georgia, Texas A&M, Auburn, Tennessee
      — done 2026-07-28. 580 new + 9 updates (DB total 2,137). Four REVIEW
      items, all DISTINCT PEOPLE (originals confirmed still on their own
      2026 rosters): cayden-jones-lsu (FR QB), justin-williams-georgia
      (JR ILB starter), jake-johnson-auburn (SR TE, UNC transfer),
      hudson-powell-auburn (SR LS). No transfers this tranche. Notes:
      Auburn agent found an uncorroborated off-field allegation re: Womack
      (social post only) and correctly EXCLUDED it from the blurb - keep it
      out unless mainstream-verified. A&M websearch budget died before 7 of
      20 socials-pass counts (handles recorded, counts 0) - candidates for
      a count-only backfill. Whit Weeks (LSU) valuation sources conflict
      badly (On3 $1.8M vs NIL Standard $451K; used On3).
- [x] Tranche 4 (16-20): Oklahoma, Nebraska, Clemson, FSU*, Michigan State*
      — done 2026-07-28. 553 new + 1 update (DB total 2,690). Four REVIEW
      items, all DISTINCT PEOPLE: anthony-jones-jr-nebraska (SR EDGE),
      jordan-hall-michigan-state (SR LB star, no valuation anchor - rubric),
      fredrick-moore-michigan-state (WR, Michigan transfer),
      bryson-williams-michigan-state (R-FR WR). Nebraska sweep confirmed
      Raiola gone (already moved to Oregon); no other departures.
      Notes: Nebraska NIL coverage thin (2 of 20 anchors); MSU roster is 97
      (pre-camp count, above the 60 alarm threshold but re-check in
      August); Clemson socials pass added valuations for its 20 as well
      (40 researched vals total).
- [ ] Tranche 5 (21-25): South Carolina, Arkansas*, Kentucky, Iowa, Washington*
- [ ] Final QA: counts vs official rosters, review-list resolution, flag
      re-sweeps, full build, sitemap/index sanity, spot-check pages, push

\* = new team entry (handled automatically by merge-team.js from teams.json).
