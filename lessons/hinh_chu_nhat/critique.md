# Câu 8: Hình 6 gồm bao nhiêu hình chữ nhật? — verification + director's critique

Length 59.2 s · 8 beats · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the voice timing equal the reference set (mean diff 0.000 on all 8 beats). The reference set was retaken on purpose after the layout pass (bigger cells, hook labels) and after the sound-off fixes below. |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold 1, 3, 6 → 6+5+4+3+2+1, pairs of 7, 7 × 3 = 21 = A, and 55. Verdict **mostly**. It flagged three problems: what is being counted, the "× 5" in the challenge, and the countdown, which could be read as answers. Fixed (see below). Pass 2 (new subagent): it read the "= 1 hình chữ nhật" key and "11 (5 cặp)"; verdict **mostly** (remaining points under "Still weak"). |
| 3. Sync | 33 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; `console.assert` in scene.js checks 1, 3, 6 cells for figures 1–3, the pairs 6+1 = 5+2 = 4+3 = 7, 7 × 3 = 21 = option A, and 1 + … + 10 = 11 × 5 = 55. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 59.233 s, −16.0 LUFS, true peak −2.9 dBFS. Silences > 1.2 s: 4.2–5.8 (eraser), 23.1–24.7 (eraser), 43.6–45.7 (eraser), 49.7–53.0 (3-2-1 countdown), 58.0–59.2 (end tail). All intended. |
| 6. Director's review | Two passes; top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| "Câu 8", Hình 1–3 (staircase of small rectangles), question "Hình 6 gồm bao nhiêu hình chữ nhật?" | User's image of the problem |
| Options A 21, B 15, C 24 | User's image |
| "Mỗi ô là một hình chữ nhật" / "= 1 hình chữ nhật" | Interpretation that matches the given options (1, 3, 6 cells in figures 1–3; 21 = 1 + … + 6 is option A). Counting composite rectangles would give 5 already for figure 2 and no option for figure 6 |
| Hình 1 = 1; Hình 2 = 2 + 1 = 3; Hình 3 = 3 + 2 + 1 = 6 | Counted on the user's image |
| "Mỗi hình mới thêm một hàng ở dưới, dài hơn 1 ô" | Read off figures 1–3 |
| Hình 6: 6, 5, 4, 3, 2, 1; 6+1 = 5+2 = 4+3 = 7; 7 × 3 = 21 → A | Computed |
| Hình 10: 5 cặp × 11 = 55 | Computed |
No web page with this exact problem was found, so every number comes from the user's image plus arithmetic.

## Director's critique, pass 1 (brutal)
1. **6.5–10.5 s: one lone cell on the board for ~4 s** while the voice says "Mỗi ô là một hình chữ nhật. Đếm từng hàng nhé." **Fixed:** "= 1 hình chữ nhật" is written next to the outlined cell, then winds up and shrinks away when "Hình 1" is written.
2. **31 s: number blocks fell through Hình 6** (drop height 300 px). **Fixed:** drop height 140 px, so they land just under the figure.
3. **Cells read as thin strips; "Hình 3" in the hook was cut off.** **Fixed:** cells 96×50 → 120×66 (hook), 130×66 → 150×84 (count board), 105×56 → 110×72 (Hình 6), 62×32 → 64×44 (Hình 10); hook labels finish writing.

## Director's critique, pass 2
1. **Countdown digits under "Hình 10 = ?" read like candidate answers** (sound-off reader). **Fixed:** they now run inside a yellow timer ring.
2. **"× 5" came from nowhere.** **Fixed:** the 1↔10 arc is labelled "11 (5 cặp)".
3. "7" labels overlapped the pair brackets: **fixed** (moved 40 px down, the rows below follow).

## Still weak (your call)
- The video does not say why bigger rectangles made of several cells are not counted. It only shows "1 ô = 1 hình chữ nhật", which is the reading the given options imply.
- The mint "new row" highlight (21.5–24 s) needs the voice to mean "a longer row is added at the bottom".
- Hình 10's pairs are shown with one arc (1↔10) plus "5 cặp", not as tiles pairing like Hình 6.

## Preview
Running HTML preview with voiceover: https://claude.ai/artifact/SwxSWapB1GQbsJPA75DCVq. The final MP4 is exported only after approval.
