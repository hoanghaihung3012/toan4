// Câu 8: Hình 6 gồm bao nhiêu hình chữ nhật? Facts: lessons/hinh_chu_nhat/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, stagger, spring, pop } from '../../shared/web/js/ease.js';
import { row, flight } from '../../shared/web/js/parts.js';
import {
  g, dropPose, sparks, burst, hopY, hopSquash, outScale, numTile, blockXs, countdown, popLabel,
} from '../../shared/web/js/fx.js';

// --- facts (story.md F1–F2, D1–D4), checked ---------------------------------------
// staircase figure n: rows of n, n-1, ..., 1 cells (row 0 at the bottom)
const rows = (n) => Array.from({ length: n }, (_, r) => n - r);
const cellsOf = (n) => rows(n).reduce((a, b) => a + b, 0);
console.assert(cellsOf(1) === 1 && cellsOf(2) === 3 && cellsOf(3) === 6, 'figures 1-3: 1, 3, 6 cells');
const N = 6;
const PAIRS = [[6, 1], [5, 2], [4, 3]];
console.assert(PAIRS.every(([a, b]) => a + b === 7) && 7 * 3 === 21 && cellsOf(N) === 21, 'figure 6: 7 x 3 = 21');
const OPTIONS = [['A', '21'], ['B', '15'], ['C', '24']]; // F2
console.assert(OPTIONS.filter(([, v]) => Number(v) === cellsOf(N)).map(([k]) => k).join() === 'A', 'answer A');
const QUIZ = 10;
console.assert(cellsOf(QUIZ) === 55 && 11 * 5 === 55, 'figure 10: 11 x 5 = 55');

