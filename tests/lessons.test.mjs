import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { openPlayer } from '../render/browser.mjs';

for (const lesson of fs.readdirSync('lessons')) {
  test(`${lesson}: capture, preview, and lesson-local assets`, async () => {
    const player = await openPlayer({ lesson });
    try {
      assert.equal(player.outDir, path.join('lessons', lesson, 'out'));
      const errors = [];
      player.page.on('pageerror', (error) => errors.push(error.message));
      for (const beat of player.timing.beats) {
        assert.equal(await player.page.evaluate((time) => window.renderFrame(time), beat.start), beat.id);
      }
      const previewUrl = new URL(player.page.url());
      assert.equal(previewUrl.pathname, '/shared/web/index.html');
      previewUrl.search = new URLSearchParams({ lesson });
      await player.page.goto(previewUrl.href, { waitUntil: 'networkidle0' });
      await player.page.evaluate(() => window.ready);
      assert.deepEqual(await player.page.evaluate(() => [...document.fonts].map((font) => ({
        family: font.family, status: font.status,
      }))), [
        { family: 'Pangolin', status: 'loaded' },
        { family: '"Baloo 2"', status: 'loaded' },
      ]);
      assert.equal(await player.page.$$eval('#scrub', (elements) => elements.length), 1);
      assert.deepEqual(await player.page.evaluate(() => window.timing), player.timing);
      if (player.timing.audio) {
        const audioUrl = new URL(player.timing.audio, new URL(`/lessons/${lesson}/timing.json`, previewUrl));
        const response = await fetch(audioUrl, { headers: { Range: 'bytes=0-43' } });
        assert.equal(response.status, 206);
        const header = Buffer.from(await response.arrayBuffer());
        assert.equal(header.toString('ascii', 0, 4), 'RIFF');
        assert.equal(header.toString('ascii', 8, 12), 'WAVE');
        const spec = JSON.parse(fs.readFileSync(`lessons/${lesson}/voice.json`, 'utf8'));
        assert.deepEqual(spec.beats.map((beat) => beat.id), player.timing.beats.map((beat) => beat.id));
      }
      assert.deepEqual(errors, []);
    } finally {
      await player.close();
    }
  });
}