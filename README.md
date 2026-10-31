# Chalkboard Lessons

## Layout

`lessons/` and `final/` are grouped by day, then lesson or final name.

```text
lessons/<YYYY-MM-DD>/<lesson>/
final/<YYYY-MM-DD>/<name>/<name>.mp4
final/<YYYY-MM-DD>/<name>/youtube.txt
```

- `<YYYY-MM-DD>` is the day the clip was made in Vietnam time.
- New lessons are Vietnamese 9:16 Shorts. Format and language are not directory levels.

Lesson names stay unique across the tree, so commands take the lesson name and
`render/paths.mjs` finds its folder. Create a lesson with
`npm run new -- <lesson> [--date YYYY-MM-DD]`.

Scene modules import the shared engine from `../../../shared/web/js/` and the theme from
`../../../shared/web/theme.js`. A lesson's timing uses `"scene": "./scene.js"` and, when voiced,
`"audio": "./audio/voice.wav"`, both relative to the timing file.

```sh
npm run preview
npm run voice -- trung_binh_cong
npm run sync -- trung_binh_cong
npm run pages -- trung_binh_cong
npm run keyposes -- --lesson trung_binh_cong
npm run sheet -- --lesson trung_binh_cong --every 0.5
npm run final -- trung_binh_cong
npm test
```

Final videos and metadata are grouped at `final/<YYYY-MM-DD>/<lesson>/`.

## Reusable Chapters

The cake lesson now exports `createScenes({ text, layout })` as well as the default
Vietnamese `scenes`. Each call snapshots its configuration, including text arrays;
English and Vietnamese instances can coexist without changing each other. Other
lessons retain their existing exports and can migrate independently.

`shared/composition/chapters.js` exports `composeChapters(chapters, options)`:

```js
const production = composeChapters([
  { id: 'worked', scenes: createScenes(), timing: workedTiming },
  { id: 'practice', scenes: createScenes({ text: practiceText }), timing: practiceTiming },
], { scene: './scene.js', audio: './audio/voice.wav' });
```

- Inputs are generated chapter timing objects and scene registries, not guessed durations.
- Output `scenes` namespaces each beat (`worked.beat1`), including previous-board references.
- Output `timing` offsets all windows, records chapter boundaries in `sections`, and keeps
  the existing player contract. Chapters must have matching FPS and continuous beat ranges.
- Output `audioSegments` records each source track's offset and duration. Resolve source
  audio URLs relative to their original chapter timing files before composing.
- Narrated chapters require an explicit combined audio URL. This helper does not mix audio,
  write production files, or rebuild voice cues. The caller must assemble the track at the
  returned offsets, export `production.scenes` from the production scene module, and write
  `production.timing` as its timing file. Existing voice/sync tools still operate on individual
  chapters; combined narration and cue generation need a separate orchestration step.

Long videos use scenes (above), not this composer: each scene keeps its own audio, timing and MP4.

Use chapter-local verification plus a whole-production continuity and audio check. The
composer introduces no automatic board wipe between chapters: author transitions explicitly.
Canvas dimensions remain the shared portrait profile; landscape layout and cached chapter
capture are separate follow-up work. Existing Shorts and dated folder paths are unchanged.

## Commands

Run commands from the project root:

```sh
npm run preview
# http://localhost:8123/shared/web/index.html?lesson=trung_binh_cong
# http://localhost:8123/shared/web/index.html?lesson=dau_hieu_chia_het
# http://localhost:8123/shared/web/index.html?lesson=decimal (default)
# /lessons/<lesson>/... redirects to the lesson's dated folder

npm run voice -- trung_binh_cong
npm run sync -- trung_binh_cong
npm run pages -- trung_binh_cong   # review on a phone: https://hoanghaihung3012.github.io/toan4/trung_binh_cong/
npm run zalo -- "text"            # message the Zalo review group (needs ZALO_BOT_TOKEN; pages sends its link itself)
npm run youtube -- que_diem_en --dry-run   # English clips only; npm run final uploads them itself
npm run keyposes -- --lesson trung_binh_cong
npm run sheet -- --lesson trung_binh_cong --every 0.5
npm run export -- --lesson trung_binh_cong
npm test
```

Capture and inspection default to the selected lesson's `out/` directory.
`--timing lessons/<date>/<lesson>/timing.json`, `--dir`, and `--out` remain available
for explicit paths. MP4 capture still produces video only; mux it with the
lesson's `audio/voice.wav` after preview approval.

The existing root `out/` folder is retained for previous exports and comparisons.
Both root and lesson-local `out/` folders are ignored by Git. After approval,
`npm run final -- <lesson>` captures, muxes the voiceover and writes the grouped deliverable
`final/<YYYY-MM-DD>/<name>/<name>.mp4` plus `youtube.txt` containing title, description and tags.
The folder name is `voice.json`'s `final` value when set, otherwise the lesson name. `--date` overrides the day. TTS line caches
move with their lesson, so moving a lesson does not require synthesizing it again.

## YouTube Shorts (English channel)

`npm run final -- <lesson>` publishes an English Shorts lesson (`voice.json` `"lang": "en"`,
folder format `shorts`) right
after the MP4 is written: it uploads it to the English YouTube channel as a Short, adds it to the
channel's playlist **Math** (created if missing; `voice.json` `"youtube": { "playlist" }`
overrides it), and sends **one** Zalo message with the Pages preview link and the Short
(`npm run pages` sends nothing for an English lesson). The Short is public by default
(`YT_PRIVACY` or `--privacy` overrides it; a re-run switches an earlier upload to it), audience not made for kids, category Education.
Title, description and tags come from the lesson's `story.md` heading and voiceover lines, or
from an optional `voice.json` `"youtube": { "title", "description", "tags" }`. The upload writes
`final/<date>/<name>/<name>.youtube.json` (video id, link, playlist, Zalo time); each step is done once,
and a re-run only finishes the missing ones. Commit it with the MP4. Vietnamese clips keep the old
flow (Zalo preview link from `npm run pages`, no upload). `--no-upload` skips it, and
`npm run youtube -- <lesson> [--dry-run] [--force] [--no-zalo]` runs it by hand for an earlier export.
Long-format lessons are never passed to automatic Shorts publishing, and direct
`npm run youtube` calls reject them too. Long-video publishing remains manual.

One-time setup (Google account that owns the English channel):
1. Google Cloud console: create a project, enable **YouTube Data API v3**.
2. OAuth consent screen: External, add yourself as a user, then **Publish app** ("In production";
   in "Testing" the refresh token expires after 7 days).
3. Credentials: create an OAuth client ID of type **Desktop app**.
4. On your own computer: set `YT_CLIENT_ID` and `YT_CLIENT_SECRET`, run `npm run youtube:auth`,
   open the link, allow access, and copy the printed `YT_REFRESH_TOKEN`. The token must carry the
   `youtube` scope (the script asks for it); a token made for `youtube.upload` only cannot use the
   playlist, so run the script again.
5. Save `YT_CLIENT_ID`, `YT_CLIENT_SECRET` and `YT_REFRESH_TOKEN` as cloud-environment secrets.
   Never commit them or paste them into a chat.

Until YouTube audits the API project, every API upload stays private; switch it to public in
YouTube Studio. The default quota (10,000 units a day) covers a few uploads a day.
