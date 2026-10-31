// Câu 43. Bảng a, b, c: mỗi hàng cộng bằng số bên phải, mỗi cột cộng bằng số bên dưới; tính ▲ + ●.
import { CHALK, measure } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, dropPose, dust, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene2/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const GRID = [['a', 'b', 'c'], ['a', 'b', 'b'], ['c', 'c', 'c']];
const ROW_SUM = [null, 21, 18]; // hàng 1 là ▲ chưa biết
const COL_SUM = [null, 22, 20]; // cột 1 là ● chưa biết
const C = ROW_SUM[2] / 3;
const B = (COL_SUM[1] - C) / 2;
const A = ROW_SUM[1] - 2 * B;
const VAL = { a: A, b: B, c: C };
const TRI = A + B + C;
const DOT = A + A + C;
const sum = (r) => r.reduce((s, l) => s + VAL[l], 0);

console.assert(C === 6 && B === 8 && A === 5, 'Câu 43: c = 6, b = 8, a = 5');
console.assert(sum(GRID[1]) === 21 && sum(GRID[2]) === 18, 'Câu 43: hàng 2 và 3');
console.assert(sum(GRID.map((r) => r[1])) === 22 && sum(GRID.map((r) => r[2])) === 20, 'Câu 43: cột 2 và 3');
console.assert(TRI === sum(GRID[0]) && DOT === sum(GRID.map((r) => r[0])), 'Câu 43: ▲ và ● theo hàng 1, cột 1');
console.assert(TRI === 19 && DOT === 16 && TRI + DOT === 35, 'Câu 43: đáp số 35');

const KIND = { a: 'int', b: 'dec', c: 'int' };
const WHITE = CHALK.white;
const YELLOW = CHALK.yellow;

// --- hình ▲ và ● vẽ phấn -------------------------------------------------------------------
function triangle(L, x, y, s, t, color = WHITE) {
  if (t <= 0) return;
  const k = clamp01(t);
  const pts = [[x, y - s], [x + s * 0.95, y + s * 0.7], [x - s * 0.95, y + s * 0.7], [x, y - s]];
  L.poly(pts, { color, width: 9, t: k, seed: 5 });
  for (let i = 1; i <= 4; i++) {
    const f = i / 5;
    const half = s * 0.95 * f;
    const yy = y - s + (s * 1.7) * f;
    L.line([x - half * 0.8, yy], [x + half * 0.8, yy], { color, width: 8, t: clamp01(k * 1.5 - 0.5), seed: 6 + i });
  }
}
function disc(L, x, y, r, t, color = WHITE) {
  L.dot(x, y, r, { color, t });
}

// --- bảng 3 × 3 -----------------------------------------------------------------------------
// u: tiến độ thay chữ bằng số cho từng chữ cái (0 = còn là chữ)
function layout(x0, y0, pitch) {
  return {
    x: (c) => x0 + c * pitch,
    y: (r) => y0 + r * pitch,
    rightX: x0 + 2 * pitch + pitch * 1.05,
    bottomY: y0 + 2 * pitch + pitch * 1.05,
    pitch,
  };
}

function drawGrid(objs, L, lay, { scale, size, appear = 1, sums = 1, u = {} }) {
  GRID.forEach((cells, r) => {
    cells.forEach((l, c) => {
      const drop = stagger(appear, r * 3 + c, 9, 0.35);
      const pose = dropPose(drop, lay.y(r));
      if (!pose) return;
      const k = u[l] || 0;
      const shown = k > 0 ? String(VAL[l]) : l;
      const q = k > 0 && k < 1 ? pop(k) : { scale: 1, squash: 1 };
      tile(objs, lay.x(c), pose.y, shown, KIND[l], { scale: scale * q.scale, squash: pose.squash * q.squash });
      dust(L, lay.x(c), lay.y(r) + 52 * scale, clamp01((drop - 0.55) / 0.45), 20 + r * 3 + c, scale, 46 * scale);
    });
  });
  const sr = size * 0.35;
  ROW_SUM.forEach((v, r) => {
    if (v === null) triangle(L, lay.rightX, lay.y(r), lay.pitch * 0.26, sums);
    else L.text(String(v), lay.rightX, lay.y(r) + sr, { size, align: 'center', t: sums });
  });
  COL_SUM.forEach((v, c) => {
    if (v === null) disc(L, lay.x(c), lay.bottomY, lay.pitch * 0.24, sums);
    else L.text(String(v), lay.x(c), lay.bottomY + sr, { size, align: 'center', t: sums });
  });
}

