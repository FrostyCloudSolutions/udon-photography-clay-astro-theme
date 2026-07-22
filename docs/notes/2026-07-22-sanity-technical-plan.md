# Udon Studio — Sanity Migration: Technical Plan (implementation gate)

**Date:** July 22, 2026
**Status:** For sign-off. No code written yet. Companion to
2026-07-22-sanity-migration-plan.md (concept decisions).

## 1. What the frontend actually consumes today (from template read)

| Consumer | Fields used |
|---|---|
| Home (`src/pages/index.astro`) | pages/index: `title`, `description`; tile grid = entries with `pagetype: [main]` sorted by `number` (currently the About/Portfolio/Inquire pages), each tile showing `thumbnail` + `title` |
| `templates/Page.astro` (About) | `title`, `description`, `thumbnail` (optional image), markdown body |
| `templates/Contact.astro` (Inquire) | `title`, `description`, `thumbnail`, markdown body (intro copy; the form itself is code) |
| `templates/List.astro` (Portfolio) | `title`, `description`; categories come from `src/lib/categories.ts` (code) |
| `components/PostCard.astro` | post `title`, `category`, thumbnail via `postThumbnail()` (flagged photo ?? first photo ?? legacy string) |
| `templates/Work.astro` (post page) | `title`, `date`, `description`, `photos[{image, caption}]`, body, prev/next by date |
| Routing (`[...slug].astro`) | dispatches template by `templateKey` |

Cruft confirmed droppable: `templateKey`, `pagetype`, `number`, the
per-photo `thumbnail` boolean, the top-level `thumbnail` mirror on
posts, and the duplicated body/description on posts.

## 2. Studio schema (files created in `../studio-udon-studio/`)

**`schemaTypes/portfolioPost.ts`** — document type `portfolioPost`:

- `title` — string, required.
- `slug` — slug, generated from title (client clicks "Generate"),
  required, unique. Becomes the URL: `/portfolio/<slug>`.
- `date` — datetime, **initialValue = now** (Sanity does natively what
  the Decap "Now" shim faked; new posts are pre-filled, editable).
- `category` — string, dropdown, required. Options: Babies,
  Maternity, Events, Weddings, Pets, Collaborative Art, Commercial
  Work, Workshops, **Other**.
- `photos` — **array of `image`** (hotspot enabled), min 1, with a
  `caption` string field defined **on the image type itself**. This
  exact shape is what preserves native multi-file drag-drop (drop 13
  files → 13 items) while giving a caption box per photo. First photo
  = grid thumbnail (concept decision 5); drag to reorder.
- `description` — plain text, a few rows. Renders as the intro
  paragraph and the SEO meta description. *(If the client answers
  "article-style", this plan gains a `body` portable-text field and a
  post-template change — the only open variable.)*
- Preview config: title + first photo + category; default ordering:
  date descending.

**`schemaTypes/page.ts`** — document type `page` (used by 4 singletons):

- `title` — string, required.
- `description` — plain text (intro/SEO), optional.
- `image` — image, optional. Serves both the page-header image and
  that page's Home-grid tile background.
- `body` — portable text (Sanity's rich text; replaces markdown
  body). Minimal marks: paragraphs, h2/h3, bold, italic, links. About
  and Inquire genuinely use body copy; Home and Portfolio may leave it
  empty.
- No slug field: pages are four fixed documents with **fixed IDs**
  (`page-home`, `page-about`, `page-portfolio`, `page-inquire`); the
  site's routes are static and fetch by ID.

**`schemaTypes/blockContent.ts`** — the shared portable-text
definition above. **`schemaTypes/index.ts`** — exports all types.

**`sanity.config.ts`** — structure builder: root sidebar = Home,
About, Portfolio, Inquire (each a pinned editor opening the fixed-ID
document directly), divider, Portfolio Posts (document list).
"Create new" menu restricted so `page` can't be created or deleted —
only `portfolioPost` can.

**Media browsing:** add `sanity-plugin-media` (free) as the asset
source — search, filters, tag-based organization. During
implementation, check whether Sanity's newer folder-based Media
Library is available on the free plan; adopt if so.

## 3. Astro changes (site repo, `sanity-cms` branch)

**New dependencies:** `@sanity/client` (API queries),
`@sanity/image-url` (builds CDN URLs with width/format params),
`astro-portabletext` (renders portable text in .astro templates).
Plain client, not the `@sanity/astro` integration — fewer moving
parts, nothing the integration adds that we need.

