// Dấu hiệu chia hết cho 2, 5, 9, 3 (Toán 4). Facts: lessons/dau_hieu_chia_het/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, ChalkLayer, measure } from '../../shared/web/js/chalk.js';
import { clamp01, lerp, easeInQuad, easeInOut, stagger, spring, pop, rng } from '../../shared/web/js/ease.js';
import { tile, TILE_W, TILE_H, GAP } from '../../shared/web/js/tiles.js';
import { row, arcArrow, flight } from '../../shared/web/js/parts.js';
import { drawEraser, wipePose, sweptMask, sweepOff } from '../../shared/web/js/eraser.js';

// --- facts (VietJack Toán 4 tr. 95–98), checked -------------------------------------
const digitSum = (n) => [...String(n)].reduce((a, c) => a + Number(c), 0);
const lastDigit = (n) => n % 10;
const EVEN_ENDS = [0, 2, 4, 6, 8]; // F1
const FIVE_ENDS = [0, 5]; // F3
const HOOK = 3015; // D1
const TWO = [[98, true], [1995, false]]; // F2
const FIVE = [[4005, true], [2021, false]]; // F3
const BOTH = 660; // F4
const NINE = 906; // F5 / D2
const QUIZ = 660; // D3
const QUIZ_ANS = { 2: true, 5: true, 9: false, 3: true };
for (const [n, ok] of TWO) console.assert(EVEN_ENDS.includes(lastDigit(n)) === ok && (n % 2 === 0) === ok, `2: ${n}`);
for (const [n, ok] of FIVE) console.assert(FIVE_ENDS.includes(lastDigit(n)) === ok && (n % 5 === 0) === ok, `5: ${n}`);
console.assert(lastDigit(BOTH) === 0 && BOTH % 10 === 0, '660 ends in 0');
console.assert(digitSum(HOOK) === 9 && HOOK % 9 === 0, '3015 : 9');
console.assert(digitSum(NINE) === 15 && NINE % 9 !== 0 && NINE % 3 === 0, '906: sum 15, not 9, yes 3');
console.assert(digitSum(QUIZ) === 12, '660 sum 12');
for (const [d, ok] of Object.entries(QUIZ_ANS)) console.assert((QUIZ % d === 0) === ok, `660 : ${d}`);

// --- board text (read at render time; an English variant overrides it) ------------
export const TEXT = {
  divisibleBy: 'chia hết cho',
  and: 'và',
  title: 'Dấu hiệu chia hết',
  lastDigit: 'chữ số cuối',
  addDigits: 'cộng chữ số',
  even: 'chẵn',
  odd: 'lẻ',
};

// --- small helpers ------------------------------------------------------------------
const g = (p, k) => (k in p ? p[k] : 1);
const BIG = 1.9; // hook tiles
const ROW_S = 1.5; // tiles of the example numbers
const EQ_S = 1.05; // tiles inside a digit-sum equation

// centres of a tile number, centred on cx
function tileXs(s, cx, scale) {
  const step = (TILE_W + GAP) * scale;
  return [...s].map((_, i) => cx + (i - (s.length - 1) / 2) * step);
}
// centres of a tile number whose last tile sits at rightX
function tileXsRight(s, rightX, scale) {
  const step = (TILE_W + GAP) * scale;
  return [...s].map((_, i) => rightX - (s.length - 1 - i) * step);
}

// a tile falling in from above: easeInQuad drop, squash on impact, spring back up
function dropPose(u, y, height = 520) {
  if (u <= 0) return null;
  const fall = 0.55;
  if (u < fall) {
    const k = easeInQuad(u / fall);
    return { y: lerp(y - height, y, k), squash: 1 + 0.12 * k }; // stretched while falling
  }
  const k = (u - fall) / (1 - fall);
  const s = 1 - 0.26 * Math.exp(-5 * k) * Math.cos(3.2 * Math.PI * k); // squash, then spring
  return { y: y + 14 * (1 - s), squash: s };
}

