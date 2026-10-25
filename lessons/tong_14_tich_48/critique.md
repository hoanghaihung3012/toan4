# Verification and critique: Tìm hiệu hai số (tổng 14, tích 48)

Length 52.73 s, 5 beats, 17 voice lines (vi-VN-HoaiMyNeural, +8%).

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | `inspect.mjs diff keyposes_ref keyposes`: mean 0.000 on all 5 beats (reference taken after the last layout fix). |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets: retold all scenes, the try-each-pair table, 6 × 8 = 48, 8 − 6 = 2 and the challenge (5 and 8, hiệu 3). Verdict **yes**. Flagged: table text small with the bottom of the board empty, the 3-2-1 countdown overlapping "Bình luận đáp án nhé!", answer revealed right after the countdown → all three fixed (below). |
| 3. Sync | `synccheck.mjs`: 49 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; nothing unmatched. No question number anywhere. |
| 5. Technical (WAV) | 52.733 s, 48 kHz stereo, −16.1 LUFS, true peak −3.2 dBFS. Silences > 1.2 s: 5.0–8.6 thinking dots + wipe (intended), 24.4–26.2 wipe, 33.8–36.2 sparks + wipe, 42.1–47.0 countdown + 1.2 s pause before the answer (intended), last 1.3 s tail. MP4 checks run after approval. |
| 6. Director's review | Two passes, below. |
| Tests | `npm test`: 9/9 pass (tong_14_tich_48 included). |

## Fact check (every on-screen word and voice line)
| Item | Source |
|---|---|
| "□ + △ = 14", "□ × △ = 48", "Hiệu = ?", "Hai số có tổng là 14 và tích là 48. Hiệu của chúng là bao nhiêu?" | F1 (ảnh đề) |
| Bảng 1×13 = 13, 2×12 = 24, 3×11 = 33, 4×10 = 40, 5×9 = 45, 6×8 = 48 | D2 (assert) |
| "6 + 8 = 14", "6 × 8 = 48", "Hiệu = 8 − 6 = 2" | D1 (assert) |
| "□ + △ = 13", "□ × △ = 40", "5 + 8 = 13", "5 × 8 = 40", "Hiệu = 8 − 5 = 3" | D3 (assert) |
| "Tìm hiệu hai số", "tích", "Mẹo: tách 14 thành hai số, rồi nhân thử!", "Đúng rồi!", "Đến lượt bạn!", "Bình luận đáp án nhé!" | Lời dẫn, không chứa số liệu mới |

## Director's review, pass 1 (brutal)
1. **Table too small, bottom 40 % of the board empty** for the whole 16 s table beat; header shapes and "tích" were tiny on a phone.
2. **Challenge countdown sat on top of "Bình luận đáp án nhé!"**, and the answer came 0.1 s after "1" — no time to think.
3. **Dead hold 27.5–29.5 s** while the voice says "6 cộng 8 bằng 14, 6 nhân 8 bằng 48" (only a small tick drew); also the "?" of the new board showed through the eraser at 25–26 s; the answer circle cut the "=" and the answer ran off the right edge.

Fixes: (1) table tiles 1.42×, products 124 px, rows spread to y 1560, recap 96 px; (2) comment line moved under the title, countdown 300 px alone in the lower board, 1.2 s silent pause before the answer; (3) the 6 and 8 tiles of each equation hop on "6 cộng 8" / "6 nhân 8", the "?" now returns with its row, extra space before the circled answer, hiệu row 124 px. Rebuilt timing, re-ran sync, key poses and sheets.

## Pass 2: still weak (your call)
- On the solution boards the lower third (under "Hiệu = …") stays empty except for the countdown.
- In the challenge, the countdown "2" passes right under "Hiệu = ?" and could be mistaken for a hint for a split second.
- The method is guess-and-check (đúng trình độ lớp 4), not the shortcut with (a − b)² = (a + b)² − 4ab, which is beyond grade 4.
- Storyboard: no image-generation tool in this session, so the storyboard is the engine's own key poses (`out/keyposes_ref`), checked on beat 1 before building the rest.

## Final MP4 (after preview approval, 2026-10-25)
`out/tong_14_tich_48.mp4`: 52.733 s, 1080×1920 H.264 30 fps, AAC 48 kHz stereo, true peak −3.2 dBFS. Silences > 1.2 s are the same intended ones as the WAV. `freezedetect=n=0.001:d=4`: no freezes.
