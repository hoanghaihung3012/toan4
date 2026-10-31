// Câu 41. Tổng các số trên mỗi đường bằng 32; tìm A và B, tính A - B.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const SUM = 32;
const LEFT = 12;
const RIGHT = 9;
const BOTTOM = 5;
const B = SUM - LEFT - RIGHT;
const A = SUM - B - BOTTOM;
console.assert(B === 11 && A === 16, 'Câu 41: B = 11, A = 16');
console.assert(LEFT + B + RIGHT === SUM && A + B + BOTTOM === SUM, 'Câu 41: cả hai đường cộng bằng 32');
console.assert(A - B === 5, 'Câu 41: đáp số A - B = 5');

const WHITE = CHALK.white;
const YELLOW = CHALK.yellow;

// --- hình chữ thập: 5 vòng tròn nối bằng hai đường ------------------------------------
// ô: [tên, dx, dy]
const NODES = [
  ['A', 0, -1],
  ['12', -1, 0],
  ['B', 0, 0],
  ['9', 1, 0],
  ['5', 0, 1],
];
const VALUE = { A, B };

function ring(L, cx, cy, r, color, seed) {
  const pts = [];
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  L.poly(pts, { color, width: 6, seed, amp: 0.9 });
}

// reveal: tiến độ thay chữ bằng số, theo tên ô ('A' hoặc 'B')
function cross(L, cx, cy, d, r, size, { appear = 1, reveal = {} } = {}) {
  NODES.forEach(([name, dx, dy], i) => {
    const x = cx + dx * d;
    const y = cy + dy * d;
    const u = pop(stagger(appear, i, NODES.length, 0.45)).scale;
    if (u <= 0) return;
    const k = reveal[name] || 0;
    const known = k > 0;
    const label = known ? String(VALUE[name]) : name;
    const q = known && k < 1 ? pop(k).scale : 1;
    if (dx !== 0 || dy !== 0) {
      const sx = Math.sign(dx);
      const sy = Math.sign(dy);
      L.line([cx + sx * r * u, cy + sy * r * u], [x - sx * r * u, y - sy * r * u],
        { color: WHITE, width: 6, t: clamp01(appear * 2), seed: 10 + i });
    }
    ring(L, x, y, r * u, WHITE, 20 + i);
    L.text(label, x, y + size * 0.34, { size, align: 'center', color: known ? YELLOW : WHITE, scale: u * q });
  });
}

// khung vàng quanh một đường: ngang (12, B, 9) hoặc dọc (A, B, 5)
function frameLine(L, cx, cy, d, r, horizontal, t) {
  const m = r + 18;
  if (horizontal) L.rect(cx - d - m, cy - m, cx + d + m, cy + m, { color: YELLOW, width: 6, t, seed: 41 });
  else L.rect(cx - m, cy - d - m, cx + m, cy + d + m, { color: YELLOW, width: 6, t, seed: 42 });
}

// bố cục của đề (hình bên phải) và của lời giải (hình bên trái)
const Q = { cx: 1420, cy: 560, d: 190, r: 64, size: 70 };
const S = { cx: 470, cy: 560, d: 200, r: 70, size: 76 };
const EQ_X = 1330;

export const scenes = {
  opening(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Chào mừng các bạn!', 960, 330, { size: 78, align: 'center', t: g(p, 'welcome') });
    L.text('Học cùng Phượng', 960, 500, { size: 96, align: 'center', color: YELLOW, t: g(p, 'channel') });
    L.text('Giải đề thi ELMO 2023', 960, 660, { size: 76, align: 'center', t: g(p, 'title') });
  },

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('41. Tổng trên mỗi đường', 960, 150, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Khi tổng các số trên mỗi đường', 90, 380, { size: 62, t: g(p, 'q1') });
    L.text('bằng 32, hãy tìm các số đúng', 90, 490, { size: 62, t: g(p, 'q2') });
    L.text('sẽ điền vào A và B.', 90, 600, { size: 62, t: g(p, 'q3') });
    row(L, ['Giá trị của A', { sym: 'minus' }, 'B là bao nhiêu?'], 90, 710,
      { size: 62, align: 'left', gap: 0.3, t: g(p, 'q4'), seed: 4 });
    cross(L, Q.cx, Q.cy, Q.d, Q.r, Q.size, { appear: g(p, 'figure') });
    thinkingDots(L, 700, 920, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // đường ngang: 12 + B + 9 = 32
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    frameLine(L, S.cx, S.cy, S.d, S.r, true, g(p, 'frame'));
    cross(L, S.cx, S.cy, S.d, S.r, S.size, { appear: g(p, 'figure'), reveal: { B: g(p, 'b11') > 0 ? g(p, 'b11') : 0 } });
    row(L, [String(LEFT), '+', 'B', '+', String(RIGHT), '=', String(SUM)], EQ_X, 380,
      { size: 70, t: g(p, 'eq1'), seed: 1 });
    row(L, ['B', '=', String(SUM), { sym: 'minus' }, String(LEFT), { sym: 'minus' }, String(RIGHT), '=',
      { s: String(B), color: YELLOW }], EQ_X, 560, { size: 70, t: g(p, 'eq2'), seed: 2 });
  },

  // đường dọc: A + B + 5 = 32
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    frameLine(L, S.cx, S.cy, S.d, S.r, false, g(p, 'frame'));
    cross(L, S.cx, S.cy, S.d, S.r, S.size, {
      appear: g(p, 'figure'), reveal: { B: 1, A: g(p, 'a16') > 0 ? g(p, 'a16') : 0 },
    });
    row(L, ['A', '+', String(B), '+', String(BOTTOM), '=', String(SUM)], EQ_X, 380,
      { size: 70, t: g(p, 'eq1'), seed: 1 });
    row(L, ['A', '=', String(SUM), { sym: 'minus' }, String(B), { sym: 'minus' }, String(BOTTOM), '=',
      { s: String(A), color: YELLOW }], EQ_X, 560, { size: 70, t: g(p, 'eq2'), seed: 2 });
  },

  // đáp số: A - B = 16 - 11 = 5
  beat4(ctx, p) {
    const L = ctx.chalk(60);
    cross(L, S.cx, S.cy, S.d, S.r, S.size, { appear: g(p, 'figure'), reveal: { A: 1, B: 1 } });
    const xs = row(L, [
      'A', { sym: 'minus' }, 'B', '=', String(A), { sym: 'minus' }, String(B), '=',
      { s: String(A - B), color: YELLOW },
    ], EQ_X, 560, { size: 80, t: g(p, 'answer'), gap: 0.6, seed: 9 });
    L.loop(xs[8] + 4, 560 - 30, 54, 62, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
