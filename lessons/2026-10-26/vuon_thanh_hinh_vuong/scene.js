// Mảnh vườn hình chữ nhật chu vi 120 m; tăng chiều rộng 10 m, giảm chiều dài 10 m thì thành
// hình vuông. Tính diện tích. Facts: lessons/vuon_thanh_hinh_vuong/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, lerp, stagger, pop } from '../../../shared/web/js/ease.js';
import { row, flight } from '../../../shared/web/js/parts.js';
import { g, burst, mark, hopY, thinkingDots, countdown, popLabel } from '../../../shared/web/js/fx.js';
import { woodSvg, plank, grass, fence, THICK } from './garden.js';

// --- facts (story.md F1–F3, D1–D6), checked -----------------------------------------------
const PER = 120; // F1: chu vi (m)
const D = 10; // F2: rộng + 10 m, dài − 10 m -> hình vuông
const HALF = PER / 2; // D1: dài + rộng = 60
const DIFF = D + D; // D2: dài − rộng = 20
const LEN = (HALF + DIFF) / 2, WID = HALF - LEN; // D3: 40, 20
const SIDE = LEN - D; // D5: 30
const AREA = LEN * WID; // D4: 800
console.assert(HALF === 60 && DIFF === 20, 'half 60, difference 20');
console.assert(LEN === 40 && WID === 20 && WID + D === SIDE && SIDE === 30, '40 and 20; both sides become 30');
console.assert(2 * (LEN + WID) === PER && AREA === 800, 'check 120; area 800');
// D6: practice problem (answer not shown): chu vi 100 m, same rule
const CH = 100;
const chLen = (CH / 2 + DIFF) / 2, chWid = CH / 2 - chLen;
console.assert(chLen === 35 && chWid === 15 && chLen * chWid === 525, 'challenge: 35 × 15 = 525 (not shown)');
const S = String;

// --- board text (an English version overrides it, see lessons/vuon_thanh_hinh_vuong_en) ------
export const TEXT = {
  title: 'Mảnh vườn hình chữ nhật',
  yourTurn: 'Đến lượt bạn!',
  lenQ: 'dài ?',
  widQ: 'rộng ?',
  square: 'hình vuông',
  per: 'Chu vi',
  area: 'Diện tích',
  comment: 'Bình luận đáp án nhé!',
  len: 'dài',
  wid: 'rộng',
  sum: 'tổng',
  div: ':',
};
// layout tweaks for longer words in another language (defaults = the Vietnamese layout)
export const FIT = { cmpLenX: 70, cmpWidX: 56, cmpLenSize: 52, cmpWidSize: 50, eqSize: 64 };

// --- helpers -------------------------------------------------------------------------------
const T = THEME.layout.title;
function heading(L, s, t, color = CHALK.white) {
  const w = L.text(s, T.x, T.y, { size: T.size, t, color });
  L.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t, seed: 5 });
}
function traceBox(L, l, t, r, b, k, { color = CHALK.yellow, seed = 0, pad = 26 } = {}) {
  L.poly([[l - pad, t - pad], [r + pad, t - pad], [r + pad, b + pad], [l - pad, b + pad], [l - pad, t - pad]],
    { color, width: 8, t: k, seed, amp: 1.2 });
}
function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
function buildGarden(svg, box, build, pose = () => ({}), grassOpt = {}) {
  const [l, t, r, b] = box;
  grass(svg, l, t, r, b, { fill: clamp01(build * 2), ...grassOpt });
  const order = ['top', 'right', 'bottom', 'left'];
  fence(svg, l, t, r, b, (side) => {
    const { scale, squash } = pop(stagger(build, order.indexOf(side), 4, 0.45));
    return { scale, squash, ...pose(side) };
  });
}

// --- beats 1 and 6: the problem (beat 6: the practice problem) -------------------------------
const K1 = 12; // px per m in the drawing
const P1 = { box: [300, 420, 300 + LEN * K1, 420 + WID * K1], y: [940, 1060] };
const SQ = [P1.box[0], P1.box[1], P1.box[0] + SIDE * K1, P1.box[1] + SIDE * K1];
console.assert(SQ[2] - SQ[0] === SQ[3] - SQ[1], 'the dashed outline is a square');