// chalk dust kicked out sideways when a tile lands; flies out and shrinks away
function dust(L, x, y, u, seed, scale = BIG) {
  if (u <= 0 || u >= 1) return;
  const r = rng(seed);
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1;
    const a = (0.1 + r() * 0.6) * Math.PI;
    const d = 20 + 110 * Math.sqrt(u) + r() * 40;
    const px = x + side * (TILE_W * scale * 0.35 + d * Math.cos(a * 0.5));
    const py = y - d * Math.sin(a) * 0.6 + 70 * u * u;
    const len = 26 * (1 - u) + 4;
    L.line([px, py], [px + side * len, py - len * 0.3], { width: 12 * (1 - u) + 2, seed: seed + i });
  }
}

// tiles of a number dropping in one after another, with landing dust
function dropTiles(objs, L, s, xs, y, prog, scale, seed, height = 520) {
  [...s].forEach((ch, i) => {
    const u = stagger(prog, i, s.length, 0.4);
    const pose = dropPose(u, y, height);
    if (pose) tile(objs, xs[i], pose.y, ch, 'int', { scale, squash: pose.squash });
    dust(L, xs[i], y + TILE_H * scale * 0.5, clamp01((u - 0.55) / 0.45), seed + i * 7, scale);
  });
}

// little chalk spark strokes around a point, drawn on with t (they stay)
function sparks(L, cx, cy, r0, r1, t, { n = 8, color = CHALK.yellow, seed = 0 } = {}) {
  if (t <= 0) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * 2 * Math.PI + 0.2;
    const ti = clamp01(t * 1.6 - (i / n) * 0.6);
    L.line([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)],
      { color, width: 7, t: ti, seed: seed + i });
  }
}

// a burst of strokes flying outward and shrinking away (gone at u = 1)
function burst(L, cx, cy, r, u, { color = CHALK.yellow, n = 8, seed = 0 } = {}) {
  if (u <= 0 || u >= 1) return;
  const d = r * (0.8 + 0.7 * Math.sqrt(u));
  const len = r * 0.45 * (1 - u);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI + 0.3;
    const c = Math.cos(a), s = Math.sin(a);
    L.line([cx + d * c, cy + d * s], [cx + (d + len) * c, cy + (d + len) * s],
      { color, width: 9 * (1 - u) + 2, seed: seed + i });
  }
}

// green tick / red cross that springs in and throws a burst of chalk
function mark(L, ok, x, y, t, { size = 76, seed = 0 } = {}) {
  if (t <= 0) return;
  const k = spring(t, 3, 6) * size;
  const color = ok ? CHALK.green : CHALK.red;
  const draw = clamp01(t * 3);
  if (ok) {
    L.poly([[x - 0.55 * k, y], [x - 0.12 * k, y + 0.45 * k], [x + 0.62 * k, y - 0.55 * k]],
      { color, width: 15, t: draw, seed, amp: 1 });
  } else {
    L.line([x - 0.45 * k, y - 0.45 * k], [x + 0.45 * k, y + 0.45 * k], { color, width: 15, t: clamp01(draw * 2), seed });
    L.line([x + 0.45 * k, y - 0.45 * k], [x - 0.45 * k, y + 0.45 * k], { color, width: 15, t: clamp01(draw * 2 - 1), seed: seed + 1 });
  }
  burst(L, x, y, size * 0.9, clamp01((t - 0.15) / 0.6), { color, seed: seed + 5 });
}

// the last digit's tile is picked up: small dip (anticipation), then springs up 40 px
function liftY(u) {
  if (u <= 0) return 0;
  if (u < 0.2) return 8 * Math.sin((Math.PI * u) / 0.2);
  return -40 * spring((u - 0.2) / 0.8, 3, 6);
}

// a number as tiles with its last digit lifted and circled (rule for 2 and 5)
function endsNumber(objs, L, s, rightX, y, { popT = 1, lift = 1, loop = 1, seed = 0 } = {}) {
  const xs = tileXsRight(s, rightX, ROW_S);
  [...s].forEach((ch, i) => {
    const { scale, squash } = pop(stagger(popT, i, s.length, 0.45));
    const last = i === s.length - 1;
    const dy = last ? liftY(lift) : 0;
    if (scale > 0) tile(objs, xs[i], y + dy, ch, 'int', { scale: scale * ROW_S, squash });
  });
  const ly = y + liftY(1) - 4;
  L.loop(rightX, ly, TILE_W * ROW_S * 0.78, TILE_H * ROW_S * 0.72, { color: CHALK.yellow, width: 7, t: loop, seed });
  return xs;
}

