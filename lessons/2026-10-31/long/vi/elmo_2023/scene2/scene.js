// Câu 42. 3 quả táo nặng bằng 2 quả lê; 10 quả quýt nặng bằng 3 quả lê; bao nhiêu quả quýt nặng bằng 18 quả táo.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene1/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const RED = CHALK.red;
const GREEN = CHALK.green;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const APPLES_PER_GROUP = 3; // 3 táo = 2 lê
const PEARS_PER_GROUP = 2;
const PEARS_FOR_TANG = 3; // 3 lê = 10 quýt
const TANG_PER_GROUP = 10;
const APPLES = 18;
const APPLE_GROUPS = APPLES / APPLES_PER_GROUP;
const PEARS = APPLE_GROUPS * PEARS_PER_GROUP;
const PEAR_GROUPS = PEARS / PEARS_FOR_TANG;
const TANGS = PEAR_GROUPS * TANG_PER_GROUP;
console.assert(APPLES % APPLES_PER_GROUP === 0 && APPLE_GROUPS === 6, 'Câu 42: 18 táo = 6 nhóm 3 táo');
console.assert(PEARS === 12 && PEARS % PEARS_FOR_TANG === 0 && PEAR_GROUPS === 4, 'Câu 42: 6 × 2 = 12 lê = 4 nhóm 3 lê');
console.assert(TANGS === 40, 'Câu 42: 4 × 10 = 40 quýt');

// --- quả vẽ phấn: táo đỏ, lê xanh, quýt vàng ----------------------------------------
function apple(L, x, y, r, t) {
  if (t <= 0) return;
  L.dot(x, y, r, { color: RED, t });
  L.line([x, y - r * 0.8], [x + r * 0.3, y - r * 1.35], { color: GREEN, width: 5, t: clamp01(t * 1.5), seed: 3 });
}
function pear(L, x, y, r, t) {
  if (t <= 0) return;
  L.dot(x, y + r * 0.25, r, { color: GREEN, t });
  L.dot(x, y - r * 0.75, r * 0.62, { color: GREEN, t });
}
function tang(L, x, y, r, t) {
  L.dot(x, y, r, { color: YELLOW, t });
}
// 10 quýt xếp thành hình tháp 4, 3, 2, 1
function pyramid(cx, base, step) {
  const pts = [];
  [4, 3, 2, 1].forEach((n, j) => {
    for (let k = 0; k < n; k++) pts.push([cx + (k - (n - 1) / 2) * step, base - j * step * 0.9]);
  });
  return pts;
}
console.assert(pyramid(0, 0, 1).length === TANG_PER_GROUP, 'Câu 42: tháp quýt có 10 quả');

// --- cân đĩa: xà ngang, hai đĩa treo, cột và đế -----------------------------------------
const W = 260; // nửa xà
const HANG = 220; // dây treo dài
function balance(L, cx, by, t) {
  const k = clamp01(t);
  L.line([cx - W - 30, by], [cx + W + 30, by], { width: 7, t: clamp01(k * 3), seed: 1 });
  L.line([cx, by], [cx, by + 330], { width: 7, t: clamp01(k * 3 - 0.4), seed: 2 });
  L.line([cx - 95, by + 330], [cx + 95, by + 330], { width: 7, t: clamp01(k * 3 - 1), seed: 3 });
  [-1, 1].forEach((s, i) => {
    const px = cx + s * W;
    const rim = by + HANG;
    const u = clamp01(k * 2.2 - 0.4);
    L.line([px, by], [px - 130, rim], { width: 4, t: u, seed: 10 + i });
    L.line([px, by], [px + 130, rim], { width: 4, t: u, seed: 12 + i });
    L.poly([[px - 130, rim], [px - 100, rim + 25], [px, rim + 35], [px + 100, rim + 25], [px + 130, rim]],
      { width: 6, t: clamp01(k * 2.2 - 0.6), seed: 14 + i });
  });
}

// đề: bên trái 3 táo = 2 lê, bên phải 10 quýt = 3 lê
const BY = 580;
const RIM = BY + HANG;
const SC1 = 480;
const SC2 = 1440;
// một cân: khung (t từ 0 đến 0.5) rồi các quả hai bên (0.5 đến 1)
function weighed(L, cx, t, leftItems, rightItems) {
  const k = clamp01(t);
  balance(L, cx, BY, clamp01(k * 2));
  const items = [...leftItems, ...rightItems];
  items.forEach((draw, i) => draw(stagger(clamp01(k * 2 - 1), i, items.length, 0.3)));
}
function figure(L, t1, t2) {
  weighed(L, SC1, t1,
    [0, 1, 2].map((i) => (u) => apple(L, SC1 - W + (i - 1) * 80, RIM - 38, 38, u)),
    [0, 1].map((i) => (u) => pear(L, SC1 + W + (i - 0.5) * 90, RIM - 42, 34, u)));
  weighed(L, SC2, t2,
    pyramid(SC2 - W, RIM - 20, 44).map(([x, y]) => (u) => tang(L, x, y, 20, u)),
    [0, 1, 2].map((i) => (u) => pear(L, SC2 + W + (i - 1) * 80, RIM - 42, 34, u)));
}

