# Toán tính tuổi — dữ kiện + kịch bản

9:16 (TikTok), bảng xanh + ô gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Hai dạng toán tính tuổi lớp 4, giải bằng **sơ đồ đoạn thẳng**:
- Dạng tổng – tỉ (lùi về quá khứ): mỗi người bớt cùng số năm → tổng bớt 2 lần số năm.
- Dạng hiệu – tỉ (tiến tới tương lai): **hiệu số tuổi không đổi**.
Không có số câu trên màn hình và trong lời đọc (yêu cầu của người dùng).

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | "Hiện nay, tổng số tuổi của hai bố con là 48 tuổi. Biết rằng 4 năm trước, tuổi bố gấp 4 lần tuổi con. Hỏi hiện nay bố bao nhiêu tuổi?" | Google Sheet "Toán lớp 4 - AI", cột "Câu hỏi chữ" (dòng "các dạng toán tính tuổi") |
| F2 | "Hiện nay mẹ 35 tuổi và con gái 7 tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi mẹ sẽ gấp 3 lần tuổi con?" | Cùng ô Sheet như F1 |
| D1 | 4 năm trước, tổng tuổi = 48 − 4 − 4 = 40 | Tính từ F1 (assert trong scene.js) |
| D2 | Sơ đồ 4 năm trước: con 1 phần, bố 4 phần → 1 + 4 = 5 phần; con = 40 : 5 = 8; bố = 8 × 4 = 32 | Tính từ F1, D1 (assert) |
| D3 | Hiện nay bố 32 + 4 = 36 tuổi (kiểm tra: con 8 + 4 = 12; 36 + 12 = 48; 32 = 4 × 8) | Tính từ D2 (assert) |
| D4 | Hiệu tuổi mẹ – con: 35 − 7 = 28, không đổi theo năm | Tính từ F2 (assert) |
| D5 | Khi mẹ gấp 3 lần con: 3 − 1 = 2 phần = 28 → con = 28 : 2 = 14; số năm = 14 − 7 = 7; mẹ khi đó 35 + 7 = 42 = 3 × 14 | Tính từ F2, D4 (assert) |

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu A | "Tính tuổi"; "Bố + Con = 48"; "4 năm trước:" "Bố = 4 × Con"; "Bố nay = ?"; 3 chấm suy nghĩ | Đề F1 |
| 2. Lùi 4 năm | Khăn lau. Thanh gỗ Bố (dài) và Con (ngắn); mỗi thanh rơi ra một khúc "4"; "48 − 4 − 4 = 40", khoanh 40 | "4 năm trước, bố bớt 4 tuổi, con cũng bớt 4 tuổi…" |
| 3. Sơ đồ A | Khăn lau. "4 năm trước"; Con 1 ô, Bố 4 ô, ngoặc "40"; "1 + 4 = 5 phần", "Con: 40 : 5 = 8" (số 8 vào từng ô), "Bố: 8 × 4 = 32", "Bố nay: 32 + 4 = 36" khoanh | D2, D3 |
| 4. Móc câu B | Khăn lau. "Sau mấy năm?"; "Mẹ: 35 tuổi", "Con: 7 tuổi"; "Mẹ = 3 × Con"; 3 chấm | Đề F2 |
| 5. Hiệu không đổi | Khăn lau. Thanh Mẹ, thanh Con, ngoặc phần hơn "28"; "35 − 7 = 28"; hai thanh cùng dài thêm "+1" ba lần, ngoặc 28 vẫn giữ nguyên; "Hiệu không đổi!" | D4 |
| 6. Sơ đồ B | Khăn lau. "Khi mẹ gấp 3 lần con"; Mẹ 3 ô, Con 1 ô, ngoặc 2 ô hơn = "28"; "3 − 1 = 2 phần", "Con: 28 : 2 = 14", "14 − 7 = 7 năm" khoanh; "42 = 3 × 14" ✓ | D5 |
| 7. Chốt | Khăn lau. "Nhớ 2 mẹo": "Mỗi năm, ai cũng +1 tuổi", "Hiệu số tuổi không đổi"; "Bình luận nhé!" | Lời dẫn, không số liệu mới |
