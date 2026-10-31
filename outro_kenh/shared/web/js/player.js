// Player: reads timing.json, turns time into per-key progress, renders one frame.
// window.renderFrame(t) is deterministic, so the capture script can step it frame by frame.
// URL params: ?capture=1 (1:1 stage, no controls), ?embed=1 (fitted to the window, no controls, no
// audio: the stitched preview of a long lesson drives renderFrame), ?lesson=name (or <lesson>/<scene>),
// ?timing=path, ?scene=module path. A page of its own (a scene's index.html) names its timing with
// <body data-timing="./timing.json">. Scene and audio paths are relative to the lesson's timing.json.
import { ChalkLayer, resetIds, refreshCanvasSize, W } from './chalk.js';
import { clamp01, easeOutCubic, easeInOut, spring } from './ease.js';
import { buildBoard } from './board.js';
import { applyTheme } from './theme_apply.js';
import { THEME, configureProfile } from '../theme.js';
import { drawEraser, wipePose, sweptMask, sweepOff } from './eraser.js';
import { fitStage } from './fit.js';

const params = new URLSearchParams(location.search);
const capture = params.has('capture');
const embed = params.has('embed');
const lesson = params.get('lesson') || 'decimal';
const own = document.body.dataset.timing;
// /lessons/<name>/ is redirected by the server to lessons/<date>/<format>/<lang>/<name>/
const timingUrl = params.get('timing') || (own ? new URL(own, location.href).href : null)
  || 'lessons/2026-10-31/long/vi/outro_kenh/timing.json';
let timingBase; // where timing.json really is, after any redirect

const stage = document.getElementById('stage');
if (capture) document.body.classList.add('capture');
if (embed) document.body.classList.add('embed');
const root = document.createElement('div');
root.className = 'scene';
stage.appendChild(root);
// keep the lesson inside the platform-safe area (THEME.safeArea); the board stays full-bleed
function fitSafeArea() {
if (THEME.safeArea) {
  const [l0, t0, r0, b0] = THEME.safeArea.content;
  const [l1, t1, r1, b1] = THEME.safeArea.target;
  const k = Math.min((r1 - l1) / (r0 - l0), (b1 - t1) / (b0 - t0));
  const tx = (l1 + r1) / 2 - k * (l0 + r0) / 2;
  const ty = (t1 + b1) / 2 - k * (t0 + b0) / 2;
  root.style.transformOrigin = '0 0';
  root.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
}
}

// default ease-out: chalk must appear the moment it touches
const EASE = { out: easeOutCubic, motion: easeInOut, spring, raw: (t) => t };

function progressFor(beat, t) {
  const p = {};
  for (const [k, [s, e, ease = 'out']] of Object.entries(beat.windows || {})) {
    p[k] = EASE[ease](clamp01((t - s) / Math.max(1e-6, e - s)));
  }
  return p;
}

function makeCtx(container, fx) {
  return {
    fx,
    chalk(strength = 60) { return new ChalkLayer(container, strength); },
    objects() {
      const d = document.createElement('div');
      d.className = 'objects';
      container.appendChild(d);
      return d;
    },
  };
}

function container(parent) {
  const d = document.createElement('div');
  d.className = 'scene';
  parent.appendChild(d);
  return d;
}

let timing, scenes;

function beatAt(t) {
  const beats = timing.beats;
  return beats.find((b) => t >= b.start && t < b.end) || beats[beats.length - 1];
}

function renderFrame(t) {
  resetIds();
  root.replaceChildren();
  const beat = beatAt(t);
  const p = progressFor(beat, t);
  const main = container(root);
  const fx = container(root);
  fx.classList.add('fx');
  scenes[beat.id](makeCtx(main, fx), p);
  // board change: the previous board (key pose) is wiped away by the eraser
  if (beat.prev && 'wipe' in p && p.wipe < 1) {
    const old = container(root);
    root.appendChild(fx);
    scenes[beat.prev](makeCtx(old, fx), {});
    if (p.wipe > 0) {
      const band = [120, THEME.canvas.height - 120];
      sweepOff(old, p.wipe, band, 6, sweptMask(p.wipe, band, 6, 200, 280));
      drawEraser(fx, wipePose(p.wipe, band, 6).pose);
    }
  }
  return beat.id;
}

async function init() {
  const res = await fetch(timingUrl);
  timing = await res.json();
  configureProfile(timing.profile);
  refreshCanvasSize();
  fitSafeArea();
  await applyTheme();
  buildBoard(stage);
  timingBase = res.url || new URL(timingUrl, location.href).href;
  const sceneName = params.get('scene') || timing.scene || './scene.js';
  const sceneUrl = new URL(sceneName, timingBase).href;
  ({ scenes } = await import(sceneUrl));
  await document.fonts.ready;
  window.timing = timing;
  window.renderFrame = renderFrame;
  renderFrame(capture || embed ? 0 : timing.duration);
  if (embed) fitWindow();
  else if (!capture) setupPreview();
}

// embedded (stitched preview): the whole stage, centred in the window
function fitWindow() {
  fitStage(stage, document.getElementById('view'), THEME.canvas.width, THEME.canvas.height);
}

function setupPreview() {
  fitStage(stage, document.getElementById('view'), THEME.canvas.width, THEME.canvas.height);
  const scrub = document.getElementById('scrub');
  const label = document.getElementById('time');
  const beatLabel = document.getElementById('beat');
  const btn = document.getElementById('play');
  let t = 0, playing = false, last = 0;
  // voiceover (timing.audio) plays along in the preview; the player clock follows it
  const audio = timing.audio ? new Audio(new URL(timing.audio, timingBase).href) : null;
  const show = () => {
    beatLabel.textContent = renderFrame(t);
    label.textContent = `${t.toFixed(2)} s`;
    scrub.value = Math.round((t / timing.duration) * 1000);
  };
  scrub.oninput = () => {
    t = (scrub.value / 1000) * timing.duration;
    if (audio) audio.currentTime = t;
    show();
  };
  btn.onclick = () => {
    playing = !playing;
    btn.textContent = playing ? '❚❚' : '▶';
    last = performance.now();
    if (audio) {
      if (playing) { audio.currentTime = t; audio.play(); } else audio.pause();
    }
  };
  const tick = (now) => {
    if (playing) {
      t = audio && !audio.paused ? audio.currentTime : t + (now - last) / 1000;
      if (t >= timing.duration) {
        t = 0;
        if (audio) audio.currentTime = 0;
      }
      show();
    }
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  t = 0;
  show();
}

window.ready = init();
