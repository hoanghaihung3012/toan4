// Câu 39. Hình ví dụ biến đổi bằng "xoay rồi lật" (lời giải được cung cấp); đáp án C theo đáp án chính thức khối 4.
// Các hình là bản vẽ lại đơn giản hóa trong khung 0..1 (không phải sao chép đề gốc).
// Phép biến đổi: xoay 90° theo chiều kim đồng hồ, rồi lật qua trục ngang.
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01 } from '../../../../shared/web/js/ease.js';
import { g, arc, mark, popLabel, thinkingDots } from '../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene8/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- phép biến đổi trên khung đơn vị (x sang phải, y xuống dưới) ----------------------------
const rotate = ([x, y]) => [1 - y, x];
const reflect = ([x, y]) => [x, 1 - y];
const mapShapes = (shapes, f) => shapes.map((s) => s.map(f));
const rotated = (shapes) => mapShapes(shapes, rotate);
const transformed = (shapes) => mapShapes(rotated(shapes), reflect);

const circle = (cx, cy, r, n = 28) => Array.from({ length: n + 1 }, (_, i) => [
  cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);

// ví dụ: hình xoắn ốc vuông
const SPIRAL = [[[0.12, 0.88], [0.12, 0.12], [0.88, 0.12], [0.88, 0.88], [0.32, 0.88], [0.32, 0.32],
  [0.68, 0.32], [0.68, 0.68], [0.5, 0.68], [0.5, 0.5]]];
// nhóm C: mũi tên hướng lên có chân gấp
const ARROW = [[[0.4, 0.1], [0.72, 0.4], [0.56, 0.4], [0.56, 0.68], [0.86, 0.68], [0.86, 0.9],
  [0.26, 0.9], [0.26, 0.4], [0.1, 0.4], [0.4, 0.1]]];

// nhóm B: vòng tròn có cán và thanh ngang (cán lên, rồi cán sang phải)
const B_LEFT = [circle(0.5, 0.68, 0.22), [[0.5, 0.46], [0.5, 0.12]], [[0.36, 0.2], [0.64, 0.2]]];
const B_RIGHT = [circle(0.3, 0.5, 0.22), [[0.52, 0.5], [0.88, 0.5]], [[0.8, 0.36], [0.8, 0.64]]];
const TWO = [[[0.22, 0.32], [0.36, 0.14], [0.64, 0.14], [0.78, 0.32], [0.2, 0.88], [0.84, 0.88]]];

const FIGURES = {
  example: [SPIRAL, transformed(SPIRAL)],
  A: [[[[0.12, 0.88], [0.12, 0.12], [0.5, 0.6], [0.88, 0.12], [0.88, 0.88]]],
    [[[0.12, 0.12], [0.88, 0.12], [0.4, 0.5], [0.88, 0.88], [0.12, 0.88]]]],
  B: [B_LEFT, B_RIGHT],
  C: [ARROW, transformed(ARROW)],
  D: [TWO, rotated(TWO)],
};

console.assert(JSON.stringify(transformed(ARROW)[0][0].map((v) => +v.toFixed(2))) === JSON.stringify([0.9, 0.6]),
  'Câu 39: đầu mũi tên hướng lên phải thành mũi tên hướng sang phải sau khi xoay rồi lật');
console.assert(FIGURES.C[1][0][0][0] > 0.8, 'Câu 39: mũi tên nhóm C hướng sang phải');
const ANSWER = 'C'; // đáp án chính thức khối 4, câu 39

// --- vẽ một hình trong khung ------------------------------------------------------------------
function figure(L, shapes, x0, y0, s, { t = 1, color, seed = 0, frameT = t } = {}) {
  L.rect(x0, y0, x0 + s, y0 + s, { width: 4, t: frameT, seed });
  shapes.forEach((pts, i) => {
    L.poly(pts.map(([x, y]) => [x0 + x * s, y0 + y * s]),
      { color, width: Math.max(4, s * 0.026), t: clamp01((t - 0.15) / 0.85), seed: seed + i + 3 });
  });
}

const OPTIONS = ['A', 'B', 'C', 'D'];
const optX = (i) => 190 + i * 400;

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('39. Quy luật biến đổi hình', 960, 110, { size: 64, align: 'center', t: g(p, 'title') });
    L.text('Nhóm hình nào dưới đây tuân theo quy luật biến đổi', 960, 185,
      { size: 44, align: 'center', t: g(p, 'question1') });
    L.text('giống như hình ví dụ?', 960, 240, { size: 44, align: 'center', t: g(p, 'question2') });
    const ex = g(p, 'example');
    L.text('Ví dụ', 960, 305, { size: 36, align: 'center', color: YELLOW, t: ex });
    figure(L, FIGURES.example[0], 770, 330, 190, { t: ex, seed: 10 });
    figure(L, FIGURES.example[1], 960, 330, 190, { t: ex, seed: 14 });
    OPTIONS.forEach((name, i) => {
      const u = clamp01(g(p, 'options') * 4 - i);
      figure(L, FIGURES[name][0], optX(i), 600, 170, { t: u, seed: 20 + i * 6 });
      figure(L, FIGURES[name][1], optX(i) + 170, 600, 170, { t: u, seed: 23 + i * 6 });
      L.text(name, optX(i) + 170, 830, { size: 52, align: 'center', t: u });
    });
    thinkingDots(L, 960, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // hình ví dụ biến đổi qua hai bước
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Hình ví dụ biến đổi thế nào?', 960, 130, { size: 60, align: 'center', t: g(p, 'heading') });
    const s = 300;
    const y0 = 300;
    const xs = [230, 810, 1390];
    figure(L, SPIRAL, xs[0], y0, s, { t: g(p, 'first'), seed: 40 });
    const rot = g(p, 'rot');
    figure(L, rotated(SPIRAL), xs[1], y0, s, { t: rot, seed: 44 });
    arc(L, [xs[0] + s + 20, y0 + 40], [xs[1] - 20, y0 + 40], 55, clamp01(rot * 1.6), { width: 7, seed: 48 });
    L.text('Xoay', (xs[0] + s + xs[1]) / 2, y0 - 40, { size: 56, align: 'center', color: YELLOW, t: rot });
    const refl = g(p, 'refl');
    figure(L, transformed(SPIRAL), xs[2], y0, s, { t: refl, seed: 52 });
    arc(L, [xs[1] + s + 20, y0 + 40], [xs[2] - 20, y0 + 40], 55, clamp01(refl * 1.6), { width: 7, seed: 56 });
    L.text('Lật', (xs[1] + s + xs[2]) / 2, y0 - 40, { size: 56, align: 'center', color: YELLOW, t: refl });
    L.dashed([xs[1] - 30, y0 + s / 2], [xs[1] + s + 30, y0 + s / 2], { color: YELLOW, width: 4, t: refl });
    L.text('Xoay rồi lật', 960, 860, { size: 92, align: 'center', color: YELLOW, t: g(p, 'rule') });
  },

  // áp dụng cho nhóm C
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Áp dụng cho nhóm C', 960, 130, { size: 60, align: 'center', t: g(p, 'heading') });
    const s = 250;
    const y0 = 280;
    const xs = [130, 580, 1030, 1560];
    figure(L, FIGURES.C[0], xs[0], y0, s, { t: g(p, 'left'), seed: 60 });
    const rot = g(p, 'rot');
    figure(L, rotated(ARROW), xs[1], y0, s, { t: rot, seed: 64 });
    arc(L, [xs[0] + s + 15, y0 + 30], [xs[1] - 15, y0 + 30], 50, clamp01(rot * 1.6), { width: 7, seed: 68 });
    L.text('Xoay', (xs[0] + s + xs[1]) / 2, y0 - 35, { size: 50, align: 'center', color: YELLOW, t: rot });
    const refl = g(p, 'refl');
    figure(L, transformed(ARROW), xs[2], y0, s, { t: refl, color: YELLOW, seed: 72 });
    arc(L, [xs[1] + s + 15, y0 + 30], [xs[2] - 15, y0 + 30], 50, clamp01(refl * 1.6), { width: 7, seed: 76 });
    L.text('Lật', (xs[1] + s + xs[2]) / 2, y0 - 35, { size: 50, align: 'center', color: YELLOW, t: refl });
    const same = g(p, 'same');
    L.text('=', (xs[2] + s + xs[3]) / 2, y0 + s / 2 + 18, { size: 80, align: 'center', color: YELLOW, t: same });
    figure(L, FIGURES.C[1], xs[3], y0, s, { t: same, seed: 80 });
    L.text('Hình bên phải của nhóm C', xs[3] + s / 2, y0 + s + 60, { size: 34, align: 'center', t: same });
    mark(L, true, xs[3] + s / 2, y0 + s + 150, g(p, 'tick'), { size: 76, seed: 90 });
    popLabel(L, `Đáp án: ${ANSWER}`, 960, 930, g(p, 'answer'), { size: 100, color: YELLOW });
  },
};
