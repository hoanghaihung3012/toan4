// Sync check (verification loop 3): every word-anchored window in <lesson folder>/timing.json must
// start within 1 frame of its anchor word in <lesson folder>/audio/cues.json. It also checks that no
// window of a wiped beat starts before the wipe ends (new content must not show over the old board).
//
//   node render/synccheck.mjs <lesson>     (a long lesson: every scene; <lesson>/<scene>: one)
import fs from 'node:fs';
import { lessonDir } from './paths.mjs';
import { perScene } from './long.mjs';

const lesson = process.argv[2];
if (!lesson) throw new Error('usage: node render/synccheck.mjs <lesson>');
if (perScene(lesson, process.argv[1])) process.exit();
const dir = lessonDir(lesson);
const spec = JSON.parse(fs.readFileSync(`${dir}/voice.json`, 'utf8'));
const timing = JSON.parse(fs.readFileSync(`${dir}/timing.json`, 'utf8'));
const cues = JSON.parse(fs.readFileSync(`${dir}/audio/cues.json`, 'utf8'));
const lines = Object.fromEntries(cues.map((l) => [l.id, l]));
const norm = (s) => s.normalize('NFC').toLowerCase().replace(/[.,!?:;]/g, '');
const frame = 1 / spec.fps;

let n = 0, bad = 0;
for (const beat of spec.beats) {
  const tb = timing.beats.find((b) => b.id === beat.id);
  for (const [k, [anchor, , , offset = 0]] of Object.entries(beat.windows)) {
    const m = anchor.match(/^(L\d+)\.(.+?)(?:#(\d+))?(>)?$/);
    if (!m) continue; // beat^ / line start-end anchors are not word cues
    const w = lines[m[1]].words.filter((x) => norm(x.text) === norm(m[2]))[(Number(m[3]) || 1) - 1];
    const want = (m[4] ? w.end : w.start) + offset;
    const got = Math.round(tb.windows[k][0] / frame) * frame; // the frame it shows on
    n++;
    if (Math.abs(got - want) > frame) {
      bad++;
      console.log(`OFF ${beat.id}.${k}: shows at ${got.toFixed(3)}s, word at ${want.toFixed(3)}s`);
    }
  }
}
console.log(`sync: ${n} word-anchored windows, ${bad} off by more than 1 frame`);

let early = 0;
for (const b of timing.beats) {
  if (!b.prev || !b.windows.wipe) continue;
  const wipeEnd = b.windows.wipe[1];
  for (const [k, [s]] of Object.entries(b.windows)) {
    if (k === 'wipe' || s >= wipeEnd - frame) continue;
    early++;
    console.log(`EARLY ${b.id}.${k}: starts ${s.toFixed(3)}s, before the wipe ends at ${wipeEnd.toFixed(3)}s`);
  }
}
console.log(`wipe order: ${early} windows start before their wipe ends`);
process.exitCode = bad || early ? 1 : 0;
