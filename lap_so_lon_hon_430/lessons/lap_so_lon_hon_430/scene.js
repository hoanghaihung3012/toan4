// Từ 1, 3, 4, 6, 8 lập được bao nhiêu số có 3 chữ số khác nhau, lớn hơn 430?
// Facts: lessons/lap_so_lon_hon_430/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, stagger, pop, spring } from '../../shared/web/js/ease.js';
import { tile, badge } from '../../shared/web/js/tiles.js';
import { row, flight } from '../../shared/web/js/parts.js';
import {
  g, tileXs, dropTiles, dust, burst, mark, hopY, outScale, thinkingDots, countdown, popLabel, bandWipe,
} from '../../shared/web/js/fx.js';

// --- facts (story.md F1–F3, D1–D6), checked by listing every number ---------------------------
const DIGITS = [1, 3, 4, 6, 8];
const LIMIT = 430, CH_LIMIT = 640;
const ALL = [];
for (const a of DIGITS) for (const b of DIGITS) for (const c of DIGITS) {
  if (a !== b && b !== c && a !== c) ALL.push(100 * a + 10 * b + c);
}
const over = (n) => ALL.filter((x) => x > n);
const hund = (h, list) => list.filter((x) => Math.floor(x / 100) === h);
const CASE1 = [6, 8].flatMap((h) => hund(h, over(LIMIT)));
const CASE2 = hund(4, over(LIMIT));
const TOTAL = over(LIMIT).length;
console.assert(ALL.length === 60, '5 × 4 × 3 = 60 numbers with 3 different digits');
console.assert(hund(1, over(LIMIT)).length + hund(3, over(LIMIT)).length === 0, 'hundreds 1 or 3: none > 430');
console.assert(Math.max(...hund(3, ALL)) === 386 && Math.min(...hund(6, ALL)) === 613, '386 < 430 < 613');
console.assert(CASE1.length === 2 * 4 * 3 && CASE1.length === 24, 'hundreds 6 or 8: 2 × 4 × 3 = 24');
console.assert(CASE2.length === 1 * 3 * 3 && CASE2.length === 9, 'hundreds 4: 1 × 3 × 3 = 9');
console.assert(hund(4, ALL).filter((x) => Math.floor(x / 10) % 10 === 1).every((x) => x < LIMIT), '41_ < 430');
console.assert(hund(4, ALL).filter((x) => Math.floor(x / 10) % 10 === 3).every((x) => x > LIMIT), '43_ > 430');
console.assert(TOTAL === 24 + 9 && TOTAL === 33, '24 + 9 = 33');
console.assert(ALL.includes(618) && 618 > LIMIT && ALL.includes(413) && 413 < LIMIT, 'examples: 618 yes, 413 no');
console.assert(431 > LIMIT && ALL.includes(431), '431 > 430');
console.assert(over(CH_LIMIT).length === 18, 'challenge > 640: 18 (not shown)');

// on-board words (an English version overrides these)
export const TEXT = {
  cond: 'Số có 3 chữ số', condB: 'khác nhau', more: 'lớn hơn', labels: ['trăm', 'chục', 'đơn vị'],
  ask: 'Có bao nhiêu số?', next: 'xét tiếp', case1: 'Hàng trăm: 6 hoặc 8', case2: 'Hàng trăm: 4',
  ways: 'cách', unit: 'số', rec1: 'Hàng trăm 6, 8:', rec2: 'Hàng trăm 4:', answer: 'Có 33 số!',
  turn: 'Đến lượt bạn!', cmt: 'Bình luận đáp án nhé!',
};

// --- layout ----------------------------------------------------------------------------------
const T = THEME.layout.title;
const TRAY_Y = 265, C1_Y = 420, C2_Y = 520;
const SLOT_X = [250, 540, 830], LABEL_Y = 635, SLOT_Y = 730, SLOT_S = 1.12;
const LOW = [790, 1600]; // band under the slots, erased between the cases
const TRAY_S = '13468';
const FOUR_FROM = [tileXs(TRAY_S, 540, 1)[TRAY_S.indexOf('4')], TRAY_Y];

