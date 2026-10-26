# Even 6-digit numbers: verification + director's review

English version reusing the `so_chan_6_chu_so` scenes; only board text, thousands separator and voiceover change.

## Verification loops
1. **Key-pose match:** VI/EN key poses side by side (`keypose_compare.png`): layout identical, only the text differs. First pass found "1 ways" under the ones slot in case 1; added a singular `TEXT.way` ("1 way"). Vietnamese key poses re-captured after the `NUM`/`TEXT.way` hooks: all 6 byte-identical to before.
2. **Sound-off read:** a fresh subagent read the 2 fps sheets with no audio and retold the full problem: digits 0–9, 6 different digits and even, 123,456 ✓ / 012,346 ✗ (0 can't go first), the two rules with 0 in both, case 1 (9 × 8 × 7 × 6 × 5 = 15,120), case 2 (8 × 8 × 7 × 6 × 5 × 4 = 53,760), sum 68,880, and the odd challenge with 3-2-1. Flagged "First: skip 0 and the ones digit" as terse: rewritten to "First digit: not 0 or the ones digit" and checked at full size.
3. **Sync:** `npm run sync -- so_chan_6_chu_so_en` → 39 word-anchored windows, 0 off by more than 1 frame. Edge TTS keeps "15,120", "53,760", "68,880", "123,456" and "6-digit" as single word tokens, so the anchors land on the whole number.
4. **Fact check:** every English line and board word maps 1:1 to the Vietnamese lesson (table in story.md); numbers 6, 0–9, 123,456, 9, 8, 7, 6, 5, 4, 1, 15,120, 53,760, 68,880 come from the source (F1–F2, K1–K2) or the brute-force-asserted derivations (D1–D5). Nothing new added; the challenge answer (67,200) is not shown.
5. **Technical:** voice.wav 48 kHz stereo, 88.367 s (= timing.json), true peak −1.5 dBFS. Silences > 1.2 s: 14.4–17.6 s (thinking dots + eraser), 27.1–29.0, 43.5–45.3, 64.4–66.2, 78.2–80.0 s (erasers), 85.3–88.4 s (3-2-1). All intended. Final MP4 numbers below.
6. **Director's review** (two passes over the sheets):
   - Fixed: "1 ways" grammar; terse case-2 note; checked that "= 15,120 numbers", "= 53,760 numbers" and the "68,880 numbers!" loop fit inside 1080 px (they do, with ~80 px margin).
   - Kept (same staging as the approved Vietnamese clip): small "ways" labels and "−1" hops at phone size, empty lower half during beats 1–2, the eraser wipe before "Your turn!".
   - Voice runs 88.4 s vs 78.1 s in Vietnamese: English big numbers ("fifteen thousand one hundred twenty") are long; lines are already short.
