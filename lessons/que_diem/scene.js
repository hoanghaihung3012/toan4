// Câu 7: Hỏi có bao nhiêu que diêm trong hình thứ 99? Facts: lessons/que_diem/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, lerp, stagger, spring, easeOutCubic } from '../../shared/web/js/ease.js';
import { row } from '../../shared/web/js/parts.js';
import { match, houseSticks, houseHeight, arrive } from './match.js';
import { g, sparks, burst, mark, hopY, outScale, sideArc } from './fx.js';

// --- facts (story.md F1–F2, D1–D7), checked ---------------------------------------
const sticks = (n) => houseSticks(0, 0, 1, n).length; // counted from the drawn figure
const rule = (n) => 1 + 5 * n; // D5
console.assert(sticks(1) === 6 && sticks(2) === 11 && sticks(3) === 16, 'figures 1-3: 6, 11, 16 sticks');
for (let n = 1; n <= 12; n++) console.assert(sticks(n) === rule(n), `figure ${n}: 1 + 5 x ${n}`);
const N = 99;
console.assert(5 * N === 495 && 1 + 495 === 496 && rule(N) === 496, 'figure 99: 1 + 495 = 496');
const OPTIONS = [['A', '563'], ['B', '496'], ['C', '586']]; // F2
console.assert(OPTIONS.filter(([, v]) => Number(v) === rule(N)).map(([k]) => k).join() === 'B', 'answer B');
const QUIZ = 10;
console.assert(rule(QUIZ) === 51 && sticks(QUIZ) === 51, 'figure 10: 51 sticks');

