// Wooden matchsticks (DOM, like the tiles) and the "row of houses" figure of Câu 7.
// A stick is a `.tile` element, so the eraser's sweepOff() hops and shrinks it away like a tile.
// Colours come from THEME.tiles: int = cream wood (old sticks), dec = mint wood (new sticks),
// comma = the red head.
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, lerp, easeOutCubic, pop } from '../../../../../shared/web/js/ease.js';

const T = THEME.tiles;
const THICK = 16; // stick thickness on the 1080 board
const HEAD = [30, 24]; // head ellipse

// one matchstick from p0 to p1 (head at p1). k: scale about its centre, lift: px up
export function match(objs, p0, p1, { kind = 'int', scale = 1, squash = 1, dx = 0, dy = 0, rot = 0 } = {}) {
  if (scale <= 0) return null;
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) - 10;
  const cx = (p0[0] + p1[0]) / 2 + dx;
  const cy = (p0[1] + p1[1]) / 2 + dy;
  const a = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI + rot;
  const d = document.createElement('div');
  d.className = 'tile match';
  Object.assign(d.style, {
    left: `${cx - len / 2}px`, top: `${cy - THICK / 2}px`, width: `${len}px`, height: `${THICK}px`,
    borderRadius: `${THICK / 2}px`, background: T[kind].face,
    boxShadow: `0 4px 0 ${T[kind].edge}, ${T.shadow}`, transformOrigin: '50% 50%',
    transform: `rotate(${a}deg) scale(${scale * squash}, ${scale / Math.sqrt(squash)})`,
  });
  const h = document.createElement('div');
  Object.assign(h.style, {
    position: 'absolute', right: `${-HEAD[0] / 2 + 4}px`, top: `${(THICK - HEAD[1]) / 2}px`,
    width: `${HEAD[0]}px`, height: `${HEAD[1]}px`, borderRadius: '50%',
    background: T.comma.face, boxShadow: `0 3px 0 ${T.comma.edge}`,
  });
  d.appendChild(h);
  objs.appendChild(d);
  return d;
}

// Sticks of a row of n houses (square + triangle roof), side L, left edge x0, floor yb.
// Order per house: (left wall of the first house only), floor, right wall, top, roof left, roof right.
// Every house after the first reuses the previous right wall, so it adds exactly 5 sticks.
export function houseSticks(x0, yb, L, n) {
  const yt = yb - L;
  const ya = yt - L * Math.sin(Math.PI / 3);
  const out = [];
  for (let k = 0; k < n; k++) {
    const a = x0 + k * L, b = a + L, m = a + L / 2;
    if (k === 0) out.push({ house: k, role: 'wall0', p0: [a, yb], p1: [a, yt] });
    out.push({ house: k, role: 'floor', p0: [a, yb], p1: [b, yb] });
    out.push({ house: k, role: 'wall', p0: [b, yb], p1: [b, yt] });
    out.push({ house: k, role: 'top', p0: [a, yt], p1: [b, yt] });
    out.push({ house: k, role: 'roofL', p0: [a, yt], p1: [m, ya] });
    out.push({ house: k, role: 'roofR', p0: [b, yt], p1: [m, ya] });
  }
  return out;
}
export const houseHeight = (L) => L * (1 + Math.sin(Math.PI / 3));

// a stick arriving: drops in from above on a short arc, rotation settles with a spring,
// squash on landing (pop). u = 0..1
export function arrive(u, from = [0, -90], spin = 24) {
  if (u <= 0) return null;
  const { scale, squash } = pop(u);
  const v = easeOutCubic(clamp01(u / 0.6));
  return { scale, squash, dx: lerp(from[0], 0, v), dy: lerp(from[1], 0, v), rot: spin * (1 - scale) };
}
