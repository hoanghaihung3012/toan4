// Sơn khối lập phương, kể cả mặt đáy: bao nhiêu ô vuông? Facts: lessons/son_khoi_lap_phuong/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { clamp01, stagger, arcPoint, easeInOut, landSquash } from '../../../../../shared/web/js/ease.js';
import { row } from '../../../../../shared/web/js/parts.js';
import { g, dropPose, burst, sparks, hopY, hopSquash, outScale, countdown, popLabel, bandWipe } from '../../../../../shared/web/js/fx.js';
import {
  cubeView, drawCubes, flatGrid, paintBrush, svgLayer, shownFaces, viewCounts, exposedFaces, faceTip,
} from '../../../../../shared/web/js/cubes.js';

// --- facts (story.md F1–F2, D1–D6), checked ----------------------------------------------
// [x, y, z]: x left->right (4), y front (0) / back (1), z up. Bottom view: 2 x 4 (F2).
const CUBES = [
  ...[0, 1, 2, 3].flatMap((x) => [[x, 0, 0], [x, 1, 0]]), // bottom layer: 8
  [0, 1, 1], [1, 1, 1], [2, 1, 1], // middle layer, back row: 3
  [0, 1, 2], [1, 1, 2], // top layer, back row: 2
];
const V = viewCounts(CUBES);
console.assert(CUBES.length === 13, '13 cubes');
console.assert(V.top === 8 && V.front === 9 && V.right === 4, 'views 8, 9, 4');
const TOTAL = V.top + V.bottom + V.front + V.back + V.right + V.left;
console.assert(TOTAL === 42 && exposedFaces(CUBES) === 42, 'six views add up to every exposed face: 42');
console.assert(8 + 8 === 16 && 9 + 9 === 18 && 4 + 4 === 8 && 16 + 18 + 8 === 42, 'pair sums');
console.assert(TOTAL - V.bottom === 34, 'challenge: without the bottom 42 - 8 = 34');

// column heights of each flat view (left to right as seen from that side)
const FRONT = Array.from({ length: 4 }, (_, x) => new Set(CUBES.filter((c) => c[0] === x).map((c) => c[2])).size);
const RIGHT = Array.from({ length: 2 }, (_, y) => new Set(CUBES.filter((c) => c[1] === y).map((c) => c[2])).size);
console.assert(FRONT.join() === '3,3,2,1' && RIGHT.join() === '1,3', 'front 3,3,2,1; right 1,3');

// every word written on the board; an English version overrides these (lessons/son_khoi_lap_phuong_en)
export const TEXT = {
  top: 'trên', bottom: 'dưới', front: 'trước', back: 'sau', right: 'phải', left: 'trái',
  base: 'mặt đáy', squares: 'ô vuông', yourTurn: 'Đến lượt bạn!', noPaint: 'không sơn', unknown: '? ô',
};
// layout nudges for longer words (default: the Vietnamese layout); labelDx shifts an arrow's label by its word key
export const FIT = { labelDx: {} };

const PAINT = { top: 'rgb(242, 116, 150)', front: 'rgb(96, 166, 236)', right: 'rgb(104, 200, 120)' };
const INK = { top: CHALK.pink, front: CHALK.blue, right: CHALK.green };

// --- the model and the six-view worksheet (beats 1–6 share one board) -----------------------
const M = cubeView(315, 640, 100);
const C = 56; // flat-view square
// rows: [left slot, right slot]; each slot {label, heights, side (paint key)}
const ROWS = [
  { base: 1060, slots: [{ label: 'top', h: [2, 2, 2, 2] }, { label: 'bottom', h: [2, 2, 2, 2] }], side: 'top', n: V.top },
  { base: 1320, slots: [{ label: 'front', h: FRONT }, { label: 'back', h: [...FRONT].reverse() }], side: 'front', n: V.front },
  { base: 1580, slots: [{ label: 'right', h: RIGHT }, { label: 'left', h: [...RIGHT].reverse() }], side: 'right', n: V.right },
];
const SLOT_X = [250, 720]; // centre x of the left / right flat view
const gridLeft = (slot, h) => SLOT_X[slot] - (h.length * C) / 2;
const gridTop = (r) => r.base - Math.max(...r.slots[0].h) * C;

