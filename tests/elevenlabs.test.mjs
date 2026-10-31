import assert from 'node:assert/strict';
import test from 'node:test';
import { wordsFromAlignment } from '../render/elevenlabs.mjs';

test('character alignment becomes words with start and end times', () => {
  const text = 'Học cùng Phượng!';
  const characters = [...text];
  const starts = characters.map((_, i) => i * 0.1);
  const ends = characters.map((_, i) => i * 0.1 + 0.1);
  const words = wordsFromAlignment({
    characters, character_start_times_seconds: starts, character_end_times_seconds: ends,
  });
  assert.deepEqual(words.map((w) => w.text), ['Học', 'cùng', 'Phượng!']);
  assert.equal(words[0].start, 0);
  assert.ok(Math.abs(words[0].end - 0.3) < 1e-9);
  assert.ok(Math.abs(words[1].start - 0.4) < 1e-9);
  assert.ok(Math.abs(words[2].end - 1.6) < 1e-9);
});
