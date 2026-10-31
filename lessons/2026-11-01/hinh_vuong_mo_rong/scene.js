// Mở rộng mỗi cạnh hình vuông thêm 4 cm thì diện tích tăng 96 cm²; tìm chu vi hình vuông ban đầu.
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, spring, easeOutCubic } from '../../../shared/web/js/ease.js';
import { row, flight, solutionIntro } from '../../../shared/web/js/parts.js';
import { svgLayer } from '../../../shared/web/js/cubes.js';
import { g, burst, thinkingDots, countdown, popLabel } from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F3, D1–D7) ---------------------------------------------------------------
const ADD = 4, GAIN = 96;
const CORNER = ADD * ADD;
const TWO = GAIN - CORNER;
const ONE = TWO / 2;
const SIDE = ONE / ADD;
const PERIM = SIDE * 4;
console.assert(CORNER === 16 && TWO === 80 && ONE === 40, '4 × 4 = 16, 96 − 16 = 80, 80 : 2 = 40');
console.assert(SIDE === 10 && PERIM === 40, '40 : 4 = 10, 10 × 4 = 40');
console.assert((SIDE + ADD) ** 2 - SIDE ** 2 === GAIN, 'check: 14 × 14 − 10 × 10 = 96');
console.assert((SIDE + 2) ** 2 - SIDE ** 2 === 44, 'challenge: 12 × 12 − 10 × 10 = 44 (not shown)');

// the problem as given (Sheet picture, transcribed in story.md), one entry per voice line
const QUESTION = [
  'Nếu mở rộng mỗi cạnh của một hình vuông thêm 4 cm',
  'thì diện tích của hình vuông đó tăng thêm 96 cm².',
  'Hỏi chu vi của hình vuông ban đầu là bao nhiêu cm?',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải', title: 'Phần tăng thêm',
  unit: 'cm²', cm: 'cm', per: 'Chu vi:', perQ: 'chu vi?',
  turn: 'Đến lượt bạn!', ask: 'Diện tích tăng thêm bao nhiêu cm²?', cmt: 'Bình luận đáp án nhé!',
};

const BLUE = 'rgba(150, 205, 240, 0.30)';
const GOLD = 'rgba(250, 222, 110, 0.45)';
const PINK = 'rgba(246, 160, 178, 0.55)';
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}
// a filled box with a chalk outline, scaled about its centre by s (springy bumps)
function box(svg, L, l, t, w, h, fill, { s = 1, k = 1, color = CHALK.white, seed = 0, line = 5 } = {}) {
  if (k <= 0) return;
  const cx = l + w / 2, cy = t + h / 2;
  const W = w * s * k, H = h * s * k;
  svgEl('rect', { x: cx - W / 2, y: cy - H / 2, width: W, height: H, fill }, svg);
  L.rect(cx - W / 2, cy - H / 2, cx + W / 2, cy + H / 2, { color, width: line, seed });
}
const live = (v) => (v > 0 && v < 1 ? v : 0);
const bump = (u, a = 0.08) => 1 + a * Math.sin(Math.PI * u) * Math.exp(-1.5 * u);

// --- beat 1: the problem, written as it is read, and the square that grows ------------------------
const T = THEME.layout.title;
const Q = { x: 90, y: 300, w: 930, size: 72, lh: 104, gapK: 0.27 };
function wordColor(w) {
  const s = w.replace(/[,.?]/g, '');
  if (s === '4') return CHALK.yellow;
  if (s === '96') return CHALK.yellow;
  if (s === 'chu' || s === 'vi') return CHALK.pink;
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
const P1 = 34;
const F1 = { l: 540 - ((SIDE + ADD) * P1) / 2, t: 990, a: SIDE * P1, e: ADD * P1 };
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  for (const q of layoutQuestion()) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: wordColor(q.w), t: easeOutCubic(t) });
  }
  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const { l, t, a, e } = F1;
  const gr = spring(g(p, 'grow'), 3, 6);
  const a96 = g(p, 'a96');
  // the added L (gold): right strip, bottom strip, corner
  if (gr > 0) {
    const ex = e * gr;
    const s96 = bump(live(a96), 0.06);
    box(svg, L2, l + a, t, ex, a, GOLD, { seed: 11, color: CHALK.yellow, s: s96 });
    box(svg, L2, l, t + a, a, ex, GOLD, { seed: 12, color: CHALK.yellow, s: s96 });
    box(svg, L2, l + a, t + a, ex, ex, GOLD, { seed: 13, color: CHALK.yellow, s: s96 });
  }
  const sq = spring(g(p, 'sq'), 3, 6);
  box(svg, L2, l, t, a, a, BLUE, { k: sq, seed: 10 });
  popLabel(L2, `+${ADD} cm`, l + a + e / 2, t - 26, g(p, 'grow'), { size: 50, color: CHALK.yellow });
  popLabel(L2, `+${ADD} cm`, l + a + e + 92, t + a / 2 + 16, clamp01(g(p, 'grow') * 1.3 - 0.3), { size: 50, color: CHALK.yellow });
  popLabel(L2, `+${GAIN} cm²`, 540, t + a + e + 78, a96, { size: 64, color: CHALK.yellow });
  // the question: the old square's perimeter
  const pr = g(p, 'per');
  if (pr > 0) L2.rect(l, t, l + a, t + a, { color: CHALK.pink, width: 9, t: easeOutCubic(pr), seed: 14 });
  popLabel(L2, TEXT.perQ, l + a / 2, t + a / 2 + 18, clamp01(pr * 1.4 - 0.4), { size: 56, color: CHALK.pink });
  thinkingDots(L2, 540, t + a + e + 170, g(p, 'dots'), { r: 14 });
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beats 3–4: one board: the added L, split into two rectangles and a corner -------------------
const PX = 40;
const FIG = { l: 260, t: 380, a: SIDE * PX, e: ADD * PX };
const PULL = [70, 60];
const ROWS = { r1: 1130, r2: 1230, r3: 1330, r4: 1440, ans: 1570 };
const RS = 62;

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

