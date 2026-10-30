// Câu 40. Mê cung số: đi qua các ô có số chia 9 dư 2, bắt đầu từ ô 2 ở góc trên trái.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, numTile, popLabel, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene9/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: lưới trong đề (4 hàng × 6 cột), lối ra A-D ở bên phải mỗi hàng ----------------------
const GRID = [
  [2, 75, 64, 88, 74, 20],
  [83, 42, 16, 29, 65, 27],
  [38, 56, 47, 92, 49, 11],
  [55, 31, 73, 13, 58, 94],
];
const EXITS = ['A', 'B', 'C', 'D'];
const ROWS = GRID.length;
const COLS = GRID[0].length;
const OK = (v) => v % 9 === 2;

const ok = GRID.map((r) => r.map(OK));
const REM2 = GRID.flat().filter(OK).sort((a, b) => a - b);
// đi sang ô kề cạnh (trên, dưới, trái, phải), chỉ qua ô chia 9 dư 2
function walk() {
  const seen = new Map([['0,0', null]]);
  const queue = [[0, 0]];
  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || !ok[nr][nc] || seen.has(`${nr},${nc}`)) continue;
      seen.set(`${nr},${nc}`, [r, c]);
      queue.push([nr, nc]);
    }
  }
  return seen;
}
const REACH = walk();
const EXIT_ROWS = [...REACH.keys()].map((k) => k.split(',').map(Number)).filter(([, c]) => c === COLS - 1).map(([r]) => r);
function pathTo(r, c) {
  const out = [];
  for (let at = [r, c]; at; at = REACH.get(`${at[0]},${at[1]}`)) out.unshift(at);
  return out;
}
const EXIT_ROW = EXIT_ROWS[0];
const PATH = pathTo(EXIT_ROW, COLS - 1);
const TRAP = [2, 5]; // số 11: chia 9 dư 2 nhưng không đi tới được

console.assert(REM2.join() === '2,11,20,29,38,47,56,65,74,83,92'
  && REM2.every((v, i) => v === 2 + 9 * i), 'Câu 40: các số chia 9 dư 2 là 2, 11, 20, ..., 92 (cách nhau 9)');
console.assert(EXIT_ROWS.length === 1 && EXITS[EXIT_ROW] === 'A', 'Câu 40: chỉ ra được lối A');
console.assert(PATH.map(([r, c]) => GRID[r][c]).join() === '2,83,38,56,47,92,29,65,74,20',
  'Câu 40: đường đi 2, 83, 38, 56, 47, 92, 29, 65, 74, 20');
console.assert(ok[TRAP[0]][TRAP[1]] && !REACH.has(`${TRAP[0]},${TRAP[1]}`), 'Câu 40: ô 11 dư 2 nhưng bị bao quanh');
console.assert(PATH.length === 10, 'Câu 40: đường đi qua 10 ô');

// --- vị trí trên bảng ------------------------------------------------------------------------------
const CX = (c) => 600 + c * 170;
const CY = (r) => 470 + r * 120;
const centre = ([r, c]) => [CX(c), CY(r)];
const SC = 0.85;

function cellTile(objs, r, c, lit, u = 1) {
  const q = pop(u);
  if (q.scale <= 0) return;
  const v = GRID[r][c];
  numTile(objs, CX(c), CY(r), String(v), lit ? 'dec' : 'int',
    { scale: SC * q.scale, squash: q.squash, digits: String(v).length });
}

// đoạn đường từ cell a đến b (chỉ số trong PATH), vẽ đến tỉ lệ u
function pathPoints(from, to) {
  return PATH.slice(from, to + 1).map(centre);
}
function partial(points, u) {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let left = clamp01(u) * lens.reduce((a, b) => a + b, 0);
  const out = [points[0]];
  for (let i = 0; i < lens.length; i++) {
    if (left >= lens[i]) { out.push(points[i + 1]); left -= lens[i]; continue; }
    const k = left / lens[i];
    out.push([points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k]);
    break;
  }
  return out;
}
const SEGMENTS = [[0, 2], [2, 5], [5, 7], [7, 9]];

