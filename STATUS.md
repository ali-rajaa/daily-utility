# Daily Utility Apps — Status

Living reference for this repo. It records what we decided and why, so
no session has to re-derive or re-argue it. Update it whenever a
decision changes or a phase completes.

**Current state:** Build steps 1 (config) and 2 (shell) are done,
verified, and **live on https://staging.fixmypcperth.com** (noindex).
`main` deploys; work happens on `claude/bold-feynman-c7lqej` and is
brought to `main` to update the preview. Next: step 3 (includes).

---

## 1. What this site is

The website for **Daily Utility Apps**, the brand CloudGate Technologies uses
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
| Legal text source | CloudGate Technologies templates from cloudgate-app.com, adapted to Daily Utility Apps |

The legal template pasted in this session names a **different** sibling
app's store IDs (`id6504859413`, `com.cloudgate.cloudstorage`). Never use
those here.

## 3. Directory tree

```
daily-utility/
├── .github/workflows/pages.yml
├── .gitignore
├── Gemfile
├── Gemfile.lock                   # committed: CI installs exactly these versions
├── STATUS.md
├── _config.yml
├── _launch/                       # excluded from the build
│   └── redirects.csv              # old URL -> new URL map (cutover, section 8 step 3)
├── _layouts/
│   ├── default.html               # shell: <head>, header, content, footer, scripts
│   ├── app.html                   # layout: default. App landing pages
│   ├── post.html                  # layout: default. Daily Info articles
│   └── legal.html                 # layout: default. Privacy and terms
├── _includes/
│   ├── header.html
│   ├── footer.html
│   ├── scripts.html
│   ├── logo.html                  # brand mark + wordmark, used by header and footer
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
│   ├── icons/                     # the real brand mark, cropped from the
│   │   │                         # supplied logo files (assets/icons/mark.png
│   │   │                         # is the 833px master; favicon-*.png,
│   │   │                         # apple-touch-icon.png and mark-192.png are
│   │   │                         # derived from it, see section 4a)
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
└── sitemap.xml                    # Liquid, needs an empty front matter fence
```

There is no `CNAME` file: with an Actions deploy GitHub ignores it, and
the custom domain lives in Settings → Pages (section 7).

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
it. `default.html` loads `shell.css`, then `pages/<css>.css` only when
`css:` is set. There is no silent fallback: the homepage sets
`css: index` and the hub sets `css: blog-hub` themselves.

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
  `ios_url` (optional), `android_url` (optional — at least one of the two
  is required), `built` (true/false), `tier` (`flagship` or `more`),
  `page` (true/false — whether it has its own page under `app.html`, vs.
  just a footer/homepage card linking straight to its store listing).

## 4a. Brand assets (the real logo)

The user supplied the real Daily Utility Apps logo (4 PNG lockups: icon +
"Daily Utility Apps" wordmark + "Smart Tools for Everyday Life" tagline,
in light-on-dark and navy-on-light treatments) partway through the build.
The icon alone (no text) was cropped out with Pillow and is now the site's
actual mark, replacing the placeholder tile-grid SVG built in step 2.

- **Source of truth:** `assets/icons/mark.png` (833×833, transparent,
  cropped from the navy-wordmark supplied file). Re-derive any other size
  from this file, not from the original supplied PNGs.
- **Derived, and wired in:** `mark-192.png` (header/footer `<img>`),
  `favicon-16/32/48.png`, `apple-touch-icon.png` (180×180, flattened onto
  white — Apple fills transparency with black otherwise).
- **Derived, not yet referenced:** `mark-512.png` — kept for a future web
  app manifest or a maskable Android icon; delete it if that never
  happens rather than let it go stale.
- **Cropping pitfall, twice:** padding the bottom of the icon's bounding
  box by a fraction of its *width* overshot into the wordmark below it
  both times it was tried (830px-wide icon vs. only a 45px gap before the
  text). What worked: find the first fully-transparent row after the
  icon, then the row where the wordmark's ink resumes, and clamp the crop
  to a small **fixed-pixel** margin inside that gap — never a
  width-proportional one. If the logo is ever re-cropped, keep that rule.
