# Udon Studio — Client Feedback Round 3: Heavy-Use Findings

**Date:** July 26, 2026 (feedback gathered over the prior two days)
**Participants:** Frosty Cloud Solutions (Sammy); Udon Studio (client, "Udon小章鱼🐙")

Labels: items are numbered from 1 within THIS document only
(Bug N / Feature N / Design Decision N / Task N) — no numbering is
carried over from earlier notes files.

Context: the client is now uploading daily and preparing to share the
site publicly ("I want to get the website up and running as soon as
possible"; a friend reviewed it and "loves it too"). She independently
solved most of her own earlier issues this round — the open items are
two design changes, one styling bug, one possible pipeline problem,
and a set of documentation/teaching notes.

## Verbatim chat transcript

> Udon小章鱼🐙: Question 2,I feel like tags is way less convenient than using folders. It's really complicated - I have to click on that tiny box every time to select an image, and I have to pick them all individually before I can add tags in bulk. And when I want to remove tags, I have to uncheck each one one by one. If there are a lot of images, it takes forever
> Udon小章鱼🐙: and you sent me（ In the Media tab: the tag list is in the left sidebar — click a tag to see only those photos.)I can't find the tag list in the leftsidebar)I couldn't find this tag bar in the left sidebar
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: https://www.thesanren.com/blog/hello-oatside-1
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: You can check out the image sizes in this link
> Udon小章鱼🐙: Also, I'd like to mention some other things I really liked: 1. I found out how to sort the thumbnails in my portfolio, and it looks so much better now! 2.I feel it's less boring to type the text after adding the picture in the "about" section - having both text and pictures makes it more interesting 3.I just tried reading it directly using the article format and it was much clearer. I prefer this way.
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: I also found the button to unselect everything. It's in a little hard-to-reach spot, and I didn't find it at first
> Udon小章鱼🐙: https://udonphoto.com/portfolio/growing-up-together/ https://udonphoto.com/portfolio/a-rainy-day-a-warm-home/
> Udon小章鱼🐙: I uploaded these two links the same way, but I don't know why the arrangement of the images is different. I prefer the way with one image per row - I don't like having two images side by side
> Udon小章鱼🐙: I found out what the problem was. At first I couldn't delete the pictures you uploaded to media because you had already posted them in the Posts. Just now I deleted those pictures from the Posts, and then I could delete them from media
> Udon小章鱼🐙: And now I've figured out why some posts have multiple photos one after another, while others have two photos together. If I upload them in batches, the photos come as two together. But if I upload them one by one, they show up one after another
> Udon小章鱼🐙: Then I also found the multiple-select - you need to first check ☑️ one picture, then press shift and select the others to check them all at once
> Udon小章鱼🐙: from now on，I've found solutions to most of the problems. There are only two left: one is about the font and image size on the "about" page, and the other is whether we can keep each image on one line on the post page when uploading multiple images at once
> Udon小章鱼🐙: [Photo]
> Sammy: Maybe we need to do a screen sharing, because tagging is supposed to be way simpler and faster. That's why everyone loves it.
> Sammy: Did you save the tags after applying?
> Sammy: Oh, thesanren had it like this on computer browser, 2 images per row. On mobile its 1 per row
> Sammy: Its no problem to make it 1. Actually it was more work to make it 2 per row. I thought that's what you wanted
> Udon小章鱼🐙: No need to worry about that, I've already taken care of it
> Udon小章鱼🐙: I found a way
> Udon小章鱼🐙: We just need to change the "about" part right nowfor now
> Sammy: I also coded a way that if you want, you can adjust how many pictures per row
> Sammy: When you click "add image row" up to 3. I can make more
> Sammy: But when first converting to article mode, it used 2 per row. Ill change that to 1 per row
> Udon小章鱼🐙: 嗯嗯好的，我觉得一个会更好
> Udon小章鱼🐙: I prefer one row
> Udon小章鱼🐙: I feel like everything else is already perfect
> Udon小章鱼🐙: So I've been uploading all day today
> Udon小章鱼🐙: I want to get the website up and running as soon as possible
> Udon小章鱼🐙: Hahaha I really do
> Udon小章鱼🐙: And I also sent it to my friend
> Udon小章鱼🐙: She loves it too!
> Udon小章鱼🐙: That's absolutely awesome
> Sammy: Yes ti did that on purpose because I thought 2 per row was wanted. And I know you have some gallery posts already. So it only does that when converting. when doing one by one, can adjust. Ill fix that tonight.
> Sammy: Yes, I felt the same way. I wanted to ask you about this
> Sammy: Sorry about the weird problems. I know many of these issues can be frustrating and awkward
> Sammy: Alot of these features can be done many ways and are not always easy to configure or code
> Sammy: Udon my worker is here. I have to go for now. Ill check again later tonight! Sorry for the delay
> Udon小章鱼🐙: Okayokay ，Go ahead and get busy with what you need to do. I think most of the issues have been resolved. I'm planning to upload more pictures every day to enrich the website, and then I'll be able to share it out
> Sammy: Okay! I hope we can make the website perfect for you soon
> [Sammy shares renovation photos; personal chat omitted from scope]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: This is another question
> Sammy: Ok, you mean same size font and color like post? Grey color?
> Udon小章鱼🐙: Same font, black color
> Sammy: Ok!  The font should be the same. However inquiry might be bolded
> Sammy: I will try to make this modifiable by you too in sanity
> Sammy: Can you check sanity to see if you can change this? I thought i gave you access to this already
> Udon小章鱼🐙: Okay I will check
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: I can't see where I can change the font and color
> Udon小章鱼🐙: And then my portfolio post，There have been a lot of updates. I waited for about 2 hours and it still didn't refresh. Please help me check on it when you get a chance too

