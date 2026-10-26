// Tìm số trung bình cộng (Toán 4). Facts: lessons/trung_binh_cong/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, lerp, easeInOut, arcPoint, stagger, pop, landSquash, spring } from '../../../../../shared/web/js/ease.js';
import { tile, TILE_H, badge } from '../../../../../shared/web/js/tiles.js';
import { row, bar, arcArrow, flight } from '../../../../../shared/web/js/parts.js';

// --- facts (VnDoc, Toán 4 bài 22, Bài toán 1), checked ------------------------
const CAN_A = 6, CAN_B = 4, CANS = 2;
const AVG = (CAN_A + CAN_B) / CANS;
console.assert(AVG === 5 && Number.isInteger(AVG), 'avg 6,4');
// Bài toán 2 (VnDoc) and Dạng 2 (VietJack); the challenge is derived from both
const CLASSES = [25, 27, 32];
const SUM3 = CLASSES.reduce((a, b) => a + b, 0);
const AVG3 = SUM3 / CLASSES.length;
console.assert(SUM3 === 84 && AVG3 === 28, 'avg 25,27,32');
const AVG4 = 54, N4 = 4, SUM4 = AVG4 * N4;
console.assert(SUM4 === 216, '54 x 4');
const MISSING = AVG3 * 3 - CLASSES[0] - CLASSES[1];
console.assert(MISSING === CLASSES[2], 'missing class = 32');

// --- layout ---------------------------------------------------------------------
const g = (p, k) => (k in p ? p[k] : 1);
const FLOOR = 1250; // inside bottom of both cans
const STEP = TILE_H + 8; // one litre block per row
const CAN_X = [330, 750];
const CAN_TOP = 520;
const blockY = (k) => FLOOR - TILE_H / 2 - 6 - k * STEP; // k = 0 is the bottom block
const LEVEL_Y = blockY(AVG - 1) - TILE_H / 2 - 8;
const LABEL_Y = 1370;

function title(ctx, t, text = 'Trung bình cộng') {
  const tc = THEME.layout.titleCentered;
  ctx.chalk(60).text(text, 540, tc.y, { size: tc.size, t, align: 'center' });
}

// chalk jerrycan: body, cap on the left shoulder, carry handle on the right
function can(L, x, t, seed) {
  const l = x - 92, r = x + 92, b = FLOOR + 12;
  L.poly([[l + 18, CAN_TOP], [r - 18, CAN_TOP], [r, CAN_TOP + 18], [r, b - 14], [r - 14, b],
    [l + 14, b], [l, b - 14], [l, CAN_TOP + 18], [l + 18, CAN_TOP]], { width: 5, t, seed, amp: 1.2 });
  L.rect(l + 26, CAN_TOP - 34, l + 66, CAN_TOP, { width: 5, t, seed: seed + 1 });
  L.poly([[r - 80, CAN_TOP], [r - 74, CAN_TOP - 40], [r - 24, CAN_TOP - 40], [r - 18, CAN_TOP]],
    { width: 5, t, seed: seed + 2, amp: 1 });
}

// a column of n litre blocks popping in from the bottom (raw window)
function fill(objs, x, n, prog) {
  for (let k = 0; k < n; k++) {
    const { scale, squash } = pop(stagger(prog, k, n, 0.4));
    tile(objs, x, blockY(k), '', 'int', { scale, squash });
  }
}

// the top block of can A: anticipation dip, arc over the cans, squash on landing
function movePose(u) {
  const from = [CAN_X[0], blockY(CAN_A - 1)];
  const to = [CAN_X[1], blockY(CAN_B)];
  if (u <= 0) return { x: from[0], y: from[1], squash: 1 };
  if (u < 0.15) {
    const a = Math.sin((Math.PI * u) / 0.15);
    return { x: from[0] - 6 * a, y: from[1] + 10 * a, squash: 1 - 0.14 * a };
  }
  const v = easeInOut((u - 0.15) / 0.85);
  const [x, y] = arcPoint(from, to, v, 230);
  return { x, y, squash: landSquash(v, 0.2, 0.22) * (v < 0.5 ? 1 + 0.08 * Math.sin(Math.PI * v * 2) : 1) };
}

