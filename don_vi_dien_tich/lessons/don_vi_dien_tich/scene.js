// Đề-xi-mét vuông, mét vuông, mi-li-mét vuông (Toán 4). Facts: lessons/don_vi_dien_tich/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, lerp, stagger, spring, pop, easeInOut } from '../../shared/web/js/ease.js';
import { row } from '../../shared/web/js/parts.js';
import {
  g, burst, sparks, mark, hopY, hopSquash, outScale, countdown, popLabel,
} from '../../shared/web/js/fx.js';

// --- facts (story.md F1–F9), checked ------------------------------------------------
const PER = 100; // each area unit is 100 times the next smaller one (F4)
console.assert(10 * 10 === PER, '1 dm = 10 cm -> 1 dm² = 10 × 10 cm² = 100 cm²');
const DESK = { len: 12, wid: 6 }; // dm (F6)
console.assert(DESK.len * DESK.wid === 72, 'desk 12 dm × 6 dm = 72 dm²');
const ROOM = { tiles: 150, side: 40 }; // cm (F7)
console.assert(ROOM.side * ROOM.side === 1600 && 1600 * ROOM.tiles === 240000 && 240000 / PER / PER === 24, 'room: 1600 cm² a tile, 240 000 cm² = 24 m²');
const CONV = [ // (F8)
  { from: '8 dm²', op: '× 100', to: '800 cm²', ok: 8 * PER === 800 },
  { from: '500 dm²', op: ': 100', to: '5 m²', ok: 500 / PER === 5 },
  { from: '800 mm²', op: ': 100', to: '8 cm²', ok: 800 / PER === 8 },
  { from: '2 m² 30 dm²', op: '200 + 30', to: '230 dm²', ok: 2 * PER + 30 === 230 },
];
console.assert(CONV.every((c) => c.ok), 'conversions');
console.assert(3 * PER + 5 === 305, 'challenge: 3 cm² 5 mm² = 305 mm² (F9)');

// every word on the board; read at render time
export const TEXT = {
  title: 'Đơn vị đo diện tích',
  big: 'lớn',
  small: 'bé',
  tiles: 'viên',
  room: 'Nền phòng:',
  desk: 'mặt bàn',
  tryIt: 'Thử đổi nhé!',
  yourTurn: 'Đến lượt bạn!',
};

const INK = THEME.tiles.ink;
const CX = 552; // centre of the content box

// --- parts ----------------------------------------------------------------------------
// a wooden plate (tile style) centred at (x, y); u = pop progress, hop = 0..1 hop
function plate(objs, x, y, w, h, kind = 'int', { u = 1, hop = 0, label, font = 80, origin = '50% 100%' } = {}) {
  if (u <= 0) return null;
  const { scale, squash } = pop(u);
  const sq = squash * hopSquash(hop);
  const d = document.createElement('div');
  d.className = `tile ${kind}`;
  Object.assign(d.style, {
    left: `${x - w / 2}px`, top: `${y - h / 2 + hopY(hop, 30)}px`, width: `${w}px`, height: `${h}px`,
    borderRadius: `${Math.min(12, h / 5)}px`, transformOrigin: origin,
    transform: `scale(${scale / Math.sqrt(sq)}, ${scale * sq})`,
  });
  if (label) {
    const s = document.createElement('span');
    s.textContent = label;
    s.style.fontSize = `${font}px`;
    d.appendChild(s);
  }
  objs.appendChild(d);
  return d;
}

// pencil grid lines (tile ink) inside a square: n cells a side, drawn on with t
function gridLines(L, x0, y0, size, n, t, seed) {
  for (let i = 1; i < n; i++) {
    const k = stagger(t, i - 1, n - 1, 0.5);
    const v = x0 + (i * size) / n;
    L.line([v, y0 + 4], [v, y0 + size - 4], { color: INK, width: 3, t: k, seed: seed + i });
    const h = y0 + (i * size) / n;
    L.line([x0 + 4, h], [x0 + size - 4, h], { color: INK, width: 3, t: k, seed: seed + 50 + i });
  }
}