**New file `src/lib/sanity.ts`:** configured client (projectId
`3g68vjze`, dataset `production`, `useCdn: true`, pinned API
version) + `urlFor()` image helper + the GROQ queries:
`getPage(id)`, `getPosts()` (cards: title/slug/category/first photo),
`getPost(slug)` (full), `getPostSlugs()`.

**Image derivative sizes** (this is where 5–10MB originals become
fast): grid card ~1200px, filmstrip thumb ~400px, stage ~1600px,
lightbox ~2000px, all `auto('format')` (WebP/AVIF per browser).

**Routing simplification** — `templateKey` dispatch dies with Decap.
`src/pages/[...slug].astro` is replaced by explicit routes:

- `src/pages/index.astro` — fetches `page-home`; tile grid becomes a
  hardcoded list of the three page IDs (About/Portfolio/Inquire) with
  each page's `image` + `title` (drops `pagetype`/`number` entirely —
  the tiles are a design constant, not content).
- `src/pages/about.astro` — fetches `page-about` → `Page.astro`.
- `src/pages/portfolio/index.astro` — fetches `page-portfolio` +
  `getPosts()` → `List.astro` (categories still from
  `src/lib/categories.ts`, unchanged: 8 filter pills, no "Other").
- `src/pages/inquire/index.astro` — fetches `page-inquire` →
  `Contact.astro` (form untouched). `inquire/thanks.astro` untouched.
- `src/pages/portfolio/[slug].astro` — `getStaticPaths` from
  `getPostSlugs()`; prev/next computed from the date-sorted list.

**Template edits (rendering only, no visual changes):** props go from
`CollectionEntry` to plain objects; `<Content />` becomes
`<PortableText value={body} />`; `Work.astro` photos map through
`urlFor()`; `PostCard` thumbnail = first photo; `postImages.ts`
helper shrinks or disappears.

**Environment:** `PUBLIC_SANITY_PROJECT_ID` + `PUBLIC_SANITY_DATASET`
in `.env` and in Cloudflare Pages env vars — set in **both Production
and Preview scopes** (Pages keeps separate sets; Preview is what the
`sanity-cms` branch builds use). The project ID is not a secret (it
appears in every API URL); env vars are for configurability, not
secrecy. No CORS needed for the site itself (queries run at build
time, server-side); CORS origins matter only for the Studio.

**Deleted at cutover (not before):** `public/admin/` (Decap + all
shims), `src/content/` (markdown + collections config),
`src/pages/[...slug].astro`, legacy fields in `postImages.ts`.

## 4. Operations sequence

1. Studio: `npm run dev` → verify schema/sidebar locally at
   localhost:3333.
2. `npx sanity deploy` → pick hostname (proposal: `udon-studio`) →
   client edits at `udon-studio.sanity.studio`.
3. Invite client: sanity.io/manage → project members → invite her
   email as Editor.
4. Deploy hook: Cloudflare Pages → Settings → Builds → create Deploy
   Hook (name: `sanity-publish`) → copy URL. Sanity manage → API →
   Webhooks → new webhook, on create/update/delete of published
   documents, POST to that URL. Result: Publish in Studio → site
   rebuild → live in ~1–2 min, no manual steps.
5. Cutover (after client sign-off on the branch preview):
   `git tag decap-cms-final` on main, merge `sanity-cms`, deletions
   above, `studio-udon-studio` gets its own git repo.

## 5. Client's editing workflow (the training script)

1. Open `udon-studio.sanity.studio`, log in.
2. Portfolio Posts → ＋ → title → Generate slug → date already
   filled → pick category → **drag all photos from Finder onto
   Photos in one motion** → click any photo to add its caption →
   description → **Publish**.
3. ~2 minutes later the post is live. Editing = open, change,
   Publish again. First photo in the list is the grid thumbnail —
   reorder by dragging.

## 6. Cost estimates (per approval protocol)

- Studio schema + structure (step 2 files): ~15k tokens.
- Astro data-layer swap (section 3): ~30–40k tokens.
- Ops guidance (section 4, mostly user-driven clicks): ~5–10k.
- Optional browser verification passes will be proposed separately
  with their own estimates.

## Sign-off checklist (differences from today worth blessing)

- [ ] Explicit routes replace `templateKey` dispatch.
- [ ] Homepage tiles hardcoded to About/Portfolio/Inquire (no
      `pagetype`/`number` content mechanism).
- [ ] Pages get one optional `image` + portable-text `body`.
- [ ] Posts: description-only pending the client's answer
      (gallery-with-intro vs article-style).
- [ ] Studio hostname `udon-studio.sanity.studio`.
