---
name: chalkboard-html-lesson
description: Make a 9:16 (TikTok) primary-school math lesson video on the approved chalkboard - full-bleed green board, chalk drawn in SVG, wooden tiles and bars, felt eraser - from sourced facts to final MP4. Holds the engine + style (one config, web/theme.js), the Edge TTS voiceover pipeline that builds timing.json from word times, the verification loops and a single approval on the running HTML preview, then MP4 export. Lesson scenes live in each project. Review runs live in the browser; MP4 export happens once at the end.
---

# Chalkboard style + engine (HTML/CSS/JS)

This skill holds the **style, the engine and the process**: the board background, chalk, tiles, eraser and player, the config, the voiceover/timing pipeline and the review loops. It has **no lesson scenes**. Each project writes its own scenes in `web/js/scenes/<lesson>.js`, its script in `lessons/<lesson>/voice.json` and gets `timing/<scene>.json` built from the audio.

- **Engine:** `template/`. Copy it into the project; do not rebuild it.
- **Look:** `references/board.png` is the empty board as it renders from the template.
- **Process:** one approval (on the HTML preview with voice) and the verification loops are under **Workflow** below. A finished example is the tuduy1 lesson "Tìm số trung bình cộng" (`lessons/trung_binh_cong/`: story.md, voice.json, critique.md; scene `web/js/scenes/tbc.js`).

## Project rules (from .claude/CLAUDE.md, non-negotiable)
- **Sound off:** the video must read with the sound off. Show objects first, then chalk.
- **Facts:** use only facts the user gave or that you sourced, and re-check every number in code.
- **Text:** keep it sparse, written in chalk on the board, never overlaid.
- **Drawing:** everything is drawn in code. No generated images on screen.
- **Timing:** all timing comes from `timing/timing.json`. Scenes hold no times.
- **Motion:** anticipation, follow-through, squash and stretch, springs, arcs; no linear moves.
- **Camera:** none. Every board change is motivated by the eraser.
- **Review in the browser only.** The user approves once, on the running HTML preview; export the MP4 once, after that approval (the user asked for this explicitly).

## The one place to edit the look: `web/theme.js`
`THEME` holds every visual value. `web/js/theme_apply.js` turns it into CSS variables, `@font-face` rules and the SVG chalk/grain filters at start-up. `render/capture.mjs` reads the canvas size and fps from it. CSS, HTML and scenes contain no style values.

| Section | Controls |
|---|---|
| `canvas` | 1080×1920, fps 30 |
| `fonts` | chalk font (Pangolin), tile font (Baloo 2, variable weight 760). Files in `fonts/` |
| `board` | radial gradient (centre, radius, 3 stops), overlay grain, faint eraser ghosts (smudges), vignette |
| `chalk` | chalk colours: white, yellow (active/answer), pink, blue, green, red (marks, comma guide), mint (decimal digits) |
| `chalkGrain` | turbulence frequency/octaves; strength per layer kind 50/60/100 |
| `tiles` | size, gap, radius, edge, shadow, digit/comma size, ink; face/edge of `int` (cream), `dec` (mint), `comma` (red peg), `blank` (dashed slot) |
| `eraser` | wood back, felt, dust, shadow |
| `layout` | title place/size (left with underline, or centred), column rows (`row1`, `row2`, `rule`, `result`, guides, `commaX`, `operatorX`), step-badge column |
| `safeArea` | platform-safe fit: the player scales the lesson's `content` box uniformly into the `target` box so the app UI never covers it (board stays full-bleed). `null` = 1:1 |

Edit `theme.js`, then reload the preview. After a style change, re-check the project's key poses (see Verify).

