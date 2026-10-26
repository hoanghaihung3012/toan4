// Có bao nhiêu số có 6 chữ số khác nhau là số chẵn? Facts: lessons/so_chan_6_chu_so/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, stagger, pop, spring, easeOutCubic } from '../../../../../shared/web/js/ease.js';
import { tile, badge } from '../../../../../shared/web/js/tiles.js';
import { row, flight } from '../../../../../shared/web/js/parts.js';
import {
  g, tileXs, dropPose, dust, burst, mark, hopY, hopSquash, thinkingDots, countdown, popLabel, bandWipe, arc, outScale,
} from '../../../../../shared/web/js/fx.js';

// --- facts (story.md F1–F2, K1–K2, D1–D5), checked by counting every arrangement --------------
function count(ok) {
  let n = 0;
  const used = Array(10).fill(false);
  const walk = (pos, first, last) => {
    if (pos === 6) { if (ok(first, last)) n++; return; }
    for (let d = 0; d < 10; d++) {
      if (used[d] || (pos === 0 && d === 0)) continue;
      used[d] = true;
      walk(pos + 1, pos === 0 ? d : first, d);
      used[d] = false;
    }
  };
  walk(0, -1, -1);
  return n;
}
const EVEN = count((f, l) => l % 2 === 0);
const CASE1 = count((f, l) => l === 0);
const CASE2 = count((f, l) => l % 2 === 0 && l !== 0);
const ODD = count((f, l) => l % 2 === 1);
console.assert(CASE1 === 9 * 8 * 7 * 6 * 5 && CASE1 === 15120, 'ones 0: 9 × 8 × 7 × 6 × 5 = 15120');
console.assert(CASE2 === 8 * 8 * 7 * 6 * 5 * 4 && CASE2 === 53760, 'ones 2/4/6/8: 8 × 8 × 7 × 6 × 5 × 4 = 53760');
console.assert(EVEN === CASE1 + CASE2 && EVEN === 68880, '15120 + 53760 = 68880');
console.assert(ODD === 67200 && EVEN + ODD === 9 * 9 * 8 * 7 * 6 * 5, 'challenge: odd 67200 (not shown)');
console.assert(10 - 2 === 8, 'first digit: not 0, not the ones digit');
// thousands separator (an English version sets ',')
export const NUM = { sep: ' ' };
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, NUM.sep);
console.assert(fmt(68880) === '68 880' && fmt(123456) === '123 456', 'thousands spacing');

// on-board words (an English version overrides these)
export const TEXT = {
  cond: 'Số có 6 chữ số', condB: 'khác nhau', is: 'là số', even: 'chẵn', odd: 'lẻ', notZero: '≠ 0',
  zeroFirst: 'Số 0 không đứng đầu', ask: 'Có bao nhiêu số?', ones: 'Hàng đơn vị:', first: 'Hàng đầu:',
  notZeroW: 'khác 0', box: 'Đơn vị là', case1: 'Đơn vị là 0', case2: 'Đơn vị là 2, 4, 6, 8', ways: 'cách', oneToNine: 'từ 1 đến 9',
  unit: 'số', drop: 'Hàng đầu: bỏ', and: 'và', lastDigit: 'chữ số cuối', answer: 'Có 68 880 số!',
  turn: 'Đến lượt bạn!', cmt: 'Bình luận đáp án nhé!',
};

// --- layout ----------------------------------------------------------------------------------
const T = THEME.layout.title;
const DIG = '0123456789', TRAY_S = 0.78, TRAY_Y = 250;
const C1_Y = 405, C2_Y = 500;
const SX = [165, 315, 465, 615, 765, 915], SLOT_Y = 690, SLOT_S = 0.95, RULE_Y = 605;
const LOW = [760, 1600];
const COUNT_Y = 960, EQ1_Y = 1290, EQ2_Y = 1430;
const trayXs = (cx) => tileXs(DIG, cx, TRAY_S);

function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
const ORDER = ['beat1', 'beat2', 'beat3', 'beat4', 'beat5'];

