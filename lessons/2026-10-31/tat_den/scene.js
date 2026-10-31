// Chắc chắn có một đôi tất đen: 6 trắng, 9 đen, 7 xám; trường hợp xui nhất.
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, stagger, spring, easeOutCubic, rng } from '../../../shared/web/js/ease.js';
import { row, flight, solutionIntro } from '../../../shared/web/js/parts.js';
import { svgLayer, shade } from '../../../shared/web/js/cubes.js';
import {
  g, dropPose, burst, mark, hopY, hopSquash, thinkingDots, countdown, popLabel, bandWipe,
} from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F2, D1–D6) ---------------------------------------------------------------
const STOCK = { white: 6, black: 9, grey: 7 };
const NEED_BLACK = 2;
// brute force: the biggest draw that still misses the goal, plus 1, is the sure number
function sureCount(goal) {
  let worst = 0;
  for (let w = 0; w <= STOCK.white; w++) for (let b = 0; b <= STOCK.black; b++) for (let gr = 0; gr <= STOCK.grey; gr++) {
    if (!goal(w, b, gr)) worst = Math.max(worst, w + b + gr);
  }
  return worst + 1;
}
const WORST = { white: STOCK.white, grey: STOCK.grey, black: NEED_BLACK - 1 };
const WORST_SUM = WORST.white + WORST.grey + WORST.black;
const ANSWER = WORST_SUM + 1;
console.assert(WORST_SUM === 14, '6 + 7 + 1 = 14');
console.assert(ANSWER === 15 && sureCount((w, b) => b >= NEED_BLACK) === 15, 'answer 15 (brute force)');
console.assert(sureCount((w, b, gr) => w >= 2 || b >= 2 || gr >= 2) === 4, 'challenge: a pair of one colour needs 4 (not shown)');

// the problem as given (Sheet), one entry per voice line
const QUESTION = [
  'Một chiếc túi có 6 chiếc tất trắng,',
  '9 chiếc tất đen và 7 chiếc tất xám.',
  'Nếu không nhìn vào túi, hỏi phải lấy ra ít nhất bao nhiêu chiếc tất để chắc chắn có được một đôi (2 chiếc) tất màu đen?',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải', worst: 'Trường hợp xui nhất',
  white: 'Trắng', grey: 'Xám', black: 'Đen', out: 'hết', need: 'cần 2',
  notYet: 'mới có 1 chiếc đen', answer: 'Phải lấy ít nhất', unit: 'chiếc',
  turn: 'Đến lượt bạn!', ask1: 'Lấy ít nhất bao nhiêu chiếc', ask2: 'để chắc chắn có', ask3: 'một đôi tất cùng màu?',
  cmt: 'Bình luận đáp án nhé!',
};

// real-coloured socks; chalk ink per colour (black socks use pink chalk so they read on the board)
const SOCK = { white: 'rgb(240, 238, 228)', grey: 'rgb(150, 153, 160)', black: 'rgb(36, 36, 42)' };
const INK = { white: CHALK.white, grey: 'rgb(190, 194, 200)', black: CHALK.pink };
function wordColor(w, i, words) {
  const s = w.replace(/[,.?()]/g, '');
  const next = (words[i + 1] || '').replace(/[,.?()]/g, '');
  const prev = (words[i - 1] || '').replace(/[,.?()]/g, '');
  if (s === '6') return INK.white;
  if (s === '9' || (s === 'đen' && next === 'và')) return INK.black;
  if (s === '7' || s === 'xám') return INK.grey;
  if (s === '2' || s === 'đôi' || (s === 'chiếc' && prev === '2') || (s === 'đen' && prev === 'màu')) return CHALK.yellow;
  return CHALK.white;
}

