// Voiceover -> audio + timing. Reads <lesson folder>/voice.json, synthesises every line
// with Edge TTS (render/tts_words.py, cached per line), lays the lines out on one timeline,
// resolves each animation window from its word anchor and writes:
//   <lesson folder>/audio/voice.wav   48 kHz stereo mix, loudness-normalised, peaks < -1 dBFS
//   <lesson folder>/audio/cues.json   every word with its absolute time (for the sync check)
//   <lesson folder>/timing.json       what the player reads
//
//   node render/voice.mjs trung_binh_cong [--force]
//   node render/voice.mjs giai_de/scene2              one scene of a long lesson; the lesson name alone
//                                                     builds every scene (each its own audio + timing)
//   node render/voice.mjs trung_binh_cong --estimate   (no TTS: guessed word times, draft timing,
//                                                       no audio; for building scenes offline only)
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './browser.mjs';
import { lessonDir } from './paths.mjs';
import { perScene } from './long.mjs';
import { generateSfx } from './sfx.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/voice.mjs <lesson> [--force]');
if (perScene(lesson, process.argv[1], process.argv.slice(3))) process.exit();
const dir = lessonDir(lesson);
const spec = JSON.parse(fs.readFileSync(`${dir}/voice.json`, 'utf8'));
const outDir = `${dir}/audio`;
const lineDir = path.join(outDir, 'lines');
fs.mkdirSync(lineDir, { recursive: true });
const PY = '.venv/bin/python';

// --- 1. synthesise each line (cached by voice + rate + text) -----------------------
// rough word times (~0.3 s per syllable, longer after punctuation) when TTS is unreachable
function estimate(line) {
  let t = 0;
  const words = line.text.split(/\s+/).map((w) => {
    const d = 0.3 * Math.max(1, (w.match(/\d/g) || []).length) ;
    const out = { text: w.replace(/[.,!?:;]+$/, ''), start: t, end: t + d };
    t += d + (/[.,!?:;]$/.test(w) ? 0.25 : 0.04);
    return out;
  });
  return { mp3: null, words };
}

function synth(line) {
  if (args.estimate) return estimate(line);
  const key = crypto.createHash('sha1').update(`${spec.voice}|${spec.rate}|${line.text}`).digest('hex').slice(0, 10);
  const mp3 = path.join(lineDir, `${line.id}.mp3`);
  const words = path.join(lineDir, `${line.id}.json`);
  const stamp = path.join(lineDir, `${line.id}.key`);
  const cached = fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === key;
  if (!cached || args.force) {
    // the free endpoint sometimes returns no audio: retry a few times
    for (let k = 1; ; k++) {
      try {
        execFileSync(PY, ['render/tts_words.py', spec.voice, spec.rate, line.text, mp3, words], { stdio: 'pipe' });
        break;
      } catch (e) {
        if (k >= 4) throw e;
        console.log(`tts ${line.id}: retry ${k}`);
        execFileSync('sleep', [String(k * 2)]);
      }
    }
    fs.writeFileSync(stamp, key);
    console.log('tts', line.id, line.text);
  }
  return { mp3, words: JSON.parse(fs.readFileSync(words, 'utf8')) };
}

// --- 2. lay the lines out --------------------------------------------------------------
const norm = (s) => s.normalize('NFC').toLowerCase().replace(/[.,!?:;]/g, '');
let cursor = 0;
const lines = {};
const effects = [];
const timing = {
  _note: `Built from the voiceover by render/voice.mjs (${dir}/voice.json). Do not edit by hand.`,
  draft: !!args.estimate, scene: './scene.js', fps: spec.fps, duration: 0,
  ...(spec.profile ? { profile: spec.profile } : {}),
  ...(args.estimate ? {} : { audio: './audio/voice.wav' }), beats: [],
};

