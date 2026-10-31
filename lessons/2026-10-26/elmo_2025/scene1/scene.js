// Câu 31. Thẻ 1, 2, 4, 7, + và ×; mỗi thẻ dùng tối đa một lần; hai thẻ số không đứng cạnh nhau.
import { THEME } from '../../../../shared/web/theme.js';
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, lerp, pop, stagger } from '../../../../shared/web/js/ease.js';
import { tile, TILE_H } from '../../../../shared/web/js/tiles.js';
import { g, dropPose, dust, numTile, thinkingDots, popLabel, mark } from '../../../../shared/web/js/fx.js';
import { row, solutionIntro, flight } from '../../../../shared/web/js/parts.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const INK = THEME.tiles.ink;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const NUMS = [1, 2, 4, 7];
const combos = (a) => a.flatMap((x, i) => a.slice(i + 1).map((y) => [x, y]));
const asc = (s) => [...s].sort((a, b) => a - b);

const PAIRS = combos(NUMS).map(([a, b]) => ({ a, b, sum: a + b, prod: a * b }));
// ba số: một số đứng riêng để cộng, hai số còn lại nhân với nhau (nhân trước, cộng sau)
const TRIPLES = NUMS.map((x) => ({
  x,
  cells: combos(NUMS.filter((n) => n !== x)).map(([y, z]) => ({ x, y, z, v: x + y * z })),
}));
const PAIR_VALUES = asc(new Set(PAIRS.flatMap((q) => [q.sum, q.prod])));
const TRIPLE_VALUES = asc(new Set(TRIPLES.flatMap((r) => r.cells.map((c) => c.v))));
const ALL_VALUES = asc(new Set([...PAIR_VALUES, ...TRIPLE_VALUES]));
const NEW_VALUES = ALL_VALUES.filter((v) => !PAIR_VALUES.includes(v));
const TWELVE = PAIRS.flatMap((q, i) => [{ i, v: q.sum }, { i, v: q.prod }]);
const DUP_VALUE = TWELVE.find((e, j) => TWELVE.findIndex((f) => f.v === e.v) !== j).v;
const DUP_PLUS = PAIRS.findIndex((q) => q.sum === DUP_VALUE);
const DUP_TIMES = PAIRS.findIndex((q) => q.prod === DUP_VALUE);

console.assert(PAIRS.length === 6 && TWELVE.length === 12, 'Câu 31: 6 cặp số, 12 phép tính');
console.assert(PAIR_VALUES.join() === '2,3,4,5,6,7,8,9,11,14,28', 'Câu 31: 11 kết quả từ hai số');
console.assert(DUP_VALUE === 8 && PAIRS[DUP_PLUS].a === 1 && PAIRS[DUP_PLUS].b === 7
  && PAIRS[DUP_TIMES].a === 2 && PAIRS[DUP_TIMES].b === 4, 'Câu 31: chỉ 1+7 và 2×4 cùng bằng 8');
console.assert(TRIPLES.flatMap((r) => r.cells).length === 12, 'Câu 31: 4 cách chọn số riêng × 3 cặp = 12');
console.assert(TRIPLE_VALUES.join() === '6,9,11,15,18,29,30', 'Câu 31: 7 kết quả từ ba số');
console.assert(NEW_VALUES.join() === '15,18,29,30', 'Câu 31: 4 kết quả mới');
console.assert(ALL_VALUES.length === 15 && PAIR_VALUES.length + NEW_VALUES.length === 15, 'Câu 31: đáp số 15');

// --- thẻ gỗ -------------------------------------------------------------------------
// Thẻ phép toán: gỗ xanh, dấu vẽ phấn màu mực (phông chữ vẽ × không đẹp).
function opTile(objs, L, x, y, sym, scale = 1, squash = 1) {
  if (scale <= 0) return;
  tile(objs, x, y, '', 'dec', { scale, squash });
  const r = 24 * scale;
  const o = { color: INK, width: 9 * scale, seed: 3 };
  if (sym === '+') {
    L.line([x - r, y], [x + r, y], o);
    L.line([x, y - r], [x, y + r], { ...o, seed: 4 });
  } else {
    const d = r * 0.82;
    L.line([x - d, y - d], [x + d, y + d], o);
    L.line([x + d, y - d], [x - d, y + d], { ...o, seed: 4 });
  }
}

