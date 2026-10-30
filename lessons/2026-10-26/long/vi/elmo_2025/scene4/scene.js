// Câu 34. Tổng cả bảng 1..9 là 45; ba tổng hàng cộng lại là 4a + 1, nên a = 11.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, popLabel } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene3/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện ------------------------------------------------------------------------------
const GIVEN = { '0,0': 7, '0,2': 6, '1,1': 8, '2,0': 4 };
const ROW_COEF = [{ k: 2, c: 0 }, { k: 1, c: 1 }, { k: 1, c: 0 }]; // tổng hàng: 2a, a + 1, a
const COL_COEF = [{ k: 1, c: 1 }, { k: 2, c: 0 }, { k: 1, c: 0 }]; // tổng cột: a + 1, 2a, a
const TOTAL = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((s, v) => s + v, 0); // 45
const SUM_K = ROW_COEF.reduce((s, q) => s + q.k, 0); // 4a
const SUM_C = ROW_COEF.reduce((s, q) => s + q.c, 0); // + 1
const A = (TOTAL - SUM_C) / SUM_K;
const ROW_SUMS = ROW_COEF.map((q) => q.k * A + q.c);
const COL_SUMS = COL_COEF.map((q) => q.k * A + q.c);
const aText = (q) => (q.k === 2 ? '2a' : q.c ? 'a + 1' : 'a');

// các bước điền: mỗi bước dùng một hàng hoặc một cột chỉ còn thiếu một ô
const SOLVED = Array.from({ length: 3 }, () => Array(3).fill(null));
for (const [key, v] of Object.entries(GIVEN)) SOLVED[+key[0]][+key[2]] = v;
const STEP_PLAN = [['row', 0], ['col', 0], ['col', 1], ['row', 2], ['row', 1]];
const STEPS = [];
for (const [kind, i] of STEP_PLAN) {
  const line = kind === 'row' ? [0, 1, 2].map((j) => [i, j]) : [0, 1, 2].map((j) => [j, i]);
  const blanks = line.filter(([r, c]) => SOLVED[r][c] === null);
  console.assert(blanks.length === 1, `Câu 34: ${kind} ${i + 1} phải còn đúng một ô trống`);
  const target = kind === 'row' ? ROW_SUMS[i] : COL_SUMS[i];
  const [br, bc] = blanks[0];
  const known = line.filter(([r, c]) => SOLVED[r][c] !== null).reduce((s, [r, c]) => s + SOLVED[r][c], 0);
  const value = target - known;
  const parts = line.map(([r, c]) => (SOLVED[r][c] === null ? '?' : String(SOLVED[r][c])));
  SOLVED[br][bc] = value;
  STEPS.push({
    kind, i, cell: [br, bc], value, target,
    text: `${kind === 'row' ? 'Hàng' : 'Cột'} ${i + 1}: ${parts.join(' + ')} = ${target}, nên ? = ${value}`,
  });
}
const FLAT = SOLVED.flat();
console.assert(A === 11 && TOTAL === 45 && SUM_K === 4 && SUM_C === 1, 'Câu 34: 4a + 1 = 45 nên a = 11');
console.assert(ROW_SUMS.join() === '22,12,11' && COL_SUMS.join() === '12,22,11', 'Câu 34: tổng hàng và cột');
console.assert(STEPS.map((s) => s.value).join() === '9,1,5,2,3', 'Câu 34: các ô điền lần lượt 9, 1, 5, 2, 3');
console.assert([...FLAT].sort((x, y) => x - y).join() === '1,2,3,4,5,6,7,8,9', 'Câu 34: dùng 1..9 đúng một lần');
console.assert([0, 1, 2].every((r) => SOLVED[r].reduce((s, v) => s + v, 0) === ROW_SUMS[r])
  && [0, 1, 2].every((c) => SOLVED.reduce((s, rw) => s + rw[c], 0) === COL_SUMS[c]),
'Câu 34: mọi hàng và cột đúng tổng');
const CHECK_COL = 2; // cột còn lại dùng để kiểm tra
const CHECK_SUM = SOLVED.reduce((s, rw) => s + rw[CHECK_COL], 0);
console.assert(CHECK_SUM === COL_SUMS[CHECK_COL], 'Câu 34: cột 3 phải đúng tổng a');

// --- bảng ---------------------------------------------------------------------------------
// cells[r][c] = { v, kind, u }: v null là ô trống; u là tiến độ pop
function board(objs, L, { x0, y0, cell, scale, cells, rowLabels, colLabels, labelT, size }) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const q = cells[r][c];
      const x = x0 + c * cell + cell / 2;
      const y = y0 + r * cell + cell / 2;
      const u = pop(q.u);
      if (u.scale <= 0) continue;
      if (q.v === null) tile(objs, x, y, '', 'blank', { scale: scale * u.scale, squash: u.squash });
      else tile(objs, x, y, String(q.v), q.kind, { scale: scale * u.scale, squash: u.squash });
    }
  }
  rowLabels.forEach((s, r) => L.text(s, x0 + cell * 3 + 90, y0 + r * cell + cell / 2 + size * 0.35,
    { size, align: 'center', t: labelT }));
  colLabels.forEach((s, c) => L.text(s, x0 + c * cell + cell / 2, y0 + cell * 3 + 62,
    { size, align: 'center', t: labelT }));
}

