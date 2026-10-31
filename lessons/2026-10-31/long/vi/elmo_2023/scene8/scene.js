// Câu 48. Quy luật của 4 hình 3 × 3 (vòng trắng, hai chấm đen, mũi tên): hình nào thuộc ô thứ năm.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene7/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const WHITE = CHALK.white;

// --- dữ kiện: mọi hình trên bảng đều tính từ đây -------------------------------------------
// Hình thứ i (i = 0 là hình đầu): vòng trắng ở hàng trên, hai chấm đen ở hàng giữa, mũi tên ở hàng dưới.
const DIRS = ['up', 'right', 'down', 'left'];
const DIR_WORD = { up: 'lên', right: 'phải', down: 'xuống', left: 'trái' };
const mod = (n, m) => ((n % m) + m) % m;
const make = (i) => {
  const empty = mod(2 - i, 3); // cột không có chấm đen, cũng là cột của mũi tên
  return {
    white: [0, mod(i, 3)],
    blacks: [0, 1, 2].filter((c) => c !== empty).map((c) => [1, c]),
    arrow: { r: 2, c: empty, dir: DIRS[mod(i, 4)] },
  };
};
const SHOWN = [0, 1, 2, 3].map(make);
const FIFTH = make(4);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// đối chiếu với ảnh đề: cột (1-3) của vòng trắng, ô trống, mũi tên và hướng ở bốn hình
console.assert(SHOWN.map((f) => f.white[1] + 1).join() === '1,2,3,1', 'Câu 48: vòng trắng ở cột 1, 2, 3, 1');
console.assert(SHOWN.map((f) => f.arrow.c + 1).join() === '3,2,1,3', 'Câu 48: ô trống và mũi tên ở cột 3, 2, 1, 3');
console.assert(SHOWN.map((f) => f.arrow.dir).join() === 'up,right,down,left', 'Câu 48: mũi tên lên, phải, xuống, trái');
console.assert(same(SHOWN[1].blacks, [[1, 0], [1, 2]]) && same(SHOWN[2].blacks, [[1, 1], [1, 2]]), 'Câu 48: chấm đen hình 2 và 3');

const OPTIONS = {
  A: { white: [0, 1], blacks: [[1, 0], [1, 2]], arrow: { r: 2, c: 1, dir: 'right' } },
  B: { white: [0, 1], blacks: [[1, 0], [1, 2]], arrow: { r: 2, c: 1, dir: 'up' } },
  C: { white: [0, 1], blacks: [[1, 1], [1, 2]], arrow: { r: 2, c: 0, dir: 'up' } },
  D: { white: [0, 2], blacks: [[1, 0], [1, 2]], arrow: { r: 2, c: 1, dir: 'up' } },
};
const NAMES = Object.keys(OPTIONS);
const RIGHT = Object.fromEntries(NAMES.map((n) => [n, same(OPTIONS[n], FIFTH)]));
const REASON = {
  A: 'mũi tên sai hướng', C: 'chấm đen sai', D: 'vòng trắng sai', B: 'đúng',
};
console.assert(NAMES.filter((n) => RIGHT[n]).join() === 'B', 'Câu 48: chỉ hình B đúng');
console.assert(FIFTH.white[1] === 1 && FIFTH.arrow.c === 1 && FIFTH.arrow.dir === 'up' && same(FIFTH.blacks, [[1, 0], [1, 2]]),
  'Câu 48: hình thứ năm');

// --- vẽ phấn: lưới 3 × 3 và các hình trong ô -------------------------------------------------
function grid(L, left, top, size, t, seed) {
  const k = clamp01(t);
  if (k <= 0) return;
  const s = size / 3;
  L.rect(left, top, left + size, top + size, { width: 4, t: clamp01(k * 2), seed });
  [1, 2].forEach((i) => {
    L.line([left + i * s, top], [left + i * s, top + size], { width: 3, t: clamp01(k * 2 - 0.4), seed: seed + i });
    L.line([left, top + i * s], [left + size, top + i * s], { width: 3, t: clamp01(k * 2 - 0.5), seed: seed + 3 + i });
  });
}

