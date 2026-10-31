// Câu 43. Lịch bị mực che, thấy ngày 4 là Chủ nhật; ngày nào là thứ Tư cuối cùng của tháng.
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../../../shared/web/js/ease.js';
import { g, thinkingDots, popLabel, mark, burst } from '../../../../../../shared/web/js/fx.js';
import { row, solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene2/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;
const RED = CHALK.red;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const HEAD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const SUNDAY = 4; // ngày 4 nằm ở cột Chủ nhật, hàng thứ hai
const WED_COL = 3;
const MAX_DAYS = 31; // một tháng có nhiều nhất 31 ngày
const slot = (d) => d - SUNDAY + 7; // ô thứ mấy của lịch, ngày 4 ở ô 7 (hàng 1, cột 0)
const colOf = (d) => slot(d) % 7;
const rowOf = (d) => Math.floor(slot(d) / 7);
const FIRST_WED = SUNDAY + WED_COL;
const WEDS = [];
for (let d = FIRST_WED; d <= MAX_DAYS; d += 7) WEDS.push(d);
const NEXT_WED = WEDS[WEDS.length - 1] + 7;

console.assert(colOf(SUNDAY) === 0 && rowOf(SUNDAY) === 1, 'Câu 43: ngày 4 ở cột CN, hàng 2');
console.assert(WEDS.join() === '7,14,21,28' && WEDS.every((d) => colOf(d) === WED_COL), 'Câu 43: thứ Tư là 7, 14, 21, 28');
console.assert(NEXT_WED === 35 && NEXT_WED > MAX_DAYS, 'Câu 43: thứ Tư kế tiếp là 35, vượt 31');
console.assert(WEDS[WEDS.length - 1] === 28 && rowOf(28) === 4 && rowOf(MAX_DAYS) === 4, 'Câu 43: đáp số 28, lịch có 5 hàng');

// --- lịch ---------------------------------------------------------------------------------------
const GX = 255; // mép trái
const CW = 150;
const GY = 440; // mép trên hàng ngày đầu tiên
const RH = 85;
const cx = (c) => GX + (c + 0.5) * CW;
const cy = (r) => GY + (r + 0.5) * RH;

function calendar(L, t) {
  const k = clamp01(t);
  if (k <= 0) return;
  L.rect(GX, GY - RH, GX + 7 * CW, GY + 5 * RH, { width: 5, t: clamp01(k * 2), seed: 3 });
  L.line([GX, GY], [GX + 7 * CW, GY], { width: 4, t: clamp01(k * 2 - 0.4), seed: 4 });
  for (let c = 1; c < 7; c++) L.line([GX + c * CW, GY - RH], [GX + c * CW, GY + 5 * RH], { width: 3.5, t: clamp01(k * 2 - 0.5), seed: 10 + c });
  for (let r = 1; r < 5; r++) L.line([GX, GY + r * RH], [GX + 7 * CW, GY + r * RH], { width: 3.5, t: clamp01(k * 2 - 0.5), seed: 20 + r });
}

function head(L, t, hi = 0) {
  HEAD.forEach((s, c) => {
    L.text(s, cx(c), GY - RH / 2 + 18, { size: 46, align: 'center', color: c === WED_COL && hi > 0 ? YELLOW : CHALK.white, t });
  });
}

function day(L, d, t, color = CHALK.white) {
  L.text(String(d), cx(colOf(d)), cy(rowOf(d)) + 17, { size: 46, align: 'center', color, t });
}

// vết mực: che từ cột T3 của hàng 1 trở đi và các hàng dưới, chừa ô CN và T2 của hàng 1, ô CN của hàng 2
const INK = [
  [555, 448], [640, 436], [800, 425], [950, 432], [1100, 420], [1230, 430], [1315, 440], [1320, 700],
  [1318, 875], [600, 880], [250, 875], [248, 700], [252, 618], [398, 614], [404, 545], [430, 528],
  [520, 524], [552, 500],
];
function ink(objs, u) {
  if (u <= 0) return;
  const d = document.createElement('div');
  d.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgb(24,28,30);transform-origin:780px 700px;';
  d.style.clipPath = `polygon(${INK.map(([x, y]) => `${x}px ${y}px`).join(',')})`;
  const q = pop(clamp01(u));
  d.style.transform = `scale(${q.scale / Math.sqrt(q.squash)}, ${q.scale * q.squash})`;
  objs.appendChild(d);
}

// phép tính bên phải
const EQ_X = 1610;
const EQ_Y = [400, 500, 600, 700];

export const scenes = {
  from_prev: previous.beat4,

  beat1(ctx, p) {
    const lines = ctx.chalk(50);
    calendar(lines, g(p, 'cal'));
    const objs = ctx.objects();
    ink(objs, g(p, 'ink'));
    const L = ctx.chalk(60);
    L.text('43. Lịch bị mực che', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Một phần của lịch bị mực che phủ.', 960, 235, { size: 50, align: 'center', t: g(p, 'q1') });
    L.text('Hỏi thứ Tư cuối cùng của tháng là ngày nào?', 960, 310, { size: 50, align: 'center', t: g(p, 'q2') });
    head(L, g(p, 'cal'));
    day(L, SUNDAY, g(p, 'cal'));
    thinkingDots(L, 1610, 560, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // 4 là CN nên thứ Tư đầu là 7; cộng 7 mỗi lần: 14, 21, 28; 35 vượt 31
  beat2(ctx, p) {
    const lines = ctx.chalk(50);
    calendar(lines, g(p, 'cal'));
    const L = ctx.chalk(60);
    head(L, g(p, 'cal'), g(p, 'wed'));
    day(L, SUNDAY, g(p, 'cal'), CHALK.pink);
    L.loop(cx(0), cy(1), 38, 36, { color: CHALK.pink, width: 6, t: g(p, 'sun'), seed: 31 });

    // 7 theo "4 + 3", rồi 14, 21, 28 theo "+ 7"
    const first = g(p, 'first');
    day(L, WEDS[0], first, YELLOW);
    row(L, [String(SUNDAY), '+', String(WED_COL), '=', { s: String(WEDS[0]), color: YELLOW }], EQ_X, EQ_Y[0],
      { size: 58, t: first, seed: 1 });
    WEDS.slice(1).forEach((d, i) => {
      const u = stagger(g(p, 'weds'), i, WEDS.length - 1, 0.45);
      day(L, d, u, YELLOW);
      row(L, [String(WEDS[i]), '+', '7', '=', { s: String(d), color: YELLOW }], EQ_X, EQ_Y[i + 1],
        { size: 58, t: u, seed: 2 + i });
    });

    // 35 vượt quá 31 ngày
    const nx = g(p, 'next');
    row(L, [String(WEDS[WEDS.length - 1]), '+', '7', '=', { s: String(NEXT_WED), color: RED }], EQ_X, 810,
      { size: 58, t: nx, seed: 7 });
    mark(L, false, 1860, 790, clamp01((nx - 0.6) / 0.4), { size: 56, seed: 33 });
    L.text(`${NEXT_WED} > ${MAX_DAYS}`, EQ_X, 890, { size: 52, align: 'center', color: RED, t: g(p, 'limit') });

    const last = WEDS[WEDS.length - 1];
    L.loop(cx(colOf(last)), cy(rowOf(last)), 52, 40, { color: YELLOW, width: 7, t: g(p, 'pick'), seed: 12 });
    popLabel(L, String(last), EQ_X, 1010, g(p, 'pick'), { size: 110 });
    burst(L, cx(colOf(last)), cy(rowOf(last)), 70, g(p, 'burst'), { n: 10, seed: 70 });
  },
};
