# Phase Two: External Research for the howmuchnil.com Reapproval

Date: 2026-08-07. Companion to DIAGNOSIS.md (phase one). Every claim is labeled [Google states], [Tested], or [Inferred/practitioner], with source and date. Where evidence is thin or conflicting, that is stated instead of picking a side. This file is excluded from the site deploy by the workflow whitelist.

---

## The required first step: Google's AdSense approval video

The video (https://www.youtube.com/watch?v=lZUG0XGlZZY, "How to get your site approved for AdSense?", Google AdSense channel, published Feb 10, 2020, 2.77M views at fetch) could not be played or transcribed from this environment: YouTube serves a CAPTCHA wall, and every transcript service tried (filmot, youtubetranscript.com, tactiq, timedtext API, innertube, Invidious, Piped, archive.org) was blocked, empty, or down. What WAS verified, from the watch page's own server-rendered metadata and Google's chapter markers (fetched 2026-08-07):

- The video's three activation checks: code complete and correct (0:40), site reachable (1:11), policy compliant (1:56).
- **The three publisher violations in the ~2:02 section, per Google's own chapter titles: Low Value Content (2:09), Having Replicated Content (2:15), Site Navigation (2:29).**
- Google still treats the video as current: the live help article "What to do when your site is not ready to show ads" (support.google.com/adsense/answer/12176698) embeds this exact video at the top and mirrors its structure.

Mapped to phase one: the three violations are, in order, the site's rejection verdict (low value content), the site's 6,300 stencil pages (replicated content), and the site's single 8,288-link directory as sole navigation (site navigation). The video is effectively a table of contents for this site's problems. No word-for-word spoken quotes are used anywhere in this report because none could be verified.

### The companion articles (all fetched 2026-08-07; Google help pages show no last-updated dates)

- Eligibility (answer/9724): [Google states] "Your content must be high-quality, original, and attract an audience." Applicant 18 or over. You must control the site's HTML.
- Pages-ready (answer/7299563): [Google states] unique, original, relevant content; navigation checklist (alignment, readability, functionality); "It's really important that you contribute your own original content, whether it's specialist knowledge, improvement ideas, reviews, or your personal thoughts."
- Not-ready troubleshooting (answer/12176698): [Google states] four failure buckets: code missing, site unreachable (remove login protection for review, do not block the crawler), "not enough unique content or poor user experience," policy violations. Review takes "a few days, but in some cases can take 2-4 weeks."
- Content and user experience (answer/10015918), the key passage for a templated database: [Google states] "If you have many pages that are similar or have very similar content, consider expanding each page or consolidating the pages into one. Also, try to minimize repeating long segments of text in different pages of your site." Plus: update the site regularly; no doorway pages; no pages with little to no content.
- Publisher Policies (answer/10502938 and publisherpolicies/answer/11112688): [Google states] no ads on screens "without publisher-content or with low-value content"; "The content you provide should be of value to the user and be the focal point"; **"Don't place ads on automatically generated content without manual review or curation."**
- 2017 AdSense blog on the predecessor "insufficient content" label (blog.google, Mar 1, 2017): [Google states] "Sites that consist only of a site template and very little content may not be approved."

Corrections to common folklore, from the official docs themselves: **an About page is not required by any official Google text** (it is Product Expert advice; still cheap trust hygiene, and ours is now built), **ads.txt is an ownership/connection mechanism, not a quality factor**, and **no numeric word count or page count exists anywhere official**.

---

## Q1. "Low value content" for database and programmatic sites (highest priority)

**What the evidence supports**

- The AdSense verdict is anchored to the same definitions as Search (thin content, scaled content, little added value); the rejection notice links to Google's minimum-content and quality guidelines. [Google states, via help docs and forum threads quoting the notice, 2023-2026]
- **The AdSense review evaluates what a plain-HTML crawler sees; it does not execute JavaScript.** Tool-style and script-driven sites "typically fail review" because they render near-empty. [Inferred/practitioner, but from a Diamond Product Expert on Google's own forum, Nov 20, 2025, thread 388840504]
- No numeric threshold for "enough" unique content exists in any credible source. The credible convergence is a structural test: the unique part of each page must be the answer to the page's query, visible in crawlable HTML, substantial relative to boilerplate, and visible above the fold (Mueller, June 2021, via Search Engine Roundtable). Circulating numbers ("700+ words," "20-25 posts before reapplying") trace to AI-written agency blogs with no methodology; discounted.
- The only controlled test found: SearchPilot's unique-vs-templated content A/B (May 19, 2022): replacing a shared boilerplate block with a unique per-page block produced ~14 percent organic uplift at 90 percent confidence. [Tested, single site, pre-2024-policy; direction only]
- The one documented surviving programmatic build (theStacc, 512 pages, published May 2026, vendor self-reported): minimum 3 unique data points visible per page, 850-2,200 words, throttled publishing, quarterly pruning. [Inferred/practitioner]
- Documented rejections-to-approvals (self-reported, 2024-2026) share one pattern: prune or noindex thin near-duplicates, add substantial original pages, add trust pages, wait 2+ weeks, reapply. **No documented case exists of an AdSense approval for a large stencil-page database whose templated pages stayed indexed and unchanged.**

**On the gate specifically:** no source directly addresses email-gating one data point. Four independent official lines converge on the same implication [Inferred]: (1) the reviewer's crawler never sees the gated number, so the page's only unique payload contributes zero; (2) content, not a lead form, must be "the focal point" of monetized pages; (3) Google's March 5, 2024 announcement targets "pages that pretend to have answers to popular searches but fail to deliver helpful content," a near-literal description of a page titled "[Athlete] NIL Value" that withholds the value; (4) the doorway policy covers pages that funnel visitors into one usable portion of a site. Verdict: the gate alone is unlikely to be the sole cause, but it deletes the site's one first-party data asset from the review, and showing the number (or a range) converts that asset to visible content on 8,288 pages at zero production cost.

**Contested/thin:** any specific uniqueness percentage; whether gating alone triggers the verdict; the forum claim that ~95 percent of applications are declined (single unverified statement).

## Q2. Scaled content abuse on templated entity pages

**What the evidence supports**

- Policy text (spam policies, updated May 15, 2026): scaled content abuse is "many pages... generated for the primary purpose of manipulating search rankings and not helping users... no matter how it's created." Method-agnostic since March 2024. [Google states]
- Enforcement is real at the deindexation level: around the March 2024 update, ~2 percent of 79,000 tracked sites were fully deindexed; 100 percent of examined deindexed sites showed machine-generated content signals (Originality.ai, March 2024; disclosed dataset, vendor selection caveats). [Tested/correlational]
- The 2024 loser list is this site's archetype: SISTRIX IndexWatch US 2024 (published Feb 6, 2025) shows large templated entity databases losing 77 to 97 percent visibility (Point2Homes -97, PublicSchoolReview -95.6, PropertyShark -88.7, three lyrics databases -77 to -95). Each of those had MORE unique payload per page than a 25-word blurb. [Tested/correlational]
- Recovery data favors pruning first: sites that pruned 40-60 percent of their catalog before adding content recovered at roughly 3x the rate of sites that only added (theStacc meta-study of Gabe/Ray/Shepard datasets, July 10, 2026; magnitudes loose, direction consistent). Only ~22 percent of hit sites recovered even 20 percent of lost traffic. [Inferred/practitioner]
- **No tested differentiation threshold exists.** Google frames the policy on purpose and value, not a percentage. The usable proxies: 3+ visible unique data points per page (single case), unique content above the fold (Mueller), and indexation rate as the leading indicator. Anyone quoting a percentage is asserting, not measuring.
- Timing note: the June 2026 spam update (June 24-26) was "a normal spam update" per Google; the site's June 17 rejection predates it and was a review outcome, not an algorithmic action. [Google states]

**Implication:** the 6,300 stencil pages are the textbook policy profile, and the documented tail risk (full-domain deindexation) would take the healthy 460-page asset down with them. Prevention (noindex now) is far cheaper than the documented recovery path (prune, consolidate, wait 3-6 months).

## Q3. Gated content and organic performance

**What the evidence supports**

- Google's paywalled-content structured data (developers.google.com paywalled-content doc, updated 2025-12-10) explicitly covers registration gates, not just paywalls: `isAccessibleForFree: false` plus `hasPart` WebPageElement with a class-based `cssSelector` on the gated block. Its stated purpose: differentiate gated content from cloaking. Googlebot must receive the full content for it to rank. [Google states]
- The spam policy's cloaking section says a paywall "or a content-gating mechanism" is not cloaking if Google sees the full content and Flexible Sampling guidance is followed. Serving full content to Googlebot but not users WITHOUT the markup matches the cloaking definition (Mueller, Dec 2020 office hours). [Google states]
- **Today the machinery is not even engaged: the figure lives in a data attribute, which Google does not index as content. There is no cloaking risk and also no indexable answer.** The pages compete for "worth" queries with zero visible value while competitors print the number. [Inferred, from phase one facts plus the docs]
- Cost of Google not seeing gated substance: the WSJ natural experiment (left First Click Free, Feb 2017): search traffic fell 44 percent while subscription conversion quadrupled (Search Engine Land, June 5, 2017; pre-update era, flagged). No controlled test of the markup's ranking effect exists; hard-paywall sites with correct markup (NYT, The Athletic) rank normally as observational evidence. [Tested/natural experiment + observational]
- Snippet control: `data-nosnippet` and `max-snippet` govern both classic snippets and AI Overview previews (ai-features doc, updated 2025-12-10). The exact figure can be indexed but kept out of snippets. [Google states]

**Implication, and the sharpest strategy update of phase two:** the sanctioned, evidence-backed shape is a partial reveal. Render a rounded range as real visible text for everyone (indexable, reviewer-visible, AdSense-countable), keep the precise figure and breakdown behind the email gate as real text hidden by a class, add the paywalled-content markup with that class selector, and wrap the precise figure in data-nosnippet. This one change addresses the AdSense "focal point" objection, the SEO invisibility, and the cloaking exposure simultaneously.

## Q4. AI Overviews on entity-value queries

**What the evidence supports** (all 2025-2026)

- Every credible study finds large CTR reductions when an AI Overview renders on informational queries: the one randomized controlled experiment found organic clicks down 38 percent and zero-click up from 54 to 72 percent (Agarwal and Sen, SSRN working paper, run Jan-Feb 2026, n=1,065); Pew (July 22, 2025, 68,879 real searches) found clicks halved (8 vs 15 percent) with an AI summary present; Ahrefs (Apr 2025, updated Dec 2025) found position-1 CTR down 34.5 then 58 percent; Seer (2026 update, 5.47M queries) found AIO-present CTR bottoming at 1.31 percent in Dec 2025 and recovering to 2.36 percent by Feb 2026. Magnitude and trajectory are contested between studies; the direction is not. [Tested]
- Question-shaped queries ("how much is X's nil deal worth") are the high-trigger shape: 60 percent of question-word queries produced an AI summary in Pew's data. But sports triggered AIOs on only ~14.8 percent of queries in BrightEdge's vertical tracking (2025), and long-tail athletes with sparse coverage often trigger no AIO because there is nothing to synthesize. [Tested for the rates; Inferred for the tail logic]
- Citation mitigates, does not restore: links inside AI summaries were clicked on 1 percent of Pew's visits; Seer found being cited roughly doubles remaining clicks versus not being cited on the same query class, still 38 percent below no-AIO queries. [Tested/correlational]
- Becoming citable: Google states the only technical requirement is being indexed and snippet-eligible; no special markup, no llms.txt (ai-features doc; May 2025 Search Central post). Ranking still matters but is decoupling (Ahrefs: top-10 share of citations fell from 76 to 38 percent between mid-2025 and 2026). Brand mentions correlate with AI visibility 2-3x more strongly than backlinks (Ahrefs 75,000-brand study). [Google states + Tested/correlational]

**Implication:** plan revenue on tail athletes, where AIOs rarely render and howmuchnil is often the only structured source; that is also exactly where the leads come from (50 of 75 leads are athletes with zero named-query presence, phase one). For head athletes, pursue citation as damage mitigation: an extractable one-sentence answer with a date, high on the page. Indexation remains the precondition for everything, which is Q5.

## Q5. Non-indexation at scale

**What the evidence supports**

- Mass "Crawled/Discovered - currently not indexed" is a site-level quality signal, per Google, repeatedly and most recently July 2026: when systems have quality concerns "we'll probably crawl a lot less. We'll index a lot less... once we're happy, we will take another look" (Mueller and Splitt, Search Off the Record, via Search Engine Journal, July 17, 2026, with undifferentiated mass-produced content named in the discussion). Crawl capacity is irrelevant at 8,288 pages (Illyes: ~1M-page threshold). [Google states]
- Noindexed pages are excluded from Google's site-quality assessment; indexed thin pages are counted (Mueller, consistent 2017-2026). Noindex is an accepted temporary shield "to prevent it from affecting the bigger picture of the website." [Google states]
- Pruning/noindexing thin pages has the best documented reversal record (ecommerce pruning case work; HCU-era recoveries pairing pruning with differentiation over 12-16 weeks; magnitudes unreliable, direction consistent). Internal-linking fixes have small-scale support. Sitemap lastmod is trusted binarily and only if honest (Illyes); it schedules recrawl, it does not cause index selection. [Inferred/practitioner + Google states]
- No Google statement penalizes a bulk launch per se; the content pattern, not the release schedule, is what is in scope. Practitioners consistently report bulk-publishing large low-authority batches tanks indexation and recommend staged rollout (~500-1,000 page pilot, 6-8 week evaluation); no controlled test of staging exists. [Google states + Inferred]

**Implication, decisive for the standing question:** noindex the ~6,300 stencil pages NOW, before Google's first crawl of the new section forms its quality sample. Use meta robots noindex, not robots.txt (blocking would hide the directive and strand them in Discovered limbo), remove them from the sitemap, keep them linked for users, and promote each page to indexable only when it carries differentiating content. Release the ~1,500 researched pages in staged tranches linked from established hub pages. Whether noindex-before-first-crawl beats noindex-after is [Inferred], but the site-level mechanism makes before strictly safer, and reversal is documented to take months.

## Q6. Athlete lead-gen viability

**What the evidence supports**

- **No direct market exists.** No published per-lead pricing, marketplace, or affiliate program for "athlete leads" was found across Opendorse, Icon Source, MOGL, Athliance, NOCAP, INFLCR/Teamworks (searched 2026-08-07). Platforms monetize SaaS, marketplaces, and brand campaigns, not lead resale.
- The $50-200 hypothesis: **partially supported by analogy, unsupported directly, and volume-limited.** Adjacent calibration: financial-advisor leads $25-680 by asset tier (SmartAsset legacy model, retired for new advisors March 2024); PI-legal leads $50-600 exclusive; insurance $10-50. Per-lead price scales with buyer LTV. For advisor-bound adult leads, $50-200 is reasonable; for NIL-agency leads, unit economics (15-20 percent commission on a median deal well under $5,800 per the NIL Go clearinghouse's June-Aug 2025 data) imply willingness to pay under $50. At ~2 identifiable athlete/family leads per month, even $200 per lead is under $500 per month.
- **Compliance is the binding constraint, and it is hostile to exactly the most identifiable leads (high schoolers looking themselves up):** amended COPPA (full compliance April 22, 2026) requires separate verifiable parental consent for third-party disclosure under 13; Maryland MODPA (enforcement from April 1, 2026) flatly bans selling under-18 data on a "knew or should have known" standard; New York CDPA (effective June 20, 2025) requires informed consent under 18; California requires opt-in under 16; roughly a dozen states have teen provisions; Connecticut bans under-18 sales from July 1, 2026. An NIL calculator that advertises a high-school mode strengthens the "should have known" prong. [Statutes and regulator guidance, dated inline in the full agent report]
- Sleeper risk specific to this niche: 42 states' athlete-agent laws (UAAA/RUAAA) define "recruit or solicit" to include influencing an athlete's (or minor's parent's) choice of agent for anticipated economic benefit; paid per-athlete referral to an NIL agency plausibly requires agent registration, with civil penalties up to $50,000 in some states. The FTC opened a SPARTA inquiry into college-sports agent practices January 12, 2026. Referral to financial advisors is the safer lane but makes the site an SEC Marketing Rule "promoter" (disclosure plus written agreement above $1,000/12mo; routine, as SmartAsset and Zoe operate).
- Higher-EV documented alternatives: advisor referral revenue share (Zoe Financial's disclosed 15-35 percent of ongoing advisory fees per converted client, ADV brochure Jan 31, 2025: one $500K household is worth $750-1,750 per year to the referrer, recurring) and flat category-exclusive sponsorship of the site/newsletter ($250-1,000 per month is an inference calibrated from advisors' $2,000+/month lead-gen spend; no NIL rate card exists).

**Implication:** do not build toward per-lead sales of self-lookups. Build toward (1) never selling or sharing any under-18 lead as a hard rule, (2) affirmative unchecked opt-in language naming recipient categories when the referral path activates, plus a Do Not Sell/Share link, (3) DOB collection rather than an age checkbox once any sale/share begins, (4) monetizing via flat sponsorship and an SEC-compliant advisor referral share on verified 18+ leads. The newsletter checkbox added this week is consistent with this posture.

## Q7. Structured data for people and monetary estimates

**What the evidence supports** (2026 state of the docs)

- Nothing currently supported will put the NIL figure or any rich enhancement into these pages' snippets. Person has no rich result; ProfilePage is restricted to site-affiliated people; Occupation/estimatedSalary was retired June-Sept 2025; ClaimReview is being phased out; Dataset markup feeds Dataset Search only (Mueller clarification, Nov 5, 2025); **FAQ rich results stopped appearing for everyone May 7, 2026, with docs and tooling support removed June-Aug 2026.** [Google states, doc dates inline in the agent report]
- Structured data is not a ranking factor (Mueller, April 2025). SearchPilot's test record shows markup moves traffic only when it changes the visible SERP, which no applicable type now does. [Google states + Tested]
- For AI features, Google states no special schema is needed; SE Ranking's correlational finding that most AI-cited pages carry schema is untested as a lever. [Google states + contested]

**Implication:** keep Person (add accurate sameAs to real social profiles, which the data now stores as `handles`) and BreadcrumbList as hygiene. Drop the FAQPage JSON-LD (it earns nothing and currently carries gate-advertising text into structured data). Spend all structured-data effort on the paywalled-content markup from Q3, the one type that addresses an actual problem. A single Dataset-marked methodology/dataset page is a cheap optional discovery play for journalists.

---

## Updated fix sequence

Changes from the DIAGNOSIS.md sequence, in light of the evidence. Bucket numbering preserved; unchanged items not repeated.

**Elevated and reshaped:**

- **1.3 (was: rounded range as text, optional gate) is now the centerpiece, tied with 1.4.** Visible rounded range plus a dated one-sentence answer ("As of August 2026, [Athlete]'s estimated NIL value is in the $840K to $1.3M range") as static HTML on every page; exact figure and breakdown remain gated but rendered as real text hidden by class; add isAccessibleForFree/hasPart markup with that class; data-nosnippet on the exact figure. Rationale: the AdSense reviewer reads plain HTML only; content must be the focal point; the current attribute-only figure is invisible to review, index, and AI citation alike.
- **1.4 confirmed with mechanics:** meta robots noindex on stencil-tier pages (not robots.txt), drop them from the sitemap, keep user-facing links, promote per page on enrichment. Stage the researched ~1,500 in tranches of ~500 with 6-8 week indexation checks. Prune-before-add has the only 3x-graded recovery evidence in the literature.
- **New 1.8: remove the FAQPage JSON-LD sitewide** (dead since May 2026, and its answer text advertises the gate inside structured data). Keep or trim the visible FAQ purely on content merit per the H0 de-padding.
- **Navigation moves up in emphasis within 2.2:** it is one of the video's three named violations and heavily covered in the pages-ready doc. Team pages (75) plus sport/conference groupings replace the single 8,288-link directory as the crawl and navigation structure. Schedule early in bucket 2, immediately after resubmission if not before.
- **"Manual review or curation" documentation:** publisher policy explicitly disallows ads on automatically generated content without manual review or curation. The About/methodology page should truthfully describe the human review tiers (the sweep's tiered research process), and the enrichment program is what makes that claim true at scale. Fold into 1.5/2.1.

**Downgraded or corrected:**

- About page: built, keep it, but it is Product Expert folklore rather than an official requirement; do not expect it alone to move the verdict.
- ads.txt: connection mechanism only; the console "Not found" is a stale-status re-check, nothing more.
- Sitemap lastmod (2.4): only with honest per-page dates; Illyes describes binary trust, and faking it burns the signal. Wire it to real data-update timestamps or skip it.
- Structured-data ambitions beyond paywall markup: dropped per Q7.

**Unchanged and reinforced:** H3 fixes (shipped), de-padding (1.2), homepage credibility pass (1.6), the blurb enrichment program (2.1) as the engine that flips noindexed pages live, tail-first traffic strategy (Q4), and the bucket 4 lead posture now upgraded with the compliance rules above (hard under-18 no-sale rule; opt-in naming recipients; DOB when the referral path activates; sponsorship and advisor referral share over per-lead sales).

**Expected timeline calibration [Google states + Inferred]:** AdSense review takes days to 2-4 weeks; Search-side algorithmic reassessment of a site's quality takes months, not weeks. Resubmit when the review surface (indexed pages plus homepage plus navigation) is defensible, which the bucket 1 set achieves without waiting for full enrichment.
