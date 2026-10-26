# Sơn khối lập phương (kể cả mặt đáy): verification + director's critique

Length 54.07 s · 8 beats · voice vi-VN-HoaiMyNeural, rate +8 %. No question number anywhere on screen or in the voiceover (user request).

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the real voice timing equal the draft key-pose set from the scene-building pass (identical before the fixes below). After the director's fixes the reference set was retaken on purpose (`out/keyposes/`): bigger labels, coloured operands, wider "=" before the circled answer. |
| 2. Sound-off read | Pass 1 (fresh subagent, 2 fps sheets): retold 8 / 8, 9 / 9, 4 / 4, 16 + 18 + 8 = 42 and the challenge 42 − 8 = 34; verdict **mostly**. Flagged: small direction labels, unclear "1 2 3 4 struck out" moment, small "không sơn" and "ô vuông". Fixed (below). Pass 2 (new subagent, sheets after the fixes): retold the same story, read the struck-out 1–4 as "counting cubes is wrong", and the full answer chain; verdict **mostly** (remaining points under "Still weak"). |
| 3. Sync | 36 word-anchored windows, 0 off by more than 1 frame (`npm run sync -- son_khoi_lap_phuong`). |
| 4. Fact check | story.md table; `console.assert` in scene.js checks 13 cubes, views 8/9/4, 42 both as six views and as exposed faces, column heights 3,3,2,1 and 1,3, and 42 − 8 = 34. Nothing cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 54.067 s (= timing.json duration), −16.0 LUFS, true peak −3.1 dBFS. Silences > 1.2 s: 40.6–42.4 (eraser before the challenge), 46.5–49.8 (3-2-1 countdown), 52.8–54.1 (end tail on the answer). All intended. |
| 6. Director's review | One pass, top 3 fixed (below). |

## Director's critique, pass 1 (brutal)
1. **The pair sums read as negative numbers.** A coloured dash in front of each row made "8 + 8 = 16" look like "−8 + 8 = 16". **Fixed:** dash removed; the two operands are coloured with the pair's paint instead.
2. **The circled answers swallowed the "=".** The yellow loop around 42 and 34 overlapped the equals sign. **Fixed:** wider gap before the answer, slightly narrower loop.
3. **Too much small text for a phone.** Direction labels (trên, dưới, …) were 54 px before the safe-area scale, "không sơn" 64 px, "ô vuông" 80 px, and the white 1 2 3 4 on the beige cubes barely showed. **Fixed:** labels 68 px, "mặt đáy" 68 px, "không sơn" 84 px, "ô vuông" 104 px, numbers 88 px in dark brown with a thicker red strike.

## Still weak (your call)
- Side views: "phải" and "trái" are drawn as the green face appears in the picture (front column on the left), not as a strict orthographic side view (which would be mirrored). The count, 4, is the same either way.
- The model sits still for about 2 s while "Đừng đếm từng khối" is said; only the numbers and the strike move.
- The hook never shows the word "sơn" before the brush appears at 13.5 s; circling "mặt đáy" first could suggest the question is only about the base.
- The bottom face ("dưới") is never painted on the model; its 8 comes from the given bottom-view grid.
- The bottom ~430 px stays empty by design (TikTok caption area, `THEME.safeArea`).

## Preview
Running HTML preview with voiceover: https://claude.ai/artifact/YazL3D2uRoXEeYiwJiGhor (copy of `shared/web` + this lesson; audio as MP3 for the page host).
Approved by the user on 2026-10-25.

## Final MP4 (after preview approval)
`lessons/son_khoi_lap_phuong/out/son_khoi_lap_phuong.mp4` (committed): 54.07 s, 1622 frames, 1080×1920 @ 30 fps H.264, AAC 48 kHz stereo, −16.0 LUFS, true peak −3.1 dBFS. silencedetect (> 1.2 s): 40.6–42.4, 46.5–49.8, 52.8–54.1, all the eraser, the countdown or the end tail. freezedetect (n = 0.001, d = 4 s): no freeze.