// tile copies fly down from a number into "a + b + c = total" (rule for 9 and 3)
// u: flight of the tiles (raw), t: "= total" write-on. Returns the centre x of the total.
function sumEquation(objs, L, s, fromXs, fromY, fromScale, cx, y, u, t, { color = CHALK.white, seed = 0 } = {}) {
  const digits = [...s];
  const tw = TILE_W * EQ_S;
  const plusW = 64;
  const eqW = 64;
  const total = String(digitSum(Number(s)));
  const totW = measure(total, 110);
  const width = digits.length * tw + (digits.length - 1) * plusW + eqW + totW + 24;
  let x = cx - width / 2;
  const tx = [];
  const px = [];
  digits.forEach((_, i) => {
    tx.push(x + tw / 2);
    x += tw;
    if (i < digits.length - 1) { px.push(x + plusW / 2); x += plusW; }
  });
  const eqX = x + eqW / 2;
  const totX = x + eqW + 24 + totW / 2;
  digits.forEach((ch, i) => {
    const ui = stagger(u, i, digits.length, 0.5);
    if (ui <= 0) return;
    const f = flight([fromXs[i], fromY], [tx[i], y], ui, 120);
    const sc = lerp(fromScale, EQ_S, easeInOut(f.v));
    tile(objs, f.x, f.y, ch, 'int', { scale: sc, squash: f.squash });
    // the "+" after a tile appears once that tile has landed
    if (i < px.length) L.text('+', px[i], y + 30, { size: 84, t: clamp01((ui - 0.85) / 0.15), align: 'center' });
  });
  L.text('=', eqX, y + 30, { size: 84, t: clamp01(t * 2), align: 'center' });
  L.text(total, totX, y + 38, { size: 110, color, t: clamp01(t * 2 - 1), align: 'center' });
  return totX;
}

// a full title line "chia hết cho N" with the divisor in yellow
function ruleTitle(L, parts, t, y = 330) {
  const items = [TEXT.divisibleBy];
  parts.forEach((d, i) => {
    if (i) items.push(TEXT.and);
    items.push({ s: String(d), color: CHALK.yellow, size: 136 });
  });
  row(L, items, 540, y, { size: 96, t });
}

// erase part of the board in-scene: old content (chalk and tiles) drawn into its own
// box, swept off by the eraser across band [y0, y1]
function bandWipe(ctx, prog, band, draw, cycles = 3) {
  if (prog >= 1) return;
  const box = ctx.objects();
  const sub = {
    fx: ctx.fx,
    chalk: (k = 60) => new ChalkLayer(box, k),
    objects: () => {
      const d = document.createElement('div');
      d.className = 'objects';
      box.appendChild(d);
      return d;
    },
  };
  draw(sub);
  if (prog <= 0) return;
  sweepOff(box, prog, band, cycles, sweptMask(prog, band, cycles, 130, 200));
  drawEraser(ctx.fx, wipePose(prog, band, cycles).pose);
}

// --- beat 1: hook. "3015 có chia hết cho 9 không?" ------------------------------------
const H = { askY: 420, tileY: 740, qY: 1240 };

function hookChalk(ctx, p) {
  const top = ctx.chalk(60);
  row(top, [TEXT.divisibleBy, { s: '9', color: CHALK.yellow, size: 140 }], 540, H.askY, { size: 96, t: g(p, 'ask') });
  const q = g(p, 'q');
  if (q > 0) {
    top.text('?', 540, H.qY + 120, { size: 400, color: CHALK.yellow, align: 'center', scale: spring(q, 3.2, 6) });
    sparks(top, 540, H.qY, 220, 290, clamp01(q * 1.4 - 0.2), { seed: 90 });
  }
}

