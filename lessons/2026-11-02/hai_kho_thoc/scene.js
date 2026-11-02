// Hai kho thóc: tổng 12 tấn 6 tạ; chuyển 80 yến từ A sang B thì A vẫn hơn B 4 tạ; tìm mỗi kho lúc đầu (kg).
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, spring, easeOutCubic, lerp } from '../../../shared/web/js/ease.js';
import { row, flight, solutionIntro } from '../../../shared/web/js/parts.js';
import { svgLayer } from '../../../shared/web/js/cubes.js';
import { g, burst, thinkingDots, countdown, popLabel, hopY, hopSquash } from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F5, D1–D6) ---------------------------------------------------------------
const TOTAL = 12 * 1000 + 6 * 100; // 12 tấn 6 tạ
const MOVE = 80 * 10; // 80 yến
const AFTER = 4 * 100; // 4 tạ
const DIFF = AFTER + MOVE + MOVE;
const A0 = (TOTAL + DIFF) / 2;
const B0 = TOTAL - A0;
const A1 = A0 - MOVE, B1 = B0 + MOVE;
console.assert(TOTAL === 12600 && MOVE === 800 && AFTER === 400, '12 tấn 6 tạ = 12600 kg, 80 yến = 800 kg, 4 tạ = 400 kg');
console.assert(DIFF === 2000 && A0 === 7300 && B0 === 5300, '400 + 800 + 800 = 2000; (12600 + 2000) : 2 = 7300; 12600 − 7300 = 5300');
console.assert(A1 - B1 === AFTER && A1 === 6500 && B1 === 6100, 'check: 6500 − 6100 = 400');
// practice (not shown): 1000 kg, move 100, still 200 more → A 700, B 300
console.assert((1000 + 200 + 200) / 2 === 700 && (700 - 100) - (300 + 100) === 200, 'practice: A 700, B 300');

// the problem as given (Sheet picture, transcribed in story.md), one entry per voice line
const QUESTION = [
  'Hai kho thóc chứa tất cả 12 tấn 6 tạ thóc.',
  'Nếu chuyển từ kho A sang kho B 80 yến thóc thì lúc này số thóc ở kho A vẫn nhiều hơn kho B là 4 tạ.',
  'Tính số ki-lô-gam thóc ở mỗi kho lúc đầu.',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải',
  A: 'Kho A', B: 'Kho B', move: '80 yến', after: '4 tạ',
  t3: 'Đổi ra kg', hints: ['1 tấn = 1000 kg', '1 tạ = 100 kg', '1 yến = 10 kg'],
  conv: [['12 tấn 6 tạ', `${TOTAL} kg`], ['80 yến', `${MOVE} kg`], ['4 tạ', `${AFTER} kg`]],
  t4: 'Lúc đầu A hơn B bao nhiêu?', sum: `Tổng: ${TOTAL} kg`,
  turn: 'Đến lượt bạn!', p1: 'Tổng: 1000 kg', p2: 'A vẫn hơn B 200 kg', p3: 'Chuyển 100 kg từ A sang B', ask: 'Lúc đầu mỗi kho có bao nhiêu kg?',
  cmt: 'Bình luận đáp án nhé!',
};

const GOLD = 'rgba(250, 222, 110, 0.55)';
const PINKF = 'rgba(246, 160, 178, 0.75)';
const SACK = 'rgba(196, 150, 96, 0.95)';
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}
const live = (v) => (v > 0 && v < 1 ? v : 0);
const bump = (u, a = 0.08) => 1 + a * Math.sin(Math.PI * u) * Math.exp(-1.5 * u);

