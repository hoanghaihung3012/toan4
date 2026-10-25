// Bắn 3 mũi tên vào bia 5 / 3 / 1: có bao nhiêu tổng điểm khác nhau? Facts: lessons/ban_3_mui_ten/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../shared/web/js/chalk.js';
import { clamp01, stagger, arcPoint, easeInOut, easeOutCubic, spring } from '../../shared/web/js/ease.js';
import { row } from '../../shared/web/js/parts.js';
import { g, burst, sparks, outScale, countdown, popLabel, bandWipe } from '../../shared/web/js/fx.js';
import { svgLayer } from '../../shared/web/js/cubes.js';
import { target, arrowSprite, wobble } from './archery.js';

// --- facts (story.md F1–F3, D1–D5), checked -------------------------------------------------
const RINGS = [1, 3, 5]; // F2: the target's rings score 1, 3 and 5
const sum = (a) => a.reduce((x, y) => x + y, 0);
const totalsOf = (n) => {
  const all = new Set();
  const go = (k, s) => (k === n ? all.add(s) : RINGS.forEach((r) => go(k + 1, s + r)));
  go(0, 0);
  return [...all].sort((a, b) => a - b);
};
// the ladder: start with every arrow in ring 1, move one arrow one ring inward per step
const LADDER = [[1, 1, 1], [1, 1, 3], [1, 3, 3], [3, 3, 3], [3, 3, 5], [3, 5, 5], [5, 5, 5]];
const T3 = totalsOf(3);
console.assert(T3.join() === '3,5,7,9,11,13,15' && T3.length === 7, '3 arrows: 7 different totals');
console.assert(LADDER.map(sum).join() === T3.join(), 'the ladder reaches every total once');
console.assert(LADDER.every((s, i) => !i || sum(s) - sum(LADDER[i - 1]) === 2), 'each step adds 2');
console.assert(sum([5, 3, 1]) === 9 && sum([1, 1, 5]) === 7 && sum([1, 3, 3]) === 7, 'example 9, repeat 7');
const T4 = totalsOf(4);
console.assert(T4.join() === '4,6,8,10,12,14,16,18,20' && T4.length === 9, 'challenge, 4 arrows: 9 totals');

// every word written on the board (the English version lessons/ban_3_mui_ten_en overrides these);
// read at render time, never copied into a module-level constant
export const TEXT = {
  arrows3: '3 mũi tên',
  totals: 'tổng điểm khác nhau',
  repeat: 'trùng!',
  yourTurn: 'Đến lượt bạn!',
  arrows4: '4 mũi tên',
  qTotals: '? tổng',
  total: 'tổng',
};

const NUMC = { 1: CHALK.white, 3: CHALK.blue, 5: CHALK.red }; // chalk colour = ring colour

// --- the target and the three arrows (beats 1–5 share one board) ------------------------------
const TG = { x: 770, y: 395, R: 235 };
const ANG = [-120, 60, 150]; // where on its ring each arrow sits (degrees)
const START = [5, 3, 1]; // hook: 5 + 3 + 1 = 9
const STEPS = [
  { beat: 'beat2', key: 'down', rings: LADDER[0] },
  ...[1, 2, 3, 4, 5, 6].map((i) => ({ beat: 'beat3', key: `h${i}`, rings: LADDER[i] })),
  { beat: 'beat4', key: 'dup', rings: [1, 1, 5] },
];
const HIT_R = { 1: 0.82, 3: 0.49, 5: 0.17 };
const hit = (tg, ring, deg) => {
  const a = (deg * Math.PI) / 180;
  return [tg.x + tg.R * HIT_R[ring] * Math.cos(a), tg.y + tg.R * HIT_R[ring] * Math.sin(a)];
};
// a stuck arrow points up-right; each one at its own angle so the shafts fan out instead of crossing
const STUCK = [-8, -52, -28];

