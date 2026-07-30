# Udon Studio — Update (July 30, 2026): Form Text Editing

**Date:** July 30, 2026
**Status: SCOPED — local prototype approved for a test run later
July 30.** Developer-initiated (not client feedback). Production
deploy requires a separate go after the prototype is reviewed.

Labels: Feature N / Task N, numbered from 1 within this document.

## Background

Discussed July 30, right after the July 27 update closed. The
developer wants clients to feel more ownership of meaningful surfaces
— the inquiry form above all. Full form-builder control was
considered and rejected (drag-reordering could re-break the
conditional layout logic that Bug 2 of the July 27 update just
fixed). The approved direction is the middle ground.

## Feature 1 — Client-editable form text (structure stays locked)

The client edits, from a new "Inquiry form" area in her Studio:

- Field labels and placeholders (e.g. the message box prompt)
- Dropdown option lists: "How did you hear about us?" sources,
  session types*, group sizes, cities
- NOT editable: field order, pairing/rows, required flags, and the
  conditional logic (weddings date swap, maternity/baby follow-ups)
  — those stay in code.

*Session-type options interact with the conditional logic (Weddings/
Maternity/Babies trigger follow-ups) and with portfolio categories —
the prototype must decide whether session types come from the
existing category list (current behavior) with only extra entries
editable, or stay read-only. To resolve during the test run.

## Technical sketch (for the prototype)

- Sanity: new `inquiryForm` singleton (like Site settings): grouped
  string fields for labels/placeholders + string-array fields for
  option lists, each with sensible initial values matching the live
  form.
- Site: Contact.astro reads the singleton at build time with
  hard-coded fallbacks for every value (missing/unpublished document
  must never break the form).
- Localized test run: local Studio (`npm run dev` in studio/) +
  local site build only. No `sanity deploy`, no push to main until
  reviewed and approved.

## Task list (pending the test-run session)

1. **Task 1 — prototype locally** (schema + Contact.astro wiring,
   local verification). (~15k tokens)
2. **Task 2 — review + decision:** developer reviews the editing
   experience; decides ship / adjust / drop. Production deploy =
   `sanity deploy` + push, only after this.

## Confirmation / Testing checklist (post-ship only)

- [ ] Studio: "Inquiry form" area appears; editing a label and
      publishing changes the live form text after ~2 min rebuild.
- [ ] Deleting/leaving fields empty falls back to current wording —
      form never renders blank labels.
- [ ] Conditional behaviors (weddings swap, follow-ups, Other box)
      unchanged after arbitrary text edits.
