// Toán tính tuổi: tổng – tỉ (lùi 4 năm) and hiệu – tỉ (hiệu không đổi), solved with
// segment diagrams. Facts: lessons/tinh_tuoi/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { clamp01, lerp, easeOutCubic, easeInOut, spring, pop, stagger } from '../../shared/web/js/ease.js';
import { g, sparks, mark, hopY, hopSquash, outScale, thinkingDots, popLabel } from '../../shared/web/js/fx.js';

// --- facts (story.md F1, F2, D1–D5), checked ----------------------------------------------
const A = { sum: 48, back: 4, ratio: 4 }; // F1
const A_SUM_THEN = A.sum - A.back - A.back; // D1
const A_PARTS = 1 + A.ratio; // D2
const A_SON_THEN = A_SUM_THEN / A_PARTS;
const A_DAD_THEN = A_SON_THEN * A.ratio;
const A_DAD_NOW = A_DAD_THEN + A.back; // D3
const A_SON_NOW = A_SON_THEN + A.back;
console.assert(A_SUM_THEN === 40 && A_PARTS === 5 && A_SON_THEN === 8 && A_DAD_THEN === 32, 'A: then');
console.assert(A_DAD_NOW === 36 && A_SON_NOW === 12 && A_DAD_NOW + A_SON_NOW === A.sum, 'A: now');
console.assert(A_DAD_NOW - A.back === A.ratio * (A_SON_NOW - A.back), 'A: ratio 4 years ago');

const B = { mom: 35, kid: 7, ratio: 3 }; // F2
const B_DIFF = B.mom - B.kid; // D4
const B_PARTS = B.ratio - 1; // D5
const B_KID_THEN = B_DIFF / B_PARTS;
const B_YEARS = B_KID_THEN - B.kid;
console.assert(B_DIFF === 28 && B_PARTS === 2 && B_KID_THEN === 14 && B_YEARS === 7, 'B: solve');
const B_MOM_THEN = B.mom + B_YEARS;
console.assert(B_MOM_THEN === 42 && B_MOM_THEN === B.ratio * (B.kid + B_YEARS), 'B: check');

const str = String;
const CX = 552; // centre of the safe content box (70..1035)
const DAD = CHALK.white;
const KID = CHALK.mint;

