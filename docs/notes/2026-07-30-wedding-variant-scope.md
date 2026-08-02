# Udon Studio — Future Project Scope: Wedding Brand-Variant Site

**Date:** July 30, 2026
**Status: BACKLOG — client-initiated idea, no timeline.** The client
plans to grow her wedding photography portfolio first and revisit.
Recorded now so the scope is ready when she is.

## Concept (from the July 30 conversation)

A sister site for the wedding photography business, deployed from
the udonphoto codebase as a template. Client's preference: simplest
possible variant — same structure, rebranded naming/categories,
light design differentiation (colors, fonts, small details).
Proposed hosting: a free Cloudflare subdomain such as
wedding.udonphoto.com (no new domain purchase needed) — or its own
domain later if the business takes off.

## Technical scope (deployment of existing system, not a rebuild)

1. **Repository:** fork/duplicate the repo into a new project
   (keeps histories separate; template stays reusable).
2. **Sanity:** new project + dataset; deploy existing schemas;
   host a second Studio; re-provision client access; re-seed
   category tags for wedding-specific taxonomy.
3. **Rebrand pass:** site name/logo text, nav and category names,
   homepage tiles, About/Inquire copy, color palette, font theme
   (one-line change via existing Site settings), favicon variant.
4. **Lead capture:** new Web3Forms access key routed to the wedding
   inbox (or same inbox with a distinguishing subject line);
   form field labels adjusted for wedding-only inquiries —
   conditional logic simplifies (no baby/maternity branches).
5. **Hosting/DNS:** new Cloudflare Pages project; subdomain custom
   domain + TLS; publish→rebuild webhook for the new Studio;
   _headers cache policy carries over.
6. **QA:** cross-device pass of the standard testing checklist;
   end-to-end inquiry test; email deliverability inherits the
   existing udonphoto.com DNS records if using the subdomain.
7. **Onboarding:** short delta-guide for the client (what differs
   from the Studio she already knows — expected: almost nothing).

## Explicitly out of scope for the simple variant

- Structural redesign, new page types, new features
- Separate email domain / Workspace setup (subdomain inherits)
- Content creation (client uploads her wedding portfolio)

## Notes

- If a dedicated domain is chosen instead of the subdomain, add:
  domain purchase, new zone setup, and a fresh SPF/DKIM/DMARC pass
  for any new mail domain.
- The udonphoto repo doubles as the master template; improvements
  made there after the fork do not auto-propagate — significant
  fixes should be cherry-picked deliberately.
