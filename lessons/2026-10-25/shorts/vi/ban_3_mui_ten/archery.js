// Archery props drawn in SVG (no lesson numbers here): a painted target on a wooden stand and
// an arrow. Lesson-neutral so a later lesson can move them into shared/web/js/.
//   target(svg, cx, cy, R, {flash, rings})  rings outer -> inner with their score painted on
//   arrowSprite(svg, x, y, deg, {stretch, flying})  (x, y) = tip; the shaft trails behind it
//   wobble(k, amp)  damped shake of a shaft after it thunks in (degrees)
import { THEME } from '../../../../../shared/web/theme.js';
import { mix } from '../../../../../shared/web/js/cubes.js';

const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

const INK = 'rgb(70, 44, 22)';
const WOOD = { post: 'rgb(176, 120, 66)', edge: 'rgb(96, 64, 30)', mound: 'rgb(92, 128, 70)' };
// score, outer radius (fraction of R), face colour, ink of the painted number
export const RINGS = [
  { score: 1, r: 1, face: 'rgb(240, 226, 190)', ink: INK },
  { score: 3, r: 0.65, face: 'rgb(96, 166, 236)', ink: INK },
  { score: 5, r: 0.325, face: 'rgb(232, 80, 80)', ink: 'rgb(255, 250, 240)' },
];

export function target(svg, cx, cy, R, { flash = {}, rings = RINGS } = {}) {
  // stand: two legs and a grassy mound like the textbook drawing
  const gy = cy + R + 90;
  for (const s of [-1, 1]) {
    el('path', { d: `M${cx + s * 0.12 * R},${cy + 0.8 * R} L${cx + s * 0.3 * R},${gy} L${cx + s * 0.3 * R + s * 22},${gy} L${cx + s * 0.12 * R + s * 22},${cy + 0.8 * R}Z`,
      fill: WOOD.post, stroke: WOOD.edge, 'stroke-width': 4 }, svg);
  }
  const m = 0.55 * R;
  el('path', { d: `M${cx - m - 40},${gy + 8} Q${cx - m},${gy - 70} ${cx - 0.1 * R},${gy - 10} Q${cx + m * 0.4},${gy - 90} ${cx + m + 40},${gy + 8}Z`,
    fill: WOOD.mound, stroke: 'rgb(48, 80, 40)', 'stroke-width': 4 }, svg);
  // face: shadow, then rings outer -> inner; a ring that was just hit flashes lighter
  el('circle', { cx: cx + 8, cy: cy + 14, r: R, fill: 'rgba(0, 0, 0, 0.35)' }, svg);
  rings.forEach((ring) => {
    const f = Math.max(0, Math.min(1, flash[ring.score] || 0));
    el('circle', { cx, cy, r: R * ring.r, fill: f ? mix(ring.face, 'rgb(255, 255, 255)', 0.55 * f) : ring.face,
      stroke: WOOD.edge, 'stroke-width': Math.max(3, R * 0.025) }, svg);
  });
  // the scores are painted on the face along one radius, like the problem's picture
  rings.forEach((ring, i) => {
    const inner = rings[i + 1] ? rings[i + 1].r : 0;
    const x = i === rings.length - 1 ? cx : cx + R * (ring.r + inner) / 2;
    const size = R * (i === rings.length - 1 ? 0.32 : 0.3);
    const t = el('text', { x, y: cy + size * 0.36, 'text-anchor': 'middle', fill: ring.ink,
      'font-family': THEME.fonts.tile.family, 'font-weight': THEME.fonts.tile.weight, 'font-size': size }, svg);
    t.textContent = String(ring.score);
  });
}

// (x, y) is the tip, deg the direction it travels; stuck arrows hide the head in the board
export function arrowSprite(svg, x, y, deg, { stretch = 1, flying = false, len = 150 } = {}) {
  const gr = el('g', { transform: `translate(${x},${y}) rotate(${deg}) scale(${stretch},${1 / Math.sqrt(stretch)})` }, svg);
  if (!flying) el('ellipse', { cx: 0, cy: 0, rx: 5, ry: 8, fill: 'rgba(40, 20, 10, 0.6)' }, gr);
  el('rect', { x: -len, y: -5, width: len, height: 10, rx: 4, fill: 'rgb(214, 170, 110)', stroke: WOOD.edge, 'stroke-width': 3 }, gr);
  if (flying) el('path', { d: 'M-4,-12 L26,0 L-4,12 Z', fill: 'rgb(196, 200, 210)', stroke: WOOD.edge, 'stroke-width': 3 }, gr);
  for (const s of [-1, 1]) {
    el('path', { d: `M${-len + 46},${s * 5} L${-len + 6},${s * 26} L${-len - 10},${s * 26} L${-len + 14},${s * 5} Z`,
      fill: 'rgb(246, 150, 60)', stroke: WOOD.edge, 'stroke-width': 3 }, gr);
  }
}

export function wobble(k, amp = 8) {
  if (k <= 0 || k >= 1) return 0;
  return amp * Math.exp(-4 * k) * Math.sin(4.5 * Math.PI * k);
}
