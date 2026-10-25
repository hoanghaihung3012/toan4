// English variant of lessons/que_diem: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../que_diem/scene.js';

Object.assign(TEXT, {
  title: 'Question 7',
  fig: 'Figure',
  sticks: 'sticks',
  shared: 'shared',
  yourTurn: 'Your turn!',
});

Object.assign(FIT, { titleUnderline: 330, labelShift: -50, wordSize: 70 });

export { scenes };
