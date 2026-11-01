import { CHALK } from '../../../shared/web/js/chalk.js';
import { spring, clamp01 } from '../../../shared/web/js/ease.js';
import { g, thinkingDots } from '../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../shared/web/js/parts.js';

const SOURCE = {
  q41: { top: [1, 2, 3, 4, 5, 6], bottom: [2, 4, 6, 2, 4, 6] },
  q42: { counts: [1, 3, 6, 10, 15, 21, 28] },
  q44: { a: 8, b: 26, c: 16 },
  q46: { trianglesTotal: 12, perGroup: 2 },
  q48: { tensZero: 10, unitsZero: 10, finalNumber: 2 },
  q49: { baseTop: 6, baseSides: 10, upperNet: 4, upperBlocks: 2 },
};

console.assert(SOURCE.q41.top[4] === 5 && SOURCE.q41.bottom[4] === 4, 'Câu 41');
console.assert(SOURCE.q42.counts[6] === 1 + 2 + 3 + 4 + 5 + 6 + 7, 'Câu 42');
console.assert(SOURCE.q44.a * 2 === 16 && SOURCE.q44.b * 2 === 52
  && SOURCE.q44.c === 20 - 4, 'Câu 44');
console.assert(SOURCE.q46.trianglesTotal / SOURCE.q46.perGroup === 6, 'Câu 46');
console.assert(SOURCE.q48.tensZero + SOURCE.q48.unitsZero + SOURCE.q48.finalNumber === 22, 'Câu 48');
console.assert(SOURCE.q49.baseTop + SOURCE.q49.baseSides
  + SOURCE.q49.upperNet * SOURCE.q49.upperBlocks === 24, 'Câu 49');