// dashed chalk arc that trails behind the moving block, with a head at the end
function trail(L, u) {
  const v = clamp01((u - 0.15) / 0.85);
  if (v <= 0) return;
  const from = [CAN_X[0] + 30, blockY(CAN_A - 1) - 80];
  const to = [CAN_X[1] - 30, blockY(CAN_B) - 80];
  const pts = [];
  const n = 24;
  for (let i = 0; i <= n; i++) pts.push(arcPoint(from, to, (i / n) * easeInOut(v), 200));
  L.poly(pts, { color: CHALK.yellow, width: 5, seed: 31, amp: 0.6 });
  if (v >= 1) {
    const [x1, y1] = to;
    const [x0, y0] = arcPoint(from, to, 0.94, 200);
    const a = Math.atan2(y1 - y0, x1 - x0);
    for (const s of [-1, 1]) {
      L.line([x1, y1], [x1 - 26 * Math.cos(a + s * 0.5), y1 - 26 * Math.sin(a + s * 0.5)],
        { color: CHALK.yellow, width: 5, seed: 32 + s });
    }
  }
}

function labels(L, p) {
  const t = g(p, 'labels');
  const fix = g(p, 'fix');
  [CAN_A, CAN_B].forEach((n, i) => {
    const x = CAN_X[i];
    const ox = lerp(x, x - 78, easeInOut(fix));
    L.text(`${n} lít`, ox, LABEL_Y, { size: 64, t, align: 'center' });
    if (fix > 0) {
      L.line([ox - 68, LABEL_Y - 16], [ox + 68, LABEL_Y - 32], { color: CHALK.red, width: 6, t: fix, seed: 20 + i });
      L.text(`${AVG} lít`, x + 78, LABEL_Y, { size: 64, color: CHALK.yellow, t: clamp01(fix * 1.6 - 0.6), align: 'center' });
    }
  });
}

function beat1(ctx, p) {
  title(ctx, g(p, 'title'), 'Trung bình cộng (TBC)');
  const L = ctx.chalk(50);
  can(L, CAN_X[0], g(p, 'cans'), 10);
  can(L, CAN_X[1], g(p, 'cans'), 14);
  labels(L, p);

  const move = g(p, 'move');
  // ghost slot where the moved litre used to be
  const objsBack = ctx.objects();
  if (move > 0.15) tile(objsBack, CAN_X[0], blockY(CAN_A - 1), '', 'blank');

  const objs = ctx.objects();
  fill(objs, CAN_X[0], CAN_A - 1, g(p, 'fillA'));
  fill(objs, CAN_X[1], CAN_B, g(p, 'fillB'));
  // the litre that travels: part of can A's pop-in, then flies to can B
  const lp = pop(stagger(g(p, 'fillA'), CAN_A - 1, CAN_A, 0.4));
  const m = movePose(move);
  if (lp.scale > 0) tile(objs, m.x, m.y, '', 'int', move > 0 ? { squash: m.squash } : lp);

  const top = ctx.chalk(60);
  trail(top, move);
  // "?" between the cans: springs in, winds up and shrinks away before the pour
  const q = g(p, 'q');
  const qo = g(p, 'qOut');
  const qs = q * (qo < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (qo / 0.3)) : 1.15 * (1 - (qo - 0.3) / 0.7));
  if (qs > 0) top.text('?', 540, 900, { size: 150, color: CHALK.yellow, scale: qs, align: 'center' });
  // equal level line across both cans
  top.dashed([CAN_X[0] - 130, LEVEL_Y], [CAN_X[1] + 130, LEVEL_Y], { color: CHALK.yellow, width: 5, t: g(p, 'level') });

  // result line: "TBC của 6 và 4 = 5", the answer circled
  const r = g(p, 'tbc');
  const y = 1580;
  const w = top.text(`TBC của ${CAN_A} và ${CAN_B} = `, 130, y, { size: 80, t: r });
  top.text(String(AVG), 130 + w + 34, y, { size: 96, color: CHALK.yellow, t: clamp01(r * 3 - 2) });
  top.loop(130 + w + 60, y - 32, 62, 66, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 41 });
}