Screenshot annotations (client's own words):
- "Question 1: When I was organizing the media images today, I
  couldn't delete the pictures you uploaded" (error: "Unable to
  delete 1 asset. Please review any asset errors and try again.")
- "Question 3: When I type in the image with the tag I just edited in
  the search bar, it doesn't show up" (Browse Assets, search "Events",
  no results)
- "don't worry about the tag list leftbar, I find it now" (screenshot
  shows Add filter → TAGS includes "Weddings" working)
- "In the 'About' section, when the website version is opened, the
  image size and text ratio are off - the text is way too small, but
  the mobile version is fine"
- "This is mobile version, but the font in the about section is
  different from the font in the portfolio. I want to make them both
  use the same font as portfolio" / "I prefer this font" (pointing at
  the serif portfolio text)
- "the font of the text in the 'about' and 'inquiries' different as
  'Post' section. Could you adjust them to be the same? I prefer the
  font in the 'Post'"
- "And for this article, can we arrange only one image per line when
  reading it? Something bigger, like sanren
  https://www.thesanren.com/blog/hello-oatside-1"

## Resolved by the client herself (record for the training cheat-sheet)

- **Deleting media that's in use:** the "Unable to delete" error was
  reference protection — an image used by a post can't be deleted
  until it's removed from the post. She discovered the correct
  remove-from-post-first flow on her own. (Working as intended; this
  protection prevents broken images on the live site.)
