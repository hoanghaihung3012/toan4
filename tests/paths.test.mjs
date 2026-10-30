import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { startServer } from '../render/serve.mjs';
import { FORMATS, LANGS, latestFinal, finalPath, lessonDir, listLessons } from '../render/paths.mjs';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const lessons = listLessons();

// lessons/ and final/ hold nothing outside <date>/<long|shorts>/<en|vi>/ (user's rule, 2026-10-26)
for (const root of ['lessons', 'final']) {
  test(`${root}/ follows <date>/<long|shorts>/<en|vi>/`, () => {
    const stray = [];
    for (const date of fs.readdirSync(root)) {
      if (!DATE.test(date)) { stray.push(path.join(root, date)); continue; }
      for (const format of fs.readdirSync(path.join(root, date))) {
        if (!FORMATS.includes(format)) { stray.push(path.join(root, date, format)); continue; }
        for (const lang of fs.readdirSync(path.join(root, date, format))) {
          if (!LANGS.includes(lang)) stray.push(path.join(root, date, format, lang));
        }
      }
    }
    assert.deepEqual(stray, []);
  });
}

test('lesson names are unique and their language folder matches voice.json', () => {
  const names = lessons.map((l) => l.name);
  assert.deepEqual(names.filter((n, i) => names.indexOf(n) !== i), []);
  for (const l of lessons) {
    assert.equal(lessonDir(l.name), l.dir);
    const voice = path.join(l.dir, 'voice.json');
    if (fs.existsSync(voice)) assert.equal(JSON.parse(fs.readFileSync(voice, 'utf8')).lang || 'vi', l.lang, l.dir);
  }
});

test('every final clip sits in the same date/format/lang as its lesson', () => {
  for (const l of lessons) {
    const voice = path.join(l.dir, 'voice.json');
    const name = fs.existsSync(voice) ? JSON.parse(fs.readFileSync(voice, 'utf8')).final || l.name : l.name;
    const clip = latestFinal(name);
    if (clip) {
      const grouped = finalPath(l.name, { name });
      const legacy = path.join('final', l.date, l.format, l.lang, `${name}.mp4`);
      assert.ok(clip === grouped || clip === legacy, `${clip} is outside the expected final folder`);
    }
  }
});

test('the preview server redirects /lessons/<name>/ to the lesson folder', async () => {
  const server = await startServer(0);
  try {
    const l = lessons[0];
    const r = await fetch(`http://127.0.0.1:${server.address().port}/lessons/${l.name}/timing.json`, { redirect: 'manual' });
    assert.equal(r.status, 302);
    assert.equal(r.headers.get('location'), `/${l.dir.split(path.sep).join('/')}/timing.json`);
  } finally {
    server.close();
  }
});
