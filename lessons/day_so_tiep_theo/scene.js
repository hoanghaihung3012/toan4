// Tìm số tiếp theo của dãy 1, 4, 10, 22, 46, … Facts: lessons/day_so_tiep_theo/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../shared/web/js/chalk.js';
import { clamp01, lerp, easeOutCubic, easeInOut, stagger, pop } from '../../shared/web/js/ease.js';
import { TILE_H } from '../../shared/web/js/tiles.js';
import { row, arcArrow, flight } from '../../shared/web/js/parts.js';
import {
  g, dropPose, dust, sparks, burst, mark, hopY, hopSquash, outScale, numTile, numW, blockXs, arc,
  thinkingDots, countdown, popLabel,
} from '../../shared/web/js/fx.js';

// --- facts (story.md F1–F3, D1–D2), checked -------------------------------------------
const SEQ = [1, 4, 10, 22, 46]; // F1
const ANS = 94; // F2
const NEXT = 190; // F3 / D2
const FULL = [...SEQ, ANS, NEXT];
const STEPS = FULL.slice(1).map((n, i) => n - FULL[i]); // 3, 6, 12, 24, 48, 96
console.assert(STEPS.join() === '3,6,12,24,48,96', 'steps');
STEPS.slice(1).forEach((s, i) => console.assert(s === 2 * STEPS[i], `step ${s} = 2 x ${STEPS[i]}`));
FULL.slice(1).forEach((n, i) => console.assert(n === FULL[i] * 2 + 2, `${n} = ${FULL[i]} x 2 + 2`));
console.assert(24 * 2 === 48 && 46 + 48 === ANS && 48 * 2 === 96 && ANS + 96 === NEXT, 'answers');

const str = String;
const TIMES = (color) => ({ sym: 'times', color });

// --- board A (beats 1–4): the sequence, its jumps and the doubling ------------------
const A = { cx: 552, y: 930, gap: 36, titleY: 250, labY: 745, xY: 640, xTextY: 590, eq1: 1200, eq2: 1420 };
const A_ITEMS = [...SEQ.map(str), str(ANS)]; // the last one is the empty slot
const A_XS = blockXs(A_ITEMS.map((s) => s.length), A.cx, A.gap);
const A_TOP = A.y - TILE_H / 2 - 8;
const A_MID = A_XS.slice(1).map((x, i) => (x + A_XS[i]) / 2); // centres of the jumps

// beat keys in order; a later beat's keys are 0 while an earlier beat plays
const KEYS_A = [
  ['t1', 't2', 't3', 't4', 't5', 'slot', 'title', 'q', 'dots'],
  ['idea', 'shake', 'bounce', 'hop1', 'lab1', 'hop2', 'lab2', 'hop3', 'lab3', 'hop4', 'lab4'],
  ['look', 'x1', 'x2', 'x3'],
  ['hop5', 'x4', 'eq1', 'lab5', 'eq2', 'fill', 'loop', 'ok'],
];
const KEYS_B = [
  ['title', 'drop', 'hops', 'q', 'cmt', 'count'],
  ['hop', 'x', 'eq1', 'lab', 'eq2', 'fill', 'loop', 'ok'],
];
function at(keys, i, p) {
  const q = {};
  keys.slice(i + 1).flat().forEach((k) => { q[k] = 0; });
  return { ...q, ...p };
}

// yellow jump arc from block i to block i+1 (xs, top y) with its "+n" label
function jump(L, xs, ws, top, i, v, lab, labY, n, pulse = 0) {
  const from = [xs[i] + ws[i] * 0.22, top];
  const to = [xs[i + 1] - ws[i + 1] * 0.22, top];
  arcArrow(L, from, to, 88, easeOutCubic(v), 300 + i * 5);
  popLabel(L, `+${n}`, (xs[i] + xs[i + 1]) / 2, labY, lab, { size: 84, pulse });
}