export const PROBLEMS = [
  {
    number: 41, title: 'Quy luật quân domino',
    question: 'Vẽ số chấm thích hợp lên các quân domino để hoàn thành quy luật.',
    questionLines: ['Vẽ số chấm thích hợp lên các quân domino', 'để hoàn thành quy luật.'],
    solutionLines: ['Nửa trên: 1, 2, 3, 4, 5, 6 chấm.',
      'Nửa dưới lặp 2, 4, 6; quân thứ năm có 4 chấm.'],
    answer: 'Quân thứ năm: 5 chấm và 4 chấm.',
  },
  {
    number: 42, title: 'Đếm tam giác tô màu',
    question: 'Hình tăng dần theo thứ tự. Hình số 7 có bao nhiêu tam giác tô màu như mẫu?',
    questionLines: ['Hình tăng dần theo thứ tự. Hình số 7 có', 'bao nhiêu tam giác tô màu như mẫu?'],
    solutionLines: ['Mỗi hình thêm một hàng: 1; 1+2; 1+2+3; …',
      'Hình 7 có 1+2+3+4+5+6+7 tam giác.'],
    answer: '1 + 2 + 3 + 4 + 5 + 6 + 7 = 28',
  },
  {
    number: 43, title: 'Hoàn thành bảng hình',
    question: 'Vẽ vật thích hợp vào ô A để hoàn thành quy luật.',
    questionLines: ['Vẽ vật thích hợp vào ô A để hoàn thành quy luật.'],
    solutionLines: ['So sánh dạng hình bên ngoài, hình bên trong',
      'và trạng thái tô màu trong từng ô.',
      'Ô A: tam giác viền, chứa hình vuông tô kín.'],
    answer: 'Tam giác viền chứa hình vuông tô kín.',
  },
  {
    number: 44, title: 'Tìm A, B và C',
    question: 'Dãy số dưới đây tuân theo một quy luật. Tìm giá trị của A, B và C.',
    questionLines: ['Dãy số dưới đây tuân theo một quy luật.', 'Tìm giá trị của A, B và C.'],
    solutionLines: ['Cột giữa gấp đôi cột trái: A=8, B=26.',
      'Cột phải bằng cột giữa trừ 4, nên C=16.'],
    answer: 'A = 8,  B = 26,  C = 16',
  },
  {
    number: 45, title: 'Quy luật phần tô xám',
    question: 'Quan sát các hình có liên quan. Vẽ hình thích hợp vào chỗ trống.',
    questionLines: ['Quan sát các hình có liên quan.', 'Vẽ hình thích hợp vào chỗ trống.'],
    solutionLines: ['Mỗi bước tô thêm một vùng liền kề:',
      'tam giác trên trái, hình thoi trái, tam giác dưới trái.',
      'Tiếp theo tô hình thoi phía dưới ở giữa.'],
    answer: 'Tô thêm hình thoi phía dưới ở giữa.',
  },
  {
    number: 46, title: 'Ghép các tam giác',
    question: 'Có thể tìm được bao nhiêu nhóm gồm 2 tam giác trong hình dưới đây?',
    questionLines: ['Có thể tìm được bao nhiêu nhóm gồm', '2 tam giác trong hình dưới đây?'],
    solutionLines: ['Đếm tất cả các tam giác trong hình, có 12 tam giác.',
      'Ghép thành các cặp rời nhau: 12 : 2 = 6 nhóm.'],
    answer: 'Có 6 nhóm gồm 2 tam giác.',
  },
  {
    number: 47, title: 'Hình sau khi xoay',
    question: 'Quan sát các hình đã xoay. Vẽ hình thích hợp vào chỗ trống.',
    questionLines: ['Quan sát các hình đã xoay.', 'Vẽ hình thích hợp vào chỗ trống.'],
    solutionLines: ['Hàng trên: cột 1 và 2; cột 2; cột 2 và 3.',
      'Tiếp theo: cột 3; cột 1 và 3; cột 1.',
      'Hàng dưới chạy cùng chu kỳ, lệch một bước.'],
    answer: 'Ô trên: cột 1 và 3. Ô dưới: cột 3.',
  },
  {
    number: 48, title: 'Đếm chữ số 0',
    question: 'Có bao nhiêu chữ số 0 được dùng khi viết các số từ 100 đến 200?',
    questionLines: ['Có bao nhiêu chữ số 0 được dùng khi viết', 'các số từ 100 đến 200?'],
    solutionLines: ['Trong 100–199: hàng chục có 10 số 0;',
      'hàng đơn vị cũng có 10 số 0. Số 200 có thêm 2.',
      '10 + 10 + 2 = 22 chữ số 0.'],
    answer: 'Có 22 chữ số 0.',
  },
  {
    number: 49, title: 'Đếm mặt khối hộp',
    question: 'Sơn mọi mặt lộ ra của các khối hộp. Mặt đáy không lộ ra. Có bao nhiêu mặt được sơn?',
    questionLines: ['Sơn mọi mặt lộ ra của các khối hộp.', 'Mặt đáy không lộ ra. Có bao nhiêu mặt được sơn?'],
    solutionLines: ['Khối nền hai hàng, ba cột: 6 mặt trên + 10 mặt bên = 16.',
      'Mỗi khối trên thêm ròng 4 mặt.',
      '16 + 4 + 4 = 24 mặt.'],
    answer: 'Có 24 mặt được sơn.',
  },
  {
    number: 50, title: 'Ảnh phản chiếu qua gương',
    question: 'Vẽ hình em sẽ nhìn thấy nếu đặt gương trên đường chấm.',
    questionLines: ['Vẽ hình em sẽ nhìn thấy nếu đặt gương', 'trên đường chấm.'],
    solutionLines: ['Phản xạ các đỉnh của hình chữ nhật qua đường gương.',
      'Đỉnh nằm trên đường gương giữ nguyên.',
      'Chồng hình phản chiếu với hình ban đầu.'],
    answer: 'Đường bao sau phản chiếu tạo thành hình chữ L.',
  },
];

const line = (L, a, b, t, color = CHALK.white, width = 5, seed = 0) =>
  L.line(a, b, { t, color, width, seed });
