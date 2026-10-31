// Câu 32. Bốn nhóm khối lập phương: đếm số khối của mỗi cột (cả khối bị che khuất) rồi cộng.
// Số khối đọc từ ảnh đề (questions/32.png): hình 3D và hình nhìn từ trên xuống (Mặt trên) của mỗi nhóm.
// Các hình ở đây là bản vẽ lại bằng phấn từ chính bảng chiều cao đó, không sao chép ảnh gốc.
//   cột = [r, b, h]: r = số ô sang bên Phải, b = số ô lùi ra phía sau, h = số khối chồng lên nhau.
import { CHALK, wobblyPath, measure } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { cubeView, drawOrder } from '../../../../../../shared/web/js/cubes.js';
import { g, popLabel, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro, row } from '../../../../../../shared/web/js/parts.js';
// the previous scene's last board, wiped away by this scene's first beat ("prev": "from_prev")
import { scenes as previous } from '../scene1/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const NS = 'http://www.w3.org/2000/svg';

// --- dữ liệu (đọc từ ảnh đề) ----------------------------------------------------------------
const GROUPS = {
  A: [[0, 0, 2], [1, 0, 1], [2, 0, 1], [0, 1, 3], [1, 1, 3], [2, 1, 1], [3, 1, 1]],
  B: [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 2], [1, 2, 3]],
  C: [[0, 0, 1], [0, 1, 1], [0, 2, 3], [1, 2, 1], [0, 3, 3], [1, 3, 1]],
  D: [[0, 0, 1], [1, 0, 1], [0, 1, 2], [1, 1, 2], [0, 2, 3], [1, 2, 2]],
};
const NAMES = Object.keys(GROUPS);
const cubesOf = (cells) => cells.flatMap(([x, y, h]) => Array.from({ length: h }, (_, z) => [x, y, z]));
const key = (x, y, z) => `${x},${y},${z}`;
// khối bị che hoàn toàn: có khối ngay phía trước, ngay trên và ngay bên phải
const hiddenOf = (cubes) => {
  const set = new Set(cubes.map((c) => key(...c)));
  return cubes.filter(([x, y, z]) => set.has(key(x, y - 1, z)) && set.has(key(x, y, z + 1)) && set.has(key(x + 1, y, z)));
};
const CUBES = Object.fromEntries(NAMES.map((n) => [n, cubesOf(GROUPS[n])]));
const HIDDEN = Object.fromEntries(NAMES.map((n) => [n, hiddenOf(CUBES[n])]));
const COUNT = Object.fromEntries(NAMES.map((n) => [n, CUBES[n].length]));

const most = NAMES.reduce((a, n) => (COUNT[n] > COUNT[a] ? n : a));
const fewest = NAMES.reduce((a, n) => (COUNT[n] < COUNT[a] ? n : a));
const ANSWER = COUNT[most] + COUNT[fewest];

console.assert(COUNT.A === 12 && COUNT.B === 8 && COUNT.C === 10 && COUNT.D === 11, 'Câu 32: số khối 12, 8, 10, 11');
console.assert(HIDDEN.A.length === 3 && HIDDEN.B.length === 0 && HIDDEN.C.length === 2 && HIDDEN.D.length === 3,
  'Câu 32: số khối bị che 3, 0, 2, 3');
console.assert(most === 'A' && fewest === 'B' && ANSWER === 20, 'Câu 32: nhiều nhất A (12), ít nhất B (8), tổng 20');
console.assert(NAMES.every((n) => GROUPS[n].every(([r, b], i, a) => a.findIndex(([r2, b2]) => r2 === r && b2 === b) === i)),
  'Câu 32: mỗi ô nhìn từ trên xuống chỉ có một cột');

// --- vẽ khối lập phương bằng phấn --------------------------------------------------------------
const PALETTE = {
  A: { front: 'rgb(84, 160, 214)', top: 'rgb(142, 202, 242)', right: 'rgb(48, 108, 164)' },
  B: { front: 'rgb(236, 164, 70)', top: 'rgb(252, 208, 120)', right: 'rgb(190, 118, 40)' },
  C: { front: 'rgb(226, 110, 100)', top: 'rgb(246, 164, 150)', right: 'rgb(174, 68, 66)' },
  D: { front: 'rgb(150, 120, 204)', top: 'rgb(198, 172, 238)', right: 'rgb(106, 80, 160)' },
};

function fillPath(L, pts, fill, opacity = 1) {
  const e = document.createElementNS(NS, 'path');
  e.setAttribute('d', wobblyPath(pts, 0, 0));
  e.setAttribute('fill', fill);
  e.setAttribute('fill-opacity', opacity);
  L.g.appendChild(e);
}

function chalkFace(L, q, fill, u, seed, width) {
  const pts = [...q, q[0]];
  if (u > 0.08) fillPath(L, pts, fill);
  L.poly(pts, { width, t: u, seed, amp: 1.2 });
}

