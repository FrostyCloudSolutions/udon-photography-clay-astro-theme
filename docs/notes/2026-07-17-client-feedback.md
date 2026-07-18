# Udon Studio — Client Testing Feedback & Functionality Bugs

**Date:** July 17, 2026
**Participants:** Frosty Cloud Solutions (Sammy); Udon Studio (client, "Udon小章鱼🐙")

Context: the client signed off on the website's **visual appearance** at the
previous review. The items below are **functionality bugs and requests
discovered the next day** during her hands-on testing of the CMS and the
live site. Nothing in this document has been implemented yet — this is a
planning record.

## Key facts / design constraints

- A typical post gallery will have **9–15 photos** (fits the current
  filmstrip design; recorded as a sizing constraint for gallery and
  upload work).
- Visual design is approved as-is: "Basically, there's nothing left to
  change in the design now." (Appearance only — does not cover the
  functionality items below.)

## Bug 1 — Client-uploaded images unusable in the CMS (highest priority)

- Photos the client uploads through the CMS get a purple **"Draft"**
  label in the media library. Her screenshot shows the upload saved
  under a random UUID filename (`a9dfc5b8-c639-48f1-a8a1-964eab07eb8d.jpg`),
  unlike the repo's committed `clay-images-*.jpg` files, which carry no
  label.
- She **can** select the previously committed images, but selecting
  **her own upload** leaves the photo entry showing a blank/checkered
  thumbnail, and the image does not stick for publishing.
- Not a caching issue: the Draft label persisted after waiting and after
  hard refreshes.
- Additional context from the chat: hard-refreshing inside the CMS
  editor **before** pressing Publish discards the in-progress draft
  (expected Decap behavior), which muddied the first repro; the Draft
  label problem remained after accounting for that.
- Working hypothesis to investigate (not yet diagnosed): media uploaded
  from inside an entry editor is held as a draft asset tied to that
  entry until publish, and something in that handoff (or the media
  folder configuration) is failing.

## Bug 2 — Mobile nav menu overlaps page content

- On mobile, with the hamburger menu open and the Portfolio submenu
  expanded, the page body bleeds through the menu: social icons, the
  theme toggle, and footer text ("UDON STUDIO", copyright line) are
  visible through/behind the menu items (e.g. Instagram icon over
  MATERNITY, email icon over EVENTS, 小红书 over WEDDINGS, moon icon
  over PETS, footer wordmark through COMMERCIAL WORK).
- Client: "the layout looks a bit weird" (with screenshot); the menu
  background appears not to be opaque/tall enough once the submenu
  lengthens the list. To investigate.

## Feature request — Per-photo captions

- Add the ability to attach a caption to each picture in a post's
  Photos list.
- Open question (pending Frosty Cloud/client decision): where captions
  display — under the stage image, in the fullscreen lightbox, or both;
  captions assumed optional per photo.

## Working as expected

- The client edited the Inquire page text in the CMS (removed one ✨)
  and republished successfully — the CMS → publish → deploy loop works
  for text edits.

## Observation (not client-reported)

- One screenshot shows a plain, unstyled "Content Manager" page listing
  raw field labels ("Photos", "Use as thumbnail in the portfolio grid
  (optional)" ×3, and the Photos hint text). This looks like Decap's
  default entry preview pane, which has never been configured and dumps
  field labels by default. Cosmetic; possibly hide or configure later.
  Interpretation pending confirmation.

## Verbatim chat transcript

> Udon小章鱼🐙: Generally a set of photos will have 9-15 photos
> Udon小章鱼🐙: Okay Wait a sec then, I'll go turn on my computer
> Sammy: ok. i will take a one hour break for now
> Sammy: when i come back i will take a look at your notes
> Sammy: if you need more time to review the site, can do later too. no rush
> Udon小章鱼🐙: okay now I open my computer and    To try
> Udon小章鱼🐙: [Video]
> Udon小章鱼🐙: Don’t worry about the video I sent you, I didn’t refresh it
> Udon小章鱼🐙: [Video]
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: I can choose the photo you uploaded,but I can’t choose what I uploaded.
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: I noticed that the images I upload have this draft icon on them
> Udon小章鱼🐙: Then I checked on the design changes we talked about yesterday, and I think they're all really great. Basically, there's nothing left to change in the design now. But I just opened the mobile version of the website and the layout looks a bit weird. Let me send it to you
> Udon小章鱼🐙: [Photo]
> Sammy: okay this should be easy to fix
> Udon小章鱼🐙: Okayokay
> Sammy: did the post upload properly? after you make a post. depending on the size of the pictures, you may need to wait a few minutes. and then on your website browser, hold CMD + SHIFT + R
> Sammy: this will do a hard refresh of the webpage
> Sammy: because sometimes your computer will remember the old version, and wont want to re-download the website so quickly
> Sammy: so this forces your computer to get the new version
> Udon小章鱼🐙: Okay let me try again
> Sammy: ok let me investigate this
> Udon小章鱼🐙: After waiting for a while, the draft icon was still there
> Udon小章鱼🐙: When I hold CMD + SHIFT + R
> Udon小章鱼🐙: [Photo]
> Udon小章鱼🐙: It turns this image
> Sammy: oh, were you hard-refreshing while in the CMS? if you do that without hitting the PUBLISH button, then it will do this yes, because it wasnt published, or thinks you are rrefreshing a temporary page
> Sammy: need to refresh on the main site's portfolio page
> Sammy: [Photo]
> Udon小章鱼🐙: I just made a small edit to the text in the Inquiry section by removing one ✨ icon and republished the website to check the changes. For the images, I followed the same steps we talked about yesterday, so everything should be the same as before.

Additional detail relayed by Sammy (from the client's video): when she
adds photos in the CMS, the media library labels them as a draft; when
she selects one, the CMS still shows a blank image thumbnail and does
not save it for publishing.

## Action items (pending go-ahead)

1. Investigate and fix the Draft/blank-upload bug so client uploads are
   selectable and publishable (Bug 1)
2. Fix the mobile open-menu overlap (Bug 2)
3. Add optional per-photo captions in the CMS and display them on the
   site (placement to be decided)
