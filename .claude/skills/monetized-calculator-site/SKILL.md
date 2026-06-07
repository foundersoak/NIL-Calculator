---
name: monetized-calculator-site
description: >-
  Build and launch a monetized static "calculator + database + guides" content
  site on GitHub Pages, the same pattern as an NIL valuation site. Covers a
  data-driven static generator, an email-gated interactive calculator with
  lead-capture context, SEO entity pages and guide articles, plus the full
  go-live and monetization playbook: custom domain, Google Analytics, Search
  Console + sitemap, AdSense, and consent. Use when the user wants to spin up a
  new niche calculator / valuation / ranking / directory site to monetize with
  display ads and an email list, or asks to replicate this build for another
  topic. NOT for app backends, dynamic servers, or non-static sites.
---

# Monetized calculator + database + guides site

A repeatable playbook for shipping a niche content site that (1) ranks in search,
(2) captures emails behind a value "gate," and (3) earns via display ads. Proven
on an NIL athlete-valuation site. Everything is **static HTML generated from one
JSON file**, hosted free on GitHub Pages.

## What's reusable vs niche-specific

- **Reusable (this skill):** the generator architecture, the email-gated
  calculator, the entity-page + guides templates, the data importer, SEO wiring,
  and the entire deploy + monetization sequence.
- **Niche-specific (you supply):** the topic, the "item" schema, the **value
  model** (what the calculator computes), the **data** (and how you research it),
  and branding. The example site valued athletes; yours might value cars,
  freelancers, used gear, salaries, rentals, domains, etc.

The `templates/` folder holds the proven implementation (from the NIL site) with
private IDs scrubbed to placeholders. Treat it as a working reference to copy and
adapt, not boilerplate to ship unchanged.

## Mental model of the architecture

```
data/items.json         <- SINGLE SOURCE OF TRUTH (items + groups)
scripts/build.js        <- generates ALL html, sitemap.xml, search index, stamps asset versions
scripts/add-items.js    <- validates a research batch + merges into items.json + rebuilds
scripts/guides-content.js <- guide articles (un-gated SEO content)
index.html              <- hand-written homepage (hero + the calculator)
item/<slug>/index.html  <- generated entity pages (gated value)
items/index.html        <- generated directory
guide/<slug>/index.html <- generated guide articles
assets/js/calculator.js <- calculator (lookup + estimate), email gate, lead capture, search
assets/css/styles.css   <- styling
assets/data/items-index.json <- generated client-side search/similar index
.github/workflows/deploy.yml <- auto-deploys to GitHub Pages on push to main
ads.txt robots.txt CNAME privacy.html terms.html
```

Key invariants that make it work:
- **One data file, generated pages.** Never hand-edit generated HTML. Add data, run build.
- **`SITE_URL` constant** in build.js drives canonicals, sitemap, OG. Set it once.
- **Asset cache-busting:** build.js hashes css+js and appends `?v=<hash>` to every
  page (generated AND the static index/privacy/terms via markers). This prevents
  the "old JS vs new HTML" breakage that WILL bite you otherwise.
- **Value gating without cloaking:** the exact value is hidden behind an email,
  but it is embedded only in `data-*` attributes for JS reveal, and is kept OUT
  of the title/meta/JSON-LD. Showing a number to Google while hiding it from users
  is cloaking and gets penalized. (Alternative: show a public range, gate the
  exact figure + breakdown. Better SEO; weigh it per project.)

## The value model pattern

Two layers, do not conflate them:
1. **Stored value per item** = the number shown after the gate. Where a public
   figure exists, use it and mark `reported: true` with a `source` (sense-check).
   Otherwise model it and mark `reported: false`.
2. **The public calculator formula** (`calculator.js compute()`) = how a visitor
   estimates ANY item from inputs. Calibrate it to be plausible, but expect it to
   diverge from headline figures at the extreme top end. The formula also powers
   the breakdown bars. Define your own inputs/weights for the niche.

## Phase-by-phase playbook

Work top to bottom. Do the building yourself; the user does account/domain/key
steps (clearly flagged with **[USER]**).

### 1. Scaffold
- Copy `templates/*` into a new repo. Rename athlete->your item, team->your group,
  "NIL value"->your value noun. Set `SITE_URL`, brand name/logo, and the calculator
  fields/weights for the niche.
- Replace the homepage hero + the calculator inputs with niche-appropriate ones.
- Keep: build pipeline, gating, importer, guides, sitemap, asset versioning.

### 2. Data
- Define the item schema (see `templates/data.example.json`). Required:
  `name, group, value`; the rest has defaults.
- Seed initial items. Use `scripts/add-items.js` for batches (it validates,
  auto-slugs, computes low/high range, de-dupes by slug, merges, rebuilds).
- Research is niche-specific. For data-heavy niches, fan out parallel research
  subagents that return a strict pipe/JSON format, then import. Always: verify
  status, cite sources, flag estimates, never fabricate.

### 3. Build + run locally
- `node scripts/build.js` regenerates everything. Sanity-check page counts,
  sitemap, and that the value is gated (absent from title/meta/JSON-LD).
- A tiny DOM harness that `require()`s calculator.js with stubbed
  document/fetch/localStorage catches load-time JS throws (e.g., the hoisting
  bug below) that `node --check` cannot.

