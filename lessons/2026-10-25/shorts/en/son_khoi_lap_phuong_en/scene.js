// English variant of lessons/son_khoi_lap_phuong: the same scenes, facts and asserts, English board text.
// Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../../vi/son_khoi_lap_phuong/scene.js';

Object.assign(TEXT, {
  top: 'top', bottom: 'bottom', front: 'front', back: 'back', right: 'right', left: 'left',
  base: 'bottom', squares: 'squares', yourTurn: 'Your turn!', noPaint: 'not painted', unknown: '? squares',
});

// "bottom" is wider than "dưới": move its label right, clear of the upward arrow
Object.assign(FIT, { labelDx: { bottom: 45 } });

export { scenes };