const ARROW_VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
// show: những phần được vẽ (w, b, a); colors: màu từng phần
function figure(L, left, top, size, f, t, seed, { show = 'wba', colors = {}, scale = 1 } = {}) {
  const k = clamp01(t);
  if (k <= 0) return;
  const s = size / 3;
  const at = ([r, c]) => [left + (c + 0.5) * s, top + (r + 0.5) * s];
  if (show.includes('w')) {
    const [x, y] = at(f.white);
    L.loop(x, y, s * 0.28 * scale, s * 0.28 * scale, { color: colors.w || WHITE, width: 4, t: k, seed: seed + 1 });
  }
  if (show.includes('b')) {
    f.blacks.forEach((q, i) => {
      const [x, y] = at(q);
      L.dot(x, y, s * 0.28 * scale, { color: colors.b || WHITE, t: stagger(k, i, 2, 0.6) });
    });
  }
  if (show.includes('a')) {
    const [x, y] = at([f.arrow.r, f.arrow.c]);
    const [dx, dy] = ARROW_VEC[f.arrow.dir];
    const a = s * 0.3 * scale;
    L.arrow([x - dx * a, y - dy * a], [x + dx * a, y + dy * a], { color: colors.a || WHITE, width: 5, head: 15, t: k, seed: seed + 5 });
  }
}

// bố cục: 5 ô trên một hàng; 4 đáp án ở hàng dưới
const BOX = 150;
const BOX_TOP = 380;
const boxX = (i) => 960 + (i - 2) * 250;
const OPT = 130;
const OPT_TOP = 720;
const optX = (i) => 960 + (i - 1.5) * 340;