// --- small helpers ---------------------------------------------------------------------
// draw a figure; each stick gets its own pose from fn(stick, i) -> {u, kind, hop}
function figure(objs, list, fn) {
  list.forEach((s, i) => {
    const { u = 1, kind = 'int', hop = 0, from } = fn(s, i);
    const a = arrive(u, from);
    if (a) match(objs, s.p0, s.p1, { kind, scale: a.scale, squash: a.squash, dx: a.dx, dy: a.dy + hop, rot: a.rot });
  });
}
const mid = (s) => [(s.p0[0] + s.p1[0]) / 2, (s.p0[1] + s.p1[1]) / 2];
// chalk word that springs in (scale) instead of sweeping
function popText(L, s, x, y, u, o = {}) {
  if (u <= 0) return;
  L.text(s, x, y, { align: 'center', ...o, scale: spring(u, 3.2, 6) * (o.scale || 1) });
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

// --- beat 1: hook. "Hình thứ 99 có bao nhiêu que diêm?" ------------------------------
const HOOK = { x0: 95, yb: 640, L: 105, n: 8, countY: 820, tagY: 1030, qY: 1380 };
const HOOK_STICKS = houseSticks(HOOK.x0, HOOK.yb, HOOK.L, HOOK.n);

function hookChalk(L, p) {
  const T = THEME.layout.title;
  L.text('Câu 7', T.x, T.y, { size: T.size, t: g(p, 'title') });
  L.line([T.x, T.y + 22], [T.x + 190, T.y + 22], { width: T.underlineWidth, t: g(p, 'title'), seed: 5 });
  // trailing dots: the row goes on
  const dots = clamp01(g(p, 'houses') * 1.3 - 0.3);
  [0, 1, 2].forEach((i) => {
    const u = stagger(dots, i, 3, 0.5);
    if (u > 0) L.text('.', 955 + i * 28, HOOK.yb - 6, { size: 90, align: 'center', scale: spring(u, 3, 6) });
  });
  // "1, 2, 3, 4, 5, ..." counting under the houses, crossed out in red
  L.text('1, 2, 3, 4, 5, 6, 7, ...', 540, HOOK.countY, { size: 92, align: 'center', t: g(p, 'count') });
  const x = g(p, 'cross');
  if (x > 0) {
    L.line([150, HOOK.countY - 60], [930, HOOK.countY + 14], { color: CHALK.red, width: 16, t: clamp01(x * 2), seed: 21 });
    L.line([150, HOOK.countY + 14], [930, HOOK.countY - 60], { color: CHALK.red, width: 16, t: clamp01(x * 2 - 1), seed: 22 });
  }
  L.text('Hình 99', 540, HOOK.tagY, { size: 150, align: 'center', t: g(p, 'tag') });
  const q = g(p, 'q');
  const tip = g(p, 'tip');
  const bump = tip > 0 && tip < 1 ? 0.25 * Math.sin(Math.PI * tip) : 0;
  popText(L, '?', 400, HOOK.qY + 90, q, { size: 330, color: CHALK.yellow, scale: 1 + bump });
  popText(L, 'que', 650, HOOK.qY + 30, clamp01(q * 1.6 - 0.4), { size: 120 });
  sparks(L, 400, HOOK.qY - 30, 200, 250, tip, { seed: 30 });
}

function beat1(ctx, p) {
  const objs = ctx.objects();
  const h = g(p, 'houses');
  figure(objs, HOOK_STICKS, (s) => ({ u: clamp01((h * (HOOK.n + 2) - s.house) / 2.2) }));
  hookChalk(ctx.chalk(60), p);
}

// --- beats 2–4: count figures 1, 2, 3 (one board, rows stacked) ------------------------
const C = { x0: 90, L: 170, yb: [520, 1010, 1500], labelX: 690, plusX: 975 };
const ROWS = [1, 2, 3].map((n, r) => houseSticks(C.x0, C.yb[r], C.L, n));
const TOTALS = [1, 2, 3].map(sticks);
const ORDER = ['beat2', 'beat3', 'beat4'];
const COUNT_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'];
// where the count number of each stick of figure 1 is written (outside the house)
const COUNT_AT = [[-56, 20], [0, 76], [60, 20], [0, 76], [-52, -24], [52, -24]];

function totalPos(r) { return [C.labelX, C.yb[r] - 60]; }

function countBoard(ctx, beat, p) {
  const S = state(ORDER, beat, p);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const beats = ['beat2', 'beat3', 'beat4'];

  ROWS.forEach((list, r) => {
    const b = beats[r];
    L.text(`Hình ${r + 1}`, C.labelX, C.yb[r] - houseHeight(C.L) + 90, { size: 80, t: S(b, 'label') });
    if (r === 0) {
      // figure 1: builds, then every stick hops while its number is said
      const build = S(b, 'house');
      figure(objs, list, (s, i) => ({ u: stagger(build, i, 6, 0.45), hop: hopY(S(b, COUNT_KEYS[i]), 30) }));
      list.forEach((s, i) => {
        const [mx, my] = mid(s);
        const [ox, oy] = COUNT_AT[i];
        popText(L, String(i + 1), mx + ox, my + oy + 22, S(b, COUNT_KEYS[i]), { size: 84, color: CHALK.yellow });
      });
    } else {
      // figure r+1: the previous figure (cream), then 5 new mint sticks fly in from the right
      const old = S(b, 'old');
      const nw = S(b, 'new');
      const nOld = list.length - 5;
      const wallHop = r === 1 ? hopY(S(b, 'wall'), 40) : 0; // the shared wall hops while it is circled
      figure(objs, list, (s, i) => (i < nOld
        ? { u: stagger(old, i, nOld, 0.5), hop: s.house === 0 && s.role === 'wall' ? wallHop : 0 }
        : { u: stagger(nw, i - nOld, 5, 0.5), kind: 'dec', from: [260, -160] }));
      // shared wall (figure 2): yellow loop around the middle wall
      if (r === 1) {
        const w = S(b, 'wall');
        L.loop(C.x0 + C.L, C.yb[r] - C.L / 2, 38, C.L / 2 + 34, { color: CHALK.yellow, width: 10, t: w, seed: 140 });
        L.text('dùng chung', C.x0 + C.L, C.yb[r] + 92, { size: 64, color: CHALK.yellow, align: 'center', t: clamp01(w * 2 - 0.6) });
      }
      // +5 arc from the previous total to this one
      const v = S(b, 'plus');
      const [, y0] = totalPos(r - 1);
      const [, y1] = totalPos(r);
      sideArc(L, [C.plusX - 20, y0 - 10], [C.plusX - 20, y1 - 60], 45, v, { seed: 150 + r });
      const loops = S('beat4', 'loops');
      const lp = loops > 0 && loops < 1 ? 0.18 * Math.sin(Math.PI * loops) : 0;
      const py = (y0 + C.yb[r] - houseHeight(C.L) + 90) / 2 + 30;
      popText(L, '+5', C.labelX + 120, py, clamp01(v * 2 - 0.8), { size: 96, color: CHALK.mint, scale: 1 + lp });
      L.loop(C.labelX + 120, py - 32, 80, 60, { color: CHALK.yellow, width: 6, t: loops, seed: 160 + r });
    }
    const tot = S(b, 'total');
    const [tx, ty] = totalPos(r);
    row(L, [{ s: String(TOTALS[r]), color: CHALK.yellow, size: 110 }, 'que'], tx, ty,
      { size: 80, align: 'left', t: clamp01(tot * 2), seed: 170 + r });
    burst(L, tx + 40, ty - 36, 90, clamp01(tot * 1.6 - 0.6), { n: 8, seed: 180 + r });
  });
}
const beat2 = (ctx, p) => countBoard(ctx, 'beat2', p);
const beat3 = (ctx, p) => countBoard(ctx, 'beat3', p);
const beat4 = (ctx, p) => countBoard(ctx, 'beat4', p);

// --- beats 5–6: the rule, then figure 99 -------------------------------------------------
const R = { x0: 270, yb: 640, L: 190, eqY: 920, rows: [1080, 1215, 1360], optY: 1530, optX: [225, 540, 855] };
const BIG = houseSticks(R.x0, R.yb, R.L, 3);

function ruleBoard(ctx, beat, p) {
  const S = state(['beat5', 'beat6'], beat, p);
  const objs = ctx.objects();
  const L = ctx.chalk(60);

  // figure 3, big; each house's 5 sticks hop in turn and turn mint, the first wall stays cream
  const build = S('beat5', 'fig');
  const grp = S('beat5', 'groups');
  const wall = S('beat5', 'wall');
  figure(objs, BIG, (s, i) => {
    const u = stagger(build, i, BIG.length, 0.3);
    if (s.role === 'wall0') return { u, hop: hopY(wall, 34) };
    const gu = stagger(grp, s.house, 3, 0.5);
    return { u, kind: gu > 0.3 ? 'dec' : 'int', hop: hopY(gu, 34) };
  });
  // brackets "5" under each house
  for (let k = 0; k < 3; k++) {
    const gu = stagger(grp, k, 3, 0.5);
    const a = R.x0 + k * R.L + 14, b = a + R.L - 22, y = R.yb + 40;
    L.poly([[a, y], [a, y + 18], [b, y + 18], [b, y]], { color: CHALK.mint, width: 6, t: clamp01(gu * 2), seed: 200 + k, amp: 0.8 });
    popText(L, '5', (a + b) / 2, y + 110, clamp01(gu * 2 - 0.6), { size: 100, color: CHALK.mint });
  }
  // the first wall: "1"
  L.loop(R.x0, R.yb - R.L / 2, 36, R.L / 2 + 30, { color: CHALK.yellow, width: 10, t: wall, seed: 210 });
  popText(L, '1', R.x0 - 95, R.yb - R.L / 2 + 40, clamp01(wall * 2 - 0.5), { size: 130, color: CHALK.yellow });

  // Hình 3: 1 + 5 × 3 = 16  ✓
  const xs = row(L, ['Hình 3:', { s: '1', color: CHALK.yellow }, '+', { s: '5', color: CHALK.mint }, { sym: 'times' }, '3', '=',
    { s: '16', color: CHALK.yellow }], 520, R.eqY, { size: 84, t: S('beat5', 'eq'), seed: 220, gap: 0.3 });
  mark(L, true, xs[7] + 110, R.eqY - 30, S('beat5', 'ok'), { size: 66, seed: 230 });

  // Hình 99: 1 + 5 × 99 / = 1 + 495 / = 496 que
  row(L, ['Hình 99:', { s: '1', color: CHALK.yellow }, '+', { s: '5', color: CHALK.mint }, { sym: 'times' }, '99'], 540, R.rows[0],
    { size: 92, t: S('beat6', 'eq'), seed: 240, gap: 0.3 });
  // "Cộng 1": the 1 pulses yellow
  const c1 = S('beat6', 'plus1');
  const k1 = c1 > 0 && c1 < 1 ? 1 + 0.45 * Math.sin(Math.PI * c1) : 1;
  row(L, ['=', { s: '1', color: c1 > 0 ? CHALK.yellow : CHALK.white, size: 92 * k1 }, '+', '495'], 540, R.rows[1],
    { size: 92, t: S('beat6', 'mul'), seed: 250, gap: 0.3 });
  const res = S('beat6', 'res');
  const rx = row(L, ['=', { s: '496', color: CHALK.yellow, size: 124 }, 'que'], 540, R.rows[2],
    { size: 92, t: clamp01(res * 2), seed: 260, gap: 0.3 });
  L.loop(rx[1], R.rows[2] - 42, 120, 70, { color: CHALK.yellow, width: 7, t: clamp01(res * 1.6 - 0.6), seed: 270 });

  // options: A ✗, B circled, C ✗
  const opt = S('beat6', 'opts');
  const pick = S('beat6', 'pick');
  OPTIONS.forEach(([k, v], i) => {
    const ui = stagger(opt, i, 3, 0.5);
    const x = R.optX[i];
    L.text(`${k}. ${v}`, x, R.optY, { size: 80, align: 'center', t: ui });
    if (k === 'B') {
      L.loop(x, R.optY - 28, 160, 74, { color: CHALK.yellow, width: 8, t: clamp01(pick * 1.6), seed: 280 });
      burst(L, x, R.optY - 28, 140, clamp01(pick * 1.5 - 0.5), { n: 10, seed: 285 });
    } else {
      const c = clamp01(pick * 2 - 0.4);
      L.line([x - 120, R.optY - 70], [x + 120, R.optY + 20], { color: CHALK.red, width: 13, t: c, seed: 290 + i });
    }
  });
}
const beat5 = (ctx, p) => ruleBoard(ctx, 'beat5', p);
const beat6 = (ctx, p) => ruleBoard(ctx, 'beat6', p);

// --- beats 7–8: challenge, figure 10 --------------------------------------------------------
const Q = { x0: 90, yb: 700, L: 90, labelY: 320, tagY: 880, qY: 1180, ring: [880, 1120, 105] };
const Q_STICKS = houseSticks(Q.x0, Q.yb, Q.L, QUIZ);

function quizBoard(ctx, p) {
  const objs = ctx.objects();
  const h = g(p, 'houses');
  figure(objs, Q_STICKS, (s) => ({ u: clamp01((h * (QUIZ + 2) - s.house) / 2.2) }));
  const L = ctx.chalk(60);
  L.text('Đến lượt bạn!', 540, Q.labelY, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'label') });
  L.text('Hình 10', 540, Q.tagY, { size: 110, align: 'center', t: clamp01(h * 1.5 - 0.5) });
  return L;
}