// dimension line with end stops and a label; side 'top' | 'left' | 'bottom' | 'right'
function dim(L, x0, y0, x1, y1, label, t, { side = 'top', size = 72, seed = 0 } = {}) {
  if (t <= 0) return;
  L.line([x0, y0], [x1, y1], { width: 5, t: clamp01(t * 1.6), seed });
  const stop = 18;
  const vert = x0 === x1;
  const ends = [[x0, y0], [x1, y1]];
  ends.forEach(([x, y], i) => {
    const a = vert ? [[x - stop, y], [x + stop, y]] : [[x, y - stop], [x, y + stop]];
    L.line(a[0], a[1], { width: 5, t: clamp01(t * 3 - 0.3), seed: seed + 3 + i });
  });
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const lt = clamp01(t * 1.6 - 0.6);
  if (side === 'top') L.text(label, mx, my - 26, { size, align: 'center', t: lt });
  else if (side === 'bottom') L.text(label, mx, my + size + 10, { size, align: 'center', t: lt });
  else if (side === 'left') L.text(label, mx - 30, my + size * 0.3, { size, align: 'right', t: lt });
  else L.text(label, mx + 30, my + size * 0.3, { size, align: 'left', t: lt });
}

// ticks every cell along a dimension line (the side split into n equal parts)
function ticks(L, x0, y0, x1, y1, n, t, seed) {
  const vert = x0 === x1;
  for (let i = 1; i < n; i++) {
    const k = stagger(t, i - 1, n - 1, 0.4);
    const x = lerp(x0, x1, i / n), y = lerp(y0, y1, i / n);
    const a = vert ? [[x - 12, y], [x + 12, y]] : [[x, y - 12], [x, y + 12]];
    L.line(a[0], a[1], { width: 4, t: k, seed: seed + i });
  }
}

// chalk callout: label at (x, y) with a short arrow to (tx, ty)
function callout(L, label, x, y, tx, ty, t, { size = 56, color = CHALK.yellow, align = 'right', seed = 0 } = {}) {
  if (t <= 0) return;
  popLabel(L, label, x, y, t, { size, color });
  const w = measure(label, size);
  const start = align === 'up' ? [x, y - size * 0.95]
    : [align === 'right' ? x + w / 2 + 12 : x - w / 2 - 12, y - size * 0.3];
  L.arrow(start, [tx, ty], { color, width: 5, t: clamp01(t * 1.5 - 0.4), seed, head: 20 });
}

// a vertical chalk arc with a head from y0 to y1 at x, bulging sideways by `bulge`
function vArc(L, x, y0, y1, bulge, v, { color = CHALK.yellow, width = 6, seed = 0 } = {}) {
  v = clamp01(v);
  if (v <= 0) return;
  const pt = (u) => [x + bulge * 4 * u * (1 - u), lerp(y0, y1, u)];
  const pts = Array.from({ length: 25 }, (_, i) => pt((i / 24) * v));
  L.poly(pts, { color, width, seed, amp: 0.6 });
  const ht = clamp01((v - 0.85) / 0.15);
  if (ht <= 0) return;
  const [ex, ey] = pt(1);
  const [px, py] = pt(0.92);
  const a = Math.atan2(ey - py, ex - px);
  for (const s of [-1, 1]) {
    L.line([ex, ey], [ex - 24 * Math.cos(a + s * 0.5), ey - 24 * Math.sin(a + s * 0.5)], { color, width, t: ht, seed: seed + 2 + s });
  }
}

// half-width of a teacher's circle around a chalk word
const loopRx = (s, size) => measure(s, size) / 2 + size * 0.24;

// equation with a circled, sparkling answer (last part)
function answerRow(L, parts, y, t, loopT, { size = 100, seed = 0 } = {}) {
  const xs = row(L, parts, CX, y, { size, t, seed, gap: 0.55 });
  const ax = xs[xs.length - 1];
  const last = parts[parts.length - 1];
  const rx = loopRx(last.s, last.size || size);
  L.loop(ax, y - size * 0.32, rx, size * 0.72, { color: CHALK.yellow, width: 8, t: clamp01(loopT * 1.4), seed: seed + 40 });
  burst(L, ax, y - size * 0.32, rx * 0.9, clamp01(loopT * 1.4 - 0.4), { seed: seed + 45 });
  return xs;
}

// --- beat 1: hook. "1 mét vuông bằng bao nhiêu đề-xi-mét vuông?" -------------------------
const HOOK = { big: [360, 690, 520], small: [850, 924, 52], smallLab: 1030, qY: 1300 };

