// English variant of lessons/so_chan_6_chu_so: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, NUM } from '../so_chan_6_chu_so/scene.js';

Object.assign(TEXT, {
  cond: '6 digits,', condB: 'all different', is: 'and', even: 'even', odd: 'odd', notZero: '≠ 0',
  zeroFirst: "0 can't go first", ask: 'How many numbers?', ones: 'Ones digit:', first: 'First digit:',
  notZeroW: 'not 0', box: 'Ones digit', case1: 'Ones digit is 0', case2: 'Ones digit is 2, 4, 6, 8', way: 'way', ways: 'ways',
  oneToNine: '1 to 9', unit: 'numbers', drop: 'First digit: not', and: 'or the', lastDigit: 'ones digit',
  answer: '68,880 numbers!', turn: 'Your turn!', cmt: 'Comment your answer!',
});
NUM.sep = ',';

export { scenes };
