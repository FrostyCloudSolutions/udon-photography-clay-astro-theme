function renderMessage(status, payload) {
  const script = `
    <script>
      (function() {
        function receiveMessage(message) {
          window.opener.postMessage(
            'authorization:github:${status}:${JSON.stringify(payload)}',
            message.origin
          );
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  `;
  return new Response(script, { headers: { 'Content-Type': 'text/html' } });
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.split('=')[1] : null;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = getCookie(request, 'oauth_state');

  if (!code || !state || state !== cookieState) {
    return new Response('Invalid or missing OAuth state', { status: 400 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const data = await tokenResponse.json();

  if (!tokenResponse.ok || data.error || !data.access_token) {
    return renderMessage('error', data.error_description || data.error || 'GitHub token exchange failed');
  }

  return renderMessage('success', { token: data.access_token, provider: 'github' });
}
