# Câu 7: que diêm, hình thứ 99: verification + director's critique

Length 62.1 s · 8 beats · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the voice timing equal the reference set (mean diff 0.000 on all 8 beats). The reference set was retaken on purpose twice: after the layout pass (bigger figures, no sparks over labels) and after the sound-off fixes below. |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold 6 → 11 → 16 (+5), 1 + 5 × 99 = 496, B, and the challenge 51; verdict **mostly**. It flagged a faint shared-wall loop, a tiny "1" and a tiny crossed-out count. Fixed (see below). Pass 2 (new subagent): retold the same, including "shared wall → +5"; verdict **mostly** (remaining points under "Still weak"). |
| 3. Sync | 31 word-anchored windows, 0 off by more than 1 frame (`node render/synccheck.mjs que_diem`). |
| 4. Fact check | Table below; `console.assert` in scene.js counts the sticks of the drawn figures (6, 11, 16, and 5n + 1 for n ≤ 12) and checks 1 + 5 × 99 = 496 = option B, 1 + 5 × 10 = 51. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 62.067 s, −15.9 LUFS, true peak −3.3 dBFS. Silences > 1.2 s: 6.0–7.8 (eraser), 28.7–30.6 (eraser), 48.5–50.5 (eraser), 54.5–57.9 (3-2-1 countdown), 60.8–62.1 (end tail on the answer). All intended. |
| 6. Director's review | Two passes; top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| "Câu 7", "Hình 99", the figures (houses of matchsticks, figure n = n houses) | User's image of the problem |
| Options A 563, B 496, C 586 | User's image |
| Hình 1 = 6 que (counted 1–6) | Counted on the user's image |
| Hình 2: bức tường ở giữa "dùng chung", thêm 5 que, 6 + 5 = 11 | Counted on the user's image (7 sticks for 2 squares + 4 roof sticks) |
| Hình 3: thêm 5 que, 11 + 5 = 16 | Counted on the user's image |
| "Mỗi ngôi nhà cần 5 que, cộng thêm 1 que tường đầu tiên"; Hình 3: 1 + 5 × 3 = 16 | Derived from the counts above |
| Hình 99: 1 + 5 × 99 = 1 + 495 = 496 → B | Computed |
| Thử thách hình 10: 1 + 5 × 10 = 51 | Computed |
No web page with this exact problem was found, so every number comes from the user's image plus arithmetic.

## Director's critique, pass 1 (brutal)
1. **The shared wall only got a thin circle while the voice explained it for ~2 s** (17–20 s). **Fixed:** the wall hops while a thicker yellow loop is drawn, and "dùng chung" is written under it.
2. **Static hold at 44–46.5 s** ("Cộng 1, được…"). **Fixed:** the "1" in "= 1 + 495" pulses yellow on "Cộng 1".
3. **~1 s of empty board after each eraser.** **Fixed:** lead after a wipe 1.3 → 1.05 s.
Also: figures enlarged (L 150 → 170/190 px), the "+5" moved between the rows, spark marks that covered labels replaced by bursts that fly off.

## Director's critique, pass 2
1. The hook's crossed-out "1, 2, 3, …" was small: **fixed** (76 → 92 px, thicker red cross).
2. The "1" for the first wall was small and squeezed: **fixed** (96 → 130 px), brackets "5" 84 → 100 px.
3. The burst around option B ran over "496 que": **fixed** (radius 190 → 140).

## Still weak (your call)
- The link "Hình 1 = 6 = 1 + 5" is only implied: the formula is shown on Hình 3, not on Hình 1.
- The 5 new sticks of Hình 2 fly in but are not numbered one by one (only "+5").
- The bottom ~300 px of the board stays empty by design (TikTok caption area, `THEME.safeArea`).
- Text sizes are tuned for 1080×1920; on a small phone the stick numbers (84 px) are the smallest marks.

## Preview
Running HTML preview with voiceover: https://claude.ai/artifact/3Xc2GwkBzeF2UWqXLSZE9J (copy of `shared/web` + this lesson; audio as MP3 for the page host).
Final MP4 is exported only after approval.
