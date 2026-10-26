// One-time sign-in that gives render/youtube.mjs its refresh token. Run it on your own computer
// (not in the cloud session), signed in to the Google account that owns the English channel:
//
//   set YT_CLIENT_ID=...          (Windows cmd; PowerShell: $env:YT_CLIENT_ID="...")
//   set YT_CLIENT_SECRET=...
//   node render/youtube_auth.mjs
//
// It prints a Google sign-in link, waits for the redirect on http://127.0.0.1:<port>, trades the
// code for tokens and prints the refresh token once, in your terminal only. Store it as the
// YT_REFRESH_TOKEN cloud-environment secret; never commit it or paste it into a chat.
// The OAuth client must be of type "Desktop app" and the consent screen published "In production",
// otherwise Google expires the refresh token after 7 days.
import http from 'node:http';

const SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
const { YT_CLIENT_ID: clientId, YT_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) throw new Error('set YT_CLIENT_ID and YT_CLIENT_SECRET first');

let port;
let done = false;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri());
  const code = url.searchParams.get('code');
  // the browser also asks for /favicon.ico, sometimes after the code was already used
  if (done || !code) { res.writeHead(done ? 204 : 400).end(done ? '' : url.searchParams.get('error') || 'no code'); return; }
  done = true;
  const tokens = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: clientId, client_secret: clientSecret,
      redirect_uri: redirectUri(), grant_type: 'authorization_code',
    }),
  }).then((r) => r.json());
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    .end(tokens.refresh_token ? 'Done. Go back to the terminal.' : 'Failed. See the terminal.');
  if (tokens.refresh_token) console.log(`\nYT_REFRESH_TOKEN=${tokens.refresh_token}\n\nSave it as a cloud-environment secret.`);
  else console.log('no refresh token returned:', tokens.error, tokens.error_description || '');
  server.close();
});

const redirectUri = () => `http://127.0.0.1:${port}`;

server.listen(0, '127.0.0.1', () => {
  port = server.address().port;
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id: clientId, redirect_uri: redirectUri(), response_type: 'code', scope: SCOPE,
    access_type: 'offline', prompt: 'consent',
  });
  console.log(`Open this link, sign in with the English channel's account and allow access:\n\n${auth}\n`);
});