function beat1(ctx, p) {
  const s = String(HOOK);
  const under = ctx.chalk(50);
  dropTiles(ctx.objects(), under, s, tileXs(s, 540, BIG), H.tileY, g(p, 'drop'), BIG, 60);
  hookChalk(ctx, p);
}

// --- beat 2: intro. 3015 parks at the top, the four divisors -------------------------
const DIVS = [2, 5, 9, 3];
const DIV_X = [215, 425, 655, 865];
const PARK = { y: 300, scale: 1.0 };

function divisorCircles(L, y, t, { r = 92, size = 130, seed = 300 } = {}) {
  DIVS.forEach((d, i) => {
    const ti = stagger(t, i, DIVS.length, 0.45);
    if (ti <= 0) return;
    const k = spring(ti, 3, 6);
    L.loop(DIV_X[i], y, r * k, r * k, { width: 6, t: clamp01(ti * 1.5), seed: seed + i });
    L.text(String(d), DIV_X[i], y + size * 0.36, { size, align: 'center', scale: k });
  });
}

function beat2(ctx, p) {
  const s = String(HOOK);
  bandWipe(ctx, g(p, 'erase'), [330, 1480], (sub) => hookChalk(sub, {}), 4);

  // 3015 hops up to the top and shrinks: it waits there until the 9-rule
  const objs = ctx.objects();
  const from = tileXs(s, 540, BIG);
  const to = tileXs(s, 540, PARK.scale);
  const park = g(p, 'park');
  [...s].forEach((ch, i) => {
    const u = stagger(park, i, s.length, 0.6);
    const f = flight([from[i], H.tileY], [to[i], PARK.y], u, 60);
    tile(objs, f.x, f.y, ch, 'int', { scale: lerp(BIG, PARK.scale, easeInOut(f.v)), squash: f.squash });
  });

  const L = ctx.chalk(60);
  L.text(TEXT.title, 540, 680, { size: 112, align: 'center', t: g(p, 'title') });
  divisorCircles(L, 1010, g(p, 'divs'));
  // two families: 2 and 5 underlined yellow, 9 and 3 underlined pink
  const ul = g(p, 'groups');
  L.line([DIV_X[0] - 90, 1160], [DIV_X[1] + 90, 1160], { color: CHALK.yellow, width: 9, t: clamp01(ul * 2), seed: 320 });
  L.line([DIV_X[2] - 90, 1160], [DIV_X[3] + 90, 1160], { color: CHALK.pink, width: 9, t: clamp01(ul * 2 - 1), seed: 321 });
  // what each family looks at: the last digit / the digit sum
  L.text(TEXT.lastDigit, (DIV_X[0] + DIV_X[1]) / 2, 1280, { size: 84, color: CHALK.yellow, align: 'center', t: g(p, 'hint1') });
  L.text(TEXT.addDigits, (DIV_X[2] + DIV_X[3]) / 2, 1280, { size: 84, color: CHALK.pink, align: 'center', t: g(p, 'hint2') });
}

// --- beats 3–5: the last digit (2, 5, both) ------------------------------------------
const ENDS = { row1: 540, row2: 690, rightX: 640, markX: 860, y1: 960, y2: 1330, numBand: [800, 1500] };

// "0 2 4 6 8" in yellow; returns the centre x of each digit
function evenRow(L, t) {
  return row(L, EVEN_ENDS.map((d) => ({ s: String(d), color: CHALK.yellow })), 540, ENDS.row1,
    { size: 120, gap: 0.8, t });
}
// "0   5": 0 under the 0 above, 5 between 4 and 6, in blue
function fiveRow(L, t, xs) {
  L.text('0', xs[0], ENDS.row2, { size: 120, color: CHALK.blue, align: 'center', t: clamp01(t * 2) });
  L.text('5', (xs[2] + xs[3]) / 2, ENDS.row2, { size: 120, color: CHALK.blue, align: 'center', t: clamp01(t * 2 - 1) });
}

