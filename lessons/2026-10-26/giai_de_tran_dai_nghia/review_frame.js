import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { pop, stagger, clamp01 } from '../../../shared/web/js/ease.js';
import { tile } from '../../../shared/web/js/tiles.js';
import { row } from '../../../shared/web/js/parts.js';
import { g } from '../../../shared/web/js/fx.js';

const NUMBERS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.assert(NUMBERS.reduce((total, number) => total + String(number).length, 0) === 15);
console.assert(15 * 45000 === 675000);

function review(ctx, progress) {
  const guides = ctx.chalk(50);
  const objects = ctx.objects();
  const layer = ctx.chalk(60);
  const title = g(progress, 'title');
  const houses = g(progress, 'houses');
  const solution = g(progress, 'solution');
  const one = 'one' in progress ? progress.one : solution;
  const two = 'two' in progress ? progress.two : solution;
  const total = 'total' in progress ? progress.total : solution;
  const cost = 'cost' in progress ? progress.cost : solution;
  const result = 'result' in progress ? progress.result : solution;
  layer.text('TRẦN ĐẠI NGHĨA', 90, 66, { size: 28, t: title, color: CHALK.mint });
  layer.text('Bài 1. Đếm chữ số, rồi tính tiền', 90, 150, { size: 66, t: title });
  layer.text('a) Các số nhà lẻ từ 1 đến 19', 92, 222, { size: 36, t: title, color: CHALK.yellow });
  layer.text('45.000 đồng / chữ số', 1820, 222, { size: 36, align: 'right', t: title, color: CHALK.mint });
  guides.line([90, 270], [1830, 270], { width: 2, t: title, color: CHALK.mint, seed: 12 });
  guides.dashed([1010, 320], [1010, 965], { width: 2, on: 8, off: 18, t: title, color: CHALK.mint });

  NUMBERS.forEach((number, index) => {
    const x = 185 + (index % 5) * 162;
    const y = 440 + Math.floor(index / 5) * 290;
    const entrance = stagger(houses, index, NUMBERS.length, 0.45);
    guides.poly([[x - 62, y - 48], [x - 62, y - 110], [x, y - 152], [x + 62, y - 110], [x + 62, y - 48]],
      { width: 4, color: CHALK.mint, t: clamp01(entrance * 1.4), seed: index + 3 });
    tile(objects, x, y, String(number), index < 5 ? 'int' : 'dec', pop(entrance));
    layer.text(index < 5 ? '1 chữ số' : '2 chữ số', x, y + 100,
      { size: 34, align: 'center', t: entrance, color: CHALK.white });
  });
  layer.text('Mỗi hàng có 5 biển', 505, 927, { size: 40, align: 'center', t: houses, color: CHALK.mint });
  layer.line([138, 560], [882, 560],
    { width: 3, t: g(progress, 'firstFocus'), color: CHALK.yellow, seed: 31 });
  layer.arrow([918, 519], [1070, 461],
    { width: 3, head: 18, t: g(progress, 'firstFocus'), color: CHALK.yellow, seed: 32 });
  layer.line([138, 850], [882, 850],
    { width: 3, t: g(progress, 'secondFocus'), color: CHALK.mint, seed: 33 });
  layer.arrow([918, 732], [1070, 561],
    { width: 3, head: 18, t: g(progress, 'secondFocus'), color: CHALK.mint, seed: 34 });

  layer.text('Số chữ số cần làm', 1100, 358, { size: 40, t: solution, color: CHALK.mint });
  row(layer, ['5', { sym: 'times' }, '1', '=', { s: '5', color: CHALK.yellow }], 1110, 453,
    { size: 64, align: 'left', gap: 0.22, t: one });
  row(layer, ['5', { sym: 'times' }, '2', '=', { s: '10', color: CHALK.yellow }], 1110, 553,
    { size: 64, align: 'left', gap: 0.22, t: two });
  row(layer, ['5', '+', '10', '=', { s: '15 chữ số', color: CHALK.yellow }], 1110, 669,
    { size: 60, align: 'left', gap: 0.22, t: total });
  layer.line([1100, 717], [1815, 717], { width: 2, t: cost, color: CHALK.mint, seed: 28 });
  layer.text('Chi phí làm biển', 1100, 783, { size: 38, t: cost, color: CHALK.mint });
  row(layer, ['15', { sym: 'times' }, '45.000'], 1110, 865,
    { size: 62, align: 'left', gap: 0.2, t: cost });
  const answer = '= 675.000 đồng';
  const size = 64;
  console.assert(1110 + measure(answer, size) < 1830, 'answer fits landscape board');
  layer.text(answer, 1110, 957, { size, t: result, color: CHALK.yellow });
  layer.line([1110, 988], [1780, 988],
    { width: 3, t: g(progress, 'resultFocus'), color: CHALK.yellow, seed: 35 });
}

export const scenes = { review };