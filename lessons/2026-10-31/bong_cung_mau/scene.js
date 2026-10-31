// Chắc chắn có 5 quả bóng cùng màu: 10 đỏ, 8 xanh dương, 4 xanh lá; trường hợp xui nhất.
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, stagger, spring, easeOutCubic, rng } from '../../../shared/web/js/ease.js';
import { row, bar, flight, solutionIntro } from '../../../shared/web/js/parts.js';
import { svgLayer, shade } from '../../../shared/web/js/cubes.js';
import {
  g, dropPose, burst, mark, hopY, hopSquash, thinkingDots, countdown, popLabel, bandWipe, outScale,
} from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F2, D1–D6) ---------------------------------------------------------------
const STOCK = { red: 10, blue: 8, green: 4 };
const NEED = 5;
// brute force: the biggest draw with every colour under `need`, plus 1, is the sure number
function sureCount(need) {
  let worst = 0;
  for (let r = 0; r <= STOCK.red; r++) for (let b = 0; b <= STOCK.blue; b++) for (let gr = 0; gr <= STOCK.green; gr++) {
    if (r < need && b < need && gr < need) worst = Math.max(worst, r + b + gr);
  }
  return worst + 1;
}
const WORST = { red: Math.min(STOCK.red, NEED - 1), blue: Math.min(STOCK.blue, NEED - 1), green: Math.min(STOCK.green, NEED - 1) };
const WORST_SUM = WORST.red + WORST.blue + WORST.green;
const ANSWER = WORST_SUM + 1;
console.assert(WORST.red === 4 && WORST.blue === 4 && WORST.green === 4 && STOCK.green === 4, 'worst case 4, 4, 4 (green runs out at 4)');
console.assert(WORST_SUM === 12, '4 + 4 + 4 = 12');
console.assert(ANSWER === 13 && sureCount(NEED) === 13, 'answer 13 (brute force)');
console.assert(sureCount(3) === 7, 'challenge: 3 of one colour needs 7 (not shown)');

// the problem as given (Sheet), one entry per voice line
const QUESTION = [
  'Trong một chiếc hộp kín có 10 quả bóng đỏ,',
  '8 quả bóng xanh dương và 4 quả bóng xanh lá.',
  'Hỏi cần lấy ra ngẫu nhiên ít nhất bao nhiêu quả bóng để chắc chắn có được 5 quả bóng cùng màu?',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải', worst: 'Trường hợp xui nhất',
  red: 'Đỏ', blue: 'Xanh dương', green: 'Xanh lá', five: '5 quả', out: 'chỉ có 4', same: 'cùng màu?', lid: 'kín',
  notYet: 'chưa có 5 quả cùng màu', or: 'hoặc', answer: 'Cần lấy ít nhất', unit: 'quả',
  turn: 'Đến lượt bạn!', ask1: 'Lấy ít nhất bao nhiêu quả', ask2: 'để chắc chắn có', ask3: '3 quả cùng màu?',
  cmt: 'Bình luận đáp án nhé!',
};

// real-coloured balls; their chalk labels use the matching chalk colour
const BALL = { red: 'rgb(224, 72, 62)', blue: 'rgb(66, 128, 222)', green: 'rgb(78, 178, 88)', white: 'rgb(240, 238, 228)' };
const INK = { red: CHALK.red, blue: CHALK.blue, green: CHALK.green };
function wordColor(w, next) {
  const s = w.replace(/[,.?]/g, '');
  if (s === '10' || s === 'đỏ') return INK.red;
  if (s === '8' || s === 'dương') return INK.blue;
  if (s === '4' || s === 'lá') return INK.green;
  if (s === 'xanh' && next) return next === 'dương' ? INK.blue : next.startsWith('lá') ? INK.green : CHALK.white;
  if (s === '5') return CHALK.yellow;
  return CHALK.white;
}

