// Câu 36. Hai đường cùng qua số 25 nên hai cặp đầu mút có cùng tổng.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { lerp, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, popLabel } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro, flight } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene5/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

// --- dữ kiện ------------------------------------------------------------------------------
const NUMS = [7, 12, 14, 19];
const CENTER = 25;
const TOTAL = NUMS.reduce((s, v) => s + v, 0);
const HALF = TOTAL / 2;
const SPLITS = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
  .filter(([a, b]) => NUMS[a[0]] + NUMS[a[1]] === NUMS[b[0]] + NUMS[b[1]]);
const SLOT = { top: 7, bottom: 19, left: 12, right: 14 }; // cách xếp minh họa
const ANSWER = HALF + CENTER;

console.assert(TOTAL === 52 && HALF === 26, 'Câu 36: tổng bốn số 52, mỗi cặp 26');
console.assert(SPLITS.length === 1 && SPLITS[0][0].map((i) => NUMS[i]).join() === '7,19'
  && SPLITS[0][1].map((i) => NUMS[i]).join() === '12,14', 'Câu 36: chỉ có cách ghép 7+19 và 12+14');
console.assert(SLOT.left + CENTER + SLOT.right === ANSWER && SLOT.top + CENTER + SLOT.bottom === ANSWER
  && ANSWER === 51, 'Câu 36: hai đường cùng có tổng 51');

// --- hình chữ thập: 5 vòng tròn, hai đường -----------------------------------------------------
const OFFS = { top: [0, -285], bottom: [0, 285], left: [-460, 0], right: [460, 0] };

function crossGeom(cx, cy, scale) {
  const r = 68 * scale;
  const at = (k) => [cx + OFFS[k][0] * scale, cy + OFFS[k][1] * scale];
  return { r, at, cx, cy };
}

// vòng tròn và hai đường; hlH, hlV: tô vàng đường ngang, xanh đường dọc
function crossFrame(L, geo, scale, p, { hlH = 0, hlV = 0, seed = 360 } = {}) {
  const { r, cx, cy } = geo;
  const t = g(p, 'cross');
  const arms = [
    [[cx, cy - r], geo.at('top'), 'v'], [[cx, cy + r], geo.at('bottom'), 'v'],
    [[cx - r, cy], geo.at('left'), 'h'], [[cx + r, cy], geo.at('right'), 'h'],
  ];
  arms.forEach(([a, b, dir], i) => {
    const to = [b[0] - Math.sign(b[0] - a[0]) * r, b[1] - Math.sign(b[1] - a[1]) * r];
    L.line(a, to, { width: 5 * scale, t, seed: seed + i });
    const hl = dir === 'h' ? hlH : hlV;
    if (hl > 0) L.line(a, to, { color: dir === 'h' ? CHALK.yellow : CHALK.blue, width: 8 * scale, t: hl, seed: seed + 10 + i });
  });
  ['top', 'bottom', 'left', 'right', 'center'].forEach((k, i) => {
    const [x, y] = k === 'center' ? [cx, cy] : geo.at(k);
    L.loop(x, y, r, r, { width: 6 * scale, t, seed: seed + 20 + i });
  });
  L.text(String(CENTER), cx, cy + 17 * scale * 1.2, { size: 46 * scale * 1.2, align: 'center', t: g(p, 'center') });
}

const LOOSE_BEAT1 = NUMS.map((v, i) => [250, 520 + i * 120, v]);
const LOOSE_BEAT2 = NUMS.map((v, i) => [1110 + i * 150, 925, v]);

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('36. Tổng trên đường ngang', 960, 120, { size: 68, align: 'center', t: g(p, 'title') });
    L.text('Đặt các số 7, 12, 14 và 19 vào các vòng tròn trống', 960, 235,
      { size: 43, align: 'center', t: g(p, 'question1') });
    L.text('sao cho tổng các số trên đường ngang bằng với tổng', 960, 295,
      { size: 43, align: 'center', t: g(p, 'question2') });
    L.text('các số trên đường dọc. Hỏi tổng các số trên đường', 960, 355,
      { size: 43, align: 'center', t: g(p, 'question3') });
    L.text('ngang là bao nhiêu?', 960, 415, { size: 43, align: 'center', t: g(p, 'question4') });
    LOOSE_BEAT1.forEach(([x, y, v]) => {
      const u = pop(g(p, `t${v}`));
      if (u.scale > 0) tile(objs, x, y, String(v), 'int', { scale: 0.85 * u.scale, squash: u.squash });
    });
    const geo = crossGeom(960, 740, 0.8);
    crossFrame(L, geo, 0.8, p, { hlH: g(p, 'hlH'), hlV: g(p, 'hlV') });
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    const scale = 0.75;
    const geo = crossGeom(1380, 540, scale);
    crossFrame(L, geo, scale, { ...p, cross: 1, center: 1 }, { hlH: g(p, 'hlH'), hlV: g(p, 'hlV') });

    // bốn thẻ: nằm dưới hình, rồi bay vào bốn vòng tròn
    NUMS.forEach((v, i) => {
      const from = [LOOSE_BEAT2[i][0], LOOSE_BEAT2[i][1]];
      const slotKey = Object.keys(SLOT).find((k) => SLOT[k] === v);
      const to = geo.at(slotKey);
      const sU = pop(stagger(g(p, 'tiles'), i, NUMS.length, 0.5));
      const fU = stagger(g(p, 'fly'), i, NUMS.length, 0.5);
      if (fU <= 0) {
        if (sU.scale > 0) tile(objs, from[0], from[1], String(v), 'int', { scale: 0.7 * sU.scale, squash: sU.squash });
        return;
      }
      const f = flight(from, to, fU, 90);
      tile(objs, f.x, f.y, String(v), 'int', { scale: lerp(0.7, 0.55, f.v), squash: f.squash });
    });

    L.text('Hai đường cùng đi qua số 25', 480, 200, { size: 44, align: 'center', t: g(p, 'same') });
    row(L, ['trái + phải', '=', 'trên + dưới'], 480, 320, { size: 50, t: g(p, 'equal'), seed: 2 });
    row(L, ['7', '+', '12', '+', '14', '+', '19', '=', String(TOTAL)], 480, 450,
      { size: 50, t: g(p, 'total'), seed: 3 });
    L.text(`${TOTAL} : 2 = ${HALF}`, 480, 570, { size: 56, align: 'center', t: g(p, 'half') });
    row(L, ['7', '+', '19', '=', String(HALF)], 480, 690, { size: 50, t: g(p, 'pairs'), seed: 4 });
    row(L, ['12', '+', '14', '=', String(HALF)], 480, 770, { size: 50, t: g(p, 'pairs'), seed: 5 });
    popLabel(L, `${HALF} + ${CENTER} = ${ANSWER}`, 480, 930, g(p, 'answer'), { size: 80 });
  },
};
