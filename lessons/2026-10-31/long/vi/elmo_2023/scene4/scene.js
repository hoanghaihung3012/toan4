// Câu 44. Bảng A, B, C và cột Quyết định (Có hoặc Không); tìm số thiếu ở hàng cuối.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark, burst } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene3/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const RED = CHALK.red;
const GREEN = CHALK.green;
const PINK = CHALK.pink;
const BLUE = CHALK.blue;
const COL_COLOR = { A: PINK, B: BLUE, C: GREEN };

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
// [A, B, C, quyết định]; hàng cuối thiếu C
const ROWS = [[3, 1, 5, 'Có'], [4, 3, 5, 'Có'], [5, 2, 5, 'Không'], [8, 8, 8, 'Có'], [10, 6, null, 'Có']];
// quy luật: ba số theo thứ tự B, A, C cách đều nhau (A ở chính giữa)
const even = ([a, b, c]) => a - b === c - a;
const MISSING = 2 * ROWS[4][0] - ROWS[4][1];
console.assert(ROWS.slice(0, 4).every((r) => even(r) === (r[3] === 'Có')), 'Câu 44: hàng Có thì cách đều, hàng Không thì không');
console.assert(ROWS[0][0] - ROWS[0][1] === 2 && ROWS[1][0] - ROWS[1][1] === 1 && ROWS[3][0] - ROWS[3][1] === 0, 'Câu 44: các hiệu 2, 1, 0');
console.assert(ROWS[2][0] - ROWS[2][1] === 3 && ROWS[2][2] - ROWS[2][0] === 0, 'Câu 44: hàng 3 hơn 3 rồi hơn 0');
console.assert(MISSING === 14 && even([10, 6, MISSING]) && ROWS[4][0] - ROWS[4][1] === 4, 'Câu 44: 6, 10, 14 cách đều 4');

// --- bảng ---------------------------------------------------------------------------------------
const COLW = [120, 120, 120, 240];
const TOP = 270;
const HEAD_Y = 330;
const FIRST = 355; // mép trên hàng dữ liệu đầu tiên
const RH = 88;
const rowBase = (k) => FIRST + RH * k + 58;

function table(L, x0, t, fill = 0) {
  const k = clamp01(t);
  if (k <= 0) return;
  const xs = [x0];
  COLW.forEach((w) => xs.push(xs[xs.length - 1] + w));
  const right = xs[4];
  const bottom = FIRST + RH * ROWS.length;
  const mid = (c) => (xs[c] + xs[c + 1]) / 2;
  L.rect(x0, TOP, right, bottom, { width: 5, t: clamp01(k * 2), seed: 3 });
  L.line([x0, FIRST], [right, FIRST], { width: 4, t: clamp01(k * 2 - 0.4), seed: 4 });
  xs.slice(1, 4).forEach((x, i) => L.line([x, TOP], [x, bottom], { width: 3.5, t: clamp01(k * 2 - 0.5), seed: 10 + i }));
  for (let r = 1; r < ROWS.length; r++) {
    L.line([x0, FIRST + RH * r], [right, FIRST + RH * r], { width: 3.5, t: clamp01(k * 2 - 0.5), seed: 20 + r });
  }
  const w = clamp01(k * 2 - 0.8);
  ['A', 'B', 'C'].forEach((s, c) => L.text(s, mid(c), HEAD_Y, { size: 50, align: 'center', color: COL_COLOR[s], t: w }));
  L.text('Quyết định', mid(3), HEAD_Y, { size: 40, align: 'center', t: w });
  ROWS.forEach(([a, b, c, d], r) => {
    const y = rowBase(r);
    [a, b, c].forEach((v, col) => {
      if (v !== null) L.text(String(v), mid(col), y, { size: 50, align: 'center', t: w });
      else if (fill > 0) L.text(String(MISSING), mid(col), y, { size: 54, align: 'center', color: YELLOW, scale: pop(fill).scale });
      else L.rect(mid(col) - 22, y - 42, mid(col) + 22, y + 2, { width: 5, t: w, seed: 30 });
    });
    L.text(d, mid(3), y, { size: 46, align: 'center', color: d === 'Có' ? GREEN : RED, t: w });
  });
  return mid(2);
}

