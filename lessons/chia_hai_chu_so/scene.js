// Chia cho số có hai chữ số (Toán 4): 68917 : 85. Facts: lessons/chia_hai_chu_so/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { clamp01, lerp, easeInOut, easeOutCubic, stagger, spring, pop } from '../../shared/web/js/ease.js';
import { tile, TILE_H } from '../../shared/web/js/tiles.js';
import { row, flight } from '../../shared/web/js/parts.js';
import { g, tileXs, dropTiles, sparks, mark, hopY, outScale, bandWipe } from './fx.js';

// --- facts (story.md F1–F6, D1–D5), checked ------------------------------------------
const DIVIDEND = '68917'; // F1
const DIVISOR = '85';
const D = Number(DIVISOR);
// each turn: [partial dividend, quotient digit, product, remainder]; column of the last digit
const TURNS = [
  { part: '689', q: '8', prod: '680', rem: '9', col: 2 }, // D1: 68 < 85, take 689
  { part: '91', q: '1', prod: '85', rem: '6', col: 3 }, // D2
  { part: '67', q: '0', prod: null, rem: '67', col: 4 }, // D3: 67 < 85 -> 0
];
const QUOT = '810';
const REM = '67';
console.assert(Number('68') < D && Number('689') >= D, '68 < 85, take 689');
console.assert(Math.floor(68 / 8) === 8, 'cover the last digits: 68 : 8 -> 8');
for (const t of TURNS) {
  const n = Number(t.part), q = Number(t.q);
  console.assert(Math.floor(n / D) === q, `${t.part} : 85 = ${t.q}`);
  if (t.prod) console.assert(q * D === Number(t.prod) && n - q * D === Number(t.rem), `${t.part} - ${t.prod}`);
  else console.assert(n < D && t.rem === t.part, `${t.part} < 85`);
}
console.assert(Number(TURNS[0].rem + DIVIDEND[3]) === Number(TURNS[1].part), 'bring 1 -> 91');
console.assert(Number(TURNS[1].rem + DIVIDEND[4]) === Number(TURNS[2].part), 'bring 7 -> 67');
console.assert(D * Number(QUOT) + Number(REM) === Number(DIVIDEND) && Number(REM) < D, '68917 = 85 x 810 + 67');
const QUIZ = ['2996', '28', '107']; // F6 / D5
console.assert(Number(QUIZ[1]) * Number(QUIZ[2]) === Number(QUIZ[0]), '2996 : 28 = 107');

// --- layout of the written division (đặt tính) ---------------------------------------
const TS = 1.25; // tile scale of the written division
const COL = [140, 270, 400, 530, 660]; // dividend columns; working digits use the same columns
const DIVX = [835, 965]; // divisor tiles
const ROWY = 440; // tile row
const VX = 752; // vertical bar
const HY = 522; // bar under the divisor
const QX = [830, 912, 994]; // quotient digits
const QY = 650;
const R = [0, 660, 830, 980, 1150]; // baselines of the working rows 1..4
const WS = 120; // working digit size
const SCRATCH = { y: 1390, band: [1250, 1470] }; // side notes
const STRIP = { y: 1565, words: ['chia', 'nhân', 'trừ', 'hạ'], size: 100 };
const TILE_BOTTOM = ROWY + (TILE_H * TS) / 2;

// hook placement (beat 1) and where the tiles fly to (beat 2)
const HOOK = { y1: 600, y2: 840, s: 1.5, colonX: 360, qY: 1230 };
const HOOK_DIV = tileXs(DIVIDEND, 540, HOOK.s);
const HOOK_DSR = [540, 696];

// write digits at the given centres, left to right
function digits(L, s, xs, y, t, { size = WS, color = CHALK.white } = {}) {
  [...s].forEach((ch, i) => {
    const ti = easeOutCubic(clamp01(t * s.length - i));
    if (ti > 0) L.text(ch, xs[i], y, { size, color, t: ti, align: 'center' });
  });
}