function beat1(ctx, p) {
  const T = THEME.layout.title;
  const L0 = ctx.chalk(60);
  L0.text(TEXT.title, T.x, T.y, { size: T.size, t: g(p, 'title') });
  L0.line([T.x, T.y + 22], [T.x + measure(TEXT.title, T.size), T.y + 22], { width: T.underlineWidth, t: g(p, 'title'), seed: 5 });
  const objs = ctx.objects();
  const hops = g(p, 'hops');
  const [bx, by, bs] = HOOK.big;
  const [sx, sy, ss] = HOOK.small;
  plate(objs, bx, by, bs, bs, 'int', { u: g(p, 'big'), hop: hops < 1 ? stagger(hops, 0, 2, 0.6) : 0, label: '1 m²', font: 130 });
  plate(objs, sx, sy, ss, ss, 'dec', { u: g(p, 'small'), hop: hops < 1 ? stagger(hops, 1, 2, 0.6) : 0 });
  const L = ctx.chalk(60);
  popLabel(L, '1 dm²', sx, HOOK.smallLab, g(p, 'small'), { size: 70, color: CHALK.mint });
  const q = g(p, 'q');
  const xs = row(L, ['1 m²', '=', { s: '?', color: CHALK.yellow, size: 170 }, 'dm²'], CX, HOOK.qY, { size: 120, t: clamp01(q * 1.3), seed: 20, gap: 0.3 });
  burst(L, xs[2], HOOK.qY - 60, 120, clamp01(q * 1.5 - 0.5), { seed: 30 });
}

// --- beat 2: 1 dm² = 100 cm² --------------------------------------------------------------
const DM = { x0: 252, y0: 330, s: 600, n: 10, nameY: 1060, calcY: 1200, eqY: 1370 };

function squareLesson(ctx, p, B, { side, unit, small, eq, seed }) {
  const { x0, y0, s, n } = B;
  const c = s / n;
  const objs = ctx.objects();
  plate(objs, x0 + s / 2, y0 + s / 2, s, s, 'int', { u: g(p, 'plate') });
  // mint cells: the first cell, then the top row, then the left column
  const cell = g(p, 'cell'), rf = g(p, 'rowfill'), cf = g(p, 'colfill');
  const mint = [];
  if (cell > 0) mint.push([n - 1, 0, cell]);
  for (let i = 1; i < n; i++) if (rf > 0) mint.push([n - 1 - i, 0, stagger(rf, i - 1, n - 1, 0.35)]);
  for (let j = 1; j < n; j++) if (cf > 0) mint.push([n - 1, j, stagger(cf, j - 1, n - 1, 0.35)]);
  mint.forEach(([i, j, u]) => plate(objs, x0 + (i + 0.5) * c, y0 + (j + 0.5) * c, c - 6, c - 6, 'dec', { u, origin: '50% 50%' }));
  const Lg = ctx.chalk(50);
  gridLines(Lg, x0, y0, s, n, g(p, 'grid'), seed);
  const L = ctx.chalk(60);
  dim(L, x0, y0 - 40, x0 + s, y0 - 40, side, g(p, 'dims'), { side: 'top', seed: seed + 100 });
  dim(L, x0 - 40, y0, x0 - 40, y0 + s, side, g(p, 'dims'), { side: 'left', seed: seed + 110 });
  ticks(L, x0, y0 - 40, x0 + s, y0 - 40, n, g(p, 'ticks'), seed + 120);
  ticks(L, x0 - 40, y0, x0 - 40, y0 + s, n, g(p, 'ticks'), seed + 140);
  callout(L, small, x0 + s + 92, y0 + c * 3.2, x0 + s - c * 0.4, y0 + c * 0.9, cell, { size: 64, color: CHALK.mint, align: 'up', seed: seed + 160 });
  popLabel(L, unit, CX, B.nameY, g(p, 'name'), { size: 110, color: CHALK.white });
  row(L, ['10', { sym: 'times' }, '10', '=', '100'], CX, B.calcY, { size: 84, t: g(p, 'calc'), seed: seed + 170, gap: 0.3 });
  answerRow(L, eq, B.eqY, g(p, 'eq'), g(p, 'loop'), { seed: seed + 180 });
}