- **Brand name correction:** the wordmark reads "Daily Utility Apps", not
  "Daily Utility" (confirmed independently by the Play Store developer
  page URL from earlier in the session:
  `play.google.com/store/apps/developer?id=Daily+Utility+Apps`). Every
  page title, `site.title`, footer/header `aria-label`, and the logo's
  own text were corrected to match. "Daily Utility" alone should not
  reappear as the brand name.
- **Real tagline adopted:** "Smart Tools for Everyday Life" (from the
  logo) replaced the placeholder homepage copy ("Simple apps that do one
  job well") in `_config.yml`'s `description`, the footer tagline, and
  the placeholder homepage's H1. The step-5 homepage should keep it as
  the hero's headline or sub-copy, not silently drop it.
- **Palette already matches:** the logo's blue (icon body) is close
  enough to `shell.css`'s existing `--brand` (`#0b5fe8` light /
  `#5b9bff` dark) that no token change was needed. The logo's blue→green
  gradient is not yet used anywhere in the UI; consider it for the step-5
  hero or app-page accents, but it isn't required.

## 5. Page sections

**Homepage — flagship-first.** Every other app besides the flagship is a
card, not a page (see "Apps, flagship-first" below for why). Each section
follows the same pattern: eyebrow label, H2, sub-copy, content.

1. Hero: brand statement ("Smart tools for everyday life"), CloudGate
   backing, a direct link into the flagship.
2. **Flagship spotlight** — Cloud Storage Backup & Drive gets real space
   here: a short pitch and both store badges, not just a card.
3. **More apps** — compact cards for the rest (icon, one line, store
   button(s) straight to the listing). No per-app page.
4. Why Daily Utility Apps: focused, privacy-first, real Australian
   company (ACN shown), iPhone and Android.
5. Latest 3 Daily Info posts, filled in automatically.
6. Closing CTA band, flagship store badges.

**App page (flagship only, for now):** hero with badges above the fold →
3-step how it works → feature grid → who it's for → FAQ with schema →
security and trust section linking to the privacy policy → closing CTA.
If a "more apps" entry earns its own page later, it reuses this exact
`app.html` layout — just flip `page: true` and fill in its front matter;
no new template.

## 5a. Apps, flagship-first

Cloud Storage Backup & Drive is the flagship: its own `app.html` page,
the header nav link, the "Get the app" button, every Daily Info article's
call to action, and the homepage spotlight. The other three apps the
user supplied Play Store links for are real, but get only a card each
(icon, one line, store button) — a full page per minor app would be thin
content for no SEO benefit and ongoing upkeep for little payoff.

| App | Package ID | Tier | Notes |
|---|---|---|---|
| Cloud Storage Backup & Drive | `com.backup.and.restore.all.apps.photo.backup` | `flagship` | Has an `app.html` page. Apple id `6760700432` (unverified — see open items) |
| (PDF tool) | `com.dw.pdf.reader.pdfviewer.pdfeditor.alldocumentreader.filereader` | `more` | Card only. Real name/description/icon/App Store link not yet supplied |
| (File/app transfer tool) | `com.transfer.files.transfer.apps.share.app` | `more` | Card only. Same gaps as above |
| (Data recovery tool) | `com.data.recovery.trashbin.recovery.files` | `more` | Card only. Same gaps as above |

The three "more" apps' real names, one-line descriptions, App Store links
(if any) and icons are still needed from the user — placeholder names
derived from the package ID are not going into `apps.yml` until
confirmed, to avoid shipping copy that has to be walked back. Their
Google Play links (`play.google.com/store/apps/details?id=<package>`)
are enough to build the card and its button now; the rest slots in
without touching the template.

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
  That filter adds `site.url` and `site.baseurl` together, so a future
  sub-path deployment (a non-empty `baseurl`) would still produce correct
  URLs.
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
- **No star ratings or review scores anywhere on the site** — not a
  "4.5/5" badge in the app page hero, not in `SoftwareApplication`
  schema's `aggregateRating`, not on the homepage cards. This is a
  standing decision (user, 28 Sep), not "until real ones exist" — don't
  add one even if a real average later becomes available without asking
  first.