function slots(L, t) {
  for (let i = 0; i < 5; i++) {
    const u = stagger(t, i, 5, 0.4);
    if (u <= 0) continue;
    const x = boxX(i);
    L.rect(x - 105, BOX_TOP - 30, x + 105, BOX_TOP + BOX + 30, { width: 4, t: clamp01(u * 2), seed: 200 + i });
    if (i < 4) grid(L, x - BOX / 2, BOX_TOP, BOX, clamp01(u * 2 - 0.5), 10 + i * 7);
  }
}

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('48. Quy luật của các hình', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Hãy nhìn quy luật của các hình dưới đây.', 960, 245, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('Hình nào thuộc ô thứ năm?', 960, 320, { size: 50, align: 'center', t: g(p, 'q2') });
    const boxes = g(p, 'boxes');
    slots(L, boxes);
    SHOWN.forEach((f, i) => {
      const u = stagger(boxes, i, 5, 0.4);
      figure(L, boxX(i) - BOX / 2, BOX_TOP, BOX, f, clamp01(u * 2 - 0.8), 30 + i * 20);
    });
    L.text('?', boxX(4), BOX_TOP + BOX / 2 + 28, { size: 100, align: 'center', color: YELLOW, t: stagger(boxes, 4, 5, 0.4) });
    NAMES.forEach((n, i) => {
      const u = stagger(g(p, 'opts'), i, 4, 0.4);
      L.text(`${n}.`, optX(i) - OPT / 2 - 55, OPT_TOP + OPT / 2 + 18, { size: 52, color: YELLOW, t: clamp01(u * 3) });
      grid(L, optX(i) - OPT / 2, OPT_TOP, OPT, u, 300 + i * 10);
      figure(L, optX(i) - OPT / 2, OPT_TOP, OPT, OPTIONS[n], clamp01(u * 2 - 0.8), 330 + i * 10);
    });
    thinkingDots(L, 960, 990, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // vòng trắng: cột 1, 2, 3, 1 nên hình thứ năm ở cột 2
  beat2(ctx, p) {
    ruleBoard(ctx, p, 'w', SHOWN.map((f) => f.white[1] + 1), FIFTH.white[1] + 1, 'dịch sang phải 1 ô mỗi lần');
  },

  // hai chấm đen: ô trống ở cột 3, 2, 1, 3 nên hình thứ năm trống cột 2
  beat3(ctx, p) {
    ruleBoard(ctx, p, 'b', SHOWN.map((f) => f.arrow.c + 1), FIFTH.arrow.c + 1, 'ô trống dịch sang trái 1 ô mỗi lần');
  },

  // mũi tên: cột 3, 2, 1, 3 và hướng lên, phải, xuống, trái
  beat4(ctx, p) {
    ruleBoard(ctx, p, 'a', SHOWN.map((f) => f.arrow.c + 1), FIFTH.arrow.c + 1, 'cột dịch sang trái, hướng quay theo chiều kim đồng hồ');
  },

  // hình thứ năm và bốn đáp án
  beat5(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Hình thứ năm', 480, 300, { size: 52, align: 'center', color: YELLOW, t: g(p, 'fifth') });
    grid(L, 350, 340, 260, g(p, 'fifth'), 400);
    figure(L, 350, 340, 260, FIFTH, clamp01(g(p, 'fifth') * 2 - 1), 410, { colors: { w: YELLOW, b: YELLOW, a: YELLOW } });
    NAMES.forEach((n, i) => {
      const left = 940 + (i % 2) * 500;
      const top = 330 + Math.floor(i / 2) * 300;
      const u = stagger(g(p, 'opts'), i, 4, 0.4);
      L.text(`${n}.`, left - 70, top + OPT / 2 + 18, { size: 52, color: YELLOW, t: clamp01(u * 3) });
      grid(L, left, top, OPT, u, 500 + i * 10);
      figure(L, left, top, OPT, OPTIONS[n], clamp01(u * 2 - 0.8), 530 + i * 10);
      const m = g(p, `m${n}`);
      mark(L, RIGHT[n], left + OPT + 60, top + OPT / 2, m, { size: 60, seed: 600 + i });
      L.text(REASON[n], left + OPT / 2, top + OPT + 55, { size: 36, align: 'center', color: RIGHT[n] ? YELLOW : CHALK.red, t: clamp01(m * 2) });
    });
    const xs = row(L, [{ s: 'Đáp án:', color: YELLOW }, { s: 'B', color: YELLOW }], 960, 990,
      { size: 90, t: g(p, 'answer'), gap: 0.4, seed: 9 });
    L.loop(xs[1] + 4, 990 - 30, 52, 62, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[1] + 4, 990 - 30, 80, g(p, 'burst'), { n: 10, seed: 70 });
  },
};

// bảng quy luật: một phần của hình (w, b hoặc a) ở bốn ô, số cột bên dưới, rồi hình thứ năm
function ruleBoard(ctx, p, part, cols, fifthCol, hint) {
  const L = ctx.chalk(60);
  const boxes = g(p, 'boxes');
  slots(L, boxes);
  SHOWN.forEach((f, i) => {
    const u = stagger(boxes, i, 5, 0.4);
    figure(L, boxX(i) - BOX / 2, BOX_TOP, BOX, f, clamp01(u * 2 - 0.8), 30 + i * 20, { show: part });
    const n = stagger(g(p, 'nums'), i, 4, 0.4);
    L.text(String(cols[i]), boxX(i), BOX_TOP + BOX + 110, { size: 64, align: 'center', t: n });
    if (part === 'a') {
      L.text(DIR_WORD[f.arrow.dir], boxX(i), BOX_TOP + BOX + 190, { size: 44, align: 'center', color: CHALK.blue, t: stagger(g(p, 'dirs'), i, 4, 0.4) });
    }
  });
  L.text(part === 'w' ? 'vòng trắng ở cột' : part === 'b' ? 'ô trống ở cột' : 'mũi tên ở cột', 130, BOX_TOP + BOX + 110,
    { size: 40, t: g(p, 'nums') });
  const f = g(p, 'fifth');
  const q = pop(f);
  grid(L, boxX(4) - BOX / 2, BOX_TOP, BOX, f, 160);
  figure(L, boxX(4) - BOX / 2, BOX_TOP, BOX, FIFTH, f, 150, { show: part, colors: { w: YELLOW, b: YELLOW, a: YELLOW }, scale: q.scale });
  if (f > 0) {
    L.text(String(fifthCol), boxX(4), BOX_TOP + BOX + 110, { size: 70, align: 'center', color: YELLOW, scale: q.scale });
    if (part === 'a') L.text(DIR_WORD[FIFTH.arrow.dir], boxX(4), BOX_TOP + BOX + 190, { size: 48, align: 'center', color: YELLOW, scale: q.scale });
    burst(L, boxX(4), BOX_TOP + BOX / 2, 110, g(p, 'burst'), { n: 8, seed: 80 });
  } else {
    L.text('?', boxX(4), BOX_TOP + BOX / 2 + 28, { size: 100, align: 'center', color: YELLOW, t: boxes });
  }
  L.text(hint, 960, 860, { size: 52, align: 'center', color: YELLOW, t: g(p, 'hint') });
}
