# Udon Studio — Feedback & Revisions (July 27, 2026)

**Date:** July 27, 2026
**Status: DRAFT FOR REVIEW** — batch assembled; awaiting the
developer's revisions/approval. NO implementation until approved.

Labels: Bug N / Feature N / Design Decision N / Task N, numbered from
1 within this document only.

## Bug 1 — Lightbox opens as a stretched column, not fullscreen (developer report)

Verbatim (Frosty): "when clicking on portfolio post picture, it full
screens however the background black is the entire size of the
vertical column of the grid, and forces you to scroll halfway down to
see the picture which is not enlarged nor fullscreen. clicking to
enlarge a picture should just immediately bring it to full screen
with arrows or slider to go left/right."

Expected behavior: clicking any post photo opens an immediate
viewport-filling overlay, image centered and enlarged, prev/next
navigation, no page scrolling involved.

Diagnostic hypothesis (for later scoping — NOT yet investigated): the
lightbox is `position: fixed; inset: 0`, but a CSS `transform` on an
ancestor (e.g. the view-transition wrapper `.transition-fade`, or an
animation left mid-state) makes `fixed` behave like `absolute`
relative to that ancestor — which would produce exactly this
symptom: an overlay sized to the content column instead of the
viewport, with the image parked at the overlay's center far below
the fold. To verify during diagnosis before fixing.

## Bug 2 — Inquiry date fields misaligned after hear-about insert (developer report, July 27)

Verbatim (Frosty): "the preferred dates from and to are awkwardly
lined up in the wrong columns, and dont match up on the same row.
they should be side by side wit he the from box on the left, and the
to box on the right, (unless its a single date event like a wedding)"

Cause (confirmed by inspection): the July 26 hear-about insertion
(commit faaae44) placed a half-width dropdown plus a HIDDEN
half-width "Other" box into the form's two-column grid; when the
Other box is collapsed (the normal state), the row count goes odd
and every following half-width field shifts one slot — date-from
pairs with the dropdown, date-to drops to its own row.

Fix approach: the hear-about dropdown becomes full-width (col-12),
and the conditional Other box full-width below it — the grid's
pairing then holds regardless of the Other box's visibility, and the
from/to pair stays side by side (weddings continue to replace the
date range entirely, unchanged).

## Client's summary list (verbatim, July 27)

> Question1. change https://udonphoto.com to www.udonphoto.com.
> Question2. change your email to my working email
> (frame@udonphoto.com)I have created a new work email for use on the
> website so I can keep my personal email separate.and it looks more
> professional . Question3 Change that little icon on the website to
> the big U you mentioned. Question4 Add an option in the inquiry
> section where how the client heard about me, and then change the
> location field to allow multiple cities to be selected. ———— Also,
> I'd like you to teach me some basic things - like if I want to
> change my email again later, what do I need to do?

Also from the chat: she now force-refreshes after posting and
"everything's working smoothly"; content is essentially fully
uploaded ("I've basically updated all the pictures"); she plans to
share the site on Instagram once www works. The Judy Pham inquiry
was handled in-chat and is explicitly EXCLUDED from this document
(resolved; taught reply-to handling).

## DNS snapshot (checked July 27, public DNS)

- **www.udonphoto.com: NO RECORD** — confirms Bug/Feature below.
- **MX: `10 smtp.google.com` ✓** — Google Workspace mail routing for
  udonphoto.com already exists (modern single-record form), so
  frame@udonphoto.com can receive mail.
- **SPF: MISSING** — no `v=spf1 include:_spf.google.com ~all` TXT.
  Outgoing mail from frame@ risks spam-foldering until added.
- **DMARC: MISSING** (`_dmarc.udonphoto.com` empty).
- DKIM: to check/generate inside Google Admin (see Task 3).

## Items