// one sock (cuff up, toe to the right), centred on (x, y), squashed against its bottom
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}
const SOCK_D = 'M-20,-33 L8,-33 L8,3 Q8,10 17,12 L22,13 Q31,15 31,24 Q31,33 21,33 L-8,33 Q-20,33 -20,21 Z';
function sock(svg, x, y, s, color, { sq = 1, k = 1, dashed = false, stroke } = {}) {
  if (k <= 0) return;
  const sc = s * k;
  const bot = y + 33 * sc;
  const gr = svgEl('g', { transform: `translate(${x} ${bot}) scale(${1 / Math.sqrt(sq)} ${sq}) translate(${-x} ${-bot}) translate(${x} ${y}) scale(${sc})` }, svg);
  if (dashed) {
    svgEl('path', { d: SOCK_D, fill: 'none', stroke: color, 'stroke-width': 4 / sc, 'stroke-dasharray': `${10 / sc} ${8 / sc}` }, gr);
    return;
  }
  const dark = color === SOCK.black;
  svgEl('path', { d: SOCK_D, fill: color, stroke: stroke || (dark ? 'rgb(150, 150, 160)' : shade(color, 0.6)), 'stroke-width': 3 / sc }, gr);
  svgEl('rect', { x: -20, y: -33, width: 28, height: 9, fill: dark ? 'rgb(90, 90, 100)' : shade(color, 0.82) }, gr);
}

// --- beat 1: the problem, written word by word as it is read, and the bag -----------------------
const T = THEME.layout.title;
const Q = { x: 90, y: 300, w: 930, size: 70, lh: 102, gapK: 0.27 };
function layoutQuestion() {
  const space = Q.size * Q.gapK;
  const out = [];
  let x = Q.x, line = 0;
  TEXT.question.forEach((seg, si) => {
    const words = seg.split(' ');
    words.forEach((w, wi) => {
      const ww = measure(w, Q.size);
      if (x > Q.x && x + ww > Q.x + Q.w) { x = Q.x; line++; }
      out.push({ w, color: wordColor(w, wi, words), x, y: Q.y + line * Q.lh, si, wi, n: words.length });
      x += ww + space;
    });
  });
  return out;
}
const BAG = { l: 170, r: 910, top: 1060, bot: 1345 };
const BAG_S = 0.95, BAG_STEP = 74;
const BAG_ROWS = [{ c: 'white', y: 1122 }, { c: 'black', y: 1203 }, { c: 'grey', y: 1284 }];
const PAIR_Y = 1450;
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  for (const q of layoutQuestion()) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: q.color, t: easeOutCubic(t) });
  }
  // the bag: a chalk sack with a drawstring; socks drop in as each colour is read
  const bg = easeOutCubic(g(p, 'bag'));
  L.poly([[BAG.l + 50, BAG.top], [BAG.l, BAG.top + 70], [BAG.l, BAG.bot], [BAG.r, BAG.bot], [BAG.r, BAG.top + 70], [BAG.r - 50, BAG.top]],
    { width: 7, t: bg, seed: 20, amp: 1 });
  L.line([BAG.l + 50, BAG.top], [BAG.r - 50, BAG.top], { width: 5, t: bg, seed: 21, color: CHALK.yellow });
  const svg = svgLayer(ctx.objects());
  for (const r of BAG_ROWS) {
    const n = STOCK[r.c];
    const x0 = 540 - ((n - 1) * BAG_STEP) / 2 - 4;
    for (let i = 0; i < n; i++) {
      const u = stagger(g(p, r.c), i, n, 0.35);
      const pose = dropPose(u, r.y, 260);
      if (pose) sock(svg, x0 + i * BAG_STEP, pose.y, BAG_S, SOCK[r.c], { sq: pose.squash });
    }
  }
  const L2 = ctx.chalk(60);
  // "không nhìn": a chalk eye, crossed out
  const ey = g(p, 'eye');
  if (ey > 0) {
    const k = spring(ey, 3, 6);
    L2.loop(250, PAIR_Y, 70 * k, 34 * k, { width: 6, seed: 30 });
    L2.loop(250, PAIR_Y, 16 * k, 16 * k, { width: 8, seed: 31 });
    mark(L2, false, 250, PAIR_Y, clamp01(ey * 1.6 - 0.5), { size: 90, seed: 32 });
  }
  // the goal: two dashed yellow socks = a black pair, then the thinking dots
  const pr = g(p, 'pair');
  for (let i = 0; i < NEED_BLACK; i++) {
    const k = spring(stagger(pr, i, NEED_BLACK, 0.45), 3, 6);
    if (k > 0) sock(svg, 470 + i * 100, PAIR_Y, 1.3 * k, CHALK.yellow, { dashed: true });
  }
  L2.text('?', 660, PAIR_Y + 30, { size: 90, color: CHALK.yellow, t: clamp01(pr * 1.6 - 0.6) });
  thinkingDots(L2, 810, PAIR_Y + 10, g(p, 'dots'), { r: 14 });
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beats 3–4: one board: three columns and the worst case ---------------------------------------
const COLS = [{ c: 'white', x: 230 }, { c: 'grey', x: 540 }, { c: 'black', x: 850 }];
const S1 = 1.3, STEP = 90, BOT = 1150;
const lvl = (i) => BOT - i * STEP; // centre of the i-th sock (0 = bottom)
const COL_TOP = lvl(STOCK.grey - 1) - 33 * S1 - 22;
const HW = 62;
const LABEL_Y = COL_TOP - 30;
const EQ_Y = 1385, NO_Y = 1485, LOW = [1435, 1540], EQ2_Y = 1470, ANS_Y = 1592;
const HOME = [540, 380];

