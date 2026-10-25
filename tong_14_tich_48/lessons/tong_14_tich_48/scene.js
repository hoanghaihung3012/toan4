// Hai số có tổng 14, tích 48: tìm hiệu. Facts: lessons/tong_14_tich_48/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { clamp01, easeOutCubic, spring, pop } from '../../shared/web/js/ease.js';
import { TILE_H } from '../../shared/web/js/tiles.js';
import {
  g, dropPose, dust, sparks, mark, hopY, hopSquash, outScale, numTile, numW,
  thinkingDots, countdown, popLabel,
} from '../../shared/web/js/fx.js';

// --- facts (story.md F1, D1–D3), checked ----------------------------------------------
const MAIN = { S: 14, P: 48, a: 6, b: 8 }; // F1, D1
const CHAL = { S: 13, P: 40, a: 5, b: 8 }; // D3
// every pair (a, S − a) with a ≤ S − a; exactly one has product P
for (const q of [MAIN, CHAL]) {
  const hits = [];
  for (let a = 1; 2 * a <= q.S; a++) if (a * (q.S - a) === q.P) hits.push(a);
  console.assert(hits.length === 1 && hits[0] === q.a && q.S - q.a === q.b, `pair for ${q.S}, ${q.P}`);
}
const PAIRS = [1, 2, 3, 4, 5, 6].map((a) => [a, MAIN.S - a, a * (MAIN.S - a)]); // D2
console.assert(PAIRS.map((r) => r[2]).join() === '13,24,33,40,45,48', 'table products');
console.assert(MAIN.b - MAIN.a === 2 && CHAL.b - CHAL.a === 3, 'differences');

const str = String;
const SQ_COLOR = CHALK.white; // □ ↔ cream tile
const TRI_COLOR = CHALK.mint; // △ ↔ mint tile
const KIND = { sq: 'int', tri: 'dec' };

// --- an equation row with chalk shapes (□, △) that can be filled by wooden tiles ---------
// part: 'text' | {s, color, t} | {sym: 'times' | 'minus', t} | {shape: 'sq' | 'tri', show, fill, n, hop}
function shape(L, kind, cx, cy, side, k) {
  if (k <= 0) return;
  const s = side * k;
  const o = { width: Math.max(4, side * 0.06), seed: kind === 'sq' ? 11 : 13 };
  if (kind === 'sq') L.rect(cx - s * 0.45, cy - s * 0.45, cx + s * 0.45, cy + s * 0.45, { ...o, color: SQ_COLOR });
  else L.poly([[cx, cy - s * 0.55], [cx + s * 0.6, cy + s * 0.45], [cx - s * 0.6, cy + s * 0.45], [cx, cy - s * 0.55]],
    { ...o, color: TRI_COLOR, amp: 1.2 });
}

function eqRow(L, objs, parts, x0, y, { size = 140, t = 1, align = 'left', gap: gk = 0.24 } = {}) {
  const items = parts.map((q) => (typeof q === 'string' ? { s: q } : q));
  const gap = size * gk;
  const side = size * 0.82;
  const widths = items.map((q) => (q.shape ? side : q.sym ? size * 0.42 : measure(q.s, q.size || size)));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1) + items.reduce((a, q) => a + (q.pad || 0), 0);
  let x = align === 'center' ? x0 - total / 2 : x0;
  const cy = y - size * 0.32;
  const xs = [];
  items.forEach((q, i) => {
    const w = widths[i];
    const c = x + w / 2;
    xs.push(c);
    const ti = q.t !== undefined ? clamp01(q.t) : clamp01(t * items.length - i);
    const o = { color: q.color, width: size * 0.075, seed: 30 + i };
    if (q.shape) {
      const fill = q.fill || 0;
      shape(L, q.shape, c, cy, side, outScale(q.show, clamp01(fill / 0.3)));
      const f = clamp01((fill - 0.3) / 0.7);
      if (f > 0) {
        const k = pop(f);
        const tileScale = side / TILE_H * 1.05;
        numTile(objs, c, cy + hopY(q.hop || 0, 50), str(q.n), KIND[q.shape],
          { scale: k.scale * tileScale, squash: k.squash * hopSquash(q.hop || 0) });
      }
    } else if (ti > 0 && q.sym === 'times') {
      const r = size * 0.16;
      L.line([c - r, cy - r], [c + r, cy + r], { ...o, t: clamp01(ti * 2) });
      L.line([c + r, cy - r], [c - r, cy + r], { ...o, t: clamp01(ti * 2 - 1) });
    } else if (ti > 0 && q.sym === 'minus') {
      L.line([x + w * 0.1, cy], [x + w * 0.9, cy], { ...o, t: ti });
    } else if (ti > 0) {
      L.text(q.s, x, y, { size: q.size || size, color: q.color, t: ti, scale: q.scale ?? 1 });
    }
    x += w + gap + (q.pad || 0);
  });
  return xs;
}

