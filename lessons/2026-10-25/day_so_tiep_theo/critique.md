# Verification and critique: Tìm số tiếp theo (1, 4, 10, 22, 46, …)

Length 62.27 s, 7 beats, 19 voice lines (vi-VN-HoaiMyNeural, +8%).

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | `inspect.mjs diff keyposes_ref keyposes`: mean 0.000 on all 7 beats (the later fixes only touched transient moves). |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets: retold every scene, both methods (doubling jumps → 94; ×2 + 2 → 94) and the challenge (190). Verdict **yes**. Flagged: block flying out of a result looked garbled at ~41.5 s → fixed (block now starts below the result, small, then arcs to the next row). |
| 3. Sync | `synccheck.mjs`: 39 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 62.267 s, 48 kHz stereo, −16.1 LUFS, true peak −4.1 dBFS. Silences > 1.2 s: 5.4–8.0 thinking dots (intended), 30.0–32.4 end of beat 4 + wipe, 46.2–47.9 wipe, 51.8–55.7 countdown 3-2-1 (intended), last 1.2 s tail. MP4 checks run after approval. |
| 6. Director's review | Two passes, below. |
| Tests | `npm test`: 5/5 lessons pass (day_so_tiep_theo included). |

## Fact check (every on-screen word and voice line)
| Item | Source |
|---|---|
| Dãy 1, 4, 10, 22, 46; "Số tiếp theo là gì?" | F1 (người dùng) |
| +3, +6, +12, +24; "×2" giữa các bước; "24 × 2 = 48"; "+48"; "46 + 48 = 94" | F2 hoidap247 7460602 |
| "Cách 2: × 2 + 2", 1→4, 4→10, 10→22, 22→46, 46→94 | D1 (tính lại, assert trong scene.js) |
| "Đến lượt bạn!", 22, 46, 94, ?, "+96", "48 × 2 = 96", "94 + 96 = 190" | F3 olm.vn (dãy … 94; 190; bước 48, 96), D2 |
| "Mẹo nè: đừng nhìn số, hãy nhìn bước nhảy!", "Bình luận đáp án nhé!", "Hai cách, cùng ra 94!" | Lời dẫn, không chứa số liệu mới |

## Director's review, pass 1 (brutal)
1. **Dead hold 7.5–9.8 s**: "Mẹo nè: đừng nhìn số" over a frozen board. The weakest moment, right after the hook.
2. **Chain in Cách 2 garbles**: the next row's block took off on top of the yellow result, hiding it for a few frames each row.
3. **Layout too small, lots of empty board** in the first render (labels 72 px, equations 104 px, everything bunched in the middle); ✓ in Cách 2 hit the circle around 94; circle around 190 cut the "=".

Fixes: (1) chalk idea-burst on "Mẹo", the number blocks shake "no" on "đừng nhìn số", then hop on "bước nhảy"; (2) the flying block starts below the result at 0.55× and arcs left; (3) whole layout spread over y 250–1550, labels 84 px, equations 120 px, ticks moved, wider equation gaps. Rebuilt timing, re-ran sync and sheets.

## Pass 2: still weak (your call)
- The +3 … +24 labels and the pink "×2" are the smallest text in the video (≈69 px on the phone after the safe-area scale). They are readable, but the row of 6 blocks cannot be wider inside the safe area.
- The challenge reveals 190 right after the countdown. That is the usual TikTok pattern, but viewers have no real time to comment first.
- The second wipe (beat 5 → 6) follows the big "94" after only a short beat; a viewer may want half a second more on the "two ways, same answer" moment.
- Storyboard: there is no image-generation tool in this session, so the storyboard is the engine's own key poses (`out/keyposes_ref/sheet.png`), checked one at a time before the rest were built.
