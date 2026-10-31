// Yến, tạ, tấn: three mass units shown on a balance scale (10 small weights = 1 big one),
// a ×10 staircase and three conversions. Facts: lessons/don_vi_yen_ta_tan/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../shared/web/js/chalk.js';
import { clamp01, pop, stagger, spring } from '../../../shared/web/js/ease.js';
import { svgLayer } from '../../../shared/web/js/cubes.js';
import { g, mark, outScale, thinkingDots, numTile, arc, countdown, popLabel, dropPose, dust, burst, hopY, hopSquash } from '../../../shared/web/js/fx.js';
import { weight, scaleFrame, pans, beamAngle, SCALE, chicken, cow, elephant } from './props.js';

// --- facts (story.md F1–F3, D1–D3), checked ----------------------------------------------------
const KG = { kg: 1, yen: 10, ta: 100, tan: 1000 }; // F1
console.assert(KG.yen === 10 * KG.kg && KG.ta === 10 * KG.yen && KG.tan === 10 * KG.ta, 'F1: each step ×10');
console.assert(KG.ta === 100 && KG.tan === 1000, 'F1: 100 kg, 1000 kg');
console.assert((5 * KG.yen) / KG.kg === 50, 'D2: 5 yến = 50 kg');
console.assert((3 * KG.tan) / KG.ta === 30, 'D2: 3 tấn = 30 tạ');
console.assert(2 * KG.tan + 85 === 2085, 'D2: 2 tấn 85 kg = 2085 kg');
console.assert(4 * KG.ta + 60 === 460, 'D3: challenge 460 (not said)');

// every word on the board; read at render time so a language variant can override it
export const TEXT = {
  ask: 'Cùng nặng 2?',
  units: { kg: 'kg', yen: 'yến', ta: 'tạ', tan: 'tấn' },
  title: 'Yến · Tạ · Tấn',
  names: { yen: 'Yến', ta: 'Tạ', tan: 'Tấn' },
  bigToSmall: 'Đổi lớn sang bé:',
  perStep: 'mỗi bậc',
  yourTurn: 'Đến lượt bạn!',
  comment: 'Bình luận đáp án nhé!',
};
const U = (k) => TEXT.units[k];
const CX = 540;
const INK = { kg: CHALK.white, yen: CHALK.mint, ta: CHALK.blue, tan: CHALK.pink };

