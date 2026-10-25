// Felt board eraser and the wipe that motivates every board change.
import { W, H } from './chalk.js';
import { clamp01, easeInOut } from './ease.js';

export function drawEraser(parent, { x, y, angle = 0, squash = 1 }) {
  const e = document.createElement('div');
  e.className = 'eraser';
  e.style.left = `${x - 95}px`;
  e.style.top = `${y - 31}px`;
  e.style.transform = `rotate(${angle}deg) scale(${1 / Math.sqrt(squash)}, ${squash})`;
  e.innerHTML = '<div class="felt"></div><div class="back"></div>';
  parent.appendChild(e);
}

// Eraser pose for a left-to-right wipe across a horizontal band [y0, y1].
// Anticipation: pulls back first; scrubs up and down (cycles) while advancing.
// Returns the pose and clearX: everything left of clearX is already erased.
export function wipePose(prog, [y0, y1], cycles = 2) {
  prog = clamp01(prog);
  const back = prog < 0.1 ? -40 * Math.sin((Math.PI * prog) / 0.1) : 0;
  const u = easeInOut(clamp01((prog - 0.1) / 0.9));
  const x = 70 + (W + 160) * u + back;
  const mid = (y0 + y1) / 2;
  const amp = Math.max(0, (y1 - y0) / 2 - 30);
  const phase = prog * cycles * 2 * Math.PI;
  const y = mid - amp * Math.cos(phase);
  // tilt into the stroke, squash at the turns
  const angle = -10 * Math.sin(phase);
  const squash = 1 - 0.12 * Math.abs(Math.cos(phase)) * (u > 0 && u < 1 ? 1 : 0);
  return { pose: { x, y, angle, squash }, clearX: Math.max(0, x - 95) };
}

// CSS mask that hides exactly what the eraser has swept so far: its path (stroke `width`)
// plus everything more than `lag` px behind it inside the band (no stray leftovers).
export function sweptMask(prog, band, cycles, width, lag) {
  const pts = [];
  const steps = Math.max(2, Math.ceil(prog * 400));
  for (let i = 0; i <= steps; i++) {
    const { pose } = wipePose((prog * i) / steps, band, cycles);
    pts.push(`${pose.x.toFixed(1)},${pose.y.toFixed(1)}`);
  }
  const { pose } = wipePose(prog, band, cycles);
  const behind = Math.max(0, pose.x - lag);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'><defs><mask id='m'>`
    + `<rect width='${W}' height='${H}' fill='white'/>`
    + `<polyline points='${pts.join(' ')}' fill='none' stroke='black' stroke-width='${width}' stroke-linecap='round' stroke-linejoin='round'/>`
    + `<rect x='0' y='${band[0] - width / 2}' width='${behind}' height='${band[1] - band[0] + width}' fill='black'/>`
    + `</mask></defs><rect width='${W}' height='${H}' fill='black' mask='url(#m)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// progress at which the eraser's leading edge first reaches x (sweep moves left to right)
export function passProgress(x, band, cycles) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (wipePose(mid, band, cycles).pose.x + 95 < x) lo = mid; else hi = mid;
  }
  return hi;
}

// wooden objects are not erased but swept off: each hops (anticipation) and shrinks away
// as the eraser reaches it. Chalk layers get the swept mask instead.
export function sweepOff(container, prog, band, cycles, mask) {
  container.querySelectorAll('svg.layer').forEach((s) => applyMask(s, mask));
  container.querySelectorAll('.tile').forEach((t) => {
    const cx = parseFloat(t.style.left) + parseFloat(t.style.width) / 2;
    const u = clamp01((prog - passProgress(cx, band, cycles)) / 0.08);
    if (u <= 0) return;
    if (u >= 1) { t.remove(); return; }
    const hop = -26 * Math.sin(Math.PI * Math.min(1, u / 0.6));
    const k = u < 0.3 ? 1 + 0.12 * (u / 0.3) : 1.12 * (1 - easeInOut((u - 0.3) / 0.7));
    t.style.transform += ` translateY(${hop}px) scale(${k})`;
  });
}

export function applyMask(elem, mask) {
  for (const k of ['maskImage', 'webkitMaskImage']) elem.style[k] = mask;
  for (const k of ['maskSize', 'webkitMaskSize']) elem.style[k] = `${W}px ${H}px`;
  for (const k of ['maskRepeat', 'webkitMaskRepeat']) elem.style[k] = 'no-repeat';
}
