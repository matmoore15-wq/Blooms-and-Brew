export default function handler(req, res) {
  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'repo,user',
    redirect_uri: `${siteUrl}/api/callback`,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