### Approved values (2026-10-24)
- **Board:** `rgb(40,92,70)` → `rgb(30,72,55)` → `rgb(20,50,39)`, radial gradient at (486, 672), radius 1632. Grain 0.14, 12 smudges (alpha 0.025–0.05), vignette 0.35.
- **Chalk:** white `rgb(244,242,232)`, yellow `rgb(250,222,110)`, red `rgb(255,120,120)`, mint `rgb(176,236,196)`, green `rgb(170,230,150)`.
- **Tiles:** 92×104, gap 12, radius 12, 7 px wooden edge.
  - int `rgb(240,218,168)` with edge `rgb(176,138,84)`;
  - dec `rgb(200,236,208)` with edge `rgb(112,168,128)`;
  - comma peg `rgb(226,52,52)`, 40 wide;
  - ink `rgb(70,44,22)`.
- **Layout:**
  - title at (70, 210), size 66, underlined; centred title size 76;
  - columns: comma at x 622, rows 520 / 660, rule 745, result 880, guides 430–940;
  - step badges at x 250, y 1150 / 1310 / 1470, size 56.

## Engine map (`template/`)
- `web/index.html`: the stage and the preview controls (play, scrub).
- `web/theme.js`: **config**.
- `web/css/board.css`: structure only, using CSS variables.
- `web/js/`
  - `ease.js`: `spring`, `anticipateSpring`, `pop`, `landSquash`, `arcPoint`, `stagger`, `easeInOut`, `easeOutCubic`, `easeInQuad`, seeded `rng`.
  - `chalk.js`: `ChalkLayer(parent, 50|60|100)` = an `<svg>` with chalk grain. Methods: `text` (left-to-right clip sweep, optional `scale`), `line`, `poly`, `rect`, `loop` (overshooting teacher circle), `arrow` (drawn; the fonts have no arrow glyph), `dashed`. Every method takes `t` from 0 to 1.
  - `tiles.js`: `tile(parent, x, y, ch, kind, {scale, squash})`, `Grid` (col 0 = comma, −n = whole part, +n = decimals), `numberCols`, `looseLayout`, `columnLines`, `chalkNumber` (writes right to left), `rtlProgress`, `badge`.
  - `board.js`: smudges, grain, vignette.
  - `eraser.js`: `drawEraser`, `wipePose`, `sweptMask` (erases exactly the swept path), `sweepOff` (masks chalk layers; wooden tiles hop and shrink away as the eraser reaches them), `applyMask`.
  - `parts.js`: lesson-neutral board parts.
    - `row(L, parts, x, y, {size, t, align, gap})` writes a chalk equation left to right. A part is a string, `{s, color}`, or a drawn `{sym: 'times' | 'minus'}`. It returns each part's centre x, so a part can be circled.
    - `bar(objs, x, base, h, kind, w, squash)` is a wooden bar of any height (tile styles), growing from its base.
    - `arcArrow(L, from, to, lift, v, seed)` is a yellow chalk arc with a head.
    - `flight(from, to, u, lift)` is an arc move with an anticipation dip and a landing squash.
  - `player.js`: reads the timing file (`?timing=/timing/<scene>.json`), loads `scenes/<timing.scene>.js` (or `?scene=`), and exposes `window.renderFrame(t)` (deterministic). It runs full-board wipes for any beat with `"prev"` and a `wipe` window. When the timing has `"audio"`, the preview plays the voiceover and its clock follows the audio (scrub seeks it).
  - `scenes/blank.js`: an empty starter scene (board only) with the scene contract in its header.
- `timing/timing.json`: starter timing (`"scene": "blank"`, one 3 s beat).
- `lessons/example/voice.json`: starter voiceover script (one line) for `render/voice.mjs`.
- `render/serve.mjs`: static server with byte ranges (the preview seeks the WAV). It listens on IPv4 and IPv6; the Browser pane resolves `localhost` to `::1`.
- `render/voice.mjs <lesson>`: the voiceover pipeline.
  - It synthesises each line with Edge TTS, cached per line by voice + rate + text, and retries when the free endpoint returns nothing.
  - It lays the lines out on one timeline and resolves every window from its word anchor.
  - It writes `timing/<scene>.json`, `audio/<lesson>/cues.json` (word times) and `audio/<lesson>/voice.wav` (48 kHz stereo, −16 LUFS, true peak −1.5 dB).