// drawn minus sign left of a working row
function minus(L, col, y, t, seed) {
  const x = COL[col] - 80;
  L.line([x - 26, y - 42], [x + 26, y - 42], { width: 7, t, seed });
}

// rule under a product, spanning columns c0..c1
function rule(L, c0, c1, y, t, seed) {
  L.line([COL[c0] - 52, y], [COL[c1] + 52, y], { width: 5, t, seed });
}

// "hạ": dashed yellow line from the tile down to its new place, with a head
function bringArrow(L, col, y, b) {
  const t = clamp01(b * 1.6 - 0.3);
  const y1 = y - 112;
  L.dashed([COL[col], TILE_BOTTOM + 18], [COL[col], y1], { color: CHALK.yellow, width: 7, on: 16, off: 12, t });
  const h = clamp01(t * 4 - 3);
  for (const sx of [-1, 1]) L.line([COL[col], y1 + 4], [COL[col] + sx * 18, y1 - 20], { color: CHALK.yellow, width: 7, t: h, seed: 770 + col + sx });
}

// a quotient digit pops into its place (spring scale, yellow)
function quotDigit(L, i, u, bump = 0) {
  if (u <= 0) return;
  const k = spring(u, 3.2, 6) * (1 + 0.3 * Math.sin(Math.PI * clamp01(bump)));
  L.text(QUOT[i], QX[i], QY, { size: 124, color: CHALK.yellow, align: 'center', scale: k });
}

// the four-step strip; `active` is lit yellow and underlined, `on` its progress
function strip(L, t, active = -1, on = 1) {
  const parts = [];
  STRIP.words.forEach((w, i) => {
    if (i) parts.push('·');
    parts.push({ s: w, color: i === active ? CHALK.yellow : CHALK.white });
  });
  const xs = row(L, parts, 540, STRIP.y, { size: STRIP.size, t, seed: 880, gap: 0.4 });
  if (active >= 0) {
    const w = measure(STRIP.words[active], STRIP.size);
    L.loop(xs[active * 2], STRIP.y - 30, w / 2 + 26, 62, { color: CHALK.yellow, width: 6, t: on, seed: 900 + active });
  }
}

// which step is lit: the last listed key that has started
function activeStep(p, pairs) {
  let a = -1, on = 1;
  for (const [k, i] of pairs) if (k in p ? p[k] > 0 : true) { a = i; on = g(p, k); }
  return [a, on];
}

// --- side notes in the scratch band (each wiped by the next beat's eraser) -----------
function noteLess(L, a, b, t, seed) {
  row(L, [a, { s: '<', color: CHALK.red }, b], 540, SCRATCH.y, { size: 104, t, seed, gap: 0.4 });
}
// "689 : 85 → 8" with little wooden covers over the 9 and the 5 (so it reads 68 : 8)
function noteCover(c, t) {
  const L = c.chalk(60);
  const xs = row(L, ['6', '8', '9', ' : ', '8', '5'], 370, SCRATCH.y, { size: 110, t: clamp01(t * 2), seed: 810, gap: 0.2 });
  const objs = c.objects();
  [2, 5].forEach((k, i) => {
    const { scale, squash } = pop(stagger(clamp01(t * 2.5 - 1.1), i, 2, 0.7));
    tile(objs, xs[k], SCRATCH.y - 36, '', 'int', { scale: scale * 0.72, squash, rot: -5 });
  });
  const L2 = c.chalk(60);
  const ax = xs[5] + 60;
  L2.arrow([ax, SCRATCH.y - 34], [ax + 130, SCRATCH.y - 34], { t: clamp01(t * 3 - 2), seed: 815 });
  L2.text('8', ax + 200, SCRATCH.y, { size: 124, color: CHALK.yellow, align: 'center', t: clamp01(t * 4 - 3) });
}
// "8 × 85 = 680"
function noteMul(L, a, b, c, t, seed) {
  row(L, [a, { sym: 'times' }, b, '=', { s: c, color: CHALK.yellow }], 540, SCRATCH.y, { size: 110, t, seed, gap: 0.32 });
}
// "91 : 85 → 1" / "67 < 85 → 0"
function noteArrow(L, parts, ans, t, seed) {
  const xs = row(L, parts, 470, SCRATCH.y, { size: 110, t: clamp01(t * 1.5), seed, gap: 0.36 });
  const ax = xs[xs.length - 1] + 70;
  L.arrow([ax, SCRATCH.y - 34], [ax + 120, SCRATCH.y - 34], { t: clamp01(t * 3 - 1.6), seed: seed + 5 });
  L.text(ans, ax + 185, SCRATCH.y, { size: 124, color: CHALK.yellow, align: 'center', t: clamp01(t * 3 - 2) });
}
function noteCheck(L, t, ok) {
  row(L, ['9', { s: '<', color: CHALK.green }, '85'], 480, SCRATCH.y, { size: 104, t, seed: 830, gap: 0.4 });
  mark(L, true, 760, SCRATCH.y - 34, ok, { size: 90, seed: 840 });
}
function noteResult(L, t) {
  return row(L, [DIVIDEND, ':', DIVISOR, '=', { s: QUOT, color: CHALK.yellow }, `(dư ${REM})`], 540, SCRATCH.y,
    { size: 92, t, seed: 860, gap: 0.28 });
}

