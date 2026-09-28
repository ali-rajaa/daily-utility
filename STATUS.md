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
│   │   └── apps/                  # the four real app icons, cropped from
│   │                             # Play Store screenshots (section 5a)
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

All four apps' real names, icons and Play listing facts are now
confirmed — the user sent screenshots of each live Google Play listing
(28 Sep) and they're in `_data/apps.yml`:

| App | Package ID | Tier | Page |
|---|---|---|---|
| Cloud Storage Backup & Drive | `com.backup.and.restore.all.apps.photo.backup` | `flagship` | Gets `app.html`. Apple id `6760700432` (still unverified — see open items) |
| Document Reader: Read All PDF | `com.dw.pdf.reader.pdfviewer.pdfeditor.alldocumentreader.filereader` | `more` | Card only |
| Smartphone All Data Transfer | `com.transfer.files.transfer.apps.share.app` | `more` | Card only |
| Photo Recover & Data Recovery | `com.data.recovery.trashbin.recovery.files` | `more` | Card only |

All four listings confirm the developer is "Daily Utility Apps" — matches
the brand name correction in section 4a.

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
- **`built: false` on all four for now.** The data is captured and
  ready, but nothing links to it yet: the flagship's `app.html` doesn't
  exist until step 5, and the "more" apps' footer/homepage cards need a
  template change first (see below) — so nothing changed visually on
  this push.
- **Required before wiring the footer/homepage to this data (step 5-6):**
  the footer's current app-list link (`/<slug>`, i.e. an internal page)
  only makes sense for `page: true` apps. A `more`-tier card must link
  straight to `android_url`/`ios_url` instead. Branch on `_app.page`
  when that template work happens — don't reuse today's href logic
  unmodified for the "more" apps.

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
- [ ] **3. Includes:** ~~`store-badges`~~ (done early, section 4f, plus
      `hero-glow` which wasn't in the original plan but earns its keep).
      Still needed: `faq-schema`, `breadcrumb-schema`.
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
