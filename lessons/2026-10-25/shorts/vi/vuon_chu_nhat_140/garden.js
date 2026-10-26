// A rectangular garden (grass + wooden fence) and wooden planks, drawn in SVG inside an
// objects() layer. Plank colours come from THEME.tiles: int = cream wood (length), dec = mint
// wood (width). Every size is in px on the 1080 board.
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01 } from '../../../../../shared/web/js/ease.js';

const NS = 'http://www.w3.org/2000/svg';
const T = THEME.tiles;
export const THICK = 18; // plank / fence thickness
const GRASS = ['rgb(104, 160, 84)', 'rgb(92, 146, 74)', 'rgb(64, 110, 52)'];

function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

export function woodSvg(objs) {
  return el('svg', { class: 'layer', width: THEME.canvas.width, height: THEME.canvas.height }, objs);
}

// one wooden plank centred on (cx, cy), `len` long, turned by `angle` degrees.
// scale/squash about its centre (squash > 1 = flatter and wider)
export function plank(svg, cx, cy, len, { kind = 'int', angle = 0, scale = 1, squash = 1, thick = THICK } = {}) {
  if (scale <= 0 || len <= 0) return;
  const w = len * scale * squash, h = thick * scale / Math.sqrt(squash);
  const gr = el('g', { transform: `translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${angle.toFixed(2)})` }, svg);
  el('rect', { x: -w / 2 + 4, y: -h / 2 + 10, width: w, height: h, rx: h / 2, fill: 'rgba(0,0,0,0.3)' }, gr);
  el('rect', { x: -w / 2, y: -h / 2 + 5, width: w, height: h, rx: h / 2, fill: T[kind].edge }, gr);
  el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: T[kind].face }, gr);
  el('rect', { x: -w / 2 + h * 0.5, y: -h / 2 + 3, width: Math.max(0, w - h), height: h * 0.25, rx: h * 0.12, fill: T.highlight }, gr);
}

// grass inside the box [l, t, r, b]; `fill` 0..1 grows the grass left to right (area cue)
export function grass(svg, l, t, r, b, { fill = 1, glow = 0 } = {}) {
  const f = clamp01(fill);
  if (f <= 0) return;
  const w = (r - l) * f;
  el('rect', { x: l, y: t, width: w, height: b - t, fill: GRASS[0], opacity: 0.92 }, svg);
  // mown stripes
  const n = Math.max(2, Math.round((r - l) / 60));
  for (let i = 0; i < n; i += 2) {
    const x0 = l + ((r - l) * i) / n;
    if (x0 >= l + w) break;
    el('rect', { x: x0, y: t, width: Math.min((r - l) / n, l + w - x0), height: b - t, fill: GRASS[1], opacity: 0.9 }, svg);
  }
  if (glow > 0) el('rect', { x: l, y: t, width: w, height: b - t, fill: 'rgb(250, 222, 110)', opacity: 0.35 * glow }, svg);
}

// the fence around [l, t, r, b]: four planks; pose(side) -> {kind, scale, squash, dy}
// sides: 'top', 'bottom' (the lengths), 'left', 'right' (the widths)
export function fence(svg, l, t, r, b, pose = () => ({})) {
  const sides = {
    top: [(l + r) / 2, t, r - l + THICK, 0],
    bottom: [(l + r) / 2, b, r - l + THICK, 0],
    left: [l, (t + b) / 2, b - t + THICK, 90],
    right: [r, (t + b) / 2, b - t + THICK, 90],
  };
  for (const [side, [cx, cy, len, angle]] of Object.entries(sides)) {
    const { kind = 'int', scale = 1, squash = 1, dy = 0, hide = false } = pose(side);
    if (!hide) plank(svg, cx, cy + dy, len, { kind, angle, scale, squash });
  }
}
