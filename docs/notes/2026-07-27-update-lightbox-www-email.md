# Udon Studio — Update (July 27, 2026): Lightbox, WWW & Email

**Date:** July 27, 2026
**Status: COMPLETE July 30.** All code tasks (1, 5, 6 — commits
ca45ba5, 7e06c61, f934192, plus row-swap amendment f112ef2) and all
manual dashboard tasks (M1-M5) done and verified. M5 end-to-end
proof: the developer submitted a test inquiry on udonphoto.com and
the client confirmed receipt at frame@udonphoto.com. Task 2 (key
swap) not needed — the existing access key's recipient was changed,
so the code stayed untouched. Still open, non-blocking: tighten
DMARC to p=quarantine ~Aug 13 (calendar + scheduled reminder set);
optional www->apex redirect rule; manual testing-checklist
walkthrough below.

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

Fix approach (REVISED July 27 per the developer — full form-layout
reorganization, replaces the earlier full-width-dropdown idea):

    Row 1: Full Name | Email
    Row 2: Phone (optional) | How did you hear about us?
           ("Other" box appears as a FULL-WIDTH row below Row 2 only
           when chosen — full-width conditionals cannot shift the
           two-column pairing, which structurally prevents this bug
           class)
    Row 3: Which city? | Suburb / neighbourhood (grouped side by side)
    Row 4: Preferred dates — from | — to
    Row 5: Session Type | How many people?
           (category follow-ups — weeks pregnant, baby age, wedding
           date/time/venue — appear directly below this row;
           Weddings hides Row 4 and shows the wedding fields)
    Row 6: Message (full width)

    (AMENDED July 29 after shipping: Rows 4 and 5 swapped — dates
    before category — so each category's follow-up questions appear
    immediately below the category picker that triggered them.
    Commit f112ef2.)

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

## DNS snapshot (checked July 27, public DNS; re-checked July 30)

- **July 30, evening — M3 VERIFIED COMPLETE.** Client's test email
  from frame@udonphoto.com arrived at info@frostycloud.net (Inbox,
  not spam); Gmail's Show-original verdicts: SPF PASS (Google
  sender authorized by the new record), DKIM PASS (d=udonphoto.com,
  s=google — key was already active; no Google Admin action ever
  needed), DMARC PASS (reading p=none as set). Client also clicked
  the Web3Forms verification link and the developer switched the
  recipient to frame@. Remaining: end-to-end test inquiry through
  the live form (M5 proof).