// --- the whole written division as a function of the beat ---------------------------
// st: progress of every element; elements of earlier beats are 1, later beats 0.
const ORDER = ['beat2', 'beat3', 'beat4', 'beat5', 'beat6', 'beat7'];
function state(beat, p) {
  const idx = ORDER.indexOf(beat);
  return (b, k) => {
    const i = ORDER.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}

function divisionBoard(ctx, beat, p) {
  const S = state(beat, p);
  const objs = ctx.objects();
  const L = ctx.chalk(60);

  // title + bars of the written division
  L.text('Chia cho số có hai chữ số', 540, 250, { size: 80, align: 'center', t: S('beat2', 'title') });
  const lt = S('beat2', 'lines');
  L.line([VX, ROWY - 70], [VX, QY + 40], { width: 6, t: clamp01(lt * 2), seed: 700 });
  L.line([VX, HY], [VX + 280, HY], { width: 6, t: clamp01(lt * 2 - 1), seed: 701 });

  // tiles: fly from the hook into place (beat 2); hops when a digit is brought down
  const park = S('beat2', 'park');
  const hops = { 3: S('beat5', 'bring'), 4: S('beat6', 'bring') };
  const take = S('beat3', 'u689'); // 6, 8, 9 hop in turn: the first group taken
  [...DIVIDEND].forEach((ch, i) => {
    const u = stagger(clamp01(park / 0.75), i, 5, 0.8); // the dividend moves first, as one row
    const f = flight([HOOK_DIV[i], HOOK.y1], [COL[i], ROWY], u, 60);
    let dy = hops[i] !== undefined && hops[i] < 1 ? hopY(hops[i]) : 0;
    if (i < 3 && take < 1) dy += hopY(stagger(take, i, 3, 0.6), 30);
    tile(objs, f.x, f.y + dy, ch, 'int', { scale: lerp(HOOK.s, TS, easeInOut(f.v)), squash: f.squash });
  });
  // "8 nhân 85": the divisor hops while the quotient digit pulses
  const mul = [S('beat4', 'arrow'), S('beat5', 'nhan')];
  const mh = mul.find((m) => m > 0 && m < 1) || 0;
  [...DIVISOR].forEach((ch, i) => {
    const u = stagger(clamp01((park - 0.45) / 0.55), i, 2, 0.8); // then 85 follows, right of it
    const f = flight([HOOK_DSR[i], HOOK.y2], [DIVX[i], ROWY], u, 60);
    tile(objs, f.x, f.y + hopY(stagger(mh, i, 2, 0.8)), ch, 'int', { scale: lerp(HOOK.s, TS, easeInOut(f.v)), squash: f.squash });
  });

  // covers: plain wooden pieces slide over the last digit of 689 and of 85 (beat 3),
  // and fly away again (beat 4)
  const cover = S('beat3', 'cover');
  const uncover = S('beat4', 'uncover');
  [[COL[2], 0], [DIVX[1], 1]].forEach(([x, i]) => {
    const u = stagger(cover, i, 2, 0.75);
    if (u <= 0 || uncover >= 1) return;
    let f = flight([1180, 1000], [x, ROWY], u, 260);
    if (uncover > 0) f = flight([x, ROWY], [1200, -150], stagger(uncover, i, 2, 0.75), -120);
    tile(objs, f.x, f.y, '', 'int', { scale: TS * 1.08, squash: f.squash, rot: lerp(-8, -3, easeInOut(f.v)) });
  });

  // turn 1: underline 68 (too small), then 689
  const ly = TILE_BOTTOM + 14;
  const u68 = S('beat3', 'u68');
  const u689 = S('beat3', 'u689');
  if (u689 < 1) L.line([COL[0] - 50, ly], [COL[1] + 50, ly], { color: CHALK.red, width: 7, t: u68, seed: 710 });
  L.line([COL[0] - 50, ly], [COL[2] + 50, ly], { color: CHALK.yellow, width: 11, t: u689, seed: 711 });
  L.loop(COL[1], ROWY - 4, 215, 90, { color: CHALK.yellow, width: 6, t: u689, seed: 712 });

  quotDigit(L, 0, S('beat3', 'q'), mul[0] < 1 ? mul[0] : 0);
  digits(L, TURNS[0].prod, [COL[0], COL[1], COL[2]], R[1], S('beat4', 'prod'));
  minus(L, 0, R[1], S('beat4', 'minus'), 721);
  rule(L, 0, 2, R[1] + 36, S('beat4', 'minus'), 722);
  digits(L, TURNS[0].rem, [COL[2]], R[2], S('beat4', 'diff'));

  // turn 2: bring down 1 -> 91
  const b1 = S('beat5', 'bring');
  bringArrow(L, 3, R[2], b1);
  digits(L, DIVIDEND[3], [COL[3]], R[2], clamp01(b1 * 2.5 - 1.5), { color: CHALK.yellow });
  L.loop((COL[2] + COL[3]) / 2, R[2] - 42, 128, 74, { color: CHALK.yellow, width: 5, t: S('beat5', 'loop'), seed: 730 });
  quotDigit(L, 1, S('beat5', 'q'), mul[1] > 0 && mul[1] < 1 ? mul[1] : 0);
  digits(L, TURNS[1].prod, [COL[2], COL[3]], R[3], S('beat5', 'prod'));
  minus(L, 2, R[3], S('beat5', 'minus'), 731);
  rule(L, 2, 3, R[3] + 36, S('beat5', 'minus'), 732);
  digits(L, TURNS[1].rem, [COL[3]], R[4], S('beat5', 'diff'));

  // turn 3: bring down 7 -> 67, which is less than 85 -> quotient digit 0
  const b2 = S('beat6', 'bring');
  bringArrow(L, 4, R[4], b2);
  digits(L, DIVIDEND[4], [COL[4]], R[4], clamp01(b2 * 2.5 - 1.5), { color: CHALK.yellow });
  const q0 = S('beat6', 'q');
  if (q0 > 0) {
    // the 0 drops in big and settles (squash on landing)
    const k = q0 < 0.4 ? lerp(1.9, 1, easeInOut(q0 / 0.4)) : 1 + 0.18 * Math.exp(-6 * (q0 - 0.4)) * Math.sin(10 * (q0 - 0.4));
    L.text(QUOT[2], QX[2], QY, { size: 124, color: CHALK.yellow, align: 'center', scale: k });
  }
  const z = S('beat6', 'zero');
  L.loop(QX[2] + 4, QY - 42, 44, 72, { color: CHALK.red, width: 7, t: clamp01(z * 1.5), seed: 740 });
  sparks(L, QX[2], QY - 42, 84, 112, clamp01(z * 1.4 - 0.3), { color: CHALK.red, seed: 745, n: 7 });

  // result: remainder circled + labelled, quotient circled
  const rem = S('beat7', 'rem');
  L.loop((COL[3] + COL[4]) / 2, R[4] - 42, 134, 76, { color: CHALK.yellow, width: 5, t: clamp01(rem * 1.6), seed: 750 });
  L.text('dư', COL[4] + 165, R[4], { size: 116, color: CHALK.yellow, align: 'center', t: clamp01(rem * 2 - 1) });
  L.loop(QX[1], QY - 42, 146, 82, { color: CHALK.yellow, width: 6, t: S('beat7', 'loopQ'), seed: 760 });

  // scratch notes: each one is wiped off by the eraser before the next is written
  const notes = [
    { w: S('beat3', 'note1'), e: S('beat3', 'erase'), draw: (c, t) => noteLess(c.chalk(60), '68', '85', t, 800) },
    { w: S('beat3', 'note2'), e: S('beat4', 'erase'), draw: (c, t) => noteCover(c, t) },
    { w: S('beat4', 'mulnote'), e: S('beat4', 'erase2'), draw: (c, t) => noteMul(c.chalk(60), '8', DIVISOR, TURNS[0].prod, t, 820) },
    { w: S('beat4', 'note'), e: S('beat5', 'erase0'), draw: (c, t, s) => noteCheck(c.chalk(60), t, s ? 1 : S('beat4', 'ok')) },
    { w: S('beat5', 'divnote'), e: S('beat5', 'erase'), draw: (c, t) => noteArrow(c.chalk(60), [TURNS[1].part, ':', DIVISOR], '1', t, 845) },
    { w: S('beat5', 'mulnote'), e: S('beat6', 'erase'), draw: (c, t) => noteMul(c.chalk(60), '1', DIVISOR, TURNS[1].prod, t, 850) },
    { w: S('beat6', 'note'), e: S('beat7', 'erase'), draw: (c, t) => noteArrow(c.chalk(60), [TURNS[2].part, { s: '<', color: CHALK.red }, DIVISOR], '0', t, 855) },
    { w: S('beat7', 'res'), e: 0, draw: (c, t) => noteResult(c.chalk(60), t) },
  ];
  for (const n of notes) {
    if (n.e >= 1 || n.w <= 0) continue;
    if (n.e > 0) bandWipe(ctx, n.e, SCRATCH.band, (sub) => n.draw(sub, 1, true), 2);
    else n.draw(ctx, n.w);
  }
  return L;
}

// --- beat 1: hook. "68917 chia 85 bằng bao nhiêu?" -----------------------------------
function hookChalk(L, p) {
  L.text(':', HOOK.colonX, HOOK.y2 + 50, { size: 170, align: 'center', t: g(p, 'drop2') });
  const q = g(p, 'q');
  if (q > 0) {
    L.text('?', 540, HOOK.qY + 120, { size: 380, color: CHALK.yellow, align: 'center', scale: spring(q, 3.2, 6) });
    sparks(L, 540, HOOK.qY, 190, 250, clamp01(q * 1.4 - 0.2), { seed: 90 });
  }
  // "4 bước" promise
  const f = g(p, 'four');
  if (f > 0) {
    const k = spring(f, 3, 6);
    L.text('4 bước', 540, 1570, { size: 110, color: CHALK.yellow, align: 'center', scale: k });
  }
}

function beat1(ctx, p) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  dropTiles(objs, under, DIVIDEND, HOOK_DIV, HOOK.y1, g(p, 'drop'), HOOK.s, 60);
  dropTiles(objs, under, DIVISOR, HOOK_DSR, HOOK.y2, g(p, 'drop2'), HOOK.s, 90, 300);
  hookChalk(ctx.chalk(60), p);
}