for (const beat of spec.beats) {
  const start = cursor;
  let t = start + (beat.lead ?? 0.5);
  beat.lines.forEach((line, i) => {
    if (i > 0) t += line.gap ?? spec.gap;
    const { mp3, words } = synth(line);
    if (!words.length) throw new Error(`no word timings for ${line.id}`);
    const abs = words.map((w) => ({ ...w, start: t + w.start, end: t + w.end }));
    lines[line.id] = { id: line.id, at: t, mp3, words: abs, start: abs[0].start, end: abs[abs.length - 1].end };
    t = lines[line.id].end;
  });

  const resolve = (a) => {
    if (a === 'beat^') return start;
    const m = a.match(/^(L\d+)(?:([\^$])|\.(.+?)(?:#(\d+))?(>)?)$/);
    if (!m) throw new Error(`bad anchor ${a}`);
    const L = lines[m[1]];
    if (!L) throw new Error(`unknown line in ${a}`);
    if (m[2] === '^') return L.start;
    if (m[2] === '$') return L.end;
    const hits = L.words.filter((w) => norm(w.text) === norm(m[3]));
    const w = hits[(Number(m[4]) || 1) - 1];
    if (!w) throw new Error(`word "${m[3]}" not found in ${m[1]}: ${L.words.map((x) => x.text).join(' ')}`);
    return m[5] ? w.end : w.start;
  };

  const windows = {};
  let lastEnd = t;
  for (const [k, [anchor, dur, ease = 'out', offset = 0]] of Object.entries(beat.windows)) {
    const s = resolve(anchor) + offset;
    const e = typeof dur === 'string' ? resolve(dur) : s + dur;
    const r = (x) => Math.round(x * 1000) / 1000;
    windows[k] = ease === 'out' ? [r(s), r(e)] : [r(s), r(e), ease];
    lastEnd = Math.max(lastEnd, e);
  }
  for (const sound of beat.sounds || []) {
    const file = path.join(outDir, 'sfx', `${beat.id}_${sound.id}.wav`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    generateSfx(file, sound.preset);
    effects.push({ id: `${beat.id}_${sound.id}`, file, at: Math.max(0, resolve(sound.at || 'beat^') + (sound.offset || 0)) });
  }
  const end = Math.round(Math.max(t + (beat.tail ?? 0.6), lastEnd + 0.3) * spec.fps) / spec.fps;
  const b = { id: beat.id, start: Math.round(start * 1000) / 1000, end: Math.round(end * 1000) / 1000 };
  if (beat.prev) b.prev = beat.prev;
  b.windows = windows;
  timing.beats.push(b);
  cursor = end;
}
timing.duration = Math.round(cursor * 1000) / 1000;
fs.writeFileSync(`${dir}/timing.json`, `${JSON.stringify(timing, null, 1)}\n`);
fs.writeFileSync(path.join(outDir, 'cues.json'), `${JSON.stringify(Object.values(lines).map(
  ({ id, start, end, words }) => ({ id, start, end, words })), null, 1)}\n`);

if (args.estimate) {
  console.log(`estimate: wrote draft ${dir}/timing.json (${timing.duration}s), no audio`);
  process.exit(0);
}

// --- 3. mix: every line at its time, stereo 48 kHz, loudness -16 LUFS, true peak -1.5 dB --
const order = Object.values(lines);
const tracks = [
  ...order.map((line) => ({ file: line.mp3, at: line.at })),
  ...effects.map((effect) => ({ file: effect.file, at: effect.at })),
];
const inputs = tracks.flatMap((track) => ['-i', track.file]);
const delays = tracks.map((track, i) => `[${i}]adelay=${Math.round(track.at * 1000)}:all=1[a${i}]`).join(';');
const mix = `${delays};${tracks.map((_, i) => `[a${i}]`).join('')}amix=inputs=${tracks.length}:normalize=0,`
  + `aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${timing.duration},`
  + 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', mix, '-map', '[out]',
  '-c:a', 'pcm_s16le', path.join(outDir, 'voice.wav')], { stdio: 'inherit' });
console.log(`wrote ${dir}/timing.json, ${outDir}/voice.wav (${timing.duration}s, ${order.length} lines)`);
