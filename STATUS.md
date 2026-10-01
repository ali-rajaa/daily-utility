# Daily Utility Apps — Status

Living reference for this repo. It records what we decided and why, so
no session has to re-derive or re-argue it. Update it whenever a
decision changes or a phase completes.

**Current state:** The base site is complete — build steps 1–8 are done
(section 5d): every page, the Daily Info hub, robots.txt, sitemap.xml,
the share card, and a full validation pass. Only step 9 (cutover to
dailyutilityapps.store) remains, plus GA4 once an ID exists. **Work is committed and
pushed straight to `main` only** (user, 29 Sep: "from now on ONLY push to
main"); `main` deploys the preview. The old `claude/bold-feynman-c7lqej`
branch is no longer used (all merged; the user deletes it in GitHub —
this environment can't delete branches). Next: improve pages on this
base; then step 9.
**Before cutover:** the owner must review the legal pages and all app
copy against the real store listings (section 10).

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
│   ├── icon-sprite.html           # hidden SVG <symbol> sprite, included once in
│   │                              # default.html; use as <use href="#i-name"/>
│   ├── store-badges.html          # params: ios_url, android_url
│   ├── hero-glow.html             # SVG gradient-mesh glow; pair with
│   │                              # .hero-glow-host/-content (section 4f)
│   ├── faq-schema.html            # param: faqs -> FAQPage JSON-LD
│   └── breadcrumb-schema.html     # param: crumbs -> BreadcrumbList JSON-LD
├── _data/
│   └── apps.yml                   # app listing metadata only, never page content
├── assets/
│   ├── css/
│   │   ├── shell.css              # tokens, reset, header, footer, nav, fonts
│   │   └── pages/
│   │       ├── index.css
│   │       ├── app.css
│   │       ├── post.css
│   │       ├── blog-hub.css
│   │       └── legal.css
│   ├── fonts/                     # Space Grotesk + DM Sans, self-hosted
│   │   │                         # variable fonts, latin subset only
│   │   │                         # (section 4e)
│   │   ├── space-grotesk-latin.woff2
│   │   └── dm-sans-latin.woff2
│   ├── icons/                     # the real brand mark, cropped from the
│   │   │                         # supplied logo files (assets/icons/mark.png
│   │   │                         # is the 833px master; favicon-*.png,
│   │   │                         # apple-touch-icon.png and mark-192.png are
│   │   │                         # derived from it, see section 4a)
│   │                             # (no apps/ folder: the real app icons were
│   │                             # deleted 29 Sep -- see section 5c)
│   └── og/default.png             # 1200x630 share card
├── index.html                     # layout: default. Homepage
├── cloud-storage-backup-drive.html   # layout: app
├── (hub is daily-info/index.html)  # layout: default. Blog hub, served at /daily-info/
├── daily-info/
│   ├── backup-before-switching-phones.md   # real article, shipped in step 4h;
│   │                              # .md not .html -- Jekyll only runs kramdown
│   │                              # over markdown-extension files (section 4)
│   ├── free-up-phone-storage.md
│   ├── automatic-photo-backup-iphone-vs-android.md
│   ├── app-data-backup-new-phone.md
│   ├── is-cloud-backup-safe.md
│   └── cloud-vs-local-backup.md
├── privacy-policy.md               # layout: legal (.md, not .html -- prose body)
├── terms-of-service.md            # layout: legal
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

**Every page sets its own `css:`, always — a layout's own `css:` does
NOT cascade to the pages that use it.** Jekyll doesn't merge a layout's
front matter into the pages rendered through it; each specialized
layout's `css: app`/`css: post`/`css: legal` only covers the
never-happens case of a page on that layout that skips setting `css:`
itself. This was found the hard way in step 4 (29 Sep): the first real
Daily Info post set `layout: post` only, assuming the layout's `css:
post` would apply, and `pages/post.css` silently never loaded — nothing
errored, sections just weren't styled and would have shipped unstyled
if a screenshot hadn't been checked before a scroll-triggered image bug
led to it being found. `default.html` loads `shell.css`, then
`pages/<css>.css` only when the *page's own* `css:` is set. There is no
silent fallback: the homepage sets `css: index`, the hub sets `css:
blog-hub`, and every app/post/legal page sets `css: app`/`post`/`legal`
itself, same as the layout file does.

| Layout | Used by | Required front matter |
|---|---|---|
| `default` | Homepage, Daily Info hub, 404 | `title`, `description`. Optional: `css`, `image`, `image_alt`, `noindex` |
| `app` | App landing pages | `title`, `description`, `css: app`, `app_name`, `tagline`, `icon`, `ios_url`, `android_url`, `category`, `features` (icon, title, text), `how_it_works` (3 steps: title, text), `faqs` (q, a). **No body content.** |
| `post` | Daily Info articles | `title`, `description`, `css: post`, `heading`, `category`, `date`, `updated`, `read_min`, `slug` (must match the filename), `image`. The body is prose (written as `.md`, not `.html` — Jekyll only runs Markdown through kramdown for markdown-extension files). Optional: `faqs`, `related` (a list of other posts' `slug` values). Body `##` headings must not start with a digit — kramdown's auto-generated `id` would start with a digit too, which fails HTML validation; write "Step 1: ..." not "1. ...". |
| `legal` | Privacy, terms | `title`, `description`, `css: legal`, `last_updated`, `sections` (id, label). Each body `<h2>` uses the matching `id` |

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

## 4b. Skills installed in this repo

Both under `.claude/skills/` (excluded from the Jekyll build). Neither is
optional reading — check new CSS/layout work against both before it
ships, not just when something looks off.

- **`apple-design`** — fluid-interface motion/interaction guidance from
  Apple's WWDC talks, translated to CSS. See section 4c for the audit
  against it.
- **`ui-ux-pro-max`** (from `nextlevelbuilder/ui-ux-pro-max-skill`,
  copied in whole — SKILL.md, `data/`, `references/`, `scripts/`, 3.7MB)
  — a searchable local database (UX guidelines, style/color/typography
  catalogs, stack-specific rules) queried via
  `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>`.
  **Its own docs invoke it via `${CLAUDE_PLUGIN_ROOT}`, which is a
  marketplace-plugin mechanism — it is not set for a skill copied
  straight into a repo's `.claude/skills/` like this one.** Invoke it by
  its real path instead, exactly as above. Confirmed working: ran
  several `--domain ux` queries during the audit in section 4c.

## 4c. Apple Design + responsiveness audit (28 Sep)

Prompted by the user asking directly whether the Apple Design skill had
actually been applied to `shell.css`, and to check mobile responsiveness
properly (earlier checks covered only 320/390/1280px). Full findings:

**Apple Design skill, rule by rule against `shell.css`:**

- §1 Response: `.btn:active { transform: scale(0.97) }`, no delay —
  matches ("respond on pointer-down, not release").
- §4 Springs: no JS springs exist (nothing drag-driven yet), but the
  fallback the skill's own site-specific note allows — one consistent
  easing curve (`--ease-out`), no `@keyframes` anywhere — is followed.
- §7 Spatial consistency: the phone nav panel's `transform-origin: top
  right` anchors it to the button that opens it — matches.
- §11 Frame-level smoothness: only `transform`/`opacity` are animated
  for anything gesture-adjacent. Exception: `.site-header`'s
  `is-scrolled` hairline transitions `box-shadow` (paint, not layout) —
  low-cost, not gesture-driven, left as is.
- §12 Materials: `.site-header` is a real `backdrop-filter` layer with a
  `@supports` fallback to a solid background; the hairline only appears
  once content is under it, not as a permanent hard divider.
- §14 Accessibility preferences: `prefers-reduced-motion` (cross-fades
  replace the slide/scale, matches "keep opacity, drop movement"),
  `prefers-reduced-transparency` (header goes solid), `prefers-contrast:
  more` (solid header + strengthened border) are all implemented and
  were re-verified as part of this audit.
- §15 Typography: system font first, `font-optical-sizing: auto`, every
  size in `rem`. Tracking is genuinely size-specific, not one fixed
  value: -0.028em on `h1` down to +0.005em on `.text-sm` and +0.08em on
  uppercase eyebrow/footer labels — the skill explicitly calls out
  positive tracking on small text as the commonly-missed half of this
  rule, and it's there.
- **One open watch-item, not a bug:** §12 also asks for higher-contrast,
  slightly heavier text specifically over translucent surfaces ("put
  color on a solid layer, not the translucent foreground"). `.nav-link`
  currently uses `--text-2` (a mid-gray) over the blurred header. Today
  every page behind the header is a flat `--bg`/`--bg-alt` section, so
  there's no real contrast risk yet — but **when step 5 adds a hero with
  imagery or a gradient, recheck nav-link legibility over it** and
  bump weight/color if needed.

**Responsiveness — a real bug found and fixed, not just re-confirmed:**
swept 320 through 2560px (23 widths, including phone landscape and the
exact 759/760/761px breakpoint seam) for horizontal overflow, header
internal overflow, footer fit, and touch-target size, using
Playwright/Chromium against a production build. 138 checks now pass, 0
fail — but the first pass found 12 real failures: **the header's
"Get the app" button (`.btn--sm`) was 36px tall at every desktop width**,
below both Apple's 44pt guidance and `ui-ux-pro-max`'s own "Touch &
Interaction — CRITICAL — min 44×44px" rule (confirmed by querying it
directly). Touchscreen laptops and tablets exist at desktop widths too,
so this wasn't dismissed as "mouse-only, doesn't need it". Fixed by
dropping `.btn--sm` from that one button (`_includes/header.html`) — it
was the class's only use in the whole codebase, so `.btn--sm` itself is
now dead code, kept in `shell.css` for the next thing that legitimately
needs a small button. Re-verified visually (desktop header screenshot,
light and dark) that the taller button doesn't look out of place in the
64px header bar.

`.nav-link` measures 40px, not 44px, at every width — left as is. It's a
text nav link, not a primary action button; 40px already clears the
actual WCAG 2.5.8 minimum (24px) by a wide margin, and inflating plain
nav links to the full 44px would pad out the header for no real gain.

## 4d. `ui-ux-pro-max --design-system` run (28 Sep)

Section 4c used `--domain ux` spot-checks only (a real bug came out of
that). The user then asked directly whether the skill had actually been
applied — it hadn't, not in full: the skill's own workflow marks
`--design-system` "REQUIRED for new pages/projects" as the primary step,
and that hadn't been run. Ran it now, ahead of step 5, since that's
exactly when a product-wide design-system read matters:

```
python .claude/skills/ui-ux-pro-max/scripts/search.py \
  "utility app backup cloud storage landing page" --design-system -p "Daily Utility Apps"
```

Read-only — not `--persist`, so nothing was written to
`design-system/`; this was a check against what's already built, not a
new source of truth to reconcile later.

**Confirms what's already in place:** the recommended primary
(`#2563EB`) sits in the same blue family as `--brand` (`#0b5fe8`, taken
from the real logo, section 4a) — no change needed, the real logo wins
over a generic recommendation anyway. Transition timings (150-200ms),
the full accessibility/responsive checklist, and cursor:pointer on every
interactive element were all confirmed already satisfied (the last one
checked directly with Playwright's `getComputedStyle`, not assumed).

**Two real tensions, decided rather than silently picked either way:**

- **Typography:** it recommends Inter. `shell.css` uses `system-ui`
  first, per the Apple Design skill's explicit "default to the
  platform's system font, override only with a reason" — kept as is.
  Visually close to Inter anyway (same geometric-sans family), and
  system-ui costs zero extra requests and no FOUT. Revisit only if the
  user specifically wants Inter's branded look.
- **Shadows:** the matched style ("Flat Design") says avoid them.
  `shell.css` uses soft `box-shadow` for the header's scroll-elevation
  hairline and the mobile menu panel. Kept as is — these signal "this is
  floating above the page," which is closer to an accessibility/affordance
  cue than decoration, and plenty of otherwise-flat systems (Stripe,
  Linear) do the same for popovers/dropdowns.

**One real, un-applied opportunity — needs the user's call, not mine:**
the recommendation uses a CTA color distinct from the primary (amber,
`#D97706`) rather than matching the primary button to the brand blue,
which is what `.btn--primary` currently does. `shell.css` already has an
unused `--accent` token (`#06b6d4`, cyan) sitting idle — closer to the
real logo's blue→green gradient than an unrelated amber would be. Worth
asking before step 5: should the primary "Get the app" CTA use that
accent instead of matching `--brand`, for more contrast against the rest
of the blue-heavy UI? Not applied without asking.

## 4e. Base redesign to the `ui-ux-pro-max` design system (28 Sep)

Section 4d surfaced options but changed nothing. The user then asked
directly to design the base *according to* the skill, explicitly for
something unique, not the first generic match. Explored further
(`--domain style` for "glassmorphism modern premium" and for "trustworthy
premium tech utility", `--domain typography`, `--domain landing`,
`--domain product`) before deciding, rather than taking the first
`--design-system` result as final. Landed on:

**Style: Glassmorphism**, not the earlier "Flat Design" match — the
header already *was* a glass surface (built in step 2, before this
skill existed in the repo), so this formalizes and extends something
already there rather than bolting on something new. The skill's own
listing names it "Best For: Modern SaaS... lifestyle apps... navigation"
— a direct fit — and `products.csv` lists Glassmorphism as a secondary
style for collaboration/utility tools, corroborating it rather than
being the sole source for the choice.

**Colour: sampled from the real logo, not the catalog.** Read actual
pixel values out of `assets/icons/mark.png` (Pillow, sampling the body
and the accent tile away from the white cutout) rather than using the
skill's generic recommended primary (`#2563EB`). Result:
- `--brand-2: #16b871` (from the logo's green tile) + `--brand-gradient`
  (blue → `#0f9ed6` → green), for decoration only.
- **Checked whether that gradient could sit behind white button text
  before using it anywhere** — computed contrast across the full blend,
  not just the endpoints. It fails 4.5:1 past t=0.20 (blue end only);
  the far/green end is 1.64:1. So the gradient is decoration-only
  (hero glow, borders, the mark itself) and never goes behind text —
  `.btn--primary` stays solid `--brand`, already verified accessible.
- `--brand-2` itself is 2.6:1 on white — also decoration-only. Added
  `--brand-2-text` (`#0a7a47`, 5.4:1) as its safe foreground sibling,
  the same relationship `--brand-text` already has to `--brand`, for
  the day something needs a small green label/icon.
- Full contrast re-check across every token pair, light and dark,
  including both new tokens: all pass, none is a guess.

**Typography: "Tech Startup" pairing** (`--domain typography`) — Space
Grotesk for headings/brand moments, DM Sans for body and UI chrome.
Reverses the section 4c/4d decision to keep system-ui; the user's
explicit ask to design *to* this skill is the reason, not a reversal of
the underlying reasoning (Apple Design's "prefer system font" is still
right as a default — this is a deliberate brand choice overriding that
default, not a rejection of it).
- Both self-hosted as **variable fonts** (`assets/fonts/dm-sans-latin.woff2`,
  `space-grotesk-latin.woff2`, 37KB + 22KB) — one file per family covers
  every weight used; confirmed with `fontTools` (`fvar` axes: DM Sans
  100-1000, Space Grotesk 300-700), not assumed from the Google Fonts
  response alone.
- **Caught before shipping:** `h1` was set to weight 750, but Space
  Grotesk's variable axis tops out at 700 — it would have silently
  clamped and become visually identical to `h2` at 700. Rescaled the
  whole heading weight ramp to fit inside the font's real range (h1 700,
  h2 650, h3 600) instead.
- Latin subset only (no latin-ext) — deliberate simplification for an
  English-only site; an occasional accented character falls back to
  system-ui, an acceptable trade-off against a second subset nothing
  currently needs.
- `--font-heading` applied to `h1`-`h3`, `.eyebrow`, `.logo-word`,
  `.footer-head` — brand/heading moments. Buttons, nav, footer body text
  stay on `--font` (DM Sans) on purpose: Space Grotesk's character is
  for display use, not small UI chrome.
- Both preloaded in `default.html`'s `<head>` (render above the fold on
  every page); confirmed both actually load via
  `document.fonts` in a real browser, not just that the files exist.

**Glass extended to the mobile nav panel** (`_includes` unchanged,
`shell.css` only) — it was solid `--surface` before, so the header felt
like glass but the menu it opened didn't. Now `--surface-glass` +
`backdrop-filter: blur(20px)`, with its own `@supports` fallback and
`prefers-reduced-transparency` fallback (both added alongside the
header's existing ones, not a new mechanism). Screenshotted with the
menu open: the hero text visibly blurs through the panel, confirming the
blur is real, not just a translucent tint.

**Verification, not just visual review:** full rebuild, `html-validate`
clean, the 19-check browser suite and the 138-check responsiveness sweep
both still pass (no regression from a change this size), fonts confirmed
loaded via `document.fonts.status`, and every token pair re-run through
the contrast checker.

**Still open from 4d, unresolved on purpose:** the primary CTA accent
question. Now more pointed with a real `--brand-2-text` available: should
`.btn--primary` (currently solid `--brand`) switch to a green accent for
contrast against the rest of the blue UI, or does that fight the new
glass/gradient identity by introducing a third hue? Leaning toward
"leave it blue" now that the gradient itself carries the brand's dual-hue
identity — but this is a call for the user, not made here.

## 4f. Real SVG + motion pass, and a light audit (28 Sep)

The user's assessment was fair: the shell had the right bones (tokens,
glass header, type system) but nothing yet used them to feel designed —
no real icons beyond the logo, a flat white hero, zero motion beyond the
nav. Added three things, all reusable rather than one-off:

- **`_includes/store-badges.html`** — real Apple/Google SVG marks (the
  same path data already proven on the sibling CloudGate site's badges,
  not a fresh guess at official brand assets), parameterized on
  `ios_url`/`android_url` so any current or future app can use it.
  Deliberately fixed dark colours regardless of site theme — real
  App Store/Play Store badges never adapt to surrounding UI, and that
  fixed look is part of what makes them recognisable.
- **`_includes/hero-glow.html`** — an SVG gradient-mesh glow (three
  blurred, radial-gradient circles in `--brand`/`--brand-2`/`--accent`)
  for hero sections, with `.hero-glow-host`/`.hero-glow-content` helper
  classes in `shell.css`. Confirmed in a real browser (not assumed) that
  SVG `stop-color="var(--brand)"` actually resolves through the CSS
  cascade — it does.
- **The placeholder homepage hero now uses both**, and in the process
  fixed a real broken link: "Get the app" pointed at
  `/cloud-storage-backup-drive#download`, a page that won't exist until
  step 5, so it 404s today. Replaced it with the flagship's real store
  badges pulled from `apps.yml` — the hero now actually works, not just
  looks better.

**A real stacking bug caught before it shipped:** an absolutely
positioned `z-index: 0` layer (the glow) paints *above* plain in-flow
content per CSS's own stacking rules, not below it — despite `z-index:
0` reading as "the bottom." Verified this exact failure mode would have
buried the hero text under the glow, then added `.hero-glow-content`
(`position: relative; z-index: 1`) as a required pairing, documented
inline so the next page that uses `.hero-glow-host` doesn't rediscover
it by shipping invisible text.

**Motion:** kept to the same restraint as the rest of the site — the
glow drifts on a ~19-27s cycle (three different durations per blob, so
they don't move in lockstep), which is comfortably slower than the ~5s
(0.2Hz) cycle Apple's own motion guidance flags as the range to avoid.
Added `will-change: transform` on the blobs, a specific Apple Design
recommendation ("hint where motion is imminent") not yet applied
anywhere else in the codebase.

**Light audit — new elements checked against both skills, not just
visually reviewed:**

| Check | Result |
|---|---|
| Store badge touch target | 49×152px measured in Chromium — clears 44px |
| Store badge text contrast | 18.4:1 (bold), 11.16:1 (caption) on the badge's dark bg |
| SVG `var()` resolution | confirmed via `getComputedStyle` in a real browser, not assumed |
| Hero content paints above the glow | confirmed via computed `z-index`/`position`, not just visually |
| `prefers-reduced-motion` | glow animation stops entirely (not just slows) |
| `prefers-reduced-transparency` / `prefers-contrast: more` | glow hidden outright |
| No horizontal overflow, 320px/390px | 0px both, with the new hero content in place |
| Console/page errors | none |
| Full regression suites | 19-check shell suite + 138-check responsiveness sweep both still pass |

Screenshotted light, dark, and mobile (390px) — the glow reads as
atmosphere behind the glass header/hero rather than competing with the
text, in both themes.

## 4g. Step 3 finished: `faq-schema` + `breadcrumb-schema` (28 Sep)

Both take a Liquid list param (`faqs`: `{q, a}`; `crumbs`: `{name, url}`)
and render nothing if the param is missing or empty, so calling either
on a page that doesn't have FAQs/breadcrumbs yet is always safe. Both
use Liquid's `jsonify` filter rather than hand-built strings, so a
value containing a quote mark or an ampersand can't silently produce
broken JSON.

**A real vulnerability found and fixed, not just a style choice:**
tested both with adversarial content in a throwaway page (never
committed — built, checked, deleted before anything was pushed),
including an FAQ answer containing the literal text
`</script><script>alert(1)</script>`. `jsonify` escapes quotes
correctly but **does not escape forward slashes**. Unescaped, that
`</script>` closes the JSON-LD `<script>` tag early regardless of being
"inside a JSON string" — the HTML parser doesn't know or care about
JSON syntax — which both breaks the schema and injects a live,
executing `<script>` tag onto the page. Confirmed the exact failure by
counting literal `</script` occurrences in the built output (5 where
4 was correct) before the fix, and exactly 4 after it.

**Fix:** every `{{ x | jsonify }}` in both includes is followed by
`| replace: "/", "\/"` — a backslash-escaped solidus is valid JSON and
represents the identical character once parsed, so this changes nothing
about the data, only how it's allowed to appear inside an HTML
`<script>` block. Re-ran the same adversarial test after the fix:
`</script>` now renders as the inert text `<\/script>` inside the JSON
string, exactly 4 real script closures exist in the output, and both
blocks still parse as valid JSON (checked with Python's `json.loads`,
not eyeballed).

Real-world exploitability today is low — `faqs`/`crumbs` only ever come
from hand-authored front matter, never user input — but the fix costs
nothing and the alternative was "works as long as nobody ever writes
`</script>` in a Q&A," which isn't a real guarantee.

Step 3 is now complete: `store-badges`, `hero-glow` (not in the
original plan, earned its place — section 4f), `faq-schema`,
`breadcrumb-schema`.

## 4h. Step 4 finished: `app`, `post`, `legal` layouts (29 Sep)

Built and verified all three remaining layouts and their CSS, each
exercised with a real (or, for legal, throwaway-only) page rather than
trusted on inspection alone: build → check for unrendered Liquid →
`html-validate` → parse every JSON-LD block with Python's `json.loads`
→ re-run the adversarial XSS test from section 4g against the new
schema output → serve locally → Playwright checks (structure,
interactive behaviour, touch targets) → screenshots in light/dark/
mobile → full `shell-test.js` (19 checks) + `responsive-sweep.js` (138
checks) regression to confirm the shared shell.css edits broke nothing.
Every layer came back clean, but three real bugs surfaced along the
way — this only found them because each one was actually exercised
end-to-end, not because the code looked wrong on review:

1. **`app.html` didn't escape plain-text output.** `page.app_name`,
   `step.title`, `feature.text`, `item.q`/`item.a`, etc. were output
   raw (`{{ page.app_name }}`, not `{{ page.app_name | escape }}`).
   Harmless while every app's name happens to avoid `&`/`<`/`>`, but
   Cloud Storage Backup & Drive's own name has an `&` in it, and
   `html-validate` correctly flagged the resulting raw `&` in text
   nodes as invalid HTML. Fixed by adding `| escape` to every plain
   (non-`jsonify`) output in the layout — the JSON-LD block was already
   safe via the section 4g `jsonify | replace` pattern, this was only
   about the visible HTML.

2. **The documented "layouts cascade `css:` to their pages" mechanism
   is false.** Section 4 said "each layout sets `css:` in its own
   front matter and every page using it inherits it" — Jekyll does not
   actually do this; a layout's front matter is not merged into the
   pages rendered through it. This went unnoticed while building
   `app.html` because the one page built on it,
   `cloud-storage-backup-drive.html`, happened to also set `css: app`
   on itself. It surfaced for real on the first Daily Info post, which
   set only `layout: post` (trusting the documented cascade) —
   `pages/post.css` silently never loaded, no error, sections just
   rendered unstyled. **Fixed at the root**, not patched around: every
   page must now set its own `css:` matching its layout, exactly like
   `default.html`-layout pages (homepage, hub) already did. Corrected
   the false claim in `default.html`'s, `app.html`'s and `post.html`'s
   own header comments and in section 4's table above, and added
   `css: post` to the real post's front matter.

3. **A square source image blown up huge as a post's hero.** The real
   post's `image:` front matter pointed at the app's (square) icon file
   — there's no real editorial photography for Daily Info yet.
   `.post-image` had `width: 100%; height: auto`, so with no CSS
   aspect-ratio constraint the browser sized it by its own native
   ratio, not the 1200×630 the `width`/`height` HTML attributes implied
   — a giant, nearly-square image dwarfing the rest of the article
   (caught by screenshot, not by any validator). **Fixed generally**,
   not just for this one image: `.post-image` now sets
   `aspect-ratio: 1200 / 630; object-fit: cover`, so any future source
   image displays as a consistent banner regardless of its own native
   shape, rather than depending on every image being pre-cropped
   exactly right.

Two more corrections, smaller but worth recording:

- **Markdown content must be written in `.md` files, not `.html`.**
  The first draft of the sample post was `.html` with front matter and
  Markdown-syntax body content; Jekyll only runs kramdown over
  markdown-extension files, so the `## Heading` lines rendered as
  literal text, not real `<h2>` tags. Renamed to `.md`; documented in
  section 4's table.
- **A body `##` heading must not start with a digit.** kramdown
  auto-generates each heading's `id` from its text, and an id starting
  with a digit (from `## 1. Do the thing`) fails `html-validate`'s
  `valid-id` rule. Reworded the sample post's step headings to "Step 1:
  ..." instead of "1. ...". Documented in section 4's table so the next
  article doesn't repeat it.

**Refactor while building `post.html`:** the FAQ accordion and closing
CTA band markup (`.faq-list`/`.faq-item`/`.faq-q`/`.faq-chevron`/
`.faq-a`, `.cta-band`) is shared between `app.html` and `post.html`, so
those rules moved out of `pages/app.css` into shell.css's new "Shared
page components" section rather than being duplicated into
`pages/post.css`. Likewise, the prose typography `post.html` and
`legal.html` both need (headings, paragraphs, lists, links inside
hand-written body content) is now a shared `.prose` class in shell.css,
applied alongside each layout's own body class (`class="prose
post-body"` / `class="prose legal-body"`) — `pages/post.css` and
`pages/legal.css` only add what's actually different between the two
(post: blockquote/code; legal: the TOC-anchor scroll offset).

**What got built, concretely:**

- `_includes/icon-sprite.html` — a hidden SVG sprite of 9 hand-drawn
  24×24 stroke icons (cloud, shield, sync, devices, photo, auto, folder,
  check, chevron-down), included once in `default.html`. Referenced as
  `<svg><use href="#i-name"/></svg>` wherever an icon is needed, instead
  of a third-party icon font/CDN or repeating full path data per use.
- `_layouts/app.html` + `assets/css/pages/app.css` — hero (icon, name,
  tagline, store badges), 3-step how-it-works, feature grid (icon
  cards), FAQ accordion with schema, trust band linking to the privacy
  policy, closing CTA band. Fully front-matter-driven, no body content,
  same doorway-page reasoning as fixmypcperth's `suburb.html`.
- `_layouts/post.html` + `assets/css/pages/post.css` — breadcrumb (both
  visible nav and `BreadcrumbList` JSON-LD, hand-written for the fixed
  Home > Daily Info > article shape rather than a per-post front-matter
  list), title/category/date/read-time, hero image, prose body,
  optional FAQ and related-articles sections, `Article` JSON-LD, closing
  CTA band.
- `_layouts/legal.html` + `assets/css/pages/legal.css` — title,
  last-updated line, a sticky (desktop) / static (mobile) table of
  contents generated from `sections:` front matter, prose body. No
  hardcoded `canonical:` — uses the same logic as every other page.
- `cloud-storage-backup-drive.html` — the flagship's real app page, now
  live (not a placeholder). `apps.yml`'s `built:` flipped to `true` for
  it, so nav/footer link to it correctly. **Correction (step 5, 29
  Sep):** this entry originally said its FAQs were "written from how the
  app actually works". That was wrong — no store description was ever
  supplied, and the copy invented specifics (files stay in your own
  cloud account, a Wi-Fi-only setting, encrypted in transit and at
  rest). Rewritten in step 5 to claim only the confirmed scope; see
  section 5b.
- `daily-info/backup-before-switching-phones.md` — one real Daily Info
  article (generic, defensible advice; not a claim about the company or
  app's own practices), used to verify `post.html` end-to-end.

## 4i. Post-ship audit of step 4 (29 Sep)

Re-audited step 4 independently after it shipped, rather than trusting
the verification already recorded above: fresh clean build off the
actual committed `HEAD` (not the working tree), full `html-validate` +
JSON-LD re-check, then a round of edge cases the original pass hadn't
actually exercised. All done with throwaway test pages, built, checked
and deleted before anything was committed — same discipline as the
section 4g/4h XSS tests.

**One more real bug found: `legal.html` without `sections:` renders its
body squeezed into the 224px sidebar column.** `sections` is documented
as required front matter, but the layout's `{% if page.sections %}`
around the TOC `<nav>` means a page that skips it still builds cleanly
— it just silently drops the reader's content into `.legal-grid`'s
first (14rem) column, because CSS grid auto-places a lone child there
when nothing says otherwise. Same shape of bug as section 4h's `css:`
cascade issue: a "this front-matter field is required" assumption that
nothing actually enforced or defended against. **Fixed generally**: a
`.legal-grid > .legal-body:only-child { grid-column: 1 / -1; ... }` rule
in `pages/legal.css` makes the body span full width whenever the TOC
sibling isn't rendered, so a legal page missing `sections:` degrades to
a normal single-column page instead of a broken one. Verified both
ways with throwaway pages: with `sections:` set, the TOC/body two-column
layout is unchanged (224px + 672px, matching before the fix); without
it, the body now measures full width (736px) instead of the broken
224px it measured before.

**Everything else checked came back clean, not just unremarked-on:**
- An app page with only `android_url` set (no `ios_url`) and no
  `features`/`how_it_works`/`faqs`: renders exactly one store badge, no
  empty section shells for the skipped optional blocks, and the
  `SoftwareApplication` JSON-LD renders alone (no `FAQPage` block).
- `post.html`'s `related:` field, never actually exercised when it was
  built: a second throwaway post plus `related: [that-post's-slug]`
  resolves and links correctly.
- Re-ran the section 4g adversarial XSS payload
  (`</script><script>alert(1)</script>`, plus a quote mark and a raw
  `<b>` tag) through `page.heading` specifically — not just a FAQ
  answer, which was the only field previously tested this way. Renders
  fully HTML-entity-escaped in both the visible `<h1>`/breadcrumb and
  safely inside the `Article`/`BreadcrumbList` JSON-LD; exactly the
  expected `</script` count, no breakout, `html-validate` clean.
- Full `shell-test.js` (19) + `responsive-sweep.js` (138) + the
  dedicated app/post-page Playwright suites (17 + 14) re-run against
  the final, fixed state: all 188 checks pass.

## 5. Page sections

**Homepage — flagship-first, but every app gets a real page (see 5a).**
Each section follows the same pattern: eyebrow label, H2, sub-copy,
content.

1. Hero: brand statement ("Smart tools for everyday life"), CloudGate
   backing, a direct link into the flagship.
2. **Flagship spotlight** — Cloud Storage Backup & Drive gets real space
   here: a short pitch and both store badges, not just a card.
3. **More apps** — compact cards for the rest (icon, one line), each
   linking to *that app's own page* (not straight to the store — the
   store badges live on the app page itself, same as the flagship).
4. Why Daily Utility Apps: focused, privacy-first, real Australian
   company (ACN shown), iPhone and Android.
5. Latest 3 Daily Info posts, filled in automatically.
6. Closing CTA band, flagship store badges.

**App page (all four apps, same template):** hero with badges above the
fold → 3-step how it works → feature grid → FAQ with schema → security
and trust section linking to the privacy policy → closing CTA. One
`app.html` layout, fully driven by each page's own front matter — a
"more"-tier app's page is shorter/plainer where it has less to say
(fewer features, a simpler FAQ), not a different template.

## 5a. Apps — every app gets a page; flagship gets top billing

**Corrected 29 Sep (user):** the original plan gave only the flagship a
real page, with the other three as store-linking cards. That was wrong
— the user was explicit: every app gets its own page on the site;
Cloud Storage Backup & Drive is just the *main* one. `tier` in
`apps.yml` now controls prominence only (header nav link, hero
spotlight, top billing on the homepage grid), not whether a page
exists — `page: true` is set on all four, and all four will eventually
render through the same `app.html` layout. This is also simpler to
build: it removes the href-branching the old plan needed (internal link
for the flagship, external store link for everyone else) — every app
now just links to its own page, full stop.

All four apps' real names, icons and Play listing facts are confirmed —
the user sent screenshots of each live Google Play listing (28 Sep) and
they're in `_data/apps.yml`:

| App | Package ID | Tier | Page |
|---|---|---|---|
| Cloud Storage Backup & Drive | `com.backup.and.restore.all.apps.photo.backup` | `flagship` | Header nav link, hero spotlight. Apple id confirmed by the user: `6760700432` |
| Document Reader: Read All PDF | `com.dw.pdf.reader.pdfviewer.pdfeditor.alldocumentreader.filereader` | `more` | Own page, footer/grid listing only — no nav link |
| Smartphone All Data Transfer | `com.transfer.files.transfer.apps.share.app` | `more` | Same |
| Photo Recover & Data Recovery | `com.data.recovery.trashbin.recovery.files` | `more` | Same |

All four listings confirm the developer is "Daily Utility Apps" — matches
the brand name correction in section 4a.

- **Superseded 29 Sep (section 5c): the site never uses the real app
  icons.** The note below is kept for history only.
- **Icons:** cropped from the Play listing screenshots the same way the
  main logo was (Pillow; a tight window around the icon card, bbox by
  distance-from-white, small proportional padding — no bottom-margin
  bug this time since there's no text below the icon to overshoot into).
  Source: `assets/icons/apps/<slug>.png`; display size:
  `assets/icons/apps/<slug>-192.png`.
- **Taglines are inferred from the listing title and icon only** — not a
  full "About this app" description, which wasn't visible in what was
  supplied. Review them before they ship; they're placeholder-quality,
  not fabricated-quality.
- **No ratings or download counts stored or shown**, per the standing
  decision in section 6 — even though the flagship's listing shows a
  real 4.8★/10K reviews and the recovery app 3.1★/13K, and download
  counts range from "10+" to "1M+" across the four (showing that
  spread side-by-side would undercut the newer apps anyway).
- **`built: true` on all four** as of step 5 (each flipped only when its
  page shipped). The homepage grid, footer and every app page's "other
  apps" list read only `built: true` entries, so nothing ever links to a
  page that isn't live.
- **The footer's existing `/<slug>` link logic needs no change** now
  that every app gets a real page — the href-branching the old plan
  required (internal link for the flagship, external store link for
  everyone else) is no longer needed. One code path for all four.

**Daily Info:**

- Categories: Backup & Storage, Switching Phones, Photos & Media, Privacy
  & Security.
- Every post links once to the app page and once to a related post.
- No invented bylines, review dates or ratings.

## 5b. Step 5: core pages (29 Sep)

User asked to "continue with step 5 and apply properly, make it more
appealing". Built every remaining core page and redesigned the app
template, with one rule driving the copy: **claim only what's
confirmed.** No store "About this app" description was ever supplied for
any app, so the only confirmed facts are each listing's name, icon and
package ID, the flagship's scope (backup and restore of photos, videos,
contacts and app data — section 1), which stores each app is on, and the
company facts in section 2.

**Homepage (`index.html` + `pages/index.css`)** — the six sections from
section 5, replacing the step 2 placeholder:

1. Hero: two-tone H1 (accent word in `--brand-text`, *not* gradient text
   — the green end of the gradient fails even 3:1), primary CTA into the
   flagship page, "See all our apps", three check-marked facts, and a
   decorative cluster of the four app tiles (drawn glyphs since 5c —
   never the real icons) with glass capability
   chips (slow 19–24s float; `aria-hidden` since every icon is named and
   linked further down).
2. Flagship spotlight: name, tagline, the four confirmed backup
   categories, both store badges, and a gradient panel illustrating
   photos/videos/contacts/app data flowing into the app (dashed lines
   marching inward; off under reduced motion).
3. More apps: one card per `tier: more` + `built: true` app, each
   linking to its own page, platform derived from its store links.
4. Why us: one job done properly, privacy-first, real Australian company
   (ACN from `_config.yml`), iPhone and Android.
5. Latest Daily Info: up to three newest posts, listed automatically.
6. Closing CTA card with flagship badges.
- `Organization` JSON-LD with `@id …/#organization` lives here only;
  `_config.yml`'s `company:` gained `locality`/`region`/`postcode`/
  `country` for its `PostalAddress`.
- `#apps` wraps sections 2–3, so the footer's "All apps" lands on the
  flagship with the rest directly below.

**App pages** — `document-reader-pdf.html`, `smartphone-data-transfer.html`
and `photo-recover-data-recovery.html` added; all four now `built: true`.
Every claim traces to the listing title/package ID or company facts.
The recovery page's FAQ says plainly that no app can promise to recover
every deleted file.

**`app.html` fixes found while adding Android-only apps** — each would
have been false on three of the four pages:
- `"operatingSystem": "iOS, Android"` was hardcoded → now derived from
  which store URLs the page has.
- Closing CTA said "Free to download, for iPhone and Android" → now
  "Available on {platforms}", derived the same way ("free" dropped:
  never confirmed).
- Trust band claimed "encrypted in transit and at rest" for every app →
  now states only company-wide facts (maker + ACN, never selling data,
  link to the policy); an app-specific sentence goes in optional
  `trust_text` front matter, only when confirmed for that app.
- "How it works" H2 was hardcoded "Set up once, it just runs" (wrong for
  a document reader) → optional `steps_heading` front matter.
- Header "Get the app" pointed at the flagship's `#download` from every
  page → on an app page it now targets that page's own `#download`.
- Visual redesign in `pages/app.css`: haloed hero icon, a meta row
  (platforms, "Australian company", data never sold — deliberately not
  "Made in Australia", an origin claim nothing confirms), step cards joined by
  a dashed rail, icon-tiled feature cards, a new "Other everyday tools"
  cross-link list, and the closing CTA as a card. Trust band and CTA
  moved inside an inner wrapper so their backgrounds keep the gutter on
  phones instead of running edge to edge.

**Flagship copy rewritten** (see the correction in section 4h): removed
"files stay in your own cloud account", the Wi-Fi-only FAQ and
"encrypted transfer". **Taglines** in `apps.yml` lost "Automatic",
"fast and secure" and "in one tap" for the same reason.

**Legal pages (`privacy-policy.md`, `terms-of-service.md`)** — adapted
from the CloudGate Technologies templates the user pasted on 28 Sep (per
section 2's "legal text source"). Kept everything that is true of the
company: entity, ACN, address, Privacy Act/APPs, GDPR bases, rights,
OAIC complaints, children, governing law (WA), liability cap, ACL, and
the Privacy Officer named in the template. **CloudGate-product specifics
were not carried over**, because nothing confirms they apply to these
apps: AWS storage in the United States, Stripe, Firebase, 100GB/250GB/
500GB/1TB plans, Vault Lock, 30-day file recovery, 72-hour account
deletion. Those passages are written conditionally ("where an app stores
Your Content…", "if an app offers in-app purchases…"), which stays true
whatever the facts turn out to be. The terms add a backups/recovery
clause (no app is a substitute for your own copies; recovery can't be
guaranteed). **These need owner review before cutover** — see section 10.
- `legal.html` now emits the `BreadcrumbList` section 6 requires (it
  didn't in step 4), shows a visible breadcrumb, takes `heading:` (H1)
  separately from the longer `title:`, an optional `lead:`, and a
  numbered TOC with 44px tap targets. Hero and body share one width so
  the H1 lines up with the TOC (it floated in a narrower column before).
  Markdown bodies use `{: .callout}` for key commitments.

**404 (`404.html` + `pages/not-found.css`)** — `noindex: true`, gradient
404 numeral (decorative, `aria-hidden`; the H1 says it in words), links
home, to Daily Info and to all four apps. Root-relative links only,
since GitHub Pages serves it at any depth.

**Also:** `post.html` now emits `BlogPosting` (section 6's type), not
the more generic `Article`. Icon sprite gained arrow-right, doc,
transfer, restore, pin, spark, contacts, video and search.

**Performance bug found in browser testing, fixed (12fps → 61fps).**
After the first step 5 push, the shell suite's phone-menu tests failed
consistently on the new homepage (Escape / tap-outside "didn't close
the menu"). Instrumenting the test showed the logic was fine — 350ms
after Escape the panel was still mid-fade at opacity 0.016, i.e. a
0.18s transition starved of frames. Measured with a rAF counter: the
homepage rendered at **12fps** vs 61fps on the privacy page. Cause,
isolated by switching each animation off in turn: the step 3
`hero-glow` include animated SVG circles under an `feGaussianBlur`
(stdDeviation 70) — SVG filters aren't GPU-composited, so the blur was
re-rasterised on the CPU every frame, on the homepage *and every app
page*. Fixed at the root: `hero-glow.html` is now three plain divs with
CSS `radial-gradient` backgrounds (already soft-edged, so no blur
needed), centred with the individual `translate` property and drifting
via `transform` only — GPU-composited, no per-frame repaint. Same look,
same classes, same reduced-motion/transparency/contrast fallbacks. Also
removed two new-in-step-5 costs that broke the apple-design skill's
"animate only transform and opacity" rule: the spotlight's marching
dashes (`stroke-dashoffset`, a main-thread repaint every frame) and
`backdrop-filter` on the hero chips (blur recomputed every frame over
moving layers). Result: homepage and app pages 61fps; shell suite
passes 3/3 consecutive runs; responsive sweep, app-page and post-page
suites all pass. Relevant for real users, not just the test: these apps'
audience skews toward budget Android phones.

**Known gap until step 6:** `/daily-info` (the hub) doesn't exist yet,
so the homepage's "All articles", the 404's "Read Daily Info" and the
header's Daily Info link 404 until step 6 ships it.

## 5c. Standing rules: no real app logos; CloudGate only in legal + footer (29 Sep)

User, 29 Sep, on seeing the homepage: *"remove actual logos, use similar
SVGs that represent (never use actual logo), and position correctly …
cloudgate tech SHOULD only be mentioned in LEGAL and maybe footer NO
WHERE ELSE."* Both are **standing rules**, not one-off fixes.

**Rule 1 — never the real app icons.** Every app visual is now an
*app tile* (`_includes/app-tile.html`): a hand-drawn icon-sprite glyph,
white, on a coloured rounded square. Each app's `glyph` and `tone` live
in `_data/apps.yml` (the `icon:` field is gone):

| App | Glyph | Tone |
|---|---|---|
| Cloud Storage Backup & Drive | `cloud` | blue |
| Document Reader: Read All PDF | `doc` | violet |
| Smartphone All Data Transfer | `phone-transfer` (new) | teal |
| Photo Recover & Data Recovery | `trash-restore` (new) | rose |

- Tones are fixed colours in both themes (like the store badges); every
  gradient stop keeps the white glyph at ≥3:1, **computed** (3.67–6.29:1),
  not estimated — two figures first written in the CSS comment were off
  and were corrected.
- Replaced in: homepage (hero cluster, spotlight, app cards, closing
  CTA), `app.html` (hero, other-apps list, closing CTA — it now finds its
  own `apps.yml` entry from its URL, so app pages carry no icon field),
  404. `SoftwareApplication` JSON-LD no longer has an `image`.
- The Daily Info article used the flagship's real icon as its hero and
  share image. `post.html` now treats `image:` as optional (a real
  editorial photo only — never an app icon) and otherwise draws a
  banner: brand gradient + the post's `glyph:` in a white disc.
- **The eight icon PNGs in `assets/icons/apps/` were deleted** (still in
  git history), so they can't be served or reused by accident.
- The site's own brand mark (header, footer, favicons) is unchanged — the
  rule is about the apps' store icons.

**Hero cluster repositioned** as a true orbit: flagship tile at the
centre; the three app tiles and three chips alternate around one ring
(r = 39% of the box) at even 60° steps — tiles at −150°, −30°, 90°, chips
at −90°, 30°, 150°. Each item is centred on its point with the
`translate` property, leaving `transform` for the float. Checked at
1280, 977 and 390px: balanced, no overflow. The spotlight's flagship
tile got a white ring so it no longer blends into the blue panel.

**Rule 2 — "CloudGate" appears only on the legal pages and in the
footer.** Removed from: the homepage (meta description, hero sub-copy,
the "why us" card — now "Based in Australia" / "an Australian app
developer based in … Western Australia" — and the Organization schema's
`legalName` and `email`, since the support address is on a cloudgate
domain), `_config.yml`'s site-wide default description, the trust band
on every app page ("made by Daily Utility Apps, an Australian app
developer"), and all four apps' "Who makes it?" FAQ. **Verified on the
built site by script**: strip the `<footer>`, then search every page —
zero matches outside `privacy-policy` and `terms-of-service`. Re-run
that check (strip the footer, search for "cloudgate") whenever copy
changes.
- Wording avoids origin claims: "based in Western Australia" (a fact),
  never "built/made in Australia" (unconfirmed — see section 5b).

## 5d. Steps 6–8: Daily Info hub, SEO files, validation (29 Sep)

User: "legal is same info as cloudgate for hosting etc, FINISH all pages
and step 6 … create a robots txt and sitemap … dont make each page for
blog info".

- **Legal — owner confirmed hosting etc. matches CloudGate.** The privacy
  policy now states the CloudGate specifics instead of conditional
  wording: data stored on Amazon Web Services in the United States (and
  plainly "stored outside Australia"), encryption at rest as well as in
  transit, Firebase (Google) for analytics and crash reports, AWS and
  Firebase named as service providers, and the 30-day deleted-file and
  72-hour account-closure windows. Stripe was not added: these apps
  have no web billing, only App Store/Google Play purchases.
- **Daily Info hub — `daily-info/index.html`, served at `/daily-info/`.**
  Not `daily-info.html` as first planned: a `daily-info.html` file next
  to the `daily-info/` articles folder makes `/daily-info` ambiguous
  (the local server redirected it to the folder), and the live preview
  can't be reached from this environment to prove GitHub Pages resolves
  it the other way. The directory index works identically on every
  server. So the hub's canonical is `/daily-info/` (trailing slash — the
  one deliberate exception to "no trailing slash", since it's a
  directory), and every link, breadcrumb and schema URL points straight
  at `/daily-info/` with no redirect hop. The hub lists every post-layout
  page grouped by category (only categories that have articles), with
  topic jump links once there's more than one, a `Blog` + `BreadcrumbList`
  schema, and a closing flagship CTA. Card markup is now one include
  (`_includes/post-card.html`) and its styles moved to shell.css
  ("Article cards"), shared with the homepage. The one article moved
  from "Backup & Restore" (not a planned category) to "Switching Phones".
- **robots.txt** — preview: `Disallow: /` (on top of per-page noindex);
  live: `Allow: /` plus the sitemap URL. Switches on `site.staging`.
- **sitemap.xml** — every HTML page except the 404 and `noindex` pages,
  extensionless URLs matching the canonicals, `lastmod` from a post's
  `updated` / a legal page's `last_updated`, else build time. 9 URLs, all
  verified to resolve.
- **Share card `assets/og/default.png`** (1200×630) — rendered in the
  browser from the site's own fonts, brand mark and app-tile glyphs (no
  real app icons). Every page's og:image pointed at a missing file
  before this.
- **Validation (step 8)** — clean build; CI's unrendered-Liquid check;
  html-validate on all 10 pages; a script checking every internal link
  and `#anchor` on every page resolves (zero broken — the old dead
  `/daily-info` links now work), all 16 JSON-LD blocks parse, every
  preview page carries noindex, CloudGate only in legal/footer, all
  sitemap URLs resolve, no icon PNG references; shell (19), responsive
  (138), app-page (17) and post-page (14) browser suites pass; hub
  checked at desktop and phone. Lighthouse (homepage): performance 99,
  accessibility 100, best practices 100, SEO 69 — the only SEO failure
  is "page is blocked from indexing", i.e. the intentional preview
  noindex/robots, which the step 9 `staging: false` switch removes.

## 5e. UI/UX pass: the brand and its apps (29 Sep)

Driven by the ui-ux-pro-max skill (product match "File Manager &
Transfer": flat/minimal Swiss style, feature showcase, type colour-
coding; landing match "App Store Style Landing": download CTAs
throughout, real screenshots) and the user's direction: "focus on the
brand and its apps".

- **Homepage hero** leads with what the apps do ("Simple apps for your
  phone's everyday jobs" + a concrete one-line list of the four jobs),
  primary "Explore our apps", and the flagship's store badges above the
  fold ("Our flagship:" — not "most popular", which the STATUS 5a review
  counts contradict: the recovery app has more reviews).
- **App orbit is now navigation**, not decoration: each app tile is a
  labelled link to its page (`short:` names in apps.yml). Geometry:
  ring centre (50%, 43%), r = 38%, centre tile 30%, others 20% at −150°,
  −30°, 90°; the two upper labels sit above their tiles. Verified by a
  script that checks every tile/label box for overlap at 1280, 977, 390
  and 320px — zero overlaps, no page overflow.
- **Apps bento** replaces the separate spotlight + cards sections: the
  flagship as one large featured card (tile, badge, tagline, the four
  capabilities, badges, link) beside three compact horizontal cards.
- **Per-app colour identity** (shell.css "App tones"): `.tone-violet`,
  `.tone-teal`, `.tone-rose` re-point the brand tokens, so any component
  inside takes the app's colour with no per-component CSS. Every app
  page is wrapped in its tone; homepage cards and orbit links carry
  theirs. All pairs computed ≥4.5:1 in both themes (lowest 4.85:1).
- **Why us** is a split layout (intro left, 2×2 icon list right) — breaks
  the repeated centred-eyebrow + card-grid rhythm.
- **Closing CTA** shows all four app tiles (links) above the flagship's
  badges.
- **App pages:** the filler first step "Get the app" is gone from all
  four (steps now describe the actual job); pages with 6+ features use a
  bento feature grid (first feature as a 2×2 lead tile).
- Still pending for the biggest remaining gain: real app screenshots
  from the owner → device mockups (never drawn fake screens).

## 5f. Hub redesign; "Australia" only on legal pages (29 Sep)

- **Standing rule (user, 29 Sep): "stop mentioning Australia so much —
  keep it to legal stuff only."** Removed from the homepage description,
  the "why us" item (now "Real support"), the app hero meta row (now "By
  Daily Utility Apps"), the app trust band, all four apps' "Who makes
  it?" FAQ (now: the developer name on the store listing), and the
  Organization schema's address. Verified on the built site by script:
  zero mentions outside the legal pages and footer. Same check pattern
  as the CloudGate rule (section 5c) — re-run both when copy changes.
- **Daily Info hub redesign** (user: "too basic"): hero is now copy +
  the newest guide as a large featured card (topic-coloured banner,
  glyph, title, summary, date, "Read the guide"); stat pills (guides,
  topics, free to read); a "Browse by topic" grid of all four topics
  from the new `_data/categories.yml` (glyph, tone, blurb, live count or
  "Guides coming soon"); per-topic lists appear only once there's more
  than one article (with one, they'd just repeat the featured card).
- **Article cards everywhere** now have a topic-coloured banner with the
  topic glyph in a white disc (categories.yml tone/glyph; a post's own
  `glyph:` overrides). The glyph uses each tone's light-theme colour on
  the always-white disc (all ≥5.4:1).
- **Hero texture**: a static, edge-faded dot grid inside every hero's
  glow layer (painted once, no animation cost).

## 5g. Article page redesign + technical SEO pass (29 Sep)

Article layout (_layouts/post.html, pages/post.css):
- The whole article takes its topic's tone (categories.yml).
- Split hero: topic chip, H1, lead (the description), byline/date/read
  time; drawn banner with stat tiles counted from the article itself
  (read time, number of steps/sections, FAQ count). Never outside
  numbers.
- Body split on its H2s into section cards (Liquid, no JS). `steps: true`
  numbers them on a dashed rail with "Step N of M" labels. Closing note
  goes in `<aside class="post-note" markdown="1">`.
- Sticky "On this page" contents (built from the same H2 split, active
  section highlighted) and a flagship card on desktop; optional
  `takeaways:` box ("The short version"); share button (native share
  sheet or copy link); reading-progress bar (CSS scroll timeline only).
- Keep reading: related / same-topic / newest posts, plus the four topic
  cards. CTA: "Back up your phone automatically" (confirmed scope only;
  the old unconfirmed "Free to download" line is gone).
- FAQ (shared, shell.css) is now cards with a rounded keyboard ring.
  .cta-band--card and .section-head-row moved to shell.css. New
  .tone-blue restores brand blue inside another tone. Header glass is
  more opaque (0.94) so text scrolling under it no longer shows through.

Technical SEO:
- Head: twitter:title/description, og:image:type, article:section and
  article:author on posts, Atom feed link (feed.xml, new).
- JSON-LD: WebSite + ItemList of apps on the homepage; BreadcrumbList on
  app pages; SoftwareApplication gains author, inLanguage, installUrl;
  BlogPosting gains @id, image (share card), inLanguage, articleSection,
  wordCount, timeRequired, named author/publisher with logo, isPartOf.
  Post breadcrumbs now start at Home.
- All titles <= 60 characters, descriptions 70-160, one H1 per page, no
  skipped heading levels (checked by script).

Article length rule (user, 29 Sep): every Daily Info article carries at
least 2,500 visible words of genuine guidance in its body (not counting
header, footer or FAQ). General phone advice only; never new claims
about our apps beyond their confirmed scope. The first article was
expanded to 10 steps (~2,870 body words, 5 FAQs, 12 min read).

## 5h. Homepage sections, app guides, placeholders, footer (29 Sep)

- Homepage now has 8 sections: hero, "What do you need to do today?"
  task cards (apps.yml task / task_text), apps bento, why us,
  availability table (from store links, so it can't claim a platform an
  app isn't on), Daily Info, FAQ (8 questions + FAQPage schema), CTA.
- App pages: each .md page now carries a long-form guide (its markdown
  body), rendered by app.html with an "In this guide" contents list.
  Every app page is over 2,500 visible words in <main> (measured in the
  browser). Guides are general, accurate advice about the job the app
  does; app claims stay within the confirmed scope. Pages renamed
  .html -> .md (URLs unchanged).
- Shared includes: faq-section.html (visible FAQ) beside faq-schema.html.
- 6 placeholder articles on the new `upcoming` layout: noindex, not in
  sitemap/feed/Blog schema; shown as "Coming soon" cards on the hub
  (per topic), the homepage row and topic counts. To publish one: write
  2,500+ words, switch to layout: post, drop noindex, add date/read_min.
- Footer rebuilt like the CloudGate Storage footer: brand + description,
  Apps, Support & legal, Get the app (badges + trademark credit);
  bottom row copyright. No ACN, no Daily Info column.

## 5i. Mobile QA pass (29 Sep)

Measured with a Playwright audit of every page type at 320, 360, 375,
390, 414 and 430px (overflow, 16px gutters, 44px tap targets, clipping,
type sizes/leading, section padding, button styles, link semantics, the
phone menu). Fixed:
- Guide tables made two app pages scroll sideways at 320px: tables in
  long-form content are now wrapped (app.html / post.html) in a
  .table-scroll box that scrolls on its own, with scroll-shadow cues.
- Tap targets under 44px: contents links (40px), footer links (20px),
  breadcrumbs, the logo link, availability-table links and pills.
- Homepage orbit labels crossed the 16px gutter at 320-375px: the upper
  labels now anchor to their tile's outer edge on small phones.
- Phone menu panel was translucent inside the translucent header, so the
  hero headline showed through its links: now a solid surface.
- Hero padding differed by page type (40/48/64px): one token pair,
  --space-hero-top / --space-hero-bottom (48/56px on phones).
- Safe-area insets: .wrap gutters respect env(safe-area-inset-*) since
  the viewport uses viewport-fit=cover.
- Card hover lifts no longer stick after a tap on touch screens
  (@media (hover: none)); :active press feedback kept.
- Store badges: consistent 1rem size, 44px minimum, 12px minimum text.

## 5j. Six Daily Info articles published (29 Sep)

The six placeholders are now full articles on the post layout (indexable
at cutover, in the sitemap, feed and Blog schema), each 2,500+ words of
body text measured in the browser (2,555-2,710), with takeaways, FAQs
(FAQPage schema) and related links:
- free-up-phone-storage (Backup & Storage, 14 steps)
- backup-vs-sync (Backup & Storage)
- move-photos-android-to-iphone (Switching Phones)
- where-deleted-photos-go-android (Photos & Media)
- organise-phone-photos (Photos & Media, 16 steps)
- check-app-permissions-photos (Privacy & Security)
General, accurate guidance only; app mentions stay within confirmed scope.
The `upcoming` layout stays for future placeholders.
Contents lists ("On this page" / "In this guide") now fold on phones
(details/summary, closed by default via scripts.html, open on desktop),
since 14-18 entries pushed the article a screen down.

## 5k. SEO audit of every page (29 Sep)

Audited a production build (staging: false, url dailyutilityapps.store)
page by page: indexability, canonical = sitemap URL, title 30-60 and
description 70-160 (all unique), one H1, heading order, Open Graph and
Twitter tags, JSON-LD validity (FAQ schema matches visible FAQs,
breadcrumb ends at the page, BlogPosting headline = H1), image alt and
dimensions, broken links, generic anchor text, orphan pages, duplicate
titles/descriptions. Lighthouse SEO: 100 on all 15 indexable pages.
Changes made:
- Unique 1200x630 share images for every article, app page and the hub
  (assets/og/<slug>.png, set via og_image / og_image_alt front matter;
  default.html and the BlogPosting image use them). Regenerate with the
  og-pages script after changing a title.
- Internal links: related lists rebalanced so every article has 5+
  internal links in; app guides link in-text to the matching articles.
Open (needs owner input): SoftwareApplication rich results need an
`offers` price (unconfirmed, so not added) or ratings (never shown).

## 5l. Header rebuilt: Apps, Guides, Help (29 Sep)

User asked for useful links instead of vague ones, and Apple-style design.
- Three menus named for their contents: Apps (all four apps with tile,
  tagline and platform, plus "Not sure which app?" /#which, "Where to
  get each app" /#availability, "Compare all apps" /#apps), Guides (the
  four topics -> hub anchors, the three latest guides, "All N guides"),
  Help (FAQ /#faq, Contact support -> footer #support, Privacy, Terms).
  Plus "Get the app". All lists build from the data files.
- Desktop: full-width flyouts under the bar, like apple.com: hover with
  a 140ms intent delay or click, content settles a beat after the panel,
  the bar turns solid and the page dims behind (scrim, click to close).
  Closes on pointer leaving the header, Escape (focus back to trigger),
  outside click, focus leaving the menu. Transitions only (interruptible).
- Phones: the sheet holds fold-out sections (one open at a time), scrolls
  within the screen, 44px+ rows. Without JS, menus open on hover/focus.
- Reduced motion drops the movement; triggers show current section.
- CloudGate still never appears in the header: "Contact support" jumps
  to the footer's support links.

Revision (user, 29 Sep): "Get the app" removed from the header; Guides
is now a plain link straight to the hub (no drop-down); no iPhone/Android
labels in the menu (platforms stay on app pages and the availability
table). The three items share one Apple-style capsule (segmented
control): the open menu or current section sits on a raised white pill.
The Apps menu features the flagship as a tinted card with the other
three beside it (arrows slide in on hover); Help is four icon cards.
Focus rings show for keyboard focus only, never after a mouse click.
Touch screens get 44px items in the capsule.

## 5m. Homepage rebuilt: one pass through the apps, sourced content (30 Sep)

The old homepage listed the same four apps five times (hero orbit, task
cards, app cards, an availability table, closing tiles) in eight
sections: 6,664px on a laptop, 10,382px on a phone, 1,076 words, many of
them repeats. User asked for a professional overhaul with at least
1,000 words of quality content.

**Structure** (`index.html` is now front matter plus one include per part):

| Part | File | What it holds |
|---|---|---|
| Structured data | `_includes/home/schema.html` | Organization, WebSite, ItemList in one `@graph`; FAQPage via `faq-schema.html` |
| Hero | `_includes/home/hero.html` | h1, one line, "See the apps" + "Read Daily Info"; the orbit (becomes a 4-tile row under 900px) |
| Apps | `_includes/home/apps.html` | flagship feature card (features, its app page's `moments`, both badges) + three app cards (job, one line, features, platform, Google Play, Learn more) |
| Which kind of app | `_includes/home/jobs.html` | back up / transfer / recover / read: what it does, when, does it keep a copy; then "Switching phones? Use them in this order" |
| Your data | `_includes/home/privacy.html` | four commitments from the privacy policy |
| Guides | `_includes/home/guides.html` | three newest articles + topic links into the hub |
| FAQ | `faq-section.html split=true` | 10 questions (2 new: backup vs transfer, where backups are stored) |
| Closing | inline in `index.html` | "Start with a backup", flagship badges once |

- **Content lives in data.** `_data/home.yml` (jobs, switch, privacy),
  `_data/apps.yml` `features:` (copied from each app page's feature
  titles), and the flagship card reads `moments` straight from its app
  page's front matter. Every statement is sourced; the source is noted
  in `home.yml`. One unsupported claim written during the build ("most
  lost photos go missing on the day a phone is replaced") was caught and
  replaced with the switching guide's own wording.
- **New shared bits:** `_includes/platforms.html` ("iPhone and Android" /
  "Android" from the store links; replaces three copies of that logic),
  `store-badges.html app=` (per-app accessible names, so four "Get it on
  Google Play" links are distinguishable), `faq-section.html split=true`
  and `.faq-split` in shell.css (other pages unchanged).
- **Removed:** section eyebrows and the 01-04 numbers on the homepage,
  hero store badges, the availability table ("Not yet" x3), the task
  cards and the old "why us" list. index.css rewritten: 17.8KB -> 17.7KB
  while adding three new sections.
- **Phones:** the four comparison cards are a swipeable snap row (next
  card peeks in; tabbing scrolls a card into view); guides are compact
  rows. App names have a 44px tap height.
- **Standing rules re-checked (5c, 5f):** the first draft put the company
  name, Canning Vale / Western Australia, the support email and the
  parent company's address and social profiles on the homepage and in
  its schema. All removed; the strip-footer script finds zero
  "CloudGate" or "Australia" outside the legal pages.
- **Result:** 1,631 words, 7 parts; 7,090px laptop / ~10,100px phone
  (longer content, shorter phone page than before); axe clean in both
  themes at 1440 and 390; CLS 0; no sideways scroll at 320-1440; all
  internal links and anchors resolve; full test suite passes.
- **Follow-up check (30 Sep), three fixes.** Two claims above were
  wrong when first written, and are now true:
  - The link check covered the homepage only. The header's "Not sure
    which app you need?" link on every page still pointed to /#start,
    which the rebuild removed. It now points to /#which.
  - Tabbing did not scroll the shelf: Chrome scrolled the link into
    view and the mandatory snap pulled the shelf back, leaving the
    second card's link off screen. A focusin handler in scripts.html
    now snaps the focused card into place.
  - Separately, axe on every page found the backup-vs-sync comparison
    table had an empty first header cell. It's now "Situation".
  After the fixes, axe is clean on all 16 pages in both themes at 1440
  and 390, and every internal link and anchor on the site resolves.

## 5n. One colour system across the site (1 Oct)

User: "we need to have consistent colour theme, its kinda messed up".
An audit of every colour in the CSS found five inconsistencies:

- **Hero glows mixed colour families.** Every hero drew the logo's green
  and cyan next to the page's own tone, so a violet page glowed violet,
  cyan and green at once.
- **The tone gradients were built differently.** Blue swept blue to cyan
  to green; violet, teal and rose stayed in one colour. In dark mode they
  switched to pale pastels (blue went light blue to mint), so banners
  glared on the dark page, while app tiles kept fixed colours.
- **Numbered badges had two treatments.** App pages and the homepage
  used solid --brand; article step numbers used the gradient with white
  text, which in dark mode sat on a pale gradient (about 2.8:1 at the
  blue end). That broke the rule in section 3 that the gradient never
  goes behind text.
- **Icon chips had two treatments.** Topic icons followed the theme
  (pastel with a dark glyph in dark mode); app-page moment icons used
  the gradient with a white glyph.
- **Topic colours borrowed the wrong apps.** Photos & Media was violet,
  the Document Reader colour, while the photo app (Photo Recover) is rose.

The rule now (shell.css "App tones" has the full version): one colour
family per tone, in three roles.

- **Controls and markers** (buttons, links, numbered badges, check
  bullets, the reading-progress bar) use --brand / --on-brand. They
  change with the theme and are contrast-checked.
- **Illustrations** (app tiles, guide banners, topic and moment icon
  chips, the byline mark) use the new --tone-gradient with a white
  glyph, or --tone-deep for a glyph on a white disc. They're the same
  in both themes, and every stop is the tile's own value.
- **Hero glows** use --brand plus --glow-b / --glow-c, lighter shades of
  the same colour. Only pages outside a tone (home, Daily Info, legal,
  404) keep the logo's green and cyan; --brand-gradient is now used
  only by the 404 numeral.
- **Topic colours** follow the app: Backup & Storage blue, Switching
  Phones teal, Photos & Media rose (was violet), Privacy & Security
  violet (was rose; no app of its own).

The 11 share images for apps and articles were regenerated with the same
glow colours (the hub's keeps the logo colours). The full suite passes,
and axe is clean on all 16 pages in both themes at 1440 and 390.

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
- Final routes: `/`, the four app pages (`/<slug>`), `/daily-info/`,
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
    - **Never use the real app icons** — app visuals are app tiles
      (`_includes/app-tile.html`; section 5c).
    - **"CloudGate" only on the legal pages and in the footer**
      (section 5c).
    - **"Australia" only on the legal pages** (section 5f).
    - Nav labels name their destination ("Backup & Drive", "Daily
      Info"); the logo is the way home, so there is no "Home" link.
- [x] **3. Includes:** `store-badges`, `hero-glow` (not in the original
      plan, earned its place — section 4f), `faq-schema`,
      `breadcrumb-schema` (section 4g — found and fixed a real
      `</script>`-breakout bug in the JSON-LD escaping here).
- [x] **4. Layouts:** `app`, `post` and `legal`, each with its CSS
      (section 4h — found and fixed three real bugs: unescaped HTML
      output in `app.html`, the false "layouts cascade `css:`"
      assumption that left `post.css` silently unloaded, and a post
      hero image rendering at its raw square size instead of a
      consistent banner). Verified with a real flagship app page and a
      real Daily Info article (both now live), plus a throwaway-only
      page for `legal.html` since no real privacy/terms text exists yet.
- [x] **5. Core pages:** homepage, all four app pages, privacy, terms,
      404 (section 5b). Also fixed four `app.html` claims that would have
      been false on Android-only pages, and rewrote copy that claimed
      more than is confirmed. Legal text and app copy still need owner
      review before cutover (section 10).
- [x] **6. Daily Info:** the hub at `/daily-info/` (section 5d). More
      articles deliberately deferred (user, 29 Sep: "dont make each page
      for blog info") — the hub and homepage list whatever exists.
- [x] **7. SEO files:** robots.txt, sitemap.xml, `assets/og/default.png`
      (section 5d). GA4 still waits on a measurement ID (section 10).
- [x] **8. Validate on Preview:** done (section 5d) — build, CI check,
      html-validate, every internal link and anchor, JSON-LD, noindex,
      sitemap, browser suites, Lighthouse 99/100/100/69 (SEO 69 = the
      intentional preview noindex only). Checklist kept below for re-runs.
  **8. Validate on Preview:**
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
- [x] ~~Confirm the flagship's Apple id~~ — confirmed by the user (28
      Sep): `https://apps.apple.com/us/app/cloud-storage-backup-drive/id6760700432`,
      matches what was already in `apps.yml`.
- [x] ~~The real app icon (PNG)~~ — done, see section 4a. Screenshots for
      the flagship's app page are still needed; CSS device mockups are
      the placeholder until then.
- [x] ~~For each of the three "more" apps: real name, icon.~~ — done,
      see section 5a. Still open: an App Store link for any of the three,
      if one exists (not checked), and taglines better than the
      title-only inference currently in `apps.yml`.
- [ ] **Owner review of the legal pages (blocks cutover).** *Partly
      resolved 29 Sep: owner confirmed hosting etc. is the same as
      CloudGate — now stated (section 5d). Still confirm per app: any ads
      / ATT tracking, accounts, in-app purchases.* They're
      adapted from the CloudGate templates with CloudGate-product
      specifics removed (section 5b). Confirm, per app, and add back
      where true: where stored data is hosted (APP 8 expects the
      countries named where practicable — the policy currently says only
      "may be located outside Australia"), which analytics/crash/ad SDKs
      each app uses, whether any app shows ads or uses ATT tracking,
      whether any app has accounts or in-app purchases, and concrete
      retention/deletion periods. Also confirm Raja Imran Shafique is
      still the Privacy Officer for these apps.
- [ ] **Owner review of all four app pages (blocks cutover).** Copy is
      limited to what each listing's title/package ID establishes. Check
      it against each real store description and add confirmed features
      (and a `trust_text` where an app has a specific, true privacy
      point, e.g. how the flagship stores backups).
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
- All four apps confirmed from real Play Store listing screenshots (real
  names, icons cropped and wired into `_data/apps.yml`, developer name
  "Daily Utility Apps" cross-checked). Left `built: false` on all of
  them — the data is ready, but the footer/homepage aren't wired to it
  yet, and the "more"-tier cards need a link-target change (store URL,
  not an internal page) before that wiring happens in step 5-6.
- Installed `ui-ux-pro-max` skill (section 4b) and ran a full Apple
  Design + responsiveness audit (section 4c): confirmed shell.css
  already follows the applicable Apple Design rules, found and fixed a
  real bug (header CTA button was 36px tall, below the 44px touch
  target minimum, at every desktop width), and swept 23 viewport widths
  from 320 to 2560px with 138 automated checks, all passing.
- Ran `ui-ux-pro-max --design-system` (section 4d), the skill's own
  primary/required step, not just spot-check domain queries. Confirmed:
  brand blue family, transition timings, and cursor:pointer everywhere
  (checked with Playwright, not assumed). Two deliberate deviations kept
  (system-ui over Inter; soft shadows despite the matched "Flat Design"
  style) and one open question for the user before step 5: whether the
  primary CTA should use the unused --accent cyan token instead of
  matching --brand, for contrast against the rest of the blue UI.
- Redesigned the base to the ui-ux-pro-max design system (section 4e),
  at the user's explicit request for something unique, not the generic
  first match: Glassmorphism (formalizing what the header already did),
  a brand gradient sampled from the real logo's own pixels (decorative
  only -- checked its contrast across the full blend before ruling out
  using it behind text), and the "Tech Startup" type pairing (Space
  Grotesk headings + DM Sans body, self-hosted as variable fonts).
  Caught a real bug before shipping: h1's weight (750) exceeded Space
  Grotesk's actual variable range (max 700), which would have silently
  made h1 and h2 render identically. Extended the header's glass
  treatment to the mobile nav panel for consistency. Full re-verification
  after: html-validate clean, both the 19-check and 138-check suites
  still pass, fonts confirmed loaded via document.fonts, every colour
  token pair re-run through the contrast checker (all pass).
- Added real SVG + motion to the base (section 4f): store-badges and
  hero-glow includes, both reusable. Fixed the hero's broken "Get the
  app" link (pointed at a page that doesn't exist until step 5) by
  pulling the flagship's real store URLs from apps.yml instead. Caught
  a real CSS stacking bug (z-index:0 painting above plain content, not
  below) before it shipped. Light audit of the new elements against
  both skills: touch target 49px, contrast 18.4:1/11.16:1, SVG var()
  resolution and content-above-glow stacking both confirmed in a real
  browser, all motion/transparency/contrast fallbacks in place, no
  regressions in either the 19-check or 138-check suite.
- Step 3 complete: faq-schema.html and breadcrumb-schema.html built
  (section 4g). Found and fixed a real bug while testing them with
  adversarial content: jsonify doesn't escape forward slashes, so a
  literal `</script>` inside a FAQ answer would close the JSON-LD
  script tag early and inject live HTML/JS. Fixed with a `\/` escape
  on every jsonify'd value; verified with a real adversarial test
  (built, checked exact `</script` counts, deleted before committing)
  that the fix actually holds, not just that it looks right.
- Corrected the apps plan (section 5a, user 29 Sep): every app gets its
  own page, not just the flagship. `apps.yml` now sets `page: true` on
  all four; `tier` controls prominence (nav link, hero spotlight) only.
  No template/code change needed -- footer.html's existing `/<slug>`
  link was already correct for this model, the old plan's planned
  href-branching is no longer needed.
- Step 4 complete: `app.html`, `post.html`, `legal.html` and their CSS
  built and verified end-to-end (section 4h). Found and fixed three
  real bugs along the way, each caught by actually exercising the
  layout rather than reviewing it: unescaped plain-text output in
  `app.html` (a raw `&` in "Backup & Drive" failed `html-validate`);
  the documented "layout front matter cascades `css:` to its pages"
  behaviour turned out to be false, so `pages/post.css` silently never
  loaded on the first real post (fixed at the root: every page now sets
  its own `css:`, and the false claim was corrected everywhere it was
  written down); and a post's hero image rendered at its raw square
  size instead of a banner, fixed generally with `aspect-ratio` +
  `object-fit: cover` rather than just for that one image. Shared the
  FAQ/CTA-band and prose typography CSS between layouts instead of
  duplicating it (shell.css's new "Shared page components" and
  `.prose`). Shipped two real pages in the process: the flagship's app
  page (`cloud-storage-backup-drive.html`, `apps.yml`'s `built:` now
  `true` for it) and one real Daily Info article. Verified `legal.html`
  with a throwaway-only page (deleted before committing) since no real
  privacy/terms text exists yet. Zero regressions: both the 19-check
  and 138-check suites still pass after the shell.css changes.
- Post-ship audit of step 4 (section 4i): re-verified independently
  against a fresh build of the actual committed `HEAD`, then exercised
  edge cases the original pass hadn't -- android-only app pages, the
  unused `related:` post field, and the section 4g XSS payload against
  `page.heading` specifically. Found one more real bug: a `legal.html`
  page without `sections:` rendered its body squeezed into the 224px
  TOC-sidebar column instead of full width (CSS grid auto-placing a
  lone child, since `sections` being "required" wasn't actually
  enforced anywhere). Fixed with a `:only-child` grid rule in
  `pages/legal.css`; verified both with and without `sections:` set.
  Everything else came back clean: 188 checks total across the shell,
  responsive, app-page and post-page suites.
- Standing rules added (section 5c, user 29 Sep): (1) never the real app
  icons — replaced everywhere with drawn SVG app tiles (glyph + tone in
  `apps.yml`), icon PNGs deleted, the article's icon hero replaced with
  a drawn banner; hero cluster rebuilt as a symmetric orbit. (2)
  "CloudGate" only on legal pages and in the footer — removed from the
  homepage, site description, schema, app trust band and app FAQs;
  verified by script on the built site. All suites pass.
- Steps 6–8 done (section 5d): privacy policy states the owner-confirmed
  CloudGate hosting facts; Daily Info hub at `/daily-info/` (directory
  index, to avoid the file-vs-folder ambiguity); robots.txt; sitemap.xml;
  share card; full validation incl. an every-link check and Lighthouse
  99/100/100/69 (SEO = intentional preview noindex). Base site complete.
- UI/UX pass (section 5e): brand-and-apps homepage (orbit as navigation,
  apps bento, split why-us), per-app colour tones on every app page,
  filler steps removed, flagship bento features. Overlap-checked orbit,
  all suites pass.
- Hub redesign + topic-coloured article cards + hero texture; "Australia"
  removed everywhere except legal pages (section 5f). All checks pass.
- Article page redesign (section 5g): topic-toned split hero with stat
  tiles, section/step cards, sticky contents, takeaways, share, FAQ
  cards; technical SEO pass on every page (feed, schema, meta, titles).
  html-validate clean, links/anchors clean, all four suites pass.
- Backup-before-switching article expanded to 10 steps, ~2,870 body
  words (user's 2,500-word minimum), 5 FAQs; contents list is now the
  only pinned element in the article sidebar.
- Homepage to 8 sections with FAQ; 2,500+ word guides on all four app
  pages; 6 coming-soon article placeholders (noindex); CloudGate-style
  footer without ACN or Daily Info (section 5h). All checks pass.
- Mobile QA pass (section 5i): no horizontal scroll at any width, 44px
  tap targets, consistent hero padding, solid phone menu, safe areas.
- Six Daily Info articles written and published, 2,500+ words each
  (section 5j); contents lists fold on phones.
- SEO audit of every page (section 5k): Lighthouse SEO 100 x 15; unique
  share images; internal linking strengthened.
- Header rebuilt (section 5l): Apps / Guides / Help menus, Apple-style
  flyouts on desktop, fold-out sheet on phones. 26/26 nav tests pass.
- Header revised: no "Get the app", Guides links straight to the hub,
  no platform labels, Apple-style capsule nav, featured flagship card.
- Sitemap verified (29 Sep): valid against the sitemaps.org 0.9 schema,
  exactly the 15 indexable pages, every loc = the page's canonical and
  returns 200, robots.txt points to it. Fixed lastmod: home, app pages
  and the hub used the build time (claiming a change on every deploy);
  they now carry real `updated` dates (the hub takes its newest guide's
  date), and an undated page gets no lastmod rather than a fake one.
- App pages redesigned (user, 29 Sep): the pasted long-form guides are
  gone ("not professional"); each page is front-matter-only with its own
  sections: hero + quick links, moments (4 situations), how it works,
  features, with/without comparison, tips + related Daily Info guides,
  8-9 FAQs, privacy band, other apps, get-the-app card. All copy stays
  within confirmed scope (situations and general advice, no new
  features). The 2,500-word rule now applies to Daily Info articles
  only; app pages are ~860-1,040 words of focused content.
- Footer: "A product of CloudGate Technologies" and LinkedIn, Facebook,
  Instagram icons (CloudGate's accounts, site.company.social in
  _config.yml).
- 30 Sep: homepage rebuilt (section 5m): seven parts from includes and
  data files, 1,631 words of sourced content, the four apps shown once,
  standing rules 5c/5f re-verified.
