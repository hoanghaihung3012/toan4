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
- Language: Vietnamese by default when no language is named. An English version reuses the existing Vietnamese lesson (story, scenes, assets) as `lessons/<lesson>_en/` with its own voice and board text; never build it from scratch (see the chalkboard-html-lesson skill, "Language versions").

Verification loops (do not skip any):
1. Key-pose match: compare each key pose frame side by side with its key art and fix what differs.
2. Sound-off read: a fresh subagent reviews a silent contact sheet at 2 fps and retells the story. If it can't, fix the staging and repeat.
3. Sync check: every key action and voice line within 1 frame of its timing.json target.
4. Fact check: every word on screen and in the voiceover matched to its source. Cut anything unmatched.
5. Technical: exact duration, stereo audio, peaks below -1 dBFS, no unintended dead air.
6. Director's review: watch it twice as frames, write a brutal critique, fix the top 3 issues, review again.

Approval: one review of the running HTML preview.
1. Complete facts, story, storyboard, scenes, audio and timing without asking for intermediate approval. Run all applicable verification loops before presenting the preview.
2. Publish the HTML preview to GitHub Pages with `npm run pages -- <lesson>` (working voiceover and playback controls, opens on a phone at `https://hoanghaihung3012.github.io/toan4/<lesson>/`). `npm run pages` also sends the link to my Zalo review group (token from the `ZALO_BOT_TOKEN` environment secret, never committed). Show that Pages link, contact sheet and critique, then wait for my approval. Show the work, not just a description of it.
3. If I request changes, fix them, rerun the affected verification loops (always including sync), republish with `npm run pages -- <lesson>` and return to the same preview review. Do not add separate approval gates for story, style, key poses or audio.
4. Export the final MP4 as soon as I approve the Pages preview with `npm run final -- <lesson>`, which writes `final/<lesson>.mp4` (an English version is named in English with no `_en`, from `voice.json` `"final"`, e.g. `final/divisibility_rules.mp4`; all finished MP4s live in the repo-root `final/` folder, not inside the lesson), then complete the final technical checks. No separate final-video approval is required. Update the reusable skill only when explicitly requested.

Git workflow for each new lesson:
1. Create a new branch named `lesson/<lesson-name>` from the latest `develop` before starting lesson work. Keep any unrelated uncommitted changes intact.
2. Keep the lesson's content, audio and scene code in `lessons/<lesson-name>/`. Reuse `shared/web/`, `shared/fonts/` and `render/` for common functionality.
3. Commit and push the lesson branch, then open a pull request with `develop` as the base branch. Include the lesson summary, preview and verification results in the PR description.
4. Do not commit lesson work directly to `develop` or `main`, and do not merge the PR unless explicitly requested.

Keep a task list throughout.