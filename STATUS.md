# Daily Utility — Status

Living reference for this repo. It records what we decided and why, so
no session has to re-derive or re-argue it. Update it whenever a
decision changes or a phase completes.

**Current state:** Final blueprint locked. No site code written yet
(only `_config.yml`, still in its preview-phase settings). Next: Phase 1.

---

## 1. What this site is

The website for **Daily Utility**, the brand CloudGate Technologies uses
for its single-purpose utility apps. App #1 is **Cloud Storage Backup &
Drive** (backup and restore of photos, videos, contacts and app data, on
iOS and Android).

The site has three jobs, in this order:

1. Drive installs of the app.
2. Host the privacy policy, terms and support URLs that the App Store and
   Google Play require.
3. Build SEO value that carries over to every future app.

## 2. Confirmed facts

| Item | Value |
|---|---|
| Domain | **`https://dailyutilityapps.store`** (apex is canonical; www redirects to it) |
| Legal entity | CloudGate Technologies Pty Limited, ACN 673 209 553 |
| Address | 10 Seddon Way, Canning Vale WA 6155, Australia |
| Support email | `support@cloudgate-app.com` for now (see open items) |
| Blog name | **Daily Info**, at `/daily-info` |
| Apple | `https://apps.apple.com/us/app/cloud-storage-backup-drive/id6760700432` |
| Google Play | `com.backup.and.restore.all.apps.photo.backup` |
| Structural model | `ali-rajaa/fixmypcperth` (Jekyll, chained layouts, per-page CSS on a shared `shell.css`, deployed by Actions) |
| Legal text source | CloudGate Technologies templates from cloudgate-app.com, adapted to Daily Utility |

The legal template pasted in this session names a **different** sibling
app's store IDs (`id6504859413`, `com.cloudgate.cloudstorage`). Never use
those here.

## 3. Directory tree

```
daily-utility/
├── .github/workflows/pages.yml
├── .gitignore
├── Gemfile
├── STATUS.md
├── _config.yml
├── _launch/                       # excluded from the build
│   └── redirects.csv              # old URL -> new URL map (Phase 6)
├── _layouts/
│   ├── default.html               # shell: <head>, header, content, footer, scripts
│   ├── app.html                   # layout: default. App landing pages
│   ├── post.html                  # layout: default. Daily Info articles
│   └── legal.html                 # layout: default. Privacy and terms
├── _includes/
│   ├── header.html
│   ├── footer.html
│   ├── scripts.html
│   ├── store-badges.html          # params: ios_url, android_url
│   ├── faq-schema.html            # param: faqs -> FAQPage JSON-LD
│   └── breadcrumb-schema.html     # param: crumbs -> BreadcrumbList JSON-LD
├── _data/
│   └── apps.yml                   # app listing metadata only, never page content
├── assets/
│   ├── css/
│   │   ├── shell.css              # tokens, reset, header, footer, nav
│   │   └── pages/
│   │       ├── index.css
│   │       ├── app.css
│   │       ├── post.css
│   │       ├── blog-hub.css
│   │       └── legal.css
│   ├── icons/favicon.svg          # placeholder until the real icon arrives
│   └── og/default.png             # 1200x630 share card
├── index.html                     # layout: default. Homepage
├── cloud-storage-backup-drive.html   # layout: app
├── daily-info.html                # layout: default. Blog hub
├── daily-info/
│   ├── backup-before-switching-phones.html
│   ├── free-up-phone-storage.html
│   ├── automatic-photo-backup-iphone-vs-android.html
│   ├── app-data-backup-new-phone.html
│   ├── is-cloud-backup-safe.html
│   └── cloud-vs-local-backup.html
├── privacy-policy.html            # layout: legal
├── terms-of-service.html          # layout: legal
├── 404.html                       # layout: default, noindex: true
├── robots.txt                     # Liquid, needs an empty front matter fence
├── sitemap.xml                    # Liquid, needs an empty front matter fence
└── CNAME                          # dailyutilityapps.store (see section 7)
```

There are **no Jekyll collections**: no `_posts` and no `_apps`. Every
page is a plain page with a layout, as in fixmypcperth.

- `_posts` was rejected because it requires date-prefixed filenames and
  defaults to dated URLs (`/2026/09/28/...`). Dates in the URL make
  evergreen guides look stale.
- Posts are listed with `site.pages | where: "layout", "post"`, sorted by
  the `date` front matter field.

## 4. Layouts and required front matter

Each specialized layout sets `css:` in its own front matter. Jekyll passes
that value down to every page that uses the layout, so pages never repeat
it. `default.html` loads `pages/{{ page.css | default: "index" }}.css`.