// --- beat 2: three classes levelled to 28 ----------------------------------------
const BAR_W = 150; // parts.js bar() default width
const BX = [270, 540, 810];
const BASE2 = 1180, UNIT2 = 55;
// bars start at 20 students (a chalk zigzag marks the cut) so the small differences show
const FROM = 20, STUB = 80;
const hOf = (n, unit) => STUB + (n - FROM) * unit;
const LEVEL2 = BASE2 - hOf(AVG3, UNIT2);

// zigzag across the bottom of a bar: the axis is broken, the bar does not start at 0
function breakMark(L, x, base, t, seed) {
  const y = base - STUB / 2, w = BAR_W / 2 + 12;
  L.poly([[x - w, y + 8], [x - w / 2, y - 8], [x, y + 8], [x + w / 2, y - 8], [x + w, y + 8]],
    { width: 5, t, seed, amp: 0.5 });
}

function beat2(ctx, p) {
  title(ctx, g(p, 'title'), 'Trung bình mỗi lớp');
  const L = ctx.chalk(50);
  const grow = g(p, 'bars');
  const cut = g(p, 'cut');
  const m1 = g(p, 'move1'), m3 = g(p, 'move3');
  const give1 = CLASSES[1 + 0] < AVG3 ? AVG3 - CLASSES[1] : 0; // 1 student to B
  const give3 = AVG3 - CLASSES[0]; // 3 students to A
  console.assert(give1 + give3 === CLASSES[2] - AVG3, 'C gives what A and B lack');

  const back = ctx.objects();
  const objs = ctx.objects();
  CLASSES.forEach((n, i) => {
    const s = spring(stagger(grow, i, 3, 0.5), 3.5, 5);
    const keep = i === 2 && cut > 0 ? AVG3 : n; // C splits off its top part when cut
    bar(objs, BX[i], BASE2, hOf(keep, UNIT2) * s);
  });
  if (cut > 0) {
    // C's extra 4 students: 3 (for A) under 1 (for B), mint so they read as "moved"
    bar(back, BX[2], BASE2, hOf(CLASSES[2], UNIT2), 'blank');
    const pop3 = pop(cut);
    const from3 = [BX[2], LEVEL2 - give3 * UNIT2 / 2];
    const from1 = [BX[2], LEVEL2 - give3 * UNIT2 - give1 * UNIT2 / 2];
    const to3 = [BX[0], BASE2 - hOf(CLASSES[0], UNIT2) - give3 * UNIT2 / 2];
    const to1 = [BX[1], BASE2 - hOf(CLASSES[1], UNIT2) - give1 * UNIT2 / 2];
    const f1 = flight(from1, to1, m1, 120);
    const f3 = flight(from3, to3, m3, 230);
    bar(objs, f3.x, f3.y + give3 * UNIT2 / 2, give3 * UNIT2 * pop3.scale, 'dec', BAR_W, f3.squash);
    bar(objs, f1.x, f1.y + give1 * UNIT2 / 2, give1 * UNIT2 * pop3.scale, 'dec', BAR_W, f1.squash);
    const top = ctx.chalk(60);
    arcArrow(top, [BX[2] - 50, LEVEL2 - 230], [to1[0] + 30, to1[1] - 50], 110, f1.v, 51);
    arcArrow(top, [BX[2] - 20, LEVEL2 - 250], [to3[0] + 30, to3[1] - 110], 200, f3.v, 55);
  }
  CLASSES.forEach((n, i) => L.text(String(n), BX[i], BASE2 + 95, { size: 72, t: g(p, 'labels'), align: 'center' }));
  L.line([BX[0] - 130, BASE2 + 4], [BX[2] + 130, BASE2 + 2], { width: 5, t: g(p, 'labels'), seed: 60 });

  const top = ctx.chalk(60);
  BX.forEach((x, i) => breakMark(top, x, BASE2, g(p, 'labels'), 62 + i));
  top.dashed([BX[0] - 120, LEVEL2], [BX[2] + 110, LEVEL2], { color: CHALK.yellow, width: 5, t: g(p, 'level') });
  top.text(String(AVG3), BX[2] + 168, LEVEL2 + 22, { size: 70, color: CHALK.yellow, t: g(p, 'level'), align: 'center' });

  row(top, ['(25', '+', '27', '+', '32)', ':', '3'], 540, 1440, { size: 78, t: g(p, 'f1'), seed: 70 });
  const xs = row(top, ['=', String(SUM3), ':', '3', '=', { s: String(AVG3), color: CHALK.yellow }],
    540, 1570, { size: 78, t: g(p, 'f2'), seed: 80, gap: 0.42 });
  top.loop(xs[5], 1545, 54, 58, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 88 });
  // "trung bình mỗi lớp có 28": the level tag is circled too
  top.loop(BX[2] + 168, LEVEL2 - 4, 54, 48, { color: CHALK.yellow, width: 6, t: g(p, 'tag'), seed: 89 });
}

