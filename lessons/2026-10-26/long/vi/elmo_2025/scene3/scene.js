// Câu 33. Cắt khúc gỗ: n phần cần n - 1 nhát; cứ 3 nhát mất 2 phút.
import { THEME } from '../../../../../../shared/web/theme.js';
import { CHALK } from '../../../../../../shared/web/js/chalk.js';
import { clamp01, pop, spring, stagger } from '../../../../../../shared/web/js/ease.js';
import { tile } from '../../../../../../shared/web/js/tiles.js';
import { g, popLabel } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../../../shared/web/js/parts.js';
import { scenes as previous } from '../scene2/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';
const INK = THEME.tiles.ink;

// --- dữ kiện ------------------------------------------------------------------------------
const MINUTES_PER_LOG = 2;
const PARTS_SAMPLE = 4;
const LOGS = 30;
const PARTS_NEW = 3;
const cutsFor = (parts) => parts - 1;
const CUTS_SAMPLE = cutsFor(PARTS_SAMPLE);
const CUTS_PER_LOG = cutsFor(PARTS_NEW);
const TOTAL_CUTS = LOGS * CUTS_PER_LOG;
const GROUPS = TOTAL_CUTS / CUTS_SAMPLE; // cứ 3 nhát mất 2 phút
const TOTAL_MINUTES = GROUPS * MINUTES_PER_LOG;

console.assert(CUTS_SAMPLE === 3 && CUTS_PER_LOG === 2, 'Câu 33: 4 phần cần 3 nhát, 3 phần cần 2 nhát');
console.assert(TOTAL_CUTS === 60 && Number.isInteger(GROUPS) && GROUPS === 20, 'Câu 33: 60 nhát = 20 nhóm 3 nhát');
console.assert(TOTAL_MINUTES === 40, 'Câu 33: đáp số 40 phút');
// cách phân số cho cùng kết quả: mỗi nhát 2/3 phút
console.assert(Math.abs(TOTAL_CUTS * (MINUTES_PER_LOG / CUTS_SAMPLE) - TOTAL_MINUTES) < 1e-9, 'Câu 33: kiểm chéo');

// --- khúc gỗ ----------------------------------------------------------------------------
function plank(objs, left, cy, w, h) {
  const d = document.createElement('div');
  d.className = 'tile int';
  Object.assign(d.style, { left: `${left}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px` });
  objs.appendChild(d);
}

// Một khúc gỗ nằm ngang; cutP 0..1: lần lượt cắt từng nhát, các phần tách ra bằng lò xo.
function woodLog(objs, L, cx, cy, parts, cutP, { w, h, gapMax = 26, numbers = true, seed = 0 }) {
  if (cutP < 0 && parts < 1) return;
  const pw = (w - (parts - 1) * gapMax) / parts;
  const cuts = Array.from({ length: parts - 1 }, (_, i) => stagger(cutP, i, parts - 1, 0.5));
  const gaps = cuts.map((u) => gapMax * spring(clamp01((u - 0.4) / 0.6), 3.2, 6));
  const total = parts * pw + gaps.reduce((a, b) => a + b, 0);
  let x = cx - total / 2;
  if (cutP <= 0) {
    plank(objs, x, cy, parts * pw, h);
    return;
  }
  for (let i = 0; i < parts; i++) {
    plank(objs, x, cy, pw, h);
    x += pw;
    if (i < parts - 1) {
      const mid = x + gaps[i] / 2;
      L.line([mid, cy - h / 2 - 16], [mid, cy + h / 2 + 16],
        { color: CHALK.red, width: Math.max(3, h * 0.07), t: clamp01(cuts[i] * 2.5), seed: seed + i });
      if (numbers) {
        L.text(String(i + 1), mid, cy - h / 2 - 30,
          { size: 38, align: 'center', color: CHALK.yellow, t: clamp01(cuts[i] * 2.5) });
      }
      x += gaps[i];
    }
  }
}

const GRID_COLS = 10;
const miniX = (i) => 960 + ((i % GRID_COLS) - (GRID_COLS - 1) / 2) * 170;
const miniY = (i) => 560 + Math.floor(i / GRID_COLS) * 62;

