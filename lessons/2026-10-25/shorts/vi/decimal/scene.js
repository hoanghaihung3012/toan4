// Cộng, trừ số thập phân (Toán 5): the six approved boards, now animated.
// Numbers come from the user's reference board and are re-checked below.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, W } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import {
  clamp01, lerp, easeInOut, easeInQuad, easeOutCubic, arcPoint, stagger, pop, landSquash,
} from '../../../../../shared/web/js/ease.js';
import {
  Grid, tile, numberCols, looseLayout, columnLines, chalkNumber, rtlProgress, badge, TILE_W,
} from '../../../../../shared/web/js/tiles.js';
import { drawEraser, wipePose, sweptMask, applyMask } from '../../../../../shared/web/js/eraser.js';

// --- facts (from the reference board), checked with integer arithmetic ------
const ADD_A = '9413,788', ADD_B = '453,6', ADD_R = '9867,388';
const SUB_A = '9867,4', SUB_B = '453,25', SUB_R = '9414,15';
const thousandths = (s) => {
  const [w, d = ''] = s.split(',');
  return Number(w) * 1000 + Number((d + '000').slice(0, 3));
};
console.assert(thousandths(ADD_A) + thousandths(ADD_B) === thousandths(ADD_R), 'add');
console.assert(thousandths(SUB_A) - thousandths(SUB_B) === thousandths(SUB_R), 'sub');

// --- layout: shared board places come from THEME.layout --------------------------
const COLS = THEME.layout.columns;
const GRID = new Grid(COLS.commaX, 4, 3);
const GRID_SUB = new Grid(COLS.commaX, 4, 2);
const { row1: ROW1, row2: ROW2, rule: RULE, result: RESULT } = COLS;
const { guideTop: COL_TOP, guideBottom: COL_BOTTOM, operatorX: OP_X } = COLS;
const { x: BADGE_X, y: BADGE_Y } = THEME.layout.steps;
const LOOSE_A = { x: 150, y: 520 }, LOOSE_B = { x: 190, y: 780 };

const g = (p, k) => (k in p ? p[k] : 1);

function title(ctx, text, t, center = false) {
  drawTitle(ctx.chalk(60), text, t, center);
}

function drawTitle(L, text, t = 1, center = false) {
  if (center) {
    const tc = THEME.layout.titleCentered;
    L.text(text, W / 2, tc.y, { size: tc.size, t, align: 'center' });
    return;
  }
  const { x, y, size, underlineWidth } = THEME.layout.title;
  const w = L.text(text, x, y, { size, t });
  L.line([x - 6, y + 30], [x + w + 8, y + 28], { width: underlineWidth, t, seed: 2 });
}

// erase a band of old chalk with the felt eraser; draw(layer) paints the old content
function bandWipe(ctx, prog, band, draw) {
  if (prog >= 1) return;
  const old = ctx.chalk(60);
  draw(old);
  if (prog <= 0) return;
  applyMask(old.svg, sweptMask(prog, band, 2, 100, 170));
  drawEraser(ctx.fx, wipePose(prog, band, 2).pose);
}

function steps(ctx, p, labels, active) {
  const L = ctx.chalk(50);
  labels.forEach((label, i) => {
    badge(L, BADGE_X, BADGE_Y[i], i + 1, label, { active: i + 1 === active, t: g(p, `s${i + 1}`) });
  });
}

// tiles of one number popping into place one after another (raw window)
function popRow(objs, grid, s, y, prog) {
  const cols = numberCols(s);
  cols.forEach((c, i) => {
    const { scale, squash } = pop(stagger(prog, i, cols.length, 0.4));
    tile(objs, grid.x(c.col), y, c.ch, c.kind, { scale, squash });
  });
}

function rule(L, p, grid) {
  L.line([grid.left() - 20, RULE], [grid.right() + 10, RULE - 3], { width: 6, t: g(p, 'rule'), seed: 5 });
}

function operator(L, op, y, t) {
  if (op === '−') L.line([OP_X - 30, y], [OP_X + 30, y - 1], { width: 9, t, seed: 8 }); // Pangolin's minus is thin
  else L.text(op, OP_X, y + 34, { size: 110, t, align: 'center' });
}

function resultLoop(L, p, grid) {
  L.loop((grid.left() + grid.right()) / 2, RESULT - 36, (grid.right() - grid.left()) / 2 + 26, 74,
    { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 6 });
}

