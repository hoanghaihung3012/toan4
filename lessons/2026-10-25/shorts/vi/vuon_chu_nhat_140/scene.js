// Khu vườn hình chữ nhật: chu vi 140 m, 3 lần chiều rộng bằng 2 lần chiều dài. Tính diện tích.
// Facts: lessons/vuon_chu_nhat_140/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, lerp, stagger, spring, pop, easeOutCubic } from '../../../../../shared/web/js/ease.js';
import { row, flight } from '../../../../../shared/web/js/parts.js';
import { g, burst, mark, hopY, thinkingDots, countdown, popLabel } from '../../../../../shared/web/js/fx.js';
import { woodSvg, plank, grass, fence, THICK } from './garden.js';

// --- facts (story.md F1–F3, D1–D6), checked -----------------------------------------
const PER = 140; // F1: chu vi (m)
const KW = 3, KL = 2; // F2: 3 lần chiều rộng = 2 lần chiều dài
const HALF = PER / 2; // D1: dài + rộng
const PW = KL, PL = KW; // D2: rộng = 2 phần, dài = 3 phần (3 × 2 = 2 × 3 = 6 phần)
const PARTS = PW + PL; // D3: 5 phần
const ONE = HALF / PARTS; // D3: 14
const LEN = ONE * PL, WID = ONE * PW; // D4: 42, 28
const AREA = LEN * WID; // D5: 1176
console.assert(HALF === 70 && KW * PW === KL * PL && KW * PW === 6, 'half 70, 6 parts');
console.assert(PARTS === 5 && ONE === 14 && LEN === 42 && WID === 28, 'part 14: 42 and 28');
console.assert(2 * (LEN + WID) === PER && KW * WID === KL * LEN && KW * WID === 84, 'check: 140, 3 × 28 = 2 × 42 = 84');
console.assert(AREA === 1176, 'area 42 × 28 = 1176');
// D6: practice problem (answer not shown): chu vi 100 m, same rule
const CH = 100;
const chOne = CH / 2 / PARTS;
console.assert(chOne === 10 && chOne * PL * chOne * PW === 600, 'challenge: 30 × 20 = 600 (not shown)');
const S = String;

// --- helpers -------------------------------------------------------------------------------
const T = THEME.layout.title;
function heading(L, s, t, color = CHALK.white) {
  const w = L.text(s, T.x, T.y, { size: T.size, t, color });
  L.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t, seed: 5 });
}
const bump = (u, a = 0.3) => (u > 0 && u < 1 ? 1 + a * Math.sin(Math.PI * u) : 1);
// a chalk loop path around a box, drawn on with t (starting top-left, clockwise)
function traceBox(L, l, t, r, b, k, { color = CHALK.yellow, seed = 0, pad = 26 } = {}) {
  L.poly([[l - pad, t - pad], [r + pad, t - pad], [r + pad, b + pad], [l - pad, b + pad], [l - pad, t - pad]],
    { color, width: 8, t: k, seed, amp: 1.2 });
}
// beat order of boards that continue without an eraser
function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
// garden that builds: grass, then the four fence planks pop in turn
function buildGarden(svg, box, build, pose = () => ({}), grassOpt = {}) {
  const [l, t, r, b] = box;
  grass(svg, l, t, r, b, { fill: clamp01(build * 2), ...grassOpt });
  const order = ['top', 'right', 'bottom', 'left'];
  fence(svg, l, t, r, b, (side) => {
    const { scale, squash } = pop(stagger(build, order.indexOf(side), 4, 0.45));
    return { scale, squash, ...pose(side) };
  });
}

// --- beats 1 and 6: the problem (beat 6: the practice problem) ------------------------------
const P1 = { box: [288, 370, 792, 706], y: [900, 1010, 1150] }; // 12 px per m: 504 × 336