function beat7(ctx, p) {
  const L = quizBoard(ctx, p);
  const q = g(p, 'q');
  popText(L, '?', 430, Q.qY + 90, q, { size: 300, color: CHALK.yellow });
  popText(L, 'que', 640, Q.qY + 30, clamp01(q * 1.6 - 0.4), { size: 110 });
  // countdown 3, 2, 1 inside a chalk timer ring that runs down; gone at the key pose
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const [cx, cy, r] = Q.ring;
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 300, amp: 0.6 });
    [3, 2, 1].forEach((n, i) => {
      const u = clamp01(c * 3 - i);
      if (u <= 0 || u >= 1) return;
      const k = u < 0.6 ? spring(u / 0.6, 3, 6) : 1.1 * (1 - clamp01((u - 0.6) / 0.4) ** 2);
      L.text(String(n), cx, cy + 52, { size: 150, align: 'center', scale: k });
    });
  }
}

function beat8(ctx, p) {
  const L = quizBoard(ctx, {});
  const a = g(p, 'ans');
  // "? que" winds up and shrinks away, then the answer is written in its place
  const k = outScale(1, clamp01(a * 4));
  if (k > 0) {
    L.text('?', 430, Q.qY + 90, { size: 300, color: CHALK.yellow, align: 'center', scale: k });
    L.text('que', 640, Q.qY + 30, { size: 110, align: 'center', scale: k });
  }
  const xs = row(L, [{ s: '1', color: CHALK.yellow }, '+', { s: '5', color: CHALK.mint }, { sym: 'times' }, '10', '=',
    { s: '51', color: CHALK.yellow, size: 140 }], 520, Q.qY + 40, { size: 104, t: clamp01(a * 1.35 - 0.3), seed: 320, gap: 0.3 });
  const lp = g(p, 'loop');
  L.loop(xs[6], Q.qY - 8, 105, 92, { color: CHALK.yellow, width: 8, t: clamp01(lp * 1.4), seed: 330 });
  sparks(L, xs[6], Q.qY - 8, 135, 170, clamp01(lp * 1.5 - 0.5), { n: 8, seed: 335 });
  popText(L, 'que', xs[6], Q.qY + 190, clamp01(lp * 2 - 0.6), { size: 84 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8 };