// six arrows from the six sides, in the order they are said; colour = the pair's paint
const ARROWS = [
  { from: [565, 150], to: [565, 262], lab: [630, 200], side: 'top', word: 'top' },
  { from: [520, 790], to: [520, 678], lab: [600, 790], side: 'top', word: 'bottom' },
  { from: [195, 800], to: [292, 703], lab: [140, 850], side: 'front', word: 'front' },
  { from: [935, 215], to: [838, 312], lab: [940, 190], side: 'front', word: 'back' },
  { from: [120, 545], to: [285, 545], lab: [200, 510], side: 'right', word: 'left' },
  { from: [990, 505], to: [820, 505], lab: [905, 470], side: 'right', word: 'right' },
];

// beat order of the shared board
const ORDER = ['beat1', 'beat2', 'beat3', 'beat4', 'beat5', 'beat6'];
function state(beat, p) {
  const idx = ORDER.indexOf(beat);
  return (b, k) => {
    const i = ORDER.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}

// faces painted in a beat, in brush order
const FACES = {
  top: shownFaces(CUBES, 'top').sort((a, b) => b[1] - a[1] || a[0] - b[0]),
  front: shownFaces(CUBES, 'front').sort((a, b) => a[0] - b[0] || a[2] - b[2]),
  right: shownFaces(CUBES, 'right').sort((a, b) => a[1] - b[1] || a[2] - b[2]),
};
console.assert(FACES.top.length === 8 && FACES.front.length === 9 && FACES.right.length === 4, 'painted faces 8, 9, 4');

// paint progress of one face for a window p over the side's faces: brush hops in (30 %), sweeps (70 %)
function faceU(side, c, p) {
  const list = FACES[side];
  const i = list.indexOf(c);
  if (i < 0) return 0;
  const k = clamp01(p * list.length - i);
  return easeInOut(clamp01((k - 0.3) / 0.7));
}

// brush pose while painting `side` with window p (null when not painting)
function brushPose(side, p) {
  if (p <= 0 || p >= 1) return null;
  const list = FACES[side];
  const f = Math.min(list.length - 1, Math.floor(p * list.length));
  const k = clamp01(p * list.length - f);
  const start = faceTip(M, list[f], side, 0);
  if (k < 0.3) {
    const prev = f ? faceTip(M, list[f - 1], side, 1) : [start[0] + 160, start[1] - 260];
    const v = easeInOut(k / 0.3);
    const [x, y] = arcPoint(prev, start, v, f ? 50 : 120);
    return { x, y, squash: landSquash(v, 0.25, 0.2) * (k < 0.04 ? 1 - 0.1 * Math.sin(Math.PI * k / 0.04) : 1) };
  }
  const u = easeInOut((k - 0.3) / 0.7);
  const [x, y] = faceTip(M, list[f], side, u);
  return { x, y, squash: 1 + 0.08 * Math.sin(u * Math.PI * 4) };
}

// the model: drop-in build (beat 1), whole-model hop, paint per side
function model(objs, S, { build = 1, hop = 0, brushSide = null, brushP = 0 } = {}) {
  const svg = svgLayer(objs);
  const order = [...CUBES].sort((a, b) => a[2] - b[2] || b[1] - a[1] || a[0] - b[0]);
  const paintP = { top: S('beat3', 'paint'), front: S('beat4', 'paint'), right: S('beat5', 'paint') };
  drawCubes(svg, M, CUBES, {
    pose: (c) => {
      const u = stagger(build, order.indexOf(c), CUBES.length, 0.32);
      const d = dropPose(u, 0, 260);
      if (!d) return null;
      return { dy: d.y + hopY(hop, 40), squash: d.squash * hopSquash(hop) };
    },
    paint: (c, f) => ({ color: PAINT[f], u: faceU(f, c, paintP[f]) }),
  });
  if (brushSide) {
    const b = brushPose(brushSide, brushP);
    if (b) paintBrush(svgLayer(objs), b.x, b.y, PAINT[brushSide], { squash: b.squash });
  }
}

function arrows(L, S) {
  ARROWS.forEach((a, i) => {
    const u = S('beat2', `a${i + 1}`);
    if (u <= 0) return;
    const color = INK[a.side];
    // anticipation: the arrow starts pulled back, then shoots in and settles
    const k = u < 0.2 ? -0.1 * Math.sin((Math.PI * u) / 0.2) : easeInOut((u - 0.2) / 0.8);
    const to = [a.from[0] + (a.to[0] - a.from[0]) * Math.max(0.05, k), a.from[1] + (a.to[1] - a.from[1]) * Math.max(0.05, k)];
    L.arrow(a.from, to, { color, width: 9, t: clamp01(u * 1.4), seed: 600 + i, head: 30 });
    popLabel(L, TEXT[a.word], a.lab[0] + (FIT.labelDx[a.word] || 0), a.lab[1], u, { size: 68, color });
  });
}

// worksheet: label per slot (beat 2), flat views and counts (beats 3–5), hop on the sums (beat 6)
const SLOT_BEAT = ['beat3', 'beat4', 'beat5'];
function worksheet(objs, L, S) {
  const svg = svgLayer(objs);
  const said = ['a1', 'a2', 'a3', 'a4', 'a6', 'a5']; // row 3 is "phải" (left) then "trái" (right)
  ROWS.forEach((r, ri) => {
    const b = SLOT_BEAT[ri];
    const hop = S('beat6', `h${ri + 1}`);
    r.slots.forEach((s, si) => {
      const x0 = gridLeft(si, s.h);
      const lu = S('beat2', said[ri * 2 + si]);
      popLabel(L, TEXT[s.label], SLOT_X[si], gridTop(r) - 26, lu, { size: 68, color: INK[r.side] });
      const gu = S(b, si ? 'gridB' : 'gridA');
      const hy = hop < 1 ? -hopY(hop, 30) : 0;
      flatGrid(svg, s.h, x0, r.base + 0, C, { color: PAINT[r.side], u: gu, hop: -hy });
      // per-column counts said aloud (front 3, 3, 2, 1 / right 1 and 3) under the first view
      if (!si && ri > 0) {
        s.h.forEach((h, col) => {
          const cu = S(b, `c${col + 1}`);
          if (cu > 0 && cu < 1) popLabel(L, String(h), x0 + (col + 0.5) * C, r.base + 50, cu, { size: 44, color: CHALK.white });
        });
      }
      const cu = S(b, si ? 'countB' : 'countA');
      const cx = x0 + s.h.length * C + 70;
      popLabel(L, String(r.n), cx, r.base - 18 + hy, cu, { size: 96, color: INK[r.side], pulse: hop < 1 ? hop : 0 });
    });
  });
}

// --- beat 1: hook ---------------------------------------------------------------------------
const HOOK = { gx: 428, gy: 1030, c: 56, labY: 870, qY: 1330, wordY: 1470 };

function hookLower(ctx, p) {
  const L = ctx.chalk(60);
  const bt = g(p, 'bottom');
  const hp = bt < 1 ? hopY(bt, 26) : 0;
  // the given bottom view: a 2 x 4 grid of squares, drawn in chalk like the problem
  const t = clamp01(g(p, 'build') * 1.3 - 0.3);
  for (let r = 0; r <= 2; r++) L.line([HOOK.gx, HOOK.gy - r * HOOK.c + hp], [HOOK.gx + 4 * HOOK.c, HOOK.gy - r * HOOK.c + hp], { t, seed: 20 + r });
  for (let c = 0; c <= 4; c++) L.line([HOOK.gx + c * HOOK.c, HOOK.gy + hp], [HOOK.gx + c * HOOK.c, HOOK.gy - 2 * HOOK.c + hp], { t, seed: 30 + c });
  L.text(TEXT.base, 540, HOOK.labY, { size: 60, align: 'center', color: CHALK.pink, t: clamp01(bt * 2) });
  L.loop(540, HOOK.gy - HOOK.c + hp, 175, 95, { color: CHALK.yellow, width: 7, t: clamp01(bt * 1.4 - 0.2), seed: 40 });
  const q = g(p, 'q');
  popLabel(L, '?', 540, HOOK.qY, q, { size: 280 });
  burst(L, 540, HOOK.qY - 90, 150, clamp01(q * 1.5 - 0.4), { seed: 45 });
  L.text(TEXT.squares, 540, HOOK.wordY, { size: 96, align: 'center', t: g(p, 'word') });
}

function beat1(ctx, p) {
  model(ctx.objects(), state('beat1', p), { build: g(p, 'build') });
  hookLower(ctx, p);
}

// --- beats 2–6: one board --------------------------------------------------------------------
function board(ctx, beat, p) {
  const S = state(beat, p);
  const objs = ctx.objects();
  const six = S('beat2', 'six');
  const paintSide = { beat3: 'top', beat4: 'front', beat5: 'right' }[beat];
  const drawTop = (c) => {
    const o = c.objects();
    model(o, S, { hop: six < 1 ? six : 0, brushSide: paintSide, brushP: paintSide ? g(p, 'paint') : 0 });
    const L = c.chalk(60);
    arrows(L, S);
    // "Đừng đếm từng khối": 1 2 3 4 on the front cubes, struck through, then gone at "6 phía"
    const n = S('beat2', 'nums');
    const k = outScale(1, six);
    if (beat === 'beat2' && n > 0 && k > 0) {
      [0, 1, 2, 3].forEach((x) => {
        const [cx, cy] = M.pt(x + 0.5, 0, 0.5);
        L.text(String(x + 1), cx, cy + 30, { size: 88, color: 'rgb(92, 58, 30)', align: 'center', scale: k * stagger(n, x, 4, 0.5) });
      });
      const cr = S('beat2', 'cross');
      const [l, r] = [M.pt(0.1, 0, 0.5), M.pt(3.9, 0, 0.5)];
      const mid = (l[0] + r[0]) / 2;
      L.line([mid + (l[0] - mid) * k, l[1] + 10], [mid + (r[0] - mid) * k, r[1] - 10], { color: CHALK.red, width: 18, t: cr, seed: 70 });
    }
  };
  if (beat === 'beat6') bandWipe(ctx, g(p, 'wipe'), [150, 860], drawTop, 3);
  else drawTop(ctx);
  if (beat === 'beat2') bandWipe(ctx, g(p, 'wipe'), [820, 1560], (c) => hookLower(c, {}), 3);
  const L = ctx.chalk(60);
  worksheet(objs, L, S);
  if (beat === 'beat6') sums(L, p);
}

// beat 6: pair sums where the model was, then the total
const EQ = { x: 540, y: [290, 410, 530], sumY: 690 };
function sums(L, p) {
  const lines = [['8', '8', '16', 'top'], ['9', '9', '18', 'front'], ['4', '4', '8', 'right']];
  lines.forEach(([a, b, s, side], i) => {
    // the pair's colour on its two numbers ties each row to its two flat views below
    row(L, [{ s: a, color: INK[side] }, '+', { s: b, color: INK[side] }, '=', { s, color: CHALK.yellow }], EQ.x, EQ.y[i],
      { size: 92, t: g(p, `e${i + 1}`), seed: 700 + i * 10 });
  });
  const xs = row(L, ['16', '+', '18', '+', '8', '=', { s: '42', color: CHALK.yellow, size: 130 }], EQ.x, EQ.sumY,
    { size: 96, t: g(p, 'sum'), seed: 780, gap: 0.7 });
  const lp = g(p, 'loop');
  L.loop(xs[6], EQ.sumY - 40, 86, 80, { color: CHALK.yellow, width: 9, t: clamp01(lp * 1.4), seed: 790 });
  sparks(L, xs[6], EQ.sumY - 40, 112, 140, clamp01(lp * 1.5 - 0.5), { seed: 795 });
}

const beat2 = (ctx, p) => board(ctx, 'beat2', p);
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);
const beat5 = (ctx, p) => board(ctx, 'beat5', p);
const beat6 = (ctx, p) => board(ctx, 'beat6', p);

