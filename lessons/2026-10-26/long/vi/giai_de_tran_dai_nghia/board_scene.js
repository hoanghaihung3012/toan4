import { CHALK, measure } from '../../../../../shared/web/js/chalk.js';
import { row } from '../../../../../shared/web/js/parts.js';
import { g } from '../../../../../shared/web/js/fx.js';
import { drawHouses } from './houses_scene.js';
import { drawRooms } from './rooms_scene.js';
import { drawTeams } from './teams_scene.js';

function equation(layer, text, x, y, progress, color) {
  const size = Math.min(49, 49 * 735 / Math.max(1, measure(text, 49)));
  const parts = text.split(/(×| - |⇒)/).filter(Boolean).map((part) => {
    if (part === '×') return { sym: 'times', color };
    if (part === ' - ') return { sym: 'minus', color };
    return { s: part === '⇒' ? ';' : part, color };
  });
  row(layer, parts, x, y, { size, gap: 0.08, align: 'left', t: progress });
}

export function createBoardScenes(boards) {
  return Object.fromEntries(boards.map((board) => [board.id, (ctx, progress) => {
    const layer = ctx.chalk(60);
    const title = g(progress, 'title');
    const type = board.diagram.type;
    const chapter = { houses: 'Bài 1 · Số nhà', rooms: 'Bài 2 · Thẻ phòng', teams: 'Bài 3 · Chuyển đội', summary: 'Tổng kết' }[type];
    layer.text(`TRẦN ĐẠI NGHĨA · ${chapter}`, 90, 66, { size: 28, t: title, color: CHALK.mint });
    layer.text(board.title, 90, 150, { size: 66, t: title });
    layer.text(board.subtitle, 92, 222, { size: 36, t: title, color: CHALK.yellow });
    layer.line([90, 270], [1830, 270], { width: 2, t: title, color: CHALK.mint, seed: 12 });
    layer.dashed([1010, 320], [1010, 965], { t: title, color: CHALK.mint, width: 2, on: 8, off: 18 });
    const draw = { houses: drawHouses, rooms: drawRooms, teams: drawTeams }[type];
    if (draw) draw(ctx, layer, board, progress);
    else ['Đếm chữ số', 'Tìm mẫu lặp', 'Làm ngược'].forEach((text, index) => {
      layer.text(text, 505, 445 + index * 200, { size: 62, align: 'center', t: g(progress, `step${index}`), color: CHALK.mint });
    });
    board.steps.forEach((step, index) => {
      const y = 390 + index * 170;
      const value = g(progress, `step${index}`);
      layer.text(String(index + 1), 1050, y, { size: 27, t: value, color: CHALK.mint });
      equation(layer, step.text, 1100, y, value, index === board.steps.length - 1 ? CHALK.yellow : CHALK.white);
      layer.line([1100, y + 30], [1825, y + 30], { t: g(progress, `focus${index}`), color: CHALK.mint, width: 2, seed: 50 + index });
    });
  }]));
}