// --- cells ------------------------------------------------------------------------------
// one wooden cell (a small rectangle) centred at (x, y), w x h on the board
function cell(objs, x, y, w, h, kind = 'int', { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const d = document.createElement('div');
  d.className = `tile ${kind}`;
  const vw = w - 8, vh = h - 12; // gaps so the wooden edges read as separate cells
  Object.assign(d.style, {
    left: `${x - vw / 2}px`, top: `${y - vh / 2}px`, width: `${vw}px`, height: `${vh}px`,
    borderRadius: `${Math.min(10, vh / 4)}px`, transformOrigin: '50% 100%',
    transform: `scale(${scale / Math.sqrt(squash)}, ${scale * squash})`,
  });
  objs.appendChild(d);
}

// cells of figure n as {r, c, x, y}; x0 = left edge, base = bottom edge
function stair(n, x0, base, w, h) {
  const out = [];
  rows(n).forEach((len, r) => {
    for (let c = 0; c < len; c++) out.push({ r, c, x: x0 + (c + 0.5) * w, y: base - (r + 0.5) * h });
  });
  return out;
}

// draw a figure; fn(cell, i) -> {u (pop 0..1), kind, hop (0..1)}
function figure(objs, n, x0, base, w, h, fn) {
  stair(n, x0, base, w, h).forEach((q, i) => {
    const { u = 1, kind = 'int', hop = 0 } = fn(q, i);
    if (u <= 0) return;
    const { scale, squash } = pop(u);
    cell(objs, q.x, q.y + hopY(hop, 26), w, h, kind, { scale, squash: squash * hopSquash(hop) });
  });
}

// beat order shared by the boards that continue without an eraser
function state(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}

// --- beat 1: hook. "Hình 6 có bao nhiêu hình chữ nhật?" ------------------------------
const HOOK = { w: 120, h: 66, base: 660, x0: [102, 282, 582], labY: 760, tagY: 960, qY: 1230, wordY: 1400 };

function hookChalk(L, p) {
  const T = THEME.layout.title;
  L.text('Câu 8', T.x, T.y, { size: T.size, t: g(p, 'title') });
  L.line([T.x, T.y + 22], [T.x + 190, T.y + 22], { width: T.underlineWidth, t: g(p, 'title'), seed: 5 });
  const f = g(p, 'figs');
  [1, 2, 3].forEach((n, i) => {
    L.text(`Hình ${n}`, HOOK.x0[i] + (n * HOOK.w) / 2, HOOK.labY, { size: 66, align: 'center', t: clamp01(f * 4 - i * 1.1 - 0.8) });
  });
  L.text('Hình 6', 552, HOOK.tagY, { size: 140, align: 'center', t: g(p, 'tag') });
  const q = g(p, 'q');
  popLabel(L, '?', 552, HOOK.qY + 60, q, { size: 300 });
  burst(L, 552, HOOK.qY - 40, 150, clamp01(q * 1.5 - 0.4), { seed: 30 });
  L.text('hình chữ nhật', 552, HOOK.wordY, { size: 90, align: 'center', t: clamp01(q * 1.6 - 0.4) });
}

function beat1(ctx, p) {
  const objs = ctx.objects();
  const f = g(p, 'figs');
  const hops = g(p, 'hops');
  [1, 2, 3].forEach((n, i) => {
    const fu = clamp01(f * 3 - i);
    const hop = hops < 1 ? stagger(hops, i, 3, 0.5) : 0;
    figure(objs, n, HOOK.x0[i], HOOK.base, HOOK.w, HOOK.h, (q, k) => ({ u: stagger(fu, k, cellsOf(n), 0.5), hop }));
  });
  hookChalk(ctx.chalk(60), p);
}

// --- beats 2–3: count figures 1, 2, 3 by rows ----------------------------------------------
const C = { x0: 100, w: 150, h: 84, base: [430, 830, 1330], labX: 660 };
const top = (n) => C.base[n - 1] - n * C.h;
const COUNT_KEYS = { 1: ['c1'], 2: ['c2a', 'c2b'], 3: ['c3a', 'c3b', 'c3c'] };
const BEAT_OF = { 1: 'beat2', 2: 'beat2', 3: 'beat3' };
const BUILD_KEY = { 1: 'cell', 2: 'fig2', 3: 'fig3' };

function countBoard(ctx, beat, p) {
  const S = state(['beat2', 'beat3'], beat, p);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const nr = S('beat3', 'newrow');

  [1, 2, 3].forEach((n) => {
    const b = BEAT_OF[n];
    const build = S(b, BUILD_KEY[n]);
    const keys = COUNT_KEYS[n];
    // the bottom row of figures 2 and 3 is the new row: it turns mint and hops (beat 3)
    const nu = n > 1 ? stagger(nr, n - 2, 2, 0.6) : 0;
    figure(objs, n, C.x0, C.base[n - 1], C.w, C.h, (q, i) => ({
      u: stagger(build, i, cellsOf(n), 0.5),
      kind: q.r === 0 && nu > 0.25 ? 'dec' : 'int',
      hop: q.r === 0 && nu < 1 ? nu : (S(b, keys[q.r]) < 1 ? S(b, keys[q.r]) : 0),
    }));
    // a count next to every row, when its row is said
    rows(n).forEach((len, r) => {
      const y = C.base[n - 1] - (r + 0.5) * C.h + 24;
      popLabel(L, String(len), C.x0 + len * C.w + 40, y, S(b, keys[r]), { size: 68 });
    });
    const ty = top(n) + 46;
    L.text(`Hình ${n}`, C.labX, ty, { size: 76, t: n === 1 ? S(b, 'fig1') : clamp01(build * 2) });
    const sumKey = n === 1 ? 'c1' : `sum${n}`;
    const parts = n === 1 ? [{ s: '1', color: CHALK.yellow }, 'hình']
      : [...rows(n).flatMap((len, i) => (i ? ['+', String(len)] : [String(len)])), '=', { s: String(cellsOf(n)), color: CHALK.yellow, size: 92 }];
    row(L, parts, C.labX, ty + 96, { size: 70, align: 'left', t: S(b, sumKey), seed: 100 + n * 10, gap: 0.26 });
  });
  // "Mỗi ô là một hình chữ nhật": the first cell gets a yellow chalk outline
  const o = S('beat2', 'cell');
  const [x, y] = [C.x0 + C.w / 2, C.base[0] - C.h / 2];
  L.rect(x - C.w / 2 - 10, y - C.h / 2 - 12, x + C.w / 2 + 10, y + C.h / 2 + 8, { color: CHALK.yellow, width: 6, t: clamp01(o * 1.6 - 0.4), seed: 90 });
  // "1 ô = 1 hình chữ nhật" next to it, wound up and shrunk away when "Hình 1" is written
  const note = S('beat2', 'note');
  const k = outScale(1, S('beat2', 'fig1'));
  if (note > 0 && k > 0) {
    L.text('= 1 hình chữ nhật', C.x0 + C.w + 40, y + 24, { size: 72, color: CHALK.yellow, t: note, scale: k });
  }
}
const beat2 = (ctx, p) => countBoard(ctx, 'beat2', p);
const beat3 = (ctx, p) => countBoard(ctx, 'beat3', p);

// --- beats 4–6: figure 6, add quickly by pairs, choose the answer ------------------------
const H6 = { x0: 110, base: 760, w: 110, h: 72, labX: 700, labY: 400 };
const ROW_KEYS = ['r6', 'r5', 'r4', 'r3', 'r2', 'r1']; // row 0 (6 cells) ... row 5 (1 cell)
const NUMS = rows(N); // 6 5 4 3 2 1, as said
const T = { y: 880, xs: blockXs(NUMS.map(() => 1), 552, 26), pairY: 1050, pairX: [260, 552, 844], dx: 54,
  sevenY: 1240, eqY: 1395, optY: 1550, optX: [225, 540, 855] };

function pairTarget(i) {
  const k = i < 3 ? i : 5 - i; // 6&1 -> pair 0, 5&2 -> pair 1, 4&3 -> pair 2
  return [T.pairX[k] + (i < 3 ? -T.dx : T.dx), T.pairY];
}

function sumBoard(ctx, beat, p) {
  const S = state(['beat4', 'beat5', 'beat6'], beat, p);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const build = S('beat4', 'fig');
  figure(objs, N, H6.x0, H6.base, H6.w, H6.h, (q) => {
    const h = S('beat4', ROW_KEYS[q.r]);
    return { u: clamp01(build * 2.2 - q.r * 0.24 - q.c * 0.03), hop: h < 1 ? h : 0 };
  });
  NUMS.forEach((len, r) => {
    popLabel(L, String(len), H6.x0 + len * H6.w + 38, H6.base - (r + 0.5) * H6.h + 22, S('beat4', ROW_KEYS[r]), { size: 64 });
  });
  L.text('Hình 6', H6.labX, H6.labY, { size: 84, t: S('beat4', 'label') });

  // number blocks 6 5 4 3 2 1 drop in, then fly into pairs that make 7
  const tl = S('beat5', 'tiles');
  const pk = ['p1', 'p2', 'p3'].map((k) => S('beat5', k));
  NUMS.forEach((n, i) => {
    const pose = dropPose(stagger(tl, i, 6, 0.45), T.y, 140);
    if (!pose) return;
    const k = i < 3 ? i : 5 - i;
    const f = flight([T.xs[i], T.y], pairTarget(i), pk[k], i < 3 ? 70 : 150);
    const moving = pk[k] > 0;
    numTile(objs, moving ? f.x : T.xs[i], moving ? f.y : pose.y, String(n), pk[k] > 0.5 ? 'dec' : 'int',
      { squash: moving ? f.squash : pose.squash });
  });
  const sv = S('beat5', 'sevens');
  T.pairX.forEach((x, k) => {
    const u = stagger(sv, k, 3, 0.5);
    L.poly([[x - 105, T.pairY + 66], [x - 105, T.pairY + 82], [x + 105, T.pairY + 82], [x + 105, T.pairY + 66]],
      { color: CHALK.yellow, width: 6, t: clamp01(u * 2), seed: 300 + k, amp: 0.8 });
    popLabel(L, '7', x, T.sevenY, clamp01(u * 2 - 0.5), { size: 96 });
  });
  const xs = row(L, ['7', { sym: 'times' }, '3', '=', { s: '21', color: CHALK.yellow, size: 140 }], 552, T.eqY,
    { size: 104, t: S('beat5', 'eq'), seed: 320, gap: 0.3 });
  const lp = S('beat5', 'loop');
  L.loop(xs[4], T.eqY - 44, 100, 84, { color: CHALK.yellow, width: 8, t: clamp01(lp * 1.4), seed: 330 });
  burst(L, xs[4], T.eqY - 44, 120, clamp01(lp * 1.4 - 0.4), { seed: 335 });

  // options: A circled, B and C struck out
  const opt = S('beat6', 'opts');
  const pick = S('beat6', 'pick');
  OPTIONS.forEach(([k, v], i) => {
    const x = T.optX[i];
    L.text(`${k}. ${v}`, x, T.optY, { size: 80, align: 'center', t: stagger(opt, i, 3, 0.5) });
    if (k === 'A') {
      L.loop(x, T.optY - 28, 130, 72, { color: CHALK.yellow, width: 8, t: clamp01(pick * 1.6), seed: 340 });
      burst(L, x, T.optY - 28, 130, clamp01(pick * 1.5 - 0.5), { n: 10, seed: 345 });
    } else {
      L.line([x - 110, T.optY - 66], [x + 110, T.optY + 16], { color: CHALK.red, width: 13, t: clamp01(pick * 2 - 0.4), seed: 350 + i });
    }
  });
}
const beat4 = (ctx, p) => sumBoard(ctx, 'beat4', p);
const beat5 = (ctx, p) => sumBoard(ctx, 'beat5', p);
const beat6 = (ctx, p) => sumBoard(ctx, 'beat6', p);

// --- beats 7–8: challenge, figure 10 ----------------------------------------------------------
const Q = { x0: 140, base: 830, w: 64, h: 44, labY: 300, tagY: 1010, countY: 1250, sumY: 1180, eqY: 1350 };

function quizBoard(ctx, p) {
  const objs = ctx.objects();
  const f = g(p, 'fig');
  figure(objs, QUIZ, Q.x0, Q.base, Q.w, Q.h, (q) => ({ u: clamp01(f * 2 - q.r * 0.1 - q.c * 0.02) }));
  const L = ctx.chalk(60);
  L.text('Đến lượt bạn!', 552, Q.labY, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'label') });
  const xs = row(L, ['Hình 10', '='], 470, Q.tagY, { size: 110, t: clamp01(f * 1.5 - 0.5), seed: 400, gap: 0.3 });
  return { L, qx: xs[1] + 150 };
}