| Layout | Used by | Required front matter |
|---|---|---|
| `default` | Homepage, Daily Info hub, 404 | `title`, `description`. Optional: `css`, `image`, `image_alt`, `noindex` |
| `app` (`css: app`) | App landing pages | `title`, `description`, `app_name`, `tagline`, `icon`, `ios_url`, `android_url`, `category`, `features` (icon, title, text), `how_it_works` (3 steps: title, text), `faqs` (q, a). **No body content.** |
| `post` (`css: post`) | Daily Info articles | `title`, `description`, `heading`, `category`, `date`, `updated`, `read_min`, `slug` (must match the filename), `image`. The body is prose. Optional: `faqs`, `related` |
| `legal` (`css: legal`) | Privacy, terms | `title`, `description`, `last_updated`, `sections` (id, label). Each body `<h2>` uses the matching `id` |

- **App pages are fully driven by front matter.** This stops similar app
  pages from drifting into near-duplicates (doorway pages), which is the
  same reason fixmypcperth builds suburb pages this way.
- **The legal table of contents is generated from `sections`.** A
  hand-typed list would fall out of sync with the headings.
- **Legal pages have no hardcoded `canonical:`.** They use the same
  canonical logic as every other page.
- **`_data/apps.yml` fields:** `slug`, `name`, `tagline`, `icon`,
  `ios_url`, `android_url`, `built` (true/false).

## 5. Page sections

**Homepage.** Each section follows the same pattern: eyebrow label, H2,
sub-copy, content.

1. Hero: brand statement, CloudGate backing and store badges.
2. Apps grid, built from `apps.yml`.
3. Why Daily Utility: focused, privacy-first, real Australian company
   (ACN shown), iPhone and Android.
4. Latest 3 Daily Info posts, filled in automatically.
5. Closing CTA band with store badges.

**App page:** hero with badges above the fold → 3-step how it works →
feature grid → who it's for → FAQ with schema → security and trust
section linking to the privacy policy → closing CTA.

**Daily Info:**

- Categories: Backup & Storage, Switching Phones, Photos & Media, Privacy
  & Security.
- Every post links once to the app page and once to a related post.
- No invented bylines, review dates or ratings.

## 6. SEO and routing

**URLs**

- No `.html` and no trailing slash. GitHub Pages serves `/x` from
  `x.html`. The layout strips `.html` when it builds canonicals and
  links.
- Internal links use `{{ '/path' | relative_url }}`.
- Every full URL (canonical, OG, sitemap, schema) uses `| absolute_url`.
  That filter adds `site.url` and `site.baseurl` together. This matters
  in the preview phase, when `baseurl` is `/daily-utility`.
- Final routes: `/`, `/cloud-storage-backup-drive`, `/daily-info`,
  `/daily-info/<slug>`, `/privacy-policy`, `/terms-of-service`.
- `404.html` sets `noindex: true`. `default.html` skips the canonical tag
  on `/404.html`. The sitemap leaves out the 404 page and any `noindex`
  page.

**Schema**

- `Organization` (with `@id` `…/#organization`) appears once, on the
  homepage.
- `SoftwareApplication` and `BlogPosting` point to it as `publisher` by
  `@id`.
- Posts and legal pages carry `BreadcrumbList`. The app page, and any
  post with `faqs`, carries `FAQPage`.
- Ratings are added only once real ones exist.

**Keywords**

- Branded: Daily Utility, Cloud Storage Backup & Drive, CloudGate
  Technologies.
- Long-tail (the main target): backup photos to cloud iphone, restore
  photos to new android phone, backup and restore all apps android,
  transfer photos to new phone app, free up phone storage.
- Head terms (long term): cloud storage backup app, photo backup app.

**Measurement**

- GA4 loads only on `dailyutilityapps.store`, so preview and localhost
  visits are never counted.
- Clicks on the store badges and FAQ opens are tracked as events.
- Store links carry UTM tags.

## 7. Build and deploy rules

- **`plugins: []`**, and the site is built with plain Jekyll 4.3 in
  Actions, not the `github-pages` gem. That gem is what broke
  fixmypcperth. As a result, `sitemap.xml` and `robots.txt` are
  hand-written Liquid.
- **`robots.txt` and `sitemap.xml` must start with an empty `---`/`---`
  fence.** Without it, Jekyll copies them unrendered.
- **Set Settings → Pages → Source to "GitHub Actions".** If it is left on
  "Deploy from branch", GitHub runs its own `github-pages` build instead.
- **The custom domain is set in Settings → Pages → Custom domain.**
  Actions deployments ignore the `CNAME` file. We keep the file only as a
  record.
- **The workflow deploys from `main`.** The repo has no `main` yet, and
  its default branch is currently `claude/bold-feynman-c7lqej`. Create
  `main`, make it the default branch, and deploy only from it. The Pages
  environment allows the default branch only.
- **`exclude:`** covers `Gemfile`, `Gemfile.lock`, `STATUS.md`,
  `.github` and `_launch`.
