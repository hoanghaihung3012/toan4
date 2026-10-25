# ban_3_mui_ten_en: verification + director's review

English version of `ban_3_mui_ten`, reusing its scenes. Final length is 56.43 s (the Vietnamese one is 50.93 s). Voice: en-US-AvaNeural at +10%. Finished file name: `three_arrows`.

## Verification loops
1. **Key-pose match**
   - Vietnamese before/after exporting `TEXT`: mean 0.000 on all 7 beats, so the Vietnamese clip is unchanged.
   - VI/EN strip (`keypose_compare.png`): the layout is identical and only the words differ. Every English string fits; "? totals" is the only one longer than the Vietnamese and still has room.
2. **Sound-off read (fresh subagent, sheets at 2 fps): YES.** It retold the hook, the ladder of totals 3 to 15 (+2 each step), the duplicate 1+1+5 = 7, the answer 7, and the 4-arrow challenge with the countdown and the answer 9. It found the math correct and said "3 arrows", "different totals", "repeat!" and "Your turn!" read naturally.
3. **Sync:** 22 word-anchored windows, 0 off by more than 1 frame. Every English line was checked for word boundaries; each number is its own word, because results are said with "makes".
4. **Fact check:** every number on the board and in the voice is the same as in the Vietnamese lesson (F1–F3, D1–D4 in `lessons/ban_3_mui_ten/story.md`, asserts in scene.js). The English voice follows the original English problem (F1). No new facts were added.
5. **Technical (WAV):**
   - 48 kHz stereo, 56.433 s;
   - true peak −2.0 dBFS;
   - silences over 1.2 s: 34.2–35.96 (beat-5 wipe), 40.5–42.5 (beat-6 wipe), 47.8–51.1 (the 3-2-1 thinking countdown). All of them are intended.

## Director's review (brutal)
1. **The English runs 11% longer than the Vietnamese** (58.3 s at the first build). Fix: the rate went from +6% to +10%, and L6 was shortened to "Move 1 arrow one ring in: the total goes up 2.", which brought it to 56.4 s.
2. **The ladder beat (beat 3) was the longest gap against the Vietnamese** (14.1 s vs 11.7 s). The shortened L6 brought it down; the short counting lines ("Now 5. Then 7. 9. 11. 13.") keep the arrows hopping in time.
3. **Hold checks:**
   - 2.5–5.0 s: about 2.5 s with the arrows landed while the voice says "and all 3 hit the target";
   - 38–39.5 s: about 1.5 s on "So there are…";
   - 50.6–52 s: about 1.5 s on "Answer:".
   
   All of them are under the 3 s rule. They are the same holds as in the Vietnamese clip.

## Still weak (the user's call; changing these would change the Vietnamese scene too)
- The question "? different totals" only appears at about 8.5 s. The reviewer wanted it earlier.
- The challenge answer "4 6 8 … 20" has no +2 arcs, and "9 totals" drops "different" (it mirrors the Vietnamese "9 tổng").
- The lower part of the frame is empty in the first half.