// pink "×2" arc from jump label i to jump label i+1
function doubling(L, mids, i, v, y, textY) {
  if (v <= 0) return;
  arc(L, [mids[i] + 14, y], [mids[i + 1] - 14, y], 46, easeOutCubic(v), { color: CHALK.pink, width: 5, head: 18, seed: 400 + i * 5 });
  const k = clamp01((v - 0.4) / 0.6);
  if (k > 0) row(L, [TIMES(CHALK.pink), { s: '2', color: CHALK.pink }], (mids[i] + mids[i + 1]) / 2, textY,
    { size: 62, t: k, seed: 410 + i });
}

// the empty slot with a "?" that shrinks away when the answer grows in
function slot(objs, L, x, y, s, { show, q, fill, scale = 1 }) {
  const k = pop(show);
  const fillIn = clamp01((fill - 0.3) / 0.7);
  if (fillIn <= 0) numTile(objs, x, y, '', 'blank', { scale: k.scale * scale, squash: k.squash, digits: s.length });
  const qk = outScale(q, clamp01(fill / 0.3));
  if (qk > 0) L.text('?', x, y + 40 * scale, { size: 116 * scale, color: CHALK.yellow, align: 'center', scale: qk });
  if (fillIn > 0) {
    const f = pop(fillIn);
    numTile(objs, x, y, s, 'int', { scale: f.scale * scale, squash: f.squash });
  }
}

function boardA(ctx, p) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const ws = A_ITEMS.map((s) => numW(s.length));

  L.text('Số tiếp theo là gì?', A.cx, A.titleY, { size: 100, align: 'center', t: g(p, 'title') });
  // "Mẹo nè": an idea burst around the question
  const idea = g(p, 'idea');
  if (idea < 1) {
    burst(L, A.cx - 430, A.titleY - 34, 60, idea, { seed: 560 });
    burst(L, A.cx + 430, A.titleY - 34, 60, clamp01(idea * 1.2 - 0.1), { seed: 570 });
  }

  // the five numbers drop in on the voice; then hop one after another ("look at the jumps")
  SEQ.forEach((n, i) => {
    const u = g(p, `t${i + 1}`);
    const pose = dropPose(u, A.y, 560);
    const b = stagger(g(p, 'bounce') < 1 ? g(p, 'bounce') : 0, i, SEQ.length, 0.4);
    const sh = g(p, 'shake') < 1 ? g(p, 'shake') : 0; // "đừng nhìn số": the numbers shake "no"
    const dx = sh > 0 ? 32 * Math.sin(6 * Math.PI * sh) * Math.sin(Math.PI * sh) : 0;
    if (pose) {
      numTile(objs, A_XS[i] + dx, pose.y + hopY(b, 40), str(n), 'int', { squash: pose.squash * hopSquash(b) });
    }
    dust(under, A_XS[i], A.y + TILE_H / 2, clamp01((u - 0.55) / 0.45), 60 + i * 7, 1, ws[i] * 0.4);
  });
  slot(objs, L, A_XS[5], A.y, str(ANS), { show: g(p, 'slot'), q: g(p, 'q'), fill: g(p, 'fill') });
  thinkingDots(L, A.cx, 1250, g(p, 'dots') < 1 ? g(p, 'dots') : 0);

  // jumps +3, +6, +12, +24; the labels pulse on "Thấy gì không?"
  const look = g(p, 'look') < 1 ? g(p, 'look') : 0;
  for (let i = 0; i < 4; i++) {
    jump(L, A_XS, ws, A_TOP, i, g(p, `hop${i + 1}`), g(p, `lab${i + 1}`), A.labY, STEPS[i], stagger(look, i, 4, 0.4));
  }
  // doubling arcs ×2 between the jumps
  for (let i = 0; i < 4; i++) doubling(L, A_MID, i, g(p, `x${i + 1}`), A.xY, A.xTextY);
  // next jump +48 to the slot
  jump(L, A_XS, ws, A_TOP, 4, g(p, 'hop5'), g(p, 'lab5'), A.labY, STEPS[4]);

  // working at the bottom: 24 × 2 = 48, 46 + 48 = 94
  row(L, ['24', TIMES(), '2', '=', { s: '48', color: CHALK.yellow }], A.cx, A.eq1, { size: 120, t: g(p, 'eq1'), seed: 500 });
  const ex = row(L, ['46', '+', '48', '=', { s: str(ANS), color: CHALK.yellow }], A.cx - 40, A.eq2,
    { size: 120, t: g(p, 'eq2'), seed: 510, gap: 0.36 });
  L.loop(ex[4], A.eq2 - 38, 90, 82, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 520 });
  arcArrow(L, [ex[4] + 40, A.eq2 - 124], [A_XS[5], A.y + TILE_H / 2 + 22], -60, easeInOut(clamp01(g(p, 'fill') * 1.6)), 530);
  mark(L, true, ex[4] + 180, A.eq2 - 44, g(p, 'ok'), { size: 100, seed: 540 });
}

