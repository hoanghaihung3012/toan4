import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { listLessons } from '../render/paths.mjs';
import { buildMetadata, publishShort } from '../render/youtube.mjs';

const all = listLessons().filter((l) => fs.existsSync(`${l.dir}/voice.json`) && fs.existsSync(`${l.dir}/story.md`));
const lessons = all.map((l) => l.name);
const english = all.filter((l) => JSON.parse(fs.readFileSync(`${l.dir}/voice.json`, 'utf8')).lang === 'en').map((l) => l.name);

for (const lesson of english) {
  test(`${lesson}: YouTube Short metadata fits the API limits`, () => {
    const meta = buildMetadata(lesson);
    assert.ok(meta.title.length <= 100, `title too long: ${meta.title.length}`);
    assert.match(meta.title, /#Shorts$/);
    assert.doesNotMatch(meta.title, /bản tiếng Anh|[<>]/);
    assert.ok(Buffer.byteLength(meta.description) <= 5000);
    assert.doesNotMatch(meta.description, /[<>]/);
    assert.ok(meta.tags.join(',').length <= 500);
    assert.equal(meta.lang, 'en');
    assert.equal(meta.playlist, 'Math');
  });
}

test('only English lessons upload; missing secrets skip without failing', () => {
  const vi = lessons.find((l) => !english.includes(l));
  const r = publishShort(vi, { dryRun: true });
  assert.equal(r.ok, false);
  assert.equal(r.skipped, true);
  const saved = Object.fromEntries(['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'].map((k) => [k, process.env[k]]));
  for (const k of Object.keys(saved)) delete process.env[k];
  try {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'yt-')), 'clip.mp4');
    fs.writeFileSync(file, '');
    const s = publishShort(english[0], { file });
    assert.equal(s.skipped, true);
    assert.match(s.reason, /YT_REFRESH_TOKEN not set/);
    assert.equal(publishShort(english[0], { file, privacy: 'friends' }).ok, false);
  } finally {
    for (const [k, v] of Object.entries(saved)) if (v !== undefined) process.env[k] = v;
  }
});
