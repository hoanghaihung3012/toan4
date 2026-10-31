// Intro of the channel "Học cùng Phượng" (about 10 s), played before every clip.
// One scene for both canvases: the 9:16 Short (intro_kenh) and the 16:9 long video (intro_kenh_ngang
// imports this file). Tiles drop in as the voice says "Học", "cùng", "Phượng"; at the end the eraser
// wipes the board clean, so the clip that follows starts on an empty board.
import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, easeInQuad, easeOutCubic, spring, stagger, pop } from '../../../../../shared/web/js/ease.js';
import { g, dropPose, dust, hopY, hopSquash, burst, sparks } from '../../../../../shared/web/js/fx.js';
import { tile, TILE_W, TILE_H, GAP } from '../../../../../shared/web/js/tiles.js';

export const TEXT = {
  hello: 'Xin chào!',
  slogan: ['Cùng học toán', 'thật vui nhé!'],
  sloganWide: 'Cùng học toán thật vui nhé!',
  words: ['HỌC', 'CÙNG', 'PHƯỢNG'],
};

const WHITE = CHALK.white;
const YELLOW = CHALK.yellow;
const SYMBOLS = [
  { sym: '+', color: CHALK.pink },
  { sym: '÷', color: CHALK.blue },
  { sym: '×', color: CHALK.green },
  { sym: '−', color: YELLOW },
  { sym: '=', color: WHITE },
  { sym: '+', color: CHALK.blue },
];

// board places, in canvas pixels; portrait stays inside THEME.safeArea.content (70, 145, 1035, 1600)
function layout() {
  const { width: W, height: H } = THEME.canvas;
  if (W > H) {
    const s = 1.02;
    const word = (n) => n * (TILE_W + GAP) * s - GAP * s;
    const gapW = 0.7 * (TILE_W + GAP) * s;
    const total = TEXT.words.reduce((a, w) => a + word(w.length), 0) + gapW * 2;
    let x = W / 2 - total / 2;
    const rows = TEXT.words.map((w) => {
      const row = { x0: x + (TILE_W * s) / 2, y: 500, n: w.length };
      x += word(w.length) + gapW;
      return row;
    });
    return {
      wide: true, scale: s, rows, hello: { x: W / 2, y: 215, size: 108 },
      under: { x0: rows[2].x0 - 20, x1: rows[2].x0 + 6 * (TILE_W + GAP) * s + 20, y: 500 + TILE_H * s * 0.5 + 38 },
      slogan: [{ s: TEXT.sloganWide, x: W / 2, y: 820, size: 82 }],
      symbols: [[200, 200], [1730, 240], [240, 860], [1690, 880], [960, 990], [110, 680]],
    };
  }
  const s = 1.2;
  const pitch = (TILE_W + GAP) * s;
  const rowOf = (w, y) => ({ x0: 552 - ((w - 1) * pitch) / 2, y, n: w });
  const rows = [rowOf(3, 650), rowOf(4, 825), rowOf(7, 1000)];
  return {
    wide: false, scale: s, rows, hello: { x: 552, y: 380, size: 112 },
    under: { x0: rows[2].x0 - 40, x1: rows[2].x0 + 6 * pitch + 40, y: 1000 + TILE_H * s * 0.5 + 44 },
    slogan: [{ s: TEXT.slogan[0], x: 552, y: 1270, size: 84 }, { s: TEXT.slogan[1], x: 552, y: 1380, size: 84 }],
    symbols: [[150, 300], [960, 420], [140, 1230], [960, 1210], [552, 1520], [900, 1500]],
  };
}

// a chalk maths sign of radius r centred at (x, y)
function sign(L, ch, x, y, r, color, t, seed) {
  const o = { color, width: 11, t, seed };
  if (ch === '+') {
    L.line([x - r, y], [x + r, y], o);
    L.line([x, y - r], [x, y + r], { ...o, seed: seed + 1 });
  } else if (ch === '−') {
    L.line([x - r, y], [x + r, y], o);
  } else if (ch === '×') {
    L.line([x - r * 0.8, y - r * 0.8], [x + r * 0.8, y + r * 0.8], o);
    L.line([x + r * 0.8, y - r * 0.8], [x - r * 0.8, y + r * 0.8], { ...o, seed: seed + 1 });
  } else if (ch === '÷') {
    L.line([x - r, y], [x + r, y], o);
    L.dot(x, y - r * 0.62, 8, { color, t });
    L.dot(x, y + r * 0.62, 8, { color, t });
  } else {
    L.line([x - r, y - r * 0.35], [x + r, y - r * 0.35], o);
    L.line([x - r, y + r * 0.35], [x + r, y + r * 0.35], { ...o, seed: seed + 1 });
  }
}

