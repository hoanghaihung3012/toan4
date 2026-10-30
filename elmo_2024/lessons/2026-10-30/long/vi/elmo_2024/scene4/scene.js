// Câu 44. Hình n gồm n × n viên đá: mỗi hình thêm một lớp chữ L, lớp lẻ đen, lớp chẵn trắng. Hình 6: trắng hơn đen bao nhiêu?
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene3/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const BLACK = 'rgb(16,20,18)';

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
// Hình n là khối n × n; ô (r, c) tính từ góc dưới trái thuộc lớp max(r, c) + 1; lớp lẻ đen, lớp chẵn trắng.
const layerOf = (r, c) => Math.max(r, c) + 1;
const isBlack = (layer) => layer % 2 === 1;
const cellsOf = (n) => {
  const out = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out.push({ r, c, layer: layerOf(r, c) });
  return out;
};
const count = (n, black) => cellsOf(n).filter((q) => isBlack(q.layer) === black).length;
const LAYER_SIZE = (k) => 2 * k - 1;
const N = 6;
const LAYERS = [...Array(N).keys()].map((i) => i + 1);
const BLACK_LAYERS = LAYERS.filter(isBlack);
const WHITE_LAYERS = LAYERS.filter((k) => !isBlack(k));
const BLACK_SIZES = BLACK_LAYERS.map(LAYER_SIZE);
const WHITE_SIZES = WHITE_LAYERS.map(LAYER_SIZE);
const SUM = (a) => a.reduce((s, v) => s + v, 0);

console.assert([1, 2, 3, 4].every((n) => [[1, 0], [1, 3], [6, 3], [6, 10]][n - 1].join() === [count(n, true), count(n, false)].join()),
  'Câu 44: hình 1-4 có (đen, trắng) = (1, 0), (1, 3), (6, 3), (6, 10) như đề');
console.assert(count(5, true) === 15 && count(5, false) === 10, 'Câu 44: hình 5 có 15 đen, 10 trắng');
console.assert(SUM(BLACK_SIZES) === 15 && SUM(WHITE_SIZES) === 21 && BLACK_SIZES.join() === '1,5,9' && WHITE_SIZES.join() === '3,7,11',
  'Câu 44: 1 + 5 + 9 = 15; 3 + 7 + 11 = 21');
console.assert(count(N, true) === 15 && count(N, false) === 21 && 21 - 15 === 6, 'Câu 44: đáp số 6');

// --- viên đá vẽ phấn ------------------------------------------------------------------------
function stone(L, x, y, r, black, t, seed) {
  if (t <= 0) return;
  if (black) {
    L.dot(x, y, r, { color: BLACK, t });
    L.loop(x, y, r, r, { color: CHALK.white, width: 3, t: clamp01(t * 1.5), seed });
  } else {
    L.loop(x, y, r, r, { color: CHALK.white, width: 5, t: clamp01(t * 1.5), seed });
  }
}

// hình n tại tâm (cx, cy); tOf(layer) là tiến độ từng lớp, scaleOf(layer) hệ số phóng
function figure(L, n, cx, cy, pitch, tOf = () => 1, scaleOf = () => 1) {
  cellsOf(n).forEach((q, i) => {
    const x = cx + (q.c - (n - 1) / 2) * pitch;
    const y = cy + ((n - 1) / 2 - q.r) * pitch;
    stone(L, x, y, pitch * 0.4 * scaleOf(q.layer), isBlack(q.layer), tOf(q.layer), 100 + i);
  });
}

const boxX = (i) => 960 + (i - 2) * 360;
const figX = (i) => 960 + (i - 2.5) * 310;

// một nhịp phóng to rồi về lại khi tiến độ u đi qua
const pulse = (u) => 1 + 0.28 * Math.sin(Math.PI * clamp01(u));

