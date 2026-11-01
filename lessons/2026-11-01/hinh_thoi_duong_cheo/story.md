# Hình thoi: tìm hai đường chéo (lớp 4)

## Đề (Sheet1, dòng STT 15, câu hỏi hình; chép lại từ ảnh)
> Một hình thoi có diện tích là 120 cm². Nếu giữ nguyên một đường chéo và tăng đường chéo còn lại thêm 5 cm thì diện tích hình thoi mới là 150 cm². Tìm độ dài hai đường chéo ban đầu của hình thoi đó.

The board writes this text exactly. The voice reads it with "cm" spoken as "xăng-ti-mét" and "cm²" as "xăng-ti-mét vuông". It has no people's names.

## Facts and sources
| # | Fact | Source |
|---|---|---|
| F1 | Diện tích hình thoi 120 cm² | Đề |
| F2 | Giữ nguyên một đường chéo, tăng đường chéo kia thêm 5 cm → 150 cm² | Đề |
| F3 | Diện tích hình thoi = đường chéo × đường chéo : 2, tức một nửa hình chữ nhật có hai cạnh là hai đường chéo | Toán 4 (công thức diện tích hình thoi) |
| D1 | Hình chữ nhật cũ: 120 × 2 = 240 cm²; mới: 150 × 2 = 300 cm² | F1, F2, F3 |
| D2 | Phần tăng: 300 − 240 = 60 cm², là một dải rộng 5 cm, dài bằng đường chéo giữ nguyên | D1, F2 |
| D3 | Đường chéo giữ nguyên: 60 : 5 = 12 cm | D2 |
| D4 | Đường chéo kia: 240 : 12 = 20 cm | D1, D3 |
| D5 | Thử lại: 12 × 20 : 2 = 120, 12 × 25 : 2 = 150 (asserted, not shown) | D3, D4 |
| D6 | Thử sức: tăng đường chéo 12 cm thêm 4 cm → 16 × 20 : 2 = 160 cm² (not shown) | D3, D4 |

scene.js asserts every number above.

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | The problem in chalk as it is read. A rhombus with dashed diagonals (120 cm²) widens by "+5 cm" across and reads 150 cm². Both diagonals get a "?". Thinking dots. | the problem |
| 2 | "Sau đây là cách giải", with a chime | "Sau đây là cách giải." |
| 3 | "Hình thoi = nửa hình chữ nhật". The dashed rectangle round the rhombus; its 4 corner triangles fold in and cover the rhombus exactly, then fold back. Rows: Cũ 120 × 2 = 240 cm². The rhombus widens: the rectangle gains a gold strip, 5 cm wide. Mới 150 × 2 = 300 cm²; 300 − 240 = 60 cm² (written in the strip). | rectangle reasoning |
| 4 | The strip pulses; its height arrow "?" next to the kept (yellow) diagonal. 60 : 5 = 12 cm, the "?" becomes 12 cm. 240 : 12 = 20 cm, the "?" under the old width becomes 20 cm. "Hai đường chéo: 12 cm và 20 cm", both circled. | the two diagonals |
| 5 | "Đến lượt bạn!": the 12 cm / 20 cm rhombus, its 12 cm diagonal grows "+4 cm", "Diện tích mới là bao nhiêu cm²?", 3-2-1, "Bình luận đáp án nhé!" | challenge |
