import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { tile } from '../../../../../shared/web/js/tiles.js';
import { pop, stagger } from '../../../../../shared/web/js/ease.js';
import { g } from '../../../../../shared/web/js/fx.js';

export function drawHouses(ctx, layer, board, progress) {
  const intro = g(progress, 'intro');
  const step = (index) => g(progress, `step${index}`);
  if (board.id === 'houses3') {
    const objects = ctx.objects();
    layer.text('3.375.000 đồng', 505, 370, { size: 54, align: 'center', t: intro, color: CHALK.yellow });
    [1, 3, 5, 7, 9].forEach((number, index) => {
      const entrance = stagger(intro, index, 5, 0.4);
      tile(objects, 175 + index * 162, 520, String(number), 'int', pop(entrance));
    });
    layer.text('Tổng số chữ số', 505, 690, { size: 44, align: 'center', t: step(1) });
    layer.text('75', 505, 805, { size: 94, align: 'center', t: step(1), color: CHALK.yellow });
    layer.text('5 nhà đầu dùng 5 chữ số', 505, 940, { size: 38, align: 'center', t: step(3), color: CHALK.mint });
  } else if (board.id === 'houses4') {
    layer.text('75 chữ số', 505, 375, { size: 62, align: 'center', t: intro });
    layer.rect(145, 440, 865, 540, { t: intro, color: CHALK.white });
    layer.rect(145, 440, 193, 540, { t: step(0), color: CHALK.yellow, width: 7 });
    layer.rect(193, 440, 865, 540, { t: step(0), color: CHALK.mint, width: 7 });
    layer.text('5', 165, 625, { size: 54, align: 'center', t: step(0), color: CHALK.yellow });
    layer.text('70 chữ số', 530, 625, { size: 54, align: 'center', t: step(0), color: CHALK.mint });
    layer.arrow([530, 655], [530, 705], { t: step(1), color: CHALK.mint });
    layer.text('35 nhà hai chữ số', 530, 775, { size: 48, align: 'center', t: step(1), color: CHALK.mint });
    layer.text('Tổng cộng: 40 nhà', 505, 935, { size: 62, align: 'center', t: step(2), color: CHALK.yellow });
  } else {
    layer.text('40 căn nhà', 505, 385, { size: 64, align: 'center', t: intro, color: CHALK.yellow });
    layer.arrow([505, 420], [505, 490], { t: step(0), color: CHALK.white });
    layer.text('Biển cuối: 79', 505, 575, { size: 64, align: 'center', t: step(0), color: CHALK.mint });
    layer.text('75 chữ số', 505, 750, { size: 62, align: 'center', t: step(1) });
    layer.text('3.375.000 đồng', 505, 925, { size: 58, align: 'center', t: step(2), color: CHALK.yellow });
  }
}