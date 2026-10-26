# Verification and critique: Age puzzles (English variant of tinh_tuoi)

Length 109.53 s (Vietnamese 102.57 s), 7 beats, 31 voice lines (en-US-AvaNeural, +12%). Scenes are the Vietnamese lesson's own code
(`lessons/tinh_tuoi/scene.js`); only the board text (`TEXT`), a few `FIT` sizes and the voiceover differ.

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Vietnamese lesson before vs after the `TEXT`/`FIT` refactor: mean 0.000 on all 7 beats, so the VI output is unchanged (its voice.json, timing and audio are untouched). English vs Vietnamese key poses: same layout on all 7 beats, only the text differs (VI/EN strip `keypose_compare.png`). Safe-area check with the 55 px side crop painted red: "Now: Dad + Kid = 48" and the "Mom" bar label first ran into the crop; fixed with `FIT.r1Size` 112 and `FIT.nameScale` 0.8. |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets. It retold all 7 scenes: 48 total, 4 years ago Dad = 4 × Kid → 48 − 4 − 4 = 40 → 40 ÷ 5 = 8 → 32 → Dad now 36, check 36 + 12 = 48; Mom 35 / Kid 7 → gap 28 stays as both bars grow → 3 − 1 = 2 parts → 14 → 7 years, 42 = 3 × 14; the 2 tips. Verdict **yes**. Flags: ":" for division is not English notation, "Total then:" vague (both fixed); "12" in the check is never derived on the board, small "+1" marks and bar labels, hold ≈ 42–45 s (inherited from the Vietnamese layout). |
| 3. Sync | `synccheck.mjs tinh_tuoi_en`: 29 word-anchored windows, 0 off by more than 1 frame. Word lists checked in `audio/lines/L*.json`: Edge TTS merges "40 years", "7 years", "4 years", "1 year" into one boundary, so no window anchors on a number followed by "years" (L8/L16/L18/L22 say the number last; L25 anchors on "from"). |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 109.533 s, 48 kHz stereo, −16.2 LUFS, true peak −1.5 dBFS. Silences > 1.2 s: 9.0–12.7 (thinking dots + wipe), 21.4–23.4, 47.3–49.4, 71.2–73.3, 96.3–98.8 (eraser wipes), 55.9–59.6 (thinking dots + wipe), 108.2–109.5 (end tail). |
| 6. Director's review | Below. |

## Fact check
| On screen / voice | Source (lessons/tinh_tuoi/story.md) |
|---|---|
| Dad + child = 48 now; 4 years ago Dad = 4 × child; how old is Dad now | F1 |
| 48 − 4 − 4 = 40 | D1 |
| 1 + 4 = 5 parts, 40 ÷ 5 = 8, 8 × 4 = 32 | D2 |
| Dad now 32 + 4 = 36; check child 12, 36 + 12 = 48 | D3 |
| Mom 35, daughter 7; in how many years is Mom 3 × daughter | F2 |
| 35 − 7 = 28, the gap never changes (+1 a year each; bars 36/8 … 38/10 are an illustration) | D4 |
| 3 − 1 = 2 parts = 28, 28 ÷ 2 = 14, 14 − 7 = 7 years, 35 + 7 = 42 = 3 × 14 | D5 (asserted in scene.js) |
| "Remember 2 tips", "Liked it? Leave a comment!" | Narration, no new numbers |

## Director's review (brutal)
1. **Length:** the first English cut ran 117.5 s at +6% (15 % over the Vietnamese). Fixed: rate +12% and shorter lines ("4 years ago: the child is 1 part…", "That is 5 parts…", "When Mom is 3 times her daughter's age:") → 109.5 s (+7 %).
2. **Cropped edge:** "Now:" and "Mom" sat under the 55 px platform crop on the left. Fixed with two `FIT` values (defaults keep the Vietnamese layout).
3. **Non-English notation and vague label:** "40 : 5" read as a ratio to an English viewer and "Total then:" was vague. Fixed: `TEXT.div` = "÷" and "Total 4 years ago:".

## Still weak (your call, inherited from the Vietnamese layout)
- The check "36 + 12 = 48" uses Kid now = 12, which is only said in the voice, not written.
- "+1" marks and bar-name labels are small on a phone.
- ≈ 3 s hold around 42–45 s while the voice says "So now Dad is 32 plus 4…" before the circle.

## Final MP4 (`final/2026-10-25/age_puzzles.mp4`)
- 109.533 s, 1080×1920 at 30 fps, H.264 + AAC 48 kHz stereo, −16.2 LUFS, true peak −1.5 dBFS.
- Silences are the same as in the WAV (thinking dots, wipes, end tail).
- `freezedetect=n=0.001:d=4`: no freeze.
- Published without a separate preview approval (standing rule for English versions); preview: https://hoanghaihung3012.github.io/toan4/tinh_tuoi_en/
