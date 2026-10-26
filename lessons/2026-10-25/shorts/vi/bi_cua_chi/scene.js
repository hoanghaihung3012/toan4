// An 20 bi, Bình 24 bi, Chi hơn trung bình cộng của cả ba 4 viên: Chi có bao nhiêu bi?
// Chi's extra 4 evens everyone out, so 20 + 24 + 4 = 2 × TBC -> TBC 24, Chi 28.
// Facts: lessons/bi_cua_chi/story.md. beatN(ctx, p): every key in p is a progress 0..1 from
// timing.json; a key the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../../../../shared/web/js/chalk.js';
import { clamp01, spring, pop, stagger } from '../../../../../shared/web/js/ease.js';
import { flight } from '../../../../../shared/web/js/parts.js';
import { svgLayer } from '../../../../../shared/web/js/cubes.js';
import { g, sparks, mark, thinkingDots, countdown, popLabel } from '../../../../../shared/web/js/fx.js';

// --- facts (story.md F1, D1–D4), checked ----------------------------------------------------
const AN = 20; // F1
const BINH = 24; // F1
const MORE = 4; // F1: Chi has 4 more than the average of all three
const SUM2 = AN + BINH + MORE; // D1: 48 = 2 × average
const AVG = SUM2 / 2; // D2: 24
const CHI = AVG + MORE; // D3: 28
console.assert(SUM2 === 48 && AVG === 24 && CHI === 28, 'Chi 28');
console.assert((AN + BINH + CHI) / 3 === AVG && AN + BINH + CHI === 72, 'check: 72 : 3 = 24'); // D4
console.assert(AN + MORE === AVG && BINH === AVG, 'giving 4 to An evens all three'); // D4
const CH = { an: 30, binh: 26, more: 2 }; // D5: challenge (answer not shown)
console.assert((CH.an + CH.binh + CH.more) / 2 === 29 && 29 + CH.more === 31
  && (CH.an + CH.binh + 31) / 3 === 29, 'challenge: Chi 31');

const str = String;
const CX = 552;
const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

// --- marbles drawn in code: rows of 4 in each friend's column ---------------------------------
const MR = 28; // marble radius
const MDX = 64; // spacing in a row
const MDY = 60; // row height
const PER = 4; // marbles per row
const BX = [262, 552, 842]; // An, Bình, Chi
const GLASS = { fill: 'rgb(92, 166, 232)', rim: 'rgb(30, 78, 140)' };
const GOLD = { fill: 'rgb(246, 196, 64)', rim: 'rgb(150, 100, 10)' };

function marble(svg, x, y, { scale = 1, squash = 1, c = GLASS } = {}) {
  if (scale <= 0) return;
  const gr = el('g', { transform: `translate(${x},${y}) scale(${scale / Math.sqrt(squash)},${scale * squash})` }, svg);
  el('ellipse', { cx: 0, cy: MR * 0.92, rx: MR * 0.8, ry: 4, fill: 'rgba(0,0,0,0.22)' }, gr);
  el('circle', { cx: 0, cy: 0, r: MR, fill: c.fill, stroke: c.rim, 'stroke-width': 3 }, gr);
  el('path', { d: `M${-MR * 0.6},${MR * 0.15} q${MR * 0.6},${MR * 0.5} ${MR * 1.2},0`, stroke: 'rgba(255,255,255,0.35)',
    'stroke-width': 3, fill: 'none' }, gr);
  el('circle', { cx: -MR * 0.35, cy: -MR * 0.38, r: MR * 0.26, fill: 'rgba(255,255,255,0.7)' }, gr);
}

// centre of marble i (0-based, bottom row first) in column x standing on base
const spot = (x, base, i) => [x + ((i % PER) - (PER - 1) / 2) * MDX, base - MR - Math.floor(i / PER) * MDY];
const levelY = (base, n) => base - (n / PER) * MDY; // top of a full stack of n marbles

