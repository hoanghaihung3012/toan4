import assert from 'node:assert/strict';
import test from 'node:test';
import { houseCost, solveRooms, teamForward } from './facts.mjs';
test('house labels count individual digits', () => {
  assert.equal(houseCost(10), 675000);
  assert.equal(houseCost(40), 3375000);
  assert.ok(houseCost(39) < 3375000 && houseCost(41) > 3375000);
  assert.equal(2 * 40 - 1, 79);
});
test('room solution is unique without assuming distinct digits', () => {
  assert.deepEqual(solveRooms(), [{ digits: { S: 6, H: 4, C: 5, T: 3 },
    values: [646, 456, 536, 436, 345], missing: 536 }]);
});
test('team reverse solution passes the forward check', () => {
  assert.deepEqual(teamForward(15), [15, 10, 40, 35]);
  assert.equal((35 + 5) / 4 / 2 * 3, 15);
});