// one example row: tiles, lifted last digit, mark and a small label under the mark
function example(ctx, objs, L, n, ok, y, p, k, { label, arrowTo, seed }) {
  const s = String(n);
  endsNumber(objs, L, s, ENDS.rightX, y,
    { popT: g(p, `n${k}`), lift: g(p, `lift${k}`), loop: g(p, `lift${k}`), seed });
  if (arrowTo) {
    const ly = y + liftY(1) - TILE_H * ROW_S * 0.72;
    arcArrow(L, [ENDS.rightX + 30, ly - 6], arrowTo, 60, g(p, `arrow${k}`), seed + 3);
  }
  mark(L, ok, ENDS.markX, y - 20, g(p, `mark${k}`), { size: 100, seed: seed + 10 });
  if (label) L.text(label, ENDS.markX, y + 140, { size: 80, align: 'center', color: ok ? CHALK.green : CHALK.red, t: g(p, `mark${k}`) });
}

function beat3(ctx, p) {
  const top = ctx.chalk(60);
  ruleTitle(top, [2], g(p, 'title'));
  evenRow(top, g(p, 'rule'));
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const xs = row(L, EVEN_ENDS.map(String), 540, ENDS.row1, { size: 120, gap: 0.8, t: 0 });
  example(ctx, objs, L, TWO[0][0], TWO[0][1], ENDS.y1, p, 1,
    { label: TEXT.even, arrowTo: [xs[4], ENDS.row1 + 22], seed: 400 });
  example(ctx, objs, L, TWO[1][0], TWO[1][1], ENDS.y2, p, 2, { label: TEXT.odd, seed: 420 });
}

const TITLE_BAND = [250, 380];

function beat4(ctx, p) {
  bandWipe(ctx, g(p, 'erase'), TITLE_BAND, (sub) => ruleTitle(sub.chalk(60), [2], 1), 2);
  bandWipe(ctx, g(p, 'erase'), ENDS.numBand, (sub) => {
    const objs = sub.objects();
    const L = sub.chalk(60);
    const xs = row(L, EVEN_ENDS.map(String), 540, ENDS.row1, { size: 120, gap: 0.8, t: 0 });
    example(sub, objs, L, TWO[0][0], TWO[0][1], ENDS.y1, {}, 1, { label: TEXT.even, arrowTo: [xs[4], ENDS.row1 + 22], seed: 400 });
    example(sub, objs, L, TWO[1][0], TWO[1][1], ENDS.y2, {}, 2, { label: TEXT.odd, seed: 420 });
  }, 4);
  const top = ctx.chalk(60);
  ruleTitle(top, [5], g(p, 'title'));
  const xs = evenRow(top, 1);
  fiveRow(top, g(p, 'rule'), xs);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  example(ctx, objs, L, FIVE[0][0], FIVE[0][1], ENDS.y1, p, 1,
    { arrowTo: [(xs[2] + xs[3]) / 2 + 44, ENDS.row2 + 10], seed: 440 });
  example(ctx, objs, L, FIVE[1][0], FIVE[1][1], ENDS.y2, p, 2, { seed: 460 });
}

function beat5(ctx, p) {
  bandWipe(ctx, g(p, 'erase'), TITLE_BAND, (sub) => ruleTitle(sub.chalk(60), [5], 1), 2);
  bandWipe(ctx, g(p, 'erase'), ENDS.numBand, (sub) => {
    const objs = sub.objects();
    const L = sub.chalk(60);
    example(sub, objs, L, FIVE[0][0], FIVE[0][1], ENDS.y1, {}, 1, { seed: 440 });
    example(sub, objs, L, FIVE[1][0], FIVE[1][1], ENDS.y2, {}, 2, { seed: 460 });
  }, 4);
  const top = ctx.chalk(60);
  ruleTitle(top, [2, 5], g(p, 'title'));
  const xs = evenRow(top, 1);
  fiveRow(top, 1, xs);
  // the 0 that is in both rows
  const L = ctx.chalk(60);
  L.loop(xs[0], (ENDS.row1 + ENDS.row2) / 2 - 42, 72, 150, { color: CHALK.yellow, width: 7, t: g(p, 'zero'), seed: 480 });
  const objs = ctx.objects();
  const y = 1200;
  endsNumber(objs, L, String(BOTH), ENDS.rightX, y, { popT: g(p, 'n1'), lift: g(p, 'lift1'), loop: g(p, 'lift1'), seed: 490 });
  arcArrow(L, [xs[0] + 20, ENDS.row2 + 80], [ENDS.rightX - 70, y - 120], -80, g(p, 'arrow1'), 495);
  mark(L, true, ENDS.markX, y - 20, g(p, 'mark1'), { size: 100, seed: 500 });
}

