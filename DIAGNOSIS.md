# howmuchnil.com: AdSense "Low Value Content" Diagnostic

Date: 2026-08-07. Evidence base: repository at origin/main commit dd9aa7bc67 (the code and data that produced the live site), the live site itself, Search Console screenshots supplied 2026-08-07, Queries.csv (361 named queries), and howmuchnil_leads.xlsx (75 rows). All file:line citations refer to origin/main.

NOTE BEFORE MERGING: the GitHub Pages deploy uploads the entire repo root verbatim, so this file becomes publicly readable at howmuchnil.com/DIAGNOSIS.md if this branch is merged as-is. Delete it (or exclude it from the deploy artifact) before merging. See finding N1, which is the same problem with far worse content already live.

---

## Executive summary

The site is not what the diagnostic prompt assumed in several load-bearing ways, and the corrections change the priority order:

1. **The rejection-era site was 460 pages, not thousands, and it was almost fully indexed.** Search Console shows 463 indexed, 30 excluded (18 of those are benign canonical duplicates). Mass non-indexation (H4) is disconfirmed for the mature site. The "thousands of pages, 361 queries" ratio mixes the old page set's queries with the new build's page count.
2. **The Power Four build (July 27 to Aug 4) took the site from 460 to 8,288 athlete pages, and 6,312 of the 7,828 new football pages carry a one-sentence code-generated blurb from a 3-stencil generator.** Google has not crawled them yet. The scaled-content risk you hypothesized in H1 is real, but it is mostly ahead of you, not behind you: what Google indexed and what AdSense reviewed in June was the smaller, somewhat better set.
3. **H0 is confirmed and is the rejection cause.** On a representative page, 71 to 79 percent of visible words are shared word-for-word with any other athlete page; the only genuinely per-athlete free text is the blurb (25 words, about 5 percent of a 507-word page). One follower figure appears 5 times. The valuation, the one thing the page exists to deliver, is blurred behind an email form.
4. **The fix model already exists in your own pipeline.** The sweep produced 1,478 genuinely researched, athlete-specific blurbs (the Hero Kanu kind) concentrated in the star and starter tiers. The generator, the tiering, and the agent workflow that wrote them are all in scripts/sweep/. Scaling that to more words on the pages that matter is an execution problem, not a discovery problem.
5. **Two things you did not ask about need fixing immediately regardless of AdSense:** the sweep's internal editorial notes (including withheld-allegation decisions about named athletes) are publicly served at howmuchnil.com/scripts/sweep/README.md, and every ad slot ID in the code is a placeholder while ADS_ENABLED is false, so even an approval tomorrow would serve zero ads.

Minimum viable resubmission set: fix the malformed-text templates (H3), de-duplicate and densify the athlete page body using data already in athletes.json, decide the indexation posture for the 6,312 stencil pages, add an About page, fix the homepage's generated-site tells, and present the valuation as a rounded range. Detail and sequence in the "Buckets and sequence" section.

---

## The site as it actually stands (premise corrections)

| Claim in the brief | Reality | Evidence |
|---|---|---|
| "Several thousand athlete pages" at rejection time | 460 athlete pages on June 17; 8,288 today | git history: 460 at commit 68a437f00f (2026-06-17); 8,288 at dd9aa7bc67; live sitemap serves 8,304 URLs |
| Power Four football build "just completed" | Correct: 70 programs, 7,828 new football athletes added 2026-07-27 to 2026-08-04 | scripts/sweep/README.md; git log |
| "Thousands of pages produce 361 named queries" | The 361 named queries were earned by the ~472-page June site; the new pages are 3 to 10 days old and largely uncrawled | GSC chart (screenshots): indexed count ~463 through late July |
| "ads.txt is absent and reports Not found" | ads.txt is live and correct right now | curl https://howmuchnil.com/ads.txt returns 200 with `google.com, pub-6381950276439830, DIRECT, f08c47fec0942fa0`; re-check the AdSense console, the "Not found" status is stale or predates deployment |
| Leads run "June 6 to August 3, 73 submissions" | 75 rows; 67 from athlete-page gates; 24 of the 67 attributed leads came from sweep-added pages in roughly the last 10 days of the window | howmuchnil_leads.xlsx analysis |

Page inventory on main: 8,288 athlete pages, 11 guides (4 conference-transfer guides added post-June), athletes directory, guides index, homepage, privacy, terms, contact (noindex), no About, no 404. Sitemap: 8,304 URLs.

---

## H0. Padding and shared boilerplate make each page substantively empty: CONFIRMED

Severity: Critical (this is the rejection). Effort to fix: Medium for structure, Large for content at full scale (tiered approach below).

**Word-count decomposition of the live representative page /athlete/hero-kanu/ (507 visible words excluding header and footer chrome):**

| Section | Words | Class |
|---|---|---|
| H1 + subtitle | 15 | Template with variables |
| Blurb | 25 | **Genuinely per-athlete (the only free text that is)** |
| Gate block (lock line, pitch, privacy note) | 32 | Shared boilerplate, name substituted |
| "What is X's NIL value?" summary | 62 | 3 sentence-slots from 5 fixed templates (build.js:201-225) |
| Quick facts table | 16 | Data table (5 rows) |
| Social table + caption | 21 | Data (one row) + caption restating it |
| "How NIL value is calculated" | 73 | Byte-shared boilerplate except the source label (build.js:340-341) |
| Comparables | 51 | Shared intro (24 words) + 4 name links |
| FAQ (4 Q&A) | 146 | Fixed templates, variables substituted (build.js:240-254) |
| CTA | 17 | Byte-identical on all 8,288 pages |

