// Cloudflare Pages Function
// Lives at /callback on your existing domain
// Requires env vars GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET set in Pages project settings
// Mark GITHUB_CLIENT_SECRET as "Secret" (encrypted) in the dashboard

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
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
    }
  );

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
