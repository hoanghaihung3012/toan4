// Lesson-neutral board effects (drop-ins, dust, sparks, tick/cross, hops, number blocks,
// arcs, thinking dots, countdown, in-scene band wipes). Grown from the chia_hai_chu_so
// lesson's fx.js so new lessons can import them from the shared engine.
import { CHALK, ChalkLayer } from './chalk.js';
import { clamp01, lerp, easeInQuad, easeOutCubic, arcPoint, stagger, spring, rng } from './ease.js';
import { tile, TILE_W, TILE_H, GAP } from './tiles.js';
import { drawEraser, wipePose, sweptMask, sweepOff } from './eraser.js';

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
export function dust(L, x, y, u, seed, scale, halfW = TILE_W * scale * 0.35) {
  if (u <= 0 || u >= 0.999) return; // (1 - 0.55) / 0.45 rounds to just under 1
  const r = rng(seed);
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1;
    const a = (0.1 + r() * 0.6) * Math.PI;
    const d = 20 + 110 * Math.sqrt(u) + r() * 40;
    const px = x + side * (halfW + d * Math.cos(a * 0.5));
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

// squash/stretch that goes with hopY: squat before take-off, stretch in the air, squash on landing
export function hopSquash(u) {
  if (u <= 0 || u >= 1) return 1;
  if (u < 0.15) return 1 - 0.14 * Math.sin((Math.PI * u) / 0.15);
  const k = (u - 0.15) / 0.85;
  if (k < 0.6) return 1 + 0.1 * Math.sin(Math.PI * (k / 0.6));
  return 1 - 0.16 * Math.exp(-6 * (k - 0.6)) * Math.sin(Math.PI * Math.min(1, (k - 0.6) / 0.2));
}

// wind up to 1.15, then shrink to 0 (o = 0..1); with spring-in s
export function outScale(s, o) {
  const k = o < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (o / 0.3)) : 1.15 * (1 - (o - 0.3) / 0.7);
  return spring(s, 3.2, 6) * Math.max(0, k);
}

// --- whole-number blocks: one wooden block per number, wider for more digits ---------
export const numW = (digits) => TILE_W + (digits - 1) * 50;

export function numTile(objs, x, y, s, kind = 'int', { scale = 1, squash = 1, digits = s.length } = {}) {
  const d = tile(objs, x, y, s, kind, { scale, squash });
  if (!d) return null;
  const w = numW(digits);
  d.style.width = `${w}px`;
  d.style.left = `${x - w / 2}px`;
  return d;
}

// centres of a row of number blocks (digit counts) centred on cx
export function blockXs(counts, cx, gap, scale = 1) {
  const ws = counts.map((n) => numW(n) * scale);
  const total = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  let x = cx - total / 2;
  return ws.map((w) => { const c = x + w / 2; x += w + gap; return c; });
}

// chalk arc with a head in any colour, drawn on with v (0..1)
export function arc(L, from, to, lift, v, { color = CHALK.yellow, width = 6, head = 24, seed = 0 } = {}) {
  v = clamp01(v);
  if (v <= 0) return;
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push(arcPoint(from, to, (i / 24) * v, lift));
  L.poly(pts, { color, width, seed, amp: 0.6 });
  const ht = clamp01((v - 0.85) / 0.15);
  if (ht <= 0) return;
  const [x0, y0] = arcPoint(from, to, 0.93, lift);
  const a = Math.atan2(to[1] - y0, to[0] - x0);
  for (const s of [-1, 1]) {
    L.line(to, [to[0] - head * Math.cos(a + s * 0.5), to[1] - head * Math.sin(a + s * 0.5)],
      { color, width, t: ht, seed: seed + 2 + s });
  }
}

// three "thinking" dots that pop in one by one, then shrink away together (gone at u = 1)
export function thinkingDots(L, cx, y, u, { gap = 70, r = 14, color = CHALK.yellow } = {}) {
  if (u <= 0 || u >= 1) return;
  for (let i = 0; i < 3; i++) {
    const s = clamp01((u - i * 0.18) / 0.3);
    const k = outScale(s, clamp01((u - 0.78) / 0.22));
    if (k > 0) L.loop(cx + (i - 1) * gap, y, r * k * 0.5, r * k * 0.5, { color, width: r * k * 1.2, seed: 900 + i });
  }
}

// countdown 3, 2, 1: each pops in and shrinks away; nothing left at c = 1
export function countdown(L, x, y, c, { size = 320, color = CHALK.yellow } = {}) {
  [3, 2, 1].forEach((n, i) => {
    const u = clamp01(c * 3 - i);
    if (u <= 0 || u >= 1) return;
    const k = u < 0.6 ? spring(u / 0.6, 3, 6) : 1.1 * (1 - easeInQuad((u - 0.6) / 0.4));
    L.text(String(n), x, y + size * 0.3, { size, color, align: 'center', scale: k });
  });
}

// chalk write-on with a short pop (labels such as "+12")
export function popLabel(L, s, x, y, u, { size = 70, color = CHALK.yellow, pulse = 0 } = {}) {
  if (u <= 0) return;
  const k = spring(u, 3, 6) * (1 + 0.28 * Math.sin(Math.PI * clamp01(pulse)));
  L.text(s, x, y, { size, color, align: 'center', scale: k, t: easeOutCubic(clamp01(u * 2)) });
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