### 4. Deploy (GitHub Pages) **[USER does the GitHub setup]**
- Repo Settings -> Pages. `deploy.yml` deploys on push to `main`. Keep a
  `.nojekyll` file at root so Pages serves files verbatim (no Jekyll mangling).
- Confirm the green deploy run before assuming it's live.

### 5. Custom domain **[USER buys domain + sets DNS]**
- Buy a short, brandable `.com`. Decline registrar upsells (hosting, SSL,
  premiumDNS); keep free WHOIS privacy + auto-renew. **[USER]** registers under
  the right country (can't change AdSense payment country later).
- Add a `CNAME` file (the domain), set `SITE_URL` to `https://thedomain`, rebuild.
- DNS at registrar: four A records to GitHub Pages (185.199.108-111.153) + a
  `www` CNAME to `<user>.github.io`. Delete the default parking record. Then in
  GitHub Pages set the custom domain and, once the cert provisions, Enforce HTTPS.

### 6. Analytics (GA4) **[USER creates property]**
- build.js has `GA4_ID`. Set it to the `G-XXXXXXXXXX` Measurement ID; rebuild.
  The tag injects into every page (generated + static via the `ANALYTICS` markers).

### 7. Search Console + sitemap **[USER]**
- Add a property (URL-prefix) and verify via the Google Analytics method (instant,
  since the GA tag is live). Submit `sitemap.xml`. Request-index the homepage and
  a few key pages. Indexing != ranking; new domains take weeks.

### 8. Email capture
- Forms post to Formspree (free) out of the box; swap in the real form ID. Each
  submission carries **lead context** (which item, inputs, the estimate, a
  subject line) so emails are qualified leads, not just addresses.
- Later, move to a real ESP (Beehiiv/ConvertKit) to actually send a newsletter
  and land sponsorships. That, not ads, is usually the bigger earner.

### 9. AdSense **[USER applies + provides Publisher ID]**
- Set `ADSENSE_CLIENT` (build.js) + the loader in index.html + `ads.txt` to the
  real `ca-pub-...`. The loader script being present on the site IS the
  verification method. User clicks Verify -> Request review (days to ~2 weeks).
- After approval: **Auto ads** = Google auto-places ads, fully automatic. Manual
  `<ins>` units only fill once you create real ad units and wire their **slot IDs**
  (placeholders won't serve). Run Auto ads alone, or Auto + manual.
- Consent: enable Google's certified CMP in AdSense (required for EEA/UK/CH). Do
  NOT also ship a homemade banner, or those users get two prompts.

### 10. Grow (this is the real work)
- Publish un-gated **guide articles** (rankings, explainers, timely news). They
  rank faster than gated entity pages and funnel traffic to the tool + list. Use
  current, sourced reporting; interlink to entity pages and the calculator.
- Keep expanding the item database (more pages = more long-tail entry points).
- Get a few external links/shares (the single fastest trust signal for a new
  domain). Be patient: 4-12+ weeks for meaningful organic traffic.

## Hard-won gotchas (encode these, they cost real time)

- **Asset cache-busting is mandatory.** Without `?v=<hash>`, browsers run old JS
  against new HTML and the site looks broken intermittently.
- **JS hoisting / load-order:** calling a function that uses a `var x = []`
  before that line executes throws `undefined.push` at load and kills the WHOLE
  script (so the tool looks totally dead while GA still works). Define shared
  state and loaders ABOVE the code that calls them. Verify with a DOM harness.
- **`.nojekyll`** at repo root or GitHub Pages' Jekyll can drop/mangle files
  (e.g. JSON in `assets/data/`).
- **No cloaking:** keep the gated value out of title/meta/JSON-LD.
- **Style/voice:** if the user bans em/en dashes (or any token), enforce it
  everywhere including generated pages, comments, and JSON, then re-scan.
- **AdSense payment country can't be changed later** — get it right at signup.
- **Brand in the homepage `<title>`** so the site ranks for its own name.
- **Date/eligibility realism in data:** for sports/seasonal niches, verify who
  has left/aged out; offer a `former: true` + `nowWith` state instead of deleting.

## What only the user can do (don't get blocked waiting on these)
Buying the domain, setting registrar DNS, creating Google accounts (GA, Search
Console, AdSense), choosing payment country, providing API keys (e.g., a social/
data API if exact numbers are needed). Do everything else and hand them a tight,
copy-paste checklist for these.

**Traffic tip (high leverage, niche-agnostic):** the strongest magnet is a
calculator people **re-check on a schedule**, where the output moves with an
external update (a monthly report, an annual cap or lottery, a season, a rate
change). Recurring demand beats one-and-done lookups, so when the niche allows it,
feature a recurring-check calculator as the centerpiece.

## Templates included
`build.js`, `calculator.js`, `styles.css`, `add-items.js`, `guides-content.js`,
`deploy.yml`, `ads.txt`, `robots.txt`, `data.example.json`. Private IDs are
placeholders (`ca-pub-XXXX`, `G-XXXX`, `pub-PUBLISHER_ID`, `your-form-id`,
`YOURDOMAIN.com`) — fill them in per project.
