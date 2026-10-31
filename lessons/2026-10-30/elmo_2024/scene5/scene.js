// Câu 45. Hình chữ nhật chia 3 ô bằng 2 đường thẳng đứng, thêm một đường chéo từ giữa cạnh trái tới góc dưới phải. Đếm hình tứ giác.
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark, popLabel } from '../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene4/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const RED = CHALK.red;

// --- dữ kiện: mọi hình trên bảng đều tính từ đây -------------------------------------------
// Toạ độ x = 0..3 (3 ô), y = 0..1 (từ đáy lên đỉnh). Đường chéo đi từ (0, 1/2) tới (3, 0).
const COLS = 3;
const diag = (x) => 0.5 - x / 6;
const RUNS = [[0, 0], [1, 1], [2, 2], [0, 1], [1, 2], [0, 2]]; // các ô liền nhau từ cột i tới cột j

const polyOf = (kind, [i, j]) => {
  if (kind === 'rect') return [[i, 0], [j + 1, 0], [j + 1, 1], [i, 1]];
  if (kind === 'above') return [[i, diag(i)], [i, 1], [j + 1, 1], [j + 1, diag(j + 1)]];
  return [[i, 0], [i, diag(i)], [j + 1, diag(j + 1)], [j + 1, 0]];
};
const corners = (pts) => new Set(pts.map((q) => q.join(','))).size;

const GROUPS = ['rect', 'above', 'below'].map((kind) => ({
  kind,
  items: RUNS.map((run) => ({ pts: polyOf(kind, run) })).map((q) => ({ ...q, quad: corners(q.pts) === 4 }))
    .sort((a, b) => Number(b.quad) - Number(a.quad)),
}));
const GOOD = GROUPS.map((gr) => gr.items.filter((q) => q.quad));
const COUNTS = GOOD.map((a) => a.length);
const TOTAL = COUNTS.reduce((s, v) => s + v, 0);

console.assert(COUNTS.join() === '6,6,3' && TOTAL === 15, 'Câu 45: 6 + 6 + 3 = 15 hình tứ giác');
console.assert(GROUPS[2].items.filter((q) => !q.quad).length === 3, 'Câu 45: 3 phần dưới đường chéo là tam giác');
console.assert(new Set(GOOD.flat().map((q) => JSON.stringify(q.pts))).size === TOTAL, 'Câu 45: 15 hình đều khác nhau');

// --- hình vẽ phấn --------------------------------------------------------------------------
// ox, by: góc dưới trái; u: bề rộng một ô; h: chiều cao
function figure(L, ox, by, u, h, t, width, seed) {
  const k = clamp01(t);
  if (k <= 0) return;
  const X = (x) => ox + x * u;
  const Y = (y) => by - y * h;
  L.rect(X(0), Y(1), X(COLS), Y(0), { width, t: clamp01(k * 2), seed });
  [1, 2].forEach((x) => L.line([X(x), Y(1)], [X(x), Y(0)], { width, t: clamp01(k * 2 - 0.5), seed: seed + x }));
  L.line([X(0), Y(0.5)], [X(COLS), Y(0)], { width, t: clamp01(k * 2 - 1), seed: seed + 3 });
}

function outline(L, ox, by, u, h, pts, color, t, width, seed) {
  if (t <= 0) return;
  const q = pts.map(([x, y]) => [ox + x * u, by - y * h]);
  const uniq = q.filter((p, i) => q.findIndex((r) => r[0] === p[0] && r[1] === p[1]) === i);
  L.poly([...uniq, uniq[0]], { color, width, t: clamp01(t), seed, amp: 1 });
}

// bố cục lời giải: ba hàng, mỗi hàng 6 hình nhỏ
const MINI_U = 76;
const MINI_H = 76;
const miniX = (i) => 960 + (i - 2.5) * 270 - (COLS * MINI_U) / 2;
const ROW_Y = [330, 560, 790];
const LABEL = ['Hình chữ nhật', 'Phần trên đường chéo', 'Phần dưới đường chéo'];

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('45. Đếm hình tứ giác', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Tổng số hình tứ giác bạn có thể tìm thấy trong hình dưới đây là bao nhiêu?', 960, 260,
      { size: 46, align: 'center', t: g(p, 'q') });
    figure(L, 600, 740, 240, 280, g(p, 'fig'), 8, 10);
    thinkingDots(L, 960, 900, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // ba nhóm: hình chữ nhật 6, phần trên đường chéo 6, phần dưới đường chéo 3
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Đếm theo ba nhóm', 960, 150, { size: 64, align: 'center', t: g(p, 'heading') });
    GROUPS.forEach((gr, r) => {
      const prog = g(p, `r${r + 1}`);
      const y = ROW_Y[r];
      L.text(LABEL[r], 120, y - 75, { size: 46, t: clamp01(prog * 4) });
      gr.items.forEach((q, i) => {
        const u = stagger(prog, i, gr.items.length, 0.35);
        const ox = miniX(i);
        const by = y + MINI_H / 2;
        figure(L, ox, by, MINI_U, MINI_H, u, 3, 20 + r * 10 + i);
        if (q.quad) {
          outline(L, ox, by, MINI_U, MINI_H, q.pts, YELLOW, clamp01(u * 2 - 0.4), 7, 60 + i);
        } else {
          const c = clamp01((g(p, 'cross') - i * 0.15) / 0.5);
          outline(L, ox, by, MINI_U, MINI_H, q.pts, RED, clamp01(u * 2 - 0.4), 7, 80 + i);
          mark(L, false, ox + (COLS * MINI_U) / 2, y, c, { size: 44, seed: 90 + i });
        }
      });
      popLabel(L, String(COUNTS[r]), 1810, y + 25, g(p, `c${r + 1}`), { size: 80 });
    });
    const xs = row(L, [
      { s: String(COUNTS[0]), color: YELLOW }, { s: '+', color: YELLOW }, { s: String(COUNTS[1]), color: YELLOW },
      { s: '+', color: YELLOW }, { s: String(COUNTS[2]), color: YELLOW }, { s: '=', color: YELLOW },
      { s: String(TOTAL), color: YELLOW },
    ], 960, 985, { size: 80, t: g(p, 'answer'), gap: 0.45, seed: 9 });
    L.loop(xs[6] + 6, 985 - 26, 66, 58, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