function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
const ORDER = ['beat3', 'beat4'];

function columns(ctx, S, k) {
  const L = ctx.chalk(60);
  const tt = S('beat3', 'title');
  const w = L.text(TEXT.worst, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });
  const cu = S('beat3', 'cols');
  COLS.forEach((cl, i) => {
    const t = stagger(cu, i, 3, 0.5);
    L.poly([[cl.x - HW, COL_TOP], [cl.x - HW, BOT + 33 * S1 + 10], [cl.x + HW, BOT + 33 * S1 + 10], [cl.x + HW, COL_TOP]],
      { width: 6, t: easeOutCubic(t), seed: 60 + i, amp: 1 });
    L.text(TEXT[cl.c], cl.x, BOT + 33 * S1 + 80, { size: 60, color: INK[cl.c], align: 'center', t: clamp01(t * 1.5 - 0.3) });
  });
  // the black column needs 2: two dashed yellow slots and "cần 2"
  const sl = S('beat3', 'slots');
  const svg = svgLayer(ctx.objects());
  for (let i = 0; i < NEED_BLACK; i++) {
    const s = spring(stagger(sl, i, NEED_BLACK, 0.45), 3, 6);
    if (s > 0) sock(svg, 850, lvl(i), S1 * s, CHALK.yellow, { dashed: true });
  }
  popLabel(L, TEXT.need, 850, LABEL_Y, sl, { size: 54, color: CHALK.yellow, pulse: S('beat3', 'half') });
  // "hết" over white and grey once they are all taken; they pulse again on beat 4
  popLabel(L, TEXT.out, 230, LABEL_Y, S('beat3', 'hw'), { size: 54, color: CHALK.red, pulse: k('pw') });
  popLabel(L, TEXT.out, 540, LABEL_Y, S('beat3', 'hg'), { size: 54, color: CHALK.red, pulse: k('pg') });
}
function worstSocks(ctx, S) {
  const svg = svgLayer(ctx.objects());
  const keys = { white: 'w', grey: 'g', black: 'b' };
  COLS.forEach((cl) => {
    const prog = S('beat3', keys[cl.c]);
    const n = WORST[cl.c];
    for (let i = 0; i < n; i++) {
      const u = stagger(prog, i, n, 0.4);
      const pose = dropPose(u, lvl(i), 420);
      const hb = cl.c === 'black' ? S('beat3', 'hb') : 0;
      const hu = hb < 1 ? hb : 0;
      if (pose) sock(svg, cl.x, pose.y + hopY(hu, 50), S1, SOCK[cl.c], { sq: pose.squash * hopSquash(hu) });
    }
  });
}
// the 15th sock: a white "?" sock; white and grey are gone, so it can only be black
function fifteenth(ctx, k) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const s = spring(k('q15'), 3, 6);
  const fl = k('fly');
  const hu = Math.max(k('t15') < 1 ? k('t15') : 0, k('hop'));
  const hy = hopY(hu, 40);
  if (fl <= 0 && s > 0) {
    sock(svg, HOME[0], HOME[1] + hy, S1 * 1.25, CHALK.white, { k: s, sq: hopSquash(hu), dashed: true });
    L.text('?', HOME[0] - 2, HOME[1] + hy + 24, { size: 72, color: CHALK.yellow, align: 'center', scale: s });
  }
  popLabel(L, `${TEXT.unit} thứ ${ANSWER}`, HOME[0] + 210, HOME[1] + 18, k('t15'), { size: 52, color: CHALK.yellow });
  if (fl > 0) {
    const f = flight(HOME, [850, lvl(1)], fl, 160);
    if (f.v > 0.5) sock(svg, f.x, f.y, S1, SOCK.black, { sq: f.squash });
    else sock(svg, f.x, f.y, S1, CHALK.white, { sq: f.squash, dashed: true });
  }
  mark(L, true, 850, lvl(1) - 130, k('ok'), { size: 64, seed: 310 });
}
function lower4(ctx, k) {
  const L = ctx.chalk(60);
  row(L, [String(WORST_SUM), '+', '1', '=', { s: String(ANSWER), color: CHALK.yellow }], 540, EQ2_Y, { size: 84, t: k('eq2'), seed: 400, gap: 0.3 });
  const xs = row(L, [TEXT.answer, { s: String(ANSWER), color: CHALK.yellow, size: 100 }, TEXT.unit], 540, ANS_Y,
    { size: 66, t: k('ans'), seed: 410, gap: 0.8 });
  const lp = k('loop');
  L.loop(xs[1], ANS_Y - 32, 70, 56, { color: CHALK.yellow, width: 8, t: easeOutCubic(lp), seed: 420 });
  burst(L, xs[1], ANS_Y - 32, 130, clamp01(lp * 1.3 - 0.3), { seed: 430 });
}
function lowerNo(ctx, S) {
  const L = ctx.chalk(60);
  const no = S('beat3', 'no');
  row(L, [TEXT.notYet], 540, NO_Y, { size: 60, t: no, seed: 90 });
  if (no > 0.6) mark(L, false, 540 + measure(TEXT.notYet, 60) / 2 + 60, NO_Y - 20, clamp01((no - 0.6) / 0.4), { size: 52, seed: 95 });
}
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => (beat === 'beat4' ? g(p, key) : 0);
  columns(ctx, S, k);
  worstSocks(ctx, S);
  const L = ctx.chalk(60);
  row(L, [{ s: '6', color: INK.white }, '+', { s: '7', color: INK.grey }, '+', { s: '1', color: INK.black }, '=', String(WORST_SUM)],
    540, EQ_Y, { size: 84, t: S('beat3', 'eq'), seed: 80, gap: 0.3 });
  if (beat === 'beat3') {
    lowerNo(ctx, S);
  } else {
    bandWipe(ctx, k('wipe'), LOW, (c) => lowerNo(c, () => 1), 3);
    fifteenth(ctx, k);
    lower4(ctx, k);
  }
}
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);

