// English variant of lessons/dau_hieu_chia_het: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT } from '../../vi/dau_hieu_chia_het/scene.js';

Object.assign(TEXT, {
  divisibleBy: 'divisible by',
  and: 'and',
  title: 'Divisibility rules',
  lastDigit: 'last digit',
  addDigits: 'add digits',
  even: 'even',
  odd: 'odd',
});

export { scenes };