// a stack of n marbles popping in (u 0..1); color(i) picks the glass
function stack(svg, x, base, n, u, { color = () => GLASS, from = 0 } = {}) {
  for (let i = from; i < n; i++) {
    const k = pop(stagger(u, i - from, n - from, 0.6));
    const [mx, my] = spot(x, base, i);
    marble(svg, mx, my, { scale: k.scale, squash: k.squash, c: color(i) });
  }
}

// --- an equation row (strings, {s, color, t, size}, {sym}) ------------------------------------
function eq(L, parts, x0, y, { size = 110, t = 1, gap: gk = 0.22 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const widths = items.map((q) => measure(q.s, q.size || size));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = x0 - total / 2;
  const xs = [];
  items.forEach((q, i) => {
    xs.push(x + widths[i] / 2);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    if (ti > 0) L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    x += widths[i] + gap;
  });
  return xs;
}

const title = (L, s, y, t, { size = 104, color = CHALK.yellow } = {}) =>
  L.text(s, CX, y, { size, align: 'center', color, t });

// names, and their counts below them, under the three columns
function names(L, base, labels, ts) {
  ['An', 'Bình', 'Chi'].forEach((nm, i) => {
    if (ts[i] <= 0) return;
    L.text(nm, BX[i], base + 84, { size: 72, align: 'center', t: ts[i], color: CHALK.mint });
    L.text(labels[i], BX[i], base + 168, { size: 84, align: 'center', t: ts[i],
      color: labels[i] === '?' ? CHALK.yellow : CHALK.white });
  });
}

// the dashed "TBC" line across the three columns at the level of n marbles
function avgLine(L, base, n, t, label = 'TBC') {
  if (t <= 0) return;
  const y = levelY(base, n);
  L.dashed([BX[0] - 150, y], [BX[2] + 150, y], { color: CHALK.yellow, width: 5, t });
  L.text(label, BX[0] - 150, y + 20, { size: 66, color: CHALK.yellow, align: 'right', t: clamp01(t * 2 - 1) });
}

// Chi's unknown share: a dashed box up to the line
function ghost(L, base, n, t) {
  if (t <= 0) return;
  const y = levelY(base, n);
  const w = (PER * MDX) / 2 + 8;
  L.rect(BX[2] - w, y, BX[2] + w, base, { color: CHALK.white, width: 4, t, seed: 9 });
  L.text('?', BX[2], (y + base) / 2 + 40, { size: 120, color: CHALK.white, align: 'center', t });
}

// --- the problem board (beat 1, and the challenge in beat 5) ---------------------------------
function problemBoard(ctx, p, { heading, an, binh, more, challenge = false }) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const base = 900;
  title(L, heading, 260, g(p, 'title'), { size: 112 });
  stack(svg, BX[0], base, an, g(p, 'an'));
  stack(svg, BX[1], base, binh, g(p, 'binh'));
  const c = g(p, 'chi');
  if (c > 0) L.text('?', BX[2], base - 110, { size: 260, color: CHALK.yellow, align: 'center', scale: spring(c, 3, 6) });
  names(L, base, [str(an), str(binh), '?'], [clamp01(g(p, 'an') * 2), clamp01(g(p, 'binh') * 2), c]);
  const r = g(p, 'rule');
  eq(L, ['Chi', '=', 'TBC', '+', { s: str(more), color: CHALK.yellow }], CX, 1230, { size: 108, t: r });
  L.text('(TBC: trung bình cộng của cả 3 bạn)', CX, 1310, { size: 64, color: CHALK.mint, align: 'center', t: r });
  if (!challenge) {
    eq(L, ['Chi', 'có', { s: '?', color: CHALK.yellow }, 'viên'], CX, 1470, { size: 116, t: g(p, 'ask') });
    const d = g(p, 'dots');
    thinkingDots(L, CX, 1590, d < 1 ? d : 0, { r: 16, gap: 80 });
  } else {
    eq(L, ['Chi', 'có', { s: '?', color: CHALK.yellow }, 'viên'], CX, 1460, { size: 116, t: g(p, 'ask') });
    L.text('Bình luận đáp án nhé!', CX, 1580, { size: 92, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
    const k = g(p, 'count');
    countdown(L, CX, 1700, k < 1 ? k : 0, { size: 200 });
  }
}
const beat1 = (ctx, p) => problemBoard(ctx, p, { heading: 'Bi của Chi', an: AN, binh: BINH, more: MORE });
const beat5 = (ctx, p) => problemBoard(ctx, p, { heading: 'Đến lượt bạn!', ...CH, challenge: true });

// --- beat 2: the average is the even share; Chi's extra 4 evens everyone out -------------------
const B2 = 1000; // stack base in beats 2–4
const gold = (from) => (i) => (i >= from ? GOLD : GLASS);
const extraFrom = (an) => Array.from({ length: MORE }, (_, k) => spot(BX[2], B2, AVG + k)).map((s, k) => [s, spot(BX[0], B2, an + k)]);

function beat2(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  title(L, 'TBC = chia đều', 330, setup, { size: 96 });
  stack(svg, BX[0], B2, AN, setup);
  stack(svg, BX[1], B2, BINH, setup);
  names(L, B2, [g(p, 'give') >= 1 ? `${AN}+${MORE}` : str(AN), str(BINH), '?'], [setup, setup, setup]);
  avgLine(L, B2, AVG, g(p, 'line'));
  ghost(L, B2, AVG, g(p, 'line'));
  // the extra 4 sit above the line in Chi's column, then fly to An
  const ex = g(p, 'extra');
  const give = g(p, 'give');
  extraFrom(AN).forEach(([a, b], k) => {
    const u = stagger(give, k, MORE, 0.5);
    const kk = pop(stagger(ex, k, MORE, 0.5));
    if (u > 0) {
      const f = flight(a, b, u, 220);
      marble(svg, f.x, f.y, { squash: f.squash, c: GOLD });
    } else marble(svg, a[0], a[1], { scale: kk.scale, squash: kk.squash, c: GOLD });
  });
  if (give < 0.3) popLabel(L, `+${MORE}`, BX[2] + 175, levelY(B2, AVG) - 30, ex, { size: 84, color: CHALK.yellow });
  // three columns level: a tick on the line
  const eqT = g(p, 'equal');
  if (eqT > 0) {
    if (g(p, 'two') <= 0) sparks(L, BX[0], levelY(B2, AVG) - 70, 40, 90, eqT, { seed: 21 });
    L.text('3 bạn bằng nhau', CX, 1330, { size: 92, color: CHALK.yellow, align: 'center', t: eqT });
  }
  eq(L, [str(AN), '+', str(BINH), '+', { s: str(MORE), color: CHALK.yellow }, '=', '2', '×', 'TBC'], CX, 1480,
    { size: 100, t: g(p, 'two') });
  // An and Bình now hold one even share each: two boxes up to the line, and a brace under both
  const tw = g(p, 'two');
  if (tw > 0) {
    const w = (PER * MDX) / 2 + 8;
    [0, 1].forEach((i) => {
      L.rect(BX[i] - w, levelY(B2, AVG), BX[i] + w, B2, { color: CHALK.mint, width: 6, t: clamp01(tw * 2.5 - i * 0.5), seed: 33 + i });
      popLabel(L, 'TBC', BX[i], levelY(B2, AVG) - 40, clamp01(tw * 2.5 - i * 0.5 - 0.5), { size: 60, color: CHALK.mint });
    });
    L.poly([[BX[0] - 135, B2 + 198], [BX[0] - 135, B2 + 218], [BX[1] + 135, B2 + 218], [BX[1] + 135, B2 + 198]],
      { color: CHALK.mint, width: 5, t: tw, seed: 31 });
  }
}

// --- beat 3: 48 : 2 = 24, Chi = 24 + 4 = 28 -------------------------------------------------------
function beat3(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  stack(svg, BX[0], B2, AN, setup);
  stack(svg, BX[1], B2, BINH, setup);
  const tb = g(p, 'tbc');
  title(L, 'Tìm TBC', 330, setup, { size: 96 });
  avgLine(L, B2, AVG, setup, tb > 0.5 ? str(AVG) : 'TBC');
  // Chi: the unknown box fills with 24 marbles, the gold 4 stay on top
  const fill = g(p, 'fill');
  if (fill < 0.2) ghost(L, B2, AVG, setup * (1 - fill * 5));
  stack(svg, BX[2], B2, AVG, fill);
  for (let k = 0; k < MORE; k++) {
    const [x, y] = spot(BX[2], B2, AVG + k);
    marble(svg, x, y, { scale: pop(setup).scale, c: GOLD });
  }
  names(L, B2, [str(AN), str(BINH), fill >= 1 && g(p, 'e3') >= 1 ? str(CHI) : '?'], [setup, setup, setup]);
  eq(L, [str(AN), '+', str(BINH), '+', { s: str(MORE), color: CHALK.yellow }, '=', str(SUM2)], CX, 1330, { size: 104, t: g(p, 'e1') });
  eq(L, [str(SUM2), ':', '2', '=', { s: str(AVG), color: CHALK.yellow }], CX, 1470, { size: 104, t: g(p, 'e2') });
  if (tb > 0) popLabel(L, '= TBC', 930, 1442, tb, { size: 64, color: CHALK.mint });
  const xs = eq(L, ['Chi:', str(AVG), '+', { s: str(MORE), color: CHALK.yellow }, '=', { s: str(CHI), color: CHALK.yellow, size: 140 }],
    CX, 1650, { size: 110, t: g(p, 'e3') });
  L.loop(xs[5], 1605, 80, 78, { color: CHALK.yellow, width: 8, t: g(p, 'loop'), seed: 41 });
  const sp = g(p, 'spark');
  if (sp > 0) sparks(L, xs[5], 1605, 95, 128, sp, { seed: 45 });
}

// --- beat 4: check (72 : 3 = 24), then Chi's 4 go to An and all three hold 24 ------------------
function beat4(ctx, p) {
  const svg = svgLayer(ctx.objects());
  const L = ctx.chalk(60);
  const setup = g(p, 'setup');
  const give = g(p, 'give');
  title(L, 'Thử lại', 330, setup, { size: 96 });
  stack(svg, BX[0], B2, AN, setup);
  stack(svg, BX[1], B2, BINH, setup);
  stack(svg, BX[2], B2, AVG, setup);
  avgLine(L, B2, AVG, setup, str(AVG));
  extraFrom(AN).forEach(([a, b], k) => {
    const u = stagger(give, k, MORE, 0.5);
    const f = u > 0 ? flight(a, b, u, 220) : { x: a[0], y: a[1], squash: 1 };
    marble(svg, f.x, f.y, { scale: pop(setup).scale, squash: f.squash, c: GOLD });
  });
  const done = give >= 1;
  names(L, B2, done ? [str(AVG), str(AVG), str(AVG)] : [str(AN), str(BINH), str(CHI)], [setup, setup, setup]);
  eq(L, [str(AN), '+', str(BINH), '+', str(CHI), '=', str(AN + BINH + CHI)], CX, 1330, { size: 104, t: g(p, 'c1') });
  eq(L, [str(AN + BINH + CHI), ':', '3', '=', { s: str(AVG), color: CHALK.yellow }], CX - 30, 1470, { size: 104, t: g(p, 'c2') });
  mark(L, true, 870, 1430, g(p, 'ok'), { size: 80, seed: 51 });
  const s = g(p, 'same');
  if (s > 0) {
    L.text(`Mỗi bạn ${AVG} viên`, CX, 1650, { size: 104, color: CHALK.yellow, align: 'center', t: s });
    sparks(L, CX, levelY(B2, AVG) - 70, 50, 110, s, { seed: 55 });
  }
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
