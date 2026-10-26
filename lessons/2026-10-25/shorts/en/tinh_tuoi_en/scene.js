// English variant of lessons/tinh_tuoi: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../../vi/tinh_tuoi/scene.js';

Object.assign(TEXT, {
  title: 'Age puzzles',
  now: 'Now:',
  dad: 'Dad',
  kid: 'Kid',
  mom: 'Mom',
  yearsAgoColon: '{n} years ago:',
  dadNow: 'Dad now',
  goBack: 'Go back {n} years',
  totalThen: 'Total {n} years ago:',
  div: '÷',
  yearsAgo: '{n} years ago',
  parts: '{n} parts',
  kidC: 'Kid:',
  dadC: 'Dad:',
  dadNowC: 'Dad now:',
  check: 'Check:',
  titleB: 'How many years?',
  momC: 'Mom:',
  age: 'years',
  in: 'In',
  yearsLater: 'years:',
  howMuchOlder: 'How much older is Mom?',
  after: 'After {n} years',
  after1: 'After {n} year',
  sameGap: 'Gap never changes!',
  whenTimes: 'When Mom is {n} times Kid',
  years: '{n} years',
  tips: 'Remember 2 tips',
  tip1a: '1. Every year, everyone',
  tip1b: 'is 1 year older',
  tip2a: '2. The age gap',
  tip2b: 'never changes',
  comment: 'Liked it? Leave a comment!',
});

Object.assign(FIT, { stampSize: 100, tipsUnderline: 420, tip1Plus: 830, r1Size: 112, nameScale: 0.8 });

export { scenes };
