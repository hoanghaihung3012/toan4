// Render the HTML animation frame by frame in headless Chrome and pipe PNGs into ffmpeg.
// Final export only: during review, watch it in the browser preview instead.
//
//   node render/capture.mjs                         -> out/video.mp4 (whole timeline)
//   node render/capture.mjs --out out/a.mp4 --from 6 --to 12
//   node render/capture.mjs --stills 5.9,11.9 --dir out/stills   (PNG at given times)
//   node render/capture.mjs --keyposes --dir out/html_keyposes   (frame before each beat end)
//
// Options: --timing timing/timing.json  --scene <module>  --chrome <path>  --crf 18  --fps 30
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { openPlayer, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const player = await openPlayer({ timingPath: args.timing, scene: args.scene, chrome: args.chrome });
const { timing, shot } = player;
const fps = Number(args.fps || player.fps);

async function stills(times, dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, t] of times) {
    fs.writeFileSync(path.join(dir, `${name}.png`), await shot(t));
    console.log('wrote', path.join(dir, `${name}.png`), `t=${t.toFixed(3)}`);
  }
}

try {
  if (args.keyposes) {
    // the last frame of each beat (before the eraser) must equal the approved key pose
    const times = timing.beats.map((b) => [b.id, Math.round(b.end * fps - 1) / fps]);
    await stills(times, args.dir || 'out/html_keyposes');
  } else if (args.stills) {
    const times = String(args.stills).split(',').map((s) => [`t${Number(s).toFixed(2)}`, Number(s)]);
    await stills(times, args.dir || 'out/stills');
  } else {
    const out = args.out || 'out/video.mp4';
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const f0 = Math.round(Number(args.from || 0) * fps);
    const f1 = Math.round(Number(args.to || timing.duration) * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
      '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', String(args.crf || 18),
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = f0; f < f1; f++) {
      const buf = await shot(f / fps);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if ((f - f0) % fps === 0) process.stdout.write(`\rframe ${f - f0 + 1}/${f1 - f0}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    console.log(`\nwrote ${out} (${f1 - f0} frames @ ${fps} fps)`);
  }
} finally {
  await player.close();
}