const blankCells = () => SOLVED.map((rw, r) => rw.map((_, c) => ({
  v: GIVEN[`${r},${c}`] ?? null, kind: 'int', u: 1,
})));

export const scenes = {
  from_prev: previous.beat4,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('34. Ô vuông tổng', 960, 115, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Chữ cái “a” dưới đây đại diện cho một số chưa biết.', 960, 215,
      { size: 38, align: 'center', t: g(p, 'question1') });
    L.text('Biết rằng mỗi hàng có tổng bằng số được ghi ở bên phải,', 960, 275,
      { size: 38, align: 'center', t: g(p, 'question2') });
    L.text('và mỗi cột có tổng bằng số được ghi ở phía dưới.', 960, 325,
      { size: 38, align: 'center', t: g(p, 'question2') });
    L.text('Hãy tìm giá trị của “a” khi mỗi số từ 1 đến 9 được', 960, 385,
      { size: 38, align: 'center', t: g(p, 'question3') });
    L.text('sử dụng đúng một lần trong chín ô.', 960, 435,
      { size: 38, align: 'center', t: g(p, 'question3') });
    const cells = blankCells().map((rw, r) => rw.map((q, c) => ({
      ...q, u: stagger(g(p, 'grid'), r * 3 + c, 9, 0.4),
    })));
    board(objs, L, {
      x0: 650, y0: 500, cell: 120, scale: 0.9, cells, size: 46, labelT: g(p, 'sums'),
      rowLabels: ROW_COEF.map(aText), colLabels: COL_COEF.map(aText),
    });
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // tổng cả bảng = 45 = 4a + 1
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Tổng của cả chín ô', 960, 130, { size: 62, align: 'center', t: g(p, 'heading') });
    for (let i = 0; i < 9; i++) {
      const u = pop(stagger(g(p, 'tiles'), i, 9, 0.4));
      tile(objs, 960 + (i - 4) * 125, 290, String(i + 1), 'int', { scale: 0.85 * u.scale, squash: u.squash });
    }
    row(L, ['1', '+', '2', '+', '3', '+', '...', '+', '9', '=', { s: String(TOTAL), color: CHALK.yellow }],
      960, 470, { size: 56, t: g(p, 'sumLine'), seed: 3 });
    row(L, ['2a', '+', '(a + 1)', '+', 'a', '=', '4a + 1'], 960, 600,
      { size: 58, t: g(p, 'rowsSum'), seed: 5 });
    L.text('4a + 1 = 45', 960, 720, { size: 62, align: 'center', t: g(p, 'eq1') });
    L.text('4a = 44', 960, 820, { size: 62, align: 'center', t: g(p, 'eq2') });
    popLabel(L, `a = ${A}`, 960, 960, g(p, 'answer'), { size: 96 });
  },

  // điền từng ô, mỗi bước chỉ còn thiếu một ô
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Điền các ô còn lại', 960, 130, { size: 62, align: 'center', t: g(p, 'heading') });
    const cells = blankCells();
    STEPS.forEach((s, k) => {
      const sk = g(p, `s${k + 1}`);
      if (sk >= 0.55) cells[s.cell[0]][s.cell[1]] = { v: s.value, kind: 'dec', u: clamp01((sk - 0.55) / 0.45) };
    });
    const x0 = 260;
    const y0 = 220;
    const cell = 150;
    board(objs, L, {
      x0, y0, cell, scale: 1.1, cells, size: 52, labelT: g(p, 'sums'),
      rowLabels: ROW_SUMS.map(String), colLabels: COL_SUMS.map(String),
    });
    STEPS.forEach((s, k) => {
      const sk = g(p, `s${k + 1}`);
      L.text(s.text, 980, 285 + k * 95, { size: 42, t: clamp01(sk * 1.3) });
      if (sk > 0 && sk < 1) {
        const t = clamp01(sk * 3);
        if (s.kind === 'row') {
          L.rect(x0 - 10, y0 + s.i * cell + 6, x0 + cell * 3 + 10, y0 + (s.i + 1) * cell - 6,
            { color: CHALK.yellow, width: 6, t, seed: 60 + k });
        } else {
          L.rect(x0 + s.i * cell + 6, y0 - 10, x0 + (s.i + 1) * cell - 6, y0 + cell * 3 + 10,
            { color: CHALK.yellow, width: 6, t, seed: 60 + k });
        }
      }
    });
    const col3 = SOLVED.map((rw) => rw[CHECK_COL]).join(' + ');
    L.text(`Cột 3: ${col3} = ${CHECK_SUM}, đúng`, 980, 285 + STEPS.length * 95,
      { size: 42, color: CHALK.green, t: g(p, 'check') });
    popLabel(L, `a = ${A}`, 960, 980, g(p, 'answer'), { size: 90 });
  },
};