// comma peg leaves the row-2 comma, hops up (anticipation), drops, squashes on landing
function commaDrop(objs, grid, prog) {
  if (prog <= 0) return;
  const x = grid.x(0);
  const target = RESULT - 30;
  let y;
  if (prog < 0.2) y = ROW2 - 34 * Math.sin((Math.PI / 2) * (prog / 0.2));
  else y = lerp(ROW2 - 34, target, easeInQuad((prog - 0.2) / 0.55));
  const squash = prog < 0.75 ? 1 + 0.12 * clamp01((prog - 0.2) / 0.55) : landSquash(prog, 0.25, 0.28);
  tile(objs, x, Math.min(y, target), ',', 'comma', { squash });
}

// --- beat 1: the question - two loose numbers ---------------------------------
function beat1(ctx, p) {
  title(ctx, 'Cộng, trừ số thập phân', g(p, 'title'));
  const objs = ctx.objects();
  const A = looseLayout(LOOSE_A.x, ADD_A);
  const B = looseLayout(LOOSE_B.x, ADD_B);
  A.forEach((c, i) => tile(objs, c.x, LOOSE_A.y, c.ch, c.kind, pop(stagger(g(p, 'rowA'), i, A.length, 0.4))));
  B.forEach((c, i) => tile(objs, c.x, LOOSE_B.y, c.ch, c.kind, pop(stagger(g(p, 'rowB'), i, B.length, 0.4))));
  const L = ctx.chalk(60);
  operator(L, '+', LOOSE_B.y, g(p, 'op'));
  L.text('?', 860, 820, { size: 120, color: CHALK.yellow, align: 'center', scale: g(p, 'q') });
}

// --- beat 2: step 1, line the columns up --------------------------------------
function beat2(ctx, p) {
  // old title erased by a short eraser pass, new title written behind it
  const ty = THEME.layout.title.y;
  bandWipe(ctx, g(p, 'titleWipe'), [ty - 50, ty + 40], (old) => drawTitle(old, 'Cộng, trừ số thập phân'));
  title(ctx, 'Cộng hai số thập phân', g(p, 'title'));
  columnLines(ctx.chalk(50), GRID, COL_TOP, COL_BOTTOM, g(p, 'cols'));

  // tiles slide from their loose spots into the columns along arcs
  const objs = ctx.objects();
  const align = g(p, 'align');
  [[ADD_A, LOOSE_A, ROW1], [ADD_B, LOOSE_B, ROW2]].forEach(([s, loose, row], r) => {
    const from = looseLayout(loose.x, s);
    from.forEach((c, i) => {
      const u = stagger(align, i + r * 3, from.length + 3, 0.5);
      const dir = Math.sign(GRID.x(c.col) - c.x) || -1;
      const back = u < 0.15 ? -14 * dir * Math.sin((Math.PI * u) / 0.15) : 0; // anticipation
      const m = easeInOut(clamp01((u - 0.15) / 0.7));
      // short hops for short moves; the lower row dips so it never crosses the top row
      const dist = Math.hypot(GRID.x(c.col) - c.x, row - loose.y);
      const lift = r === 0 ? Math.min(40, dist * 0.5) : -35;
      const [x, y] = arcPoint([c.x, loose.y], [GRID.x(c.col), row], m, lift);
      tile(objs, x + back, y, c.ch, c.kind, { squash: landSquash(u, 0.18, 0.18) });
    });
  });

  const L = ctx.chalk(60);
  operator(L, '+', lerp(LOOSE_B.y, ROW2, easeInOut(align)), 1);
  // the question mark winds up, then shrinks away as the tiles start moving
  const q = g(p, 'qOut');
  const qs = q < 0.25 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (q / 0.25)) : 1.15 * (1 - easeOutCubic((q - 0.25) / 0.75));
  if (q < 1) L.text('?', 860, 820, { size: 120, color: CHALK.yellow, align: 'center', scale: qs });
  rule(L, p, GRID);
  steps(ctx, p, ['thẳng cột'], 1);
}

// shared board for beats 3-4 (tiles already aligned)
function alignedAdd(ctx, p) {
  title(ctx, 'Cộng hai số thập phân', 1);
  columnLines(ctx.chalk(50), GRID, COL_TOP, COL_BOTTOM, 1);
  const objs = ctx.objects();
  for (const [s, y] of [[ADD_A, ROW1], [ADD_B, ROW2]]) {
    numberCols(s).forEach((c) => tile(objs, GRID.x(c.col), y, c.ch, c.kind));
  }
  const L = ctx.chalk(60);
  operator(L, '+', ROW2, 1);
  rule(L, {}, GRID);
  return L;
}

// --- beat 3: step 2, add like whole numbers -----------------------------------
function beat3(ctx, p) {
  const L = alignedAdd(ctx, p);
  // carry from tenths (7 + 6 = 13) into units
  L.text('1', GRID.x(-1), COL_TOP + 24, { size: 70, color: CHALK.red, t: g(p, 'carry'), align: 'center' });
  chalkNumber(L, GRID, ADD_R, RESULT, g(p, 'result'));
  steps(ctx, p, ['thẳng cột', 'cộng'], 2);
}

