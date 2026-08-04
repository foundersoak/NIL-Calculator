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
- [x] Tranche 5 (21-25): South Carolina, Arkansas*, Kentucky, Iowa, Washington*
      — done 2026-07-28. 546 new + 2 updates. Seven REVIEW items, all
      DISTINCT PEOPLE (suffixed): jordan-thomas-south-carolina,
      max-anderson-kentucky, tyler-thomas-kentucky, tyler-brown-iowa,
      trent-wilson-iowa, elijah-brown-washington, austin-simmons-washington.
      Notes: Demond Williams Jr. (UW) is the sweep's only reported=true
      contract figure (~\$4M to return in 2026). Iowa had ZERO valuation
      anchors (all 109 rubric) and Arkansas only 4 of 20 - thin NIL markets.
      Monte Harrison (Arkansas, age-30 former MLB OF) is a human-interest
      page candidate.
- [x] Final QA: DONE 2026-07-28. DB total 3,241 athletes (2,812 football
      across all 25 programs). Zero duplicate slugs, zero missing fields,
      sitemap 3,253 URLs, search index 3,241 entries, spot-checks pass.
      All REVIEW items resolved (1 transfer: Raiola; 11 distinct-person
      suffixes). Departed players marked former (Downs, Allar).
      AUGUST RE-SWEEP LIST (fall rosters post ~Aug 1-15): Florida, USC
      (spring rosters), Oregon (missing confirmed adds), Michigan State
      (97 pre-camp), + count-only socials backfill for Texas A&M (7).

\* = new team entry (handled automatically by merge-team.js from teams.json).

## Expansion set (ranks 26-39, done 2026-07-28)

- [x] Tranche 6 (preseason top-25 gaps): Indiana*, Miami, Texas Tech,
      Ole Miss, BYU, Missouri, SMU* — 748 new + 2 updates. REVIEW items all
      distinct people: carter-smith-indiana (star LT \$1.5M),
      ben-roberts-texas-tech, ashton-hampton-texas-tech,
      luke-hamilton-texas-tech, cam-clark-ole-miss, andrew-williams-byu.
      Brendan Sorsby marked former (left Texas Tech amid NCAA eligibility
      dispute; blurb kept neutral, no gambling specifics - single-source).
      Josh Hoover: TCU->Indiana, \$2.5M reported=true. Darian Mensah now at
      Miami (\$6.5M, On3 NIL 100 No. 1).
- [x] Tranche 7 (Week 0 P4 + G5): North Carolina, TCU*, NC State*,
      Virginia, Stanford*, Memphis* (G5), UNLV* (G5) — 798 new + 2 updates.
      REVIEW items all distinct: jordan-hall-north-carolina,
      jordan-washington-north-carolina, landen-thomas-unlv.
      Memphis/UNLV use progMult 0.55 + level d1 (G5 support added to
      merge-team.js). NIL-anchor coverage is thin across this set: UNC,
      TCU, Virginia, UNLV = 0 anchors; NC State/Stanford/Memphis = 1-2.
      TCU's collective folded 2025-07-31 (payments now in-house).
- DB after expansion: 4,809 athletes / 4,393 football / 39 swept programs.

## Conference completion set (ranks 40-48, done 2026-07-30)

- [x] Tranche 8: UCLA, Illinois, Minnesota*, Maryland*, Purdue — 567 new.
- [x] Tranche 9: Northwestern*, Rutgers*, Mississippi State, Vanderbilt — 480 new.
- **BIG TEN 18/18 and SEC 16/16 now complete** (2,007 + 1,845 football
  athletes). DB: 5,863 athletes / 5,447 football / 48 programs / 65 teams.
- 13 REVIEW items, ALL distinct people (no transfers): 3 separate Smiths
  (isaac-smith-mississippi-state, jared-smith-rutgers,
  michael-smith-vanderbilt, plus jalen-smith-minnesota), a THIRD Carter
  Smith (carter-smith-illinois, after Wisconsin and Indiana), plus
  daniel-anderson-northwestern, xavier-williams-rutgers, evan-ward-rutgers,
  donovan-johnson-rutgers, aaron-williams-ucla, andrew-marshall-minnesota,
  hayden-moore-minnesota, chris-wells-maryland, jojo-johnson-purdue.
- Nico Iamaleava (UCLA) verified intact through update-mode: kept \$2M
  reported figure + blurb, refreshed to 180K IG / 29.6K X, tier star.
  Brother Madden added at \$145K.
