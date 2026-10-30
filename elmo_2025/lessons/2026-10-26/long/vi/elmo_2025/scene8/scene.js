// Câu 38. Hình vẽ lại trên lưới chấm 5×5 (không phải bản sao điểm ảnh của đề). Chấm viền (B), chấm trong (I)
// được ĐẾM trực tiếp trên lưới; diện tích tính bằng công thức Shoelace rồi đối chiếu với I + B : 2 - 1.
// Đáp án D lấy từ đáp án chính thức ELMO 2025 khối 4 (xem story.md).
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, mark, popLabel } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene7/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const PINK = CHALK.pink;
const N = 4; // lưới 0..4

const SHAPES = {
  example: [[0, 2], [1, 4], [2, 3], [3, 4], [4, 2], [2, 0]],
  A: [[0, 4], [0, 2], [2, 0], [4, 2], [4, 4]],
  B: [[0, 2], [2, 4], [4, 2], [2, 0]],
  C: [[0, 4], [0, 1], [1, 1], [1, 2], [2, 2], [2, 1], [3, 1], [3, 4]],
  D: [[0, 1], [1, 3], [3, 4], [4, 2], [2, 0]],
};

// --- đếm trực tiếp trên lưới -------------------------------------------------------------
const shoelace = (poly) => Math.abs(poly.reduce((s, [x1, y1], i) => {
  const [x2, y2] = poly[(i + 1) % poly.length];
  return s + x1 * y2 - x2 * y1;
}, 0)) / 2;
const onSegment = ([px, py], [ax, ay], [bx, by]) => (bx - ax) * (py - ay) === (by - ay) * (px - ax)
  && px >= Math.min(ax, bx) && px <= Math.max(ax, bx) && py >= Math.min(ay, by) && py <= Math.max(ay, by);
