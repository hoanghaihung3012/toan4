// ============================================================================
// THEME: the one place to change the look of every lesson.
// Colours, board background, fonts, chalk grain, tile style, eraser and the shared
// board layout all live here. CSS variables, SVG filters and @font-face are generated
// from this file at start-up (shared/web/js/theme_apply.js), so nothing else needs editing.
// Units: px on the 1080x1920 (9:16) stage.
// ============================================================================

import { canvasFor } from './profiles.js';

export function configureProfile(profile) {
  THEME.canvas = canvasFor(profile);
  if (profile === 'landscape') {
    THEME.safeArea = null;
    THEME.board.gradient.center = [960, 460];
    THEME.board.gradient.radius = 1800;
    THEME.board.gradient.stops = ['rgb(49, 111, 85)', 'rgb(40, 94, 72)', 'rgb(32, 78, 60)'];
    THEME.board.vignette.alpha = 0.18;
  }
}

export const THEME = {
  canvas: { width: 1080, height: 1920, fps: 30 },

  // fonts live in <project>/shared/fonts/; family names are what the code uses
  fonts: {
    chalk: { family: 'Pangolin', file: 'Pangolin.ttf' },
    tile: { family: 'Baloo 2', file: 'Baloo2.ttf', weightRange: '400 800', weight: 760 },
  },

  // full-bleed slate: radial gradient + overlay grain + faint eraser ghosts + vignette
  board: {
    gradient: {
      center: [486, 672],
      radius: 1632,
      stops: ['rgb(40, 92, 70)', 'rgb(30, 72, 55)', 'rgb(20, 50, 39)'], // light -> dark
    },
    grain: { frequency: 0.6, octaves: 3, seed: 7, opacity: 0.14 },
    smudges: { count: 12, seed: 7, alpha: [0.025, 0.05], width: [200, 420], height: [50, 110], tilt: 10 },
    vignette: { inner: 0.6, alpha: 0.35 },
  },

  // chalk colours (all chalk text, lines, loops, badges)
  chalk: {
    white: 'rgb(244, 242, 232)',
    yellow: 'rgb(250, 222, 110)', // active step, answer loop, "?"
    pink: 'rgb(246, 160, 178)',
    blue: 'rgb(150, 205, 240)',
    green: 'rgb(170, 230, 150)', // dashed blank slot
    red: 'rgb(255, 120, 120)', // carry / borrow marks, comma column guide
    mint: 'rgb(176, 236, 196)', // decimal digits of a chalk result
  },

  // dry-chalk grain: holes where chalk did not catch. strength 0..1 per layer kind
  chalkGrain: {
    frequency: [0.9, 0.495],
    octaves: 2,
    strengths: { 50: 0.5, 60: 0.6, 100: 1.0 }, // ChalkLayer(parent, 50|60|100)
    seeds: { 50: 3, 60: 5, 100: 8 },
  },

  // wooden digit tiles
  tiles: {
    width: 92,
    height: 104,
    commaWidth: 40,
    gap: 12,
    radius: 12,
    edge: 7, // visible wooden thickness under the face
    shadow: '3px 14px 14px rgba(0, 0, 0, 0.4)',
    highlight: 'rgba(255, 255, 255, 0.35)',
    digitSize: 80,
    commaSize: 84,
    ink: 'rgb(70, 44, 22)',
    int: { face: 'rgb(240, 218, 168)', edge: 'rgb(176, 138, 84)' }, // whole part
    dec: { face: 'rgb(200, 236, 208)', edge: 'rgb(112, 168, 128)' }, // decimal part
    comma: { face: 'rgb(226, 52, 52)', edge: 'rgb(150, 24, 30)', ink: '#fff' }, // comma peg
    blank: { border: 'rgb(170, 230, 150)' }, // padded-zero slot
  },

  eraser: {
    back: ['rgb(186, 128, 72)', 'rgb(140, 88, 46)'],
    felt: 'rgb(120, 120, 126)',
    dust: 'rgba(244, 242, 232, 0.35)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },

  // Platform-safe area (TikTok / YouTube Shorts). The app draws its own UI over the video:
  // top bar (y < ~260), right action rail (x > ~880 from y ~1160), caption + remix at the
  // bottom-left (y > ~1610), and ~55 px is cropped off each side on tall phones.
  // The player fits the lesson's content box into the target box (uniform scale, board
  // background stays full-bleed). Set to null to draw 1:1. Boxes are [left, top, right, bottom].
  safeArea: { content: [70, 145, 1035, 1600], target: [80, 280, 870, 1590] },

  // shared board layout (every lesson uses the same places)
  layout: {
    title: { x: 70, y: 210, size: 66, underlineWidth: 4 },
    titleCentered: { y: 210, size: 76 },
    columns: {
      commaX: 622, // x of the comma column
      row1: 520, row2: 660, rule: 745, result: 880,
      guideTop: 430, guideBottom: 940,
      operatorX: 92,
      resultSize: 104,
    },
    steps: { x: 250, y: [1150, 1310, 1470], size: 56 },
  },
};