const beat2 = (ctx, p) => squareLesson(ctx, p, DM, {
  side: '1 dm', unit: '1 dm²', small: '1 cm²', seed: 200,
  eq: ['1 dm²', '=', { s: '100 cm²', color: CHALK.yellow }],
});

// --- beat 3: 1 m² = 100 dm² ---------------------------------------------------------------
const M = { x0: 202, y0: 300, s: 700, n: 10, nameY: 1120, calcY: 1250, eqY: 1420 };

function beat3(ctx, p) {
  const { x0, y0, s, n } = M;
  const c = s / n;
  const L0 = ctx.chalk(60);
  L0.rect(x0 - 6, y0 - 6, x0 + s + 6, y0 + s + 6, { width: 6, t: g(p, 'outline'), seed: 300 });
  const objs = ctx.objects();
  const tl = g(p, 'tiles'), cl = g(p, 'cell');
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      const u = clamp01((tl - (k / (n * n)) * 0.8) / 0.2);
      const hop = k === n - 1 && cl < 1 ? cl : 0;
      plate(objs, x0 + (i + 0.5) * c, y0 + (j + 0.5) * c, c - 8, c - 8, k === n - 1 && cl > 0.2 ? 'dec' : 'int', { u, hop });
    }
  }
  const L = ctx.chalk(60);
  dim(L, x0, y0 - 40, x0 + s, y0 - 40, '1 m', g(p, 'dims'), { side: 'top', seed: 310 });
  dim(L, x0 - 40, y0, x0 - 40, y0 + s, '1 m', g(p, 'dims'), { side: 'left', seed: 320 });
  callout(L, '1 dm²', x0 + s + 70, y0 + c * 3, x0 + s - c * 0.4, y0 + c * 0.9, cl, { size: 60, color: CHALK.mint, align: 'up', seed: 330 });
  popLabel(L, '1 m²', CX, M.nameY, g(p, 'name'), { size: 110, color: CHALK.white });
  row(L, ['10', { sym: 'times' }, '10', '=', '100'], CX, M.calcY, { size: 84, t: g(p, 'calc'), seed: 335, gap: 0.3 });
  answerRow(L, ['1 m²', '=', { s: '100 dm²', color: CHALK.yellow }], M.eqY, g(p, 'eq'), g(p, 'loop'), { seed: 340 });
}

// --- beat 4: 1 cm² = 100 mm² (zoomed in) ----------------------------------------------------
const MM = { small: [552, 330, 64], lensR: 74, x0: 252, y0: 520, s: 600, n: 10, calcY: 1375, eqY: 1520 };

function beat4(ctx, p) {
  const { x0, y0, s, n } = MM;
  const c = s / n;
  const [sx, sy, ss] = MM.small;
  const z = g(p, 'zoom');
  const objs = ctx.objects();
  const sm = g(p, 'small'), ln0 = g(p, 'lens');
  plate(objs, sx, sy, ss, ss, 'int', { u: sm, hop: ln0 < 1 ? ln0 : 0, origin: '50% 50%' });
  // the big plate grows out of the small one along an arc (anticipation: shrinks first)
  if (z > 0) {
    const k = z < 0.15 ? -0.08 * Math.sin((Math.PI * z) / 0.15) : spring((z - 0.15) / 0.85, 3.2, 6);
    const e = easeInOut(clamp01((z - 0.15) / 0.6));
    const size = Math.max(4, lerp(ss, s, k));
    const cx = lerp(sx, x0 + s / 2, e) - 40 * Math.sin(Math.PI * e);
    const cy = lerp(sy, y0 + s / 2, e);
    plate(objs, cx, cy, size, size, 'int', { origin: '50% 50%' });
  }
  const cell = g(p, 'cell');
  if (cell > 0) plate(objs, x0 + s - c / 2, y0 + c / 2, c - 6, c - 6, 'dec', { u: cell, origin: '50% 50%' });
  const Lg = ctx.chalk(50);
  gridLines(Lg, x0, y0, s, n, g(p, 'grid'), 400);
  const L = ctx.chalk(60);
  // magnifying lens around the small square, cone lines to the big one
  const ln = g(p, 'lens');
  L.loop(sx, sy, MM.lensR, MM.lensR, { width: 7, t: ln, seed: 410 });
  L.line([sx - 46, sy - 46], [sx - 110, sy - 110], { width: 12, t: clamp01(ln * 2 - 1), seed: 415 });
  popLabel(L, '1 cm²', sx + 190, sy + 24, sm, { size: 76, color: CHALK.white });
  const cone = clamp01(z * 1.4);
  L.line([sx - MM.lensR, sy + 10], [x0, y0], { width: 3, t: cone, seed: 420 });
  L.line([sx + MM.lensR, sy + 10], [x0 + s, y0], { width: 3, t: cone, seed: 421 });
  dim(L, x0, y0 + s + 40, x0 + s, y0 + s + 40, '1 cm', clamp01(z * 2 - 1), { side: 'bottom', seed: 430 });
  dim(L, x0 - 40, y0, x0 - 40, y0 + s, '1 cm', clamp01(z * 2 - 1), { side: 'left', seed: 440 });
  ticks(L, x0, y0 + s + 40, x0 + s, y0 + s + 40, n, g(p, 'ticks'), 450);
  ticks(L, x0 - 40, y0, x0 - 40, y0 + s, n, g(p, 'ticks'), 470);
  callout(L, '1 mm²', x0 + s + 90, y0 + c * 3.2, x0 + s - c * 0.4, y0 + c * 0.9, g(p, 'name'), { size: 64, color: CHALK.mint, align: 'up', seed: 490 });
  if (cell > 0 && cell < 1) sparks(L, x0 + s - c / 2, y0 + c / 2, 40, 70, cell, { color: CHALK.mint, seed: 495 });
  row(L, ['10', { sym: 'times' }, '10', '=', '100'], CX, MM.calcY, { size: 84, t: g(p, 'calc'), seed: 505, gap: 0.3 });
  answerRow(L, ['1 cm²', '=', { s: '100 mm²', color: CHALK.yellow }], MM.eqY, g(p, 'eq'), g(p, 'loop'), { seed: 500 });
}

