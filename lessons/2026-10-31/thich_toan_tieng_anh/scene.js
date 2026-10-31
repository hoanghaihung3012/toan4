// Thích cả Toán và Tiếng Anh: 42 học sinh, 25 Toán, 22 Tiếng Anh, 6 không thích môn nào.
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, stagger, pop, spring, easeOutCubic } from '../../../shared/web/js/ease.js';
import { tile } from '../../../shared/web/js/tiles.js';
import { row, bar, flight, solutionIntro } from '../../../shared/web/js/parts.js';
import {
  g, burst, mark, hopY, hopSquash, thinkingDots, countdown, popLabel, bandWipe, outScale,
} from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F4, D1–D5) --------------------------------------------------------------
const CLASS = 42, MATH = 25, ENG = 22, NONE = 6;
const ANY = CLASS - NONE;
const SUM = MATH + ENG;
const BOTH = SUM - ANY;
const ONLY_MATH = MATH - BOTH;
console.assert(ANY === 36, '42 − 6 = 36');
console.assert(SUM === 47, '25 + 22 = 47');
console.assert(BOTH === 11, '47 − 36 = 11');
console.assert(MATH + ENG - BOTH + NONE === CLASS, 'check: 25 + 22 − 11 + 6 = 42');
console.assert(ONLY_MATH === 14, 'challenge: only maths 25 − 11 = 14 (not shown)');
// brute force: the only overlap that fits the class
const fits = [];
for (let x = 0; x <= Math.min(MATH, ENG); x++) if (MATH + ENG - x + NONE === CLASS) fits.push(x);
console.assert(fits.length === 1 && fits[0] === BOTH, 'unique overlap 11');

// the problem as given (Sheet), one entry per voice line, split only at its commas
const QUESTION = [
  'Một lớp học có 42 học sinh,',
  'trong đó có 25 học sinh thích môn Toán,',
  '22 học sinh thích môn Tiếng Anh',
  'và 6 học sinh không thích cả hai môn này.',
  'Hỏi có bao nhiêu học sinh thích cả hai môn Toán và Tiếng Anh?',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải', unit: 'học sinh',
  cls: 'Cả lớp:', none: 'không thích môn nào', atLeast: 'thích ít nhất 1 môn',
  math: 'Toán', eng: 'Tiếng Anh', twice: 'đếm 2 lần', both: 'học sinh thích cả hai môn',
  check: 'Thử lại:', turn: 'Đến lượt bạn!', ask1: 'Có bao nhiêu học sinh', ask2: 'chỉ thích môn', cmt: 'Bình luận đáp án nhé!',
};

// --- colours: one colour per group, the same in the text and on the bars ------------------------
const COL = { cls: CHALK.green, math: CHALK.yellow, eng: CHALK.mint, none: CHALK.pink };
const INK = THEME.tiles.ink;
function wordColor(w) {
  const s = w.replace(/[,.?]/g, '');
  if (s === '42') return COL.cls;
  if (s === '25' || s === 'Toán') return COL.math;
  if (s === '22' || s === 'Tiếng' || s === 'Anh') return COL.eng;
  if (s === '6') return COL.none;
  return CHALK.white;
}

// --- layout: bars to scale, 1 học sinh = 900 / 42 px ---------------------------------------------
const T = THEME.layout.title;
const X0 = 90, PX = 900 / CLASS;
const xAt = (n) => X0 + n * PX;
const X36 = xAt(ANY), X42 = xAt(CLASS);
const MATH_R = xAt(MATH), ENG_L = X36 - ENG * PX; // overlap = [ENG_L, MATH_R]
console.assert(Math.abs((MATH_R - ENG_L) / PX - BOTH) < 1e-9, 'overlap is 11 wide');
const CLS_Y = 330, BAR_H = 76, SIX_DX = 18;
const EQ0_Y = 575, ATL_Y = 668;
const MATH_Y = 875, ENG_Y = 970, MID_H = 70, Q_Y = 800;
const EQ1_Y = 1170, EQ2_Y = 1280, ANS_Y = 1445;
const LOW = [1100, 1330];

function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
const ORDER = ['beat3', 'beat4', 'beat5'];

