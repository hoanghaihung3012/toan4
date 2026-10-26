import { boards as houses } from './houses.js';
import { boards as rooms } from './rooms.js';
import { boards as teams } from './teams.js';

export const boards = [...houses.slice(2), ...rooms, ...teams, {
  id: 'summary', title: 'Ba bài, ba cách nghĩ', subtitle: 'Đếm chữ số · Tìm mẫu lặp · Làm ngược',
  diagram: { type: 'summary' },
  steps: [
    { text: 'Bài 1a: 675.000 đồng', speech: 'Tóm lại, bài một cần đếm chữ số chứ không đếm biển. Câu a có chi phí sáu trăm bảy mươi lăm nghìn đồng.' },
    { text: 'Bài 1b: 40 căn nhà', speech: 'Câu b có bốn mươi căn nhà. Số bảy mươi chín chỉ là số ghi trên biển nhà cuối, không phải số lượng nhà.' },
    { text: 'Bài 2: thẻ 536', speech: 'Bài hai, tìm mẫu chữ lặp rồi xét chữ số tận cùng. Thẻ phòng bị mất mang số năm trăm ba mươi sáu.' },
    { text: 'Bài 3: A có 15 người', speech: 'Bài ba, đi ngược từng lần chuyển rồi thử lại theo chiều xuôi. Đội A ban đầu có mười lăm người.' },
  ],
}];