// --- a chalk equation row: strings, {s, color, size}, {sym: 'times'}, {ans, a} --------------------
// {ans: '50', a} is an answer slot: a yellow "?" until a, then the answer pops in.
function eq(L, parts, x0, y, { size = 120, t = 1, align = 'center', gap: gk = 0.24 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const widths = items.map((q) => (q.sym ? size * 0.42 : measure(q.ans ?? q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = align === 'center' ? x0 - total / 2 : x0;
  const cy = y - size * 0.32;
  const xs = [];
  items.forEach((q, i) => {
    const w = widths[i];
    const c = x + w / 2;
    xs.push(c);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    if (ti > 0 && q.sym === 'times') {
      const r = size * 0.16;
      const o = { color: q.color, width: size * 0.075, seed: 30 + i };
      L.line([c - r, cy - r], [c + r, cy + r], { ...o, t: clamp01(ti * 2) });
      L.line([c + r, cy - r], [c - r, cy + r], { ...o, t: clamp01(ti * 2 - 1) });
    } else if (ti > 0 && q.ans !== undefined) {
      const a = q.a ?? 0;
      const k = outScale(ti, clamp01(a / 0.35));
      if (k > 0) L.text('?', c, y + size * 0.04, { size: size * 1.1, color: CHALK.yellow, align: 'center', scale: k });
      popLabel(L, q.ans, c, y, clamp01((a - 0.3) / 0.7), { size, color: CHALK.yellow });
    } else if (ti > 0) {
      L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    }
    x += w + gap;
  });
  return xs;
}

// --- beats 1–2: chicken, cow, elephant "all weigh 2" ----------------------------------------------
const GROUND = 1000;
const ANIMALS = [
  { draw: chicken, x: 160, tx: 195, s: 0.95, unit: 'kg' }, // F2: con gà 2 kg
  { draw: cow, x: 410, tx: 480, s: 0.78, unit: 'ta' }, // F2: con bò 2 tạ
  { draw: elephant, x: 800, tx: 815, s: 1.12, unit: 'tan' }, // F2: con voi 2 tấn
];
const TAG_Y = 1130;
function tag(objs, x, s, u) {
  const k = pop(u);
  const d = numTile(objs, x, TAG_Y, s, 'int', { scale: 1.25 * k.scale, squash: k.squash, digits: 3.2 });
  if (d) d.style.fontSize = '72px';
  return d;
}

function hookBoard(ctx, p, answered) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const tags = ctx.objects();
  const L = ctx.chalk(60);
  const q = answered ? 1 : g(p, 'q');
  L.text(TEXT.ask, CX, 330, { size: 112, align: 'center', t: answered ? 1 : g(p, 'ask'),
    color: q > 0 && q < 1 ? CHALK.yellow : CHALK.white, scale: 1 + 0.12 * Math.sin(Math.PI * q) });
  if (!answered) {
    const d = g(p, 'dots');
    thinkingDots(L, CX, 450, d < 1 ? d : 0, { r: 16, gap: 80 });
  }
  ANIMALS.forEach((a, i) => {
    const k = answered ? { scale: 1, squash: 1 } : pop(g(p, `a${i}`));
    a.draw(svg, a.x, GROUND, { scale: a.s * k.scale, squash: k.squash });
    const tu = answered ? 1 : g(p, `t${i}`);
    if (tu <= 0) return;
    const u = answered ? g(p, `u${i}`) : 0;
    const w = answered ? stagger(g(p, 'why'), i, 3, 0.5) : 0;
    const shown = u > 0.35 ? `2 ${U(a.unit)}` : '2 ?';
    const d = tag(tags, a.tx, shown, tu);
    const hu = u > 0 && u < 1 ? u : w > 0 && w < 1 ? w : 0;
    if (d && hu > 0) {
      d.style.top = `${parseFloat(d.style.top) + hopY(hu, 40)}px`;
      d.style.transform = `scale(${1 / Math.sqrt(hopSquash(hu))}, ${hopSquash(hu)})`;
    }
    burst(L, a.tx, TAG_Y, 170, clamp01((u - 0.35) / 0.5), { color: INK[a.unit] === CHALK.white ? CHALK.yellow : INK[a.unit], seed: 20 + i * 9 });
  });
  if (answered) L.text(TEXT.title, CX, 1420, { size: 124, align: 'center', color: CHALK.yellow, t: g(p, 'title') });
}
const beat1 = (ctx, p) => hookBoard(ctx, p, false);
const beat2 = (ctx, p) => hookBoard(ctx, p, true);

// --- beats 3–5: the balance scale (10 small weights on the left = 1 big one on the right) ----------
const SMALL_W = 64;
const smallSlot = (i) => {
  const row = Math.floor(i / 5);
  return [(i % 5 - 2) * 69, row ? -(SMALL_W * 0.62 + 4 + SMALL_W * 0.13) : 0];
};
function balanceBoard(ctx, p, { small, big, eqParts, eq2Parts, loopIdx }) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const L = ctx.chalk(60);
  L.text(TEXT.names[big], CX, 300, { size: 140, align: 'center', color: INK[big], t: g(p, 'scale') });
  const sm = g(p, 'small');
  const bu = g(p, 'big');
  const lv = g(p, 'level');
  // beam: each small weight tips it left on landing; the big one swings it back level
  const kicks = [];
  for (let i = 0; i < 10; i++) kicks.push({ u: clamp01((stagger(sm, i, 10, 0.3) - 0.55) / 0.45), d: SCALE.tilt / 10 });
  kicks.push({ u: lv, d: -SCALE.tilt });
  const th = beamAngle(kicks);
  const k = pop(g(p, 'scale'));
  scaleFrame(svg, th, { scale: k.scale });
  const { left, right } = pans(th);
  const panTop = (pt) => pt[1] - 4;
  // small weights, back row first
  const order = [5, 6, 7, 8, 9, 0, 1, 2, 3, 4];
  for (const i of order) {
    const u = stagger(sm, i, 10, 0.3);
    const [dx, dy] = smallSlot(i);
    const pose = dropPose(u, panTop(left) + dy, 360);
    if (pose) weight(svg, left[0] + dx, pose.y, small, { w: SMALL_W, squash: pose.squash });
  }
  // the big weight
  const pose = dropPose(bu, panTop(right), 420);
  if (pose) weight(svg, right[0], pose.y, big, { w: 220, label: `1 ${U(big)}`, size: 64, squash: pose.squash });
  dust(L, right[0], panTop(right), clamp01((bu - 0.55) / 0.45), 61, 1.6);
  // running count of the small weights that have landed (gone once the "10 ..." label is written)
  const landed = Array.from({ length: 10 }, (_, i) => stagger(sm, i, 10, 0.3) >= 0.55).filter(Boolean).length;
  if (landed > 0 && g(p, 'lbl1') < 1) {
    const last = clamp01((stagger(sm, landed - 1, 10, 0.3) - 0.55) / 0.45);
    popLabel(L, String(landed), left[0], left[1] - 290, 1, { size: 96, color: CHALK.yellow, pulse: last });
  }
  // labels under the pans
  L.text(`10 ${U(small)}`, left[0], 1010, { size: 96, align: 'center', color: INK[small], t: g(p, 'lbl1') });
  L.text(`1 ${U(big)}`, right[0], 1010, { size: 96, align: 'center', color: INK[big], t: g(p, 'lbl2') });
  // level: a green tick over the pointer
  mark(L, true, CX, 455, clamp01((lv - 0.45) / 0.55), { size: 64, seed: 81 });
  // equations
  const xs = eq(L, eqParts, CX, 1270, { size: 120, t: g(p, 'eq'), gap: 0.4 });
  let loopAt = [xs[loopIdx], 1270];
  if (eq2Parts) {
    const x0 = xs[1] - measure('=', 120) / 2;
    const xs2 = eq(L, eq2Parts, x0, 1430, { size: 120, t: g(p, 'eq2'), align: 'left', gap: 0.4 });
    loopAt = [xs2[1], 1430];
  }
  const word = eq2Parts ? eq2Parts[1] : eqParts[loopIdx];
  const rw = measure(word.s ?? word, 120) / 2 + 26;
  L.loop(loopAt[0], loopAt[1] - 38, rw, 78, { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 91 });
}

const beat3 = (ctx, p) => balanceBoard(ctx, p, {
  small: 'kg', big: 'yen', loopIdx: 2,
  eqParts: [{ s: `1 ${U('yen')}`, color: INK.yen }, '=', `10 ${U('kg')}`], // F1
});
const beat4 = (ctx, p) => balanceBoard(ctx, p, {
  small: 'yen', big: 'ta', loopIdx: 2,
  eqParts: [{ s: `1 ${U('ta')}`, color: INK.ta }, '=', { s: `10 ${U('yen')}`, color: INK.yen }], // F1
  eq2Parts: ['=', `100 ${U('kg')}`],
});
const beat5 = (ctx, p) => balanceBoard(ctx, p, {
  small: 'ta', big: 'tan', loopIdx: 2,
  eqParts: [{ s: `1 ${U('tan')}`, color: INK.tan }, '=', { s: `10 ${U('ta')}`, color: INK.ta }], // F1
  eq2Parts: ['=', `1000 ${U('kg')}`],
});

// --- beat 6: the ×10 staircase ---------------------------------------------------------------------
const STEPS = [
  { unit: 'kg', x: 182, y: 1180, w: 130, size: 56 },
  { unit: 'yen', x: 410, y: 1040, w: 150, size: 60 },
  { unit: 'ta', x: 645, y: 900, w: 175, size: 64 },
  { unit: 'tan', x: 887, y: 760, w: 200, size: 70 },
];
function beat6(ctx, p) {
  const objs = ctx.objects();
  const svg = svgLayer(objs);
  const L = ctx.chalk(60);
  L.poly([[70, 1180], [296, 1180], [296, 1040], [526, 1040], [526, 900], [766, 900], [766, 760], [1010, 760]],
    { color: CHALK.white, width: 7, t: g(p, 'stair'), seed: 101, amp: 1.2 });
  const tops = STEPS.map((s, i) => {
    const pose = dropPose(g(p, `w${i}`), s.y - 4, 240);
    if (pose) weight(svg, s.x, pose.y, s.unit, { w: s.w, label: U(s.unit), size: s.size, squash: pose.squash });
    dust(L, s.x, s.y, clamp01((g(p, `w${i}`) - 0.55) / 0.45), 110 + i * 7, 1);
    return [s.x, s.y - s.w * 0.62 - s.w * 0.2 - 18];
  });
  // ×10 arcs from each unit down to the next smaller one (D1: big -> small, multiply by 10)
  const x10 = g(p, 'x10');
  for (let i = 3; i >= 1; i--) {
    const v = stagger(x10, 3 - i, 3, 0.5);
    const from = tops[i];
    const to = [tops[i - 1][0] + 30, tops[i - 1][1]];
    arc(L, from, to, 90, v, { color: CHALK.yellow, width: 7, head: 26, seed: 120 + i });
    const mx = (from[0] + to[0]) / 2;
    const my = Math.min(from[1], to[1]) - 90;
    if (v > 0.5) {
      const kk = spring(clamp01((v - 0.5) / 0.5), 3, 6);
      eq(L, [{ sym: 'times', color: CHALK.yellow }, { s: '10', color: CHALK.yellow }], mx, my, { size: 92 * kk });
    }
  }
  L.text(TEXT.bigToSmall, CX, 1360, { size: 92, align: 'center', t: clamp01(g(p, 'rule') * 2) });
  eq(L, [{ sym: 'times', color: CHALK.yellow }, { s: '10', color: CHALK.yellow }, { s: TEXT.perStep, color: CHALK.yellow }],
    CX, 1500, { size: 112, t: clamp01(g(p, 'rule') * 2 - 1) });
}

// --- beat 7: three conversions (F3 / D2) -----------------------------------------------------------
function beat7(ctx, p) {
  const L = ctx.chalk(60);
  const pk = (arr) => arr.map((s) => ({ s, color: CHALK.pink }));
  eq(L, [{ s: `5 ${U('yen')}`, color: INK.yen }, '=', { ans: '50', a: g(p, 'a1') }, U('kg')], CX - 20, 450, { size: 130, t: g(p, 'q1') });
  eq(L, [{ s: '5', color: CHALK.pink }, { sym: 'times', color: CHALK.pink }, ...pk(['10', '=', '50'])], CX - 20, 590, { size: 88, t: g(p, 'h1') });
  mark(L, true, 960, 410, g(p, 'ok1'), { size: 70, seed: 141 });
  eq(L, [{ s: `3 ${U('tan')}`, color: INK.tan }, '=', { ans: '30', a: g(p, 'a2') }, { s: U('ta'), color: INK.ta }], CX - 20, 820, { size: 130, t: g(p, 'q2') });
  eq(L, [{ s: '3', color: CHALK.pink }, { sym: 'times', color: CHALK.pink }, ...pk(['10', '=', '30'])], CX - 20, 960, { size: 88, t: g(p, 'h2') });
  mark(L, true, 960, 780, g(p, 'ok2'), { size: 70, seed: 151 });
  const h3a = g(p, 'h3a');
  const hot = h3a > 0 && h3a < 1;
  eq(L, [{ s: `2 ${U('tan')}`, color: hot ? CHALK.yellow : INK.tan, scale: 1 + 0.15 * Math.sin(Math.PI * h3a) }, `85 ${U('kg')}`],
    CX - 20, 1150, { size: 130, t: g(p, 'q3') });
  eq(L, ['=', { ans: '2085', a: g(p, 'a3') }, U('kg')], CX - 20, 1305, { size: 130, t: g(p, 'q3') });
  const h3b = g(p, 'h3b');
  eq(L, [{ s: '2000', color: CHALK.pink, t: h3a }, { s: '+', color: CHALK.pink, t: h3b * 2 }, { s: '85', color: CHALK.pink, t: h3b * 2 - 1 }],
    CX - 20, 1450, { size: 92 });
  mark(L, true, 945, 1110, g(p, 'ok3'), { size: 70, seed: 161 });
}

// --- beat 8: the challenge (answer not given: D3) --------------------------------------------------
function beat8(ctx, p) {
  const L = ctx.chalk(60);
  L.text(TEXT.yourTurn, CX, 330, { size: 120, align: 'center', color: CHALK.yellow, t: g(p, 'title') });
  const a = g(p, 'ask');
  eq(L, [{ s: `4 ${U('ta')}`, color: INK.ta }, `60 ${U('kg')}`], CX, 660, { size: 140, t: clamp01(a * 2) });
  eq(L, ['=', { ans: '00', a: 0 }, U('kg')], CX, 850, { size: 140, t: clamp01(a * 2 - 1) });
  L.text(TEXT.comment, CX, 1080, { size: 92, align: 'center', color: CHALK.pink, t: g(p, 'cmt') });
  const c = g(p, 'count');
  countdown(L, CX, 1330, c < 1 ? c : 0, { size: 260 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8 };
