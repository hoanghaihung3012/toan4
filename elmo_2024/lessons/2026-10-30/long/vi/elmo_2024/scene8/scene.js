// Câu 48. Xoay hình một phần tư vòng theo chiều kim đồng hồ: kết quả nào KHÔNG đúng.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro, row } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene7/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const GREY = 'rgb(176,184,178)';

// --- dữ kiện: mọi hình trên bảng đều tính từ đây -------------------------------------------
// Ô (r, c) của lưới 2 × 2, r từ trên xuống, c từ trái sang. Xoay 90° theo chiều kim đồng hồ: (r, c) -> (c, 1 - r).
const spin = (it) => ({
  ...it,
  cells: it.cells.map(([r, c]) => [c, 1 - r]),
  dir: it.dir === 'up' ? 'right' : it.dir,
});
const key = (items) => JSON.stringify(items.map((it) => [it.kind, it.dir || '', it.cells.map((q) => q.join()).sort().join('|')]).sort());

const OPTIONS = {
  A: { from: [{ kind: 'circle', cells: [[0, 0]] }], to: [{ kind: 'circle', cells: [[0, 1]] }] },
  B: { from: [{ kind: 'tri', dir: 'up', cells: [[0, 1]] }], to: [{ kind: 'tri', dir: 'up', cells: [[1, 1]] }] },
  C: { from: [{ kind: 'shade', cells: [[0, 0], [1, 1]] }], to: [{ kind: 'shade', cells: [[0, 1], [1, 0]] }] },
  D: { from: [{ kind: 'square', cells: [[1, 0]] }], to: [{ kind: 'square', cells: [[0, 0]] }] },
};
const NAMES = Object.keys(OPTIONS);
const EXPECT = Object.fromEntries(NAMES.map((n) => [n, OPTIONS[n].from.map(spin)]));
const RIGHT = Object.fromEntries(NAMES.map((n) => [n, key(EXPECT[n]) === key(OPTIONS[n].to)]));
const WRONG = NAMES.filter((n) => !RIGHT[n]);

console.assert(WRONG.join() === 'B', 'Câu 48: chỉ hình B không đúng');
console.assert(EXPECT.B[0].dir === 'right' && EXPECT.B[0].cells[0].join() === '1,1', 'Câu 48: tam giác xuống ô dưới phải, quay đỉnh sang phải');

// --- vẽ phấn: lưới 2 × 2, hình trong ô, mũi tên xoay ----------------------------------------
function grid(L, left, top, size, t, seed) {
  const k = clamp01(t);
  if (k <= 0) return;
  L.rect(left, top, left + size, top + size, { width: 5, t: clamp01(k * 2), seed });
  L.line([left + size / 2, top], [left + size / 2, top + size], { width: 4, t: clamp01(k * 2 - 0.5), seed: seed + 1 });
  L.line([left, top + size / 2], [left + size, top + size / 2], { width: 4, t: clamp01(k * 2 - 0.7), seed: seed + 2 });
}

function shapes(L, left, top, size, items, t, seed, color = CHALK.white) {
  if (t <= 0) return;
  const s = size / 2;
  items.forEach((it) => {
    it.cells.forEach(([r, c], i) => {
      const cx = left + (c + 0.5) * s;
      const cy = top + (r + 0.5) * s;
      const k = clamp01(t);
      if (it.kind === 'circle') L.loop(cx, cy, s * 0.3, s * 0.3, { color, width: 5, t: k, seed: seed + i });
      else if (it.kind === 'square') L.rect(cx - s * 0.22, cy - s * 0.22, cx + s * 0.22, cy + s * 0.22, { color, width: 5, t: k, seed: seed + i });
      else if (it.kind === 'tri') {
        const a = s * 0.3;
        const pts = it.dir === 'right'
          ? [[cx - a, cy - a * 1.1], [cx + a * 1.1, cy], [cx - a, cy + a * 1.1], [cx - a, cy - a * 1.1]]
          : [[cx, cy - a * 1.1], [cx + a, cy + a * 0.9], [cx - a, cy + a * 0.9], [cx, cy - a * 1.1]];
        L.poly(pts, { color, width: 5, t: k, seed: seed + i });
      } else {
        const m = s * 0.06;
        for (let h = 0; h <= 9; h++) {
          const y = top + r * s + m + ((s - 2 * m) * h) / 9;
          L.line([left + c * s + m, y], [left + (c + 1) * s - m, y], { color: GREY, width: 8, t: clamp01(k * 2 - h / 9), seed: seed + h });
        }
      }
    });
  });
}

