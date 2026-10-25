// Đặt gương ở đâu để kết quả lớn nhất, không quá 1000? Facts: lessons/dat_guong/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, lerp, stagger, spring, pop, easeInOut, easeOutCubic } from '../../shared/web/js/ease.js';
import { row as chalkRow, flight } from '../../shared/web/js/parts.js';
import { layout, mirrored, centroid, woodSvg, woodBar, glass } from './segments.js';
import { g, sparks, burst, mark, hopY } from '../que_diem/fx.js';

// on-board words (an English version overrides them: lessons/dat_guong_en/scene.js)
export const TEXT = { title: 'Đặt gương ở đâu?', largest: 'lớn nhất,', notOver: 'không quá' };
// layout values that depend on the words' length
export const FIT = { titleUnderline: 470 };

// --- facts (story.md F1–F3, D1–D6), checked -----------------------------------------
const SHOWN = '18+18'; // F1: the display
const SYM = { 1: '1', 8: '8', '+': '+' }; // D1: each glyph looks the same in a mirror
const D0 = layout(SHOWN);
const C = D0.cells;
// F2: mirror lines. A: through the middle of the first 8, B: between 18 and +,
// C: through the middle of +, D: through the middle of the second 8
const LINES = {
  A: { x: (C[1].x0 + C[1].x1) / 2, cut: 1 },
  B: { x: (C[1].x1 + C[2].x0) / 2, cut: null, after: 1 },
  C: { x: (C[2].x0 + C[2].x1) / 2, cut: 2 },
  D: { x: (C[4].x0 + C[4].x1) / 2, cut: 4 },
};
// D2: what the eye sees = the glyphs left of the mirror, the cut glyph made whole, then the left
// glyphs reversed (a mirror reverses order; 1, 8 and + look the same flipped)
function seen({ cut, after }) {
  const left = cut === null ? SHOWN.slice(0, after + 1) : SHOWN.slice(0, cut);
  const mid = cut === null ? '' : SHOWN[cut];
  return left + mid + [...left].reverse().map((ch) => SYM[ch]).join('');
}
const value = (s) => s.split('+').reduce((a, n) => a + Number(n), 0);
const SEEN = Object.fromEntries(Object.entries(LINES).map(([k, l]) => [k, seen(l)]));
const VAL = Object.fromEntries(Object.entries(SEEN).map(([k, s]) => [k, value(s)]));
console.assert(SEEN.A === '181' && VAL.A === 181, 'A: 181');
console.assert(SEEN.B === '1881' && VAL.B === 1881, 'B: 1881');
console.assert(SEEN.C === '18+81' && VAL.C === 18 + 81 && VAL.C === 99, 'C: 18 + 81 = 99');
console.assert(SEEN.D === '18+181+81' && VAL.D === 18 + 181 + 81 && VAL.D === 280, 'D: 18 + 181 + 81 = 280');
const OK = Object.keys(VAL).filter((k) => VAL[k] <= 1000); // F3: not exceeding 1000
const BEST = OK.reduce((a, b) => (VAL[b] > VAL[a] ? b : a));
console.assert(OK.join() === 'A,C,D' && BEST === 'D' && VAL[BEST] === 280, 'largest not over 1000: D = 280');
// the drawn bars, mirrored, must spell the same glyphs: count the bars per side
for (const [k, l] of Object.entries(LINES)) {
  const { left, refl } = mirrored(D0.bars, l.x);
  const whole = layout(SEEN[k]).bars.length;
  const halves = left.filter((b) => b.pts.some(([x]) => Math.abs(x - l.x) < 1e-9)).length;
  console.assert(left.length + refl.length - halves === whole, `${k}: mirrored bars spell ${SEEN[k]}`);
}

// --- layout ------------------------------------------------------------------------------
const KEYS = ['A', 'B', 'C', 'D'];
const TOP = { U: 220, oy: 290, cx: 625, letterY: 615, lineY: [250, 560], condY: 720, eye: [0, 400] };
TOP.ox = TOP.cx - (D0.width * TOP.U) / 2;
TOP.eye[0] = TOP.ox - 150;
const topX = (x) => TOP.ox + x * TOP.U;
const ROW = { U: 120, ox: 165, y: [835, 1030, 1225, 1420], labelX: 100, resR: 1032, resSize: 84 };
const rowX = (x) => ROW.ox + x * ROW.U;
for (const k of KEYS) console.assert(rowX(2 * LINES[k].x) < ROW.resR - measure(`= ${VAL[k]}`, ROW.resSize) - 20, `row ${k} fits left of its result`);

