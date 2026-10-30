// Câu 42. Bốn thẻ số 1, 2, 3, 4: tạo được bao nhiêu số có 2 chữ số khác nhau.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, dropPose, dust, numTile, thinkingDots, popLabel } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene1/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const CARDS = [1, 2, 3, 4];
// mỗi thẻ chỉ dùng một lần (đáp án chính thức không có 11, 22, 33, 44)
const GROUPS = CARDS.map((t) => ({
  t,
  nums: CARDS.filter((u) => u !== t).map((u) => t * 10 + u),
}));
const ALL = GROUPS.flatMap((q) => q.nums);

console.assert(ALL.join() === '12,13,14,21,23,24,31,32,34,41,42,43', 'Câu 42: 12 số theo đáp án chính thức');
console.assert(CARDS.length === 4 && GROUPS.every((q) => q.nums.length === 3), 'Câu 42: 4 cách chọn chục, 3 cách chọn đơn vị');
console.assert(new Set(ALL).size === ALL.length && ALL.length === CARDS.length * 3, 'Câu 42: 4 × 3 = 12');

const ROW_Y = [310, 460, 610, 760];
const TENS_X = 330;
const unitX = (j) => 700 + j * 230;

export const scenes = {
  from_prev: previous.beat5,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('42. Số có 2 chữ số', 960, 150, { size: 72, align: 'center', t: g(p, 'title') });
    CARDS.forEach((d, i) => {
      const x = 960 + (i - 1.5) * 190;
      const u = stagger(g(p, 'cards'), i, CARDS.length, 0.4);
      const pose = dropPose(u, 340);
      if (pose) tile(objs, x, pose.y, String(d), 'int', { scale: 1.25, squash: pose.squash });
      dust(L, x, 340 + 65, clamp01((u - 0.55) / 0.45), 40 + i, 1.25);
    });
    L.text('Khi tạo các số có 2 chữ số bằng 4 thẻ số được hiển thị dưới đây,', 960, 560,
      { size: 46, align: 'center', t: g(p, 'question1') });
    L.text('hỏi có thể tạo ra bao nhiêu số có 2 chữ số khác nhau?', 960, 640,
      { size: 46, align: 'center', t: g(p, 'question2') });
    thinkingDots(L, 960, 860, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // chọn thẻ hàng chục (4 cách), rồi thẻ hàng đơn vị (3 cách): 4 × 3 = 12
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('hàng chục', TENS_X, 215, { size: 44, align: 'center', t: g(p, 'tens') });
    L.text('số tạo được', 910, 215, { size: 44, align: 'center', t: g(p, 'units') });
    GROUPS.forEach((q, i) => {
      const y = ROW_Y[i];
      const t = pop(stagger(g(p, 'tens'), i, GROUPS.length, 0.5));
      tile(objs, TENS_X, y, String(q.t), 'int', { scale: 0.9 * t.scale, squash: t.squash });
      q.nums.forEach((n, j) => {
        const u = pop(stagger(g(p, 'units'), i * 3 + j, ALL.length, 0.25));
        numTile(objs, unitX(j), y, String(n), 'dec', { scale: 0.9 * u.scale, squash: u.squash, digits: 2 });
      });
    });
    popLabel(L, `${CARDS.length} cách`, 130, 550, g(p, 'tensCount'), { size: 56 });
    popLabel(L, `${CARDS.length - 1} cách`, 1500, 550, g(p, 'unitsCount'), { size: 56 });
    L.loop(935, ROW_Y[0], 700, 80, { color: CHALK.yellow, width: 7, t: g(p, 'example'), seed: 21 });
    const xs = row(L, [
      { s: String(CARDS.length), color: CHALK.yellow }, { sym: 'times', color: CHALK.yellow },
      { s: String(CARDS.length - 1), color: CHALK.yellow }, { s: '=', color: CHALK.yellow },
      { s: String(ALL.length), color: CHALK.yellow },
    ], 960, 960, { size: 90, t: g(p, 'answer'), gap: 0.3, seed: 9 });
    L.loop(xs[4], 960 - 28, 80, 62, { color: CHALK.yellow, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
