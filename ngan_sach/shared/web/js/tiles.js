// Wooden digit tiles (DOM + CSS) and the place-value grid.
// Kinds: "int" (cream, whole part), "dec" (mint, decimal part), "comma" (red peg),
// "blank" (dashed slot for a padded zero). Grid columns: 0 = comma, -1, -2, ... = units,
// tens, ...; 1, 2, ... = tenths, hundredths.
import { CHALK, measure } from './chalk.js';
import { clamp01, easeOutCubic } from './ease.js';
import { THEME } from '../theme.js';

export const TILE_W = THEME.tiles.width;
export const TILE_H = THEME.tiles.height;
export const COMMA_W = THEME.tiles.commaWidth;
export const GAP = THEME.tiles.gap;

export function tile(parent, x, y, ch, kind = 'int', { scale = 1, squash = 1, rot = 0 } = {}) {
  if (scale <= 0) return null;
  const w = kind === 'comma' ? COMMA_W : TILE_W;
  const d = document.createElement('div');
  d.className = `tile ${kind}`;
  d.style.left = `${x - w / 2}px`;
  d.style.top = `${y - TILE_H / 2}px`;
  d.style.width = `${w}px`;
  d.style.height = `${TILE_H}px`;
  d.style.transform = `rotate(${rot}deg) scale(${scale / Math.sqrt(squash)}, ${scale * squash})`;
  if (ch) {
    const s = document.createElement('span');
    s.textContent = ch;
    d.appendChild(s);
  }
  parent.appendChild(d);
  return d;
}

export class Grid {
  constructor(commaX, nInt = 4, nDec = 3) {
    Object.assign(this, { cx: commaX, nInt, nDec });
  }
  x(col) {
    if (col === 0) return this.cx;
    const step = TILE_W + GAP;
    const first = COMMA_W / 2 + GAP + TILE_W / 2;
    return this.cx + Math.sign(col) * (first + (Math.abs(col) - 1) * step);
  }
  left() { return this.x(-this.nInt) - TILE_W / 2 - GAP / 2; }
  right() { return this.x(this.nDec) + TILE_W / 2 + GAP / 2; }
}

// '9413,788' -> [{col, ch, kind}] (decimal comma)
export function numberCols(s) {
  const [whole, dec = ''] = s.split(',');
  const out = [...whole].map((ch, i) => ({ col: -(whole.length - i), ch, kind: 'int' }));
  if (s.includes(',')) {
    out.push({ col: 0, ch: ',', kind: 'comma' });
    [...dec].forEach((ch, i) => out.push({ col: i + 1, ch, kind: 'dec' }));
  }
  return out;
}

// loose (not yet aligned) layout of a number starting at xLeft: centres per entry
export function looseLayout(xLeft, s) {
  let x = xLeft;
  return numberCols(s).map((c) => {
    const w = c.kind === 'comma' ? COMMA_W : TILE_W;
    const cx = x + w / 2;
    x += w + GAP;
    return { ...c, x: cx };
  });
}

// faint chalk column guides; the comma column is a dashed red line
export function columnLines(layer, grid, y0, y1, t = 1) {
  const step = TILE_W + GAP;
  const xs = new Set();
  for (let k = 1; k <= grid.nInt; k++) xs.add(+(grid.x(-k) - step / 2).toFixed(1));
  for (let k = 1; k <= grid.nDec; k++) xs.add(+(grid.x(k) + step / 2).toFixed(1));
  xs.add(+(grid.x(-1) + TILE_W / 2 + GAP / 2).toFixed(1));
  xs.add(+(grid.x(1) - TILE_W / 2 - GAP / 2).toFixed(1));
  [...xs].sort((a, b) => a - b).forEach((x, i) => {
    layer.line([x, y0], [x, y1], { color: CHALK.white, width: 2.5, t, seed: 40 + i });
  });
  layer.dashed([grid.cx, y0], [grid.cx, y1], { t });
}

// per-entry progress of a right-to-left write-on (column arithmetic order)
export function rtlProgress(s, t, index) {
  const n = numberCols(s).length;
  return clamp01(t * n - index);
}

// result in chalk, digit by digit from the right; the comma peg is drawn separately
export function chalkNumber(layer, grid, s, y, t = 1, size = THEME.layout.columns.resultSize) {
  const cols = numberCols(s).reverse();
  cols.forEach((c, i) => {
    if (c.kind === 'comma') return;
    const ti = easeOutCubic(rtlProgress(s, t, i));
    if (ti <= 0) return;
    layer.text(c.ch, grid.x(c.col), y, {
      size, color: c.kind === 'int' ? CHALK.white : CHALK.mint, t: ti, align: 'center',
    });
  });
}

// step badge: chalk circle with a number, then the label; yellow when active
export function badge(layer, x, y, n, label, { active = false, t = 1, size = THEME.layout.steps.size } = {}) {
  const color = active ? CHALK.yellow : CHALK.white;
  const r = size * 0.62;
  layer.loop(x, y - size * 0.32, r, r, { color, width: 5, t, seed: 60 + n });
  layer.text(String(n), x, y, { size, color, t, align: 'center' });
  if (label) layer.text(label, x + r + 22, y, { size, color, t });
}

export { measure };
