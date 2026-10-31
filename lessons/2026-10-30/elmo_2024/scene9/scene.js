// Câu 49. Lịch tháng 5 bị mực che: ngày 1 là thứ Tư, tháng có 31 ngày; ngày cuối là thứ mấy.
import { CHALK } from '../../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger } from '../../../../shared/web/js/ease.js';
import { g, thinkingDots, popLabel } from '../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene8/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const YELLOW = CHALK.yellow;

// --- dữ kiện: mọi con số trên bảng đều tính từ đây -----------------------------------
const HEAD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const DAYS = 31; // tháng 5 có 31 ngày
const FIRST_COL = 3; // ngày 1 rơi vào thứ Tư (cột T4)
const slot = (d) => FIRST_COL + d - 1;
const colOf = (d) => slot(d) % 7;
const rowOf = (d) => Math.floor(slot(d) / 7);
const WEDS = [...Array(DAYS).keys()].map((i) => i + 1).filter((d) => colOf(d) === FIRST_COL);
const LAST = colOf(DAYS);
const SHOWN = [1, 2, 3, 4, 5, 11]; // các ngày còn thấy trong đề (mực che phần còn lại)
const OPTIONS = ['A', 'B', 'C', 'D'];
const OPTION_DAY = ['Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const RIGHT = OPTION_DAY.indexOf(WEEKDAY[LAST]);

console.assert(WEDS.join() === '1,8,15,22,29', 'Câu 49: các ngày thứ Tư là 1, 8, 15, 22, 29');
console.assert(colOf(30) === 4 && colOf(31) === 5 && WEEKDAY[LAST] === 'Thứ Sáu', 'Câu 49: ngày 30 thứ Năm, ngày 31 thứ Sáu');
console.assert(SHOWN.every((d) => rowOf(d) <= 1) && rowOf(5) === 1 && colOf(5) === 0 && colOf(11) === 6, 'Câu 49: 5 là Chủ nhật, 11 là thứ Bảy');
console.assert(OPTIONS[RIGHT] === 'C' && rowOf(DAYS) === 4, 'Câu 49: đáp án C, lịch có 5 hàng');

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
    L.text(s, cx(c), GY - RH / 2 + 18, { size: 46, align: 'center', color: c === FIRST_COL && hi > 0 ? YELLOW : CHALK.white, t });
  });
}

function day(L, d, t, color = CHALK.white) {
  L.text(String(d), cx(colOf(d)), cy(rowOf(d)) + 17, { size: 46, align: 'center', color, t });
}

// vết mực: đa giác che các ô từ hàng 2 xuống hết lịch, chừa ngày 5 và 11
const INK = [
  [270, 612], [400, 612], [410, 560], [440, 535], [560, 528], [700, 541], [820, 531], [950, 539], [1100, 530],
  [1150, 552], [1160, 612], [1290, 612], [1300, 700], [1310, 790], [1290, 872], [1000, 882], [600, 884],
  [280, 874], [262, 790], [268, 700],
];
function ink(objs, u) {
  if (u <= 0) return;
  const d = document.createElement('div');
  d.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgb(24,28,30);transform-origin:780px 730px;';
  d.style.clipPath = `polygon(${INK.map(([x, y]) => `${x}px ${y}px`).join(',')})`;
  const q = pop(clamp01(u));
  d.style.transform = `scale(${q.scale / Math.sqrt(q.squash)}, ${q.scale * q.squash})`;
  objs.appendChild(d);
}

const OPT_X = 1470;
const optY = (i) => 520 + i * 100;
function options(L, t, hi = 0) {
  OPTIONS.forEach((n, i) => {
    const u = stagger(t, i, OPTIONS.length, 0.4);
    L.text(`${n}. ${OPTION_DAY[i]}`, OPT_X, optY(i), { size: 54, color: i === RIGHT && hi > 0 ? YELLOW : CHALK.white, t: u });
  });
  if (hi > 0) L.loop(OPT_X + 130, optY(RIGHT) - 18, 190, 48, { color: YELLOW, width: 7, t: hi, seed: 12 });
}

export const scenes = {
  from_prev: previous.beat3,

  beat1(ctx, p) {
    const lines = ctx.chalk(50);
    calendar(lines, g(p, 'cal'));
    const objs = ctx.objects();
    ink(objs, g(p, 'ink'));
    const L = ctx.chalk(60);
    L.text('49. Lịch tháng 5', 960, 140, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Một phần của lịch tháng 5 bị mực che phủ.', 960, 235, { size: 48, align: 'center', t: g(p, 'q1') });
    L.text('Hỏi thứ nào là ngày cuối cùng của tháng?', 960, 310, { size: 48, align: 'center', t: g(p, 'q2') });
    head(L, g(p, 'cal'));
    SHOWN.forEach((d) => day(L, d, g(p, 'cal')));
    options(L, g(p, 'opts'));
    thinkingDots(L, 960, 985, g(p, 'think'));
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // ngày 1 là thứ Tư nên 8, 15, 22, 29 cũng thứ Tư; 30 thứ Năm, 31 thứ Sáu
  beat2(ctx, p) {
    const lines = ctx.chalk(50);
    calendar(lines, 1);
    const L = ctx.chalk(60);
    L.text('Ngày 1 là thứ Tư', 960, 190, { size: 64, align: 'center', color: YELLOW, t: g(p, 'title') });
    head(L, 1, g(p, 'wed'));
    SHOWN.filter((d) => !WEDS.includes(d)).forEach((d) => day(L, d, 1));
    WEDS.forEach((d, i) => {
      const t = i === 0 ? g(p, 'first') : stagger(g(p, 'weds'), i - 1, WEDS.length - 1, 0.4);
      day(L, d, t, YELLOW);
    });
    if (g(p, 'first') > 0) {
      L.loop(cx(colOf(1)), cy(rowOf(1)), 36, 34, { color: YELLOW, width: 6, t: g(p, 'first'), seed: 31 });
    }
    day(L, 30, g(p, 'd30'), YELLOW);
    day(L, 31, g(p, 'd31'), YELLOW);
    L.text('Thứ Năm', cx(colOf(30)), cy(rowOf(30)) + 78, { size: 34, align: 'center', color: YELLOW, t: g(p, 'd30') });
    L.text('Thứ Sáu', cx(colOf(31)), cy(rowOf(31)) + 78, { size: 34, align: 'center', color: YELLOW, t: g(p, 'd31') });
    if (g(p, 'd31') > 0) {
      L.loop(cx(colOf(31)), cy(rowOf(31)), 40, 36, { color: YELLOW, width: 6, t: g(p, 'd31'), seed: 32 });
    }
    options(L, 1, g(p, 'pick'));
    popLabel(L, `${DAYS} ngày`, 1650, 330, g(p, 'days'), { size: 60 });
  },
};
