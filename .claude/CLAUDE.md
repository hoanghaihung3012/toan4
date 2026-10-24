Rules:
- The video must read with the sound off.
- Only use facts I give you or that you can source. No made-up numbers or claims.
- Use text sparingly and integrate it into the world (painted, stamped, written) rather than overlaying it.
- Generated images are references only. They never appear on screen; draw the video in code.
- When creating the storyboard, generate only 1 image first so I can check the style. Wait for my approval before generating the rest.
- The timing comes from the audio. All animation timing reads from timing.json, with nothing hardcoded.
- Anticipation before every big action, follow-through after, squash and stretch, springs for landings, arcs for every moving object, and no linear easing.
- Held props and text never mirror when a character turns. Motivate every camera move.
- Sound generates free using Edge TTS
- Generate source code in the folder, split files then we can reuse, split scenes if needed
- Video format 9:16 to upload to tiktok

Verification loops (do not skip any):
1. Key-pose match: compare each key pose frame side by side with its key art and fix what differs.
2. Sound-off read: a fresh subagent reviews a silent contact sheet at 2 fps and retells the story. If it can't, fix the staging and repeat.
3. Sync check: every key action and voice line within 1 frame of its timing.json target.
4. Fact check: every word on screen and in the voiceover matched to its source. Cut anything unmatched.
5. Technical: exact duration, stereo audio, peaks below -1 dBFS, no unintended dead air.
6. Director's review: watch it twice as frames, write a brutal critique, fix the top 3 issues, review again.

Approval gates:
1. Facts + story
2. Style: 1 storyboard image first → wait for my approval. Then character sheets and key poses - wait for my approval
3. Audio-only mix and timing.json
4. Final video, contact sheet and critique
5. Save the process as a skill

Keep a task list throughout. At each gate, show me the work, not a description of it.