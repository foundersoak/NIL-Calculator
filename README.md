# NIL ValueCalc 🏆

A fast, mobile-friendly **one-page NIL (Name, Image &amp; Likeness) value calculator** for college and high-school athletes. Built to be monetized with **Google AdSense** and to **collect emails** — no build step, no framework, hosted free on GitHub Pages.

**Live site:** https://foundersoak.github.io/nil-calculator/ *(after you complete the one-time Pages setup below)*

---

## What it does

- Instant estimated annual NIL value from sport, division/level, on-field role, market, social following and engagement.
- Animated result with a four-pillar breakdown (Influence, Exposure, Performance, Brand).
- Email capture for a "full report" + a newsletter CTA.
- Share button (native share / copy link) for organic growth.
- AdSense ad slots, `ads.txt`, consent banner, Privacy Policy &amp; Terms — everything needed to get approved and start earning.

## Tech

Plain HTML, CSS and vanilla JS. No dependencies. Just static files.

```
index.html            ← the one-page app
privacy.html          ← required for AdSense
terms.html
ads.txt               ← required for programmatic ad demand
robots.txt, sitemap.xml
assets/css/styles.css
assets/js/calculator.js
.github/workflows/deploy.yml  ← auto-deploys to GitHub Pages
```

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
4. Edit **`ads.txt`**: replace `pub-0000000000000000` with your `pub-...` ID. This file is **required** —
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

You do **not** need Vercel today — this site is pure static files, which GitHub Pages serves for free.
Consider migrating only when the site stops being "just files" and needs a **backend**, for example:

- Store collected emails in **your own database** instead of Formspree/Mailchimp
- Generate the full NIL report as a **server-rendered PDF**
- Add **athlete accounts** so users can save results
- Add a **paid tier** with Stripe checkout
- Rebuild the front end in a framework like **Next.js**

If you reach that point, migrating is quick because the code is plain and portable:

1. Create a free account at [vercel.com](https://vercel.com) and click **"Add New → Project"**.
2. **Import this GitHub repo.** Vercel auto-detects a static site — no build settings needed
   (Framework Preset: *Other*; Output dir: project root).
3. Click **Deploy**. You get a live `*.vercel.app` URL immediately, plus a preview URL on every PR.
4. Add your custom domain in Vercel → **Settings → Domains** (it manages HTTPS for you).
5. Add backend features as serverless functions under an `/api` folder when you need them.

You can keep GitHub Pages and Vercel pointed at the same repo during a transition, then switch your
domain's DNS to Vercel when ready. **Netlify** and **Cloudflare Pages** are equivalent alternatives.

## ⚠️ Disclaimer

Estimates are informational only — not a guarantee of earnings and not financial, legal, tax or eligibility
advice. Not affiliated with the NCAA. See `terms.html`.
