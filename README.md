# Chalkboard Lessons

## Layout

Each lesson owns its content, scene code, timing, audio, and generated output:

```text
lessons/
  trung_binh_cong/
    story.md
    critique.md
    voice.json
    scene.js
    timing.json
    audio/
      cues.json
      voice.wav
      lines/
    out/                 # ignored render output
  dau_hieu_chia_het/
  decimal/               # draft scene and timing; no voiceover yet
shared/
  web/                   # shared player, theme, CSS, and drawing engine
  fonts/                 # shared fonts
render/                  # shared preview, TTS, capture, and inspection tools
tests/                   # lesson loading and audio smoke tests
```

Scene imports point to the shared engine in `../../shared/web/js/` and theme in
`../../shared/web/theme.js`. A lesson's timing uses `"scene": "./scene.js"` and,
when voiced, `"audio": "./audio/voice.wav"`, both relative to that timing file.
No central scene registry is needed for new lessons.

## Commands

Run commands from the project root:

```sh
npm run preview
# http://localhost:8123/shared/web/index.html?lesson=trung_binh_cong
# http://localhost:8123/shared/web/index.html?lesson=dau_hieu_chia_het
# http://localhost:8123/shared/web/index.html?lesson=decimal (default)

npm run voice -- trung_binh_cong
npm run sync -- trung_binh_cong
npm run pages -- trung_binh_cong   # review on a phone: https://hoanghaihung3012.github.io/toan4/trung_binh_cong/
npm run zalo -- "text"            # message the Zalo review group (needs ZALO_BOT_TOKEN; pages sends its link itself)
npm run keyposes -- --lesson trung_binh_cong
npm run sheet -- --lesson trung_binh_cong --every 0.5
npm run export -- --lesson trung_binh_cong
npm test
```

Capture and inspection default to the selected lesson's `out/` directory.
`--timing lessons/<lesson>/timing.json`, `--dir`, and `--out` remain available
for explicit paths. MP4 capture still produces video only; mux it with the
lesson's `audio/voice.wav` after preview approval.

The existing root `out/` folder is retained for previous exports and comparisons.
Both root and lesson-local `out/` folders are ignored by Git. After approval,
`npm run final -- <lesson>` captures, muxes the voiceover and writes the one committed
file, `final/<YYYY-MM-DD>/<lesson>.mp4` (or `final/<YYYY-MM-DD>/<name>.mp4` when `voice.json` sets `"final"`; English
versions use an English name with no `_en`, e.g. `final/2026-10-25/divisibility_rules.mp4`); every finished MP4 lives in the repo-root `final/` folder, in a sub-folder for the day it was made (Vietnam time; `--date` keeps an earlier day on a re-export). TTS line caches
move with their lesson, so moving a lesson does not require synthesizing it again.