// --- beat 5: the ladder m² → dm² → cm² → mm² ---------------------------------------------------
const LAD = { x: CX, ys: [420, 720, 1020, 1320], w: 300, h: 160, arcR: 740, arcL: 364, bigY: 290, smallY: 1490 };
const UNITS = ['m²', 'dm²', 'cm²', 'mm²'];

function beat5(ctx, p) {
  const objs = ctx.objects();
  const tl = g(p, 'tiles');
  const dn = g(p, 'down'), mu = g(p, 'mul'), up = g(p, 'up');
  UNITS.forEach((u, i) => {
    const hm = mu < 1 ? stagger(mu, i, 4, 0.4) : 0;
    const hu = up < 1 ? stagger(up, 3 - i, 4, 0.4) : 0;
    plate(objs, LAD.x, LAD.ys[i], LAD.w, LAD.h, i === 0 ? 'dec' : 'int', { u: stagger(tl, i, 4, 0.45), hop: hm || hu, label: u, font: 116 });
  });
  const L = ctx.chalk(60);
  popLabel(L, TEXT.big, LAD.x, LAD.bigY, clamp01(tl * 2 - 0.2), { size: 72, color: CHALK.white });
  popLabel(L, TEXT.small, LAD.x, LAD.smallY, clamp01(tl * 2 - 1), { size: 72, color: CHALK.white });
  for (let i = 0; i < 3; i++) {
    const [a, b] = [LAD.ys[i] + 40, LAD.ys[i + 1] - 40];
    const ud = stagger(dn, i, 3, 0.5);
    vArc(L, LAD.arcR, a, b, 70, ud, { seed: 600 + i * 10 });
    popLabel(L, '× 100', LAD.arcR + 165, (a + b) / 2 + 22, clamp01(ud * 1.6 - 0.5), { size: 76, pulse: mu < 1 ? stagger(mu, i, 3, 0.5) : 0 });
    const uu = stagger(up, 2 - i, 3, 0.5);
    vArc(L, LAD.arcL, b, a, -70, uu, { color: CHALK.mint, seed: 650 + i * 10 });
    popLabel(L, ': 100', LAD.arcL - 165, (a + b) / 2 + 22, clamp01(uu * 1.6 - 0.5), { size: 76, color: CHALK.mint });
  }
}

// --- beat 6: real life: a desk top (dm²), a room floor (m²) -----------------------------------
const DK = { x0: 220, y0: 300, w: 520, h: 260, eqY: 700 };
const FL = { x: 220, y: 960, s: 150, perY: 1130, allY: 1245, eqY: 1500 };