// a silo: chalk container with a roof; gold grain up to `level` px; optional pink band [pinkLo, level]
// k = spring-in scale, s = bump scale, both about the bottom centre
function silo(svg, L, x, w, bottom, cap, level, { k = 1, s = 1, seed = 0, pinkLo = null, label = null, lsize = 56 } = {}) {
  if (k <= 0) return;
  const sc = k * s;
  const cx = x + w / 2;
  const X = (v) => cx + (v - cx) * sc;
  const Y = (v) => bottom + (v - bottom) * sc;
  const top = bottom - cap;
  const lv = bottom - level;
  svgEl('rect', { x: X(x), y: Y(lv), width: w * sc, height: (bottom - lv) * sc, fill: GOLD }, svg);
  if (pinkLo !== null && level > pinkLo) {
    svgEl('rect', { x: X(x), y: Y(lv), width: w * sc, height: (level - pinkLo) * sc, fill: PINKF }, svg);
  }
  L.line([X(x), Y(lv)], [X(x + w), Y(lv)], { color: CHALK.yellow, width: 5, seed: seed + 3 });
  L.poly([[X(x), Y(top)], [X(x), Y(bottom)], [X(x + w), Y(bottom)], [X(x + w), Y(top)]], { width: 6, seed });
  L.poly([[X(x - 14), Y(top)], [X(cx), Y(top - w * 0.28)], [X(x + w + 14), Y(top)], [X(x - 14), Y(top)]], { width: 6, seed: seed + 1 });
  if (label) L.text(label, cx, bottom + 66, { size: lsize, align: 'center' });
}
// a grain sack centred at (cx, cy), size ~ 150 * s
function sack(svg, L, cx, cy, s, label, { seed = 0, size = 44, sy = 1 } = {}) {
  if (s <= 0) return;
  const P = (x, y) => `${cx + x * s} ${cy + y * s * sy}`;
  svgEl('path', {
    d: `M ${P(-62, 60)} Q ${P(-78, -10)} ${P(-30, -42)} L ${P(-22, -60)} L ${P(22, -60)} L ${P(30, -42)} Q ${P(78, -10)} ${P(62, 60)} Z`,
    fill: SACK, stroke: '#efe6cf', 'stroke-width': 5 * s, 'stroke-linejoin': 'round',
  }, svg);
  L.line([cx - 30 * s, cy - 44 * s * sy], [cx + 30 * s, cy - 44 * s * sy], { width: 5, seed });
  if (label) L.text(label, cx, cy + 22 * s * sy, { size: size * s, align: 'center', color: '#fff7e0' });
}

// --- beat 1: the problem, written as it is read, and the two silos ------------------------------
const T = THEME.layout.title;
const Q = { x: 90, y: 290, w: 930, size: 64, lh: 92, gapK: 0.27 };
function wordColor(w) {
  const s = w.replace(/[,.?]/g, '');
  if (['12', 'tấn', '6', 'tạ', '80', 'yến', '4'].includes(s)) return CHALK.yellow;
  if (s === 'ki-lô-gam') return CHALK.pink;
  return CHALK.white;
}
function layoutQuestion() {
  const space = Q.size * Q.gapK;
  const out = [];
  let x = Q.x, line = 0;
  TEXT.question.forEach((seg, si) => {
    const words = seg.split(' ');
    words.forEach((w, wi) => {
      const ww = measure(w, Q.size);
      if (x > Q.x && x + ww > Q.x + Q.w) { x = Q.x; line++; }
      out.push({ w, x, y: Q.y + line * Q.lh, si, wi, n: words.length });
      x += ww + space;
    });
  });
  return out;
}
const S1 = { k: 0.072, bottom: 1660, w: 250, xa: 250, xb: 590 };
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  for (const q of layoutQuestion()) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: wordColor(q.w), t: easeOutCubic(t) });
  }
  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const { k, bottom, w, xa, xb } = S1;
  const cap = 8000 * k;
  const sk = spring(g(p, 'silo'), 3, 6);
  const mv = g(p, 'move');
  const f = flight([xa + w / 2, bottom - A0 * k - 60], [xb + w / 2, bottom - B1 * k - 60], mv, 170);
  const aLv = lerp(A0, A1, easeOutCubic(clamp01(mv * 4))) * k;
  const bLv = lerp(B0, B1, easeOutCubic(clamp01((mv - 0.85) / 0.15))) * k;
  const df = g(p, 'diff');
  const sTot = bump(live(g(p, 'tot')), 0.06);
  silo(svg, L2, xa, w, bottom, cap, aLv, { k: sk, s: sTot, seed: 10, pinkLo: df > 0 ? B1 * k : null, label: TEXT.A, lsize: 52 });
  silo(svg, L2, xb, w, bottom, cap, bLv, { k: sk, s: sTot, seed: 20, label: TEXT.B, lsize: 52 });
  // "?" in each silo, pulsing on "mỗi kho"
  const ask = live(g(p, 'ask'));
  popLabel(L2, '?', xa + w / 2, bottom - 110, g(p, 'silo'), { size: 90, color: CHALK.white, pulse: ask });
  popLabel(L2, '?', xb + w / 2, bottom - 110, g(p, 'silo'), { size: 90, color: CHALK.white, pulse: ask });
  // the sack: only while it moves
  if (mv > 0 && mv < 1) sack(svg, L2, f.x, f.y, 1.05, TEXT.move, { seed: 30, sy: f.squash, size: 48 });
  popLabel(L2, TEXT.after, xa - 90, bottom - (A1 + B1) / 2 * k + 18, df, { size: 58, color: CHALK.pink });
  thinkingDots(L2, 540, bottom + 140, g(p, 'dots'), { r: 14 });
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beat 3: convert to kg -----------------------------------------------------------------------
function beat3(ctx, p) {
  const L = ctx.chalk(60);
  const tt = g(p, 'title');
  const tw = L.text(TEXT.t3, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });
  const hn = g(p, 'hint');
  TEXT.hints.forEach((h, i) => row(L, [{ s: h, color: CHALK.blue }], 540, 400 + i * 72, { size: 58, t: clamp01(hn * 3 - i), seed: 300 + i * 10 }));
  const rs = [g(p, 'r1'), g(p, 'r2'), g(p, 'r3')];
  TEXT.conv.forEach(([a, b], i) => row(L, [{ s: a, color: CHALK.yellow }, '=', { s: b, color: CHALK.pink }], 540, 760 + i * 140, { size: 76, t: rs[i], seed: 400 + i * 10 }));
  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const hs = [g(p, 'h1'), g(p, 'h2'), g(p, 'h3')];
  [250, 540, 830].forEach((x, i) => {
    const u = hs[i];
    if (u <= 0) return;
    const sc = spring(clamp01(u * 2), 3, 6);
    const hop = hopY(u, 50);
    sack(svg, L2, x, 1320 + hop, 1.5 * sc, null, { seed: 500 + i, sy: hopSquash(u) });
    popLabel(L2, TEXT.conv[i][1], x, 1520, u, { size: 58, color: CHALK.pink });
  });
}

