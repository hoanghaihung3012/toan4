// Câu 41. Các số lẻ từ 10 đến 500 đọc từ trái sang phải hay từ phải sang trái đều giống nhau.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, dropPose, dust, numTile, thinkingDots, popLabel, mark, hopY, hopSquash } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro, arcArrow } from '../../../../../../shared/web/js/parts.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const LO = 10;
const HI = 500;
const isPal = (n) => String(n) === [...String(n)].reverse().join('');
const PALS = [];
for (let n = LO; n <= HI; n++) if (n % 2 === 1 && isPal(n)) PALS.push(n);
const TWO = PALS.filter((n) => n < 100);
const THREE = PALS.filter((n) => n >= 100);
const ALL2 = [11, 22, 33, 44, 55, 66, 77, 88, 99]; // số 2 chữ số có hai chữ số giống nhau
const EVEN2 = ALL2.filter((n) => n % 2 === 0);
const FIRSTS = [1, 3, 5, 7, 9]; // chữ số đầu lẻ
const FIRST_OK = FIRSTS.filter((d) => THREE.some((n) => Math.floor(n / 100) === d));
const FIRST_NO = FIRSTS.filter((d) => !FIRST_OK.includes(d));
const PER_FIRST = FIRST_OK.map((d) => THREE.filter((n) => Math.floor(n / 100) === d).length);
const MIDDLE = [...Array(10).keys()];
const EXAMPLE = [1, 3, 1]; // 131 đọc xuôi hay ngược đều là 131
console.assert(isPal(131) && EXAMPLE.join('') === '131', 'Câu 41: ví dụ 131 đối xứng');

console.assert(TWO.join() === '11,33,55,77,99' && TWO.length === 5, 'Câu 41: 5 số lẻ đối xứng có 2 chữ số');
console.assert(ALL2.every(isPal) && ALL2.length - EVEN2.length === TWO.length, 'Câu 41: loại 22, 44, 66, 88');
console.assert(FIRST_OK.join() === '1,3' && FIRST_NO.join() === '5,7,9', 'Câu 41: chữ số đầu chỉ là 1 hoặc 3');
console.assert(505 > HI && PER_FIRST.join() === '10,10', 'Câu 41: 505 > 500; mỗi dạng 10 số');
console.assert(THREE.length === 20 && THREE.length === PER_FIRST.length * MIDDLE.length, 'Câu 41: 2 × 10 = 20');
console.assert(PALS.length === 25 && TWO.length + 10 * 2 === 25, 'Câu 41: đáp số 25');

// --- thẻ số rơi xuống bảng ----------------------------------------------------------------
function dropNum(objs, L, s, x, y, u, scale, seed, kind = 'int') {
  const pose = dropPose(u, y);
  if (pose) numTile(objs, x, pose.y, s, kind, { scale, squash: pose.squash });
  dust(L, x, y + 52 * scale, clamp01((u - 0.55) / 0.45), seed, scale, 50 * scale);
}

// số có 2 chữ số: hàng 9 thẻ, bỏ số chẵn rồi tô xanh số lẻ
const ROW2_Y = 500;
const row2X = (i) => 960 + (i - 4) * 190;

// dạng a b a của số có 3 chữ số
const FORM_Y = 400;
const FIRST_Y = 640;
const firstX = (i) => 960 + (i - 2) * 200;

