// Câu 45. Bảng 4 × 4 chữ cái a, b, c: tổng mỗi hàng ở bên phải, tổng mỗi cột ở bên dưới; tính giá trị của ngôi sao.
import { CHALK, measure } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, dropPose, dust, thinkingDots, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene4/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const WHITE = CHALK.white;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const GRID = [['a', 'a', 'b', 'c'], ['a', 'a', 'a', 'c'], ['b', 'b', 'b', 'c'], ['b', 'a', 'c', 'b']];
const ROW_SUM = [13, 14, 11, 12];
const COL_SUM = [10, 11, 12, null]; // cột 4 là ngôi sao chưa biết
const AB = COL_SUM[0] / 2; // cột 1: a + a + b + b = 10
const A = (COL_SUM[1] - AB) / 2; // cột 2: a + a + a + b = (a + b) + a + a = 11
const B = AB - A;
const C = ROW_SUM[1] - 3 * A; // hàng 2: a + a + a + c = 14
const VAL = { a: A, b: B, c: C };
const sum = (cells) => cells.reduce((s, l) => s + VAL[l], 0);
const STAR = sum(GRID.map((r) => r[3]));

console.assert(AB === 5 && A === 3 && B === 2 && C === 5, 'Câu 45: a = 3, b = 2, c = 5');
console.assert(GRID.every((r, i) => sum(r) === ROW_SUM[i]), 'Câu 45: cả bốn hàng khớp');
console.assert([0, 1, 2].every((c) => sum(GRID.map((r) => r[c])) === COL_SUM[c]), 'Câu 45: ba cột đầu khớp');
console.assert(STAR === 17 && 3 * C + B === 17, 'Câu 45: đáp số 17');

const KIND = { a: 'int', b: 'dec', c: 'int' };
const LC = { a: CHALK.pink, b: CHALK.blue, c: CHALK.green };
const colored = (parts) => parts.map((s) => (LC[s] ? { s, color: LC[s] } : s));

// --- ngôi sao vẽ phấn -----------------------------------------------------------------------------
function star(L, x, y, s, t, color = WHITE) {
  if (t <= 0) return;
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? s : s * 0.42;
    pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]);
  }
  L.poly(pts, { color, width: 8, t: clamp01(t), seed: 5 });
  L.dot(x, y, s * 0.28, { color, t });
}

// --- bảng 4 × 4 -----------------------------------------------------------------------------
function layout(x0, y0, pitch) {
  return {
    x: (c) => x0 + c * pitch,
    y: (r) => y0 + r * pitch,
    rightX: x0 + 3 * pitch + pitch * 1.05,
    bottomY: y0 + 3 * pitch + pitch * 1.05,
    pitch,
  };
}

