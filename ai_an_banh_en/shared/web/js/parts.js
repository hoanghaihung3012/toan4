// Reusable board parts built on chalk.js / ease.js (no lesson content here):
//   row()      chalk equation written left to right, with drawn × and − (Pangolin's read badly)
//   bar()      wooden bar of any height standing on a base line (tile styles: int | dec | blank)
//   arcArrow() yellow chalk arc with a head, drawn on with v
//   flight()   arc move with anticipation dip and landing squash -> {x, y, squash, v}
import { CHALK, measure } from './chalk.js';
import { clamp01, easeInOut, arcPoint, landSquash } from './ease.js';

// A chalk row of parts: a string, {s, color, size} or a drawn symbol {sym: 'times' | 'minus'}
// (Pangolin's × and − read badly on a phone). Writes on left to right with t.
// Returns the centre x of every part, so a part can be circled.
export function row(L, parts, x0, y, { size = 72, t = 1, seed = 0, align = 'center', gap: gapK = 0.24 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gapK;
  const widths = items.map((q) => (q.sym ? size * 0.42 : measure(q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = align === 'center' ? x0 - total / 2 : x0;
  const xs = [];
  items.forEach((q, i) => {
    const ti = clamp01(t * items.length - i);
    const w = widths[i];
    const c = [x + w / 2, y - size * 0.3];
    xs.push(c[0]);
    const o = { color: q.color, width: size * 0.075, seed: seed + i };
    if (ti > 0 && q.sym === 'times') {
      const r = size * 0.16;
      L.line([c[0] - r, c[1] - r], [c[0] + r, c[1] + r], { ...o, t: clamp01(ti * 2) });
      L.line([c[0] + r, c[1] - r], [c[0] - r, c[1] + r], { ...o, t: clamp01(ti * 2 - 1) });
    } else if (ti > 0 && q.sym === 'minus') {
      L.line([x, c[1]], [x + w, c[1]], { ...o, t: ti });
    } else if (ti > 0) {
      L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti });
    }
    x += w + gap;
  });
  return xs;
}

// a wooden bar standing on `base`, h px tall (kind: int | dec | blank)
export function bar(objs, x, base, h, kind = 'int', w = 150, squash = 1) {
  if (h <= 0) return;
  const d = document.createElement('div');
  d.className = `tile ${kind}`;
  d.style.left = `${x - w / 2}px`;
  d.style.top = `${base - h}px`;
  d.style.width = `${w}px`;
  d.style.height = `${h}px`;
  d.style.transformOrigin = '50% 100%';
  if (squash !== 1) d.style.transform = `scale(${1 / Math.sqrt(squash)}, ${squash})`;
  objs.appendChild(d);
}

// yellow chalk arc with a head, drawn on with v (0..1)
export function arcArrow(L, from, to, lift, v, seed) {
  v = clamp01(v);
  if (v <= 0) return;
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push(arcPoint(from, to, (i / 24) * v, lift));
  L.poly(pts, { color: CHALK.yellow, width: 5, seed, amp: 0.6 });
  if (v < 1) return;
  const [x0, y0] = arcPoint(from, to, 0.93, lift);
  const a = Math.atan2(to[1] - y0, to[0] - x0);
  for (const s of [-1, 1]) {
    L.line(to, [to[0] - 26 * Math.cos(a + s * 0.5), to[1] - 26 * Math.sin(a + s * 0.5)],
      { color: CHALK.yellow, width: 5, seed: seed + 2 + s });
  }
}

// a piece flying along an arc: anticipation dip, ease-in-out arc, landing squash
export function flight(from, to, u, lift) {
  if (u < 0.15) {
    const a = Math.sin((Math.PI * u) / 0.15);
    return { x: from[0], y: from[1] + 10 * a, squash: 1 - 0.14 * a, v: 0 };
  }
  const v = easeInOut((u - 0.15) / 0.85);
  const [x, y] = arcPoint(from, to, v, lift);
  return { x, y, squash: landSquash(v, 0.2, 0.22), v };
}