Buckets: **about 5 percent genuinely per-athlete prose, about 15 percent data values, about 80 percent templated or byte-shared frame.** Measured directly: word-sequence overlap (difflib matching blocks) between hero-kanu and a different SEC team's page is 79 percent; against a zero-social Miami page, 71 percent. Sampled page totals across 20 football pages: 443 to 522 visible words, median 457.

**Restatement audit, confirmed worse than hypothesized.** The follower figure "11K" appears 5 times in hero-kanu's visible text: twice in the summary sentence ("about 11K followers across social media, led by 11K on Instagram"), once in the one-row social table, once in the caption ("That's about 11K followers in all"), once in FAQ answer 2. One data point occupies an H2, a paragraph, a table, a caption, and an FAQ answer. The valuation is framed and re-framed in the gate pitch, the summary provenance sentence, FAQ 1, and FAQ 4, without ever being stated.

**The zero-social majority is thinner still.** 6,269 of 8,288 records (76 percent) have zero follower data, so the social section renders the placeholder paragraph "We'll add social numbers soon." (build.js:337 fallback) and the summary loses its middle sentence. Those pages run about 440 words, of which the blurb is 14 words of stencil.

**Where the good copy comes from, and coverage.** The blurb is a data field (`blurb` in data/athletes.json, rendered at build.js:304). Provenance is now fully documented in scripts/sweep/README.md and scripts/sweep/merge-team.js:

- Non-researched players get `blurbFor()` (merge-team.js:126-138): exactly 3 hash-picked sentence stencils with class, position, hometown, and a role clause. Reconstructing the generator and comparing byte-for-byte: **6,312 of 7,828 new football blurbs (80.6 percent) are its verbatim output**, plus 38 near variants.
- Researched players (top ~20 per program, tiered by 3 research agents per team) got agent-written blurbs: **1,478 of the new football records**, concentrated in star (224 of 224) and starter (1,111 of 1,745) tiers. Sampled quality is genuinely specific: transfers, stats, recruiting history, family background (e.g. kennedy-urlacher, linkon-cure, desean-bishop). Hero Kanu's two sentences are this tier.
- Legacy: baseball 261 of 365 blurbs are the older "out of city, state" stencil; basketball, softball, and the original 41 football records are hand-written.

Net: roughly **1,700 of 8,288 pages (20 percent) have a researched blurb; 6,600 (80 percent) have a stencil.** By tier, the researched copy covers the athletes most likely to be searched. **The pipeline that wrote 1,478 researched blurbs in one week exists and is rerunnable; it is the highest-leverage asset for the fix.** What it wrote is still only 25 to 40 words per athlete; the rebuilt-page spec below argues for 100 to 200 on the researched tiers.

**Unused per-athlete data is already in the dataset.** The sweep stored `class`, `hometown`, `jersey`, `roleTier`, and `handles` on new records (merge-team.js:161-204), and the page template renders none of them. The facts table could double its rows with zero new research.

## H0b. The gate: CONFIRMED with an inverted twist

Severity: High. Effort: Small to Medium.

- **The exact figure is in the unauthenticated HTML of every page**, as attributes on the gate container: `data-value="1046497" data-low="837198" data-high="1308121"` (build.js:306-309; verified in live hero-kanu source). The blurred element is a literal placeholder string `$•,•••,•••` (build.js:312); the blur (styles.css:428-431) is cosmetic decoration of a fake string, not an obscured real value.
- **The entire valuation database is one ungated GET away:** https://howmuchnil.com/assets/data/athletes-index.json is 1.5 MB, 8,288 entries with name, team, position, value, low, high (generated at build.js:480-488, fetched by every page via calculator.js:187). Anyone, including competitors and scrapers, can take the whole product without an email. So can Googlebot.
- **Googlebot receives what users receive**: the same HTML with the value in attributes and the placeholder visible. This is not classic cloaking (no UA differentiation), but the page's indexable text never states the number while the FAQ text promises it ("Enter your email on this page to unlock the exact figure", build.js:246, also emitted inside FAQPage JSON-LD at build.js:290-291). For "worth" intent queries, the page withholds its own answer from the index.
- **Paywalled-content markup is entirely absent**: zero occurrences of `isAccessibleForFree`, `hasPart`, `WebPageElement`, or `cssSelector` anywhere in the repo. Google's guidance for gated content expects them. Absence is exposure, though the practical risk here is thin-content perception more than a cloaking action, since the text never renders the value for anyone.
- The reveal is client-side and trivially bypassed: a single global localStorage flag (calculator.js:61-62), and `submitEmail()` unlocks on network failure too (calculator.js:77-78). The gate is theater at every layer; its only real function is lead capture, and it costs the pages their answer text.
- Component bars: percentages are present in the DOM (`data-bars`, build.js:309), bar elements are not; `breakdownBars()` (build.js:186-190) would render them server-side but is dead code, never called.
- **Duplicate URL forms: confirmed, handled, low severity.** Both `/athlete/hero-kanu/` and `/athlete/hero-kanu/index.html` return 200. Canonical and sitemap consistently use the trailing-slash form (build.js:273, build.js:499-506); but every internal link on the site emits the index.html form (build.js:264, :366; calculator.js:225, :328), so crawlers discover the variant the pages then disavow. GSC confirms Google resolves it correctly ("Alternate page with proper canonical tag", 18 pages, all index.html examples). Cosmetic fix: emit directory-form internal links.

## H1. Uniform template prose reading as scaled content: CONFIRMED

Severity: Critical going forward (mostly latent until Google crawls the new build). Effort: covered by H0 fix.