function problemBoard(ctx, p, { title, per, challenge = false }) {
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = P1.box;
  heading(L, title, g(p, 'title'), challenge ? CHALK.yellow : CHALK.white);
  const wid = g(p, 'wid'), len = g(p, 'len'), sq = g(p, 'sq');
  buildGarden(svg, P1.box, g(p, 'garden'), (side) => ({
    kind: side === 'left' || side === 'right' ? 'dec' : 'int',
    dy: side === 'right' ? hopY(len, 22) : side === 'bottom' ? hopY(wid, 22) : 0,
  }), { glow: Math.sin(Math.PI * clamp01(g(p, 'area'))) });
  const lab = clamp01(g(p, 'garden') * 2 - 1);
  popLabel(L, TEXT.lenQ, (l + r) / 2 - 80, t - 66, lab, { size: 66, color: CHALK.white });
  popLabel(L, TEXT.widQ, r + 135, (t + b) / 2 + 20, lab, { size: 66, color: CHALK.mint });
  traceBox(L, l, t, r, b, g(p, 'trace'), { seed: 10 });
  // + 10 m on the width: the square's sides grow down past the bottom fence
  const [sl, st, sr, sb] = SQ;
  L.dashed([sl, b + 12], [sl, sb], { color: CHALK.mint, width: 6, t: clamp01(wid * 2) });
  L.dashed([sl, sb], [sr, sb], { color: CHALK.mint, width: 6, t: clamp01(wid * 2 - 1) });
  popLabel(L, `+${D} m`, sl - 120, (b + sb) / 2 + 24, clamp01(wid * 1.5 - 0.3), { size: 70, color: CHALK.mint });
  // − 10 m on the length: the end of the length is crossed off, a new side stands at sr
  L.line([sr + 8, t - 14], [r, t + 14], { color: CHALK.red, width: 8, t: clamp01(len * 2), seed: 12 });
  L.line([sr + 8, b - 14], [r, b + 14], { color: CHALK.red, width: 8, t: clamp01(len * 2), seed: 13 });
  L.dashed([sr, t + 12], [sr, sb], { color: CHALK.yellow, width: 6, t: clamp01(len * 2 - 1) });
  popLabel(L, `−${D} m`, (sr + r) / 2 + 20, t - 66, clamp01(len * 1.5 - 0.3), { size: 70, color: CHALK.red });
  popLabel(L, TEXT.square, (sl + sr) / 2, sb - 30, sq, { size: 60, color: CHALK.yellow });
  const [y1, y2] = P1.y;
  row(L, [TEXT.per, '=', { s: `${per} m`, color: CHALK.yellow }], 540, y1, { size: 80, t: g(p, 'per'), seed: 20, gap: 0.3 });
  row(L, [TEXT.area, '=', { s: '?', color: CHALK.yellow, size: 110 }, 'm²'], 540, y2, { size: 80, t: g(p, 'ask'), seed: 40, gap: 0.3 });
  if (!challenge) {
    thinkingDots(L, 540, 1220, g(p, 'dots'), { gap: 80, r: 16 });
  } else {
    countdown(L, 540, 1250, g(p, 'count'), { size: 220 });
    row(L, [TEXT.comment], 540, 1500, { size: 72, t: g(p, 'cmt'), seed: 50 });
  }
}
const beat1 = (ctx, p) => problemBoard(ctx, p, { title: TEXT.title, per: PER });
const beat6 = (ctx, p) => problemBoard(ctx, p, { title: TEXT.yourTurn, per: CH, challenge: true });

