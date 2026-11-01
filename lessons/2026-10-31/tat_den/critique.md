# Director's review: tat_den

## Pass 1 (key poses, my own read)
1. The socks in the bag and the columns were too small for a phone. Fixed: the bag socks are 0.95 scale, the column socks 1.3 (step 90), and the columns reach lower on the board.
2. The two dashed "pair" socks in beat 1 were tiny. Fixed: they are 1.3 scale, with a large yellow "?".

## Pass 2 (fresh sound-off reader: "mostly", story retold correctly, answer 15 understood)
1. The 15th sock was a filled white sock with "?", so it could read as one more white sock even though white is "hết". Fixed: it is now a dashed outline with a yellow "?" (unknown), and it turns black mid-flight.
2. Everything sat in the top 60% of the frame. Fixed: the board is larger and lower (columns down to 1190, answer row at 1592).
3. From 29.5 to 33 s the board held still. Fixed: the lone black sock hops on "mới có 1 chiếc" (new `hb` window).
4. Kept: the long problem text in beat 1. It is the verbatim problem (a project rule), coloured by sock colour.
5. Kept: the 3 s "Sau đây là cách giải" transition, which follows the skill's standard transition beat.
6. After the enlargement, "14 + 1 = 15" touched the answer loop. Fixed: EQ2_Y 1470, ANS_Y 1592, loop ry 56.

## Checks
- Sync: 27 word-anchored windows, 0 more than 1 frame off.
- Facts: every number on screen is in the problem (6, 9, 7, 2) or follows from it (6+7+1 = 14, 14+1 = 15). The challenge answer (4) is not shown. scene.js asserts 14, 15 and 4 by brute force.

## Pass 3 (final MP4 technical check)
- freezedetect found a 4.7 s hold at 34.9–39.6 s, while the "?" sock waits. Fixed: the white column, then the grey column, hop in a wave on "đã hết" (`pw`, `pg` now 1.2 s). The re-render has no freeze ≥ 4 s; the longest hold is 3.4 s.
