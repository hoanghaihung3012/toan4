# Lập số có 3 chữ số khác nhau, lớn hơn 430: verification + director's critique

Length 73.5 s · 6 beats (one board for beats 1–5, the lower band wiped between steps; full wipe before the challenge) · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses on the final timing vs the reference set: beats 1–3, 5, 6 mean 0.000; beat 4 changed on purpose (loop around 3, 6, 8 made tighter so it no longer crosses the struck 1). |
| 2. Sound-off read | Pass 1 (fresh subagent): full retelling, answer 33, **mostly**. Flagged: empty first 1.5 s, small text, 43_ never shown to work, static holds. Fixed: tiles drop from 0.1 s, bigger condition text and labels, green "4 3 1 > 430 ✓" row, yellow loop on 3, 6, 8. Pass 2 (new subagent): full retelling, answer 33, **mostly**. Still flagged: why "4 cách / 3 cách" (blank boxes), small text on a phone. |
| 3. Sync | 33 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below. scene.js lists all 60 numbers with 3 different digits and asserts every count. Nothing cut. |
| 5. Technical | voice.wav 48 kHz stereo, 73.5 s, true peak −3.5 dBFS. Silences > 1.2 s: 15.5–18.3 s (thinking dots), 28.2–30.1, 41.0–42.7, 55.3–57.2, 61.5–63.4 s (erasers), 70.4–73.5 s (3-2-1). All intended. |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check
| On screen / voice | Source |
|---|---|
| Chữ số 1, 3, 4, 6, 8; số có 3 chữ số khác nhau; lớn hơn 430; bao nhiêu số | Đề (Sheet, STT 4) |
| 618 ✓, 413 ✗ (< 430) | D5, direct check |
| Hàng trăm 1, 3 → < 430 ✗; 6, 8 → > 430 ✓; 4 → xét tiếp | D1 (max 386), D2 (min 613) |
| 2 cách, 4 cách, 3 cách; 2 × 4 × 3 = 24 | D2, brute force |
| Hàng trăm 4; 41_ < 430 ✗; 431 > 430 ✓; 1 × 3 × 3 = 9 | D3, brute force |
| 24 + 9 = 33; Có 33 số | D4, brute force |
| Thử sức: lớn hơn 640 (answer 18, not shown) | D6 |

## Director's critique, pass 1
1. **Hook: the board was empty for 1.5 s** (tiles waited for the spoken digits). Fixed: tiles start dropping at 0.1 s.
2. **The 4 tile fell straight through the condition text.** Fixed: a 4 is taken from the tray and flies along an arc into the hundreds slot.
3. **"Còn lại 3, 6 hoặc 8" had almost no visual cue.** Fixed: the three tiles hop and a yellow loop gathers them; thinking pause shortened (3.2 → 2.8 s).

## Director's critique, pass 2
1. **Nothing showed that 43_ still works.** Fixed: green "4 3 1 > 430 ✓" under the red "4 1 _ < 430 ✗".
2. **Condition text and slot labels too small.** Fixed: 64 → 70 px, 68 → 74 px, labels 56 → 60 px.
3. **Loop around 3, 6, 8 cut through the struck 1.** Fixed: tighter loop.

## Still weak (your call)
- Case 1 shows the 4 tens and 3 ones choices as blank boxes (the digits depend on the hundreds digit), so "why 4, then 3" rests on the voice.
- The multiplication rule itself (cách × cách) is said, not drawn.
- 73.5 s is longer than the last lessons (≈60 s).