// one ball, squashed against its bottom (sq < 1 squash, > 1 stretch)
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}
function ball(svg, x, y, r, color, { sq = 1, k = 1, dashed = false } = {}) {
  if (k <= 0) return;
  const rr = r * k;
  const gr = svgEl('g', { transform: `translate(${x} ${y + rr}) scale(${1 / Math.sqrt(sq)} ${sq}) translate(${-x} ${-(y + rr)})` }, svg);
  if (dashed) {
    svgEl('circle', { cx: x, cy: y, r: rr, fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-dasharray': '12 9' }, gr);
    return;
  }
  svgEl('circle', { cx: x, cy: y, r: rr, fill: color, stroke: shade(color, 0.62), 'stroke-width': 3.5 }, gr);
  svgEl('ellipse', { cx: x - rr * 0.34, cy: y - rr * 0.38, rx: rr * 0.32, ry: rr * 0.2, fill: 'rgb(255, 255, 255)', 'fill-opacity': 0.5 }, gr);
}

// --- beat 1: the problem, written word by word as it is read, and the box -----------------------
const T = THEME.layout.title;
const Q = { x: 90, y: 320, w: 930, size: 74, lh: 112, gapK: 0.27 };
function layoutQuestion() {
  const space = Q.size * Q.gapK;
  const out = [];
  let x = Q.x, line = 0;
  TEXT.question.forEach((seg, si) => {
    const words = seg.split(' ');
    words.forEach((w, wi) => {
      const ww = measure(w, Q.size);
      if (x > Q.x && x + ww > Q.x + Q.w) { x = Q.x; line++; }
      out.push({ w, next: words[wi + 1], x, y: Q.y + line * Q.lh, si, wi, n: words.length });
      x += ww + space;
    });
  });
  return out;
}
const BOX = { l: 170, r: 910, top: 1160, bot: 1380 };
const BOX_R = 28;
// 22 balls in two rows of 11, colours mixed (fixed shuffle)
const BOX_BALLS = (() => {
  const cols = [...Array(STOCK.red).fill('red'), ...Array(STOCK.blue).fill('blue'), ...Array(STOCK.green).fill('green')];
  const r = rng(12);
  for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
  const idx = { red: 0, blue: 0, green: 0 };
  return cols.map((c, i) => ({ c, n: idx[c]++, x: 213 + (i % 11) * 65.4, y: i < 11 ? 1322 : 1252 }));
})();
console.assert(BOX_BALLS.length === 22, '22 balls in the box');
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  for (const q of layoutQuestion()) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: wordColor(q.w, q.next), t: easeOutCubic(t) });
  }
  // the box: chalk sides; balls drop in as each colour is read; a wooden lid closes it
  const bx = g(p, 'box');
  L.poly([[BOX.l, BOX.top], [BOX.l, BOX.bot], [BOX.r, BOX.bot], [BOX.r, BOX.top]], { width: 7, t: easeOutCubic(bx), seed: 20, amp: 1 });
  const svg = svgLayer(ctx.objects());
  for (const b of BOX_BALLS) {
    const u = stagger(g(p, b.c), b.n, STOCK[b.c], 0.35);
    const pose = dropPose(u, b.y, 260);
    if (pose) ball(svg, b.x, pose.y, BOX_R, BALL[b.c], { sq: pose.squash });
  }
  const objs = ctx.objects();
  const lid = g(p, 'lid');
  if (lid > 0) {
    const f = flight([BOX.l - 420, BOX.top - 90], [(BOX.l + BOX.r) / 2, BOX.top - 2], lid, 60);
    const w = BOX.r - BOX.l + 40;
    bar(objs, f.x, f.y, 44, 'int', w, f.squash);
  }
  const L2 = ctx.chalk(60);
  if (lid > 0.6) L2.text(TEXT.lid, (BOX.l + BOX.r) / 2, BOX.top - 8, { size: 40, color: THEME.tiles.ink, align: 'center', t: clamp01((lid - 0.6) / 0.3) });
  // "5 quả cùng màu?" target: five yellow rings pop over the box
  const five = g(p, 'five');
  for (let i = 0; i < NEED; i++) {
    const k = spring(stagger(five, i, NEED, 0.45), 3, 6);
    if (k > 0) L2.loop(250 + i * 80, BOX.bot + 95, 26 * k, 26 * k, { color: CHALK.yellow, width: 6, seed: 40 + i });
  }
  L2.text(TEXT.same, 250 + NEED * 80, BOX.bot + 113, { size: 60, color: CHALK.yellow, t: clamp01(five * 1.6 - 0.6) });
  thinkingDots(L2, 540, BOX.bot + 190, g(p, 'dots'), { r: 15 });
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beats 3–4: one board: three tubes and the worst case -----------------------------------------
const TUBES = [{ c: 'red', x: 230 }, { c: 'blue', x: 540 }, { c: 'green', x: 850 }];
const R = 38, STEP = 84, BOT = 1080, TUBE_TOP = 690;
const lvl = (i) => BOT - i * STEP; // centre of the i-th ball (0 = bottom)
const Y5 = lvl(NEED - 1);
const EQ_Y = 1300, NO_Y = 1400, LOW = [1350, 1450], EQ2_Y = 1410, ANS_Y = 1545;
const BALL13 = [540, 560];

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

