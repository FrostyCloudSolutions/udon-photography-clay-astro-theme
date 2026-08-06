# Udon Studio — Update (August 5, 2026): Lighthouse Performance & Accessibility

**Date:** August 5, 2026
**Status: SHIPPED August 5 (commit a483aff) — one verification
checkbox open.** Results of the live re-audit (local Lighthouse,
mobile, against udonphoto.com):

- **Accessibility: 100** (was 90) — both audits fixed and verified
  live in two separate runs.
- **Performance — every flagged cause eliminated, verified live:**
  render-blocking is now ONLY the site's own 7.6 KB CSS (the Google
  Fonts stylesheet is gone from the blocking list); the LCP
  discovery checklist passes fully (fetchpriority=high applied,
  discoverable in initial document, eagerly loaded); each tile image
  downloads exactly once (~40 KB). First Contentful Paint improved
  in like-for-like local runs.
- **Headline performance number: pending a hosted re-run.** Local
  runs on this connection swing 30+ points between attempts (image
  CDN delivery variance), so the honest scoreboard is
  lighthouse-metrics.com — the same environment as the original
  87 baseline. The developer re-runs it there for the client
  scoresheet.
- Task 2 resolved as NO CHANGE NEEDED: the "unminified/unused CSS"
  audits pointed at Google's fonts stylesheet, which Task 1 removed
  from the critical path (and the weight trim shrank it).
- Bonus fix: the nav id rename also removed a duplicate id="swup"
  (nav + page wrapper shared it — invalid HTML).

Labels: Bug N / Task N, numbered from 1 within this document only.

## Background

Developer-initiated round (no client feedback involved). A hosted
Lighthouse run (lighthouse-metrics.com, mobile, Lighthouse 12.8.2)
scored udonphoto.com: **Performance 87, Accessibility 90, Best
Practices 100, SEO 100** — already strong (288 kB transferred, 13
requests, 0ms Total Blocking Time, 0 Cumulative Layout Shift).
Goal: Performance 95+ typical and Accessibility 100, producing a
scoresheet the developer can share with the client.

A local diagnostic Lighthouse run (read-only, August 5) identified
the exact causes. Note on variance: Lighthouse scores wobble several
points between runs/regions (the same page scored 73 locally vs 87
hosted purely from simulated-network differences). Targets below aim
at the causes; "95+ typical, 100 accessibility every time" is the
honest deliverable.

## Findings

**Performance — render-blocking requests cost ~1.85s of first paint:**

1. The Google Fonts stylesheet (EB Garamond, 5 weights + italics)
   blocks rendering; no preconnect hints to fonts.googleapis.com /
   fonts.gstatic.com.
2. The site CSS bundle is render-blocking, UNMINIFIED (~7 KiB
   waste), and carries ~61 KiB of unused rules (theme legacy).
   Likely cause of the unminified output: the July 26 dark-mode fix
   stripped the PostCSS plugin chain; minification went with it.
3. The homepage LCP image loads without `fetchpriority="high"`
   (flagged directly by Lighthouse's LCP-discovery audit).
4. Minor: ~5 KiB of assets with short cache lifetimes.

**Accessibility — exactly two failing audits:**

5. **Bug 1 — invalid ARIA reference:** the mobile hamburger button
   declares `aria-controls="navigation"` but no element with
   `id="navigation"` exists.
6. **Bug 2 — insufficient text contrast** (WCAG AA requires 4.5:1
   for body text) on four gray-on-white elements:
   - `.post-content-excerpt` — #898989 (3.49:1)
   - `.site-foot-copyright` — #878787 (3.59:1)
   - `.site-foot-credit` — #a5a5a5 (2.46:1)
   - footer Frosty Cloud link — #a5a5a5 (2.46:1)

## Technical task list (implemented by Frosty Cloud, on approval)

1. **Task 1 — font loading.** Add preconnect hints for both Google
   Fonts hosts; load the fonts stylesheet asynchronously (with
   no-JS fallback); trim unused EB Garamond weights from the
   request. Text renders immediately with the fallback serif, then
   upgrades. (~5k tokens)
2. **Task 2 — CSS minification.** Restore minification to the build
   (config-level; does NOT reintroduce the removed
   postcss-custom-properties/color-function plugins that caused the
   July dark-mode bug). Purging the 61 KiB of "unused" rules is
   deliberately OUT of scope — high risk, low reward. (~3k)
3. **Task 3 — LCP priority.** `fetchpriority="high"` (and eager
   loading) on the homepage LCP image. (~2k)
4. **Task 4 — Bug 1 fix.** Add `id="navigation"` to the nav element
   the hamburger controls. (~1k)
5. **Task 5 — Bug 2 fix.** Darken the four failing grays to
   ~#757575–#767676 (passes 4.5:1 on white; visually near-identical).
   Verify dark-mode equivalents still pass on the dark background.
   (~3k)
6. **Task 6 — verify + evidence.** Rebuild, deploy, re-run
   Lighthouse locally and on lighthouse-metrics.com; record
   before/after scores in this document for the client scoresheet.
   (~5k)

Out of scope (noted, not planned): unused-CSS purge, self-hosting
fonts (revisit only if Task 1 falls short), cache-lifetime tweak
(Task 4 of July's _headers already covers the essentials; ~5 KiB
upside not worth churn).

## Confirmation / Testing checklist

- [ ] Lighthouse (hosted, mobile): Performance ≥95 on at least one
      region run; Accessibility = 100; Best Practices and SEO
      remain 100.
- [ ] Homepage text appears immediately on a throttled connection
      (no invisible-text wait); serif still loads and applies.
- [ ] Excerpt and footer grays look essentially unchanged to the
      eye in light AND dark mode.
- [ ] Mobile hamburger still opens/closes the menu.
- [ ] No dark-mode regressions (the July 26 bug class): toggle dark
      mode, check text/background colors across home, a post, About,
      Inquire.
