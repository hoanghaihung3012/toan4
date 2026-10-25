// Wooden unit cubes in cavalier (oblique) projection, like a textbook drawing: front faces
// are true squares, depth runs up and to the right. Lesson-neutral: lessons pass the cube
// list and decide which faces are painted.
//   Cube = [x, y, z] (x right, y back, z up; integers, 0 = front-left-bottom)
//   faces: 'front' | 'top' | 'right' are the ones the drawing shows
//   cubeView()     -> projector {pt(X, Y, Z), face(c, f)}
//   drawCubes()    SVG cubes, back to front, with per-cube drop pose and per-face paint
//   flatGrid()     a flat view (squares in a grid) that pops in square by square
//   paintBrush()   a held brush prop (never mirrors; fixed tilt)
//   viewCounts()   squares seen from each of the 6 sides; exposedFaces() for checking
import { clamp01, lerp, stagger, pop } from './ease.js';

const NS = 'http://www.w3.org/2000/svg';

export const WOOD = {
  front: 'rgb(240, 218, 168)', top: 'rgb(250, 236, 204)', right: 'rgb(204, 172, 118)',
  edge: 'rgb(96, 64, 30)',
};
const SHADE = { front: 1, top: 1.12, right: 0.8 };

function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

export function svgLayer(objs) {
  return el('svg', { class: 'layer', width: 1080, height: 1920, viewBox: '0 0 1080 1920' }, objs);
}

const parse = (c) => c.match(/[\d.]+/g).map(Number);
export function mix(a, b, u) {
  const [p, q] = [parse(a), parse(b)];
  return `rgb(${p.map((v, i) => Math.round(lerp(v, q[i], u))).join(', ')})`;
}
export function shade(c, k) {
  return `rgb(${parse(c).slice(0, 3).map((v) => Math.round(Math.min(255, v * k))).join(', ')})`;
}

// s = cube edge in px; (ox, oy) = screen point of the front-left-bottom corner of [0,0,0]
export function cubeView(ox, oy, s, { dx = 0.5, dy = 0.42 } = {}) {
  const pt = (X, Y, Z) => [ox + s * (X + dx * Y), oy - s * (Z + dy * Y)];
  const face = ([x, y, z], f) => {
    if (f === 'front') return [pt(x, y, z), pt(x + 1, y, z), pt(x + 1, y, z + 1), pt(x, y, z + 1)];
    if (f === 'top') return [pt(x, y, z + 1), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)];
    return [pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x + 1, y, z + 1)];
  };
  return { s, pt, face };
}

const key = (c) => c.join(',');
const has = (set, x, y, z) => set.has(`${x},${y},${z}`);

// faces actually visible in the drawing for each side (front/top/right): one per line of sight
export function shownFaces(cubes, f) {
  return cubes.filter(([x, y, z]) => {
    if (f === 'front') return !cubes.some(([a, b, c]) => a === x && c === z && b < y);
    if (f === 'top') return !cubes.some(([a, b, c]) => a === x && b === y && c > z);
    return !cubes.some(([a, b, c]) => b === y && c === z && a > x);
  });
}

// how many unit squares each of the 6 sides sees (silhouette areas)
export function viewCounts(cubes) {
  const n = (proj) => new Set(cubes.map(proj)).size;
  const top = n(([x, y]) => `${x},${y}`);
  const front = n(([x, , z]) => `${x},${z}`);
  const side = n(([, y, z]) => `${y},${z}`);
  return { top, bottom: top, front, back: front, right: side, left: side };
}

// every face not touching another cube (the true painted area, bottom included)
export function exposedFaces(cubes) {
  const set = new Set(cubes.map(key));
  const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  return cubes.reduce((n, [x, y, z]) => n + dirs.filter(([a, b, c]) => !has(set, x + a, y + b, z + c)).length, 0);
}

// draw order: back to front, bottom to top, left to right
export const drawOrder = (cubes) => [...cubes].sort((p, q) => q[1] - p[1] || p[2] - q[2] || p[0] - q[0]);

