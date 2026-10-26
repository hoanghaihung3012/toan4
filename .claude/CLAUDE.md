Rules:
- The video must read with the sound off.
- Only use facts I give you or that you can source. No made-up numbers or claims.
- Use text sparingly and integrate it into the world (painted, stamped, written) rather than overlaying it.
- Generated images are references only. They never appear on screen; draw the video in code.
- When creating the storyboard, generate 1 image first and self-check the style before generating the rest. Do not pause for approval.
- The timing comes from the audio. All animation timing reads from timing.json, with nothing hardcoded.
- Anticipation before every big action, follow-through after, squash and stretch, springs for landings, arcs for every moving object, and no linear easing.
- Held props and text never mirror when a character turns. Motivate every camera move.
- Sound generates free using Edge TTS
- Generate source code in the folder, split files then we can reuse, split scenes if needed
- Video format 9:16 to upload to tiktok
- Long videos (16:9 YouTube, e.g. solving an exam): one scene per problem, each with its own HTML page and its own MP4 (scene1.mp4, scene2.mp4, ...); the lesson's preview page plays the scene pages in sequence (see the chalkboard-html-lesson skill, "Long videos").
- Language: Vietnamese by default when no language is named. An English version reuses the existing Vietnamese lesson (story, scenes, assets) as `lessons/<YYYY-MM-DD>/<long|shorts>/en/<lesson>_en/` with its own voice and board text; never build it from scratch (see the chalkboard-html-lesson skill, "Language versions").

Verification loops (do not skip any):
1. Key-pose match: compare each key pose frame side by side with its key art and fix what differs.
2. Sound-off read: a fresh subagent reviews a silent contact sheet at 2 fps and retells the story. If it can't, fix the staging and repeat.
3. Sync check: every key action and voice line within 1 frame of its timing.json target.
4. Fact check: every word on screen and in the voiceover matched to its source. Cut anything unmatched.
5. Technical: exact duration, stereo audio, peaks below -1 dBFS, no unintended dead air.
6. Director's review: watch it twice as frames, write a brutal critique, fix the top 3 issues, review again.

Approval: none (2026-10-26). Vietnamese and English versions alike: publish to Pages, export the final MP4 and open the PR straight away; only when the PR is open, send the preview link and tell me it is done.
English versions: `npm run final` uploads the YouTube Short and sends the one Zalo message.
1. Complete facts, story, storyboard, scenes, audio and timing without asking for approval. Run all applicable verification loops before publishing.
2. Publish the HTML preview to GitHub Pages with `npm run pages -- <lesson> --no-zalo` (working voiceover and playback controls, opens on a phone at `https://hoanghaihung3012.github.io/toan4/<lesson>/`). Do not wait for approval.
3. Export the final MP4 right away (step 4), commit it, push and open the PR. Then, for a Vietnamese lesson, run `npm run pages -- <lesson>` again: it sends the link to my Zalo review group (token from the `ZALO_BOT_TOKEN` environment secret, never committed). Then send me one message with the Pages link, PR, MP4, contact sheet and critique and say it is done. Show the work, not just a description of it. If I request changes later, fix them, rerun the affected verification loops (always including sync), republish, re-export and push to the same PR.
4. Export the final MP4 with `npm run final -- <lesson>`, which writes `final/<YYYY-MM-DD>/<long|shorts>/<en|vi>/<lesson>.mp4`, in the same day/format/language folders as the lesson (an English version is named in English with no `_en`, from `voice.json` `"final"`, e.g. `final/2026-10-25/shorts/en/divisibility_rules.mp4`; all finished MP4s live in the repo-root `final/` folder, not inside the lesson), then complete the final technical checks. For an English version, `npm run final` then uploads the MP4 to the English YouTube channel as a public Short, audience not made for kids, adds it to the playlist "Math", and sends ONE Zalo message with both the Pages preview link and the Short link (`render/youtube.mjs`, secrets `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`; `npm run pages` sends no Zalo message for an English version; writes `final/<date>/<format>/<lang>/<name>.youtube.json`, commit it with the MP4 and put the Short link in the PR). Vietnamese clips: the Zalo preview link comes from the second `npm run pages` after the PR, no YouTube upload. No approval is required. Update the reusable skill only when explicitly requested.

Git workflow for each new lesson:
1. Create a new branch named `lesson/<lesson-name>` from the latest `develop` before starting lesson work. Keep any unrelated uncommitted changes intact.
2. Keep the lesson's content, audio and scene code in `lessons/<YYYY-MM-DD>/<long|shorts>/<en|vi>/<lesson-name>/` (day the clip is made in Vietnam time, the requested format with `shorts` as the default, the voiceover language); create it with `npm run new -- <lesson-name> [--lang en] [--format long]`. `lessons/` and `final/` share this layout, and lesson names stay unique so every command takes just the name. Reuse `shared/web/`, `shared/fonts/` and `render/` for common functionality.
3. Commit and push the lesson branch, then open a pull request with `develop` as the base branch. Include the lesson summary, preview and verification results in the PR description.
4. Do not commit lesson work directly to `develop` or `main`, and do not merge the PR unless explicitly requested.

Keep a task list throughout.