# NIL ValueCalc 🏆

A fast, mobile-friendly **one-page NIL (Name, Image &amp; Likeness) value calculator** for college and high-school athletes. Built to be monetized with **Google AdSense** and to **collect emails**, no build step, no framework, hosted free on GitHub Pages.

**Live site:** https://foundersoak.github.io/nil-calculator/ *(after you complete the one-time Pages setup below)*

---

## What it does

- **Two calculator modes:** look up a college athlete in our database, or estimate any player from sport, level, role, market, social following and engagement.
- **Email-gated results:** the value, range and four-pillar breakdown (Influence, Exposure, Performance, Brand) reveal after an email, a one-time unlock per browser.
- **SEO athlete pages:** every tracked athlete gets a page (bio, social following, methodology, FAQ schema). The dollar value is gated; it is deliberately kept out of the title/meta/JSON-LD so we never "cloak."
- **Ranges + comparables:** estimates are shown as ranges; the manual mode also surfaces the closest players in our database.
- Newsletter CTA, share button, AdSense slots, `ads.txt`, consent banner, Privacy & Terms.

## Tech

Plain HTML, CSS and vanilla JS. Pages are **generated** from one data file, no framework.

```
data/athletes.json        ← SINGLE SOURCE OF TRUTH (athletes + teams)
data/incoming.example.json← template for new research runs
scripts/build.js          ← generates all HTML + sitemap + search index
scripts/add-athletes.js   ← validates & merges a research run, then builds
index.html                ← homepage (hero + two-mode calculator)
athlete/<slug>/index.html ← generated athlete pages
athletes/index.html       ← generated directory
assets/data/athletes-index.json ← generated client-side search/similar index
assets/css/styles.css  ·  assets/js/calculator.js
.github/workflows/deploy.yml  ← auto-deploys to GitHub Pages on push to main
```

---

## ➕ Adding athletes (no HTML editing)

You never touch HTML. Every page is generated from `data/athletes.json`. To add players from a new research run:

1. Copy the template: `cp data/incoming.example.json data/incoming.json`
2. Fill in the new players (only `name`, `sport`, `position`, `team`, `valuation` are required, see the
   template comments). Add any **new** schools under `"teams"`.
3. Run **`npm run add`** (or `node scripts/add-athletes.js`).

The importer validates the data, fills defaults, auto-generates each `slug` and the low/high range,
de-dupes by slug (re-importing a slug **updates** that athlete), merges everything into
`data/athletes.json`, **rebuilds the whole site**, and archives your incoming file. Then just
`git diff`, commit and push, the GitHub Action redeploys.

> Prefer editing by hand? You can also add records directly to the `athletes` array in
> `data/athletes.json` and run `npm run build`. Same result.

---

## 🚀 Go live (one-time, ~2 minutes)

1. Merge this branch into `main` (or open a PR and merge).
2. In GitHub: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
3. The included workflow deploys automatically. Your site will be at
   `https://foundersoak.github.io/nil-calculator/`.

---

## 💰 Turn on monetization (AdSense)

> The site ships with **placeholders** so it works immediately. Replace them with your real IDs when ready.

1. **Apply for AdSense** at https://adsense.google.com using this domain. (You need the site live first.)
2. Once you have your **Publisher ID** (looks like `ca-pub-1234567890123456`), find-and-replace every
   `ca-pub-XXXXXXXXXXXXXXXX` in `index.html` with it.
3. In AdSense, create ad units and copy each **ad slot ID**, then replace the `data-ad-slot="0000000000"`
   values in `index.html`.
4. Edit **`ads.txt`**: replace `pub-0000000000000000` with your `pub-...` ID. This file is **required**,
   without it most ad demand won't buy your inventory.
5. In AdSense, enable **Privacy &amp; messaging → GDPR message** so EU/UK visitors get a certified consent
   prompt (works alongside the built-in banner).

## 📧 Turn on email collection

The email forms work out-of-the-box (they show a success state) but don't store anything until you connect a provider:

1. Create a free form at **[Formspree](https://formspree.io)** (or Mailchimp/ConvertKit/Beehiiv).
2. Replace **both** `https://formspree.io/f/your-form-id` actions in `index.html` with your real endpoint.
3. Submissions will then flow to your provider's inbox/list. The athlete's estimated value is included as a
   hidden `nil_estimate` field.

---

## 🔧 Customize

- **Valuation model:** tune the rates and multipliers at the top of `assets/js/calculator.js`
  (`PLATFORM_RATE`, `DIVISION`, and the sport/performance/market values in the `<select>`s).
- **Branding/colors:** edit the CSS variables in `:root` at the top of `assets/css/styles.css`.
- **Custom domain:** add a `CNAME` file with your domain and set it in Settings → Pages.

## 🚀 When (and how) to move to Vercel

You do **not** need Vercel today, this site is pure static files, which GitHub Pages serves for free.
Consider migrating only when the site stops being "just files" and needs a **backend**, for example:

- Store collected emails in **your own database** instead of Formspree/Mailchimp
- Generate the full NIL report as a **server-rendered PDF**
- Add **athlete accounts** so users can save results
- Add a **paid tier** with Stripe checkout
- Rebuild the front end in a framework like **Next.js**

If you reach that point, migrating is quick because the code is plain and portable:

1. Create a free account at [vercel.com](https://vercel.com) and click **"Add New → Project"**.
2. **Import this GitHub repo.** Vercel auto-detects a static site, no build settings needed
   (Framework Preset: *Other*; Output dir: project root).
3. Click **Deploy**. You get a live `*.vercel.app` URL immediately, plus a preview URL on every PR.
4. Add your custom domain in Vercel → **Settings → Domains** (it manages HTTPS for you).
5. Add backend features as serverless functions under an `/api` folder when you need them.

You can keep GitHub Pages and Vercel pointed at the same repo during a transition, then switch your
domain's DNS to Vercel when ready. **Netlify** and **Cloudflare Pages** are equivalent alternatives.

## ⚠️ Disclaimer

Estimates are informational only, not a guarantee of earnings and not financial, legal, tax or eligibility
advice. Not affiliated with the NCAA. See `terms.html`.
