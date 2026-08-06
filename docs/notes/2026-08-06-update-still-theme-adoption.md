# Udon Studio — Update (August 6, 2026): Still Theme Adoption

**Date:** August 6, 2026
**Status: APPROVED August 6** with two amendments: (1) adoption
order = files ranked by how much original clay-theme code they still
carry, highest first (legal priority); (2) Task 4 license swap
DEFERRED — developer will supply wording after frostycloud-site and
pricing decisions, plus a client conversation about future projects
and compensation.

Labels: Design Decision N / Task N, numbered from 1 within this
document only.

## Background

The Frosty Cloud template program has completed cleansing, packaging,
and legal clearance of **Still** (frosty-astro-still, at
web/themes/frosty-astro-still): a snapshot of this site's codebase
that was de-cliented, given clean-room rewrites of the ENTIRE
stylesheet layer and Layout.astro, and relicensed as Frosty Cloud
proprietary (commits 12f6030 -> 1d76d8d). Goal of this update: bring
Still's cleansed layers back into the udon site so it becomes a
fully Frosty-authored Still deployment — no longer carrying other
authors' theme code — while changing NOTHING the client or her
visitors can see or feel.

Terminology note: "backport" strictly means porting a fix from a
newer branch to an older one; since Still is now the upstream
template and udon is the client deployment, this operation is an
**upstream adoption / re-base onto the template**. The doc uses
"adoption."

## Diff audit summary (read-only, August 6)

24 files differ between Still/src and udon/src, in four streams:

1. **Still's clean-room rewrites (adopt):** all of src/styles/**
   (vars, content, layout, 10 component sheets) + Layout.astro.
2. **Still's de-clienting (adopt selectively):** siteConfig.ts (new
   — identity becomes CMS/config-driven), categories.ts, sanity.ts,
   fonts.ts, Header/Footer/PostCard, index.astro, thanks.astro.
   Client-specific VALUES (Sanity project 3g68vjze, Web3Forms key,
   Udon Studio identity, her categories) must be preserved/injected
   through the new config seam, never overwritten.
3. **Udon fixes newer than the snapshot (re-apply on top — Still
   does NOT have these):** the entire Aug 5 perf/a11y round
   (a483aff): async font loading + preconnects + BASE_FONTS_URL,
   LCP preload prop, nav id="navigation" (Still still has the old
   duplicate id="swup"), WCAG contrast opacities. Verified missing
   from Still by direct inspection.
4. **Unchanged shared logic:** templates and components not touched
   by either side carry over as-is.

## Design decisions (developer to approve)

- **Design Decision 1 — branch, not direct-to-main.** Work happens
  on a `still-theme` branch with the Cloudflare Pages branch
  preview (same pattern as the July sanity-cms migration). Merge to
  main only after the full checklist passes. Rationale: this is the
  largest change surface since the CMS migration; direct-to-main is
  for scoped fixes.
- **Design Decision 2 — merge strategy: file-by-file adoption.**
  Adopt Still's rewritten files as the new base, then re-apply
  stream-3 fixes on top, then re-inject client values through
  Still's config seam. Alternative (rejected): copying the whole
  Still tree over udon — guaranteed regressions of stream 3 and
  client values.
- **Design Decision 3 — licensing follow-through (developer
  decision needed).** After adoption, the udon repo's license/
  attribution should switch to the Still model (Frosty proprietary
  with a client deployment license). IMPORTANT: the client was
  told July 30 she may fork/copy this repo for a future wedding
  site — the client-license grant must explicitly preserve that
  promise. Wording/decision is the developer's.

## Technical task list (implemented by Claude, on approval)

1. **Task 1 — file-by-file provenance map.** For each of the 24
   differing files: adopt / keep / merge, with the exact fix list
   to re-apply. Output recorded in this doc before code changes.
   (~8k tokens)
2. **Task 2 — branch + integration.** Create `still-theme`, apply
   the map, re-apply the Aug 5 round, inject client values via
   siteConfig. (~15-20k)
3. **Task 3 — parity verification.** Local build diff (compare
   built HTML/CSS of key pages before/after for unintended
   changes), then branch-preview checks: lightbox (grid-click
   path), inquiry form rows + conditionals, video embed post,
   fonts/typography marks, dark mode toggle, favicon, a11y spot
   audit (expect 100 to hold), async-font markup present. (~10-15k)
4. **Task 4 — license/attribution swap** per Design Decision 3
   (pending the developer's wording). (~2k)
5. **Task 5 — merge to main, live verification, INDEX updates,
   record outcomes here.** (~5k)

## Task 1 output — provenance map & adoption order (Aug 6)

Resemblance = how much of the ORIGINAL clay-theme code remains in
udon's current file (difflib vs pre-Frosty commit 6936e4f).
Adoption proceeds tier by tier, highest resemblance first.

**Tier A — 100% original, adopt Still's clean-room version verbatim:**
tables.css, lists.css, hamburger.css, grid.css, ghost.css,
animations.css, actions.css, global.css (all styles/components/),
pages/inquire/thanks.astro (re-inject client copy if Still
templatized it).

**Tier B — mostly original, adopt Still then re-apply udon patches:**
buttons.css 96%, forms.css 95%, PostCard.astro 95%, layout.css 90%
(re-apply: copyright opacity 0.78 contrast fix), content.css 76%
(re-apply: excerpt opacity 0.62, image max-width), vars.css 71%
(re-apply: no @import — async fonts), Layout.astro 67% (re-apply:
Aug 5 async fonts + preconnects, preloadImage prop, Lightbox
placement comment).

**Tier C — mostly udon-authored already, keep udon base and port
Still's config seam only where it drops original fragments:**
Contact.astro 41%, Header.astro 34% (keep id="navigation"),
index.astro 32%, Footer.astro 26% (keep credit opacity 0.73).

**Tier D — 0% original (Frosty-authored, no legal priority; align
with Still's de-client seam, keep udon values):** sanity.ts,
fonts.ts (keep BASE_FONTS_URL), categories.ts, + adopt
siteConfig.ts carrying Udon Studio identity values.

## Confirmation / Testing checklist

- [ ] Branch preview: homepage, a gallery post, an article post
      with video, About, Inquire all render identically to
      production (side-by-side eyeball on desktop + phone).
- [ ] Lightbox fullscreen via portfolio-grid click-through path.
- [ ] Inquiry form: six-row pairing; Other/Weddings/maternity/baby
      conditionals; test submission still routes to frame@.
- [ ] Studio publish -> rebuild webhook still fires on main after
      merge.
- [ ] Lighthouse spot check on merged main: Accessibility stays
      100; performance metrics unchanged from the Aug 5 results.
- [ ] Repo license/NOTICE state matches Design Decision 3.
