# Khu vườn hình chữ nhật (chu vi 140 m): verification + director's critique

Length 63.9 s · 6 beats (3 boards + challenge) · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses from the voice timing match the reference set (mean diff 0.000 on all 6 beats). The reference was retaken on purpose after each fix pass below. |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold the problem, 140 : 2 = 70, rộng 2 phần / dài 3 phần, 14 m, 42 m, 28 m, 1176 m², the 84 = 84 check and the challenge; verdict **mostly**. It flagged the two titles garbled during the first wipe and small labels. Fixed. Pass 2 (new subagent): same full retelling, no hold over 3 s; verdict **mostly** (small labels, see "Still weak"). |
| 3. Sync | 30 word-anchored windows, 0 off by more than 1 frame (`node render/synccheck.mjs vuon_chu_nhat_140`). |
| 4. Fact check | Table below; `console.assert` in scene.js checks every number and the drawn garden ratio. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 63.867 s, true peak −3.8 dBFS. Silences > 1.2 s: 7.2–11.1 s (thinking dots + eraser), 38.9–40.5 s (eraser), 51.7–53.5 s (eraser), 60.8–63.9 s (3-2-1 countdown). All intended. |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| Khu vườn hình chữ nhật, chu vi 140 m; 3 lần rộng = 2 lần dài; diện tích (m²) | User's image (Sheet "Câu hỏi hình", STT 19) |
| Nửa vòng rào = dài + rộng; 140 : 2 = 70 m | Perimeter of a rectangle = 2 × (dài + rộng) |
| 6 phần: rộng 2 phần, dài 3 phần | From 3 × rộng = 2 × dài |
| 5 phần = 70 m, 1 phần = 14 m, dài 42 m, rộng 28 m | Computed |
| 42 × 28 = 1176 m²; 3 × 28 = 84 = 2 × 42 | Computed |
| Thử sức: chu vi 100 m (answer 600 m² not shown) | Practice number, same method (as in the ngan_sach lesson) |

## Director's critique, pass 1 (brutal)
1. **The bar board was a pile-up**: "140 : 2 = 70" sat on the "dài/rộng" labels and the "14"s. **Fixed:** smaller garden (8 px/m), labels under the bar, brace lower, rows re-spaced.
2. **Sparks around 1176 m² ran over "42 × 28" and the check rows.** **Fixed:** a burst that flies off; the answer loop no longer cuts the "=".
3. **The challenge board showed the yellow perimeter loop before the garden existed.** **Fixed:** its own trace window on "chu vi".

## Director's critique, pass 2
1. **Two titles garbled during the first wipe** (sound-off reader). **Fixed:** the new board builds after the eraser.
2. **Part labels too small.** **Fixed:** "2 phần / 3 phần" 42 → 52 px, "14" 40 → 52 px, "dài / rộng" 58 → 60 px.
3. **Tick lines crossed the labels.** **Fixed:** shorter ticks.

## Still weak (your call)
- The parts board is the densest frame of the clip; labels are 52 px (≈43 px on the phone after the safe-area fit).
- The first wipe shows the eraser crossing a full board, as in the other lessons.
- The board below y ≈ 1600 stays empty by design (TikTok caption area).
