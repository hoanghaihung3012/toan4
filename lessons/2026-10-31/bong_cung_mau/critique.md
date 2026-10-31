# Director's review: bong_cung_mau

## Pass 1 (old, smaller layout; sound-off reader: "mostly")
1. The tubes, balls and labels were too small for a phone. Fixed: R 38, STEP 84, tubes at 230/540/850, labels 60.
2. The lid "?" and the 5 yellow rings read as decoration. Fixed: the lid now says "kín", and the rings say "cùng màu?".
3. "hết!" over the green tube was ambiguous. Fixed: it is now "chỉ có 4" above the tube.
4. The 13th "?" ball was small, the ✗ was cramped and "hoặc" was small. Fixed: the ball is 1.4R, the ✗ sits on the 5-line, "hoặc" is size 58 and the ✓ marks are above the tubes.
5. The challenge did not say which box. Fixed: the counts 10 / 8 / 4 now sit under the three balls.

## Pass 2 (after the fixes; frames at 2 fps)
- The beat 3 hold from 32.0 to 33.5 s is short and sits under the spoken "vẫn chưa có 5 quả cùng màu". Kept.
- From 38.5 to 39.5 s the white ball arcs toward the red tube; the colour change happens only after v > 0.55. It reads as "it can go here". Kept.
- The countdown 3-2-1 lands in the last 2.6 s, with "Bình luận đáp án nhé!" on screen. OK.

## Checks
- Sync: 22 word-anchored windows, 0 more than 1 frame off.
- Facts: every number on screen is in the problem (10, 8, 4, 5) or follows from it (4+4+4=12, 12+1=13). The challenge answer (7) is not shown. scene.js asserts 12, 13 and 7 by brute force.
