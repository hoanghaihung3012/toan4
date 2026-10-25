// English variant of lessons/hinh_chu_nhat: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../hinh_chu_nhat/scene.js';

Object.assign(TEXT, {
  title: 'Question 8',
  fig: 'Figure',
  rects: 'rectangles',
  oneRect: '= 1 rectangle',
  shape: 'rectangle',
  yourTurn: 'Your turn!',
  pairs: 'pairs',
});

Object.assign(FIT, { titleUnderline: 330, hookLabelSize: 56, tagX: 440 });

export { scenes };
