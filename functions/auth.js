export async function onRequest(context) {
  const { env } = context;
  const url = new URL(context.request.url);
  const provider = url.searchParams.get('provider');

  if (provider !== 'github') {
    return new Response('Provider not supported', { status: 400 });
  }

  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo,user&state=${Math.random().toString(36).substring(7)}`;

  return Response.redirect(redirectUrl, 302);
}
