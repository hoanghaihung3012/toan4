// 4 mẹo tính nhẩm siêu tốc: hook 3 s đầu, mỗi mẹo một ví dụ ngắn, kết thúc bằng câu hỏi không đáp án.
// Facts: story.md. beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that
// the beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK } from '../../../shared/web/js/chalk.js';
import { THEME } from '../../../shared/web/theme.js';
import { clamp01, spring, easeOutCubic, easeInOut, stagger, lerp } from '../../../shared/web/js/ease.js';
import { row, flight } from '../../../shared/web/js/parts.js';
import { tile, TILE_W, TILE_H, GAP } from '../../../shared/web/js/tiles.js';
import { g, burst, countdown, popLabel, arc, numTile } from '../../../shared/web/js/fx.js';

// --- facts (story.md) -----------------------------------------------------------------------------
console.assert(43 * 11 === 473 && 4 + 3 === 7, 'tip 1: 43 × 11 = 4 | 4+3 | 3 = 473');
console.assert(35 * 35 === 1225 && 3 * 4 === 12, 'tip 2: 35 × 35 = (3 × 4) | 25 = 1225');
console.assert(24 * 9 === 24 * 10 - 24 && 240 - 24 === 216, 'tip 3: 24 × 9 = 240 − 24 = 216');
console.assert(85 / 5 === 85 * 2 / 10 && 85 * 2 === 170 && 170 / 10 === 17, 'tip 4: 85 : 5 = 170 : 10 = 17');
console.assert(52 * 11 === 572, 'challenge: 52 × 11 (answer not shown)');

export const TEXT = {
  hook: '4 mẹo tính nhẩm', sec: '2 giây',
  t1: 'Mẹo 1/4: nhân với 11', t2: 'Mẹo 2/4: số tận cùng là 5', t3: 'Mẹo 3/4: nhân với 9', t4: 'Mẹo 4/4: chia cho 5',
  turn: 'Đến lượt bạn!', cmt: 'Bình luận đáp án nhé!',
};

const T = THEME.layout.title;
const CX = 540;
const TS = 84;
const bump = (u, a = 0.14) => 1 + a * Math.sin(Math.PI * clamp01(u)) * Math.exp(-1.5 * clamp01(u));
const live = (v) => (v > 0 && v < 1 ? v : 0);

function title(L, text, t, color) {
  const tw = L.text(text, T.x, T.y, { size: TS, t, color });
  L.line([T.x, T.y + 26], [T.x + tw, T.y + 26], { width: 5, t, seed: 5, color });
}

// a row of wooden tiles and drawn symbols, centred on CX, popping in one by one with u.
// cell: { ch, kind?, scale? } | { sym: 'times' | 'colon' | 'eq' }; returns each cell's centre x
function exprTiles(objs, L, cells, y, scale, u) {
  const gap = GAP * scale;
  const ws = cells.map((c) => (c.sym ? TILE_W * scale : TILE_W * scale));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (cells.length - 1);
  let x = CX - total / 2;
  return cells.map((c, i) => {
    const cx = x + ws[i] / 2;
    x += ws[i] + gap;
    const k = spring(stagger(u, i, cells.length, 0.4), 3, 6);
    if (k <= 0) return cx;
    if (!c.sym) {
      tile(objs, cx, y, c.ch, c.kind || 'int', { scale: scale * k * (c.scale || 1) });
      return cx;
    }
    const r = TILE_H * scale * 0.2 * k, o = { width: 9, seed: 300 + i };
    if (c.sym === 'times') {
      L.line([cx - r, y - r], [cx + r, y + r], o);
      L.line([cx + r, y - r], [cx - r, y + r], o);
    } else if (c.sym === 'eq') {
      L.line([cx - r * 1.2, y - r * 0.5], [cx + r * 1.2, y - r * 0.5], o);
      L.line([cx - r * 1.2, y + r * 0.5], [cx + r * 1.2, y + r * 0.5], o);
    } else {
      L.dot(cx, y - r * 0.8, 9 * k, {});
      L.dot(cx, y + r * 0.8, 9 * k, {});
    }
    return cx;
  });
}

// teacher's circle around a result of `digits` digits written at size on baseline y
function ring(L, cx, y, size, digits, t, seed) {
  if (t <= 0) return;
  L.loop(cx, y - size * 0.33, digits * size * 0.3 + 45, size * 0.6, { color: Y, width: 9, t: easeOutCubic(t), seed });
  burst(L, cx, y - size * 0.33, size * 1.2, clamp01(t * 1.3 - 0.3), { seed: seed + 5 });
}

