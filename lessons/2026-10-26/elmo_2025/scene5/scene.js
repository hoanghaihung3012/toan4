// Câu 35. Ba mũi tên, mỗi mũi ghi 3, 5, 7 hoặc 10 điểm (có thể lặp lại); tổng nhỏ hơn 20.
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../shared/web/js/ease.js';
import { tile } from '../../../../shared/web/js/tiles.js';
import { g, mark, popLabel } from '../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene4/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện: liệt kê mọi bộ ba rồi lọc ----------------------------------------------------
const SCORES = [3, 5, 7, 10];
const LIMIT = 20;
const TRIPLES = [];
for (const a of SCORES) for (const b of SCORES) for (const c of SCORES) {
  if (a <= b && b <= c) TRIPLES.push({ t: [a, b, c], sum: a + b + c, tens: [a, b, c].filter((s) => s === 10).length });
}
const UNDER = TRIPLES.filter((q) => q.sum < LIMIT);
const TOTALS = [...new Set(UNDER.map((q) => q.sum))].sort((x, y) => x - y);
const NO_TEN = [...new Set(UNDER.filter((q) => q.tens === 0).map((q) => q.sum))].sort((x, y) => x - y);
const ONE_TEN = [...new Set(UNDER.filter((q) => q.tens === 1).map((q) => q.sum))].sort((x, y) => x - y);
const MIN_TWO_TENS = Math.min(...TRIPLES.filter((q) => q.tens >= 2).map((q) => q.sum));
const LOW = Math.min(...TRIPLES.map((q) => q.sum)); // 9
const RANGE = Array.from({ length: LIMIT - LOW }, (_, i) => LOW + i); // 9..19
const IMPOSSIBLE = RANGE.filter((s) => !TOTALS.includes(s));
const example = (s) => UNDER.find((q) => q.sum === s).t.join('+');

console.assert(NO_TEN.join() === '9,11,13,15,17,19', 'Câu 35: không có vòng 10: 9, 11, 13, 15, 17, 19');
console.assert(ONE_TEN.join() === '16,18', 'Câu 35: đúng một vòng 10: 16, 18');
console.assert(MIN_TWO_TENS === 23, 'Câu 35: hai vòng 10 trở lên thì tổng ít nhất 23');
console.assert(IMPOSSIBLE.join() === '10,12,14', 'Câu 35: 10, 12, 14 không thể có');
console.assert(TOTALS.length === 8, 'Câu 35: đáp số 8');

function target(L, p) {
  const cx = 600;
  const cy = 745;
  [210, 165, 120, 75].forEach((radius, i) => {
    L.loop(cx, cy, radius, radius, { width: 6, t: g(p, 'target'), seed: 350 + i });
  });
  L.text('10', cx, cy + 18, { size: 48, align: 'center', t: g(p, 'target') });
  L.text('7', cx + 96, cy + 18, { size: 42, align: 'center', t: g(p, 'target') });
  L.text('5', cx + 142, cy + 18, { size: 42, align: 'center', t: g(p, 'target') });
  L.text('3', cx + 187, cy + 18, { size: 42, align: 'center', t: g(p, 'target') });
}

const slotX = (i) => 960 + (i - (RANGE.length - 1) / 2) * 150;
const TILE_Y = 330;

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('35. Bia tính điểm', 960, 120, { size: 68, align: 'center', t: g(p, 'title') });
    L.text('Sam bắn 3 mũi tên và cả 3 mũi đều trúng vào bảng tính', 960, 235,
      { size: 42, align: 'center', t: g(p, 'question1') });
    L.text('điểm như hình dưới đây.', 960, 295, { size: 42, align: 'center', t: g(p, 'question1') });
    L.text('Nếu tổng số điểm của Sam nhỏ hơn 20, thì có bao nhiêu', 960, 375,
      { size: 42, align: 'center', t: g(p, 'question2') });
    L.text('cách tính tổng điểm khác nhau có thể xảy ra?', 960, 435,
      { size: 42, align: 'center', t: g(p, 'question2') });
    target(L, p);
    // ba mũi tên: ba ô trống cộng lại, tổng nhỏ hơn 20
    [1130, 1300, 1470].forEach((x, i) => {
      const u = pop(stagger(g(p, 'slots'), i, 3, 0.5));
      if (u.scale > 0) tile(objs, x, 745, '', 'blank', { scale: u.scale, squash: u.squash });
    });
    L.text('+', 1215, 765, { size: 64, align: 'center', t: g(p, 'slots') });
    L.text('+', 1385, 765, { size: 64, align: 'center', t: g(p, 'slots') });
    L.text(`< ${LIMIT}`, 1660, 765, { size: 70, align: 'center', color: CHALK.yellow, t: g(p, 'limit') });
    L.text('3 mũi tên', 1300, 900, { size: 42, align: 'center', t: g(p, 'slots') });
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text(`Các tổng có thể từ ${LOW} đến ${LIMIT - 1}`, 960, 130,
      { size: 60, align: 'center', t: g(p, 'heading') });
    RANGE.forEach((s, i) => {
      const x = slotX(i);
      const slotU = pop(stagger(g(p, 'slots'), i, RANGE.length, 0.4));
      const lit = g(p, `t${s}`);
      const kind = ONE_TEN.includes(s) ? 'dec' : 'int';
      if (TOTALS.includes(s) && lit > 0) {
        const u = pop(lit);
        tile(objs, x, TILE_Y, String(s), kind, { scale: u.scale, squash: u.squash });
        L.text(example(s), x, TILE_Y + 120, { size: 31, align: 'center', color: CHALK.yellow, t: clamp01(lit * 2) });
        return;
      }
      if (slotU.scale <= 0) return;
      tile(objs, x, TILE_Y, '', 'blank', { scale: slotU.scale, squash: slotU.squash });
      L.text(String(s), x, TILE_Y + 17, { size: 46, align: 'center', t: clamp01(g(p, 'slots') * 2) });
      if (IMPOSSIBLE.includes(s)) mark(L, false, x, TILE_Y, g(p, 'none'), { size: 64, seed: 30 + s });
    });

    const legend = (y, tileKind, text, key, color) => {
      const u = pop(g(p, key));
      if (tileKind && u.scale > 0) tile(objs, 330, y - 14, '', tileKind, { scale: 0.5 * u.scale, squash: u.squash });
      L.text(text, 400, y, { size: 44, color, t: g(p, key) });
    };
    legend(580, 'int', 'Không mũi nào trúng vòng 10: tổng ba số lẻ là số lẻ', 'leg1');
    legend(660, 'dec', 'Đúng một mũi trúng vòng 10: 10 + hai số lẻ', 'leg2');
    legend(740, null, `Hai mũi trở lên trúng vòng 10: tổng ít nhất ${MIN_TWO_TENS}, bị loại`, 'leg3', CHALK.red);
    L.text('Không thể có 10, 12 và 14', 400, 820, { size: 44, color: CHALK.red, t: g(p, 'none') });
    popLabel(L, `${TOTALS.length} tổng điểm khác nhau`, 960, 970, g(p, 'answer'), { size: 84 });
  },
};