**Keywords**

- Branded: Daily Utility Apps, Cloud Storage Backup & Drive, CloudGate
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

- **`plugins: []`**, and the site is built with plain Jekyll 4.4 in
  Actions, not the `github-pages` gem. That gem is what broke
  fixmypcperth. As a result, `sitemap.xml` and `robots.txt` are
  hand-written Liquid.
- **`robots.txt` and `sitemap.xml` must start with an empty `---`/`---`
  fence.** Without it, Jekyll copies them unrendered.
- **Set Settings → Pages → Source to "GitHub Actions".** If it is left on
  "Deploy from branch", GitHub runs its own `github-pages` build instead.
- **`pages.yml` is the only deploy workflow.** Don't click **Configure** on
  the Pages settings screen: it commits GitHub's starter `jekyll.yml`,
  which pins Ruby 3.1 (can't install our Bundler 4), fails every push,
  and would race `pages.yml` to deploy. It happened once (commit fd3a8a6)
  and was removed.
- **The custom domain is set in Settings → Pages → Custom domain.**
  Actions deployments ignore a `CNAME` file, so the repo has none.
- **Workflow action versions** are the Node 24 majors: `checkout@v7`,
  `setup-ruby@v1`, `configure-pages@v6`, `upload-pages-artifact@v5`,
  `deploy-pages@v5` (Node 20 is deprecated on runners). The workflow is
  linted with `actionlint`.
- **Liquid and front matter errors fail the build** (`strict_front_matter`,
  `error_mode: strict`, `strict_filters`), so a typo can't ship silently.
- **The workflow deploys from `main`.** Make `main` the default branch
  before choosing GitHub Actions as the Pages source: the Pages
  environment only allows the branch that is default at that moment.
- **`exclude:`** covers `Gemfile`, `Gemfile.lock`, `README.md`,
  `STATUS.md`, `.github`, `.claude`, `_launch` and `vendor`.
- **`.gitignore`** covers `_site/`, `.jekyll-cache/`, `.bundle/` and
  `vendor/`.

**Two config states.** Moving between them is a three-line change. It
needs no page edits because every link and URL goes through the
`relative_url` and `absolute_url` filters.

| | Preview (build and check) | Live (after cutover) |
|---|---|---|
| `url` | `https://staging.fixmypcperth.com` | `https://dailyutilityapps.store` |
| `baseurl` | `""` | `""` |
| `staging` | `true` (noindex on every page) | `false` |
| Settings → Pages → Custom domain | `staging.fixmypcperth.com` | `dailyutilityapps.store` |

**The preview borrows `staging.fixmypcperth.com`.** fixmypcperth deleted
its own staging site and repo on 26 Sep 2026, so the subdomain was free.
Nothing points at `dailyutilityapps.store` until the cutover.

One-time setup (owner):

1. **GitHub:**
   - Settings → General → Default branch → `main`.
   - Settings → Pages → Source → **GitHub Actions**.
2. **Cloudflare** (the `fixmypcperth.com` zone) → DNS → Add record:
   - Type **CNAME**, Name `staging`, Target `ali-rajaa.github.io`.
   - Proxy status **DNS only** (grey cloud).
   - DNS only is what lets GitHub issue the HTTPS certificate. It also
     keeps fixmypcperth's Cloudflare rules (the `.html` rule and bulk
     redirects) from ever touching the preview.
