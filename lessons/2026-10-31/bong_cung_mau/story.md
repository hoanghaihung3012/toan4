# Chắc chắn có 5 quả bóng cùng màu (lớp 4)

## Đề (Sheet1, dòng STT 12, giữ nguyên văn)
> Trong một chiếc hộp kín có 10 quả bóng đỏ, 8 quả bóng xanh dương và 4 quả bóng xanh lá. Hỏi cần lấy ra ngẫu nhiên ít nhất bao nhiêu quả bóng để chắc chắn có được 5 quả bóng cùng màu?

The question beat writes and reads exactly this text. The voice lines split it only at its comma and before "Hỏi". It has no people's names.

## Facts and sources
| # | Fact | Source |
|---|---|---|
| F1 | 10 đỏ, 8 xanh dương, 4 xanh lá | Đề |
| F2 | cần 5 quả cùng màu | Đề |
| D1 | Trường hợp xui nhất: đỏ 4, xanh dương 4 (mỗi màu dừng ở 4 < 5) | F1, F2 (10 ≥ 4, 8 ≥ 4) |
| D2 | Xanh lá chỉ có 4 < 5: lấy hết 4 quả vẫn chưa đủ 5 | F1, F2 |
| D3 | 4 + 4 + 4 = 12 quả mà chưa có 5 quả cùng màu | D1, D2 |
| D4 | Quả thứ 13 chỉ có thể là đỏ hoặc xanh dương, nên màu đó có 5 quả | D2, D3 |
| D5 | 12 + 1 = 13 | D3 |
| D6 | Thử sức: chắc chắn có 3 quả cùng màu → 2 + 2 + 2 + 1 = 7 (not shown) | F1 |

scene.js brute-forces both answers: it takes the largest draw (r ≤ 10, b ≤ 8, g ≤ 4) with every colour under the target, then adds 1. That gives 13 for 5 balls and 7 for 3 balls.

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | The full problem, written in chalk as it is read (10 đỏ red, 8 xanh dương blue, 4 xanh lá green, 5 yellow). Real-coloured balls drop into a chalk box as their counts are read. A wooden lid closes the box ("kín", "ngẫu nhiên"). Thinking dots. | the problem, verbatim |
| 2 | "Sau đây là cách giải", with a chime | "Sau đây là cách giải." |
| 3 | "Trường hợp xui nhất". Three tubes labelled Đỏ / Xanh dương / Xanh lá, with a yellow dashed "5" level. 4 red and 4 blue balls drop in, then the 4 green ones ("hết!"). 4 + 4 + 4 = 12, "chưa có 5 quả cùng màu" | worst case |
| 4 | A white "?" ball (quả thứ 13). The green tube gets a red ✗. The ball flies to red OR blue, reaches the 5 line, ✓. 12 + 1 = 13, answer circled | the 13th ball |
| 5 | "Đến lượt bạn!": 3 quả cùng màu? 3-2-1, "Bình luận đáp án nhé!" | challenge |