function problemBoard(ctx, p, { title, per, challenge = false }) {
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = P1.box;
  heading(L, title, g(p, 'title'), challenge ? CHALK.yellow : CHALK.white);
  const rw = g(p, 'rw'), ln = g(p, 'ln');
  buildGarden(svg, P1.box, g(p, 'garden'), (side) => ({
    kind: side === 'left' || side === 'right' ? (rw > 0 ? 'dec' : 'int') : 'int',
    dy: side === 'right' || side === 'left' ? hopY(rw, 26) : hopY(ln, 26),
  }), { glow: Math.sin(Math.PI * clamp01(g(p, 'area'))) });
  // labels "dài ?" and "rộng ?"
  const lab = clamp01(g(p, 'garden') * 2 - 1);
  popLabel(L, 'dài ?', (l + r) / 2, b + 90, lab, { size: 64, color: CHALK.white, pulse: ln });
  popLabel(L, 'rộng ?', r + 125, (t + b) / 2 + 20, lab, { size: 64, color: CHALK.mint, pulse: rw });
  // chu vi: a yellow loop all round the fence
  traceBox(L, l, t, r, b, g(p, 'trace'), { seed: 10 });
  const [y1, y2, y3] = P1.y;
  row(L, ['Chu vi', '=', { s: `${per} m`, color: CHALK.yellow }], 540, y1, { size: 80, t: g(p, 'per'), seed: 20, gap: 0.3 });
  row(L, ['3', { sym: 'times' }, { s: 'rộng', color: CHALK.mint }, '=', '2', { sym: 'times' }, 'dài'], 540, y2,
    { size: 80, t: g(p, 'rule'), seed: 30, gap: 0.3 });
  const ask = g(p, 'ask');
  row(L, ['Diện tích', '=', { s: '?', color: CHALK.yellow, size: 110 }, 'm²'], 540, y3, { size: 80, t: ask, seed: 40, gap: 0.3 });
  if (!challenge) {
    thinkingDots(L, 540, 1320, g(p, 'dots'), { gap: 80, r: 16 });
  } else {
    countdown(L, 540, 1300, g(p, 'count'), { size: 240 });
    row(L, ['Bình luận đáp án nhé!'], 540, 1520, { size: 72, t: g(p, 'cmt'), seed: 50 });
  }
}

const beat1 = (ctx, p) => problemBoard(ctx, p, { title: 'Khu vườn hình chữ nhật', per: PER });
const beat6 = (ctx, p) => problemBoard(ctx, p, { title: 'Đến lượt bạn!', per: CH, challenge: true });

// --- beats 2–4: half the fence -> a bar of 5 parts ----------------------------------------
const G2 = { box: [372, 290, 708, 514] }; // 8 px per m: 336 × 224
const BAR = { x0: 120, y: 765, k: 12 }; // 12 px per m: 504 + 336 = 840
const barL = { cx: BAR.x0 + (LEN * BAR.k) / 2, len: LEN * BAR.k };
const barW = { cx: BAR.x0 + LEN * BAR.k + (WID * BAR.k) / 2, len: WID * BAR.k };
const RAT = { x0: 270, k: 9, yA: 1045, yB: 1140 }; // 3 widths over 2 lengths, 9 px per m
const EQ = [1300, 1385, 1470, 1555];
const ORDER = ['beat2', 'beat3', 'beat4'];

