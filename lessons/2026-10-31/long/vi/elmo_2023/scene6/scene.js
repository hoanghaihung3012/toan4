// Câu 46. Bóng đèn quanh ngôi sao có mỗi cạnh 15 cm, cách nhau 3 cm, bắt đầu từ A: cần bao nhiêu bóng đèn.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene5/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const SIDE = 15; // cm
const GAP = 3; // cm giữa hai bóng
const SIDES = 10; // ngôi sao 5 cánh có 10 cạnh
const PER_SIDE = SIDE / GAP;
const GAPS = SIDES * PER_SIDE;
const BULBS = GAPS; // đi một vòng kín về A: số bóng bằng số khoảng
console.assert(PER_SIDE === 5 && GAPS === 50 && BULBS === 50, 'Câu 46: 15 : 3 = 5, 10 × 5 = 50');

// --- ngôi sao 5 cánh vẽ phấn: 10 đỉnh xen kẽ ngoài, trong -------------------------------------
const INNER = 0.381966; // tỉ lệ bán kính trong / ngoài của ngôi sao đều
function vertices(cx, cy, R) {
  return Array.from({ length: SIDES }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? R : R * INNER;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}
// vị trí bóng thứ k tính từ A đi theo chiều kim đồng hồ
function bulb(vs, k) {
  const side = Math.floor(k / PER_SIDE);
  const u = (k % PER_SIDE) / PER_SIDE;
  const [x0, y0] = vs[side];
  const [x1, y1] = vs[(side + 1) % SIDES];
  return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u];
}
{
  const vs = vertices(0, 0, 100);
  const len = (i) => Math.hypot(vs[(i + 1) % SIDES][0] - vs[i][0], vs[(i + 1) % SIDES][1] - vs[i][1]);
  console.assert(vs.every((_, i) => Math.abs(len(i) - len(0)) < 1e-6), 'Câu 46: 10 cạnh bằng nhau');
}

function star(L, vs, t, seed) {
  L.poly([...vs, vs[0]], { width: 6, t, seed, amp: 1 });
}

const Q = { cx: 1450, cy: 620, R: 260 };
const S = { cx: 540, cy: 600, R: 300 };
const EQ_X = 1380;

export const scenes = {
  from_prev: previous.beat4,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('46. Bóng đèn quanh ngôi sao', 960, 130, { size: 72, align: 'center', t: g(p, 'title') });
    const lines = [
      ['Các bóng đèn được đặt xung quanh', 'q1'],
      ['một vật trang trí hình ngôi sao, mỗi cạnh dài 15 cm.', 'q2'],
      ['Các bóng đèn được đặt cách nhau 3 cm.', 'q3'],
      ['Bắt đầu từ A, cần bao nhiêu bóng đèn?', 'q4'],
    ];
    lines.forEach(([s, k], i) => L.text(s, 90, 340 + i * 90, { size: 46, t: g(p, k) }));
    const vs = vertices(Q.cx, Q.cy, Q.R);
    star(L, vs, g(p, 'star'), 5);
    // cạnh 15 cm: nét đứt song song với cạnh trái của đỉnh A
    const [ax, ay] = vs[0];
    const [bx, by] = vs[9];
    const tag = g(p, 'side');
    L.dashed([ax - 30, ay + 14], [bx - 30, by + 6], { color: YELLOW, width: 4, t: tag });
    L.text('15 cm', (ax + bx) / 2 - 130, (ay + by) / 2 + 16, { size: 40, color: YELLOW, t: tag });
    L.dot(ax, ay, 16, { color: YELLOW, t: g(p, 'bulbA') });
    L.text('A', ax + 40, ay - 8, { size: 52, color: YELLOW, t: g(p, 'bulbA') });
    thinkingDots(L, 700, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // mỗi cạnh có 5 khoảng; 10 cạnh có 50 khoảng; vòng kín nên 50 bóng
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    const vs = vertices(S.cx, S.cy, S.R);
    star(L, vs, g(p, 'star'), 5);
    const side = g(p, 'side');
    const rest = g(p, 'bulbs');
    for (let k = 0; k < BULBS; k++) {
      const u = k < PER_SIDE ? stagger(side, k, PER_SIDE, 0.4) : stagger(rest, k - PER_SIDE, BULBS - PER_SIDE, 0.2);
      const [x, y] = bulb(vs, k);
      L.dot(x, y, k === 0 ? 16 : 9, { color: YELLOW, t: u });
    }
    L.text('A', vs[0][0] + 40, vs[0][1] - 8, { size: 52, color: YELLOW, t: g(p, 'star') });
    row(L, [String(SIDE), ':', String(GAP), '=', { s: String(PER_SIDE), color: YELLOW }], EQ_X, 340,
      { size: 64, t: g(p, 'eq1'), seed: 1 });
    L.text('khoảng trên mỗi cạnh', EQ_X, 410, { size: 40, align: 'center', t: g(p, 'eq1') });
    row(L, [String(SIDES), { sym: 'times' }, String(PER_SIDE), '=', { s: String(GAPS), color: YELLOW }], EQ_X, 540,
      { size: 64, t: g(p, 'eq2'), seed: 2 });
    L.text('khoảng trên cả ngôi sao', EQ_X, 610, { size: 40, align: 'center', t: g(p, 'eq2') });
    L.text('Vòng kín: số bóng = số khoảng', EQ_X, 740, { size: 48, align: 'center', t: g(p, 'closed') });
    const xs = row(L, [{ s: `${BULBS} bóng đèn`, color: YELLOW }], EQ_X, 880, { size: 84, t: g(p, 'answer'), seed: 9 });
    L.loop(xs[0], 880 - 30, 270, 72, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[0], 880 - 30, 190, g(p, 'burst'), { n: 12, seed: 70 });
  },
};