- Distinct sentence templates per section: summary 5 templates across 3 slots (build.js:201-225), FAQ 4 fixed Q&A (build.js:240-254), methodology 1, comparables intro 1, caption 1, CTA 1, gate pitch 1. **No randomization of any kind** (no Math.random, no variant pools). Every page is a pure function of its data row.
- Sampled 20 football pages: 8-gram shingle Jaccard similarity of full visible text averages **0.43 between depth/walk-on pages** (range 0.42 to 0.49) and 0.29 between star pages. For comparison, unrelated pages on a healthy site measure near 0.
- The exact paragraph you quoted is uniqueSummary() output and appears in structure on every page with social data; a reviewer opening three pages reads the same three-sentence shape three times, differing in name, number, and conference.
- Assessment against scaled content abuse policy: what exists today at 8,288 pages, 80 percent of them one-stencil-sentence plus shared frame, is squarely the profile the policy describes (many pages, near-zero per-page value-add, machine-generated at scale). The saving grace: Google has indexed almost none of the new set yet (GSC shows ~463 indexed). You get to choose what Google meets first.

## H2. False precision: CONFIRMED for the pages that matter, DISCONFIRMED for meta surfaces

Severity: Medium. Effort: Small.

- The precise figure appears in **no** title, meta description, og tag, or JSON-LD (titles and descriptions are value-free templates, build.js:275-280; JSON-LD carries no monetary property at all). It exists only in the `data-value` attribute and the ungated JSON index.
- After unlock, the client renders the exact integer to the dollar: `money()` (calculator.js:52) via `animateMoney()` (calculator.js:170-179). Server-side `money()`/`moneyShort()` (build.js:43-48) are dead code.
- Data reality: rubric valuations (the ~7,540 non-researched new football records) are formula output, tier base x position multiplier x program multiplier x deterministic jitter, rounded to 500/1,000/5,000 (merge-team.js:109-118); 7,240 of 8,288 valuations are round thousands and read fine. **The 286 precise-to-the-dollar values (270 of them researched-tier, like Kanu's 1,046,497) sit exactly on the highest-traffic pages.** The displayed "likely range" is decorative: 8,216 of 8,288 records carry exactly 0.8x and 1.25x of the point value (defaults from add-athletes.js:80-81); 30 records have a genuine hand-set range.
- Fix effort: one formatter change (round the reveal, lead with the range) in calculator.js plus optionally emitting a rounded range as real text server-side. Hours, not days.

## H3. Broken template output shipping to production: CONFIRMED, 100 percent of athlete pages

Severity: High (it is the single most visible "unmaintained site" tell to a reviewer). Effort: Small.

Root cause found, three instances of the same bug: the data field `source` is itself a parenthetical ("Estimate (On3 does not publicly disclose a figure)") and the templates wrap it in literal parentheses:

1. build.js:341, methodology section: `we sense-check against it (<a ...>${esc(a.source)}</a>).` Fires on **8,285 of 8,288 pages** (source contains parens), producing "...sense-check against it (Estimate (The NIL Standard 2026 open-market estimate ~$1.05M; not exactly disclosed))."
2. build.js:246, FAQ answer 1, fires when reported=true (82 pages), and because faqItems() also feeds the FAQPage JSON-LD (build.js:290-291), **the malformed text is inside structured data**. This instance has an independent grammar defect: "is based on publicly reported figures of 12-month name, image and likeness earning potential" (the reported branch does not fit the trailing clause).
3. build.js:222, summary provenance sentence, same 82 pages.

Additional defect classes found in the audit (all counts sitewide):

- **1,545 blurbs end in a double period** ("out of Jonesboro, Ga..") because 5,345 hometowns end in an abbreviation period and blurbFor() appends its own (merge-team.js:135-137).
- **~330 blurbs have a broken possessive** from `${team.nickname}'` assuming a plural nickname: "the Fighting Irish' two-deep this fall" (merge-team.js:134). Affects every non-s nickname; 2,192 blurbs use the two-deep clause.
- 6,269 pages show the "We'll add social numbers soon." placeholder (build.js:337).
- Zero occurrences of undefined/NaN/empty interpolations: the templates are defect-free on that axis.

Fix shape: split `source` into a bare `sourceLabel` and a `sourceNote`, drop the wrapping parens in the three templates, strip trailing periods from hometowns at merge time, and use possessive-safe phrasing. One rebuild regenerates all 8,288 pages.

## H4. Most pages are not indexed: DISCONFIRMED for the mature set, TOO EARLY for the new set

Severity of the residual risk: High (crawl-onboarding of 7,832 new pages is now the ballgame). Effort: Small for hygiene items.

- Search Console (your screenshots, 2026-08-07): **463 indexed, 30 not indexed**: 18 "Alternate page with proper canonical tag" (benign, see H0b), 7 "Discovered - currently not indexed", 5 "Crawled - currently not indexed". Twelve genuinely unindexed pages out of ~472 is a healthy site, not a suppressed one. Indexing began ~June 7 (the site is only two months old in Google's eyes) and held steady around 460 to 490 through late July.
- The named-query pattern therefore reads differently than hypothesized: ~460 indexed pages produced 361 named queries and 1,430 clicks at 15 percent CTR in three months. That is a demand and prominence distribution (a handful of athletes get searched, most do not), not an indexation failure.
- The new 7,832 pages: not yet reflected in GSC (chart ends ~July 20; build completed Aug 4). Discovery surfaces are weak: no `<lastmod>` in the sitemap (build.js:491-506), the only internal crawl path is a single flat directory page now carrying 8,288 links, and every internal link points at the non-canonical index.html variant. Nothing here blocks indexing, but nothing helps Google prioritize either, and what awaits the crawler is the H1 profile above.
- Unverifiable from this environment: crawl-stats data, and any GSC state after your screenshots.

## H5. SERP density on prominent athletes: PARTIALLY SUPPORTED, with a major caveat about the evidence

Severity: informational. Effort: n/a.

What is verifiable from this environment (a search index proxy, not a rendered consumer Google page; no AI Overview, PAA, or feature placement can be observed from here):

- On "carson tinney nil deal", the surrounding results are genuinely news-saturated: Opendorse profile, 247Sports, Burnt Orange Nation, Baseball America, SI. Tinney was a July 2026 second-round MLB draft pick, so "moderate profile" now understates him. On "anthony pack jr nil deal worth", the crowding is different: name-collision programmatic pages about more famous Anthonys (Sportskeeda, CollegeFootballNetwork, CollegeNetWorth) dominate; only 1 of 7 results was about Pack. On "aiden robbins nil", the page is filled by NIL Store merch product pages, not news. So density exists at every prominence level, but through three different mechanisms (news saturation, name collision, commerce saturation), and only the Tinney case matches the "prominence brings density" story cleanly.
- The GSC query data remains the ground truth that the site did rank and get clicked at position ~2 to 3 on these queries during the window (72 clicks on "carson tinney nil deal" at 42 percent CTR). The inverse CTR-vs-prominence correlation you computed is consistent with denser SERPs and with intent competition, but the feature-level cause (AI Overview and panels pushing blue links down) is **not verifiable from this environment** and should be checked by hand in a browser or via a SERP API with feature reporting.

## H6. Query modifier coverage: PARTIALLY CONFIRMED

Severity: Medium (bucket 3 mostly). Effort: Small to Medium.

Current athlete page H2 structure, verbatim (build.js:332-346):
1. `What is [Name]'s NIL value?` (was/is variant for former players)
2. `[First]'s social media following`
3. `How NIL value is calculated`
4. `Players with a similar NIL profile`
5. `[First] NIL FAQ`

Title: `[Name] NIL Value 2026: How Much Does [First] Make in NIL?` FAQ Q1: `How much does [Name] make in NIL?` FAQ Q4: `Does [Name] have NIL deals?`

- Covered: "nil value", "nil valuation" (title/H2), "how much does X make in NIL" (title/H1/FAQ), "nil deal" (FAQ 4, weakly).
- Not covered anywhere: **"net worth", "salary", "getting paid"**. "salary" appears only in negations ("not a salary or a confirmed deal"). The Queries.csv shows 41 named queries in the net-worth/salary/paid/make family (119 impressions in the sample), and those queries currently land on pages that never use the words. Cheap fix: one additional FAQ item phrased around net worth and salary.
- Name variants: no surname-only or misspelling handling exists (no aliases, no redirects); "sorsby nil deal" and "brandon sorsby nil deal" resolve or not purely on Google's own fuzziness.
- Slug generation: CONFIRMED CORRECT. slugify (add-athletes.js:28-32, duplicated merge-team.js:40-42) strips apostrophes and periods before hyphenating. Verified against live data: Amar'e Glover to amare-glover, J'Vari Flowers to jvari-flowers, Morez Johnson Jr. to morez-johnson-jr, Leroy Roker III to leroy-roker-iii, hyphens preserved (mikal-harrison-pilot). Latent gaps only: nonstandard apostrophe codepoints and diacritics would mis-slug; none present in current data. The sweep also handled 40+ same-name collisions with school-suffix slugs, documented per case in scripts/sweep/README.md.

## H7. The homepage reads as machine-generated: CONFIRMED

Severity: High for the reviewer's first impression. Effort: Medium.

Every tell in the hypothesis is present, with locations:

- Gradient text on "NIL" in the H1: index.html:67 with `.grad-text` (styles.css:104-107, cyan-purple-green gradient clipped to text). Two more gradient-text treatments: `.result-amount` and `.big-number` (styles.css:188-192, 333-336).
- Dark hero with purple corner glow: `.hero` stacks cyan and purple radial gradients (styles.css:83-90); `.hero-glow` is a blurred purple radial overlay (styles.css:91-95, markup index.html:63).
- Glassmorphism: `.site-header` uses `backdrop-filter: blur(12px)` over rgba (styles.css:58-63), plus ~10 translucent rgba surfaces (gate, buttons, cards).
- Green checkmark bullets: `.hero-points li::before` check glyph in #22c55e (styles.css:118-120), markup index.html:69-73. (Hidden below 900px, so mobile loses even those.)
- Emoji: tab labels `🔍` / `⚙️` (index.html:78-79), empty state `📈` (index.html:178), gate lock `🔒` (index.html:185 and every athlete gate, build.js:311), pillar icons `📣 🏟️ 🏆 ⭐` (index.html:262-277), newsletter `📩` (build.js:149).
- Current tokens (styles.css:4-24): brand #2563eb, brand-2 #22d3ee (cyan), accent #22c55e (green), accent-2 #a855f7 (purple), radius 18px, oversized soft shadows, Inter body + Sora display, H1 clamp to 3.1rem. That palette-and-radius combination is the default of generated landing pages.
- Homepage total text: 834 words including chrome; the "How we estimate" pillars are four ~30-word cards.

Mobbin reference set for the rebuild (dense, data-forward patterns; searched sports stats, player profiles, financial data, comparison, and directory patterns; consumer-SaaS aesthetics excluded):

- Player profile header formula: ESPN player Overview, https://mobbin.com/screens/9d723511-9f90-4e0a-9f64-3bb769df6197 (headshot, stacked caps name, label:value rows, boxed season-stat strip, plain tab row). Bio tab variant: https://mobbin.com/screens/3e1f48b4-1e09-49e0-a932-7356f995e5ab
- Entity page architecture with fact box and tabs: Perplexity Finance NVDA, https://mobbin.com/screens/341ce013-c9ef-4ee8-ba5f-6aa6544696d8
- Stat tables: ESPN Splits/Career (acronym headers, right-aligned numerals, pinned row label), https://mobbin.com/screens/0f28e296-078e-4b89-9c05-351946539f85 ; ESPN Game Log with shaded subheader rows, https://mobbin.com/screens/49143735-b359-427c-b884-21bd6b1d96e7 ; Perplexity F1 leaderboard card table, https://mobbin.com/screens/bab86cc7-d74d-44e6-9c10-2b4080c6599b
- Financial figure display: Fey KPI strip with honest N/A cells, https://mobbin.com/screens/c5f195da-677b-4b69-9a7f-517ca10e7af4 ; Revolut stats panel with horizontal driver bars, https://mobbin.com/screens/90050756-0bf5-4b8c-9bb7-dc8906e7fec0 ; Quicken range formatting ("Day range $198.61 - $208.27"), https://mobbin.com/screens/0d81ee39-15a8-4439-a0ba-c85dbd492139 , the exact pattern for an NIL range; Coinbase context sublabels under figures, https://mobbin.com/screens/63933ac2-c3e5-47bb-a608-61045360d0c4
- Comparison: Zillow compare (entity columns, attribute rows, shaded dividers), https://mobbin.com/screens/82a740cd-7cde-4aa7-bc7b-63451d23c2ad
- Directory/index: Fey stock screener (the strongest overall target), https://mobbin.com/screens/08c97ee6-5818-4bcc-ae01-2e2a751c1323 ; Perplexity screener chrome, https://mobbin.com/screens/fdf9e270-b81d-4639-8f60-6f623a347caf ; OKX category quick-cards feeding one sortable table, https://mobbin.com/screens/5a85b7c6-778f-4701-bcf0-8307895edc78 ; NFL app position-grouped roster, https://mobbin.com/screens/0051d303-d864-41b8-a4f8-672eacd85e74

Common threads to encode: uppercase micro-label column headers, right-aligned tabular numerals, hairline dividers instead of card shadows, label-over-value stat strips, explicit N/A, ranges instead of point estimates, zero emoji.

## H8. Benchmark against approved, ranking competitors: DELIVERED

Fetched 2026-08-07. On3 player pages, Spotrac, and Baseball-Reference sit behind bot walls (403); for those, findings rely on their indexed snippets and one fully fetched On3 methodology article, and are labeled as such. 247Sports and FanGraphs were fetched in full.

| Site | Page | What the athlete page delivers |
|---|---|---|
| On3 (snippets + fetched methodology page) | Brendan Sorsby NIL profile | Headline valuation ($3.1M) with national and position rank; bio strip; sibling tabs (industry comparison, main profile, team). Methodology page states, verbatim: "As of July 1, 2026, the On3 NIL Valuation moved from an algorithm-based model to a deal-based valuation model" and a green checkmark marks valuations "based on a confirmed player contract". The number is presented as sourced, dated, editorial data. |
| 247Sports (full fetch) | Sorsby player page | ~450-550 words server-rendered: measurables card, ratings block (transfer 98, HS composite 83, position and state ranks), written HS scouting report, event timeline; hub URLs (/videos/, /timelineevents/, per-school profiles); free. |
| Spotrac (snippets; no college/NIL section found) | Mahomes contract page | Year-by-year cap table with exact figures per row, contract overview, per-player sub-pages (fines, news tag); year-stamped titles ("... Cap Hit 2026"). |
| Baseball-Reference (snippets) | Carson Tinney register page | Season-per-row register across NCAA and Cape Cod League, dense bio microdata, draft line; free. |
| FanGraphs (full fetch) | Carson Tinney stats page | ~2,200-2,500 words of main content; 3 server-rendered tables x 4 season rows x 21-24 columns (270+ cells); five data-attribution lines; a same-day "Updated: Friday, August 7, 2026 8:42 AM ET" stamp; every stat abbreviation links to a glossary entry. |

Gap analysis for a howmuchnil athlete page:

- **Content depth:** competitors originate their centerpiece data (contracts, ratings, licensed stats, insider-reported valuations); howmuchnil's centerpiece is a modeled number sense-checked against On3, gated, with 25 words of original prose. Nothing on the page is dated; competitors stamp freshness on every page.
- **Information architecture:** competitors treat the athlete as a hub (multiple URLs, links to team, rankings, glossary, league entities); howmuchnil's page is a leaf whose only distinct outlinks are 4 comparables and a directory link. There are no team pages at all despite 75 teams in the data (build.js's own header comment at scripts/build.js:1-10 claims team pages that are never generated).
- **Visual density:** benchmark floor is multiple data tables with per-season or per-event rows; howmuchnil ships a 5-row facts table and a 1-row social table. The one analytical element that exists (breakdown bars) is dead code.
- **Gating:** every competitor gives the core data away unauthenticated and monetizes extras; howmuchnil gates the core datum and gives away everything generic.

## H9. Lead-gen groundwork: ASSESSED

- **What Formspree captures today** (endpoint mkoangpz for all forms): athlete-page gate sends `_subject`, mode, athlete, team, sport, position, `page` (build.js:314-324); homepage gate sends mode/athlete/team/sport/position/details/nil_estimate but **no page path**; the newsletter block on all 8,300 generated pages (build.js:146-158) and the homepage CTA band (index.html:345) send **email only** via native POST and land the user on Formspree's own thank-you page. No form sends a timestamp (Formspree stamps receipt) or a segment.
- **Segment field:** trivial. `submitEmail()` posts `new FormData(form)` (calculator.js:66-80), so any `<select name="role">` added to the form markup is captured with zero JS changes. Gate forms need a small flex-wrap CSS tweak (styles.css:440-443). Recommended wording per your brief: fan / athlete / parent or guardian / agent or advisor / brand or collective.
- **Attribution everywhere:** cheapest correct fix is ~5 lines in calculator.js appending hidden `page` = location.pathname (and a `ts` ISO string if wanted) to every form[action*=formspree] on load; covers all five form types including native POSTs, no template churn. Precedent exists at build.js:322.
- **Evidence the funnel is worth it:** 75 leads; 4 (5 percent) have email local parts matching the athlete's name (edward.miller -> Amar'e Miller, purcell_a2 -> Andrew Purcell, bilavermateo791 -> Mateo Bilaver, juniorlauaki76 -> Naulivou Lauaki Jr.), consistent with your ~6 percent estimate; 50 of 75 leads are for athletes with zero named-query presence (long tail working); 24 of 67 attributed leads came from sweep-added pages within ~10 days of those pages existing. One commit even records an athlete supplying his own follower count (357ed2bf12, "owner-provided").
- **Claim-your-page feasibility (one paragraph, not built):** an "Is this you?" link could open the existing gate form pre-tagged role=athlete and page-slug, which needs nothing new. Actual verified claiming needs identity proof (school email domain match, or a code DM'd to the listed social handle), storage (a `claims` field per record or a separate JSON, since there is no backend), and manual review; realistic effort is a day for the link-plus-tagged-form version, a week-plus for verified claiming with the current no-backend architecture. The tagged-form version is the right fall scope.
- **Minors:** privacy.html:63-64 says under-13s should not submit personal information and high-school minors "should involve a parent or guardian"; COPPA is not named, no age gate or attestation exists on any form, and the calculator explicitly offers a "High school" level (index.html:135). The dataset is college rosters, but the manual-estimate funnel invites HS submissions. In the leads file the only education-domain address is a university (mtu.edu); **I could not find a K-12 district address in the file, so that specific claim is unverified.** Cheap now: an "I am 16 or older" (or 13+) attestation checkbox on forms plus a sentence in the privacy policy naming COPPA and describing deletion on request. Required before any lead monetization involving minors; sale of minors' data triggers state-law parental-consent regimes (see phase two research question 6).

---

## Findings you did not ask about

N1. **Internal sweep notes are publicly served on the production domain. Fix this first.** The deploy uploads the repo root verbatim (`.github/workflows/deploy.yml`, `path: '.'`, plus `.nojekyll`), so https://howmuchnil.com/scripts/sweep/README.md serves, live, right now: the decision to withhold a named athlete's misdemeanor charge from his page, another athlete's court status, an excluded unverified allegation about a third, the full valuation rubric ("tier base x position multiplier x fanbase-rank multiplier plus deterministic 12 percent jitter"), and scraping notes including fetching Instagram "with a Googlebot UA". Also public: data/athletes.json (7.2 MB, the whole product), scripts/build.js, scripts/sweep/teams.json, README.md, and .claude/skills/. Severity: Critical (legal and reputational, and it hands any journalist or AdSense reviewer the "the numbers are formula jitter" quote). Effort: Small (exclude paths from the Pages artifact or move them out of the repo; note the files remain in git history of a public repo, so history rewriting or making the repo private is part of the real fix).

N2. **Ads cannot serve even if approved today.** ADS_ENABLED = false (build.js:137) strips the ad unit from all 8,300 generated pages; the homepage's two units are commented out (index.html:216, :244); all three slot IDs in code are placeholders (1111111111 / 2222222222 / 3333333333). Approval plus forgetting this equals zero revenue. Effort: Small, after approval.

N3. **The full valuation DB is ungated JSON** (assets/data/athletes-index.json, 1.5 MB, 8,288 entries). Also relevant to H0b and to the lead-gen strategy (the gate protects nothing).

N4. **No About page, no 404 page.** About/ownership transparency is a standard AdSense trust item; contact.html exists but is noindexed and absent from the sitemap. No custom 404 on a site with 8,288 slug URLs.

N5. **Consent and analytics:** GA4 (G-WFXLBN94GQ) and the AdSense loader execute unconditionally on every page with no consent mode defaults (analyticsSnippet, build.js:81-94); the code deliberately defers to Google's CMP for EEA/UK (calculator.js:442-445) but nothing gates the tags themselves; dead consent-banner CSS remains (styles.css:302-320).

N6. **45 records carry level "power" for non-power programs** (Troy Sun Belt baseball, Big East basketball, UNLV before the sweep's G5 handling), inflating their valuations via the division multiplier. The sweep did this correctly for Memphis/UNLV (level d1, progMult 0.55); the legacy records were never revisited.

N7. **Data-accuracy debt recorded by the sweep itself** (scripts/sweep/README.md): Florida, USC, Oregon, Michigan State were swept from spring or pre-camp rosters and are on an "August re-sweep" list; Texas A&M has 7 players with recorded handles but zero counts; Whit Weeks has conflicting sources (On3 $1.8M vs NIL Standard $451K, On3 used). Engagement is a constant 5 on 92 percent of records, and 76 percent of records have zero social data while the model's influence pillar is the headline driver.

N8. **Internal links all point at the non-canonical index.html URL form** (H0b); sitemap has no lastmod; contact.html missing from sitemap; README.md still advertises the old github.io URL.

N9. **Zero referring domains** (your claim): not verifiable from this environment (no backlink index access); consistent with the site's absence from any coverage found during SERP checks. GSC's Links report can confirm.

N10. **Core Web Vitals: not verifiable today** (PageSpeed API rate-limited both attempts; no CrUX field data at this traffic level). Structural evidence is favorable: athlete pages are ~12 KB static HTML, one 498-line stylesheet, one JS file, no images; main risks are the render-blocking Google Fonts load and the AdSense loader.

N11. The valuation reveal, breakdown bars, comparable-value context, and search are all client-side only; the indexable page never contains the value proposition (overlaps H0b).

N12. Formspree free-tier monthly submission caps may bite during football season if traffic converts at the current 6 to 7 percent; worth checking the plan before the season.

---

## What caused the June 17 rejection

The reviewer saw the ~460-page June site. In order of likely contribution:

1. **H0/H1: substantively empty templated pages.** Same template as today, 70-plus percent shared text, one-sentence stencil blurbs on ~60 percent of pages (280 of 368 baseball), the headline datum blurred behind an email form, one-row tables, triple restatement of a single follower figure. This is the "low value content" verdict, and the same diagnosis applied to your two sibling sites suggests the pattern (same generator skill) rather than this site's specifics.
2. **H3: visibly broken text on every page** (nested parens on all pages then too), signaling an unmaintained machine-built site.
3. **H7: the homepage** as the first page a reviewer loads, presenting the generated-site aesthetic signature.
4. **Trust-page gaps: no About page.** (Privacy and Terms existed and are adequate; ads.txt existed in repo from the start and is live now; the console "Not found" reading is stale or predated DNS/deploy.)

Not causes: indexation (H4 disconfirmed), ads.txt (present), canonical duplicates (handled), CWV (no evidence of a problem).

---

## Buckets and sequence against the ~3.5-week deadline

Severity: C critical, H high, M medium, L low. Effort: S under half a day, M half a day to two days, L multi-day.

### Bucket 0: immediately, independent of AdSense

| # | Item | Sev | Effort |
|---|---|---|---|
| 0.1 | Stop serving scripts/, data/, .claude/, README.md, DIAGNOSIS.md on the production domain (N1); decide on git-history exposure | C | S |

### Bucket 1: required for resubmission (target: week 1, then resubmit)

| # | Item | Sev | Effort |
|---|---|---|---|
| 1.1 | Fix the three paren templates + split source into label/note; fix double periods and bad possessives at data level; rebuild (H3) | H | S-M |
| 1.2 | De-pad the athlete page: state each datum once; kill the caption and FAQ restatements; drop the one-row table format when only one platform exists; render breakdownBars() server-side; add class, hometown, jersey, role tier to the facts table (data already present); replace "We'll add social numbers soon." with honest omission (H0) | C | M |
| 1.3 | Show a rounded value range as real on-page text (for example "$800K to $1.3M range, modeled") with the exact reveal still email-gated if desired; date-stamp every page ("Data updated August 2026") (H2, H8 freshness gap) | H | S |
| 1.4 | Indexation posture for the 6,312 stencil pages before Google and the reviewer meet them: EITHER noindex depth and walk-on tiers (4,700 pages full of stencil blurbs and zero socials) until enriched, and hold them out of the sitemap, OR enrich them first (not feasible in 3 weeks at quality). Recommended: noindex-and-withhold now, lift tier by tier as enrichment lands. Roster completeness remains a user feature; it should not be the review sample (H1) | C | S-M |
| 1.5 | About page (site ownership, who builds the data, methodology summary, contact) + link it sitewide; un-hide a contact path (N4) | H | S |
| 1.6 | Homepage credibility pass: remove gradient text, glow, emoji; replace pillar cards with a real top-valuations table (data is public in the JSON already) and a dense directory entry point, per the Mobbin references (H7) | H | M |
| 1.7 | Re-verify ads.txt status in the AdSense console (likely already resolved); keep ads disabled until approval, then real slot IDs (N2) | H | S |

The blurb-enrichment program starts in week 1 too but is not a resubmission gate for the pages that remain indexed: the ~1,700 researched-tier pages plus baseball's hand-written ones are the review surface, and 1.2 makes them materially denser without new research.

### Bucket 2: improves approval odds and post-approval standing (weeks 2-3)

| # | Item | Sev | Effort |
|---|---|---|---|
| 2.1 | Enrich starter and rotation tiers to 100-200 word blurbs using the existing sweep agent pipeline (scripts/sweep/), highest-traffic teams first | H | L (pipeline exists; ~4,200 athletes; achievable in tranches) |
| 2.2 | Team pages: one per program (75), with roster table, team NIL context paragraph (~120 hand-written words each), links to every athlete; fixes the single-mega-directory crawl path and adds 75 genuinely distinct pages | H | M-L |
| 2.3 | Paywalled-content markup if any gate remains: isAccessibleForFree false + hasPart/WebPageElement with cssSelector on the gated block (H0b) | M | S |
| 2.4 | Internal links to canonical URL form; sitemap lastmod from data timestamps; add contact or about to sitemap | M | S |
| 2.5 | Consent mode defaults for GA4/AdSense (EEA correctness) (N5) | M | S |
| 2.6 | Custom 404 with search box (N4) | L | S |
| 2.7 | August re-sweep list from the sweep's own QA notes (Florida, USC, Oregon, Michigan State rosters; A&M socials backfill) (N7) | M | M |

### Bucket 3: SEO and product, can wait for September

3.1 Dedicated /nil-calculator/ landing page for the category queries (currently position 17-66 with homepage-anchor targeting only; the ranking competitors are dedicated tool pages). 3.2 Net worth and salary FAQ item and modifier coverage (H6). 3.3 Sport and conference index pages; directory pagination. 3.4 Fix legacy level misclassification (N6) and engagement constants. 3.5 Name-variant handling (surname redirects are not possible on Pages; a search-suggest that tolerates misspellings is). 3.6 Diversify sources beyond On3 and rename the field presentation (On3 moved to a deal-based model July 1, 2026, per their methodology page; "sense-checked against On3" now means something different than when the copy was written). 3.7 Valuation history snapshots to enable a "changed since June" module (freshness at scale).

### Bucket 4: lead-gen prep (cheap bits in week 1, rest during season)

4.1 role select on all forms + page/timestamp attribution via the 5-line calculator.js approach (S). 4.2 Age attestation checkbox + COPPA sentence in privacy policy (S). 4.3 "Is this you?" link opening the gate form pre-tagged role=athlete (S). 4.4 Formspree plan check before season (S). 4.5 Keep the leads xlsx columns as the canonical schema; segment becomes a column automatically.

---

## Rebuilt athlete page: section by section

Target: a page that survives "low value content" review on its own merits with the exact figure still gated. Modeled on the 247Sports and FanGraphs benchmarks and the Mobbin patterns; every element sourced from data already in athletes.json unless noted.

| # | Section | Contents | Words | Per-athlete or shared | Source |
|---|---|---|---|---|---|
| 1 | Header + fact strip | Name, position, team, conference; label-over-value strip: class, jersey, hometown, role tier, level | ~30 | Per-athlete data | fields already in data (class/hometown/jersey/roleTier, currently unrendered) |
| 2 | Valuation module | Rounded range as real text ("Estimated range: $840K - $1.3M"), model label, date stamp, confidence note (researched anchor vs modeled); exact point figure behind the email gate; server-rendered driver bars (influence, performance, market, sport) | ~60 visible | Template with variables | valuation/low/high + breakdown(); ranges become honest once 1.3 lands |
| 3 | Bio and outlook | The blurb, expanded: role and depth-chart status, background (recruiting, transfers, hometown), one season-outlook sentence | 100-200 (researched tiers), 40-80 (rotation), 25-40 (depth, honest and factual) | **Per-athlete prose, the core investment** | existing agent pipeline (scripts/sweep/), which already wrote 1,478 at 25-40 words |
| 4 | Season/career facts table | Per-season rows where obtainable (starter tier), else roster facts (class year progression, high school, previous school) | table | Per-athlete data | sweep agents can capture on the re-sweep; roster facts already partially in data |
| 5 | Social reach | Table only when 2+ platforms; single sentence when one; omit when zero (no placeholder); handles linked | 0-30 | Data | followers + handles (handles currently unrendered) |
| 6 | Team NIL context | 100-140 words on the program's NIL situation (collective, revenue-share posture, spend tier), shared by all athletes of that team, linked to a team page | ~120 | Shared per team (75 units, hand-written once) | new, one-time editorial effort; sweep README already contains half the facts |
| 7 | Comparables | 4-6 same-position or same-team players **with their rounded ranges shown** | ~50 | Data-driven | existing comparables() + public values |
| 8 | Methodology | 2-3 sentences + link to a full standalone methodology page (new, one page sitewide, dated, honest about modeled vs anchored) | ~50 | Shared | rewrite of the current paragraph, minus the paren bug |
| 9 | FAQ | Cut to 2 genuinely distinct questions (net worth/salary phrasing; does X have deals), no restatement of the gate | ~70 | Template with variables | trimmed faqItems() |

Total: roughly 550-750 words plus two to three real tables, of which genuinely athlete-specific content is 150-250 words on researched tiers. That is the level where the page stops being a frame around a blurred number and becomes a profile with one number gated, which is the pattern every benchmarked competitor monetizes.

**Achievability before resubmission: not across all 8,288 pages, and it does not need to be.** The structural changes (sections 1, 2, 5, 7, 8, 9, and the table skeleton of 4) are template work applied to all pages in one rebuild: roughly a week including the homepage. The per-athlete prose at 100-200 words is realistic for the star tier (224) in days and the starter tier (1,745) within the window using the existing pipeline; rotation (2,444) partially; depth and walk-on (3,547) not in this window, which is what recommendation 1.4 (withhold from index until enriched) is for. Resubmit once the structural rebuild is live and the review surface is the researched tiers plus baseball's hand-written pages.

---

## Appendix: measurement notes

- Word counts: visible text extracted from generated HTML with scripts/styles stripped, header nav and footer excluded. Similarity: difflib matching-block word share and 8-gram shingle Jaccard over 20 sampled football pages (10 depth/walk-on, 10 star).
- Blurb classification: blurbFor() (merge-team.js:126-138) reimplemented bit-exactly (including the djb2 hash template picker) and compared to every new football record's stored blurb.
- "New football" = football slugs absent from data/athletes.json at commit 68a437f00f (June 17): 7,828 of 7,872.
- Live checks (2026-08-07): sitemap URL count, hero-kanu page source, both URL forms, ads.txt, athletes-index.json, scripts/sweep/README.md, all via direct fetch.
- Not verifiable from this environment: GSC state beyond the supplied screenshots, consumer SERP features (AI Overviews, panels), backlink counts, PageSpeed lab scores (API rate-limited), Formspree plan limits.