// khối nằm sau, vẽ trước: hình 3D tự che nhau đúng như bản vẽ
function isoCubes(L, cubes, ox, oy, s, t, { seed = 0, width = 4.5, fills } = {}) {
  if (t <= 0) return;
  const v = cubeView(ox, oy, s);
  const set = new Set(cubes.map((c) => key(...c)));
  const order = drawOrder(cubes);
  order.forEach(([x, y, z], i) => {
    const u = stagger(t, i, order.length, 0.4);
    if (u <= 0) return;
    [['front', !set.has(key(x, y - 1, z))], ['top', !set.has(key(x, y, z + 1))],
      ['right', !set.has(key(x + 1, y, z))]].forEach(([f, show], j) => {
      if (show) chalkFace(L, v.face([x, y, z], f), fills[f], u, seed + i * 3 + j, width);
    });
  });
}

// các khối bị che khuất hiện lên bằng nét đứt vàng
function ghostCubes(L, cubes, ox, oy, s, t) {
  if (t <= 0) return;
  const v = cubeView(ox, oy, s);
  cubes.forEach((c, i) => {
    const u = stagger(t, i, cubes.length, 0.5);
    if (u <= 0) return;
    ['front', 'top', 'right'].forEach((f) => {
      const q = v.face(c, f);
      fillPath(L, [...q, q[0]], YELLOW, 0.3 * u);
      q.forEach((a, k) => L.dashed(a, q[(k + 1) % 4], { color: YELLOW, width: 4, on: 10, off: 8, t: u }));
    });
  });
}

// --- hình nhìn từ trên xuống: mỗi cột là một ô hình thoi (Phải xuống bên phải, Trước xuống bên trái) --
function gridSpot(cells, cx, cy, h) {
  const xs = cells.map(([r, b]) => r + b);
  const ys = cells.map(([r, b]) => r - b);
  const mx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const my = (Math.min(...ys) + Math.max(...ys)) / 2;
  return ([r, b]) => [cx + (r + b - mx) * h, cy + (r - b - my) * h];
}

function topView(L, cells, cx, cy, h, t, { fill, nums = null, size = 54, seed = 0, width = 4.5 } = {}) {
  const at = gridSpot(cells, cx, cy, h);
  cells.forEach((c, i) => {
    const u = stagger(t, i, cells.length, 0.45);
    if (u <= 0) return;
    const [x, y] = at(c);
    chalkFace(L, [[x, y - h], [x + h, y], [x, y + h], [x - h, y]], fill, u, seed + i, width);
  });
  if (nums) {
    cells.forEach((c, i) => {
      const [x, y] = at(c);
      popLabel(L, String(c[2]), x, y + size * 0.34, nums[i], { size, color: CHALK.white });
    });
  }
}

// --- bố cục từng scene ---------------------------------------------------------------------------
// beat 1: bốn nhóm hình như trong đề
const CELL = { A: [130, 650], B: [1010, 650], C: [130, 985], D: [1010, 985] };

function statementCell(L, name, t, seed) {
  const [x0, oy] = CELL[name];
  L.text(name, x0, oy - 30, { size: 58, color: YELLOW, t: clamp01(t * 6) });
  isoCubes(L, CUBES[name], x0 + 70, oy, 52, clamp01(t * 1.5), { seed, width: 3.5, fills: PALETTE[name] });
  const fl = x0 + 470;
  const ft = oy - 235;
  L.rect(fl, ft, fl + 300, oy + 10, { width: 3.5, t: clamp01(t * 2 - 0.3), seed: seed + 400 });
  L.text('Mặt trên', fl + 150, ft - 12, { size: 30, align: 'center', t: clamp01(t * 2 - 0.5) });
  topView(L, GROUPS[name], fl + 150, oy - 112, 28, clamp01(t * 2 - 0.7),
    { fill: PALETTE[name].top, seed: seed + 500, width: 3.5 });
}

// beats 2-5: một nhóm, hình 3D bên trái, số khối mỗi cột bên phải, phép cộng ở dưới
function groupBeat(name, seed) {
  return (ctx, p) => {
    const L = ctx.chalk(60);
    const cells = GROUPS[name];
    L.text(`Nhóm ${name}`, 110, 120, { size: 72, color: YELLOW, t: g(p, 'heading') });
    isoCubes(L, CUBES[name], 160, 840, 110, g(p, 'fig'), { seed, width: 5.5, fills: PALETTE[name] });
    if (HIDDEN[name].length) ghostCubes(L, HIDDEN[name], 160, 840, 110, g(p, 'ghost'));
    const [cx, cy, h] = [1360, 490, 80];
    const gridT = g(p, 'grid');
    topView(L, cells, cx, cy, h, gridT,
      { fill: PALETTE[name].top, nums: cells.map((_, i) => g(p, `n${i}`)), size: 68, seed: seed + 100, width: 5.5 });
    if (gridT > 0.5) {
      L.text('Trước', cx - 230, 780, { size: 40, align: 'center', t: clamp01(gridT * 2 - 1) });
      L.text('Phải', cx + 230, 780, { size: 40, align: 'center', t: clamp01(gridT * 2 - 1) });
    }
    const parts = [];
    cells.forEach((c, i) => { if (i) parts.push('+'); parts.push(String(c[2])); });
    parts.push('=', { s: `${COUNT[name]} khối`, color: YELLOW });
    row(L, parts, 960, 960, { size: 64, t: g(p, 'sum'), seed: seed + 200 });
  };
}

