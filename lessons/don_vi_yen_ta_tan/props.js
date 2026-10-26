// Props drawn in code for the yến / tạ / tấn lesson: unit weights, a balance scale and
// three animals (chicken, cow, elephant). Pure SVG; scene.js decides poses and timing.
import { clamp01, spring } from '../../shared/web/js/ease.js';

const NS = 'http://www.w3.org/2000/svg';
export function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

const INK = 'rgb(70, 44, 22)';
const FONT = 'Baloo 2';

// one colour per unit, kept for the whole lesson (story.md, "Ghi chú tạo hình")
export const UNIT = {
  kg: { face: 'rgb(240, 218, 168)', edge: 'rgb(176, 138, 84)' },
  yen: { face: 'rgb(200, 236, 208)', edge: 'rgb(112, 168, 128)' },
  ta: { face: 'rgb(176, 214, 244)', edge: 'rgb(84, 130, 176)' },
  tan: { face: 'rgb(246, 186, 198)', edge: 'rgb(176, 96, 116)' },
};

// a weight ("quả cân"): trapezoid body with a knob, standing on (x, base).
// w = body width; label written on the face when given.
export function weight(svg, x, base, unit, { w = 200, label = '', size = 60, scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const c = UNIT[unit];
  const h = w * 0.62;
  const gr = el('g', { transform: `translate(${x},${base}) scale(${scale / Math.sqrt(squash)},${scale * squash})` }, svg);
  const top = w * 0.36;
  const bot = w * 0.5;
  const edge = Math.max(4, w * 0.05);
  el('ellipse', { cx: 0, cy: 2, rx: bot + 8, ry: Math.max(4, w * 0.05), fill: 'rgba(0,0,0,0.25)' }, gr);
  const body = (dy, fill) => el('path', {
    d: `M${-bot},${dy} L${bot},${dy} L${top},${dy - h} L${-top},${dy - h} Z`,
    fill, stroke: c.edge, 'stroke-width': 2, 'stroke-linejoin': 'round',
  }, gr);
  body(0, c.edge);
  body(-edge, c.face);
  // knob
  el('rect', { x: -w * 0.12, y: -edge - h - w * 0.13, width: w * 0.24, height: w * 0.16, rx: w * 0.06, fill: c.face, stroke: c.edge, 'stroke-width': 3 }, gr);
  // highlight
  el('path', { d: `M${-top + 8},${-edge - h + 8} L${top - 8},${-edge - h + 8}`, stroke: 'rgba(255,255,255,0.45)', 'stroke-width': Math.max(3, w * 0.04), 'stroke-linecap': 'round' }, gr);
  if (label) {
    const t = el('text', { x: 0, y: -edge - h * 0.24, 'text-anchor': 'middle', 'font-family': FONT, 'font-weight': 760, 'font-size': size, fill: INK }, gr);
    t.textContent = label;
  }
  return h + edge;
}

// --- balance scale ---------------------------------------------------------------------------
// pivot (px, py); beam half-length L; pans hang `hang` px under the beam ends.
export const SCALE = { px: 540, py: 640, L: 300, hang: 210, panW: 360, base: 1080, tilt: 0.2 };

// where each pan's top surface is when the beam has angle th (radians, > 0 = left side down)
export function pans(th, S = SCALE) {
  const dx = S.L * Math.cos(th);
  const dy = S.L * Math.sin(th);
  return { left: [S.px - dx, S.py + dy + S.hang], right: [S.px + dx, S.py - dy + S.hang] };
}

const METAL = 'rgb(196, 160, 98)';
const METAL_DARK = 'rgb(118, 86, 40)';
export function scaleFrame(svg, th, { scale = 1, S = SCALE } = {}) {
  if (scale <= 0) return;
  const gr = el('g', { transform: `translate(${S.px},${S.base}) scale(${scale}) translate(${-S.px},${-S.base})` }, svg);
  // base + post
  el('ellipse', { cx: S.px, cy: S.base + 6, rx: 190, ry: 16, fill: 'rgba(0,0,0,0.25)' }, gr);
  el('path', { d: `M${S.px - 160},${S.base} L${S.px + 160},${S.base} L${S.px + 90},${S.base - 46} L${S.px - 90},${S.base - 46} Z`, fill: METAL, stroke: METAL_DARK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, gr);
  el('rect', { x: S.px - 16, y: S.py, width: 32, height: S.base - 46 - S.py, fill: METAL, stroke: METAL_DARK, 'stroke-width': 5 }, gr);
  const { left, right } = pans(th, S);
  // strings + pans (pans stay level: they hang)
  for (const [x, y] of [left, right]) {
    const ey = y - S.hang;
    for (const s of [-1, 1]) el('line', { x1: x, y1: ey, x2: x + s * S.panW * 0.42, y2: y, stroke: METAL_DARK, 'stroke-width': 4 }, gr);
    el('path', { d: `M${x - S.panW / 2},${y} L${x + S.panW / 2},${y} Q${x + S.panW * 0.36},${y + 46} ${x},${y + 46} Q${x - S.panW * 0.36},${y + 46} ${x - S.panW / 2},${y} Z`, fill: METAL, stroke: METAL_DARK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, gr);
  }
  // beam
  const deg = (-th * 180) / Math.PI;
  const beam = el('g', { transform: `rotate(${deg},${S.px},${S.py})` }, gr);
  el('rect', { x: S.px - S.L - 14, y: S.py - 13, width: 2 * S.L + 28, height: 26, rx: 13, fill: METAL, stroke: METAL_DARK, 'stroke-width': 5 }, beam);
  // pointer: points straight up when the scale is level
  el('path', { d: `M${S.px - 12},${S.py} L${S.px},${S.py - 120} L${S.px + 12},${S.py} Z`, fill: 'rgb(214, 70, 60)', stroke: 'rgb(120, 30, 24)', 'stroke-width': 3 }, beam);
  el('circle', { cx: S.px, cy: S.py, r: 20, fill: METAL_DARK, stroke: METAL, 'stroke-width': 5 }, gr);
}

// beam angle from a list of {u, d}: each item tips the beam by d with a springy settle
export function beamAngle(kicks) {
  let th = 0;
  for (const { u, d } of kicks) if (u > 0) th += d * spring(clamp01(u), 2.4, 4.2);
  return th;
}

// --- animals (stand on y = ground, centred on x, drawn facing left; scale from the feet) ---------
function animalGroup(svg, x, ground, scale, squash) {
  return el('g', { transform: `translate(${x},${ground}) scale(${scale / Math.sqrt(squash)},${scale * squash})` }, svg);
}

export function chicken(svg, x, ground, { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const g = animalGroup(svg, x, ground, scale, squash);
  el('ellipse', { cx: 0, cy: 0, rx: 70, ry: 10, fill: 'rgba(0,0,0,0.25)' }, g);
  for (const lx of [-14, 14]) el('path', { d: `M${lx},-40 L${lx},-4 M${lx - 12},0 L${lx},-4 L${lx + 12},0`, stroke: 'rgb(232, 168, 48)', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
  el('path', { d: 'M60,-110 Q96,-150 84,-70 Z', fill: 'rgb(220, 210, 190)', stroke: 'rgb(150, 136, 110)', 'stroke-width': 3 }, g); // tail
  el('ellipse', { cx: 6, cy: -78, rx: 64, ry: 46, fill: 'rgb(250, 246, 236)', stroke: 'rgb(150, 136, 110)', 'stroke-width': 4 }, g);
  el('path', { d: 'M-10,-84 Q22,-112 44,-76 Q20,-62 -10,-84 Z', fill: 'rgb(226, 216, 196)' }, g); // wing
  el('circle', { cx: -46, cy: -128, r: 30, fill: 'rgb(250, 246, 236)', stroke: 'rgb(150, 136, 110)', 'stroke-width': 4 }, g);
  el('path', { d: 'M-62,-154 q6,-22 14,-4 q6,-22 14,-2 q8,-18 12,4 Z', fill: 'rgb(220, 50, 46)' }, g); // comb
  el('path', { d: 'M-74,-132 L-98,-124 L-74,-116 Z', fill: 'rgb(240, 176, 40)', stroke: 'rgb(170, 110, 20)', 'stroke-width': 2 }, g);
  el('path', { d: 'M-70,-114 q-6,16 6,18 q6,-8 2,-18 Z', fill: 'rgb(220, 50, 46)' }, g); // wattle
  el('circle', { cx: -54, cy: -134, r: 5, fill: INK }, g);
}

export function cow(svg, x, ground, { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const g = animalGroup(svg, x, ground, scale, squash);
  const body = 'rgb(248, 244, 236)';
  const line = 'rgb(90, 70, 56)';
  el('ellipse', { cx: 10, cy: 0, rx: 150, ry: 14, fill: 'rgba(0,0,0,0.25)' }, g);
  for (const lx of [-90, -50, 60, 100]) {
    el('rect', { x: lx - 14, y: -110, width: 28, height: 110, rx: 10, fill: body, stroke: line, 'stroke-width': 4 }, g);
    el('rect', { x: lx - 14, y: -18, width: 28, height: 18, rx: 6, fill: 'rgb(70, 54, 44)' }, g);
  }
  el('path', { d: 'M130,-170 Q170,-150 160,-80', stroke: line, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g); // tail
  el('rect', { x: -120, y: -210, width: 260, height: 120, rx: 50, fill: body, stroke: line, 'stroke-width': 5 }, g);
  el('path', { d: 'M-40,-208 q40,10 30,60 q-40,10 -50,-20 Z', fill: 'rgb(70, 54, 44)' }, g); // patches
  el('path', { d: 'M60,-180 q40,-20 56,20 q-20,40 -56,10 Z', fill: 'rgb(70, 54, 44)' }, g);
  el('ellipse', { cx: 30, cy: -88, rx: 26, ry: 14, fill: 'rgb(246, 180, 190)', stroke: line, 'stroke-width': 3 }, g); // udder
  // head
  el('path', { d: 'M-150,-240 q-14,-24 -2,-34 M-104,-240 q14,-24 2,-34', stroke: 'rgb(230, 220, 190)', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g);
  el('ellipse', { cx: -168, cy: -222, rx: 24, ry: 12, fill: body, stroke: line, 'stroke-width': 4 }, g);
  el('rect', { x: -164, y: -250, width: 74, height: 96, rx: 34, fill: body, stroke: line, 'stroke-width': 5 }, g);
  el('ellipse', { cx: -127, cy: -172, rx: 40, ry: 26, fill: 'rgb(246, 196, 196)', stroke: line, 'stroke-width': 4 }, g);
  for (const nx of [-140, -114]) el('circle', { cx: nx, cy: -172, r: 5, fill: line }, g);
  for (const ex of [-144, -110]) el('circle', { cx: ex, cy: -214, r: 6, fill: INK }, g);
}

export function elephant(svg, x, ground, { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const g = animalGroup(svg, x, ground, scale, squash);
  const skin = 'rgb(172, 178, 190)';
  const line = 'rgb(84, 88, 100)';
  el('ellipse', { cx: 20, cy: 0, rx: 190, ry: 16, fill: 'rgba(0,0,0,0.25)' }, g);
  for (const lx of [-90, -30, 80, 140]) el('rect', { x: lx - 28, y: -150, width: 56, height: 150, rx: 18, fill: skin, stroke: line, 'stroke-width': 5 }, g);
  el('path', { d: 'M180,-230 Q214,-200 200,-150', stroke: line, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g); // tail
  el('ellipse', { cx: 40, cy: -230, rx: 160, ry: 120, fill: skin, stroke: line, 'stroke-width': 6 }, g);
  // head, trunk, ear
  el('path', { d: 'M-150,-250 q-40,60 -36,150 q2,26 22,20 q8,-4 4,-20 q-6,-60 30,-110 Z', fill: skin, stroke: line, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
  el('circle', { cx: -110, cy: -270, r: 78, fill: skin, stroke: line, 'stroke-width': 6 }, g);
  el('path', { d: 'M-70,-330 q90,-30 90,70 q-10,70 -80,50 q-30,-60 -10,-120 Z', fill: 'rgb(196, 166, 176)', stroke: line, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
  el('path', { d: 'M-160,-226 q-6,30 16,40', stroke: 'rgb(250, 246, 236)', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, g); // tusk
  el('circle', { cx: -140, cy: -290, r: 8, fill: INK }, g);
}
