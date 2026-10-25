// Upload a finished English clip to the English YouTube channel as a Short (YouTube Data API v3,
// resumable upload). render/final.mjs calls it right after the MP4 is written; it can also be run
// by hand for a clip exported earlier:
//
//   node render/youtube.mjs <lesson> [--file final/<date>/<name>.mp4] [--privacy private|unlisted|public]
//                                    [--dry-run] [--force]
//
// Only English lessons (voice.json "lang": "en") are uploaded: the Vietnamese channel stays manual
// (user's rule 2026-10-25). Audience is "not made for kids" (selfDeclaredMadeForKids: false, the
// user's choice). Default privacy is private; YT_PRIVACY or --privacy overrides it. A Google API
// project that YouTube has not audited gets every API upload locked to private regardless.
//
// Title, description and tags come from the lesson itself: the story.md heading and the voiceover
// lines (no new claims), or from an optional voice.json "youtube": { title, description, tags }.
// A record final/<date>/<name>.youtube.json is written after the upload, so a clip is never
// uploaded twice (--force uploads again).
//
// Credentials come only from the environment (cloud-environment secrets), never committed or
// printed: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (from render/youtube_auth.mjs).
// curl (not fetch) so the requests go through the session's HTTPS proxy.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './browser.mjs';

const PRIVACY = ['private', 'unlisted', 'public'];
const SECRETS = ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'];
const DEFAULT_TAGS = ['math', 'grade 4 math', 'math tricks', 'Shorts'];
const EDUCATION = '27'; // YouTube video category "Education"

// YouTube limits: title ≤ 100 chars, description ≤ 5000 bytes, no "<" or ">" in either,
// tags ≤ 500 chars in total
const clean = (s) => s.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
function clip(s, max) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