// ten wooden digit tiles drop in; hop[i] (0..1) makes tile i hop; dots marks the even ones
function tray(ctx, y, u, hop = {}, dots = 0) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const xs = trayXs(540);
  [...DIG].forEach((ch, i) => {
    const du = stagger(u, i, DIG.length, 0.4);
    const pose = dropPose(du, y, 360);
    const h = hop[i] || 0;
    if (pose) tile(objs, xs[i], pose.y + hopY(h, 34), ch, 'int', { scale: TRAY_S, squash: pose.squash * hopSquash(h) });
    dust(L, xs[i], y + 40, clamp01((du - 0.55) / 0.45), 10 + i * 7, TRAY_S);
    if (i % 2 === 0) {
      const k = spring(stagger(dots, i / 2, 5, 0.5), 3, 6);
      if (k > 0) L.loop(xs[i], y + 62, 7 * k, 7 * k, { color: CHALK.yellow, width: 9, seed: 30 + i });
    }
  });
}
function conditions(L, y1, y2, word, t1, t2, seed) {
  row(L, [TEXT.cond, { s: TEXT.condB, color: CHALK.yellow }], 540, y1, { size: 68, t: t1, seed, gap: 0.3 });
  row(L, [TEXT.is, { s: word, color: CHALK.yellow, size: 92 }], 540, y2, { size: 72, t: t2, seed: seed + 5, gap: 0.3 });
}
// six place slots with "?"; the rules above the first and last slot (beat 2)
function slots(ctx, S, hide = []) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const u = S('beat1', 'slots');
  SX.forEach((x, i) => {
    const { scale, squash } = pop(stagger(u, i, 6, 0.4));
    tile(objs, x, SLOT_Y, '', 'blank', { scale: scale * SLOT_S, squash });
    const k = outScale(stagger(S('beat1', 'q'), i, 6, 0.4), hide[i] || 0);
    if (k > 0) L.text('?', x, SLOT_Y + 26, { size: 76, color: CHALK.yellow, align: 'center', scale: k });
  });
  popLabel(L, TEXT.even, SX[5], RULE_Y, S('beat2', 'lastL'), { size: 58 });
  popLabel(L, TEXT.notZero, SX[0], RULE_Y, S('beat2', 'firstL'), { size: 62, color: CHALK.red });
}
function header(ctx, S, hide) {
  const ev = S('beat2', 'ev'), ev2 = S('beat4', 'ev2');
  const hop = {};
  [0, 2, 4, 6, 8].forEach((d, i) => { if (ev < 1) hop[d] = stagger(ev, i, 5, 0.4); });
  const z0 = S('beat2', 'z0');
  if (z0 > 0 && z0 < 1) hop[0] = z0;
  [2, 4, 6, 8].forEach((d, i) => { if (ev2 > 0 && ev2 < 1) hop[d] = stagger(ev2, i, 4, 0.45); });
  tray(ctx, TRAY_Y, S('beat1', 'tray'), hop, ev);
  conditions(ctx.chalk(60), C1_Y, C2_Y, TEXT.even, S('beat1', 'c1'), S('beat1', 'c2'), 20);
  slots(ctx, S, hide);
}

// --- beat 1 (lower): examples and the question ---------------------------------------------
function lower1(ctx, k) {
  const L = ctx.chalk(60);
  const ex1 = k('ex1'), ex2 = k('ex2');
  const s1 = fmt(123456), s2 = `012${NUM.sep}346`;
  L.text(s1, 430, 915, { size: 108, align: 'center', t: clamp01(ex1 * 2.5) });
  mark(L, true, 770, 880, clamp01(ex1 * 2.5 - 1), { size: 76, seed: 100 });
  L.text(s2, 430, 1080, { size: 108, align: 'center', t: clamp01(ex2 * 2.5) });
  mark(L, false, 770, 1045, clamp01(ex2 * 2.5 - 1), { size: 76, seed: 105 });
  const zx = 430 - measure(s2, 108) / 2 + measure('0', 108) / 2;
  L.loop(zx, 1045, 40, 56, { color: CHALK.red, width: 7, t: clamp01(ex2 * 2.5 - 0.6), seed: 110 });
  L.text(TEXT.zeroFirst, 540, 1180, { size: 60, align: 'center', color: CHALK.red, t: clamp01(ex2 * 2 - 1) });
  const a = k('ask');
  popLabel(L, TEXT.ask, 540, 1350, a, { size: 100 });
  burst(L, 540, 1318, 270, clamp01(a * 1.4 - 0.3), { seed: 120, n: 10 });
  thinkingDots(L, 540, 1480, k('dots'), { gap: 80, r: 16 });
}

