// Xếp 7 quả táo giống nhau vào 3 rổ khác nhau (rổ có thể trống): count by basket A,
// 1 + 2 + … + 8 = 36. Facts: lessons/xep_tao_vao_ro/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { clamp01, easeOutCubic, spring, pop, stagger } from '../../shared/web/js/ease.js';
import { flight } from '../../shared/web/js/parts.js';
import { svgLayer } from '../../shared/web/js/cubes.js';
import { g, sparks, mark, outScale, thinkingDots, numTile, arc, countdown, popLabel } from '../../shared/web/js/fx.js';

// --- facts (story.md F1, D1–D4), checked ----------------------------------------------------
const N = 7; // F1: apples
const BASKETS = 3; // F1
const ways = (n) => { // brute force: every (a, b, c) with a + b + c = n
  let k = 0;
  for (let a = 0; a <= n; a++) for (let b = 0; b <= n - a; b++) k++;
  return k;
};
const ROWS = Array.from({ length: N + 1 }, (_, i) => N - i); // A = 7, 6, …, 0
const COUNTS = ROWS.map((a) => N - a + 1); // D2: 1, 2, …, 8
const TOTAL = COUNTS.reduce((s, c) => s + c, 0); // D3
const PAIRS = [[1, 8], [2, 7], [3, 6], [4, 5]];
console.assert(TOTAL === 36 && ways(N) === TOTAL, 'total 36');
console.assert(PAIRS.every(([a, b]) => a + b === 9) && 9 * PAIRS.length === TOTAL, 'pairs of 9');
const EX1 = [2, 4, 1];
const EX2 = [0, 7, 0];
console.assert([EX1, EX2].every((e) => e.reduce((s, c) => s + c, 0) === N), 'examples sum to 7'); // D1
const CHAL = 5; // D4 (answer not shown)
console.assert(ways(CHAL) === 21, 'challenge 21');
void BASKETS;

// every word on the board; read at render time so a language variant can override it
// (lessons/xep_tao_vao_ro_en/scene.js)
export const TEXT = {
  title: 'Xếp táo vào rổ',
  canBeEmpty: 'Rổ có thể trống',
  ask: 'Bao nhiêu cách?',
  note: '3 số, tổng = 7',
  byA: 'Đếm theo rổ A',
  bTakes: 'Rổ B lấy:',
  ways: 'cách',
  cRest: 'C lấy phần còn lại',
  addUp: 'Cộng lại',
  so: 'Có',
  yourTurn: 'Đến lượt bạn!',
  comment: 'Bình luận đáp án nhé!',
};

const str = String;
const CX = 552;
const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

