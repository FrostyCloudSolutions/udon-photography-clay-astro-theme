# Udon Studio — Master Item Index

One row per bug, feature, and decision across every update. Statuses:
**Shipped** (live), **Resolved** (handled without code), **Mooted**
(made irrelevant by a later change), **With developer** (manual
dashboard task), **Pending** (awaiting decision/approval). Full
context lives in the linked dated document.

| Date / document | Type | Item | Status | Commit(s) |
|---|---|---|---|---|
| [07-15 client call](2026-07-15-client-call.md) | Feature | Initial redesign: nav cleanup, new categories, filter/grid styling, multi-photo galleries, header/footer, inquire form rebuild | Shipped | (July 15–16 series) |
| [07-15 client call](2026-07-15-client-call.md) | Decision | Rename brand to "Udon Studio" sitewide | Shipped | (July 16) |
| [07-15 client call](2026-07-15-client-call.md) | Feature | Footer additions — remaining picks (tagline, phone, privacy, ABN…) | Pending (client picks) | — |
| [07-15 client call](2026-07-15-client-call.md) | Feature | Footer credit line "Website by Frosty Cloud Solutions" | Shipped | c7674f4 |
| [07-17 update](2026-07-17-update-decap-uploads-mobile-nav.md) | Bug | Decap draft uploads unusable (Draft label, blank previews, silent choose) | Mooted (Sanity migration; interim fixes shipped first) | 4e996e5, fd3393b, 7df7225 |
| [07-17 update](2026-07-17-update-decap-uploads-mobile-nav.md) | Bug | Mobile nav submenu overlays menu content | Shipped | fd3393b |
| [07-17 update](2026-07-17-update-decap-uploads-mobile-nav.md) | Feature | Per-photo captions | Shipped | 4e996e5 |
| [07-17 update](2026-07-17-update-decap-uploads-mobile-nav.md) | Decision | Caption placement (stage + lightbox both) | Pending client confirmation | — |
| [07-19 update](2026-07-19-update-broken-images-cms-evaluation.md) | Bug | Published images broken on live site (Decap era) | Mooted (migration) | — |
| [07-19 update](2026-07-19-update-broken-images-cms-evaluation.md) | Feature | Media folders for organization | Resolved via tags (folders = Sanity Enterprise only) | — |
| [07-19 update](2026-07-19-update-broken-images-cms-evaluation.md) | Feature | Bulk delete / bulk upload of images | Shipped (Sanity media plugin + multi-drop) | (migration) |
| [07-19 update](2026-07-19-update-broken-images-cms-evaluation.md) | Decision | Re-evaluate CMS: Sanity vs Storyblok | Resolved — Sanity | — |
| [07-22 migration plan](2026-07-22-sanity-migration-plan.md) | Decision | Fresh build, no content migration; sanity-cms branch; decap-cms-final tag | Shipped (cutover) | 921213f, 1b3baa4 |
| [07-22 technical plan](2026-07-22-sanity-technical-plan.md) | Decision | Schemas, explicit routes, hardcoded home tiles, photos[0]=cover | Shipped | a174418 |
| [07-22 migration plan](2026-07-22-sanity-migration-plan.md) | Feature | Publish → rebuild webhook (production) | Shipped | (webhook, July 23) |
| [07-22 migration plan](2026-07-22-sanity-migration-plan.md) | Bug | Stale-HTML / hard-refresh (cache headers) | Shipped | 1b3baa4 |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Bug | Mobile: menu button overlaps logo | Shipped | 18053ad |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Bug | Dark-mode text contrast; always-light default policy | Shipped (fully fixed July 26) | 18053ad, 654fddb |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Bug | Footer social icons stack vertically on mobile | Shipped | 18053ad |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Feature | Thumbnail crop control (hotspot drives grid tiles) | Shipped | 18053ad |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Feature | Article/blog layout with gallery toggle; About multi-photo | Shipped | 1511f0f, 654fddb, 38844bb, 70702f0 |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Feature | Drag-to-reorder portfolio posts | Shipped | 1511f0f, 654fddb |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Feature | Multi-select from library into a post ("Add many from library") | Shipped | 8ef888e |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Feature | Category tags pre-seeded in media browser | Shipped | (API, July 23) |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Bug | Email links broken (Cloudflare obfuscation vs view transitions) | Shipped | 89497fc |
| [07-23 update](2026-07-23-update-first-sanity-session.md) | Decision | Client account hygiene: single Google identity, Editor role | Resolved (API) | — |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Bug | Production builds failing (mid-upload publish froze site) | Shipped | c58fc48 |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Feature | One photo per row automatic arrangement | Shipped | c58fc48 |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Bug | About desktop image/text ratio | Shipped | 88c2386 |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Bug | Font unification (About/Inquire = post serif, black) | Shipped | 88c2386 |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Feature | Adjustable photo grids (1–4 per row, up to 12) | Shipped | 43aea41 |
| [07-26 update](2026-07-26-update-photo-rows-typography-builds.md) | Feature | Editor Font/Color controls + Site settings font theme + CJK fallback | Shipped | 797e5f4 |
| [07-26 update](2026-07-26-update-inquiry-form-email-routing.md) | Feature | "How did you hear about us?" dropdown + Other | Shipped | faaae44, e06d1db |
| [07-26 update](2026-07-26-update-inquiry-form-email-routing.md) | Feature | City dropdown + suburb field (location clarity) | Shipped | e06d1db |
| [07-26 update](2026-07-26-update-inquiry-form-email-routing.md) | Decision | Inquiry routing: client = primary recipient; no CC on free plan | Resolved (dashboard) | aba8812, e06d1db |
| [07-26 update](2026-07-26-update-inquiry-form-email-routing.md) | Feature | Interim "U" monogram logo/favicon set | Shipped | fee76f0 |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Bug | Lightbox opens as stretched column, not fullscreen | Shipped | ca45ba5 |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Bug | Inquiry date fields misaligned (hear-about grid shift) | Shipped (rows 4/5 swapped July 29) | 7e06c61, f112ef2 |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Feature | www.udonphoto.com custom domain (M1) | Shipped July 30 (verified via curl; optional redirect pending) | (dashboard) |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Feature | Email auth records: SPF/DKIM/DMARC live + all PASS on real delivery July 30; DMARC tighten ~Aug 13 | Shipped (dashboard) | — |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Feature | Inquiry recipient → frame@udonphoto.com (M5, sequenced) | With developer + client | — |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Decision | City field: single choice + suburb text, grouped side by side | Resolved July 27 | — |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Feature | Client guide: how inquiry email works / changing it later | Delivered July 30 (in follow-up comms) | — |
| [07-27 update](2026-07-27-update-lightbox-www-email.md) | Feature | Video support — YouTube/Vimeo embed block in article bodies (Task 6) | Shipped | f934192 |
