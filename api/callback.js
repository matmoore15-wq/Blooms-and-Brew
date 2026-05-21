export default async function handler(req, res) {
  const { code } = req.query;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const { access_token, error } = await response.json();

  if (error || !access_token) {
    res.status(400).send(`Auth error: ${error}`);
    return;
  }

  const html = `<!DOCTYPE html><html><body><script>
    (() => {
      const token = ${JSON.stringify(access_token)};
      const receiveMessage = (e) => {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify({ token, provider: 'github' }),
          e.origin
        );
      };
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  <\/script></body></html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