// --- props drawn in code: apple and basket ---------------------------------------------------
const APPLE_R = 30;
function apple(svg, x, y, { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const gr = el('g', { transform: `translate(${x},${y}) scale(${scale / Math.sqrt(squash)},${scale * squash})` }, svg);
  el('ellipse', { cx: 0, cy: APPLE_R * 0.9, rx: APPLE_R * 0.8, ry: 6, fill: 'rgba(0,0,0,0.22)' }, gr);
  el('path', { d: `M0,${-APPLE_R * 0.72} C${APPLE_R * 0.5},${-APPLE_R * 1.15} ${APPLE_R * 1.25},${-APPLE_R * 0.6} ${APPLE_R * 1.05},${APPLE_R * 0.15}`
    + ` C${APPLE_R * 0.9},${APPLE_R * 0.85} ${APPLE_R * 0.35},${APPLE_R * 1.05} 0,${APPLE_R * 0.85}`
    + ` C${-APPLE_R * 0.35},${APPLE_R * 1.05} ${-APPLE_R * 0.9},${APPLE_R * 0.85} ${-APPLE_R * 1.05},${APPLE_R * 0.15}`
    + ` C${-APPLE_R * 1.25},${-APPLE_R * 0.6} ${-APPLE_R * 0.5},${-APPLE_R * 1.15} 0,${-APPLE_R * 0.72} Z`,
  fill: 'rgb(214, 58, 52)', stroke: 'rgb(120, 24, 22)', 'stroke-width': 3 }, gr);
  el('ellipse', { cx: -APPLE_R * 0.42, cy: -APPLE_R * 0.25, rx: APPLE_R * 0.18, ry: APPLE_R * 0.3, fill: 'rgba(255,255,255,0.45)' }, gr);
  el('path', { d: `M0,${-APPLE_R * 0.7} Q2,${-APPLE_R * 1.05} 6,${-APPLE_R * 1.25}`, stroke: 'rgb(96, 64, 30)', 'stroke-width': 5,
    fill: 'none', 'stroke-linecap': 'round' }, gr);
  el('path', { d: `M5,${-APPLE_R * 1.0} q16,-16 32,-6 q-14,14 -32,6 Z`, fill: 'rgb(110, 176, 84)', stroke: 'rgb(50, 100, 40)', 'stroke-width': 2 }, gr);
}

const BW = 230; // basket top width
const BH = 120;
function basket(svg, x, rimY, letter, { scale = 1, squash = 1 } = {}) {
  if (scale <= 0) return;
  const gr = el('g', { transform: `translate(${x},${rimY + BH}) scale(${scale / Math.sqrt(squash)},${scale * squash}) translate(0,${-BH})` }, svg);
  const w = BW / 2;
  const b = w * 0.74;
  el('ellipse', { cx: 0, cy: BH + 8, rx: b + 20, ry: 10, fill: 'rgba(0,0,0,0.25)' }, gr);
  el('path', { d: `M${-w},0 L${w},0 L${b},${BH} L${-b},${BH} Z`, fill: 'rgb(186, 128, 66)', stroke: 'rgb(96, 60, 26)', 'stroke-width': 4 }, gr);
  for (let i = 1; i < 4; i++) { // weave
    const y = (BH * i) / 4;
    const ww = w - (w - b) * (y / BH);
    el('line', { x1: -ww + 6, y1: y, x2: ww - 6, y2: y, stroke: 'rgb(140, 90, 42)', 'stroke-width': 3 }, gr);
  }
  el('rect', { x: -w - 8, y: -10, width: 2 * w + 16, height: 20, rx: 10, fill: 'rgb(150, 98, 46)', stroke: 'rgb(96, 60, 26)', 'stroke-width': 4 }, gr);
  const t = el('text', { x: 0, y: BH * 0.72, 'text-anchor': 'middle', 'font-family': 'Baloo 2', 'font-weight': 760,
    'font-size': 64, fill: 'rgb(70, 44, 22)' }, gr);
  t.textContent = letter;
}

// apple slots in a basket (rim at y): bottom row half hidden by the basket front
const SLOTS = [[-66, -20], [0, -20], [66, -20], [-33, -78], [33, -78], [-99, -78], [0, -134]];
const slot = (bx, rimY, i) => [bx + SLOTS[i][0], rimY + SLOTS[i][1]];

// --- an equation row (strings, {s, color, t, size, pad}, {sym}) -------------------------------
function eq(L, parts, x0, y, { size = 120, t = 1, align = 'center', gap: gk = 0.22 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const widths = items.map((q) => (q.sym ? size * 0.42 : measure(q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1) + items.reduce((a, q) => a + (q.pad || 0), 0);
  let x = align === 'center' ? x0 - total / 2 : x0;
  const cy = y - size * 0.32;
  const xs = [];
  items.forEach((q, i) => {
    const w = widths[i];
    xs.push(x + w / 2);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    if (ti > 0 && q.sym === 'times') {
      const c = x + w / 2;
      const r = size * 0.16;
      const o = { color: q.color, width: size * 0.075, seed: 30 + i };
      L.line([c - r, cy - r], [c + r, cy + r], { ...o, t: clamp01(ti * 2) });
      L.line([c + r, cy - r], [c - r, cy + r], { ...o, t: clamp01(ti * 2 - 1) });
    } else if (ti > 0) {
      L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    }
    x += w + gap + (q.pad || 0);
  });
  return xs;
}

const title = (L, s, y, t, { size = 104, color = CHALK.white } = {}) =>
  L.text(s, CX, y, { size, align: 'center', color, t });

// --- the problem board (beat 1, and the challenge in beat 5) ---------------------------------
const BX = [262, 552, 842];
function problemBoard(ctx, p, n, { heading, challenge = false }) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const L = ctx.chalk(60);
  title(L, heading, 270, g(p, 'title'), { size: 112, color: CHALK.yellow });
  const ap = g(p, 'apples');
  const step = 126;
  for (let i = 0; i < n; i++) {
    const k = pop(stagger(ap, i, n, 0.4));
    apple(svg, CX + (i - (n - 1) / 2) * step, 560, { scale: 1.55 * k.scale, squash: k.squash });
  }
  const bk = g(p, 'baskets');
  ['A', 'B', 'C'].forEach((c, i) => {
    const k = pop(stagger(bk, i, 3, 0.5));
    basket(svg, BX[i], 820, c, { scale: k.scale, squash: k.squash });
  });
  if (!challenge) {
    L.text(TEXT.canBeEmpty, CX, 1180, { size: 100, color: CHALK.pink, align: 'center', t: g(p, 'r2') });
    L.text(TEXT.ask, CX, 1370, { size: 120, color: CHALK.white, align: 'center', t: g(p, 'ask') });
    const d = g(p, 'dots');
    thinkingDots(L, CX, 1500, d < 1 ? d : 0, { r: 16, gap: 80 });
  } else {
    const xs = eq(L, [{ s: '   ' }, TEXT.ways], CX, 1150, { size: 130, t: g(p, 'ask') });
    const q = g(p, 'ask');
    if (q > 0) L.text('?', xs[0], 1155, { size: 160, color: CHALK.yellow, align: 'center', scale: spring(q, 3, 6) });
    L.text(TEXT.comment, CX, 1320, { size: 84, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
    const c = g(p, 'count');
    countdown(L, CX, 1430, c < 1 ? c : 0, { size: 220 });
  }
}
const beat1 = (ctx, p) => problemBoard(ctx, p, N, { heading: TEXT.title });
const beat5 = (ctx, p) => problemBoard(ctx, p, CHAL, { heading: TEXT.yourTurn, challenge: true });

// --- beat 2: two example arrangements ----------------------------------------------------------
const RIM2 = 760;
// basket index and slot for apple i in an arrangement [a, b, c]
function places(arr) {
  const out = [];
  arr.forEach((n, b) => { for (let s = 0; s < n; s++) out.push([b, s]); });
  return out;
}
const P1 = places(EX1); // apples 0,1 -> A; 2..5 -> B; 6 -> C
const P2 = places(EX2);

function beat2(ctx, p) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const front = svgLayer(ctx.objects()); // baskets over the apples' bottoms
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  const fly = [g(p, 'fA'), g(p, 'fB'), g(p, 'fC')];
  const m2 = g(p, 'move2');
  const row = (i) => [CX + (i - (N - 1) / 2) * 126, 400];
  const counts = [0, 0, 0];
  for (let i = 0; i < N; i++) {
    const [b1, s1] = P1[i];
    const [b2, s2] = P2[i];
    const n1 = EX1[b1];
    const u1 = stagger(fly[b1], s1, n1, n1 > 1 ? 0.55 : 1);
    const u2 = stagger(m2, i, N, 0.45);
    const a = row(i);
    const b = slot(BX[b1], RIM2, s1);
    const c = slot(BX[b2], RIM2, s2);
    let pos;
    if (u2 > 0) pos = flight(b, c, u2, 160);
    else if (u1 > 0) pos = flight(a, b, u1, 140);
    else pos = { x: a[0], y: a[1], squash: 1 };
    const k = pop(stagger(setup, i, N, 0.4));
    apple(svg, pos.x, pos.y, { scale: 1.3 * k.scale, squash: pos.squash * k.squash });
    counts[u2 >= 0.75 ? b2 : u1 >= 0.75 ? b1 : -1] += 1;
  }
  ['A', 'B', 'C'].forEach((c, i) => {
    const k = pop(clamp01(setup * 1.4 - i * 0.2));
    basket(front, BX[i], RIM2, c, { scale: k.scale, squash: k.squash });
    // live count under each basket, from the moment the first apple flies
    if (fly[0] > 0) {
      const n = counts[i] || 0;
      L.text(str(n), BX[i], RIM2 + BH + 110, { size: 104, align: 'center', color: n ? CHALK.yellow : CHALK.white });
    }
  });
  eq(L, [str(EX1[0]), '+', str(EX1[1]), '+', str(EX1[2]), '=', { s: str(N), color: CHALK.yellow }], CX - 40, 1170, { size: 120, t: g(p, 'e1') });
  mark(L, true, 905, 1130, g(p, 'ok1'), { size: 70, seed: 41 });
  eq(L, [str(EX2[0]), '+', str(EX2[1]), '+', str(EX2[2]), '=', { s: str(N), color: CHALK.yellow }], CX - 40, 1340, { size: 120, t: g(p, 'e2') });
  mark(L, true, 905, 1300, g(p, 'ok2'), { size: 70, seed: 51 });
  L.text(TEXT.note, CX, 1520, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'note') });
}

// --- beat 3: count by basket A — a staircase of B's choices ------------------------------------
const R3 = { y0: 530, dy: 150, lx: 236, tx: 330, step: 78, scale: 0.88, cx: 1012 };
function beat3(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, TEXT.byA, 250, g(p, 'title'), { size: 104, color: CHALK.yellow });
  const hd = g(p, 'head');
  L.text(TEXT.bTakes, R3.tx - 40, 400, { size: 84, color: CHALK.mint, t: hd });
  L.text(TEXT.ways, R3.cx, 400, { size: 72, color: CHALK.yellow, align: 'center', t: hd });
  // row progress: rows 0..2 have their own windows, rows 3..6 share "mid", row 7 its own
  const mid = g(p, 'mid');
  const prog = (r) => (r <= 2 ? g(p, `r${r}`) : r === 7 ? g(p, 'r7') : stagger(mid, r - 3, 4, 0.55));
  ROWS.forEach((a, r) => {
    const y = R3.y0 + r * R3.dy;
    const u = prog(r);
    if (u <= 0) return;
    L.text(`A = ${a}`, R3.lx, y + 28, { size: 88, align: 'right', t: clamp01(u * 3) });
    // the row builds in the first 60% of its window, so no half-built row is left on screen
    const n = COUNTS[r];
    const build = clamp01((u - 0.1) / 0.5);
    for (let j = 0; j < n; j++) {
      const k = pop(stagger(build, j, n, n > 1 ? 0.5 : 1));
      numTile(objs, R3.tx + j * R3.step, y, str(j), 'dec', { scale: R3.scale * k.scale, squash: k.squash });
    }
    // the number of ways, in yellow, in the "cách" column once the row is built
    const c = clamp01((u - 0.6) / 0.25);
    popLabel(L, str(n), R3.cx, y + 30, c, { size: 92, color: CHALK.yellow, pulse: clamp01((u - 0.8) / 0.2) });
  });
  // C takes whatever is left: said with the first row
  L.text(TEXT.cRest, CX, 1790, { size: 92, color: CHALK.pink, align: 'center', t: clamp01((g(p, 'r0') - 0.5) * 2) });
}

// --- beat 4: add the steps by pairing ------------------------------------------------------------
const PAIR_COLORS = [CHALK.yellow, CHALK.pink, CHALK.mint, CHALK.green];
function beat4(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, TEXT.addUp, 250, g(p, 'title'), { size: 104, color: CHALK.yellow });
  const parts = [];
  // each number takes its pair's colour once the pair's arc has landed on it
  const pairOf = (i) => PAIRS.findIndex(([a, b]) => a === i || b === i);
  for (let i = 1; i <= N + 1; i++) {
    if (i > 1) parts.push('+');
    const k = pairOf(i);
    const on = clamp01((g(p, `p${k + 1}`) - 0.8) / 0.2);
    parts.push(on > 0 ? { s: str(i), color: PAIR_COLORS[k], scale: 1 + 0.25 * Math.sin(Math.PI * on) } : str(i));
  }
  const y = 720;
  const xs = eq(L, parts, CX, y, { size: 92, t: g(p, 'sum'), gap: 0.18 });
  const top = y - 78;
  PAIRS.forEach(([a, b], k) => {
    const lift = 70 + 50 * (3 - k);
    arc(L, [xs[(a - 1) * 2], top], [xs[(b - 1) * 2], top], lift, g(p, `p${k + 1}`),
      { color: PAIR_COLORS[k], width: 11, head: 0, seed: 60 + k });
  });
  // one "9" per pair, in the pair's colour
  const nt = g(p, 'nines');
  const nines = [];
  PAIRS.forEach((_, k) => { if (k) nines.push({ s: '+', t: clamp01(nt * 4 - k) }); nines.push({ s: '9', color: PAIR_COLORS[k], t: clamp01(nt * 4 - k) }); });
  eq(L, nines, CX, 960, { size: 120 });
  eq(L, ['9', { sym: 'times' }, '4', '=', { s: str(TOTAL), color: CHALK.yellow }], CX, 1160, { size: 140, t: g(p, 'mul') });
  const xa = eq(L, [TEXT.so, { s: str(TOTAL), color: CHALK.yellow, size: 170, pad: 40 }, TEXT.ways], CX + 20, 1430, { size: 130, t: g(p, 'ans'), gap: 0.5 });
  L.loop(xa[1], 1375, 105, 100, { color: CHALK.yellow, width: 8, t: g(p, 'loop'), seed: 71 });
  const sp = g(p, 'spark');
  if (sp > 0) sparks(L, xa[1], 1375, 125, 170, sp, { seed: 75 });
  void objs; void outScale; void easeOutCubic;
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