// a horizontal wooden bar from x0 to x1 that grows from `from` ('l' | 'r') with a spring
function hbar(objs, L, x0, x1, cy, h, kind, u, label, from = 'l', lx = (x0 + x1) / 2, hop = 0) {
  if (u <= 0) return;
  const k = spring(clamp01(u), 3.2, 6);
  const w = (x1 - x0) * k;
  if (w < 24) return;
  const cx = from === 'l' ? x0 + w / 2 : x1 - w / 2;
  const squash = (1 + 0.12 * Math.sin(Math.PI * clamp01(u * 1.4))) * hopSquash(hop);
  const dy = hopY(hop, 34);
  bar(objs, cx, cy + h + dy, h, kind, w, squash);
  if (label) L.text(label, lx, cy + h / 2 + 19 + dy, { size: 54, color: INK, align: 'center', t: clamp01((u - 0.45) / 0.4) });
}

// --- beat 1: the problem, written word by word as it is read -----------------------------------
const Q = { x: 90, y: 330, w: 930, size: 76, lh: 114, gapK: 0.27 };
function layoutQuestion() {
  const space = Q.size * Q.gapK;
  const out = [];
  let x = Q.x, line = 0;
  TEXT.question.forEach((seg, si) => {
    const words = seg.split(' ');
    words.forEach((w, wi) => {
      const ww = measure(w, Q.size);
      if (x > Q.x && x + ww > Q.x + Q.w) { x = Q.x; line++; }
      out.push({ w, x, y: Q.y + line * Q.lh, si, wi, n: words.length, ww });
      x += ww + space;
    });
  });
  return out;
}
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  const words = layoutQuestion();
  for (const q of words) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: wordColor(q.w), t: easeOutCubic(t) });
  }
  const lastY = words[words.length - 1].y;
  // the unknown: a dashed slot with "?" and "học sinh"
  const a = g(p, 'ask');
  const { scale, squash } = pop(a);
  const sy = lastY + 210;
  if (a > 0) {
    const objs = ctx.objects();
    tile(objs, 400, sy, '', 'blank', { scale: scale * 1.2, squash });
    const L2 = ctx.chalk(60);
    L2.text('?', 400, sy + 30, { size: 96, color: CHALK.yellow, align: 'center', scale });
    L2.text(TEXT.unit, 480, sy + 22, { size: 64, t: clamp01((a - 0.3) / 0.5) });
    thinkingDots(L2, 540, sy + 220, g(p, 'dots'), { r: 15 });
  }
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beats 3–5: one board ------------------------------------------------------------------------
// the class bar, the 6 who like neither, 42 − 6 = 36 (beat 3); hop6 makes the 6-piece hop (beat 5)
function upper(ctx, S, hop6, hop36 = 0) {
  const L0 = ctx.chalk(60);
  const tt = S('beat3', 'title');
  const xs = row(L0, [TEXT.cls, { s: String(CLASS), color: COL.cls }, TEXT.unit], T.x, T.y, { size: T.size, t: tt, align: 'left', gap: 0.3 });
  const tw = measure(TEXT.unit, T.size) / 2 + xs[2] - T.x;
  L0.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });

  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const c = S('beat3', 'cls');
  hbar(objs, L, X0, X36, CLS_Y - BAR_H / 2, BAR_H, 'int', c, '', 'l', X0, hop36);
  // the 6-piece: a dashed slot that steps off to the right (anticipation, arc, landing squash)
  const six = S('beat3', 'six');
  const home = [(X36 + X42) / 2, CLS_Y + BAR_H / 2];
  const f = flight(home, [home[0] + SIX_DX, home[1]], six, 46);
  const pc = spring(clamp01(c * 1.3 - 0.3), 3, 6);
  if (pc > 0) {
    const hy = hopY(hop6, 40);
    bar(objs, f.x, f.y + hy, BAR_H, 'blank', (X42 - X36) * Math.min(1, pc), f.squash * hopSquash(hop6));
    L.text(String(NONE), f.x, f.y + hy - BAR_H * 0.22, { size: 60, color: COL.none, align: 'center', t: clamp01((six - 0.4) / 0.4) });
  }
  L.text(TEXT.none, X42 + SIX_DX, CLS_Y + 150, { size: 52, color: COL.none, align: 'right', t: S('beat3', 'sixL') });
  row(L, [String(CLASS), { sym: 'minus' }, { s: String(NONE), color: COL.none }, '=', { s: String(ANY), color: CHALK.yellow }],
    540, EQ0_Y, { size: 80, t: S('beat3', 'eq'), seed: 30, gap: 0.3 });
  // brace under the 36
  const b = S('beat3', 'brace');
  const by = CLS_Y + BAR_H / 2 + 14;
  L.poly([[X0, by], [X0, by + 16], [X36, by + 16], [X36, by]], { width: 5, t: easeOutCubic(b), seed: 40, amp: 1 });
  L.line([(X0 + X36) / 2, by + 16], [(X0 + X36) / 2, by + 40], { width: 5, t: clamp01(b * 2 - 1), seed: 41 });
  row(L, [{ s: String(ANY), color: CHALK.yellow }, TEXT.unit, TEXT.atLeast], 540, ATL_Y, { size: 58, t: S('beat3', 'atl'), seed: 50, gap: 0.28 });
}
// the two subject bars and the overlap (beat 4); pulse11 makes the overlap "11" pulse (beat 5)
function middle(ctx, S, pulse11, hopT = 0, hopA = 0) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const tm = S('beat4', 'toan'), te = S('beat4', 'anh');
  // the two subject bars live inside the 36: dashed guides down from its ends
  for (const x of [X0, X36]) L.dashed([x, Q_Y - 30], [x, ENG_Y + MID_H / 2 + 14], { color: CHALK.white, width: 4, t: easeOutCubic(clamp01(tm * 1.5)) });
  L.text(TEXT.math, X0, MATH_Y - MID_H / 2 - 18, { size: 60, color: COL.math, t: clamp01(tm * 2) });
  hbar(objs, L, X0, MATH_R, MATH_Y - MID_H / 2, MID_H, 'int', tm, String(MATH), 'l', (X0 + ENG_L) / 2, hopT);
  hbar(objs, L, ENG_L, X36, ENG_Y - MID_H / 2, MID_H, 'dec', te, String(ENG), 'r', (MATH_R + X36) / 2, hopA);
  L.text(TEXT.eng, X36, ENG_Y + MID_H / 2 + 78, { size: 60, color: COL.eng, align: 'right', t: clamp01(te * 2 - 0.4) });
  // the overlap: dashed edges, a yellow box, "?" that gives way to 11
  const o = S('beat4', 'ovl');
  const top = MATH_Y - MID_H / 2 - 10, bot = ENG_Y + MID_H / 2 + 10;
  const L2 = ctx.chalk(60);
  L2.dashed([ENG_L, top - 20], [ENG_L, bot + 10], { color: CHALK.yellow, width: 6, t: easeOutCubic(o) });
  L2.dashed([MATH_R, top - 20], [MATH_R, bot + 10], { color: CHALK.yellow, width: 6, t: easeOutCubic(o) });
  L2.rect(ENG_L - 8, top, MATH_R + 8, bot, { color: CHALK.yellow, width: 10, t: clamp01(o * 1.4 - 0.3), seed: 60 });
  const qx = (ENG_L + MATH_R) / 2;
  const q11 = S('beat4', 'q11');
  const kq = outScale(spring(clamp01(o * 1.5 - 0.4), 3, 6), q11);
  if (kq > 0) L2.text('?', qx, Q_Y, { size: 78, color: CHALK.yellow, align: 'center', scale: kq });
  popLabel(L2, String(BOTH), qx, Q_Y, clamp01((q11 - 0.35) / 0.65), { size: 82, pulse: pulse11 });
  // counted twice
  const tw = S('beat4', 'twice');
  popLabel(L2, TEXT.twice, MATH_R + 190, MATH_Y + 16, tw, { size: 52, color: CHALK.red });
}
// beat 4 lower band: the two equations (beat 5 wipes them)
function equations(ctx, S) {
  const L = ctx.chalk(60);
  row(L, [{ s: String(MATH), color: COL.math }, '+', { s: String(ENG), color: COL.eng }, '=', String(SUM)],
    470, EQ1_Y, { size: 80, t: S('beat4', 'e1'), seed: 70, gap: 0.3 });
  popLabel(L, `> ${ANY}`, 820, EQ1_Y, S('beat4', 'more'), { size: 80, color: CHALK.red });
  row(L, [String(SUM), { sym: 'minus' }, String(ANY), '=', { s: String(BOTH), color: CHALK.yellow }],
    470, EQ2_Y, { size: 80, t: S('beat4', 'e2'), seed: 80, gap: 0.3 });
}
function answer(ctx, S) {
  const L = ctx.chalk(60);
  const a = S('beat4', 'ans');
  const xs = row(L, [{ s: String(BOTH), color: CHALK.yellow, size: 96 }, TEXT.both], 540, ANS_Y, { size: 58, t: a, seed: 90, gap: 0.9 });
  const lp = S('beat4', 'loop');
  L.loop(xs[0], ANS_Y - 30, 66, 62, { color: CHALK.yellow, width: 8, t: easeOutCubic(lp), seed: 95 });
  burst(L, xs[0], ANS_Y - 30, 120, clamp01(lp * 1.3 - 0.3), { seed: 96 });
}
// beat 5: 25 + 22 − 11 + 6 = 42, each group written as it is said
function check(ctx, k) {
  const L = ctx.chalk(60);
  L.text(TEXT.check, X0, EQ1_Y - 10, { size: 64, color: CHALK.white, t: k('head') });
  const size = 78, gap = size * 0.28;
  const parts = [
    [{ s: String(MATH), color: COL.math }, '+', { s: String(ENG), color: COL.eng }],
    [{ sym: 'minus' }, { s: String(BOTH), color: CHALK.yellow }],
    ['+', { s: String(NONE), color: COL.none }],
    ['=', { s: String(CLASS), color: COL.cls }],
  ];
  const width = (ps) => ps.reduce((s, q) => s + (q.sym ? size * 0.42 : measure(typeof q === 'string' ? q : q.s, size)), 0) + gap * (ps.length - 1);
  const ws = parts.map(width);
  const total = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
  let x = 500 - total / 2;
  ['c1', 'c2', 'c3', 'c4'].forEach((key, i) => {
    row(L, parts[i], x, EQ2_Y, { size, t: k(key), seed: 200 + i * 10, align: 'left', gap: 0.28 });
    x += ws[i] + gap;
  });
  mark(L, true, x + 70, EQ2_Y - 26, k('ok'), { size: 80, seed: 240 });
}
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => g(p, key);
  const in5 = beat === 'beat5';
  // hops tie each number in the equations to its bar (no dead holds while the voice talks)
  const hp = (key) => (key in p && p[key] < 1 ? p[key] : 0);
  const in4 = beat === 'beat4';
  upper(ctx, S, in5 ? k('p6') : 0, in4 ? Math.max(hp('h36'), hp('h36b')) : in5 ? hp('h42') : 0);
  middle(ctx, S, in5 ? k('p11') : 0, in4 || in5 ? hp('hT') : 0, in4 || in5 ? hp('hA') : 0);
  if (beat === 'beat5') {
    bandWipe(ctx, k('wipe'), LOW, (c) => equations(c, () => 1), 3);
    check(ctx, k);
  } else {
    equations(ctx, S);
  }
  answer(ctx, S);
}
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);
const beat5 = (ctx, p) => board(ctx, 'beat5', p);