function halfBoard(ctx, beat, p) {
  const St = stateOf(ORDER, beat, p);
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = G2.box;
  const fig = St('beat2', 'fig');
  heading(L, `Chu vi ${PER} m`, fig);
  const half = St('beat2', 'half');
  const fly = St('beat2', 'fly');
  buildGarden(svg, G2.box, fig, (side) => ({ kind: side === 'right' && half > 0.5 ? 'dec' : 'int' }));
  // whole fence first (chu vi), then half: bottom + right in yellow
  traceBox(L, l, t, r, b, St('beat2', 'all'), { seed: 60, color: CHALK.white });
  L.poly([[l - 26, b + 26], [r + 26, b + 26], [r + 26, t - 26]], { color: CHALK.yellow, width: 10, t: half, seed: 61, amp: 1 });
  // the bottom (dài) and right (rộng) planks fly down and lie end to end: dài + rộng
  const pieces = [
    { from: [(l + r) / 2, b], a0: 0, len0: r - l + THICK, to: [barL.cx, BAR.y], len1: barL.len, kind: 'int', u: stagger(fly, 0, 2, 0.7) },
    { from: [r, (t + b) / 2], a0: 90, len0: b - t + THICK, to: [barW.cx, BAR.y], len1: barW.len, kind: 'dec', u: stagger(fly, 1, 2, 0.7) },
  ];
  pieces.forEach((q, i) => {
    if (q.u <= 0) return;
    const f = flight(q.from, q.to, q.u, i === 0 ? 120 : 160);
    const hop = i === 0 ? hopY(St('beat4', 'len'), 22) : hopY(St('beat4', 'wid'), 22);
    plank(svg, f.x, f.y + hop, lerp(q.len0, q.len1, f.v), { kind: q.kind, angle: lerp(q.a0, 0, f.v), squash: f.squash, thick: 26 });
  });
  const landed = clamp01(fly * 2 - 1);
  popLabel(L, 'dài', barL.cx, BAR.y + 64, landed, { size: 60, color: CHALK.white, pulse: St('beat4', 'len') });
  popLabel(L, 'rộng', barW.cx, BAR.y + 64, landed, { size: 60, color: CHALK.mint, pulse: St('beat4', 'wid') });
  // 140 : 2 = 70 and the brace "70 m" under the bar
  row(L, [S(PER), ':', '2', '=', { s: S(HALF), color: CHALK.yellow }], 540, 632, { size: 72, t: St('beat2', 'eq'), seed: 70, gap: 0.3 });
  const br = St('beat2', 'brace');
  const x0 = BAR.x0, x1 = BAR.x0 + HALF * BAR.k, yb = BAR.y + 74;
  L.poly([[x0, yb], [x0, yb + 16], [(x0 + x1) / 2 - 14, yb + 16], [(x0 + x1) / 2, yb + 32], [(x0 + x1) / 2 + 14, yb + 16], [x1, yb + 16], [x1, yb]],
    { color: CHALK.yellow, width: 6, t: br, seed: 71, amp: 0.8 });
  popLabel(L, `${HALF} m`, (x0 + x1) / 2, yb + 92, clamp01(br * 2 - 0.6), { size: 70, pulse: St('beat4', 'e1') });

  // beat 3: 3 widths are as long as 2 lengths; cut that into 6 equal parts
  const wA = St('beat3', 'rowA'), wB = St('beat3', 'rowB');
  L.text('3 × rộng', 70, RAT.yA + 18, { size: 50, color: CHALK.mint, t: wA });
  L.text('2 × dài', 70, RAT.yB + 18, { size: 50, t: wB });
  for (let i = 0; i < KW; i++) {
    const { scale, squash } = pop(stagger(wA, i, KW, 0.5));
    plank(svg, RAT.x0 + (i + 0.5) * WID * RAT.k, RAT.yA, WID * RAT.k - 6, { kind: 'dec', scale, squash, thick: 24 });
  }
  for (let i = 0; i < KL; i++) {
    const { scale, squash } = pop(stagger(wB, i, KL, 0.5));
    plank(svg, RAT.x0 + (i + 0.5) * LEN * RAT.k, RAT.yB, LEN * RAT.k - 6, { kind: 'int', scale, squash, thick: 24 });
  }
  const same = St('beat3', 'same');
  const xEnd = RAT.x0 + KW * WID * RAT.k;
  console.assert(xEnd === RAT.x0 + KL * LEN * RAT.k, 'rows end together');
  L.dashed([RAT.x0, RAT.yA - 40], [RAT.x0, RAT.yB + 40], { color: CHALK.yellow, width: 5, t: same });
  L.dashed([xEnd, RAT.yA - 40], [xEnd, RAT.yB + 40], { color: CHALK.yellow, width: 5, t: same });
  const tk = St('beat3', 'ticks');
  const part = ONE * RAT.k;
  for (let i = 1; i < KW * PW; i++) {
    L.dashed([RAT.x0 + i * part, RAT.yA - 16], [RAT.x0 + i * part, RAT.yB + 16], { color: CHALK.yellow, width: 4, t: stagger(tk, i - 1, 5, 0.5) });
  }
  const l2 = St('beat3', 'lab2'), l3 = St('beat3', 'lab3');
  for (let i = 0; i < KW; i++) popLabel(L, `${PW} phần`, RAT.x0 + (i + 0.5) * WID * RAT.k, RAT.yA - 30, stagger(l2, i, KW, 0.5), { size: 52, color: CHALK.mint });
  for (let i = 0; i < KL; i++) popLabel(L, `${PL} phần`, RAT.x0 + (i + 0.5) * LEN * RAT.k, RAT.yB + 72, stagger(l3, i, KL, 0.5), { size: 52, color: CHALK.white });

  // beat 4: the bar is 5 parts of 14 m
  const k5 = St('beat4', 'ticks');
  for (let i = 1; i < PARTS; i++) {
    const x = BAR.x0 + i * ONE * BAR.k;
    L.dashed([x, BAR.y - 18], [x, BAR.y + 16], { color: CHALK.yellow, width: 5, t: stagger(k5, i - 1, 4, 0.5) });
  }
  const one = St('beat4', 'one');
  for (let i = 0; i < PARTS; i++) {
    popLabel(L, S(ONE), BAR.x0 + (i + 0.5) * ONE * BAR.k, BAR.y - 24, stagger(one, i, PARTS, 0.5), { size: 52 });
  }
  row(L, [`${PARTS} phần`, '=', `${HALF} m`], 540, EQ[0], { size: 64, t: St('beat4', 'e1'), seed: 80, gap: 0.3 });
  row(L, ['1 phần', '=', S(HALF), ':', S(PARTS), '=', { s: `${ONE} m`, color: CHALK.yellow }], 540, EQ[1], { size: 64, t: St('beat4', 'e2'), seed: 90, gap: 0.3 });
  const xl = row(L, ['dài', '=', S(ONE), { sym: 'times' }, S(PL), '=', { s: `${LEN} m`, color: CHALK.yellow }], 540, EQ[2], { size: 64, t: St('beat4', 'e3'), seed: 100, gap: 0.3 });
  const xw = row(L, [{ s: 'rộng', color: CHALK.mint }, '=', S(ONE), { sym: 'times' }, S(PW), '=', { s: `${WID} m`, color: CHALK.yellow }], 540, EQ[3], { size: 64, t: St('beat4', 'e4'), seed: 110, gap: 0.3 });
  burst(L, xl[6], EQ[2] - 22, 90, clamp01(St('beat4', 'e3') * 1.6 - 0.6), { seed: 120 });
  burst(L, xw[6], EQ[3] - 22, 90, clamp01(St('beat4', 'e4') * 1.6 - 0.6), { seed: 125 });
}
const beat2 = (ctx, p) => halfBoard(ctx, 'beat2', p);
const beat3 = (ctx, p) => halfBoard(ctx, 'beat3', p);
const beat4 = (ctx, p) => halfBoard(ctx, 'beat4', p);

