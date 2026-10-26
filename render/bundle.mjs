// One self-contained HTML preview of a lesson (player + scene + timing + fonts + voiceover
// inlined), for sharing the preview as a single page. Same player as `npm run preview`.
//
//   node render/bundle.mjs <lesson> [--out <lesson folder>/out/preview.html]
import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import { parseArgs } from './browser.mjs';
import { lessonDir } from './paths.mjs';
import { THEME } from '../shared/web/theme.js';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/bundle.mjs <lesson> [--out file]');
const dir = path.resolve(lessonDir(lesson));
const timing = JSON.parse(fs.readFileSync(path.join(dir, 'timing.json'), 'utf8'));
const b64 = (f) => fs.readFileSync(f).toString('base64');
if (timing.audio) timing.audio = `data:audio/wav;base64,${b64(path.join(dir, timing.audio))}`;
const fonts = Object.fromEntries(Object.values(THEME.fonts).map((f) => [f.file,
  `data:font/ttf;base64,${b64(path.resolve('shared/fonts', f.file))}`]));

// the player loads timing, scene and fonts by URL; point those at the inlined copies
const inline = {
  name: 'inline-lesson',
  setup(build) {
    build.onResolve({ filter: /^lesson-scene$/ }, () => ({ path: path.join(dir, timing.scene || './scene.js') }));
    build.onLoad({ filter: /shared[\\/]web[\\/]js[\\/](player|theme_apply)\.js$/ }, (a) => {
      let s = fs.readFileSync(a.path, 'utf8');
      s = s.replace('await fetch(timingUrl)', '({ json: async () => window.__TIMING__, url: location.href })')
        .replace('await import(sceneUrl)', "await import('lesson-scene')")
        .replace(/const FONT_DIR = .*\n/, '')
        .replace('new URL(f.file, FONT_DIR)', 'window.__FONTS__[f.file]');
      return { contents: s, loader: 'js' };
    });
  },
};
const out = await esbuild.build({
  entryPoints: ['shared/web/js/player.js'], bundle: true, format: 'esm', write: false, plugins: [inline],
});
const js = out.outputFiles[0].text;
const css = fs.readFileSync('shared/web/css/board.css', 'utf8');
const body = fs.readFileSync('shared/web/index.html', 'utf8').match(/<body>([\s\S]*?)<script/)[1];
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${lesson}</title>
<style>${css}</style></head><body>${body}
<script>window.__TIMING__=${JSON.stringify(timing)};window.__FONTS__=${JSON.stringify(fonts)};</script>
<script type="module">${js.replace(/<\/script/g, '<\\/script')}</script></body></html>`;
const file = args.out || path.join(dir, 'out', 'preview.html');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, html);
console.log(`wrote ${file} (${(html.length / 1e6).toFixed(1)} MB)`);