// mũi tên cong theo chiều kim đồng hồ
function turnArrow(L, cx, cy, r, t, color = YELLOW) {
  const k = clamp01(t);
  if (k <= 0) return;
  const a0 = (200 * Math.PI) / 180;
  const sweep = (250 * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const a = a0 + (sweep * i * k) / 24;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  L.poly(pts, { color, width: 7, seed: 77, amp: 0.8 });
  if (k < 1) return;
  const a1 = a0 + sweep;
  const [hx, hy] = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const tang = a1 + Math.PI / 2;
  for (const sgn of [-1, 1]) {
    L.line([hx, hy], [hx - 26 * Math.cos(tang + sgn * 0.5), hy - 26 * Math.sin(tang + sgn * 0.5)], { color, width: 7, seed: 78 + sgn });
  }
}

// bố cục: bốn thẻ A, B, C, D xếp 2 × 2
const GSIZE = 160;
const CARD = { A: [240, 380], B: [1180, 380], C: [240, 660], D: [1180, 660] };
function card(L, name, t, seed, { tick = 0, result = true } = {}) {
  const [ox, top] = CARD[name];
  const opt = OPTIONS[name];
  L.text(name + '.', ox, top + GSIZE / 2 + 18, { size: 56, color: YELLOW, t: clamp01(t * 3) });
  grid(L, ox + 50, top, GSIZE, t, seed);
  shapes(L, ox + 50, top, GSIZE, opt.from, clamp01(t * 2 - 0.6), seed + 10);
  turnArrow(L, ox + 270, top + GSIZE / 2, 34, clamp01(t * 2 - 0.6));
  grid(L, ox + 340, top, GSIZE, t, seed + 20);
  shapes(L, ox + 340, top, GSIZE, opt.to, clamp01(t * 2 - 0.8), seed + 30);
  mark(L, result, ox + 580, top + GSIZE / 2, tick, { size: 70, seed: seed + 40 });
}

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('48. Xoay hình', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Kết quả nào sau đây không phải là kết quả của việc', 960, 250, { size: 48, align: 'center', t: g(p, 'q1') });
    L.text('xoay hình đã cho theo hướng mũi tên?', 960, 325, { size: 48, align: 'center', t: g(p, 'q2') });
    NAMES.forEach((n, i) => card(L, n, stagger(g(p, 'cards'), i, NAMES.length, 0.4), 10 + i * 100));
    thinkingDots(L, 960, 990, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // thử từng hình: A, C, D đúng; B còn lại
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Xoay 1/4 vòng theo chiều kim đồng hồ', 960, 200, { size: 60, align: 'center', color: YELLOW, t: g(p, 'rule') });
    const tick = { A: g(p, 'a'), C: g(p, 'c'), D: g(p, 'd'), B: 0 };
    NAMES.forEach((n, i) => card(L, n, 1, 10 + i * 100, { tick: tick[n], result: RIGHT[n] }));
    if (g(p, 'b') > 0) {
      const [ox, top] = CARD.B;
      L.rect(ox - 20, top - 30, ox + 640, top + GSIZE + 30, { color: YELLOW, width: 6, t: g(p, 'b'), seed: 61 });
    }
  },

  // hình B: xoay đúng thì tam giác quay đỉnh sang phải
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    const S = 260;
    const top = 400;
    const X = [330, 830, 1330];
    L.text('Hình đã cho', X[0] + S / 2, 330, { size: 46, align: 'center', t: g(p, 'g1') });
    grid(L, X[0], top, S, g(p, 'g1'), 70);
    shapes(L, X[0], top, S, OPTIONS.B.from, g(p, 'g1'), 80);
    turnArrow(L, X[0] + S + 120, top + S / 2, 40, g(p, 'turn'));
    L.text('Xoay đúng', X[1] + S / 2, 330, { size: 46, align: 'center', color: YELLOW, t: g(p, 'g2') });
    grid(L, X[1], top, S, g(p, 'g2'), 90);
    shapes(L, X[1], top, S, EXPECT.B, g(p, 'g2'), 100, YELLOW);
    L.text('Hình B', X[2] + S / 2, 330, { size: 46, align: 'center', t: g(p, 'g3') });
    grid(L, X[2], top, S, g(p, 'g3'), 110);
    shapes(L, X[2], top, S, OPTIONS.B.to, g(p, 'g3'), 120);
    mark(L, false, X[2] + S + 60, top + S / 2, g(p, 'cross'), { size: 80, seed: 130 });
    const xs = row(L, [{ s: 'Đáp án:', color: YELLOW }, { s: 'B', color: YELLOW }], 960, 860,
      { size: 100, t: g(p, 'answer'), gap: 0.4, seed: 9 });
    L.loop(xs[1] + 4, 860 - 36, 56, 66, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