// --- beat 2 (lower): the two rules, then two cases -----------------------------------------
const BOX = [[80, 500], [580, 1000]], BOX_Y = [1215, 1475];
function lower2(ctx, k) {
  const L = ctx.chalk(60);
  const EV = '0, 2, 4, 6, 8';
  const x1 = row(L, [TEXT.ones, { s: EV, color: CHALK.yellow }], 540, 890, { size: 68, t: k('r1'), seed: 200, gap: 0.3 });
  const x2 = row(L, [TEXT.first, { s: TEXT.notZeroW, color: CHALK.red }], 540, 1000, { size: 68, t: k('r2'), seed: 205, gap: 0.3 });
  // the 0 is in both rules: circle it in both
  const z0 = k('z0');
  const zA = x1[1] - measure(EV, 68) / 2 + measure('0', 68) / 2;
  const zB = x2[1] + measure(TEXT.notZeroW, 68) / 2 - measure('0', 68) / 2;
  L.loop(zA, 868, 30, 40, { color: CHALK.yellow, width: 6, t: clamp01(z0 * 2), seed: 230 });
  L.loop(zB, 978, 30, 40, { color: CHALK.yellow, width: 6, t: clamp01(z0 * 2 - 0.6), seed: 231 });
  const sp = k('split');
  const from = [540, 1060];
  arc(L, from, [290, BOX_Y[0] - 12], 40, sp, { seed: 210, width: 6 });
  arc(L, from, [790, BOX_Y[0] - 12], 40, sp, { seed: 215, width: 6 });
  [['box1', '0'], ['box2', '2, 4, 6, 8']].forEach(([key, s], i) => {
    const u = k(key);
    const [l, r] = BOX[i];
    L.rect(l, BOX_Y[0], r, BOX_Y[1], { color: CHALK.white, width: 5, t: clamp01(u * 2), seed: 220 + i });
    badge(L, (l + r) / 2, BOX_Y[0] + 74, i + 1, '', { active: true, t: clamp01(u * 2 - 0.4), size: 58 });
    L.text(TEXT.box, (l + r) / 2, BOX_Y[0] + 150, { size: 60, align: 'center', t: clamp01(u * 2 - 0.6) });
    L.text(s, (l + r) / 2, BOX_Y[0] + 232, { size: 78, align: 'center', color: CHALK.yellow, t: clamp01(u * 2 - 1) });
  });
}

// --- beats 3 and 4 (lower): ways per slot and the product ----------------------------------
// minus: the places that have one digit fewer than the place before (a "−1" hop)
function counts(L, ns, k, seed, minus) {
  ns.forEach((n, i) => {
    const u = k(`k${i}`);
    if (u <= 0) return;
    const s = spring(u, 3, 6);
    L.text(String(n), SX[i], COUNT_Y, { size: 86, color: CHALK.yellow, align: 'center', scale: s });
    L.text(n === 1 && TEXT.way ? TEXT.way : TEXT.ways, SX[i], COUNT_Y + 54, { size: 46, align: 'center', t: clamp01(u * 2 - 0.6) });
    burst(L, SX[i], COUNT_Y - 30, 60, clamp01(u * 1.4 - 0.3), { seed: seed + i * 3, n: 6 });
    // each next place has one digit fewer left: a small "−1" hop from the previous count
    if (minus.includes(i)) {
      console.assert(ns[i - 1] - ns[i] === 1, "-1 hop only where one digit fewer is left");
      arc(L, [SX[i - 1] + 20, COUNT_Y + 72], [SX[i] - 20, COUNT_Y + 72], -34, clamp01(u * 1.5), { color: CHALK.red, width: 4, head: 14, seed: seed + 50 + i });
      L.text('−1', (SX[i - 1] + SX[i]) / 2, COUNT_Y + 148, { size: 48, align: 'center', color: CHALK.red, t: clamp01(u * 2 - 0.8) });
    }
  });
}
function product(L, factors, result, k, seed, size) {
  const parts = [];
  factors.forEach((f, i) => { if (i) parts.push({ sym: 'times' }); parts.push(String(f)); });
  row(L, parts, 540, EQ1_Y, { size, t: k('eq'), seed, gap: 0.32 });
  const rs = fmt(result);
  const xs = row(L, ['=', { s: rs, color: CHALK.yellow }, TEXT.unit], 540, EQ2_Y, { size: 112, t: k('res'), seed: seed + 15, gap: 0.5 });
  const a = k('ans');
  L.loop(xs[1], EQ2_Y - 34, measure(rs, 112) / 2 + 22, 72, { color: CHALK.yellow, width: 7, t: a, seed: seed + 20 });
  burst(L, xs[1], EQ2_Y - 34, 200, clamp01(a * 1.3 - 0.3), { seed: seed + 30, n: 10 });
}
function lower3(ctx, k) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  badge(L, 112, 860, 1, TEXT.case1, { active: true, t: k('b'), size: 62 });
  // the 0 tile is taken from the tray and flies along an arc into the ones slot
  const z = k('z');
  if (z > 0) {
    const f = flight([trayXs(540)[0], TRAY_Y], [SX[5], SLOT_Y], z, 220);
    tile(objs, f.x, f.y, '0', 'int', { scale: TRAY_S + (SLOT_S - TRAY_S) * f.v, squash: f.squash });
  }
  dust(L, SX[5], SLOT_Y + 50, clamp01((z - 0.8) / 0.2), 300, SLOT_S);
  counts(L, [9, 8, 7, 6, 5, 1], k, 310, [1, 2, 3, 4]);
  row(L, [TEXT.first, { s: TEXT.oneToNine, color: CHALK.yellow }], 540, 1180, { size: 56, t: k('note'), seed: 320, gap: 0.3 });
  product(L, [9, 8, 7, 6, 5], CASE1, k, 330, 100);
}
function lower4(ctx, k) {
  const L = ctx.chalk(60);
  badge(L, 112, 860, 2, TEXT.case2, { active: true, t: k('b'), size: 62 });
  // 8 then 8: the first place may not be 0, the second may
  counts(L, [8, 8, 7, 6, 5, 4], k, 410, [2, 3, 4]);
  row(L, [TEXT.drop, { s: '0', color: CHALK.red }, TEXT.and, { s: TEXT.lastDigit, color: CHALK.red }], 540, 1180,
    { size: 56, t: k('note'), seed: 420, gap: 0.3 });
  product(L, [8, 8, 7, 6, 5, 4], CASE2, k, 430, 92);
}

