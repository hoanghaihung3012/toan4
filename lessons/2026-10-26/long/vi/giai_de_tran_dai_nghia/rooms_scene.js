import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { g } from '../../../../../shared/web/js/fx.js';

const LABELS = ['SHS', 'HCS', 'CTS', 'HTS', 'THC'];
const CARDS = ['345', '436', '???', '456', '646'];
const VALUES = ['646', '456', '536', '436', '345'];
const POSITIONS = [[250, 325], [515, 325], [780, 325], [380, 465], [650, 465]];

export function drawRooms(ctx, layer, board, progress = {}) {
  const phase = board.id;
  if (!/^rooms[1-5]$/.test(phase)) return;

  const intro = g(progress, 'intro');
  const step0 = Math.min(intro, g(progress, 'step0'));
  const step1 = Math.min(intro, g(progress, 'step1'));
  const step2 = Math.min(intro, g(progress, 'step2'));
  const labels = board.diagram?.labels ?? LABELS;
  const complete = phase === 'rooms5';
  const text = (value, x, y, size, color, amount) => {
    if (amount <= 0) return;
    layer.text(value, x, y, { size, color, t: amount, align: 'center' });
  };
  const pair = (label, value, amount, color = CHALK.white) => {
    if (amount <= 0) return;
    text(label, 330, 835, 58, color, amount);
    layer.arrow([420, 814], [590, 814], {
      color, width: 4, head: 20, t: amount, seed: 71,
    });
    text(value, 700, 835, 58, color, amount);
  };
  const mapping = (entries, amount, y = 920) => {
    entries.forEach((entry, index) => {
      const x = 515 + (index - (entries.length - 1) / 2) * 190;
      text(entry, x, y, 44, CHALK.mint, amount);
    });
  };

  labels.forEach((label, index) => {
    const position = POSITIONS[index];
    if (!position) return;
    const [x, top] = position;
    const focus = phase === 'rooms2' && index === 0 ? step2
      : phase === 'rooms3' && index === 0 ? step0
        : phase === 'rooms4' && index === 4 ? step1 : 0;
    layer.rect(x - 105, top, x + 105, top + 115, {
      color: CHALK.mint, width: 3, t: intro, seed: 20 + index,
    });
    text(label, x, top + (complete ? 48 : 74), 54, CHALK.white, intro);
    if (focus > 0) {
      layer.rect(x - 111, top - 6, x + 111, top + 121, {
        color: CHALK.yellow, width: 4, t: focus, seed: 30 + index,
      });
    }
    if (phase === 'rooms2' && index === 0 && step2 > 0) {
      [-48, 48].forEach(offset => {
        layer.loop(x + offset, top + 56, 23, 33, {
          color: CHALK.yellow, width: 3, t: step2, seed: 41 + offset,
        });
      });
    }
    if (phase === 'rooms4' && index < 4 && step0 > 0) {
      layer.line([x + 29, top + 86], [x + 66, top + 86], {
        color: CHALK.mint, width: 4, t: step0, seed: 50 + index,
      });
    }
    if (complete) {
      const amount = index === 2 ? step0 : index < 2 ? step1 : step2;
      const color = index === 2 ? CHALK.yellow : CHALK.white;
      text(VALUES[index], x, top + 100, 54, color, amount);
      if (index === 2 && amount > 0) {
        layer.loop(x, top + 81, 78, 33, {
          color, width: 4, t: amount, seed: 62,
        });
      }
    }
  });

  layer.line([115, 615], [915, 615], {
    color: CHALK.mint, width: 2, t: intro, seed: 66,
  });

  if (!complete) {
    text('Thẻ chưa ghép', 515, 659, 34, CHALK.mint, intro);
    CARDS.forEach((value, index) => {
      const x = 175 + index * 170;
      layer.rect(x - 72, 684, x + 72, 756, {
        color: CHALK.white, width: 3, t: intro, seed: 80 + index,
      });
      text(value, x, 738, 48, CHALK.white, intro);
    });
  }

  if (phase === 'rooms1') {
    text('S   H   C   T', 515, 848, 54, CHALK.mint, step0);
    text('???', 515, 925, 54, CHALK.white, step2);
  }

  if (phase === 'rooms2') {
    ['3', '4', '5', '6'].forEach((digit, index) => {
      const x = 230 + index * 190;
      text(digit, x, 837, 60, CHALK.white, step0);
      if (step1 > 0) {
        layer.loop(x, 817, 38, 40, {
          color: CHALK.mint, width: 3, t: step1, seed: 90 + index,
        });
      }
    });
    text('SHS', 515, 927, 60, CHALK.yellow, step2);
  }

  if (phase === 'rooms3') {
    pair('SHS', '646', step0);
    mapping(['S = 6', 'H = 4'], step1, 900);
    text('C, T : 3, 5', 515, 935, 34, CHALK.mint, step2);
  }

  if (phase === 'rooms4') {
    mapping(['S = 6', 'H = 4'], intro, 805);
    if (step1 > 0) {
      text('THC', 330, 870, 54, CHALK.white, step1);
      layer.arrow([420, 850], [590, 850], {
        color: CHALK.white, width: 4, head: 20, t: step1, seed: 101,
      });
      text('345', 700, 870, 54, CHALK.white, step1);
    }
    mapping(['T = 3', 'C = 5'], step2, 939);
  }

  if (complete) {
    mapping(['S = 6', 'H = 4', 'C = 5', 'T = 3'], intro, 710);
    pair('CTS', '536', step0, CHALK.yellow);
  }
}