// Easings and motion helpers. Every helper maps progress 0..1; no linear moves on screen.

export const clamp01 = (t) => Math.max(0, Math.min(1, t));
export const lerp = (a, b, t) => a + (b - a) * t;

export const easeOutCubic = (t) => 1 - (1 - clamp01(t)) ** 3;
export const easeInCubic = (t) => clamp01(t) ** 3;
export const easeInQuad = (t) => clamp01(t) ** 2;
export function easeInOut(t) {
  t = clamp01(t);
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

// 0 -> 1 with overshoot, settles at 1
export function spring(t, freq = 4.5, damp = 5.0) {
  t = clamp01(t);
  if (t >= 1) return 1;
  return 1 - Math.exp(-damp * t) * Math.cos(freq * Math.PI * t);
}

// dips below 0 first (anticipation), then springs to 1
export function anticipateSpring(t, back = 0.15, split = 0.2) {
  t = clamp01(t);
  if (t < split) return -back * Math.sin((Math.PI * t) / split / 2);
  return -back + (1 + back) * spring((t - split) / (1 - split));
}

// parabolic arc from p0 to p1 (lift > 0 arcs upward)
export function arcPoint(p0, p1, t, lift = 120) {
  return [lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t) - lift * 4 * t * (1 - t)];
}

// local progress of item i of n inside one shared window (each item takes `span`)
export function stagger(prog, i, n, span = 0.45) {
  const start = n > 1 ? (i * (1 - span)) / (n - 1) : 0;
  return clamp01((prog - start) / span);
}

// object pop: scale springs in, squash wobbles after the overshoot
export function pop(u) {
  if (u <= 0) return { scale: 0, squash: 1 };
  if (u >= 1) return { scale: 1, squash: 1 };
  const scale = spring(u, 3.2, 6);
  const land = clamp01((u - 0.3) / 0.5);
  const squash = 1 - 0.16 * Math.sin(Math.PI * land) * (1 - land);
  return { scale, squash };
}

// landing squash in the last `tail` of a move
export function landSquash(u, tail = 0.2, amount = 0.2) {
  if (u <= 1 - tail || u >= 1) return 1;
  const k = (u - (1 - tail)) / tail;
  return 1 - amount * Math.sin(Math.PI * k);
}

// deterministic RNG so every frame draws the same wobble
export function rng(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