// -> { title, description, tags, lang } for a lesson; pure (reads files only)
export function buildMetadata(lesson) {
  const voice = JSON.parse(fs.readFileSync(`lessons/${lesson}/voice.json`, 'utf8'));
  const yt = voice.youtube || {};
  const story = fs.readFileSync(`lessons/${lesson}/story.md`, 'utf8');
  // "# Figure 99: how many matchsticks? (bản tiếng Anh)" -> "Figure 99: how many matchsticks?"
  const heading = (story.match(/^#\s+(.+)$/m)?.[1] || lesson).replace(/\s*\([^)]*\)\s*$/, '');
  const lines = voice.beats.flatMap((b) => b.lines.map((l) => l.text));

  const base = clean(yt.title || heading);
  const title = clip(base.includes('#Shorts') ? base : `${base} #Shorts`, 100);
  const tags = (yt.tags || DEFAULT_TAGS).map(clean).filter(Boolean);
  const hashtags = '#Shorts #math #mathtricks';
  let body = clean(yt.description || lines.join(' '));
  while (Buffer.byteLength(`${body}\n\n${hashtags}`) > 5000) body = clip(body, body.length - 200);
  const description = `${body}\n\n${hashtags}`;
  return { title, description, tags, lang: voice.lang || 'vi', final: voice.final || lesson };
}

function curlJson(argv, input) {
  const out = execFileSync('curl', ['-sS', '--max-time', '60', ...argv],
    { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 16 << 20 });
  return JSON.parse(out || '{}');
}

// refresh token -> short-lived access token
function accessToken() {
  const form = new URLSearchParams({
    client_id: process.env.YT_CLIENT_ID, client_secret: process.env.YT_CLIENT_SECRET,
    refresh_token: process.env.YT_REFRESH_TOKEN, grant_type: 'refresh_token',
  }).toString();
  const res = curlJson(['-X', 'POST', 'https://oauth2.googleapis.com/token',
    '-H', 'Content-Type: application/x-www-form-urlencoded', '--data-binary', '@-'], form);
  if (!res.access_token) throw new Error(`token refresh failed: ${res.error || ''} ${res.error_description || ''}`.trim());
  return res.access_token;
}

// resumable upload: 1) POST metadata -> session URL, 2) PUT the bytes -> video resource
function upload(file, meta, privacy, token) {
  const resource = {
    snippet: {
      title: meta.title, description: meta.description, tags: meta.tags, categoryId: EDUCATION,
      defaultLanguage: meta.lang, defaultAudioLanguage: meta.lang,
    },
    status: { privacyStatus: privacy, selfDeclaredMadeForKids: false, embeddable: true },
  };
  const size = fs.statSync(file).size;
  const headers = execFileSync('curl', ['-sS', '--max-time', '60', '-D', '-', '-o', '/dev/null', '-X', 'POST',
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    '-H', `Authorization: Bearer ${token}`, '-H', 'Content-Type: application/json; charset=UTF-8',
    '-H', `X-Upload-Content-Length: ${size}`, '-H', 'X-Upload-Content-Type: video/mp4',
    '--data-binary', '@-'], { input: JSON.stringify(resource), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  const status = headers.match(/^HTTP\/\S+ (\d+)/m)?.[1];
  const session = headers.match(/^location:\s*(\S+)/im)?.[1];
  if (!session) throw new Error(`upload session not created (HTTP ${status || '?'})`);
  const video = curlJson(['--max-time', '900', '-T', file, session, '-H', `Authorization: Bearer ${token}`,
    '-H', 'Content-Type: video/mp4']);
  if (!video.id) throw new Error(`upload failed: ${video.error?.message || JSON.stringify(video).slice(0, 200)}`);
  return video;
}

// -> { ok: true, url, record } | { ok: false, skipped?: true, reason }; never throws, so a final
// export never fails on the upload. The tokens never reach the returned reason.
export function uploadShort(lesson, { file, privacy, dryRun = false, force = false } = {}) {
  const secrets = SECRETS.map((k) => process.env[k]).filter(Boolean);
  const redact = (s) => secrets.reduce((acc, v) => acc.split(v).join('<secret>'), String(s));
  try {
    const meta = buildMetadata(lesson);
    if (meta.lang !== 'en') return { ok: false, skipped: true, reason: `${lesson} is not an English lesson (only the English channel uploads automatically)` };
    privacy = privacy || process.env.YT_PRIVACY || 'private';
    if (!PRIVACY.includes(privacy)) return { ok: false, reason: `privacy must be one of ${PRIVACY.join(', ')}, got "${privacy}"` };
    file = file || latestFinal(meta.final);
    if (!file || !fs.existsSync(file)) return { ok: false, reason: `no final MP4 for ${lesson} (run npm run final -- ${lesson})` };
    const recordFile = file.replace(/\.mp4$/, '.youtube.json');
    if (fs.existsSync(recordFile) && !force) {
      const prev = JSON.parse(fs.readFileSync(recordFile, 'utf8'));
      return { ok: false, skipped: true, reason: `already uploaded on ${prev.uploaded_at}: ${prev.url} (--force uploads again)` };
    }
    if (dryRun) return { ok: true, dryRun: true, file, privacy, meta };
    const missing = SECRETS.filter((k) => !process.env[k]);
    if (missing.length) return { ok: false, skipped: true, reason: `${missing.join(', ')} not set in this environment` };

    const video = upload(file, meta, privacy, accessToken());
    const record = {
      lesson, file: path.basename(file), video_id: video.id, url: `https://youtube.com/shorts/${video.id}`,
      title: meta.title, privacy: video.status?.privacyStatus || privacy, made_for_kids: false,
      uploaded_at: new Date().toISOString(),
    };
    fs.writeFileSync(recordFile, `${JSON.stringify(record, null, 2)}\n`);
    return { ok: true, url: record.url, record, recordFile };
  } catch (e) {
    return { ok: false, reason: redact(e.stderr || e.message).trim().slice(0, 300) };
  }
}

// newest final/<date>/<name>.mp4
function latestFinal(name) {
  if (!fs.existsSync('final')) return null;
  const days = fs.readdirSync('final').filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse();
  for (const d of days) if (fs.existsSync(`final/${d}/${name}.mp4`)) return `final/${d}/${name}.mp4`;
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const lesson = args._[0];
  if (!lesson) throw new Error('usage: node render/youtube.mjs <lesson> [--file <mp4>] [--privacy private|unlisted|public] [--dry-run] [--force]');
  const r = uploadShort(lesson, { file: args.file, privacy: args.privacy, dryRun: !!args['dry-run'], force: !!args.force });
  if (r.dryRun) console.log(`youtube (dry run): ${r.file} as ${r.privacy}\n${JSON.stringify(r.meta, null, 2)}`);
  else console.log(r.ok ? `youtube: uploaded ${r.url} (${r.record.privacy}); record ${r.recordFile}` : `youtube: not uploaded (${r.reason})`);
  process.exitCode = r.ok || r.skipped ? 0 : 1;
}
