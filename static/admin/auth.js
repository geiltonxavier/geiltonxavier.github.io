// Cloudflare Pages Function
// Lives at /auth on your existing domain, no separate Worker needed
// Requires env vars GITHUB_CLIENT_ID set in Pages project settings

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("scope", "repo,user");
  authUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);

  return Response.redirect(authUrl.toString(), 302);
}