// --- beats 6–7: the digit sum (9, then 3) -------------------------------------------
const SUM = { hookY: 540, eq1: 820, numY: 1140, eq2: 1420, markX: 960 };

function nineBoard(ctx, p, { divisor = 9 } = {}) {
  const top = ctx.chalk(60);
  ruleTitle(top, [divisor], divisor === 9 ? g(p, 'title') : 1);
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const h = String(HOOK);
  const hx = tileXs(h, 540, ROW_S);
  dropTiles(objs, under, h, hx, SUM.hookY, g(p, 'drop1'), ROW_S, 600, 170); // short drop: stays under the title
  // the opening question comes back next to 3015 and is answered with a tick
  const hq = g(p, 'drop1');
  const ho = g(p, 'mark1');
  const hk = spring(hq, 3.2, 6) * (ho < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (ho / 0.3)) : 1.15 * (1 - (ho - 0.3) / 0.7));
  const qx = hx[3] + TILE_W * ROW_S * 0.5 + 110;
  if (hk > 0) L.text('?', qx, SUM.hookY + 50, { size: 150, color: CHALK.yellow, align: 'center', scale: hk });
  mark(L, true, qx, SUM.hookY, clamp01((ho - 0.4) / 0.6), { size: 96, seed: 630 });
  const t1 = sumEquation(objs, L, h, hx, SUM.hookY, ROW_S, 470, SUM.eq1, g(p, 'fly1'), g(p, 'sum1'),
    { color: CHALK.yellow });
  L.loop(t1, SUM.eq1, 62, 66, { color: CHALK.yellow, width: 6, t: g(p, 'sum1'), seed: 610 });
  mark(L, true, SUM.markX, SUM.eq1, g(p, 'mark1'), { size: 96, seed: 620 });

  const n = String(NINE);
  const nx = tileXs(n, 540, ROW_S);
  dropTiles(objs, under, n, nx, SUM.numY, g(p, 'drop2'), ROW_S, 640, 220); // stays under the first sum
  const t2 = sumEquation(objs, L, n, nx, SUM.numY, ROW_S, 470, SUM.eq2, g(p, 'fly2'), g(p, 'sum2'));
  return { L, t2 };
}

function beat6(ctx, p) {
  const { L } = nineBoard(ctx, p);
  mark(L, false, SUM.markX, SUM.eq2, g(p, 'mark2'), { size: 96, seed: 660 });
}

function beat7(ctx, p) {
  // only the title band and the cross are wiped: the rest of the board stays
  bandWipe(ctx, g(p, 'erase'), TITLE_BAND, (sub) => ruleTitle(sub.chalk(60), [9], 1), 2);
  bandWipe(ctx, g(p, 'erase2'), [SUM.eq2 - 40, SUM.eq2 + 40], (sub) => mark(sub.chalk(60), false, SUM.markX, SUM.eq2, 1, { size: 96, seed: 660 }), 1);
  const { L, t2 } = nineBoard(ctx, {}, { divisor: 3 });
  const top = ctx.chalk(60);
  ruleTitle(top, [3], g(p, 'title'));
  L.loop(t2, SUM.eq2, 74, 66, { color: CHALK.yellow, width: 6, t: g(p, 'loop'), seed: 680 });
  mark(L, true, SUM.markX, SUM.eq2, g(p, 'mark2'), { size: 96, seed: 690 });
}

