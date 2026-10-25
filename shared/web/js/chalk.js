// Chalk drawing in SVG. A ChalkLayer is one <svg> whose group carries the chalk-grain
// filter (#chalk50 / #chalk60 / #chalk100 in index.html). Every write-on takes t in 0..1;
// t = 1 is the key pose.
import { clamp01, rng } from './ease.js';
import { THEME } from '../theme.js';

export const W = THEME.canvas.width;
export const H = THEME.canvas.height;
const NS = 'http://www.w3.org/2000/svg';
const CHALK_FONT = THEME.fonts.chalk.family;

export const CHALK = THEME.chalk;

let uid = 0;
export const resetIds = () => { uid = 0; };

const canvas = document.createElement('canvas');
const mctx = canvas.getContext('2d');
export function measure(s, size, family = CHALK_FONT, weight = 400) {
  mctx.font = `${weight} ${size}px "${family}"`;
  return mctx.measureText(s).width;
}

function el(name, attrs = {}, parent = null) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

// hand-drawn polyline: subdivide each segment and jitter it slightly
export function wobblyPath(points, seed = 0, amp = 2, step = 18) {
  const r = rng(seed + 1);
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let k = 0; k + 1 < points.length; k++) {
    const [x0, y0] = points[k];
    const [x1, y1] = points[k + 1];
    const n = Math.max(1, Math.floor(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let i = 1; i <= n; i++) {
      const u = i / n;
      const j = i === n ? 0 : amp;
      const x = x0 + (x1 - x0) * u + (r() * 2 - 1) * j;
      const y = y0 + (y1 - y0) * u + (r() * 2 - 1) * j;
      d += `L${x.toFixed(1)},${y.toFixed(1)}`;
    }
  }
  return d;
}

export class ChalkLayer {
  constructor(parent, strength = 60) {
    this.svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'layer' });
    parent.appendChild(this.svg);
    this.g = el('g', { filter: `url(#chalk${strength})` }, this.svg);
  }

  // text revealed left-to-right by a clip sweep; (x, y) is the baseline
  text(s, x, y, { size = 72, color = CHALK.white, t = 1, align = 'left', family = CHALK_FONT,
    scale = 1 } = {}) {
    const w = measure(s, size, family);
    if (align === 'center') x -= w / 2;
    else if (align === 'right') x -= w;
    t = clamp01(t);
    if (t <= 0 || scale <= 0) return w;
    const id = `clip${uid++}`;
    const cp = el('clipPath', { id }, this.svg);
    el('rect', { x: x - 10, y: y - size * 1.4, width: (w + 20) * t, height: size * 2.1 }, cp);
    let parent = this.g;
    if (scale !== 1) {
      const cx = x + w / 2;
      const cy = y - size * 0.35;
      parent = el('g', { transform: `translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})` }, this.g);
    }
    const te = el('text', {
      x, y, fill: color, 'font-family': family, 'font-size': size, 'clip-path': `url(#${id})`,
    }, parent);
    te.textContent = s;
    return w;
  }

  // stroke a path, drawn on from its start to fraction t
  path(d, { color = CHALK.white, width = 6, t = 1 } = {}) {
    t = clamp01(t);
    if (t <= 0) return;
    const attrs = {
      d, fill: 'none', stroke: color, 'stroke-width': width,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    };
    if (t < 1) {
      attrs.pathLength = 1000;
      attrs['stroke-dasharray'] = `${(t * 1000).toFixed(2)} 3000`;
    }
    return el('path', attrs, this.g);
  }

  line(p0, p1, { color, width = 6, t = 1, seed = 0 } = {}) {
    this.path(wobblyPath([p0, p1], seed), { color, width, t });
  }

  poly(pts, { color, width = 6, t = 1, seed = 0, amp = 2 } = {}) {
    this.path(wobblyPath(pts, seed, amp), { color, width, t });
  }

  rect(l, top, r, b, { color, width = 4, t = 1, seed = 0 } = {}) {
    this.poly([[l, top], [r, top], [r, b], [l, b], [l, top]], { color, width, t, seed, amp: 1.2 });
  }

  // teacher's circle: overshoots its start a little
  loop(cx, cy, rx, ry, { color, width = 6, t = 1, seed = 0 } = {}) {
    const r = rng(seed + 7);
    const pts = [];
    const n = 48;
    for (let i = 0; i < n + 5; i++) {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      const k = 1 + (r() * 2 - 1) * 0.015 + (0.04 * i) / n;
      pts.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)]);
    }
    this.path(wobblyPath(pts, seed, 0.8, 30), { color, width, t });
  }

  // drawn arrow (the fonts have no arrow glyph)
  arrow(p0, p1, { color, width = 6, t = 1, seed = 0, head = 26 } = {}) {
    this.line(p0, p1, { color, width, t: Math.min(1, t * 1.25), seed });
    const ht = clamp01((t - 0.8) / 0.2);
    if (ht <= 0) return;
    const a = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
    for (const s of [-1, 1]) {
      const q = [p1[0] - head * Math.cos(a + s * 0.5), p1[1] - head * Math.sin(a + s * 0.5)];
      this.line(p1, q, { color, width, t: ht, seed: seed + s });
    }
  }

  // straight dashed guide that grows from p0 toward p1
  dashed(p0, p1, { color = CHALK.red, width = 3.5, on = 14, off = 11, t = 1 } = {}) {
    t = clamp01(t);
    if (t <= 0) return;
    const x1 = p0[0] + (p1[0] - p0[0]) * t;
    const y1 = p0[1] + (p1[1] - p0[1]) * t;
    el('path', {
      d: `M${p0[0]},${p0[1]}L${x1},${y1}`, stroke: color, 'stroke-width': width,
      'stroke-dasharray': `${on} ${off}`, 'stroke-linecap': 'round', fill: 'none',
    }, this.g);
  }
}