const D = (ch) => ({ ch });
const S = (sym) => ({ sym });
const Y = CHALK.yellow, P = CHALK.pink;

// --- beat 1: the hook -----------------------------------------------------------------------------
function beat1(ctx, p) {
  const L = ctx.chalk(60);
  title(L, TEXT.hook, g(p, 'title'));
  row(L, ['43', { sym: 'times' }, '11'], CX, 720, { size: 330, t: easeOutCubic(g(p, 'expr') * 1.6), seed: 10, gap: 0.3 });
  // stopwatch
  const cy = 1150, r = 215;
  const w = g(p, 'watch');
  L.loop(CX, cy, r, r, { color: CHALK.white, width: 13, t: easeOutCubic(w), seed: 20 });
  if (w > 0.6) {
    L.line([CX, cy - r], [CX, cy - r - 40], { width: 13, seed: 21 });
    L.line([CX - 48, cy - r - 46], [CX + 48, cy - r - 46], { width: 16, seed: 22 });
    L.line([CX + r * 0.74, cy - r * 0.74], [CX + r * 0.9, cy - r * 0.9], { width: 11, seed: 23 });
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      L.line([CX + dx * r * 0.78, cy + dy * r * 0.78], [CX + dx * r * 0.9, cy + dy * r * 0.9], { width: 11, seed: 24 });
    }
  }
  const h = easeInOut(g(p, 'hand'));
  if (w > 0.8 || g(p, 'hand') > 0) {
    const a = -Math.PI / 2 + 2 * Math.PI * h;
    L.line([CX, cy], [CX + r * 0.7 * Math.cos(a), cy + r * 0.7 * Math.sin(a)], { color: Y, width: 15, seed: 25 });
    L.dot(CX, cy, 16, { color: Y });
  }
  popLabel(L, TEXT.sec, CX, 1560, g(p, 'lab'), { size: 160, color: Y });
  burst(L, CX, 1500, 300, clamp01(g(p, 'lab') * 1.3 - 0.3), { seed: 30 });
}

// --- beat 2: tip 1, × 11 --------------------------------------------------------------------------
function beat2(ctx, p) {
  const L0 = ctx.chalk(60);
  title(L0, TEXT.t1, g(p, 'title'));
  row(L0, ['43', { sym: 'times' }, '11'], CX, 520, { size: 170, t: g(p, 'expr'), seed: 40, gap: 0.3 });
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const Yt = 800, sc = 2.2, XL = 250, XR = 830;
  const sp = spring(g(p, 'split'), 3, 6);
  const put = g(p, 'put');
  tile(objs, XL, Yt, '4', 'int', { scale: sc * sp });
  tile(objs, XR, Yt, '3', 'int', { scale: sc * sp });
  if (sp > 0 && put < 1) tile(objs, CX, Yt, '', 'blank', { scale: sc * sp });
  const sum = g(p, 'sum');
  const ry = 1200, rs = 130;
  const rx = row(L, ['4', '+', '3', '=', { s: '7', color: Y }], CX, ry, { size: rs, t: clamp01((sum - 0.35) / 0.65), seed: 50 });
  arc(L, [XL, Yt + 130], [rx[0] - 25, ry - 150], 50, clamp01(sum * 2.5), { width: 9, seed: 60 });
  arc(L, [XR, Yt + 130], [rx[2] + 25, ry - 150], -50, clamp01(sum * 2.5), { width: 9, seed: 70 });
  if (put > 0) {
    const f = flight([rx[4], ry - 40], [CX, Yt], put, 110);
    tile(ctx.objects(), f.x, f.y, '7', 'dec', { scale: lerp(0.9, sc, f.v), squash: f.squash });
  }
  const R = row(L, ['43', { sym: 'times' }, '11', '=', { s: '473', color: Y }], CX, 1500, { size: 130, t: g(p, 'res'), seed: 80, gap: 0.62 });
  ring(L, R[4], 1500, 130, 3, g(p, 'loop'), 90);
}

