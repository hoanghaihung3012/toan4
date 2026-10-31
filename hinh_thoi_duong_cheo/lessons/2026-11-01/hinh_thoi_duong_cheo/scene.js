// Hình thoi 120 cm²; giữ nguyên một đường chéo, tăng đường chéo kia thêm 5 cm thì được 150 cm².
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, spring, easeOutCubic } from '../../../shared/web/js/ease.js';
import { row, solutionIntro } from '../../../shared/web/js/parts.js';
import { svgLayer } from '../../../shared/web/js/cubes.js';
import { g, burst, thinkingDots, countdown, popLabel, bandWipe } from '../../../shared/web/js/fx.js';

// --- facts (story.md F1–F3, D1–D6) ---------------------------------------------------------------
const AREA = 120, AREA_NEW = 150, ADD = 5;
const RECT = AREA * 2, RECT_NEW = AREA_NEW * 2; // the rectangle round a rhombus has twice its area
const STRIP = RECT_NEW - RECT;
const KEEP = STRIP / ADD; // the kept diagonal
const OTHER = RECT / KEEP; // the other diagonal
console.assert(RECT === 240 && RECT_NEW === 300 && STRIP === 60, '120 × 2 = 240, 150 × 2 = 300, 300 − 240 = 60');
console.assert(KEEP === 12 && OTHER === 20, '60 : 5 = 12, 240 : 12 = 20');
console.assert(KEEP * OTHER / 2 === AREA && KEEP * (OTHER + ADD) / 2 === AREA_NEW, 'check: 12 × 20 : 2 = 120, 12 × 25 : 2 = 150');
console.assert((KEEP + 4) * OTHER / 2 === 160, 'challenge: 16 × 20 : 2 = 160 (not shown)');

// the problem as given (Sheet picture, transcribed in story.md), one entry per voice line
const QUESTION = [
  'Một hình thoi có diện tích là 120 cm².',
  'Nếu giữ nguyên một đường chéo và tăng đường chéo còn lại thêm 5 cm thì diện tích hình thoi mới là 150 cm².',
  'Tìm độ dài hai đường chéo ban đầu của hình thoi đó.',
];
export const TEXT = {
  question: QUESTION, intro: 'Sau đây là cách giải', title: 'Hình thoi = nửa hình chữ nhật',
  old: 'Cũ:', neu: 'Mới:', unit: 'cm²', cm: 'cm', ans: 'Hai đường chéo:', and: 'và',
  turn: 'Đến lượt bạn!', ask: 'Diện tích mới là bao nhiêu cm²?', cmt: 'Bình luận đáp án nhé!',
};

const PX = 30; // px per cm
const FILL = 'rgba(150, 205, 240, 0.22)';
const GOLD = 'rgba(250, 222, 110, 0.42)';
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}
const pts = (a) => a.map((q) => q.join(',')).join(' ');

// a rhombus with centre (cx, cy), diagonals w (across) and h (up) in px; diagonals dashed
function rhombus(L, svg, cx, cy, w, h, { t = 1, fill = FILL, diag = CHALK.white, diagV = diag, seed = 0 } = {}) {
  if (t <= 0) return;
  const P = [[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]];
  if (t > 0.5) svgEl('polygon', { points: pts(P), fill, 'fill-opacity': clamp01((t - 0.5) * 2) }, svg);
  L.poly([...P, P[0]], { width: 7, t: easeOutCubic(t), seed, amp: 1 });
  const dt = clamp01(t * 2 - 1);
  L.dashed([cx, cy - h / 2], [cx, cy + h / 2], { color: diagV, width: 5, t: dt });
  L.dashed([cx - w / 2, cy], [cx + w / 2, cy], { color: diag, width: 5, t: dt });
}

