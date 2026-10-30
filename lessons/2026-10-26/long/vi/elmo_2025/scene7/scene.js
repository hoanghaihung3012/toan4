// Câu 37. Hình "ngôi nhà": 7 điểm cố định, 8 cạnh; hình sau thêm 1 chấm trên mỗi cạnh nên tăng đều 8.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, arc, numTile, popLabel, thinkingDots } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene6/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- hình học và dữ kiện -----------------------------------------------------------------
function houseGeom(cx, cy, s) {
  const apex = [cx, cy - s * 0.95];
  const tl = [cx - s / 2, cy];
  const tr = [cx + s / 2, cy];
  const bl = [cx - s / 2, cy + s];
  const br = [cx + s / 2, cy + s];
  const armL = [cx - s / 2 - s * 0.55, cy + s * 0.55];
  const armR = [cx + s / 2 + s * 0.55, cy + s * 0.55];
  return {
    vertices: [apex, tl, tr, bl, br, armL, armR],
    edges: [[apex, tl], [apex, tr], [tl, tr], [tl, bl], [tr, br], [bl, br], [tl, armL], [tr, armR]],
  };
}
// hình thứ n có n - 1 chấm thêm đều trên mỗi cạnh
function extraDots(geo, extra) {
  const dots = [];
  for (const [a, b] of geo.edges) {
    for (let i = 1; i <= extra; i++) {
      const u = i / (extra + 1);
      dots.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
    }
  }
  return dots;
}
const dotCount = (figure) => {
  const geo = houseGeom(0, 0, 100);
  return geo.vertices.length + extraDots(geo, figure - 1).length;
};
const COUNTS = [1, 2, 3, 4, 5].map(dotCount);
const STEP = COUNTS[1] - COUNTS[0];

console.assert(houseGeom(0, 0, 100).vertices.length === 7 && houseGeom(0, 0, 100).edges.length === 8,
  'Câu 37: 7 điểm cố định, 8 cạnh');
console.assert(COUNTS.join() === '7,15,23,31,39', 'Câu 37: số chấm 7, 15, 23, 31, 39');
console.assert(COUNTS.every((c, i) => i === 0 || c - COUNTS[i - 1] === STEP) && STEP === 8, 'Câu 37: tăng đều 8');

// lineT: khung; fixedT: 7 điểm cố định; extraT: các chấm thêm (hiện lần lượt)
function house(L, { cx, cy, s, figure, lineT = 1, fixedT = 1, extraT = 1, r = 8, fixedColor, seed = 0 }) {
  const geo = houseGeom(cx, cy, s);
  for (const [a, b] of geo.edges) L.line(a, b, { width: Math.max(3, s * 0.03), t: lineT, seed });
  for (const v of geo.vertices) L.dot(v[0], v[1], r * (fixedColor ? 1.25 : 1), { color: fixedColor, t: fixedT });
  const extra = extraDots(geo, figure - 1);
  extra.forEach((d, i) => L.dot(d[0], d[1], r, { t: stagger(extraT, i, extra.length, 0.3) }));
}

// --- bảng 5 hình + số chấm --------------------------------------------------------------------
const HX = (i) => 960 + (i - 2) * 340;
const HY = 330;
const TY = 620;

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('37. Quy luật số chấm', 960, 115, { size: 68, align: 'center', t: g(p, 'title') });
    L.text('Dựa theo quy luật của các hình bên dưới, thì hình thứ năm', 960, 215,
      { size: 42, align: 'center', t: g(p, 'question1') });
    L.text('sẽ có bao nhiêu chấm?', 960, 265, { size: 42, align: 'center', t: g(p, 'question2') });
    ['Hình thứ nhất', 'Hình thứ hai', 'Hình thứ ba'].forEach((label, i) => {
      const u = stagger(g(p, 'houses'), i, 3, 0.5);
      house(L, { cx: 500 + i * 460, cy: 560, s: 117, figure: i + 1, lineT: clamp01(u * 2), fixedT: clamp01(u * 2 - 1),
        extraT: clamp01(u * 2 - 1), r: 7, seed: 10 + i });
      L.text(label, 500 + i * 460, 560 + 117 * 1.55, { size: 36, align: 'center', t: u });
    });
    thinkingDots(L, 960, 960, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Hình nào có bao nhiêu chấm?', 960, 130, { size: 60, align: 'center', t: g(p, 'heading') });
    const names = ['Hình 1', 'Hình 2', 'Hình 3', 'Hình 4', 'Hình 5'];
    const frames = [g(p, 'h1'), g(p, 'h2'), g(p, 'h3')];
    const extras = [0, g(p, 'extra2'), g(p, 'extra3')];
    COUNTS.forEach((_, i) => {
      const f = i < 3 ? frames[i] : stagger(g(p, 'draw'), i - 3, 2, 0.6);
      const extraT = i < 3 ? extras[i] : clamp01(f * 2 - 1);
      house(L, {
        cx: HX(i), cy: HY, s: 98, figure: i + 1, lineT: i < 3 ? f : clamp01(f * 2),
        fixedT: i < 3 ? f : clamp01(f * 2 - 0.4), extraT, r: 8, fixedColor: CHALK.yellow, seed: 20 + i,
      });
      L.text(names[i], HX(i), 520, { size: 34, align: 'center', t: i < 3 ? f : clamp01(f * 2) });
    });

    // số chấm của từng hình: 7, 15, 23 đếm được; 31, 39 tính ra
    COUNTS.forEach((c, i) => {
      const key = ['c1', 'c2', 'c3', 'c4', 'c5'][i];
      const u = pop(g(p, key));
      if (u.scale > 0) {
        numTile(objs, HX(i), TY, String(c), i < 3 ? 'int' : 'dec', { scale: 0.9 * u.scale, squash: u.squash, digits: 2 });
      } else if (i >= 3 && g(p, 'slots') > 0) {
        const q = pop(g(p, 'slots'));
        numTile(objs, HX(i), TY, '', 'blank', { scale: 0.9 * q.scale, squash: q.squash, digits: 2 });
        L.text('?', HX(i), TY + 20, { size: 54, align: 'center', color: CHALK.yellow, t: g(p, 'slots') });
      }
    });
    for (let i = 0; i < 4; i++) {
      const v = g(p, `a${i + 1}`);
      const from = [HX(i) + 75, TY - 58];
      const to = [HX(i + 1) - 75, TY - 58];
      arc(L, from, to, 65, v, { width: 6, seed: 40 + i });
      if (v > 0) popLabel(L, `+${STEP}`, (from[0] + to[0]) / 2, TY - 130, v, { size: 52 });
    }
    L.loop(HX(4), TY, 90, 70, { color: CHALK.yellow, width: 7, t: g(p, 'circle'), seed: 70 });
    popLabel(L, `${COUNTS[4]} chấm`, 960, 900, g(p, 'answer'), { size: 90 });
  },
};