function beat7(ctx, p) {
  const { L, qx } = quizBoard(ctx, p);
  popLabel(L, '?', qx, Q.tagY + 40, g(p, 'q'), { size: 220 });
  // countdown 3, 2, 1 inside a chalk timer ring that runs down (reads as a timer, not as answers)
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const [cx, cy, r] = [552, Q.countY, 105];
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 440, amp: 0.6 });
    countdown(L, cx, cy - 20, c, { size: 150, color: CHALK.white });
  }
}

function beat8(ctx, p) {
  const { L, qx } = quizBoard(ctx, {});
  const s = g(p, 'sum');
  // the "?" winds up and shrinks away while the sum is written; 55 takes its place at the end
  const k = outScale(1, clamp01(s * 3));
  if (k > 0) L.text('?', qx, Q.tagY + 40, { size: 220, color: CHALK.yellow, align: 'center', scale: k });
  const xs = row(L, ['1', '+', '2', '+', '…', '+', '10'], 552, Q.sumY, { size: 88, t: s, seed: 410, gap: 0.3 });
  // pair 1 with 10: an arc under the sum, labelled 11
  const pr = g(p, 'pairs');
  const pts = Array.from({ length: 25 }, (_, i) => {
    const u = (i / 24) * clamp01(pr * 1.5);
    return [xs[0] + (xs[6] - xs[0]) * u, Q.sumY + 30 + 60 * Math.sin(Math.PI * u)];
  });
  if (pr > 0) L.poly(pts, { color: CHALK.mint, width: 6, seed: 415, amp: 0.6 });
  popLabel(L, '11 (5 cặp)', (xs[0] + xs[6]) / 2, Q.sumY + 165, clamp01(pr * 2 - 0.8), { size: 72, color: CHALK.mint });
  const ex = row(L, ['=', '11', { sym: 'times' }, '5', '=', { s: '55', color: CHALK.yellow, size: 140 }], 552, Q.eqY + 150,
    { size: 104, t: g(p, 'eq'), seed: 420, gap: 0.3 });
  const lp = g(p, 'loop');
  L.loop(ex[5], Q.eqY + 106, 100, 84, { color: CHALK.yellow, width: 8, t: clamp01(lp * 1.4), seed: 430 });
  sparks(L, ex[5], Q.eqY + 106, 130, 165, clamp01(lp * 1.5 - 0.5), { seed: 435 });
  popLabel(L, '55', qx + 30, Q.tagY + 10, clamp01(lp * 2 - 0.6), { size: 140 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8 };
