# Director's review: Bi của Chi

Watched twice as 2 fps contact sheets (out/sheet0–4) plus the five key poses.

## Pass 1: brutal critique
1. **The "2 × TBC" step was not earned on screen.** After Chi's 4 marbles go to An, the board jumps to "20 + 24 + 4 = 2 × TBC", but nothing shows An and Bình as two equal shares. A silent viewer read it as "An + 4 = TBC" and could not see why we divide by 2.
2. **Labels were too small for a phone.** These included the note "(TBC: trung bình cộng của cả 3 bạn)", the "TBC"/"24" tag on the dashed line, and the "Bình luận đáp án nhé!" line.
3. **Layout collisions in the first build.** "An: 20+4" ran into "Bình: 24". "= TBC" touched the 24. The sparks hit the marbles and the new labels. The top 40% of beats 2–4 was empty.
4. The board holds with only thinking dots for about 3 s after the question (kept: it is the pause to think). The check equations draw over about 6 s to match the voice.

## Fixes applied (top 3)
1. In beat 2, An's and Bình's columns now each get a mint box up to the TBC line with a "TBC" tag, plus a brace under both, before "20 + 24 + 4 = 2 × TBC". Two equal shares are visible, so the divisor 2 is shown.
2. Text is larger: the TBC note is 64 px, the line tag 66 px and the comment line 92 px. The marbles are larger (r 28) and the names and counts sit on two lines.
3. Each of beats 2–4 has a title ("TBC = chia đều", "Tìm TBC", "Thử lại"). Labels and sparks were moved so nothing overlaps.

## Pass 2
A fresh sound-off viewer retold the whole lesson correctly from the silent sheets:
- An 20, Bình 24, Chi = TBC + 4.
- Chi's extra 4 evens everyone out, so 20 + 24 + 4 = 2 × TBC.
- 48 : 2 = 24, so Chi has 24 + 4 = 28.
- Check: 72 : 3 = 24.
- The ending is a challenge with a countdown.

Their main doubt was the 2 × TBC step, which fix 1 addresses.

## Still weak (your call)
- The opening holds with thinking dots for about 3 s.
- The challenge uses practice numbers (30, 26, +2) that are not from the Sheet. Its answer (31) is checked in code and not shown.

## Verification
- **Key poses:** 5/5 rendered and saved as the reference.
- **Sync:** 20 word-anchored windows, 0 off by more than 1 frame.
- **Facts:** every number is asserted in scene.js (D1–D5 in story.md).
- **Audio:** 61.700 s, 48 kHz stereo, true peak −3.2 dBFS. The two silences are the thinking pause (8.5–11.9 s) and the end countdown (58.3–61.7 s).
- **npm test:** 13 pass, 0 fail.
