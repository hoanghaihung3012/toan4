// Chalk phoenix that flies once across a phrase. Used by solutionIntro() in parts.js.
import { CHALK } from './chalk.js';
import { clamp01, easeInOut, easeInQuad, easeOutCubic } from './ease.js';
import { burst, sparks } from './fx.js';

const WING_LENGTHS = [100, 128, 140, 132, 112, 90];
const NEAR_PALETTE = [CHALK.yellow, CHALK.pink, CHALK.white, CHALK.blue, CHALK.yellow, CHALK.pink];
const FAR_PALETTE = [CHALK.blue, CHALK.white, CHALK.pink, CHALK.blue, CHALK.white, CHALK.pink];
const TAIL = [
  { side: -1, length: 215, color: CHALK.pink, width: 9, shift: 0 },
  { side: 0, length: 255, color: CHALK.yellow, width: 8, shift: 1.4 },
  { side: 1, length: 190, color: CHALK.blue, width: 7, shift: 2.7 },
];
const SPARKLE = [CHALK.yellow, CHALK.pink, CHALK.white, CHALK.blue];

const cubic = (p0, p1, p2, p3, u) => {
  const v = 1 - u;
  return [0, 1].map((k) => v ** 3 * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u ** 3 * p3[k]);
};

export function phoenix(L, t, { x, y, size, width }) {
  if (t <= 0.04) return;
  const u = clamp01((t - 0.04) / 0.92);
  const draw = easeOutCubic(clamp01((t - 0.03) / 0.16));
  const leave = easeInQuad(clamp01((t - 0.9) / 0.1));
  const scale = 1.05 * (1 - leave);
  const x0 = x - width / 2 - 140;
  const x1 = x + width / 2 + 255;
  const baseY = y - 3.6 * size;
  const path = (k) => {
    const q = clamp01(k);
    return [x0 + (x1 - x0) * easeInOut(q), baseY + 16 * Math.sin(q * Math.PI * 4)];
  };

  burst(L, x0 + 60, baseY, 120, clamp01((t - 0.04) / 0.2), { n: 10, color: CHALK.yellow, seed: 840 });
  burst(L, x1, baseY, 140, clamp01((t - 0.9) / 0.1), { n: 12, color: CHALK.pink, seed: 860 });
  if (scale < 0.02) return;

  const [bx, by] = path(u);
  const phase = u * Math.PI * 9;
  const pitch = 0.1 * Math.cos(u * Math.PI * 4);
  const cos = Math.cos(pitch);
  const sin = Math.sin(pitch);
  const at = ([px, py]) => [bx + scale * (px * cos - py * sin), by + scale * (px * sin + py * cos)];
  const curve = (from, c1, c2, to, color, strokeWidth, seed) => {
    const points = Array.from({ length: 15 }, (_, i) => at(cubic(from, c1, c2, to, i / 14)));
    L.poly(points, { color, width: strokeWidth, t: draw, seed, amp: 0.7 });
  };

  const wing = (shift, k, palette, seed, shoulder) => {
    const swing = Math.sin(phase + shift);
    const vel = Math.cos(phase + shift);
    const phi = -3.05 + 1.05 * swing;
    WING_LENGTHS.forEach((length, i) => {
      const a = phi + (i - 2.5) * 0.17;
      const dir = [Math.cos(a), Math.sin(a)];
      const perp = [-dir[1], dir[0]];
      const bow = 8 - 24 * vel;
      const reach = length * k;
      const pt = (d, b) => [shoulder[0] + dir[0] * reach * d + perp[0] * bow * b,
        shoulder[1] + dir[1] * reach * d + perp[1] * bow * b];
      curve(shoulder, pt(0.33, 0.8), pt(0.7, 1), pt(1, 0.6), palette[i % palette.length], 8 - i * 0.4, seed + i);
    });
    for (let i = 0; i < 5; i++) {
      const a = phi + (i - 2) * 0.2 + 0.05;
      const dir = [Math.cos(a), Math.sin(a)];
      const perp = [-dir[1], dir[0]];
      const reach = 62 * k;
      const bow = (8 - 24 * vel) * 0.4;
      curve(shoulder, [shoulder[0] + dir[0] * reach * 0.4, shoulder[1] + dir[1] * reach * 0.4],
        [shoulder[0] + dir[0] * reach * 0.8 + perp[0] * bow, shoulder[1] + dir[1] * reach * 0.8 + perp[1] * bow],
        [shoulder[0] + dir[0] * reach + perp[0] * bow, shoulder[1] + dir[1] * reach + perp[1] * bow],
        CHALK.white, 4, seed + 20 + i);
    }
  };

  // silk tail: three ribbons with a travelling wave, each ending in a peacock eye
  const ripple = u * Math.PI * 14;
  TAIL.forEach(({ side, length, color, width: strokeWidth, shift }, i) => {
    const points = Array.from({ length: 17 }, (_, j) => {
      const s = j / 16;
      return at([-52 - s * length, 4 + side * 34 * s + 22 * s * Math.sin(s * 5 - ripple + shift)]);
    });
    L.poly(points, { color, width: strokeWidth, t: draw, seed: 820 + i, amp: 0.7 });
    const [ex, ey] = points.at(-1);
    L.loop(ex, ey, 12 * scale, 9 * scale, { color, width: 5, t: draw, seed: 826 + i });
    L.dot(ex, ey, 3.2 * scale, { color: CHALK.white, t: draw });
  });

  wing(0.55, 0.8, FAR_PALETTE, 700, [12, -24]);

  // body, neck, head and beak as one flowing outline
  curve([-55, 4], [-35, -22], [10, -26], [38, -30], CHALK.white, 8, 800);
  curve([38, -30], [50, -40], [52, -58], [58, -72], CHALK.white, 8, 801);
  curve([58, -72], [62, -90], [80, -92], [88, -80], CHALK.white, 8, 802);
  curve([88, -80], [100, -78], [110, -74], [112, -70], CHALK.yellow, 8, 803);
  curve([112, -70], [104, -66], [96, -66], [89, -68], CHALK.yellow, 7, 804);
  curve([89, -68], [76, -58], [78, -40], [70, -22], CHALK.white, 8, 805);
  curve([70, -22], [66, 4], [30, 28], [-8, 20], CHALK.white, 8, 806);
  curve([-8, 20], [-30, 16], [-45, 10], [-55, 4], CHALK.white, 8, 807);
  L.dot(...at([77, -80]), 4.2 * scale, { color: CHALK.white, t: draw });
  curve([-20, 4], [-6, -2], [10, 0], [22, 8], CHALK.pink, 5, 808);
  curve([4, 12], [18, 6], [32, 8], [42, 16], CHALK.pink, 5, 809);
  curve([34, -2], [44, -8], [54, -6], [60, 2], CHALK.yellow, 5, 810);

  // three-plume crest
  const lean = 6 * Math.sin(phase * 0.5);
  curve([62, -90], [48, -104], [38, -116 - lean], [46, -132 - lean], CHALK.red, 6, 811);
  curve([68, -92], [66, -110], [64, -126], [70, -142 - lean], CHALK.yellow, 6, 812);
  curve([76, -90], [84, -104], [92, -112 + lean], [102, -124 + lean], CHALK.pink, 6, 813);
  [[46, -132 - lean, CHALK.red], [70, -142 - lean, CHALK.yellow], [102, -124 + lean, CHALK.pink]]
    .forEach(([cx, cy, color]) => L.dot(...at([cx, cy]), 4.5 * scale, { color, t: draw }));

  wing(0, 1, NEAR_PALETTE, 740, [24, -20]);

  // effects: glow rays, trailing sparkles, drifting feathers
  const [cx, cy] = at([10, -22]);
  sparks(L, cx, cy, 165, 200, clamp01((0.55 + 0.45 * Math.sin(phase * 0.7)) * draw * (1 - leave)),
    { n: 10, color: CHALK.yellow, seed: 880 });

  for (let k = 1; k <= 7; k++) {
    const q = u - k * 0.03;
    if (q <= 0) break;
    const [px, py] = path(q);
    const r = 17 * (1 - k / 8) * (1 - leave);
    const sx = px - 240 * scale;
    const sy = py + 10 * Math.sin(k * 1.7 + phase * 0.5);
    const color = SPARKLE[k % SPARKLE.length];
    L.line([sx - r, sy], [sx + r, sy], { color, width: 5, seed: 900 + k });
    L.line([sx, sy - r], [sx, sy + r], { color, width: 5, seed: 910 + k });
    L.line([sx - r * 0.6, sy - r * 0.6], [sx + r * 0.6, sy + r * 0.6], { color, width: 4, seed: 920 + k });
    L.line([sx + r * 0.6, sy - r * 0.6], [sx - r * 0.6, sy + r * 0.6], { color, width: 4, seed: 930 + k });
  }

  [0.22, 0.42, 0.62].forEach((born, i) => {
    const age = (u - born) / 0.3;
    if (age <= 0 || age >= 1) return;
    const [px, py] = path(born);
    const fx = px - 120 * scale - 30 * age;
    const fy = py + 30 + 190 * age * age + 14 * Math.sin(age * 9);
    const a = 0.9 + 0.6 * Math.sin(age * 9);
    const len = 46 * (1 - age);
    const color = [CHALK.pink, CHALK.yellow, CHALK.blue][i];
    const tip = [fx + len * Math.cos(a), fy + len * Math.sin(a)];
    L.poly([[fx, fy], [(fx + tip[0]) / 2 - 8, (fy + tip[1]) / 2 + 8], tip],
      { color, width: 6, seed: 940 + i, amp: 0.5 });
    L.line([fx, fy], [fx - 10 * Math.cos(a), fy - 10 * Math.sin(a)], { color, width: 4, seed: 950 + i });
  });
}

