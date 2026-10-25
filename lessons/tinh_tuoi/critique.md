# Verification and critique: Toán tính tuổi (2 dạng)

Length 102.57 s, 7 beats, 31 voice lines (vi-VN-HoaiMyNeural, +8%). Source: Google Sheet "Toán lớp 4 - AI", cột "Câu hỏi chữ", dòng "các dạng toán tính tuổi". No question number on screen or in the voice.

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | `inspect.mjs diff keyposes_ref keyposes`: mean 0.000 on all 7 beats (reference taken after the director's fixes; the fixes changed beats 1, 2, 3, 5, 6 on purpose). |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets: retold both problems, the −4 −4 step, both diagrams, 36 and "7 năm", and the two tips. Verdict **yes, mostly**. Flagged: everything too small / bottom half empty, the "−4" of Con looked like Dad's and the Con piece flew over the Bố bar, no "now" on the 48, no check for problem 1, no visible "years passing" counter → all fixed (below). |
| 3. Sync | `synccheck.mjs`: 29 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 102.567 s, 48 kHz stereo, −16.0 LUFS, true peak −3.8 dBFS. Silences > 1.2 s: 8.7–12.3 (thinking dots + wipe), 19.9–21.9 (wipe), 44.5–46.6 (sparks + wipe), 53.3–57.0 (thinking dots + wipe), 68.1–70.2 (wipe), 90.4–92.9 (tick + wipe), last 1.4 s tail. All intended. MP4 checks run after approval. |
| 6. Director's review | Two passes, below. |
| Tests | `npm test`: 10/10 pass (tinh_tuoi included). |

## Fact check
| On screen / voice | Source |
|---|---|
| "Nay: Bố + Con = 48", "4 năm trước: Bố = 4 × Con", "Nay bố = ?" + đề đọc nguyên văn | F1 (Sheet) |
| "Mẹ: 35 tuổi", "Con: 7 tuổi", "Sau ? năm nữa: Mẹ = 3 × Con" + đề đọc | F2 (Sheet) |
| "48 − 4 − 4 = 40" | D1 (assert) |
| "1 + 4 = 5 phần", "Con: 40 : 5 = 8", "Bố: 8 × 4 = 32", "Nay bố: 32 + 4 = 36", "Thử: 36 + 12 = 48 ✓" | D2, D3 (assert) |
| "35 − 7 = 28", bars 35/7 → 38/10 with brace 28, "Sau 1/2/3 năm" | D4 (assert; the 3-year growth is an illustration of "hiệu không đổi") |
| "3 − 1 = 2 phần", "Con: 28 : 2 = 14", "14 − 7 = 7 năm", "Mẹ: 35 + 7 = 42", "42 = 3 × 14 ✓" | D5 (assert) |
| Titles, "Hiệu không đổi!", "Nhớ 2 mẹo", the two tips, "Thấy hay thì bình luận nhé!" | Lời dẫn, không số liệu mới (tips follow from D1/D4) |

## Director's review, pass 1 (brutal)
1. **Too small, bottom half empty**: bars 112 px with 56 px numbers, labels 80 px; on every board the lower 45 % was unused.
2. **The "lùi 4 năm" step misled**: Con's 4-piece flew up across Bố's bar and its "−4" landed between the rows, reading as Dad's; the 48 was never marked as *now*.
3. **No proof for problem 1 and no visible passage of time in the "hiệu không đổi" scene** (only tiny "+1").

Fixes: (1) bars 150 / blocks 140 px, labels 92–96 px, numbers 72–88 px, equations moved down into the lower board; (2) each 4-piece hops low to the right inside its own row and leaves "−4" on that row; first line now "Nay: Bố + Con = 48"; (3) new check line "Thử: 36 + 12 = 48 ✓" with voice, and a green "Sau 1 / 2 / 3 năm" counter plus bigger "+1" marks while the bars grow. Rebuilt timing, re-ran sync, key poses, sheets, tests.

## Pass 2: still weak (your call)
- The "Sau 3 năm" counter stays on the board after the stamp "Hiệu không đổi!"; harmless but slightly busy.
- About 1.5 s after each wipe shows only a title before the diagram starts.
- Thinking dots (≈3 s) after each question are the only motion in those holds.
- No image generator in this session, so the storyboard is the engine's own key poses (`out/keyposes_ref`), beat 1 checked first.
