// Inquiry-form relay — Cloudflare Pages Function (deploys automatically
// from this functions/ folder, served at /api/contact).
//
// Why a relay instead of posting to Web3Forms from the browser:
//  - the Web3Forms key stays SERVER-side (env secret WEB3FORMS_KEY,
//    no PUBLIC_ prefix) — it never ships in page code
//  - spam layers run before anything is forwarded: honeypot, origin
//    check, field validation
//  - submissions flow through our own domain, so Cloudflare
//    rate-limiting rules can throttle /api/contact per visitor
//
// No WEB3FORMS_KEY set => demo mode: the function reports success with
// {demo:true} and forwards nothing (the form shows a demo note).
//
// Ported from the frosty-astro-sassify reference implementation and
// adapted to this site's inquiry-form fields (Aug 6 2026).

// Optional fields forwarded verbatim when present. Anything not on
// this list is dropped — bots love inventing extra fields.
const OPTIONAL_FIELDS = [
  'phone',
  'heard-about',
  'heard-about-other',
  'preferred-date-from',
  'preferred-date-to',
  'weeks-pregnant',
  'baby-age-months',
  'wedding-date',
  'wedding-time',
  'wedding-venue',
];

export async function onRequestPost({ request, env }) {
  const reply = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ success: false, error: 'bad-request' }, 400);
  }

  // Newlines are stripped from anything that could reach the subject
  // line — multi-line values in email headers are a classic injection
  // vector.
  const oneLine = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
  const str = (v) => String(v ?? '').trim();

  const name = oneLine(body?.name);
  const email = str(body?.email);
  const message = str(body?.message);
  const botcheck = str(body?.botcheck);

  // Honeypot: humans never see the field; bots auto-fill it. Report
  // success so bots don't learn they were caught, forward nothing.
  if (botcheck) return reply({ success: true });

  // Cross-site posts are refused. (Absent Origin headers are allowed —
  // some privacy setups strip them; the other layers still apply.)
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return reply({ success: false, error: 'forbidden' }, 403);
      }
    } catch {
      return reply({ success: false, error: 'forbidden' }, 403);
    }
  }

  // Required fields, matching the form's own `required` attributes.
  if (!name || name.length > 200) return reply({ success: false, error: 'invalid-name' }, 422);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200)
    return reply({ success: false, error: 'invalid-email' }, 422);
  if (!message || message.length > 5000)
    return reply({ success: false, error: 'invalid-message' }, 422);
  const required = {};
  for (const field of ['city', 'location', 'session-type', 'group-size']) {
    const value = str(body?.[field]);
    if (!value || value.length > 300)
      return reply({ success: false, error: `invalid-${field}` }, 422);
    required[field] = value;
  }

  // Optional fields: forwarded when present, length-capped, never
  // required (the form disables hidden conditional fields, so absent
  // is normal).
  const optional = {};
  for (const field of OPTIONAL_FIELDS) {
    const value = str(body?.[field]);
    if (value.length > 300) return reply({ success: false, error: `invalid-${field}` }, 422);
    if (value) optional[field] = value;
  }

  if (!env.WEB3FORMS_KEY) return reply({ success: true, demo: true });

  // Subject appears in the owner's inbox AND (as "Re: …") to the
  // customer when the owner replies. Hostname is derived from the
  // request, never hardcoded.
  const hostname = new URL(request.url).hostname;
  const subject = `New ${hostname} inquiry from ${name}`;

  const upstream = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_KEY,
      subject,
      name,
      email,
      replyto: email,
      ...required,
      ...optional,
      message,
    }),
  });
  const data = await upstream.json().catch(() => ({ success: false }));
  return reply({ success: !!data.success }, data.success ? 200 : 502);
}
