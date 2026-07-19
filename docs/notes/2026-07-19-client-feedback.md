# Udon Studio — Client Feedback: Broken Post Images, Media UX; CMS Re-evaluation

**Date:** July 19, 2026
**Participants:** Frosty Cloud Solutions (Sammy); Udon Studio (client, "Udon小章鱼🐙")

Context: the client uploaded three portfolio posts today — two new
("Side by Side", "Waiting for You") and one edited from the previous
Test Baby 1 post ("How Time Flies"). Nothing in this document has been
implemented yet — this is a planning record. **The CMS platform itself
is now under re-evaluation (Sanity vs. Storyblok); no migration is
decided.**

## Issue 1 — Published images don't display on the live site (blocking)

- Uploading and previewing images in the CMS works correctly, and the
  posts themselves appear on the website, but the images inside the
  posts render as broken-image icons on the front end (screenshot:
  "How Time Flies" post tiles all broken on the portfolio page).
- Not fixed by refreshing, so this is **not** the known 1–3 minute
  deploy-lag window from the July 18 testing round — it persists.
- Client's size observation: some of her images are 5–10MB; she
  suspected file size, but a 3.7MB test image also fails to display,
  so size is not confirmed as the cause.
- Root cause **not yet diagnosed** (no investigation run yet). First
  checks when work begins, in order:
  1. Did the media commits actually land in the repo alongside the
     entry commits (files present in `public/img/`)?
  2. Do the image paths in the three post files exactly match the
     committed filenames (case, spaces, non-ASCII characters, URL
     encoding)?
  3. Did the Cloudflare Pages build that included the media succeed?
  4. Caching layers (see Action 2) masking a fixed state.

## Issue 2 — Media library organization (feature request)

- Client asks for folders or categories on the image upload page to
  make selecting and managing images easier.
- Decap's media library is a single flat folder; it has no real
  folder/album UI. This is a platform limitation, not a config gap.

## Issue 3 — Bulk upload (feature request)

- Client asks to upload multiple images at once; Decap's media library
  accepts one file per upload action. Also a platform limitation.

## Verbatim client messages

> Udon小章鱼🐙: Hi,SAMMY I've uploaded three portfolio posts. Two of
> them are newly created named (Side by Side and Waiting for You), and
> the other one named (How Time Flies) was edited from the previous
> Test Baby 1 post. At the moment, I've noticed a few issues: 1. I can
> upload images successfully, but after publishing the post, the
> updated images don't appear on my website. 2. On the image upload
> page, is it possible to create folders or categories to organize
> uploaded images? It would make selecting images much easier. 3. Also
> on the image upload page, is there an option for bulk uploading
> multiple images at once?
>
> Udon小章鱼🐙: Hi,SAMMY I've uploaded three portfolio posts. Two of
> them are newly created (Side by Side and Waiting for You), and the
> other one (How Time Flies) was edited from the previous Test Baby 1
> post. The portfolio posts are showing on the website, but the images
> inside the posts are not displaying.
>
> Udon小章鱼🐙: [Photo]
>
> Udon小章鱼🐙: I also noticed that some of my images are larger than
> 5MB (but all are under 10MB), so I was wondering if the file size
> could be the reason. However, I tested one image that is only 3.7MB,
> and it still doesn't display on the website. The images can be
> uploaded and previewed correctly in the backend, but after
> refreshing the website, they are not showing on the front end. So
> I'm not sure if this is related to image size or another issue.
> Could you please help me check what might be causing this problem? I
> also have a few questions about the image upload page: 1. Is it
> possible to create folders or categories for uploaded images? It
> would make selecting and managing images much easier. 2. Is there an
> option to bulk upload multiple images at once? Thank you so much for
> your help!
>
> Udon小章鱼🐙: [Photo]

