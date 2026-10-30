// Câu 47. Hai vòng tròn không nằm kề nhau trong ô sáu ngăn (ô bốn ngăn có 3 trường hợp).
import { CHALK, measure } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, popLabel } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene6/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
// Một trường hợp là cặp ngăn (i, j), i < j, không kề nhau (j - i >= 2).
const cases = (n) => {
  const out = [];
  for (let i = 1; i <= n; i++) for (let j = i + 2; j <= n; j++) out.push([i, j]);
  return out;
};
const FOUR = cases(4);
const SIX = cases(6);
const FIRSTS = [1, 2, 3, 4];
const BY_FIRST = FIRSTS.map((i) => SIX.filter((q) => q[0] === i));
const COUNTS = BY_FIRST.map((a) => a.length);

console.assert(FOUR.map((q) => q.join('-')).join() === '1-3,1-4,2-4', 'Câu 47: 3 hình minh họa của ô bốn ngăn');
console.assert(COUNTS.join() === '4,3,2,1' && SIX.length === 10, 'Câu 47: 4 + 3 + 2 + 1 = 10');
console.assert(SIX.length === (6 * 5) / 2 - 5, 'Câu 47: kiểm chéo 15 - 5 = 10');
console.assert(!SIX.some((q) => q[0] > 4), 'Câu 47: ngăn 5, 6 không còn chỗ');

// --- ô nhiều ngăn và vòng tròn ---------------------------------------------------------------
function box(L, left, top, n, cell, t, seed) {
  const k = clamp01(t);
  if (k <= 0) return;
  L.rect(left, top, left + n * cell, top + cell, { width: 5, t: clamp01(k * 2), seed });
  for (let i = 1; i < n; i++) {
    L.line([left + i * cell, top], [left + i * cell, top + cell], { width: 4, t: clamp01(k * 2 - 0.4), seed: seed + i });
  }
}
function ring(L, left, top, cell, slot, color, t, seed) {
  if (t <= 0) return;
  const r = cell * 0.34;
  L.loop(left + (slot - 0.5) * cell, top + cell / 2, r, r, { color, width: 5, t: clamp01(t), seed });
}
// ô n ngăn chứa hai vòng tròn ở ngăn i và j
function filled(L, left, top, n, cell, pair, t, seed, firstColor = CHALK.white) {
  box(L, left, top, n, cell, t, seed);
  ring(L, left, top, cell, pair[0], firstColor, clamp01(t * 2 - 1), seed + 20);
  ring(L, left, top, cell, pair[1], CHALK.white, clamp01(t * 2 - 1.2), seed + 30);
}

// dòng chữ có một vòng tròn vẽ xen vào giữa
function mixed(L, y, before, after, t) {
  const size = 44;
  const w = measure(before, size);
  const total = w + 70 + measure(after, size);
  const x0 = 960 - total / 2;
  L.text(before, x0, y, { size, t: clamp01(t * 1.2) });
  L.loop(x0 + w + 32, y - 14, 17, 17, { width: 5, t: clamp01(t * 3 - 1.3), seed: 8 });
  if (after) L.text(after, x0 + w + 70, y, { size, t: clamp01(t * 1.2 - 0.2) });
}

const ROW_Y = [290, 460, 630, 800];
const CELL = 50;
const BOX_LEFT = (k) => 380 + k * 330;

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('47. Hai vòng tròn không kề nhau', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    mixed(L, 260, 'Các hình sau đây minh họa cho tất cả các trường hợp mà trong đó hai', '', g(p, 'q1'));
    L.text('được sắp xếp không nằm kề nhau trong một ô bốn ngăn.', 960, 335,
      { size: 44, align: 'center', t: g(p, 'q2') });
    mixed(L, 410, 'Tìm số lượng tất cả các trường hợp mà trong đó hai', 'được sắp xếp', g(p, 'q3'));
    L.text('không nằm kề nhau trong một ô sáu ngăn.', 960, 485, { size: 44, align: 'center', t: g(p, 'q4') });
    FOUR.forEach((pair, i) => {
      const u = stagger(g(p, 'examples'), i, FOUR.length, 0.5);
      filled(L, 960 + (i - 1) * 420 - 140, 650, 4, 70, pair, u, 40 + i * 5);
    });
    thinkingDots(L, 960, 930, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // đếm theo ngăn của vòng tròn thứ nhất: 4 + 3 + 2 + 1 = 10
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Ô sáu ngăn', 960, 150, { size: 64, align: 'center', t: g(p, 'heading') });
    BY_FIRST.forEach((list, r) => {
      const prog = g(p, `r${r + 1}`);
      const y = ROW_Y[r];
      L.text(`ngăn ${FIRSTS[r]}`, 110, y + 18, { size: 46, color: YELLOW, t: clamp01(prog * 5) });
      list.forEach((pair, k) => {
        const u = stagger(prog, k, list.length, 0.5);
        filled(L, BOX_LEFT(k), y - CELL / 2, 6, CELL, pair, u, 10 + r * 20 + k * 4, YELLOW);
      });
      popLabel(L, String(COUNTS[r]), 1800, y + 28, g(p, `c${r + 1}`), { size: 84 });
    });
    L.text('ngăn 5 và ngăn 6: không còn chỗ', 960, 905, { size: 44, align: 'center', color: CHALK.red, t: g(p, 'none') });
    const xs = row(L, [
      { s: String(COUNTS[0]), color: YELLOW }, { s: '+', color: YELLOW }, { s: String(COUNTS[1]), color: YELLOW },
      { s: '+', color: YELLOW }, { s: String(COUNTS[2]), color: YELLOW }, { s: '+', color: YELLOW },
      { s: String(COUNTS[3]), color: YELLOW }, { s: '=', color: YELLOW }, { s: String(SIX.length), color: YELLOW },
    ], 960, 1010, { size: 80, t: g(p, 'answer'), gap: 0.5, seed: 9 });
    L.loop(xs[8] + 8, 1010 - 28, 72, 58, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
