// Câu 49. Đặt gương ở đâu để phép tính 18 + 18 cho số lớn nhất không vượt quá 1000.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, mark, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene8/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const PINK = CHALK.pink;
const RED = CHALK.red;

// --- chữ số 7 đoạn: mỗi ô rộng W, cao H ---------------------------------------------------------
const W = 80;
const H = 160;
const TH = 12;
const SEG = {
  a: [[10, 0], [W - 10, 0]], b: [[W, 10], [W, H / 2 - 10]], c: [[W, H / 2 + 10], [W, H - 10]],
  d: [[10, H], [W - 10, H]], e: [[0, H / 2 + 10], [0, H - 10]], f: [[0, 10], [0, H / 2 - 10]],
  g: [[10, H / 2], [W - 10, H / 2]],
};
const GLYPH = { 1: 'bc', 8: 'abcdefg' };

// --- dữ kiện: mọi kết quả đều tính từ đây ------------------------------------------------------
// Gương che phần bên phải và phản chiếu phần bên trái của dòng chữ; 1, 8 và + đều đối xứng khi cắt đôi.
const EXPR = '18+18';
const PITCH = 140;
const X0 = 960 - (PITCH * (EXPR.length - 1) + W) / 2;
const CELLS = [...EXPR].map((ch, i) => ({ ch, x: X0 + i * PITCH }));
const MIRRORS = {
  A: CELLS[1].x + W / 2, // qua tâm chữ số 8 thứ nhất
  B: (CELLS[1].x + W + CELLS[2].x) / 2, // giữa "18" và dấu cộng
  C: CELLS[2].x + W / 2, // qua tâm dấu cộng
  D: CELLS[4].x + W / 2, // qua tâm chữ số 8 thứ hai
};
const NAMES = Object.keys(MIRRORS);
function seen(xm) {
  const left = CELLS.filter((c) => c.x + W <= xm);
  const cut = CELLS.find((c) => c.x < xm && xm < c.x + W);
  return left.map((c) => c.ch).join('') + (cut ? cut.ch : '') + left.map((c) => c.ch).reverse().join('');
}
const value = (s) => s.split('+').reduce((sum, n) => sum + Number(n), 0);
const SEEN = Object.fromEntries(NAMES.map((n) => [n, seen(MIRRORS[n])]));
const VALUE = Object.fromEntries(NAMES.map((n) => [n, value(SEEN[n])]));
const LIMIT = 1000;
const OK = NAMES.filter((n) => VALUE[n] <= LIMIT);
const BEST = OK.reduce((a, b) => (VALUE[b] > VALUE[a] ? b : a));

console.assert(SEEN.A === '181' && SEEN.B === '1881' && SEEN.C === '18+81' && SEEN.D === '18+181+81', 'Câu 49: các dòng nhìn thấy');
console.assert(VALUE.A === 181 && VALUE.B === 1881 && VALUE.C === 99 && VALUE.D === 280, 'Câu 49: 181, 1881, 99, 280');
console.assert(OK.join() === 'A,C,D' && BEST === 'D', 'Câu 49: B vượt 1000; lớn nhất là D (280)');

function glyph(L, ch, x, y, s, t, color = CHALK.white, seed = 0) {
  if (t <= 0) return;
  const P = ([px, py]) => [x + px * s, y + py * s];
  const o = { color, width: TH * s, seed };
  if (ch === '+') {
    L.line(P([0, H / 2]), P([W, H / 2]), { ...o, t: clamp01(t * 2) });
    L.line(P([W / 2, H / 2 - W / 2]), P([W / 2, H / 2 + W / 2]), { ...o, t: clamp01(t * 2 - 1), seed: seed + 1 });
    return;
  }
  const keys = GLYPH[ch];
  [...keys].forEach((k, i) => L.line(P(SEG[k][0]), P(SEG[k][1]), { ...o, t: stagger(t, i, keys.length, 0.5), seed: seed + i }));
}

