// Board effects for this lesson (sparks, tick/cross, hop, wind-up shrink, side arcs).
// Lesson-neutral; the first four are the same recipes as lessons/chia_hai_chu_so/fx.js.
import { CHALK } from '../../../shared/web/js/chalk.js';
import { clamp01, spring } from '../../../shared/web/js/ease.js';

export const g = (p, k) => (k in p ? p[k] : 1);

// little chalk spark strokes around a point, drawn on with t (they stay)
export function sparks(L, cx, cy, r0, r1, t, { n = 8, color = CHALK.yellow, seed = 0 } = {}) {
  if (t <= 0) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * 2 * Math.PI + 0.2;
    const ti = clamp01(t * 1.6 - (i / n) * 0.6);
    L.line([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)],
      { color, width: 7, t: ti, seed: seed + i });
  }
}

// a burst of strokes flying outward and shrinking away (gone at u = 1)
export function burst(L, cx, cy, r, u, { color = CHALK.yellow, n = 8, seed = 0 } = {}) {
  if (u <= 0 || u >= 1) return;
  const d = r * (0.8 + 0.7 * Math.sqrt(u));
  const len = r * 0.45 * (1 - u);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI + 0.3;
    const c = Math.cos(a), s = Math.sin(a);
    L.line([cx + d * c, cy + d * s], [cx + (d + len) * c, cy + (d + len) * s],
      { color, width: 9 * (1 - u) + 2, seed: seed + i });
  }
}

// green tick / red cross that springs in and throws a burst of chalk
export function mark(L, ok, x, y, t, { size = 76, seed = 0 } = {}) {
  if (t <= 0) return;
  const k = spring(t, 3, 6) * size;
  const color = ok ? CHALK.green : CHALK.red;
  const draw = clamp01(t * 3);
  if (ok) {
    L.poly([[x - 0.55 * k, y], [x - 0.12 * k, y + 0.45 * k], [x + 0.62 * k, y - 0.55 * k]],
      { color, width: 15, t: draw, seed, amp: 1 });
  } else {
    L.line([x - 0.45 * k, y - 0.45 * k], [x + 0.45 * k, y + 0.45 * k], { color, width: 15, t: clamp01(draw * 2), seed });
    L.line([x + 0.45 * k, y - 0.45 * k], [x - 0.45 * k, y + 0.45 * k], { color, width: 15, t: clamp01(draw * 2 - 1), seed: seed + 1 });
  }
  burst(L, x, y, size * 0.9, clamp01((t - 0.15) / 0.6), { color, seed: seed + 5 });
}

// picked up and put back: small dip (anticipation), hop up, spring back down
export function hopY(u, h = 46) {
  if (u <= 0 || u >= 1) return 0;
  if (u < 0.15) return 8 * Math.sin((Math.PI * u) / 0.15);
  const k = (u - 0.15) / 0.85;
  return -h * Math.sin(Math.PI * Math.min(1, k / 0.6)) * (k < 0.6 ? 1 : 0)
    + (k >= 0.6 ? 10 * Math.exp(-6 * (k - 0.6)) * Math.sin(5 * Math.PI * (k - 0.6)) : 0);
}

// wind up to 1.15, then shrink to 0 (o = 0..1); with spring-in s
export function outScale(s, o) {
  const k = o < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (o / 0.3)) : 1.15 * (1 - (o - 0.3) / 0.7);
  return spring(s, 3.2, 6) * Math.max(0, k);
}

// chalk arrow bulging sideways (quadratic curve), drawn on with v; head at `to`
export function sideArc(L, from, to, bulge, v, { color = CHALK.yellow, width = 7, seed = 0 } = {}) {
  v = clamp01(v);
  if (v <= 0) return;
  const c = [(from[0] + to[0]) / 2 + bulge, (from[1] + to[1]) / 2];
  const q = (s) => [
    (1 - s) ** 2 * from[0] + 2 * (1 - s) * s * c[0] + s * s * to[0],
    (1 - s) ** 2 * from[1] + 2 * (1 - s) * s * c[1] + s * s * to[1],
  ];
  const pts = Array.from({ length: 25 }, (_, i) => q((i / 24) * v));
  L.poly(pts, { color, width, seed, amp: 0.6 });
  if (v < 1) return;
  const [x0, y0] = q(0.9);
  const a = Math.atan2(to[1] - y0, to[0] - x0);
  for (const s of [-1, 1]) {
    L.line(to, [to[0] - 28 * Math.cos(a + s * 0.5), to[1] - 28 * Math.sin(a + s * 0.5)], { color, width, seed: seed + 2 + s });
  }
}