- **Bulk selection in Media:** check one photo, then shift-click to
  range-select many. Also found the deselect-all button ("in a little
  hard-to-reach spot").
- **Tag filtering:** the search bar matches FILENAMES only (her
  "Question 3"); tags are filtered via **Add filter → Tags includes
  …**, which she found ("don't worry about the tag list leftbar").
- **Why some posts show pairs and others singles:** batch-added
  photos auto-arranged as rows of 2; one-by-one additions made single
  rows. (Superseded by design change Design Decision 1 below.)
- **Reordering thumbnails:** found and loves it ("looks so much
  better now").

## Positive signals

Article format preferred ("much clearer"); About with mixed
text/photos "more interesting"; reorder praised; client sharing the
site with friends and uploading daily — approaching self-serve
steady state.

## Open items

- **Feature 1 — One photo per row as the automatic arrangement** (design
  change, client explicit: "I prefer one row", bigger images like the
  sanren reference). Scope: the AUTOMATIC placements switch from rows
  of 2 to rows of 1 — empty-body materialization, photos-added-later
  appends, and the site-side fallback. Manual "Image row" keeps
  offering 1/2/3 per row for deliberate side-by-side moments.
  Existing post bodies are not rewritten (she has already fixed the
  ones she cared about). CONFIRMED by Sammy July 26.
- **Feature 2 — Adjustable photo-grid insert (Sammy, July 26).** Alongside
  single-photo auto-rows, the article editor offers an insertable
  GRID block with adjustable shape — e.g. 1x3, 3x1, 2x2, 4x4:
  a columns setting (1-4) plus any number of photos, wrapping into
  rows. Generalizes/extends the current Image row (fixed 1-3
  side-by-side). Lightbox behavior unchanged.
- **Bug 1 — About page desktop: image/text ratio off.** Text renders far
  too small next to the full-width page image on desktop; mobile is
  fine. Scope: the About (page) image joins the article reading
  measure instead of spanning full content width, and article/page
  body text size comes up to match the post reading experience.
- **Bug 2 — Font unification: About and Inquire bodies must match Post
  body.** Client wants the Posts' serif font, black color, everywhere
  ("Same font, black color"). Currently About/Inquire body text
  renders in a different (sans/smaller/grey in places) style on some
  breakpoints. Scope: one typography audit — page bodies, article
  bodies, and the inquiry copy all use the post serif at consistent
  size and var(--color-base) black; the inquiry form's field labels
  may stay bolded (Sammy's note to client).
- **Bug 3 — Publishes reportedly not reaching the live site (~2 hours).**
  Client reports many portfolio updates not appearing. Candidate
  causes, in likelihood order: (1) a production build FAILURE freezing
  the site at its last good deploy — most plausible trigger: a post
  published while photo uploads were still in progress, leaving a
  photos[] item with no asset, which the build's image URL builder
  would throw on; (2) build queue backlog from dozens of rapid
  publishes; (3) client-side caching (least likely post-_headers).
  Diagnosis + hardening is the top technical task below.
- **Design Decision 3 — "fonts editable in Sanity" (RESOLVED July 26,
  see Design decisions section):** Sammy
  floated making font/color client-editable in the Studio; the client
  looked for it and it doesn't exist. Recommendation: DECLINE and
  keep typography in code — a font/color picker is a permanent
  design-consistency foot-gun for a one-editor site, and Bug 2 removes
  the need by making everything match the font she already prefers.
  If declined, tell the client plainly that fonts are kept uniform by
  the site itself (comms-tone: our simplification, not her limitation).

## Design decisions

- **Design Decision 1 (accepted):** automatic photo placement = one photo per row,
  full article width. Deliberate 2-up/3-up remains available via
  manual Image row.
- **Design Decision 2 (accepted, revisit if pain persists):** stay on tags for media
  organization; folders remain unavailable on the current plan. Her
  ergonomic complaints are real but largely addressed by shift-click
  range select + Add filter → Tags; both go into the cheat-sheet.
- **Design Decision 3 (REVISED July 26, Sammy's direction — supersedes the earlier
  "recommend decline"):** typography DOES become client-adjustable in
  the CMS, as normal editor features:
  - In-editor rich-text controls: bold (exists), font color, and a
    font selector — implemented as a CURATED list (the site's own
    font families: the serif and the sans), not an open font menu,
    with the default entry presented as the site-wide theme font
    (labeled so she knows it is her current chosen website-wide
    font). Colors likewise a small curated palette.
  - Site-wide font theme: a "Site settings" singleton in the Studio
    where she picks the global font theme; the editor's default font
    label reflects it.
  - Bug 2 still ships first as the sane default state (everything
    matches the post serif/black); these controls then allow
    deliberate deviation.
  - FINALIZED July 26: curated list of ~11 fonts including East
    Asian coverage — EB Garamond (theme serif, default), League
    Spartan (site sans), Playfair Display, Cormorant Garamond, Lora,
    Montserrat, Caveat, Noto Serif SC (简体), Noto Serif TC (繁體),
    Noto Serif JP, Noto Sans KR. Loading strategy: the full menu
    exists only in the Studio (lightweight previews); the live site
    loads ONLY fonts used in published content, and Google Fonts
    script-subsetting keeps even CJK fonts to small per-page slices.
    Bonus in Task 6 scope: Noto Serif SC joins the site's default
    fallback stack so existing Chinese text renders intentionally
    everywhere, even untouched by the font menu.
- **Design Decision 4 (accepted):** unified typography — post serif, black, one
  reading measure across post/article/About/Inquire bodies.

## Technical task list

1. **Task 1 — Diagnose & fix Bug 3 (stale live site) — FIRST.**
   a. Local `npm run build` against live content — a throw identifies
      the poisoned document immediately.
   b. Compare newest CMS post slugs vs live portfolio HTML to measure
      the gap; check webhook delivery log.
   c. Harden regardless of findings: GROQ `photos[defined(asset)]`
      filters (and cover projection), null-safe image builders in
      PostCard/Work/ArticleImageRow, so a mid-upload publish can
      never fail a build again.
   d. If builds are failing on Cloudflare, Sammy checks the
      Deployments tab for the red build log (dashboard access).
2. **Task 2 — Feature 1:** rows-of-2 → rows-of-1 in AutoArticleRows (both
   materialize and append paths) and in Work.astro's fallback;
   update the FINAL behavior spec in the July 23 notes; redeploy
   Studio.
3. **Task 3 — Bug 1/Bug 2/Design Decision 4:** typography pass — `.post-article` font-size to
   the post-body scale with the site serif and var(--color-base);
   page image constrained to the reading measure on desktop;
   audit Contact/About for stray sans/grey/small styles at all
   breakpoints; verify on built HTML/CSS.
4. **Task 4 — cheat-sheet update** for the client message: shift-click
   range select; deselect-all location; delete-requires-unreferenced
   (and why that's protection, not a bug); search = filenames, tags =
   Add filter; one-per-row default note.
5. **Task 5 — Feature 2 grid block:** add a columns (1-4) setting to the image
   row (or a sibling imageGrid block), Studio + renderer + responsive
   CSS; keep lightbox coverage.
6. **Task 6 — typography controls (implements Design Decision 3):** portable-text marks for font
   (curated: site serif / site sans; default labeled as the
   site-wide theme font) and color (curated palette); renderer
   support; "Site settings" singleton for the site-wide font theme
   wired to the CSS font variables; Studio deploy.

Execution estimate: Task 1 diagnosis ~5k tokens + hardening ~10k;
Task 2 ~8k; Task 3 ~15-20k; Task 4 text only; Task 5 ~10k; Task 6 ~25-35k.
Total ~75-95k for the full round. Execution order per approval:
Task 1 (urgent) → Task 2 → Task 3 → Task 5 → Task 6, with Task 4 text accompanying delivery.
