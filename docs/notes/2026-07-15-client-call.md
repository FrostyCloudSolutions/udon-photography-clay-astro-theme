# Udon Photography — Website Update Meeting Minutes

**Date:** July 15, 2026
**Attendees:** Frosty Cloud Solutions; Udon Photography (client)

Summary: the following changes were discussed and agreed on during the call,
listed by area, followed by items still pending client input. Nothing in
this list has been implemented yet — this is a planning record.

## 1. Navigation

- Remove "Investment" from the main navigation (redundant with Portfolio's
  "Commercial Work" category)
- Remove "Journal" entirely — nav link, landing page, and all sub-categories

## 2. Portfolio Categories

- Remove: In-Home, Outdoor
- Add: Baby, Wedding
- Rename: "Pet" → "Pets"; "Fine Art Projects" → "Collaborative Art"
- New order: Babies, Maternity, Parties & Events, Weddings, Pets,
  Collaborative Art, Commercial Work, Workshops

## 3. Portfolio Filter Bar (Styling)

- Remove rounded pill/button borders on category filters — restyle as plain
  text links with underline on hover/selection
- Remove the divider line under the filter bar

## 4. Grid & Image Styling

- Square corners on all grid tiles and image thumbnails (currently rounded)

## 5. Multi-Photo Galleries

- Enable multiple photo uploads per Portfolio post (currently one only)
- Individual Portfolio post pages get a filmstrip gallery: 5–10 photo
  previews, paginated for more
- Click any photo to open fullscreen
- Applies to individual posts only, not the main Portfolio page

## 6. Header & Footer

- Add social media icons to the header (top right), in addition to the
  footer icons
- Source official/branded social icons for both header and footer
- Make the footer larger and more visually prominent
- Recommended footer additions (pending client picks — see Open Items):
  service area/location, short tagline, a few repeated nav links, phone
  number, Privacy Policy link, ABN if applicable, optional
  "Site by Frosty Cloud Solutions" credit

## 7. Inquire Form Redesign

- Client's updated intro copy will be used (decorative hearts removed)

### Client's verbatim form script

The client supplied the following script for the inquiry page, reproduced
here word for word (it was agreed the heart marks would be dropped; the
numbered questions are implemented as form fields rather than repeated as
text):

> Hi there! Thank you so much for your interest in Udon Studio. ✨
>
> Before we move forward, could you please take a moment to answer the
> following questions?
>
> ❤️
>
> 1. What type of session are you looking for?
> 2. Will the shoot take place in Sydney, Melbourne, or another city?
> 3. When are you hoping to have the session, and how many people will be
>    participating?
> 4. If this is a maternity session, how many weeks pregnant are you
>    currently?
> 5. If this is a wedding or pre-wedding shoot, could you please provide
>    the date, time, and location?
>
> ❤️
>
> Before booking, I do hope you’ve had a chance to explore my portfolio
> and photography style, as finding the right photographer is a two-way
> connection. It helps ensure that we’re a good fit and can create
> something meaningful together.
>
> I look forward to hearing from you!
> Udon Studio

Note: the script says "Udon Studio" while the site is branded
"Udon Photography" — kept verbatim; confirm with the client which name
she wants in the form copy.
- Session type / Location: already covered by existing fields
- Requested date: change to a date-range picker
- New "group size" dropdown: 1–2 / 3–4 / 5–6 / 7+
- New optional numeric field for maternity sessions: "How many weeks
  pregnant are you currently?"

## Addendum — Post-Call Decisions (July 16)

- Wedding questions (date / start time / venue) and the maternity
  weeks-pregnant question both appear only when their session type is
  selected; selecting Weddings replaces the generic preferred-dates range
  with the wedding-specific fields
- New session-specific question for Baby sessions: how old is the baby
  (in months) — optional numeric field, same pattern as maternity
- "Parties & Events" category renamed to "Events" (ampersand rendered
  awkwardly)
- Homepage tile grid reduced to three columns to match the three
  remaining main tiles
- Footer location shortened to "Australia", folded into the copyright
  line: "© YEAR Udon Photography, Australia. All rights reserved."
- Header social icons switched to black & white to match the theme;
  Xiaohongshu icon enlarged for legibility in header and footer

## Open Items — Pending Client Input

- Which footer additions above should actually be included?
- ~~Brand name in the inquiry copy: her script says "Udon Studio" but
  the site is branded "Udon Photography" — question sent to the client
  July 16~~ resolved July 16: client confirmed the site is renamed to
  "Udon Studio"; applied across page titles, header logo, footer brand
  and copyright, homepage copy, and inquiry email subjects
- ~~Wedding questions (date/time/location)~~ resolved: shown
  conditionally when the Weddings session type is selected (see Addendum)
- ~~Official social media icons~~ resolved: sourced from Simple Icons
  (MIT-licensed official brand paths)
