// Review helpers (PNG only, no MP4). Image work runs on a Chrome canvas, so no extra deps.
//
//   node render/inspect.mjs sheet [--every 0.5] [--from 0] [--to <duration>] [--cols 7] [--rows 4]
//                                 [--width 216] [--out out/sheet]
//       -> out/sheet0.png, sheet1.png, ... contact sheets with a time label on each frame
//   node render/inspect.mjs diff <dirA> <dirB>
//       -> per PNG present in both: mean abs difference (0..255) and pixels changed > 12 levels
//
// Options for sheet: --lesson <name>  --timing <path>  --scene <module path>  --chrome <path>
import fs from 'node:fs';
import path from 'node:path';
import { launch, openPlayer, parseArgs, W, H } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];

// run fn(images) inside a blank page; images arrive as data URLs
async function inCanvasPage(browser, fn, payload) {
  const page = await browser.newPage();
  try {
    return await page.evaluate(fn, payload);
  } finally {
    await page.close();
  }
}

// screenshots come back as Uint8Array (puppeteer >= 22), files as Buffer
const dataUrl = (buf) => `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;

async function sheet() {
  const player = await openPlayer({ lesson: args.lesson, timingPath: args.timing, scene: args.scene, chrome: args.chrome });
  const every = Number(args.every || 0.5);
  const from = Number(args.from || 0);
  const to = Number(args.to || player.timing.duration);
  const cols = Number(args.cols || 7);
  const rows = Number(args.rows || 4);
  const tw = Number(args.width || 216);
  const th = Math.round((tw * player.height) / player.width);
  const out = args.out || path.join(player.outDir, 'sheet');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  try {
    const times = [];
    for (let t = from; t < to - 1e-6; t += every) times.push(+t.toFixed(3));
    const perSheet = cols * rows;
    for (let s = 0; s * perSheet < times.length; s++) {
      const chunk = times.slice(s * perSheet, (s + 1) * perSheet);
      const frames = [];
      for (const t of chunk) frames.push({ t, src: dataUrl(await player.shot(t, tw / player.width)) });
      const png = await inCanvasPage(player.browser, async ({ frames, cols, tw, th }) => {
        const label = 22;
        const rowsUsed = Math.ceil(frames.length / cols);
        const c = document.createElement('canvas');
        c.width = cols * tw;
        c.height = rowsUsed * (th + label);
        const g = c.getContext('2d');
        g.fillStyle = '#141414';
        g.fillRect(0, 0, c.width, c.height);
        g.font = '14px sans-serif';
        for (let i = 0; i < frames.length; i++) {
          const img = new Image();
          img.src = frames[i].src;
          await img.decode();
          const x = (i % cols) * tw;
          const y = Math.floor(i / cols) * (th + label);
          g.drawImage(img, x, y + label, tw, th);
          g.fillStyle = '#ff0';
          g.fillText(`${frames[i].t.toFixed(2)}s`, x + 4, y + 16);
        }
        return c.toDataURL('image/png').split(',')[1];
      }, { frames, cols, tw, th });
      const file = `${out}${s}.png`;
      fs.writeFileSync(file, Buffer.from(png, 'base64'));
      console.log('wrote', file, `${chunk[0]}s - ${chunk[chunk.length - 1]}s`);
    }
  } finally {
    await player.close();
  }
}

async function diff() {
  const [, dirA, dirB] = args._;
  if (!dirA || !dirB) throw new Error('usage: inspect.mjs diff <dirA> <dirB>');
  const names = fs.readdirSync(dirA).filter((f) => f.endsWith('.png') && fs.existsSync(path.join(dirB, f))).sort();
  const browser = await launch(args.chrome);
  try {
    for (const name of names) {
      const a = dataUrl(fs.readFileSync(path.join(dirA, name)));
      const b = dataUrl(fs.readFileSync(path.join(dirB, name)));
      const r = await inCanvasPage(browser, async ({ a, b }) => {
        const load = async (src) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const g = c.getContext('2d', { colorSpace: 'srgb' });
          g.drawImage(img, 0, 0);
          return g.getImageData(0, 0, c.width, c.height).data;
        };
        const [da, db] = [await load(a), await load(b)];
        if (da.length !== db.length) return { error: 'size differs' };
        let sum = 0, changed = 0, max = 0;
        for (let i = 0; i < da.length; i += 4) {
          let m = 0;
          for (let k = 0; k < 3; k++) {
            const d = Math.abs(da[i + k] - db[i + k]);
            sum += d;
            if (d > m) m = d;
          }
          if (m > 12) changed++;
          if (m > max) max = m;
        }
        return { mean: sum / ((da.length / 4) * 3), max, changed };
      }, { a, b });
      console.log(r.error ? `${name}: ${r.error}`
        : `${name}: mean ${r.mean.toFixed(3)}  max ${r.max}  px>12: ${r.changed}`);
    }
  } finally {
    await browser.close();
  }
}

if (cmd === 'sheet') await sheet();
else if (cmd === 'diff') await diff();
else console.log('usage: node render/inspect.mjs sheet|diff ... (see header)');
