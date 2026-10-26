// Publish a lesson's HTML preview (with voiceover) to GitHub Pages, for review on a phone.
// Copies the shared player + the lesson into the gh-pages branch under <lesson>/, rebuilds the
// index page that lists every published lesson, then commits and pushes gh-pages.
//
//   node render/pages.mjs <lesson> [--no-push] [--no-zalo]
//   -> https://<owner>.github.io/<repo>/<lesson>/
// A long lesson (scenes.json) publishes every scene page and the stitched preview: <lesson>/ plays
// all scenes in order, each scene also opens on its own from the chapter list.
//
// After a push it waits until GitHub has deployed that gh-pages commit, then sends the link to the
// Zalo review group once per lesson (render/zalo.mjs; needs ZALO_BOT_TOKEN; record: zalo_sent.json
// on gh-pages). An English lesson sends nothing here: render/youtube.mjs sends one message with
// the preview link and the YouTube Short once the clip is uploaded (user's rule, 2026-10-26).
//
// One-time setup by the repo owner: Settings -> Pages -> Deploy from a branch -> gh-pages, / (root).
// The repo must be public (or on a paid plan) for Pages to serve it.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from './browser.mjs';
import { lessonDir, lessonInfo, listScenes, SCENES } from './paths.mjs';
import { playlistHtml } from './long.mjs';
import { lessonTitle, pagesSite } from './site.mjs';
import { sendZalo } from './zalo.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/pages.mjs <lesson> [--no-push]');
const rel = lessonDir(lesson); // lessons/<date>/<format>/<lang>/<lesson>
const src = path.resolve(rel);
// what gets a voiced timing: the lesson itself, or each scene of a long lesson
const scenes = listScenes(lesson);
const parts = scenes.length ? scenes.map((s) => ({ rel: s.dir, ref: s.ref })) : [{ rel, ref: lesson }];
for (const part of parts) {
  const t = JSON.parse(fs.readFileSync(path.join(part.rel, 'timing.json'), 'utf8'));
  if (!t.audio || t.draft) throw new Error(`${part.ref}: run "npm run voice -- ${part.ref}" first (no voiced timing)`);
}

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const sh = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { stdio: 'inherit' });

// --- 1. a worktree on gh-pages (created as an orphan branch the first time) ---------------------
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-pages-'));
let remote = true;
try { git('fetch', '-q', 'origin', 'gh-pages'); } catch { remote = false; }
if (remote) git('worktree', 'add', '-B', 'gh-pages', work, 'origin/gh-pages');
else git('worktree', 'add', '--orphan', '-B', 'gh-pages', work);

