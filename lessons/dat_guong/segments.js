// Seven-segment display made of wooden bars (SVG polygons), and a glass mirror standing on it.
// Geometry is in "digit units" (a digit is 1 tall); a display is placed with ox, oy, U (px per unit).
// Colours come from THEME.tiles: int = cream wood (what is really there), dec = mint wood (reflection).
import { THEME } from '../../shared/web/theme.js';
import { CHALK } from '../../shared/web/js/chalk.js';

const NS = 'http://www.w3.org/2000/svg';
const T = THEME.tiles;
export const TH = 0.12; // bar thickness
const G = 0.025; // gap between bars
export const W8 = 0.56; // width of an 8
const WP = 0.5; // width of a +
const GAP_IN = 0.16; // gap between digits of one number
const GAP_OP = 0.3; // gap around the +

const hexH = (x0, x1, y) => [[x0, y], [x0 + TH / 2, y - TH / 2], [x1 - TH / 2, y - TH / 2], [x1, y], [x1 - TH / 2, y + TH / 2], [x0 + TH / 2, y + TH / 2]];
const hexV = (x, y0, y1) => [[x, y0], [x + TH / 2, y0 + TH / 2], [x + TH / 2, y1 - TH / 2], [x, y1], [x - TH / 2, y1 - TH / 2], [x - TH / 2, y0 + TH / 2]];

// bars of one glyph in local coordinates (x from 0 to its width)
const GLYPHS = {
  1: { w: TH, bars: () => [hexV(TH / 2, G, 0.5 - G), hexV(TH / 2, 0.5 + G, 1 - G)] },
  8: {
    w: W8,
    bars: () => {
      const l = TH / 2, r = W8 - TH / 2;
      return [
        hexH(l + G, r - G, TH / 2), hexH(l + G, r - G, 0.5), hexH(l + G, r - G, 1 - TH / 2),
        hexV(l, TH / 2 + G, 0.5 - G), hexV(l, 0.5 + G, 1 - TH / 2 - G),
        hexV(r, TH / 2 + G, 0.5 - G), hexV(r, 0.5 + G, 1 - TH / 2 - G),
      ];
    },
  },
  '+': {
    w: WP,
    bars: () => [hexV(WP / 2, 0.25, 0.75), hexH(0, WP, 0.5)], // solid cross (a gap would read as ÷)
  },
};

// lay out a string of glyphs: returns { bars: [{pts, glyph, index}], cells: [{ch, x0, x1}], width }
export function layout(str) {
  const bars = [];
  const cells = [];
  let x = 0;
  [...str].forEach((ch, i) => {
    if (i > 0) x += ch === '+' || str[i - 1] === '+' ? GAP_OP : GAP_IN;
    const gl = GLYPHS[ch];
    gl.bars().forEach((pts) => bars.push({ pts: pts.map(([px, py]) => [px + x, py]), glyph: i }));
    cells.push({ ch, x0: x, x1: x + gl.w });
    x += gl.w;
  });
  return { bars, cells, width: x };
}

// keep the part of a polygon with x <= m (one Sutherland–Hodgman edge)
export function clipLeft(pts, m) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const ina = a[0] <= m + 1e-9, inb = b[0] <= m + 1e-9;
    if (ina) out.push(a);
    if (ina !== inb) {
      const k = (m - a[0]) / (b[0] - a[0]);
      out.push([m, a[1] + k * (b[1] - a[1])]);
    }
  }
  return out.length >= 3 ? out : null;
}

// what the eye sees with the mirror at x = m: the bars left of m, plus their reflection
export function mirrored(bars, m) {
  const left = bars.map((b) => ({ ...b, pts: clipLeft(b.pts, m) })).filter((b) => b.pts);
  return { left, refl: left.map((b) => ({ ...b, pts: b.pts.map(([x, y]) => [2 * m - x, y]) })) };
}

export const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

// an SVG for wooden bars inside an objects() layer
export function woodSvg(objs) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', THEME.canvas.width);
  svg.setAttribute('height', THEME.canvas.height);
  svg.setAttribute('class', 'layer');
  objs.appendChild(svg);
  return svg;
}

function poly(svg, pts, fill, extra = {}) {
  const e = document.createElementNS(NS, 'polygon');
  e.setAttribute('points', pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
  e.setAttribute('fill', fill);
  for (const [k, v] of Object.entries(extra)) e.setAttribute(k, v);
  svg.appendChild(e);
}

// one wooden bar. pts in px. scale/squash about its centre, dy lift in px
export function woodBar(svg, pts, { kind = 'int', scale = 1, squash = 1, dx = 0, dy = 0 } = {}) {
  if (scale <= 0) return;
  const [cx, cy] = centroid(pts);
  const sx = scale * squash, sy = scale / Math.sqrt(squash);
  const p = pts.map(([x, y]) => [cx + (x - cx) * sx + dx, cy + (y - cy) * sy + dy]);
  const depth = 5;
  poly(svg, p.map(([x, y]) => [x + 4, y + 12]), 'rgba(0,0,0,0.32)');
  poly(svg, p.map(([x, y]) => [x, y + depth]), T[kind].edge);
  poly(svg, p, T[kind].face);
}

// glass mirror standing on the line x (px), from y0 to y1 (px)
export function glass(svg, x, y0, y1, { scale = 1, squash = 1, dy = 0, shine = 0 } = {}) {
  if (scale <= 0) return;
  const w = 18 * scale * squash;
  const h = (y1 - y0) * scale / Math.sqrt(squash);
  const cy = (y0 + y1) / 2 + dy + ((y1 - y0) - h) / 2; // stands on its foot
  const top = cy - h / 2;
  const rect = (x0, t0, ww, hh, fill, rx = 5) => {
    const e = document.createElementNS(NS, 'rect');
    Object.entries({ x: x0, y: t0, width: ww, height: hh, rx, fill }).forEach(([k, v]) => e.setAttribute(k, v));
    svg.appendChild(e);
  };
  rect(x - w / 2 + 5, top + 12, w, h, 'rgba(0,0,0,0.3)');
  rect(x - w / 2, top + 5, w, h, 'rgb(96, 140, 176)');
  rect(x - w / 2, top, w, h, 'rgb(178, 218, 242)');
  rect(x - w / 2 + 3, top + 8, Math.max(2, w * 0.28), h - 16, 'rgba(255,255,255,0.75)', 2);
  if (shine > 0 && shine < 1) {
    // a glint sliding down the glass
    const gy = top + h * shine;
    rect(x - w / 2 - 2, gy - 10, w + 4, 20, 'rgba(255,255,255,0.85)', 8);
  }
}

export const MIRROR_COLOR = CHALK.blue;