const beat1 = (ctx, p) => boardA(ctx, at(KEYS_A, 0, p));
const beat2 = (ctx, p) => boardA(ctx, at(KEYS_A, 1, p));
const beat3 = (ctx, p) => boardA(ctx, at(KEYS_A, 2, p));
const beat4 = (ctx, p) => boardA(ctx, at(KEYS_A, 3, p));

// --- beat 5: the second way, "× 2 + 2" as a chain -----------------------------------
const C = { titleY: 250, ys: [450, 640, 830, 1020, 1230], tileX: 165, opsX: 285, tickX: 950, tileS: 1.15, bigY: 1485 };

function chainRow(objs, L, k, u, prevEnd) {
  const y = C.ys[k];
  const inN = str(FULL[k]);
  const outN = str(FULL[k + 1]);
  const last = k === C.ys.length - 1;
  // input block: the first pops in; the others fly down from the previous result
  const fly = clamp01(u / 0.3);
  if (k === 0) {
    const s = pop(fly);
    numTile(objs, C.tileX, y, inN, 'int', { scale: s.scale * C.tileS, squash: s.squash });
  } else if (fly > 0) {
    // starts just under the previous result (which stays readable), then arcs to the left
    const f = flight([prevEnd[0], prevEnd[1] + 100], [C.tileX, y], fly, -40);
    numTile(objs, f.x, f.y, inN, 'int', { scale: lerp(0.55, C.tileS, easeInOut(f.v)), squash: f.squash });
  }
  const parts = [TIMES(CHALK.pink), { s: '2', color: CHALK.pink }, { s: '+', color: CHALK.pink }, { s: '2', color: CHALK.pink },
    '=', { s: outN, color: CHALK.yellow, size: last ? 120 : 104 }];
  const xs = row(L, parts, C.opsX, y + 36, { size: 100, align: 'left', gap: 0.28, t: clamp01((u - 0.3) / 0.55), seed: 600 + k * 9 });
  if (!last) mark(L, true, C.tickX, y, clamp01((u - 0.85) / 0.15), { size: 66, seed: 620 + k * 9 });
  return [xs[5], y];
}

function beat5(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  row(L, ['Cách 2:', TIMES(CHALK.pink), { s: '2', color: CHALK.pink }, { s: '+', color: CHALK.pink }, { s: '2', color: CHALK.pink }],
    552, C.titleY, { size: 100, t: g(p, 'title'), seed: 590 });
  let end = null;
  C.ys.forEach((_, k) => {
    const u = g(p, `r${k + 1}`);
    if (u <= 0 && k > 0) return;
    end = chainRow(objs, L, k, u, end);
  });
  const [rx, ry] = [end[0], end[1]];
  L.loop(rx, ry, 88, 80, { color: CHALK.yellow, width: 6, t: g(p, 'loop5'), seed: 660 });
  mark(L, true, C.tickX, ry, g(p, 'ok5'), { size: 96, seed: 670 });
  // both ways give 94: a big block pops up under the chain
  const b = pop(g(p, 'big'));
  numTile(objs, 552, C.bigY, str(ANS), 'int', { scale: 1.5 * b.scale, squash: b.squash });
  sparks(L, 552, C.bigY, 135, 178, clamp01(g(p, 'big') * 1.4 - 0.3), { seed: 680 });
}

