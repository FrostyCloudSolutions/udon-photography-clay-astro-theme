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

## Proposed task list (for review — nothing started)

1. Task 1 — Bug 1 lightbox: diagnose (transform-ancestor hypothesis)
   and fix; fullscreen overlay centered with prev/next. OWNER:
   Claude. ~10-15k tokens incl. verification.
2. Feature 1 — www: developer adds Pages custom domain; Claude
   verifies + updates notes. ~1k.
3. Task 3 — email records: developer adds SPF now; DKIM + DMARC per
   timings above; Claude verifies via dig as they land. ~2k.
4. Feature 2 — recipient swap to frame@ AFTER email proven; Claude
   code-swaps key only if a new key is issued. ~2k.
5. Task 4 — client email-guide text with the delivery message. ~0.
6. Confirmation/Testing checklist appended when tasks complete
   (standing convention).
