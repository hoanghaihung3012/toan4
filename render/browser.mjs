// Shared headless-Chrome setup: serves the project, opens the player in capture mode and
// returns shot(t) -> PNG buffer. Used by capture.mjs and inspect.mjs.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { startServer } from './serve.mjs';
import { lessonDir } from './paths.mjs';
import { THEME } from '../shared/web/theme.js';
import { canvasFor } from '../shared/web/profiles.js';

// macOS Chrome by default; CHROME_PATH overrides it (e.g. Linux cloud sessions)
export const CHROME_DEFAULT = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const { width: W, height: H } = THEME.canvas;

// --key value / --flag -> { key: value | true }
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) { out[a.slice(2)] = next; i++; } else out[a.slice(2)] = true;
  }
  return out;
}

export async function launch(chrome = CHROME_DEFAULT) {
  return puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none',
      // Chrome refuses to start as root (containers) unless the sandbox is off
      ...(process.getuid?.() === 0 ? ['--no-sandbox'] : [])],
  });
}

export async function openPlayer({ lesson = 'decimal', timingPath, scene, chrome } = {}) {
  timingPath ||= path.join(lessonDir(lesson), 'timing.json');
  const timing = JSON.parse(fs.readFileSync(timingPath, 'utf8'));
  const { width, height } = canvasFor(timing.profile);
  const server = await startServer(0);
  const browser = await launch(chrome);
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'assert') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  const q = new URLSearchParams({ capture: '1', timing: `/${timingPath}` });
  if (scene) q.set('scene', scene); // otherwise timing.json's "scene"
  await page.goto(`http://127.0.0.1:${server.address().port}/shared/web/index.html?${q}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.ready);
  // scale < 1 returns a downscaled frame (contact sheets)
  const shot = async (t, scale = 1) => {
    await page.evaluate((tt) => window.renderFrame(tt), t);
    return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height, scale }, optimizeForSpeed: true });
  };
  const close = async () => { await browser.close(); server.close(); };
  const outDir = path.join(path.dirname(timingPath), 'out');
  return { timing, outDir, width, height, fps: timing.fps || THEME.canvas.fps, browser, page, shot, close };
}
