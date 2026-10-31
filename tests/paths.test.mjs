import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { startServer } from '../render/serve.mjs';
import { latestFinal, finalPath, lessonDir, listLessons } from '../render/paths.mjs';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const lessons = listLessons();

// lessons/ and final/ contain only date folders, which directly contain lesson/final folders.
for (const root of ['lessons', 'final']) {
  test(`${root}/ follows <date>/<entry>/`, () => {
    const stray = [];
    for (const date of fs.readdirSync(root)) {
      if (!DATE.test(date)) { stray.push(path.join(root, date)); continue; }
      for (const entry of fs.readdirSync(path.join(root, date))) {
        if (['long', 'shorts', 'en', 'vi'].includes(entry)) stray.push(path.join(root, date, entry));
      }
    }
    assert.deepEqual(stray, []);
  });
}

test('lesson names are unique and resolve to their date/lesson folder', () => {
  const names = lessons.map((l) => l.name);
  assert.deepEqual(names.filter((n, i) => names.indexOf(n) !== i), []);
  for (const l of lessons) {
    assert.equal(lessonDir(l.name), l.dir);
    assert.equal(l.dir, path.join('lessons', l.date, l.name));
  }
});

test('every final clip is grouped under its date and clip name', () => {
  for (const l of lessons) {
    const voice = path.join(l.dir, 'voice.json');
    const name = fs.existsSync(voice) ? JSON.parse(fs.readFileSync(voice, 'utf8')).final || l.name : l.name;
    const clip = latestFinal(name);
    if (clip) {
      const grouped = finalPath(l.name, { name });
      assert.equal(clip, grouped, `${clip} is outside the expected final folder`);
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