// u: tiến độ thay chữ bằng số cho từng chữ cái (0 = còn là chữ); starVal: tiến độ ngôi sao thành 17
function drawGrid(objs, L, lay, { scale, size, appear = 1, sums = 1, u = {}, starVal = 0 }) {
  GRID.forEach((cells, r) => {
    cells.forEach((l, c) => {
      const drop = stagger(appear, r * 4 + c, 16, 0.3);
      const pose = dropPose(drop, lay.y(r));
      if (!pose) return;
      const k = u[l] || 0;
      const shown = k > 0 ? String(VAL[l]) : l;
      const q = k > 0 && k < 1 ? pop(k) : { scale: 1, squash: 1 };
      tile(objs, lay.x(c), pose.y, shown, KIND[l], { scale: scale * q.scale, squash: pose.squash * q.squash });
      dust(L, lay.x(c), lay.y(r) + 52 * scale, clamp01((drop - 0.55) / 0.45), 20 + r * 4 + c, scale, 46 * scale);
    });
  });
  const sr = size * 0.35;
  ROW_SUM.forEach((v, r) => L.text(String(v), lay.rightX, lay.y(r) + sr, { size, align: 'center', t: sums }));
  COL_SUM.forEach((v, c) => {
    if (v !== null) L.text(String(v), lay.x(c), lay.bottomY + sr, { size, align: 'center', t: sums });
    else if (starVal > 0) L.text(String(STAR), lay.x(c), lay.bottomY + sr, { size, align: 'center', color: YELLOW, scale: pop(starVal).scale });
    else star(L, lay.x(c), lay.bottomY, lay.pitch * 0.22, sums);
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
const Q = layout(1190, 310, 125);
const S = layout(250, 290, 130);
const EQ_X = 1330;
const GRID_SIZE = 62;

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('45. Bảng chữ cái 4 × 4', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    const lines = [
      ["Các chữ cái 'a', 'b' và 'c' dưới đây", 'q1'],
      ['biểu thị các số chưa biết.', 'q2'],
      ['Mỗi hàng cộng lại sẽ bằng số ở bên phải', 'q3'],
      ['và mỗi cột cộng lại sẽ bằng số ở bên dưới.', 'q4'],
    ];
    lines.forEach(([s, k], i) => L.text(s, 90, 320 + i * 88, { size: 46, t: g(p, k) }));
    const y5 = 320 + 4 * 88;
    const w1 = measure('Hỏi giá trị của', 46);
    L.text('Hỏi giá trị của', 90, y5, { size: 46, t: g(p, 'q5') });
    star(L, 90 + w1 + 50, y5 - 16, 28, g(p, 'q5'));
    L.text('là bao nhiêu?', 90, y5 + 88, { size: 46, t: g(p, 'q6') });

    // bảng: thẻ chữ cái, rồi số bên phải (13, 14, 11, 12) và số bên dưới (10, 11, 12, sao)
    drawGrid(objs, L, Q, { scale: 0.9, size: 56, appear: g(p, 'grid'), sums: 0 });
    const rowsT = g(p, 'rows');
    const colsT = g(p, 'cols');
    ROW_SUM.forEach((v, r) => L.text(String(v), Q.rightX, Q.y(r) + 20, { size: 56, align: 'center', t: rowsT }));
    COL_SUM.forEach((v, c) => {
      if (v === null) star(L, Q.x(c), Q.bottomY, Q.pitch * 0.22, colsT);
      else L.text(String(v), Q.x(c), Q.bottomY + 20, { size: 56, align: 'center', t: colsT });
    });
    thinkingDots(L, 600, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // cột 1 và cột 2 cho a + b = 5, rồi a = 3, b = 2
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    const a3 = g(p, 'a3') > 0 ? g(p, 'a3') : 0;
    const b2 = g(p, 'b2') > 0 ? g(p, 'b2') : 0;
    drawGrid(objs, L, S, { scale: 1, size: GRID_SIZE, appear: g(p, 'grid'), u: { a: a3, b: b2 } });
    if (g(p, 'f1') > 0 && g(p, 'f2') <= 0) frameCol(L, S, 0, g(p, 'f1'));
    if (g(p, 'f2') > 0) frameCol(L, S, 1, g(p, 'f2'));
    row(L, colored(['a', '+', 'a', '+', 'b', '+', 'b']).concat(['=', String(COL_SUM[0])]), EQ_X, 320,
      { size: 56, t: g(p, 'eq1'), seed: 1 });
    row(L, colored(['a', '+', 'b']).concat(['=', String(COL_SUM[0]), ':', '2', '=', { s: String(AB), color: YELLOW }]), EQ_X, 410,
      { size: 56, t: g(p, 'eq2'), seed: 2 });
    row(L, colored(['a', '+', 'a', '+', 'a', '+', 'b']).concat(['=', String(COL_SUM[1])]), EQ_X, 520,
      { size: 56, t: g(p, 'eq3'), seed: 3 });
    row(L, colored(['a', '+', 'a']).concat(['=', String(COL_SUM[1]), { sym: 'minus' }, String(AB), '=',
      String(COL_SUM[1] - AB)]), EQ_X, 610, { size: 56, t: g(p, 'eq4'), seed: 4 });
    row(L, colored(['a']).concat(['=', String(COL_SUM[1] - AB), ':', '2', '=', { s: String(A), color: YELLOW }]), EQ_X, 700,
      { size: 56, t: g(p, 'eq5'), seed: 5 });
    row(L, colored(['b']).concat(['=', String(AB), { sym: 'minus' }, String(A), '=', { s: String(B), color: YELLOW }]), EQ_X, 790,
      { size: 56, t: g(p, 'eq6'), seed: 6 });
  },

  // hàng 2: a + a + a + c = 14
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    const c5 = g(p, 'c5') > 0 ? g(p, 'c5') : 0;
    drawGrid(objs, L, S, { scale: 1, size: GRID_SIZE, appear: g(p, 'grid'), u: { a: 1, b: 1, c: c5 } });
    frameRow(L, S, 1, g(p, 'frame'));
    row(L, colored(['a', '+', 'a', '+', 'a', '+', 'c']).concat(['=', String(ROW_SUM[1])]), EQ_X, 380,
      { size: 62, t: g(p, 'eq1'), seed: 1 });
    row(L, colored(['c']).concat(['=', String(ROW_SUM[1]), { sym: 'minus' }, String(3 * A), '=',
      { s: String(C), color: YELLOW }]), EQ_X, 540, { size: 62, t: g(p, 'eq2'), seed: 2 });
  },

  // ngôi sao = cột 4: c + c + c + b = 17
  beat4(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    drawGrid(objs, L, S, { scale: 1, size: GRID_SIZE, appear: g(p, 'grid'), u: { a: 1, b: 1, c: 1 }, starVal: g(p, 'ans') });
    frameCol(L, S, 3, g(p, 'frame'));
    star(L, 940, 360 - 22, 28, g(p, 'eq1'));
    row(L, ['='].concat(colored(['c', '+', 'c', '+', 'c', '+', 'b'])), 990, 360,
      { size: 62, align: 'left', t: g(p, 'eq1'), seed: 1 });
    row(L, ['=', '5', '+', '5', '+', '5', '+', '2'], 990, 500,
      { size: 62, align: 'left', t: g(p, 'eq2'), seed: 2 });
    const xs = row(L, [{ s: '=', color: YELLOW }, { s: String(STAR), color: YELLOW }], 990, 650,
      { size: 90, align: 'left', t: g(p, 'ans'), gap: 0.5, seed: 9 });
    L.loop(xs[1], 650 - 32, 66, 66, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[1], 650 - 32, 85, g(p, 'burst'), { n: 10, seed: 70 });
  },
};