// --- beat 2: đặt tính + the four steps ------------------------------------------------
function beat2(ctx, p) {
  bandWipe(ctx, g(p, 'erase'), [800, 1680], (sub) => hookChalk(sub.chalk(60), {}), 4);
  const L = divisionBoard(ctx, 'beat2', p);
  strip(L, g(p, 'strip'));
}

// --- beats 3–7: the three turns -------------------------------------------------------
function beat3(ctx, p) {
  const L = divisionBoard(ctx, 'beat3', p);
  strip(L, 1, ...activeStep(p, [['u68', 0]]));
}
function beat4(ctx, p) {
  const L = divisionBoard(ctx, 'beat4', p);
  strip(L, 1, ...activeStep(p, [['nhan', 1], ['tru', 2]]));
}
function beat5(ctx, p) {
  const L = divisionBoard(ctx, 'beat5', p);
  strip(L, 1, ...activeStep(p, [['ha', 3], ['chia', 0], ['nhan', 1], ['tru', 2]]));
}
function beat6(ctx, p) {
  const L = divisionBoard(ctx, 'beat6', p);
  strip(L, 1, ...activeStep(p, [['ha', 3], ['chia', 0]]));
}
function beat7(ctx, p) {
  const L = divisionBoard(ctx, 'beat7', p);
  strip(L, 1, -1);
}