function insidePoly([px, py], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function lattice(poly) {
  const boundary = [];
  const interior = [];
  for (let y = 0; y <= N; y++) {
    for (let x = 0; x <= N; x++) {
      if (poly.some((a, i) => onSegment([x, y], a, poly[(i + 1) % poly.length]))) boundary.push([x, y]);
      else if (insidePoly([x, y], poly)) interior.push([x, y]);
    }
  }
  const cx = boundary.reduce((s, q) => s + q[0], 0) / boundary.length;
  const cy = boundary.reduce((s, q) => s + q[1], 0) / boundary.length;
  boundary.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
  return { boundary, interior };
}
const INFO = {};
for (const [name, poly] of Object.entries(SHAPES)) {
  const { boundary, interior } = lattice(poly);
  INFO[name] = { boundary, interior, B: boundary.length, I: interior.length, area: shoelace(poly) };
}
const REF = INFO.example.area;
const MATCHES = ['A', 'B', 'C', 'D'].filter((k) => INFO[k].area === REF);

for (const [name, q] of Object.entries(INFO)) {
  console.assert(q.I + q.B / 2 - 1 === q.area, `Câu 38: Pick không khớp Shoelace ở hình ${name}`);
}
console.assert(REF === 9 && INFO.example.B === 8 && INFO.example.I === 6, 'Câu 38: ví dụ B=8, I=6, diện tích 9');
console.assert(['A', 'B', 'C', 'D'].map((k) => `${INFO[k].B}/${INFO[k].I}/${INFO[k].area}`).join() === '12/7/12,8/5/8,14/2/8,6/7/9',
  'Câu 38: B/I/diện tích của A, B, C, D');
console.assert(MATCHES.join() === 'D', 'Câu 38: chỉ hình D bằng hình ví dụ');

// --- lưới chấm ----------------------------------------------------------------------------------
const popped = (prog, n) => Array.from({ length: n }, (_, k) => stagger(prog, k, n, 0.35)).filter((u) => u > 0).length;

// t: vẽ lưới rồi hình; cb, ci: tô chấm viền (hồng) và chấm trong (vàng) lần lượt
function gridShape(L, { x0, y0, size, name, t = 1, cb = 0, ci = 0, color, label, labelT = 1, seed = 0 }) {
  const cell = size / N;
  const at = ([c, r]) => [x0 + c * cell, y0 + size - r * cell];
  const gridT = clamp01(t / 0.45);
  const shapeT = clamp01((t - 0.35) / 0.65);
  L.rect(x0 - cell * 0.35, y0 - cell * 0.35, x0 + size + cell * 0.35, y0 + size + cell * 0.35,
    { width: 3, t: gridT, seed });
  for (let r = 0; r <= N; r++) {
    for (let c = 0; c <= N; c++) {
      const [x, y] = at([c, r]);
      L.dot(x, y, Math.max(3, size * 0.014), { t: gridT });
    }
  }
  const pts = SHAPES[name].map(at);
  L.poly([...pts, pts[0]], { color, width: Math.max(4, size * 0.02), t: shapeT, seed: seed + 3 });
  const { boundary, interior } = INFO[name];
  boundary.forEach((q, k) => {
    const u = stagger(cb, k, boundary.length, 0.35);
    if (u > 0) L.dot(...at(q), Math.max(7, size * 0.03), { color: PINK, t: u });
  });
  interior.forEach((q, k) => {
    const u = stagger(ci, k, interior.length, 0.35);
    if (u > 0) L.dot(...at(q), Math.max(7, size * 0.03), { color: YELLOW, t: u });
  });
  if (label) L.text(label, x0 + size / 2, y0 + size + cell * 0.35 + 46, { size: 38, align: 'center', color, t: labelT });
}

const OPTIONS = ['A', 'B', 'C', 'D'];
const calcParts = (q) => [String(q.I), '+', String(q.B / 2), { sym: 'minus' }, '1', '=', String(q.area)];

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('38. So sánh diện tích', 960, 100, { size: 62, align: 'center', t: g(p, 'title') });
    L.text('Hình nào có diện tích bằng với hình ví dụ?', 960, 185,
      { size: 48, align: 'center', t: g(p, 'question') });
    gridShape(L, { x0: 850, y0: 250, size: 220, name: 'example', t: g(p, 'ex'), label: 'Ví dụ', labelT: g(p, 'ex'), seed: 10 });
    OPTIONS.forEach((name, i) => {
      const u = stagger(g(p, 'opts'), i, 4, 0.5);
      gridShape(L, { x0: 470 + i * 270, y0: 580, size: 200, name, t: u, label: name, labelT: u, seed: 20 + i * 5 });
    });
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // đếm chấm trên hình ví dụ
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    const ex = INFO.example;
    L.text('Đếm chấm trên lưới', 960, 115, { size: 60, align: 'center', t: g(p, 'heading') });
    gridShape(L, { x0: 190, y0: 230, size: 480, name: 'example', t: 1, cb: g(p, 'cb'), ci: g(p, 'ci'), label: 'Ví dụ', seed: 30 });
    const nb = popped(g(p, 'cb'), ex.B);
    const ni = popped(g(p, 'ci'), ex.I);
    L.text(`Chấm trên viền: B = ${nb}`, 900, 300, { size: 54, color: PINK, t: g(p, 'bText') });
    L.text(`Chấm bên trong: I = ${ni}`, 900, 420, { size: 54, color: YELLOW, t: g(p, 'iText') });
    row(L, ['Diện tích', '=', 'I', '+', 'B : 2', { sym: 'minus' }, '1'], 900, 580,
      { size: 58, align: 'left', t: g(p, 'formula'), seed: 4 });
    row(L, calcParts(ex).map((s) => (typeof s === 'string' ? { s, color: YELLOW } : s)), 900, 710,
      { size: 70, align: 'left', t: g(p, 'calc'), seed: 6 });
    popLabel(L, `Ví dụ: diện tích ${REF}`, 1300, 880, g(p, 'result'), { size: 64 });
  },

  // đếm từng hình A-D, so với 9
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    L.text(`Ví dụ: diện tích ${REF}`, 960, 115, { size: 58, align: 'center', color: YELLOW, t: g(p, 'ref') });
    OPTIONS.forEach((name, i) => {
      const q = INFO[name];
      const x0 = 175 + i * 450;
      const win = name === 'D';
      const cx = x0 + 150;
      gridShape(L, { x0, y0: 200, size: 300, name, t: 1, cb: g(p, `cb${name}`), ci: g(p, `ci${name}`),
        color: win ? YELLOW : undefined, label: name, seed: 40 + i * 5 });
      L.text(`B = ${popped(g(p, `cb${name}`), q.B)}`, cx, 650, { size: 42, align: 'center', color: PINK, t: g(p, `cb${name}`) });
      L.text(`I = ${popped(g(p, `ci${name}`), q.I)}`, cx, 705, { size: 42, align: 'center', color: YELLOW, t: g(p, `ci${name}`) });
      row(L, calcParts(q).map((s) => (typeof s === 'string' ? { s, color: win ? YELLOW : undefined } : s)),
        cx, 785, { size: 46, t: g(p, `tx${name}`), seed: 50 + i });
      mark(L, win, cx, 880, g(p, `mk${name}`), { size: 66, seed: 60 + i });
    });
    popLabel(L, `Đáp án: ${MATCHES[0]}`, 960, 1010, g(p, 'answer'), { size: 76, color: YELLOW });
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