// --- beat 4: step 3, the comma drops straight down ----------------------------
function beat4(ctx, p) {
  const L = alignedAdd(ctx, p);
  L.text('1', GRID.x(-1), COL_TOP + 24, { size: 70, color: CHALK.red, align: 'center' });
  chalkNumber(L, GRID, ADD_R, RESULT, 1);
  resultLoop(L, p, GRID);
  commaDrop(ctx.objects(), GRID, g(p, 'comma'));
  steps(ctx, p, ['thẳng cột', 'cộng', 'dấu phẩy'], 3);
}

// --- beat 5: subtraction with a padded zero and a borrow ----------------------
function beat5(ctx, p) {
  title(ctx, 'Trừ hai số thập phân', g(p, 'title'));
  columnLines(ctx.chalk(50), GRID_SUB, COL_TOP, COL_BOTTOM, g(p, 'cols'));
  const objs = ctx.objects();
  popRow(objs, GRID_SUB, SUB_A, ROW1, g(p, 'rowA'));
  // padded zero: a dashed slot pops in, then a chalk 0 is written inside it
  const z = g(p, 'zero');
  tile(objs, GRID_SUB.x(2), ROW1, '', 'blank', pop(clamp01(z / 0.5)));
  popRow(objs, GRID_SUB, SUB_B, ROW2, g(p, 'rowB'));
  const L = ctx.chalk(60);
  L.text('0', GRID_SUB.x(2), ROW1 + 36, { size: 100, color: CHALK.mint, t: easeOutCubic((z - 0.5) / 0.5), align: 'center' });
  operator(L, '−', ROW2, g(p, 'op'));
  rule(L, p, GRID_SUB);
  // school method: 10 - 5 = 5, viết 5 nhớ 1; 2 thêm 1 bằng 3 (mark beside the 2)
  L.text('1', GRID_SUB.x(1) + TILE_W / 2 + 2, ROW2 + 40, { size: 72, color: CHALK.red, t: g(p, 'borrow'), align: 'center' });
  chalkNumber(L, GRID_SUB, SUB_R, RESULT, g(p, 'result'));
  resultLoop(L, p, GRID_SUB);
  commaDrop(ctx.objects(), GRID_SUB, g(p, 'comma'));
  steps(ctx, p, ['thẳng cột', 'trừ', 'dấu phẩy'], 0);
}

// --- beat 6: recap cards ------------------------------------------------------
const CARD1 = [70, 300, 515, 900], CARD2 = [565, 300, 1010, 900], CARD3 = [290, 980, 790, 1560];

function card(L, [l, top, r, b], n, label, t, seed) {
  const cx = (l + r) / 2;
  L.rect(l, top, r, b, { width: 4, t, seed });
  badge(L, cx, top + 100, n, '', { t });
  L.text(label, cx, top + 190, { size: 46, t, align: 'center' });
  return cx;
}

function beat6(ctx, p) {
  title(ctx, 'Nhớ nhé!', g(p, 'title'), true);
  const L = ctx.chalk(50);
  const cx1 = card(L, CARD1, 1, 'thẳng cột', g(p, 'card1'), 70);
  const cx2 = card(L, CARD2, 2, 'như số tự nhiên', g(p, 'card2'), 71);
  const cx3 = card(L, CARD3, 3, 'dấu phẩy ở kết quả', g(p, 'card3'), 72);
  L.text('+  −', cx2, 620, { size: 110, color: CHALK.pink, t: g(p, 'card2'), align: 'center' });
  L.arrow([cx2, 680], [cx2, 840], { width: 5, t: g(p, 'card2'), seed: 73 });
  L.arrow([cx3, 1230], [cx3, 1390], { color: CHALK.yellow, width: 5, t: g(p, 'card3'), seed: 74 });
  L.line([CARD3[0] + 40, 1420], [CARD3[2] - 40, 1418], { width: 5, t: g(p, 'card3'), seed: 75 });
  ctx.chalk(50).dashed([cx1, 520], [cx1, 860], { t: g(p, 'card1') });
  const objs = ctx.objects();
  [580, 700, 820].forEach((y, i) => tile(objs, cx1, y, ',', 'comma', pop(stagger(g(p, 'commas'), i, 3, 0.5))));
  // the comma drops down the arrow onto the line
  const c = g(p, 'comma');
  if (c > 0) {
    const y = lerp(1250, 1478, easeInQuad(clamp01(c / 0.75)));
    tile(objs, cx3, y, ',', 'comma', { squash: landSquash(c, 0.25, 0.28) });
  }
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
