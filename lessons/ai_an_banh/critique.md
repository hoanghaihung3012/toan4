# Ai đã ăn bánh? (chỉ 1 bạn nói thật): verification + director's critique

Length 49.3 s · 5 beats (one board for the solution + challenge) · voice vi-VN-HoaiMyNeural, rate +8 %.

## Verification loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Key poses on the voice timing vs the reference set: beats 1–2 mean 0.000; beats 3–5 changed on purpose by the pass-2 fixes (rule underline, single strike, countdown moved), reference retaken after. |
| 2. Sound-off read | Pass 1 (fresh subagent): full retelling (puzzle, Bảo/Dũng contradiction, DỐI stamps, "không" struck, Chi, check, challenge); **mostly**. Flagged: no visible link between Bảo and Dũng, weak strike, small stamps, countdown over "Ai ăn bánh?". Fixed. Pass 2 (new subagent): full retelling again; **mostly**. Flagged: why An/Chi lie, "không" covered by the cross, countdown overlap. Fixed (underline back to "Chỉ 1 bạn nói thật", single strike line, countdown lower). |
| 3. Sync | 18 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; scene.js tries every eater and asserts the unique answer. Nothing cut. |
| 5. Technical | voice.wav 48 kHz stereo, 50.9 s, true peak −3.4 dBFS. Silences > 1.2 s: 12.6–16.0 s (thinking dots), 40.3–42.1 s (eraser), 47.8–50.9 s (3-2-1). All intended. |
| 6. Director's review | Two passes, top 3 fixed each time (below). |

## Fact check
| On screen / voice | Source |
|---|---|
| Ai đã ăn bánh; 4 bạn; chỉ 1 bạn nói thật, 3 bạn nói dối | Source picture (story.md) |
| The four quotes, word for word | Source picture |
| Bảo hoặc Dũng nói thật; 1 câu đúng, 1 câu sai | Derived D1 (Dũng's sentence says Bảo's is false) |
| An, Chi nói dối; "không" sai → Chi ăn bánh | D2, D3 |
| Thử lại: An, Bảo, Chi sai; Dũng thật; đúng 1 bạn | D4, brute force |
| Thử sức: chỉ 1 bạn nói dối (answer Bảo, not shown) | D5, same sentences, unique answer |

## After the preview (user's request)
- Names changed to Vietnamese (An, Bảo, Chi, Dũng), voice rebuilt (49.3 s), sync re-run: 18 windows, 0 off. "Bình" avoided because the ending says "Bình luận".

## Director's critique, pass 1
1. **Everything sat in the top half, text small.** Fixed: rows spread over the board, quotes 50 → 58 px, tags 190 wide.
2. **Bảo/Dũng loops did not show *why* they matter.** Fixed: two-headed bracket joining Bảo and Dũng on "ngược nhau", then "1 câu đúng, 1 câu sai".
3. **Stamps small, THẬT ≈ DỐI.** Fixed: bigger stamps (168 × 82) with tinted fill; green THẬT vs red DỐI.

## Director's critique, pass 2
1. **Why An and Chi lie was not shown.** Fixed: the rule "Chỉ 1 bạn nói thật" is underlined when the voice says it.
2. **The red X hid "không".** Fixed: red loop + one strike line, the word stays readable.
3. **Countdown digits ran over "Ai ăn bánh?".** Fixed: countdown moved down, comment line lower.

## Still weak (your call)
- The bracket runs under the left stamps once they land (kept, it is the reasoning trail).
- The board below y ≈ 1600 stays empty by design (TikTok caption area).
