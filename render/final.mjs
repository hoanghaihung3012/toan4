// Final export after the preview is approved: capture the video, mux the lesson's voiceover,
// and write the one committed file to final/<date>/<name>.mp4 (the video-only capture stays in
// the lesson's ignored out/). <date> is the day of the export in Vietnam time (YYYY-MM-DD);
// --date keeps an earlier day when a lesson is re-exported. <name> is voice.json "final" when set
// (an English variant uses its English title, e.g. "divisibility_rules"), otherwise the lesson
// folder name. An English lesson is then published by render/youtube.mjs: a public Short on the
// English channel, added to the playlist "Math", and one Zalo message with the preview link and
// the Short (skipped without the secrets, never fails the export).
//
//   node render/final.mjs <lesson> [--crf 18] [--date YYYY-MM-DD] [--no-upload]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { parseArgs } from './browser.mjs';
import { publishShort } from './youtube.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/final.mjs <lesson>');
const video = `lessons/${lesson}/out/${lesson}_video.mp4`;
const voice = JSON.parse(fs.readFileSync(`lessons/${lesson}/voice.json`, 'utf8'));
const name = voice.final || lesson;
if (!/^[a-z0-9_]+$/.test(name)) throw new Error(`${lesson}: voice.json "final" must be snake_case, got "${name}"`);
// the day the clip was made, in Vietnam time (en-CA formats as YYYY-MM-DD)
const date = args.date || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got "${date}"`);
const out = `final/${date}/${name}.mp4`;

execFileSync('node', ['render/capture.mjs', '--lesson', lesson, '--out', video, ...(args.crf ? ['--crf', String(args.crf)] : [])],
  { stdio: 'inherit' });
fs.mkdirSync(`final/${date}`, { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', `lessons/${lesson}/audio/voice.wav`,
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`wrote ${out}`);
if (!args['no-upload'] && voice.lang === 'en') {
  const r = publishShort(lesson, { file: out });
  if (r.ok) for (const n of r.notes) console.log(`youtube: ${n}`);
  else console.log(`youtube: not uploaded (${r.reason})`);
}
