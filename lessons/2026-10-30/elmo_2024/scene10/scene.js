// Câu 50. Bốn sợi dây A, B, C, D: A = (B + C) / 2, 2D = 3C, D / 2 = B. Dây nào dài thứ hai?
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../shared/web/js/ease.js';
import { tile } from '../../../../shared/web/js/tiles.js';
import { g, thinkingDots, popLabel } from '../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene9/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
// Chọn dây D dài 12 phần; các dây còn lại suy ra từ ba điều kiện của đề.
const D = 12;
const C = (2 * D) / 3; // 2D = 3C
const B = D / 2; // một nửa D bằng B
const A = (B + C) / 2; // A bằng một nửa tổng B và C
const LEN = { D, C, B, A };
const ORDER = Object.keys(LEN).sort((x, y) => LEN[y] - LEN[x]);

console.assert(2 * D === 3 * C && D / 2 === B && A === (B + C) / 2, 'Câu 50: ba điều kiện của đề');
console.assert(C === 8 && B === 6 && A === 7 && (B + C) === 14, 'Câu 50: C = 8, B = 6, A = 7 phần');
console.assert(ORDER.join('') === 'DCAB' && ORDER[1] === 'C', 'Câu 50: D > C > A > B, dài thứ hai là C');
console.assert(new Set(Object.values(LEN)).size === 4, 'Câu 50: bốn dây dài khác nhau');

// --- thẻ gỗ: mỗi phần của dây là một khối -------------------------------------------------
const ROWS = ['D', 'C', 'B', 'A']; // thứ tự dựng trên bảng
const ROW_Y = { D: 310, C: 440, B: 570, A: 700 };
const UNIT = 62;
const X0 = 420;
const KIND = { D: 'int', C: 'dec', B: 'int', A: 'dec' };

function stringRow(objs, L, name, t) {
  const n = LEN[name];
  const y = ROW_Y[name];
  L.text(name, 290, y + 20, { size: 60, color: YELLOW, t: clamp01(t * 6) });
  for (let i = 0; i < n; i++) {
    const q = pop(stagger(t, i, n, 0.4));
    tile(objs, X0 + i * UNIT, y, '', KIND[name], { scale: 0.52 * q.scale, squash: q.squash });
  }
}

const RANK = { D: 1, C: 2, A: 3, B: 4 };

export const scenes = {
  from_prev: previous.beat2,

  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('50. Bốn sợi dây', 960, 130, { size: 72, align: 'center', t: g(p, 'title') });
    const intro = [
      ['A, B, C và D biểu thị cho 4 sợi dây có độ dài khác nhau.', 'q1', 215],
      ['Độ dài của các sợi dây được so sánh trong các câu sau.', 'q2', 280],
    ];
    intro.forEach(([s, k, y]) => L.text(s, 960, y, { size: 42, align: 'center', t: g(p, k) }));
    const bullets = [
      ['Dây A bằng một nửa tổng độ dài của dây B và dây C.', 'q3', 385],
      ['Hai lần độ dài của dây D bằng ba lần độ dài của dây C.', 'q4', 465],
      ['Một nửa độ dài của dây D bằng độ dài của dây B.', 'q5', 545],
    ];
    bullets.forEach(([s, k, y]) => {
      L.dot(300, y - 14, 8, { t: g(p, k) });
      L.text(s, 340, y, { size: 42, t: g(p, k) });
    });
    L.text('Hỏi sợi dây nào dài thứ hai trong số các sợi dây A, B, C và D?', 960, 660,
      { size: 44, align: 'center', color: YELLOW, t: g(p, 'q6') });
    ['A', 'B', 'C', 'D'].forEach((s, i) => {
      L.text(s, 540 + i * 280, 790, { size: 64, align: 'center', t: stagger(g(p, 'opts'), i, 4, 0.4) });
    });
    thinkingDots(L, 960, 940, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // chọn D = 12 phần, suy ra C = 8, B = 6, A = 7; thứ tự D > C > A > B
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    stringRow(objs, L, 'D', g(p, 'd'));
    stringRow(objs, L, 'C', g(p, 'c'));
    stringRow(objs, L, 'B', g(p, 'b'));
    stringRow(objs, L, 'A', g(p, 'a'));
    L.text('12 phần', 1260, ROW_Y.D + 18, { size: 50, color: YELLOW, t: g(p, 'd') });
    row(L, ['2', { sym: 'times' }, '12', '=', '24', ':', '3', '=', { s: '8', color: YELLOW }], 1450, ROW_Y.C + 18,
      { size: 50, t: g(p, 'ceq'), seed: 1 });
    row(L, ['12', ':', '2', '=', { s: '6', color: YELLOW }], 1330, ROW_Y.B + 18, { size: 50, t: g(p, 'beq'), seed: 2 });
    row(L, ['(', '6', '+', '8', ')', ':', '2', '=', { s: '7', color: YELLOW }], 1380, ROW_Y.A + 18,
      { size: 50, t: g(p, 'aeq'), seed: 3 });
    ROWS.forEach((n) => {
      const t = g(p, 'rank');
      popLabel(L, String(RANK[n]), 190, ROW_Y[n] + 22, stagger(t, RANK[n] - 1, 4, 0.4), { size: 64 });
    });
    L.loop(190, ROW_Y.C - 6, 44, 44, { color: YELLOW, width: 7, t: g(p, 'pick'), seed: 12 });
    const xs = row(L, [{ s: 'Đáp án:', color: YELLOW }, { s: 'C', color: YELLOW }], 960, 920,
      { size: 90, t: g(p, 'answer'), gap: 0.4, seed: 9 });
    L.loop(xs[1] + 4, 920 - 30, 52, 62, { color: YELLOW, width: 7, t: g(p, 'circle'), seed: 13 });
  },

  outro(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Cảm ơn các bạn đã xem video!', 960, 340, { size: 76, align: 'center', color: YELLOW, t: g(p, 'thanks') });
    L.text('Học cùng Phượng', 960, 500, { size: 94, align: 'center', t: g(p, 'subscribe') });
    L.text('Hãy đăng ký kênh Học cùng Phượng', 960, 650, { size: 64, align: 'center', t: g(p, 'subscribe') });
    L.text('để đón xem những video tiếp theo.', 960, 750, { size: 60, align: 'center', t: g(p, 'subscribe') });
  },
};