// thẻ số rơi xuống từ trên, bụi phấn khi chạm bảng
function dropCard(objs, L, ch, x, y, u, scale, seed) {
  const pose = dropPose(u, y);
  if (pose) tile(objs, x, pose.y, ch, 'int', { scale, squash: pose.squash });
  dust(L, x, y + TILE_H * scale * 0.5, clamp01((u - 0.55) / 0.45), seed, scale);
}

// --- câu hỏi: sáu thẻ -----------------------------------------------------------------
const CARD_ITEMS = ['1', '2', '4', '7', '+', 'x'];

function cards(objs, L, prog) {
  CARD_ITEMS.forEach((s, i) => {
    const x = 960 + (i - 2.5) * 150;
    const u = stagger(prog, i, CARD_ITEMS.length, 0.4);
    if (/\d/.test(s)) {
      dropCard(objs, L, s, x, 300, u, 1.2, 40 + i);
      return;
    }
    const pose = dropPose(u, 300);
    if (pose) opTile(objs, L, x, pose.y, s, 1.2, pose.squash);
    dust(L, x, 300 + TILE_H * 0.6, clamp01((u - 0.55) / 0.45), 60 + i, 1.2);
  });
}

// --- vì sao chỉ có hai hoặc ba số ---------------------------------------------------------
const RULE_Y = [300, 480, 660];
const rowX = (n, i) => 960 + (i - (n - 1) / 2) * 135;

// items: '1' (số) | '+' | 'x' (thẻ phép toán) | '?' (ô phép toán còn thiếu)
function ruleRow(objs, L, y, items, numU, opU, seed) {
  const nums = items.filter((s) => /\d/.test(s)).length;
  const ops = items.filter((s) => s === '+' || s === 'x').length;
  let ni = 0;
  let oi = 0;
  items.forEach((s, i) => {
    const x = rowX(items.length, i);
    if (/\d/.test(s)) {
      dropCard(objs, L, s, x, y, stagger(numU, ni++, nums, 0.4), 1, seed + i);
      return;
    }
    const filled = s === '?' ? { scale: 0, squash: 1 } : pop(stagger(opU, oi++, ops, 0.5));
    if (filled.scale > 0) {
      opTile(objs, L, x, y, s, filled.scale, filled.squash);
    } else {
      const q = pop(clamp01((numU - 0.3) / 0.4));
      tile(objs, x, y, '', 'blank', { scale: q.scale, squash: q.squash });
    }
  });
}

// --- hai số -------------------------------------------------------------------------------
const PAIR_Y = [260, 345, 430, 515, 600, 685];
const PLUS_X = 870;
const TIMES_X = 1420;
const SC = 0.55; // cỡ thẻ kết quả

function pairEquation(L, q, x, y, isPlus, t) {
  const parts = isPlus
    ? [String(q.a), '+', String(q.b), '=', String(q.sum)]
    : [String(q.a), { sym: 'times' }, String(q.b), '=', String(q.prod)];
  return row(L, parts, x, y, { size: 50, t, seed: 5 });
}

function strip11(objs, prog) {
  PAIR_VALUES.forEach((v, i) => {
    const q = pop(stagger(prog, i, PAIR_VALUES.length, 0.4));
    numTile(objs, 960 + (i - 5) * 90, 870, String(v), 'dec',
      { scale: SC * q.scale, squash: q.squash, digits: String(v).length });
  });
}

// --- ba số ---------------------------------------------------------------------------------
const TRI_Y = [240, 340, 440, 540];
const TRI_X = [600, 1000, 1400];
const STRIP_Y = 720;
const stripX = (i) => 960 + (i - 7) * 90;