function tubes(ctx, S) {
  const L = ctx.chalk(60);
  const tt = S('beat3', 'title');
  const w = L.text(TEXT.worst, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });
  const tu = S('beat3', 'tubes');
  TUBES.forEach((tb, i) => {
    const t = stagger(tu, i, 3, 0.5);
    const hw = R + 12;
    L.poly([[tb.x - hw, TUBE_TOP], [tb.x - hw, BOT + R + 8], [tb.x + hw, BOT + R + 8], [tb.x + hw, TUBE_TOP]],
      { width: 6, t: easeOutCubic(t), seed: 60 + i, amp: 1 });
    L.text(TEXT[tb.c], tb.x, BOT + R + 80, { size: 54, color: INK[tb.c], align: 'center', t: clamp01(t * 1.5 - 0.3) });
  });
  // the "5" level
  const l5 = S('beat3', 'line5');
  L.dashed([150, Y5], [930, Y5], { color: CHALK.yellow, width: 5, t: easeOutCubic(l5) });
  popLabel(L, TEXT.five, 982, Y5 + 16, clamp01(l5 * 1.4 - 0.4), { size: 46 });
}
function worstBalls(ctx, S) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const keys = { red: 'r', blue: 'b', green: 'g' };
  TUBES.forEach((tb) => {
    const prog = S('beat3', keys[tb.c]);
    for (let i = 0; i < WORST[tb.c]; i++) {
      const u = stagger(prog, i, WORST[tb.c], 0.4);
      const pose = dropPose(u, lvl(i), 420);
      if (pose) ball(svg, tb.x, pose.y, R, BALL[tb.c], { sq: pose.squash });
    }
  });
  popLabel(L, TEXT.out, 850, TUBE_TOP - 34, S('beat3', 'het'), { size: 50, color: CHALK.red });
}
// the 13th ball: a white "?" ball; it can only go to red or blue (green is out)
function thirteenth(ctx, k) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const q = k('q13');
  const s = spring(q, 3, 6);
  const tR = k('toR'), tB = k('toB');
  const home = BALL13;
  // the waiting ball hops on "13" and again on "quả này"
  const hu = Math.max(k('t13') < 1 ? k('t13') : 0, k('hop'));
  const hy = hopY(hu, 40);
  if (tR < 0.15 && s > 0) {
    ball(svg, home[0], home[1] + hy, R * 1.4, BALL.white, { k: s, sq: hopSquash(hu) });
    L.text('?', home[0], home[1] + hy + 22, { size: 66, color: THEME.tiles.ink, align: 'center', scale: s });
  }
  popLabel(L, `${TEXT.unit} thứ ${ANSWER}`, home[0] + 170, home[1] + 18, k('t13'), { size: 52, color: CHALK.yellow });
  // green is out: red cross over its tube
  const x = k('x13');
  if (x > 0) mark(L, false, 850, Y5, x, { size: 70, seed: 300 });
  // one copy flies to red, then one to blue (either way: 5 of one colour)
  for (const [c, tx, u] of [['red', 230, tR], ['blue', 540, tB]]) {
    if (u <= 0) continue;
    const f = flight(home, [tx, Y5], u, 140);
    ball(svg, f.x, f.y, R, f.v > 0.55 ? BALL[c] : BALL.white, { sq: f.squash });
  }
  popLabel(L, TEXT.or, 385, Y5 + 60, clamp01(tB * 1.6 - 0.2), { size: 58, color: CHALK.white });
  const ok = k('ok');
  if (ok > 0) {
    mark(L, true, 230, Y5 - 90, ok, { size: 56, seed: 310 });
    mark(L, true, 540, Y5 - 90, clamp01(ok * 1.2 - 0.2), { size: 56, seed: 320 });
  }
}
function lower4(ctx, k) {
  const L = ctx.chalk(60);
  row(L, [String(WORST_SUM), '+', '1', '=', { s: String(ANSWER), color: CHALK.yellow }], 540, EQ2_Y, { size: 84, t: k('eq2'), seed: 400, gap: 0.3 });
  const xs = row(L, [TEXT.answer, { s: String(ANSWER), color: CHALK.yellow, size: 100 }, TEXT.unit], 540, ANS_Y,
    { size: 66, t: k('ans'), seed: 410, gap: 0.8 });
  const lp = k('loop');
  L.loop(xs[1], ANS_Y - 32, 72, 66, { color: CHALK.yellow, width: 8, t: easeOutCubic(lp), seed: 420 });
  burst(L, xs[1], ANS_Y - 32, 130, clamp01(lp * 1.3 - 0.3), { seed: 430 });
}
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => g(p, key);
  tubes(ctx, S);
  worstBalls(ctx, S);
  // the 13th ball lives above the eq row; on beat 4 the "chưa có" line is wiped for 12 + 1 = 13
  const L = ctx.chalk(60);
  row(L, [{ s: '4', color: INK.red }, '+', { s: '4', color: INK.blue }, '+', { s: '4', color: INK.green }, '=', String(WORST_SUM)],
    540, EQ_Y, { size: 84, t: S('beat3', 'eq'), seed: 80, gap: 0.3 });
  if (beat === 'beat3') {
    lowerNo(ctx, S);
  } else {
    bandWipe(ctx, k('wipe'), LOW, (c) => lowerNo(c, () => 1), 3);
    thirteenth(ctx, k);
    lower4(ctx, k);
  }
}
function lowerNo(ctx, S) {
  const L = ctx.chalk(60);
  row(L, [TEXT.notYet], 540, NO_Y, { size: 58, t: S('beat3', 'no'), seed: 90 });
  const no = S('beat3', 'no');
  if (no > 0.6) mark(L, false, 540 + measure(TEXT.notYet, 58) / 2 + 60, NO_Y - 20, clamp01((no - 0.6) / 0.4), { size: 50, seed: 95 });
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
  const bl = g(p, 'balls');
  ['red', 'blue', 'green'].forEach((c, i) => {
    const u = stagger(bl, i, 3, 0.45);
    const pose = dropPose(u, 420, 300);
    if (pose) ball(svg, 380 + i * 160, pose.y, 46, BALL[c], { sq: pose.squash });
  });
  const L = ctx.chalk(60);
  // the same box: 10, 8, 4
  ['red', 'blue', 'green'].forEach((c, i) => popLabel(L, String(STOCK[c]), 380 + i * 160, 520, stagger(bl, i, 3, 0.45), { size: 54, color: INK[c] }));
  const a = g(p, 'ask');
  row(L, [TEXT.ask1], 540, 620, { size: 68, t: clamp01(a * 3), seed: 600 });
  row(L, [TEXT.ask2], 540, 715, { size: 68, t: clamp01(a * 3 - 1), seed: 610 });
  row(L, [{ s: TEXT.ask3, color: CHALK.yellow }], 540, 820, { size: 80, t: clamp01(a * 3 - 2), seed: 620 });
  countdown(L, 540, 1110, g(p, 'count'), { size: 280 });
  row(L, [TEXT.cmt], 540, 1480, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