// --- beat 5: the practice problem ----------------------------------------------------------------
function beat5(ctx, p) {
  const L0 = ctx.chalk(60);
  const tt = g(p, 'title');
  const w = L0.text(TEXT.turn, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L0.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5, color: CHALK.yellow });
  const svg = svgLayer(ctx.objects());
  const so = g(p, 'socks');
  const L = ctx.chalk(60);
  ['white', 'black', 'grey'].forEach((c, i) => {
    const u = stagger(so, i, 3, 0.45);
    const pose = dropPose(u, 410, 300);
    if (pose) sock(svg, 380 + i * 160, pose.y, 1.15, SOCK[c], { sq: pose.squash });
    // the same bag: 6, 9, 7
    popLabel(L, String(STOCK[c]), 380 + i * 160, 525, u, { size: 54, color: INK[c] });
  });
  const a = g(p, 'ask');
  row(L, [TEXT.ask1], 540, 640, { size: 68, t: clamp01(a * 3), seed: 600 });
  row(L, [TEXT.ask2], 540, 735, { size: 68, t: clamp01(a * 3 - 1), seed: 610 });
  row(L, [{ s: TEXT.ask3, color: CHALK.yellow }], 540, 840, { size: 78, t: clamp01(a * 3 - 2), seed: 620 });
  countdown(L, 540, 1130, g(p, 'count'), { size: 280 });
  row(L, [TEXT.cmt], 540, 1480, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