// --- an equation row: parts are strings, {s, color, t, scale, pad} or {sym: 'times'|'minus'} --
function eq(L, parts, x0, y, { size = 120, t = 1, align = 'center', gap: gk = 0.22 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const widths = items.map((q) => (q.sym ? size * 0.42 : measure(q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1) + items.reduce((a, q) => a + (q.pad || 0), 0);
  let x = align === 'center' ? x0 - total / 2 : x0;
  const cy = y - size * 0.32;
  const xs = [];
  items.forEach((q, i) => {
    const w = widths[i];
    xs.push(x + w / 2);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    const o = { color: q.color, width: size * 0.075, seed: 30 + i };
    if (ti > 0 && q.sym === 'times') {
      const c = x + w / 2;
      const r = size * 0.16;
      L.line([c - r, cy - r], [c + r, cy + r], { ...o, t: clamp01(ti * 2) });
      L.line([c + r, cy - r], [c - r, cy + r], { ...o, t: clamp01(ti * 2 - 1) });
    } else if (ti > 0 && q.sym === 'minus') {
      L.line([x + w * 0.1, cy], [x + w * 0.9, cy], { ...o, t: ti });
    } else if (ti > 0 && q.s.trim()) {
      L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    }
    x += w + gap + (q.pad || 0);
  });
  return xs;
}

// --- a wooden segment (one block of a segment diagram), left edge at x ---------------------
function seg(objs, x, cy, w, h, kind, label, { sx = 1, sy = 1, dy = 0, size } = {}) {
  if (w <= 0 || sx <= 0 || sy <= 0) return;
  const d = document.createElement('div');
  d.className = `tile ${kind}`;
  Object.assign(d.style, {
    left: `${x}px`, top: `${cy - h / 2 + dy}px`, width: `${w}px`, height: `${h}px`,
    transformOrigin: '50% 100%', transform: `scale(${sx}, ${sy})`,
  });
  if (size) d.style.fontSize = `${size}px`;
  if (label) {
    const s = document.createElement('span');
    s.textContent = label;
    d.appendChild(s);
  }
  objs.appendChild(d);
}

// a block that drops in from just above with squash + spring (u = 0..1)
function blockIn(objs, x, cy, w, h, kind, label, u, o = {}) {
  if (u <= 0) return;
  const k = pop(clamp01(u * 1.4));
  const fall = clamp01(u / 0.45);
  const dy = -60 * (1 - easeOutCubic(fall));
  seg(objs, x, cy, w, h, kind, label, { ...o, sx: k.scale / Math.sqrt(k.squash), sy: k.scale * k.squash, dy });
}

// curly brace: vertical (opening left) or horizontal (opening down), drawn on with t
function braceV(L, x, y0, y1, t, { color = CHALK.yellow, w = 34, seed = 0 } = {}) {
  const m = (y0 + y1) / 2;
  L.poly([[x, y0], [x + w * 0.5, y0 + 18], [x + w * 0.5, m - 18], [x + w, m], [x + w * 0.5, m + 18],
    [x + w * 0.5, y1 - 18], [x, y1]], { color, width: 7, t, seed, amp: 0.8 });
}
function braceH(L, x0, x1, y, t, { color = CHALK.yellow, h = 34, seed = 0, up = false } = {}) {
  const m = (x0 + x1) / 2;
  const s = up ? -1 : 1;
  L.poly([[x0, y], [x0 + 18, y + s * h * 0.5], [m - 18, y + s * h * 0.5], [m, y + s * h], [m + 18, y + s * h * 0.5],
    [x1 - 18, y + s * h * 0.5], [x1, y]], { color, width: 7, t, seed, amp: 0.8 });
}

// "?" that springs in (and stays)
function qMark(L, x, y, u, size = 140) {
  if (u <= 0) return;
  L.text('?', x, y, { size, color: CHALK.yellow, align: 'center', scale: spring(u, 3, 6) });
}

// beat keys in order; a later beat's keys are 0 while an earlier one plays (shared boards)
const title = (L, s, y, t, { size = 104, color = CHALK.white } = {}) =>
  L.text(s, CX, y, { size, align: 'center', color, t });

// --- beat 1: problem A --------------------------------------------------------------------
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  title(L, 'Tính tuổi', 280, g(p, 'title'), { size: 116, color: CHALK.yellow });
  L.line([CX - 230, 312], [CX + 230, 312], { width: 5, t: easeOutCubic(g(p, 'title')), seed: 3, color: CHALK.yellow });
  eq(L, [{ s: 'Nay:', color: CHALK.pink }, 'Bố', '+', { s: 'Con', color: KID }, '=', { s: str(A.sum), color: CHALK.yellow }], CX, 560, { size: 128, t: g(p, 'r1') });
  L.text(`${A.back} năm trước:`, CX, 820, { size: 104, color: CHALK.pink, align: 'center', t: g(p, 'r2a') });
  eq(L, ['Bố', '=', str(A.ratio), { sym: 'times' }, { s: 'Con', color: KID }], CX, 1010, { size: 136, t: g(p, 'r2b') });
  const xs = eq(L, ['Nay bố', '=', { s: '   ', pad: 0 }], CX, 1280, { size: 120, t: g(p, 'ask') });
  qMark(L, xs[2], 1285, g(p, 'q'), 150);
  const d = g(p, 'dots');
  thinkingDots(L, CX, 1470, d < 1 ? d : 0, { r: 16, gap: 80 });
}

// --- beat 2: four years back, each one loses 4 -------------------------------------------
const K2 = 20; // px per year
const X2 = 260;
const ROW2 = { dad: 560, kid: 800, h: 150 };

function cutPiece(objs, L, x, cy, u, label, kind, seed) {
  // the 4-year piece: wind-up dip, hop up-right on an arc, shrink away; "−4" stays in chalk
  const w = A.back * K2;
  if (u < 1) {
    let dx = 0, dy = 0, k = 1;
    if (u > 0) {
      if (u < 0.15) dy = 8 * Math.sin((Math.PI * u) / 0.15);
      else {
        const v = easeInOut((u - 0.15) / 0.85);
        dx = 120 * v; // a low hop to the right, never over the other row
        dy = -50 * 4 * v * (1 - v) + 30 * v;
        k = outScale(1, clamp01((u - 0.35) / 0.65));
      }
    }
    seg(objs, x + dx, cy, w, ROW2.h, kind, label, { sx: k, sy: k * (u > 0 && u < 0.15 ? 0.9 : 1), dy, size: 64 });
  }
  const lt = clamp01((u - 0.3) / 0.5);
  popLabel(L, `−${A.back}`, x + w / 2 + 34, cy + 34, lt, { size: 100, color: CHALK.pink });
}

function beat2(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, `Lùi về ${A.back} năm trước`, 270, g(p, 'title'), { size: 92, color: CHALK.pink });
  const b = g(p, 'bars');
  const rows = [[ROW2.dad, A_DAD_NOW, 'Bố', DAD, 'int', 'cut1'], [ROW2.kid, A_SON_NOW, 'Con', KID, 'dec', 'cut2']];
  rows.forEach(([y, age, name, color, kind, ck], i) => {
    const u = stagger(b, i, 2, 0.7);
    L.text(name, X2 - 26, y + 34, { size: 96, color, align: 'right', t: clamp01(u * 2) });
    const grow = spring(u, 2.6, 5.5);
    const body = (age - A.back) * K2;
    if (u > 0) seg(objs, X2, y, body * Math.max(0, grow), ROW2.h, kind, '', { sy: 1 + 0.08 * Math.sin(Math.PI * u) });
    if (u > 0.55) cutPiece(objs, L, X2 + body + 6, y, g(p, ck), str(A.back), kind, 40 + i);
  });
  L.text('Tổng khi đó:', CX, 1060, { size: 92, color: CHALK.white, align: 'center', t: g(p, 'lbl') });
  const xs = eq(L, [str(A.sum), { sym: 'minus' }, { s: str(A.back), color: CHALK.pink }, { sym: 'minus' },
    { s: str(A.back), color: CHALK.pink }, { s: '=', pad: 30 }, { s: str(A_SUM_THEN), color: CHALK.yellow }], CX, 1290,
  { size: 150, t: g(p, 'eq') });
  L.loop(xs[6], 1242, 92, 92, { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 77 });
}

// --- segment diagram board (beats 3 and 6) ------------------------------------------------
// rows: [{name, color, kind, n, y}]; unit px; x0 left edge; fills a label into every block
function diagram(objs, L, rows, { x0, unit, h, pk, label, fillT }) {
  rows.forEach((r) => {
    const u = g(pk, r.key);
    L.text(r.name, x0 - 26, r.y + 32, { size: 92, color: r.color, align: 'right', t: clamp01(u * 3) });
    for (let i = 0; i < r.n; i++) {
      const ui = stagger(u, i, r.n, 0.55);
      const fi = stagger(fillT, i + (r.offset || 0), r.total || r.n, 0.5);
      blockIn(objs, x0 + i * unit + 4, r.y, unit - 8, h, r.kind, fi > 0.25 ? label : '', ui,
        { size: 88 });
    }
  });
}

// beat 3: four years ago — con 1 phần, bố 4 phần, total 40
const D3 = { x0: 235, unit: 150, h: 140, kid: 450, dad: 640 };
function beat3(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, `${A.back} năm trước`, 250, g(p, 'title'), { size: 96, color: CHALK.pink });
  const fill = g(p, 'fill');
  diagram(objs, L, [
    { key: 'con', name: 'Con', color: KID, kind: 'dec', n: 1, y: D3.kid, offset: 0, total: 5 },
    { key: 'bo', name: 'Bố', color: DAD, kind: 'int', n: A.ratio, y: D3.dad, offset: 1, total: 5 },
  ], { x0: D3.x0, unit: D3.unit, h: D3.h, pk: p, label: str(A_SON_THEN), fillT: fill });
  const bx = D3.x0 + A.ratio * D3.unit + 24;
  const br = g(p, 'brace');
  braceV(L, bx, D3.kid - 70, D3.dad + 70, easeOutCubic(clamp01(br * 1.6)), { seed: 5 });
  popLabel(L, str(A_SUM_THEN), bx + 104, (D3.kid + D3.dad) / 2 + 36, clamp01(br * 2 - 0.6), { size: 110 });

  eq(L, ['1', '+', str(A.ratio), '=', { s: `${A_PARTS} phần`, color: CHALK.yellow }], CX, 860, { size: 112, t: g(p, 's1') });
  eq(L, [{ s: 'Con:', color: KID }, str(A_SUM_THEN), ':', str(A_PARTS), '=', { s: str(A_SON_THEN), color: CHALK.yellow }], CX, 1020,
    { size: 112, t: g(p, 's2') });
  eq(L, ['Bố:', str(A_SON_THEN), { sym: 'times' }, str(A.ratio), '=', { s: str(A_DAD_THEN), color: CHALK.yellow }], CX, 1180,
    { size: 112, t: g(p, 's3') });
  const xs = eq(L, ['Nay bố:', str(A_DAD_THEN), '+', str(A.back), { s: '=', pad: 56 }, { s: str(A_DAD_NOW), color: CHALK.yellow, size: 130 }],
    CX, 1350, { size: 112, t: g(p, 's4') });
  L.loop(xs[5], 1306, 90, 86, { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 91 });
  const sp = g(p, 'spark');
  if (sp > 0) sparks(L, xs[5], 1306, 110, 150, sp, { seed: 95 });
  const xk = eq(L, [{ s: 'Thử:', color: CHALK.pink }, str(A_DAD_NOW), '+', str(A_SON_NOW), '=', str(A.sum)], CX - 50, 1530,
    { size: 96, t: g(p, 's5') });
  mark(L, true, xk[5] + 120, 1495, g(p, 'ok'), { size: 72, seed: 97 });
}