const ORDER = ['beat1', 'beat2', 'beat3', 'beat4', 'beat5'];
function state(beat, p) {
  const idx = ORDER.indexOf(beat);
  return (b, k) => {
    const i = ORDER.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}

// a shot: nock and pull back (anticipation), arc in, thunk, shaft wobbles (follow-through)
function shotPose(u, from, to, stuck) {
  if (u <= 0) return null;
  const a0 = Math.atan2(to[1] - from[1] + 200, to[0] - from[0]);
  if (u < 0.15) {
    const k = Math.sin((Math.PI / 2) * (u / 0.15));
    return { x: from[0] - 40 * k * Math.cos(a0), y: from[1] - 40 * k * Math.sin(a0), ang: (a0 * 180) / Math.PI, stretch: 1 - 0.08 * k, flying: true, land: 0 };
  }
  if (u < 0.6) {
    const v = easeInOut((u - 0.15) / 0.45);
    const back = [from[0] - 40 * Math.cos(a0), from[1] - 40 * Math.sin(a0)];
    const [x, y] = arcPoint(back, to, v, 100);
    const [x2, y2] = arcPoint(back, to, Math.min(1, v + 0.02), 100);
    const tan = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const ang = v > 0.8 ? tan + (stuck - tan) * ((v - 0.8) / 0.2) : tan;
    return { x, y, ang, stretch: 1 + 0.1 * Math.sin(Math.PI * v), flying: true, land: 0 };
  }
  const k = (u - 0.6) / 0.4;
  return { x: to[0], y: to[1], ang: stuck + wobble(k, 9), stretch: 1 - 0.1 * Math.sin(Math.PI * Math.min(1, k / 0.25)), flying: false, land: k };
}

// a move to another ring: pull out along the shaft, hop on an arc, thunk, wobble
function hopPose(u, from, to, stuck) {
  const out = [-Math.cos((stuck * Math.PI) / 180), -Math.sin((stuck * Math.PI) / 180)];
  if (u < 0.15) {
    const k = 26 * Math.sin((Math.PI / 2) * (u / 0.15));
    return { x: from[0] + out[0] * k, y: from[1] + out[1] * k, ang: stuck, stretch: 1.04, flying: false, land: 0 };
  }
  if (u < 0.65) {
    const v = easeInOut((u - 0.15) / 0.5);
    const s0 = [from[0] + out[0] * 26, from[1] + out[1] * 26];
    const [x, y] = arcPoint(s0, to, v, 90);
    return { x, y, ang: stuck - 14 * Math.sin(Math.PI * v), stretch: 1 + 0.08 * Math.sin(Math.PI * v), flying: true, land: 0 };
  }
  const k = (u - 0.65) / 0.35;
  return { x: to[0], y: to[1], ang: stuck + wobble(k, 8), stretch: 1 - 0.1 * Math.sin(Math.PI * Math.min(1, k / 0.25)), flying: false, land: k };
}

const FROM = [[-120, 1250], [-140, 1180], [-100, 1320]];
function arrowPose(i, S) {
  const fu = S('beat1', `f${i + 1}`);
  const tg = TG;
  if (fu <= 0) return null;
  if (fu < 1) return { ...shotPose(fu, FROM[i], hit(tg, START[i], ANG[i]), STUCK[i]), ring: START[i] };
  let ring = START[i];
  for (const st of STEPS) {
    const to = st.rings[i];
    if (to === ring) continue;
    const prev = STEPS[STEPS.indexOf(st) - 1]?.rings || START;
    const movers = st.rings.map((r, j) => (r !== prev[j] ? j : -1)).filter((j) => j >= 0);
    const u = stagger(S(st.beat, st.key), movers.indexOf(i), movers.length, 0.6);
    if (u <= 0) break;
    if (u < 1) return { ...hopPose(u, hit(tg, ring, ANG[i]), hit(tg, to, ANG[i]), STUCK[i]), ring: to };
    ring = to;
  }
  const [x, y] = hit(tg, ring, ANG[i]);
  return { x, y, ang: STUCK[i], stretch: 1, flying: false, land: 1, ring };
}

// the target with its arrows; a landing shakes the target and flashes the ring it hit
function range(objs, S, flash = {}) {
  const poses = [0, 1, 2].map((i) => arrowPose(i, S));
  const fl = { ...flash };
  let shake = 0;
  poses.forEach((ps) => {
    if (!ps || ps.land <= 0 || ps.land >= 1) return;
    fl[ps.ring] = Math.max(fl[ps.ring] || 0, Math.sin(Math.PI * Math.min(1, ps.land * 1.4)));
    shake += 7 * Math.exp(-5 * ps.land) * Math.sin(5 * Math.PI * ps.land);
  });
  const svg = svgLayer(objs);
  target(svg, TG.x + shake, TG.y, TG.R, { flash: fl });
  const top = svgLayer(objs);
  poses.forEach((ps) => ps && arrowSprite(top, ps.x + (ps.flying ? 0 : shake), ps.y, ps.ang, { stretch: ps.stretch, flying: ps.flying }));
}

// --- chalk equation rows on fixed columns, so the "=" and totals line up -----------------------
const COLS = [215, 305, 395, 485, 575, 665, 770];
const ROW_Y = (i) => 870 + i * 112;
function eqRow(L, nums, total, y, t, { cols = COLS, size = 90, seed = 0, pulse = 0 } = {}) {
  if (t <= 0) return;
  const parts = [
    { s: String(nums[0]), c: NUMC[nums[0]] }, { s: '+' }, { s: String(nums[1]), c: NUMC[nums[1]] }, { s: '+' },
    { s: String(nums[2]), c: NUMC[nums[2]] }, { s: '=' }, { s: String(total), c: CHALK.yellow, k: 1 + 0.35 * Math.sin(Math.PI * clamp01(pulse)) },
  ];
  parts.forEach((q, i) => {
    const ti = clamp01(t * parts.length - i);
    if (ti > 0) L.text(q.s, cols[i], y, { size, color: q.c || CHALK.white, align: 'center', t: easeOutCubic(ti), scale: q.k || 1 });
  });
}

// yellow "+2" bulging to the right, from one total down to the next
function plusTwo(L, i, u) {
  if (u <= 0) return;
  const x = COLS[6] + 62;
  const y0 = ROW_Y(i - 1) - 30, y1 = ROW_Y(i) - 30;
  const v = easeInOut(clamp01(u * 1.3));
  const pts = [];
  for (let k = 0; k <= 16; k++) {
    const s = (k / 16) * v;
    pts.push([x + 52 * 4 * s * (1 - s), y0 + (y1 - y0) * s]);
  }
  L.poly(pts, { color: CHALK.yellow, width: 5, seed: 300 + i, amp: 0.5 });
  if (v >= 1) {
    for (const d of [-1, 1]) L.line([x, y1], [x + 18 + d * 8, y1 - 16 + d * 10], { color: CHALK.yellow, width: 5, seed: 310 + i + d });
  }
  popLabel(L, '+2', x + 115, (y0 + y1) / 2 + 22, clamp01(u * 1.6 - 0.4), { size: 64 });
}

function ladder(L, S, beat, p) {
  const r0 = S('beat2', 'r0');
  eqRow(L, LADDER[0], 3, ROW_Y(0), r0, { seed: 400 });
  for (let i = 1; i < 7; i++) {
    const pulse = i === 1 ? S('beat3', 'k1') : 0;
    eqRow(L, LADDER[i], sum(LADDER[i]), ROW_Y(i), S('beat3', `r${i}`), { seed: 400 + i * 10, pulse: pulse < 1 ? pulse : 0 });
    plusTwo(L, i, S('beat3', `p${i}`));
  }
}

// --- beat 1: hook -------------------------------------------------------------------------------
const HOOK = { exY: 900, qY: 1130 };
function hookLower(ctx, p) {
  const L = ctx.chalk(60);
  eqRow(L, START, 9, HOOK.exY, g(p, 'ex'), { seed: 20 });
  const q = g(p, 'q');
  popLabel(L, '?', 150, HOOK.qY + 20, q, { size: 170 });
  burst(L, 150, HOOK.qY - 40, 110, clamp01(q * 1.5 - 0.4), { seed: 25 });
  L.text(TEXT.totals, 240, HOOK.qY, { size: 76, t: g(p, 'qt') });
}

function beat1(ctx, p) {
  // the ring of the number being written flashes: 5, then 3, then 1
  const ex = g(p, 'ex');
  const flash = {};
  [5, 3, 1].forEach((r, i) => { const k = clamp01(ex * 7 - i * 2); if (ex < 1) flash[r] = Math.sin(Math.PI * k); });
  range(ctx.objects(), state('beat1', p), flash);
  hookLower(ctx, p);
  arrowsLabel(ctx.chalk(60), state('beat1', p));
}

// "3 mũi tên" in the empty top-left: popped on "3 mũi tên", gone when the check row needs the room
function arrowsLabel(L, S) {
  const k = outScale(S('beat1', 'lab'), S('beat4', 'dup'));
  if (k > 0) L.text(TEXT.arrows3, 270, 330, { size: 84, align: 'center', scale: k });
}

// --- beats 2–5: one board ------------------------------------------------------------------------
const CHK = { cols: [92, 154, 216, 278, 340, 402, 470], y: 400, size: 84 };
function board(ctx, beat, p) {
  const S = state(beat, p);
  const drawTop = (c) => {
    range(c.objects(), S);
    arrowsLabel(c.chalk(60), S);
    if (beat === 'beat4' || beat === 'beat5') dupCheck(c.chalk(60), S);
  };
  if (beat === 'beat5') bandWipe(ctx, g(p, 'wipe'), [150, 780], drawTop, 3);
  else drawTop(ctx);
  if (beat === 'beat2') bandWipe(ctx, g(p, 'wipe'), [760, 1600], (c) => hookLower(c, {}), 3);
  const L = ctx.chalk(60);
  ladder(L, S, beat, p);
  if (beat === 'beat4') {
    const s = g(p, 'same');
    L.loop(COLS[6], ROW_Y(2) - 28, 52, 52, { color: CHALK.yellow, width: 7, t: clamp01(s * 1.4), seed: 520 });
  }
  if (beat === 'beat5') answer(L, p);
}

// beat 4: 1 + 1 + 5 is 7 too, a total the ladder already has
function dupCheck(L, S) {
  const a = S('beat4', 'chk'), b = S('beat4', 'chk2');
  const t = a < 1 ? a * (5 / 7) : 5 / 7 + b * (2 / 7);
  eqRow(L, [1, 1, 5], 7, CHK.y, t, { cols: CHK.cols, size: CHK.size, seed: 500 });
  const s = S('beat4', 'same');
  L.loop(CHK.cols[6], CHK.y - 29, 48, 54, { color: CHALK.yellow, width: 7, t: clamp01(s * 1.4), seed: 510 });
  const tr = S('beat4', 'tr');
  popLabel(L, TEXT.repeat, 280, CHK.y + 140, tr, { size: 100, color: CHALK.red });
}

// beat 5: count the totals 1..7 (badges on the left), then the big 7 where the target was
function answer(L, p) {
  const c = g(p, 'count');
  for (let i = 0; i < 7; i++) {
    const u = stagger(c, i, 7, 0.3);
    if (u <= 0) continue;
    const k = spring(u, 3, 6);
    const y = ROW_Y(i) - 28;
    L.loop(112, y, 38 * k, 38 * k, { color: CHALK.yellow, width: 6, seed: 600 + i });
    L.text(String(i + 1), 112, y + 19, { size: 56, color: CHALK.yellow, align: 'center', scale: k });
  }
  const s = g(p, 'seven');
  popLabel(L, '7', 540, 470, s, { size: 280 });
  L.loop(540, 380, 130, 140, { color: CHALK.yellow, width: 9, t: clamp01(s * 1.4 - 0.2), seed: 640 });
  sparks(L, 540, 380, 160, 200, clamp01(s * 1.5 - 0.5), { seed: 650 });
  L.text(TEXT.totals, 540, 700, { size: 80, align: 'center', t: g(p, 'words') });
}

const beat2 = (ctx, p) => board(ctx, 'beat2', p);
const beat3 = (ctx, p) => board(ctx, 'beat3', p);
const beat4 = (ctx, p) => board(ctx, 'beat4', p);
const beat5 = (ctx, p) => board(ctx, 'beat5', p);

// --- beats 6–7: challenge with 4 arrows ---------------------------------------------------------
const Q = { titleY: 260, labY: 1100, qY: 1290, countY: 1480 };
const QT = { x: 560, y: 630, R: 230 };
const QRINGS = [3, 1, 5, 1];
const QANG = [-130, 160, -150, 115];
const QSTUCK = [-8, -20, -10, -40];
const QFROM = [[-120, 1150], [-140, 1230], [-100, 1310], [-130, 1070]];

function quizBoard(ctx, p) {
  const objs = ctx.objects();
  const b = g(p, 'board');
  const k = b < 1 ? spring(b, 3, 6) : 1;
  const shots = g(p, 'shots');
  const poses = QRINGS.map((r, i) => {
    const u = stagger(shots, i, 4, 0.45);
    return shotPose(u, QFROM[i], hit(QT, r, QANG[i]), QSTUCK[i]);
  });
  let shake = 0;
  const fl = {};
  poses.forEach((ps, i) => {
    if (!ps || ps.land <= 0 || ps.land >= 1) return;
    fl[QRINGS[i]] = Math.sin(Math.PI * Math.min(1, ps.land * 1.4));
    shake += 6 * Math.exp(-5 * ps.land) * Math.sin(5 * Math.PI * ps.land);
  });
  if (k > 0) target(svgLayer(objs), QT.x + shake, QT.y, QT.R * k, { flash: fl, scaleFrom: [QT.x, QT.y] });
  const top = svgLayer(objs);
  poses.forEach((ps) => ps && arrowSprite(top, ps.x + (ps.flying ? 0 : shake), ps.y, ps.ang, { stretch: ps.stretch, flying: ps.flying }));
  const L = ctx.chalk(60);
  L.text(TEXT.yourTurn, 540, Q.titleY, { size: 100, color: CHALK.yellow, align: 'center', t: g(p, 'title') });
  const lab = g(p, 'lab');
  popLabel(L, TEXT.arrows4, 540, Q.labY, lab, { size: 88, color: CHALK.white });
  return L;
}

function beat6(ctx, p) {
  const L = quizBoard(ctx, p);
  popLabel(L, TEXT.qTotals, 540, Q.qY, g(p, 'q'), { size: 150 });
  const c = g(p, 'count');
  if (c > 0 && c < 1) {
    const [cx, cy, r] = [540, Q.countY, 95];
    const ring = Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 840, amp: 0.6 });
    countdown(L, cx, cy - 20, c, { size: 140, color: CHALK.white });
  }
}