- **Feature 1 — www.udonphoto.com (client Q1).** Add
  "www.udonphoto.com" as a Custom Domain on the Cloudflare Pages
  project (Workers & Pages -> project -> Custom domains) — creates
  the DNS record and serves the site. Optional: Redirect Rule
  www -> apex 301. OWNER: the developer (dashboard-only; no
  Cloudflare credentials on this machine). Claude verifies
  externally afterwards.
- **Feature 2 — inquiry recipient becomes frame@udonphoto.com
  (client Q2).** Web3Forms dashboard change (access-key recipient or
  new key), plus Web3Forms will send a verification email to
  frame@ that the client must click. SEQUENCE: only after Task 3's
  SPF is in place and a test mail to/from frame@ works — otherwise
  inquiries route to an unproven mailbox. OWNER: the developer +
  client; if a new access key is issued, Claude swaps it in
  Contact.astro (one line).
- **Task 3 — email deliverability records (the "48-hours/2-weeks
  DNS" the developer half-remembered).** These are EMAIL
  authentication records, not SEO proper:
  1. **SPF** — TXT on udonphoto.com: `v=spf1
     include:_spf.google.com ~all` — add NOW in her Cloudflare DNS.
  2. **DKIM** — generated in Google Admin (Apps -> Google Workspace
     -> Gmail -> Authenticate email); Google may only offer the key
     24-72h after Workspace signup (the "48 hours"); paste the
     generated TXT into Cloudflare, click "Start authentication".
  3. **DMARC** — TXT at _dmarc.udonphoto.com, start monitoring-only:
     `v=DMARC1; p=none; rua=mailto:frame@udonphoto.com` — then
     tighten to quarantine/reject after 1-2 weeks of clean reports
     (the "2 weeks").
  OWNERS: her Cloudflare + her/the developer's Google Admin. Claude
  can only verify externally (dig) once set.
- **Client Q3 (icon): ALREADY SHIPPED** July 27 (commit fee76f0) —
  the "U" monogram in EB Garamond is live; her list predates the
  deploy. Search-suggestion icons refresh on Google's schedule.
- **Client Q4 (hear-about + city choice): ALREADY SHIPPED** July 26
  (commit e06d1db) — hear-about dropdown with socials + "Which
  city?" (Sydney/Melbourne/Somewhere else) + suburb field. Her list
  predates the deploy. Note: she wrote "allow multiple cities to be
  selected" — current design is single-choice per inquiry, which
  matches a booking for one location; flag ONLY if the developer
  wants true multi-select.
- **Task 4 — teach-the-client deliverable:** short plain-language
  guide for her: how inquiry email routing works and how to change
  the receiving address herself later (Web3Forms recipient +
  verification), plus where reply-to goes.
- **Side note (business asset, not this site):** the developer's
  idea to build a reusable "new client onboarding questions"
  checklist (logo/favicon, www, email records, social links, domain
  preferences) for future Frosty Cloud projects.

## Pending decision (developer)

- **City field: single-choice vs multi-select.** Client wrote "allow
  multiple cities to be selected"; the live design is single-choice
  (Sydney / Melbourne / Somewhere else). Recommendation: keep
  single-choice (one inquiry = one shoot location; her ambiguity
  complaint is already solved). Awaiting the developer's call.

## Technical task list (implemented by Claude)

1. **Task 1 — Bug 1, lightbox fix.** Diagnose (transform-ancestor
   hypothesis first), fix so clicking any post photo opens an
   immediate viewport-filling overlay, image centered, prev/next
   arrows, Esc/backdrop close; verify on built output incl. the
   after-client-side-navigation case; deploy. (~10-15k tokens)
2. **Task 2 — Web3Forms key swap in code (conditional).** Only if
   Manual Task M5 issues a NEW access key for frame@udonphoto.com:
   one-line change in Contact.astro + deploy. If the existing key's
   recipient is changed instead, no code change is needed. (~2k)
3. **Task 5 — Bug 2, date-field alignment.** Hear-about dropdown and
   its Other box become full-width rows so the two-column pairing
   never shifts; verify from/to render side by side in built HTML.
   (~3k)
3. **Task 3 — client guide text.** Plain-language "how inquiry email
   works and how to change the receiving address later" guide +
   closing client message, delivered in chat for forwarding. (~0)
4. **Task 4 — external verification.** As each manual task lands,
   verify from outside (dig for DNS records, curl for www, test
   submission for routing) and record outcomes in this document. (~2k)

## Manual dashboard configuration task list (developer)

- **M1 — www subdomain:** Cloudflare -> Workers & Pages -> her Pages
  project -> Custom domains -> add `www.udonphoto.com` (Cloudflare
  creates the DNS record and serves the site). Optional: Redirect
  Rule www -> udonphoto.com (301).
- **M2 — SPF record (do now):** Cloudflare DNS for udonphoto.com ->
  add TXT, name `@`, value: `v=spf1 include:_spf.google.com ~all`
- **M3 — DKIM (when Google offers it, 24-72h after Workspace
  signup):** Google Admin -> Apps -> Google Workspace -> Gmail ->
  Authenticate email -> Generate new record -> paste the TXT into
  Cloudflare DNS -> back in Google Admin click "Start
  authentication".
- **M4 — DMARC (do now, tighten later):** Cloudflare DNS -> add TXT,
  name `_dmarc`, value: `v=DMARC1; p=none;
  rua=mailto:frame@udonphoto.com` — after 1-2 weeks of clean
  reports, change `p=none` to `p=quarantine` (or `reject`).
- **M5 — inquiry recipient swap (ONLY after M2 done and a test
  email to/from frame@udonphoto.com works):** Web3Forms dashboard ->
  change the access key's recipient to frame@udonphoto.com (or issue
  a new key — if new, tell Claude for Task 2); client clicks the
  verification email Web3Forms sends to frame@.

