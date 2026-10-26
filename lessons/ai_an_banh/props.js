// Props for the "who ate the cake" puzzle, drawn in SVG inside an objects() layer:
// a layered cake, wooden name tags, and rubber stamps (THẬT / DỐI) that slam onto the board.
// Colours come from THEME (tiles = wood, chalk = stamp inks). Sizes are px on the 1080 board.
import { THEME } from '../../shared/web/theme.js';
import { clamp01, spring, easeInQuad } from '../../shared/web/js/ease.js';

const NS = 'http://www.w3.org/2000/svg';
const T = THEME.tiles;
const FONT = THEME.fonts.tile.family;
const WEIGHT = THEME.fonts.tile.weight;
const CAKE = { sponge: 'rgb(238, 196, 132)', spongeEdge: 'rgb(186, 136, 78)', icing: 'rgb(252, 236, 240)',
  jam: 'rgb(214, 70, 92)', cherry: 'rgb(220, 40, 56)', plate: 'rgb(214, 226, 232)' };

function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

export function propSvg(objs) {
  return el('svg', { class: 'layer', width: THEME.canvas.width, height: THEME.canvas.height }, objs);
}

// group centred on (cx, cy) with scale/squash (squash > 1 = flatter and wider), feet on cy + h/2
function group(svg, cx, cy, { scale = 1, squash = 1, rot = 0, foot = 0 } = {}) {
  const sx = scale * squash, sy = scale / Math.sqrt(squash);
  return el('g', { transform: `translate(${cx.toFixed(1)},${(cy + foot).toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sx.toFixed(3)},${sy.toFixed(3)}) translate(0,${-foot})` }, svg);
}

// a two-layer cake on a plate, about 170 wide and 150 tall, centred on (cx, cy)
export function cake(svg, cx, cy, { scale = 1, squash = 1, rot = 0 } = {}) {
  if (scale <= 0) return;
  const gr = group(svg, cx, cy, { scale, squash, rot, foot: 70 });
  el('ellipse', { cx: 6, cy: 82, rx: 92, ry: 16, fill: 'rgba(0,0,0,0.3)' }, gr);
  el('ellipse', { cx: 0, cy: 70, rx: 92, ry: 16, fill: CAKE.plate }, gr);
  // bottom layer, jam, top layer
  el('rect', { x: -72, y: 8, width: 144, height: 58, rx: 10, fill: CAKE.spongeEdge }, gr);
  el('rect', { x: -72, y: 4, width: 144, height: 56, rx: 10, fill: CAKE.sponge }, gr);
  el('rect', { x: -72, y: -6, width: 144, height: 12, rx: 5, fill: CAKE.jam }, gr);
  el('rect', { x: -72, y: -52, width: 144, height: 50, rx: 10, fill: CAKE.sponge }, gr);
  // icing with drips
  el('path', { d: 'M-74,-44 Q-74,-60 -58,-60 L58,-60 Q74,-60 74,-44 L74,-34 Q66,-26 60,-34 Q52,-16 44,-34 Q30,-28 22,-36 Q12,-14 2,-36 Q-12,-28 -20,-36 Q-30,-18 -40,-36 Q-52,-26 -60,-34 Q-68,-24 -74,-34 Z', fill: CAKE.icing }, gr);
  el('rect', { x: -60, y: -56, width: 70, height: 6, rx: 3, fill: 'rgba(255,255,255,0.8)' }, gr);
  // cherry
  el('path', { d: 'M4,-80 Q12,-96 22,-100', stroke: 'rgb(90, 120, 60)', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, gr);
  el('circle', { cx: 0, cy: -70, r: 15, fill: CAKE.cherry }, gr);
  el('circle', { cx: -5, cy: -75, r: 4.5, fill: 'rgba(255,255,255,0.7)' }, gr);
}

// a wooden name tag, w × 84, centred on (cx, cy)
export function nameTag(svg, cx, cy, name, { w = 190, kind = 'int', scale = 1, squash = 1, dy = 0 } = {}) {
  if (scale <= 0) return;
  const h = 84;
  const gr = group(svg, cx, cy + dy, { scale, squash, foot: h / 2 });
  el('rect', { x: -w / 2 + 5, y: -h / 2 + 12, width: w, height: h, rx: 14, fill: 'rgba(0,0,0,0.3)' }, gr);
  el('rect', { x: -w / 2, y: -h / 2 + 7, width: w, height: h, rx: 14, fill: T[kind].edge }, gr);
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: T[kind].face }, gr);
  const tx = el('text', { x: 0, y: 19, 'text-anchor': 'middle', 'font-family': FONT, 'font-weight': WEIGHT, 'font-size': 54, fill: T.ink }, gr);
  tx.textContent = name;
}

// a rubber stamp print. u 0..1: lifts and winds up (0–0.25), slams down (0.25–0.45, stretched
// as it falls), squashes on impact and springs back to rest (0.45–1). Prints stay at u = 1.
export function stamp(svg, cx, cy, word, color, u, { w = 168, h = 82, rot = -9, size = 54 } = {}) {
  if (u <= 0) return;
  let scale, squash = 1, lift = 0;
  if (u < 0.25) {
    const k = Math.sin((Math.PI / 2) * (u / 0.25));
    scale = 1.25 + 0.35 * k; lift = -40 * k; squash = 1 - 0.08 * k; // anticipation: up and narrow
  } else if (u < 0.45) {
    const k = easeInQuad((u - 0.25) / 0.2);
    scale = 1.6 - 0.6 * k; lift = -40 * (1 - k); squash = 0.92 - 0.06 * k; // stretched fall
  } else {
    const k = (u - 0.45) / 0.55;
    scale = 1; squash = 1 + 0.22 * Math.exp(-6 * k) * Math.cos(3 * Math.PI * k); // impact squash + spring
  }
  const gr = group(svg, cx, cy + lift, { scale, squash, rot });
  const ink = u < 0.45 ? 0.55 : 1;
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: 'rgb(28, 66, 51)', opacity: 0.94 }, gr);
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: color, 'fill-opacity': 0.22 * ink, stroke: color, 'stroke-width': 8, opacity: ink }, gr);
  el('rect', { x: -w / 2 + 9, y: -h / 2 + 9, width: w - 18, height: h - 18, rx: 6, fill: 'none', stroke: color, 'stroke-width': 2.5, opacity: ink }, gr);
  const tx = el('text', { x: 0, y: size * 0.36, 'text-anchor': 'middle', 'font-family': FONT, 'font-weight': 800, 'font-size': size, fill: color, opacity: ink, 'letter-spacing': 2 }, gr);
  tx.textContent = word;
}

export const impact = (u) => clamp01((u - 0.45) / 0.4); // 0..1 after the stamp lands (for dust)
export { spring };