- `render/tts_words.py`: the one Python file. It turns a line into MP3 + word boundaries with the `edge-tts` package, run from `.venv`.
- `render/synccheck.mjs <lesson>`: verification loop 3. It checks that every word-anchored window shows within 1 frame of its word.
- `render/browser.mjs`: shared headless-Chrome setup (puppeteer-core + system Chrome); `openPlayer()` returns `shot(t, scale)`.
- `render/capture.mjs`: PNG frames piped to ffmpeg (x264, crf 18, yuv420p). It also has `--stills t1,t2` and `--keyposes`.
- `render/inspect.mjs`: review helpers in JS (image work on a Chrome canvas, no extra deps). `sheet` builds contact sheets; `diff <dirA> <dirB>` gives the mean pixel difference per PNG.
- **JS only, with one exception.** The Node Edge TTS clients (`msedge-tts` 2.0.7–2.1.0) are refused by Microsoft's endpoint (HTTP 403 / 200 instead of a WebSocket upgrade), so `render/tts_words.py` uses the maintained Python `edge-tts`. Keep everything else in JS.

## Writing scenes (in the project, not here)
- **File:** `web/js/scenes/<lesson>.js` exports `scenes = { beat1, beat2, ... }`. Set `"scene": "<lesson>"` in that project's `timing.json`.
- **Signature:** `beatN(ctx, p)`. `p[key]` is a progress value from 0 to 1. **A key not listed in the beat's timing defaults to 1**, so `beatN(ctx, {})` is the key pose. Use `const g = (p, k) => (k in p ? p[k] : 1)`.
- **Layer order** is call order:
  1. `ctx.chalk(50)` for the guides under the tiles;
  2. `ctx.objects()` for the tiles;
  3. `ctx.chalk(60)` for chalk over the tiles;
  4. another `ctx.objects()` for crisp pegs that must not get the grain.
- **Layout:** read board places from `THEME.layout` (`import { THEME } from '../../theme.js'`); never hard-code style values in a scene.
- **Shared boards:** beats that continue the same board need no eraser. The end state of beat N must equal the start state of beat N+1 (build both from one helper).
- **Board change:** the timing beat gets `"prev": "beatN"` and a `wipe` window (the player does it). Erase only a band (e.g. the title) with `wipePose` + `sweptMask` + `drawEraser` inside the scene.
- **Facts:** put the numbers at the top of the scene and `console.assert` the arithmetic. The capture script prints page errors and failed asserts.

## Motion recipes that passed review
- **Tile pops:** `pop(stagger(prog, i, n, 0.4))`, a spring scale with squash. Avoid alpha fades; they look muddy on the dark board.
- **Moving tiles:**
  - arc lift = `min(40, dist * 0.5)` for short moves;
  - a lower row moving up **dips** (negative lift) so it never crosses the row above;
  - 15 % anticipation back-step, then `landSquash`.
- **Dropping a peg:** hop up about 34 px, fall with `easeInQuad`, squash on landing.
- **Chalk results:** written right to left like column arithmetic. Cue a mark (carry/borrow) when its column's digit finishes: `start + (i+1)/n * duration`.
- **Eraser:** scrubs up and down (6 cycles for a full board, 2 for a band) while it advances.
  - Erase with `sweptMask`, never with a straight clip ("curtain") and never by cutting through tiles.
- **Shrinking something away:** wind up to 1.15, then shrink to 0.
- **Averages / comparing amounts:** stacks of blank `int` tiles stand for units (litres). For bigger numbers, use `bar()` columns.
  - Start the bars at a cut-off value (e.g. 20) with a chalk zigzag at the foot. From 0, a 1-unit difference is a few pixels and vanishes on a phone.
  - The part that moves to level the bars is `dec` (mint), split off the tall bar, flown with `flight()` and traced with `arcArrow()`.
  - Mark the level with a yellow dashed line plus a 70 px tag at its end, circled when the voice says the average.