function beat6(ctx, p) {
  const objs = ctx.objects();
  // the desk top seen from above: 12 dm by 6 dm drawn 2 : 1
  plate(objs, DK.x0 + DK.w / 2, DK.y0 + DK.h / 2, DK.w, DK.h, 'int', { u: g(p, 'desk'), label: TEXT.desk, font: 64 });
  // floor tile and a stack behind it for "150 viên"
  const tile = g(p, 'tile'), cnt = g(p, 'count');
  for (let k = 3; k >= 1; k--) {
    plate(objs, FL.x + k * 16, FL.y - k * 16, FL.s, FL.s, 'int', { u: stagger(cnt, 3 - k, 3, 0.5) });
  }
  plate(objs, FL.x, FL.y, FL.s, FL.s, 'int', { u: tile });
  const L = ctx.chalk(60);
  const top = DK.y0 - 10;
  dim(L, DK.x0, top - 30, DK.x0 + DK.w, top - 30, `${DESK.len} dm`, g(p, 'len'), { side: 'top', size: 64, seed: 700 });
  dim(L, DK.x0 + DK.w + 40, DK.y0, DK.x0 + DK.w + 40, DK.y0 + DK.h, `${DESK.wid} dm`, g(p, 'wid'), { side: 'right', size: 64, seed: 710 });
  const ar = g(p, 'area');
  const xs = row(L, [String(DESK.len), { sym: 'times' }, String(DESK.wid), '=', { s: '72 dm²', color: CHALK.yellow }], CX, DK.eqY,
    { size: 92, t: clamp01(ar * 1.4), seed: 720, gap: 0.55 });
  L.loop(xs[4], DK.eqY - 30, loopRx('72 dm²', 92), 66, { color: CHALK.yellow, width: 8, t: clamp01(ar * 1.6 - 0.6), seed: 730 });
  dim(L, FL.x - FL.s / 2, FL.y - FL.s / 2 - 84, FL.x + FL.s / 2, FL.y - FL.s / 2 - 84, `${ROOM.side} cm`, g(p, 'side'), { side: 'top', size: 56, seed: 740 });
  row(L, [{ sym: 'times' }, String(ROOM.tiles), TEXT.tiles], 390, FL.y + 30, { size: 96, t: clamp01(cnt * 1.4), seed: 750, align: 'left', gap: 0.3 });
  const per = g(p, 'per'), all = g(p, 'all');
  row(L, [`1 ${TEXT.tiles}:`, '40', { sym: 'times' }, '40', '=', { s: '1600 cm²', color: CHALK.mint }], CX, FL.perY, { size: 68, t: per, seed: 755, gap: 0.3 });
  row(L, ['1600', { sym: 'times' }, '150', '=', { s: '240 000 cm²', color: CHALK.mint }], CX, FL.allY, { size: 68, t: all, seed: 757, gap: 0.3 });
  const fl = g(p, 'floor');
  const fx = row(L, [TEXT.room, { s: '24 m²', color: CHALK.yellow, size: 120 }], CX, FL.eqY, { size: 92, t: clamp01(fl * 1.4), seed: 760, gap: 0.5 });
  L.loop(fx[1], FL.eqY - 36, loopRx('24 m²', 120), 84, { color: CHALK.yellow, width: 8, t: clamp01(fl * 1.6 - 0.6), seed: 770 });
  burst(L, fx[1], FL.eqY - 36, 140, clamp01(fl * 1.8 - 0.8), { seed: 775 });
  popLabel(L, ': 100 : 100', fx[1], FL.eqY - 140, clamp01(fl * 1.5), { size: 60, color: CHALK.mint });
}

// --- beats 7–8: conversions, game-show ticks ---------------------------------------------------
const CV = { x: 180, ys: [490, 800, 1110, 1420], size: 86, tickX: 105 };
const ROW_KEYS = [['r1', 'o1', 'a1', 'k1'], ['r2', 'o2', 'a2', 'k2'], ['r3', 'o3', 'a3', 'k3'], ['r4', 'o4', 'a4', 'k4']];

