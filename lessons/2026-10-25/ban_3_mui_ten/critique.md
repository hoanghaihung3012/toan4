# Bắn 3 mũi tên: verification + director's critique

Length 50.93 s · 7 beats · voice vi-VN-HoaiMyNeural, rate +8 %. No question number and no "[4.3 points]" label anywhere on screen or in the voiceover (user request).

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses rendered from the voice timing equal the reference set (`out/keyposes_ref/`): mean 0.000 on all 7 beats. The reference set was retaken on purpose after each director's fix below (bigger rows, "3 mũi tên" label, bigger target, spread challenge arrows). |
| 2. Sound-off read | Two fresh subagents, each reading only the 2 fps contact sheets. **Pass 1** retold the problem, the +2 ladder 3 → 15, the 1 + 1 + 5 duplicate, the answer 7 and the 4-arrow challenge (9). Verdict: **mostly**. It flagged that "3 arrows" was never written, plus small rows and labels. Fixed. **Pass 2** (after the fixes) told the same story. Verdict: **mostly**. Remaining points are under "Still weak". |
| 3. Sync | 22 word-anchored windows, 0 off by more than 1 frame (`npm run sync -- ban_3_mui_ten`). |
| 4. Fact check | See the table in story.md. `console.assert` in scene.js checks: the 7 totals for 3 arrows (by enumeration), that the ladder reaches each total once in steps of 2, 5+3+1 = 9, 1+1+5 = 1+3+3 = 7, and the 9 totals 4…20 for 4 arrows. On screen: only these numbers plus "3 mũi tên", "tổng điểm khác nhau", "trùng!", "Đến lượt bạn!", "4 mũi tên", "? tổng" and "9 tổng". Nothing was cut. |
| 5. Technical | voice.wav: 48 kHz stereo, 50.933 s (= timing.json duration), −15.9 LUFS, true peak −2.8 dBFS. Silences over 1.2 s: 30.0–31.7 (eraser before the answer), 36.1–38.2 (full wipe before the challenge), 42.5–45.8 (3-2-1 countdown), 49.7–50.9 (end tail). All intended. |
| 6. Director's review | Two passes; the top 3 issues of each were fixed (below). |

## Director's critique, pass 1 (brutal)
1. **Everything was too small for a phone.** The ladder rows were 80 px in a 105 px pitch and used under half the width; the target's painted "3" and "1" were tiny. **Fixed:** rows 90 px, 112 px pitch, wider columns; "+2" labels 64 px; ring numbers 30 % of the radius; target radius 200 → 235.
2. **Arrows crossed and hid each other.** All the shafts were parallel, so three arrows in one ring looked like one or two. **Fixed:** each arrow has its own angle on the ring and its own shaft tilt, so the shafts fan out.
3. **The duplicate check fought the target.** "1 + 1 + 5 = 7" sat under an arrow's fletching, and its circle touched the target. **Fixed:** the row moved lower and left with bigger digits, and the target moved right.

## Director's critique, pass 2
1. **"3 arrows" was only spoken.** **Fixed:** the chalk "3 mũi tên" pops on the word and stays until the check row needs the space, where it winds up and shrinks away.
2. **The challenge looked like 3 arrows.** Two arrows overlapped in the bullseye. **Fixed:** the 4 arrows are spread over the target.
3. **The "9 tổng" sparks touched "tổng".** **Fixed:** wider gap.

## Still weak (your call)
- The arrows *hop* from ring to ring (pull out, arc, thunk) rather than being re-shot. It reads as "move one arrow inward", but at 0.5 s sampling a reader can miss which arrow moved; the hit ring flashes to help.
- When three arrows sit in the bullseye (5 + 5 + 5), they cover part of the painted "5".
- The ①–⑦ count badges are small (56 px) next to the 90 px rows.
- There is no on-screen reason why even totals are impossible (3 odd numbers always add to an odd number). The ladder shows every total from 3 to 15 one step at a time, which is the method the problem expects.
- The yellow circle around the ladder's 7 (beat 4) disappears at the cut to beat 5 without being erased.
- The bottom ~320 px stay empty by design (TikTok caption area, `THEME.safeArea`).
- No AI key-art images were generated (no image tool in this session). The key poses rendered from code are the style reference and were checked against the approved board style (`.claude/skills/chalkboard-html-lesson/references/board.png`).

## Preview
GitHub Pages: https://hoanghaihung3012.github.io/toan4/ban_3_mui_ten/ (shared player + this lesson, voice as MP3).
Approved by the user on 2026-10-25.

## Final MP4 (after preview approval)
`lessons/ban_3_mui_ten/out/ban_3_mui_ten.mp4` (committed): 50.93 s, 1525 frames, 1080×1920 @ 30 fps H.264, AAC 48 kHz stereo, −15.9 LUFS, true peak −2.8 dBFS. silencedetect (> 1.2 s): 30.0–31.7, 36.1–38.2, 42.5–45.8, 49.7–50.9; these are the eraser, the full wipe, the countdown and the end tail. freezedetect (n = 0.001, d = 4 s): no freeze.