// cubes: list; pose(c, i) -> {dy, squash, scale} or null (hidden);
// paint(c, f) -> {color, u} (u = 0..1 swept fill along the face) or null
export function drawCubes(svg, view, cubes, { pose = () => ({}), paint = () => null, edge = 3 } = {}) {
  drawOrder(cubes).forEach((c) => {
    const ps = pose(c);
    if (ps === null) return;
    const { dy = 0, squash = 1, scale = 1 } = ps;
    if (scale <= 0) return;
    const [bx, by] = view.pt(c[0] + 0.5, c[1] + 0.5, c[2]); // bottom centre
    const g = el('g', {
      transform: `translate(${bx},${by + dy}) scale(${scale / Math.sqrt(squash)},${scale * squash}) translate(${-bx},${-by})`,
    }, svg);
    for (const f of ['front', 'top', 'right']) {
      const q = view.face(c, f);
      const d = `M${q.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L')}Z`;
      el('path', { d, fill: WOOD[f], stroke: WOOD.edge, 'stroke-width': edge, 'stroke-linejoin': 'round' }, g);
      const pt = paint(c, f);
      if (pt && pt.u > 0) {
        const u = clamp01(pt.u);
        const a = q[0], b = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)];
        const cc = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)], e = q[3];
        el('path', {
          d: `M${[a, b, cc, e].map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L')}Z`,
          fill: shade(pt.color, SHADE[f]), stroke: WOOD.edge, 'stroke-width': edge, 'stroke-linejoin': 'round',
        }, g);
      }
    }
  });
}

// the point a brush tip sits on while it has painted fraction u of a face
export function faceTip(view, c, f, u) {
  const q = view.face(c, f);
  const a = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)];
  const b = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)];
  const w = 0.5 + 0.32 * Math.sin(u * Math.PI * 4); // brush strokes up and down while sweeping
  return [lerp(a[0], b[0], w), lerp(a[1], b[1], w)];
}

// flat view: heights per column (bottom-up), square size c, bottom-left at (x0, base).
// u = 0..1 pops squares in one by one (bottom row first, left to right)
export function flatGrid(svg, heights, x0, base, c, { color, u = 1, hop = 0, edge = 3 } = {}) {
  const cells = [];
  heights.forEach((h, col) => { for (let r = 0; r < h; r++) cells.push([col, r]); });
  cells.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  cells.forEach(([col, r], i) => {
    const k = stagger(u, i, cells.length, 0.45);
    if (k <= 0) return;
    const { scale, squash } = pop(k);
    const cx = x0 + (col + 0.5) * c, cy = base - (r + 0.5) * c - hop;
    el('rect', {
      x: -c / 2, y: -c / 2, width: c, height: c, rx: 4, fill: color, stroke: WOOD.edge, 'stroke-width': edge,
      transform: `translate(${cx},${cy}) scale(${scale / Math.sqrt(squash)},${scale * squash})`,
    }, svg);
  });
  return cells.length;
}

// a paint brush held at a fixed tilt with its tip at (x, y); squash > 1 = pressed on the face
export function paintBrush(svg, x, y, color, { squash = 1, tilt = -32 } = {}) {
  const g = el('g', { transform: `translate(${x},${y}) rotate(${tilt}) scale(${1 / Math.sqrt(squash)},${squash})` }, svg);
  el('path', { d: 'M-15,-4 Q-17,-40 -12,-46 L12,-46 Q17,-40 15,-4 Q0,6 -15,-4Z', fill: color, stroke: WOOD.edge, 'stroke-width': 3 }, g);
  el('rect', { x: -14, y: -78, width: 28, height: 34, rx: 4, fill: 'rgb(196, 200, 210)', stroke: WOOD.edge, 'stroke-width': 3 }, g);
  el('path', { d: 'M-10,-78 L-7,-190 Q0,-200 7,-190 L10,-78Z', fill: 'rgb(214, 96, 60)', stroke: WOOD.edge, 'stroke-width': 3 }, g);
}