try {
  const published = fs.readdirSync(work, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(work, d.name, 'index.html'))).map((d) => d.name);

  // --- 2. the lesson: shared player, fonts, lesson code, timing, voice as MP3 -------------------
  const out = path.join(work, lesson);
  fs.rmSync(out, { recursive: true, force: true });
  // the lesson keeps its lessons/<date>/<format>/<lang>/<lesson>/ path inside the page, so its
  // relative imports of shared/web and of other lessons resolve as they do in the repo
  fs.mkdirSync(path.join(out, rel), { recursive: true });
  fs.cpSync('shared/web', path.join(out, 'shared/web'), { recursive: true });
  fs.cpSync('shared/fonts', path.join(out, 'shared/fonts'), { recursive: true });
  // the lesson's .js files, plus those of any lesson they import (a language variant such as
  // day_so_tiep_theo_en imports the scenes of day_so_tiep_theo)
  const copied = new Set();
  const copyLesson = (dir) => {
    if (copied.has(dir)) return;
    copied.add(dir);
    fs.mkdirSync(path.join(out, dir), { recursive: true });
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
      fs.copyFileSync(path.join(dir, f), path.join(out, dir, f));
      for (const [, spec] of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/from\s+'(\.\.?\/[^']+)'/g)) {
        const dep = path.relative('.', path.resolve(dir, spec));
        if (dep.split(path.sep)[0] === 'lessons') copyLesson(path.dirname(dep));
      }
    }
  };
  copyLesson(rel);
  for (const part of parts) {
    copyLesson(part.rel);
    // MP3 keeps the page light on a phone; the player reads timing.audio relative to timing.json
    const timing = JSON.parse(fs.readFileSync(path.join(part.rel, 'timing.json'), 'utf8'));
    const dst = path.join(out, part.rel);
    fs.mkdirSync(path.join(dst, 'audio'), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(part.rel, timing.audio),
      '-c:a', 'libmp3lame', '-b:a', '160k', path.join(dst, 'audio/voice.mp3')]);
    fs.writeFileSync(path.join(dst, 'timing.json'),
      `${JSON.stringify({ ...timing, audio: './audio/voice.mp3' }, null, 1)}\n`);
    // a scene's own page (generated by render/long.mjs) loads the shared player by relative path
    if (scenes.length) fs.copyFileSync(path.join(part.rel, 'index.html'), path.join(dst, 'index.html'));
  }
  if (scenes.length) fs.copyFileSync(path.join(rel, SCENES), path.join(out, rel, SCENES));

  // the player defaults to /lessons/<name>/timing.json from the site root (redirected by serve.mjs);
  // Pages serves under /<repo>/<lesson>/ with no redirect, so point it at the lesson's real path
  const player = path.join(out, 'shared/web/js/player.js');
  const code = fs.readFileSync(player, 'utf8');
  const def = /`\/lessons\/\$\{encodeURIComponent\(lesson\)\}\/timing\.json`/;
  if (!def.test(code)) throw new Error('player.js: default timing URL changed, update render/pages.mjs');
  fs.writeFileSync(player, code.replace(def, `'${rel.split(path.sep).join('/')}/timing.json'`));

  const title = lessonTitle(lesson);
  const lang = scenes.length ? lessonInfo(lesson).lang
    : JSON.parse(fs.readFileSync(path.join(src, 'voice.json'), 'utf8')).lang || 'vi';
  const page = scenes.length
    ? playlistHtml({ root: '', scenes: `${rel.split(path.sep).join('/')}/${SCENES}`, title, lang })
    : fs.readFileSync('shared/web/index.html', 'utf8')
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace(/(href|src)="(css|js)\//g, '$1="shared/web/$2/')
    .replace('</head>', '  <style>#controls{display:flex;gap:10px;align-items:center;padding:8px 16px}'
      + '#controls button{font-size:18px;min-width:44px;min-height:36px}#controls input{flex:1;min-width:0}</style>\n</head>');
  fs.writeFileSync(path.join(out, 'index.html'), page);
  fs.writeFileSync(path.join(out, 'title.txt'), `${title}\n`);

  // --- 3. the index of every published lesson --------------------------------------------------
  const items = fs.readdirSync(work, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(work, d.name, 'index.html')))
    .map((d) => {
      const t = fs.existsSync(path.join(work, d.name, 'title.txt'))
        ? fs.readFileSync(path.join(work, d.name, 'title.txt'), 'utf8').trim() : d.name;
      return `  <li><a href="${d.name}/">${t}</a></li>`;
    }).sort();
  fs.writeFileSync(path.join(work, 'index.html'), `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bản xem trước bài giảng</title>
<style>
  :root { --bg: #1d3b30; --fg: #f1efe6; --link: #f2d36b; color-scheme: dark; }
  body { background: var(--bg); color: var(--fg); font: 18px/1.6 system-ui, sans-serif; margin: 0;
    padding-block: 32px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  a { color: var(--link); }
</style>
</head>
<body>
<h1>Bản xem trước bài giảng</h1>
<ul>
${items.join('\n')}
</ul>
</body>
</html>
`);
  fs.writeFileSync(path.join(work, '.nojekyll'), '');

  // --- 4. commit + push --------------------------------------------------------------------------
  // lessons already announced on Zalo (once per clip, user's rule 2026-10-25); seeded with every
  // lesson published before the record existed, since those links went out already
  const sentFile = path.join(work, 'zalo_sent.json');
  const sent = fs.existsSync(sentFile) ? JSON.parse(fs.readFileSync(sentFile, 'utf8'))
    : Object.fromEntries(published.map((d) => [d, 'before-record']));
  fs.writeFileSync(sentFile, `${JSON.stringify(sent, null, 1)}\n`);
  sh(work, 'add', '-A');
  const changed = execFileSync('git', ['-C', work, 'status', '--porcelain'], { encoding: 'utf8' }).trim();
  if (changed) {
    sh(work, 'commit', '-q', '-m', `Publish HTML preview: ${lesson}`);
    if (!args['no-push']) sh(work, 'push', '-q', '-u', 'origin', 'gh-pages');
  }
  const site = pagesSite(lesson);
  const url = site ? site.url : `<pages site>/${lesson}/`;
  console.log(changed ? `published ${lesson}: ${url}` : `no change for ${lesson}: ${url}`);

  // --- 5. Zalo: only once Pages serves this commit, and only once per lesson ----------------------
  if (!args['no-push'] && !args['no-zalo']) {
    if (lang === 'en') console.log('zalo: not sent here (English: npm run final sends the preview and the Short in one message)');
    else if (sent[lesson]) console.log(`zalo: not sent (already sent for ${lesson} on ${sent[lesson]})`);
    else if (!site) console.log('zalo: not sent (no GitHub remote to check Pages)');
    else {
      const sha = execFileSync('git', ['-C', work, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
      const live = await waitForPages(site.repo, sha);
      if (!live.ok) console.log(`zalo: not sent (${live.reason})`);
      else {
        const r = sendZalo(`Bản xem trước: ${title}\n${url}`);
        console.log(r.ok ? 'zalo: link sent to the review group' : `zalo: not sent (${r.reason})`);
        if (r.ok) {
          sent[lesson] = new Date().toISOString();
          fs.writeFileSync(sentFile, `${JSON.stringify(sent, null, 1)}\n`);
          sh(work, 'commit', '-q', '-m', `Record Zalo link sent: ${lesson}`, '--', 'zalo_sent.json');
          sh(work, 'push', '-q', 'origin', 'gh-pages');
        }
      }
    }
  }
} finally {
  git('worktree', 'remove', '--force', work);
}

// GitHub's own "pages build and deployment" run for the pushed gh-pages commit (*.github.io itself
// is not reachable from the cloud sessions). -> { ok } once it succeeded, { ok: false, reason } else
async function waitForPages(repo, sha, { timeoutS = 600, everyS = 10 } = {}) {
  const query = `repos/${repo}/actions/runs?branch=gh-pages&head_sha=${sha}`;
  const get = () => {
    try {
      return JSON.parse(execFileSync('gh', ['api', query], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    } catch {
      return JSON.parse(execFileSync('curl', ['-sS', '--max-time', '20', `https://api.github.com/${query}`], { encoding: 'utf8' }));
    }
  };
  for (let waited = 0; waited <= timeoutS; waited += everyS) {
    try {
      const run = (get().workflow_runs || []).find((r) => r.name === 'pages build and deployment');
      if (run?.status === 'completed') {
        return run.conclusion === 'success' ? { ok: true } : { ok: false, reason: `Pages build ${run.conclusion}` };
      }
    } catch (e) {
      if (waited + everyS > timeoutS) return { ok: false, reason: `cannot check Pages: ${String(e.message).slice(0, 120)}` };
    }
    process.stdout.write(`\rwaiting for GitHub Pages to go live… ${waited}s`);
    await new Promise((r) => setTimeout(r, everyS * 1000));
  }
  return { ok: false, reason: `Pages not live after ${timeoutS}s` };
}
