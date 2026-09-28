# Daily Utility — Status

Living reference for this repo's decisions and plan. Update this file as
things change; it's the source of truth for "what did we decide" so we
don't re-litigate it every session.

## What this site is

The homepage for **Daily Utility**, the brand CloudGate Technologies uses
for its portfolio of single-purpose utility apps. App #1: **Cloud Storage
Backup & Drive** (photo/video/contacts/app-data backup and restore,
iOS + Android). The site's job, in order: drive installs for that app,
host the privacy policy / terms URLs the app stores require, build
durable SEO equity that scales as more apps ship.

## Company / legal (confirmed)

- Legal entity: **CloudGate Technologies Pty Limited** (ACN 673 209 553)
- Address: 10 Seddon Way, Canning Vale WA 6155, Australia
- Support email: `support@cloudgate-app.com` (shared with the sibling
  CloudGate app — confirm with the user if Daily Utility should get its
  own address later)
- Privacy policy / terms are adapted from the CloudGate Technologies
  template already in production at cloudgate-app.com, generalized to
  cover the Daily Utility product line under the same legal entity.
- Sibling site for reference/pattern only, not to be copied verbatim:
  cloudgate-app.com (their main CloudGate cloud storage app).
- Sibling repo for structural pattern: `ali-rajaa/fixmypcperth`
  (Jekyll, `_layouts`/`_includes`/`_data`, per-page CSS on a shared
  `shell.css`, GitHub Actions → GitHub Pages, layout chaining via
  `layout: default` in specialized layouts' own front matter).

## App details to verify before launch

- Apple: `https://apps.apple.com/us/app/cloud-storage-backup-drive/id6760700432`
- Google Play: `com.backup.and.restore.all.apps.photo.backup`
- **Open question:** confirm these IDs are still current for this app —
  the legal template pasted into this session referenced a *different*
  sibling CloudGate app's store IDs (id6504859413 / com.cloudgate.cloudstorage),
  so don't reuse those by mistake.
- Actual store descriptions/screenshots haven't been pulled (Apple/Play
  domains are blocked by this environment's network policy). Site copy
  is written from the app name/package + category conventions, not
  scraped store text — review against the real listing before publishing.

## Deployment

- No custom domain yet. Deploys to the default GitHub Pages project URL.
- `_config.yml`: `url: https://ali-rajaa.github.io`, `baseurl: /daily-utility`.
- When a custom domain is connected: set `url` to it, `baseurl: ""`, add
  a `CNAME` file. Every internal link uses Jekyll's `relative_url`
  filter (never a hardcoded absolute path), so that's the only change
  needed — no page edits.
- Branch: `claude/bold-feynman-c7lqej`.

## Information architecture (decided)

No `.html` shown in links, no trailing slash (GitHub Pages serves the
extensionless address automatically — same convention as fixmypcperth).

- `/` — Daily Utility home
- `/cloud-storage-backup-drive` — app landing/sales page
- `/daily-info` — blog hub ("Daily Info" — locked in as the blog name)
- `/daily-info/[slug]` — individual articles
- `/privacy-policy`
- `/terms-of-service`
- `/404`
- Future: `/[app-slug]` per new Daily Utility app; new `/daily-info`
  categories as the portfolio grows.

## Layout architecture (decided)

One shell, specialized layouts chain to it — not one layout for
everything, not a bespoke layout per page either:

- `_layouts/default.html` — the shell every page renders through:
  `<head>` (meta/schema/fonts/css), `_includes/header.html`,
  `{{ content }}`, `_includes/footer.html`, `_includes/scripts.html`.
  This is what keeps header/footer/meta identical on every page.
- `_layouts/app.html` (`layout: default`) — reusable template for app
  landing pages, front-matter/data driven, so app #2 is new data, not
  new HTML.
- `_layouts/post.html` (`layout: default`) — reusable template for
  Daily Info articles: title, date/updated, category, breadcrumb, body,
  related posts, CTA into the app page.
- `_layouts/legal.html` (`layout: default`) — shared template for
  privacy/terms: sticky TOC sidebar + numbered sections.
- Homepage and the Daily Info hub use `layout: default` directly,
  hand-authored — each is a one-off page, same as fixmypcperth's own
  `index.html` and `tech-tips.html` hub.
- `_includes/header.html` / `footer.html` / `scripts.html` — single
  source of truth, included once by the shell, never duplicated per page.
- CSS: `assets/css/shell.css` holds shared tokens + header/footer/nav
  styles. Each page type gets its own stylesheet layered on top
  (`index.css`, `app.css`, `post.css`, `blog-hub.css`, `legal.css`),
  selected via `css:` front matter — same pattern as fixmypcperth.

## Homepage — 5 sections (decided)

Every section follows the same scaffold (eyebrow label → H2 → sub-copy →
content) so it reads as one system:

1. **Hero** — brand statement, CloudGate Technologies backing, primary
   CTA straight to the app's store badges.
2. **Apps grid** — data-driven from `_data/apps.yml` (1 card today).
3. **Why Daily Utility** — trust pillars (focused not bloated,
   privacy-first & encrypted, real Australian company/ACN shown,
   cross-platform).
4. **From Daily Info** — latest 3 posts, pulled from the posts
   collection automatically (keeps the homepage fresh with no manual
   upkeep).
5. **Closing CTA band** — store badges again + company sign-off.

## App landing page (`/cloud-storage-backup-drive`) — sections (decided)

Hero w/ store badges above the fold → 3-step "how it works" → feature
grid (auto photo/video backup, contacts, app data, encrypted drive, free
up storage, one-tap restore) → "who it's for" → FAQ (schema-marked,
real long-tail questions) → security/trust section linking to the full
privacy policy → closing CTA band.

## Daily Info (blog) — decided

- Hub `/daily-info`: all posts newest-first, category pills.
- Categories (shared across the whole future portfolio, not just this
  app): Backup & Storage, Switching Phones, Photos & Media, Privacy &
  Security.
- Initial 6-article slate (each exists to funnel into the app page, not
  to rank standalone):
  1. How to Back Up Your Phone Before Switching to a New One
  2. How to Free Up Storage Without Deleting Your Photos
  3. Does Your Phone Really Back Up Photos Automatically? iPhone vs Android
  4. What Happens to Your App Data When You Get a New Phone
  5. Is Cloud Backup Actually Safe? Encryption and Privacy, Explained Plainly
  6. Cloud Backup vs Local Backup: Which One Do You Actually Need
- Every post: one required internal link to the app page, one to a
  related post, `BlogPosting` + `BreadcrumbList` schema, no fabricated
  bylines/review dates/ratings.

## SEO (decided)

- Keyword tiers: branded (Daily Utility, Cloud Storage Backup & Drive,
  CloudGate Technologies) → long-tail high-intent (primary target:
  "backup photos to cloud iphone", "restore photos to new android
  phone", "backup and restore all apps android", "transfer photos to
  new phone app", "free up phone storage backup app") → aspirational
  head terms (long game: "cloud storage backup app", "photo backup app").
- On-page: one H1/page, unique title+description, FAQPage schema on the
  app page, SoftwareApplication schema (no fabricated ratings, ever —
  only real ones once they exist), Organization schema on the homepage
  tied to the legal entity.
- Technical: sitemap.xml, robots.txt, canonical tags, lazy-loaded
  images, system-font-first typography, OG/Twitter cards per page.
- ASO tie-in: store badge links carry UTM/referrer tags for App Store
  Connect / Play Console attribution.
- Analytics: GA4, hostname-gated like fixmypcperth's (no
  localhost/staging noise), click tracking on store badges + FAQ
  expand events.

## Open items / assets still needed

- [ ] Confirm store IDs above are correct for this specific app
- [ ] Real app icon/logo (PNG) — favicon, OG image, badge alt text
- [ ] Real screenshots for the app page (placeholder: clean CSS-only
      device mockups until supplied)
- [ ] Confirm support email (reuse `support@cloudgate-app.com` or new)
- [ ] Custom domain decision (currently: none, GitHub Pages default)

## Build phasing

- **Phase 1 (next, once this plan is approved):** home, app page,
  privacy, terms, Daily Info hub + first article(s), schema,
  sitemap/robots, GA4.
- **Phase 2:** remaining Daily Info articles from the initial slate.
- **Phase 3:** each new Daily Utility app = one data entry + one
  `app.html`-layout page, reusing the existing scaffold.

## Log

- Session started: repo scaffolded (`_config.yml` only), full site
  structure, IA, blog, and homepage section plan agreed before any
  HTML/CSS was written. This file created to track it.