export const scenes = {
  opening(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Chào mừng các bạn!', 960, 330, { size: 78, align: 'center', t: g(p, 'welcome') });
    L.text('Học cùng Phượng', 960, 500, { size: 96, align: 'center', color: CHALK.yellow, t: g(p, 'channel') });
    L.text('Giải đề thi ELMO 2025', 960, 660, { size: 76, align: 'center', t: g(p, 'title') });
  },

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('31. Thẻ phép tính', 960, 150, { size: 72, align: 'center', t: g(p, 'title') });
    cards(objs, L, g(p, 'cards'));
    L.text('Bằng cách sử dụng một vài trong các thẻ sau đây,', 960, 480,
      { size: 44, align: 'center', t: g(p, 'question1') });
    L.text('bạn có thể tạo ra bao nhiêu phép tính khác nhau?', 960, 545,
      { size: 44, align: 'center', t: g(p, 'question2') });
    L.text('(Lưu ý: Bạn không được đặt hai thẻ số liền kề nhau', 960, 650,
      { size: 42, align: 'center', t: g(p, 'question3') });
    L.text('mà không có thẻ phép toán ở giữa. Trong mỗi phép tính,', 960, 715,
      { size: 42, align: 'center', t: g(p, 'question4') });
    L.text('mỗi thẻ chỉ được sử dụng một lần..)', 960, 780,
      { size: 42, align: 'center', t: g(p, 'question5') });
    thinkingDots(L, 960, 910, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // vì sao chỉ có phép tính hai số hoặc ba số
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    const [yA, yB, yC] = RULE_Y;
    L.text('Mỗi phép tính dùng được mấy số?', 960, 130,
      { size: 60, align: 'center', t: g(p, 'heading') });
    ruleRow(objs, L, yA, ['1', '+', '2'], g(p, 'rowAn'), g(p, 'rowAo'), 10);
    ruleRow(objs, L, yB, ['1', '+', '2', 'x', '4'], g(p, 'rowBn'), g(p, 'rowBo'), 20);
    ruleRow(objs, L, yC, ['1', '+', '2', 'x', '4', '?', '7'], g(p, 'rowCn'), g(p, 'rowCo'), 30);
    L.text('2 số cần 1 thẻ phép toán', 960, yA + 100, { size: 42, align: 'center', t: g(p, 'rowAo') });
    L.text('3 số cần 2 thẻ phép toán', 960, yB + 100, { size: 42, align: 'center', t: g(p, 'rowBo') });
    L.text('4 số cần 3 thẻ phép toán, mà chỉ có 2!', 960, yC + 100,
      { size: 42, align: 'center', color: CHALK.red, t: g(p, 'noteC') });
    mark(L, true, 1420, yA, g(p, 'tickA'), { size: 60, seed: 80 });
    mark(L, true, 1420, yB, g(p, 'tickB'), { size: 60, seed: 90 });
    mark(L, false, rowX(7, 5), yC, g(p, 'crossC'), { size: 70, seed: 70 });
    L.text('Chỉ có 2 trường hợp: dùng 2 số hoặc dùng 3 số', 960, 910,
      { size: 60, align: 'center', color: CHALK.yellow, t: g(p, 'verdict') });
  },

  // hai số: 6 cặp, mỗi cặp cộng hoặc nhân
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Dùng hai số', 960, 130, { size: 60, align: 'center', t: g(p, 'title') });
    PAIRS.forEach((q, i) => {
      const u = pop(stagger(g(p, 'pairs'), i, PAIRS.length, 0.4));
      const y = PAIR_Y[i] - 28;
      tile(objs, 330, y, String(q.a), 'int', { scale: 0.6 * u.scale, squash: u.squash });
      tile(objs, 396, y, String(q.b), 'int', { scale: 0.6 * u.scale, squash: u.squash });
    });
    PAIRS.forEach((q, i) => {
      pairEquation(L, q, PLUS_X, PAIR_Y[i], true, stagger(g(p, 'plus'), i, PAIRS.length, 0.35));
      pairEquation(L, q, TIMES_X, PAIR_Y[i], false, stagger(g(p, 'times'), i, PAIRS.length, 0.35));
    });
    popLabel(L, `${TWELVE.length} phép tính`, 960, 775, g(p, 'count12'), { size: 52 });
    // 1 + 7 và 2 × 4 cùng bằng 8
    L.loop(PLUS_X, PAIR_Y[DUP_PLUS] - 18, 170, 46,
      { color: CHALK.red, width: 6, t: g(p, 'dupeA'), seed: 11 });
    L.loop(TIMES_X, PAIR_Y[DUP_TIMES] - 18, 170, 46,
      { color: CHALK.red, width: 6, t: g(p, 'dupeB'), seed: 12 });
    L.text('trùng', PLUS_X + 185, PAIR_Y[DUP_PLUS] - 4, { size: 38, color: CHALK.red, t: g(p, 'dupeA') });
    L.text('trùng', TIMES_X + 185, PAIR_Y[DUP_TIMES] - 4, { size: 38, color: CHALK.red, t: g(p, 'dupeB') });
    strip11(objs, g(p, 'strip'));
    popLabel(L, String(PAIR_VALUES.length), 1700, 895, g(p, 'counter'), { size: 84 });
  },

  // ba số: 4 × 3 = 12 phép tính, chỉ thêm 4 kết quả mới
  beat4(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Dùng ba số', 960, 130, { size: 60, align: 'center', t: g(p, 'title') });

    // thẻ số đứng riêng ở đầu mỗi hàng
    TRIPLES.forEach((r, i) => {
      const u = pop(stagger(g(p, 'singles'), i, TRIPLES.length, 0.5));
      tile(objs, 260, TRI_Y[i] - 26, String(r.x), 'int', { scale: 0.7 * u.scale, squash: u.squash });
    });

    // kết quả: trắng, rồi vàng nếu mới, xanh bạc hà nếu đã có từ hai số
    const recolor = g(p, 'recolor') > 0;
    const resultColor = (v) => (!recolor ? undefined : PAIR_VALUES.includes(v) ? CHALK.mint : CHALK.yellow);
    const from = {};
    TRIPLES.forEach((r, ri) => {
      r.cells.forEach((c, ci) => {
        const t = stagger(g(p, 'exprs'), ri * 3 + ci, 12, 0.3);
        const parts = [String(c.x), '+', String(c.y), { sym: 'times' }, String(c.z), '=',
          { s: String(c.v), color: resultColor(c.v) }];
        const xs = row(L, parts, TRI_X[ci], TRI_Y[ri], { size: 52, t, seed: 7 });
        if (!(c.v in from)) from[c.v] = [xs[6], TRI_Y[ri] - 16];
      });
    });

    // dải kết quả: 11 thẻ có sẵn, 4 ô trống chờ kết quả mới bay xuống
    let have = PAIR_VALUES.length;
    ALL_VALUES.forEach((v, i) => {
      const x = stripX(i);
      const digits = String(v).length;
      const q = pop(stagger(g(p, 'strip'), i, ALL_VALUES.length, 0.4));
      const k = NEW_VALUES.indexOf(v);
      if (k < 0) {
        numTile(objs, x, STRIP_Y, String(v), 'dec', { scale: SC * q.scale, squash: q.squash, digits });
        return;
      }
      const u = stagger(g(p, 'fly'), k, NEW_VALUES.length, 0.5);
      if (u < 1) numTile(objs, x, STRIP_Y, '', 'blank', { scale: SC * q.scale, squash: q.squash, digits });
      if (u > 0) {
        const f = flight(from[v], [x, STRIP_Y], u, 70);
        numTile(objs, f.x, f.y, String(v), 'int',
          { scale: lerp(0.9, SC, f.v) * clamp01(u / 0.15), squash: f.squash, digits });
      }
      if (u >= 1) have += 1;
    });
    if (g(p, 'strip') > 0) {
      L.text(String(have), 1760, STRIP_Y + 30, { size: 84, align: 'center', color: CHALK.yellow });
    }

    row(L, [
      { s: String(PAIR_VALUES.length), color: CHALK.yellow }, { s: '+', color: CHALK.yellow },
      { s: String(NEW_VALUES.length), color: CHALK.yellow }, { s: '=', color: CHALK.yellow },
      { s: String(ALL_VALUES.length), color: CHALK.yellow },
      { s: 'kết quả khác nhau', color: CHALK.yellow, size: 60 },
    ], 960, 890, { size: 84, t: g(p, 'answer'), seed: 9 });
  },
};