Screenshot annotation (client's, on the CMS editor screenshot): "The
images can be uploaded and previewed correctly in the backend, but
after refreshing the website, they are not showing on the front end."

## CMS re-evaluation — Sanity vs. Storyblok

Client feedback driving this (per Frosty Cloud, July 19):

- Decap's media handling is clunky — the client needs batch/
  multi-select image uploads and proper folder organization, which
  Decap handles poorly (Issues 2 and 3 above).
- Content updates are slow to appear live and currently require a hard
  refresh after publishing — feels broken.

Status: **evaluation only, not a decided migration.** Both candidates
have first-class asset management (folders, bulk upload, image CDN
with automatic resizing — which would also absorb the client's
5–10MB originals).

Migration implication if either is chosen: content moves out of local
Markdown files into the CMS's hosted content store, and Astro's
data-fetching is updated accordingly. Site framework and hosting stay
unchanged. (Also previously raised in-session: Sveltia CMS as a
low-effort git-based fallback — modern UI and bulk upload with the
same config, but it would not solve deploy-lag previews or hosted
asset management.)

## Action list

**Step 1 gates everything below it — no other work proceeds until the
CMS decision is made.**

1. **Decide the new CMS: Sanity vs. Storyblok** (Frosty Cloud,
   in progress July 19). Current lean: **Sanity** — Storyblok offers
   no demo or video to evaluate without creating an account, while
   Sanity has video demos and a more intuitive website that shows its
   capabilities up front. Evaluation criteria: media/batch-upload
   handling, folder organization, editor UX for a non-technical
   client, free-tier fit, Astro integration effort.

Dependent on that decision:

2. **Fresh build on the chosen CMS — no content migration** (decided
   July 19: existing content is negligible since this is a new build).
   Recreate the content model deliberately (post: title, date,
   category, photos with optional caption + thumbnail flag,
   description, body; the four pages); paste page copy from the
   verbatim notes; client re-uploads her original full-quality photos
   into the CMS asset library (bulk, foldered) and rebuilds her posts
   as her onboarding walkthrough. Astro frontend, styling, and
   Cloudflare hosting are retained — only the data-fetching layer
   changes. Remove /admin (Decap and all its shims) at cutover so
   there is one content source.
3. **Issue 1 (broken published images)** — expected to be mooted by
   the migration (assets move off git/Pages). Only worth touching
   under Decap if the client needs her current posts displaying
   before the migration lands; otherwise fold into content migration.
4. **Hard-refresh/stale-HTML fix** — needed regardless of which CMS
   wins, but scheduled after the decision so it's done once against
   the final architecture: Cloudflare proxy double-caching check, HTML
   Cache Rule / `_headers`, auto cache-purge webhook on deploys.
5. **Client's size question** — answered by the chosen CMS's image
   CDN (optimized derivatives from full-size originals); communicate
   to client once the decision is made.

## Dev note — what a full migration to Sanity/Storyblok would resolve

**Fully resolved by migrating** (assets leave git/Pages entirely and
live on the CMS's hosted asset CDN):

- Issue 2 (folders/organization) — both platforms have real asset
  libraries with folders/tags and search.
- Issue 3 (bulk upload) — multi-file drag-and-drop is native.
- The 5–10MB originals problem — the image CDN serves resized,
  optimized derivatives automatically; the client can upload
  full-size photos safely.
- The whole class of Decap media bugs we have been patching by hand:
  Draft-label uploads, blank/placeholder previews before publish,
  silent "Choose selected", draft-backup loss on reload, and every
  admin/index.html shim that works around them. All of that code gets
  deleted, and the editor shows real image previews instantly.
- Issue 1 (broken published images) — *very likely* resolved, since
  image URLs would no longer depend on git commits landing and a
  Pages build shipping them. Per the action list, no Decap-side
  diagnosis unless the client needs her current posts displaying
  before the migration lands.

**Only partially resolved:**

- "Updates are slow to appear live": the site remains a static Astro
  build on Cloudflare Pages, so publishing still triggers a rebuild
  (~1–3 min) before new text/layout is live. Migration makes the
  *editing* experience honest (real previews in the CMS immediately,
  webhook-triggered rebuilds), but live-site propagation time only
  changes materially if we also move Astro to SSR/hybrid rendering
  against the CMS API — worth scoring in the evaluation.

**Not resolved by migrating (needed either way):**

- The hard-refresh/stale-HTML problem (Action 2): browser/edge caching
  of the site's HTML is a hosting-layer issue — Cloudflare proxy
  check, HTML cache rule / `_headers`, and the deploy purge webhook
  are required regardless of CMS.
- Pending design decisions (remaining footer additions, caption
  placement confirmation) and all site-side features.