// --- beats 3-4: the rule, then the rule turned around ----------------------------
function ruleCard(ctx, p) {
  title(ctx, g(p, 'title'), 'Ghi nhớ');
  const L = ctx.chalk(50);
  L.rect(90, 470, 990, 940, { width: 5, t: g(p, 'frame'), seed: 90 });
  const top = ctx.chalk(60);
  row(top, ['Trung bình cộng', '='], 540, 640, { size: 80, t: g(p, 'l1'), seed: 91 });
  row(top, [{ s: 'Tổng', color: CHALK.yellow }, ':', { s: 'số các số hạng', color: CHALK.pink }],
    540, 810, { size: 80, t: g(p, 'l2'), seed: 93 });
}

function beat3(ctx, p) {
  ruleCard(ctx, p);
}

function beat4(ctx, p) {
  ruleCard(ctx, {});
  const L = ctx.chalk(50);
  L.arrow([540, 965], [540, 1095], { color: CHALK.yellow, width: 6, t: g(p, 'arrow'), seed: 100 });
  L.rect(90, 1120, 990, 1580, { width: 5, t: g(p, 'frame2'), seed: 101 });
  const top = ctx.chalk(60);
  row(top, [{ s: 'Tổng', color: CHALK.yellow }, '=', 'TBC', { sym: 'times' },
    { s: 'số các số hạng', color: CHALK.pink }], 540, 1240, { size: 64, t: g(p, 'r1'), seed: 102 });
  row(top, [`TBC của ${N4} số`, '=', String(AVG4)], 540, 1375, { size: 64, t: g(p, 'r2'), seed: 110 });
  const xs = row(top, [{ s: 'Tổng', color: CHALK.yellow }, '=', String(AVG4), { sym: 'times' }, String(N4), '=',
    { s: String(SUM4), color: CHALK.yellow }], 540, 1500, { size: 72, t: g(p, 'r3'), seed: 120, gap: 0.36 });
  top.loop(xs[6], 1477, 72, 56, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 130 });
}

// --- beats 5-6: the missing class --------------------------------------------------
const BASE5 = 1150, UNIT5 = 45;
const LEVEL5 = BASE5 - hOf(AVG3, UNIT5);
const NAMES = ['A', 'B', 'C'];