// --- beats 7–8: challenge: without the bottom ---------------------------------------------------
const Q = { labY: 250, gx: 428, gy: 960, c: 56, noY: 1050, qY: 1230, countY: 1440, eqY: 1230 };
const QM = cubeView(355, 690, 82);

function quizBoard(ctx, p) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const m = g(p, 'model');
  drawCubes(svg, QM, CUBES, {
    pose: () => { const s = clamp01(m * 1.2); return s > 0 ? { scale: s < 1 ? 0.6 + 0.4 * Math.sin(s * Math.PI / 2) + 0.06 * Math.sin(s * Math.PI) : 1 } : null; },
    paint: (c, f) => ({ color: PAINT[f], u: 1 }),
  });
  // the bottom (pink 2 x 4) under the model, crossed out on "không sơn"
  const no = g(p, 'no');
  flatGrid(svgLayer(objs), [2, 2, 2, 2], Q.gx, Q.gy, Q.c, { color: PAINT.top, u: clamp01(m * 1.5 - 0.3) });
  const L = ctx.chalk(60);
  L.text(TEXT.yourTurn, 540, Q.labY, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'label') });
  L.text(TEXT.base, 540, Q.gy - 2 * Q.c - 26, { size: 68, color: CHALK.pink, align: 'center', t: clamp01(m * 1.5 - 0.5) });
  L.line([Q.gx - 20, Q.gy - 2 * Q.c - 10], [Q.gx + 4 * Q.c + 20, Q.gy + 10], { color: CHALK.red, width: 14, t: clamp01(no * 2), seed: 810 });
  L.line([Q.gx + 4 * Q.c + 20, Q.gy - 2 * Q.c - 10], [Q.gx - 20, Q.gy + 10], { color: CHALK.red, width: 14, t: clamp01(no * 2 - 1), seed: 811 });
  L.text(TEXT.noPaint, 540, Q.noY + 12, { size: 84, color: CHALK.red, align: 'center', t: clamp01(no * 2 - 0.6) });
  return L;
}

