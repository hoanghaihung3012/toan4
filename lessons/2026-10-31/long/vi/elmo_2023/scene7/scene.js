// Câu 47. Hình tam giác chia đáy bởi 3 đường từ đỉnh: tổng số hình tam giác.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene6/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const POINTS = 5; // 5 điểm trên đáy: 2 góc và 3 chân đường từ đỉnh
const SEGMENTS = POINTS - 1; // 4 đoạn đáy nhỏ
// tam giác nào cũng có đỉnh trên cùng và một đoạn đáy nối hai điểm j, j + k
const BY_SIZE = [];
for (let k = 1; k <= SEGMENTS; k++) {
  const list = [];
  for (let j = 0; j + k < POINTS; j++) list.push([j, j + k]);
  BY_SIZE.push(list);
}
const COUNTS = BY_SIZE.map((l) => l.length);
const TOTAL = COUNTS.reduce((s, n) => s + n, 0);
console.assert(COUNTS.join() === '4,3,2,1', 'Câu 47: 4, 3, 2, 1 tam giác');
console.assert(TOTAL === 10 && TOTAL === (POINTS * (POINTS - 1)) / 2, 'Câu 47: tổng 10 = số cặp điểm trên đáy');

// --- hình tam giác: đỉnh (cx, top), đáy rộng 2 * half ở độ cao h ----------------------------------
function shade(L, pts, color, alpha) {
  if (alpha <= 0) return;
  const e = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  e.setAttribute('points', pts.map((q) => q.join(',')).join(' '));
  e.setAttribute('fill', color);
  e.setAttribute('fill-opacity', String(alpha));
  L.g.appendChild(e);
}

function figure(L, cx, top, half, h, t, seed, width = 5, hot = null, hotT = 0) {
  const base = top + h;
  const xs = Array.from({ length: POINTS }, (_, i) => cx - half + (2 * half * i) / SEGMENTS);
  if (hot && hotT > 0) {
    const pts = [[cx, top], [xs[hot[0]], base], [xs[hot[1]], base]];
    shade(L, pts, YELLOW, 0.55 * clamp01(hotT));
  }
  const k = clamp01(t);
  L.line([xs[0], base], [xs[4], base], { width, t: clamp01(k * 2), seed });
  xs.forEach((x, i) => L.line([cx, top], [x, base], { width: i === 0 || i === 4 ? width : width * 0.75, t: clamp01(k * 2 - 0.3 - i * 0.1), seed: seed + 1 + i }));
}

const ROW_TOP = [300, 440, 580, 720];

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('47. Đếm hình tam giác', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Tổng số hình tam giác có thể tìm thấy', 960, 245, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('trong hình dưới đây là bao nhiêu?', 960, 320, { size: 50, align: 'center', t: g(p, 'q2') });
    figure(L, 960, 420, 400, 400, g(p, 'figure'), 5, 6);
    thinkingDots(L, 960, 940, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // mỗi tam giác ứng với một cặp điểm trên đáy: 4 + 3 + 2 + 1 = 10
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Mỗi tam giác có đỉnh trên cùng và một đoạn ở đáy', 960, 215, { size: 50, align: 'center', color: YELLOW, t: g(p, 'head') });
    BY_SIZE.forEach((list, r) => {
      const u = g(p, `r${r + 1}`);
      const n = list.length;
      L.text(`${r + 1} đoạn`, 90, ROW_TOP[r] + 70, { size: 46, t: clamp01(u * 4) });
      list.forEach((pair, i) => {
        const cx = 640 + (i - (n - 1) / 2) * 210;
        const v = stagger(u, i, n, 0.5);
        figure(L, cx, ROW_TOP[r], 80, 100, clamp01(v * 2), 20 + r * 10 + i, 3, pair, clamp01(v * 2 - 1));
      });
      L.text(`${n} hình`, 1180, ROW_TOP[r] + 70, { size: 56, color: YELLOW, t: clamp01(u * 2 - 1) });
    });
    const xs = row(L, ['4', '+', '3', '+', '2', '+', '1', '=', { s: String(TOTAL), color: YELLOW }], 960, 940,
      { size: 80, t: g(p, 'sum'), gap: 0.3, seed: 9 });
    L.loop(xs[8], 940 - 28, 62, 62, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[8], 940 - 28, 90, g(p, 'burst'), { n: 10, seed: 70 });
  },
};