// --- beats 8–9: challenge 2996 : 28 ---------------------------------------------------
const QZ = { label: 330, y1: 600, y2: 840, colonX: 380, qY: 1180, countY: 1520, s: 1.5 };
const QZ_DIV = tileXs(QUIZ[0], 540, QZ.s);
const QZ_DSR = [540, 696];

function quizBoard(ctx, p) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  dropTiles(objs, under, QUIZ[0], QZ_DIV, QZ.y1, g(p, 'drop'), QZ.s, 600, 190);
  dropTiles(objs, under, QUIZ[1], QZ_DSR, QZ.y2, g(p, 'drop2'), QZ.s, 640, 300);
  const L = ctx.chalk(60);
  L.text('Đến lượt bạn!', 540, QZ.label, { size: 104, color: CHALK.yellow, align: 'center', t: g(p, 'label') });
  L.text(':', QZ.colonX, QZ.y2 + 50, { size: 170, align: 'center', t: g(p, 'drop2') });
  return L;
}

function beat8(ctx, p) {
  const L = quizBoard(ctx, p);
  const q = g(p, 'q');
  if (q > 0) L.text('?', 540, QZ.qY + 100, { size: 300, color: CHALK.yellow, align: 'center', scale: spring(q, 3.2, 6) });
  // countdown 3, 2, 1: each pops in and shrinks away; key pose = nothing left
  // countdown 3, 2, 1 inside a chalk timer that runs down; gone at the key pose
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const cx = 860, cy = QZ.qY - 20, r = 110;
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 970, amp: 0.6 });
    [3, 2, 1].forEach((n, i) => {
      const u = clamp01(c * 3 - i);
      if (u <= 0 || u >= 1) return;
      const k = u < 0.6 ? spring(u / 0.6, 3, 6) : 1.1 * (1 - clamp01((u - 0.6) / 0.4) ** 2);
      L.text(String(n), cx, cy + 56, { size: 160, color: CHALK.white, align: 'center', scale: k });
    });
  }
}

function beat9(ctx, p) {
  const L = quizBoard(ctx, {});
  const a = g(p, 'ans');
  // the "?" winds up and shrinks away, then "= 107" is written in its place
  const k = outScale(1, clamp01(a * 3));
  if (k > 0) L.text('?', 540, QZ.qY + 100, { size: 300, color: CHALK.yellow, align: 'center', scale: k });
  const xs = row(L, ['=', { s: QUIZ[2], color: CHALK.yellow, size: 220 }], 540, QZ.qY + 80,
    { size: 180, t: clamp01(a * 1.5 - 0.4), seed: 950, gap: 0.3 });
  // the 0 in the middle of 107
  const z = g(p, 'zero');
  const zx = xs[1];
  L.loop(zx, QZ.qY + 2, 48, 92, { color: CHALK.red, width: 7, t: clamp01(z * 1.5), seed: 960 });
  sparks(L, zx, QZ.qY + 2, 120, 160, clamp01(z * 1.4 - 0.3), { color: CHALK.red, seed: 965, n: 7 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8, beat9 };