function beat7(ctx, p) {
  const L = quizBoard(ctx, {});
  const n = g(p, 'nums');
  const k = outScale(1, clamp01(n * 4));
  if (k > 0) L.text(TEXT.qTotals, 540, Q.qY, { size: 150, color: CHALK.yellow, align: 'center', scale: k });
  // 4, 6, ..., 20 pop in one by one as they are counted
  const xs = row(L, T4.map(String), 540, Q.qY - 10, { size: 80, t: 0, gap: 0.42 });
  T4.forEach((v, i) => {
    const u = stagger(clamp01(n * 1.15 - 0.1), i, T4.length, 0.3);
    if (u > 0) L.text(String(v), xs[i], Q.qY - 10, { size: 80, color: CHALK.white, align: 'center', scale: spring(u, 3, 6) });
  });
  const s = g(p, 'nine');
  const xs2 = row(L, [{ s: '9', color: CHALK.yellow, size: 150 }, TEXT.total], 540, Q.countY + 40, { size: 110, t: clamp01(s * 1.5), gap: 1.6 });
  L.loop(xs2[0], Q.countY - 10, 80, 84, { color: CHALK.yellow, width: 9, t: clamp01(s * 1.4 - 0.2), seed: 860 });
  sparks(L, xs2[0], Q.countY - 10, 112, 150, clamp01(s * 1.5 - 0.5), { seed: 865 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7 };