// --- beat 1: the problem, written as it is read, and the rhombus that grows -----------------------
const T = THEME.layout.title;
const Q = { x: 90, y: 300, w: 930, size: 72, lh: 104, gapK: 0.27 };
function wordColor(w) {
  const s = w.replace(/[,.]/g, '');
  if (s === '120') return CHALK.blue;
  if (s === '150') return CHALK.pink;
  if (s === '5') return CHALK.yellow;
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
const F1 = { cx: 540, cy: 1320, h: KEEP * PX };
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  for (const q of layoutQuestion()) {
    const t = clamp01(g(p, `q${q.si + 1}`) * q.n - q.wi);
    if (t > 0) L.text(q.w, q.x, q.y, { size: Q.size, color: wordColor(q.w), t: easeOutCubic(t) });
  }
  const svg = svgLayer(ctx.objects());
  const L2 = ctx.chalk(60);
  const gr = spring(g(p, 'grow'), 3, 6);
  const w = (OTHER + ADD * gr) * PX;
  const keep = g(p, 'keep');
  const ask = g(p, 'ask');
  rhombus(L2, svg, F1.cx, F1.cy, w, F1.h, { t: g(p, 'shape'), seed: 10, diagV: keep > 0 ? CHALK.yellow : CHALK.white });
  // the kept diagonal gets a yellow lock tick; the grown one gets "+5 cm"
  popLabel(L2, '+5 cm', F1.cx + w / 2 - 95, F1.cy - 82, g(p, 'grow'), { size: 50, color: CHALK.yellow });
  // area inside, 120 then 150
  const a150 = g(p, 'a150');
  const area = a150 > 0.5 ? AREA_NEW : AREA;
  popLabel(L2, `${area} cm²`, F1.cx, F1.cy + F1.h / 2 + 76, a150 > 0.5 ? a150 : g(p, 'a120'),
    { size: 52, color: a150 > 0.5 ? CHALK.pink : CHALK.blue, pulse: a150 > 0.5 ? (a150 - 0.5) * 2 : 0 });
  // what we look for: both diagonals, "?"
  popLabel(L2, '?', F1.cx + 34, F1.cy - F1.h / 2 + 70, ask, { size: 64, color: CHALK.yellow });
  popLabel(L2, '?', F1.cx - w / 4, F1.cy - 16, clamp01(ask * 1.4 - 0.4), { size: 64, color: CHALK.yellow });
  thinkingDots(L2, 540, F1.cy + F1.h / 2 + 150, g(p, 'dots'), { r: 14 });
}

// --- beat 2: the transition ----------------------------------------------------------------------
function beat2(ctx, p) {
  solutionIntro(ctx.chalk(60), TEXT.intro, g(p, 'phrase'), { x: 540, y: 860, size: 84 });
}

// --- beats 3–4: one board: the rectangle round the rhombus ---------------------------------------
const FIG = { l: 165, top: 400, h: KEEP * PX }; // the old rectangle is 600 x 360, the strip 150 wide
FIG.bot = FIG.top + FIG.h;
FIG.cy = FIG.top + FIG.h / 2;
FIG.mid = FIG.l + OTHER * PX;
const DIM_Y = FIG.bot + 46;
const ROWS = { r1: 960, r2: 1060, r3: 1160, r4: 1280, r5: 1385, ans: 1520 };
const RS = 60;

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

// a corner triangle of the rectangle folds over the rhombus edge onto the centre
function corners(svg, L, cx, w, u) {
  if (u <= 0) return;
  const cy = FIG.cy, h = FIG.h;
  const l = cx - w / 2, r = cx + w / 2;
  const O = [cx, cy];
  const C = [[l, FIG.top], [r, FIG.top], [r, FIG.bot], [l, FIG.bot]];
  const V = [[[l, cy], [cx, FIG.top]], [[cx, FIG.top], [r, cy]], [[r, cy], [cx, FIG.bot]], [[cx, FIG.bot], [l, cy]]];
  C.forEach((c, i) => {
    const e = easeOutCubic(u);
    // the tip travels on a small arc from the corner to the centre
    const lift = Math.sin(Math.PI * e) * 26;
    const nx = cx - c[0], ny = cy - c[1];
    const len = Math.hypot(nx, ny);
    const P = [c[0] + nx * e - (ny / len) * lift, c[1] + ny * e + (nx / len) * lift];
    svgEl('polygon', { points: pts([V[i][0], V[i][1], P]), fill: GOLD, stroke: CHALK.yellow, 'stroke-width': 3 }, svg);
  });
  void O; void h; void L;
}