// --- beat 4: problem B --------------------------------------------------------------------
function beat4(ctx, p) {
  const L = ctx.chalk(60);
  title(L, 'Sau mấy năm?', 280, g(p, 'title'), { size: 116, color: CHALK.yellow });
  eq(L, ['Mẹ:', { s: str(B.mom), color: CHALK.yellow }, 'tuổi'], CX, 560, { size: 130, t: g(p, 'r1') });
  eq(L, [{ s: 'Con:', color: KID }, { s: str(B.kid), color: CHALK.yellow }, 'tuổi'], CX, 750, { size: 130, t: g(p, 'r2') });
  const xs = eq(L, [{ s: 'Sau', color: CHALK.pink }, { s: '   ' }, { s: 'năm nữa:', color: CHALK.pink }], CX, 1000, { size: 104, t: g(p, 'r3a') });
  qMark(L, xs[1], 1004, g(p, 'q'), 130);
  eq(L, ['Mẹ', '=', str(B.ratio), { sym: 'times' }, { s: 'Con', color: KID }], CX, 1190, { size: 136, t: g(p, 'r3b') });
  const d = g(p, 'dots');
  thinkingDots(L, CX, 1420, d < 1 ? d : 0, { r: 16, gap: 80 });
}

// --- beat 5: both grow by 1 a year, the difference stays 28 -------------------------------
const K5 = 20;
const X5 = 250;
const ROW5 = { mom: 480, kid: 680, h: 140, brace: 776 };
const GROW = 3; // years shown growing (illustration only)