function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => (beat === 'beat4' ? g(p, key) : 0);
  const L = ctx.chalk(60);
  const tt = S('beat3', 'title');
  const tw = L.text(TEXT.title, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });

  const svg = svgLayer(ctx.objects());
  const Lf = ctx.chalk(60);
  const { l, t, a, e } = FIG;
  const fig = spring(S('beat3', 'fig'), 3, 6);
  // the two rectangles bump on "hai", "80", "40" and on beat 4's width/length
  const sb = bump(Math.max(live(S('beat3', 'rects')), live(S('beat3', 'p80')), live(S('beat3', 'p40')), live(k('w4')), live(k('len'))), 0.12);
  box(svg, Lf, l, t, a, a, BLUE, { k: fig, seed: 20, s: bump(live(k('s10'))) });
  box(svg, Lf, l + a, t, e, a, GOLD, { k: fig, seed: 21, color: CHALK.yellow, s: sb });
  box(svg, Lf, l, t + a, a, e, GOLD, { k: fig, seed: 22, color: CHALK.yellow, s: sb });
  // the corner turns pink, then slides out on an arc
  const cn = S('beat3', 'corner');
  const pu = S('beat3', 'pull');
  const from = [l + a + e / 2, t + a + e / 2];
  const f = flight(from, [from[0] + PULL[0], from[1] + PULL[1]], pu, 50);
  box(svg, Lf, f.x - e / 2, f.y - e / 2, e, e, cn > 0.5 ? PINK : GOLD,
    { k: fig, seed: 23, color: cn > 0.5 ? CHALK.pink : CHALK.yellow, s: bump(Math.max(live(cn), live(S('beat3', 'c16')))) * (pu > 0 && pu < 1 ? f.squash : 1) });
  const Ll = ctx.chalk(60);
  // labels
  popLabel(Ll, `${CORNER}`, f.x, f.y + 4, S('beat3', 'c16'), { size: 56, color: CHALK.pink });
  popLabel(Ll, TEXT.unit, f.x, f.y + 48, S('beat3', 'c16'), { size: 40, color: CHALK.pink });
  popLabel(Ll, `${ADD} cm`, f.x, f.y - e / 2 - 18, S('beat3', 'pull'), { size: 48, color: CHALK.pink });
  const p40 = S('beat3', 'p40');
  popLabel(Ll, `${ONE}`, l + a + e / 2, t + a / 2 + 4, p40, { size: 52, color: CHALK.yellow });
  popLabel(Ll, TEXT.unit, l + a + e / 2, t + a / 2 + 48, p40, { size: 38, color: CHALK.yellow });
  popLabel(Ll, `${ONE} cm²`, l + a / 2, t + a + e / 2 + 18, p40, { size: 52, color: CHALK.yellow });
  // beat 4: the bottom rectangle's width (4 cm) and length (? → 10 cm, the old side)
  popLabel(Ll, `${ADD} cm`, l - 72, t + a + e / 2 + 16, k('w4'), { size: 52, color: CHALK.yellow });
  const ln = k('len'), s10 = k('s10');
  if (ln > 0) {
    const y = t + a + e + 30;
    Ll.arrow([l + a / 2, y], [l + 4, y], { width: 4, t: ln, seed: 40, head: 16 });
    Ll.arrow([l + a / 2, y], [l + a - 4, y], { width: 4, t: ln, seed: 41, head: 16 });
  }
  popLabel(Ll, s10 > 0.4 ? `${SIDE} cm` : '?', l + a / 2, t + a + e + 84, s10 > 0.4 ? s10 : ln, { size: 50, color: s10 > 0.4 ? CHALK.yellow : CHALK.white });
  popLabel(Ll, `${SIDE} cm`, l + a / 2, t + a / 2 + 18, s10, { size: 56, color: CHALK.blue });
  // the perimeter of the old square, traced
  const tr = k('trace');
  if (tr > 0) Ll.rect(l, t, l + a, t + a, { color: CHALK.pink, width: 9, t: easeOutCubic(tr), seed: 50 });

  // the working, row by row
  const Lr = ctx.chalk(60);
  row(Lr, [String(ADD), { sym: 'times' }, String(ADD), '=', { s: `${CORNER} ${TEXT.unit}`, color: CHALK.pink }], 540, ROWS.r1, { size: RS, t: S('beat3', 'r1'), seed: 100 });
  row(Lr, [{ s: String(GAIN), color: CHALK.yellow }, { sym: 'minus' }, String(CORNER), '=', `${TWO} ${TEXT.unit}`], 540, ROWS.r2, { size: RS, t: S('beat3', 'r2'), seed: 110 });
  row(Lr, [String(TWO), ':', '2', '=', { s: `${ONE} ${TEXT.unit}`, color: CHALK.yellow }], 540, ROWS.r3, { size: RS, t: S('beat3', 'r3'), seed: 120 });
  if (beat === 'beat4') {
    row(Lr, [String(ONE), ':', String(ADD), '=', { s: `${SIDE} ${TEXT.cm}`, color: CHALK.blue }], 540, ROWS.r4, { size: RS + 4, t: k('r4'), seed: 130 });
    const xs = row(Lr, [TEXT.per, String(SIDE), { sym: 'times' }, '4', '=', { s: `${PERIM} ${TEXT.cm}`, color: CHALK.yellow, size: 80 }], 540, ROWS.ans,
      { size: 66, t: k('ans'), seed: 140, gap: 0.45 });
    const lp = k('loop');
    Lr.loop(xs[5] + 8, ROWS.ans - 24, 128, 70, { color: CHALK.yellow, width: 8, t: easeOutCubic(lp), seed: 150 });
    burst(Lr, xs[5], ROWS.ans - 24, 120, clamp01(lp * 1.3 - 0.3), { seed: 160 });
  }
}
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);

