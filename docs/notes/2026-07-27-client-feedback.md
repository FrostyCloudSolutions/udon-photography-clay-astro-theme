# Udon Studio — Feedback & Revisions (July 27, 2026)

**Date:** July 27, 2026
**Status: COLLECTING** — the developer is still sorting further
client notes and requests; scope, design decisions, and the task
list will be completed once the batch is assembled. NO implementation
until the plan is reviewed and approved.

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

## (Further items pending — client notes being sorted)