// --- beats 4–5: one board: the silos, the move undone, then sum and difference -------------------
const S4 = { k: 0.085, bottom: 1120, w: 240, xa: 300, xb: 620 };
const ROWS = { rd: 1290, rA: 1410, rB: 1540 };
function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
const ORDER = ['beat4', 'beat5'];
function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const L = ctx.chalk(60);
  const tt = S('beat4', 'title');
  const tw = L.text(TEXT.t4, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });

  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const { k, bottom, w, xa, xb } = S4;
  const cap = 8000 * k;
  const sk = spring(S('beat4', 'silos'), 3, 6);
  const bk = S('beat4', 'back');
  const f = flight([xb + w / 2, bottom - B1 * k - 70], [xa + w / 2, bottom - A0 * k - 70], bk, 190);
  const aLv = lerp(A1, A0, easeOutCubic(clamp01((bk - 0.85) / 0.15))) * k;
  const bLv = lerp(B1, B0, easeOutCubic(clamp01(bk * 4))) * k;
  const sum = live(S('beat5', 'sum'));
  const sA = bump(Math.max(live(S('beat4', 'up')), live(S('beat4', 'd2000')), live(S('beat4', 'gap')), live(S('beat5', 'a73')), sum), 0.1);
  const sB = bump(Math.max(live(S('beat4', 'down')), live(S('beat4', 'gap')), live(S('beat5', 'b53')), sum), 0.1);
  const d4 = S('beat4', 'd400');
  silo(svg, L2, xa, w, bottom, cap, aLv, { k: sk, s: sA, seed: 40, pinkLo: d4 > 0 ? bLv : null, label: TEXT.A });
  silo(svg, L2, xb, w, bottom, cap, bLv, { k: sk, s: sB, seed: 50, label: TEXT.B });
  if (bk > 0 && bk < 1) sack(svg, L2, f.x, f.y, 1.1, `${MOVE} kg`, { seed: 60, sy: f.squash, size: 44 });
  // the gap: 400 kg after the move, 2000 kg at the start
  const gy = bottom - (aLv + bLv) / 2;
  if (bk <= 0) popLabel(L2, `${AFTER} kg`, xa - 125, gy + 18, d4, { size: 50, color: CHALK.pink });
  popLabel(L2, `${DIFF} kg`, xa - 125, gy + 18, S('beat4', 'd2000'), { size: 50, color: CHALK.pink });
  popLabel(L2, `+${MOVE}`, xa + w / 2, bottom - aLv + 70, S('beat4', 'up') * (S('beat5', 'sum') > 0 ? 0 : 1), { size: 64, color: CHALK.white });
  popLabel(L2, `−${MOVE}`, xb + w / 2 + 6, bottom - bLv - 40, S('beat4', 'down') * (S('beat5', 'sum') > 0 ? 0 : 1), { size: 64, color: CHALK.yellow });
  // beat 5: the total, then each silo's amount
  popLabel(L2, TEXT.sum, 540, 330, S('beat5', 'sum'), { size: 64, color: CHALK.blue });
  popLabel(L2, `${A0} kg`, xa + w / 2, bottom - 200, S('beat5', 'a73'), { size: 52, color: CHALK.white });
  popLabel(L2, `${B0} kg`, xb + w / 2, bottom - 200, S('beat5', 'b53'), { size: 52, color: CHALK.white });

  const Lr = ctx.chalk(60);
  row(Lr, [{ s: String(AFTER), color: CHALK.pink }, '+', { s: String(MOVE), color: CHALK.yellow }, '+', { s: String(MOVE), color: CHALK.yellow }, '=', { s: `${DIFF} kg`, color: CHALK.pink }], 540, ROWS.rd, { size: 64, t: S('beat4', 'rd'), seed: 100 });
  if (beat === 'beat5') {
    const xsA = row(Lr, [TEXT.A + ':', `(${TOTAL}`, '+', `${DIFF})`, ':', '2', '=', '', '', { s: `${A0} kg`, color: CHALK.yellow }], 540, ROWS.rA,
      { size: 58, t: g(p, 'rA'), seed: 110, gap: 0.4 });
    const xsB = row(Lr, [TEXT.B + ':', String(TOTAL), { sym: 'minus' }, String(A0), '=', '', '', { s: `${B0} kg`, color: CHALK.yellow }], 540, ROWS.rB,
      { size: 58, t: g(p, 'rB'), seed: 120, gap: 0.4 });
    const lp = g(p, 'loop');
    Lr.loop(xsA[9] + 4, ROWS.rA - 20, 140, 54, { color: CHALK.yellow, width: 7, t: easeOutCubic(lp), seed: 150 });
    Lr.loop(xsB[7] + 4, ROWS.rB - 20, 140, 54, { color: CHALK.yellow, width: 7, t: easeOutCubic(clamp01(lp * 1.3 - 0.15)), seed: 151 });
    burst(Lr, xsA[9], ROWS.rA - 20, 140, clamp01(lp * 1.3 - 0.3), { seed: 160 });
  }
}
const beat4 = (ctx, p) => board(ctx, 'beat4', p);
const beat5 = (ctx, p) => board(ctx, 'beat5', p);

