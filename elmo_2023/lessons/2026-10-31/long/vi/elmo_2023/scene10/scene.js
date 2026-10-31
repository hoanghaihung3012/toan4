// Câu 50. Lan bắn ba mũi tên đều trúng bia (5, 3, 1 điểm): có bao nhiêu tổng điểm khác nhau. Có màn kết.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, numTile, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene9/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const RED = CHALK.red;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const SCORES = [1, 3, 5];
const COMBOS = [];
for (let i = 0; i < SCORES.length; i++) {
  for (let j = i; j < SCORES.length; j++) {
    for (let k = j; k < SCORES.length; k++) COMBOS.push([SCORES[i], SCORES[j], SCORES[k]]);
  }
}
COMBOS.sort((x, y) => sum(x) - sum(y));
function sum(c) { return c.reduce((s, n) => s + n, 0); }
const SEEN = new Set();
const DUP = COMBOS.map((c) => {
  const again = SEEN.has(sum(c));
  SEEN.add(sum(c));
  return again;
});
const DISTINCT = [...SEEN];
const OPTIONS = [5, 6, 7, 8];
const ANSWER = 'ABCD'[OPTIONS.indexOf(DISTINCT.length)];

console.assert(COMBOS.length === 10, 'Câu 50: 10 cách chọn 3 mũi tên từ 1, 3, 5');
console.assert(COMBOS.map(sum).join() === '3,5,7,7,9,9,11,11,13,15', 'Câu 50: các tổng');
console.assert(DISTINCT.join() === '3,5,7,9,11,13,15' && DISTINCT.length === 7, 'Câu 50: 7 giá trị khác nhau');
console.assert(ANSWER === 'C' && DUP.filter(Boolean).length === 3, 'Câu 50: đáp án C, 3 tổng lặp');

// --- bia ----------------------------------------------------------------------------------------
const T = { cx: 620, cy: 640, r: [62, 125, 190] };
function target(L, t) {
  const k = clamp01(t);
  if (k <= 0) return;
  T.r.forEach((r, i) => L.loop(T.cx, T.cy, r, r, { width: 5, t: clamp01(k * 2 - i * 0.3), seed: 5 + i }));
  const lab = clamp01(k * 2 - 1);
  L.text('5', T.cx, T.cy + 18, { size: 54, align: 'center', t: lab });
  L.text('3', T.cx + 94, T.cy + 16, { size: 46, align: 'center', t: lab });
  L.text('1', T.cx + 158, T.cy + 16, { size: 46, align: 'center', t: lab });
  L.line([T.cx, T.cy + 190], [T.cx, T.cy + 270], { width: 7, t: clamp01(k * 3 - 2), seed: 20 });
  L.line([T.cx - 70, T.cy + 270], [T.cx + 70, T.cy + 270], { width: 7, t: clamp01(k * 3 - 2.3), seed: 21 });
}

const OPT_X = 1230;
const optY = (i) => 480 + i * 100;

// hai cột, mỗi cột 5 cách
const COL_X = [520, 1290];
const rowY = (i) => 290 + (i % 5) * 100;
const colOf = (i) => Math.floor(i / 5);

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('50. Ba mũi tên', 960, 130, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Lan bắn ba mũi tên và tất cả đều trúng bia dưới đây.', 960, 235, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('Hỏi tổng điểm của bạn ấy có thể có bao nhiêu giá trị khác nhau?', 960, 310,
      { size: 50, align: 'center', t: g(p, 'q2') });
    target(L, g(p, 'target'));
    OPTIONS.forEach((n, i) => {
      const u = stagger(g(p, 'opts'), i, OPTIONS.length, 0.4);
      L.text(`${'ABCD'[i]}.`, OPT_X, optY(i), { size: 60, color: YELLOW, t: clamp01(u * 2) });
      L.text(String(n), OPT_X + 90, optY(i), { size: 60, t: u });
    });
    thinkingDots(L, 960, 990, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // liệt kê 10 cách, bỏ tổng lặp, còn 7 giá trị
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Mỗi mũi tên được 1, 3 hoặc 5 điểm', 960, 200, { size: 54, align: 'center', color: YELLOW, t: g(p, 'head') });
    COMBOS.forEach((c, i) => {
      const u = stagger(g(p, 'rows'), i, COMBOS.length, 0.25);
      const color = DUP[i] ? RED : YELLOW;
      const parts = [String(c[0]), '+', String(c[1]), '+', String(c[2]), '=', { s: String(sum(c)), color }];
      row(L, parts, COL_X[colOf(i)], rowY(i), { size: 52, t: u, seed: 3 + i });
      if (DUP[i]) {
        const d = g(p, 'dups');
        L.text('lặp', COL_X[colOf(i)] + 250, rowY(i) - 4, { size: 36, color: RED, t: d });
      }
    });
    DISTINCT.forEach((v, i) => {
      const u = pop(stagger(g(p, 'tiles'), i, DISTINCT.length, 0.4));
      const s = String(v);
      numTile(objs, 960 + (i - 3) * 150, 850, s, 'dec', { scale: 0.85 * u.scale, squash: u.squash, digits: s.length });
    });
    L.text(`${DISTINCT.length} giá trị`, 1660, 870, { size: 56, color: YELLOW, t: g(p, 'count') });
    const xs = row(L, [{ s: 'Đáp án:', color: YELLOW }, { s: ANSWER, color: YELLOW }], 960, 1010,
      { size: 84, t: g(p, 'answer'), gap: 0.4, seed: 9 });
    L.loop(xs[1] + 4, 1010 - 28, 52, 60, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[1] + 4, 1010 - 28, 80, g(p, 'burst'), { n: 10, seed: 70 });
  },

  outro(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Cảm ơn các bạn đã xem video!', 960, 340, { size: 76, align: 'center', color: YELLOW, t: g(p, 'thanks') });
    L.text('Học cùng Phượng', 960, 500, { size: 94, align: 'center', t: g(p, 'subscribe') });
    L.text('Hãy đăng ký kênh Học cùng Phượng', 960, 650, { size: 64, align: 'center', t: g(p, 'subscribe') });
    L.text('để đón xem những video tiếp theo.', 960, 750, { size: 60, align: 'center', t: g(p, 'subscribe') });
  },
};
