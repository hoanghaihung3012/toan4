import assert from 'node:assert/strict';
import test from 'node:test';
import { canvasFor } from '../shared/web/profiles.js';

test('legacy portrait and explicit landscape profiles have independent dimensions', () => {
  assert.deepEqual(canvasFor(), { width: 1080, height: 1920, fps: 30 });
  assert.deepEqual(canvasFor('landscape'), { width: 1920, height: 1080, fps: 30 });
  const copy = canvasFor('landscape');
  copy.width = 1;
  assert.equal(canvasFor('landscape').width, 1920);
  assert.throws(() => canvasFor('unknown'), /unknown canvas profile/);
});