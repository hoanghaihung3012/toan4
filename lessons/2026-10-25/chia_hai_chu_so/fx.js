// Board effects shared by this lesson's beats (drop-ins, dust, sparks, tick/cross, lifts,
// in-scene band wipes). Lesson-neutral, so they can move into shared/web/js/parts.js later.
import { CHALK, ChalkLayer } from '../../../shared/web/js/chalk.js';
import { clamp01, lerp, easeInQuad, stagger, spring, rng } from '../../../shared/web/js/ease.js';
import { tile, TILE_W, TILE_H, GAP } from '../../../shared/web/js/tiles.js';
import { drawEraser, wipePose, sweptMask, sweepOff } from '../../../shared/web/js/eraser.js';

export const g = (p, k) => (k in p ? p[k] : 1);

// centres of a tile number, centred on cx
export function tileXs(s, cx, scale) {
  const step = (TILE_W + GAP) * scale;
  return [...s].map((_, i) => cx + (i - (s.length - 1) / 2) * step);
}

// a tile falling in from above: easeInQuad drop, squash on impact, spring back up
export function dropPose(u, y, height = 520) {
  if (u <= 0) return null;
  const fall = 0.55;
  if (u < fall) {
    const k = easeInQuad(u / fall);
    return { y: lerp(y - height, y, k), squash: 1 + 0.12 * k }; // stretched while falling
  }
  const k = (u - fall) / (1 - fall);
  const s = 1 - 0.26 * Math.exp(-5 * k) * Math.cos(3.2 * Math.PI * k); // squash, then spring
  return { y: y + 14 * (1 - s), squash: s };
}

// chalk dust kicked out sideways when a tile lands; flies out and shrinks away
export function dust(L, x, y, u, seed, scale) {
  if (u <= 0 || u >= 1) return;
  const r = rng(seed);
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1;
    const a = (0.1 + r() * 0.6) * Math.PI;
    const d = 20 + 110 * Math.sqrt(u) + r() * 40;
    const px = x + side * (TILE_W * scale * 0.35 + d * Math.cos(a * 0.5));
    const py = y - d * Math.sin(a) * 0.6 + 70 * u * u;
    const len = 26 * (1 - u) + 4;
    L.line([px, py], [px + side * len, py - len * 0.3], { width: 12 * (1 - u) + 2, seed: seed + i });
  }
}

// tiles of a number dropping in one after another, with landing dust
export function dropTiles(objs, L, s, xs, y, prog, scale, seed, height = 520) {
  [...s].forEach((ch, i) => {
    const u = stagger(prog, i, s.length, 0.4);
    const pose = dropPose(u, y, height);
    if (pose) tile(objs, xs[i], pose.y, ch, 'int', { scale, squash: pose.squash });
    dust(L, xs[i], y + TILE_H * scale * 0.5, clamp01((u - 0.55) / 0.45), seed + i * 7, scale);
  });
}

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

// a tile picked up and put back: small dip (anticipation), hop up, spring back down
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

// erase part of the board in-scene: old content (chalk and tiles) drawn into its own
// box, swept off by the eraser across band [y0, y1]
export function bandWipe(ctx, prog, band, draw, cycles = 3) {
  if (prog >= 1) return;
  const box = ctx.objects();
  const sub = {
    fx: ctx.fx,
    chalk: (k = 60) => new ChalkLayer(box, k),
    objects: () => {
      const d = document.createElement('div');
      d.className = 'objects';
      box.appendChild(d);
      return d;
    },
  };
  draw(sub);
  if (prog <= 0) return;
  sweepOff(box, prog, band, cycles, sweptMask(prog, band, cycles, 130, 200));
  drawEraser(ctx.fx, wipePose(prog, band, cycles).pose);
}