const rect = (L, x, y, w, h, t, color = CHALK.white, width = 4, seed = 0) =>
  L.rect(x, y, x + w, y + h, { t, color, width, seed });
const label = (L, s, x, y, t, { size = 42, color = CHALK.white, align = 'center' } = {}) =>
  L.text(s, x, y, { t, size, color, align });

function writeRows(L, rows, y, t, size = 48) {
  rows.forEach((s, i) => label(L, s, 960, y + i * 70,
    clamp01(t * (rows.length + 0.8) - i * 0.85), { size }));
}

function triangle(L, x, y, size, t, color = CHALK.white, seed = 0) {
  L.poly([[x, y + size], [x + size / 2, y], [x + size, y + size], [x, y + size]],
    { t, color, width: 4, seed, amp: 1 });
}

function hatch(L, x, y, w, h, t, { color = CHALK.yellow, count = 5, seed = 0 } = {}) {
  for (let i = 0; i < count; i++) {
    const yy = y + ((i + 1) / (count + 1)) * h;
    line(L, [x + 5, yy], [x + w - 5, yy], clamp01(t * (count + 1) - i), color, 3, seed + i);
  }
}

function pip(L, cx, cy, n, t, r = 6) {
  const points = {
    1: [[0, 0]],
    2: [[-1, -1], [1, 1]],
    3: [[-1, -1], [0, 0], [1, 1]],
    4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  }[n] || [];
  points.forEach(([dx, dy], i) => L.dot(cx + dx * r * 1.15, cy + dy * r * 1.15, r * 0.48,
    { t: clamp01(t * points.length - i * 0.7), color: CHALK.white }));
}

function dominoes(L, t, revealAnswer = false) {
  const top = SOURCE.q41.top;
  const bottom = SOURCE.q41.bottom;
  const w = 132, h = 74, gap = 22;
  const start = 960 - (6 * w + 5 * gap) / 2;
  for (let i = 0; i < 6; i++) {
    const x = start + i * (w + gap);
    rect(L, x, 610, w, h, t, i === 4 && !revealAnswer ? CHALK.green : CHALK.white, 4, i);
    line(L, [x + w / 2, 610], [x + w / 2, 610 + h], t, CHALK.white, 3, 20 + i);
    label(L, String(i + 1), x + w / 2, 725, t, { size: 30, color: CHALK.blue });
    const a = i === 4 && !revealAnswer ? 0 : top[i];
    const b = i === 4 && !revealAnswer ? 0 : bottom[i];
    pip(L, x + w / 4, 647, a, t, 9);
    pip(L, x + 3 * w / 4, 647, b, t, 9);
  }
}

function triangularFigures(L, t, final = false) {
  const sizes = final ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3];
  const startX = final ? 570 : 620;
  const cell = final ? 45 : 56;
  sizes.forEach((n, idx) => {
    const cx = final ? startX + idx * 130 : startX + idx * 340;
    const rows = final ? n : idx + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= r; c++) {
        const x = cx + (c - r / 2) * cell;
        const y = 735 + (r - (rows - 1) / 2) * cell * 0.78;
        triangle(L, x - cell / 2, y - cell / 2, cell, clamp01(t * (rows + 1) - (r + c) * 0.18),
          CHALK.white, idx * 17 + r * 3 + c);
        line(L, [x - cell * 0.34, y + cell * 0.06], [x + cell * 0.34, y - cell * 0.38],
          clamp01(t * 1.6), CHALK.yellow, 2, idx * 13 + r + c);
      }
    }
    label(L, String(final ? SOURCE.q42.counts[idx] : n * (n + 1) / 2), cx, 890, t,
      { size: final ? 30 : 36, color: CHALK.blue });
  });
}