function board(ctx, beat, p) {
  const S = stateOf(ORDER, beat, p);
  const k = (key) => (beat === 'beat4' ? g(p, key) : 0);
  const L = ctx.chalk(60);
  const tt = S('beat3', 'title');
  const tw = L.text(TEXT.title, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + tw, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });

  const svg = svgLayer(ctx.objects());
  const gr = spring(S('beat3', 'grow'), 3, 6);
  const wcm = OTHER + ADD * gr;
  const w = wcm * PX;
  const cx = FIG.l + w / 2;
  const right = FIG.l + w;
  // the strip that the rectangle gains (gold), pulses on beat 4
  if (gr > 0.02) {
    const pulse = 1 + 0.06 * Math.sin(Math.PI * clamp01(k('strip')));
    const sw = (right - FIG.mid) * pulse, sh = FIG.h * pulse;
    const sx = (FIG.mid + right) / 2 - sw / 2, sy = FIG.cy - sh / 2;
    svgEl('rect', { x: sx, y: sy, width: sw, height: sh, fill: GOLD, 'fill-opacity': clamp01(S('beat3', 'five') * 1.5) }, svg);
  }
  const Lf = ctx.chalk(60);
  // the rectangle round the rhombus
  const rc = S('beat3', 'rect');
  if (rc > 0) {
    const o = { color: CHALK.white, width: 4, t: easeOutCubic(rc) };
    Lf.dashed([FIG.l, FIG.top], [right, FIG.top], o);
    Lf.dashed([right, FIG.top], [right, FIG.bot], o);
    Lf.dashed([right, FIG.bot], [FIG.l, FIG.bot], o);
    Lf.dashed([FIG.l, FIG.bot], [FIG.l, FIG.top], o);
    if (gr > 0.02) Lf.dashed([FIG.mid, FIG.top], [FIG.mid, FIG.bot], { color: CHALK.yellow, width: 4 });
  }
  const dg = k('diag');
  rhombus(Lf, svg, cx, FIG.cy, w, FIG.h, { t: S('beat3', 'fig'), seed: 30, diagV: dg > 0 ? CHALK.yellow : CHALK.white });
  // fold the four corners in (the rhombus is exactly half), then back out
  const fold = S('beat3', 'fold') * (1 - S('beat3', 'unfold'));
  const svg2 = svgLayer(ctx.objects());
  corners(svg2, Lf, cx, w, fold);
  // area inside the rhombus
  const area = gr > 0.5 ? AREA_NEW : AREA;
  popLabel(Lf, `${area} cm²`, cx - w / 4 + 20, FIG.cy + 66, S('beat3', 'fig'), { size: 48, color: gr > 0.5 ? CHALK.pink : CHALK.blue, pulse: gr > 0.5 && gr < 1 ? 1 : 0 });
  // dimension line under the figure: ? / 20 cm for the old width, 5 cm for the strip
  const Ld = ctx.chalk(60);
  if (gr > 0.3) {
    Ld.line([FIG.l, DIM_Y], [FIG.mid - 6, DIM_Y], { width: 4, seed: 70 });
    Ld.line([FIG.mid + 6, DIM_Y], [right, DIM_Y], { width: 4, seed: 71, color: CHALK.yellow });
    const l20 = k('l20');
    popLabel(Ld, l20 > 0.4 ? `${OTHER} cm` : '?', (FIG.l + FIG.mid) / 2, DIM_Y + 54, l20 > 0.4 ? l20 : 1,
      { size: 50, color: l20 > 0.4 ? CHALK.yellow : CHALK.white });
    popLabel(Ld, `${ADD} cm`, (FIG.mid + right) / 2, DIM_Y + 54, S('beat3', 'five'), { size: 50, color: CHALK.yellow });
  }
  popLabel(Ld, `${STRIP}`, (FIG.mid + 915) / 2, FIG.cy + 112, S('beat3', 's60'), { size: 52, color: CHALK.yellow });
  popLabel(Ld, TEXT.unit, (FIG.mid + 915) / 2, FIG.cy + 158, S('beat3', 's60'), { size: 40, color: CHALK.yellow });
  // the strip's height = the kept diagonal: "?" then 12 cm, right of the figure
  const sd = k('side'), l12 = k('l12');
  if (sd > 0) {
    Ld.arrow([950, FIG.cy], [950, FIG.top + 4], { width: 4, t: sd, seed: 80, head: 18, color: CHALK.yellow });
    Ld.arrow([950, FIG.cy], [950, FIG.bot - 4], { width: 4, t: sd, seed: 81, head: 18, color: CHALK.yellow });
  }
  popLabel(Ld, l12 > 0.4 ? `${KEEP}` : '?', 995, FIG.cy + 18, l12 > 0.4 ? l12 : sd, { size: 54, color: CHALK.yellow });
  if (l12 > 0.4) popLabel(Ld, TEXT.cm, 995, FIG.cy + 64, l12, { size: 38, color: CHALK.yellow });

  // the working, row by row
  const Lr = ctx.chalk(60);
  const X = { s: '×' };
  void X;
  row(Lr, [TEXT.old, { s: String(AREA), color: CHALK.blue }, { sym: 'times' }, '2', '=', `${RECT} ${TEXT.unit}`], 540, ROWS.r1, { size: RS, t: S('beat3', 'r1'), seed: 100 });
  row(Lr, [TEXT.neu, { s: String(AREA_NEW), color: CHALK.pink }, { sym: 'times' }, '2', '=', `${RECT_NEW} ${TEXT.unit}`], 540, ROWS.r2, { size: RS, t: S('beat3', 'r2'), seed: 110 });
  row(Lr, [String(RECT_NEW), { sym: 'minus' }, String(RECT), '=', { s: `${STRIP} ${TEXT.unit}`, color: CHALK.yellow }], 540, ROWS.r3, { size: RS, t: S('beat3', 'r3'), seed: 120 });
  if (beat === 'beat4') {
    row(Lr, [String(STRIP), ':', String(ADD), '=', { s: `${KEEP} ${TEXT.cm}`, color: CHALK.yellow }], 540, ROWS.r4, { size: RS + 6, t: k('r4'), seed: 130 });
    row(Lr, [String(RECT), ':', String(KEEP), '=', { s: `${OTHER} ${TEXT.cm}`, color: CHALK.yellow }], 540, ROWS.r5, { size: RS + 6, t: k('r5'), seed: 140 });
    const xs = row(Lr, [TEXT.ans, { s: `${KEEP} cm`, color: CHALK.yellow }, TEXT.and, { s: `${OTHER} cm`, color: CHALK.yellow }], 540, ROWS.ans,
      { size: 56, t: k('ans'), seed: 150, gap: 0.45 });
    const lp = k('loop');
    Lr.loop(xs[1], ROWS.ans - 18, 84, 48, { color: CHALK.yellow, width: 7, t: easeOutCubic(clamp01(lp * 2)), seed: 160 });
    Lr.loop(xs[3], ROWS.ans - 18, 84, 48, { color: CHALK.yellow, width: 7, t: easeOutCubic(clamp01(lp * 2 - 1)), seed: 170 });
    burst(Lr, xs[3], ROWS.ans - 18, 92, clamp01(lp * 2 - 1.2), { seed: 180 });
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
  const gr = spring(g(p, 'grow'), 3, 6);
  const sc = 26;
  const h = (KEEP + 4 * gr) * sc, w = OTHER * sc;
  const cy = 660;
  rhombus(L, svg, 540, cy, w, h, { t: g(p, 'shape'), seed: 500, diagV: gr > 0 ? CHALK.yellow : CHALK.white });
  const sh = g(p, 'shape');
  popLabel(L, `${OTHER} cm`, 540, cy + h / 2 + 70, sh, { size: 54 });
  popLabel(L, `${KEEP} cm`, 215, cy - 50, clamp01(sh * 1.5 - 0.5), { size: 54 });
  L.arrow([285, cy - 62], [525, cy - 62], { width: 4, t: clamp01(sh * 1.5 - 0.5), seed: 510, head: 16 });
  popLabel(L, '+4 cm', 540 + 110, cy - h / 2 + 10, g(p, 'grow'), { size: 58, color: CHALK.yellow });
  row(L, [{ s: TEXT.ask, color: CHALK.yellow }], 540, 1060, { size: 64, t: g(p, 'ask'), seed: 620 });
  countdown(L, 540, 1310, g(p, 'count'), { size: 260 });
  row(L, [TEXT.cmt], 540, 1520, { size: 80, t: g(p, 'cmt'), seed: 650 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
