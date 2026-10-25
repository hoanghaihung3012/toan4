# Ai đã ăn bánh? (chỉ 1 bạn nói thật)

Source: the user's Google Sheet "Câu hỏi hình", picture in the cell (saved as `source/question.png`).

## Transcription of the source (verbatim)
> Bốn bạn nhỏ Alex, Ben, Cindy và Dan được hỏi xem ai đã ăn chiếc bánh. Biết rằng chỉ có **duy nhất 1 bạn nói thật**, còn 3 bạn kia nói dối:
> - Alex: "Ben đã ăn bánh."
> - Ben: "Dan đã ăn bánh."
> - Cindy: "Tớ không ăn bánh."
> - Dan: "Ben đang nói dối đấy."
>
> Hỏi ai là người đã ăn chiếc bánh?

## Facts
| # | Fact | Source |
|---|---|---|
| F1 | 4 bạn, 1 chiếc bánh, chỉ 1 bạn nói thật | Source picture |
| F2 | The four sentences above | Source picture |
| F3 | Question: who ate the cake | Source picture |

## Derived (checked in `scene.js` by trying every eater)
| # | Step | Check |
|---|---|---|
| D1 | Dan says Ben's sentence is false, so exactly one of Ben, Dan tells the truth | true for all 4 eaters |
| D2 | The only truth-teller is Ben or Dan, so Alex and Cindy lie | from F1 + D1 |
| D3 | Cindy lies: "Tớ không ăn bánh" is false, so Cindy ate | from D2 |
| D4 | Check (Cindy ate): Alex false, Ben false, Cindy false, Dan true: exactly 1 truth; Cindy is the only eater that fits | brute force |
| D5 | Practice: same four sentences, "chỉ 1 bạn nói dối": answer Ben (not shown) | brute force, unique |

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | Title "Ai đã ăn bánh?", cake, "Chỉ 1 bạn nói thật", 4 wooden name tags + quotes, thinking dots | L1–L6: the puzzle |
| 2 | Loops around Ben and Dan; "Ben … dối" underlined; "Ben hoặc Dan nói thật", "1 câu đúng, 1 câu sai" | L7–L9 |
| 3 | DỐI stamps on Alex and Cindy; "không" struck out; cake flies down; "Cindy đã ăn bánh!" | L10–L12 |
| 4 | DỐI stamp on Ben, THẬT stamp on Dan; "1" circled + ✓ | L13–L16 check |
| 5 | Eraser; "Đến lượt bạn!", "Chỉ 1 bạn nói dối", same quotes, "Ai ăn bánh?", 3-2-1, "Bình luận đáp án nhé!" | L17–L18 |
