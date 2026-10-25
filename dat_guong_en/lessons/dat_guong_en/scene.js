// English variant of lessons/dat_guong: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../dat_guong/scene.js';

Object.assign(TEXT, {
  title: 'Where should the mirror go?',
  largest: 'largest,',
  notOver: 'not over',
});

Object.assign(FIT, { titleUnderline: 760 });

export { scenes };
