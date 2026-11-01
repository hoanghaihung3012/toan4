# Director's review: hinh_thoi_duong_cheo

## Pass 1 (key poses, my own read)
1. The area label sat on the vertical diagonal, and "60 cm²" sat on the rhombus tip inside the strip. Fixed: the area label is in the lower-left quarter on the board (under the rhombus in beat 1), and "60 cm²" is in the clear lower part of the strip.
2. The answer row's burst ran into the row above and off the right side. Fixed: smaller row (56), loops and burst.

## Pass 2 (fresh sound-off reader: "mostly", the whole solution retold correctly, answer 12 cm and 20 cm)
1. The problem text was small. Fixed: size 72 and line height 104, with the rhombus lower.
2. Challenge labels were small, and it was unclear which diagonal gets +4. Fixed: "12 cm" is size 54 with an arrow to the yellow vertical diagonal, "+4 cm" (58) sits at its top end, and "20 cm" is under the figure.
3. Kept: the corner fold reads as a "star" only between frames at 2 fps. The fold lands on the full gold rhombus and holds, then unfolds on "Hình chữ nhật cũ".
4. Kept: the thinking dots and the "Sau đây là cách giải" transition. Both are standard beats of the skill.
5. Kept: "150 cm²" stays inside the rhombus while the rows talk about the rectangle. The rows say "× 2" on the board, which links the two.

## Checks
- Sync: 25 word-anchored windows, 0 more than 1 frame off.
- Facts: the problem text was transcribed from the Sheet picture. Every number on screen is in the problem (120, 150, 5) or is derived in story.md (240, 300, 60, 12, 20). scene.js asserts the results and the check 12 × 20 : 2 = 120, 12 × 25 : 2 = 150. The challenge answer (160) is not shown.

## Pass 3 (final MP4 technical check)
- freezedetect found holds of 4.3–6.1 s between 33 and 50 s. Writing the rows changes too few pixels to count as motion. Fixed in two steps:
  - The gold strip pulses on "300", "5" and "60", and the rhombus glows on "150".
  - The rhombus gives a springy scale bump on "5", "60", "Phần thêm vào", "dài", "12" and "20".
- The fold now holds folded until "120" in the next line (unfold window moved to L6.120). Before, it started to unfold before it had landed.
- Re-render: no freeze ≥ 4 s, true peak −3.7 dBFS, 66.033 s, stereo, full decode OK. The only silences are the thinking pause, the transition, the board wipe and the countdown.
