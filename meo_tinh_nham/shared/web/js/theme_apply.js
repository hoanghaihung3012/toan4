// Turns THEME into CSS variables, @font-face rules and the SVG chalk/grain filters.
// Called once by the player before the first frame.
import { THEME } from '../theme.js';

const FONT_DIR = new URL('../../fonts/', import.meta.url);

function cssVars() {
  const { board, tiles: t, eraser: e, canvas } = THEME;
  const g = board.gradient;
  const r = g.radius;
  return {
    '--stage-w': `${canvas.width}px`,
    '--stage-h': `${canvas.height}px`,
    '--board-bg': `radial-gradient(${r}px circle at ${g.center[0]}px ${g.center[1]}px, `
      + `${g.stops[0]} 0px, ${g.stops[1]} ${r / 2}px, ${g.stops[2]} ${r}px)`,
    '--grain-opacity': board.grain.opacity,
    '--vignette': `radial-gradient(${Math.round(canvas.height * 0.75)}px circle at 50% 50%, `
      + `rgba(0,0,0,0) ${board.vignette.inner * 100}%, rgba(0,0,0,${board.vignette.alpha}) 100%)`,
    '--tile-font': `'${THEME.fonts.tile.family}'`,
    '--tile-weight': THEME.fonts.tile.weight,
    '--tile-radius': `${t.radius}px`,
    '--tile-shadow': t.shadow,
    '--tile-highlight': t.highlight,
    '--tile-digit-size': `${t.digitSize}px`,
    '--tile-comma-size': `${t.commaSize}px`,
    '--tile-ink': t.ink,
    '--int-face': t.int.face, '--int-edge': `0 ${t.edge}px 0 ${t.int.edge}`,
    '--dec-face': t.dec.face, '--dec-edge': `0 ${t.edge}px 0 ${t.dec.edge}`,
    '--comma-face': t.comma.face, '--comma-edge': `0 ${t.edge}px 0 ${t.comma.edge}`,
    '--comma-ink': t.comma.ink,
    '--blank-border': t.blank.border,
    '--eraser-back': `linear-gradient(${e.back[0]}, ${e.back[1]})`,
    '--eraser-felt': e.felt,
    '--eraser-dust': e.dust,
    '--eraser-shadow': e.shadow,
  };
}

// keep = 1 - (3.2*s*noise - 0.55*s): turbulence red channel punches holes in the chalk
function chalkFilter(id, s, seed) {
  const { frequency, octaves } = THEME.chalkGrain;
  const { width, height } = THEME.canvas;
  return `<filter id="chalk${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" color-interpolation-filters="sRGB">
    <feTurbulence type="turbulence" baseFrequency="${frequency[0]} ${frequency[1]}" numOctaves="${octaves}" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${(-3.2 * s).toFixed(3)} 0 0 0 ${(1 + 0.55 * s).toFixed(3)}" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in"/>
  </filter>`;
}

function filters() {
  const { strengths, seeds } = THEME.chalkGrain;
  const { width, height } = THEME.canvas;
  const gr = THEME.board.grain;
  const defs = Object.entries(strengths).map(([id, s]) => chalkFilter(id, s, seeds[id] ?? 3));
  defs.push(`<filter id="grain" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">
    <feTurbulence type="fractalNoise" baseFrequency="${gr.frequency}" numOctaves="${gr.octaves}" seed="${gr.seed}"/>
  </filter>`);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', 0);
  svg.setAttribute('height', 0);
  svg.style.position = 'absolute';
  svg.innerHTML = `<defs>${defs.join('\n')}</defs>`;
  document.body.prepend(svg);
}

async function fonts() {
  const faces = Object.values(THEME.fonts).map((f) => new FontFace(
    f.family, `url(${new URL(f.file, FONT_DIR)})`, f.weightRange ? { weight: f.weightRange } : {},
  ));
  for (const face of faces) document.fonts.add(await face.load());
}

export async function applyTheme() {
  for (const [k, v] of Object.entries(cssVars())) document.documentElement.style.setProperty(k, v);
  filters();
  await fonts();
}
