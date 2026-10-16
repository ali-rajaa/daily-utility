# Site Playbook: how CloudGate and Daily Utility Apps were built

This file explains how two live sites were built: **www.cloudgate-app.com** (CloudGate Storage) and **dailyutilityapps.store** (Daily Utility Apps). Use it to build the next site to the same standard. It is written for a Claude session on another account that cannot open either repository, so all the code you need is in the appendices.

Read sections 1 to 3 before you write any code. Section 19 is the build order.

---

## Contents

1. [The two sites at a glance](#1-the-two-sites-at-a-glance)
2. [Standing rules (carry these over)](#2-standing-rules-carry-these-over)
3. [Working process](#3-working-process)
4. [Choosing the stack](#4-choosing-the-stack)
5. [File structure](#5-file-structure)
6. [Configuration](#6-configuration)
7. [Layouts, includes and front matter](#7-layouts-includes-and-front-matter)
8. [Design system](#8-design-system)
9. [UI/UX: components and page patterns](#9-uiux-components-and-page-patterns)
10. [Motion and animation](#10-motion-and-animation)
11. [Accessibility](#11-accessibility)
12. [Performance](#12-performance)
13. [SEO](#13-seo)
14. [Content and writing rules](#14-content-and-writing-rules)
15. [Legal pages (Australia)](#15-legal-pages-australia)
16. [Hosting and deployment](#16-hosting-and-deployment)
17. [QA before every push](#17-qa-before-every-push)
18. [Problems we hit, and the fixes](#18-problems-we-hit-and-the-fixes)
19. [Build order for the new site](#19-build-order-for-the-new-site)
20. [Appendices: full source files](#20-appendices-full-source-files)

---

## 1. The two sites at a glance

| | CloudGate Storage | Daily Utility Apps |
|---|---|---|
| Address | https://www.cloudgate-app.com | https://dailyutilityapps.store |
| What it sells | One cloud storage app (Android, iPhone, web), 100GB to download and use for free, paid plans above that | A portfolio of phone apps, one of them the flagship |
| Generator | Jekyll 3.10 through GitHub Pages' own builder (the `github-pages` gem) | Jekyll 4.4 run by GitHub Actions (plain Jekyll, no `github-pages` gem) |
| Hosting | GitHub Pages, "Deploy from a branch", `CNAME` file in the repo | A shared Apache web host, uploaded over FTP by a GitHub Actions workflow. A noindex preview runs on GitHub Pages |
| Pages | Home, Features, Cloud Tips hub, guides, Privacy, Terms, 404 | Home, About, Contact, one page per app, Daily Info hub, guides, Privacy, Terms, 404 |
| CSS | Plain `.css` files, `?v=` stamp | `.scss` files written as plain CSS, compiled and minified by Jekyll's Sass, `?v=` stamp |
| Fonts | Inter (body), Space Grotesk (numbers), self-hosted | DM Sans (body), Space Grotesk (headings), self-hosted |
| Colour modes | Light and dark, follows the device, with a toggle | Light only (owner's choice) |
| JavaScript | One deferred `site.js`, plus `cloud-tips.js` on the hub | One deferred `site.js` |
| Repo | `imranshafique/cloudgate-app` | `ali-rajaa/daily-utility` |

Both are static sites: no database, no server code (apart from one 4-line PHP file on the FTP host for real 404s), no tracking scripts, no cookie banner.

---

## 2. Standing rules (carry these over)

The owner set these during both builds. They apply to the new site unless the owner says otherwise.

**Truth**

- **Never make anything up.** No invented features, numbers, reviews, awards, team members, addresses, phone numbers, opening hours or reply times. If a fact isn't confirmed, leave it out and list it as an open item for the owner.
- **No star ratings or review scores anywhere.** Not in the page copy, not in a badge, not in `aggregateRating` schema. This holds even if a real average exists later, unless the owner asks.
- **No "automatic" or "automatically" claims** unless the owner confirms the product really does it.
- **Say "free to download", never a bare "free"** for an app. (CloudGate's "100GB free" is a confirmed plan and is fine.)
- **Feature copy stays inside what the store listing or the owner confirms.** Store names and package IDs come from the live listings, not memory.
- **Never state how many products there are** ("three apps", "our other two apps"). Copy and layouts must work unchanged when one is added: every list reads from the data file, and no layout caps the number shown.

**Brand**

- **Never use real app store icons or other companies' logos.** Each app is drawn as a white line icon on a coloured rounded tile (section 8.6). The site's own logo is fine.
- **The registered company name, ACN and address go on the legal pages only.** The rest of the site uses the trading name. (On Daily Utility, "Australia" also appears on the legal pages only.)
- **Each site has its own support email.** Never reuse another site's address.

**Code and access**

- **Never copy `.env` files, API keys, tokens or passwords** into the repo, a commit, a chat message or a log.
- **Tokens and passwords go into GitHub secrets only** (repo → Settings → Secrets and variables → Actions). Tell the owner where to paste them. Never ask them to paste one into the chat.
- **Legal text is the owner's.** If the owner supplies a privacy policy or terms, reproduce it word for word. Don't "improve" it.
- **Ask before anything outward-facing or hard to undo:** uploading to the live server, deleting files on it, changing DNS, deleting a repo or branch.
- **Push to `main` only** (the owner's rule on both sites), unless told otherwise.

---

## 3. Working process

- **Keep a `STATUS.md` in the repo root**, excluded from the build. It's the project's memory: what was decided, why, and what's left. Daily Utility's has numbered sections:
  1. What this site is
  2. Confirmed facts (and where each came from)
  3. Directory tree
  4. Layouts and required front matter
  5. Page sections, then one lettered subsection per piece of work (5a, 5b … 5y), each dated, quoting the owner's request and recording what changed and how it was checked
  6. SEO and routing
  7. Build and deploy rules
  8. Domain cutover
  9. Execution order
  10. Open items: things only the owner can supply, content to build, housekeeping
- **Update STATUS.md in the same commit as the work.** A later session should never have to re-derive a decision.
- **Comment the why in the code.** Every layout and include opens with a Liquid comment explaining its job, its parameters and any decision behind it (see the appendices). Every CSS file opens with a block saying what it covers.
- **Commit messages:** one plain line saying what changed, then a short body if needed.
- **Check everything before pushing** (section 17). One clean push beats three speculative ones.
- **Design skills used on both builds:**
  - `ui-ux-pro-max` (from the GitHub repo `nextlevelbuilder/ui-ux-pro-max-skill`, copied into `.claude/skills/`). It's a searchable database of UX rules, palettes and font pairings. Run it by its real path: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`. Its own docs use `${CLAUDE_PLUGIN_ROOT}`, which isn't set for a skill copied into a repo.
  - `apple-design`: Apple's WWDC motion and interaction guidance translated to CSS. Its rules are summarised in section 10.
  - A plain-writing skill (Strunk's rules plus a list of AI-writing patterns to avoid). Its rules are summarised in section 14.

---

## 4. Choosing the stack

Use **Jekyll with no plugins** (`plugins: []`). Everything a plugin would do (sitemap, canonicals, SEO tags, feed) is written in Liquid, so the site builds the same anywhere.

Pick a deploy path from section 16:

| Where the domain lives | Use |
|---|---|
| GitHub Pages, and you can change the repo's Pages settings | **Jekyll 4.4 through Actions** (Daily Utility's `pages.yml`, Appendix J). Settings → Pages → Source → GitHub Actions |
| GitHub Pages, and you can't change the settings (they stay on "Deploy from a branch") | **CloudGate's way**: the `github-pages` gem builds it (Jekyll 3.10, safe mode). Keep `plugins: []`, use plain `.css` (no Sass features newer than that), and commit a `CNAME` file |
| A normal web host (cPanel, FTP) | **Daily Utility's way**: build in Actions, upload with `ftp.yml` (Appendix K), `.htaccess` for clean URLs (Appendix H), `404.php` for real 404s (Appendix I) |

Why not the `github-pages` gem on Actions: it forces `jekyll-github-metadata`, which broke an earlier site's builds. On Actions, use plain Jekyll 4.4 (Appendix B).

---

## 5. File structure

### 5.1 Daily Utility Apps (the fuller pattern; copy this one)

```
.
├── .github/workflows/
│   ├── pages.yml            # build + checks, deploys the noindex preview to GitHub Pages
│   └── ftp.yml              # manual: look / upload / check the live site on the web host
├── .claude/skills/          # design skills (excluded from the build)
├── .htaccess                # Apache rules: https, no-www, clean URLs, 404, caching
├── 404.html                 # not-found page (noindex)
├── 404.php                  # sends a real 404 status, then 404.html
├── Gemfile / Gemfile.lock   # jekyll ~> 4.4, webrick
├── STATUS.md                # living project record (excluded from the build)
├── _config.yml
├── _data/
│   ├── apps.yml             # one entry per app: name, slug, glyph, tone, store links, tier
│   ├── categories.yml       # guide topics: name, glyph, tone, blurb
│   └── home.yml             # homepage copy blocks
├── _includes/
│   ├── icon-sprite.html     # every icon as an SVG <symbol>, included once per page
│   ├── header.html          # capsule nav: Apps, Guides, Help + "Sign in"
│   ├── footer.html
│   ├── logo.html, brand-mark.html
│   ├── app-tile.html        # white glyph on a coloured tile (never a real app icon)
│   ├── store-badges.html    # App Store / Google Play buttons, drawn in SVG
│   ├── platforms.html       # "iPhone and Android" from which store links exist
│   ├── hero-glow.html       # three drifting blurred colour blobs behind a hero
│   ├── faq-section.html     # visible FAQ (details/summary)
│   ├── faq-schema.html      # the same questions as FAQPage JSON-LD
│   ├── breadcrumb-schema.html
│   ├── post-card.html       # guide card used on the hub, homepage, app pages
│   ├── scripts.html         # <script src=site.js defer>
│   └── home/                # homepage sections: hero, jobs, apps, guides, privacy, schema
├── _layouts/
│   ├── default.html         # <head>, SEO tags, header, <main>, footer
│   ├── app.html             # app landing page, built entirely from front matter
│   ├── post.html            # guide/article
│   ├── legal.html           # privacy/terms with a generated table of contents
│   └── upcoming.html        # placeholder for an app page not yet written
├── assets/
│   ├── css/shell.scss       # tokens, base, buttons, header, footer, shared components
│   ├── css/pages/*.scss     # one per page type: index, app, post, blog-hub, about, contact, legal, not-found
│   ├── fonts/               # dm-sans-latin.woff2, space-grotesk-latin.woff2 (variable)
│   ├── icons/               # favicons, apple-touch-icon, logo mark PNG/WebP
│   ├── js/site.js
│   └── og/*.jpg             # 1200x630 share cards, one per key page
├── daily-info/              # guide hub: index.html + one .md per guide
├── index.html, about.html, contact.html
├── <app-slug>.md            # one per app (layout: app)
├── privacy-policy.md, terms-of-service.md
├── sitemap.xml, robots.txt, feed.xml   # Liquid, each with an empty --- fence
├── app-ads.txt              # ad-network verification line (only if the apps run ads)
└── favicon.ico
```

### 5.2 CloudGate (single-product pattern)

```
.
├── CNAME                    # www.cloudgate-app.com
├── _config.yml
├── _data/links.yml          # every store/web-app/social URL and the support email
├── _includes/  head.html (all SEO tags + schema), header, footer, crumb, faq, schema, store-badges, hero-clouds
├── _layouts/default.html
├── assets/css/  site.css (tokens, light+dark, shared) + one per page: home, features, cloud-tips, guide, legal, notfound
├── assets/fonts/  Inter + Space Grotesk variable woff2, with their OFL licence files
├── assets/img/  logo and mark in WebP at 64/128/480px
├── assets/js/  site.js (shared), cloud-tips.js (hub search/filter)
├── guides/*.html            # 11 guides
├── index.html, features.html, cloud-tips.html, privacy-policy.html, terms-of-service.html, 404.html
├── llms.txt                 # plain-text summary of the product and pages for AI crawlers
├── robots.txt, sitemap.xml  # Liquid
├── og-image.png, favicon.ico, apple-touch-icon.png
└── legal-info-required.md   # intake form sent to the owner for the legal facts (excluded)
```

### 5.3 For the new site

Start from 5.1. Rename `daily-info/` to whatever the guides section is called, and `apps.yml` to whatever the products are. Keep one stylesheet for shared things plus one per page type, and one `site.js`.

---

## 6. Configuration

`_config.yml` (full Daily Utility version in Appendix A). The parts that matter:

```yaml
title: <Site name>
description: <One sentence, used when a page has none>
url: "https://<preview-or-live-domain>"
baseurl: ""
staging: true                 # true = noindex everywhere + robots Disallow. false only on the live build
timezone: Australia/Perth
plugins: []
sass: { style: compressed, sourcemap: never }
strict_front_matter: true     # a front matter typo fails the build
liquid: { error_mode: strict, strict_filters: true }
company:
  legal_name: "<REGISTERED NAME PTY LTD>"     # legal pages only
  support_email: "<the new site's own address>"
exclude: [Gemfile, Gemfile.lock, README.md, STATUS.md, SITE-PLAYBOOK.md, .github, .claude, vendor]
```

- **Every internal link** goes through `{{ '/path' | relative_url }}`. **Every full URL** (canonical, og:url, sitemap, schema) goes through `| absolute_url`. Then moving between preview and live is a change to `url` and `staging` only.
- The FTP workflow writes a second config at build time that sets the live `url` and `staging: false`, so the repo can keep the preview values.

---

## 7. Layouts, includes and front matter

**Every page sets its own `permalink:` without `.html`** (`/about`, `/privacy-policy`, `/daily-info/`). Jekyll still writes `about.html`; the server answers `/about` from it.

**Every page sets its own `css:`** (`css: app`, `css: post`, `css: legal`). Jekyll does not pass a layout's front matter down to its pages. We learned this when `post.css` silently never loaded.

Front matter contracts on Daily Utility (each layout's header comment lists them):

| Layout | Required | Optional |
|---|---|---|
| `default` | `title`, `description`, `permalink` | `css`, `noindex`, `og_image`, `og_image_alt`, `breadcrumbs`, `faqs` |
| `app` | `title`, `description`, `css: app`, `app_name`, `tagline`, `ios_url` and/or `android_url`, `category`, `features` (icon, title, text), `how_it_works` (3 × title, text), `faqs` (q, a) | `moments`, `compare`, `tips`, `guides`, `steps_heading`, `trust_text` |
| `post` | `title`, `description`, `css: post`, `heading`, `category` (from `categories.yml`), `date`, `updated`, `read_min`, `slug` | `image` (a real photo only), `glyph`, `steps`, `takeaways` (2–4 points), `faqs`, `related` |
| `legal` | `title`, `description`, `css: legal`, `heading`, `last_updated`, `sections` (id, label) | `lead`, `effective`, `updated` |

Rules that came out of the build:

- **Lists of things live in `_data/`.** The header menu, footer, homepage grid, contact page and schema all read `apps.yml`, so adding a product is one entry. An entry has `built: true` only once its page exists; nothing links to an unbuilt page.
- **Platforms are derived, never typed.** "iPhone and Android" comes from which store links the entry has.
- **The legal table of contents is generated** from `sections:` in front matter, and every heading carries a kramdown ID (`## Data retention {#retention}`), so the contents can't drift from the headings.
- **A FAQ is written once** in front matter and rendered twice: visibly (`faq-section.html`) and as `FAQPage` schema (`faq-schema.html`). The two always match.

---

## 8. Design system

All of it lives in `shell.scss` as CSS custom properties. Page stylesheets read the tokens and never redefine them. No raw hex values in components.

### 8.1 Colour tokens (Daily Utility)

```css
--bg: #ffffff;        --bg-alt: #f4f7fb;     --surface: #ffffff;
--text: #0c1424;      --text-2: #4b5565;
--border: #e2e8f0;    --border-strong: #cbd5e1;
--brand: #0b5fe8;     --brand-hover: #0848b8;  --on-brand: #ffffff;
--brand-soft: #e8f0ff; --brand-text: #0a52c9;   /* brand colour safe for text */
--brand-2: #16b871;   /* sampled from the logo; decoration only, 2.6:1 on white */
--brand-2-text: #0a7a47;
--brand-gradient: linear-gradient(135deg, var(--brand) 0%, #0f9ed6 45%, var(--brand-2) 100%);
```

- **Brand colours are sampled from the real logo**, not picked from a palette.
- **Every text/background pair is measured for WCAG AA 4.5:1** before use, and the CSS comment records the result. Where a brand colour fails as text, add a darker `-text` sibling (`--brand-text`, `--brand-2-text`). Never put text on the gradient past the point where it drops below 4.5:1; buttons stay solid `--brand`.

### 8.2 Tones (per-product colour identity)

Each product has a tone class that swaps the brand tokens, so one component takes the right colours anywhere it appears:

```css
.tone-violet {
  --brand: #7c3aed; --brand-hover: #6d28d9; --on-brand: #ffffff;
  --brand-soft: #f3edff; --brand-text: #6d28d9;
  --tone-light: #a855f7; --tone-deep: #7c3aed;
  --tone-gradient: linear-gradient(145deg, #a855f7, #7c3aed);
  --glow-b: #c084fc; --glow-c: #d8b4fe;
}
```

Daily Utility has blue, violet, teal and rose. An app page puts `tone-<x>` on `<main>`, so its buttons, links, glow and tiles all change together. White glyphs on every tone gradient stop are at least 3:1 (measured).

### 8.3 Typography

- **Two families, self-hosted as variable woff2, Latin subset, `font-display: swap`, both preloaded.** One file per family covers every weight. No Google Fonts request.
  - Daily Utility: Space Grotesk 500–700 for headings, DM Sans 400–700 for body and UI (the "tech startup" pairing from `ui-ux-pro-max`).
  - CloudGate: Inter for everything, Space Grotesk for numbers.
- **Fallback is `system-ui`**, not a generic sans.
- Body 16px minimum (1rem), line height 1.5–1.65. Nothing under 12px.
- Headings use `clamp()` sizes, tight line height (1.05–1.2) and negative tracking (-0.01em to -0.03em). Body tracking stays at 0.
- `text-wrap: balance` on headings, `text-wrap: pretty` on lead paragraphs.
- Spacing in `rem`, so the layout grows with the user's text size.

### 8.4 Spacing, shape, depth

```css
--wrap: 70rem;                         /* max content width */
--gutter: clamp(1rem, 4vw, 2rem);      /* never under 16px on phones */
--header-h: 4rem;
--space-section: clamp(4rem, 9vw, 7rem);
--space-hero-top: clamp(3rem, 7vw, 5.5rem);    /* one hero rhythm for every page type */
--space-hero-bottom: clamp(3.5rem, 8vw, 6rem);
--radius-sm: 8px; --radius: 14px; --radius-lg: 22px; --radius-pill: 999px;
--shadow-sm: 0 1px 2px rgba(12,20,36,.06), 0 1px 3px rgba(12,20,36,.08);
--shadow-md: 0 4px 12px rgba(12,20,36,.08), 0 12px 32px rgba(12,20,36,.08);
--shadow-lg: 0 12px 24px rgba(12,20,36,.1), 0 32px 64px rgba(12,20,36,.12);
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
```

Breakpoints used everywhere (Daily Utility): **480** (buttons go full width below), **600** (tables become cards, app pages compact below), **760** (phone menu below, capsule nav above), **900** (two-column layouts above). Write them as `max-width: 599.98px` / `min-width: 600px` so they never overlap.

### 8.5 Icons

- **One SVG sprite** (`icon-sprite.html`), included once after `<body>`, used as `<svg><use href="#i-cloud"/></svg>`. One request, cached.
- **One drawing spec for every icon:** 24×24 grid, drawn inside a 2-unit margin, 1.75 stroke, round caps and joins, no fills. They all sit together at any size.
- Decorative icons get `aria-hidden="true"`. Icon-only buttons get an `aria-label`.
- The sprite is hidden with zero size and `overflow: hidden`, not `display: none` (some browsers won't let `<use>` reference a `display: none` symbol).
- No emoji as icons.

### 8.6 App tiles (instead of real logos)

`app-tile.html`: a rounded square (radius 23%) filled with the app's `--tone-gradient`, a white sprite glyph at about 54% size, an inset top highlight and a soft shadow. Each app's `glyph` and `tone` live in `apps.yml`.

### 8.7 Light and dark

- **Daily Utility is light only.** `color-scheme: light` in `:root`, `<meta name="color-scheme" content="light">`, `<meta name="theme-color" content="#ffffff">`. Form controls and scrollbars stay light on dark-mode devices.
- **CloudGate does both.** Light tokens in `:root`; dark tokens under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and again under `:root[data-theme="dark"]`. A tiny inline script in `<head>` reads `localStorage['cg-theme']` and sets `data-theme` before the stylesheet paints, so the page never flashes the wrong theme. Two `theme-color` metas, one per scheme. The toggle uses the View Transitions API: the new theme grows as a circle from the button that was pressed (600ms, spring easing). With reduced motion it's a plain cross-fade.
- Ask the owner which they want. If both, every token pair is contrast-checked in both themes.

---

## 9. UI/UX: components and page patterns

### 9.1 Header

- **Sticky, translucent capsule.** `backdrop-filter: saturate(180%) blur(20px)` on a mostly opaque background. It firms up (more opaque, a hairline shadow) once content scrolls under it, using an `IntersectionObserver` on a 1px sentinel at the top of the page (no scroll listener).
- **Few items, named for what's behind them.** Daily Utility: **Apps** (flyout listing every app, flagship featured), **Guides** (a plain link to the hub), **Help** (flyout: Contact support, Privacy, Terms). **Sign in** sits outside the capsule as a small outlined button, because it leaves the site.
- **Desktop (760px+):** flyouts open on hover after a 140ms intent delay, or on click, with a dim scrim behind. Hovering a plain link closes any open menu.
- **Phones:** a menu button opens a sheet. Apps and Help fold open inside it; Sign in is a full-width button at the foot.
- Menus are disclosure buttons (`aria-expanded`, `aria-controls`). Escape closes and returns focus. Clicking outside closes. Focus leaving the header closes. Crossing the breakpoint closes everything.
- Without JavaScript the menus still open on hover and focus. `<html class="js">` is set by an inline script before CSS loads, so the phone menu is hidden from the first frame instead of flashing open.

### 9.2 Hero

- Breadcrumbs (except the homepage), H1, a lead paragraph (max ~34rem), the main action.
- **Hero glow** behind it: three large blurred radial-gradient blobs in the brand colours, drifting slowly (section 10). Plus a static, edge-faded dot grid texture.
- The hero is **never** a scroll-reveal element: hiding it delays Largest Contentful Paint.

### 9.3 Homepage (Daily Utility)

1. **Hero with an orbit**: the flagship tile at the centre, every other app on a ring around it, each floating slowly. The include works out each tile's angle from how many apps there are (one above, two as a V, three or more spread evenly) and CSS places it with `cos()`/`sin()`; tiles shrink as the ring fills. Items are placed with the `translate` property, leaving `transform` free for the float. On phones it becomes a row of tiles (`auto-fit` columns) that wraps when full.
2. **Jobs**: cards named for the job in the user's words ("Back up my photos, videos and contacts"), each linking to the app that does it. On phones they sit in a sideways shelf with scroll snap; tabbing to a half-hidden card snaps it into view. Card rows use CSS subgrid so titles, text and links line up across cards.
3. **Apps grid**: every app with its tile, tagline, feature chips and store badges.
4. **Guides**: the newest guides as cards.
5. **Privacy**: a short plain statement with a link to the policy.
6. **FAQ**, then a closing CTA band.

CloudGate's homepage follows the same rhythm for one product: hero with the store buttons, what it does, plan overview, guides, FAQ, closing band ("Start with 100GB, free.").

### 9.4 Product page (Daily Utility `app.html`)

Built entirely from front matter; the page body is empty.

Hero (tile, name, tagline, platforms, store badges with `id="download"`) → moments (situations the app helps with) → how it works (3 steps) → features (bento grid) → optional compare (without / with) → tips → related guides → FAQ → closing CTA → other apps.

**On phones only** (below 600px) the page is compacted: moments, steps, features and tips become rows with the icon beside the text; the bento becomes one divided panel; guide teasers drop their descriptions. Nothing from the app's copy is hidden, and desktop is pixel-identical. This took the pages from about 10,000px to about 8,000–9,000px tall on a phone.

CloudGate's features page does the same thing differently: on phones, long feature descriptions fold behind a "Read more" button.

### 9.5 Guides hub and guide pages

- **Hub:** hero with the newest guide as a large featured card; small stat pills; "Browse by topic" grid from `categories.yml` (glyph, tone, blurb, live count or "Guides coming soon"); per-topic lists only once a topic has more than one guide.
- **CloudGate's hub** adds a search box and category filter that update the URL (`?q=`, so a filtered view can be shared), a "show more" button, and a grid/list toggle. Without JavaScript the search form still submits.
- **Guide cards:** a topic-coloured banner with the topic glyph in a white disc. Never an app icon as a guide image.
- **Guide page:** breadcrumbs, title, date and updated date, reading time, optional takeaways, a contents list built from the H2s (folded on phones, highlights the section being read), the article with each section as its own card, an optional FAQ, related guides ("Keep reading"), and a share button (native share sheet on phones, copy link elsewhere). CloudGate adds a reading-progress bar.
- **Tables** in articles: on phones each row becomes a card with the column name beside each value (`site.js` writes `data-label` from the `<thead>`); above that they scroll sideways in a labelled, focusable box.

### 9.6 Contact page

The support email on a raised card, with "Write an email" (mailto) and "Copy address" (shown only where the clipboard API works; a `role="status"` line announces the copy). One mailto link per product, with the product name already in the subject. "What to put in your email" as numbered steps. "Please don't include your password." Links to the FAQ, the guides and the privacy rights section.

**No phone number, street address, hours or reply-time promise** unless the owner confirms them. Schema: `ContactPage` + `BreadcrumbList`.

### 9.7 Legal pages

Hero with H1, a one-line lead, and "Effective and last updated 8 September 2026" (or the two dates separately when they differ). Below that a two-column layout: a sticky "On this page" contents list generated from front matter, and the prose in a readable measure (about 70 characters). The company details sit in a bordered contact card at the end. Content rules are in section 15.

### 9.8 404

Its own friendly page: a short message, "Go to the homepage" and "Read Daily Info" buttons, and links to each product. `noindex`, no canonical, left out of the sitemap. It must return a real **404 status** (Appendix I for Apache hosts). CloudGate's 404 shows the address that failed and pre-fills the guide search with words from it.

### 9.9 Footer

Logo and one-line description, product links (from `apps.yml`), guides, help links, legal links, "© {year} <trading name>". No "powered by", no parent company, no social links unless they belong to this brand.

### 9.10 Buttons and badges

- `.btn--primary` (solid brand, white text), `.btn--ghost` (outlined), at least 44px tall, icon after the label for "go" actions.
- **Store badges are drawn in SVG**, not downloaded images, so they stay sharp and match the type. Each has an accessible name ("Download on the App Store").
- CloudGate's main button picks the right first step for the device: on iPhone it goes to the App Store, on Android to Google Play, elsewhere to the web app (and without JavaScript, the web app).

### 9.11 Section scaffold

Every section is `<section class="section" aria-labelledby="…-title"><div class="wrap">…`. A `.section-head` holds the H2 and a `.section-sub`. Alternate sections use `.section--alt` (the `--bg-alt` background). On wide screens, many sections put the heading beside the content (`contact-split`, `faq-split`) instead of always centring a kicker, an H2 and a paragraph; that repeated centred pattern made pages look generic.

---

## 10. Motion and animation

Principles (from Apple's *Designing Fluid Interfaces*, applied to CSS):

1. **Animate only `transform` and `opacity`.** Never width, height, top or left (except CloudGate's FAQ height, which is driven frame by frame by a spring).
2. **Respond on press, not release.** Buttons, badges and nav links: `:active { transform: scale(0.97); }` with a 100ms transition. A no-op `touchstart` listener makes `:active` work on iOS Safari.
3. **Hover effects only where hover exists:** wrap them in `@media (hover: hover)`.
4. **Exits are faster than entrances.**
5. **Things leave the way they came,** and menus grow from the control that opened them.
6. **Interruptible.** Anything the user can reverse mid-flight (an accordion, a menu) must turn around smoothly from where it is.
7. **Ambient motion is slow.** Background drift loops are 18 seconds or longer and barely move, so they never pull the eye or cause motion sickness.

What's on the sites:

| Motion | How |
|---|---|
| **Scroll reveal** | `.reveal` elements fade up 1rem over 0.6s with `--ease-out` when 10% enters the viewport (`IntersectionObserver`, `rootMargin: 0px 0px -8% 0px`), then stop being observed. Content is only hidden once the observer exists (`.reveal-ready` on `<html>`), so if the script fails, nothing stays invisible. Never on the first screen. CloudGate staggers siblings in a card row so the row lands as one movement |
| **Hero glow** | Three blobs, `@keyframes` drifting by 4–8% and scaling 0.94–1.08 over 19s, 23s and 27s, ease-in-out, infinite. Different lengths so the pattern never visibly repeats |
| **Orbit tiles** | Each tile floats a few pixels on a slow loop with a different delay |
| **Header** | Background and shadow transition when the page scrolls under it |
| **Menus** | Flyouts and the phone sheet fade and slide a few pixels; the chevron rotates |
| **Card hover** | Border tints towards the brand, shadow deepens, arrow nudges 3px right |
| **CloudGate FAQ** | A JavaScript critically damped spring (damping 1.0, response 0.36s open, 0.28s close) that always starts from the current height and velocity, so tapping again mid-flight reverses smoothly |
| **CloudGate easing** | A `--spring` custom property using CSS `linear()` to approximate a critically damped spring (settles in 405ms), with `cubic-bezier(.22,1,.36,1)` as the fallback |
| **CloudGate theme switch** | View Transitions circle reveal from the pressed button (section 8.7) |

**User preferences, always:**

- `prefers-reduced-motion: reduce`: no movement. Reveals become a 0.3s opacity fade; the glow and floats stop; press scaling is off; menus appear without sliding.
- `prefers-reduced-transparency: reduce` and `prefers-contrast: more`: the header becomes solid with a visible border; the glow is toned down; card borders use `--border-strong`.
- `@supports not (backdrop-filter: blur(1px))`: solid header background.

The reveal CSS and JS are in Appendix E and F.

---

## 11. Accessibility

- Skip link ("Skip to content") as the first focusable element, targeting `<main id="main" tabindex="-1">`.
- Visible focus rings on everything. Never `outline: none` without a replacement.
- **Tap targets at least 44×44px.** For a text link that must look small (the contact email), grow its padding and give the space back with a negative margin, so the layout doesn't move.
- Contrast 4.5:1 for text, 3:1 for large text and icons, measured.
- One H1 per page; headings in order; every section labelled by its heading.
- `lang="en-AU"` on `<html>`.
- Menus: disclosure buttons, Escape to close, focus returned to the trigger.
- `scroll-padding-top` set to the header height, so anchor links land below the sticky header.
- `aria-current="page"` on the current breadcrumb and nav item.
- Copy and share buttons announce their result through a `role="status"` region.
- Tested with axe-core on every page at 1440px and 390px (section 17).

---

## 12. Performance

- **Static HTML, one shared CSS file plus one per page type, one deferred JS file.** No frameworks, no jQuery, no third-party scripts.
- **CSS and JS carry a `?v=<build time>` stamp** (`{{ site.time | date: '%s' }}`), so the server can cache them for a year and a deploy still loads the new copy.
- **Sass `style: compressed`** strips comments and whitespace from the served CSS; the source keeps them.
- **Fonts:** two variable woff2 files, Latin subset, preloaded, `font-display: swap`.
- **Images:** WebP for photos and logo renders at the sizes used (64, 128, 480px); explicit `width`/`height` on every `<img>` so nothing shifts; `loading="lazy"` below the fold.
- **Share cards** as JPEG at quality 85 (about 60KB instead of 270KB as PNG; some apps reject previews over about 300KB).
- **No layout shift:** reserve space for anything that loads late; the reveal never applies to the first screen. Measure Cumulative Layout Shift on key pages (section 17).
- **Server (Apache):** gzip via `mod_deflate`; `Expires` one year for CSS/JS/fonts, 0 seconds for HTML, one hour for XML; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 13. SEO

### 13.1 URLs and canonicals

- **One address per page:** https, no www (Daily Utility) or www (CloudGate; pick one and redirect the other), no `.html`, no trailing slash except folder pages (`/daily-info/`).
- **The canonical is generated from the page's own URL** in the layout, never typed by hand: `{{ page.url | replace: "/index.html", "/" | replace: ".html", "" | absolute_url }}`. A renamed page can't ship with a stale canonical.
- The 404 page has no canonical.
- On Apache, typed `.html` addresses 301 to the clean address, folders without a slash 301 to the slash, and `/x` is answered from `x.html` (Appendix H).

### 13.2 Meta tags (every page, from `default.html`, Appendix C)

`<title>` and `<meta name="description">` from front matter; canonical; robots (`noindex, nofollow` when `site.staging` or `page.noindex`, otherwise `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`); Open Graph (`og:site_name`, `og:locale en_AU`, `og:type` article or website, title, description, url, image with width, height, alt and type; `article:published_time`, `article:modified_time`, `article:section` on guides); Twitter `summary_large_image` with the same title, description, image and alt; favicons (16, 32, 48 PNG + ICO), `apple-touch-icon`, feed link.

**Titles:** "<What the page is>: <benefit or detail> | <Brand>" or similar, under about 60 characters where possible. **Descriptions:** one or two plain sentences, about 150 characters, saying what the page gives the reader.

### 13.3 Share images

One 1200×630 card per key page (home, each product, the hub, each guide), set with `og_image` / `og_image_alt`; a site-wide default otherwise. Daily Utility rendered them with Playwright from the local build (real fonts, real logo, real tile glyphs): open the page at 1200×630, overlay the card HTML, screenshot, save as JPEG quality 85.

### 13.4 Structured data (JSON-LD)

| Where | Types |
|---|---|
| Homepage only | `Organization` with `@id` `<home>#organization`, `name`, `url`, `logo`, `email`, `contactPoint` (customer support, email, contact page URL); `WebSite` with `publisher` pointing at the organisation `@id`; `ItemList` of products |
| Product page | `SoftwareApplication`: name, `applicationCategory: UtilitiesApplication`, `operatingSystem` (derived from store links), `offers` with `price: 0` and `priceCurrency` (Google requires a currency even for free apps), `publisher` → organisation `@id`. **No `aggregateRating`**, no `image` of a real app icon. Plus `BreadcrumbList` and `FAQPage` |
| Guide | `BlogPosting` (Daily Utility) or `Article` (CloudGate): headline, description, datePublished, dateModified, author and publisher → organisation `@id`, image. Plus `BreadcrumbList`, and `FAQPage` if it has FAQs |
| Legal, Contact, About | `BreadcrumbList`; Contact adds `ContactPage` |

Everything else points at the one `Organization` by `@id` instead of repeating it. The legal name, ACN and address are **not** in schema (they're on the legal pages only). JSON values always go through `| jsonify`.

### 13.5 sitemap.xml, robots.txt, feed, llms.txt

- **`sitemap.xml`** (Appendix D) is Liquid with an empty `---` fence. It lists every `.html`/`.md` page except the 404 and `noindex` pages, at its clean URL. `lastmod` is only ever a real date (the page's `updated`, else `last_updated`, else `date`); a page with no date gets no `lastmod`. **Never use the build time**: Google ignores `lastmod` on sites where it's always "now". The hub takes its newest guide's date.
- **`robots.txt`** (Appendix D): in staging, `Disallow: /`; live, `Allow: /` plus the sitemap URL.
- **`feed.xml`**: an Atom feed of the guides, linked from `<head>`.
- **`llms.txt`** (CloudGate): a plain Markdown summary of the product, plans, publisher and every page with a one-line description, for AI crawlers.
- **`app-ads.txt`** (Daily Utility): the ad network's verification line, only because the apps run ads.

### 13.6 Content SEO

- **Target long-tail questions people actually type** ("backup photos to cloud iphone", "restore photos to new android phone", "free up phone storage"). Each guide answers one, with the phrase in the title, H1, description, first paragraph and URL slug.
- Guides link to the product that does the job; product pages link to their related guides; the hub links to all. Link text says where it goes (never "learn more" alone).
- Each guide has a real FAQ where it helps, written as the questions people ask.
- **Preview builds are noindex** until launch.
- **After launch:** add the domain to Google Search Console and submit `/sitemap.xml`; point the app store listings' privacy, support and marketing URLs at the new site.

---

## 14. Content and writing rules

**Plain English.** Short sentences, active voice, concrete words. Say what the thing does.

**Cut these** (they make copy read as machine-written): pivotal, crucial, vital, testament, seamless, robust, cutting-edge, groundbreaking, effortless, leverage, delve, foster, realm, tapestry, multifaceted, "unlock", "elevate", "empower", "in today's digital world", "whether you're X or Y", empty "-ing" tails ("…, ensuring peace of mind"), rule-of-three lists for rhythm, emoji, bold on every other phrase.

**Never claim what isn't confirmed:** no "automatic", "secure", "fast", "one tap", "unlimited", "#1", "trusted by millions", testimonials, ratings, download counts or awards. "Free to download", not "free". "Based in Western Australia" is a fact; "made in Australia" was never confirmed, so it was never used.

**Australian English** for spelling (organise, colour) and dates ("8 September 2026").

**FAQs and tips give general, true advice.** They must not imply a feature the product isn't known to have.

---

## 15. Legal pages (Australia)

Both companies are Australian, so both sites follow Australian law. **The new site uses its own support email**: never `support@cloudgate-app.com` or `console@dailyutilityapps.store`.

### 15.1 Legal details on record

| | CloudGate Storage | Daily Utility Apps |
|---|---|---|
| Legal entity | **CloudGate Technologies Pty Limited** | **DAILY UTILITY APPS PTY LTD** |
| ACN | **673 209 553** | Not published on the site (the owner's documents don't include one) |
| Address | **10 Seddon Way, Canning Vale WA 6155, Australia** | Not published on the site |
| Privacy Officer | **Raja Imran Shafique** | Not named |
| Support / privacy email | support@cloudgate-app.com | console@dailyutilityapps.store |
| Governing law | **Western Australia, Australia**; non-exclusive jurisdiction of WA courts | Not stated in the owner's documents |
| Where the name appears | Intro and contact sections of both documents | "Daily Utility Apps, including where applicable DAILY UTILITY APPS PTY LTD" in the opening of both documents |
| Documents dated | Last updated 28 September 2026 | Effective and last updated 8 September 2026 |

**For the new site, get the entity name, ACN (or ABN), address and privacy contact from the owner.** If the new site is published by one of the companies above, use its details exactly as shown; otherwise don't reuse them.

### 15.2 What the Australian legal pages contain (CloudGate's structure)

**Privacy Policy**, in this order:

1. **Who we are**: legal name and ACN; "We are based at <address>, Australia, and we handle personal information in accordance with the *Privacy Act 1988* (Cth) and the Australian Privacy Principles ("APPs")." If GDPR or US state privacy laws may apply, say the extra rights are described in the policy.
2. Information we collect (account, content, device, payment through the stores)
3. How we use your information
4. App Tracking Transparency on Apple devices (if the iOS app uses advertising or attribution identifiers)
5. Your files and your rights over them (for a storage product)
6. **Where your data is stored**: the hosting provider and region. If data leaves Australia, say so (APP 8 covers cross-border disclosure).
7. When we disclose information
8. Retention and deletion (real periods that match what the system does)
9. **Your privacy rights**: access, correction, deletion, portability, objection (GDPR), withdraw consent, opt out of marketing; how to ask (the site's email); identity checks. **Complaints:** "If you believe we have breached the Australian Privacy Principles, please contact us first so we can investigate. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner at oaic.gov.au."
10. Cookies and analytics (name the provider, e.g. Firebase, or say none is used)
11. Children (minimum age: CloudGate uses 16, matched to what the app enforces)
12. Changes to this policy
13. **How to contact us**: legal name (ACN), privacy email, postal address, Privacy Officer.

**Terms of Service**, in this order:

1. Agreement to these terms (legal name and ACN as the contracting party)
2. Eligibility and your account
3. The service, plans and storage limits
4. Billing, renewals and cancellation (currency, whether prices include GST, store billing)
5. Your content
6. Acceptable use
7. Copyright and takedown requests
8. Service availability and backups
9. Suspension and termination
10. Disclaimer of warranties ("subject to the Australian Consumer Law section below")
11. **Australian Consumer Law**: "Nothing in these Terms excludes, restricts or modifies any guarantee, right or remedy you may have under the *Competition and Consumer Act 2010* (Cth), including the Australian Consumer Law, or any other law that cannot lawfully be excluded or limited. Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. Where we are entitled to do so, our liability for breach of a non-excludable guarantee is limited, at our option, to resupplying the services or paying the cost of having the services resupplied."
12. Limitation of liability (subject to the ACL section)
13. Indemnity
14. Changes to these terms
15. **Governing law and disputes**: "These Terms are governed by the laws of Western Australia, Australia… You and we submit to the non-exclusive jurisdiction of the courts of Western Australia…" Before starting proceedings, contact us and try to resolve it informally; after 30 days either party may start proceedings; urgent injunctive relief is not prevented.
16. General: entire agreement, severability, no waiver, assignment, force majeure, contact (legal name, ACN, email, address).

Daily Utility's documents are the owner's own and follow a different structure suited to several apps: device and usage information; photo, video, audio and media permissions; contacts permission; Android file and storage access; cloud storage and backup; advertising and tracking; analytics; third-party providers; Google Play and Apple services; retention; account and data deletion; privacy choices; security; children; changes; contact. Its terms cover services, accounts, user content, device permissions, acceptable use, subscriptions and purchases, advertising and third parties, deletion, intellectual property, availability, liability, Apple and Google, privacy, changes and contact.

### 15.3 Legal intake for the new site

Before writing the legal pages, send the owner this list (adapted from CloudGate's `legal-info-required.md`). Don't fill any of it in yourself. Show unanswered fields highlighted on the preview so nothing ships by accident.

| # | Field | Notes |
|---|---|---|
| 1 | Full registered entity name | e.g. "<Name> Pty Ltd" |
| 2 | ACN and/or ABN | |
| 3 | Registered or postal address | Needed for privacy complaints |
| 4 | Privacy contact | A named person or a role ("Privacy Officer") |
| 5 | **Support / privacy email** | The new site's own address |
| 6 | Governing state | Usually where the company is registered (both existing sites: Western Australia) |
| 7 | Effective date | Usually the publish date |
| 8 | Hosting provider and data region | Must disclose if data leaves Australia |
| 9 | Encryption at rest | Say nothing unless it's confirmed. A false claim is misleading conduct |
| 10 | Overseas transfer mechanism | Only if data leaves Australia or there are EU users |
| 11 | Payment processor | App Store, Google Play, Stripe… |
| 12 | Retention periods | Deleted files, closed accounts, inactive accounts |
| 13 | Dispute resolution period | CloudGate: 30 days |
| 14 | Currency and GST | Whether shown prices include GST |
| 15 | Liability cap | A commercial decision for the owner (and a lawyer) |
| 16 | Minimum age | Must match what the product enforces |
| 17 | Analytics / crash reporting provider | Or "none" |
| 18 | Advertising / tracking SDKs | Needed for the ATT and advertising sections |

Both legal drafts were flagged to the owner as **not reviewed by a lawyer**; recommend an Australian solicitor reviews them before launch. If the owner supplies finished documents (as Daily Utility's owner did as PDFs), reproduce them exactly, check every heading and paragraph against the source with a script, and change nothing.

### 15.4 Legal page rules on the site

- `company.legal_name` and `company.support_email` in `_config.yml`; the pages use `{{ site.company.legal_name }}` and `{{ site.company.support_email }}`.
- The legal name, ACN and address appear on the legal pages only (not the footer, schema or meta descriptions). Check it on the built site: strip the two legal pages, search every other page for the entity name, "Pty", "ACN" and the street address. Expect zero matches.
- Show the effective and last-updated dates at the top. The sitemap uses `last_updated`.
- Every heading has an ID, so the contact page and app pages can link straight to a section (`/privacy-policy#your-rights`).

---

## 16. Hosting and deployment

### 16.1 GitHub Pages through Actions (Daily Utility's preview)

1. Settings → General → Default branch → `main`.
2. Settings → Pages → Source → **GitHub Actions**. **Don't click "Configure"** on the starter workflow: it commits a `jekyll.yml` that pins an old Ruby, fails, and races your own workflow.
3. Commit `pages.yml` (Appendix J). It builds with Jekyll 4.4, fails if `_site/index.html` is missing or any built file still contains `{{` or `{%`, then deploys. Pull requests are built and checked but not deployed.
4. Custom domain: Settings → Pages → Custom domain. Actions deployments **ignore a `CNAME` file**. DNS: a `CNAME` record to `<user>.github.io`, **DNS only** (grey cloud) if on Cloudflare, so GitHub can issue the certificate. Tick Enforce HTTPS once it's ready.
5. Action versions used: `actions/checkout@v7`, `ruby/setup-ruby@v1` (Ruby 3.3), `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`. Lint workflows with `actionlint`.

### 16.2 GitHub Pages from a branch (CloudGate)

Used because the live repo's Pages settings couldn't be changed. GitHub builds with the `github-pages` gem (Jekyll 3.10, safe mode). Keep `plugins: []`, plain CSS, and a `CNAME` file containing the domain (`www.cloudgate-app.com`). GitHub redirects the bare domain to www, so `url` in `_config.yml` includes www.

When the site was built in a copy repo and the live repo belonged to someone else, a `mirror.yml` workflow pushed `main` to the live repo using a `MIRROR_TOKEN` secret. It refused to push if the two `CNAME` files differed (so the live domain could never change) and kept the live repo's old `main` as a backup branch on first run. Once the files were in the live repo, the copy was deleted and edits now go straight to the live repo.

### 16.3 A normal web host over FTP (Daily Utility live)

`ftp.yml` (Appendix K) is run by hand from the Actions tab with one of three modes:

- **look**: logs in, finds the website folder, lists what's there. Changes nothing. Run this first on a new host.
- **upload**: builds with the live address (`url` = the real domain, `staging: false`), checks the build (key files present, no unrendered Liquid, sitemap uses the live address, no `noindex`), checks https works, backs up the current site to `.site-backups/` on the server (first upload only), mirrors `_site` up with `lftp mirror --reverse`, then **deletes only files that the previous upload put there** (listed in `.site-manifest.txt`) or that are named in `RETIRED_PATHS`. Anything else on the server (the host's own files, other apps) is left alone and reported. Then runs the live checks.
- **check**: requests the live pages and fails if any answer is wrong: home, about, privacy (must contain the legal name), terms, a guide, `app-ads.txt`, a missing file (404), `.htaccess` hidden, robots, the 404 page, `.html` → clean redirect, folder slash redirect, retired pages gone, http → https.

**Secrets** (repo → Settings → Secrets and variables → Actions): `FTP_USERNAME`, `FTP_PASSWORD`. The owner pastes them there. The password is passed to `lftp` through an environment variable (`--env-password`), never on the command line. Host, folder and TLS mode are workflow variables with defaults (`FTP_TLS` "loose" for shared hosts with mismatched certificates).

**`.htaccess`** (Appendix H) handles https and no-www redirects, folder slashes, `.html` → clean redirects (using `THE_REQUEST` so the internal rewrite never loops), serving `/x` from `x.html`, sending anything missing to `404.php`, hiding `.ht*` and the manifest, caching, gzip and two security headers.

**`404.php`** (Appendix I): the host's server-wide error page overrode `ErrorDocument` in `.htaccess` and showed Apache's default page, so the last rewrite rule sends missing addresses to this file, which sets status 404 and prints `404.html`.

Before the first live upload, everything was tested locally against Apache + PHP-FPM and a local FTP server (pyftpdlib).

---

## 17. QA before every push

Run the site locally (`bundle exec jekyll build`, then serve `_site` on port 4000) and check:

| Check | Tool | Pass when |
|---|---|---|
| Build | `bundle exec jekyll build` | No errors (strict Liquid and front matter) |
| HTML validity | `npx html-validate _site/**/*.html` | No errors |
| Unrendered Liquid | `grep -rlE '\{\{|\{%' _site` | No matches |
| Accessibility | axe-core via Playwright, every page, 1440px and 390px (and both themes if there are two) | Zero violations |
| Layout | Playwright at 15 widths from 320 to 1920px: horizontal overflow, overlapping elements, clipped text | None |
| Phones | 320, 360, 375, 390, 414, 430px: tap targets ≥ 44px, text ≥ 16px from the screen edge, no text under 12px | None |
| Header nav | Scripted: open/close each menu by click, hover, keyboard, Escape; phone sheet | All pass |
| Layout shift | Playwright `PerformanceObserver` for `layout-shift` | CLS ≈ 0 |
| Visual regressions | Screenshots before and after, pixel diff (PIL) at 600, 768, 1024, 1440px | Only intended changes |
| SEO | Script: every page has one H1, title, description, canonical = its own clean URL, OG image exists; sitemap lists exactly the indexable pages | All pass |
| Copy rules | Search the built site for banned words, "automatic", star ratings, the legal name outside legal pages, other sites' names | Zero matches |
| Links | Every internal `href` resolves to a built file | None broken |
| Workflows | `actionlint`, `shellcheck` | Clean |

Reveal animations hide content in screenshots; tests force `.reveal { opacity: 1 !important; transform: none !important }` first. Playwright here used the pre-installed Chromium and `NODE_PATH` pointing at the global Playwright module.

After a live upload, run `ftp.yml` in **check** mode.

---

## 18. Problems we hit, and the fixes

| Problem | Fix |
|---|---|
| A page type's stylesheet silently didn't load | Layout front matter doesn't cascade. Set `css:` on every page |
| `robots.txt` / `sitemap.xml` served with raw `{{ }}` | They need an empty `---` front matter fence; the build now fails on any leftover Liquid |
| `github-pages` gem broke a build | Use plain Jekyll 4.4 in Actions, or keep `plugins: []` on the branch build |
| Clicking "Configure" in Pages settings added a broken `jekyll.yml` | Delete it; `pages.yml` is the only deploy workflow |
| The host's 404 page showed instead of ours, with the wrong content | `404.php` + a final rewrite rule (Appendix H, I) |
| `/folder` redirect exposed the host's internal path | An explicit "add the slash" rewrite rule before Apache's own |
| An uploaded zip flattened the folders in the GitHub web editor | Push with git (or a mirror workflow), never drag-and-drop folders |
| Checkout's saved credentials clashed with a second token in a workflow | `persist-credentials: false` on `actions/checkout` |
| Mobile menu flashed open on load | Inline `<script>` adds `class="js"` to `<html>` before CSS loads |
| A hidden hero delayed the largest paint | Never put `.reveal` on first-screen content |
| A tabbed-to card in a snap shelf jumped off screen | Snap the focused card into view on `focusin` |
| Wide tables scrolled off the side on phones | Stack rows as cards with `data-label` from the header row |
| A 37px email link failed the tap-target check | Padding plus an equal negative margin (44px hit area, same layout) |
| Pages looked templated (centred kicker + H2 + paragraph everywhere) | Heading beside content on wide screens; vary section layouts |

---

## 19. Build order for the new site

1. **Collect facts from the owner**: name, domain, products and their store links, support email, logo files, colours (or sample them from the logo), the legal intake (15.3), whether they want dark mode, analytics yes or no. Start `STATUS.md` with them.
2. **Scaffold**: `Gemfile`, `_config.yml` in preview state (`staging: true`), `.gitignore` (`_site/`, `.jekyll-cache/`, `.bundle/`, `vendor/`), `pages.yml`. Push and confirm the preview builds and is noindex.
3. **Shell**: `default.html` (head, SEO tags), `shell.scss` (tokens, fonts, base, buttons, section scaffold), icon sprite, header, footer, `site.js` (header state, menus, reveal). Check the header at every width before going on.
4. **Shared includes**: breadcrumbs + schema, FAQ section + schema, hero glow, store badges, product tile, guide card.
5. **Layouts**: product, guide, legal. Write each one's front matter contract in its header comment and in `STATUS.md`.
6. **Pages**: home, products, about, contact, guides hub, legal, 404. Content only from confirmed facts.
7. **SEO files**: `sitemap.xml`, `robots.txt`, `feed.xml`, `llms.txt` if wanted, favicons, share cards.
8. **QA** (section 17) until clean. Then a phone-only pass and a motion/reduced-motion pass.
9. **Go live**: switch the custom domain or run the FTP upload; set `staging: false` for the live build; run the live checks; Search Console; update the store listings' URLs.
10. **Keep `STATUS.md` current** and list everything still waiting on the owner in its open items.

---

## 20. Appendices: full source files

These are the real files from Daily Utility Apps (Appendices A–K) and CloudGate (L–M) as they stand. Change names, domains, colours and copy for the new site; keep the structure and the checks.

### Appendix A: _config.yml

```yaml
title: Daily Utility Apps
description: Smart tools for everyday life. Daily Utility Apps builds focused apps for iPhone and Android.

# ---------------------------------------------------------------------------
# Site address. Two states; see STATUS.md section 7.
#
#   Preview (now)    url: "https://staging.fixmypcperth.com" baseurl: ""  staging: true
#   Live (cutover)   url: "https://dailyutilityapps.store"   baseurl: ""  staging: false
#
# The preview borrows staging.fixmypcperth.com, which fixmypcperth stopped
# using on 26 Sep 2026. It is temporary: at the cutover the custom domain
# moves to dailyutilityapps.store and the staging DNS record is deleted.
#
# Every internal link goes through relative_url and every full URL through
# absolute_url, and both read these values, so the switch is these lines
# and nothing else. The custom domain itself is set in the repo's
# Settings > Pages > Custom domain: Actions deployments ignore a CNAME file.
# ---------------------------------------------------------------------------
url: "https://staging.fixmypcperth.com"
baseurl: ""

# true adds noindex to every page, so the preview copy can never be indexed.
# Set to false only at the cutover.
staging: true

# Pages are served without the .html extension: GitHub Pages answers /x
# from x.html. Jekyll's own permalinks keep the extension, so the layouts
# strip ".html" whenever they build a link or canonical.

timezone: Australia/Perth

plugins: []

# Stylesheets are written as plain CSS in .scss files (assets/css/) so
# Jekyll's built-in Sass compiles them to minified .css at build time.
# The source keeps every comment; the served file has none.
sass:
  style: compressed
  sourcemap: never

# Fail the build on a Liquid or front matter mistake instead of shipping a
# page with the mistake rendered into it. strict_variables stays off on
# purpose: optional front matter (css, image, noindex) is read as unset.
strict_front_matter: true
liquid:
  error_mode: strict
  strict_filters: true

# The company behind the apps, as the Privacy Policy and Terms of Service
# name it (owner's documents, 8 Oct): "Daily Utility Apps, including where
# applicable DAILY UTILITY APPS PTY LTD". legal_name appears on the legal
# pages only; the rest of the site says Daily Utility Apps. support_email
# is used across the site (Contact page, legal pages, schema).
company:
  legal_name: "DAILY UTILITY APPS PTY LTD"
  support_email: "console@dailyutilityapps.store"

# The Daily Utility Cloud Storage web app, where people sign in (user,
# 11 Oct). Linked as "Sign in" in the header.
cloud_url: "https://cloud.dailyutilityapps.store/"

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - STATUS.md
  - .github
  - .claude
  - _launch
  - vendor
```

### Appendix B: Gemfile

```ruby
source "https://rubygems.org"

# Plain Jekyll, not the github-pages gem. That gem pins Jekyll 3.10 and
# force-loads jekyll-github-metadata, which is what broke the fixmypcperth
# build. The Actions workflow runs this Jekyll directly instead.
gem "jekyll", "~> 4.4"

# Ruby 3+ no longer bundles webrick, which `jekyll serve` needs locally.
gem "webrick"
```

### Appendix C: _layouts/default.html (head, SEO tags, page shell)

```liquid
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  {%- comment -%} Set before any CSS loads, so the phone menu is hidden
  from the first paint rather than flashing open. shell.css gates the
  menu on it, which keeps the links usable without JavaScript. {%- endcomment %}
  <script>document.documentElement.classList.add('js');</script>

  {%- comment -%}
    The shell for every page. Specialised layouts (app, post, legal) set
    layout: default and render through this; the homepage, the Daily Info
    hub and 404 use it directly.

    Addresses. Every page sets its own extensionless `permalink:` (e.g.
    /privacy-policy). Jekyll still writes privacy-policy.html, which
    GitHub Pages serves at /privacy-policy, and page.url is already the
    clean address. The .html strip below is only a fallback for a page
    added without a permalink, so its canonical never names a second
    address. Full URLs always go through absolute_url, which adds site.url
    AND site.baseurl.
  {%- endcomment -%}
  {%- assign _title = page.title | default: site.title -%}
  {%- assign _desc = page.description | default: site.description -%}
  {%- assign _clean_url = page.url | replace: "/index.html", "/" | replace: ".html", "" -%}
  {%- assign _is_404 = false -%}
  {%- if page.url == "/404.html" -%}{%- assign _is_404 = true -%}{%- endif %}
  <title>{{ _title | escape }}</title>
  <meta name="description" content="{{ _desc | escape }}">
  {%- unless _is_404 %}
  <link rel="canonical" href="{{ _clean_url | absolute_url }}">
  {%- endunless %}
  {%- if site.staging or page.noindex %}
  <meta name="robots" content="noindex, nofollow">
  {%- else %}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  {%- endif %}

  <meta property="og:site_name" content="{{ site.title }}">
  <meta property="og:locale" content="en_AU">
  {%- if page.layout == "post" %}
  <meta property="og:type" content="article">
  {%- if page.date %}
  <meta property="article:published_time" content="{{ page.date | date_to_xmlschema }}">
  {%- endif %}
  {%- if page.updated %}
  <meta property="article:modified_time" content="{{ page.updated | date_to_xmlschema }}">
  {%- endif %}
  {%- if page.category %}
  <meta property="article:section" content="{{ page.category | escape }}">
  {%- endif %}
  <meta property="article:author" content="{{ site.title }}">
  {%- else %}
  <meta property="og:type" content="website">
  {%- endif %}
  <meta property="og:title" content="{{ _title | escape }}">
  <meta property="og:description" content="{{ _desc | escape }}">
  {%- unless _is_404 %}
  <meta property="og:url" content="{{ _clean_url | absolute_url }}">
  {%- endunless %}
  {%- comment -%} Share image: a page's own 1200x630 card from
  og_image / og_image_alt (articles, app pages and the Daily Info hub
  each have one in assets/og/, saved as JPEG: about 60KB each instead of
  270KB as PNG, well under the ~300KB some apps allow for link
  previews), else its photo (image / image_alt), else
  the site-wide default card. {%- endcomment -%}
  {%- assign _og_img = page.og_image | default: page.image | default: "/assets/og/default.jpg" -%}
  {%- assign _og_alt = page.og_image_alt | default: page.image_alt | default: "Daily Utility Apps: smart tools for everyday life" %}
  <meta property="og:image" content="{{ _og_img | absolute_url }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{{ _og_alt | escape }}">
  {%- assign _og_ext = _og_img | split: "." | last | downcase -%}
  {%- if _og_ext == "jpg" %}{% assign _og_ext = "jpeg" %}{% endif %}
  <meta property="og:image:type" content="image/{{ _og_ext }}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ _title | escape }}">
  <meta name="twitter:description" content="{{ _desc | escape }}">
  <meta name="twitter:image" content="{{ _og_img | absolute_url }}">
  <meta name="twitter:image:alt" content="{{ _og_alt | escape }}">

  <link rel="icon" href="{{ '/assets/icons/favicon-32.png' | relative_url }}" sizes="32x32" type="image/png">
  <link rel="icon" href="{{ '/assets/icons/favicon-16.png' | relative_url }}" sizes="16x16" type="image/png">
  <link rel="icon" href="{{ '/assets/icons/favicon-48.png' | relative_url }}" sizes="48x48" type="image/png">
  <link rel="alternate" type="application/atom+xml" title="Daily Info from {{ site.title }}" href="{{ '/feed.xml' | relative_url }}">
  <link rel="apple-touch-icon" href="{{ '/assets/icons/apple-touch-icon.png' | relative_url }}">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#ffffff">

  {%- comment -%} shell.css first, then the page's own stylesheet, so a page
  can build on the shared tokens. Every page sets its own css: matching
  its layout (app, post, legal each need it set on every page that uses
  them, not just on the layout file -- Jekyll doesn't cascade a layout's
  front matter down to its pages, confirmed when pages/post.css silently
  never loaded on the first real post). No css: means shell only.
  The ?v= stamp changes on every build, so browsers never keep a stale
  copy after a deploy. {%- endcomment -%}
  {%- assign _v = site.time | date: "%s" %}
  {%- comment -%} Both fonts render above the fold on every page (headings
  and body text), so both are worth the preload hint. {%- endcomment -%}
  <link rel="preload" href="{{ '/assets/fonts/dm-sans-latin.woff2' | relative_url }}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="{{ '/assets/fonts/space-grotesk-latin.woff2' | relative_url }}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{{ '/assets/css/shell.css' | relative_url }}?v={{ _v }}">
  {%- if page.css %}
  <link rel="stylesheet" href="{{ '/assets/css/pages/' | append: page.css | append: '.css' | relative_url }}?v={{ _v }}">
  {%- endif %}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
{% include icon-sprite.html %}
{% include header.html %}
<main id="main" tabindex="-1">
{{ content }}
</main>
{% include footer.html %}
{% include scripts.html %}
</body>
</html>
```

### Appendix D1: sitemap.xml

```liquid
---
---
{%- comment -%}
  Every HTML page except the 404 and anything with noindex: true
  (STATUS.md section 6). URLs are extensionless (directory pages like
  /daily-info/ keep their slash), the same form as every canonical.

  lastmod is only ever a real date (Google ignores lastmod on sites where
  it proves inaccurate): a page's `updated`, a legal page's
  `last_updated`, else its `date`. The Daily Info hub lists the guides,
  so it takes the newest guide's date when that's later than its own.
  A page with no date gets no lastmod -- never the build time, which
  would claim every page changed on every deploy.
  The empty front matter fence above is required, or Jekyll copies this
  file unrendered.
{%- endcomment -%}
{%- assign _newest_guide = "" -%}
{%- assign _guides = site.pages | where: "layout", "post" -%}
{%- for g in _guides -%}
  {%- assign _gd = g.updated | default: g.date | date: "%Y-%m-%d" -%}
  {%- if _gd > _newest_guide -%}{%- assign _newest_guide = _gd -%}{%- endif -%}
{%- endfor -%}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- assign _pages = site.pages | sort: "url" -%}
{%- for p in _pages %}
  {%- comment -%} Only pages written as HTML or Markdown (not this file,
    the feed, robots.txt or stylesheets), never the 404 or a noindex page. {%- endcomment -%}
  {%- assign _ext = p.name | split: "." | last -%}
  {%- unless _ext == "html" or _ext == "md" -%}{%- continue -%}{%- endunless -%}
  {%- if p.url == "/404.html" or p.noindex -%}{%- continue -%}{%- endif -%}
  {%- assign _loc = p.url | replace: "/index.html", "/" | replace: ".html", "" -%}
  {%- assign _mod = p.updated | default: p.last_updated | default: p.date -%}
  {%- if _mod -%}{%- assign _mod = _mod | date: "%Y-%m-%d" -%}{%- else -%}{%- assign _mod = "" -%}{%- endif -%}
  {%- if p.url == "/daily-info/" and _newest_guide > _mod -%}{%- assign _mod = _newest_guide -%}{%- endif %}
  <url>
    <loc>{{ _loc | absolute_url }}</loc>
    {%- if _mod != "" %}
    <lastmod>{{ _mod }}</lastmod>
    {%- endif %}
  </url>
{%- endfor %}
</urlset>
```

### Appendix D2: robots.txt

```liquid
---
---
{%- comment -%}
  Two states, from _config.yml's `staging` flag (STATUS.md section 7):
  the preview blocks all crawling (every page also carries noindex); the
  live site allows it and points crawlers at the sitemap. The empty front
  matter fence above is required, or Jekyll copies this file unrendered.
{%- endcomment -%}
{%- if site.staging -%}
# Preview copy of dailyutilityapps.store -- not for indexing.
User-agent: *
Disallow: /
{%- else -%}
User-agent: *
Allow: /

Sitemap: {{ '/sitemap.xml' | absolute_url }}
{%- endif %}
```

### Appendix E1: Reveal on scroll, hero glow and reduced motion (from assets/css/shell.scss)

```css
:root {
  --bg: #ffffff;
  --bg-alt: #f4f7fb;
  --surface: #ffffff;
  --surface-glass: rgba(255, 255, 255, 0.78);
  --text: #0c1424;
  --text-2: #4b5565;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --brand: #0b5fe8;
  --brand-hover: #0848b8;
  --on-brand: #ffffff;
  --brand-soft: #e8f0ff;
  --brand-text: #0a52c9;
  /* Sampled directly from the real logo mark (assets/icons/mark.png), not
     a generic accent: the icon sweeps from this blue to this green. Used
     for decoration only (hero glow, borders, the logo itself) -- never
     behind text. White text on it fails 4.5:1 contrast past ~20% into
     the blend (measured), so buttons stay solid --brand. */
  --brand-2: #16b871;
  /* --brand-2 itself is 2.6:1 on white -- decoration only, never text.
     This is the safe foreground sibling (5.4:1) for the rare case a
     small green label/icon is needed, the same relationship --brand-text
     has to --brand. */
  --brand-2-text: #0a7a47;
  --brand-gradient: linear-gradient(135deg, var(--brand) 0%, #0f9ed6 45%, var(--brand-2) 100%);
  --accent: #06b6d4;
  --glass: rgba(255, 255, 255, 0.94);

  /* Illustration colours (see "App tones" below): app tiles, guide
     banners and icon chips. Fixed colours, like the store
     badges, and always carry a white glyph. Blue is the default. */
  --tone-light: #3b82f6;
  --tone-deep: #0b5fe8;
  --tone-gradient: linear-gradient(145deg, #3b82f6, #0b5fe8);
  /* Hero glow, second and third blobs (the first is --brand). Outside
     a tone these are the logo's green and cyan; each tone swaps in
     lighter shades of its own colour. */
  --glow-b: var(--brand-2);
  --glow-c: var(--accent);

  --shadow-sm: 0 1px 2px rgba(12, 20, 36, 0.06), 0 1px 3px rgba(12, 20, 36, 0.08);
  --shadow-md: 0 4px 12px rgba(12, 20, 36, 0.08), 0 12px 32px rgba(12, 20, 36, 0.08);
  --shadow-lg: 0 12px 24px rgba(12, 20, 36, 0.1), 0 32px 64px rgba(12, 20, 36, 0.12);

  --radius-sm: 8px;
  --radius: 14px;
  --radius-lg: 22px;
  --radius-pill: 999px;

  /* "Tech Startup" pairing (ui-ux-pro-max --domain typography): Space
     Grotesk for headings/brand moments, DM Sans for everything read as
     body or UI chrome. Both self-hosted (assets/fonts/) as variable
     fonts -- one file per family covers every weight used, no
     third-party request before text paints. System-ui is the fallback
     for both, not a generic sans, so an unloaded-fonts render still
     looks considered. */
  --font-heading: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font: "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --wrap: 70rem;
  --gutter: clamp(1rem, 4vw, 2rem);
  --header-h: 4rem;
  --space-section: clamp(4rem, 9vw, 7rem);
  /* One hero rhythm for every page type (home, hub, app, article, legal):
     48px above / 56px below on phones, growing on larger screens. */
  --space-hero-top: clamp(3rem, 7vw, 5.5rem);
  --space-hero-bottom: clamp(3.5rem, 8vw, 6rem);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  /* Light only (user, 14 Oct: "light looks way better"). Telling the
     browser keeps form controls and scrollbars light too, even when the
     device is set to dark mode. */
  color-scheme: light;
}

/* ---------- Fonts ----------
   Each file is a full variable font (weight axis covers every weight

/* ... */

/* ---------- Hero glow (decorative gradient mesh) ---------- */

.hero-glow-host {
  position: relative;
  overflow: clip;
  isolation: isolate;
}

.hero-glow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}

/* Texture: a fine static dot grid inside the glow layer, fading out
   toward the edges. Painted once (no animation), so it adds depth
   without adding any per-frame work. */
.hero-glow::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, color-mix(in srgb, var(--text) 16%, transparent) 1px, transparent 1.3px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 65% 45%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 80% at 65% 45%, #000 20%, transparent 75%);
}

/* Required on the real content inside a .hero-glow-host: an absolutely
   positioned z-index:0 layer (the glow) paints ABOVE plain in-flow
   content per CSS stacking rules, not below it. position:relative +
   z-index:1 here is what puts the content back on top -- without it the
   glow would visually cover the text. */
.hero-glow-content {
  position: relative;
  z-index: 1;
}

/* Each blob is a plain div: a radial gradient (soft-edged by itself, so
   no blur filter) centred on its left/top point by the `translate`
   property, leaving `transform` free for the drift. Transform-only
   animation of a promoted layer is composited on the GPU with no
   per-frame repaint -- the SVG-filter version this replaced ran the
   page at ~12fps (see _includes/hero-glow.html).

   Slow, low-amplitude drift -- ~18s+ per blob, well clear of the ~5s
   (0.2Hz) cycle Apple's own motion guidance flags as uncomfortable.
   Each blob gets its own duration/direction so the group reads as one
   organic field rather than three shapes moving in lockstep. */
.hero-glow-blob {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  translate: -50% -50%;
  will-change: transform;
}
.hero-glow-blob--a {
  left: 18%;
  top: 22%;
  width: max(53%, 24rem);
  background: radial-gradient(circle closest-side, color-mix(in srgb, var(--brand) 55%, transparent), color-mix(in srgb, var(--brand) 22%, transparent) 50%, transparent);
  animation: heroGlowDriftA 19s ease-in-out infinite;
}
.hero-glow-blob--b {
  left: 82%;
  top: 70%;
  width: max(60%, 26rem);
  background: radial-gradient(circle closest-side, color-mix(in srgb, var(--glow-b) 45%, transparent), color-mix(in srgb, var(--glow-b) 18%, transparent) 50%, transparent);
  animation: heroGlowDriftB 23s ease-in-out infinite;
}
.hero-glow-blob--c {
  left: 63%;
  top: 15%;
  width: max(40%, 18rem);
  background: radial-gradient(circle closest-side, color-mix(in srgb, var(--glow-c) 35%, transparent), color-mix(in srgb, var(--glow-c) 14%, transparent) 50%, transparent);
  animation: heroGlowDriftC 27s ease-in-out infinite;
}

@keyframes heroGlowDriftA {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(6%, 8%) scale(1.08); }
}
@keyframes heroGlowDriftB {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-8%, -6%) scale(1.06); }
}
@keyframes heroGlowDriftC {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-4%, 6%) scale(0.94); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-glow-blob--a, .hero-glow-blob--b, .hero-glow-blob--c { animation: none; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .hero-glow { display: none; }
}

/* ... */


/* ---------- Reveal on scroll ----------
   Content is only hidden once scripts.html has confirmed the observer that
   reveals it is running (.reveal-ready). Never put .reveal on anything in
   the first screen: a hidden hero delays Largest Contentful Paint. */

.reveal-ready .reveal {
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
.reveal-ready .reveal.is-visible { opacity: 1; transform: none; }

/* ---------- Accessibility preferences ---------- */

/* Reduced motion keeps the fades that aid comprehension and drops movement. */
@media (prefers-reduced-motion: reduce) {
  .btn:active { transform: none; }
  .reveal-ready .reveal { transform: none; transition: opacity 0.3s ease; }
  .js .site-nav, .js .nav-open .site-nav { transform: none; }
  .nav-toggle-bars::before, .nav-toggle-bars::after, .nav-chevron, .nav-go,
```

### Appendix F: assets/js/site.js

```js
/* Daily Utility Apps: shared behaviour for every page: header scroll
   state, the phone menu, reveal-on-scroll and the rest. Each block
   checks for its own elements and does nothing when they are absent, so
   any page can include this safely.
   Served as a cached file (loaded with defer from _includes/scripts.html)
   rather than inline, so later page views don't download it again. */
(function () {
  'use strict';

  /* iOS Safari only applies :active while a touch listener exists, so
     without this the instant press feedback on buttons never shows. */
  document.addEventListener('touchstart', function () {}, { passive: true });

  var header = document.getElementById('site-header');

  /* ---- Header scroll state ----
     The hairline and shadow appear only once content is under the header,
     tracked by a 1px sentinel at the top of the page (no scroll listener). */
  var sentinel = document.getElementById('scroll-sentinel');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---- Navigation ----
     Two layers, each with one function that sets its state, so classes
     and aria attributes never disagree:
     - setSheet: the phone sheet behind the menu button.
     - setSub: one menu (Apps, Guides, Help). On desktop it's a flyout
       with the page dimmed behind it; in the phone sheet it folds open.
     Desktop flyouts open on click, or on hover after a short intent
     delay (so a pointer passing over the bar doesn't flash them), and
     close when the pointer leaves the header, on Escape (focus returns
     to the trigger), on a click outside, when focus leaves the menu, or
     when a link inside is followed. Crossing the breakpoint resets both. */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  var root = document.documentElement;
  if (header && nav) {
    var desktop = window.matchMedia('(min-width: 760px)');
    var triggers = Array.prototype.slice.call(header.querySelectorAll('.nav-trigger'));
    var openSub = null;
    var openedAt = 0;
    var hoverTimer = null;

    var setSub = function (trigger, open, returnFocus) {
      if (open && openSub && openSub !== trigger) setSub(openSub, false);
      trigger.setAttribute('aria-expanded', String(open));
      if (open) { openSub = trigger; openedAt = Date.now(); }
      else if (openSub === trigger) openSub = null;
      var flyout = !!openSub && desktop.matches;
      header.classList.toggle('menu-open', flyout);
      root.classList.toggle('nav-flyout-open', flyout);
      if (!open && returnFocus) trigger.focus();
    };
    var closeSubs = function () { if (openSub) setSub(openSub, false); };

    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        var isOpenNow = t.getAttribute('aria-expanded') === 'true';
        // A click right after hover opened this menu confirms it rather
        // than immediately closing it again.
        if (isOpenNow && desktop.matches && Date.now() - openedAt < 400) return;
        setSub(t, !isOpenNow);
      });
      t.parentElement.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || !desktop.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { setSub(t, true); }, openSub ? 0 : 140);
      });
    });

    // Plain links in the bar (Guides): hovering one closes any open menu,
    // the way moving to a non-menu item does on apple.com.
    Array.prototype.forEach.call(header.querySelectorAll('.nav-link--page'), function (a) {
      a.parentElement.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || !desktop.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(closeSubs, 120);
      });
    });

    header.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') clearTimeout(hoverTimer);
    });
    header.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse' || !desktop.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(closeSubs, 220);
    });

    var scrim = document.getElementById('nav-scrim');
    if (scrim) scrim.addEventListener('click', closeSubs);

    // The phone sheet.
    var sheetOpen = function () { return header.classList.contains('nav-open'); };
    var setSheet = function (open, returnFocus) {
      if (!toggle) return;
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) closeSubs();
      if (!open && returnFocus) toggle.focus();
    };
    if (toggle) toggle.addEventListener('click', function () { setSheet(!sheetOpen()); });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeSubs(); setSheet(false); }
    });

    document.addEventListener('click', function (e) {
      if (header.contains(e.target)) return;
      if (openSub && desktop.matches) closeSubs();
      if (sheetOpen()) setSheet(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (openSub && (desktop.matches || !sheetOpen())) { setSub(openSub, false, true); return; }
      if (sheetOpen()) setSheet(false, true);
    });

    header.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (!to) return;
      if (!header.contains(to)) { closeSubs(); if (sheetOpen()) setSheet(false); return; }
      if (openSub && desktop.matches && !openSub.parentElement.contains(to)) closeSubs();
    });

    var onBreakpoint = function () { closeSubs(); setSheet(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ---- Article contents: highlight the section being read ----
     The link for the last section whose top has passed the upper third
     of the screen gets .is-active (and aria-current). */
  var tocLinks = document.querySelectorAll('.post-toc-list a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var targets = [];
    tocLinks.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (el) targets.push({ link: a, el: el.closest('.post-section') || el });
    });
    var setActive = function () {
      var current = null;
      var line = window.innerHeight * 0.35;
      targets.forEach(function (t) { if (t.el.getBoundingClientRect().top <= line) current = t; });
      targets.forEach(function (t) {
        var on = t === current;
        t.link.classList.toggle('is-active', on);
        if (on) t.link.setAttribute('aria-current', 'true'); else t.link.removeAttribute('aria-current');
      });
    };
    var spy = new IntersectionObserver(setActive, { rootMargin: '-35% 0px -60% 0px' });
    targets.forEach(function (t) { spy.observe(t.el); });
    setActive();
  }

  /* ---- Contents lists fold on phones ----
     Open by default in the HTML (so they work without JavaScript); on
     narrow screens they start closed and close again after a link is
     tapped, and they reopen if the window widens to the desktop layout. */
  var folds = document.querySelectorAll('.post-toc-fold');
  if (folds.length) {
    var wide = window.matchMedia('(min-width: 60rem)');
    var syncFolds = function () { folds.forEach(function (d) { d.open = wide.matches; }); };
    syncFolds();
    if (wide.addEventListener) wide.addEventListener('change', syncFolds);
    folds.forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (!wide.matches && e.target.closest('a')) d.open = false;
      });
    });
  }

  /* ---- Share button ----
     The phone's share sheet where there is one, else copy the link. */
  document.querySelectorAll('[data-share-url]').forEach(function (btn) {
    var label = btn.querySelector('.post-share-text');
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-share-url');
      var title = btn.getAttribute('data-share-title');
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          if (label) label.textContent = 'Link copied';
          setTimeout(function () { if (label) label.textContent = 'Share this guide'; }, 2000);
        }, function () {});
      }
    });
  });

  /* ---- Copy button (Contact page) ----
     Hidden in the markup and shown only when the clipboard is there to
     use, so it never appears as a button that does nothing. The status
     line announces the result to screen readers too. */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    if (!navigator.clipboard || !window.isSecureContext) return;
    var label = btn.querySelector('.contact-copy-text');
    var status = btn.closest('.contact-card');
    status = status && status.querySelector('.contact-copy-status');
    var timer;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        if (label) label.textContent = 'Copied';
        if (status) status.textContent = 'Email address copied.';
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (label) label.textContent = 'Copy address';
          if (status) status.textContent = '';
        }, 2500);
      }, function () {
        if (status) status.textContent = 'Couldn\'t copy. Select the address above instead.';
      });
    });
  });

  /* ---- Swipe shelves ----
     On phones the homepage job cards sit in a sideways shelf that snaps
     to each card. Tabbing to a link in a half-hidden card scrolls the
     link into view, then the snap pulls the shelf back to the previous
     card, leaving the focused link off screen. Snapping the focused
     card itself into place keeps it in view. */
  document.querySelectorAll('.jobs-grid').forEach(function (shelf) {
    shelf.addEventListener('focusin', function (e) {
      if (shelf.scrollWidth <= shelf.clientWidth) return;
      var card = e.target.closest('.jobs-grid > li');
      if (card) card.scrollIntoView({ block: 'nearest', inline: 'start' });
    });
  });

  /* ---- Tables ----
     Label each cell with its column heading, so on phones (shell.css)
     every row can stack as a card instead of hiding columns off to the
     side. Without this the table simply scrolls sideways. */
  document.querySelectorAll('.table-scroll table').forEach(function (table) {
    var heads = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) {
      return th.textContent.trim();
    });
    if (!heads.length) return;
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (cell, i) {
        if (heads[i]) cell.setAttribute('data-label', heads[i]);
      });
    });
    table.classList.add('is-stackable');

    /* Stacked, the box no longer scrolls, so it drops the "scrolls
       sideways" label and its tab stop until the screen widens again. */
    var wrap = table.parentNode;
    var label = wrap.getAttribute('aria-label');
    var phone = window.matchMedia('(max-width: 599.98px)');
    var sync = function () {
      if (phone.matches) {
        wrap.removeAttribute('tabindex');
        wrap.setAttribute('aria-label', 'Table');
      } else {
        wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('aria-label', label);
      }
    };
    sync();
    if (phone.addEventListener) phone.addEventListener('change', sync);
  });

  /* ---- Reveal on scroll ----
     .reveal-ready (which hides .reveal content) is added only after the
     observer that shows it again exists. If anything here fails, the
     content simply stays visible. */
  try {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      reveals.forEach(function (el) { revealer.observe(el); });
      document.documentElement.classList.add('reveal-ready');
    }
  } catch (err) {
    document.documentElement.classList.remove('reveal-ready');
  }
})();
```

### Appendix G1: _layouts/legal.html

```liquid
---
layout: default
css: legal
---
{%- comment -%}
  Privacy/terms layout. Chains to default.html.

  Every page on this layout must set `css: legal` in its OWN front
  matter (this file's `css: legal` above does not cascade -- see
  app.html's header comment for why).

  Required front matter (STATUS.md section 4): title, description,
  css (must be "legal"), heading (the H1; title is the longer <title>),
  last_updated (the document's own "Last updated" date), sections (a
  list of {id, label}). Optional: lead (an intro paragraph under the H1),
  effective (the document's effective date, shown before last_updated),
  updated (when this page last changed, for the sitemap only).
  The body is prose written as .md (so kramdown runs); every body
  heading must carry kramdown's inline ID syntax, e.g.
  `## Data we collect {#data-we-collect}`, matching one of the
  `sections` entries below, so the table of contents generated here
  always links to a heading that actually exists -- a hand-typed TOC
  would drift the moment a heading was renamed and nobody updated the
  list separately.

  No hardcoded canonical: here -- legal pages use the same canonical
  logic as every other page (default.html). The BreadcrumbList is
  Home > this page (STATUS.md section 6: legal pages carry one).
{%- endcomment -%}
{%- assign _heading = page.heading | default: page.title -%}
{%- assign _clean_url = page.url -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": {{ '/' | absolute_url | jsonify | replace: "/", "\/" }} },
    { "@type": "ListItem", "position": 2, "name": {{ _heading | jsonify | replace: "/", "\/" }}, "item": {{ _clean_url | absolute_url | jsonify | replace: "/", "\/" }} }
  ]
}
</script>

<section class="section legal-hero" aria-labelledby="legal-title">
  <div class="wrap legal-wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="{{ '/' | relative_url }}">Home</a>
      <span class="breadcrumbs-sep" aria-hidden="true">/</span>
      <span aria-current="page">{{ _heading | escape }}</span>
    </nav>
    <h1 id="legal-title">{{ _heading | escape }}</h1>
    {%- if page.lead %}
    <p class="legal-lead">{{ page.lead | escape }}</p>
    {%- endif %}
    {%- assign _eff = page.effective | date: "%Y-%m-%d" -%}
    {%- assign _upd = page.last_updated | date: "%Y-%m-%d" %}
    <p class="legal-updated"><svg aria-hidden="true"><use href="#i-auto"/></svg>
      {%- if page.effective and _eff == _upd -%}
      <span>Effective and last updated <time datetime="{{ _upd }}">{{ page.last_updated | date: "%-d %B %Y" }}</time></span>
      {%- else -%}
      {%- if page.effective %}<span>Effective <time datetime="{{ _eff }}">{{ page.effective | date: "%-d %B %Y" }}</time></span><span aria-hidden="true">&middot;</span>{% endif -%}
      <span>Last updated <time datetime="{{ _upd }}">{{ page.last_updated | date: "%-d %B %Y" }}</time></span>
      {%- endif -%}
    </p>
  </div>
</section>

<div class="section legal-layout">
  <div class="wrap legal-wrap legal-grid">
    {%- if page.sections %}
    <nav class="legal-toc" aria-label="Table of contents">
      <p class="legal-toc-head">On this page</p>
      <ol>
        {%- for item in page.sections %}
        <li><a href="#{{ item.id }}">{{ item.label | escape }}</a></li>
        {%- endfor %}
      </ol>
    </nav>
    {%- endif %}
    <div class="prose legal-body">
      {{ content }}
    </div>
  </div>
</div>
```

### Appendix G2: _includes/home/schema.html (Organization, WebSite, ItemList)

```liquid
{%- comment -%}
  Homepage structured data. The Organization lives here and only here;
  every SoftwareApplication and BlogPosting elsewhere points back at its
  @id rather than repeating it. Deliberately no legal name, address or
  social profiles: the registered company name appears on the legal
  pages only (STATUS.md 5u), schema included. The support email is
  Daily Utility's own (user, 4 Oct), so it is listed.
{%- endcomment -%}
{%- assign _home = '/' | absolute_url -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": {{ _home | append: '#organization' | jsonify }},
      "name": {{ site.title | jsonify }},
      "url": {{ _home | jsonify }},
      "logo": {{ '/assets/icons/mark-192.png' | absolute_url | jsonify }},
      "email": {{ site.company.support_email | jsonify }},
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": {{ site.company.support_email | jsonify }},
        "url": {{ '/contact' | absolute_url | jsonify }}
      }
    },
    {
      "@type": "WebSite",
      "@id": {{ _home | append: '#website' | jsonify }},
      "name": {{ site.title | jsonify }},
      "url": {{ _home | jsonify }},
      "description": {{ page.description | jsonify }},
      "inLanguage": "en-AU",
      "publisher": { "@id": {{ _home | append: '#organization' | jsonify }} }
    },
    {
      "@type": "ItemList",
      "name": "Apps by Daily Utility Apps",
      "itemListElement": [
        {%- for app in include.apps %}
        { "@type": "ListItem", "position": {{ forloop.index }}, "name": {{ app.name | jsonify }}, "url": {{ '/' | append: app.slug | absolute_url | jsonify }} }{% unless forloop.last %},{% endunless %}
        {%- endfor %}
      ]
    }
  ]
}
</script>
{% include faq-schema.html faqs=page.faqs %}
```

### Appendix G3: _includes/faq-section.html

```liquid
{%- comment -%}
  A visible FAQ section (shell.css FAQ cards). Params: faqs (list of
  {q, a}), optional heading (default "Questions people ask"), sub, id and
  alt (true for the alternate section background). The heading sits
  beside the questions on wide screens and above them on phones -- the
  same layout on every page (3 Oct; `split` is still accepted and no
  longer needed). Pair it with faq-schema.html, which writes the same
  questions as FAQPage data -- the visible and structured answers must
  always match.
{%- endcomment -%}
{%- if include.faqs and include.faqs.size > 0 %}
{%- assign _faq_title = include.id | default: "faq" | append: "-title" %}
<section class="section{% if include.alt %} section--alt{% endif %}"{% if include.id %} id="{{ include.id }}"{% endif %} aria-labelledby="{{ _faq_title }}">
  <div class="wrap faq-split">
    <div class="section-head reveal">
      <h2 id="{{ _faq_title }}">{{ include.heading | default: "Questions people ask" | escape }}</h2>
      {%- if include.sub %}
      <p class="section-sub">{{ include.sub | escape }}</p>
      {%- endif %}
    </div>
    <div class="faq-list reveal">
      {%- for item in include.faqs %}
      <details class="faq-item">
        <summary class="faq-q">
          <span>{{ item.q | escape }}</span>
          <svg class="faq-chevron" aria-hidden="true"><use href="#i-chevron-down"/></svg>
        </summary>
        <div class="faq-a"><p>{{ item.a | escape }}</p></div>
      </details>
      {%- endfor %}
    </div>
  </div>
</section>
{%- endif %}
```

### Appendix G4: _includes/faq-schema.html

```liquid
{%- comment -%}
  FAQPage structured data. Param: faqs, a list of {q, a} (front matter on
  the app layout and, optionally, a post). Renders nothing if faqs is
  missing or empty, so an include call is always safe even before a page
  has any FAQs written.

  Values go through Liquid's jsonify filter, not manual string
  concatenation -- an answer containing a quote mark or an ampersand
  would otherwise produce invalid JSON silently.

  Usage: {% include faq-schema.html faqs=page.faqs %}
{%- endcomment -%}
{%- if include.faqs and include.faqs.size > 0 -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {%- for item in include.faqs %}
    {
      "@type": "Question",
      "name": {{ item.q | jsonify | replace: "/", "\/" }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ item.a | jsonify | replace: "/", "\/" }}
      }
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
}
</script>
{%- endif -%}
```

### Appendix G5: _includes/breadcrumb-schema.html

```liquid
{%- comment -%}
  BreadcrumbList structured data. Param: crumbs, a list of {name, url}
  in order from the homepage down (url is a site-relative path, e.g.
  "/daily-info/" -- this include builds the absolute URL itself, the same
  way every other full URL on the site is built). Renders nothing if
  crumbs is missing or empty.

  Usage:
  {% include breadcrumb-schema.html crumbs=page.breadcrumbs %}
  where a page sets, e.g.:
    breadcrumbs:
      - name: "Daily Info"
        url: "/daily-info/"
      - name: "How to Back Up Your Phone Before Switching"
        url: "/daily-info/backup-before-switching-phones"
{%- endcomment -%}
{%- if include.crumbs and include.crumbs.size > 0 -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {%- for crumb in include.crumbs %}
    {
      "@type": "ListItem",
      "position": {{ forloop.index }},
      "name": {{ crumb.name | jsonify | replace: "/", "\/" }},
      "item": {{ crumb.url | absolute_url | jsonify | replace: "/", "\/" }}
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
}
</script>
{%- endif -%}
```

### Appendix G6: _includes/hero-glow.html

```liquid
{%- comment -%}
  Decorative gradient-mesh glow for a hero section. Pure atmosphere: sits
  behind the content (z-index below it), aria-hidden, pointer-events:none.
  Uses --brand/--brand-2/--accent (sampled from the real logo, see
  STATUS.md 4e).

  Three plain divs with CSS radial-gradient backgrounds, drifting via
  transform. This replaced an SVG version (blurred circles under an
  feGaussianBlur filter) in step 5: SVG filters aren't GPU-composited, so
  that blur was re-rasterised on the CPU every frame of the drift and
  held the page to ~12fps in testing (61fps without it). Radial
  gradients are already soft-edged, so the blur added little but cost.
  Styles live in shell.css ("Hero glow").

  The drift is ~18s+ per cycle -- well clear of the ~5s (0.2Hz) range
  Apple's own motion guidance flags as uncomfortable -- and freezes under
  prefers-reduced-motion rather than just slowing down.

  Usage: {% include hero-glow.html %} as the first child of a
  position:relative container; pair with .hero-glow-host on that
  container and .hero-glow-content on the real content (shell.css).
{%- endcomment -%}
<div class="hero-glow" aria-hidden="true">
  <div class="hero-glow-blob hero-glow-blob--a"></div>
  <div class="hero-glow-blob hero-glow-blob--b"></div>
  <div class="hero-glow-blob hero-glow-blob--c"></div>
</div>
```

### Appendix G7: _includes/app-tile.html

```liquid
{%- comment -%}
  An app's tile: a drawn SVG glyph on a coloured rounded square. Used
  everywhere an app needs a visual (homepage, app pages, 404) INSTEAD of
  the real store icon -- the site never shows the actual app logos (user,
  29 Sep). Each app's glyph (an icon-sprite symbol) and tone (a colour in
  shell.css's "App tiles") come from _data/apps.yml.

  Params: app (an apps.yml entry), class (optional extra classes that set
  size/position). Always decorative: the app's name is always given in
  text next to or near it, so the tile is aria-hidden.

  Usage: {% include app-tile.html app=flagship class="app-card-icon" %}
{%- endcomment -%}
<span class="app-tile app-tile--{{ include.app.tone }}{% if include.class %} {{ include.class }}{% endif %}" aria-hidden="true"><svg><use href="#i-{{ include.app.glyph }}"/></svg></span>
```

### Appendix H: .htaccess

```apache
# ---------------------------------------------------------------------------
# Web server rules for dailyutilityapps.store (Apache / LiteSpeed shared
# hosting), uploaded by .github/workflows/ftp.yml. Jekyll copies
# .htaccess into _site by default; GitHub Pages ignores it.
# STATUS.md section 5w.
# ---------------------------------------------------------------------------

Options -Indexes -MultiViews
DirectoryIndex index.html

# Never serve this file, any other .ht* file, or the upload's file list.
<IfModule mod_authz_core.c>
  <FilesMatch "^\.(ht|site-manifest)">
    Require all denied
  </FilesMatch>
</IfModule>
# Missing addresses are answered by 404.php (the last rewrite rule
# below): this host's server-wide error page takes priority over an
# ErrorDocument set here, which showed Apache's default page (11 Oct).
# ErrorDocument stays for hosts that do honour it.
ErrorDocument 404 /404.php

<IfModule mod_rewrite.c>
  RewriteEngine On

  # One address for every page: https, no www.
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
  RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]

  # A folder asked for without its slash (/daily-info): add the slash
  # here. Left to Apache, the redirect can show the host's internal
  # folder path (seen with a host-style mapping in testing, 11 Oct).
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.*[^/])$ https://%{HTTP_HOST}/$1/ [R=301,L]

  # Clean URLs. Jekyll writes about.html but every link and canonical is
  # /about. A typed or old /about.html redirects to /about (and
  # /daily-info/index.html to /daily-info/), then /about is answered from
  # about.html. THE_REQUEST is the browser's own request line, so the
  # internal rewrite below never loops back into these redirects.
  RewriteCond %{THE_REQUEST} \s/+((?:[^?\s]*/)?)index\.html[\s?]
  RewriteRule ^ https://%{HTTP_HOST}/%1 [R=301,L]
  RewriteCond %{THE_REQUEST} \s/+([^?\s]+)\.html[\s?]
  RewriteRule ^ https://%{HTTP_HOST}/%1 [R=301,L]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]

  # Anything else that doesn't exist: 404.php sends a real 404 status
  # with the site's not-found page.
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ 404.php [L]
</IfModule>

# Stylesheets and scripts carry a ?v= stamp that changes on every build,
# so browsers may keep them for a year. Pages are always rechecked.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 week"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/xml "access plus 1 hour"
  ExpiresByType text/xml "access plus 1 hour"
  ExpiresByType application/rss+xml "access plus 1 hour"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml application/rss+xml application/javascript text/javascript image/svg+xml
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### Appendix I: 404.php

```php
<?php
// Answers every address that doesn't exist (the last rule in .htaccess):
// a real 404 status with the site's own not-found page. This host's
// server-wide error page can't be replaced from .htaccess, so
// ErrorDocument alone showed Apache's default page (STATUS.md 5w).
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
readfile(__DIR__ . '/404.html');
```

### Appendix J: .github/workflows/pages.yml

```yaml
# Builds with plain Jekyll instead of GitHub's default Pages builder, which
# forces the github-pages gem and its jekyll-github-metadata plugin (the
# cause of fixmypcperth's broken builds). For this to be the build that
# ships, Settings > Pages > Source must be "GitHub Actions".
#
# Pull requests into main are built and checked but never deployed, so a
# broken change shows up before it is merged.
#
# This deploys the noindex PREVIEW (staging.fixmypcperth.com). The live
# site, dailyutilityapps.store, is uploaded to the web host by ftp.yml.

name: Build and deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true

      - name: Build
        run: bundle exec jekyll build --trace
        env:
          JEKYLL_ENV: production

      # A Liquid file without its --- front matter fence (robots.txt,
      # sitemap.xml) is copied as-is, so its {{ }} tags reach production
      # unrendered. Nothing in the built site should still contain one.
      # Jekyll writes no _site at all when there is nothing to build, and
      # grep would read that as "no match", so it is checked first.
      - name: Check built output
        run: |
          if [ ! -f _site/index.html ]; then
            echo "::error::The build produced no _site/index.html, so there is nothing to deploy."
            exit 1
          fi
          if grep -rlE '\{\{|\{%' --include='*.html' --include='*.xml' --include='*.txt' --include='*.css' --include='*.js' --include='*.json' _site; then
            echo "::error::The files above contain unrendered Liquid. Add an empty --- front matter fence to the top of each source file."
            exit 1
          fi

      - if: github.event_name != 'pull_request'
        uses: actions/configure-pages@v6

      - if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v5

  deploy:
    if: github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

### Appendix K: .github/workflows/ftp.yml

```yaml
# Uploads the site to the dailyutilityapps.store web host over FTP
# (STATUS.md section 5w). Edit the site in this repo.
#
# Secrets in THIS repo (Settings > Secrets and variables > Actions):
#   FTP_USERNAME   the FTP user name
#   FTP_PASSWORD   its password
# Optional variables (same screen, Variables tab):
#   FTP_HOST       default dailyutilityapps.store
#   FTP_SERVER_DIR the website's folder on the server; unset = found
#                  automatically (public_html, httpdocs or
#                  domains/<host>/public_html, else the login folder)
#   FTP_TLS        loose (encrypted, default), strict (encrypted and the
#                  certificate checked) or off (plain FTP, unencrypted)
#
# Run it from the Actions tab and pick a mode:
#   look    connect and report what's on the server and how the website
#           answers (the default). Changes nothing, except one tiny test
#           file it puts in the website folder and deletes straight away,
#           to see which web addresses that folder serves.
#   upload  back up the files the upload could replace (to a folder on
#           the server, outside the website where possible), upload the
#           site, remove files this site uploaded before but no longer has
#           (never anything else), then check the live pages.
#   check   only the live-page checks from the end of upload; touches
#           nothing on the server.
# The results are shown as annotations on the run's summary page.

name: Upload to dailyutilityapps.store

on:
  workflow_dispatch:
    inputs:
      mode:
        description: "look = report only, upload = publish the site, check = test the live site only"
        type: choice
        options: [look, upload, check]
        default: look

permissions:
  contents: read

concurrency:
  group: ftp-site
  cancel-in-progress: false

jobs:
  ftp:
    if: github.repository == 'ali-rajaa/daily-utility'
    runs-on: ubuntu-latest
    env:
      FTP_HOST: ${{ vars.FTP_HOST || 'dailyutilityapps.store' }}
      FTP_SERVER_DIR: ${{ vars.FTP_SERVER_DIR }}
      FTP_TLS: ${{ vars.FTP_TLS || 'loose' }}
      FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
      LFTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
      SITE: https://dailyutilityapps.store
      MODE: ${{ inputs.mode || 'look' }}
      # Files this site used to have that must be removed from the server
      # even though no manifest listed them yet (the first upload with
      # removals). Space-separated, relative to the website folder.
      RETIRED_PATHS: >-
        photo-recover-data-recovery.html
        assets/og/photo-recover-data-recovery.jpg
    steps:
      - name: Check the secrets
        if: env.MODE != 'check'
        run: |
          if [ -z "$FTP_USERNAME" ] || [ -z "$LFTP_PASSWORD" ]; then
            echo "::error::Add the FTP_USERNAME and FTP_PASSWORD secrets to this repo first (see the top of ftp.yml)."
            exit 1
          fi
          echo "Mode: $MODE"

      - name: Install lftp
        if: env.MODE != 'check'
        run: sudo apt-get update -qq && sudo apt-get install -y -qq lftp >/dev/null

      # lftp reads the password from LFTP_PASSWORD (--env-password), so it
      # is never on a command line or in the log.
      - name: Connect and look
        if: env.MODE != 'check'
        id: look
        run: |
          case "$FTP_TLS" in
            strict) TLS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate true" ;;
            loose)  TLS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate false" ;;
            off)    TLS="set ftp:ssl-allow false" ;;
            *) echo "::error::FTP_TLS must be strict, loose or off."; exit 1 ;;
          esac
          SETUP="$TLS; set net:max-retries 2; set net:persist-retries 0; set net:timeout 30; set ftp:passive-mode true; open --user \"$FTP_USERNAME\" --env-password \"ftp://$FTP_HOST\""
          printf '%s' "$SETUP" > "$RUNNER_TEMP/lftp-setup"

          # 1. Log in and list the login folder.
          if ! login=$(lftp -c "$SETUP; cls -1aF" 2> "$RUNNER_TEMP/lftp.err"); then
            err=$(tr '\n' ' ' < "$RUNNER_TEMP/lftp.err" | head -c 300)
            case "$err" in
              *530*|*"ogin incorrect"*|*"uthentication failed"*) hint="The server refused the user name or password: check the FTP_USERNAME and FTP_PASSWORD secrets." ;;
              *SSL*|*TLS*|*ssl*|*AUTH*) hint="The encrypted connection failed. If the host doesn't offer FTP over TLS, a variable FTP_TLS=off would use plain FTP, which sends the password unencrypted." ;;
              *) hint="Check FTP_HOST ($FTP_HOST) and the secrets." ;;
            esac
            echo "::error::Couldn't log in to the FTP server. $hint (lftp said: $err)"
            exit 1
          fi
          login=$(printf '%s\n' "$login" | grep -vxE '\./|\.\./' || true)
          folders=$(printf '%s\n' "$login" | sed -n 's:/$::p')
          nfiles=$(printf '%s\n' "$login" | grep -vc '/$' || true)
          echo "::notice title=FTP login::Logged in to $FTP_HOST (TLS: $FTP_TLS). Folders where it lands: $(printf '%s\n' "$folders" | paste -sd ',' - | sed 's/,/, /g'); plus $nfiles files."

          # 2. Find the website's folder.
          if [ -n "$FTP_SERVER_DIR" ]; then
            DIR="$FTP_SERVER_DIR"
          elif printf '%s\n' "$folders" | grep -qx domains && lftp -c "$SETUP; cls -1 \"domains/$FTP_HOST/public_html\"" >/dev/null 2>&1; then
            DIR="domains/$FTP_HOST/public_html"
          elif printf '%s\n' "$folders" | grep -qx public_html; then
            DIR="public_html"
          elif printf '%s\n' "$folders" | grep -qx httpdocs; then
            DIR="httpdocs"
          else
            DIR="."
          fi
          if ! lftp -c "$SETUP; cd \"$DIR\" && cls -1aF" > "$RUNNER_TEMP/webroot.txt" 2> "$RUNNER_TEMP/lftp.err"; then
            echo "::error::Couldn't open the folder '$DIR' on the server. Set the FTP_SERVER_DIR variable to the website's folder. ($(tr '\n' ' ' < "$RUNNER_TEMP/lftp.err" | head -c 200))"
            exit 1
          fi
          sed -i -E '/^\.\.?\/$/d' "$RUNNER_TEMP/webroot.txt"
          entries=$(head -n 80 "$RUNNER_TEMP/webroot.txt" | paste -sd ',' - | sed 's/,/, /g')
          total=$(wc -l < "$RUNNER_TEMP/webroot.txt")
          echo "::notice title=Website folder::'$DIR' holds $total entries: ${entries:-nothing}"
          echo "dir=$DIR" >> "$GITHUB_OUTPUT"

          # 3. How the website answers right now.
          probe() { curl -sS -o /dev/null --max-time 20 -w '%{http_code} %{redirect_url}' "$1" 2>&1 || true; }
          home=$(probe "$SITE/")
          server=$(curl -sSI --max-time 20 "$SITE/" 2>/dev/null | tr -d '\r' | sed -n 's/^[Ss]erver: //p' | head -n 1 || true)
          title=$(curl -sS --max-time 20 "$SITE/" 2>/dev/null | grep -o '<title>[^<]*' | head -n 1 | sed 's/<title>//' || true)
          echo "::notice title=Website now::https: $home; server: ${server:-unknown}; title: ${title:-none}; http: $(probe "http://${SITE#https://}/"); www: $(probe "https://www.${SITE#https://}/")"
          case "$home" in
            2*|3*) echo "https_ok=true" >> "$GITHUB_OUTPUT" ;;
            *)     echo "https_ok=false" >> "$GITHUB_OUTPUT" ;;
          esac

          # 4. What the folder's own index.html is, what's in its assets
          #    folder, and whether the cloud web app shares this folder.
          idx_title=$(lftp -c "$SETUP; cd \"$DIR\" && cat index.html" 2>/dev/null | grep -o '<title>[^<]*' | head -n 1 | sed 's/<title>//' || true)
          if grep -qx 'assets/' "$RUNNER_TEMP/webroot.txt"; then
            assets=$(lftp -c "$SETUP; cd \"$DIR\" && cls -1F assets" 2>/dev/null | sed 's:^assets/::' | head -n 30 | paste -sd ',' - | sed 's/,/, /g' || true)
            n_assets=$(lftp -c "$SETUP; cd \"$DIR\" && find assets" 2>/dev/null | grep -vc '/$' || true)
          fi
          echo "::notice title=Folder's index.html and assets::index.html title: ${idx_title:-none}; assets/ holds ${n_assets:-0} files, top level: ${assets:-none}"
          cloud="https://cloud.${SITE#https://}/"
          c_head=$(probe "$cloud")
          c_title=$(curl -sS --max-time 20 "$cloud" 2>/dev/null | grep -o '<title>[^<]*' | head -n 1 | sed 's/<title>//' || true)
          main_sum=$({ curl -sS --max-time 20 "$SITE/" 2>/dev/null || true; } | sha256sum | cut -c1-12)
          cloud_sum=$({ curl -sS --max-time 20 "$cloud" 2>/dev/null || true; } | sha256sum | cut -c1-12)
          same="no"; [ "$main_sum" = "$cloud_sum" ] && same="yes"
          # A marker file uploaded here and looked for on both addresses
          # shows which address this folder really serves. It's removed
          # straight after.
          mark="ftp-check-$GITHUB_RUN_ID.txt"
          printf 'check %s\n' "$GITHUB_RUN_ID" > "$RUNNER_TEMP/$mark"
          lftp -c "$SETUP; cd \"$DIR\" && put \"$RUNNER_TEMP/$mark\" -o \"$mark\"" >/dev/null 2>&1 || true
          on_main=$(curl -sS -o /dev/null --max-time 20 -w '%{http_code}' "$SITE/$mark" 2>/dev/null || echo 000)
          on_cloud=$(curl -sS -o /dev/null --max-time 20 -w '%{http_code}' "$cloud$mark" 2>/dev/null || echo 000)
          lftp -c "$SETUP; cd \"$DIR\" && rm \"$mark\"" >/dev/null 2>&1 || true
          echo "::notice title=Cloud app address::$cloud answers $c_head, title: ${c_title:-none}; same page as the main address: $same. A test file put in this folder was found at the main address: $on_main, at the cloud address: $on_cloud (200 = this folder serves that address)."


      - if: env.MODE == 'upload'
        uses: actions/checkout@v7
        with:
          persist-credentials: false

      - if: env.MODE == 'upload'
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true

      - name: Build for the live address
        if: env.MODE == 'upload'
        env:
          JEKYLL_ENV: production
        run: |
          printf 'url: "%s"\nbaseurl: ""\nstaging: false\n' "$SITE" > "$RUNNER_TEMP/_config.live.yml"
          bundle exec jekyll build --trace --config "_config.yml,$RUNNER_TEMP/_config.live.yml"
          for f in index.html .htaccess app-ads.txt 404.html 404.php; do
            if [ ! -f "_site/$f" ]; then
              echo "::error::The build is missing _site/$f. Nothing was uploaded."
              exit 1
            fi
          done
          if grep -rlE '\{\{|\{%' --include='*.html' --include='*.xml' --include='*.txt' --include='*.css' --include='*.js' --include='*.json' _site; then
            echo "::error::The files above contain unrendered Liquid. Nothing was uploaded."
            exit 1
          fi
          if ! grep -q "<loc>$SITE/</loc>" _site/sitemap.xml; then
            echo "::error::The sitemap doesn't use $SITE. Nothing was uploaded."
            exit 1
          fi
          if grep -qi 'name="robots" content="noindex' _site/index.html || grep -q 'Disallow: /$' _site/robots.txt; then
            echo "::error::The live build is still marked noindex. Nothing was uploaded."
            exit 1
          fi

      - name: Back up and upload
        if: env.MODE == 'upload'
        env:
          DIR: ${{ steps.look.outputs.dir }}
          HTTPS_OK: ${{ steps.look.outputs.https_ok }}
        run: |
          SETUP=$(cat "$RUNNER_TEMP/lftp-setup")
          # .htaccess sends every visitor to https, so https has to work first.
          if [ "$HTTPS_OK" != true ]; then
            echo "::error::$SITE doesn't answer over https yet, and this site sends every visitor there. Turn on SSL for the domain in the hosting panel, then run this again. Nothing was uploaded."
            exit 1
          fi

          # Back up what the upload could replace: the website folder's
          # top-level files, and its assets and daily-info folders if any.
          # Skipped once the folder already holds this site (it has
          # daily-info/): every earlier version of it is in git.
          if grep -qx 'daily-info/' "$RUNNER_TEMP/webroot.txt"; then
            echo "::notice title=Backup::Skipped: the folder already holds this site, and its earlier versions are in git."
            skip_backup=true
          fi
          stamp=$(date -u +%Y%m%d-%H%M%S)
          bkdir="$RUNNER_TEMP/backup"
          mkdir -p "$bkdir"
          if [ "${skip_backup:-}" != true ]; then
            lftp -c "$SETUP; cd \"$DIR\" && mirror --no-recursion --parallel=4 . \"$bkdir\""
            for d in assets daily-info; do
              if grep -qx "$d/" "$RUNNER_TEMP/webroot.txt"; then
                lftp -c "$SETUP; cd \"$DIR\" && mirror --parallel=4 \"$d\" \"$bkdir/$d\""
              fi
            done
          fi
          nb=$(find "$bkdir" -type f | wc -l)
          if [ "${skip_backup:-}" = true ]; then
            :
          elif [ "$nb" -gt 0 ]; then
            if [ "$DIR" = "." ]; then
              # The login folder is the website: keep the backup in a
              # hidden folder that the server refuses to show.
              bk=".site-backups/$stamp"
              printf 'Require all denied\nDeny from all\n' > "$RUNNER_TEMP/deny.htaccess"
              lftp -c "$SETUP; mkdir -p .site-backups; put \"$RUNNER_TEMP/deny.htaccess\" -o .site-backups/.htaccess"
            else
              bk="site-backups/$stamp"
            fi
            lftp -c "$SETUP; mkdir -p \"$bk\"; mirror --reverse --parallel=4 --no-perms \"$bkdir\" \"$bk\""
            echo "::notice title=Backup::$nb files the upload could replace were copied to '$bk' on the server."
          else
            echo "::notice title=Backup::The website folder was empty, so there was nothing to back up."
          fi

          # Upload. No --delete here: removals are handled below, and only
          # for files this site itself put there.
          lftp -c "$SETUP; cd \"$DIR\" && mirror --reverse --parallel=4 --no-perms --verbose=1 \"$PWD/_site\" ."
          echo "::notice title=Upload::$(find _site -type f | wc -l) files uploaded to '$DIR'."

          # Remove what this site no longer has, safely. A file is deleted
          # only if this site uploaded it before (listed in the previous
          # .site-manifest.txt) or it's named in RETIRED_PATHS, and the new
          # build doesn't have it. Anything else on the server is left
          # alone and only reported. The backup folder, SSL checks
          # (.well-known) and cgi-bin are never touched.
          (cd _site && find . -type f | sed 's#^\./##' | sort) > "$RUNNER_TEMP/build.txt"
          lftp -c "$SETUP; cd \"$DIR\" && find" 2>/dev/null | grep -v '/$' | sed 's#^\./##' | sort > "$RUNNER_TEMP/server.txt" || true
          lftp -c "$SETUP; cd \"$DIR\" && cat .site-manifest.txt" 2>/dev/null | sort > "$RUNNER_TEMP/old-manifest.txt" || true
          read -r -a retired <<< "$RETIRED_PATHS"
          printf '%s\n' "${retired[@]}" | sort > "$RUNNER_TEMP/retired.txt"
          comm -23 "$RUNNER_TEMP/server.txt" "$RUNNER_TEMP/build.txt" \
            | grep -vE '^(\.site-backups/|\.well-known/|cgi-bin/|\.site-manifest\.txt$)' > "$RUNNER_TEMP/extra.txt" || true
          sort -u "$RUNNER_TEMP/old-manifest.txt" "$RUNNER_TEMP/retired.txt" > "$RUNNER_TEMP/ours.txt"
          comm -12 "$RUNNER_TEMP/extra.txt" "$RUNNER_TEMP/ours.txt" > "$RUNNER_TEMP/delete.txt"
          comm -23 "$RUNNER_TEMP/extra.txt" "$RUNNER_TEMP/ours.txt" > "$RUNNER_TEMP/left.txt"
          if [ -s "$RUNNER_TEMP/delete.txt" ]; then
            cmds=""
            while IFS= read -r f; do cmds="$cmds; rm -f \"$f\""; done < "$RUNNER_TEMP/delete.txt"
            lftp -c "$SETUP; cd \"$DIR\" $cmds"
            echo "::notice title=Removed::$(wc -l < "$RUNNER_TEMP/delete.txt") files this site no longer has: $(head -n 20 "$RUNNER_TEMP/delete.txt" | paste -sd ',' - | sed 's/,/, /g')"
          else
            echo "::notice title=Removed::Nothing to remove."
          fi
          if [ -s "$RUNNER_TEMP/left.txt" ]; then
            echo "::notice title=Left alone::$(wc -l < "$RUNNER_TEMP/left.txt") files on the server weren't put there by this site, so they were kept: $(head -n 20 "$RUNNER_TEMP/left.txt" | paste -sd ',' - | sed 's/,/, /g')"
          fi
          # Record what this site uploaded, for the next run.
          lftp -c "$SETUP; cd \"$DIR\" && put \"$RUNNER_TEMP/build.txt\" -o .site-manifest.txt"

      - name: Check the live site
        if: env.MODE == 'upload' || env.MODE == 'check'
        run: |
          sleep 5
          fails=0; report=""
          bust="v=$GITHUB_RUN_ID"
          check() { # name, url, expected status, text that must appear (optional)
            code=$(curl -sS -o "$RUNNER_TEMP/page" --max-time 25 -w '%{http_code}' "$2" 2>/dev/null || echo 000)
            if [ "$code" = "$3" ] && { [ -z "$4" ] || grep -qF "$4" "$RUNNER_TEMP/page"; }; then
              report="$report $1 ok;"
            else
              got=$(grep -o '<title>[^<]*' "$RUNNER_TEMP/page" 2>/dev/null | head -n 1 | sed 's/<title>//' || true)
              [ -n "$got" ] || got=$(head -c 120 "$RUNNER_TEMP/page" 2>/dev/null | tr -d '\r' | tr '\n' ' ' || true)
              report="$report $1 FAILED ($code, got: ${got:-empty});"; fails=$((fails+1))
            fi
          }
          redirect() { # name, url, where it should end up
            got=$(curl -sS -o /dev/null --max-time 25 -w '%{http_code} %{redirect_url}' "$2" 2>/dev/null || echo 000)
            case "$got" in
              30[18]" $3"*) report="$report $1 ok;" ;;
              *) report="$report $1 FAILED ($got);"; fails=$((fails+1)) ;;
            esac
          }
          check "home" "$SITE/?$bust" 200 '<link rel="canonical" href="'"$SITE"'/">'
          check "about (clean address)" "$SITE/about?$bust" 200 '<link rel="canonical" href="'"$SITE"'/about">'
          check "privacy policy" "$SITE/privacy-policy?$bust" 200 "DAILY UTILITY APPS PTY LTD"
          check "terms" "$SITE/terms-of-service?$bust" 200 "Terms of Service"
          check "a guide" "$SITE/daily-info/backup-vs-sync?$bust" 200 "Backup"
          check "app-ads.txt" "$SITE/app-ads.txt?$bust" 200 "pub-5899980541606715"
          check "missing file" "$SITE/assets/missing-$GITHUB_RUN_ID.png" 404 "Page not found"
          # .htaccess must never be shown: 403 or 404 are both fine, as
          # long as its rules don't come back.
          code=$(curl -sS -o "$RUNNER_TEMP/ht" --max-time 25 -w '%{http_code}' "$SITE/.htaccess" 2>/dev/null || echo 000)
          if { [ "$code" = 403 ] || [ "$code" = 404 ]; } && ! grep -q 'RewriteEngine' "$RUNNER_TEMP/ht"; then
            report="$report .htaccess hidden ok;"
          else
            report="$report .htaccess hidden FAILED ($code);"; fails=$((fails+1))
          fi
          check "robots.txt" "$SITE/robots.txt?$bust" 200 "Sitemap: $SITE/sitemap.xml"
          check "404 page" "$SITE/this-page-does-not-exist-$GITHUB_RUN_ID" 404 "Page not found"
          redirect ".html to clean" "$SITE/about.html" "$SITE/about"
          redirect "folder slash" "$SITE/daily-info" "$SITE/daily-info/"
          read -r -a retired <<< "$RETIRED_PATHS"
          for f in "${retired[@]}"; do
            case "$f" in *.html) u="${f%.html}" ;; *) u="$f" ;; esac
            check "removed: /$u" "$SITE/$u?$bust" 404 "Page not found"
          done
          redirect "http to https" "http://${SITE#https://}/" "$SITE/"
          echo "::notice title=Live checks::$report"
          # When the not-found page check fails, say what the server does
          # with a missing address and with the site's own 404 page.
          case "$report" in
            *"404 page FAILED"*)
              miss="$SITE/this-page-does-not-exist-$GITHUB_RUN_ID"
              hdrs=$(curl -sS -o /dev/null -D - --max-time 20 "$miss" 2>/dev/null | tr -d '\r' | grep -iE '^(server|content-type|content-length|x-[a-z-]+|via|cf-ray):' | paste -sd ';' - || true)
              p404=$(curl -sS -o "$RUNNER_TEMP/p404" --max-time 20 -w '%{http_code}' "$SITE/404" 2>/dev/null || echo 000)
              t404=$(grep -o '<title>[^<]*' "$RUNNER_TEMP/p404" 2>/dev/null | head -n 1 | sed 's/<title>//' || true)
              body=$(curl -sS --max-time 20 "$miss" 2>/dev/null | sed -e 's/<[^>]*>/ /g' | tr -s ' \n\r\t' ' ' | head -c 300 || true)
              echo "::notice title=Not-found page text::${body:-empty}"
              echo "::notice title=Not-found diagnostics::missing address headers: ${hdrs:-none}; /404 answers $p404 (${t404:-no title}); /404.html answers $(curl -sS -o /dev/null --max-time 20 -w '%{http_code} %{redirect_url}' "$SITE/404.html" 2>/dev/null || echo 000)"
              ;;
          esac
          if [ "$fails" -gt 0 ]; then
            echo "::error::$fails live check(s) failed. The files were uploaded; see 'Live checks' for which pages didn't answer as expected."
            exit 1
          fi
```

### Appendix L: CloudGate _includes/head.html (light/dark, SEO tags)

```liquid
{%- comment -%}
  Everything in <head> that search engines and link previews read. Nothing
  here is hand-written per page: the canonical comes from the page's own URL,
  so a renamed or new page can never ship with a stale or missing canonical.
{%- endcomment -%}
{%- assign cg_path = page.url | replace: '/index.html', '/' | replace: '.html', '' -%}
{%- if cg_path == '/' -%}{%- assign cg_canonical = site.url | append: '/' -%}{%- else -%}{%- assign cg_canonical = site.url | append: cg_path -%}{%- endif -%}
{%- assign cg_noindex = false -%}{%- if site.staging or page.robots contains 'noindex' -%}{%- assign cg_noindex = true -%}{%- endif -%}
{%- assign cg_v = site.time | date: '%s' -%}
{%- assign cg_image = page.og_image | default: '/og-image.png' | prepend: site.url -%}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{{ page.title }}</title>
<meta name="description" content="{{ page.description }}">
<meta name="robots" content="{% if site.staging %}noindex, nofollow{% elsif page.robots %}{{ page.robots }}{% else %}index, follow, max-image-preview:large{% endif %}">
{%- unless page.robots contains 'noindex' %}
<link rel="canonical" href="{{ cg_canonical }}">
{%- endunless %}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F5F7FE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B0D14" media="(prefers-color-scheme: dark)">
{%- comment -%} Runs before the stylesheet paints: a saved light/dark choice
applies on the first frame, so the page never flashes the other theme. {%- endcomment %}
<script>(function(d){d.classList.add('js');try{var t=localStorage.getItem('cg-theme');if(t==='light'||t==='dark'){d.setAttribute('data-theme',t);document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=t==='dark'?'#0B0D14':'#F5F7FE'})}}catch(e){}})(document.documentElement)</script>
<link rel="preload" href="/assets/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v={{ cg_v }}">
{%- if page.extra_css %}
<link rel="stylesheet" href="{{ page.extra_css }}?v={{ cg_v }}">
{%- endif %}
<script src="/assets/js/site.js?v={{ cg_v }}" defer></script>
{%- if page.extra_js %}
<script src="{{ page.extra_js }}?v={{ cg_v }}" defer></script>
{%- endif %}

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<meta property="og:type" content="{% if page.type == 'article' %}article{% else %}website{% endif %}">
<meta property="og:site_name" content="{{ site.title }}">
<meta property="og:locale" content="{{ site.locale }}">
<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description }}">
<meta property="og:url" content="{{ cg_canonical }}">
<meta property="og:image" content="{{ cg_image }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="CloudGate Storage: 100GB free cloud storage for Android, iPhone and the web">
{%- if page.type == 'article' and page.last_modified_at %}
<meta property="article:modified_time" content="{{ page.last_modified_at | date_to_xmlschema }}">
<meta property="article:section" content="{{ page.parent_title }}">
{%- endif %}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ page.title }}">
<meta name="twitter:description" content="{{ page.description }}">
<meta name="twitter:image" content="{{ cg_image }}">
{%- unless page.robots contains 'noindex' %}
{% include schema.html canonical=cg_canonical image=cg_image %}
{%- endunless %}
```

### Appendix M: CloudGate llms.txt

```markdown
# CloudGate Storage

> Cloud storage app for Android, iPhone and the web. 100GB free cloud storage
> for photos, videos and documents, with 250GB, 500GB and 1TB plans available.
> Storage allowances are defined limits; there is no unlimited plan.

CloudGate Storage is published by CloudGate Technologies Pty Limited (ACN 673 209 553),
based in Canning Vale, Western Australia.

## Plans
- Free: 100GB, no card required, not a trial
- Plus: 250GB
- Pro: 500GB
- Family: 1TB
Monthly and yearly billing are both available.

## Core pages
- [Home](https://www.cloudgate-app.com): what the app does and who it is for
- [Features and plans](https://www.cloudgate-app.com/features): capabilities and the four storage tiers
- [Cloud Tips](https://www.cloudgate-app.com/cloud-tips): index of setup and how-to guides

## Guides
- [How to back up your phone to free cloud storage](https://www.cloudgate-app.com/guides/backup-setup): full walkthrough for Android, iPhone and web
- [Cloud storage for Android](https://www.cloudgate-app.com/guides/cloud-storage-android): permissions, folder selection, battery optimisation, Samsung Device Care
- [Free cloud storage for iPhone](https://www.cloudgate-app.com/guides/cloud-storage-iphone): All Photos vs Limited Access, background refresh, Low Power Mode
- [What 100GB free cloud storage gets you](https://www.cloudgate-app.com/guides/free-cloud-storage-100gb): capacity in photos, video and documents
- [Cloud storage for videos and large video files](https://www.cloudgate-app.com/guides/cloud-storage-for-videos): real 1080p and 4K file sizes, where to store large videos, backing up without using mobile data
- [Cross platform cloud storage across your devices](https://www.cloudgate-app.com/guides/cross-platform-cloud-storage): one account on Android, iPhone and the web, and switching phone platforms
- [How to backup photos](https://www.cloudgate-app.com/guides/how-to-backup-photos): where to store photos online, originals versus compressed copies, photos other people sent you
- [Phone storage full? How to free up space safely](https://www.cloudgate-app.com/guides/phone-storage-full): back up, verify, then delete; finding what is using the space
- [Move everything to a new phone in one sitting](https://www.cloudgate-app.com/guides/switch-to-new-phone): order of operations and what to check before a factory reset
- [Web cloud storage](https://www.cloudgate-app.com/guides/web-cloud-storage): uploading and opening files in a browser with nothing to install
- [Why your backup is quietly skipping files](https://www.cloudgate-app.com/guides/why-backups-skip-files): the real reasons backups miss files and how to check each one

## Legal
- [Privacy Policy](https://www.cloudgate-app.com/privacy-policy)
- [Terms of Service](https://www.cloudgate-app.com/terms-of-service)
```

