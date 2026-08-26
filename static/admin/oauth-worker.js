// Cloudflare Worker: OAuth proxy for Decap CMS on a static host (GitHub Pages)
// Deploy this at a subdomain like cms-oauth.geiltonxavier.workers.dev
// Set two secrets in the Cloudflare dashboard: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const authUrl = new URL(GITHUB_AUTH_URL);
      authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set("scope", "repo,user");
      authUrl.searchParams.set(
        "redirect_uri",
        `${url.origin}/callback`
      );
      return Response.redirect(authUrl.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }

      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`Auth error: ${tokenData.error_description}`, {
          status: 400,
        });
      }

      const token = tokenData.access_token;
      const payloadScript = `
        (function() {
          function receiveMessage(message) {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token })}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      `;

      return new Response(
        `<html><body><script>${payloadScript}</script></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
