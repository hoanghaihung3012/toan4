// Bring every lesson already on GitHub Pages up to the current page shell (layout, controls, fit to
// the window: shared/web/index.html, css/board.css, js/fit.js) without touching what it draws: its
// scene code, timing, audio and the rest of its shared/web copy stay as published. Run it once after
// a change to the page shell; `npm run pages` already publishes new lessons with the current one.
//
//   node render/pages_shell.mjs [--no-push]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from './browser.mjs';
import { pageShell } from './site.mjs';

const args = parseArgs(process.argv.slice(2));
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const sh = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { stdio: 'inherit' });

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-pages-'));
git('fetch', '-q', 'origin', 'gh-pages');
git('worktree', 'add', '-B', 'gh-pages', work, 'origin/gh-pages');
try {
  const published = fs.readdirSync(work, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(work, d.name, 'index.html'))).map((d) => d.name);
  for (const d of published) refreshShell(path.join(work, d));
  sh(work, 'add', '-A');
  if (execFileSync('git', ['-C', work, 'status', '--porcelain'], { encoding: 'utf8' }).trim()) {
    sh(work, 'commit', '-q', '-m', `Refresh preview page shell: ${published.length} lessons`);
    if (!args['no-push']) sh(work, 'push', '-q', '-u', 'origin', 'gh-pages');
  }
  console.log(`refreshed the page shell of ${published.length} lessons`);
} finally {
  git('worktree', 'remove', '--force', work);
}

function refreshShell(dir) {
  for (const f of ['css/board.css', 'js/fit.js']) fs.copyFileSync(`shared/web/${f}`, path.join(dir, 'shared/web', f));
  // a long lesson's top page is the stitched preview (data-scenes): it has its own playlist.css
  if (fs.existsSync(path.join(dir, 'shared/web/css/playlist.css'))) {
    fs.copyFileSync('shared/web/css/playlist.css', path.join(dir, 'shared/web/css/playlist.css'));
  }
  for (const page of htmlPages(dir)) {
    const old = fs.readFileSync(page, 'utf8');
    if (page === path.join(dir, 'index.html') && !/data-(scenes|timing)=/.test(old)) {
      // a plain lesson: regenerate its page from the current shell
      const lang = old.match(/<html lang="([^"]*)">/)?.[1] || 'vi';
      const title = old.match(/<title>(.*)<\/title>/)?.[1] || path.basename(dir);
      fs.writeFileSync(page, pageShell(lang, title));
    } else if (old.includes('<div id="stage"></div>') && !old.includes('id="view"')) {
      // a scene page of a long lesson (render/long.mjs): wrap the stage the same way
      fs.writeFileSync(page, old.replace('<div id="stage"></div>', '<div id="view"><div id="stage"></div></div>')
        .replace('initial-scale=1">', 'initial-scale=1, viewport-fit=cover">'));
    }
  }
  const player = path.join(dir, 'shared/web/js/player.js');
  let code = fs.readFileSync(player, 'utf8');
  if (code.includes("from './fit.js'")) return;
  const fit = /  const fit = \(\) => \{\n[^]*?\n  \};\n  fit\(\);\n  addEventListener\('resize', fit\);\n/g;
  const fitNow = "  fitStage(stage, document.getElementById('view'), THEME.canvas.width, THEME.canvas.height);\n";
  if (!fit.test(code)) throw new Error(`${dir}: player.js has an unknown fit, update render/pages_shell.mjs`);
  code = code.replace(fit, fitNow)
    .replace(/(import \{[^}]*\} from '\.\/eraser\.js';\n)/, "$1import { fitStage } from './fit.js';\n");
  if (!code.includes("from './fit.js'")) throw new Error(`${dir}: player.js imports changed, update render/pages_shell.mjs`);
  fs.writeFileSync(player, code);
}

function htmlPages(dir) {
  return fs.readdirSync(dir, { recursive: true }).filter((f) => f.endsWith('.html'))
    .filter((f) => !f.startsWith(`shared${path.sep}`)).map((f) => path.join(dir, f));
}
