# Đề-xi-mét vuông, mét vuông, mi-li-mét vuông — verification + director's critique

Length 113.9 s · 10 beats · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the final voice timing equal the reference set: mean diff 0.000 on all 10 beats. The reference set was retaken on purpose after each fix pass below (label sizes, loops, desk, room working, 10 × 10 lines). |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold all three relations, the ladder, the four conversions and 305. Verdict **mostly**: labels too small, a 3 s hold on the tiny 1 cm², and "24 m²" for the room came from nowhere. Fixed (below). Pass 2 (new subagent): retold the whole story correctly; verdict **mostly**. It flagged that "240 000 cm² → 24 m²" was still unexplained, the desk's "6 dm" read as thickness, and 1 m² / 1 cm² had no "10 × 10" line. All three fixed after pass 2. |
| 3. Sync | 47 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below. `console.assert` in scene.js checks 10 × 10 = 100, 12 × 6 = 72, 40 × 40 = 1600, 1600 × 150 = 240 000, 240 000 : 100 : 100 = 24, the four conversions and 300 + 5 = 305. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 113.900 s, −16.0 LUFS, true peak −3.3 dBFS. Silences > 1.2 s: 3.9–5.7, 20.9–22.5, 30.1–31.8, 45.6–47.3, 55.0–57.1, 75.4–77.1 and 95.4–97.5 (eraser wipes), 85.4–86.8 (✓ on 500 dm² = 5 m², end of beat 7), 103.0–106.4 (3-2-1 countdown), 112.7–113.9 (end tail). All intended. |
| 6. Director's review | Two passes; top 3 fixed each time (below). |

## Fact check (on screen + voiceover)
| Claim | Source (story.md) |
|---|---|
| dm² = diện tích hình vuông cạnh 1 dm; 1 dm² = 100 cm² | F1, F5 |
| m² = diện tích hình vuông cạnh 1 m; 1 m² = 100 dm² | F2 |
| mm² = diện tích hình vuông cạnh 1 mm; 1 cm² = 100 mm² | F3, F5 |
| "Mỗi đơn vị gấp 100 lần đơn vị bé hơn tiếp liền", lớn → bé × 100, bé → lớn : 100 | F4 |
| Mặt bàn 12 dm × 6 dm = 72 dm² | F6 |
| 150 viên gạch cạnh 40 cm: 1600 cm² một viên, 240 000 cm² = 24 m² | F7 |
| 8 dm² = 800 cm²; 500 dm² = 5 m²; 800 mm² = 8 cm²; 2 m² 30 dm² = 230 dm² | F8 |
| 3 cm² 5 mm² = 305 mm² | F9 |
| "10 × 10 = 100" (10 hàng, mỗi hàng 10 ô) | Counted on the drawn grid; F1–F3 ("gồm 100 hình vuông") |

## Director's critique, pass 1 (brutal)
1. **Circles cut through the answers** ("100 cm²", "72 dm²", "305") and touched the "=". **Fixed:** the circle is sized from the measured word and the gap before the answer is wider.
2. **Labels too small for a phone** (side lengths, "1 cm²/1 dm²/1 mm²" cell tags, "× 100" tags, conversion rows squeezed into the top third). **Fixed:** dimension labels 60 → 72, cell tags 56 → 64, tags 62 → 72, conversion rows 80 → 86 spread over the whole board; the ladder tiles are 25 % bigger.
3. **Dead holds**: the tiny 1 cm² square sat alone for ~3 s and the ladder held still for ~5 s. **Fixed:** the 1 cm² square is bigger and hops while the lens is drawn on "1 xăng-ti-mét vuông"; on "nhân 100" the unit tiles hop downwards one by one, on "chia 100" upwards.

## Director's critique, pass 2
1. **"Nền phòng: 24 m²" was a jump.** **Fixed:** the board now shows "1 viên: 40 × 40 = 1600 cm²", "1600 × 150 = 240 000 cm²" and a ": 100 : 100" tag over "24 m²" (the ladder's two steps), and the voice says "Mỗi viên 1600 xăng-ti-mét vuông. 150 viên là 240000 xăng-ti-mét vuông."
2. **The desk's "6 dm" read as its thickness.** **Fixed:** the desk top is drawn from above as a 2 : 1 wooden board labelled "mặt bàn".
3. **1 m² and 1 cm² had no "10 × 10 = 100"** (only 1 dm² had it). **Fixed:** both beats write it on "100" / at the start of the cell line.

## Still weak (your call)
- 114 s is long for TikTok. Cutting the room example (beat 6, second half) would save about 12 s.
- The 1 dm² square in beat 2 is drawn the same size as the 1 m² plate in the hook (it is a zoom), which the pass-2 reader found slightly confusing.
- No real-life object for mm² is shown: none was found in the sources, so mm² is taught only through the magnified 1 cm².
- Short holds of 2–3 s remain while the voice reads a definition (7–9 s, 59–61 s).