function frameRow(L, lay, r, t) {
  const h = lay.pitch * 0.5;
  L.rect(lay.x(0) - lay.pitch * 0.6, lay.y(r) - h, lay.rightX + lay.pitch * 0.45, lay.y(r) + h,
    { color: YELLOW, width: 6, t, seed: 40 + r });
}
function frameCol(L, lay, c, t) {
  const h = lay.pitch * 0.5;
  L.rect(lay.x(c) - h * 0.95, lay.y(0) - h, lay.x(c) + h * 0.95, lay.bottomY + lay.pitch * 0.45,
    { color: YELLOW, width: 6, t, seed: 50 + c });
}

// bố cục của đề (bảng nhỏ bên phải) và của lời giải (bảng bên trái)
const Q = layout(1290, 340, 130);
const S = layout(300, 300, 135);
const EQ_X = 1290;

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('43. Bảng chữ cái', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    const lines = [
      ['Các chữ cái \'a\', \'b\' và \'c\' dưới đây', 'q1'],
      ['biểu thị các số chưa biết.', 'q2'],
      ['Mỗi hàng cộng lại sẽ bằng số ở bên phải', 'q3'],
      ['và mỗi cột cộng lại sẽ bằng số ở bên dưới.', 'q4'],
    ];
    lines.forEach(([s, k], i) => L.text(s, 90, 320 + i * 88, { size: 50, t: g(p, k) }));
    // Hỏi tổng các giá trị của ▲ và ● / là bao nhiêu?
    const y5 = 320 + 4 * 88;
    const w1 = measure('Hỏi tổng các giá trị của', 50);
    const w2 = measure('và', 50);
    L.text('Hỏi tổng các giá trị của', 90, y5, { size: 50, t: g(p, 'q5') });
    triangle(L, 90 + w1 + 55, y5 - 18, 28, g(p, 'q5'));
    L.text('và', 90 + w1 + 110, y5, { size: 50, t: g(p, 'q5') });
    disc(L, 90 + w1 + 110 + w2 + 48, y5 - 16, 25, g(p, 'q5'));
    L.text('là bao nhiêu?', 90, y5 + 88, { size: 50, t: g(p, 'q6') });

    // bảng: thẻ chữ cái, rồi số bên phải (▲, 21, 18) và số bên dưới (●, 22, 20)
    drawGrid(objs, L, Q, { scale: 0.95, size: 60, appear: g(p, 'grid'), sums: 0 });
    const rowsT = g(p, 'rows');
    const colsT = g(p, 'cols');
    ROW_SUM.forEach((v, r) => {
      if (v === null) triangle(L, Q.rightX, Q.y(r), Q.pitch * 0.26, rowsT);
      else L.text(String(v), Q.rightX, Q.y(r) + 21, { size: 60, align: 'center', t: rowsT });
    });
    COL_SUM.forEach((v, c) => {
      if (v === null) disc(L, Q.x(c), Q.bottomY, Q.pitch * 0.24, colsT);
      else L.text(String(v), Q.x(c), Q.bottomY + 21, { size: 60, align: 'center', t: colsT });
    });
    thinkingDots(L, 700, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // hàng 3: c + c + c = 18
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    drawGrid(objs, L, S, { scale: 1, size: 60, appear: g(p, 'grid'), u: { c: g(p, 'c6') > 0 ? g(p, 'c6') : 0 } });
    frameRow(L, S, 2, g(p, 'frame'));
    row(L, ['c', '+', 'c', '+', 'c', '=', '18'], EQ_X, 380, { size: 70, t: g(p, 'eq1'), seed: 1 });
    row(L, ['c', '=', '18', ':', '3', '=', { s: String(C), color: YELLOW }], EQ_X, 560,
      { size: 70, t: g(p, 'eq2'), seed: 2 });
  },

  // cột giữa: b + b + c = 22
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    drawGrid(objs, L, S, { scale: 1, size: 60, appear: g(p, 'grid'), u: { c: 1, b: g(p, 'b8') > 0 ? g(p, 'b8') : 0 } });
    frameCol(L, S, 1, g(p, 'frame'));
    row(L, ['b', '+', 'b', '+', 'c', '=', '22'], EQ_X, 340, { size: 66, t: g(p, 'eq1'), seed: 1 });
    row(L, ['b', '+', 'b', '=', '22', { sym: 'minus' }, String(C), '=', '16'], EQ_X, 490,
      { size: 66, t: g(p, 'eq2'), seed: 2 });
    row(L, ['b', '=', '16', ':', '2', '=', { s: String(B), color: YELLOW }], EQ_X, 640,
      { size: 66, t: g(p, 'eq3'), seed: 3 });
  },

  // hàng giữa: a + b + b = 21
  beat4(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    drawGrid(objs, L, S, { scale: 1, size: 60, appear: g(p, 'grid'),
      u: { c: 1, b: 1, a: g(p, 'a5') > 0 ? g(p, 'a5') : 0 } });
    frameRow(L, S, 1, g(p, 'frame'));
    row(L, ['a', '+', 'b', '+', 'b', '=', '21'], EQ_X, 380, { size: 70, t: g(p, 'eq1'), seed: 1 });
    row(L, ['a', '=', '21', { sym: 'minus' }, String(B), { sym: 'minus' }, String(B), '=', { s: String(A), color: YELLOW }],
      EQ_X, 560, { size: 70, t: g(p, 'eq2'), seed: 2 });
  },

  // ▲ = hàng 1, ● = cột 1, tổng 35
  beat5(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    drawGrid(objs, L, S, { scale: 1, size: 60, appear: g(p, 'grid'), u: { a: 1, b: 1, c: 1 } });
    frameRow(L, S, 0, g(p, 'tri'));
    frameCol(L, S, 0, g(p, 'dot'));
    triangle(L, 930, 330 - 22, 26, g(p, 'tri'));
    row(L, ['a', '+', 'b', '+', 'c', '=', String(A), '+', String(B), '+', String(C), '=',
      { s: String(TRI), color: YELLOW }], 1380, 340, { size: 56, t: g(p, 'tri'), seed: 1 });
    disc(L, 930, 500 - 22, 24, g(p, 'dot'));
    row(L, ['a', '+', 'a', '+', 'c', '=', String(A), '+', String(A), '+', String(C), '=',
      { s: String(DOT), color: YELLOW }], 1380, 510, { size: 56, t: g(p, 'dot'), seed: 2 });
    triangle(L, 880, 700 - 26, 26, g(p, 'total'), YELLOW);
    L.text('+', 975, 700, { size: 70, color: YELLOW, align: 'center', t: g(p, 'total') });
    disc(L, 1070, 700 - 24, 26, g(p, 'total'), YELLOW);
    const xs = row(L, [
      { s: '=', color: YELLOW }, { s: String(TRI), color: YELLOW }, { s: '+', color: YELLOW },
      { s: String(DOT), color: YELLOW }, { s: '=', color: YELLOW }, { s: String(TRI + DOT), color: YELLOW },
    ], 1130, 700, { size: 80, t: g(p, 'total'), align: 'left', gap: 0.5, seed: 9 });
    L.loop(xs[5] + 8, 700 - 28, 66, 64, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