- **Unknown value:** a `blank` dashed slot with a yellow "?". The answer grows into it with a spring, and the "?" shrinks away first.
- **Thinking pause:** 3 yellow chalk dots (radius ≥ 13) popping in one by one in a 2–3 s silent tail after the question.
- **Never let the board hold still for more than ~3 s while the voice talks.** Cue a circle, a colour change or a tag on a word in that line.

## Timing (`timing/<scene>.json`)
```json
{ "scene": "<lesson>", "fps": 30, "duration": 12.0,
  "beats": [ { "id": "beat2", "start": 6.0, "end": 12.0, "prev": "beat1",
               "windows": { "wipe": [6.0, 7.2, "raw"], "title": [7.3, 8.4] } } ] }
```
- **Window format:** `[start_s, end_s, ease]`, where ease is `out` (the default; chalk must show the moment it touches), `spring`, `motion` (ease-in-out) or `raw` (the scene does its own anticipation, arc or stagger).
- **Draft vs final:** before the voiceover exists, the file is a hand-made draft (`"draft": true`). Once the voiceover exists it is **built, never hand-edited**: `render/voice.mjs` writes it from `lessons/<lesson>/voice.json`.

### Voiceover script (`lessons/<lesson>/voice.json`)
```json
{ "scene": "tbc", "voice": "vi-VN-HoaiMyNeural", "rate": "-8%", "fps": 30, "gap": 0.35,
  "beats": [ { "id": "beat2", "prev": "beat1", "lead": 1.0, "tail": 0.4,
    "lines": [ { "id": "L5", "text": "Ba lớp có 25, 27 và 32 học sinh." },
               { "id": "L6", "gap": 1.0, "text": "Nếu chia đều số học sinh cho ba lớp thì sao?" } ],
    "windows": { "wipe": ["beat^", 1.2, "raw"], "bars": ["L5.Ba", 1.4, "raw"],
                 "f1": ["L7.Tổng", "L7.32>"], "level": ["L6$", 0.5, "out", 0.5] } } ] }
```
- **Window:** `[anchor, duration | end-anchor, ease?, offset_s?]`.
- **Anchors:**
  - `L5.Ba` is the start of a word; `L5.32>` is the end of a word;
  - `L5.can#2` is the 2nd occurrence of a word;
  - `L6^` / `L6$` are the start / end of a line;
  - `beat^` is the start of the beat.
- **Matching:** Edge TTS keeps numbers as one token ("25") and drops punctuation, so anchors match lower-cased words without punctuation.
- **Lines:**
  - each line starts `gap` s after the previous one ends;
  - the first line of a beat starts `lead` s after the beat start (≈1.0 s for a wiped beat: the eraser takes 1.2 s);
  - the beat ends `tail` s after its last word, or 0.3 s after its last window, whichever is later.
- **Spoken vs written:** write numbers as digits in the text; the voice reads them correctly. Say "chia" and "nhân" in words, while the board shows ":" and a drawn ×.
- **Pauses:** a thinking pause is a long `tail` (≈2.4 s) on the question beat.

## Workflow: one approval, on the running HTML (user's rule, 2026-10-25)
Do **not** stop for approval on facts, story, storyboard, key poses or audio. Work straight through steps 1–4, self-checking each one, until the lesson **runs in the browser with its voiceover**. Then show it once (step 5) and wait. After the approval, export the MP4 (step 6) and the lesson is done.