const BAR = { w: 190, unit: 34, base: 760, xs: [400, 780, 1160, 1540] };

export const scenes = {
  from_prev: previous.beat4,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('32. Đếm khối lập phương', 960, 95, { size: 62, align: 'center', t: g(p, 'title') });
    L.text('Trong bốn nhóm hình dưới đây, hãy xác định nhóm sử dụng nhiều', 960, 175,
      { size: 42, align: 'center', t: g(p, 'question1') });
    L.text('khối lập phương nhất và nhóm sử dụng ít khối lập phương nhất.', 960, 232,
      { size: 42, align: 'center', t: g(p, 'question1') });
    L.text('Hỏi tổng số khối lập phương trong hai nhóm vừa rồi là bao nhiêu?', 960, 300,
      { size: 42, align: 'center', t: g(p, 'question2') });
    const figs = g(p, 'figs');
    NAMES.forEach((n, i) => statementCell(L, n, stagger(figs, i, 4, 0.4), 10 + i * 40));
    thinkingDots(L, 960, 358, g(p, 'think'), { r: 14 });
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  beat2: groupBeat('A', 100),
  beat3: groupBeat('B', 200),
  beat4: groupBeat('C', 300),
  beat5: groupBeat('D', 400),

  // so sánh bốn nhóm, chọn nhiều nhất + ít nhất
  beat6(ctx, p) {
    const L = ctx.chalk(60);
    L.text('So sánh số khối của bốn nhóm', 960, 120, { size: 60, align: 'center', t: g(p, 'heading') });
    NAMES.forEach((n, i) => {
      const u = g(p, `bar${n}`);
      const x = BAR.xs[i];
      const hgt = COUNT[n] * BAR.unit * u;
      if (u > 0) {
        const [l, r, top] = [x - BAR.w / 2, x + BAR.w / 2, BAR.base - hgt];
        fillPath(L, [[l, top], [r, top], [r, BAR.base], [l, BAR.base], [l, top]], PALETTE[n].front);
        L.rect(l, top, r, BAR.base, { width: 5, seed: 600 + i });
        for (let k = 1; k < COUNT[n] * u; k++) {
          L.line([x - BAR.w / 2, BAR.base - k * BAR.unit], [x + BAR.w / 2, BAR.base - k * BAR.unit],
            { width: 2, seed: 620 + i * 20 + k });
        }
        popLabel(L, String(COUNT[n]), x, BAR.base - hgt - 22, u, { size: 64, color: CHALK.white });
      }
      L.text(n, x, BAR.base + 80, { size: 66, align: 'center', color: YELLOW, t: clamp01(u * 3) });
    });
    // vòng khoanh ôm cả số và thanh, dừng phía trên chữ cái của nhóm
    const ring = (n, t, seed) => {
      const top = BAR.base - COUNT[n] * BAR.unit - 100;
      const bottom = BAR.base + 20;
      L.loop(BAR.xs[NAMES.indexOf(n)], (top + bottom) / 2, 135, (bottom - top) / 2, { color: YELLOW, width: 7, t, seed });
    };
    ring(most, g(p, 'loopMax'), 640);
    ring(fewest, g(p, 'loopMin'), 641);
    const ax = BAR.xs[NAMES.indexOf(most)];
    const bx = BAR.xs[NAMES.indexOf(fewest)];
    L.text('nhiều nhất', ax, BAR.base + 140, { size: 40, align: 'center', color: YELLOW, t: g(p, 'loopMax') });
    L.text('ít nhất', bx, BAR.base + 140, { size: 40, align: 'center', color: YELLOW, t: g(p, 'loopMin') });
    const sumT = g(p, 'sum');
    const lead = `${COUNT[most]} + ${COUNT[fewest]} =`;
    const tail = `${ANSWER} khối`;
    const wLead = measure(lead, 84);
    const wTail = measure(tail, 84);
    const x0 = 960 - (wLead + 24 + wTail) / 2;
    L.text(lead, x0, 1000, { size: 84, t: sumT });
    popLabel(L, tail, x0 + wLead + 24 + wTail / 2, 1000, g(p, 'answer'), { size: 84, color: YELLOW });
  },
};
