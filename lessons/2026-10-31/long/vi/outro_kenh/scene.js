// 16:9 end card for "Học cùng Phượng", drawn in the shared chalkboard style.
import { CHALK } from '../../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../../shared/web/theme.js';
import { clamp01, easeInQuad, easeOutCubic, spring, stagger, pop } from '../../../../../shared/web/js/ease.js';
import { g, sparks } from '../../../../../shared/web/js/fx.js';
import { tile, TILE_W, TILE_H, GAP } from '../../../../../shared/web/js/tiles.js';

const THANKS = 'Cảm ơn các bạn!';
const SUBSCRIBE = 'Đăng ký kênh';
const NAME = ['HỌC', 'CÙNG', 'PHƯỢNG'];

function bell(L, t, idle) {
  const u = easeOutCubic(t);
  if (!u) return;
  const x = 1570;
  const y = 410;
  const swing = 0.08 * Math.sin(idle * Math.PI * 4);
  const points = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (Math.PI * i) / 24;
    const px = x + 84 * Math.cos(a);
    const py = y + 100 + 82 * Math.sin(a);
    const dx = px - x;
    points.push([x + dx * Math.cos(swing) - (py - y) * Math.sin(swing),
      y + dx * Math.sin(swing) + (py - y) * Math.cos(swing)]);
  }
  L.poly(points, { color: CHALK.yellow, width: 9, t: u, seed: 701, amp: 1.1 });
  L.line([x - 85, y + 101], [x + 85, y + 101], { color: CHALK.yellow, width: 10, t: u, seed: 702 });
  L.line([x - 62, y + 116], [x + 62, y + 116], { color: CHALK.yellow, width: 6, t: u, seed: 703 });
  L.line([x, y - 10], [x, y + 2], { color: CHALK.yellow, width: 8, t: u, seed: 704 });
  L.dot(x, y - 14, 11, { color: CHALK.yellow, t: u });
  L.line([x - 17, y + 127], [x + 17, y + 127], { color: CHALK.yellow, width: 8, t: u, seed: 705 });
  sparks(L, x, y + 45, 122, 160, clamp01((u - 0.35) / 0.65),
    { n: 8, color: CHALK.blue, seed: 710 });
}

function scene(ctx, p) {
  const L = ctx.chalk(60);
  const idle = g(p, 'idle');
  bell(L, g(p, 'bell'), idle);

  L.text(THANKS, 900, 285, {
    size: 106, align: 'center', color: CHALK.white,
    t: easeOutCubic(g(p, 'thanks')), scale: spring(g(p, 'thanks'), 3.2, 6),
  });
  L.text(SUBSCRIBE, 900, 525, {
    size: 100, align: 'center', color: CHALK.yellow,
    t: easeOutCubic(g(p, 'subscribe')), scale: spring(g(p, 'subscribe'), 3.2, 6),
  });

  const objs = ctx.objects();
  const total = NAME.reduce((n, word) => n + word.length, 0);
  const pitch = TILE_W + GAP;
  const wordGap = 48;
  const width = total * pitch - GAP + (NAME.length - 1) * wordGap;
  let x = (THEME.canvas.width - width) / 2 + TILE_W / 2;
  const rowY = 760;
  const groups = NAME.map((word) => {
    const group = { word, x };
    x += word.length * pitch - GAP + wordGap;
    return group;
  });

  groups.forEach(({ word, x: startX }, groupIndex) => {
    [...word].forEach((letter, i) => {
      const progress = g(p, `name${groupIndex + 1}`);
      const u = stagger(progress, i, word.length, 0.5);
      if (u <= 0) return;
      const fall = easeInQuad(clamp01(u / 0.72));
      const settle = spring(u, 3.2, 6);
      const y = rowY - 170 * (1 - fall);
      const scale = 0.72 + 0.28 * settle;
      const squash = 1 - 0.12 * Math.sin(Math.PI * clamp01((u - 0.35) / 0.65));
      const atX = startX + i * pitch;
      tile(objs, atX, y, letter, groupIndex === 2 ? 'dec' : 'int', { scale, squash });
    });
  });

  const underline = easeOutCubic(g(p, 'underline'));
  if (underline > 0) {
    const x0 = (THEME.canvas.width - width) / 2 - 20;
    const x1 = x0 + width + 40;
    L.poly([[x0, rowY + TILE_H * 0.65], [x0 + (x1 - x0) * 0.36, rowY + TILE_H * 0.65 + 7],
      [x0 + (x1 - x0) * 0.68, rowY + TILE_H * 0.65 - 6], [x1, rowY + TILE_H * 0.65 + 3]],
    { color: CHALK.yellow, width: 8, t: underline, seed: 740, amp: 0.8 });
    sparks(L, x1 + 25, rowY, 20, 52, clamp01((underline - 0.3) / 0.7),
      { n: 6, color: CHALK.pink, seed: 750 });
    sparks(L, x0 - 25, rowY, 20, 52, clamp01((underline - 0.45) / 0.55),
      { n: 6, color: CHALK.pink, seed: 760 });
  }
}

export const scenes = { outro: scene };
