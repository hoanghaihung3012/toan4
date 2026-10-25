// Static full-bleed board: CSS gradient (in board.css) + seeded eraser ghosts + grain.
import { rng } from './ease.js';
import { W, H } from './chalk.js';
import { THEME } from '../theme.js';

export function buildBoard(stage) {
  const sm = THEME.board.smudges;
  const board = document.createElement('div');
  board.className = 'board';
  const r = rng(sm.seed);
  const range = ([lo, hi]) => lo + r() * (hi - lo);
  for (let i = 0; i < sm.count; i++) {
    const cx = r() * W;
    const cy = r() * H;
    const rw = range(sm.width);
    const rh = range(sm.height);
    const a = range(sm.alpha);
    const s = document.createElement('div');
    s.className = 'smudge';
    Object.assign(s.style, {
      left: `${cx - rw}px`, top: `${cy - rh}px`, width: `${rw * 2}px`, height: `${rh * 2}px`,
      transform: `rotate(${(r() * 2 - 1) * sm.tilt}deg)`,
      background: `radial-gradient(closest-side, rgba(255,255,255,${a.toFixed(3)}), rgba(255,255,255,0))`,
    });
    board.appendChild(s);
  }
  const grain = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  grain.setAttribute('class', 'grain');
  grain.setAttribute('width', W);
  grain.setAttribute('height', H);
  grain.innerHTML = `<rect width="${W}" height="${H}" filter="url(#grain)"/>`;
  board.appendChild(grain);
  const vignette = document.createElement('div');
  vignette.className = 'vignette';
  board.appendChild(vignette);
  stage.prepend(board);
}
