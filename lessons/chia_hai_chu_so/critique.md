# Chia cho số có hai chữ số (68917 : 85): verification + director's critique

Length 70.5 s · 9 beats · voice vi-VN-HoaiMyNeural, rate +10 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the voice timing equal the reference set (mean diff 0.000 on all 9 beats). The reference was re-taken once on purpose after the sound-off fixes below (new scratch notes, larger step strip, timer countdown). |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): followed the flow and the answer 810 dư 67 / 107, but said taking 689, the "che" trick and the products 680 / 85 only lived in the voice; verdict "mostly no". Fixed (see below). Pass 2: retold every quotient digit correctly, verdict "yes, mostly" (section at the end). |
| 3. Sync | 37 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below: every number and claim matched to a source or computed from one; `console.assert` in scene.js re-checks the arithmetic. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 70.5 s, −16.0 LUFS, true peak −3.6 dBFS. Silences > 1.2 s: 6.2–7.6 (eraser + regroup), 48.3–50.0 (scratch eraser), 54.3–56.4 (full board wipe), 61.4–65.2 (3-2-1 countdown) — all intended. |
| 6. Director's review | Two passes; top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| 68917 : 85 | User's example |
| Chia từ trái sang phải; mỗi lượt chia → nhân → trừ → hạ, viết tích dưới rồi trừ | Loigiaihay, Lý thuyết chia cho số có hai chữ số (672 : 21: "67 chia 21 được 3 … 67 trừ 63 … Hạ 2, được 42") |
| Lấy 689 vì 68 < 85 | VietJack KNTT Bài 44 (245 678 : 56 starts with "245 chia 56") + arithmetic |
| Mẹo che chữ số cuối: 68 : 8 → 8 | VietJack Toán 4 tr. 81 ("Che chữ số 0 và 5 ta có 29 : 4 được 6") |
| 8 × 85 = 680; 689 − 680 = 9; 9 < 85 nên đúng | Computed; "20 < 45 vậy ta ước lượng đúng" (VietJack tr. 81) |
| Hạ 1 → 91; 91 : 85 → 1; 1 × 85 = 85; 91 − 85 = 6 | Computed (method above) |
| Hạ 7 → 67; 67 < 85 → 0, viết 0 vào thương | Loigiaihay, Lý thuyết thương có chữ số 0 ("Hạ 4; 4 chia 24 được 0, viết 0") |
| 68917 : 85 = 810 (dư 67) | Computed; 85 × 810 + 67 = 68917 |
| Thử thách 2996 : 28 = 107 | VietJack Toán 4 tr. 85 (Thương có chữ số 0, Bài 1b); 28 × 107 = 2996 |
| "4 bước: chia, nhân, trừ, hạ" | The four verbs of each turn in the Loigiaihay worked example |

## Director's critique, pass 1 (brutal)
1. **The reasoning was voice-only** (sound-off reader): 689, the cover trick and the products appeared from nowhere. **Fixed:** the tiles 6-8-9 hop in turn under a thick yellow underline; the scratch line now shows "689 : 85 → 8" with little wooden covers over the 9 and 5; then "8 × 85 = 680", "91 : 85 → 1", "1 × 85 = 85", "67 < 85 → 0" — each wiped by the eraser before the next.
2. **The step strip was too thin to tell which step is active.** **Fixed:** size 88 → 100, the active word gets a yellow chalk loop.
3. **Countdown digits sat in the answer slot** (could read as "the answer is 3"). **Fixed:** they now run inside a chalk timer ring to the right of the "?".
Also: tiles of 2996 no longer fall through "Đến lượt bạn!"; the "8 × 85" arrow (read as an apostrophe) became a hop of the 85 tiles; bring-downs got bold dashed arrows with heads; "dư" and the result line are larger.

## Director's critique, pass 2
1. **7.5–8.0 s regroup looked chaotic** (tiles crossing). **Fixed:** the dividend moves as one row first, then 85 follows with low arcs.
2. 42.5–44 s: ~1.5 s with only the eraser and "chia" lit while the voice asks "67 chia 85?". Acceptable; the note starts on "67".
3. 66–67.5 s: "= 107" holds until the 0 is circled on "số 0". Acceptable (≈1.5 s).

## Still weak (your call)
- The board is top-heavy during 9–13 s (only the written division + strip); the middle stays empty until the working rows fill in.
- The answer 107 is shown ~4 s after the question; viewers must pause to really try it.
- The short form of SGK KNTT (subtracting mentally, no product row) is not shown; the video uses the full form with the product written, as in the older SGK example.

## Sound-off read, pass 2
A second fresh subagent retold every turn correctly: 68 < 85 → take 689; cover trick 68 : 8 → 8; 8 × 85 = 680; 9 < 85 ✓; bring 1 → 91 : 85 → 1; 1 × 85 = 85; 6; bring 7 → 67 < 85 → 0; 68917 : 85 = 810 (dư 67); challenge 2996 : 28 = 107. Verdict: **yes, mostly**.
Its top 3: (1) the blank-tile cover trick can still look like missing digits — kept, the voice says "che chữ số cuối" and the scratch line shows the result; (2) small text at thumbnail scale (title, strip, side notes) — side notes are 110 px on a 1080 board, ~90 px on the phone after the safe-area fit; (3) 689 not clearly marked — **fixed** with a yellow loop around the 6-8-9 tiles.

## Final MP4 (after preview approval)
`out/chia_hai_chu_so.mp4` (not committed, out/ is ignored): 70.5 s, 2115 frames, 1080×1920 @ 30 fps H.264, AAC 48 kHz stereo, −16.0 LUFS, true peak −3.6 dBFS. silencedetect (> 1.2 s): 6.2–7.7, 48.4–50.1, 54.4–56.5, 61.5–65.3, all wipes or the countdown. freezedetect (n = 0.001, d = 4 s): no freeze.
