# Director's review: Xếp táo vào rổ

Watched twice as 2 fps contact sheets (out/sheet0–5) plus the five key poses.

## Pass 1: brutal critique
1. **Counting table (25–44 s) carried the whole proof but did not say "how many".** Only rows A=7..5 had a "n cách" label; rows A=4..0 had none, the "C" basket was never mentioned, and the A=0 row sat half-built while the voice moved on.
2. **Table too small for a phone.** Tiles at 0.8 scale, labels at 80 px; the bottom third of the frame was empty.
3. **Pairing step (45–55 s) was hard to follow silently.** Thin pastel arcs; the numbers 1…8 never changed, so which numbers formed each 9 was unclear.
4. Opening board holds about 6 s with only thinking dots moving (kept: the voice is still reading the problem).
5. Two 3.6 s stretches without voice: thinking pause into the examples, and the 3-2-1 countdown at the end (both intentional).

## Fixes applied (top 3)
1. A "cách" column on every row (1 to 8 in yellow, each pops and pulses as its row completes), and "C lấy phần còn lại" written under the table with the first row. Each row now builds in the first 60% of its window, so no row is left half-built.
2. Table rescaled to fill the frame: tiles 0.88 scale, row spacing 150 px, labels 88 px, table runs to the hint at y≈1790.
3. Pairing: arcs thickened to 11 px, and each number takes its pair's colour with a small pulse as its arc lands, so 1+8, 2+7, 3+6, 4+5 read as colour pairs before "9 + 9 + 9 + 9".

## Pass 2
A fresh sound-off viewer retold the full lesson correctly from the silent sheets: 7 apples, 3 baskets, can be empty; examples 2+4+1 and 0+7+0; count by basket A gives 1…8 ways; pair into 9+9+9+9; 9×4=36; challenge with 5 apples and a countdown. Their remaining notes were about thumbnail-size legibility; full frames read clearly.

## Verification
- Key poses: 5/5 re-rendered and saved as the new reference.
- Sync: 15 word-anchored windows, 0 off by more than 1 frame.
- Facts: every number asserted in scene.js (brute-force count = 36, pairs of 9, examples sum to 7, challenge = 21 and not shown).
- Audio: 70.700 s, 48 kHz stereo, peak −2.3 dBFS.
- npm test: 10 pass, 0 fail.
