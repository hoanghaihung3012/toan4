// Publish a finished English clip: upload it to the English YouTube channel as a Short (YouTube Data API v3,
// resumable upload). render/final.mjs calls it right after the MP4 is written; it can also be run
// by hand for a clip exported earlier:
//
//   node render/youtube.mjs <lesson> [--file final/<date>/<format>/<lang>/<name>.mp4] [--privacy private|unlisted|public]
//                                    [--dry-run] [--force] [--no-zalo]
//
// Only English lessons (voice.json "lang": "en") are uploaded: the Vietnamese channel stays manual
// (user's rule 2026-10-25). Audience is "not made for kids" (selfDeclaredMadeForKids: false, the
// user's choice). Default privacy is public (user's rule, 2026-10-26); YT_PRIVACY or --privacy
// overrides it, and an earlier upload with another privacy is switched to it. A Google API project
// that YouTube has not audited gets every API upload locked to private regardless.
//
// Title, description and tags come from the lesson itself: the story.md heading and the voiceover
// lines (no new claims), or from an optional voice.json "youtube": { title, description, tags,
// playlist }. After the upload the Short goes into the channel's playlist "Math" (created if
// missing), then one Zalo message carries the preview link and the Short (user's rule,
// 2026-10-26). final/<date>/<format>/<lang>/<name>.youtube.json records each finished step, so
// nothing is uploaded or sent twice (--force uploads again).
//
// Credentials come only from the environment (cloud-environment secrets), never committed or
// printed: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (from render/youtube_auth.mjs, scope
// "youtube": the playlist step needs more than "youtube.upload"), ZALO_BOT_TOKEN for Zalo.
// curl (not fetch) so the requests go through the session's HTTPS proxy.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './browser.mjs';
import { latestFinal, lessonDir } from './paths.mjs';
import { lessonTitle, pagesSite } from './site.mjs';
import { sendZalo } from './zalo.mjs';

const PRIVACY = ['private', 'unlisted', 'public'];
const SECRETS = ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'];
const DEFAULT_TAGS = ['math', 'grade 4 math', 'math tricks', 'Shorts'];
const DEFAULT_PLAYLIST = 'Math'; // user's rule, 2026-10-26
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
  const voice = JSON.parse(fs.readFileSync(`${lessonDir(lesson)}/voice.json`, 'utf8'));
  const yt = voice.youtube || {};
  const story = fs.readFileSync(`${lessonDir(lesson)}/story.md`, 'utf8');
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
  return { title, description, tags, lang: voice.lang || 'vi', final: voice.final || lesson, playlist: yt.playlist || DEFAULT_PLAYLIST };
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
  const headers = execFileSync('curl', ['-sS', '--max-time', '60', '-D', '-', '-X', 'POST',
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    '-H', `Authorization: Bearer ${token}`, '-H', 'Content-Type: application/json; charset=UTF-8',
    '-H', `X-Upload-Content-Length: ${size}`, '-H', 'X-Upload-Content-Type: video/mp4',
    '--data-binary', '@-'], { input: JSON.stringify(resource), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  // the proxy's "200 Connection Established" comes first: the last status line is YouTube's
  const status = [...headers.matchAll(/^HTTP\/\S+ (\d+)/gm)].pop()?.[1];
  const session = headers.match(/^location:\s*(\S+)/im)?.[1];
  const reason = headers.match(/"message":\s*"([^"]+)"/)?.[1];
  if (!session) throw new Error(`upload session not created (HTTP ${status || '?'}${reason ? `: ${reason}` : ''})`);
  const video = curlJson(['--max-time', '900', '-T', file, session, '-H', `Authorization: Bearer ${token}`,
    '-H', 'Content-Type: video/mp4']);
  if (!video.id) throw new Error(`upload failed: ${video.error?.message || JSON.stringify(video).slice(0, 200)}`);
  return video;
}

function api(method, url, token, body) {
  const res = curlJson(['-X', method, url, '-H', `Authorization: Bearer ${token}`,
    ...(body ? ['-H', 'Content-Type: application/json; charset=UTF-8', '--data-binary', '@-'] : [])],
  body && JSON.stringify(body));
  if (res.error) throw new Error(`${method} ${url.split('?')[0]}: ${res.error.message || res.error.code}`);
  return res;
}

// the channel's playlist with this exact title, created (public) when it does not exist yet
function findOrCreatePlaylist(title, token) {
  let page = '';
  do {
    const res = api('GET', `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50${page && `&pageToken=${page}`}`, token);
    const hit = (res.items || []).find((p) => p.snippet?.title === title);
    if (hit) return { id: hit.id, created: false };
    page = res.nextPageToken || '';
  } while (page);
  const made = api('POST', 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', token,
    { snippet: { title }, status: { privacyStatus: 'public' } });
  return { id: made.id, created: true };
}

