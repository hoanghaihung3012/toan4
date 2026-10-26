# Số chẵn có 6 chữ số khác nhau: verification + director's critique

Length 78.1 s · 6 beats (one board for beats 1–5, the band under the slots wiped between steps; full wipe before the challenge) · voice vi-VN-HoaiMyNeural, rate +10 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses on the final timing vs the reference set: beats 1, 2, 5, 6 mean 0.000; beats 3–4 changed on purpose (pass-2 fixes: "?" gives way to the count, case-1 note). |
| 2. Sound-off read | Pass 1 (fresh subagent): full retelling, answer 68 880, **mostly**. Flagged: why 8, 7, 6, 5; tiny notes; hold on the dots; empty start. Fixed: red "−1" hops between counts, shorter pause, "cách" larger. Pass 2 (new subagent): full retelling, **mostly**. Flagged: counts not tied to the slots, no reason for case-1's 9. Fixed: each slot's "?" gives way as its count appears; "Hàng đầu: từ 1 đến 9". |
| 3. Sync | 39 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below. scene.js counts every arrangement (backtracking) and asserts 15 120, 53 760, 68 880, odd 67 200, and that each "−1" hop really drops by 1. Nothing cut. |
| 5. Technical | voice.wav 48 kHz stereo, 78.1 s, true peak −3.1 dBFS. Silences > 1.2 s: 13.3–16.5 s (thinking dots + eraser), 26.1–28.1, 40.1–41.8, 57.8–59.6, 67.9–69.7 s (erasers), 75.0–78.1 s (3-2-1). All intended. |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check
| On screen / voice | Source |
|---|---|
| Số có 6 chữ số khác nhau, là số chẵn, bao nhiêu số | Đề (Sheet, STT 5) |
| Chữ số 0–9; 0 không đứng đầu; 123 456 ✓, 012 346 ✗ | K1 (cấu tạo số), D4 |
| Hàng đơn vị 0, 2, 4, 6, 8 | K2 (dấu hiệu chia hết cho 2) |
| ① 9, 8, 7, 6, 5, 1 cách; từ 1 đến 9; 9 × 8 × 7 × 6 × 5 = 15 120 | D1, brute force |
| ② 4 cách; bỏ 0 và chữ số cuối → 8; 8, 7, 6, 5; = 53 760 | D2, brute force |
| 15 120 + 53 760 = 68 880 | D3, brute force |
| Thử sức: số lẻ (67 200, not shown) | D5 |

## Director's critique, pass 1
1. **"0 dính đến cả hai điều kiện" played over a still board (3 s).** Fixed: the 0 is circled in both rule lines and the 0 tile hops.
2. **Loops around 15 120 / 53 760 touched "=" and "số"; case-2 note crowded the product.** Fixed: wider gaps, rows moved down.
3. **Case boxes: badge over the text.** Fixed: taller boxes, badge centred on top.

## Director's critique, pass 2
1. **Nothing showed why 8, 7, 6, 5.** Fixed: red "−1" hops between neighbouring counts (only where it is really one fewer: not between case 2's 8 and 8).
2. **Counts not tied to slots.** Fixed: each slot's "?" winds up and shrinks away as its count pops in.
3. **Thinking pause + eraser silence 3.5 s.** Shortened to 3.2 s.

## Still weak (your call)
- Case 2's "8 then 8" (the second place may use 0) is said in the voice only.
- 78 s is longer than earlier lessons (big numbers read long in Vietnamese).
- The countdown sits under "Có bao nhiêu số?" in the challenge, as in earlier lessons.
