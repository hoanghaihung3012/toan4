// English variant of lessons/vuon_thanh_hinh_vuong: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../../vi/vuon_thanh_hinh_vuong/scene.js';

Object.assign(TEXT, {
  title: 'A rectangular garden',
  yourTurn: 'Your turn!',
  lenQ: 'length ?',
  widQ: 'width ?',
  square: 'square',
  per: 'Perimeter',
  area: 'Area',
  comment: 'Comment your answer!',
  len: 'length',
  wid: 'width',
  sum: 'sum',
  div: '÷',
});
Object.assign(FIT, { cmpLenX: 34, cmpWidX: 44, cmpLenSize: 44, cmpWidSize: 44 });

export { scenes };
