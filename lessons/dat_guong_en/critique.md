# Where should the mirror go? (18 + 18), English version: verification + director's critique

Length 54.9 s (Vietnamese 53.5 s) · same 6 beats on one board · voice en-US-AvaNeural, rate +6 %. Scenes, motion and layout are the Vietnamese lesson's (`lessons/dat_guong/`); see its critique.md for the original review passes.

## Verification loops
| Loop | Result |
|---|---|
| 0. Vietnamese unchanged | Board words moved into `TEXT` / `FIT` in `lessons/dat_guong/scene.js`. Vietnamese key poses before vs after: mean 0.000, max 0 on all 6 beats. Its voice.json, timing and audio are untouched. |
| 1. Key-pose match | VI/EN strip (`keypose_compare.png`): same layout on all 6 beats; only the title and the condition line differ. The English title is longer, so `FIT.titleUnderline` 470 → 760. |
| 2. Sound-off read | Fresh subagent on the 2 fps sheets retold the question, A = 181, B = 1881 crossed out (> 1000), C = 18 + 81 = 99, D = 18 + 181 + 81 = 280, the comparison 99 < 181 < 280 and the answer D. Verdict **mostly** (same as the Vietnamese pass 2). It found "Where to put the mirror?" stiff: changed to "Where should the mirror go?". |
| 3. Sync | 28 word-anchored windows, 0 off by more than 1 frame (`npm run sync -- dat_guong_en`). Word lists checked: no merged number tokens (L12 says "280 is the largest…" because "is 280" would merge into one word boundary). |
| 4. Fact check | Every English line is a translation of a Vietnamese line (story.md table); every number (18 + 18, 181, 1881, 1000, 99, 280) is the Vietnamese lesson's, from the source image plus arithmetic, asserted in scene.js. "largest, not over 1000" matches the source's "largest calculated number, not exceeding 1000". Nothing new added. |
| 5. Technical | voice.wav: 48 kHz stereo, 54.900 s, true peak −1.5 dBFS. Only silence > 1.2 s: 8.3–11.9 s, the 3-2-1 countdown (intended, as in Vietnamese). |
| 6. Director's review | Below. |

## Director's critique (English pass)
1. **Title read stiff** ("Where to put the mirror?"). **Fixed:** "Where should the mirror go?", which is also how the voice opens.
2. **Title underline too short** for the longer English title. **Fixed:** 760.
3. **3.9–5.8 s**: only the "?" while the voice says "There are 4 spots". About 2 s, under the 3 s limit, and the "?" nods on each letter. Left as is.

## Still weak (your call, same as Vietnamese)
- The mirror rule (left part + its flipped image) is shown by the sight line and the cream/mint colours, not spelled out; the sound-off reader found A and D the hardest to follow.
- "largest, not over 1000" and "> 1000" are small for a phone (64 / 58 px).
- Row D is dense; the lower ~320 px stay empty by design (TikTok caption zone).

## Final MP4
`final/2026-10-25/where_should_the_mirror_go.mp4`: 54.90 s, 1080×1920 @ 30 fps H.264, AAC 48 kHz stereo, true peak −1.5 dBFS. silencedetect (> 1.2 s): 8.3–11.9 s only (3-2-1 countdown). freezedetect (n = 0.001, d = 4 s): 17.8–22.4 s, 25.0–29.2 s and 50.0–54.9 s. Only small chalk marks change in them (the loop round the 8 and "= 181"; the loop round "81", "= 1881" and the red cross; the ✓ hop and mirror glint at the end), the same weak holds as the Vietnamese clip.
