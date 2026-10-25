// Send a short message to the review group on Zalo (Zalo Bot Platform, sendMessage).
// render/pages.mjs calls it after publishing a preview; it can also be run by hand:
//
//   node render/zalo.mjs "Bản xem trước: <title> https://…"
//
// The bot token comes only from the environment (ZALO_BOT_TOKEN, a cloud-environment secret);
// never commit it or print it. ZALO_CHAT_ID overrides the default review group.
// curl (not fetch) so the request goes through the session's HTTPS proxy.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ZALO_GROUP = 'zgr-7722d0d041bfa8e1f1ae'; // the user's review group

// -> { ok: true } or { ok: false, reason }; never throws, so a publish never fails on it
export function sendZalo(text, { chatId = process.env.ZALO_CHAT_ID || ZALO_GROUP } = {}) {
  const token = process.env.ZALO_BOT_TOKEN;
  if (!token) return { ok: false, reason: 'ZALO_BOT_TOKEN is not set in this environment' };
  try {
    const out = execFileSync('curl', ['-sS', '--max-time', '20', '-X', 'POST',
      `https://bot-api.zaloplatforms.com/bot${token}/sendMessage`,
      '-H', 'Content-Type: application/json', '--data-binary', '@-'],
    { input: JSON.stringify({ chat_id: chatId, text }), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const res = JSON.parse(out || '{}');
    return res.ok ? { ok: true } : { ok: false, reason: res.description || out.slice(0, 200) };
  } catch (e) {
    // curl's message can contain the URL: drop the token from it
    return { ok: false, reason: String(e.stderr || e.message).split(token).join('<token>').trim().slice(0, 200) };
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = process.argv.slice(2).join(' ').trim();
  if (!text) throw new Error('usage: node render/zalo.mjs "<message>"');
  const r = sendZalo(text);
  console.log(r.ok ? 'zalo: sent' : `zalo: not sent (${r.reason})`);
  process.exitCode = r.ok ? 0 : 1;
}
