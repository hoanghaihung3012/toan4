import assert from 'node:assert/strict';
import test from 'node:test';
import { composeChapters } from '../shared/composition/chapters.js';

function chapter(id, audio) {
  return {
    id,
    scenes: { beat1: () => id, beat2: () => id },
    timing: { fps: 30, duration: 2, ...(audio ? { audio } : {}), beats: [
      { id: 'beat1', start: 0, end: 1, windows: { title: [0.1, 0.8, 'out'] } },
      { id: 'beat2', start: 1, end: 2, prev: 'beat1', windows: { wipe: [1, 1.5, 'raw'] } },
    ] },
  };
}

test('chapters namespace scenes, previous boards and windows without mutating inputs', () => {
  const first = chapter('example');
  const second = chapter('practice');
  const before = structuredClone(second.timing);
  const result = composeChapters([first, second]);
  assert.equal(result.timing.duration, 4);
  assert.deepEqual(result.timing.sections, [
    { id: 'example', start: 0, end: 2 }, { id: 'practice', start: 2, end: 4 },
  ]);
  assert.equal(result.scenes['example.beat1'](), 'example');
  assert.equal(result.scenes['practice.beat1'](), 'practice');
  assert.equal(result.timing.beats[3].prev, 'practice.beat1');
  assert.deepEqual(result.timing.beats[2].windows.title, [2.1, 2.8, 'out']);
  assert.deepEqual(second.timing, before);
});

test('narration needs an explicit combined track and retains chapter audio offsets', () => {
  const chapters = [chapter('example', '/example/voice.wav'), chapter('practice', '/practice/voice.wav')];
  assert.throws(() => composeChapters(chapters), /combined audio/);
  const result = composeChapters(chapters, { audio: './audio/voice.wav' });
  assert.equal(result.timing.audio, './audio/voice.wav');
  assert.deepEqual(result.audioSegments[1], { id: 'practice', source: '/practice/voice.wav', start: 2, duration: 2 });
});

test('invalid chapter contracts fail before rendering', () => {
  assert.throws(() => composeChapters([]), /at least one/);
  assert.throws(() => composeChapters([chapter('same'), chapter('same')]), /duplicate chapter/);
  const bad = chapter('bad');
  bad.timing.fps = 60;
  assert.throws(() => composeChapters([chapter('first'), bad]), /same fps/);
  bad.timing.fps = 30;
  bad.timing.beats[1].prev = 'missing';
  assert.throws(() => composeChapters([bad]), /unknown previous/);
  bad.timing.beats[1].prev = 'beat1';
  delete bad.scenes.beat2;
  assert.throws(() => composeChapters([bad]), /missing scene/);
  bad.scenes.beat2 = () => {};
  bad.timing.beats[0].windows.title = [0.8, 0.1];
  assert.throws(() => composeChapters([bad]), /invalid window/);
});

test('chapter offsets accumulate in frames rather than rounded milliseconds', () => {
  const chapters = Array.from({ length: 100 }, (_, index) => ({
    id: `chapter_${index}`,
    scenes: { beat1: () => {} },
    timing: { fps: 30, duration: 0.033, beats: [{ id: 'beat1', start: 0, end: 0.033 }] },
  }));
  const result = composeChapters(chapters);
  assert.equal(result.timing.duration, 100 / 30);
  assert.equal(result.timing.sections[99].start, 99 / 30);
});