// beat order of boards that continue (beats 1–5 keep the top of the board)
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

// five wooden digit tiles dropping in, one per spoken digit
function tray(ctx, y, u, seed) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  dropTiles(objs, L, TRAY_S, tileXs(TRAY_S, 540, 1), y, u, 1, seed, 360);
}
function conditions(L, y1, y2, limit, t1, t2, seed) {
  row(L, [TEXT.cond, { s: TEXT.condB, color: CHALK.yellow }], 540, y1, { size: 70, t: t1, seed, gap: 0.3 });
  row(L, [TEXT.more, { s: String(limit), color: CHALK.yellow, size: 96 }], 540, y2, { size: 74, t: t2, seed: seed + 5, gap: 0.3 });
}

// the three place-value slots; the hundreds slot can hold the 4 tile (case 2)
function slots(ctx, S) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const u = S('beat1', 'slots');
  const four = S('beat4', 'four');
  SLOT_X.forEach((x, i) => {
    const { scale, squash } = pop(stagger(u, i, 3, 0.5));
    tile(objs, x, SLOT_Y, '', 'blank', { scale: scale * SLOT_S, squash });
    L.text(TEXT.labels[i], x, LABEL_Y, { size: 60, align: 'center', t: clamp01(stagger(u, i, 3, 0.5) * 2) });
    const out = i === 0 ? clamp01(four * 2.5) : 0;
    const k = outScale(stagger(S('beat1', 'q'), i, 3, 0.5), out);
    if (k > 0) L.text('?', x, SLOT_Y + 28, { size: 84, color: CHALK.yellow, align: 'center', scale: k });
  });
  // beat 2: the hundreds column is looked at first
  L.loop(SLOT_X[0], LABEL_Y - 18, 80, 44, { color: CHALK.yellow, width: 6, t: S('beat2', 'hl'), seed: 30 });
  // beat 4: a 4 tile is taken from the tray and flies along an arc into the hundreds slot
  if (four > 0) {
    const f = flight(FOUR_FROM, [SLOT_X[0], SLOT_Y], four, 140);
    tile(ctx.objects(), f.x, f.y, '4', 'int', { scale: 1 + (SLOT_S - 1) * f.v, squash: f.squash });
  }
  dust(ctx.chalk(60), SLOT_X[0], SLOT_Y + 58, clamp01((four - 0.8) / 0.2), 40, SLOT_S);
}

// --- beat 1 (lower): examples and the question ---------------------------------------------
function lower1(ctx, k) {
  const L = ctx.chalk(60);
  const ex = [[k('ex1'), '618', true, 300], [k('ex2'), '413', false, 760]];
  ex.forEach(([u, s, ok, x], i) => {
    L.text(s, x - 45, 965, { size: 124, align: 'center', t: clamp01(u * 3) });
    mark(L, ok, x + 120, 925, clamp01(u * 3 - 0.6), { size: 74, seed: 100 + i * 5 });
    const note = ok ? `> ${LIMIT}` : `< ${LIMIT}`;
    L.text(note, x + 10, 1080, { size: 66, align: 'center', color: ok ? CHALK.green : CHALK.red, t: clamp01(u * 2.5 - 1.2) });
  });
  const a = k('ask');
  popLabel(L, TEXT.ask, 540, 1290, a, { size: 104 });
  burst(L, 540, 1255, 260, clamp01(a * 1.4 - 0.3), { seed: 120, n: 10 });
  thinkingDots(L, 540, 1440, k('dots'), { gap: 80, r: 16 });
}