// --- beat 3: tip 2, a number ending in 5, squared -------------------------------------------------
function beat3(ctx, p) {
  const L0 = ctx.chalk(60);
  title(L0, TEXT.t2, g(p, 'title'));
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const pick = g(p, 'pick');
  const three = { ch: '3', kind: pick > 0.3 ? 'dec' : 'int', scale: bump(live(pick), 0.25) };
  exprTiles(objs, L, [three, D('5'), S('times'), D('3'), D('5')], 600, 1.65, g(p, 'expr'));
  const mx = row(L, [{ s: '3', color: Y }, { sym: 'times' }, { s: '4', color: P }, '=', { s: '12', color: Y }], CX, 1010,
    { size: 130, t: g(p, 'mul'), seed: 100, gap: 0.3 });
  const put = g(p, 'put');
  if (put > 0) {
    const sc = 1.9, by = 1270;
    const f = flight([mx[4], 970], [CX - 150, by], clamp01(put * 1.7), 80);
    numTile(ctx.objects(), f.x, f.y, '12', 'dec', { scale: lerp(0.9, sc, f.v), squash: f.squash, digits: 2 });
    const u = clamp01((put - 0.5) * 2);
    numTile(ctx.objects(), CX + 150, by, '25', 'int', { scale: sc * spring(u, 3, 6), squash: 1, digits: 2 });
  }
  const R = row(L, ['35', { sym: 'times' }, '35', '=', { s: '1225', color: Y }], CX, 1540, { size: 120, t: g(p, 'res'), seed: 110, gap: 0.62 });
  ring(L, R[4], 1540, 120, 4, g(p, 'loop'), 120);
}

// --- beat 4: tip 3, × 9 ---------------------------------------------------------------------------
function beat4(ctx, p) {
  const L0 = ctx.chalk(60);
  title(L0, TEXT.t3, g(p, 'title'));
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const r1 = g(p, 'r1');
  const nine = { ch: '9', kind: r1 > 0 ? 'dec' : 'int', scale: bump(live(clamp01(r1 * 3)), 0.25) };
  exprTiles(objs, L, [D('2'), D('4'), S('times'), nine], 620, 1.9, g(p, 'expr'));
  row(L, ['9', '=', { s: '10', color: Y }, { sym: 'minus' }, { s: '1', color: P }], CX, 980, { size: 120, t: r1, seed: 130 });
  row(L, ['24', { sym: 'times' }, { s: '10', color: Y }, '=', '240'], CX, 1220, { size: 120, t: g(p, 'r2'), seed: 140, gap: 0.3 });
  const R = row(L, ['240', { sym: 'minus' }, { s: '24', color: P }, '=', { s: '216', color: Y }], CX, 1460, { size: 120, t: g(p, 'r3'), seed: 150, gap: 0.62 });
  ring(L, R[4], 1460, 120, 3, g(p, 'loop'), 160);
}

// --- beat 5: tip 4, ÷ 5 ---------------------------------------------------------------------------
function beat5(ctx, p) {
  const L0 = ctx.chalk(60);
  title(L0, TEXT.t4, g(p, 'title'));
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  exprTiles(objs, L, [D('8'), D('5'), S('colon'), D('5')], 640, 1.9, g(p, 'expr'));
  row(L, ['85', { sym: 'times' }, { s: '2', color: Y }, '=', '170'], CX, 1050, { size: 130, t: g(p, 'r1'), seed: 170, gap: 0.3 });
  const R = row(L, ['170', ':', { s: '10', color: P }, '=', { s: '17', color: Y }], CX, 1360, { size: 130, t: g(p, 'r2'), seed: 180, gap: 0.62 });
  ring(L, R[4], 1360, 130, 2, g(p, 'loop'), 190);
}

// --- beat 6: the question (no answer) -------------------------------------------------------------
function beat6(ctx, p) {
  const L0 = ctx.chalk(60);
  title(L0, TEXT.turn, g(p, 'title'), Y);
  const objs = ctx.objects();
  const L = ctx.chalk(60);
  const q = g(p, 'q');
  exprTiles(objs, L, [D('5'), D('2'), S('times'), D('1'), D('1'), S('eq'),
    { ch: '?', kind: 'blank', scale: 1 + 0.15 * Math.sin(Math.PI * clamp01(q * 2)) }], 760, 1.25, g(p, 'expr'));
  countdown(L, CX, 1200, g(p, 'count'), { size: 400 });
  row(L, [TEXT.cmt], CX, 1540, { size: 96, t: g(p, 'cmt'), seed: 200 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5, beat6 };