// beat keys in order; a later beat's keys are 0 while an earlier beat plays
function at(keys, i, p) {
  const q = {};
  keys.slice(i + 1).flat().forEach((k) => { q[k] = 0; });
  return { ...q, ...p };
}
const SOLVE = ['fa', 'fb', 'h1', 'h2', 'ok1', 'ok2', 'pick', 'diff', 'loop', 'spark'];

// --- board A: □ + △ = S, □ × △ = P, Hiệu = ? (hook, solution, challenge) ---------------
const A = { cx: 552, x0: 140, titleY: 290, eq1: 650, eq2: 950, hieu: 1260, size: 165, hSize: 124, tickX: 995,
  dotsY: 1460, countY: 1450, cmtY: 420 };

function boardA(ctx, p, q, { title, challenge = false }) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  L.text(title, A.cx, A.titleY, { size: 100, align: 'center', t: g(p, 'title'),
    color: challenge ? CHALK.yellow : CHALK.white });

  const e1 = g(p, 'eq1');
  const e2 = g(p, 'eq2');
  const pick = g(p, 'pick');
  const hopB = pick < 1 ? clamp01(pick * 2) : 0; // "8 trừ 6": the △ tile hops, then the □ tile
  const hopA = pick < 1 ? clamp01(pick * 2 - 1) : 0;
  const live = (k) => (g(p, k) < 1 ? g(p, k) : 0);
  const sq = (e, h = 0) => ({ shape: 'sq', show: 'shapes' in p ? p.shapes : clamp01(e * 4), fill: g(p, 'fa'), n: q.a, hop: hopA || h });
  const tri = (e, h = 0) => ({ shape: 'tri', show: 'shapes' in p ? p.shapes : clamp01(e * 4 - 0.4), fill: g(p, 'fb'), n: q.b, hop: hopB || h });

  // the shapes stand alone first; the chalk writes on around them
  const textT = (e, i, n) => clamp01(e * n - i);
  const r1 = eqRow(L, objs, [sq(e1, live('h1')), { s: '+', t: textT(e1, 1, 3) }, tri(e1, clamp01(live('h1') * 1.25 - 0.25)), { s: '=', t: textT(e1, 2, 3) },
    { s: str(q.S), t: textT(e1, 2, 3) * 1.6, color: CHALK.yellow }], A.x0, A.eq1, { size: A.size });
  eqRow(L, objs, [sq(e2, live('h2')), { sym: 'times', t: textT(e2, 1, 3) }, tri(e2, clamp01(live('h2') * 1.25 - 0.25)), { s: '=', t: textT(e2, 2, 3) },
    { s: str(q.P), t: textT(e2, 2, 3) * 1.6, color: CHALK.yellow }], A.x0, A.eq2, { size: A.size });
  mark(L, true, A.tickX, A.eq1 - 50, g(p, 'ok1'), { size: 70, seed: 140 });
  mark(L, true, A.tickX, A.eq2 - 50, g(p, 'ok2'), { size: 70, seed: 150 });

  // Hiệu = ?  ->  Hiệu = b − a = d
  const h = g(p, 'hieu');
  const d = g(p, 'diff');
  const dParts = [str(q.b), { sym: 'minus' }, str(q.a), { s: '=', pad: 44 }, { s: str(q.b - q.a), color: CHALK.yellow }]
    .map((x, i) => ({ ...(typeof x === 'string' ? { s: x } : x), t: clamp01(d * 5 - i) }));
  const xs = eqRow(L, objs, [{ s: 'Hiệu', t: clamp01(h * 2) }, { s: '=', t: clamp01(h * 2 - 1) }, ...dParts],
    A.x0, A.hieu, { size: A.hSize, gap: 0.3 });
  // the yellow "?" springs in, then winds up and shrinks away when the working starts
  const qk = outScale('q' in p ? p.q : clamp01(h * 2 - 1), clamp01(d / 0.15)); // after a wipe the "?" comes back with its row
  if (qk > 0) L.text('?', xs[2] + 10, A.hieu, { size: 150, color: CHALK.yellow, align: 'center', scale: qk });
  const ax = xs[6];
  L.loop(ax, A.hieu - 40, 62, 78, { color: CHALK.yellow, width: 7, t: g(p, 'loop'), seed: 160 });
  const sp = g(p, 'spark');
  if (sp > 0) sparks(L, ax, A.hieu - 40, 96, 128, sp, { seed: 170 });
  void r1;

  const dots = g(p, 'dots');
  thinkingDots(L, A.cx, A.dotsY, dots < 1 ? dots : 0, { r: 16, gap: 80 });
  if (challenge) {
    const c = g(p, 'count');
    countdown(L, A.cx, A.countY, c < 1 ? c : 0, { size: 300 });
    L.text('Bình luận đáp án nhé!', A.cx, A.cmtY, { size: 80, color: CHALK.pink, align: 'center', t: g(p, 'cmt') });
  }
  void under;
}