// --- beat 2 (lower): which hundreds digit can work ------------------------------------------
const R2 = { y: [905, 1040, 1175, 1310, 1445], tile: 270, b1: 374, b2: 478, text: 560, mark: 880, s: 1 };
function lower2(ctx, k) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  DIGITS.forEach((d, i) => {
    const u = k(`r${i}`);
    if (u <= 0) return;
    const y = R2.y[i];
    const p1 = pop(clamp01(u * 3));
    tile(objs, R2.tile, y, String(d), 'int', { scale: p1.scale * R2.s, squash: p1.squash });
    [R2.b1, R2.b2].forEach((x, j) => {
      const pb = pop(clamp01(u * 3 - 0.4 - j * 0.25));
      tile(objs, x, y, '', 'blank', { scale: pb.scale * R2.s, squash: pb.squash });
    });
    const t = clamp01(u * 2.5 - 1);
    if (d === 4) {
      L.text(TEXT.next, R2.text, y + 24, { size: 70, color: CHALK.yellow, t });
      popLabel(L, '?', R2.mark, y + 36, clamp01(u * 2 - 1), { size: 110 });
    } else {
      const ok = d > LIMIT / 100;
      L.text(ok ? `> ${LIMIT}` : `< ${LIMIT}`, R2.text, y + 24, { size: 70, color: ok ? CHALK.green : CHALK.red, t });
      mark(L, ok, R2.mark, y, clamp01(u * 2 - 1), { size: 80, seed: 200 + i * 3 });
    }
  });
}

// --- beats 3 and 4 (lower): count the choices under each slot -------------------------------
const MINI = { y: 1000, s: 0.7, step: 72 }, COUNT_Y = 1135;
const minis = (cx, n) => Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * MINI.step);
function miniRow(objs, cx, chars, u, hop = []) {
  const xs = minis(cx, chars.length);
  chars.forEach((ch, i) => {
    const { scale, squash } = pop(stagger(u, i, chars.length, 0.5));
    tile(objs, xs[i], MINI.y + hopY(hop[i] || 0, 26), ch, ch ? 'int' : 'blank', { scale: scale * MINI.s, squash });
  });
  return xs;
}
function counts(L, ns, ks, seed) {
  ns.forEach((n, i) => row(L, [{ s: String(n), color: CHALK.yellow, size: 78 }, TEXT.ways], SLOT_X[i], COUNT_Y,
    { size: 62, t: ks[i], seed: seed + i * 3, gap: 0.25 }));
}
// product row with the result circled; returns nothing
function product(L, factors, result, y, t, a, seed) {
  const parts = [];
  factors.forEach((f, i) => { if (i) parts.push({ sym: 'times' }); parts.push(String(f)); });
  parts.push('=', { s: String(result), color: CHALK.yellow }, TEXT.unit);
  const xs = row(L, parts, 540, y, { size: 112, t, seed, gap: 0.5 });
  const rx = xs[xs.length - 2];
  L.loop(rx, y - 34, measure(String(result), 112) / 2 + 22, 72, { color: CHALK.yellow, width: 7, t: a, seed: seed + 20 });
  burst(L, rx, y - 34, 130, clamp01(a * 1.3 - 0.3), { seed: seed + 30 });
}

function lower3(ctx, k) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  badge(L, 112, 890, 1, TEXT.case1, { active: true, t: k('b'), size: 64 });
  miniRow(objs, SLOT_X[0], ['6', '8'], k('m1'));
  miniRow(objs, SLOT_X[1], ['', '', '', ''], k('m2'));
  miniRow(objs, SLOT_X[2], ['', '', ''], k('m3'));
  counts(L, [2, 4, 3], [k('c1'), k('c2'), k('c3')], 300);
  product(L, [2, 4, 3], CASE1.length, 1360, k('eq'), k('ans'), 320);
}