// dòng nhìn thấy cho gương ở n: nửa trái trắng, nửa phản chiếu hồng, nét đứt vàng ở trục gương
function strip(L, name, cx, y, s, t) {
  const str = SEEN[name];
  const pitch = (W + 40) * s;
  const total = pitch * str.length - 40 * s;
  const x0 = cx - total / 2;
  [...str].forEach((ch, i) => {
    const gx = x0 + i * pitch;
    const mid = gx + (W * s) / 2;
    const color = mid > cx + 1 ? PINK : CHALK.white;
    glyph(L, ch, gx, y, s, stagger(t, i, str.length, 0.5), color, 100 + i * 3);
  });
  L.dashed([cx, y - 14], [cx, y + H * s + 14], { color: YELLOW, width: 4, t: clamp01(t * 2 - 1) });
}

function eye(L, x, y, t) {
  L.loop(x, y, 38, 22, { width: 5, t, seed: 61 });
  L.dot(x, y, 11, { t });
}

const GLY_Y = 440;
const ROW_Y = [270, 400, 530, 660];

export const scenes = {
  from_prev: previous.beat5,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('49. Đặt gương', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Bạn nên đặt gương ở đâu để có kết quả tính', 960, 245, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('lớn nhất mà không vượt quá 1000?', 960, 320, { size: 50, align: 'center', t: g(p, 'q2') });
    eye(L, X0 - 130, GLY_Y + H / 2, g(p, 'expr'));
    CELLS.forEach((c, i) => glyph(L, c.ch, c.x, GLY_Y, 1, stagger(g(p, 'expr'), i, CELLS.length, 0.4), CHALK.white, 10 + i * 8));
    NAMES.forEach((n, i) => {
      const u = stagger(g(p, 'mirrors'), i, NAMES.length, 0.4);
      L.dashed([MIRRORS[n], GLY_Y - 50], [MIRRORS[n], GLY_Y + H + 80], { width: 4, t: u });
      L.text(n, MIRRORS[n], GLY_Y + H + 160, { size: 58, align: 'center', color: YELLOW, t: clamp01(u * 2) });
    });
    thinkingDots(L, 960, 940, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // thử từng vị trí gương: A 181, B 1881 (quá 1000), C 18 + 81 = 99, D 18 + 181 = 199
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Gương che phần bên phải, phản chiếu phần bên trái', 960, 215, { size: 50, align: 'center', color: YELLOW, t: g(p, 'rule') });
    NAMES.forEach((n, i) => {
      const u = g(p, `s${n}`);
      const y = ROW_Y[i];
      L.text(`${n}.`, 120, y + 58, { size: 60, color: YELLOW, t: clamp01(u * 3) });
      strip(L, n, 640, y, 0.5, u);
      const v = clamp01(u * 2 - 1);
      const text = VALUE[n] > LIMIT ? `${VALUE[n]} > ${LIMIT}`
        : SEEN[n].includes('+') ? `${SEEN[n].split('+').join(' + ')} = ${VALUE[n]}` : String(VALUE[n]);
      L.text(text, 1050, y + 58, { size: 56, color: n === 'B' ? RED : n === BEST ? YELLOW : CHALK.white, t: v });
      if (n === 'B') mark(L, false, 1560, y + 40, g(p, 'xB'), { size: 60, seed: 41 });
    });
    row(L, [{ s: `lớn nhất: ${VALUE[BEST]}`, color: YELLOW }], 960, 860, { size: 70, t: g(p, 'best'), seed: 8 });
    mark(L, true, 1560, ROW_Y[NAMES.indexOf(BEST)] + 40, g(p, 'best'), { size: 60, seed: 42 });
    const ans = row(L, [{ s: 'Đáp án:', color: YELLOW }, { s: BEST, color: YELLOW }], 960, 980,
      { size: 80, t: g(p, 'answer'), gap: 0.4, seed: 9 });
    L.loop(ans[1] + 4, 980 - 28, 50, 58, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 12 });
    burst(L, ans[1] + 4, 980 - 28, 80, g(p, 'burst'), { n: 10, seed: 70 });
  },
};
