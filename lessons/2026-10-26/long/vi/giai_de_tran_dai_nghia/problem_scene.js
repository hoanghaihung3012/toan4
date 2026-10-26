import { CHALK, measure } from '../../../../../shared/web/js/chalk.js';
import { g } from '../../../../../shared/web/js/fx.js';
import { problems } from './problems.js';
import { writtenText } from './writing.js';

export function createQuestionScene(problem) {
return function question(ctx, progress) {
  const layer = ctx.chalk(60);
  const title = g(progress, 'title');
  layer.text('TRẦN ĐẠI NGHĨA · ĐỀ BÀI', 90, 66, { size: 28, t: title, color: CHALK.mint });
  layer.text(problem.title, 90, 150, { size: 66, t: title });
  layer.line([90, 205], [1830, 205], { width: 2, color: CHALK.mint, t: title, seed: 2 });
  problem.statement.forEach((line, index) => {
    const y = (problem.id === 'teams' ? 300 : 320) + index * (problem.id === 'teams' ? 85 : 100);
    const size = 44;
    console.assert(measure(line, size) < 1720, 'question line fits landscape');
    layer.text(writtenText(line, g(progress, `read${index}`)), 110, y, { size });
  });
  (problem.questions || []).forEach((lines, questionIndex) => {
    lines.forEach((line, lineIndex) => {
      const y = (problem.id === 'teams' ? 825 : 690) + questionIndex * 155 + lineIndex * 67;
      const size = 46;
      const key = lineIndex === 0 ? `ask${questionIndex}` : `ask${questionIndex}line${lineIndex}`;
      layer.text(writtenText(line, g(progress, key)), 110, y, { size, color: CHALK.yellow });
    });
  });
  if (problem.id === 'rooms') {
    const intro = g(progress, 'intro');
    layer.text('Nhãn phòng', 110, 620, { size: 30, t: intro, color: CHALK.mint });
    problem.labels.forEach((label, index) => {
      const x = 240 + index * 350;
      layer.rect(x - 100, 650, x + 100, 745, { t: intro, color: CHALK.blue, seed: index + 20 });
      layer.text(label, x, 716, { size: 56, align: 'center', t: intro });
    });
    layer.text('Thẻ rời, chưa ghép với nhãn', 110, 820, { size: 30, t: intro, color: CHALK.mint });
    problem.cards.forEach((card, index) => {
      const positions = [[420, 932], [710, 895], [990, 948], [1280, 904], [1580, 946]];
      const [x, y] = positions[index];
      layer.text(card, x, y, { size: 66, align: 'center', t: intro, color: CHALK.yellow });
    });
  }
};
}

export const question = createQuestionScene(problems[0]);