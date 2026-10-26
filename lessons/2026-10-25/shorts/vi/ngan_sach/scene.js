// Hai ngăn sách có 160 cuốn. Chuyển 15 cuốn từ ngăn 1 sang ngăn 2 thì ngăn 1 vẫn hơn ngăn 2 8 cuốn.
// Lúc đầu ngăn 1 có bao nhiêu cuốn? Moving books keeps the total, so after the move
// ngăn 1 = (160 + 8) : 2 = 84, and at first ngăn 1 = 84 + 15 = 99.
// Facts: lessons/ngan_sach/story.md. beatN(ctx, p): every key in p is a progress 0..1 from
// timing.json; a key the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../../../shared/web/js/chalk.js';
import { clamp01, spring, pop, stagger, rng } from '../../../../../shared/web/js/ease.js';
import { flight } from '../../../../../shared/web/js/parts.js';
import { svgLayer } from '../../../../../shared/web/js/cubes.js';
import { g, sparks, mark, thinkingDots, countdown, popLabel } from '../../../../../shared/web/js/fx.js';

// --- facts (story.md F1, D1–D5), checked ----------------------------------------------------
const TOTAL = 160; // F1
const MOVE = 15; // F1
const DIFF = 8; // F1: after the move, shelf 1 still has 8 more
const SUM_EQ = TOTAL + DIFF; // D2: add 8 to shelf 2, both shelves equal
const AFTER1 = SUM_EQ / 2; // D2: 84
const AFTER2 = AFTER1 - DIFF; // 76
const FIRST1 = AFTER1 + MOVE; // D3: 99
const FIRST2 = TOTAL - FIRST1; // D4: 61
console.assert(SUM_EQ === 168 && AFTER1 === 84 && AFTER2 === 76 && AFTER1 + AFTER2 === TOTAL, 'after the move');
console.assert(FIRST1 === 99 && FIRST2 === 61 && FIRST1 + FIRST2 === TOTAL, 'at first');
console.assert(FIRST1 - MOVE === AFTER1 && FIRST2 + MOVE === AFTER2 && AFTER1 - AFTER2 === DIFF, 'check'); // D4
const CH = { total: 120, move: 10, diff: 6 }; // D5: challenge (answer not shown)
const CH1 = (CH.total + CH.diff) / 2 + CH.move; // 73
console.assert(CH1 === 73 && CH.total - CH1 === 47 && (CH1 - CH.move) - (CH.total - CH1 + CH.move) === CH.diff,
  'challenge: shelf 1 had 73');

const str = String;
const CX = 552;
const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

// --- the bookcase: one drawn book per real book, 8 px per book --------------------------------
const U = 8; // px per book
const X0 = 150; // left end of each row of books
const S = [720, 1060]; // shelf 1, shelf 2: top of the plank the books stand on
const CASE = { l: 116, r: 986, top: 450 };
const WOODC = { plank: 'rgb(176, 124, 70)', edge: 'rgb(110, 70, 34)', side: 'rgb(150, 104, 58)' };
const SPINES = ['rgb(200, 76, 66)', 'rgb(70, 124, 196)', 'rgb(232, 182, 72)', 'rgb(96, 166, 112)',
  'rgb(222, 212, 190)', 'rgb(156, 96, 160)', 'rgb(232, 128, 72)'];
const bx = (i) => X0 + i * U; // left edge of the i-th book in a row

function bookLook(id) {
  const r = rng(id * 7 + 3);
  r();
  return { h: 168 + Math.floor(r() * 36), c: SPINES[Math.floor(r() * SPINES.length)], band: 0.18 + r() * 0.2 };
}

// one book standing on y = base with its left edge at x; sy grows it up from the shelf
function book(svg, x, base, id, { sy = 1, sx = 1 } = {}) {
  if (sy <= 0) return;
  const b = bookLook(id);
  const gr = el('g', { transform: `translate(${x + U / 2},${base}) scale(${sx},${sy})` }, svg);
  el('rect', { x: -U / 2 + 0.5, y: -b.h, width: U - 1, height: b.h, fill: b.c, stroke: 'rgba(0,0,0,0.35)', 'stroke-width': 0.8 }, gr);
  el('rect', { x: -U / 2 + 0.5, y: -b.h * (1 - b.band), width: U - 1, height: 6, fill: 'rgba(255,255,255,0.45)' }, gr);
}

