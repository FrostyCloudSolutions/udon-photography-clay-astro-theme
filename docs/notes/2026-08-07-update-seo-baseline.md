# Udon Studio — Update (August 7, 2026): SEO Baseline

**Date:** August 7, 2026
**Status: EXECUTING (owner-ordered from the HQ task tracker's
baseline-standards wave; tracker scope = canonical/sitemap/OG/robots
port + useCdn check).**

Labels: Task N, numbered from 1 within this document only.

## Audit findings (August 7)

Already in place: XML sitemap generating at /sitemap-index.xml
(@astrojs/sitemap + site URL configured); robots.txt exists.
Gaps vs the frostycloud.net reference implementation:

1. robots.txt allows crawling but never tells crawlers WHERE the
   sitemap is (no `Sitemap:` line).
2. No canonical tags — with the site now on BOTH udonphoto.com and
   www.udonphoto.com (plus the pages.dev copy), search engines can
   split ranking credit across duplicate URLs. Canonical
   consolidates it onto one official URL per page.
3. No social preview card (Open Graph / Twitter) — pasting
   udonphoto.com into WeChat/Instagram/iMessage renders a bare link
   instead of a titled card. (og:image included where the page
   already knows its hero image — the homepage.)
4. `useCdn: true` in the Sanity client — builds read Sanity's CACHED
   API. Builds here are publish-triggered, so the cache can lag the
   just-published content: the July "new content missing from the
   immediate build" retry loops were exactly this. Build-time reads
   should hit the live API (`useCdn: false`); milliseconds slower
   per build, correctness win.

## Task list

1. **Task 1 — robots.txt:** add the Sitemap pointer line.
2. **Task 2 — Layout head:** canonical link + og:type/url/title/
   description/site_name (+ og:image when the page provides its
   hero) + twitter:card, all derived from the request URL and the
   siteConfig identity — no hardcoded strings.
3. **Task 3 — sanity client:** useCdn: false.
4. **Task 4 — verify:** built pages carry canonical + OG; robots
   advertises the sitemap; build passes (proves the API path);
   deploy and re-check live.

## Template parity

The same three gaps exist in the frosty-astro-still template repo;
fixed there in the same round (its own commit + HQ build note) so
future deployments inherit the baseline. Also confirmed during this
round: the Aug 5 performance/accessibility fixes exist ONLY in this
deployment — porting them to the Still template is tracked in the HQ
task tracker.

## Confirmation / Testing checklist

- [ ] Live: view-source on / shows rel=canonical to
      https://udonphoto.com/ and the og: block.
- [ ] https://udonphoto.com/robots.txt shows the Sitemap line;
      /sitemap-index.xml loads.
- [ ] Paste udonphoto.com into a chat app -> titled preview card
      appears (may take a day as apps refresh their caches).
- [ ] Next client publish appears in the very first rebuild (no
      stale-CDN retry).
