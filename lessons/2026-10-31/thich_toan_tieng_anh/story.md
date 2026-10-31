# Thích cả Toán và Tiếng Anh (lớp 4)

## Đề (Sheet1, dòng STT 6, giữ nguyên văn)
> Một lớp học có 42 học sinh, trong đó có 25 học sinh thích môn Toán, 22 học sinh thích môn Tiếng Anh và 6 học sinh không thích cả hai môn này. Hỏi có bao nhiêu học sinh thích cả hai môn Toán và Tiếng Anh?

The question beat writes and reads exactly this text (split at its commas only for the voice lines). It has no people's names.

## Facts and sources
| # | Fact | Source |
|---|---|---|
| F1 | 42 học sinh | Đề |
| F2 | 25 thích Toán | Đề |
| F3 | 22 thích Tiếng Anh | Đề |
| F4 | 6 không thích cả hai | Đề |
| D1 | 42 − 6 = 36 thích ít nhất một môn | F1, F4 |
| D2 | 25 + 22 = 47 | F2, F3 |
| D3 | 47 − 36 = 11 thích cả hai (đếm hai lần) | D1, D2 |
| D4 | Thử lại: 25 + 22 − 11 + 6 = 42 | D3, F1 |
| D5 | Thử sức: chỉ thích Toán = 25 − 11 = 14 (not shown) | F2, D3 |

scene.js asserts D1–D5, and also checks the answer by brute force: the only overlap x with 25 + 22 − x + 6 = 42.

The method is the grade-4 line-diagram (sơ đồ đoạn thẳng) method: the bars are drawn to scale, 1 student = 900/42 px.

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | The full problem written in chalk as it is read (numbers coloured: 42 green, 25/Toán yellow, 22/Tiếng Anh mint, 6 pink), then thinking dots | the problem, verbatim |
| 2 | "Sau đây là cách giải" with underline + chime | "Sau đây là cách giải." |
| 3 | "Cả lớp: 42 học sinh" wooden bar; the 6-piece (dashed) hops away, pink "không thích môn nào"; 42 − 6 = 36; brace "36 thích ít nhất 1 môn" | remove the 6 first |
| 4 | Toán bar 25 from the left, Tiếng Anh bar 22 from the right of the 36; the overlap boxed with "?"; 25 + 22 = 47; 47 − 36 = 11; the "?" becomes 11; answer row | the overlap is counted twice |
| 5 | Equations erased; 25 + 22 − 11 + 6 = 42 ✓ (the overlap and the 6-piece pulse as they are said) | check |
| 6 | "Đến lượt bạn!" Toán-only part of the bar boxed with "?", 3-2-1, "Bình luận đáp án nhé!" | challenge |
