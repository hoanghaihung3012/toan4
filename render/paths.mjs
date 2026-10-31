// Lesson sources live in lessons/<date>/<lesson>/; final files live in final/<date>/<name>/.
// Dates use Vietnam time. Lesson names stay unique across the tree, so every script takes a name.
// Scene paths are addressed as "<lesson>/<scene>" where a lesson name is accepted.
//
//   node render/paths.mjs new <lesson> [--date YYYY-MM-DD] [--scenes N]
//       -> creates lessons/<date>/<lesson>/ (--scenes N creates scene folders)
//   node render/paths.mjs dir <lesson>     -> prints the lesson's folder
//   node render/paths.mjs list             -> one line per lesson: date name
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LESSONS = 'lessons';
export const FINAL = 'final';
export const SCENES = 'scenes.json';
const SCENE_REF = /^([a-z0-9_]+)\/([a-z0-9_]+)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const dirs = (p) => (fs.existsSync(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : []);

// every <root>/<date>/<entry> -> { date, name, dir }
function walk(root, entries) {
  const out = [];
  for (const date of dirs(root).filter((d) => DATE.test(d))) {
    const at = path.join(root, date);
    for (const name of entries(at)) out.push({ date, name, dir: path.join(at, name) });
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
  if (!hits.length) throw new Error(`lesson "${lesson}" not found under ${LESSONS}/<date>/ (create it with: node render/paths.mjs new ${lesson})`);
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

// { date, name, dir, scene } of a lesson (scene: the scene id for "<lesson>/<scene>")
export function lessonInfo(lesson) {
  const dir = lessonDir(lesson);
  const [, date, name, scene] = dir.split(path.sep);
  return { date, name, dir, ...(scene ? { scene } : {}) };
}

// final/<date>/<name>/<name>.mp4 for a clip, or <scene>.mp4 for one scene.
export function finalPath(lesson, { name, date } = {}) {
  const info = lessonInfo(lesson);
  const clip = name || info.name;
  return path.join(FINAL, date || info.date, clip, `${info.scene || clip}.mp4`);
}

// newest grouped final clip
export function latestFinal(name) {
  const hits = dirs(FINAL).filter((date) => DATE.test(date))
    .map((date) => path.join(FINAL, date, name, `${name}.mp4`))
    .filter((file) => fs.existsSync(file));
  if (!hits.length) return null;
  return hits[hits.length - 1];
}

// today in Vietnam time (en-CA formats as YYYY-MM-DD)
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

export function newLessonDir(lesson, { date = today() } = {}) {
  if (!/^[a-z0-9_]+$/.test(lesson)) throw new Error(`lesson name must be snake_case, got "${lesson}"`);
  if (!DATE.test(date)) throw new Error(`--date must be YYYY-MM-DD, got "${date}"`);
  const existing = listLessons().find((l) => l.name === lesson);
  if (existing) throw new Error(`lesson "${lesson}" already exists: ${existing.dir}`);
  const dir = path.join(LESSONS, date, lesson);
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
    if (args.lang || args.format) throw new Error('--lang and --format are no longer directory options');
    const dir = newLessonDir(lesson, { date: args.date });
    // long.mjs imports this module, so it runs as its own process (an import back would deadlock)
    if (args.scenes) execFileSync(process.execPath, [fileURLToPath(new URL('./long.mjs', import.meta.url)), lesson, '--create', String(args.scenes)], { stdio: ['ignore', 'ignore', 'inherit'] });
    console.log(dir);
  }
  else if (cmd === 'dir') console.log(lessonDir(lesson));
  else if (cmd === 'list') for (const l of listLessons()) console.log(`${l.date} ${l.name}`);
  else console.log('usage: node render/paths.mjs new|dir|list ... (see header)');
}
