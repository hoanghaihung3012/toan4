// English variant of lessons/xep_tao_vao_ro: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT } from '../xep_tao_vao_ro/scene.js';

Object.assign(TEXT, {
  title: 'Apples in baskets',
  canBeEmpty: 'Can be empty',
  ask: 'How many ways?',
  note: '3 numbers, sum = 7',
  byA: 'Count by basket A',
  bTakes: 'B takes:',
  ways: 'ways',
  cRest: 'C takes the rest',
  addUp: 'Add them up',
  so: 'So',
  yourTurn: 'Your turn!',
  comment: 'Comment your answer!',
});

export { scenes };
