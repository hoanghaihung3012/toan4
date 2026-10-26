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
//
// A long lesson (scenes.json) gets one MP4 per scene, final/<date>/long/<lang>/<name>/<scene>.mp4
// (scene1.mp4, scene2.mp4, ...), where <name> is scenes.json "final" or the lesson name:
//   node render/final.mjs <lesson> [--scene scene2,scene3] [--jobs 2] [--join]
//   node render/final.mjs <lesson>/<scene>          the same for one scene
// --scene re-exports only those scenes, --jobs captures that many scenes at once, --join also
// writes the scenes joined end to end as final/<date>/long/<lang>/<name>.mp4 (for the upload);
// --scene none --join only joins the scene MP4s already exported.
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './browser.mjs';
import { finalPath, lessonDir, lessonInfo, listScenes, SCENES } from './paths.mjs';
import { publishShort } from './youtube.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/final.mjs <lesson>');
if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) throw new Error(`--date must be YYYY-MM-DD, got "${args.date}"`);
const dir = lessonDir(lesson);
const pass = [...(args.crf ? ['--crf', String(args.crf)] : []), ...(args.date ? ['--date', args.date] : [])];

if (!lesson.includes('/') && listScenes(lesson).length) {
  // --- long lesson: every scene (or --scene ...) as its own MP4, a few at a time -----------------
  const all = listScenes(lesson);
  const want = args.scene === 'none' ? [] : args.scene ? String(args.scene).split(',') : all.map((s) => s.id);
  const unknown = want.filter((id) => !all.some((s) => s.id === id));
  if (unknown.length) throw new Error(`not in ${dir}/${SCENES}: ${unknown.join(', ')}`);
  const queue = all.filter((s) => want.includes(s.id));
  const jobs = Math.max(1, Number(args.jobs || 1));
  let failed = 0;
  const run = async () => {
    for (let s; (s = queue.shift());) {
      const code = await new Promise((resolve) => spawn(process.execPath, [process.argv[1], s.ref, ...pass],
        { stdio: 'inherit' }).on('close', resolve));
      if (code) { failed++; console.error(`final: ${s.ref} failed`); }
    }
  };
  await Promise.all(Array.from({ length: jobs }, run));
  if (failed) process.exit(1);
  if (args.join) {
    const name = sceneFinalName(lesson);
    const parts = all.map((s) => finalPath(s.ref, { name, date: args.date }));
    const missing = parts.filter((f) => !fs.existsSync(f));
    if (missing.length) throw new Error(`--join: export these first: ${missing.join(', ')}`);
    const out = finalPath(lesson, { name, date: args.date });
    const list = path.join(dir, 'out', 'join.txt');
    fs.mkdirSync(path.dirname(list), { recursive: true });
    fs.writeFileSync(list, parts.map((f) => `file '${path.resolve(f)}'`).join('\n'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
      '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' });
    console.log(`wrote ${out} (${parts.length} scenes joined)`);
  }
  process.exit();
}

// a scene's MP4 is named after its long lesson: scenes.json "final", else the lesson folder name
function sceneFinalName(longLesson) {
  const manifest = JSON.parse(fs.readFileSync(path.join(lessonDir(longLesson), SCENES), 'utf8'));
  return manifest.final || lessonInfo(longLesson).name;
}

const info = lessonInfo(lesson);
const video = `${dir}/out/${path.basename(dir)}_video.mp4`;
const voice = JSON.parse(fs.readFileSync(`${dir}/voice.json`, 'utf8'));
const name = info.scene ? sceneFinalName(info.name) : voice.final || lesson;
if (!/^[a-z0-9_]+$/.test(name)) throw new Error(`${lesson}: voice.json "final" must be snake_case, got "${name}"`);
const out = finalPath(lesson, { name, date: args.date });

execFileSync('node', ['render/capture.mjs', '--lesson', lesson, '--out', video, ...(args.crf ? ['--crf', String(args.crf)] : [])],
  { stdio: 'inherit' });
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', `${dir}/audio/voice.wav`,
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`wrote ${out}`);
if (!args['no-upload'] && voice.lang === 'en' && info.format === 'shorts') {
  const r = publishShort(lesson, { file: out });
  if (r.ok) for (const n of r.notes) console.log(`youtube: ${n}`);
  else console.log(`youtube: not uploaded (${r.reason})`);
}