// --- beats 8–9: challenge 660 ---------------------------------------------------------
const Q = { numY: 450, labelY: 700, circY: 860, ansY: 1060, countY: 1360, eqY: 1360 };

function quizBoard(ctx, p) {
  const s = String(QUIZ);
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const xs = tileXs(s, 540, 1.5);
  dropTiles(objs, under, s, xs, Q.numY, g(p, 'drop'), 1.5, 700);
  const L = ctx.chalk(60);
  L.text(TEXT.divisibleBy, 540, Q.labelY, { size: 90, align: 'center', t: g(p, 'label') });
  divisorCircles(L, Q.circY, g(p, 'divs'), { r: 84, size: 120, seed: 710 });
  return { objs, L, xs };
}

// "?" under each divisor; shrinks away (wind-up, then 0) when its answer comes
function quizMarks(L, p, out = {}) {
  const t = g(p, 'qs');
  DIVS.forEach((d, i) => {
    const ti = stagger(t, i, DIVS.length, 0.45);
    const o = out[d] || 0;
    const k = spring(ti, 3, 6) * (o < 0.3 ? 1 + 0.15 * Math.sin((Math.PI / 2) * (o / 0.3)) : 1.15 * (1 - (o - 0.3) / 0.7));
    if (k > 0) L.text('?', DIV_X[i], Q.ansY + 36, { size: 130, color: CHALK.yellow, align: 'center', scale: k });
  });
}

function beat8(ctx, p) {
  const { L } = quizBoard(ctx, p);
  quizMarks(L, p);
  // countdown 3, 2, 1: each pops in and shrinks away; key pose = nothing left
  const c = g(p, 'count');
  [3, 2, 1].forEach((n, i) => {
    const u = clamp01(c * 3 - i);
    if (u <= 0 || u >= 1) return;
    const k = u < 0.6 ? spring(u / 0.6, 3, 6) : 1.1 * (1 - easeInQuad((u - 0.6) / 0.4));
    L.text(String(n), 540, Q.countY + 90, { size: 320, color: CHALK.yellow, align: 'center', scale: k });
  });
}

function beat9(ctx, p) {
  const { objs, L } = quizBoard(ctx, {});
  const s = String(QUIZ);
  // answer for 2 and 5: the last digit is lifted out of the number
  const lift = g(p, 'lift');
  const xs = tileXs(s, 540, 1.5);
  // the drop-in tiles were drawn by quizBoard; draw the lifted 0 over its place
  objs.lastChild && objs.removeChild(objs.lastChild);
  tile(objs, xs[2], Q.numY + liftY(lift), s[2], 'int', { scale: 1.5 });
  L.loop(xs[2], Q.numY + liftY(1) - 4, TILE_W * 1.5 * 0.78, TILE_H * 1.5 * 0.72, { color: CHALK.yellow, width: 7, t: lift, seed: 740 });
  const m25 = g(p, 'mark25');
  const msum = g(p, 'marksum');
  const qOut = (k) => clamp01(k * 3);
  quizMarks(L, {}, { 2: qOut(m25), 5: qOut(m25), 9: qOut(msum), 3: qOut(msum) });
  mark(L, true, DIV_X[0], Q.ansY, clamp01(m25 * 1.5 - 0.3), { size: 90, seed: 750 });
  mark(L, true, DIV_X[1], Q.ansY, clamp01(m25 * 1.5 - 0.5), { size: 90, seed: 760 });
  // answer for 9 and 3: digit sum
  const tot = sumEquation(objs, L, s, xs, Q.numY, 1.5, 540, Q.eqY, g(p, 'fly'), g(p, 'sum'), { color: CHALK.yellow });
  L.loop(tot, Q.eqY, 74, 66, { color: CHALK.yellow, width: 6, t: g(p, 'loop12'), seed: 790 });
  mark(L, QUIZ_ANS[9], DIV_X[2], Q.ansY, clamp01(msum * 1.5 - 0.5), { size: 90, seed: 770 });
  mark(L, QUIZ_ANS[3], DIV_X[3], Q.ansY, clamp01(msum * 1.5 - 0.3), { size: 90, seed: 780 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8, beat9 };