// --- beats 2–4: half the fence -> dài + rộng = 60; dài − rộng = 20 ---------------------------
const G2 = { box: [380, 290, 380 + LEN * 8, 290 + WID * 8] }; // 8 px per m
const BAR = { x0: 180, y: 685, k: 12 };
const barL = { cx: BAR.x0 + (LEN * BAR.k) / 2, len: LEN * BAR.k };
const barW = { cx: BAR.x0 + LEN * BAR.k + (WID * BAR.k) / 2, len: WID * BAR.k };
const CMP = { yL: 1010, yW: 1110 }; // dài over rộng, both from BAR.x0
const EQ = [1265, 1385, 1495];
const ORDER = ['beat2', 'beat3', 'beat4'];

function halfBoard(ctx, beat, p) {
  const St = stateOf(ORDER, beat, p);
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = G2.box;
  const fig = St('beat2', 'fig');
  heading(L, `${TEXT.per} ${PER} m`, fig);
  const half = St('beat2', 'half');
  const fly = St('beat2', 'fly');
  buildGarden(svg, G2.box, fig, (side) => ({ kind: side === 'left' || side === 'right' ? 'dec' : 'int' }));
  L.poly([[l - 26, b + 26], [r + 26, b + 26], [r + 26, t - 26]], { color: CHALK.yellow, width: 10, t: half, seed: 61, amp: 1 });
  const pieces = [
    { from: [(l + r) / 2, b], a0: 0, len0: r - l + THICK, to: [barL.cx, BAR.y], len1: barL.len, kind: 'int', u: stagger(fly, 0, 2, 0.7) },
    { from: [r, (t + b) / 2], a0: 90, len0: b - t + THICK, to: [barW.cx, BAR.y], len1: barW.len, kind: 'dec', u: stagger(fly, 1, 2, 0.7) },
  ];
  const hl = St('beat4', 'hl');
  pieces.forEach((q, i) => {
    if (q.u <= 0) return;
    const f = flight(q.from, q.to, q.u, i === 0 ? 120 : 160);
    plank(svg, f.x, f.y, lerp(q.len0, q.len1, f.v), { kind: q.kind, angle: lerp(q.a0, 0, f.v), squash: f.squash, thick: 26 });
  });
  const landed = clamp01(fly * 2 - 1);
  popLabel(L, TEXT.len, barL.cx, BAR.y - 34, landed, { size: 60, color: CHALK.white });
  popLabel(L, TEXT.wid, barW.cx, BAR.y - 34, landed, { size: 60, color: CHALK.mint });
  row(L, [S(PER), TEXT.div, '2', '=', { s: S(HALF), color: CHALK.yellow }], 540, 545, { size: 72, t: St('beat2', 'eq'), seed: 70, gap: 0.3 });
  const br = St('beat2', 'brace');
  const x0 = BAR.x0, x1 = BAR.x0 + HALF * BAR.k, yb = BAR.y + 30;
  L.poly([[x0, yb], [x0, yb + 16], [(x0 + x1) / 2 - 14, yb + 16], [(x0 + x1) / 2, yb + 32], [(x0 + x1) / 2 + 14, yb + 16], [x1, yb + 16], [x1, yb]],
    { color: CHALK.yellow, width: 6, t: br, seed: 71, amp: 0.8 });
  popLabel(L, `${TEXT.sum} ${HALF} m`, (x0 + x1) / 2, yb + 96, clamp01(br * 2 - 0.6), { size: 66, pulse: stagger(hl, 0, 2, 0.6) });

  // beat 3: dài − 10 and rộng + 10 are equal, so dài is 10 + 10 = 20 longer
  const rows = St('beat3', 'rows');
  const cut = St('beat3', 'cut'), add = St('beat3', 'add');
  const pl = pop(stagger(rows, 0, 2, 0.6)), pw = pop(stagger(rows, 1, 2, 0.6));
  const sideX = BAR.x0 + SIDE * BAR.k, lenX = BAR.x0 + LEN * BAR.k, widX = BAR.x0 + WID * BAR.k;
  // dài: the kept part, then the 10 m end piece that hops off and shrinks away
  if (pl.scale > 0) {
    const keep = cut > 0.5 ? SIDE * BAR.k : LEN * BAR.k;
    plank(svg, BAR.x0 + keep / 2, CMP.yL, keep, { kind: 'int', scale: pl.scale, squash: pl.squash, thick: 26 });
    if (cut > 0.5 && cut < 1) {
      const u = (cut - 0.5) / 0.5;
      const s = u < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (u / 0.3)) : 1.15 * (1 - (u - 0.3) / 0.7);
      plank(svg, (sideX + lenX) / 2 + 40 * u, CMP.yL - 60 * Math.sin(Math.PI * u), D * BAR.k, { kind: 'int', scale: Math.max(0, s), angle: 20 * u, thick: 26 });
    }
  }
  // the cut line on dài (red) before it comes off
  L.line([sideX, CMP.yL - 30], [sideX, CMP.yL + 30], { color: CHALK.red, width: 8, t: clamp01(cut * 2), seed: 80 });
  if (pw.scale > 0) plank(svg, BAR.x0 + (WID * BAR.k) / 2, CMP.yW, WID * BAR.k, { kind: 'dec', scale: pw.scale, squash: pw.squash, thick: 26 });
  // + 10 m piece drops onto the end of rộng
  if (add > 0) {
    const f = flight([widX + 60, CMP.yW - 160], [(widX + sideX) / 2, CMP.yW], add, 40);
    plank(svg, f.x, f.y, D * BAR.k, { kind: 'dec', squash: f.squash, thick: 26 });
  }
  L.text(TEXT.len, FIT.cmpLenX, CMP.yL + 18, { size: FIT.cmpLenSize, t: rows });
  L.text(TEXT.wid, FIT.cmpWidX, CMP.yW + 18, { size: FIT.cmpWidSize, color: CHALK.mint, t: rows });
  popLabel(L, `−${D}`, (sideX + lenX) / 2 + 10, CMP.yL - 42, clamp01(cut * 2), { size: 64, color: CHALK.red, pulse: St('beat3', 'gap') });
  popLabel(L, `+${D}`, (widX + sideX) / 2, CMP.yW + 78, clamp01(add * 2 - 1), { size: 64, color: CHALK.mint, pulse: St('beat3', 'gap') });
  L.dashed([sideX, CMP.yL - 50], [sideX, CMP.yW + 40], { color: CHALK.yellow, width: 5, t: St('beat3', 'same') });
  // the gap: from the end of rộng to the end of dài = 10 + 10
  const gap = St('beat3', 'gap');
  L.dashed([widX, CMP.yW - 40], [widX, CMP.yL - 30], { color: CHALK.yellow, width: 5, t: gap });
  L.dashed([lenX, CMP.yL + 30], [lenX, CMP.yW + 10], { color: CHALK.yellow, width: 5, t: gap });
  L.arrow([widX + 10, (CMP.yL + CMP.yW) / 2], [lenX - 10, (CMP.yL + CMP.yW) / 2], { color: CHALK.yellow, width: 6, t: gap, seed: 85, head: 22 });
  L.arrow([lenX - 10, (CMP.yL + CMP.yW) / 2], [widX + 10, (CMP.yL + CMP.yW) / 2], { color: CHALK.yellow, width: 6, t: gap, seed: 86, head: 22 });
  popLabel(L, `${DIFF} m`, lenX + 100, (CMP.yL + CMP.yW) / 2 + 22, clamp01(gap * 2 - 1), { size: 76, pulse: stagger(hl, 1, 2, 0.6) });
  row(L, [TEXT.len, { sym: 'minus' }, { s: TEXT.wid, color: CHALK.mint }, '=', S(D), '+', S(D), '=', { s: `${DIFF} m`, color: CHALK.yellow }], 540, EQ[0],
    { size: FIT.eqSize, t: St('beat3', 'e1'), seed: 90, gap: 0.3 });

  // beat 4: sum 60, difference 20
  const xl = row(L, [TEXT.len, '=', `(${HALF} + ${DIFF})`, TEXT.div, '2', '=', { s: `${LEN} m`, color: CHALK.yellow }], 540, EQ[1],
    { size: FIT.eqSize, t: St('beat4', 'e2'), seed: 100, gap: 0.3 });
  const xw = row(L, [{ s: TEXT.wid, color: CHALK.mint }, '=', S(HALF), { sym: 'minus' }, S(LEN), '=', { s: `${WID} m`, color: CHALK.yellow }], 540, EQ[2],
    { size: FIT.eqSize, t: St('beat4', 'e3'), seed: 110, gap: 0.3 });
  burst(L, xl[6], EQ[1] - 22, 60, clamp01(St('beat4', 'e2') * 1.6 - 0.6), { seed: 120 });
  burst(L, xw[6], EQ[2] - 22, 60, clamp01(St('beat4', 'e3') * 1.6 - 0.6), { seed: 125 });
}
const beat2 = (ctx, p) => halfBoard(ctx, 'beat2', p);
const beat3 = (ctx, p) => halfBoard(ctx, 'beat3', p);
const beat4 = (ctx, p) => halfBoard(ctx, 'beat4', p);

