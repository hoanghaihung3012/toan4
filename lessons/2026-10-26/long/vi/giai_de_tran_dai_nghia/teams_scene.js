import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { g } from '../../../../../shared/web/js/fx.js';

function text(layer, value, x, y, progress, color = CHALK.white, size = 48) {
  if (progress <= 0) return;
  layer.text(value, x, y, { size, align: 'center', color, t: progress });
}

function bar(layer, x, y, width, progress, color = CHALK.yellow, value = '') {
  if (progress <= 0) return;
  layer.rect(x, y, x + width, y + 94, { color, width: 6, t: progress, seed: 21 });
  if (value) text(layer, value, x + width / 2, y + 66, progress, color, 56);
}

function bracket(layer, x, right, y, progress, value, color = CHALK.white) {
  if (progress <= 0) return;
  layer.poly([[x, y - 14], [x, y], [right, y], [right, y - 14]],
    { color, width: 4, t: progress, seed: 33 });
  text(layer, value, (x + right) / 2, y + 62, progress, color);
}

function arrow(layer, from, to, progress, color = CHALK.mint) {
  if (progress <= 0) return;
  layer.arrow(from, to, { color, width: 5, head: 22, t: progress, seed: 45 });
}

function reverseLast(layer, intro, steps) {
  text(layer, 'A', 130, 410, intro, CHALK.yellow);
  text(layer, 'B', 855, 410, intro, CHALK.mint);
  bar(layer, 145, 610, 630, steps[0], CHALK.yellow, '35');
  text(layer, 'Cuối cùng', 460, 574, steps[0], CHALK.yellow, 30);
  bar(layer, 795, 435, 90, steps[1], CHALK.mint, '5');
  arrow(layer, [820, 550], [820, 590], steps[1]);
  text(layer, 'Trả lại A', 690, 476, steps[1], CHALK.mint, 30);
  bar(layer, 775, 610, 90, steps[1], CHALK.mint, '5');
  bracket(layer, 145, 865, 745, steps[2], '35 + 5 = 40', CHALK.yellow);
  text(layer, 'Trước lần chuyển cuối', 505, 905, steps[2], CHALK.white, 40);
}

function fourParts(layer, intro, steps) {
  text(layer, 'A', 225, 380, intro, CHALK.yellow);
  text(layer, 'B', 680, 380, intro, CHALK.mint);
  text(layer, 'Phần cũ', 225, 470, steps[0], CHALK.yellow, 30);
  text(layer, '3 phần nhận thêm', 589, 470, steps[1], CHALK.mint, 30);
  arrow(layer, [680, 398], [590, 435], steps[1]);
  for (let index = 0; index < 4; index++) {
    const reveal = index === 0 ? steps[0] : steps[1];
    const color = index === 0 ? CHALK.yellow : CHALK.mint;
    bar(layer, 140 + index * 182, 515, 170, reveal, color, '1 phần');
    text(layer, '10', 225 + index * 182, 850, Math.min(reveal, steps[2]), color, 64);
  }
  bracket(layer, 140, 856, 660, steps[2], '4 phần = 40 người');
  text(layer, '40 : 4 = 10', 500, 945, steps[2], CHALK.yellow, 56);
}

function threeParts(layer, intro, steps) {
  text(layer, 'A ban đầu', 470, 365, intro, CHALK.yellow, 40);
  text(layer, 'B', 845, 355, intro, CHALK.mint);
  for (let index = 0; index < 3; index++) {
    const x = 150 + index * 220;
    if (index < 2) {
      bar(layer, x, 535, 200, intro, CHALK.yellow, '1 phần');
      text(layer, '5', x + 100, 800, steps[2], CHALK.yellow, 64);
    } else {
      bar(layer, x, 535, 200, intro, CHALK.yellow);
      if (steps[0] > 0) {
        layer.line([610, 610], [770, 553],
          { color: CHALK.mint, width: 5, t: steps[0], seed: 52 });
      }
      bar(layer, 680, 405, 200, steps[0], CHALK.mint, '1 phần');
      arrow(layer, [790, 520], [850, 510], steps[0]);
      text(layer, 'Chuyển đi', 650, 385, steps[0], CHALK.mint, 30);
      text(layer, '5', x + 100, 800, steps[2], CHALK.mint, 64);
    }
  }
  bracket(layer, 150, 570, 660, steps[0], '', CHALK.yellow);
  text(layer, '2 phần', 245, 722, steps[0], CHALK.yellow, 40);
  text(layer, '= 10 người', 455, 722, steps[1], CHALK.yellow, 40);
  text(layer, '10 : 2 = 5', 470, 874, steps[2], CHALK.white, 48);
  text(layer, '5 × 3 = 15 người', 470, 947, steps[3], CHALK.yellow, 56);
}

function reverseChain(layer, intro, steps) {
  const values = ['35', '40', '10', '15'];
  const operations = ['+ 5', ': 4', ': 2 × 3'];
  const reveals = [intro, steps[0], steps[1], steps[2]];
  values.forEach((value, index) => {
    const y = 340 + index * 160;
    bar(layer, 350, y, 250, reveals[index], index === 3 ? CHALK.yellow : CHALK.white, value);
    if (index === 0) return;
    arrow(layer, [475, y - 56], [475, y - 10], reveals[index]);
    text(layer, operations[index - 1], 730, y - 20, reveals[index], CHALK.mint, 48);
  });
  text(layer, 'Số người đội A', 740, 370, intro, CHALK.white, 30);
}

function forwardCheck(layer, intro, steps) {
  bar(layer, 180, 330, 225, intro, CHALK.yellow, '15');
  text(layer, 'A ban đầu', 615, 390, intro, CHALK.yellow, 40);
  arrow(layer, [900, 425], [900, 490], steps[0]);
  text(layer, '5 sang B', 650, 460, steps[0], CHALK.mint, 40);
  bar(layer, 180, 495, 150, steps[0], CHALK.yellow, '10');
  text(layer, 'A còn lại', 520, 557, steps[0], CHALK.yellow, 30);
  text(layer, 'B chuyển sang A', 600, 620, steps[1], CHALK.mint, 30);
  arrow(layer, [900, 600], [900, 650], steps[1]);
  bar(layer, 180, 655, 150, steps[1], CHALK.yellow, '10');
  bar(layer, 330, 655, 450, steps[1], CHALK.mint, '30');
  bracket(layer, 180, 780, 770, steps[2], '10 + 30 = 40', CHALK.yellow);
  arrow(layer, [900, 770], [900, 850], steps[3]);
  text(layer, '5 sang B', 730, 839, steps[3], CHALK.mint, 30);
  bar(layer, 180, 855, 525, steps[3], CHALK.yellow, '35');
}

export function drawTeams(ctx, layer, board, progress) {
  const intro = g(progress, 'intro');
  const steps = [0, 1, 2, 3].map(index => g(progress, `step${index}`));
  switch (typeof board === 'string' ? board : board.id) {
    case 'teams1':
      reverseLast(layer, intro, steps);
      break;
    case 'teams2':
      fourParts(layer, intro, steps);
      break;
    case 'teams3':
      threeParts(layer, intro, steps);
      break;
    case 'teams4':
      reverseChain(layer, intro, steps);
      break;
    case 'teams5':
      forwardCheck(layer, intro, steps);
      break;
  }
}