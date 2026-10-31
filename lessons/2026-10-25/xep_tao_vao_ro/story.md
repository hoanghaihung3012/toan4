# Xếp 7 quả táo vào 3 rổ — dữ kiện + kịch bản

9:16 (TikTok), bảng xanh + táo, rổ và ô gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: **đếm theo số táo ở rổ A**. Còn lại n quả thì rổ B lấy 0, 1, …, n quả (rổ C lấy phần còn lại) → n + 1 cách.
A = 7, 6, …, 0 cho 1, 2, …, 8 cách → 1 + 2 + … + 8 = 36 (ghép cặp: 4 cặp × 9).
Không có số câu trên màn hình và trong lời đọc.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | "Tìm số cách xếp 7 quả táo giống hệt nhau vào 3 chiếc rổ khác nhau (biết rằng có thể có rổ không chứa quả táo nào)." | Google Sheet "Toán lớp 4 - AI", cột "Câu hỏi chữ" |
| D1 | Ví dụ 2 + 4 + 1 = 7 và 0 + 7 + 0 = 7 là hai cách xếp | Từ F1 (assert) |
| D2 | Rổ A có a quả (a = 7…0) → còn 7 − a quả → rổ B lấy 0…(7 − a) quả → 8 − a cách | Từ F1 (assert, và đếm thử mọi bộ (a, b, c) bằng vòng lặp = 36) |
| D3 | 1 + 2 + … + 8 = 36; ghép cặp 1+8 = 2+7 = 3+6 = 4+5 = 9, 9 × 4 = 36 | Tính từ D2 (assert) |
| D4 | Thử thách: 5 quả táo, 3 rổ (có thể trống) — đáp án 1 + 2 + … + 6 = 21, **không nói ra** trong clip | Tự đặt cùng dạng, tính lại (assert) |

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Xếp táo vào rổ"; 7 quả táo bật lên; 3 rổ A, B, C; "Rổ có thể trống"; "Bao nhiêu cách?"; 3 chấm | Đề F1 |
| 2. Ví dụ | Khăn lau. Táo bay vào rổ: A 2, B 4, C 1 → "2 + 4 + 1 = 7 ✓"; tất cả nhảy sang B → "0 + 7 + 0 = 7 ✓"; "3 số, tổng = 7" | D1 |
| 3. Đếm theo rổ A | Khăn lau. 8 hàng "A = 7" … "A = 0", mỗi hàng các ô gỗ ghi số táo rổ B có thể lấy: 0 / 0 1 / 0 1 2 / … / 0 … 7 → thành bậc thang 1…8 ô | D2 |
| 4. Cộng | Khăn lau. "1 + 2 + … + 8", cung nối 4 cặp, mỗi cung "9"; "9 × 4 = 36"; "Có 36 cách" khoanh | D3 |
| 5. Thử thách | Khăn lau. "Đến lượt bạn!", 5 quả táo, 3 rổ, "? cách", "Bình luận đáp án nhé!", đếm ngược 3-2-1 | D4 (không nói đáp án) |
