// Câu 46. Hai số có tổng 14 và tích 48: hiệu của chúng là bao nhiêu.
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark } from '../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene5/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const SUM = 14;
const PRODUCT = 48;
const PAIRS = [];
for (let a = 1; a * a <= PRODUCT; a++) if (PRODUCT % a === 0) PAIRS.push([a, PRODUCT / a]);
const FOUND = PAIRS.filter(([a, b]) => a + b === SUM);
const [SMALL, BIG] = FOUND[0];

console.assert(PAIRS.map((q) => q.join('x')).join() === '1x48,2x24,3x16,4x12,6x8', 'Câu 46: 5 cặp có tích 48');
console.assert(PAIRS.map(([a, b]) => a + b).join() === '49,26,19,16,14', 'Câu 46: tổng từng cặp');
console.assert(FOUND.length === 1 && SMALL === 6 && BIG === 8 && BIG - SMALL === 2, 'Câu 46: cặp 6 và 8, hiệu 2');

// --- hình vẽ phấn: ô vuông □ và tam giác △ ------------------------------------------------
function square(L, x, y, s, t) {
  L.rect(x - s, y - s, x + s, y + s, { width: 6, t, seed: 3 });
}
function triangle(L, x, y, s, t) {
  L.poly([[x, y - s], [x + s * 1.05, y + s * 0.8], [x - s * 1.05, y + s * 0.8], [x, y - s]], { width: 6, t, seed: 4 });
}
function times(L, x, y, r, t) {
  L.line([x - r, y - r], [x + r, y + r], { width: 6, t: clamp01(t * 2), seed: 5 });
  L.line([x + r, y - r], [x - r, y + r], { width: 6, t: clamp01(t * 2 - 1), seed: 6 });
}
// □ ? △ = n, đọc từ trái sang phải
function equation(L, y, op, n, t) {
  const k = (i) => clamp01(t * 5 - i);
  square(L, 740, y - 26, 30, k(0));
  if (op === '+') L.text('+', 860, y, { size: 80, align: 'center', t: k(1) });
  else times(L, 860, y - 26, 24, k(1));
  triangle(L, 980, y - 28, 32, k(2));
  L.text('=', 1100, y, { size: 80, align: 'center', t: k(3) });
  L.text(String(n), 1230, y, { size: 80, align: 'center', t: k(4) });
}

const ROW_Y = [300, 420, 540, 660, 780];
const LEFT_X = 640;
const RIGHT_X = 1330;

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('46. Tổng và tích', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Cho hai số có tổng là 14 và tích là 48.', 960, 270, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('Hỏi hiệu số giữa hai số này là bao nhiêu?', 960, 350, { size: 50, align: 'center', t: g(p, 'q2') });
    equation(L, 560, '+', SUM, g(p, 'sum'));
    equation(L, 720, 'x', PRODUCT, g(p, 'prod'));
    thinkingDots(L, 960, 900, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // liệt kê các cặp có tích 48, tính tổng, chọn cặp có tổng 14
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Tích bằng 48', LEFT_X, 205, { size: 46, align: 'center', color: YELLOW, t: g(p, 'heading') });
    L.text('Tổng', RIGHT_X, 205, { size: 46, align: 'center', color: YELLOW, t: g(p, 'sums') });
    PAIRS.forEach(([a, b], i) => {
      const y = ROW_Y[i];
      const good = a + b === SUM;
      const color = good ? YELLOW : undefined;
      const pu = stagger(g(p, 'pairs'), i, PAIRS.length, 0.4);
      const su = stagger(g(p, 'sums'), i, PAIRS.length, 0.4);
      row(L, [String(a), { sym: 'times' }, String(b), '=', String(PRODUCT)], LEFT_X, y, { size: 66, t: pu, seed: i });
      row(L, [String(a), '+', String(b), '=', { s: String(a + b), color }], RIGHT_X, y,
        { size: 66, t: su, seed: 10 + i });
      if (good) {
        mark(L, true, 1700, y - 22, g(p, 'pick'), { size: 70, seed: 40 });
        L.loop(1010, y - 22, 750, 56, { color: YELLOW, width: 6, t: g(p, 'pick'), seed: 20 });
      } else {
        mark(L, false, 1700, y - 22, clamp01((su - 0.8) / 0.2), { size: 56, seed: 30 + i });
      }
    });
    const xs = row(L, [
      { s: String(BIG), color: YELLOW }, { sym: 'minus', color: YELLOW }, { s: String(SMALL), color: YELLOW },
      { s: '=', color: YELLOW }, { s: String(BIG - SMALL), color: YELLOW },
    ], 960, 960, { size: 90, t: g(p, 'answer'), gap: 0.5, seed: 9 });
    L.loop(xs[4] + 6, 960 - 30, 56, 62, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
