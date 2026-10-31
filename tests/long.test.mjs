// Long lessons (16:9): one scene per problem, each its own page and MP4, and a stitched preview
// that plays the scene pages in order. Runs on a throwaway project in a temp folder.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'long-lesson-'));
fs.symlinkSync(path.join(REPO, 'shared'), path.join(tmp, 'shared'));
const repoCwd = process.cwd();
process.chdir(tmp); // paths.mjs resolves lessons/ and final/ from the working folder
const { finalPath, latestFinal, lessonDir, lessonInfo, listScenes } = await import('../render/paths.mjs');
const { createScenes, perScene } = await import('../render/long.mjs');
const { newLessonDir } = await import('../render/paths.mjs');

const dir = newLessonDir('demo_long', { format: 'long', date: '2026-01-02' });
createScenes('demo_long', 2);
// draft timings (no TTS needed)
for (const s of listScenes('demo_long')) {
  execFileSync(process.execPath, [path.join(REPO, 'render/voice.mjs'), s.ref, '--estimate'], { stdio: 'pipe' });
}
test.after(() => {
  process.chdir(repoCwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('a long lesson has one folder, one page and one MP4 path per scene', () => {
  assert.equal(dir, path.join('lessons', '2026-01-02', 'long', 'vi', 'demo_long'));
  assert.deepEqual(listScenes('demo_long').map((s) => [s.id, s.ref]),
    [['scene1', 'demo_long/scene1'], ['scene2', 'demo_long/scene2']]);
  assert.equal(lessonDir('demo_long/scene2'), path.join(dir, 'scene2'));
  assert.equal(lessonInfo('demo_long/scene2').scene, 'scene2');
  assert.equal(finalPath('demo_long/scene2'), path.join('final', '2026-01-02', 'long', 'vi', 'demo_long', 'scene2.mp4'));
  assert.equal(finalPath('demo_long'), path.join('final', '2026-01-02', 'long', 'vi', 'demo_long', 'demo_long.mp4'));
  fs.mkdirSync(path.dirname(finalPath('demo_long')), { recursive: true });
  fs.writeFileSync(finalPath('demo_long'), 'joined');
  assert.equal(latestFinal('demo_long'), finalPath('demo_long'));
  assert.throws(() => lessonDir('demo_long/scene9'), /not in/);
  for (const s of listScenes('demo_long')) {
    for (const f of ['voice.json', 'scene.js', 'timing.json', 'index.html']) assert.ok(fs.existsSync(path.join(s.dir, f)), `${s.ref}/${f}`);
    const voice = JSON.parse(fs.readFileSync(path.join(s.dir, 'voice.json'), 'utf8'));
    assert.equal(voice.profile, 'landscape');
  }
  // scene 2 opens by wiping scene 1's last board
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'scene2/timing.json'), 'utf8')).beats[0].prev, 'from_prev');
  assert.match(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), /data-scenes="\.\/scenes\.json"/);
  assert.equal(perScene('demo_long/scene1', 'x'), false);
});

test('scene pages and the stitched preview play in the browser', async () => {
  const { startServer } = await import('../render/serve.mjs');
  const { launch } = await import('../render/browser.mjs');
  const server = await startServer(0, tmp);
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;

    // one scene on its own page, with the usual controls
    await page.goto(`${base}/${dir}/scene2/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => window.ready);
    assert.equal(await page.evaluate(() => window.timing.profile), 'landscape');
    assert.equal(await page.$$eval('#scrub', (e) => e.length), 1);

    // the stitched preview: both scenes on one timeline, seeking crosses into scene 2
    await page.goto(`${base}/lessons/demo_long/`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.playlist);
    const durations = listScenes('demo_long').map((s) => JSON.parse(fs.readFileSync(path.join(s.dir, 'timing.json'), 'utf8')).duration);
    const { total, starts } = await page.evaluate(() => ({ total: window.playlist.total, starts: window.playlist.scenes.map((s) => s.start) }));
    assert.ok(Math.abs(total - (durations[0] + durations[1])) < 1e-9);
    assert.deepEqual(starts, [0, durations[0]]);
    await page.evaluate((t) => window.playlist.seek(t), durations[0] + 0.1);
    assert.deepEqual(await page.$$eval('#screen iframe', (f) => f.map((x) => x.classList.contains('on'))), [false, true]);
    assert.match(await page.$eval('#now', (e) => e.textContent), /^Bài 2 · beat1$/);
    assert.equal(await page.$$eval('#chapters li', (e) => e.length), 2);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    server.close();
  }
});