function triangleLattice7(L, t) {
  const rows = 7, size = 40, rowStep = 38;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= r; c++) {
      const cx = 960 + (c - r / 2) * size;
      const y = 590 + r * rowStep;
      triangle(L, cx - size / 2, y, size, clamp01(t * 1.15 - (r + c) * 0.012),
        CHALK.white, r * 9 + c);
      line(L, [cx - size * 0.34, y + size * 0.72], [cx + size * 0.34, y + size * 0.28],
        clamp01(t * 1.4 - (r + c) * 0.01), CHALK.yellow, 2, 60 + r * 9 + c);
    }
  }
}

function shape(L, kind, x, y, size, t, filled = false, seed = 0) {
  if (kind === 'circle') {
    L.loop(x + size / 2, y + size / 2, size * 0.44, size * 0.44,
      { t, color: CHALK.white, width: 4, seed });
    if (filled) L.dot(x + size / 2, y + size / 2, size * 0.2, { t, color: CHALK.yellow });
  } else if (kind === 'triangle') {
    triangle(L, x + size * 0.05, y + size * 0.05, size * 0.9, t, CHALK.white, seed);
    if (filled) hatch(L, x + size * 0.28, y + size * 0.48, size * 0.44, size * 0.28, t,
      { count: 4, seed });
  } else {
    rect(L, x + size * 0.12, y + size * 0.12, size * 0.76, size * 0.76, t, CHALK.white, 4, seed);
    if (filled) hatch(L, x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6, t,
      { count: 5, seed });
  }
}

function matrix43(L, t, answer = false) {
  const x0 = 360, y0 = 575, cw = 300, ch = 145;
  const top = [
    ['circle', 'square', false], ['triangle', 'circle', true],
    ['square', 'triangle', false], ['circle', 'triangle', true],
  ];
  const bottom = [
    ['square', 'circle', true], ['circle', 'triangle', false],
    ['triangle', 'square', true], ['triangle', 'circle', false],
  ];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const x = x0 + c * cw, y = y0 + r * ch;
    rect(L, x, y, cw, ch, t, CHALK.white, 3, r * 8 + c);
    if (r === 1 && c === 2 && !answer) {
      label(L, 'A', x + cw / 2, y + ch / 2 + 16, t, { size: 60, color: CHALK.yellow });
      continue;
    }
    const [outer, inner, filled] = (r ? bottom : top)[c];
    shape(L, outer, x + 18, y + 22, 100, t, false, c + r * 10);
    shape(L, inner, x + 142, y + 40, 65, t, filled, c + r * 10 + 3);
  }
}

function numberTable(L, t, solved = false) {
  const rows = solved
    ? [['8', '16', '12'], ['10', '20', '16'], ['13', '26', '22'], ['15', '30', '26']]
    : [['A', '16', '12'], ['10', '20', 'C'], ['13', 'B', '22'], ['15', '30', '26']];
  const x0 = 625, y0 = 520, cw = 200, ch = 75;
  rows.forEach((row, r) => row.forEach((v, c) => {
    const x = x0 + c * cw, y = y0 + r * ch;
    rect(L, x, y, cw, ch, t, c === 1 ? CHALK.blue : CHALK.white, 3, r * 3 + c);
    label(L, v, x + cw / 2, y + 52, t, { size: 43, color: v === 'A' || v === 'B' || v === 'C' ? CHALK.yellow : CHALK.white });
    if (c < 2) L.arrow([x + cw + 10, y + ch / 2], [x + cw + 65, y + ch / 2],
      { t, color: CHALK.yellow, width: 4, seed: r * 3 + c, head: 16 });
  }));
}