// beat order of the one board
const ORDER = ['beat1', 'beat2', 'beat3', 'beat4', 'beat5', 'beat6'];
const ROW_BEAT = { A: 'beat2', B: 'beat3', C: 'beat4', D: 'beat5' };
function state(beat, p) {
  const idx = ORDER.indexOf(beat);
  return (b, k) => {
    const i = ORDER.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}

// chalk word that springs in (scale) instead of sweeping
function popText(L, s, x, y, u, o = {}) {
  if (u <= 0) return;
  L.text(s, x, y, { align: 'center', ...o, scale: spring(u, 3.2, 6) * (o.scale || 1) });
}
const bump = (u, a = 0.3) => (u > 0 && u < 1 ? 1 + a * Math.sin(Math.PI * u) : 1);

// --- top: the display, the eye, the four lines ---------------------------------------------
function eye(L, x, y, t, k = 1) {
  if (t <= 0) return;
  const w = 62 * k, h = 30 * k;
  const up = Array.from({ length: 13 }, (_, i) => { const s = i / 12; return [x - w + 2 * w * s, y - h * Math.sin(Math.PI * s)]; });
  const dn = Array.from({ length: 13 }, (_, i) => { const s = i / 12; return [x + w - 2 * w * s, y + h * 0.8 * Math.sin(Math.PI * s)]; });
  L.poly([...up, ...dn], { width: 7, t: clamp01(t * 1.6), seed: 11, amp: 0.6 });
  if (t > 0.5) {
    L.loop(x + 8 * k, y, 17 * k, 17 * k, { width: 8, t: clamp01(t * 2 - 1), seed: 12 });
    L.loop(x + 8 * k, y, 6 * k, 6 * k, { width: 10, t: clamp01(t * 2 - 1), seed: 13 });
  }
}

// mirror on the top display: drops onto line A, then hops line to line (beats 3–5)
function topMirrorX(S) {
  let x = LINES.A.x;
  for (const [k, b] of [['B', 'beat3'], ['C', 'beat4'], ['D', 'beat5']]) {
    const u = S(b, 'move');
    if (u <= 0) break;
    const f = flight([topX(x), 0], [topX(LINES[k].x), 0], u, 90);
    if (u < 1) return { x: f.x, dy: f.y, squash: f.squash };
    x = LINES[k].x;
  }
  return { x: topX(x), dy: 0, squash: 1 };
}

function activeKey(S) {
  let a = null;
  for (const k of KEYS) if (S(ROW_BEAT[k], ROW_BEAT[k] === 'beat2' ? 'mirror' : 'move') > 0) a = k;
  return a;
}

function topBoard(svg, L, S) {
  const disp = S('beat1', 'disp');
  D0.bars.forEach((b, i) => {
    const px = b.pts.map(([x, y]) => [topX(x), TOP.oy + y * TOP.U]);
    const { scale, squash } = pop(stagger(disp, i, D0.bars.length, 0.25));
    woodBar(svg, px, { scale, squash });
  });
  // the eye; it blinks/grows while the voice says "Mắt"
  eye(L, TOP.eye[0], TOP.eye[1], S('beat1', 'eye'), bump(S('beat2', 'sight'), 0.35));
  // sight line from the eye to the mirror
  const sight = S('beat2', 'sight');
  if (sight > 0) {
    L.dashed([TOP.eye[0] + 80, TOP.eye[1]], [topX(0) - 22, TOP.eye[1]], { color: CHALK.yellow, width: 6, t: easeOutCubic(sight) });
  }
  // lines + letters
  const act = activeKey(S);
  const pick = S('beat6', 'pick');
  KEYS.forEach((k, i) => {
    const u = S('beat1', `l${k.toLowerCase()}`);
    const x = topX(LINES[k].x);
    const on = k === act;
    const col = on ? CHALK.yellow : CHALK.white;
    L.dashed([x, TOP.lineY[0]], [x, TOP.lineY[1]], { color: col, width: on ? 6 : 4.5, t: easeOutCubic(u * 1.4) });
    popText(L, k, x, TOP.letterY, clamp01(u * 1.5 - 0.3), { size: 64, color: col });
    L.loop(x, TOP.letterY - 22, 37, 37, { color: col, width: 5, t: clamp01(u * 1.5 - 0.5), seed: 40 + i });
    if (k === BEST) {
      L.loop(x, TOP.letterY - 20, 52, 50, { color: CHALK.yellow, width: 9, t: pick, seed: 50 });
      const ask = S('beat6', 'ask');
      mark(L, true, x + 105, TOP.letterY - 30 + hopY((ask * 2) % 1, 26), pick, { size: 58, seed: 87 });
      burst(L, x, TOP.letterY - 20, 80, clamp01(pick * 1.5 - 0.5), { n: 10, seed: 52 });
    }
  });
  // the glass mirror on the current line
  const drop = S('beat2', 'mirror');
  if (drop > 0) {
    const m = topMirrorX(S);
    const f = clamp01(drop / 0.7);
    const dy = -140 * (1 - easeOutCubic(f)) + m.dy;
    const sq = drop < 1 ? 1 + 0.25 * Math.sin(Math.PI * clamp01((drop - 0.6) / 0.4)) * (drop > 0.6 ? 1 : 0) : m.squash;
    glass(svg, m.x, TOP.oy - 30, TOP.oy + TOP.U + 30, { dy, squash: sq * m.squash, shine: (S('beat6', 'ask') * 2) % 1 });
  }
  // condition: largest, not over 1000
  const cond = S('beat1', 'cond');
  const lim = bump(S('beat6', 'lim'), 0.3);
  chalkRow(L, [TEXT.largest, TEXT.notOver, { s: '1000', color: CHALK.yellow, size: 64 * lim }], 540, TOP.condY, { size: 64, t: cond, seed: 60, gap: 0.3 });
}

// --- the four rows: what the eye sees for each place ---------------------------------------
const ROWS = Object.fromEntries(KEYS.map((k) => [k, mirrored(D0.bars, LINES[k].x)]));
const RESULT_TEXT = Object.fromEntries(KEYS.map((k) => [k, `= ${VAL[k]}`]));

// centre x of the right-aligned result "= n"
const resCenter = (k) => ROW.resR - measure(RESULT_TEXT[k], ROW.resSize) / 2;

// x (px) of the centre of glyph j of SEEN[k] in its row
function seenCenter(k, j) {
  const cells = layout(SEEN[k]).cells;
  return rowX((cells[j].x0 + cells[j].x1) / 2);
}

function rowBoard(svg, L, S, k, i) {
  const b = ROW_BEAT[k];
  const left = S(b, 'left');
  if (left <= 0) return;
  const y0 = ROW.y[i] - ROW.U / 2;
  const P = (pts, f = (x) => x) => pts.map(([x, y]) => [rowX(f(x)), y0 + y * ROW.U]);
  const m = LINES[k].x;
  const R = ROWS[k];
  const pulse = S('beat6', `c${k.toLowerCase()}`);
  // label
  popText(L, k, ROW.labelX, ROW.y[i] + 28, clamp01(left * 2), { size: 82, color: CHALK.yellow });
  // the glass stands behind the bars, so the made-whole glyph on the line still reads
  const flip = S(b, 'flip');
  const drop = clamp01(flip / 0.35);
  if (drop > 0) {
    const dy = -90 * (1 - easeOutCubic(clamp01(drop / 0.7)));
    const sq = drop > 0.7 && drop < 1 ? 1 + 0.2 * Math.sin(Math.PI * (drop - 0.7) / 0.3) : 1;
    glass(svg, rowX(m), y0 - 26, y0 + ROW.U + 26, { dy, squash: sq });
  }
  // left part (cream), popping in left to right
  R.left.forEach((bar, j) => {
    const { scale, squash } = pop(stagger(left, j, R.left.length, 0.35));
    woodBar(svg, P(bar.pts), { scale, squash });
  });
  // mirror drops in, then the reflection unfolds out of it (x' = m - kf (x - m), kf: -1 -> 1)
  const un = clamp01((flip - 0.25) / 0.75);
  if (un > 0) {
    const e = easeInOut(clamp01(un / 0.8));
    const wob = un > 0.8 ? 0.07 * Math.exp(-5 * (un - 0.8) / 0.2) * Math.sin(Math.PI * 3 * (un - 0.8) / 0.2) : 0;
    const kf = -1 + 2 * e + wob;
    R.refl.forEach((bar) => {
      const src = R.left[R.refl.indexOf(bar)];
      woodBar(svg, P(src.pts, (x) => m - kf * (x - m)), { kind: 'dec' });
    });
  }
  // result "= n"
  const res = S(b, 'res');
  const ry = ROW.y[i] + 32;
  const rx = resCenter(k);
  const k2 = bump(pulse, 0.25);
  const best = S('beat6', 'best');
  const col = k === BEST && best > 0 ? CHALK.yellow : k === 'B' && S('beat3', 'cross') > 0.3 ? CHALK.red : CHALK.white;
  L.text(RESULT_TEXT[k], rx, ry, { size: ROW.resSize, t: clamp01(res * 1.6), scale: k2, color: col, align: 'center' });
  burst(L, rx, ry - 30, 110, clamp01(res * 1.6 - 0.6), { n: 8, seed: 70 + i });
}

// row extras: circles while the voice names a part, the B cross-out, the final pick
function rowMarks(L, S) {
  // A: the 8 made whole
  const half = S('beat2', 'half');
  L.loop(seenCenter('A', 1), ROW.y[0], 50, 82, { color: CHALK.yellow, width: 7, t: half, seed: 80 });
  // B: "81" is the flipped "18"
  const r81 = S('beat3', 'r81');
  const bx = (seenCenter('B', 2) + seenCenter('B', 3)) / 2;
  L.loop(bx, ROW.y[1], 72, 84, { color: CHALK.yellow, width: 7, t: r81, seed: 81 });
  // B: over 1000, crossed out
  const cross = S('beat3', 'cross');
  if (cross > 0) {
    const y = ROW.y[1];
    L.line([ROW.labelX + 40, y - 8], [rowX(2 * LINES.B.x) + 30, y + 4], { color: CHALK.red, width: 13, t: clamp01(cross * 1.6), seed: 82 });
    L.text('> 1000', resCenter('B'), y + 100, { align: 'center', size: 58, color: CHALK.red, t: clamp01(cross * 2 - 0.6) });
  }
  // C: + flipped is still +
  const plus = S('beat4', 'plus');
  L.loop(seenCenter('C', 2), ROW.y[2], 48, 48, { color: CHALK.yellow, width: 7, t: plus, seed: 83 });
  // the answer: 280 circled, ✓ next to D
  const best = S('beat6', 'best');
  const pick = S('beat6', 'pick');
  const ry = ROW.y[3];
  const cx = resCenter('D');
  L.loop(cx - 6, ry, 122, 66, { color: CHALK.yellow, width: 8, t: best, seed: 84 });
  burst(L, cx, ry, 150, clamp01(best * 1.5 - 0.5), { n: 10, seed: 85 });
  // the comparison of the three allowed results, smallest to largest (F3, D6)
  const allowed = OK.map((k) => VAL[k]).sort((a, b) => a - b);
  console.assert(allowed.join() === '99,181,280', 'order 99 < 181 < 280');
  const parts = allowed.flatMap((v, j) => [...(j ? ['<'] : []), v === VAL[BEST] ? { s: String(v), color: CHALK.yellow, size: 92 * bump(best, 0.3) } : String(v)]);
  chalkRow(L, parts, 540, 1590, { size: 80, t: S('beat6', 'cmp'), seed: 95, gap: 0.35 });
  L.loop(ROW.labelX, ry, 46, 50, { color: CHALK.yellow, width: 8, t: pick, seed: 86 });
}

// --- countdown (hook tail): ring + 3, 2, 1; gone at the key pose ---------------------------
function countdown(L, c, cx, cy, r) {
  if (c <= 0 || c >= 1) return;
  const ring = Array.from({ length: 41 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 40) * 2 * Math.PI * (1 - c);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  L.poly(ring, { color: CHALK.yellow, width: 8, t: clamp01(c * 12), seed: 90, amp: 0.6 });
  [3, 2, 1].forEach((n, i) => {
    const u = clamp01(c * 3 - i);
    if (u <= 0 || u >= 1) return;
    const k = u < 0.6 ? spring(u / 0.6, 3, 6) : 1.1 * (1 - clamp01((u - 0.6) / 0.4) ** 2);
    L.text(String(n), cx, cy + 52, { size: 150, align: 'center', scale: k });
  });
}

// --- the board ---------------------------------------------------------------------------
function board(ctx, beat, p) {
  const S = state(beat, p);
  const svg = woodSvg(ctx.objects());
  const L = ctx.chalk(60);
  const T = THEME.layout.title;
  const tt = S('beat1', 'title');
  L.text(TEXT.title, T.x, T.y, { size: T.size, t: tt });
  L.line([T.x, T.y + 22], [T.x + FIT.titleUnderline, T.y + 22], { width: T.underlineWidth, t: tt, seed: 5 });
  topBoard(svg, L, S);
  KEYS.forEach((k, i) => rowBoard(svg, L, S, k, i));
  rowMarks(L, S);
  if (beat === 'beat1') {
    // big "?" under the question, shrinking away as the countdown starts
    const q = g(p, 'q');
    const c = g(p, 'count');
    const out = c > 0 ? Math.max(0, 1 - easeOutCubic(c * 6)) : 1;
    // it nods on every letter A, B, C, D
    const nod = ['la', 'lb', 'lc', 'ld'].reduce((k, key) => k * bump(g(p, key), 0.18), 1);
    if (out > 0) popText(L, '?', 540, 1240, q, { size: 300, color: CHALK.yellow, scale: out * nod });
    countdown(L, c, 540, 1150, 115);
  }
}

export const scenes = Object.fromEntries(ORDER.map((b) => [b, (ctx, p) => board(ctx, b, p)]));