export const scenes = {
  from_prev: previous.beat6,

  beat1(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('33. Cắt khúc gỗ', 960, 145, { size: 72, align: 'center', t: g(p, 'title') });
    L.text('Emily mất 2 phút để cắt một khúc gỗ', 960, 250, { size: 46, align: 'center', t: g(p, 'question1') });
    L.text('thành 4 phần.', 960, 312, { size: 46, align: 'center', t: g(p, 'question1') });
    L.text('Hỏi tổng cộng cô ấy mất bao nhiêu phút để cắt', 960, 420, { size: 46, align: 'center', t: g(p, 'question2') });
    L.text('30 khúc gỗ, mỗi khúc thành 3 phần, với cùng', 960, 482, { size: 46, align: 'center', t: g(p, 'question2') });
    L.text('một tốc độ?', 960, 544, { size: 46, align: 'center', t: g(p, 'question2') });
    if (g(p, 'logSample') > 0) {
      woodLog(objs, L, 520, 800, PARTS_SAMPLE, g(p, 'logSample'), { w: 560, h: 80, numbers: false, seed: 10 });
      L.text('2 phút', 520, 940, { size: 52, align: 'center', color: CHALK.yellow, t: g(p, 'logSample') });
    }
    if (g(p, 'logNew') > 0) {
      woodLog(objs, L, 1400, 800, PARTS_NEW, g(p, 'logNew'), { w: 420, h: 80, numbers: false, seed: 20 });
      L.text(`× ${LOGS} khúc`, 1400, 940, { size: 52, align: 'center', color: CHALK.yellow, t: g(p, 'logNew') });
    }
  },

  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },

  // 4 phần cần 3 nhát; 3 nhát mất 2 phút
  beat2(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Cắt thành 4 phần cần mấy nhát?', 960, 130, { size: 60, align: 'center', t: g(p, 'heading') });
    woodLog(objs, L, 960, 470, PARTS_SAMPLE, g(p, 'cuts'), { w: 900, h: 110, gapMax: 34, seed: 30 });
    L.text(`${CUTS_SAMPLE} nhát cắt = ${MINUTES_PER_LOG} phút`, 960, 760,
      { size: 80, align: 'center', color: CHALK.yellow, t: g(p, 'time') });
  },

  // 3 phần cần 2 nhát; 30 khúc cần 60 nhát
  beat3(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text('Cắt thành 3 phần cần mấy nhát?', 960, 130, { size: 60, align: 'center', t: g(p, 'heading') });
    woodLog(objs, L, 960, 320, PARTS_NEW, g(p, 'cuts'), { w: 640, h: 90, gapMax: 30, seed: 40 });
    L.text(`${CUTS_PER_LOG} nhát`, 1480, 335, { size: 56, align: 'center', color: CHALK.yellow, t: g(p, 'cuts') });
    for (let i = 0; i < LOGS; i++) {
      const u = pop(stagger(g(p, 'grid'), i, LOGS, 0.35));
      if (u.scale <= 0) continue;
      const pw = (124 - 2 * 10) / 3;
      const left = miniX(i) - 62;
      for (let k = 0; k < PARTS_NEW; k++) {
        const d = document.createElement('div');
        d.className = 'tile int';
        const s = u.scale;
        Object.assign(d.style, {
          left: `${left + k * (pw + 10) + (pw * (1 - s)) / 2}px`, top: `${miniY(i) - (24 * s) / 2}px`,
          width: `${pw * s}px`, height: `${24 * s}px`, borderRadius: '5px',
        });
        objs.appendChild(d);
      }
    }
    L.text(`${LOGS} × ${CUTS_PER_LOG} = ${TOTAL_CUTS} nhát cắt`, 960, 850,
      { size: 80, align: 'center', color: CHALK.yellow, t: g(p, 'formula') });
  },

  // 60 nhát = 20 nhóm 3 nhát, mỗi nhóm 2 phút
  beat4(ctx, p) {
    const objs = ctx.objects();
    const L = ctx.chalk(60);
    L.text(`Cứ ${CUTS_SAMPLE} nhát cắt thì mất ${MINUTES_PER_LOG} phút`, 960, 130,
      { size: 60, align: 'center', color: CHALK.yellow, t: g(p, 'heading') });
    for (let i = 0; i < GROUPS; i++) {
      const x = 960 + ((i % 10) - 4.5) * 120;
      const y = 330 + Math.floor(i / 10) * 135;
      const u = pop(stagger(g(p, 'groups'), i, GROUPS, 0.4));
      const flip = stagger(g(p, 'minutes'), i, GROUPS, 0.3) > 0.5;
      if (u.scale <= 0) continue;
      if (flip) {
        tile(objs, x, y, String(MINUTES_PER_LOG), 'dec', { scale: 0.85 * u.scale, squash: u.squash });
      } else {
        tile(objs, x, y, '', 'int', { scale: 0.85 * u.scale, squash: u.squash });
        for (let k = -1; k <= 1; k++) {
          L.line([x + k * 18, y - 22 * u.scale], [x + k * 18, y + 22 * u.scale],
            { color: INK, width: 7, seed: 50 + i * 3 + k });
        }
      }
    }
    L.text(`${TOTAL_CUTS} : ${CUTS_SAMPLE} = ${GROUPS} nhóm`, 960, 640,
      { size: 64, align: 'center', t: g(p, 'groupText') });
    popLabel(L, `${GROUPS} × ${MINUTES_PER_LOG} = ${TOTAL_MINUTES} phút`, 960, 830, g(p, 'answer'),
      { size: 90 });
  },
};
