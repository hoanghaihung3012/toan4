# Chia cho số có hai chữ số (Toán 4): dữ kiện + kịch bản

9:16 (TikTok), khoảng 70–80 s, bảng xanh + khối gỗ (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ví dụ chính do người dùng đưa: **68917 : 85**. Ý chính: **chia → nhân → trừ → hạ**, lặp lại; đoán thương bằng cách **che chữ số cuối**; số chưa đủ chia thì **viết 0 vào thương**.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Ví dụ 68917 : 85 | Người dùng đưa |
| F2 | Chia theo thứ tự từ trái sang phải; mỗi lượt: "67 chia 21 được 3, viết 3; 3 nhân 1 bằng 3…; 67 trừ 63 bằng 4, viết 4. Hạ 2, được 42; …" (chia → nhân → trừ → hạ, viết tích dưới số bị chia rồi trừ) | Loigiaihay, Lý thuyết chia cho số có hai chữ số (SGK Toán 4): loigiaihay.com/ly-thuyet-chia-cho-so-co-hai-chu-so-a56825.html |
| F3 | Số bị chia lớn: lấy nhóm chữ số đầu đủ để chia, ví dụ 245 678 : 56 bắt đầu bằng "245 chia 56 được 4" (vì 24 < 56) | VietJack, Lý thuyết Chia cho số có hai chữ số (KNTT Bài 44): vietjack.com/toan-4-kn/ly-thuyet-chia-cho-so-co-hai-chu-so.jsp |
| F4 | Ước lượng thương: "290 : 45 — che chữ số 0 và 5 ta có 29 : 4 được 6 … Thử lại: 6 × 45 = 270; 290 – 270 = 20 < 45. Vậy ta ước lượng đúng" | VietJack, Giải Toán 4 trang 81: vietjack.com/giai-toan-lop-4/chia-cho-so-co-hai-chu-so.jsp |
| F5 | Thương có chữ số 0: "Hạ 4; 4 chia 24 được 0, viết 0" (2448 : 24) | Loigiaihay, Lý thuyết thương có chữ số 0: loigiaihay.com/ly-thuyet-thuong-co-chu-so-0-a56847.html |
| F6 | Bài tập 2996 : 28 (Thương có chữ số 0, Bài 1b) | VietJack, Giải Toán 4 trang 85: vietjack.com/giai-toan-lop-4/thuong-co-chu-so-0.jsp |
| D1 | 68 < 85 → lấy 689. Che 9 và 5: 68 : 8 được 8. 8 × 85 = 680; 689 − 680 = 9; 9 < 85 ✓ | Tính từ F1–F4 |
| D2 | Hạ 1 → 91. 91 : 85 được 1; 1 × 85 = 85; 91 − 85 = 6 | Tính từ F2 |
| D3 | Hạ 7 → 67. 67 < 85 → được 0, viết 0. Dư 67 | Tính từ F2, F5 |
| D4 | 68917 : 85 = 810 (dư 67). Kiểm tra: 85 × 810 + 67 = 68917 | Tính |
| D5 | 2996 : 28 = 107 (29 : 28 = 1 dư 1; hạ 9 → 19 < 28 → 0; hạ 6 → 196 : 28 = 7) | Tính từ F6 |

Kiểm tra số bằng code (`console.assert` đầu scene.js): 85·8 = 680, 689 − 680 = 9, 91 − 85 = 6, 67 < 85, 85·810 + 67 = 68917, 28·107 = 2996.

## Hướng TikTok
- Móc câu 2 giây đầu: khối 68917 và 85 rơi xuống, dấu "?" vàng to. "Nhìn khó, nhưng chỉ 4 bước."
- Dải 4 bước **chia · nhân · trừ · hạ** nằm cố định dưới bảng, bước đang làm sáng vàng: tắt tiếng vẫn thấy đang ở bước nào.
- Mẹo "che": một miếng gỗ trơn trượt cong đè lên chữ số cuối của 689 và 85.
- Cú bẫy: 67 < 85 → số 0 bật vào thương, khoanh đỏ, "đừng quên số 0".
- Kết: thử thách 2996 : 28 (cũng có số 0 ở thương), đếm ngược 3-2-1, rồi đáp án 107.

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | Khối 6 8 9 1 7, dấu chia, khối 8 5 rơi xuống (nén–nảy). "?" vàng to. | "68917 chia 85 bằng bao nhiêu? Nhìn khó, nhưng chỉ có 4 bước thôi!" |
| 2. Đặt tính | Khăn lau. Khối trượt cong vào vị trí đặt tính: số bị chia bên trái, 85 bên phải, kẻ gạch dọc + gạch ngang. Dải "chia · nhân · trừ · hạ" hiện ở dưới. | "Đặt tính như thế này. Nhớ 4 bước: chia, nhân, trừ, hạ." |
| 3. Lấy 689 + mẹo che | Gạch chân 68 (đỏ) + "68 < 85" ở ô nháp; gạch chân kéo dài thành 689 (vàng). Hai miếng gỗ trơn che 9 và 5. Ô nháp "68 : 8 → 8". Chữ 8 vàng vào thương. Dải sáng "chia". | "68 bé hơn 85, nên ta lấy 689. Mẹo: che chữ số cuối. 68 chia 8 được 8. Viết 8." |
| 4. Nhân, trừ | Miếng che bay đi. Mũi tên cong 8 → 85. Viết 680 dưới 689, dấu trừ, gạch ngang, số 9. Ô nháp "9 < 85" + ✓. Dải sáng "nhân", "trừ". | "8 nhân 85 bằng 680. 689 trừ 680 bằng 9. 9 bé hơn 85, đúng rồi!" |
| 5. Hạ 1 | Khối 1 nhún lên, mũi tên vàng đứt nét kéo xuống, "1" vàng cạnh 9 → 91. Thương thêm 1. Viết 85, trừ, được 6. | "Hạ 1, được 91. 91 chia 85 được 1. 1 nhân 85 bằng 85. 91 trừ 85 bằng 6." |
| 6. Hạ 7 + số 0 | Khối 7 nhún, hạ xuống → 67. Ô nháp "67 < 85" đỏ. Số 0 bật vào thương (khoanh, tia phấn). | "Hạ 7, được 67. 67 chia 85? 67 bé hơn 85, nên được 0. Nhớ viết 0 vào thương!" |
| 7. Kết quả | Khoanh 67 "dư". Ô nháp: "68917 : 85 = 810 (dư 67)". | "Vậy 68917 chia 85 bằng 810, dư 67." |
| 8. Thử thách | Khăn lau. Khối 2996 : 28 rơi xuống, "?" + đếm ngược 3, 2, 1. | "Đến lượt bạn: 2996 chia 28 bằng bao nhiêu? Bình luận đáp án nhé!" |
| 9. Đáp án | "= 107", số 0 khoanh vàng. | "Đáp án: 107. Lại có số 0 ở giữa đấy!" |
