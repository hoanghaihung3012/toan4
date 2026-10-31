# Thích cả Toán và Tiếng Anh: verification + director's critique

Length 68.1 s · 6 beats: the problem written word by word as it is read; "Sau đây là cách giải" with a chime; one board for beats 3–5 (only the equation band is wiped before the check); the challenge · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | The first key-pose set was the reference. Fixes changed beats 3–6 on purpose: bars sit on their row, bar numbers moved off the overlap, labels enlarged, the overlap box thicker, "Tiếng Anh" moved below the box. Beats 1–2 unchanged. |
| 2. Sound-off read | Pass 1 (fresh subagent): full retelling, answer 11, verdict **mostly**. It flagged tiny labels, a faint overlap box, an unclear "> 36", a stray sliver as the Toán bar starts, the 6-piece far from the bar, and "Thử lại" written under the eraser. All were fixed. Pass 2 (new subagent): full retelling, answer 11, **mostly**. It flagged the small problem text and that the bars were not tied to the 36. Fixed: problem text 68 → 76, and dashed guides drop from the ends of the 36 around both subject bars. Not changed: the wipe before the check (it keeps the bars and the answer). |
| 3. Sync | 23 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below. scene.js asserts 36, 47, 11, the check (= 42) and 14, and brute-forces that 11 is the only possible overlap. Nothing cut. |
| 5. Technical | voice.wav 48 kHz stereo, 68.07 s, true peak −3.9 dBFS. Silences > 1.2 s are all intended: 13.0–16.5 s (thinking dots + eraser), 18.3–20.1 s (eraser), 48.8–50.1 s (answer hold + check), 58.6–60.7 s (eraser), 65.0–68.1 s (3-2-1). |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check
| On screen / voice | Source |
|---|---|
| The whole problem statement (beat 1) | Sheet1, STT 6, verbatim |
| Cả lớp 42 học sinh; 6 không thích môn nào | Đề |
| 42 − 6 = 36 thích ít nhất 1 môn | D1 |
| Toán 25, Tiếng Anh 22; 25 + 22 = 47 > 36 | Đề, D2 |
| đếm 2 lần; 47 − 36 = 11 | D3 |
| 11 học sinh thích cả hai môn | D3 |
| Thử lại: 25 + 22 − 11 + 6 = 42 ✓ | D4 |
| Đến lượt bạn: chỉ thích môn Toán? (14, not shown) | D5 |

## Director's critique, pass 1
1. **Bars floated half a bar above their rows.** The Toán bar covered its label and the 6-piece sat lower than the class bar. Fixed: bars stand on their row.
2. **Bar numbers "25"/"22" sat on the overlap edges.** Fixed: each number is now centred on the part that belongs to that subject alone.
3. **The answer circle cut into "học"; the pink label hit the brace.** Fixed: wider gap, label moved down.

## Director's critique, pass 2 (after the reader)
1. **Small labels on a phone** ("không thích môn nào", "đếm 2 lần", "Tiếng Anh", "36 học sinh thích ít nhất 1 môn"). Fixed: all enlarged to 52–60.
2. **The overlap read faintly.** Fixed: a thicker box and thicker dashed edges.
3. **"> 36" was small and far from 47.** Fixed: same size as the equation, next to 47. Also fixed: the stray sliver as a bar starts, and "Thử lại" now waits for the eraser.

## Still weak (your call)
- "Why it is counted twice" leans on the voice plus the red "đếm 2 lần" tag. There is no per-student picture.
- The countdown digits shrink and pop on top of each other for a frame (shared engine `countdown`).
- The challenge (chỉ thích Toán) can be read off the board as 25 − 11, so it is an easy one.