function exits(L, p, hotT) {
  EXITS.forEach((name, r) => {
    const t = g(p, 'exits');
    const hot = r === EXIT_ROW && hotT > 0;
    L.arrow([1530, CY(r)], [1580, CY(r)], { color: hot ? YELLOW : undefined, width: 6, t });
    L.text(name, 1625, CY(r) + 20, { size: hot ? 66 : 52, align: 'center', color: hot ? YELLOW : undefined, t });
  });
}

function startMark(L, t) {
  L.text('Xuất phát', 440, 385, { size: 36, align: 'center', color: YELLOW, t });
  L.arrow([600, 340], [600, 408], { color: YELLOW, width: 7, t });
}

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('40. Mê cung số', 960, 105, { size: 62, align: 'center', t: g(p, 'title') });
    L.text('Bắt đầu từ số đầu tiên, hãy đi theo đường có ô vuông chứa một số', 960, 185,
      { size: 40, align: 'center', t: g(p, 'question1') });
    L.text('mà khi chia cho 9 thì dư 2. Hỏi với các lối ra từ A đến D,', 960, 240,
      { size: 40, align: 'center', t: g(p, 'question2') });
    L.text('bạn nên chọn lối ra nào?', 960, 295, { size: 40, align: 'center', t: g(p, 'question3') });
    GRID.forEach((rw, r) => rw.forEach((_, c) => {
      cellTile(objs, r, c, false, stagger(g(p, 'grid'), r * COLS + c, ROWS * COLS, 0.3));
    }));
    startMark(L, g(p, 'start'));
    exits(L, p, 0);
    thinkingDots(L, 960, 975, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // các số chia 9 dư 2: 2, 11, 20, ..., 92
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Tìm các số chia 9 dư 2', 960, 105, { size: 60, align: 'center', t: g(p, 'heading') });
    row(L, ['Dạng', '9', { sym: 'times' }, 'k', '+', '2'], 960, 195, { size: 54, t: g(p, 'form'), seed: 4 });
    L.text(`${REM2.join(', ')}`, 960, 300, { size: 46, align: 'center', color: YELLOW, t: g(p, 'list') });
    L.text('mỗi số hơn số trước 9', 960, 355, { size: 36, align: 'center', t: g(p, 'step') });
    // các ô sáng lên theo thứ tự từ nhỏ đến lớn
    GRID.forEach((rw, r) => rw.forEach((v, c) => {
      const i = REM2.indexOf(v);
      const lit = i >= 0 && stagger(g(p, 'light'), i, REM2.length, 0.3) > 0.5;
      cellTile(objs, r, c, lit);
    }));
    exits(L, p, 0);
  },

  // đi theo đường các ô chia 9 dư 2
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Đi theo các ô vừa tô', 960, 105, { size: 60, align: 'center', t: g(p, 'heading') });
    GRID.forEach((rw, r) => rw.forEach((v, c) => cellTile(objs, r, c, OK(v))));
    startMark(L, 1);
    SEGMENTS.forEach(([a, b], k) => {
      const u = g(p, `seg${k + 1}`);
      const last = k === SEGMENTS.length - 1;
      const pts = pathPoints(a, b);
      if (last) pts.push([1500, CY(EXIT_ROW)]);
      if (u > 0) L.poly(partial(pts, u), { color: YELLOW, width: 10, seed: 30 + k, amp: 1.2 });
    });
    L.loop(CX(TRAP[1]), CY(TRAP[0]), 78, 62, { color: CHALK.red, width: 7, t: g(p, 'trap'), seed: 50 });
    exits(L, p, g(p, 'seg4'));
    popLabel(L, `Lối ra: ${EXITS[EXIT_ROW]}`, 960, 1000, g(p, 'answer'), { size: 90, color: YELLOW });
  },

  outro(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Cảm ơn các bạn đã theo dõi!', 960, 340,
      { size: 76, align: 'center', color: YELLOW, t: g(p, 'thanks') });
    L.text('Học cùng Phượng', 960, 500, { size: 94, align: 'center', t: g(p, 'follow') });
    L.text('Hãy theo dõi kênh Học cùng Phượng', 960, 650, { size: 64, align: 'center', t: g(p, 'follow') });
    L.text('để đón xem những video tiếp theo.', 960, 750, { size: 60, align: 'center', t: g(p, 'follow') });
  },
};
