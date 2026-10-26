# Câu 8: Hình 6 gồm bao nhiêu hình chữ nhật? — dữ kiện + kịch bản

9:16 (TikTok), khoảng 60 s, bảng xanh + ô gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: **mỗi ô là một hình chữ nhật; đếm theo hàng** → hình n có các hàng n, n−1, …, 1 ô → hình 6: 6 + 5 + 4 + 3 + 2 + 1. **Cộng nhanh bằng cách ghép cặp** (6+1, 5+2, 4+3 đều bằng 7) → 7 × 3 = **21** (đáp án **A**).

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề: "Câu 8. Hình 6 gồm bao nhiêu hình chữ nhật?" Hình 1: 1 ô chữ nhật. Hình 2: hàng dưới 2 ô, hàng trên 1 ô (bên trái). Hình 3: hàng dưới 3 ô, hàng giữa 2 ô, hàng trên 1 ô — dạng bậc thang | Ảnh đề bài người dùng gửi |
| F2 | Đáp án cho sẵn: A. 21 hình chữ nhật, B. 15 hình chữ nhật, C. 24 hình chữ nhật | Ảnh đề bài người dùng gửi |
| D1 | Hình 1 = 1; Hình 2 = 2 + 1 = 3; Hình 3 = 3 + 2 + 1 = 6 (đếm ô) | Đếm trên ảnh (F1) |
| D2 | Mỗi hình mới thêm một hàng ở dưới cùng, dài hơn hàng dưới của hình trước 1 ô → hình n có các hàng n, n−1, …, 1 | Từ D1 |
| D3 | Hình 6 = 6 + 5 + 4 + 3 + 2 + 1; ghép cặp 6+1 = 5+2 = 4+3 = 7; 7 × 3 = 21 → **A** | Tính từ D2 |
| D4 | Thử thách hình 10 = 1 + 2 + … + 10; 5 cặp, mỗi cặp 11; 11 × 5 = 55 | Tính từ D2 |

Cách hiểu "hình chữ nhật" = các ô nhỏ (như đếm 1, 3, 6 ở hình 1–3). Cách hiểu này khớp với các đáp án cho sẵn (21 = 1 + … + 6). Nếu đếm cả hình chữ nhật ghép từ nhiều ô thì riêng hình 2 đã là 5 hình và hình 6 không ra đáp án nào trong A/B/C, nên video nói rõ "mỗi ô là một hình chữ nhật". Không tìm được trang web đăng nguyên đề này; mọi số lấy từ ảnh đề + phép tính, `console.assert` trong scene.js kiểm tra lại.

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Câu 8". Hình 1, 2, 3 (ô gỗ) mọc lên, nhãn dưới mỗi hình. "Hình 6 = ?" vàng to. Ba hình nhún lần lượt. | "Hình 6 có bao nhiêu hình chữ nhật? Nhìn quy luật là ra ngay!" |
| 2. Đếm hình 1, 2 | Khăn lau. Hình 1 → "1". Hình 2: số đếm cạnh từng hàng (2, 1), "2 + 1 = 3". | "Mỗi ô là một hình chữ nhật. Đếm từng hàng nhé. Hình 1 có 1 hình. Hình 2: hàng dưới 2, hàng trên 1. Tất cả 3 hình." |
| 3. Hình 3 + quy luật | Hình 3: 3, 2, 1, "3 + 2 + 1 = 6". Hàng dưới cùng của hình 2 và 3 chuyển màu xanh và nhún: hàng mới. | "Hình 3: 3, 2, 1. Tất cả 6 hình. Mỗi hình mới thêm một hàng ở dưới, dài hơn 1 ô." |
| 4. Hình 6 | Khăn lau. Hình 6 bậc thang 6 hàng dựng lên, số 6…1 cạnh từng hàng. | "Vậy hình 6 có 6 hàng: 6, 5, 4, 3, 2, 1." |
| 5. Cộng nhanh | Khối số 6 5 4 3 2 1 rơi xuống; bay thành 3 cặp (6,1) (5,2) (4,3), dưới mỗi cặp "7". "7 × 3 = 21". | "Cộng nhanh: ghép 6 với 1, 5 với 2, 4 với 3. Cặp nào cũng bằng 7. 3 cặp là 7 nhân 3, bằng 21." |
| 6. Đáp án | A. 21 khoanh vàng, B, C gạch đỏ. | "Hình 6 có 21 hình chữ nhật. Chọn đáp án A!" |
| 7. Thử thách | Khăn lau. "Đến lượt bạn!", hình 10 dựng lên, "Hình 10 = ?", đếm ngược 3-2-1. | "Đến lượt bạn: hình 10 có bao nhiêu hình chữ nhật? Bình luận đáp án nhé!" |
| 8. Đáp án | "1 + 2 + … + 10", "= 11 × 5 = 55" (khoanh 55). | "Đáp án: 5 cặp, mỗi cặp bằng 11. 11 nhân 5 bằng 55 hình!" |