const KEYS_1 = [['shapes', 'eq1', 'eq2', 'hieu', 'q', 'title', 'dots'], SOLVE];
const KEYS_4 = [['title', 'shapes', 'eq1', 'eq2', 'hieu', 'q', 'cmt', 'count'], SOLVE];
const beat1 = (ctx, p) => boardA(ctx, at(KEYS_1, 0, p), MAIN, { title: 'Tìm hiệu hai số' });
const beat3 = (ctx, p) => boardA(ctx, p, MAIN, { title: 'Tìm hiệu hai số' });
const beat4 = (ctx, p) => boardA(ctx, at(KEYS_4, 0, p), CHAL, { title: 'Đến lượt bạn!', challenge: true });
const beat5 = (ctx, p) => boardA(ctx, at(KEYS_4, 1, p), CHAL, { title: 'Đến lượt bạn!', challenge: true });

// --- board B: split 14 into two numbers and multiply, pair by pair ------------------------
const B = { recapY: 270, recapL: 290, recapR: 795, headY: 440, rows: PAIRS.map((_, i) => 600 + i * 192),
  ax: 200, xX: 335, bx: 485, eqX: 650, px: 712, markX: 985, tileS: 1.42 };

function boardB(ctx, p) {
  const under = ctx.chalk(50);
  const objs = ctx.objects();
  const L = ctx.chalk(60);

  // recap: □ + △ = 14 | □ × △ = 48; "14" pulses on "tách 14"
  const rc = g(p, 'recap');
  const split = g(p, 'split');
  const pulse = split < 1 ? 1 + 0.3 * Math.sin(Math.PI * split) : 1;
  const mini = (op) => [{ shape: 'sq', show: clamp01(rc * 4) }, op, { shape: 'tri', show: clamp01(rc * 4 - 0.5) }];
  eqRow(L, objs, [...mini('+'), '=', { s: str(MAIN.S), color: CHALK.yellow, scale: pulse }], B.recapL, B.recapY,
    { size: 96, t: rc, align: 'center' });
  eqRow(L, objs, [...mini({ sym: 'times' }), '=', { s: str(MAIN.P), color: CHALK.yellow }], B.recapR, B.recapY,
    { size: 96, t: clamp01(rc * 1.3 - 0.3), align: 'center' });

  // column heads: □ over the cream column, △ over the mint one, "tích" over the products
  const hd = g(p, 'head');
  shape(L, 'sq', B.ax, B.headY - 10, 96, spring(clamp01(hd * 2), 3, 6));
  shape(L, 'tri', B.bx, B.headY - 10, 96, spring(clamp01(hd * 2 - 0.4), 3, 6));
  L.text('tích', B.px, B.headY + 22, { size: 92, color: CHALK.yellow, t: clamp01(hd * 2 - 1) });
  L.line([B.ax - 100, B.headY + 62], [B.markX + 50, B.headY + 62], { width: 4, t: easeOutCubic(hd), seed: 210 });

  PAIRS.forEach(([a, b, prod], i) => {
    const y = B.rows[i];
    const last = i === PAIRS.length - 1;
    const ua = g(p, `a${i + 1}`);
    const ub = g(p, `b${i + 1}`);
    for (const [u, x, n, kind, seed] of [[ua, B.ax, a, 'int', 300], [ub, B.bx, b, 'dec', 320]]) {
      // a short hop-drop from just above its row (never through the rows above), squash, spring
      const pose = dropPose(u, y, 70);
      const k = pop(clamp01(u * 1.8));
      if (pose) numTile(objs, x, pose.y, str(n), kind, { scale: B.tileS * k.scale, squash: pose.squash });
      dust(under, x, y + (TILE_H * B.tileS) / 2, clamp01((u - 0.55) / 0.45), seed + i * 7, 1, numW(str(n).length) * 0.4);
    }
    // × between the tiles as soon as the second tile lands
    const xt = clamp01((ub - 0.5) / 0.3);
    if (xt > 0) {
      const r = 24;
      L.line([B.xX - r, y - r], [B.xX + r, y + r], { width: 9, t: clamp01(xt * 2), seed: 230 + i });
      L.line([B.xX + r, y - r], [B.xX - r, y + r], { width: 9, t: clamp01(xt * 2 - 1), seed: 240 + i });
    }
    const pt = g(p, `p${i + 1}`);
    L.text('=', B.eqX, y + 40, { size: 120, t: clamp01(pt * 3), align: 'center' });
    L.text(str(prod), B.px, y + 44, { size: last ? 136 : 124, color: last ? CHALK.yellow : CHALK.white, t: clamp01(pt * 1.5 - 0.3) });
    mark(L, last, B.markX, y, g(p, `m${i + 1}`), { size: last ? 84 : 66, seed: 260 + i * 9 });
  });
  const ly = B.rows[5];
  L.loop(510, ly, 405, 108, { color: CHALK.yellow, width: 7, t: g(p, 'loop6'), seed: 290 });
}

const beat2 = (ctx, p) => boardB(ctx, p);

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