// --- beat 5: the area and the check -----------------------------------------------------------
const G5 = { box: [225, 330, 855, 750] }; // 15 px per m: 630 × 420
console.assert(G5.box[2] - G5.box[0] === LEN * 15 && G5.box[3] - G5.box[1] === WID * 15, 'garden 42 × 28 at 15 px/m');

function beat5(ctx, p) {
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = G5.box;
  heading(L, 'Diện tích', g(p, 'title'));
  const area = g(p, 'area');
  // the fence first, then the grass fills the inside while "Diện tích" is said
  fence(svg, l, t, r, b, (side) => {
    const { scale, squash } = pop(stagger(g(p, 'fig'), ['top', 'right', 'bottom', 'left'].indexOf(side), 4, 0.45));
    return { scale, squash, kind: side === 'left' || side === 'right' ? 'dec' : 'int' };
  });
  grass(svg, l + THICK / 2, t + THICK / 2, r - THICK / 2, b - THICK / 2, { fill: area });
  const dims = g(p, 'dims');
  popLabel(L, `${LEN} m`, (l + r) / 2, b + 90, dims, { size: 72, color: CHALK.white });
  popLabel(L, `${WID} m`, r + 95, (t + b) / 2 + 24, clamp01(dims * 1.4 - 0.2), { size: 72, color: CHALK.mint });
  row(L, ['Diện tích', '=', S(LEN), { sym: 'times' }, S(WID)], 540, 950, { size: 76, t: g(p, 'eq'), seed: 130, gap: 0.3 });
  const res = g(p, 'res');
  const xr = row(L, ['=', { s: `${AREA} m²`, color: CHALK.yellow, size: 104 }], 540, 1080, { size: 76, t: clamp01(res * 2), seed: 140, gap: 0.45 });
  L.loop(xr[1] + 6, 1080 - 34, 180, 74, { color: CHALK.yellow, width: 8, t: clamp01(res * 1.6 - 0.6), seed: 145 });
  burst(L, xr[1], 1080 - 34, 230, clamp01(res * 1.5 - 0.5), { n: 10, seed: 147 });
  // check: 3 × 28 = 84, 2 × 42 = 84
  const c1 = g(p, 'c1'), c2 = g(p, 'c2');
  const a = row(L, ['3', { sym: 'times' }, S(WID), '=', { s: S(KW * WID), color: CHALK.yellow }], 470, 1290, { size: 72, t: c1, seed: 150, gap: 0.3 });
  const bb = row(L, ['2', { sym: 'times' }, S(LEN), '=', { s: S(KL * LEN), color: CHALK.yellow }], 470, 1400, { size: 72, t: c2, seed: 160, gap: 0.3 });
  L.loop(a[4], 1290 - 24, 54, 48, { color: CHALK.yellow, width: 6, t: clamp01(c1 * 2 - 1), seed: 170 });
  L.loop(bb[4], 1400 - 24, 54, 48, { color: CHALK.yellow, width: 6, t: clamp01(c2 * 2 - 1), seed: 171 });
  mark(L, true, 780, 1335, g(p, 'ok'), { size: 90, seed: 180 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
