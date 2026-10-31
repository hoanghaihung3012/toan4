# Đặt gương ở đâu? (18 + 18): verification + director's critique

Length 53.5 s · 6 beats on one board (no eraser) · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses from the voice timing match the reference set (mean diff 0.000 on all 6 beats). The reference was retaken on purpose after each fix pass below (pass 1: shorter sight line, mean 0.016; pass 2: comparison row, bigger labels). |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold all 4 tries and the answer D = 280, verdict **mostly**. It flagged that nothing showed *why* D wins, small labels, and holds at 41–47 s. Fixed. Pass 2 (new subagent): retold the question, A 181, B 1881 crossed out (> 1000), C 99, D 280, the comparison 99 < 181 < 280, and that D wins as the largest result not over 1000. Verdict **mostly** (points left under "Still weak"). |
| 3. Sync | 29 word-anchored windows, 0 off by more than 1 frame (`node render/synccheck.mjs dat_guong`). |
| 4. Fact check | Table below. `console.assert` in scene.js rebuilds every mirrored string, its sum and the pick D, and counts the cut + flipped bars of the drawing. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 53.500 s, −16.0 LUFS, true peak −2.6 dBFS. Only silence > 1.2 s: 8.3–11.9 s, the 3-2-1 countdown (intended). |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| "18 + 18", the eye on the left, places A, B, C, D | User's image (Sheet column "Câu hỏi hình") |
| "lớn nhất, không quá 1000" / "kết quả lớn nhất, mà không quá 1000" | User's image: "the largest calculated number, not exceeding 1000" |
| The eye sees the part left of the mirror plus its flipped image | How a plane mirror reflects (the eye is on the left in the image) |
| A → 181 (half an 8 flips into a whole 8) | Derived from the image |
| B → 18 + flipped 81 = 1881 > 1000, loại | Derived + the 1000 limit |
| C → + flips into +, 18 + 81 = 99 | Derived, computed |
| D → 18 + 181 + 81 = 280 | Derived, computed |
| 99 < 181 < 280, largest ≤ 1000 is 280 → D | Computed |
No web page with this exact problem was found, so every number comes from the user's image plus arithmetic. The "[4.3 points]" in the image is left out.

## Director's critique, pass 1 (brutal)
1. **The "+" read as "÷"**: the vertical bars of the plus had gaps around the middle bar. **Fixed:** solid cross.
2. **The glass covered the made-whole digit** (row A read "1|81"). **Fixed:** in the rows the glass stands behind the wooden bars.
3. **Dead holds** at 38.5–40.3 s (D done, waiting for "bằng 280"), 45–47.5 s and the last 3 s. **Fixed:** D's reflection now unfolds while "18 cộng 181 cộng 81" is read; "1000" pulses on "không quá 1000"; the mirror glints and ✓ hops on the last line.
Also: sun sparks over "1000" replaced by a burst that flies off, results right-aligned so "= 280" no longer touches "81".

## Director's critique, pass 2
1. **Nothing showed why D wins** (sound-off reader). **Fixed:** "99 < 181 < 280" is written under the rows while the voice compares, 280 in yellow.
2. **Labels too small.** **Fixed:** A–D under the display 58 → 64 px, row letters 70 → 82 px.
3. **"= 280" loop poked into the TikTok right rail.** **Fixed:** loop narrowed (rx 135 → 122).

## Still weak (your call)
- The condition line "lớn nhất, không quá 1000" and "> 1000" are on the small side for a phone (64 / 58 px).
- Row D (18 + 181 + 81) is dense: 9 glyphs at 120 px digit height so the row fits next to "= 280".
- 17.5–20.5 s: row A is done and only the loop around the 8 is drawn while the voice explains (~3 s).
- The lower ~320 px stay empty by design (TikTok caption area, `THEME.safeArea`).

## Final MP4 (after preview approval)
`final/2026-10-25/dat_guong.mp4`: 53.50 s, 1080×1920 @ 30 fps H.264, AAC 48 kHz stereo, −16.0 LUFS, true peak −2.6 dBFS. silencedetect (> 1.2 s): 8.3–11.9 s only (3-2-1 countdown). freezedetect (n = 0.001, d = 4 s): 17.3–22.3 s and 25.7–29.8 s. In both, only small chalk marks change (the loop round the 8 and "= 181"; the loop round "81" and "= 1881" + the red cross), so they count as weak holds (see "Still weak").
