// Final export after the preview is approved: capture the video, mux the lesson's voiceover,
// and write the one committed file to final/<date>/<format>/<lang>/<name>.mp4, the same
// <date>/<format>/<lang> as the lesson's own folder lessons/<date>/<format>/<lang>/<lesson>/
// (user's rule, 2026-10-26; the video-only capture stays in the lesson's ignored out/). <date> is
// the day the lesson was made, so a re-export lands in the same folder; --date overrides it.
// <name> is voice.json "final" when set (an English variant uses its English title, e.g.
// "divisibility_rules"), otherwise the lesson folder name. An English lesson is then published by
// render/youtube.mjs: a public Short on the English channel, added to the playlist "Math", and one
// Zalo message with the preview link and the Short (skipped without the secrets, never fails the
// export).
//
//   node render/final.mjs <lesson> [--crf 18] [--date YYYY-MM-DD] [--no-upload]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './browser.mjs';
import { finalPath, lessonDir } from './paths.mjs';
import { publishShort } from './youtube.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/final.mjs <lesson>');
const dir = lessonDir(lesson);
const video = `${dir}/out/${lesson}_video.mp4`;
const voice = JSON.parse(fs.readFileSync(`${dir}/voice.json`, 'utf8'));
const name = voice.final || lesson;
if (!/^[a-z0-9_]+$/.test(name)) throw new Error(`${lesson}: voice.json "final" must be snake_case, got "${name}"`);
if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) throw new Error(`--date must be YYYY-MM-DD, got "${args.date}"`);
const out = finalPath(lesson, { name, date: args.date });

execFileSync('node', ['render/capture.mjs', '--lesson', lesson, '--out', video, ...(args.crf ? ['--crf', String(args.crf)] : [])],
  { stdio: 'inherit' });
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', `${dir}/audio/voice.wav`,
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`wrote ${out}`);
if (!args['no-upload'] && voice.lang === 'en') {
  const r = publishShort(lesson, { file: out });
  if (r.ok) for (const n of r.notes) console.log(`youtube: ${n}`);
  else console.log(`youtube: not uploaded (${r.reason})`);
}
