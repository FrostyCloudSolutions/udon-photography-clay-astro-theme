# Udon Studio — Update (August 7, 2026): Inquiry Form Hardening

**Date:** August 7, 2026 (doc initially misdated Aug 6; corrected —
completion date is the doc date per owner convention)
**Status: COMPLETE August 7.** Relay + secret + throttle live and
verified; human end-to-end submission reached the thank-you page
(Web3Forms accepted the forward upstream). Phase 2 key rotation
CANCELLED by owner decision — see Task 4. Ported from the frosty-astro-sassify reference
implementation, adapted to this form's fields, per the developer's
written spec (spec = approval; no separate gate).

Labels: Task N, numbered from 1 within this document only.

## How it works (plain language)

Before this change, the inquiry form posted straight from the
visitor's browser to Web3Forms, and the access key rode along inside
the page's HTML — public by design, but that means anyone could copy
the key and pump spam through it, and there was nowhere to put spam
defenses.

Now the form posts to OUR OWN address — /api/contact on
udonphoto.com. A small server-side program (a Cloudflare Pages
Function living at functions/api/contact.js in this repo; Cloudflare
runs it automatically, no server to manage) answers that address and
runs four gates in order:

1. **Honeypot** — the form contains an invisible field named
   "botcheck" that humans never see or fill. Bots auto-fill every
   field, so a filled botcheck means a bot: the function replies
   "success" (so the bot learns nothing) and forwards nothing.
2. **Origin check** — posts coming from any other website (a foreign
   Origin header) are refused with 403.
3. **Validation** — required fields present, sane lengths, real
   email shape; otherwise 422. Newlines are stripped from anything
   that reaches the email subject (header-injection defense).
4. **Forward** — only then does the function pass the inquiry,
   server-to-server, to Web3Forms — using the key stored as the
   Cloudflare secret **WEB3FORMS_KEY**. The key never appears in any
   page a visitor can view-source.

If no key is configured (previews/demos), the function answers
{success:true, demo:true} and the form shows "(Demo form — no
message was actually sent.)" instead of pretending.

The subject line is built server-side as
`New udonphoto.com inquiry from <name>` — hostname derived from the
request, never hardcoded. Reply-to is set to the visitor's email, so
the client replies straight to the customer, unchanged from before.

Because submissions now flow through our own domain, a Cloudflare
rate-limiting rule on /api/contact can throttle flooders per IP —
impossible when the browser posted directly to Web3Forms.

Where things live: relay = functions/api/contact.js · form wiring =
src/templates/Contact.astro · key = Cloudflare Pages project →
Settings → Variables and Secrets → WEB3FORMS_KEY (Secret,
Production) · rate rule = udonphoto.com zone → Security →
"contact-form-throttle".

## Task list

1. **Task 1 — relay function (DONE, live-verified).** Honeypot →
   origin → validation → forward; demo mode; whitelisted optional
   fields (bots love inventing extras); 300-char caps; subject
   hostname-derived.
2. **Task 2 — form rewiring (DONE, live-verified).** Posts JSON to
   /api/contact; visible-field behavior unchanged; honeypot added
   (invisible); demo note only when keyless; access key + Web3Forms
   hidden fields fully removed — built pages contain ZERO
   web3forms.com references and no key.
3. **Task 3 — dashboard Phase 1 (developer, in progress):** secret
   WEB3FORMS_KEY = old key (closes the demo-mode delivery gap
   tonight — old key still works and now sits behind all defenses);
   Retry deployment (env binds at deploy time); zone rate rule
   "contact-form-throttle": URI Path equals /api/contact, per IP,
   Block (free plan ~3 req/10s).
4b. **ROTATION COMPLETED (Aug 7 evening).** New Web3Forms form/key
   created for frame@udonphoto.com (dashboard label:
   udonphoto-inquiry-relay-key, sender name "Udon Studio Website");
   secret swapped, redeployed, verified: human test -> thank-you
   page, relay probe -> {"success":true}, honeypot/422/403 all
   correct on the rotated key. GOTCHA FOR FUTURE DEPLOYMENTS: a
   redirect URL configured on the Web3Forms form makes their API
   answer JSON submissions with a non-success response — the relay
   reads that as upstream failure (502). Leave the form's redirect
   field BLANK; the site handles its own thank-you navigation.
   Remaining: owner deletes the old form entry (revokes the burned
   key 07872cc3...).
4a. **ADDENDUM (later Aug 7): rotation REINSTATED by owner** —
   "clean slate and insurance against possible web scrapes." Plan:
   rotate when the client next responds (fresh key -> her
   verification click -> swap the secret -> Retry deployment -> test
   -> deactivate old key). Tracked in the HQ task tracker.
4. **Task 4 — key rotation: CANCELLED (owner decision, Aug 7).**
   The old key stays in service as the WEB3FORMS_KEY secret. Owner
   rationale: it works, no abuse has been observed, and skipping
   rotation removes any need for the client to interact (no
   verification click). Recorded residual risk, stated once for the
   record: the old key shipped in public page source for weeks and
   lives on in web archives — anyone holding it can post spam
   DIRECTLY to Web3Forms' API with it, bypassing this site's
   honeypot/origin/throttle gates entirely (those protect only our
   endpoint). Impact ceiling is spam-to-inbox/quota-drain; no client
   data is reachable. REMEDY IF SPAM EVER APPEARS: rotate then —
   fresh key in the Web3Forms dashboard, client clicks the
   verification email, swap the secret's value, Retry deployment
   (~10 minutes end to end).

## Verification record

Local (wrangler pages dev): all four gates correct. Live
(udonphoto.com, post-deploy): honeypot → {"success":true} · bad
email → 422 · foreign Origin → 403 · valid keyless → demo:true.
Built output: zero web3forms references, zero key occurrences;
relay + honeypot present in built inquire page.

## Confirmation / Testing checklist

- [x] After Phase 1 retry: honeypot/422/403 all correct live (Aug 6)
      — demo-mode exit proven by the human delivery test below
      (Claude re-checks — without sending mail, via the 422/403
      probes staying correct and a human submission for delivery).
- [x] Human end-to-end submission (Aug 7): thank-you page reached,
      demo note absent — the relay only reports success after
      Web3Forms accepts the forward, so delivery is confirmed
      upstream. (Inbox spot-check at frame@ = casual client
      confirmation whenever she next looks.)
- [x] After the rate rule: burst of 8 rapid honeypot POSTs → 3 passed
      then five 429s (verified Aug 6; rule name on the zone is
      "inquiry-form-throttle" per the developer).
- [x] Phase 2 closed as CANCELLED (owner decision — old key
      retained; see Task 4). PUBLIC_WEB3FORMS_KEY never existed on
      this project (key was hardcoded in page source, not a
      variable).