// --- beat 5: the practice problem ----------------------------------------------------------------
function beat5(ctx, p) {
  const L0 = ctx.chalk(60);
  const tt = g(p, 'title');
  const tw = L0.text(TEXT.turn, T.x, T.y, { size: T.size, t: tt, color: CHALK.yellow });
  L0.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5, color: CHALK.yellow });
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const sc = 32;
  const a = SIDE * sc, e = 2 * sc;
  const l = 540 - (a + e) / 2, t = 470;
  const gr = spring(g(p, 'grow'), 3, 6);
  if (gr > 0) {
    box(svg, L, l + a, t, e * gr, a, GOLD, { seed: 501, color: CHALK.yellow });
    box(svg, L, l, t + a, a, e * gr, GOLD, { seed: 502, color: CHALK.yellow });
    box(svg, L, l + a, t + a, e * gr, e * gr, GOLD, { seed: 503, color: CHALK.yellow });
  }
  box(svg, L, l, t, a, a, BLUE, { k: spring(g(p, 'sq'), 3, 6), seed: 500 });
  popLabel(L, `${SIDE} cm`, l + a / 2, t + a / 2 + 18, g(p, 'sq'), { size: 58, color: CHALK.blue });
  popLabel(L, '+2 cm', l + a + e / 2, t - 26, g(p, 'grow'), { size: 50, color: CHALK.yellow });
  popLabel(L, '+2 cm', l + a + e + 84, t + a / 2 + 16, clamp01(g(p, 'grow') * 1.3 - 0.3), { size: 50, color: CHALK.yellow });
  row(L, [{ s: TEXT.ask, color: CHALK.yellow }], 540, 1010, { size: 62, t: g(p, 'ask'), seed: 620 });
  countdown(L, 540, 1280, g(p, 'count'), { size: 260 });
  row(L, [TEXT.cmt], 540, 1520, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