function shadePolygon(L, x, y, size, vertices, t, seed) {
  const points = vertices.map(([px, py]) => [x + px * size, y + py * size]);
  const low = Math.min(...points.map((point) => point[1]));
  const high = Math.max(...points.map((point) => point[1]));
  for (let i = 1; i <= 5; i++) {
    const scanY = low + ((high - low) * i) / 6;
    const hits = [];
    for (let j = 0; j < points.length; j++) {
      const a = points[j], b = points[(j + 1) % points.length];
      if ((a[1] <= scanY && b[1] > scanY) || (b[1] <= scanY && a[1] > scanY)) {
        hits.push(a[0] + ((scanY - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
      }
    }
    if (hits.length >= 2) {
      hits.sort((a, b) => a - b);
      line(L, [hits[0], scanY], [hits[hits.length - 1], scanY],
        clamp01(t * 6 - i + 1), CHALK.yellow, 3, seed + i);
    }
  }
}

function diagonalGrid(L, x, y, size, t, seed) {
  const step = size / 3;
  for (let k = -3; k <= 3; k++) {
    const offset = k * step;
    for (const slope of [1, -1]) {
      const hits = [];
      const add = (px, py) => {
        if (px >= -0.001 && px <= size + 0.001 && py >= -0.001 && py <= size + 0.001
          && !hits.some(([hx, hy]) => Math.hypot(hx - px, hy - py) < 0.01)) hits.push([px, py]);
      };
      if (slope === 1) {
        add(0, offset); add(size, size + offset); add(-offset, 0); add(size - offset, size);
      } else {
        add(0, offset); add(size, offset - size); add(offset, 0); add(offset - size, size);
      }
      if (hits.length >= 2) {
        line(L, [x + hits[0][0], y + hits[0][1]], [x + hits[1][0], y + hits[1][1]],
          t, CHALK.white, 2, seed + k + (slope === 1 ? 10 : 20));
      }
    }
  }
}

function pattern45(L, t, solved = false) {
  const start = 525, size = 145, gap = 35, y = 610, third = 1 / 3;
  const regions = [
    [[0, 0], [third, 0], [0, third]],
    [[0, third], [third, 0], [2 * third, third], [third, 2 * third]],
    [[0, 2 * third], [third, 1], [0, 1]],
    [[third, 2 * third], [2 * third, third], [1, 2 * third], [2 * third, 1]],
    [[2 * third, 1], [1, 2 * third], [1, 1]],
  ];
  for (let k = 0; k < 5; k++) {
    const x = start + k * (size + gap);
    const blank = k === 3 && !solved;
    rect(L, x, y, size, size, t, blank ? CHALK.green : CHALK.white, 3, k);
    if (!blank) {
      diagonalGrid(L, x, y, size, t, k * 30);
      for (let i = 0; i <= Math.min(k, 4); i++) {
        shadePolygon(L, x, y, size, regions[i], t, k * 20 + i);
      }
    } else {
      label(L, '?', x + size / 2, y + size * 0.63, t, { size: 54, color: CHALK.green });
    }
    label(L, blank ? 'A' : String(k + 1), x + size / 2, y + size + 42, t,
      { size: 30, color: blank ? CHALK.yellow : CHALK.blue });
  }
  if (solved) rect(L, start + 3 * (size + gap) - 8, y - 8,
    size + 16, size + 16, t, CHALK.yellow, 5, 45);
}

function triangle46(L, t, solution = false) {
  const A = [960, 500], B = [680, 850], C = [1240, 850];
  const D = [820, 675], E = [1100, 675], M = [960, 850], O = [960, 675];
  [[A, B], [A, C], [B, C], [D, E], [A, M], [D, M], [E, M],
    [D, [750, 850]], [E, [1170, 850]]]
    .forEach(([p, q], i) => line(L, p, q, t, CHALK.white, 4, i));
  L.dashed([960, 500], [960, 850], { t, color: CHALK.blue, width: 3, on: 10, off: 8 });
  if (solution) {
    label(L, '12 tam giác', 960, 895, t, { size: 36, color: CHALK.blue });
    label(L, 'Ghép thành 6 cặp rời nhau', 960, 945, t, { size: 30, color: CHALK.yellow });
    for (let i = 0; i < 6; i++) {
      const x = 555 + i * 138, y = 980;
      rect(L, x, y, 120, 68, t, CHALK.yellow, 3, 460 + i);
      for (let j = 0; j < 2; j++) {
        const cx = x + 40 + j * 40, top = y + 16, base = y + 51;
        line(L, [cx, top], [cx - 15, base], t, CHALK.white, 3, 470 + i * 2 + j);
        line(L, [cx, top], [cx + 15, base], t, CHALK.white, 3, 480 + i * 2 + j);
        line(L, [cx - 15, base], [cx + 15, base], t, CHALK.white, 3, 490 + i * 2 + j);
      }
    }
  }
}

function grid47(L, x, y, t, cells, labelText, missing = false) {
  const w = 150, h = 90, cw = w / 3, rh = h / 2;
  rect(L, x, y, w, h, t, missing ? CHALK.green : CHALK.white, 3, x);
  for (let c = 1; c < 3; c++) line(L, [x + c * cw, y], [x + c * cw, y + h], t, CHALK.white, 2, c);
  line(L, [x, y + rh], [x + w, y + rh], t, CHALK.white, 2, 8);
  cells.forEach((idx) => {
    const r = Math.floor(idx / 3), c = idx % 3;
    hatch(L, x + c * cw + 2, y + r * rh + 2, cw - 4, rh - 4, t,
      { count: 3, color: CHALK.yellow, seed: idx + 19 });
  });
  label(L, labelText, x + w / 2, y + h + 38, t, { size: 25, color: missing ? CHALK.yellow : CHALK.blue });
}

function gridSequence47(L, t, answer = false) {
  const figures = [
    [0, 1, 3], [1, 3, 4], [1, 2, 4], [2, 4, 5],
    answer ? [0, 2, 5] : [], [0, 3, 5],
  ];
  figures.forEach((cells, i) => grid47(L, 290 + i * 260, 625, t, cells, String(i + 1), i === 4 && !answer));
  if (answer) rect(L, 290 + 4 * 260 - 8, 625 - 8, 166, 106, t, CHALK.yellow, 5, 47);
}

function rectangleMirror(L, t, answer = false) {
  const x = 690, y = 610, w = 420, h = 210;
  rect(L, x, y, w, h, t, CHALK.white, 5, 1);
  L.dashed([x + w * 0.42, y + h + 90], [x + w + 50, y - 60],
    { t, color: CHALK.blue, width: 4, on: 14, off: 10 });
  if (answer) {
    rect(L, x + w * 0.42, y, w * 0.58, h + 200, t, CHALK.yellow, 5, 7);
    label(L, 'Ảnh ban đầu', x + 130, y + h + 55, t, { size: 30, color: CHALK.white });
    label(L, 'Ảnh gương', x + w + 20, y + h + 145, t, { size: 30, color: CHALK.yellow });
  }
}

function cube(L, x, y, w, d, h, t, seed) {
  const frontTopL = [x, y - h], frontTopR = [x + w, y - h];
  const frontBotL = [x, y], frontBotR = [x + w, y];
  const backTopL = [x + d, y - h - d * 0.55], backTopR = [x + w + d, y - h - d * 0.55];
  const backBotR = [x + w + d, y - d * 0.55];
  L.poly([frontTopL, frontTopR, backTopR, backTopL, frontTopL],
    { t, color: CHALK.white, width: 3, seed, amp: 0.8 });
  L.poly([frontTopR, frontBotR, backBotR, backTopR],
    { t, color: CHALK.blue, width: 3, seed: seed + 1, amp: 0.8 });
  L.poly([frontTopL, frontTopR, frontBotR, frontBotL, frontTopL],
    { t, color: CHALK.white, width: 3, seed: seed + 2, amp: 0.8 });
}

function cubes49(L, t) {
  const w = 112, d = 60, h = 92, x0 = 700, y0 = 820;
  for (let j = 1; j >= 0; j--) for (let i = 0; i < 3; i++) {
    const x = x0 + (i - j) * d;
    const y = y0 - j * d * 0.55;
    cube(L, x, y, w, d, h, t, i + j * 4);
  }
  for (const i of [0, 2]) {
    const j = 1;
    const x = x0 + (i - j) * d;
    const y = y0 - j * d * 0.55 - h;
    cube(L, x, y, w, d, h, t, 12 + i);
  }
}

function questionDiagram(L, number, t) {
  if (number === 41) dominoes(L, t);
  if (number === 42) triangularFigures(L, t);
  if (number === 43) matrix43(L, t);
  if (number === 44) numberTable(L, t);
  if (number === 45) pattern45(L, t);
  if (number === 46) triangle46(L, t);
  if (number === 47) gridSequence47(L, t);
  if (number === 48) {
    label(L, '100, 101, 102, …, 199, 200', 960, 700, t, { size: 56 });
    label(L, 'Hàng trăm  ·  hàng chục  ·  hàng đơn vị', 960, 790, t, { size: 36, color: CHALK.blue });
  }
  if (number === 49) cubes49(L, t);
  if (number === 50) rectangleMirror(L, t);
}

function solutionDiagram(L, number, t) {
  if (number === 41) dominoes(L, t, true);
  if (number === 42) triangleLattice7(L, t);
  if (number === 43) matrix43(L, t, true);
  if (number === 44) numberTable(L, t, true);
  if (number === 45) pattern45(L, t, true);
  if (number === 46) {
    triangle46(L, t, true);
  }
  if (number === 47) gridSequence47(L, t, true);
  if (number === 48) {
    label(L, '100–199', 690, 680, t, { size: 50 });
    label(L, '10 số 0 ở hàng chục  +  10 ở hàng đơn vị', 960, 760, t, { size: 38, color: CHALK.blue });
    label(L, '200  →  thêm 2 số 0', 960, 850, t, { size: 44 });
  }
  if (number === 49) cubes49(L, t);
  if (number === 50) rectangleMirror(L, t, true);
}

function question(ctx, problem, p) {
  const L = ctx.chalk(60);
  label(L, `Câu ${problem.number} · ${problem.title}`, 960, 150, g(p, 'title'),
    { size: 68, color: CHALK.yellow });
  writeRows(L, problem.questionLines, 265, g(p, 'statement'), 48);
  questionDiagram(L, problem.number, g(p, 'diagram'));
  thinkingDots(L, 960, 990, g(p, 'think'));
}

function explain(ctx, problem, p) {
  const L = ctx.chalk(60);
  label(L, `Câu ${problem.number} · Lời giải`, 960, 150, g(p, 'heading'),
    { size: 64, color: CHALK.yellow });
  writeRows(L, problem.solutionLines, 265, g(p, 'steps'), 45);
  solutionDiagram(L, problem.number, g(p, 'diagram'));
}

function answer(ctx, problem, p) {
  const L = ctx.chalk(60);
  label(L, `Câu ${problem.number}`, 960, 205, g(p, 'heading'), { size: 58, color: CHALK.blue });
  const size = problem.answer.length > 38 ? 61 : 78;
  label(L, problem.answer, 960, 460, g(p, 'result'),
    { size, color: CHALK.yellow });
  const k = spring(g(p, 'result'), 3.2, 6);
  if (k > 0) L.loop(960, 430, Math.min(780, problem.answer.length * size * 0.28) * k,
    74 * k, { t: g(p, 'circle'), color: CHALK.yellow, width: 5, seed: problem.number });
  solutionDiagram(L, problem.number, g(p, 'diagram'));
}

export function createProblemScenes(problem, previous) {
  return {
    ...(previous ? { from_prev: previous } : {}),
    beat1(ctx, p) { question(ctx, problem, p); },
    intro(ctx, p) { solutionIntro(ctx.chalk(60), 'Sau đây là cách giải.', g(p, 'phrase')); },
    beat2(ctx, p) { explain(ctx, problem, p); },
    answer(ctx, p) { answer(ctx, problem, p); },
  };
}