// --- beat 5 (lower): column addition, written right to left ---------------------------------
const ADD = { r: 790, y1: 925, y2: 1060, rule: 1100, y3: 1235, size: 116 };
function rtl(L, s, right, y, t, color) {
  const n = s.replace(/ /g, '').length;
  let j = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ' ') continue;
    const u = easeOutCubic(clamp01(t * n - j));
    j++;
    if (u <= 0) continue;
    const x = right - measure(s.slice(i), ADD.size);
    L.text(s[i], x, y, { size: ADD.size, color, t: u });
  }
}
function lower5(ctx, k) {
  const L = ctx.chalk(60);
  const a1 = k('a1'), a2 = k('a2');
  badge(L, 250, ADD.y1, 1, '', { active: true, t: a1, size: 56 });
  L.text(fmt(CASE1), ADD.r, ADD.y1, { size: ADD.size, align: 'right', t: a1 });
  badge(L, 250, ADD.y2, 2, '', { active: true, t: a2, size: 56 });
  L.text(fmt(CASE2), ADD.r, ADD.y2, { size: ADD.size, align: 'right', t: a2 });
  L.text('+', 350, ADD.y2 - 50, { size: 100, align: 'center', t: clamp01(a2 * 2) });
  const sum = k('sum');
  L.line([330, ADD.rule], [ADD.r + 20, ADD.rule], { width: 7, t: clamp01(sum * 4), seed: 510 });
  rtl(L, fmt(EVEN), ADD.r, ADD.y3, clamp01(sum * 1.25 - 0.2), CHALK.yellow);
  const a = k('ans');
  popLabel(L, TEXT.answer, 540, 1450, a, { size: 110 });
  const w = measure(TEXT.answer, 110);
  L.loop(540, 1414, w / 2 + 46, 92, { color: CHALK.yellow, width: 8, t: clamp01(a * 1.6 - 0.4), seed: 520 });
  burst(L, 540, 1414, 300, clamp01(a * 1.3 - 0.3), { seed: 530, n: 12 });
}

// --- beats 1–5: one board; the band under the slots is wiped between steps ------------------
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => g(p, key);
  const full = () => 1;
  // beats 3–4: each slot's "?" gives way to its number of ways
  const hide = beat === 'beat3' || beat === 'beat4' ? SX.map((_, i) => k(`k${i}`)) : [];
  header(ctx, S, hide);
  const lowers = { beat1: lower1, beat2: lower2, beat3: lower3, beat4: lower4, beat5: lower5 };
  const prev = ORDER[ORDER.indexOf(beat) - 1];
  if (prev) bandWipe(ctx, k('wipe'), LOW, (c) => lowers[prev](c, full), 3);
  lowers[beat](ctx, k);
}
const beat1 = (ctx, p) => board(ctx, 'beat1', p);
const beat2 = (ctx, p) => board(ctx, 'beat2', p);
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);
const beat5 = (ctx, p) => board(ctx, 'beat5', p);

// --- beat 6: the practice problem ------------------------------------------------------------
function beat6(ctx, p) {
  const L0 = ctx.chalk(60);
  const tt = g(p, 'title');
  const w = L0.text(TEXT.turn, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L0.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5, color: CHALK.yellow });
  tray(ctx, 420, g(p, 'tray'));
  const L = ctx.chalk(60);
  conditions(L, 590, 700, TEXT.odd, g(p, 'c1'), g(p, 'c2'), 600);
  popLabel(L, TEXT.ask, 540, 910, g(p, 'ask'), { size: 104 });
  countdown(L, 540, 1190, g(p, 'count'), { size: 280 });
  row(L, [TEXT.cmt], 540, 1500, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
