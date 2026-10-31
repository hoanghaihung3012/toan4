import fs from 'node:fs';
import { boards } from './boards.js';

const file = new URL('./voice.json', import.meta.url);
const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
const beats = ['question', 'review'].map((id) => {
  const beat = spec.beats.find((entry) => entry.id === id);
  if (!beat) throw new Error(`missing approved beat: ${id}`);
  return beat;
});
let index = Math.max(...beats.flatMap((beat) => beat.lines.map((line) => Number(line.id.slice(1)))));
const line = (text) => ({ id: `L${++index}`, text });
const firstWord = (text) => text.split(/\s+/)[0].replace(/[.,!?:;]/g, '');
const base = (id, lines, tail = 0.7) => ({
  id, prev: beats.at(-1).id, lead: 1.6, tail, lines,
  windows: { wipe: ['beat^', 1.2, 'raw'], title: ['beat^', 0.6, 'out', 1.2] },
});

function question(id, entries) {
  const lines = entries.map(([, text]) => line(text));
  const beat = base(id, lines, 3);
  entries.forEach(([key], position) => {
    const entry = lines[position];
    beat.windows[key] = [`${entry.id}.${firstWord(entry.text)}`, `${entry.id}$`, 'raw'];
  });
  if (id === 'rooms_question') beat.windows.intro = ['beat^', 1.2, 'raw', 1.5];
  beats.push(beat);
}

for (const board of boards) {
  if (board.id === 'rooms1') question('rooms_question', [
    ['read0', 'Bài hai. Có năm phòng khách sạn và năm thẻ phòng như hình trên bảng.'],
    ['read1', 'Mỗi chữ trên cửa phòng đại diện cho duy nhất một chữ số trên thẻ.'],
    ['read2', 'Có một thẻ phòng bị mất số. Em hãy tìm số bị mất trên thẻ phòng.'],
  ]);
  if (board.id === 'teams1') question('teams_question', [
    ['read0', 'Bài ba. Đội A và đội B cùng tham gia một trò chơi tập thể.'],
    ['read1', 'Trước khi bắt đầu, ban tổ chức cho phép hai đội đổi người với nhau.'],
    ['read2', 'Lần thứ nhất, một phần ba số người ở đội A chuyển sang đội B.'],
    ['read3', 'Lần thứ hai, B chuyển sang A số người gấp ba lần số người đội A lúc này.'],
    ['read4', 'Lần thứ ba, có năm người chuyển từ đội A sang đội B.'],
    ['ask0', 'Sau ba lần đổi, đội A có ba mươi lăm người.'],
    ['ask0line1', 'Hỏi lúc đầu, đội A có bao nhiêu người?'],
  ]);
  const lines = board.steps.map((step) => line(step.speech));
  const beat = base(board.id, lines, board.id === 'summary' ? 2 : 0.7);
  beat.windows.intro = ['beat^', 1.2, 'raw', 1.5];
  board.steps.forEach((step, position) => {
    const entry = lines[position];
    beat.windows[`step${position}`] = [`${entry.id}.${step.anchor || firstWord(entry.text)}`, 1.4];
    beat.windows[`focus${position}`] = [`${entry.id}^`, `${entry.id}$`, 'raw'];
  });
  beats.push(beat);
}
fs.writeFileSync(file, `${JSON.stringify({ ...spec,
  _note: 'Full lesson. First two beats retain the approved sample; rebuild timing with npm run voice.', beats,
}, null, 2)}\n`);
console.log(`built ${beats.length} beats and ${index} unique voice lines`);