// Where lessons and finished clips live. lessons/ and final/ share one layout (user's rule, 2026-10-26):
//
//   lessons/<YYYY-MM-DD>/<long|shorts>/<en|vi>/<lesson>/   story, voice, timing, audio, scene code
//   final/<YYYY-MM-DD>/<long|shorts>/<en|vi>/<name>.mp4     the finished clip (+ <name>.youtube.json)
//
// <YYYY-MM-DD> is the day the clip was made (Vietnam time), <long|shorts> the requested format
// (9:16 Shorts unless a long video was asked for), <en|vi> the voiceover language. Lesson names
// stay unique across the tree, so every script still takes just the lesson name.
//
// A long video (16:9 YouTube) is split into scenes, one per problem (user's rule, 2026-10-26):
//
//   lessons/<date>/long/<lang>/<lesson>/scenes.json         order + titles of the scenes
//   lessons/<date>/long/<lang>/<lesson>/index.html          stitched preview (plays every scene)
//   lessons/<date>/long/<lang>/<lesson>/<scene>/            voice.json, timing.json, scene.js, audio/,
//                                                           index.html (that scene on its own)
//   final/<date>/long/<lang>/<name>/<scene>.mp4             one MP4 per scene (scene1.mp4, ...)
//   final/<date>/long/<lang>/<name>.mp4                     the scenes joined (npm run final -- --join)
//
// A scene is addressed as "<lesson>/<scene>" (e.g. giai_de/scene2) wherever a lesson name is taken.
//
//   node render/paths.mjs new <lesson> [--lang vi|en] [--format shorts|long] [--date YYYY-MM-DD]
//                                      [--scenes N]
//       -> creates and prints lessons/<date>/<format>/<lang>/<lesson>/ (--scenes N: a long lesson
//          with scene1..sceneN, see render/long.mjs)
//   node render/paths.mjs dir <lesson>     -> prints the lesson's folder
//   node render/paths.mjs list             -> one line per lesson: date format lang name
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LESSONS = 'lessons';
export const FINAL = 'final';
export const FORMATS = ['shorts', 'long'];
export const LANGS = ['vi', 'en'];
export const SCENES = 'scenes.json';
const SCENE_REF = /^([a-z0-9_]+)\/([a-z0-9_]+)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const dirs = (p) => (fs.existsSync(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : []);

// every <root>/<date>/<format>/<lang>/<entry> -> { date, format, lang, name, dir }
function walk(root, entries) {
  const out = [];
  for (const date of dirs(root).filter((d) => DATE.test(d))) {
    for (const format of dirs(path.join(root, date)).filter((f) => FORMATS.includes(f))) {
      for (const lang of dirs(path.join(root, date, format)).filter((l) => LANGS.includes(l))) {
        const at = path.join(root, date, format, lang);
        for (const name of entries(at)) out.push({ date, format, lang, name, dir: path.join(at, name) });
      }
    }
  }
  return out;
}

export function listLessons() {
  return walk(LESSONS, dirs);
}

// the lesson's folder, relative to the repo root; also accepts a path to the folder itself, or
// "<lesson>/<scene>" for one scene of a long lesson
export function lessonDir(lesson) {
  if (!lesson) throw new Error('no lesson given');
  if (lesson.includes('/') && fs.existsSync(lesson)) return path.relative('.', lesson);
  const ref = SCENE_REF.exec(lesson);
  if (ref) {
    const scene = listScenes(ref[1]).find((s) => s.id === ref[2]);
    if (!scene) throw new Error(`scene "${ref[2]}" is not in ${path.join(lessonDir(ref[1]), SCENES)}`);
    return scene.dir;
  }
  const hits = listLessons().filter((l) => l.name === lesson);
  if (hits.length === 1) return hits[0].dir;
  if (!hits.length) throw new Error(`lesson "${lesson}" not found under ${LESSONS}/<date>/<format>/<lang>/ (create it with: node render/paths.mjs new ${lesson})`);
  throw new Error(`lesson "${lesson}" is ambiguous: ${hits.map((h) => h.dir).join(', ')}`);
}

// the scenes of a long lesson, in play order, from its scenes.json: [{ id, title, dir, ref }]
// ([] for a lesson without scenes). scenes.json: { "title", "final"?, "scenes": [{ "id", "title" }] }
export function listScenes(lesson) {
  const dir = lessonDir(lesson);
  const file = path.join(dir, SCENES);
  if (!fs.existsSync(file)) return [];
  const name = path.basename(dir);
  return JSON.parse(fs.readFileSync(file, 'utf8')).scenes.map((s) => {
    if (!/^[a-z0-9_]+$/.test(s.id)) throw new Error(`${file}: scene id must be snake_case, got "${s.id}"`);
    return { ...s, dir: path.join(dir, s.id), ref: `${name}/${s.id}` };
  });
}

// { date, format, lang, name, dir, scene } of a lesson (scene: the scene id for "<lesson>/<scene>")
export function lessonInfo(lesson) {
  const dir = lessonDir(lesson);
  const [, date, format, lang, name, scene] = dir.split(path.sep);
  return { date, format, lang, name, dir, ...(scene ? { scene } : {}) };
}

// final/<date>/<format>/<lang>/<name>.mp4 for a lesson, final/<date>/<format>/<lang>/<name>/<scene>.mp4
// for one scene of a long lesson; date defaults to the lesson's own day
export function finalPath(lesson, { name, date } = {}) {
  const info = lessonInfo(lesson);
  const at = path.join(FINAL, date || info.date, info.format, info.lang);
  return info.scene ? path.join(at, name || info.name, `${info.scene}.mp4`) : path.join(at, `${name || info.name}.mp4`);
}

// newest final/<date>/<format>/<lang>/<name>.mp4, or null
export function latestFinal(name) {
  const hits = walk(FINAL, (at) => (fs.existsSync(path.join(at, `${name}.mp4`)) ? [name] : []));
  return hits.length ? path.join(hits[hits.length - 1].dir + '.mp4') : null;
}

// today in Vietnam time (en-CA formats as YYYY-MM-DD)
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

export function newLessonDir(lesson, { lang = 'vi', format = 'shorts', date = today() } = {}) {
  if (!/^[a-z0-9_]+$/.test(lesson)) throw new Error(`lesson name must be snake_case, got "${lesson}"`);
  if (!LANGS.includes(lang)) throw new Error(`--lang must be ${LANGS.join('|')}, got "${lang}"`);
  if (!FORMATS.includes(format)) throw new Error(`--format must be ${FORMATS.join('|')}, got "${format}"`);
  if (!DATE.test(date)) throw new Error(`--date must be YYYY-MM-DD, got "${date}"`);
  const existing = listLessons().find((l) => l.name === lesson);
  if (existing) throw new Error(`lesson "${lesson}" already exists: ${existing.dir}`);
  const dir = path.join(LESSONS, date, format, lang, lesson);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // own tiny parser: browser.mjs imports this module, so importing it back would deadlock
  const args = { _: [] };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) args[a.slice(2)] = process.argv[++i];
    else args._.push(a);
  }
  const [cmd, lesson] = args._;
  if (cmd === 'new') {
    const dir = newLessonDir(lesson, { lang: args.lang, format: args.format || (args.scenes ? 'long' : undefined), date: args.date });
    // long.mjs imports this module, so it runs as its own process (an import back would deadlock)
    if (args.scenes) execFileSync(process.execPath, [fileURLToPath(new URL('./long.mjs', import.meta.url)), lesson, '--create', String(args.scenes)], { stdio: ['ignore', 'ignore', 'inherit'] });
    console.log(dir);
  }
  else if (cmd === 'dir') console.log(lessonDir(lesson));
  else if (cmd === 'list') for (const l of listLessons()) console.log(`${l.date} ${l.format} ${l.lang} ${l.name}`);
  else console.log('usage: node render/paths.mjs new|dir|list ... (see header)');
}