- **`.gitignore`** covers `_site/`, `.jekyll-cache/`, `.bundle/` and
  `vendor/`.

**Two config states.** Moving between them is a three-line change. It
needs no page edits because every link and URL goes through the
`relative_url` and `absolute_url` filters.

| | Preview (build and check) | Live (after cutover) |
|---|---|---|
| `url` | `https://ali-rajaa.github.io` | `https://dailyutilityapps.store` |
| `baseurl` | `/daily-utility` | `""` |
| `staging` | `true` (noindex on every page) | `false` |

Once the custom domain is set, GitHub redirects the github.io address to
it, and the preview phase ends.

## 8. Domain cutover (the old site is being removed)

The live domain couldn't be inspected from this environment (it is
blocked by network policy), so the steps below assume we don't know
what's there.

1. **Before anything else, list the old site's URLs.** Use Search Console
   (Pages report) or the old sitemap.
2. **Find the privacy policy, support and marketing URLs** currently
   entered in App Store Connect and Play Console. If they point at the old
   site, they must never break. A missing privacy policy URL can get an
   app update rejected or an app flagged.
3. **Map old URLs to new ones** in `_launch/redirects.csv`.
   - GitHub Pages can't send 301s, and `plugins: []` rules out
     `jekyll-redirect-from`.
   - If the DNS is on Cloudflare, use Bulk Redirects (fixmypcperth did
     this).
   - Otherwise, create hand-written stub pages (meta refresh plus a
     canonical to the target, set to noindex).
   - Old URLs with no equivalent should return 404, not redirect to the
     homepage (which Google treats as a soft 404).
4. **DNS**
   - Apex: A records `185.199.108.153`, `.109.153`, `.110.153`,
     `.111.153`, and AAAA records `2606:50c0:8000::153`, `8001::153`,
     `8002::153`, `8003::153`.
   - `www`: CNAME to `ali-rajaa.github.io`.
   - **Leave the existing MX and TXT records alone** (email and
     verification).
   - If the DNS is on Cloudflare, keep the records DNS-only until GitHub
     has issued the certificate.
5. **In GitHub:** verify the domain in account settings (this prevents
   takeover), set the custom domain, then turn on Enforce HTTPS once the
   certificate is ready.
6. **Switch the config** to Live (section 7). Check the live site: every
   canonical, the redirects, `/404`, and `/privacy-policy`.
7. **Update the store listings** (privacy, support and marketing URLs) to
   the new addresses.
8. **Search Console:** keep or add the domain property, submit the new
   sitemap, and watch coverage.
9. **Cancel the old host only after steps 6–8 are confirmed.** Until
   then, reverting DNS is the rollback.

## 9. Execution order

- [ ] **1. Config:** `.gitignore`, `Gemfile`, `pages.yml`, `_config.yml`
      in its Preview state, `main` branch, Pages source set to Actions.
- [ ] **2. Shell:** `shell.css`, `default.html`, header, footer and
      scripts. Check that a blank page renders.
- [ ] **3. Includes:** `store-badges`, `faq-schema`, `breadcrumb-schema`.
- [ ] **4. Layouts:** `app`, `post` and `legal`, each with its CSS.
- [ ] **5. Core pages:** `apps.yml`, homepage, app page, privacy, terms,
      404.
- [ ] **6. Daily Info:** the hub, then the 6 articles.
- [ ] **7. SEO files:** robots, sitemap, favicon, OG card, GA4.
- [ ] **8. Validate on Preview:**
  - Build locally.
  - Check that every canonical includes `/daily-utility`.
  - Click through every link.
  - Validate the JSON-LD.
  - Run Lighthouse.
  - Confirm noindex is present.
- [ ] **9. Cutover:** follow section 8, in order.

## 10. Open items

- [ ] The old site's URL list, and the privacy/support URLs the stores
      currently point to (this blocks the cutover, not the build).
- [ ] Support email: keep `support@cloudgate-app.com`, or set up
      `support@dailyutilityapps.store`? The second needs MX records on
      the new domain.
- [ ] Where the DNS is managed (Cloudflare or the registrar). This
      decides how redirects are done.
- [ ] Confirm the store IDs in section 2.
- [ ] The real app icon (PNG) and screenshots. Until they arrive, the
      page uses CSS device mockups.

## Log

- Scaffolded `_config.yml` (Preview state) and agreed on the IA, layouts,
  homepage and Daily Info plan.
- Final blueprint locked, including:
  - no `_posts`
  - `absolute_url` for every full URL
  - `apps.yml` holds listing metadata only
  - the legal table of contents is generated from `sections`
  - the domain `dailyutilityapps.store` with a two-state config and a
    cutover runbook
  - the domain is set in Settings rather than by the CNAME file
  - a `main` branch is required