function beat5(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, 'Mẹ hơn con bao nhiêu?', 260, g(p, 'title'), { size: 88 });
  const b = g(p, 'bars');
  const gr = g(p, 'grow');
  // GROW steps; each step springs the bars one year longer and bumps the numbers
  let years = 0;
  let bump = 0;
  for (let i = 0; i < GROW; i++) {
    const u = clamp01(gr * GROW - i);
    years += spring(u, 3, 6) * (u > 0 ? 1 : 0);
    if (u > 0 && u < 1) bump = u;
  }
  const whole = Math.min(GROW, Math.floor(gr * GROW + 1e-6));
  const rows = [[ROW5.mom, B.mom, 'Mẹ', DAD, 'int'], [ROW5.kid, B.kid, 'Con', KID, 'dec']];
  rows.forEach(([y, age, name, color, kind], i) => {
    const u = stagger(b, i, 2, 0.7);
    L.text(name, X5 - 26, y + 34, { size: 96, color, align: 'right', t: clamp01(u * 2) });
    const w = (age + years) * K5 * Math.max(0, spring(u, 2.6, 5.5));
    const sq = 1 + 0.1 * Math.sin(Math.PI * bump);
    if (u > 0) seg(objs, X5, y, w, ROW5.h, kind, str(age + whole), { sy: sq, size: 72 });
    if (bump > 0) popLabel(L, '+1', X5 + w + 4, y - ROW5.h / 2 - 16, clamp01(bump * 2), { size: 80, color: CHALK.green });
  });
  // the gap between the ends: dashed guide from the kid's end, brace under it, "28"
  const ga = g(p, 'gap');
  const keep = g(p, 'keep');
  const x0 = X5 + (B.kid + years) * K5;
  const x1 = X5 + (B.mom + years) * K5;
  if (ga > 0) {
    L.dashed([x0, ROW5.mom - ROW5.h / 2], [x0, ROW5.brace], { color: CHALK.yellow, t: clamp01(ga * 2) });
    L.dashed([x1, ROW5.mom + ROW5.h / 2], [x1, ROW5.brace], { color: CHALK.yellow, t: clamp01(ga * 2) });
    braceH(L, x0, x1, ROW5.brace + 6, easeOutCubic(clamp01(ga * 2 - 0.5)), { seed: 9 });
    const pulse = keep < 1 ? keep : 0;
    popLabel(L, str(B_DIFF), (x0 + x1) / 2, ROW5.brace + 120, clamp01(ga * 2 - 1), { size: 110, pulse });
  }
  eq(L, [str(B.mom), { sym: 'minus' }, str(B.kid), '=', { s: str(B_DIFF), color: CHALK.yellow }], CX, 1060,
    { size: 150, t: g(p, 'eq') });
  if (gr > 0) {
    const step = clamp01(gr * GROW - Math.max(0, Math.ceil(gr * GROW) - 1));
    popLabel(L, `Sau ${Math.max(1, Math.ceil(gr * GROW - 1e-6))} năm`, CX, 1520, 1, { size: 104, color: CHALK.green, pulse: step < 1 ? step : 0 });
  }
  const st = g(p, 'stamp');
  if (st > 0) {
    const k = spring(st, 3, 6);
    L.text('Hiệu không đổi!', CX, 1300, { size: 116, color: CHALK.yellow, align: 'center', scale: k, t: clamp01(st * 2.5) });
    L.line([CX - 360, 1338], [CX + 360, 1338], { color: CHALK.yellow, width: 6, t: clamp01(st * 2 - 0.8), seed: 13 });
  }
}

