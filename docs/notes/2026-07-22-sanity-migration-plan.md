# Udon Studio — Sanity Migration: Decisions, Plan, and Consolidated Action Items

**Date:** July 22, 2026
**Status:** Concept phase agreed (one open client question); technical
expansion pass is the next gate before any implementation.

## Context

Decap CMS does not meet the client's needs (media folders, bulk
upload, honest previews — see 2026-07-19-client-feedback.md). Sanity
was chosen over Storyblok after evaluation (Storyblok offers no
demo/video without account creation; Sanity's demos and site made its
capabilities visible up front). A Sanity project exists (id
`3g68vjze`, dataset `production`, org `ovtCWnYjK`) and a Studio has
been scaffolded at `../studio-udon-studio` (sibling of this repo;
clean template, TypeScript).

## Locked decisions

1. **Fresh build, no content migration.** Existing content is
   negligible (new build). Client re-uploads original full-quality
   photos and rebuilds her posts in Sanity as her onboarding.
2. **Repo strategy: same repo, `sanity-cms` branch.** `main` stays
   the live Decap site during migration. Cloudflare Pages
   automatically serves the branch at a preview URL
   (`sanity-cms.<project>.pages.dev`) for evaluation on real
   infrastructure. At cutover: tag the last Decap commit
   **`decap-cms-final`** (permanent, searchable marker; also the
   snapshot for future cleansed framework templates for other
   clients), then merge with an explicit "Cut over CMS: Decap →
   Sanity" merge commit. Reverting is codebase retention only — not a
   running parallel CMS; content diverges after cutover.
3. **Studio hosting:** Sanity hosts the Studio (`npx sanity deploy` →
   `*.sanity.studio` URL). The client edits in her browser with a
   login — no local server, nothing installed on her machine. Local
   `npm run dev` is for development only. `studio-udon-studio`
   becomes its own git repo.
4. **Studio sidebar (structure builder, not Sanity's default
   type-based lists):** root shows Home, About, Portfolio, Inquire
   (each opening its edit form directly — no "Pages" folder), a
   divider, then Portfolio Posts (the only list).
5. **Post thumbnail = first photo in the gallery.** No per-photo
   toggle, no enforcement logic (that toggle caused multiple Decap
   workarounds). Client controls it by dragging photo order. An
   explicit override field can be added later if requested.
6. **Categories: the existing eight plus "Other".** "Other" is not
   added to the navbar submenu or the portfolio filter bar; such
   posts appear under "All" only. Note: listing is date-sorted, so
   "Other" posts appear wherever their date falls — not pinned to
   the end. A search feature is a possible future addition.
7. **Page fields: minimal** — only fields the frontend renders; no
   `templateKey`/`pagetype`/`number` cruft. Exact field lists per
   page come from the template read in the technical pass.

## Open question — client input needed before schema is final

- **Post text model: gallery-with-intro vs. article-style.** Single
  plain "Description" field (renders title → date → description →
  gallery; also used as SEO meta description) — or a rich-text body
  allowing text and photos interwoven article-style? The latter is a
  different post page design; photos inside body text would not be
  part of the filmstrip/stage/lightbox gallery. Her three real posts
  are all gallery-with-intro. Ask: "Are posts a photo gallery with
  one intro paragraph, or article-style writing with photos woven
  through the text?"

## Action plan (logical order)

**Gate: technical expansion pass** — read the five templates; write
the exact schema per document type, the structure-builder layout,
every file to be created in the Studio, the Astro data-layer changes
file-by-file, and the client editing workflow. Sign-off on that
document before implementation.

**Sprint A — CMS migration (on `sanity-cms` branch):**

1. Create the `sanity-cms` branch.
2. Studio: schema files (portfolioPost, four page singletons) +
   structure-builder sidebar; verify locally (`npm run dev`,
   localhost:3333).
3. Astro: swap data layer from Markdown content collections to
   Sanity (GROQ queries + image CDN URLs); templates and styling
   unchanged. Env vars locally and in Cloudflare Pages (both
   Production and Preview scopes — Pages keeps separate sets).
4. Verify the branch preview deployment end-to-end.
5. Ops: CORS origins in Sanity (localhost, preview URL, site domain);
   `npx sanity deploy` the Studio; invite the client as editor.
6. **Publish → rebuild webhook:** Sanity webhook on publish →
   Cloudflare Pages deploy hook, so published content goes live
   without manual action (~1–2 min build).
7. Client onboarding: she re-uploads originals (bulk, into folders)
   and rebuilds her three posts in the Studio as training.
8. Cutover: tag `decap-cms-final` on main, merge `sanity-cms`,
   remove `public/admin/` (Decap + all shims), remove Markdown
   content and the content-collection code, make `studio-udon-studio`
   its own repo.

**Sprint B — stale-HTML / hard-refresh fixes (next sprint, needed
regardless of CMS):**

1. Add `public/_headers` (Cloudflare Pages mechanism; standard
   static-site caching pattern): HTML documents
   `must-revalidate`, hash-named `/_astro/*` assets
   `immutable`. Ships with the migration branch or directly to main.
2. Check in the Cloudflare dashboard whether udonphoto.com is proxied
   with HTML edge-caching on top of Pages (double caching); if so,
   add a Cache Rule to bypass/shorten TTL on HTML.
3. Auto cache-purge webhook on successful Pages deploys (only needed
   if step 2 finds edge caching of HTML).

## Carried-over open items from previous notes

- **Caption placement** (2026-07-17): captions currently show both
  under the stage image and in the lightbox — client to confirm or
  trim during Sanity onboarding.
- **Footer additions** (2026-07-15): credit line shipped July 19;
  service area, tagline, repeated nav links, phone, privacy policy,
  ABN remain pending client picks.
- **Client's media questions** (2026-07-19): folders and bulk upload
  — answered by Sanity's asset library at migration; communicate
  with the onboarding.
- **Issue 1, broken published images under Decap** (2026-07-19):
  mooted by migration (assets leave git/Pages); only diagnose if the
  client needs current posts displaying before cutover.
- **Client's file-size question** (2026-07-19): not the display bug;
  Sanity's image CDN serves optimized derivatives of full-size
  originals — tell the client she can upload originals freely.