// --- beat 6: the practice problem ----------------------------------------------------------------
function beat6(ctx, p) {
  const L0 = ctx.chalk(60);
  const tt = g(p, 'title');
  const w = L0.text(TEXT.turn, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L0.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5, color: CHALK.yellow });
  const L = ctx.chalk(60);
  const o = g(p, 'only');
  row(L, [TEXT.ask1], 540, 400, { size: 70, t: clamp01(o * 2), seed: 600 });
  row(L, [TEXT.ask2, { s: `${TEXT.math}?`, color: COL.math }], 540, 495, { size: 70, t: clamp01(o * 2 - 1), seed: 610, gap: 0.3 });
  const objs = ctx.objects();
  const L2 = ctx.chalk(60);
  const by = 720;
  const u = g(p, 'bar');
  L2.text(TEXT.math, X0, by - MID_H / 2 - 18, { size: 54, color: COL.math, t: clamp01(u * 2) });
  hbar(objs, L2, X0, MATH_R, by - MID_H / 2, MID_H, 'int', u, String(MATH), 'l', (X0 + ENG_L) / 2 + 300);
  // the both-part is known (11); the maths-only part is the question
  const bx = g(p, 'box');
  L2.dashed([ENG_L, by - 70], [ENG_L, by + 60], { color: CHALK.yellow, width: 4, t: easeOutCubic(bx) });
  popLabel(L2, `${BOTH} ${TEXT.both.replace(TEXT.unit + ' ', '')}`, (ENG_L + MATH_R) / 2 + 40, by + 110, bx, { size: 56, color: CHALK.white });
  L2.rect(X0 - 8, by - MID_H / 2 - 8, ENG_L - 6, by + MID_H / 2 + 8, { color: CHALK.yellow, width: 7, t: clamp01(bx * 1.4 - 0.3), seed: 620 });
  popLabel(L2, '?', (X0 + ENG_L) / 2, by + 125, clamp01(bx * 1.3 - 0.3), { size: 90 });
  countdown(L, 540, 1080, g(p, 'count'), { size: 280 });
  row(L, [TEXT.cmt], 540, 1470, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
