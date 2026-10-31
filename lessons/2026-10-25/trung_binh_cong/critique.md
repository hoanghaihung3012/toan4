# Tìm số trung bình cộng: verification + director's critique (Gate 4)

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Rendered from the voice timing, the 6 key poses equal the approved ones: mean diff 0.000 on every beat. The 3 deliberate changes from the review are listed below. |
| 2. Sound-off read | A fresh subagent saw only the 2 fps contact sheets. It retold all 6 scenes and every example correctly (6 and 4 → 5; (25+27+32):3 = 28; the rule and its reverse; 54 × 4 = 216; C = 32). Verdict: **yes**, a 9–10-year-old can follow it with the sound off. |
| 3. Sync | 42 word-anchored windows checked against the TTS word times: 0 off by more than 1 frame. |
| 4. Fact check | See below: every number matches its source. |
| 5. Technical | See the final-file report (duration, stereo, peaks, silences). |
| 6. Director's review | Two passes over the full contact sheet. The top 3 issues were fixed; what is left is listed below. |

## Fact check (on screen + voiceover)
| Claim | Source |
|---|---|
| Can 6 l and can 4 l, poured evenly → 5 l each; 5 is the trung bình cộng of 6 and 4 | VnDoc giáo án Toán 4 bài 22, Bài toán 1 |
| 25, 27, 32 học sinh; chia đều cho ba lớp; (25+27+32):3 = 84:3 = 28 | VnDoc, Bài toán 2 |
| "Muốn tìm số trung bình cộng của nhiều số, ta tính tổng…, rồi chia tổng cho số các số hạng" | VietJack, Tìm số trung bình cộng lớp 4 |
| Tổng = TBC × số các số hạng; TBC of 4 numbers is 54 → total 216 | VietJack, Dạng 2 + ví dụ 2 |
| 28 × 3 = 84; 84 − 25 − 27 = 32 ("đúng bằng lớp ở ví dụ lúc nãy") | Computed from the two rows above; `console.assert` in the scene checks it |

Nothing was cut: no unsourced claim was found.

## Director's critique, pass 1 (brutal)
1. **5.0–8.5 s: dead picture.** The voice asks "Nếu rót đều… mấy lít?" for 3.5 s, but the "?" only appeared on "mấy". **Fixed:** the "?" now pops on "rót", so the question is on screen while it is asked.
2. **31–35.5 s: 4.5 s static board** while the voice says "Trung bình mỗi lớp có 28 học sinh". **Fixed:** the 28 level tag gets circled on "Trung bình", which ties the bars to the answer.
3. **80–84 s: the ending just holds.** **Fixed:** on "đúng bằng lớp ở ví dụ lúc nãy", C's part above 28 turns mint, the same colour as the students class C gave away in scene 2. The callback is now visible, not only spoken.

Also fixed, from the sound-off reader:
- the 28 tag looked like "2a" when small (60 → 70 px);
- the thinking dots were too small (radius 9 → 13);
- "TBC" was never expanded (the first title is now "Trung bình cộng (TBC)").

## Pass 2: what is still weak (not fixed; your call)
- The 6 and 4 example shows only "= 5". The written (6 + 4) : 2 first appears in example 2. This is faithful to the approved story, but a formula line could be added.
- 54 × 4 = 216 is pure symbols with no picture, after two visual examples. It is acceptable as a "rule" scene.
- Text in the second Ghi nhớ box (64 px) is the smallest on the board. It is readable at phone size but not generous.
- The voice is long: 84 s. A faster reading rate (−8% → 0%) would cut it to roughly 75 s.