function frame(svg, u) {
  if (u <= 0) return;
  const k = pop(u);
  const gr = el('g', { transform: `translate(${CX},${S[1] + 22}) scale(${k.scale / Math.sqrt(k.squash)},${k.scale * k.squash}) translate(${-CX},${-(S[1] + 22)})` }, svg);
  const plank = (y) => el('rect', { x: CASE.l, y, width: CASE.r - CASE.l, height: 22, rx: 3, fill: WOODC.plank, stroke: WOODC.edge, 'stroke-width': 3 }, gr);
  el('rect', { x: CASE.l, y: CASE.top, width: 16, height: S[1] + 22 - CASE.top, fill: WOODC.side, stroke: WOODC.edge, 'stroke-width': 3 }, gr);
  el('rect', { x: CASE.r - 16, y: CASE.top, width: 16, height: S[1] + 22 - CASE.top, fill: WOODC.side, stroke: WOODC.edge, 'stroke-width': 3 }, gr);
  plank(CASE.top - 22);
  plank(S[0]);
  plank(S[1]);
}

// a row of n books (ids id0..) on shelf s, growing in left to right with u
function row(svg, s, n, id0, u, from = 0) {
  for (let i = from; i < n; i++) {
    const k = pop(stagger(u, i - from, Math.max(1, n - from), 0.35));
    book(svg, bx(i), S[s], id0 + i, { sy: k.scale, sx: 1 / Math.sqrt(k.squash) });
  }
}

// The whole case. Before the move: shelf 1 holds a books, shelf 2 holds b. The bundle is the last
// k books of shelf 1; mv (0..1) carries it to the end of shelf 2 (rev: from shelf 2 back to shelf 1).
function bookcase(svg, { a, b, k, mv = 0, rev = false, grow = 1, frameT = 1 }) {
  frame(svg, frameT);
  row(svg, 0, a - k, 0, grow);
  row(svg, 1, b, 1000, grow);
  const from = [bx(a - k) + (k * U) / 2, S[0]];
  const to = [bx(b) + (k * U) / 2, S[1]];
  const f = mv <= 0 ? { x: (rev ? to : from)[0], y: (rev ? to : from)[1], squash: 1 }
    : mv >= 1 ? { x: (rev ? from : to)[0], y: (rev ? from : to)[1], squash: 1 }
      : rev ? flight(to, from, mv, 150) : flight(from, to, mv, 150);
  const gk = pop(clamp01(grow * 1.4 - 0.4));
  if (gk.scale <= 0) return f;
  const gr = el('g', { transform: `translate(${f.x},${f.y}) scale(${1 / Math.sqrt(f.squash)},${f.squash})` }, svg);
  for (let i = 0; i < k; i++) book(gr, (i - k / 2) * U, 0, a - k + i, { sy: gk.scale });
  return f;
}