function convBoard(ctx, beat, p) {
  const T = THEME.layout.title;
  const L = ctx.chalk(60);
  const tt = beat === 'beat7' ? g(p, 'title') : 1;
  L.text(TEXT.tryIt, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L.line([T.x, T.y + 22], [T.x + measure(TEXT.tryIt, T.size), T.y + 22], { width: T.underlineWidth, t: tt, seed: 805, color: CHALK.yellow });
  CONV.forEach((c, i) => {
    const later = beat === 'beat7' && i >= 2;
    const [r, o, a, k] = later ? [0, 0, 0, 0] : ROW_KEYS[i].map((key) => g(p, key));
    if (r <= 0) return;
    const y = CV.ys[i];
    const xs = row(L, [c.from, '='], CV.x, y, { size: CV.size, t: r, seed: 810 + i * 20, align: 'left', gap: 0.3 });
    const ax = xs[1] + CV.size * 0.3 + 30;
    const aw = measure(c.to, CV.size);
    // "?" sits in the answer place until the answer is written
    const qk = outScale(clamp01(r * 2 - 1), clamp01(a * 3));
    if (qk > 0) L.text('?', ax + 30, y, { size: CV.size * 1.2, color: CHALK.yellow, align: 'center', scale: qk });
    L.text(c.to, ax, y, { size: CV.size, color: CHALK.yellow, t: clamp01(a * 1.5 - 0.3) });
    const opColor = c.op.startsWith(':') ? CHALK.mint : CHALK.yellow;
    popLabel(L, c.op, ax + Math.max(aw, 120) / 2, y - 104, o, { size: 72, color: opColor });
    mark(L, true, CV.tickX, y - 26, k, { size: 52, seed: 880 + i * 5 });
  });
}
const beat7 = (ctx, p) => convBoard(ctx, 'beat7', p);
const beat8 = (ctx, p) => convBoard(ctx, 'beat8', p);

// --- beats 9–10: challenge: 3 cm² 5 mm² = ? mm² ------------------------------------------------
const Q = { labY: 400, exprY: 700, eqY: 900, countY: 1230, convY: 1150, sumY: 1330 };

// "= ___ mm²": positions of the three parts; the middle one is the answer slot
function slot(L, t, seed) {
  const xs = row(L, ['=', '305', 'mm²'], CX, Q.eqY, { size: 120, t: 0, seed, gap: 0.3 });
  L.text('=', xs[0], Q.eqY, { size: 120, align: 'center', t: clamp01(t * 3) });
  L.text('mm²', xs[2], Q.eqY, { size: 120, align: 'center', t: clamp01(t * 3 - 2) });
  return xs[1];
}

function quizBoard(ctx, p) {
  const L = ctx.chalk(60);
  L.text(TEXT.yourTurn, CX, Q.labY, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'label') });
  const e = g(p, 'expr');
  L.text('3 cm² 5 mm²', CX, Q.exprY, { size: 120, align: 'center', t: clamp01(e * 1.6) });
  return { L, qx: slot(L, clamp01(e * 2 - 1), 900) };
}

function beat9(ctx, p) {
  const { L, qx } = quizBoard(ctx, p);
  const q = g(p, 'q');
  popLabel(L, '?', qx, Q.eqY + 20, q, { size: 170 });
  burst(L, qx, Q.eqY - 40, 130, clamp01(q * 1.4 - 0.3), { seed: 910 });
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const [cx, cy, r] = [CX, Q.countY, 105];
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 920, amp: 0.6 });
    countdown(L, cx, cy - 20, c, { size: 150, color: CHALK.white });
  }
}

function beat10(ctx, p) {
  const { L, qx } = quizBoard(ctx, {});
  const conv = g(p, 'conv'), lp = g(p, 'loop');
  // the "?" winds up and shrinks away while 3 cm² is converted; 305 lands in its place
  const k = outScale(1, clamp01(conv * 2));
  if (k > 0) L.text('?', qx, Q.eqY + 20, { size: 170, color: CHALK.yellow, align: 'center', scale: k });
  popLabel(L, '305', qx, Q.eqY, clamp01(lp * 2 - 0.4), { size: 120 });
  row(L, ['3 cm²', '=', { s: '300 mm²', color: CHALK.mint }], CX, Q.convY, { size: 84, t: conv, seed: 930, gap: 0.3 });
  answerRow(L, ['300', '+', '5', '=', { s: '305', color: CHALK.yellow, size: 120 }], Q.sumY + 60, g(p, 'sum'), lp, { size: 96, seed: 940 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8, beat9, beat10 };
