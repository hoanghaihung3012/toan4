// Stitched preview of a long lesson: plays its scenes one after another on one timeline.
// The page names the lesson's scenes.json with <body data-scenes="./scenes.json"> (render/long.mjs
// writes it). Each scene is its own page (<scene>/index.html) loaded in an iframe with ?embed=1, so
// the scene pages stay the one source; this page owns the clock and the voiceover (one <audio>, so a
// phone that allowed the first play also plays the next scenes) and calls each scene's renderFrame.
const manifestUrl = new URL(document.body.dataset.scenes || './scenes.json', location.href);
const manifest = await (await fetch(manifestUrl)).json();

const screen = document.getElementById('screen');
const btn = document.getElementById('play');
const scrub = document.getElementById('scrub');
const clock = document.getElementById('time');
const now = document.getElementById('now');
const chapters = document.getElementById('chapters');

// every scene: its page, timing, voiceover and place on the whole timeline
let offset = 0;
const scenes = [];
for (const s of manifest.scenes) {
  const page = new URL(`${s.id}/index.html`, manifestUrl);
  const timingUrl = new URL('timing.json', page);
  const res = await fetch(timingUrl);
  const timing = await res.json();
  const audio = timing.audio ? new URL(timing.audio, res.url || timingUrl).href : null;
  scenes.push({ ...s, page, timing, audio, start: offset, duration: timing.duration });
  offset += timing.duration;
}
const total = offset;
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// the scene pages, stacked; only the current one is shown
const frames = scenes.map((s) => {
  const f = document.createElement('iframe');
  f.src = `${s.page.href}?embed=1`;
  f.title = s.title;
  screen.appendChild(f);
  return f;
});
await Promise.all(frames.map((f) => new Promise((resolve) => {
  const wait = () => (f.contentWindow?.ready ? f.contentWindow.ready.then(resolve) : setTimeout(wait, 50));
  f.addEventListener('load', wait, { once: true });
})));

scenes.forEach((s) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `#${s.id}`;
  a.textContent = `${s.title} (${fmt(s.start)})`;
  a.onclick = (e) => { e.preventDefault(); seek(s.start); };
  const own = document.createElement('a');
  own.href = s.page.href;
  own.textContent = 'mở riêng';
  own.className = 'own';
  li.append(a, ' ', own);
  chapters.appendChild(li);
});

const audio = new Audio();
audio.preload = 'auto';
let current = -1, local = 0, playing = false, last = 0;

function show(i) {
  if (i !== current) {
    current = i;
    frames.forEach((f, k) => f.classList.toggle('on', k === i));
    [...chapters.children].forEach((li, k) => li.classList.toggle('on', k === i));
    const src = scenes[i].audio;
    if (src && audio.src !== src) audio.src = src;
    else if (!src) audio.removeAttribute('src');
    const next = scenes[i + 1]?.audio;
    if (next) fetch(next).catch(() => {}); // warm the cache for a quick cut
  }
}

function draw() {
  const s = scenes[current];
  const beat = frames[current].contentWindow.renderFrame(local);
  const t = s.start + local;
  clock.textContent = `${fmt(t)} / ${fmt(total)}`;
  now.textContent = `${s.title} · ${beat}`;
  scrub.value = Math.round((t / total) * 1000);
}

function seek(t) {
  t = Math.max(0, Math.min(total, t));
  let i = scenes.findIndex((s) => t < s.start + s.duration);
  if (i < 0) i = scenes.length - 1;
  show(i);
  local = t - scenes[i].start;
  if (scenes[i].audio) audio.currentTime = local;
  if (playing && scenes[i].audio) audio.play();
  draw();
}

function setPlaying(on) {
  playing = on;
  btn.textContent = on ? '❚❚' : '▶';
  last = performance.now();
  if (!scenes[current].audio) return;
  if (on) { audio.currentTime = local; audio.play(); } else audio.pause();
}

btn.onclick = () => {
  if (!playing && current === scenes.length - 1 && local >= scenes[current].duration) seek(0);
  setPlaying(!playing);
};
scrub.oninput = () => seek((scrub.value / 1000) * total);
addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); btn.onclick(); }
});

function tick(t) {
  if (playing) {
    const s = scenes[current];
    local = s.audio && !audio.paused ? audio.currentTime : local + (t - last) / 1000;
    if (local >= s.duration) {
      if (current < scenes.length - 1) {
        // cut to the next scene: its first frame is the board this one ended on
        show(current + 1);
        local = 0;
        if (scenes[current].audio) { audio.currentTime = 0; audio.play(); }
      } else {
        local = s.duration;
        setPlaying(false);
      }
    }
    draw();
  }
  last = t;
  requestAnimationFrame(tick);
}

const start = scenes.find((s) => `#${s.id}` === location.hash);
seek(start ? start.start : 0);
requestAnimationFrame(tick);
window.playlist = { scenes, total, seek, play: () => setPlaying(true), pause: () => setPlaying(false) };