// --- beat 5: the area and the check -------------------------------------------------------------
const K5 = 14;
const G5 = { box: [260, 330, 260 + LEN * K5, 330 + WID * K5] };

function beat5(ctx, p) {
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const [l, t, r, b] = G5.box;
  const fig = g(p, 'fig');
  heading(L, TEXT.area, fig);
  fence(svg, l, t, r, b, (side) => {
    const { scale, squash } = pop(stagger(fig, ['top', 'right', 'bottom', 'left'].indexOf(side), 4, 0.45));
    return { scale, squash, kind: side === 'left' || side === 'right' ? 'dec' : 'int' };
  });
  grass(svg, l + THICK / 2, t + THICK / 2, r - THICK / 2, b - THICK / 2, { fill: g(p, 'area') });
  const dims = g(p, 'dims');
  popLabel(L, `${LEN} m`, (l + r) / 2, b + 90, dims, { size: 72, color: CHALK.white });
  popLabel(L, `${WID} m`, r + 95, (t + b) / 2 + 24, clamp01(dims * 1.4 - 0.2), { size: 72, color: CHALK.mint });
  row(L, [TEXT.area, '=', S(LEN), { sym: 'times' }, S(WID)], 540, 830, { size: 76, t: g(p, 'eq'), seed: 130, gap: 0.3 });
  const res = g(p, 'res');
  const xr = row(L, ['=', { s: `${AREA} m²`, color: CHALK.yellow, size: 104 }], 540, 960, { size: 76, t: clamp01(res * 2), seed: 140, gap: 0.9 });
  L.loop(xr[1] + 8, 960 - 34, 200, 80, { color: CHALK.yellow, width: 8, t: clamp01(res * 1.6 - 0.6), seed: 145 });
  burst(L, xr[1], 960 - 34, 270, clamp01(res * 1.5 - 0.5), { n: 10, seed: 147 });
  // check: both sides become 30 m
  const c1 = g(p, 'c1'), c2 = g(p, 'c2');
  const a = row(L, [S(LEN), { sym: 'minus' }, S(D), '=', { s: S(SIDE), color: CHALK.yellow }], 450, 1170, { size: 72, t: c1, seed: 150, gap: 0.42 });
  const bb = row(L, [{ s: S(WID), color: CHALK.mint }, '+', S(D), '=', { s: S(SIDE), color: CHALK.yellow }], 450, 1280, { size: 72, t: c2, seed: 160, gap: 0.42 });
  L.loop(a[4], 1170 - 24, 54, 48, { color: CHALK.yellow, width: 6, t: clamp01(c1 * 2 - 1), seed: 170 });
  L.loop(bb[4], 1280 - 24, 54, 48, { color: CHALK.yellow, width: 6, t: clamp01(c2 * 2 - 1), seed: 171 });
  mark(L, true, 760, 1215, g(p, 'ok'), { size: 90, seed: 180 });
  popLabel(L, TEXT.square, 540, 1420, g(p, 'ok'), { size: 64, color: CHALK.yellow });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