0. **New video → new branch from the latest `develop`** (user's rule, 2026-10-25). Before any lesson work:
   `git fetch origin develop && git checkout -b lesson/<lesson> origin/develop` (keep unrelated uncommitted changes; stash only if checkout refuses). Never start a lesson on `main`, on `develop` itself, or on another lesson's branch. Commit and push the lesson there, then open a PR with base `develop`.
1. **Facts + story** → `lessons/<lesson>/story.md`.
   - Source every number (VnDoc / VietJack / SGK pages via the Browser pane).
   - Make a table of facts and sources, re-check the arithmetic, and add a scene table: board (readable with the sound off) | voice line.
   - Default tone for TikTok: a question hook in the first 2 s (answered visibly later), short spoken lines, a ✓/✗ "game show" check per example, a closing challenge with a 3-2-1 countdown that asks viewers to comment.
   - If the user wants it harder or easier, keep every new number derived from sourced ones.
2. **Scenes + key poses.**
   - Build scene 1 in the engine first and check its key pose yourself, then write all beats with their progress keys and a draft timing.
   - Render `capture.mjs --keyposes`, tile them into one sheet (ffmpeg `hstack`/`vstack`), and paint the platform zones red (`drawbox`) to check the safe area.
   - **Self-critique:** readability, collisions (circles over "="), wasted space (use the whole content box, top to y ≈ 1550), and differences too small to see. Fix, re-render, and keep this set as the reference key poses.
3. **Audio + timing.**
   - `node render/voice.mjs <lesson>` builds the timing and the voice WAV.
   - Check `ffprobe` (stereo 48 kHz), `ebur128=peak=true` (true peak < −1 dBFS) and `silencedetect` (every silence > 1.2 s must be a wipe or an intended pause). Tighten `lead`/`tail` if not.
   - Vietnamese 4-digit numbers read long ("ba nghìn không trăm mười lăm"): a lesson with many of them runs 20–40 % over the planned length. Rate `+12%` still sounds natural.
4. **Verification loops** (all of them, before showing anything):
   1. **Key-pose match:** run `capture.mjs --keyposes` on the audio timing, then `inspect.mjs diff` against the step-2 key poses. The mean must be 0, except where a later fix changed a pose on purpose (list those).
   2. **Sound-off read:** run `inspect.mjs sheet --every 0.5`, then send a **fresh general-purpose subagent** that reads only the sheet PNGs and retells scenes, the math and confusing moments, and gives a yes/no verdict. Fix what it flags if it is cheap.
   3. **Sync:** `node render/synccheck.mjs <lesson>` must report 0 windows off.
   4. **Fact check:** every on-screen word and voice line goes into a table with its source. Cut anything unmatched.
   5. **Director's review:** watch every sheet, write a brutal critique (dead holds while the voice talks are the usual top issue), fix the top 3, then rebuild timing and sheets and review again.
   - Write it all to `lessons/<lesson>/critique.md`, including what is still weak, as the user's call.
5. **The one approval: the running HTML.**
   - **Publish it to GitHub Pages** (user's rule, 2026-10-25) so the user can review on a phone: `npm run pages -- <lesson>` (`render/pages.mjs`). It copies the shared player, fonts, the lesson's `.js` files and timing, converts the voice to MP3, writes `<lesson>/index.html` on the `gh-pages` branch, rebuilds the index of all published lessons and pushes. The link is `https://hoanghaihung3012.github.io/toan4/<lesson>/` (Pages serves `gh-pages`, `/ (root)`; the repo is public). Pages takes 1–2 minutes to update after a push.
   - **Send the link to the Zalo review group** (user's rule, 2026-10-25): `npm run pages` does it by itself after the push (`render/zalo.mjs`, Zalo Bot `sendMessage` to group `zgr-7722d0d041bfa8e1f1ae`; `ZALO_CHAT_ID` overrides). The bot token is the cloud-environment secret `ZALO_BOT_TOKEN`: never commit, print or paste it. The environment must allow `bot-api.zaloplatforms.com`. If the script prints `zalo: not sent (…)`, say so in one line and carry on; the link in the thread is the fallback. Only the preview link goes to Zalo, not the PR link (user's rule, 2026-10-25). `--no-zalo` skips it.
   - Show the user: the Pages link, the final contact sheets, the key-pose sheet, the WAV, and a short summary of `critique.md` (length, what was fixed, what is still weak). Then wait.
   - Changes the user asks for: fix, re-run the loops they touch (sync always), republish with `npm run pages -- <lesson>`, show the same link again.
6. **After approval of the Pages preview: export the MP4 right away. Done.**
   - Run `npm run final -- <lesson>` (`render/final.mjs`) in the background (≈470 s for 84 s). It captures `lessons/<lesson>/out/<lesson>_video.mp4`, muxes the lesson's `audio/voice.wav` (AAC 192k, 48 kHz stereo, `+faststart`) and writes **`final/<lesson>.mp4`** (user's rule, 2026-10-25: every finished MP4 lives in the repo-root `final/` folder, never inside the lesson).
   - Technical check on `final/<lesson>.mp4`: duration, stereo, true peak, `silencedetect` and `freezedetect=n=0.001:d=4`. Report a freeze honestly even when it is only a small cue drawing.
   - Hand over `final/<lesson>.mp4`.
   - **Commit the final MP4, and only that file** (user's rule, 2026-10-25): `git add final/<lesson>.mp4` (not ignored, no `-f`). Never commit the video-only capture, key poses, sheets or stills. Commit it with the lesson on the lesson branch so it is in the PR.

**Only when the user asks to update this skill:** move reusable helpers from the lesson scene into the engine (`parts.js`) and diff the key poses (mean 0); copy changed engine files into `template/`; smoke-test the template in a scratch copy (symlink `node_modules` and `.venv`, run `voice.mjs example`, `synccheck.mjs example`, then a `capture --stills` call).

### Setup and preview
- **Copy:** copy `template/` into the project, run `npm i puppeteer-core@23.11.1`, and install ffmpeg (`brew install ffmpeg`) and Google Chrome. Fonts are in `template/fonts`.
- **Voice environment:** `python3 -m venv .venv && .venv/bin/pip install edge-tts==7.3.1`.
- **Preview:**
  - add a `.claude/launch.json` entry running `node <project>/render/serve.mjs <port>`;
  - start it with `preview_start`, then navigate the Browser pane to `http://localhost:<port>/web/index.html?timing=/timing/<scene>.json`;
  - press ▶ or scrub.
  - If another session already holds 8123 with old code, add a second entry on 8124. `preview_start` reads the launch.json of the working directory's root.
- **Self-check frames** (PNG only; never MP4 during review):
  - `inspect.mjs sheet --every 0.5` (28 frames per sheet), with `--from/--to --every 0.25` to zoom into a move;
  - `capture.mjs --stills t1,t2` for single frames;
  - `inspect.mjs diff` after any refactor: the mean must be 0, or below about 2.5/255 if fonts changed.

## Pitfalls
- Pangolin has no arrow glyph, and its "−" sits low and thin: draw arrows and the minus as chalk strokes.
- A chalk-grain layer over a crisp peg makes the peg muddy. Draw pegs in an `objects()` layer above the chalk.
- Marks under 60 px disappear on a phone. Use 70 px in bright red.
- A small mark squeezed between two tiles can read as a digit; check it with the sound-off reader.
- `file://` blocks ES modules and `fetch`, so always use the server.
- **Platform UI covers the video** (seen on a phone, 2026-10-25): YouTube Shorts / TikTok show the video ≈0.955× with ≈55 px cropped off each side.
  - Measured in video pixels, the top bar covers y < 255; the right action rail covers x > 880 for y 1160–1870; the caption and "Remix" cover x < 880 for y > 1610.
  - Lay out freely at 1080×1920, then set `THEME.safeArea.content` to the lesson's bounding box.
  - Check key poses with those zones painted red (ffmpeg `drawbox`) before export.
- In Pangolin a lower-case "l" reads as "1" or "I" (as in "6 l"): write "lít" in full.
- Abbreviations like "TBC" must be expanded once on screen, e.g. the first title "Trung bình cộng (TBC)".
- `loop()` around a 2–3 digit answer: give the row `gap: 0.36–0.42` so the circle does not cut the "=" before it.
- The Edge TTS endpoint sometimes returns no audio (`NoAudioReceived`). `voice.mjs` retries up to 4 times.
- A 4 s+ freeze reported by freezedetect can be a hold where only a small chalk circle is drawn. Count it as a dead hold anyway.