// --- bảng phân tích bên phải: B → A → C, hiệu của hai số liền nhau ------------------------------------
const PX = [1050, 1350, 1650];
const LABELS = ['B', 'A', 'C'];
function panelHead(L, t) {
  LABELS.forEach((s, i) => L.text(s, PX[i], HEAD_Y, { size: 50, align: 'center', color: COL_COLOR[s], t }));
}

// n: ba số hiện ra; a1, a2: mũi tên và số hơn; m: dấu ✓ ✗ (hàng 5: số C hiện ra)
function panelRow(L, r, { n = 1, a1 = 1, a2 = 1, m = 1 }) {
  const [a, b, c, d] = ROWS[r];
  const y = rowBase(r);
  const nums = [b, a, c === null ? MISSING : c];
  const ok = c === null || even([a, b, c]);
  const color = ok ? YELLOW : RED;
  nums.forEach((v, i) => {
    const u = clamp01(n * 3 - i);
    if (c === null && i === 2) {
      if (m > 0) L.text(String(v), PX[i], y, { size: 56, align: 'center', color: YELLOW, scale: pop(m).scale });
      else L.text('?', PX[i], y, { size: 56, align: 'center', color: YELLOW, t: u });
    } else {
      L.text(String(v), PX[i], y, { size: 56, align: 'center', t: u });
    }
  });
  [[0, a1], [1, a2]].forEach(([i, t]) => {
    const diff = nums[i + 1] - nums[i];
    L.arrow([PX[i] + 60, y - 18], [PX[i + 1] - 60, y - 18], { color: CHALK.white, width: 5, t, seed: 40 + r * 2 + i });
    L.text(`+${diff}`, (PX[i] + PX[i + 1]) / 2, y - 40, { size: 42, align: 'center', color, t });
  });
  if (c !== null) mark(L, ok, 1790, y - 22, m, { size: 56, seed: 50 + r });
}
// hàng 1-4 hiện ra theo một tiến độ t
const stepsOf = (t) => ({ n: clamp01(t * 2.5), a1: clamp01(t * 2.5 - 1), a2: clamp01(t * 2.5 - 1.5), m: clamp01((t - 0.8) / 0.2) });

const TEXT_LINES = [
  'Nếu các số trong mỗi hàng có quan hệ',
  'với nhau theo một cách nào đó thì',
  "ghi 'Có' ở cột Quyết định.",
  'Nếu các số trong mỗi hàng không có',
  "quan hệ như vậy thì ghi 'Không'.",
  'Hỏi số còn thiếu trong ô trống',
  'là bao nhiêu?',
];

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('44. Quy luật Có và Không', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    TEXT_LINES.forEach((s, i) => L.text(s, 90, 330 + i * 80, { size: 46, t: g(p, `q${i + 1}`) }));
    table(L, 1065, g(p, 'table'));
    thinkingDots(L, 400, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // hàng 1-4: xếp theo B, A, C và xem các số có cách đều không
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    table(L, 210, g(p, 'table'));
    panelHead(L, g(p, 'head'));
    [0, 1, 2, 3].forEach((r) => panelRow(L, r, stepsOf(g(p, `row${r + 1}`))));
    L.text('B, A, C cách đều nhau', 1350, 900, { size: 60, align: 'center', color: YELLOW, t: g(p, 'rule') });
  },

  // hàng cuối: 6, 10, ? cách đều 4 nên ? = 14
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    table(L, 210, 1, g(p, 'fill'));
    panelHead(L, 1);
    [0, 1, 2, 3].forEach((r) => panelRow(L, r, stepsOf(1)));
    panelRow(L, 4, { n: g(p, 'nums'), a1: g(p, 'a1'), a2: g(p, 'a2'), m: g(p, 'fill') });
    burst(L, PX[2], rowBase(4) - 18, 60, g(p, 'burst'), { n: 10, seed: 70 });
    L.loop(PX[2], rowBase(4) - 20, 62, 52, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
  },
};
