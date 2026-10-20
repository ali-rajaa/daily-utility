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
| Fonts | Inter (body), Space Grotesk (numbers), self-hosted | The device's system font (SF Pro on Apple devices), nothing downloaded |
| Look | Own design system; light and dark, follows the device, with a toggle | apple.com's web style: monochrome with one blue; light only (owner's choice) |
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
│   ├── header.html          # apple.com-style bar: mark, Apps, Guides, About, Help, Sign in
│   ├── footer.html
│   ├── brand-mark.html      # the logo mark (PNG + WebP)
│   ├── app-tile.html        # white glyph on a coloured tile (never a real app icon)
│   ├── store-badges.html    # App Store / Google Play buttons, drawn in SVG
│   ├── platforms.html       # "iPhone and Android" from which store links exist
│   ├── faq-section.html     # visible FAQ (details/summary)
│   ├── faq-schema.html      # the same questions as FAQPage JSON-LD
│   ├── breadcrumb-schema.html
│   ├── post-card.html       # guide card used on the hub, homepage, app pages
│   ├── scripts.html         # <script src=site.js defer>
│   └── home/                # homepage sections: hero, app-promo, jobs, switch, privacy, guides, schema
├── _layouts/
│   ├── default.html         # <head>, SEO tags, header, <main>, footer
│   ├── app.html             # app landing page, built entirely from front matter
│   ├── post.html            # guide/article
│   ├── legal.html           # privacy/terms with a generated table of contents
│   └── upcoming.html        # placeholder for an app page not yet written
├── assets/
│   ├── css/shell.scss       # tokens, base, buttons, header, footer, shared components
│   ├── css/pages/*.scss     # one per page type: index, app, post, blog-hub, about, contact, legal, not-found
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

Daily Utility follows **apple.com's web design language** (redesigned 19 Oct 2026; STATUS.md 5zzz). Tokens and shared components live in `shell.scss` as CSS custom properties; the header has its own `header.scss`, loaded on every page straight after it; page stylesheets read the tokens and never redefine them. No raw hex values in components. CloudGate keeps its own Inter-based system with light and dark modes (section 8.7).

### 8.1 Colour tokens (Daily Utility)

```css
--bg: #ffffff;        --bg-alt: #f5f5f7;     --surface: #ffffff;
--text: #1d1d1f;      --text-2: #6e6e73;     /* 5.1:1 on white, 4.7:1 on #f5f5f7 */
--border: #d2d2d7;    --border-strong: #86868b;
--brand: #0b5fe8;     --brand-hover: #0848b8;  --on-brand: #ffffff;
--brand-soft: #f5f5f7;                         /* quiet panels and icon chips */
--brand-text: #0a52c9;                         /* the blue used for text links */
--brand-ink: linear-gradient(90deg, #0b5fe8 0%, #0b76a3 55%, #0a7a47 100%);
                     /* the logo's blue-to-green, as text (.brand-ink) */
```

- **Monochrome with one blue.** Near-black text, Apple's greys, white and `#f5f5f7` surfaces. Every button and link uses the same blue, sampled from the real logo, on every page.
- **Every text/background pair is measured for WCAG AA 4.5:1** before use, and the CSS comment records the result.
- **One touch of the logo's colours:** `.brand-ink` paints text with `--brand-ink`, the logo's blue-to-green sweep darkened until every stop passes 4.5:1 on white and on `#f5f5f7` (blue 5.5 / 5.05, teal 5.08 / 4.66, green 5.4 / 4.96). It is used in three places only: "Utility" in the header name, "Daily Utility Apps." opening the homepage headline, and the "Flagship" label. Under `prefers-contrast: more` and forced colours it falls back to solid `--brand-text`. Don't spread it further: the design stays monochrome with one blue.

### 8.2 Tones (per-product colour, used sparingly)

Each product has a tone class (`.tone-blue`, `.tone-violet`, `.tone-teal`, `.tone-rose`). A tone colours **only that product's own things**: its icon tile (`--tone-gradient`), a soft glow behind it (`--tone-light`) and a short accent label (`--tone-text`, contrast-checked). Buttons and links stay blue whatever the product, as on apple.com.

### 8.3 Typography

- **The device's own system font**, nothing downloaded:
  `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif`. SF Pro on Apple devices, Segoe UI on Windows, Roboto on Android. Headings and body share it; hierarchy comes from size, weight and tracking. (Apple's font files are never served: they're Apple's.)
- Headings semibold (600) with tight tracking: h1 `clamp(2.5rem, 1.6rem + 3.6vw, 4rem)`, line-height 1.06, -0.015em; h2 up to 3rem; h3 21px.
- Body 17px (1.0625rem), line-height 1.47; intro text 18–21px at 1.5; small labels 12px minimum.
- `text-wrap: balance` on headings, `text-wrap: pretty` on intros. Spacing in `rem`, so the layout grows with the user's text size.
- **Straight quotes and apostrophes everywhere** (`'` and `"`), as typed. Pages written in HTML and YAML can't curl them, so kramdown's `smart_quotes` is set to straight too (`_config.yml`); otherwise a guide mixes both on one page.
- **Two-tone headlines** where a section introduces itself, as on Apple's Store: the name in black, what it is in grey, one heading ("Daily Utility Apps. *Simple apps for your phone's everyday jobs.*").

### 8.4 Spacing, shape, depth

```css
--ap-wrap: 61.25rem;                   /* the 980px content column, every page */
--gutter: clamp(1rem, 4vw, 2rem);      /* never under 16px on phones */
--header-h: 3rem;                      /* 2.75rem (44px) from 760px up */
--ap-pad: clamp(4.5rem, 10vw, 8.5rem); /* a white section, top and bottom */
--ap-pad-panel: clamp(4.5rem, 9vw, 7.5rem); /* a grey row */
--ap-gap: 12px;                        /* between panels and cards */
--radius-sm: 10px; --radius: 12px; --radius-lg: 18px; --radius-pill: 980px;
--shadow-sm: 0 1px 2px rgba(0,0,0,.05);
--shadow-md: 2px 4px 12px rgba(0,0,0,.08);   /* soft, directional */
--shadow-lg: 2px 4px 16px rgba(0,0,0,.16);   /* hover */
```

- **Crisp 1px hairlines** (`--border`) between rows and list items; cards use a soft shadow instead of a border, or a grey `#f5f5f7` fill on white.
- **Edge-to-edge panels with 12px gaps** for big product tiles, like apple.com's homepage.
- Breakpoints: **480** (buttons full width below), **600** (tables become cards, app pages compact), **760** (phone menu below, full bar above), **900** (two-column layouts above). Written as `max-width: 599.98px` / `min-width: 600px` so they never overlap.

### 8.5 Icons

- **One set of shapes, in data:** `_data/icons.yml` holds every icon (the inside of a 24×24 SVG) and the drawing spec. Chevrons are drawn pointing the way they mean (`chevron-down`, `chevron-right`), never rotated by CSS.
- **Inline icons:** `{% include icon.html name="lock" class="…" size="40" %}` draws one inline: its own `viewBox`, `width` and `height`, stroked in `currentColor`, `aria-hidden`. An unknown name stops the build (the include calls a filter that doesn't exist, and `strict_filters` is on), so a typo can't ship an empty icon. Every page uses it (homepage in Phase 2, every other page in Phase 3, 20 Oct).
- **The sprite** (`icon-sprite.html`, after `<body>`) is built from the same data for the one piece still on `<use>`, the footer; it goes with the footer's rewrite.
- **One drawing spec:** 24×24 grid, 2-unit margin, 1.75 stroke, round caps and joins, no fills.
- In content, icons are plain blue glyphs (no coloured squares). Decorative icons get `aria-hidden="true"`; icon-only buttons get an `aria-label`. No emoji.

### 8.6 App tiles (instead of real logos)

`app-tile.html`: a rounded square (radius 23%) filled with the app's `--tone-gradient`, a white sprite glyph at about 54%, an inset top highlight and a soft shadow. Chiclets, the compare table, guide cards and guide heroes use it, with the app's or topic's colour.

**Phone frames (big product visuals).** `phone-frame.html` draws a device-neutral phone in CSS: a dark frame, a camera dot, rounded corners, no maker's design or logo. Every size comes from one custom property, `--phone-w`. The screen shows a launch screen built from what the site already has: the app's colour, glyph and name (the owner chose to keep these, 20 Oct). A real screenshot can still be added: set `screenshot:` on the app's `apps.yml` entry (a portrait PNG or JPEG from the app, saved in `assets/screens/`). **Never draw a made-up app interface.** On the homepage tiles the phone is cropped by the foot of the tile, apple.com style, and the launch content moves up into the part that shows. On app pages the whole phone sits on the grey panel, with the feature labels floating above it. A label may cross the frame's edge, but none may reach the glyph and name or leave the panel (checked at every width from 320 to 1600). Callers put the frame inside an `aria-hidden` visual.

### 8.7 Light and dark

- **Daily Utility is light only.** `color-scheme: light`, `<meta name="color-scheme" content="light">`, `theme-color #ffffff`.
- **CloudGate does both.** Light tokens in `:root`; dark tokens under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and again under `:root[data-theme="dark"]`. A tiny inline script in `<head>` reads `localStorage['cg-theme']` before the stylesheet paints. The toggle uses the View Transitions API: the new theme grows as a circle from the pressed button. With reduced motion it's a plain cross-fade.

---

## 9. UI/UX: components and page patterns

### 9.1 Header (apple.com's global bar)

- **Its own stylesheet:** `assets/css/header.scss` holds every header rule, including its reduced-motion, reduced-transparency and high-contrast versions. `shell.scss` keeps only the tokens and the chrome colours shared with the footer.
- **A low frosted bar** (44px, 48px on phones): `rgba(255,255,255,.7)` with `backdrop-filter: saturate(180%) blur(20px)`, content scrolling under it; a hairline appears once content passes under (`.is-scrolled`, set by `site.js`). It turns solid with reduced transparency or more contrast.
- **Icons are inline SVG** with their own `viewBox`, `width` and `height`, drawn in `currentColor`: the menu button's two lines (which morph into a cross), a right chevron on Apps and Help in the phone menu, a left chevron on the panel's back button and a person on Sign in. The logo stays the owner's image.
- **Instant press feedback:** links and buttons dim to 60% the moment they're pressed (`:active`, no transition) and ease back when released.
- **Desktop (760px+):** three columns (`grid-template-columns: minmax(max-content, 1fr) auto minmax(max-content, 1fr)`): the mark and the name "Daily *Utility* Apps" (Utility in `.brand-ink`) at the left; Apps · Guides · About · Help **centred on the bar as a group** in 12px type, `clamp(1rem, 2.6vw, 2.25rem)` apart plus each link's padding (36px at 760, 52px at 1440); Sign in at the right edge. The equal side columns keep the group in the true middle; with enlarged text a side column grows rather than overlap. Sign in is written twice: in the list (shown in the phone menu) and in `.bar-signin` after the nav (shown in the bar), with CSS showing one at a time. The wrapper gives the bar copy its own hover area for `site.js`.
- **Menus:** Apps and Help open full-width panels that grow down from the bar (`clip-path` reveal), big 24px links on the left, small 12px links in columns beside them, each link fading in a moment after the one above. The bar turns solid while a menu is open, and **the page behind takes a faint tint, no blur** (owner's choice). Open on hover after a 140ms intent delay or on click; Escape closes and returns focus; moving to a plain link closes the menu.
- **Phones:** the mark and name, and a two-line menu button that turns into a cross. The menu slides down from the bar (a `clip-path` reveal on the site's spring curve; a plain fade with reduced motion) and fills the screen below it with large 28px links that fade in one by one, and the page behind can't scroll. Apps and Help **slide in from the right as their own panel** with a "‹ Menu" back button (focus moves to it); Escape closes the panel first, then the menu.
- Menus are disclosure buttons (`aria-expanded`, `aria-controls`). Without JavaScript the menus open at once on hover and focus, and the phone links stay reachable.

### 9.2 Hero

Every page opens the same way (Phase 3, 20 Oct): the breadcrumb trail centred at the top (not on the homepage), then the H1 very large and centred (`--ap-display`, weight 700, about 16 characters a line; guide titles a step smaller), its lead (`--ap-lede`, grey, 1.47 leading) and the main actions as a centred pill pair. Below it, a **grey stage**: a full-width row inset 12px holding the page's one picture: the app on a phone frame with white feature chips (app pages), the topic's tile ringed by hairlines with the article's own numbers under it (guides), the newest guide as one wide card (Daily Info), the apps' tiles (About), the email card (Contact), the apps (404). Legal pages are text pages and have no stage. No coloured gradients or animated blobs. The opening is never a scroll-reveal element (it would delay the largest paint).

### 9.3 Homepage (Daily Utility)

Phase 2 (20 Oct). A rhythm of full-bleed rows and tiles, white and grey in turn; every section heading uses one size (`--ap-h2`) and every lead another (`--ap-lede`), in `index.scss`.

1. **Cinematic opening** (white): centred. The H1 is the name in `.brand-ink` over one very large line (`--ap-display`, 44–84px, weight 700): "Daily Utility Apps: Simple apps for your phone's everyday jobs." Then a lead naming the jobs (never a count), a filled **Explore the apps** and an outlined **Read our guides** pill (side by side on phones, stacked under 360px), and every app as a "chiclet" (tile + short name), centred while it fits and a sideways swipe when it doesn't (`justify-content: safe center`).
2. **Flagship tile** (grey): eyebrow, product name, tagline, "Free to download on iPhone and Android", **Learn more** and **Download** pills, feature chips, then the app on a phone cropped by the tile's foot.
3. **Promo tiles** (grey): every other app two to a row with 12px gaps; an odd one out spans the full width.
4. **Compare table** (white): "Which kind of app do you need?", one column per job, rows aligned with CSS subgrid; a sideways swipe on phones.
5. **Switching steps** (grey row): the heading centred on top, the steps as columns under large blue numerals.
6. **Privacy bento** (white): a dark `#1d1d1f` lead card (lock mark, heading, link in `#2997ff`) beside the commitments as grey cards two by two; lead on top below 900px, one column below 600px.
7. **Guides shelf** (grey row), the FAQ (white), and the **closing action** (grey row): the flagship tile, "Start with a backup.", store badges.

All of it reads from data; nothing states how many apps there are.

### 9.4 Product page (Daily Utility `app.html`)

Built entirely from front matter, white and grey in turn. Opening (the app's tile and "Free to download on …", name, tagline, store badges with `id="download"`, "By Daily Utility Apps" and "Your data is never sold") over the grey stage (the app on a phone frame with feature chips, then links to the sections) → moments (white: grey cards two by two) → how it works (grey: numbered columns) → features (white: grey cards, a bento with the first card 2×2 once there are six) → optional compare (grey: a light "without" card beside a dark "with" card) → tips (white: numbered cards) → related guides (grey: a sideways shelf) → FAQ (white) → other apps (grey) → closing pair (white: a grey "Get the app" card beside a dark "Your privacy" card).

### 9.5 Guides hub and guide pages

- **Hub:** the opening (a "Daily Info" pill, H1 with a grey second half, counts of guides and topics) over a grey stage with the newest guide as one wide white card (banner left, guide right; stacked on phones) → topics (white: four grey cards with the topic's tile, line and "N guides ›"; two by two on tablets, compact rows on phones) → every guide by topic (grey: each topic's tile, name and line over its guide cards, hairlines between topics) → a dark closing card for the backup app.
- **Guide cards:** Apple Store cards: white, 18px corners, soft shadow, a quiet grey banner with the topic tile; they grow 1% on hover. Category label in the topic's accent colour. Compact rows on phones.
- **Guide page:** the opening (topic pill, title, lead, byline and dates) over a grey stage (the topic's tile ringed by hairlines on a glow of its colour, then the article's own numbers: minutes, sections or steps, quick answers) → the article (white): a 42rem reading column beside a 14.5rem rail with the app card and the contents (a grey card, pinned on wide screens, folded on phones, highlights the section being read); "The short version" and the closing note as grey cards; steps as numbered markers joined by a hairline; share button → FAQ (grey row) → "More from Daily Info." (white: three guide cards, then every topic as a grey card) → a dark closing card for the backup app. Tables become cards on phones. The coming-soon layout shares the opening and stage.

### 9.6 Contact page

The opening over a grey stage with the support email on one white card ("Write an email" and "Copy address" pills) → one mailto link per product as a grouped list (white; the product named in the subject) → what to put in an email (grey: numbered columns, then the password note) → links to the FAQ, guides and privacy choices as grey cards (white). **No phone number, address, hours or reply-time promise** unless confirmed.

### 9.7 Legal pages

The opening (H1, lead, "Effective and last updated …" with a clock icon), then the document (white): a 42rem reading column beside a contents list generated from front matter (a grey card, pinned on wide screens, folded on phones); each section opens on a hairline; callouts and the company details as grey cards. Layout only: the documents' text is the owner's. Content rules are in section 15.

### 9.8 404

A large grey "404" (decorative, hidden from screen readers), the H1, homepage and guides pills, then the products as white cards on a grey stage. `noindex`, no canonical, out of the sitemap, and a real 404 status (Appendix I).

### 9.9 Footer (apple.com's)

Light grey `#f5f5f7`, 12px type, `#424245` links. A short note line; a "you are here" trail (logo › page, logo › Daily Info › guide on guides, matching the top breadcrumb and BreadcrumbList) on every page except the homepage; five directory columns (Apps, Daily Info, Help, Company, Get the app) that **fold on phones** (details/summary, closed by script, open without it); a "More ways to get help" line with the Contact page and support email; then copyright and legal links. No parent company, no "powered by".

### 9.10 Buttons and badges

- apple.com's pill pair: `.btn--primary` (filled blue) and `.btn--ghost` (blue outline that fills on hover). 17px regular, 44px tall, 980px radius, scale to 0.97 on press.
- Text links read "Learn more ›" with a chevron that steps forward on hover.
- **Store badges are drawn in SVG** (black, thin grey border) with accessible names.

### 9.11 Section scaffold

Every page is built from the blocks in shell.css "Page building blocks"; page stylesheets arrange them and add only what the page has of its own.

- `<section class="ap-section" aria-labelledby="…-title"><div class="ap-wrap">…`: a white section on the 980px column. `.ap-panel` instead is a grey row inset 12px. Alternate them; a page ends on white, so the grey footer never meets a grey row.
- `.ap-head`: the H2 (`--ap-h2`) and its lead centred over the content. `.ap-head-row`: the H2 on the left and its "All guides ›" link on the right. The FAQ keeps its heading beside the questions (`faq-section.html`; `alt=true` puts it on a grey row).
- `.ap-cards` of `.ap-card`: grey cards on white, white on a grey row; `.ap-card-icon` takes the page's tone. `.ap-card--dark` (`#1d1d1f`) is the one dark accent a section may carry; on it text is `#f5f5f7`, lines `#a1a1a6` and links and focus `#2997ff`.
- `.ap-steps`: numbered columns under large numerals. `.ap-shelf`: a sideways row of cards from the column's edge to the screen's. `.ap-link`: "Learn more ›". `.ap-ctas`: a centred pill pair.
- Press feedback on everything you can tap: links dim to 60%, cards press to 98.5%, pills to 97%, at once. Hover lifts sit inside `@media (hover: hover)` so they never stick on phones.

---

## 10. Motion and animation

Principles (Apple's *Designing Fluid Interfaces*, applied to CSS):

1. **Animate only `transform` and `opacity`** (and `clip-path` for menus growing from the bar).
2. **Respond on press, not release:** `:active { transform: scale(0.97) }` with a 100ms transition. A no-op `touchstart` listener makes `:active` work on iOS Safari.
3. **A spring curve, not a linear fade.** `--spring` is a critically damped spring (damping 1.0, response about 0.4s) sampled into CSS `linear()`, with `cubic-bezier(.22,1,.36,1)` as the fallback; `--spring-dur: 0.42s`.
4. **Hover effects only where hover exists** (`@media (hover: hover)`); exits faster than entrances; things leave the way they came; menus grow from the bar.

| Motion | How |
|---|---|
| **Scroll reveal** | `.reveal` blocks fade up 1rem over 0.6s when 10% enters the viewport (`IntersectionObserver`), then stop being observed. Hidden only once the observer exists. Never on the first screen |
| **Promo tiles** | Their visuals rise into place tied to scroll position (`animation-timeline: view()`), so it's reversible; skipped where unsupported |
| **Cards** | Grow 1% with a deeper shadow on hover, on the spring curve |
| **Header menus** | Panel grows down (`clip-path`), links fade in 20ms apart; phone panels slide in from the right; the menu button's two lines turn into a cross |
| **Links** | The "›" chevron steps forward 3px on hover |
| **CloudGate FAQ** | A JavaScript critically damped spring that starts from the current height and velocity, so it reverses smoothly mid-flight |

**User preferences, always:** `prefers-reduced-motion` removes movement (fades only); `prefers-reduced-transparency` and `prefers-contrast: more` make the header solid and strengthen borders.

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
- **Fonts:** none downloaded; the system font renders immediately.
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

`ftp.yml` (Appendix K) uploads automatically on every push to `main` (pushes that only change notes such as STATUS.md are skipped; pushes close together queue so the server ends on the newest commit). It can also be run by hand from the Actions tab with one of three modes:

- **look**: logs in, finds the website folder, lists what's there. Changes nothing. Run this first on a new host.
- **upload**: builds with the live address (`url` = the real domain, `staging: false`), checks the build (key files present, no unrendered Liquid, sitemap uses the live address, no `noindex`), checks https works, backs up the current site to `.site-backups/` on the server (first upload only), mirrors `_site` up with `lftp mirror --reverse`, then **deletes only files that the previous upload put there** (listed in `.site-manifest.txt`) or that are named in `RETIRED_PATHS`. Anything else on the server (the host's own files, other apps) is left alone and reported. Then runs the live checks.
- **check**: requests the live pages and fails if any answer is wrong: home, about, privacy (must contain the legal name), terms, a guide, `app-ads.txt`, a missing file (404), `.htaccess` hidden, robots, the 404 page, `.html` → clean redirect, folder slash redirect, page slash redirect (`/about/` → `/about`), an address past a page (`/about/x`, 404), `/index` → `/`, `/404` answering 404, retired pages gone, http → https.

**Secrets** (repo → Settings → Secrets and variables → Actions): `FTP_USERNAME`, `FTP_PASSWORD`. The owner pastes them there. The password is passed to `lftp` through an environment variable (`--env-password`), never on the command line. Host, folder and TLS mode are workflow variables with defaults (`FTP_TLS` "loose" for shared hosts with mismatched certificates).

**`.htaccess`** (Appendix H) handles no-www then https redirects (www first, so `http://www.` takes one hop), folder slashes, `.html` and `/index` → clean redirects (using `THE_REQUEST` so the internal rewrite never loops), a page with a trailing slash → its clean address, serving `/x` from `x.html`, `/404` and anything missing through `404.php`, hiding `.ht*` and the manifest, caching, gzip and two security headers.

**Test `.htaccess` on a real Apache before uploading** (`apt-get install apache2`, a vhost with `AllowOverride All` on a copy of `_site`, requests with a `Host:` header and `X-Forwarded-Proto: https`). A rewrite mistake answers 500 for the whole site. Apache maps `/about/` to the file `about` plus a trailing `/`, so a rewrite that appends `.html` to whatever was asked for turns `/about/` into `about/.html`, `about/.html.html` and so on until the server gives up with a 500. That was live until 20 Oct. The clean-URL rewrite must never match an address ending in `/` or one already ending in `.html`, and `/about/` gets its own redirect first.

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
| A sideways swipe row whose columns use CSS subgrid widened the whole page on phones (Chromium) | `contain: paint` on the section; clipping the row alone wasn't enough |
| Phone menu panel sat inside the page margins | Don't make the bar's centred inner row `position: relative`; place menus against the full-width header |
| `/about/` (a page with a slash on the end) answered 500 | Apache read it as `about` + `/`; the clean-URL rewrite looped. A slash redirect first, and the rewrite skips addresses ending in `/` or `.html` (Appendix H). Test rules on a real Apache |
| Logos sat 7px in from the edge, or off-centre in the footer | `picture { display: contents }` left its `<source>` as an empty flex/grid item; `picture > source { display: none }` |
| Guides had curly apostrophes in the text and straight ones in titles and FAQs | kramdown curls quotes in Markdown only; `smart_quotes` set to straight in `_config.yml` so every page matches |

---

## 19. Build order for the new site

1. **Collect facts from the owner**: name, domain, products and their store links, support email, logo files, colours (or sample them from the logo), the legal intake (15.3), whether they want dark mode, analytics yes or no. Start `STATUS.md` with them.
2. **Scaffold**: `Gemfile`, `_config.yml` in preview state (`staging: true`), `.gitignore` (`_site/`, `.jekyll-cache/`, `.bundle/`, `vendor/`), `pages.yml`. Push and confirm the preview builds and is noindex.
3. **Shell**: `default.html` (head, SEO tags), `shell.scss` (tokens, system font, base, buttons, section scaffold), icon sprite, header, footer, `site.js` (header state, menus, reveal). Check the header at every width before going on.
4. **Shared includes**: breadcrumbs + schema, FAQ section + schema, store badges, product tile, guide card.
5. **Layouts**: product, guide, legal. Write each one's front matter contract in its header comment and in `STATUS.md`.
6. **Pages**: home, products, about, contact, guides hub, legal, 404. Content only from confirmed facts.
7. **SEO files**: `sitemap.xml`, `robots.txt`, `feed.xml`, `llms.txt` if wanted, favicons, share cards.
8. **QA** (section 17) until clean. Then a phone-only pass and a motion/reduced-motion pass.
9. **Go live**: switch the custom domain or run the FTP upload; set `staging: false` for the live build; run the live checks; Search Console; update the store listings' URLs.
10. **Keep `STATUS.md` current** and list everything still waiting on the owner in its open items.

---

## 20. Appendices: full source files

These are the real files from Daily Utility Apps as of the 19 Oct redesign (Appendices A–K) and CloudGate (L–M) as they stand. Change names, domains, colours and copy for the new site; keep the structure and the checks.

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

### Appendix E1: Design tokens, spring curve, reveal and user preferences (from assets/css/shell.scss)

```css
:root {
  --bg: #ffffff;
  --bg-alt: #f5f5f7;
  --surface: #ffffff;
  --surface-glass: rgba(255, 255, 255, 0.72);
  --text: #1d1d1f;
  --text-2: #6e6e73;          /* 5.1:1 on white, 4.7:1 on --bg-alt */
  --border: #d2d2d7;          /* hairlines */
  --border-strong: #86868b;
  --brand: #0b5fe8;
  --brand-hover: #0848b8;
  --on-brand: #ffffff;
  --brand-soft: #f5f5f7;      /* quiet panels and icon chips: Apple grey */
  --brand-text: #0a52c9;
  /* Sampled directly from the real logo mark (assets/icons/mark.png), not
     a generic accent: the icon sweeps from this blue to this green. Used
     for decoration only (borders, the logo itself) -- never
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

  /* Soft, directional (light from above-left), never a hard drop. */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 2px 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 2px 4px 16px rgba(0, 0, 0, 0.16);

  --radius-sm: 10px;
  --radius: 12px;
  --radius-lg: 18px;
  --radius-pill: 980px;

  /* The device's own system font: SF Pro on Apple devices, Segoe UI on
     Windows, Roboto on Android. Nothing to download, and each one ships
     with its own optical sizes and spacing tables. Headings and body use
     the same family; hierarchy comes from size, weight and tracking. */
  --font: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif;
  --font-heading: var(--font);
  --gutter: clamp(1rem, 4vw, 2rem);
  --header-h: 3rem;
  /* One type scale and one pacing for every page (the homepage set it in
     Phase 2; every page uses it from Phase 3, 20 Oct). */
  --ap-display: clamp(2.75rem, 1.35rem + 5.6vw, 5.25rem);   /* a page's one big line */
  --ap-h2: clamp(2.125rem, 1.35rem + 3.2vw, 3.5rem);        /* every section heading */
  --ap-lede: clamp(1.1875rem, 1rem + 0.75vw, 1.5rem);       /* the line under it */
  --ap-pad: clamp(4.5rem, 10vw, 8.5rem);                    /* a white section */
  --ap-pad-panel: clamp(4.5rem, 9vw, 7.5rem);               /* a grey row */
  --ap-gap: 12px;                                           /* between panels and cards */
  --ap-wrap: 61.25rem;                                      /* 980px content width */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  /* Motion: a critically damped spring (damping 1.0, response ~0.4s),
     sampled into linear() where supported, else its closest curve. */
  --spring: cubic-bezier(0.22, 1, 0.36, 1);
  --spring-dur: 0.42s;

  /* Light only (user, 14 Oct: "light looks way better"). Telling the
     browser keeps form controls and scrollbars light too, even when the
     device is set to dark mode. */
  color-scheme: light;
}

@supports (transition-timing-function: linear(0, 1)) {
  :root {
    --spring: linear(0, 0.0495, 0.1582, 0.2864, 0.4129, 0.5273, 0.6256, 0.7073, 0.7736, 0.8263, 0.8677, 0.8998, 0.9246, 0.9435, 0.9578, 0.9686, 0.9767, 0.9828, 0.9873, 0.9906, 0.9931, 0.995, 0.9963, 0.9973, 1);
  }
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
@media (min-width: 760px) { :root { --header-h: 2.75rem; } }

@media (prefers-reduced-motion: reduce) {
  .btn:active { transform: none; }
  .reveal-ready .reveal { transform: none; transition: opacity 0.3s ease; }
  .js .site-nav, .js .nav-open .site-nav { transform: none; }
  .nav-toggle-bars::before, .nav-toggle-bars::after, .nav-chevron, .nav-go,
  .nav-app-arrow, .nav-app-more svg, .nav-app, .nav-help-link { transition: none; }
  .nav-menu, .nav-trigger[aria-expanded="true"] + .nav-menu,
  .nav-menu-inner > *, .nav-trigger[aria-expanded="true"] + .nav-menu .nav-menu-inner > *,
  .nav-link:active, .nav-app:active, .nav-help-link:active,
  .nav-app--featured:hover .nav-app-more svg, .nav-link--page:hover .nav-go { transform: none; }
}

@media (prefers-reduced-transparency: reduce) {
  .site-header { background: var(--bg); -webkit-backdrop-filter: none; backdrop-filter: none; }
}

@media (prefers-contrast: more) {
  :root { --border: var(--border-strong); }
  .site-header { background: var(--bg); -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: 0 1px 0 var(--border-strong); }
}

/* Hidden visually, still read by screen readers (e.g. table captions). */
.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
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
      // An open menu (or, on phones, an open sub-panel) closes first.
      if (openSub) { setSub(openSub, false, true); return; }
      if (sheetOpen()) setSheet(false, true);
    });

    header.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (!to) return;
      if (!header.contains(to)) { closeSubs(); if (sheetOpen()) setSheet(false); return; }
      if (openSub && desktop.matches && !openSub.parentElement.contains(to)) closeSubs();
    });

    // Phones: Apps and Help slide in as their own panel. Opening one
    // moves focus to its back button; the back button closes it and
    // returns focus to the item that opened it.
    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        if (desktop.matches || t.getAttribute('aria-expanded') !== 'true') return;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        var back = panel && panel.querySelector('.nav-back');
        if (back) back.focus({ preventScroll: true });
      });
    });
    Array.prototype.forEach.call(header.querySelectorAll('.nav-back'), function (b) {
      b.addEventListener('click', function () {
        var panel = b.closest('.nav-menu');
        var t = panel && header.querySelector('[aria-controls="' + panel.id + '"]');
        if (t) setSub(t, false, true);
      });
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

  /* ---- Footer columns fold on phones ----
     Open in the HTML (so they work without JavaScript). On phones they
     start closed, like apple.com's footer; on wide screens they are always
     open and the heading is only a label, so it leaves the tab order. */
  var footFolds = document.querySelectorAll('.footer-fold');
  if (footFolds.length) {
    var footWide = window.matchMedia('(min-width: 760px)');
    var syncFoot = function () {
      footFolds.forEach(function (d) {
        d.open = footWide.matches;
        var s = d.querySelector('summary');
        if (!s) return;
        if (footWide.matches) s.setAttribute('tabindex', '-1'); else s.removeAttribute('tabindex');
      });
    };
    syncFoot();
    if (footWide.addEventListener) footWide.addEventListener('change', syncFoot);
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

  Phase 3 (20 Oct): an apple.com text page. A centred opening (title,
  lead, dates), then the document in a reading column beside its
  contents on white. The contents fold on phones, as on the guides
  (site.js folds any .post-toc-fold below 60rem). Layout only: the
  documents' own text is the owner's, unchanged.
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

<section class="legal-hero" aria-labelledby="legal-title">
  <div class="ap-wrap legal-hero-copy">
    <nav class="breadcrumbs legal-crumbs" aria-label="Breadcrumb">
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
    <p class="legal-updated">{% include icon.html name="auto" class="legal-updated-icon" size="16" %}
      {%- if page.effective and _eff == _upd -%}
      <span>Effective and last updated <time datetime="{{ _upd }}">{{ page.last_updated | date: "%-d %B %Y" }}</time></span>
      {%- else -%}
      {%- if page.effective %}<span>Effective <time datetime="{{ _eff }}">{{ page.effective | date: "%-d %B %Y" }}</time></span><span aria-hidden="true">&middot;</span>{% endif -%}
      <span>Last updated <time datetime="{{ _upd }}">{{ page.last_updated | date: "%-d %B %Y" }}</time></span>
      {%- endif -%}
    </p>
  </div>
</section>

<div class="ap-section legal-layout">
  <div class="ap-wrap legal-grid">
    {%- if page.sections %}
    <nav class="legal-toc" aria-label="Table of contents">
      <details class="post-toc-fold legal-toc-fold" open>
        <summary class="legal-toc-head"><span>On this page</span><span class="legal-toc-count">{{ page.sections.size }} sections</span>{% include icon.html name="chevron-down" class="legal-toc-chevron" size="18" %}</summary>
        <ol>
          {%- for item in page.sections %}
          <li><a href="#{{ item.id }}">{{ item.label | escape }}</a></li>
          {%- endfor %}
        </ol>
      </details>
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
  alt (true for a grey row, shell.css .ap-panel, instead of a white
  section). The heading sits beside the questions on wide screens and
  above them on phones, in the site's 980px column -- the same layout on
  every page (3 Oct; `split` is still accepted and no longer needed).
  Pair it with faq-schema.html, which writes the same questions as
  FAQPage data -- the visible and structured answers must always match.
{%- endcomment -%}
{%- if include.faqs and include.faqs.size > 0 %}
{%- assign _faq_title = include.id | default: "faq" | append: "-title" %}
<section class="{% if include.alt %}ap-panel{% else %}ap-section{% endif %}"{% if include.id %} id="{{ include.id }}"{% endif %} aria-labelledby="{{ _faq_title }}">
  <div class="ap-wrap faq-split">
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
          {% include icon.html name="chevron-down" class="faq-chevron" size="16" %}
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

### Appendix G6: _includes/header.html (apple.com-style bar and menus)

```liquid
{%- comment -%}
  Site header, apple.com's global bar (styles: header.css). One low,
  frosted strip the width of the page, in small type: the logo and name
  at the left, the menu items centred as a group, Sign in at the right.
  Apps and Help open full-width menus (big links first, smaller links
  beside them) over a faint tint; Guides, About and Sign in are plain
  links. On phones the bar keeps the logo, the name and a two-line menu
  button that turns into a cross; the menu slides down from the bar and
  fills the screen with large links, and Apps and Help slide in as their
  own panel with a back button, as on apple.com.

  Icons are inline SVG with their own viewBox and size, drawn in
  currentColor so they take the colour of the text around them: the menu
  button's two lines, a right chevron on Apps and Help in the phone menu
  (their panel slides in from that side), a left chevron on the panel's
  back button, and a person on Sign in. The logo is the owner's mark, an
  image (brand-mark.html), never redrawn.

  Same behaviour and hooks as before (site.js "Navigation"): .nav-trigger
  buttons with aria-expanded / aria-controls, .nav-link--page for plain
  links (hovering one closes an open menu), #nav-scrim, #nav-toggle,
  .menu-open / .nav-open on the header. Sign in is written twice: in the
  list (shown in the phone menu) and after the nav (shown in the bar);
  CSS shows one at a time. Its wrapper gives the bar copy its own hover
  area, as the list items have.

  Everything lists itself: apps from _data/apps.yml (built: true).
  "Sign in" goes to the cloud web app (site.cloud_url).
{%- endcomment -%}
{%- assign _apps = site.data.apps | where: "built", true -%}
{%- assign _in_guides = false -%}{%- if page.url contains "/daily-info/" -%}{%- assign _in_guides = true -%}{%- endif -%}
{%- assign _in_help = false -%}{%- if page.layout == "legal" or page.url == "/contact" -%}{%- assign _in_help = true -%}{%- endif -%}
{%- capture _chevron -%}<svg class="nav-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>{%- endcapture -%}
{%- capture _back -%}<svg class="nav-back-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.5 5.5 8 10 12.5"/></svg>{%- endcapture -%}
{%- capture _person -%}<svg class="nav-signin-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="5.25" r="2.75"/><path d="M2.75 14c.6-2.7 2.7-4.25 5.25-4.25S12.65 11.3 13.25 14"/></svg>{%- endcapture %}
<div class="scroll-sentinel" id="scroll-sentinel" aria-hidden="true"></div>
<div class="nav-scrim" id="nav-scrim" aria-hidden="true"></div>
<header class="site-header" id="site-header">
  <div class="header-inner">
    <a class="brand" href="{{ '/' | relative_url }}" aria-label="Daily Utility Apps home">
      {%- include brand-mark.html class="logo-mark" size="22" eager=true -%}
      <span class="logo-word">Daily <span class="brand-ink">Utility</span> Apps</span>
    </a>

    <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
      <svg class="nav-toggle-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path class="nav-toggle-top" d="M2.5 6h13"/><path class="nav-toggle-bottom" d="M2.5 12h13"/></svg>
    </button>

    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">
        <li class="nav-item">
          <button class="nav-link nav-trigger{% if page.layout == 'app' %} is-current{% endif %}" type="button" aria-expanded="false" aria-controls="menu-apps">Apps{{ _chevron }}</button>
          <div class="nav-menu" id="menu-apps">
            <button class="nav-back" type="button">{{ _back }}Menu<span class="visually-hidden">, close Apps</span></button>
            <div class="nav-menu-inner">
              <div class="nav-col nav-col--main">
                <p class="nav-col-head">Explore our apps</p>
                <ul class="nav-big">
                  {%- for app in _apps %}
                  <li><a href="{{ '/' | append: app.slug | relative_url }}"{% if page.url contains app.slug %} aria-current="page"{% endif %}>{{ app.short | default: app.name | escape }}</a></li>
                  {%- endfor %}
                </ul>
              </div>
              <div class="nav-col">
                <p class="nav-col-head">Choose an app</p>
                <ul class="nav-small">
                  <li><a href="{{ '/' | relative_url }}#which">Not sure which app you need?</a></li>
                  <li><a href="{{ '/' | relative_url }}#apps">Compare our apps</a></li>
                </ul>
              </div>
              <div class="nav-col">
                <p class="nav-col-head">Learn more</p>
                <ul class="nav-small">
                  <li><a href="{{ '/daily-info/' | relative_url }}">Read our phone guides</a></li>
                  <li><a href="{{ '/about' | relative_url }}">About us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link nav-link--page" href="{{ '/daily-info/' | relative_url }}"{% if page.url == "/daily-info/" %} aria-current="page"{% elsif _in_guides %} aria-current="true"{% endif %}>Guides</a>
        </li>

        <li class="nav-item">
          <a class="nav-link nav-link--page" href="{{ '/about' | relative_url }}"{% if page.url == "/about" %} aria-current="page"{% endif %}>About</a>
        </li>

        <li class="nav-item">
          <button class="nav-link nav-trigger{% if _in_help %} is-current{% endif %}" type="button" aria-expanded="false" aria-controls="menu-help">Help{{ _chevron }}</button>
          <div class="nav-menu" id="menu-help">
            <button class="nav-back" type="button">{{ _back }}Menu<span class="visually-hidden">, close Help</span></button>
            <div class="nav-menu-inner">
              <div class="nav-col nav-col--main">
                <p class="nav-col-head">Help &amp; support</p>
                <ul class="nav-big">
                  <li><a href="{{ '/contact' | relative_url }}"{% if page.url == "/contact" %} aria-current="page"{% endif %}>Contact support</a></li>
                  <li><a href="{{ '/' | relative_url }}#faq">Questions about our apps</a></li>
                </ul>
              </div>
              <div class="nav-col">
                <p class="nav-col-head">Legal</p>
                <ul class="nav-small">
                  <li><a href="{{ '/privacy-policy' | relative_url }}"{% if page.url == "/privacy-policy" %} aria-current="page"{% endif %}>Privacy Policy</a></li>
                  <li><a href="{{ '/terms-of-service' | relative_url }}"{% if page.url == "/terms-of-service" %} aria-current="page"{% endif %}>Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>

        <li class="nav-item nav-item--signin">
          <a class="nav-link nav-link--page nav-signin" href="{{ site.cloud_url }}">{{ _person }}Sign in<span class="visually-hidden"> to Daily Utility Cloud Storage</span></a>
        </li>
      </ul>
    </nav>

    <div class="bar-signin">
      <a class="nav-link nav-link--page nav-signin" href="{{ site.cloud_url }}">{{ _person }}Sign in<span class="visually-hidden"> to Daily Utility Cloud Storage</span></a>
    </div>
  </div>
</header>
```

### Appendix G7: _includes/app-tile.html

```liquid
{%- comment -%}
  An app's tile: a drawn SVG glyph on a coloured rounded square. Used
  everywhere an app needs a visual (homepage, app pages, 404) INSTEAD of
  the real store icon -- the site never shows the actual app logos (user,
  29 Sep). Each app's glyph (a shape in _data/icons.yml, drawn inline by
  icon.html) and tone (a colour in shell.css's "App tiles") come from
  _data/apps.yml.

  Params: app (an apps.yml entry), class (optional extra classes that set
  size/position). Always decorative: the app's name is always given in
  text next to or near it, so the tile is aria-hidden.

  Usage: {% include app-tile.html app=flagship class="app-card-icon" %}
{%- endcomment -%}
<span class="app-tile app-tile--{{ include.app.tone }}{% if include.class %} {{ include.class }}{% endif %}" aria-hidden="true">{% include icon.html name=include.app.glyph %}</span>
```

### Appendix G8: _includes/phone-frame.html

```liquid
{%- comment -%}
  A phone, drawn in CSS (shell.css "Phone frame"): a dark frame, a small
  camera dot and a screen. Device-neutral on purpose (the apps run on
  iPhone and Android) and no maker's design or logo.

  The screen shows the app's real screenshot once there is one: set
  `screenshot:` on the app's entry in _data/apps.yml (a portrait PNG or
  JPEG from the app, saved in assets/screens/). Until then it shows a
  launch screen built from what the site already has: the app's colour,
  its glyph and its name. Never a made-up interface.

  Params: app (an apps.yml entry), class (optional, sets the size via
  --phone-w). Callers put it inside an aria-hidden visual.
{%- endcomment -%}
<span class="phone{% if include.class %} {{ include.class }}{% endif %} tone-{{ include.app.tone }}">
  <span class="phone-screen">
    {%- if include.app.screenshot %}
    <img src="{{ include.app.screenshot | relative_url }}" alt="" loading="lazy" decoding="async">
    {%- else %}
    <span class="phone-launch">{% include icon.html name=include.app.glyph %}<span class="phone-launch-name">{{ include.app.short | default: include.app.name | escape }}</span></span>
    {%- endif %}
  </span>
</span>
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

  # One address for every page: https, no www. www goes first, so
  # http://www. reaches the final address in one redirect, not two.
  RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

  # A folder asked for without its slash (/daily-info): add the slash
  # here. Left to Apache, the redirect can show the host's internal
  # folder path (seen with a host-style mapping in testing, 11 Oct).
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.*[^/])$ https://%{HTTP_HOST}/$1/ [R=301,L]

  # Clean URLs. Jekyll writes about.html but every link and canonical is
  # /about. A typed or old /about.html redirects to /about (and
  # /daily-info/index.html or /daily-info/index to /daily-info/), then
  # /about is answered from about.html. THE_REQUEST is the browser's own
  # request line, so the internal rewrite below never loops back into
  # these redirects.
  RewriteCond %{THE_REQUEST} \s/+((?:[^?\s]*/)?)index(?:\.html)?[\s?]
  RewriteRule ^ https://%{HTTP_HOST}/%1 [R=301,L]
  RewriteCond %{THE_REQUEST} \s/+([^?\s]+)\.html[\s?]
  RewriteRule ^ https://%{HTTP_HOST}/%1 [R=301,L]

  # A page asked for with a slash on the end (/about/): redirect to
  # /about. Apache reads /about/ as the file "about" plus a trailing
  # "/", so without this the rewrite below made about/.html,
  # about/.html.html and so on until the server answered 500 (20 Oct).
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)/$ https://%{HTTP_HOST}/$1 [R=301,L]

  # The not-found page's own address answers with a real 404 too.
  RewriteRule ^404$ 404.php [L]

  # The rewrite itself: never for an address ending in "/" or one it has
  # already given .html (so /about/anything is a 404, not a loop).
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteCond $1 !\.html$
  RewriteRule ^(.*[^/])$ $1.html [L]

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
# Every push to main uploads automatically (mode upload), unless the push
# only changes notes that aren't part of the website (STATUS.md, the
# playbook, README, .claude/, the preview workflow). A push whose build
# fails its checks uploads nothing. Pushes close together queue: the
# newest waits for the running upload, and any older one still waiting is
# dropped, so the server always ends on the latest main.
#
# It can also be run by hand from the Actions tab, picking a mode:
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
  push:
    branches: [main]
    paths-ignore:
      - STATUS.md
      - SITE-PLAYBOOK.md
      - README.md
      - .claude/**
      - .github/workflows/pages.yml
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
      MODE: ${{ github.event_name == 'push' && 'upload' || inputs.mode || 'look' }}
      # Files this site used to have that must be removed from the server
      # even though no manifest listed them yet (the first upload with
      # removals). Space-separated, relative to the website folder.
      # The last three are the old sign-in page's leftovers (its page was
      # replaced on 11 Oct; a copy is in .site-backups/20261011-010525).
      RETIRED_PATHS: >-
        photo-recover-data-recovery.html
        assets/og/photo-recover-data-recovery.jpg
        assets/css/site.css
        assets/icons/app-mark-180.png
        assets/logos/app-mark.svg
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
          # Never delete a file the cloud web app still loads from here. It
          # lives in another folder, so a relative link on its page loads
          # its own copy, not this one. Keep ours only if its page links to
          # this site's address for it, or names it and has no copy itself.
          host="${SITE#https://}"
          cloud="https://cloud.$host"
          curl -sS --max-time 20 "$cloud/" > "$RUNNER_TEMP/cloud.html" 2>/dev/null || true
          if [ -s "$RUNNER_TEMP/delete.txt" ] && [ -s "$RUNNER_TEMP/cloud.html" ]; then
            : > "$RUNNER_TEMP/delete-ok.txt"
            while IFS= read -r f; do
              keep=""
              if grep -qF -e "//$host/$f" -e "//www.$host/$f" "$RUNNER_TEMP/cloud.html"; then
                keep="the cloud web app's page links to it at $host"
              elif grep -qF "$f" "$RUNNER_TEMP/cloud.html"; then
                own=$(curl -sS -o /dev/null --max-time 20 -w '%{http_code}' "$cloud/$f" 2>/dev/null || echo 000)
                if [ "$own" = 200 ]; then
                  echo "::notice title=Cloud has its own copy::$f is named on the cloud web app's page, which loads it from its own folder ($cloud/$f answers 200), so this site's copy isn't used."
                else
                  keep="the cloud web app's page names it and has no copy of its own ($own)"
                fi
              fi
              if [ -n "$keep" ]; then
                echo "::warning title=Kept::$f was not deleted: $keep."
                echo "$f" >> "$RUNNER_TEMP/left.txt"
              else
                echo "$f" >> "$RUNNER_TEMP/delete-ok.txt"
              fi
            done < "$RUNNER_TEMP/delete.txt"
            mv "$RUNNER_TEMP/delete-ok.txt" "$RUNNER_TEMP/delete.txt"
          fi
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
          # A page with a slash on the end used to loop to a 500 (20 Oct).
          redirect "page slash" "$SITE/about/" "$SITE/about"
          check "past a page" "$SITE/about/x-$GITHUB_RUN_ID" 404 "Page not found"
          redirect "index to folder" "$SITE/index" "$SITE/"
          check "404 address" "$SITE/404" 404 "Page not found"
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

