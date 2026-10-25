# Verification and critique: Apples in baskets (English variant of xep_tao_vao_ro)

Length 74.17 s (Vietnamese 70.70 s), 5 beats, 20 voice lines (en-US-AvaNeural, +10%). Scenes are the Vietnamese lesson's own code
(`lessons/xep_tao_vao_ro/scene.js`); only the board text (`TEXT`) and the voiceover differ.

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Vietnamese lesson before vs after the `TEXT` refactor: mean 0.000 on all 5 beats, so the VI output is unchanged (its voice.json, timing and audio are untouched). English vs Vietnamese key poses: same layout on all 5 beats, only the 12 text strings differ (VI/EN strip); every English string fits inside the Vietnamese width. English key poses before vs after the director fixes: mean 0.000 (only timing moved). |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets. It retold all 5 scenes: 7 apples / 3 baskets, examples 2+4+1 = 7 ✓ and 0+7+0 = 7 ✓, the A = 7…0 staircase with 1…8 ways, pairs 1+8, 2+7, 3+6, 4+5 → 9 × 4 = 36, and the 5-apple challenge with no answer shown. Verdict **yes**; the English "mostly reads naturally". Flags: small "B takes:" / "ways" headers, a ~1.5 s still before the first apple flies, the quick 2/4/1 → 0/7/0 move. All come from the shared (approved) Vietnamese layout. |
| 3. Sync | `synccheck.mjs xep_tao_vao_ro_en`: 15 word-anchored windows, 0 off by more than 1 frame. Every number is its own TTS word (checked in `audio/lines/L*.json`); results said with "makes". |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 74.167 s, 48 kHz stereo, −16.0 LUFS, true peak −2.0 dBFS. Silences > 1.2 s: 7.9–11.6 (thinking dots + wipe), 25.7–27.6, 45.0–47.1, 62.9–65.4 (eraser wipes), 70.6–74.2 (countdown 3-2-1, intended). |
| 6. Director's review | Below. |

## Fact check
| On screen / voice | Source (lessons/xep_tao_vao_ro/story.md) |
|---|---|
| 7 identical apples, 3 different baskets, any basket can be empty, how many ways | F1 |
| A 2, B 4, C 1: 2 + 4 + 1 makes 7; B takes all 7: 0 + 7 + 0 = 7; 3 numbers, sum 7 | D1 |
| A has 7 → 1 way, 6 → 2, 5 → 3, … empty → 8; C takes the rest | D2 |
| 1 + 2 + … + 8, pairs of 9, 4 pairs, 9 × 4 makes 36, 36 ways | D3 (asserted in scene.js) |
| Your turn: 5 apples, 3 baskets (answer 21 not said) | D4 |
| "For example", "Comment your answer!" | Narration, no new numbers |

## Director's review (brutal)
1. **Length**: 77.2 s at +6% was 9 % over the Vietnamese cut. Fixed: rate +10% → 75.1 s.
2. **Wordy lines**: "Count by the number of apples in basket A" and "all the way to 8" dragged beat 3/4 openings. Fixed: "Count by the apples in basket A", "up to 8" → 74.2 s.
3. **TTS traps**: "A has 7: 0 left" came back as one token "7: 0" (risk of being read as a clock time) and "36 ways to place" merged into one boundary so the 36 circle could not be cued. Fixed: "A has 7, 0 left: …" and "So there are 36 different ways!".

## Still weak (your call, inherited from the Vietnamese layout)
- "B takes:" and "ways" headers in beat 3 are small on a phone.
- ~1.5 s still at the start of beat 2 before the first apple flies.
- The 2/4/1 → 0/7/0 move is quick.

## Final MP4 (`final/2026-10-25/apples_in_baskets.mp4`)
- 74.167 s, 1080×1920 at 30 fps, H.264 + AAC 48 kHz stereo, −16.0 LUFS, true peak −2.0 dBFS.
- Silences are the same as in the WAV (thinking dots, wipes, the countdown).
- `freezedetect=n=0.001:d=4`: no freeze.
- Published without a separate preview approval (standing rule for English versions); preview: https://hoanghaihung3012.github.io/toan4/xep_tao_vao_ro_en/
