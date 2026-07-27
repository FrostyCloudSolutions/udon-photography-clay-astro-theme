# Udon Studio — Inquiry Form Revisions (July 26, 2026)

**Date:** July 26, 2026
**Source:** Frosty Cloud (Sammy) — direct revision requests, plus the
inquiry-email routing thread from earlier the same day.

Labels: Bug N / Feature N / Design Decision N / Task N, numbered from
1 within this document only.

## Requests (verbatim, Sammy)

> let's add a "how did you hear about me/us" field in the inquiry.
> please offer suggestions in a dropdown box, and perhaps an 'other'
> option with a text field for custom entry.
>
> location field can be confusing because many locations are repeated
> with the same name in sydney and melbourne.
>
> i have two ideas:
> 1. another simple way could be: add a description to the location
>    field like "I can currently easily accept bookings for the
>    greater sydney and melbourne areas. please be as specific as
>    possible with your location description"
> 2. i can try to find a regional location dropdown box for
>    australia, and then see if i can filter and restrict the options
>    to only melbourne, and sydney locations, or locations that you
>    approve

Also in scope from the same day: inquiry emails currently reach only
Sammy's work address.

## Feature 1 — "How did you hear about us?" (SHIPPED, faaae44)

Dropdown added to the inquiry form: Instagram / 小红书 (Xiaohongshu) /
Google search / Friend or family / I'm a past client / Other.
Choosing "Other" reveals a required free-text box (same
hidden+disabled conditional pattern as the session-type fields, so
hidden fields never block validation or submit stale values).
Submissions include `heard-about` and, when applicable,
`heard-about-other`.

## Feature 2 — Location field clarity (OPEN — Design Decision 1)

Problem: suburb names repeat between Sydney and Melbourne, so a bare
free-text location is ambiguous.

- Idea 1 (Sammy): guidance text on the existing field.
- Idea 2 (Sammy): a restricted Australian locality dropdown.
- **Recommendation (Frosty Cloud + Claude): a hybrid THIRD option —
  split the field in two:**
  1. A small "City" dropdown: Sydney / Melbourne / Somewhere else —
     which removes the duplicate-suburb ambiguity STRUCTURALLY (the
     suburb name no longer needs to carry the city).
  2. A free-text "Suburb / area" input with Idea 1's guidance as its
     hint text ("I can currently take bookings around greater Sydney
     and Melbourne — please be specific about your area").
  Why not Idea 2: greater Sydney and Melbourne each have 600+
  suburbs; a dropdown that long is poor UX (especially mobile),
  needs an autocomplete component to be usable, and creates a
  maintenance burden (an approved-locations list to curate forever).
  The two-field split gets the disambiguation with zero maintenance.

Awaiting Sammy's pick: Idea 1, Idea 2, or the recommended split.

## Inquiry email routing (carried from same-day thread)

- Current: Web3Forms delivers to the access-key owner (Sammy's work
  email). A `ccemail` copy to the client shipped earlier (aba8812) —
  note ccemail is a Web3Forms PRO feature.
- Findings: Web3Forms has NO BCC field (docs corpus checked); the
  primary recipient is whoever the access key is registered to;
  linked recipient addresses must be verified by their owner.
- Blocker found by Sammy: the client never clicked her Web3Forms
  verification email, so her address cannot be linked yet.
- Target state (Sammy): client PRIMARY, Sammy on copy until
  everything is confirmed, then removed. Since BCC does not exist,
  Sammy's interim copy will be a visible CC.
- Sequence: client clicks verification email → Sammy links her in
  the Web3Forms dashboard (set as recipient if the dashboard allows)
  → code flips ccemail to info@frostycloud.net → live test → later,
  remove the CC line entirely.

## Confirmation / Testing checklist

- [ ] udonphoto.com/inquire shows "How did you hear about us?" with
      the six options; choosing "Other" reveals the text box;
      choosing anything else hides it again.
- [ ] Submit a test inquiry with "Other" + custom text — the email
      received includes the custom answer.
- [ ] (After the client verifies + dashboard linking) submit a test
      inquiry — it arrives in BOTH inboxes; then flip primary/CC per
      the sequence above and re-test.
- [ ] (After Design Decision 1) location field behaves per the
      chosen design.
