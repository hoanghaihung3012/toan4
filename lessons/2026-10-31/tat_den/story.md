# Chắc chắn có một đôi tất đen (lớp 4)

## Đề (Sheet1, dòng STT 13, giữ nguyên văn)
> Một chiếc túi có 6 chiếc tất trắng, 9 chiếc tất đen và 7 chiếc tất xám. Nếu không nhìn vào túi, hỏi phải lấy ra ít nhất bao nhiêu chiếc tất để chắc chắn có được một đôi (2 chiếc) tất màu đen?

The question beat writes and reads exactly this text. The voice lines split it only at its comma and before "Nếu". It has no people's names.

## Facts and sources
| # | Fact | Source |
|---|---|---|
| F1 | 6 trắng, 9 đen, 7 xám | Đề |
| F2 | cần 2 chiếc tất đen | Đề |
| D1 | Trường hợp xui nhất: lấy hết 6 trắng và hết 7 xám (không có chiếc đen nào) | F1 |
| D2 | Thêm 1 chiếc đen: vẫn chỉ có 1 chiếc đen (< 2) | F2 |
| D3 | 6 + 7 + 1 = 14 chiếc mà mới có 1 chiếc đen | D1, D2 |
| D4 | Trắng và xám đã hết, nên chiếc thứ 15 chắc chắn là tất đen → 2 chiếc đen | F1, D3 |
| D5 | 14 + 1 = 15 | D3 |
| D6 | Thử sức: chắc chắn có một đôi cùng màu → 1 + 1 + 1 + 1 = 4 (not shown) | F1 |

scene.js brute-forces both answers: it takes the largest draw (w ≤ 6, b ≤ 9, g ≤ 7) that misses the goal, then adds 1. That gives 15 for "2 black" and 4 for "2 of one colour".

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | The full problem in chalk as it is read (6 trắng, 9 đen pink, 7 xám grey, "2 chiếc" and "một đôi" yellow). Real-coloured socks drop into a chalk bag as their counts are read. A chalk eye is crossed out ("không nhìn"). Two dashed yellow sock slots and "?" for the black pair. Thinking dots. | the problem, verbatim |
| 2 | "Sau đây là cách giải", with a chime | "Sau đây là cách giải." |
| 3 | "Trường hợp xui nhất". Three columns Trắng / Xám / Đen; the Đen column has 2 dashed slots ("cần 2"). All 6 white drop in ("hết"), all 7 grey ("hết"), then 1 black. 6 + 7 + 1 = 14, "mới có 1 chiếc đen ✗" | worst case |
| 4 | A white "?" sock (chiếc thứ 15). "hết" pulses on white and grey. The sock flies into the black column's 2nd slot and turns black, ✓. 14 + 1 = 15, answer circled | the 15th sock |
| 5 | "Đến lượt bạn!": một đôi tất cùng màu? 3-2-1, "Bình luận đáp án nhé!" | challenge |