// nhóm quả: n quả cách nhau step, quanh tâm cx
function group(L, draw, cx, y, n, step, r, u) {
  for (let i = 0; i < n; i++) draw(L, cx + (i - (n - 1) / 2) * step, y, r, stagger(u, i, n, 0.5));
}

const gx = (i, n, pitch) => 960 + (i - (n - 1) / 2) * pitch;

export const scenes = {
  from_prev: previous.beat4,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('42. Cân táo, lê, quýt', 960, 130, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Ba quả táo nặng bằng 2 quả lê,', 960, 235, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('và 10 quả quýt nặng bằng 3 quả lê.', 960, 310, { size: 50, align: 'center', t: g(p, 'q2') });
    L.text('Hỏi bao nhiêu quả quýt nặng bằng 18 quả táo?', 960, 385, { size: 50, align: 'center', t: g(p, 'q3') });
    figure(L, g(p, 'scale1'), g(p, 'scale2'));
    thinkingDots(L, 960, 980, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // 18 táo = 6 nhóm 3 táo; mỗi nhóm nặng bằng 2 lê; 6 × 2 = 12 lê
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('3 quả táo = 2 quả lê', 960, 190, { size: 58, align: 'center', color: YELLOW, t: g(p, 'fact') });
    L.text('18 quả táo', 960, 300, { size: 56, align: 'center', t: g(p, 'head') });
    for (let i = 0; i < APPLE_GROUPS; i++) {
      const x = gx(i, APPLE_GROUPS, 270);
      group(L, apple, x, 430, APPLES_PER_GROUP, 70, 30, stagger(g(p, 'apples'), i, APPLE_GROUPS, 0.4));
      L.loop(x, 430, 118, 52, { color: YELLOW, width: 5, t: stagger(g(p, 'loops'), i, APPLE_GROUPS, 0.4), seed: 20 + i });
      const a = stagger(g(p, 'pears'), i, APPLE_GROUPS, 0.45);
      L.arrow([x, 505], [x, 575], { color: YELLOW, width: 5, t: clamp01(a * 2), seed: 30 + i });
      group(L, pear, x, 660, PEARS_PER_GROUP, 84, 30, clamp01(a * 2 - 0.8));
    }
    row(L, [String(APPLE_GROUPS), { sym: 'times' }, String(PEARS_PER_GROUP), '=',
      { s: `${PEARS} quả lê`, color: YELLOW }], 960, 900, { size: 80, t: g(p, 'eq'), seed: 5 });
  },

  // 12 lê = 4 nhóm 3 lê; mỗi nhóm nặng bằng 10 quýt; 4 × 10 = 40 quýt
  beat3(ctx, p) {
    const L = ctx.chalk(60);
    L.text('3 quả lê = 10 quả quýt', 960, 190, { size: 58, align: 'center', color: YELLOW, t: g(p, 'fact') });
    L.text('12 quả lê', 960, 300, { size: 56, align: 'center', t: g(p, 'head') });
    for (let i = 0; i < PEAR_GROUPS; i++) {
      const x = gx(i, PEAR_GROUPS, 400);
      group(L, pear, x, 430, PEARS_FOR_TANG, 84, 30, stagger(g(p, 'pears'), i, PEAR_GROUPS, 0.4));
      L.loop(x, 430, 150, 58, { color: YELLOW, width: 5, t: stagger(g(p, 'loops'), i, PEAR_GROUPS, 0.4), seed: 40 + i });
      const a = stagger(g(p, 'tangs'), i, PEAR_GROUPS, 0.45);
      L.arrow([x, 510], [x, 560], { color: YELLOW, width: 5, t: clamp01(a * 2), seed: 50 + i });
      pyramid(x, 740, 44).forEach(([tx, ty], j) => tang(L, tx, ty, 20, stagger(clamp01(a * 2 - 0.8), j, TANG_PER_GROUP, 0.3)));
    }
    row(L, [String(PEAR_GROUPS), { sym: 'times' }, String(TANG_PER_GROUP), '=',
      { s: `${TANGS} quả quýt`, color: YELLOW }], 960, 930, { size: 80, t: g(p, 'eq'), seed: 6 });
  },

  // 18 táo = 12 lê = 40 quýt
  beat4(ctx, p) {
    const L = ctx.chalk(60);
    const xs = row(L, ['18 táo', '=', `${PEARS} lê`, '=', { s: `${TANGS} quýt`, color: YELLOW }], 960, 640,
      { size: 84, t: g(p, 'row'), gap: 0.6, seed: 9 });
    apple(L, xs[0], 440, 50, stagger(g(p, 'row'), 0, 3, 0.4));
    pear(L, xs[2], 440, 50, stagger(g(p, 'row'), 1, 3, 0.4));
    tang(L, xs[4], 440, 50, stagger(g(p, 'row'), 2, 3, 0.4));
    L.loop(xs[4], 640 - 30, 165, 70, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, xs[4], 640 - 30, 150, g(p, 'burst'), { n: 10, seed: 70 });
  },
};