// --- beat 6: when mom is 3 times the kid — mẹ 3 phần, con 1 phần, 2 phần = 28 ---------------
const D6 = { x0: 250, unit: 200, h: 140, mom: 540, kid: 720, brace: 446 };
function beat6(ctx, p) {
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  title(L, `Khi mẹ gấp ${B.ratio} lần con`, 230, g(p, 'title'), { size: 84, color: CHALK.pink });
  diagram(objs, L, [
    { key: 'me', name: 'Mẹ', color: DAD, kind: 'int', n: B.ratio, y: D6.mom, offset: 1, total: 4 },
    { key: 'con', name: 'Con', color: KID, kind: 'dec', n: 1, y: D6.kid, offset: 0, total: 4 },
  ], { x0: D6.x0, unit: D6.unit, h: D6.h, pk: p, label: str(B_KID_THEN), fillT: g(p, 'fill') });
  const br = g(p, 'brace');
  const bx0 = D6.x0 + D6.unit;
  const bx1 = D6.x0 + B.ratio * D6.unit;
  braceH(L, bx0 + 4, bx1 - 4, D6.brace, easeOutCubic(clamp01(br * 1.6)), { seed: 21, up: true });
  popLabel(L, str(B_DIFF), (bx0 + bx1) / 2, D6.brace - 48, clamp01(br * 2 - 0.6), { size: 110 });
  if (br > 0) L.dashed([bx0, D6.kid - D6.h / 2], [bx0, D6.brace], { color: CHALK.yellow, t: clamp01(br * 2) });

  eq(L, [str(B.ratio), { sym: 'minus' }, '1', '=', { s: `${B_PARTS} phần`, color: CHALK.yellow }], CX, 905, { size: 108, t: g(p, 's1') });
  eq(L, [{ s: 'Con:', color: KID }, str(B_DIFF), ':', str(B_PARTS), '=', { s: str(B_KID_THEN), color: CHALK.yellow }], CX, 1060,
    { size: 108, t: g(p, 's2') });
  const ans = `${B_YEARS} năm`;
  const xs = eq(L, [str(B_KID_THEN), { sym: 'minus' }, str(B.kid), { s: '=', pad: 40 }, { s: ans, color: CHALK.yellow, size: 124 }],
    CX - 20, 1210, { size: 108, t: g(p, 's3') });
  L.loop(xs[4], 1170, measure(ans, 124) / 2 + 44, 82, { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 99 });
  eq(L, [{ s: 'Mẹ:', color: CHALK.pink }, str(B.mom), '+', str(B_YEARS), '=', { s: str(B_MOM_THEN), color: CHALK.yellow }], CX, 1390,
    { size: 96, t: g(p, 's4') });
  const xc = eq(L, [{ s: str(B_MOM_THEN), color: CHALK.yellow }, '=', str(B.ratio), { sym: 'times' }, str(B_KID_THEN)], CX - 50, 1540,
    { size: 96, t: g(p, 's5') });
  mark(L, true, xc[4] + 130, 1505, g(p, 'ok'), { size: 72, seed: 123 });
}