function beat7(ctx, p) {
  const L = quizBoard(ctx, p);
  popLabel(L, TEXT.unknown, 540, Q.qY, g(p, 'q'), { size: 160 });
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const [cx, cy, r] = [540, Q.countY, 95];
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 840, amp: 0.6 });
    countdown(L, cx, cy - 20, c, { size: 140, color: CHALK.white });
  }
}

function beat8(ctx, p) {
  const L = quizBoard(ctx, {});
  const e = g(p, 'eq');
  const k = outScale(1, clamp01(e * 3));
  if (k > 0) L.text(TEXT.unknown, 540, Q.qY, { size: 160, color: CHALK.yellow, align: 'center', scale: k });
  const xs = row(L, ['42', { sym: 'minus' }, '8', '=', { s: '34', color: CHALK.yellow, size: 140 }], 540, Q.eqY + 40,
    { size: 110, t: clamp01(e * 1.4 - 0.3), seed: 850, gap: 0.7 });
  const lp = g(p, 'loop');
  L.loop(xs[4], Q.eqY, 86, 84, { color: CHALK.yellow, width: 9, t: clamp01(lp * 1.4), seed: 860 });
  sparks(L, xs[4], Q.eqY, 125, 165, clamp01(lp * 1.5 - 0.5), { seed: 865 });
  L.text(TEXT.squares, 540, Q.countY, { size: 104, align: 'center', t: clamp01(lp * 2 - 0.5) });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8 };