- **July 30, later — M2 + M4 DONE and VERIFIED** (dig against
  Cloudflare's authoritative NS): SPF `v=spf1
  include:_spf.google.com ~all` and DMARC `v=DMARC1; p=none;
  rua=mailto:frame@udonphoto.com` both live. All three email-auth
  records (SPF/DKIM/DMARC) now present in DNS. REMINDER (~Aug 13):
  tighten DMARC p=none -> p=quarantine after reviewing reports.
  Remaining: M3 signing check via client's test email; M5 after
  that test succeeds.
- **July 30 re-check (after the developer ran M1):**
  www.udonphoto.com resolves and serves the site over HTTPS (HTTP
  200) — **M1 core VERIFIED DONE**; only the optional www->apex
  Redirect Rule remains. A **DKIM record already exists**
  (google._domainkey TXT, v=DKIM1) — M3's DNS half is in place;
  remaining M3 check: confirm Google Admin shows "Authenticating
  email" / a test mail shows DKIM: PASS. SPF and DMARC still
  missing (M2, M4 outstanding — Cloudflare's DNS page banner
  recommends both).
- **www.udonphoto.com: NO RECORD** (July 27) — confirms Bug/Feature
  below.
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

## Decisions

- **City field (RESOLVED July 27):** keep the client's model — ONE
  city chosen from the dropdown, plus the free-text box for specific
  suburb/neighbourhood detail. No multi-select. The two location
  fields are grouped side by side on one row (see Bug 2 fix layout).

## Feature 3 — Video support (client question, July 29)

Verbatim: "I was just wondering if if you want to upload videos,
would it be the same way" (asked while confirming she is otherwise
comfortable in the Studio: "everything looks good to me").

Scoping — two very different paths:

1. **Embed-based video block (RECOMMENDED starting point).** A
   "Video" block insertable in article bodies (like Image row): she
   pastes a YouTube/Vimeo link (or 小红书 where embeddable), the site
   renders the player. Zero hosting cost, zero bandwidth risk,
   instant streaming quality on the platform's CDN, and matches how
   photographers already publish video. (~10-15k tokens: Studio
   block + site renderer + responsive styling.)
2. **Direct video-file uploads to Sanity.** Technically possible
   (Sanity file assets accept video), BUT: no transcoding or
   adaptive streaming — visitors download the raw file; large videos
   eat the free plan's 100GB asset/bandwidth allowances quickly;
   phone-shot multi-hundred-MB files would make post pages heavy.
   Viable only for short small clips with strict size guidance.
   Proper hosted video (Mux plugin) is a paid third-party service —
   revisit only if embeds prove insufficient.

**Scope decision (RESOLVED July 29, developer):** embed-based
streaming — the client uploads the video to YouTube, pastes the link
into her post, and the site streams it from YouTube's CDN through an
embedded player. No direct video-file uploads to Sanity. v1 is an
article-body "Video" block only (not a cover or gallery item);
Vimeo links accepted too since the same block handles both. See
Task 6.

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
3. **Task 5 — Bug 2, inquiry form layout reorganization.** Implement
   the six-row layout above (phone+hear-about, city+suburb grouped,
   session+people, dates paired; conditionals as full-width rows);
   verify pairing in built HTML at desktop width and stacking on
   mobile. (~5k)
4. **Task 3 — client guide text.** Plain-language "how inquiry email
   works and how to change the receiving address later" guide +
   closing client message, delivered in chat for forwarding. (~0)
5. **Task 4 — external verification.** As each manual task lands,
   verify from outside (dig for DNS records, curl for www, test
   submission for routing) and record outcomes in this document. (~2k)
6. **Task 6 — Feature 3, video embed block.** Studio: new
   `videoEmbed` block type (URL field, validated YouTube/Vimeo)
   insertable in article bodies alongside Image row. Site: renderer
   in ptComponents that converts the URL to the platform's embed
   iframe, responsive 16:9, lazy-loaded so post pages stay fast.
   Verify with a real YouTube link on a built page. (~10-15k)

## Manual dashboard configuration task list (developer)

- **M1 — www subdomain (click-by-click, expanded July 29):**
  WHY Custom domains and not a plain DNS record: Cloudflare Pages
  only serves hostnames registered to the project — a hand-made
  CNAME would route traffic to Pages but Pages would refuse the
  unknown hostname (SSL/host errors). The Custom domains wizard does
  three things at once: creates the CNAME, registers the hostname
  with the project, and issues its TLS certificate.
  1. Workers & Pages -> udon-photography-clay-astro-theme ->
     Custom domains -> Set up a custom domain -> enter
     `www.udonphoto.com` -> on the "Confirm new DNS record" screen
     (shows: CNAME | www | udon-photography-clay-astro-theme.pages.dev)
     click **Activate domain**.
  2. Wait until the Custom domains list shows www.udonphoto.com as
     **Active** (usually under a few minutes).
  3. OPTIONAL redirect so www lands on the bare domain: this lives
     under the DOMAIN, not under Workers & Pages — dashboard Home ->
     click the site **udonphoto.com** -> left sidebar **Rules** ->
     **Redirect Rules** -> under Templates pick **"Redirect from WWW
     to Root"** -> review -> Deploy. (If the template list is
     absent: Create rule -> name `www to apex` -> If Hostname equals
     `www.udonphoto.com` -> Then Dynamic redirect, expression
     `concat("https://udonphoto.com", http.request.uri.path)`,
     status 301, preserve query string -> Deploy.)
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

**Task 5 (form layout):**
- [ ] Desktop: rows read Name|Email, Phone|Hear-about, City|Suburb,
      Session|People, Dates from|to — from on the left, to on the
      right, nothing orphaned.
- [ ] Picking "Other" for hear-about opens a full-width box below
      its row WITHOUT shifting any pair below it.
- [ ] Selecting Weddings still swaps the date row for the wedding
      fields; maternity/baby questions still appear for their types.
- [ ] Phone view: fields stack single-column in the same order.

**Task 6 (video embed):**
- [ ] In the Studio, open an article-mode post, add a Video block in
      the body, paste any YouTube link, publish; after ~2 minutes
      the post shows the player, full column width, correct
      proportions, and it plays.
- [ ] Same check on a phone (player scales down, no sideways
      scrolling).

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