function board(ctx, p) {
  const a = layout();
  const idle = g(p, 'idle');
  const L = ctx.chalk(60);

  // maths signs pop in around the board, then float slowly (whole cycles, so the key pose is at rest)
  SYMBOLS.forEach(({ sym, color }, i) => {
    const u = stagger(g(p, 'signs'), i, SYMBOLS.length, 0.4);
    const k = pop(u).scale;
    if (k <= 0) return;
    const [x, y] = a.symbols[i];
    const bob = 14 * Math.sin(2 * Math.PI * (idle * 2 + i / SYMBOLS.length));
    sign(L, sym, x, y + bob, (a.wide ? 58 : 52) * k, color, clamp01(u * 2.2), 40 + i * 5);
  });

  // greeting, written with a bouncy settle
  const hello = g(p, 'hello');
  const hw = L.text(TEXT.hello, a.hello.x, a.hello.y,
    { size: a.hello.size, color: YELLOW, align: 'center', t: easeOutCubic(hello * 1.6), scale: spring(hello, 3.2, 6) });
  const hu = easeOutCubic(g(p, 'hu'));
  if (hu > 0) {
    const y = a.hello.y + 34;
    L.poly([[a.hello.x - hw / 2, y], [a.hello.x - hw / 6, y + 8], [a.hello.x + hw / 6, y - 6], [a.hello.x + hw / 2, y + 4]],
      { color: CHALK.pink, width: 8, t: hu, seed: 61, amp: 0.8 });
  }

  // tiles: drop in word by word, then a hop wave runs along the whole title
  const objs = ctx.objects();
  const L2 = ctx.chalk(60);
  const total = a.rows.reduce((n, r) => n + r.n, 0);
  const pitch = (TILE_W + GAP) * a.scale;
  const wave = g(p, 'wave');
  let index = 0;
  a.rows.forEach((row, w) => {
    const prog = g(p, `w${w + 1}`);
    [...TEXT.words[w]].forEach((ch, i) => {
      const u = stagger(prog, i, row.n, 0.5);
      const x = row.x0 + i * pitch;
      const hopU = clamp01(stagger(wave, index, total, 0.35));
      // stamped onto the board: a short drop while shrinking from near the viewer, so rows never cross
      const pose = dropPose(u, row.y, 110);
      index += 1;
      if (!pose) return;
      const near = 1 + 0.45 * (1 - easeInQuad(clamp01(u / 0.55)));
      const y = pose.y + hopY(hopU, 52);
      const squash = pose.squash * hopSquash(hopU);
      tile(objs, x, y, ch, w === 2 ? 'dec' : 'int', { scale: a.scale * near, squash });
      dust(L2, x, row.y + TILE_H * a.scale * 0.5, clamp01((u - 0.55) / 0.45), 100 + w * 31 + i * 7, a.scale);
    });
  });

  // yellow swoosh under the name, then sparks
  const L3 = ctx.chalk(60);
  const under = g(p, 'under');
  if (under > 0) {
    const { x0, x1, y } = a.under;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const f = i / 40;
      pts.push([x0 + (x1 - x0) * f, y + 9 * Math.sin(f * Math.PI * 3)]);
    }
    L3.poly(pts, { color: YELLOW, width: 9, t: easeOutCubic(under), seed: 77, amp: 0.8 });
    const cx = (x0 + x1) / 2;
    const cy = a.rows[2].y;
    const edge = a.wide ? 40 : 38;
    sparks(L3, x1 + edge, cy, 14, 38, clamp01((under - 0.3) / 0.5), { n: 6, seed: 300 });
    sparks(L3, x0 - edge, cy, 14, 38, clamp01((under - 0.45) / 0.5), { n: 6, seed: 320, color: CHALK.pink });
    burst(L3, cx, cy, 300, clamp01((under - 0.1) / 0.9), { n: 12, seed: 340 });
  }

  // slogan
  a.slogan.forEach((line, i) => {
    const t = clamp01(g(p, 'slogan') * a.slogan.length - i);
    L3.text(line.s, line.x, line.y, { size: line.size, color: WHITE, align: 'center', t: easeOutCubic(t), scale: spring(t, 3.2, 6) });
  });
}

export const scenes = {
  main: board,
  // the eraser (player wipe) clears `main`; nothing is left on the board
  clear() {},
};
