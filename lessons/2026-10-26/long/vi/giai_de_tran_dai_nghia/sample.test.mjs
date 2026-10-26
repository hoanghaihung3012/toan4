import assert from 'node:assert/strict';
import test from 'node:test';
import { openPlayer } from '../../../../../render/browser.mjs';
import { problems } from './problems.js';
import { writtenText } from './writing.js';

test('writing reveals Vietnamese letters without separating their accents', () => {
  const text = 'Đe\u0302\u0300 bài';
  assert.equal(writtenText(text, 0), '');
  assert.equal(writtenText(text, 1 / 6), 'Đ');
  assert.equal(writtenText(text, 2 / 6), 'Đe\u0302\u0300');
  assert.equal(writtenText(text, 1), text);
});

test('sample shows the full question before any solution and preserves 16:9', async () => {
  assert.equal(problems.length, 3);
  assert.ok(problems.every((problem) => problem.statement.length > 0));
  const player = await openPlayer({ lesson: 'giai_de_tran_dai_nghia' });
  try {
    assert.equal(player.width, 1920);
    assert.equal(player.height, 1080);
    assert.deepEqual(player.timing.beats.slice(0, 2).map((beat) => beat.id), ['question', 'review']);
    const question = await player.page.evaluate((time) => {
      window.renderFrame(time);
      return document.getElementById('stage').textContent;
    }, player.timing.beats[0].end - 1 / 30);
    assert.match(question, /3.375.000/);
    assert.match(question, /số nhà 19/);
    assert.doesNotMatch(question, /675.000|15 chữ số/);
    const writing = await player.page.evaluate((beat) => {
      const textsAt = (time) => {
        window.renderFrame(time);
        return [...document.querySelectorAll('#stage svg.layer text')].map((element) => element.textContent);
      };
      const [start, end] = beat.windows.read0;
      const [secondStart, secondEnd] = beat.windows.ask1line1;
      return {
        before: textsAt(start - 1 / 30),
        during: textsAt((start + end) / 2),
        after: textsAt(end),
        beforeLast: textsAt(secondStart - 1 / 30),
        duringLast: textsAt((secondStart + secondEnd) / 2),
        afterLast: textsAt(secondEnd),
      };
    }, player.timing.beats[0]);
    assert.equal(writing.before[2], '');
    assert.ok(writing.during[2].length > 0);
    assert.ok(writing.during[2].length < problems[0].statement[0].length);
    assert.equal(writing.after[2], problems[0].statement[0]);
    assert.equal(writing.beforeLast.at(-1), '');
    assert.ok(writing.duringLast.at(-1).length > 0);
    assert.equal(writing.afterLast.at(-1), problems[0].questions[1][1]);
    const final = await player.page.evaluate((time) => {
      window.renderFrame(time);
      return document.getElementById('stage').textContent;
    }, player.timing.beats[1].end - 1 / 30);
    assert.match(final, /675.000 đồng/);
    assert.match(final, /15 chữ số/);
  } finally {
    await player.close();
  }
});