## Confirmation / Testing checklist

Run after the corresponding task completes. Publishing checks allow
~2 minutes for rebuilds.

**Task 1 (lightbox):**
- [ ] Desktop: open any portfolio post, click a photo — the overlay
      fills the screen instantly, image centered and enlarged, no
      scrolling anywhere; arrows step through photos; Esc and
      clicking the dark backdrop close it.
- [ ] Same check on a phone.
- [ ] Same check after arriving at the post by clicking through from
      the portfolio grid (not a direct page load) — the historical
      failure case for overlay bugs.

**Task 5 (date alignment):**
- [ ] On udonphoto.com/inquire (desktop width): "Preferred dates —
      from" and "— to" sit side by side, from on the left; the
      hear-about dropdown spans its own row; picking "Other" opens
      its box without shifting anything below.
- [ ] Selecting Weddings still swaps the date range for the wedding
      fields.

**M1 (www):**
- [ ] www.udonphoto.com loads the site (and lands on udonphoto.com
      if the redirect rule was added). Claude re-runs the dig check.

**M2-M4 (email records):**
- [ ] Claude's dig shows the SPF and DMARC TXT records (and DKIM
      once generated).
- [ ] Send any email FROM frame@udonphoto.com to another mailbox;
      open it in Gmail -> "Show original" -> SPF: PASS (and DKIM:
      PASS after M3). No spam-foldering.

**M5 (recipient swap):**
- [ ] Submit a test inquiry on udonphoto.com/inquire — it arrives at
      frame@udonphoto.com (not the old inboxes).
- [ ] Replying to that email goes to the submitter's address.

**Already-shipped items (client Q3/Q4):**
- [ ] Browser tab shows the "U" monogram on udonphoto.com (Google's
      search-suggestion icon may lag for days).
- [ ] Inquire form shows "How did you hear about us?" with socials,
      and "Which city?" + suburb box.

**Decision record:**
- [ ] City field decision (single vs multi) recorded above once made.