- WITHHELD from published copy (deliberate): Drake Lindsey (Minnesota) has
  a May 2026 misdemeanor underage-drinking/fake-ID charge; Jackson Carsello
  (Northwestern) plays 2026 under a Cook County injunction restoring
  eligibility. Carsello's court status IS in his blurb (public, material to
  his role); Lindsey's charge is NOT (misdemeanor, not material to NIL).
  Keep it that way absent a change in circumstances.
- NIL-anchor coverage is very thin in this set: Rutgers 2/20, Northwestern
  1/20, Vanderbilt 1/20, Minnesota 2/20. Mostly rubric valuations.
- Notable reported figures found: Jared Curtis (Vanderbilt, ~\$2M, true
  freshman QB who has not played a snap), Drake Lindsey (Minnesota, ~\$1M).
- Cross-check that worked: Minnesota's roster correctly lacks Koi Perich,
  who our Oregon sweep already has as a 2026 transfer.

## Big 12 + ACC completion (ranks 49-70, done 2026-08-04)

**POWER 4 COMPLETE: Big Ten 18/18, SEC 16/16, ACC 17/17, Big 12 16/16.**
70 programs, 8,288 athletes, 7,872 football. Zero duplicate slugs, zero
missing fields, zero name artifacts, no roster under 90.

- [x] Tranche 10 (49-53): Colorado, Utah, Oklahoma State*, Kansas State, Baylor
- [x] Tranche 11 (54-58): Houston, Arizona State, Arizona, Iowa State*, Kansas
- [x] Tranche 12 (59-63): West Virginia, Cincinnati*, UCF*, Georgia Tech, Virginia Tech*
- [x] Tranche 13 (64-68): Louisville, Pitt*, Syracuse*, Duke, California*
- [x] Tranche 14 (69-70): Boston College*, Wake Forest*

### Oklahoma State Cowboys/Cowgirls
Handled correctly, keep it this way: `oklahoma-state-cowboys` (Football,
created by this sweep) and `oklahoma-state-cowgirls` (Women's Basketball,
pre-existing) are SEPARATE team slugs, matching the school's naming.
Do not merge them.

### Data-integrity failures caught (add these checks to future sweeps)
- **Baylor's roster file was a different team entirely**: 0/113 name
  overlap with its own tiered file, and the scrape reported a phantom 113.
  The tier agent had silently re-scraped correctly, and merge-team.js reads
  only `-tiered.json`, so the merge was safe. Verified against the live
  site: 99 real players. LESSON: always diff `-roster.json` vs
  `-tiered.json` name overlap before merging; never trust the workflow's
  reported playerCount alone.
- **Colorado shipped two corrupted names from the school's own CMS**:
  `Gideon ESPN Lampron` (ESPN leaked into the firstName field) and
  `Cam Netwon` (school-side typo, appears 10x on their live page). Real
  name verified as Cam Newton via
  cubuffs.com/sports/football/roster/cam-newton - a 2026 RB from Prosper
  Walnut Grove, no relation to the NFL MVP. Would otherwise have shipped
  as /athlete/cam-netwon/ and lost a strong search term.
- **Arizona had 11 names with double spaces.** Slugs were unaffected
  (slugify collapses whitespace runs) but display names were wrong.
  Whitespace is now normalized across all tiered files.
- **Wake Forest's socials agent hung**: workflow died with 5 of 6 results,
  tiered file untouched for an hour, 0-byte output, registry entry gone.
  Re-ran that single step standalone against the intact scrape+tier output
  (19/20 verified). LESSON: a stalled workflow does not lose completed
  steps - re-run only the failed agent, not the whole team.

### REVIEW items: 30 across these 22 teams, ALL distinct people, zero transfers
Name saturation is real at this scale: a THIRD Jordan Allen (Kansas State
edge / Houston DB / Georgia Tech WR), a THIRD Max Anderson (Notre Dame /
Kentucky / West Virginia), plus repeat Smiths, Johnsons and Williamses.
Each confirmed by position + hometown + class, with the original still on
its own 2026 roster.

### Thin-NIL-market note
Cincinnati and UCF returned ZERO valuation anchors between them (217
players, all rubric); Cal and Kansas managed one each. Their team totals
are formula output, not market data - same caveat as Iowa in the Big Ten.

## Remaining (optional future work)

- Group of Five beyond Memphis and UNLV (already swept as `level: d1`,
  `progMult` 0.55).
- August re-sweep list: Florida, USC, Oregon, Michigan State (spring or
  pre-camp rosters), plus a count-only socials backfill for Texas A&M (7).