// The whole English publish, step by step: 1) upload the Short, 2) add it to the playlist
// (voice.json youtube.playlist, default "Math"), 3) one Zalo message with the preview link and the
// Short (user's rule, 2026-10-26). Each finished step is kept in
// final/<date>/<format>/<lang>/<name>.youtube.json, so a re-run only does the steps still missing
// and never uploads or messages twice (--force uploads again). -> { ok, record, recordFile, notes } | { ok: false, skipped?, reason }; never
// throws, so a final export never fails on it. The tokens never reach the returned text.
export function publishShort(lesson, { file, privacy, dryRun = false, force = false, zalo = true } = {}) {
  const secrets = [...SECRETS, 'ZALO_BOT_TOKEN'].map((k) => process.env[k]).filter((v) => v?.length >= 8);
  const redact = (s) => secrets.reduce((acc, v) => acc.split(v).join('<secret>'), String(s)).trim().slice(0, 300);
  try {
    const meta = buildMetadata(lesson);
    if (meta.lang !== 'en') return { ok: false, skipped: true, reason: `${lesson} is not an English lesson (only the English channel uploads automatically)` };
    privacy = privacy || process.env.YT_PRIVACY || 'public';
    if (!PRIVACY.includes(privacy)) return { ok: false, reason: `privacy must be one of ${PRIVACY.join(', ')}, got "${privacy}"` };
    file = file || latestFinal(meta.final);
    if (!file || !fs.existsSync(file)) return { ok: false, reason: `no final MP4 for ${lesson} (run npm run final -- ${lesson})` };
    const recordFile = file.replace(/\.mp4$/, '.youtube.json');
    const record = fs.existsSync(recordFile) && !force ? JSON.parse(fs.readFileSync(recordFile, 'utf8')) : null;
    const site = pagesSite(lesson);
    const zaloText = (short) => `Bản xem trước: ${lessonTitle(lesson)}\n${site ? site.url : ''}\nYouTube Shorts: ${short}`;
    if (dryRun) return { ok: true, dryRun: true, file, privacy, meta, playlist: meta.playlist, record, zalo: zaloText('<short link>') };

    const notes = [];
    let token;
    const auth = () => (token ||= accessToken());
    const missing = SECRETS.filter((k) => !process.env[k]);
    const save = (rec) => fs.writeFileSync(recordFile, `${JSON.stringify(rec, null, 2)}\n`);

    // 1. upload
    let rec = record;
    if (!rec) {
      if (missing.length) return { ok: false, skipped: true, reason: `${missing.join(', ')} not set in this environment` };
      const video = upload(file, meta, privacy, auth());
      rec = {
        lesson, file: path.basename(file), video_id: video.id, url: `https://youtube.com/shorts/${video.id}`,
        title: meta.title, privacy: video.status?.privacyStatus || privacy, made_for_kids: false,
        uploaded_at: new Date().toISOString(),
      };
      save(rec);
      notes.push(`uploaded ${rec.url} (${rec.privacy})`);
    } else notes.push(`already uploaded ${rec.url}`);
    if (rec.privacy !== privacy) {
      if (missing.length) notes.push(`privacy: still ${rec.privacy} (${missing.join(', ')} not set)`);
      else {
        try {
          // videos.update replaces the whole status part: keep the audience setting in it
          const v = api('PUT', 'https://www.googleapis.com/youtube/v3/videos?part=status', auth(),
            { id: rec.video_id, status: { privacyStatus: privacy, selfDeclaredMadeForKids: false, embeddable: true } });
          rec.privacy = v.status?.privacyStatus || privacy;
          save(rec);
        } catch (e) {
          notes.push(`privacy: still ${rec.privacy} (${redact(e.stderr || e.message)})`);
        }
      }
    }
    if (rec.privacy !== privacy && rec.privacy === 'private') notes.push(`privacy: YouTube keeps it private (an unaudited API project locks uploads to private): switch it to ${privacy} in YouTube Studio`);
    else notes.push(`privacy: ${rec.privacy}`);

    // 2. playlist
    if (rec.playlist_id) notes.push(`already in playlist "${rec.playlist}"`);
    else if (missing.length) notes.push(`playlist: not added (${missing.join(', ')} not set)`);
    else {
      try {
        const pl = findOrCreatePlaylist(meta.playlist, auth());
        api('POST', 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', auth(),
          { snippet: { playlistId: pl.id, resourceId: { kind: 'youtube#video', videoId: rec.video_id } } });
        Object.assign(rec, { playlist: meta.playlist, playlist_id: pl.id });
        save(rec);
        notes.push(`added to playlist "${meta.playlist}"${pl.created ? ' (playlist created)' : ''}`);
      } catch (e) {
        const why = redact(e.stderr || e.message);
        notes.push(`playlist: not added (${why}${/insufficient/i.test(why) ? '; the refresh token needs the youtube scope: run npm run youtube:auth again' : ''})`);
      }
    }

    // 3. Zalo: one message with the preview and the Short
    if (rec.zalo_sent_at) notes.push(`zalo: already sent on ${rec.zalo_sent_at}`);
    else if (!zalo) notes.push('zalo: skipped (--no-zalo)');
    else {
      const z = sendZalo(zaloText(rec.url));
      if (z.ok) { rec.zalo_sent_at = new Date().toISOString(); save(rec); notes.push('zalo: preview + Short sent to the review group'); }
      else notes.push(`zalo: not sent (${redact(z.reason)})`);
    }
    return { ok: true, url: rec.url, record: rec, recordFile, notes };
  } catch (e) {
    return { ok: false, reason: redact(e.stderr || e.message) };
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const lesson = args._[0];
  if (!lesson) throw new Error('usage: node render/youtube.mjs <lesson> [--file <mp4>] [--privacy private|unlisted|public] [--dry-run] [--force] [--no-zalo]');
  const r = publishShort(lesson, { file: args.file, privacy: args.privacy, dryRun: !!args['dry-run'], force: !!args.force, zalo: !args['no-zalo'] });
  if (r.dryRun) console.log(`youtube (dry run): ${r.file} as ${r.privacy}, playlist "${r.playlist}"${r.record ? `, already uploaded ${r.record.url}` : ''}\n${JSON.stringify(r.meta, null, 2)}\nzalo:\n${r.zalo}`);
  else if (r.ok) for (const n of r.notes) console.log(`youtube: ${n}`);
  else console.log(`youtube: not uploaded (${r.reason})`);
  process.exitCode = r.ok || r.skipped ? 0 : 1;
}