3. **GitHub:** Settings → Pages → Custom domain → `staging.fixmypcperth.com`
   → Save.
   - Wait for the DNS check to pass, then tick **Enforce HTTPS** (the
     certificate can take up to about an hour).
   - `fixmypcperth.com` is **not** a verified domain on the GitHub account
     (no `_github-pages-challenge-ali-rajaa` TXT record exists). It isn't
     needed to serve the site, but verifying it (GitHub profile Settings →
     Pages → Add a domain) stops any other account's repo from claiming
     its subdomains. Recommended.
4. **Deploy:** the site updates whenever `main` changes.

Once a custom domain is set, GitHub redirects the github.io address to
it.

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
5. **In GitHub:**
   - Verify `dailyutilityapps.store` in account settings (this prevents
     takeover).
   - Change Settings → Pages → Custom domain from
     `staging.fixmypcperth.com` to `dailyutilityapps.store`.
   - Turn on Enforce HTTPS once the certificate is ready.
6. **Switch the config** to Live (section 7). Check the live site: every
   canonical, the redirects, `/404`, and `/privacy-policy`.
   - Then delete the `staging` CNAME record from the `fixmypcperth.com`
     zone in Cloudflare, so the borrowed subdomain is handed back. A
     leftover record pointing at GitHub Pages with no site behind it is
     open to subdomain takeover.
7. **Update the store listings** (privacy, support and marketing URLs) to
   the new addresses.
8. **Search Console:** keep or add the domain property, submit the new
   sitemap, and watch coverage.
9. **Cancel the old host only after steps 6–8 are confirmed.** Until
   then, reverting DNS is the rollback.

## 9. Execution order

- [x] **1. Config:** `.gitignore`, `Gemfile` + `Gemfile.lock` (Jekyll
      4.4.1, committed so CI builds the exact versions tested locally),
      `pages.yml`, `_config.yml` in its Preview state, `main` branch
      pushed.
  - [x] *(owner)* Preview setup, section 7: default branch `main`, Pages
        source GitHub Actions, Cloudflare `staging` CNAME (DNS only),
        custom domain `staging.fixmypcperth.com` + Enforce HTTPS.
  - Run 1 on `main` failed at "Check built output" as intended (step 1
    only, no homepage). Run 2 (step 2 on `main`) built and deployed to
    https://staging.fixmypcperth.com/.