// --- beats 6–7: challenge, the number after 94 ---------------------------------------
const B = { cx: 552, y: 930, gap: 40, s: 1.25, titleY: 250, cmtY: 380, labY: 740, xY: 640, xTextY: 590, countY: 1300, eq1: 1200, eq2: 1420 };
const B_ITEMS = [str(SEQ[3]), str(SEQ[4]), str(ANS), str(NEXT)];
const B_XS = blockXs(B_ITEMS.map((s) => s.length), B.cx, B.gap, B.s);
const B_WS = B_ITEMS.map((s) => numW(s.length) * B.s);
const B_TOP = B.y - (TILE_H * B.s) / 2 - 8;
const B_MID = B_XS.slice(1).map((x, i) => (x + B_XS[i]) / 2);

function boardB(ctx, p) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  L.text('Đến lượt bạn!', B.cx, B.titleY, { size: 108, align: 'center', t: g(p, 'title') });
  L.text('Bình luận đáp án nhé!', B.cx, B.cmtY, { size: 76, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
  B_ITEMS.slice(0, 3).forEach((s, i) => {
    const u = stagger(g(p, 'drop'), i, 3, 0.5);
    const pose = dropPose(u, B.y, 480);
    if (pose) numTile(objs, B_XS[i], pose.y, s, 'int', { scale: B.s, squash: pose.squash });
    dust(under, B_XS[i], B.y + (TILE_H * B.s) / 2, clamp01((u - 0.55) / 0.45), 700 + i * 7, B.s, B_WS[i] * 0.4);
  });
  slot(objs, L, B_XS[3], B.y, str(NEXT), { show: g(p, 'q'), q: g(p, 'q'), fill: g(p, 'fill'), scale: B.s });
  // the pattern so far: +24, +48 and ×2 between them
  const h = g(p, 'hops');
  jump(L, B_XS, B_WS, B_TOP, 0, clamp01(h * 2), clamp01(h * 2 - 0.4), B.labY, STEPS[3]);
  jump(L, B_XS, B_WS, B_TOP, 1, clamp01(h * 2 - 0.6), clamp01(h * 2 - 1), B.labY, STEPS[4]);
  doubling(L, B_MID, 0, clamp01(h * 1.6 - 0.6), B.xY, B.xTextY);
  countdown(L, B.cx, B.countY, g(p, 'count') < 1 ? g(p, 'count') : 0);

  // the answer: ×2 → +96, jump into the slot, 48 × 2 = 96, 94 + 96 = 190
  doubling(L, B_MID, 1, g(p, 'x'), B.xY, B.xTextY);
  jump(L, B_XS, B_WS, B_TOP, 2, g(p, 'hop'), g(p, 'lab'), B.labY, STEPS[5]);
  row(L, ['48', TIMES(), '2', '=', { s: '96', color: CHALK.yellow }], B.cx, B.eq1, { size: 120, t: g(p, 'eq1'), seed: 750 });
  const ex = row(L, ['94', '+', '96', '=', { s: str(NEXT), color: CHALK.yellow }], B.cx - 60, B.eq2,
    { size: 120, t: g(p, 'eq2'), seed: 760, gap: 0.4 });
  L.loop(ex[4], B.eq2 - 38, 118, 84, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 770 });
  arcArrow(L, [ex[4] + 30, B.eq2 - 124], [B_XS[3], B.y + (TILE_H * B.s) / 2 + 22], -60, easeInOut(clamp01(g(p, 'fill') * 1.6)), 780);
  mark(L, true, ex[4] + 200, B.eq2 - 44, g(p, 'ok'), { size: 100, seed: 790 });
}

const beat6 = (ctx, p) => boardB(ctx, at(KEYS_B, 0, p));
const beat7 = (ctx, p) => boardB(ctx, at(KEYS_B, 1, p));

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7 };