// --- chalk helpers -----------------------------------------------------------------------------
// an equation row: parts are strings, {s, color, size, t} or {sym: 'minus'}
function eq(L, parts, x0, y, { size = 110, t = 1, gap: gk = 0.22 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const widths = items.map((q) => (q.sym ? size * 0.42 : measure(q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = x0 - total / 2;
  const xs = [];
  items.forEach((q, i) => {
    xs.push(x + widths[i] / 2);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    if (ti > 0 && q.sym === 'minus') {
      L.line([x + widths[i] * 0.1, y - size * 0.32], [x + widths[i] * 0.9, y - size * 0.32],
        { color: q.color, width: size * 0.075, t: ti, seed: 30 + i });
    } else if (ti > 0) L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    x += widths[i] + gap;
  });
  return xs;
}
const MINUS = { sym: 'minus' };

const title = (L, s, t, { size = 104, color = CHALK.yellow } = {}) =>
  L.text(s, CX, 300, { size, align: 'center', color, t });

// "Ngăn 1" / "Ngăn 2" with the count after it, above each row of books
function labels(L, counts, t) {
  if (t <= 0) return;
  [0, 1].forEach((s) => {
    const y = S[s] - 226;
    L.text(`Ngăn ${s + 1}:`, X0, y, { size: 72, color: CHALK.mint, t });
    const c = counts[s];
    if (c !== null) L.text(str(c), X0 + 245, y, { size: 84, color: c === '?' ? CHALK.yellow : CHALK.white, t });
  });
}

// shelf 1's extra books after the move: a dashed line where shelf 2 ends, "hơn 8" over the extra
function diffMark(L, n2, extra, t, { label = `hơn ${extra}` } = {}) {
  if (t <= 0) return;
  const x = bx(n2);
  L.dashed([x, S[0] - 205], [x, S[1] + 40], { color: CHALK.yellow, width: 5, t });
  const x1 = bx(n2 + extra);
  // shelf 1's extra books boxed in yellow, "hơn 8" right above them
  L.rect(x + 2, S[0] - 214, x1 + 4, S[0] + 6, { color: CHALK.yellow, width: 6, t, seed: 61 });
  popLabel(L, label, (x + x1) / 2 + 30, S[0] - 228, clamp01(t * 1.5 - 0.3), { size: 80, color: CHALK.yellow });
}

// the ± tags beside a move (−15 where the bundle left, +15 where it landed)
function moveTags(L, a, b, k, t, rev = false) {
  if (t <= 0) return;
  const x1 = bx(a - k) + (k * U) / 2;
  const x2 = bx(b + k) + 70;
  popLabel(L, rev ? `+${k}` : `−${k}`, x1 + 10, rev ? S[0] - 220 : S[0] - 60, t, { size: 76, color: rev ? CHALK.yellow : CHALK.pink });
  if (!rev) popLabel(L, `+${k}`, x2, S[1] - 60, t, { size: 76, color: CHALK.yellow });
}

// --- the problem board (beat 1, and the challenge in beat 5) ---------------------------------
function problemBoard(ctx, p, { heading, total, move, diff, challenge = false }) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const first1 = (total + diff) / 2 + move;
  const first2 = total - first1;
  title(L, heading, g(p, 'title'), { size: 108 });
  const books = g(p, 'books');
  const mv = g(p, 'move');
  bookcase(svg, { a: first1, b: first2, k: move, mv, grow: books, frameT: clamp01(books * 3) });
  labels(L, ['?', '?'], clamp01(books * 2));
  moveTags(L, first1, first2, move, clamp01(mv * 1.6 - 0.6));
  diffMark(L, first2 + move, diff, g(p, 'diff'));
  L.text(`Tổng: ${total} cuốn`, CX, 1165, { size: 88, align: 'center', t: g(p, 'total') });
  L.text(`Sau khi chuyển ${move}: ngăn 1 hơn ${diff}`, CX, 1265, { size: 72, align: 'center', color: CHALK.yellow, t: g(p, 'diff') });
  if (!challenge) {
    L.text('Lúc đầu', CX, 1380, { size: 88, align: 'center', color: CHALK.mint, t: g(p, 'ask') });
    eq(L, ['ngăn 1 có', { s: '?', color: CHALK.yellow }, 'cuốn'], CX, 1495, { size: 108, t: g(p, 'ask') });
    const d = g(p, 'dots');
    thinkingDots(L, CX, 1590, d < 1 ? d : 0, { r: 16, gap: 80 });
  } else {
    L.text('Lúc đầu', CX, 1370, { size: 84, align: 'center', color: CHALK.mint, t: g(p, 'ask') });
    eq(L, ['ngăn 1 có', { s: '?', color: CHALK.yellow }, 'cuốn'], CX, 1480, { size: 104, t: g(p, 'ask') });
    L.text('Bình luận đáp án nhé!', CX, 1580, { size: 84, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
    const k = g(p, 'count');
    countdown(L, 900, 1360, k < 1 ? k : 0, { size: 170 });
  }
}
const beat1 = (ctx, p) => problemBoard(ctx, p, { heading: 'Hai ngăn sách', total: TOTAL, move: MOVE, diff: DIFF });
const beat5 = (ctx, p) => problemBoard(ctx, p, { heading: 'Đến lượt bạn!', ...CH, challenge: true });

// --- beat 2: after the move the total is still 160; add 8 to shelf 2 and both are equal ---------
function beat2(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  title(L, 'Sau khi chuyển', setup, { size: 96 });
  bookcase(svg, { a: FIRST1, b: FIRST2, k: MOVE, mv: 1, grow: setup });
  const n1 = g(p, 'n1');
  labels(L, [n1 > 0.5 ? AFTER1 : '?', '?'], setup);
  diffMark(L, AFTER2, DIFF, setup);
  L.text(`Tổng vẫn ${TOTAL} cuốn`, CX, 1165, { size: 88, align: 'center', t: g(p, 'total') });
  // 8 dashed "ghost" books top up shelf 2 to the line
  const gh = g(p, 'ghost');
  if (gh > 0) {
    for (let i = 0; i < DIFF; i++) {
      const k = pop(stagger(gh, i, DIFF, 0.5));
      if (k.scale <= 0) continue;
      const h = 185 * k.scale;
      el('rect', { x: bx(AFTER2 + i) + 0.5, y: S[1] - h, width: U - 1, height: h, fill: 'rgba(250, 222, 110, 0.55)' }, svg);
      L.rect(bx(AFTER2 + i) + 1, S[1] - h, bx(AFTER2 + i + 1) - 1, S[1], { color: CHALK.yellow, width: 2.5, seed: 70 + i });
    }
    popLabel(L, `+${DIFF}`, bx(AFTER2 + DIFF) + 60, S[1] - 50, clamp01(gh * 1.4 - 0.4), { size: 80, color: CHALK.yellow });
  }
  const eqT = g(p, 'equal');
  if (eqT > 0 && g(p, 'e1') <= 0) sparks(L, bx(AFTER1) + 20, S[1] - 220, 30, 70, eqT, { seed: 21 });
  L.text(`Thêm ${DIFF}: hai ngăn bằng nhau`, CX, 1265, { size: 76, color: CHALK.yellow, align: 'center', t: eqT });
  eq(L, [str(TOTAL), '+', { s: str(DIFF), color: CHALK.yellow }, '=', str(SUM_EQ)], CX, 1395, { size: 108, t: g(p, 'e1') });
  const xs = eq(L, [str(SUM_EQ), ':', '2', '=', { s: str(AFTER1), color: CHALK.yellow }], CX, 1530, { size: 108, t: g(p, 'e2') });
  L.loop(xs[4], 1495, 72, 68, { color: CHALK.yellow, width: 7, t: n1, seed: 41 });
}

// --- beat 3: put the 15 books back: 84 + 15 = 99 --------------------------------------------------
function beat3(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  const back = g(p, 'back');
  const ans = g(p, 'ans');
  title(L, 'Lúc đầu', setup, { size: 96 });
  bookcase(svg, { a: FIRST1, b: FIRST2, k: MOVE, mv: back, rev: true, grow: setup });
  labels(L, [g(p, 'e1') >= 1 ? FIRST1 : AFTER1, '?'], setup);
  // the 15 books that were moved, circled on shelf 2 before they go back
  const hl = g(p, 'hl');
  if (hl > 0 && back < 0.15) {
    L.rect(bx(FIRST2) - 6, S[1] - 214, bx(FIRST2 + MOVE) + 6, S[1] + 8, { color: CHALK.yellow, width: 6, t: hl, seed: 81 });
    popLabel(L, `${MOVE}`, bx(FIRST2 + MOVE) + 60, S[1] - 90, hl, { size: 72, color: CHALK.yellow });
  }
  moveTags(L, FIRST1, FIRST2, MOVE, clamp01(back * 1.6 - 0.6), true);
  const xs = eq(L, [str(AFTER1), '+', { s: str(MOVE), color: CHALK.yellow }, '=', { s: str(FIRST1), color: CHALK.yellow, size: 140 }],
    CX, 1330, { size: 116, t: g(p, 'e1') });
  L.loop(xs[4], 1282, 86, 82, { color: CHALK.yellow, width: 8, t: g(p, 'loop'), seed: 43 });
  L.text('Lúc đầu', CX, 1480, { size: 88, color: CHALK.mint, align: 'center', t: ans });
  L.text(`ngăn 1 có ${FIRST1} cuốn`, CX, 1600, { size: 104, color: CHALK.yellow, align: 'center', t: ans });
  const sp = g(p, 'spark');
  if (sp > 0) sparks(L, xs[4], 1282, 100, 140, sp, { seed: 45 });
}

// --- beat 4: check: 160 − 99 = 61; move 15 → 84 and 76, 84 − 76 = 8 ✓ ------------------------------
function beat4(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  const c1 = g(p, 'c1');
  const mv = g(p, 'move');
  title(L, 'Thử lại', setup, { size: 96 });
  bookcase(svg, { a: FIRST1, b: FIRST2, k: MOVE, mv, grow: setup });
  const done = mv >= 1;
  labels(L, done ? [AFTER1, AFTER2] : [FIRST1, c1 >= 1 ? FIRST2 : '?'], setup);
  moveTags(L, FIRST1, FIRST2, MOVE, clamp01(mv * 1.6 - 0.6));
  diffMark(L, AFTER2, DIFF, g(p, 'c2'));
  eq(L, [str(TOTAL), MINUS, str(FIRST1), '=', { s: str(FIRST2), color: CHALK.yellow }], CX, 1320, { size: 108, t: c1 });
  eq(L, [str(AFTER1), MINUS, str(AFTER2), '=', { s: str(DIFF), color: CHALK.yellow }], CX - 40, 1460, { size: 108, t: g(p, 'c2') });
  mark(L, true, 890, 1422, g(p, 'ok'), { size: 80, seed: 51 });
  const ok = g(p, 'ok');
  if (ok > 0) L.text('Đúng rồi!', CX, 1600, { size: 100, color: CHALK.green, align: 'center', t: ok });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