function lower4(ctx, k) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  badge(L, 112, 890, 2, TEXT.case2, { active: true, t: k('b'), size: 64 });
  miniRow(objs, SLOT_X[0], ['4'], k('four'));
  // the 3, 6 and 8 hop as the voice names them
  const pk = k('pk');
  const hop = [0, ...[0, 1, 2].map((i) => (pk < 1 ? stagger(pk, i, 3, 0.45) : 0))];
  const xs = miniRow(objs, SLOT_X[1], ['1', '3', '6', '8'], k('m2'), hop);
  // ... and a yellow loop gathers them: 3 choices left
  const lx = (xs[1] + xs[3]) / 2;
  L.loop(lx, MINI.y, (xs[3] - xs[1]) / 2 + 38, 50, { color: CHALK.yellow, width: 6, t: clamp01(pk * 1.3), seed: 405 });
  miniRow(objs, SLOT_X[2], ['', '', ''], k('m3'));
  // tens 1 is struck out: 41_ is smaller than 430
  const x1 = k('x1');
  const r = 44;
  L.line([xs[0] + r, MINI.y - r], [xs[0] - r, MINI.y + r], { color: CHALK.red, width: 9, t: x1, seed: 400 });
  const note = k('note');
  const nx = row(L, [{ s: '4 1 _', color: CHALK.red }, { s: `< ${LIMIT}`, color: CHALK.red }], 500, 1265, { size: 72, t: note, seed: 410, gap: 0.35 });
  mark(L, false, nx[1] + 180, 1240, clamp01(note * 1.5 - 0.5), { size: 62, seed: 415 });
  // 43_ still works (431 > 430): shown while the voice names 3, 6, 8
  const ok = clamp01(pk * 1.6);
  const ox = row(L, [{ s: '4 3 1', color: CHALK.green }, { s: `> ${LIMIT}`, color: CHALK.green }], 500, 1355, { size: 72, t: ok, seed: 418, gap: 0.35 });
  mark(L, true, ox[1] + 180, 1330, clamp01(ok * 1.5 - 0.5), { size: 62, seed: 419 });
  counts(L, [1, 3, 3], [k('four'), k('c2'), k('c3')], 420);
  product(L, [1, 3, 3], CASE2.length, 1505, k('eq'), k('ans'), 440);
}

// --- beat 5 (after wiping the slots too): add the two cases --------------------------------
function lower5(ctx, k) {
  const L = ctx.chalk(60);
  row(L, [TEXT.rec1, { s: `${CASE1.length} ${TEXT.unit}`, color: CHALK.yellow }], 540, 750, { size: 78, t: k('s1'), seed: 500, gap: 0.3 });
  row(L, [TEXT.rec2, { s: `${CASE2.length} ${TEXT.unit}`, color: CHALK.yellow }], 540, 880, { size: 78, t: k('s2'), seed: 505, gap: 0.3 });
  row(L, [String(CASE1.length), '+', String(CASE2.length), '=', { s: String(TOTAL), color: CHALK.yellow }], 540, 1110,
    { size: 140, t: k('sum'), seed: 510, gap: 0.3 });
  const a = k('ans');
  popLabel(L, TEXT.answer, 540, 1380, a, { size: 130 });
  const w = measure(TEXT.answer, 130);
  L.loop(540, 1338, w / 2 + 50, 104, { color: CHALK.yellow, width: 8, t: clamp01(a * 1.6 - 0.4), seed: 520 });
  burst(L, 540, 1338, 310, clamp01(a * 1.3 - 0.3), { seed: 530, n: 12 });
}

// --- beats 1–5: one board, the lower band wiped between steps -------------------------------
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => g(p, key);
  const full = () => 1;
  tray(ctx, TRAY_Y, S('beat1', 'tray'), 10);
  conditions(ctx.chalk(60), C1_Y, C2_Y, LIMIT, S('beat1', 'c1'), S('beat1', 'c2'), 20);
  if (beat === 'beat5') {
    bandWipe(ctx, k('wipe'), [570, LOW[1]], (c) => { slots(c, S); lower4(c, full); }, 4);
    lower5(ctx, k);
    return;
  }
  slots(ctx, S);
  const lowers = { beat1: lower1, beat2: lower2, beat3: lower3, beat4: lower4 };
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
  tray(ctx, 420, g(p, 'tray'), 60);
  const L = ctx.chalk(60);
  conditions(L, 590, 700, CH_LIMIT, g(p, 'c1'), g(p, 'c2'), 600);
  popLabel(L, TEXT.ask, 540, 910, g(p, 'ask'), { size: 104 });
  countdown(L, 540, 1190, g(p, 'count'), { size: 280 });
  row(L, [TEXT.cmt], 540, 1500, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