// --- beat 7: the two tips -----------------------------------------------------------------
function beat7(ctx, p) {
  const L = ctx.chalk(60);
  title(L, 'Nhớ 2 mẹo', 300, g(p, 'title'), { size: 124, color: CHALK.yellow });
  L.line([CX - 260, 336], [CX + 260, 336], { width: 5, t: easeOutCubic(g(p, 'title')), seed: 3, color: CHALK.yellow });
  const t1 = g(p, 't1');
  L.text('1. Mỗi năm, ai cũng', 130, 580, { size: 92, t: clamp01(t1 * 1.8) });
  L.text('thêm 1 tuổi', 200, 700, { size: 92, color: CHALK.green, t: clamp01(t1 * 1.8 - 0.8) });
  popLabel(L, '+1', 800, 690, g(p, 'm1'), { size: 110, color: CHALK.green });
  const t2 = g(p, 't2');
  L.text('2. Hiệu số tuổi', 130, 940, { size: 92, t: clamp01(t2 * 1.8) });
  L.text('không bao giờ đổi', 200, 1060, { size: 92, color: CHALK.yellow, t: clamp01(t2 * 1.8 - 0.8) });
  mark(L, true, 960, 1020, g(p, 'm2'), { size: 76, seed: 131 });
  L.text('Thấy hay thì bình luận nhé!', CX, 1380, { size: 80, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
}

void lerp; void hopY; void hopSquash;
export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6, beat7 };