export const scenes = {
  opening(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Chào mừng các bạn!', 960, 330, { size: 78, align: 'center', t: g(p, 'welcome') });
    L.text('Học cùng Phượng', 960, 500, { size: 96, align: 'center', color: CHALK.yellow, t: g(p, 'channel') });
    L.text('Giải đề thi ELMO 2024', 960, 660, { size: 76, align: 'center', t: g(p, 'title') });
  },

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('41. Số đối xứng', 960, 150, { size: 72, align: 'center', t: g(p, 'title') });
    dropNum(objs, L, String(LO), 700, 330, stagger(g(p, 'range'), 0, 2, 0.5), 1, 41);
    L.text('...', 960, 360, { size: 90, align: 'center', t: clamp01(g(p, 'range') * 3 - 0.8) });
    dropNum(objs, L, String(HI), 1220, 330, stagger(g(p, 'range'), 1, 2, 0.5), 1, 42);
    L.text('Xét các số lẻ từ 10 đến 500. Hỏi có bao nhiêu số lẻ', 960, 530,
      { size: 46, align: 'center', t: g(p, 'question1') });
    L.text('mà khi đọc số đó từ trái sang phải', 960, 610,
      { size: 46, align: 'center', t: g(p, 'question2') });
    L.text('hay đọc từ phải sang trái đều giống nhau?', 960, 690,
      { size: 46, align: 'center', t: g(p, 'question3') });
    EXAMPLE.forEach((d, i) => {
      const x = 960 + (i - 1) * 120;
      dropNum(objs, L, String(d), x, 805, stagger(g(p, 'exRight'), i, EXAMPLE.length, 0.5), 0.85, 50 + i);
    });
    L.arrow([830, 735], [1090, 735], { color: CHALK.yellow, width: 6, t: g(p, 'exRight'), seed: 11 });
    L.arrow([1090, 880], [830, 880], { color: CHALK.yellow, width: 6, t: g(p, 'exLeft'), seed: 12 });
    thinkingDots(L, 960, 1000, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // số có 2 chữ số: hai chữ số giống nhau, rồi chọn số lẻ
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Số từ 10 đến 500 có 2 hoặc 3 chữ số', 960, 130,
      { size: 58, align: 'center', t: g(p, 'heading') });
    L.text('Số có 2 chữ số', 960, 290, { size: 64, align: 'center', color: CHALK.yellow, t: g(p, 'kind') });
    ALL2.forEach((n, i) => {
      const x = row2X(i);
      const drop = stagger(g(p, 'tiles'), i, ALL2.length, 0.35);
      const pose = dropPose(drop, ROW2_Y);
      if (!pose) return;
      let scale = 0.95;
      let y = pose.y;
      let squash = pose.squash;
      let kind = 'int';
      const k = EVEN2.indexOf(n);
      if (k >= 0) {
        const u = stagger(g(p, 'evens'), k, EVEN2.length, 0.6);
        mark(L, false, x, ROW2_Y, u, { size: 80, seed: 60 + k * 3 });
      } else {
        const u = stagger(g(p, 'odds'), TWO.indexOf(n), TWO.length, 0.5);
        y += hopY(u);
        squash *= hopSquash(u);
        if (u > 0.2) kind = 'dec';
      }
      if (scale > 0) numTile(objs, x, y, String(n), kind, { scale, squash, digits: 2 });
      dust(L, x, ROW2_Y + 50, clamp01((drop - 0.55) / 0.45), 70 + i, 0.95, 48);
    });
    popLabel(L, `${TWO.length} số`, 960, 790, g(p, 'count'), { size: 110 });
  },

  // số có 3 chữ số: chữ số đầu bằng chữ số cuối, đầu lẻ, không vượt 500
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Số có 3 chữ số', 960, 130, { size: 64, align: 'center', color: CHALK.yellow, t: g(p, 'heading') });
    ['a', 'b', 'a'].forEach((s, i) => {
      const u = pop(stagger(g(p, 'form'), i, 3, 0.5));
      tile(objs, 960 + (i - 1) * 160, FORM_Y, s, i === 1 ? 'blank' : 'int', { scale: 1.1 * u.scale, squash: u.squash });
    });
    arcArrow(L, [800, FORM_Y - 80], [1120, FORM_Y - 80], 55, g(p, 'same'), 21);
    L.text('bằng nhau', 960, 245, { size: 44, align: 'center', t: g(p, 'same') });
    L.text('a là số lẻ', 960, 545, { size: 48, align: 'center', t: g(p, 'oddText') });
    FIRSTS.forEach((d, i) => {
      const u = pop(stagger(g(p, 'firsts'), i, FIRSTS.length, 0.4));
      const no = FIRST_NO.indexOf(d);
      let scale = u.scale;
      if (no >= 0) {
        const v = stagger(g(p, 'drop'), no, FIRST_NO.length, 0.6);
        mark(L, false, firstX(i), FIRST_Y, v, { size: 80, seed: 90 + no * 3 });
      }
      if (scale > 0) tile(objs, firstX(i), FIRST_Y, String(d), 'dec', { scale: 1.05 * scale, squash: u.squash });
    });
    L.text('505 > 500', firstX(3), 800, { size: 60, color: CHALK.red, align: 'center', t: g(p, 'why') });
    FIRST_OK.forEach((d, k) => {
      L.loop(firstX(FIRSTS.indexOf(d)), FIRST_Y, 82, 86,
        { color: CHALK.yellow, width: 7, t: stagger(g(p, 'keep'), k, FIRST_OK.length, 0.6), seed: 30 + k });
    });
  },

  // hai dạng 1 _ 1 và 3 _ 3: ô giữa chạy qua 0..9, mỗi dạng 10 số
  beat4(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Số có 3 chữ số', 960, 130, { size: 64, align: 'center', color: CHALK.yellow, t: g(p, 'heading') });
    const cyc = g(p, 'cycle');
    const digit = Math.min(MIDDLE.length - 1, Math.floor(cyc * MIDDLE.length));
    FIRST_OK.forEach((d, k) => {
      const cx = 560 + k * 800;
      const form = pop(stagger(g(p, 'forms'), k, FIRST_OK.length, 0.5));
      const showDigit = cyc > 0 && cyc < 1 ? String(digit) : '';
      tile(objs, cx - 140, 340, String(d), 'int', { scale: 1.1 * form.scale, squash: form.squash });
      tile(objs, cx, 340, showDigit, showDigit ? 'dec' : 'blank', { scale: 1.1 * form.scale, squash: form.squash });
      tile(objs, cx + 140, 340, String(d), 'int', { scale: 1.1 * form.scale, squash: form.squash });
      popLabel(L, `${PER_FIRST[k]} số`, cx, 510, g(p, 'ten'), { size: 80 });
    });
    L.text('Ô trống là một chữ số từ 0 đến 9', 960, 610, { size: 48, align: 'center', t: g(p, 'strip') });
    MIDDLE.forEach((d, i) => {
      const u = pop(stagger(g(p, 'strip'), i, MIDDLE.length, 0.4));
      tile(objs, 960 + (i - 4.5) * 150, 760, String(d), 'dec', { scale: 0.95 * u.scale, squash: u.squash });
    });
  },

  // đáp số: 5 + 10 × 2 = 25
  beat5(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Số có 2 chữ số', 90, 330, { size: 44, t: g(p, 'two') });
    TWO.forEach((n, i) => {
      const u = pop(stagger(g(p, 'two'), i, TWO.length, 0.4));
      numTile(objs, 560 + i * 165, 300, String(n), 'dec', { scale: 0.8 * u.scale, squash: u.squash, digits: 2 });
    });
    row(L, ['=', { s: `${TWO.length} số`, color: CHALK.yellow }], 1490, 325, { size: 64, t: g(p, 'two') });

    L.text('Số có 3 chữ số', 90, 530, { size: 44, t: g(p, 'three') });
    FIRST_OK.forEach((d, k) => {
      const u = pop(stagger(g(p, 'three'), k, FIRST_OK.length, 0.5));
      const cx = 640 + k * 330;
      [[-100, String(d), 'int'], [0, '', 'blank'], [100, String(d), 'int']].forEach(([dx, s, kind]) => {
        tile(objs, cx + dx, 500, s, kind, { scale: 0.75 * u.scale, squash: u.squash });
      });
    });
    row(L, [String(PER_FIRST[0]), { sym: 'times' }, String(FIRST_OK.length), '=',
      { s: `${THREE.length} số`, color: CHALK.yellow }], 1560, 525, { size: 60, t: g(p, 'three') });

    const xs = row(L, [
      { s: String(TWO.length), color: CHALK.yellow }, { s: '+', color: CHALK.yellow },
      { s: String(PER_FIRST[0]), color: CHALK.yellow }, { sym: 'times', color: CHALK.yellow },
      { s: String(FIRST_OK.length), color: CHALK.yellow }, { s: '=', color: CHALK.yellow },
      { s: String(PALS.length), color: CHALK.yellow },
    ], 960, 850, { size: 120, t: g(p, 'answer'), gap: 0.3, seed: 9 });
    L.loop(xs[6], 850 - 38, 100, 82, { color: CHALK.yellow, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