export const scenes = {
  from_prev: previous.beat5,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('44. Đá đen và đá trắng', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Các hình dưới đây tuân theo quy tắc tăng dần của các viên đá đen và trắng.', 960, 235,
      { size: 44, align: 'center', t: g(p, 'q1') });
    L.text('Hỏi trong hình thứ sáu, số viên đá trắng nhiều hơn số viên đá đen là bao nhiêu?', 960, 305,
      { size: 44, align: 'center', t: g(p, 'q2') });
    for (let i = 0; i < 5; i++) {
      L.rect(boxX(i) - 160, 380, boxX(i) + 160, 660, { width: 5, t: stagger(g(p, 'figs'), i, 5, 0.4), seed: 30 + i });
    }
    for (let n = 1; n <= 4; n++) {
      const u = stagger(g(p, 'figs'), n - 1, 5, 0.4);
      figure(L, n, boxX(n - 1), 520, 56, (k) => stagger(u, k - 1, n, 0.5));
      const q = pop(u);
      tile(objs, boxX(n - 1), 715, String(n), 'int', { scale: 0.62 * q.scale, squash: q.squash });
    }
    L.text('... ?', boxX(4), 545, { size: 80, align: 'center', t: g(p, 'q2') });
    thinkingDots(L, 960, 900, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // mỗi hình thêm một lớp chữ L: 1, 3, 5, 7, 9, 11 viên; lớp lẻ đen, lớp chẵn trắng
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Mỗi hình thêm một lớp chữ L', 960, 150, { size: 64, align: 'center', t: g(p, 'heading') });
    LAYERS.forEach((n, i) => {
      const u = stagger(g(p, 'figs'), i, N, 0.4);
      figure(L, n, figX(i), 480, 46, (k) => (k < n ? clamp01(u * 3) : u), (k) => (k === n ? pop(u).scale : 1));
      L.text(String(LAYER_SIZE(n)), figX(i), 735,
        { size: 64, align: 'center', color: YELLOW, t: stagger(g(p, 'counts'), i, N, 0.4) });
      L.text(`hình ${n}`, figX(i), 330, { size: 40, align: 'center', t: u });
    });
    L.text('số viên của lớp mới', 960, 825, { size: 44, align: 'center', t: g(p, 'counts') });
    const lg = g(p, 'legend');
    stone(L, 560, 940, 26, true, lg, 7);
    L.text('lớp lẻ: đá đen', 610, 955, { size: 48, t: lg });
    stone(L, 1160, 940, 26, false, lg, 8);
    L.text('lớp chẵn: đá trắng', 1210, 955, { size: 48, t: lg });
  },

  // hình 6: đen 1 + 5 + 9, trắng 3 + 7 + 11
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    const stagePulse = (layers, u) => (k) => {
      const i = layers.indexOf(k);
      return i < 0 ? 1 : pulse(stagger(u, i, layers.length, 0.5));
    };
    const scaleOf = (k) => (isBlack(k) ? stagePulse(BLACK_LAYERS, g(p, 'black'))(k) : stagePulse(WHITE_LAYERS, g(p, 'white'))(k));
    L.text('Hình 6', 440, 170, { size: 60, align: 'center', t: g(p, 'fig') });
    figure(L, N, 440, 560, 78, () => g(p, 'fig'), scaleOf);
    stone(L, 900, 395, 28, true, g(p, 'black'), 3);
    row(L, ['1', '+', '5', '+', '9', '=', { s: String(SUM(BLACK_SIZES)), color: YELLOW }], 1270, 410,
      { size: 68, t: g(p, 'black'), seed: 1 });
    stone(L, 900, 575, 28, false, g(p, 'white'), 4);
    row(L, ['3', '+', '7', '+', '11', '=', { s: String(SUM(WHITE_SIZES)), color: YELLOW }], 1270, 590,
      { size: 68, t: g(p, 'white'), seed: 2 });
    const xs = row(L, [
      { s: String(SUM(WHITE_SIZES)), color: YELLOW }, { sym: 'minus', color: YELLOW },
      { s: String(SUM(BLACK_SIZES)), color: YELLOW }, { s: '=', color: YELLOW },
      { s: String(SUM(WHITE_SIZES) - SUM(BLACK_SIZES)), color: YELLOW },
    ], 1180, 820, { size: 96, t: g(p, 'answer'), gap: 0.5, seed: 9 });
    L.loop(xs[4] + 6, 820 - 32, 56, 64, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