function challenge(ctx, p, solved) {
  title(ctx, g(p, 'title'), 'Thử sức!');
  const top0 = ctx.chalk(60);
  row(top0, ['TBC 3 lớp', '=', { s: String(AVG3), color: CHALK.yellow }], 540, 380, { size: 70, t: g(p, 'given'), seed: 140 });

  const back = ctx.objects();
  const objs = ctx.objects();
  const grow = g(p, 'bars');
  [CLASSES[0], CLASSES[1]].forEach((n, i) => {
    bar(objs, BX[i], BASE5, hOf(n, UNIT5) * spring(stagger(grow, i, 3, 0.5), 3.5, 5));
  });
  // C: a dashed empty slot with "?" until the answer grows into it
  const slotH = hOf(34, UNIT5);
  const s3 = pop(stagger(grow, 2, 3, 0.5));
  const gr = solved ? g(p, 'grow') : 0;
  if (s3.scale > 0 && gr < 1) bar(back, BX[2], BASE5, slotH * s3.scale, 'blank');
  // check: C's part above the average turns mint, like the students C gave away in beat 2
  const chk = solved ? g(p, 'check') : 0;
  if (gr > 0 && chk <= 0) bar(objs, BX[2], BASE5, hOf(MISSING, UNIT5) * spring(gr, 3.5, 5));
  if (chk > 0) {
    const { scale, squash } = pop(chk);
    bar(objs, BX[2], BASE5, hOf(AVG3, UNIT5));
    bar(objs, BX[2], LEVEL5 - 4 - (1 - scale) * 8, (MISSING - AVG3) * UNIT5, 'dec', BAR_W, squash);
  }

  const L = ctx.chalk(50);
  const lab = g(p, 'labels');
  NAMES.forEach((nm, i) => {
    const val = i < 2 ? String(CLASSES[i]) : null;
    if (val) L.text(`${nm}: ${val}`, BX[i], BASE5 + 90, { size: 64, t: lab, align: 'center' });
    else L.text(`${nm}:`, BX[i] - 45, BASE5 + 90, { size: 64, t: lab, align: 'center' });
  });
  L.line([BX[0] - 130, BASE5 + 4], [BX[2] + 130, BASE5 + 2], { width: 5, t: lab, seed: 150 });

  const top = ctx.chalk(60);
  BX.forEach((x, i) => {
    if (i < 2 || gr > 0) breakMark(top, x, BASE5, i < 2 ? lab : clamp01(gr * 3), 152 + i);
  });
  top.dashed([BX[0] - 120, LEVEL5], [BX[2] + 110, LEVEL5], { color: CHALK.yellow, width: 5, t: g(p, 'level') });
  top.text(String(AVG3), BX[2] + 168, LEVEL5 + 22, { size: 70, color: CHALK.yellow, t: g(p, 'level'), align: 'center' });

  // "?" in the slot and next to "C:"; replaced by the answer once solved
  const q = g(p, 'q');
  const qs = q * (gr <= 0 ? 1 : Math.max(0, 1.15 * (1 - gr / 0.3)));
  if (qs > 0) {
    top.text('?', BX[2], BASE5 - slotH / 2 + 40, { size: 130, color: CHALK.yellow, scale: qs, align: 'center' });
    top.text('?', BX[2] + 35, BASE5 + 90, { size: 64, color: CHALK.yellow, scale: qs, align: 'center' });
  }
  if (solved) {
    top.text(String(MISSING), BX[2] + 45, BASE5 + 90, { size: 68, color: CHALK.yellow, t: g(p, 'label'), align: 'center' });
    top.loop(BX[2] + 45, BASE5 + 67, 52, 50, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 160 });
  }
  return top;
}

function beat5(ctx, p) {
  const top = challenge(ctx, p, false);
  // thinking time: three chalk dots pop in one by one
  [0, 1, 2].forEach((i) => {
    const { scale } = pop(g(p, `dot${i + 1}`));
    if (scale > 0) top.loop(470 + i * 70, 1340, 13 * scale, 13 * scale, { color: CHALK.yellow, width: 18, seed: 170 + i });
  });
}

function beat6(ctx, p) {
  const top = challenge(ctx, p, true);
  const out = g(p, 'dotsOut');
  [0, 1, 2].forEach((i) => {
    const k = out < 0.3 ? 1 + 0.15 * (out / 0.3) : 1.15 * (1 - (out - 0.3) / 0.7);
    if (k > 0) top.loop(470 + i * 70, 1340, 13 * k, 13 * k, { color: CHALK.yellow, width: 18, seed: 170 + i });
  });
  const L = ctx.chalk(50);
  badge(L, 130, 1390, 1, '', { t: g(p, 's1') });
  badge(L, 130, 1530, 2, '', { t: g(p, 's2') });
  row(top, [String(AVG3), { sym: 'times' }, '3', '=', String(AVG3 * 3)], 210, 1390,
    { size: 72, t: g(p, 's1'), seed: 180, align: 'left' });
  row(top, [String(AVG3 * 3), { sym: 'minus' }, String(CLASSES[0]), { sym: 'minus' }, String(CLASSES[1]), '=',
    { s: String(MISSING), color: CHALK.yellow }], 210, 1530, { size: 72, t: g(p, 's2'), seed: 190, align: 'left' });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