// --- beat 6: the practice problem ----------------------------------------------------------------
function beat6(ctx, p) {
  const L0 = ctx.chalk(60);
  const tt = g(p, 'title');
  const tw = L0.text(TEXT.turn, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L0.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5, color: CHALK.yellow });
  const L = ctx.chalk(60);
  row(L, [{ s: TEXT.p1, color: CHALK.blue }], 540, 400, { size: 68, t: g(p, 't1'), seed: 600 });
  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const k = 0.3, bottom = 860, w = 170, xa = 330, xb = 580;
  const sk = spring(g(p, 'silo'), 3, 6);
  const mv = g(p, 'mv');
  const f = flight([xa + w / 2, bottom - 700 * k - 50], [xb + w / 2, bottom - 400 * k - 50], mv, 120);
  const aLv = lerp(700, 600, easeOutCubic(clamp01(mv * 4))) * k;
  const bLv = lerp(300, 400, easeOutCubic(clamp01((mv - 0.85) / 0.15))) * k;
  silo(svg, L2, xa, w, bottom, 1000 * k, aLv, { k: sk, seed: 610, label: 'A', lsize: 50 });
  silo(svg, L2, xb, w, bottom, 1000 * k, bLv, { k: sk, seed: 620, label: 'B', lsize: 50 });
  if (mv > 0 && mv < 1) sack(svg, L2, f.x, f.y, 0.9, '100 kg', { seed: 630, sy: f.squash, size: 50 });
  row(L2, [{ s: TEXT.p3, color: CHALK.white }], 540, 1020, { size: 64, t: mv, seed: 635 });
  const ask = live(g(p, 'ask'));
  popLabel(L2, '?', xa + w / 2, bottom - 30, g(p, 'silo'), { size: 70, color: CHALK.white, pulse: ask });
  popLabel(L2, '?', xb + w / 2, bottom - 20, g(p, 'silo'), { size: 70, color: CHALK.white, pulse: ask });
  row(L2, [{ s: TEXT.p2, color: CHALK.pink }], 540, 1120, { size: 64, t: g(p, 't2'), seed: 640 });
  row(L2, [{ s: TEXT.ask, color: CHALK.yellow }], 540, 1220, { size: 62, t: g(p, 'ask'), seed: 650 });
  countdown(L2, 540, 1420, g(p, 'count'), { size: 240 });
  row(L2, [TEXT.cmt], 540, 1620, { size: 80, t: g(p, 'cmt'), seed: 660 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
