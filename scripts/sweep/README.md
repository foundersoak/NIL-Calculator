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
      - Penn State players 21-40: real handles verified from the official
        roster page, but ALL follower counts are 0 (search tooling was
        blocked). Cheap re-run: count-only pass on those 20.
      - Search-frontend tip from agents: Yahoo (search.yahoo.com/search?p=)
        tolerates parallel WebFetch when the WebSearch budget runs out;
        DuckDuckGo CAPTCHAs, Brave 429s.
- [ ] Tranche 2 (6-10): Florida, Oregon, Alabama, Wisconsin*, USC
- [ ] Tranche 3 (11-15): LSU, Georgia, Texas A&M, Auburn, Tennessee
- [ ] Tranche 4 (16-20): Oklahoma, Nebraska, Clemson, FSU*, Michigan State*
- [ ] Tranche 5 (21-25): South Carolina, Arkansas*, Kentucky, Iowa, Washington*
- [ ] Final QA: counts vs official rosters, review-list resolution, flag
      re-sweeps, full build, sitemap/index sanity, spot-check pages, push

\* = new team entry (handled automatically by merge-team.js from teams.json).
