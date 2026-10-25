# Sơn khối lập phương, kể cả mặt đáy: bao nhiêu ô vuông? — dữ kiện + kịch bản

9:16 (TikTok), khoảng 60 s, bảng xanh + khối lập phương gỗ vẽ bằng code (phép chiếu xiên như hình trong đề). Lời đọc Edge TTS (vi-VN-HoaiMyNeural). Không ghi số câu trong clip (đề không có số câu; "[4.3 points]" cũng không đưa vào).
Ý chính: **không đếm từng khối, mà nhìn từ 6 phía**: trên 8, dưới 8, trước 9, sau 9, phải 4, trái 4 → (8 + 8) + (9 + 9) + (4 + 4) = 16 + 18 + 8 = **42 ô vuông**.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề (tiếng Anh): "If you paint the following structure including its bottom, what is the total number of squares you will get to paint?" Hình khối lập phương xếp bậc thang | Ảnh đề bài người dùng gửi |
| F2 | Hình nhìn từ dưới (Bottom view): lưới 2 hàng × 4 cột | Ảnh đề bài người dùng gửi |
| D1 | Tầng dưới: 8 khối (2 × 4, theo F2). Tầng giữa: 3 khối ở hàng sau (thấy mặt trên của 4 khối hàng trước ở tầng dưới). Tầng trên: 2 khối ở hàng sau (thấy mặt trên của khối thứ 3 tầng giữa). Tổng 13 khối | Đọc trên ảnh (F1, F2) |
| D2 | Nhìn từ trên: 8 ô; từ dưới: 8 ô (= F2) | Đếm từ D1 |
| D3 | Nhìn từ trước: các cột cao 3, 3, 2, 1 → 9 ô; từ sau: 9 ô | Đếm từ D1 |
| D4 | Nhìn từ phải: cột trước cao 1, cột sau cao 3 → 4 ô; từ trái: 4 ô | Đếm từ D1 |
| D5 | 8 + 8 + 9 + 9 + 4 + 4 = 16 + 18 + 8 = 42 | Tính từ D2–D4 |
| D6 | Kiểm tra cách khác: 13 khối × 6 mặt = 78; 18 chỗ hai khối chạm nhau che 36 mặt; 78 − 36 = 42 ✓ (khối không có chỗ lõm/khuất nên 6 hướng nhìn thấy đủ mọi mặt) | Tính từ D1; `exposedFaces()` trong scene.js |
| D7 | Thử thách: không sơn mặt đáy → 42 − 8 = 34 | Tính từ D2, D5 |

Không tìm trang web đăng nguyên đề; mọi con số lấy từ ảnh đề + phép tính, `console.assert` đầu scene.js kiểm tra lại (13 khối, 8/9/4, 42 bằng hai cách, 34).

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | 13 khối gỗ rơi xuống xếp thành hình. Lưới đáy 2 × 4 bằng phấn, "mặt đáy" (hồng) được khoanh. "?" vàng to + "ô vuông". | "Sơn hết khối hình này, kể cả mặt đáy. Sẽ sơn được bao nhiêu ô vuông?" |
| 2. Cách làm | Khăn lau phần dưới. Số 1 2 3 4 trên các khối bị gạch đỏ. Cả khối nhún; 6 mũi tên từ 6 phía (hồng: trên/dưới, xanh dương: trước/sau, xanh lá: trái/phải), mỗi chữ hiện ra đúng lúc đọc, đồng thời 6 nhãn ở 6 ô "phiếu" phía dưới. | "Đừng đếm từng khối. Hãy nhìn từ 6 phía: trên, dưới, trước, sau, trái, phải." |
| 3. Trên / dưới | Cọ sơn hồng quét 8 mặt trên. Hình nhìn từ trên (8 ô hồng) "8"; hình nhìn từ dưới "8". | "Nhìn từ trên xuống, có 8 ô. Nhìn từ dưới lên, mặt đáy cũng có 8 ô." |
| 4. Trước / sau | Cọ xanh dương quét 9 mặt trước. Hình nhìn từ trước mọc cột 3, 3, 2, 1, "9"; hình từ sau (lật ngược) "9". | "Nhìn từ phía trước: 3, 3, 2, 1. Có 9 ô. Phía sau cũng có 9 ô." |
| 5. Phải / trái | Cọ xanh lá quét 4 mặt phải. Hình từ phải (1 và 3) "4"; từ trái "4". | "Nhìn từ bên phải: 1 và 3, có 4 ô. Bên trái cũng có 4 ô." |
| 6. Cộng | Khăn lau phần khối. "8 + 8 = 16", "9 + 9 = 18", "4 + 4 = 8" (mỗi cặp hình nhún khi đọc), "16 + 18 + 8 = 42" khoanh vàng. | "Cộng lại nhé: 8 cộng 8 bằng 16. 9 cộng 9 bằng 18. 4 cộng 4 bằng 8. 16 cộng 18 cộng 8, bằng 42 ô vuông!" |
| 7. Thử thách | Khăn lau. "Đến lượt bạn!", khối đã sơn, mặt đáy hồng bị gạch chéo đỏ "không sơn", "? ô", đồng hồ 3-2-1. | "Đến lượt bạn: nếu không sơn mặt đáy thì được bao nhiêu ô? Bình luận nhé!" |
| 8. Đáp án | "42 − 8 = 34" khoanh vàng, "ô vuông". | "Đáp án: 42 trừ 8, bằng 34 ô!" |