- [x] **2. Shell:** `shell.css`, `default.html`, header, footer, scripts,
      plus `logo.html` and `favicon.svg` (moved up from step 7).
  - `index.html` is a **temporary placeholder** so the shell has a page
    to render. Step 5 replaces it.
  - Checked in Chromium (19 checks, all passing): desktop, 390px and
    320px phones, dark mode, no JavaScript, keyboard skip link, the
    phone menu (open, Escape, tap outside, focus return), header scroll
    state, reveal, no console or network errors, no sideways scroll.
  - Checked the Live config too (`url`/`baseurl`/`staging` swapped in):
    every link, canonical and robots tag switched with no page edits.
  - Rules the later steps must keep:
    - The app page must have an element with `id="download"`; the
      header's "Get the app" button links to it.
    - Never put `.reveal` on first-screen content (it hides until
      scrolled into view, which would delay the hero's paint).
    - Button and badge groups go in `.btn-row`.
    - Nav labels name their destination ("Backup & Drive", "Daily
      Info"); the logo is the way home, so there is no "Home" link.
- [ ] **3. Includes:** `store-badges`, `faq-schema`, `breadcrumb-schema`.
- [ ] **4. Layouts:** `app`, `post` and `legal`, each with its CSS.
- [ ] **5. Core pages:** `apps.yml`, homepage, app page, privacy, terms,
      404.
- [ ] **6. Daily Info:** the hub, then the 6 articles.
- [ ] **7. SEO files:** robots, sitemap, OG card, GA4. (The favicon
      was done in step 2.)
- [ ] **8. Validate on Preview:**
  - Build locally with `JEKYLL_ENV=production bundle exec jekyll build`.
    Don't audit the output of `jekyll serve`: it swaps `site.url` for
    `http://localhost:4000`, so every canonical looks wrong.
  - `html-validate` on every built page.
  - Check that every canonical is on `staging.fixmypcperth.com`.
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
- [ ] Confirm the flagship's Apple id (`6760700432`) is current — the
      legal template pasted earlier named a different sibling app's ids.
- [x] ~~The real app icon (PNG)~~ — done, see section 4a. Screenshots for
      the flagship's app page are still needed; CSS device mockups are
      the placeholder until then.
- [ ] For each of the three "more" apps (PDF tool, file-transfer tool,
      data-recovery tool): real name, one-line description, App Store
      link if one exists, and an icon. Their Play Store links alone are
      enough to build a working card; these fill in the rest without a
      template change.
- [ ] The GA4 measurement ID (`G-…`) for step 7. Create a GA4 property for
      dailyutilityapps.store; until then analytics is simply left out.
- [ ] Verify `fixmypcperth.com` (for the preview) and later
      `dailyutilityapps.store` on the GitHub account.

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
- Step 1 done: build config, Gemfile.lock, deploy workflow, `main`.
- Step 2 done: shared styles, page wrapper, header, footer, scripts.
  Design follows the Apple Design principles: system font, size-specific
  tracking, press feedback on :active, a translucent header with a
  scroll-edge hairline, a menu that grows out of its button, and
  support for reduced motion, reduced transparency and higher contrast.
  Light and dark colour pairs all pass WCAG AA.
- Preview moved from the github.io project URL to
  `staging.fixmypcperth.com` (borrowed; handed back at the cutover).
  `_config.yml` now `url: https://staging.fixmypcperth.com`, `baseurl: ""`,
  `staging: true`.
- Full verification after the "error on push" report:
  - The one failed run (`main`, run 1) failed where intended: "Check
    built output", because `main` has no homepage yet. Bundle install and
    the Jekyll build before it succeeded on the runner.
  - A fresh clone of the branch, installed with the lockfile frozen as CI
    does, builds and passes the check step.
  - Workflow actions bumped to their Node 24 majors (the run warned that
    Node 20 is deprecated); `actionlint` is clean.
  - `html-validate` (recommended rules): clean.
  - Browser suite at the new root address: 19/19.
  - Link audit: the only missing targets are the pages and share image
    that steps 5–7 build.
- `main` fast-forwarded to the branch (fc50b62). Run 2: build and
  deploy green, published to https://staging.fixmypcperth.com/.
- Footer legal row shortened to two lines: `© year CloudGate Technologies
  Pty Limited (ACN …)` and a one-line Apple/Google trademark credit. The
  street address was removed from the footer (it stays on the legal
  pages and in the Organization schema). "A brand of CloudGate
  Technologies" moved into the footer tagline.
- GitHub's starter `jekyll.yml` (added via the Pages "Configure" button)
  was merged in and then removed: it failed on Ruby 3.1 and duplicated
  `pages.yml`.
- Installed the `apple-design` skill at `.claude/skills/apple-design/`
  (excluded from the Jekyll build), so it loads automatically for
  CSS/motion work in this repo, with a short section mapping its rules
  to what `shell.css` already does.
- Fixed a real bug the real logo PNGs exposed: the workflow's "no
  unrendered Liquid" check grepped the whole `_site`, including binary
  images — a PNG's compressed bytes coincidentally containing `{{` would
  have failed every future deploy. Scoped the grep to text file types.
- Wired in the real logo (section 4a): cropped the icon out of the
  supplied lockups, replaced the placeholder SVG mark and favicon,
  corrected the brand name to "Daily Utility Apps" site-wide, and
  adopted the real tagline "Smart Tools for Everyday Life".
- Revised the homepage and apps plan to flagship-first (section 5a): only
  Cloud Storage Backup & Drive gets a full `app.html` page; the other
  three apps the user linked (PDF tool, file-transfer tool, data-recovery
  tool — real names not yet supplied) get a homepage/footer card each,
  reusing `app.html` later if one of them warrants its own page.
