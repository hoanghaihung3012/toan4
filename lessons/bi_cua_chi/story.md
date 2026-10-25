# Bi của Chi: dữ kiện + kịch bản

9:16 (TikTok), bảng xanh, bi vẽ bằng code (SVG). Lời đọc Edge TTS (vi-VN-HoaiMyNeural), 61,7 s.
Dạng toán: tìm một số khi biết nó hơn trung bình cộng của cả nhóm một lượng.
Ý chính: phần Chi hơn trung bình cộng đem chia cho hai bạn kia thì ba bạn bằng nhau, nên
An + Bình + 4 = 2 lần trung bình cộng. Không có số câu trên màn hình và trong lời đọc.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | "An có 20 viên bi, Bình có 24 viên bi. Chi có số bi nhiều hơn trung bình cộng số bi của cả ba bạn là 4 viên. Hỏi Chi có bao nhiêu viên bi?" (ô Sheet ghi "24$viên", đọc là 24 viên) | Google Sheet "Toán lớp 4 - AI", cột "Câu hỏi chữ", dòng STT 18 |
| D1 | 20 + 24 + 4 = 48 = 2 lần trung bình cộng | Tính từ F1 (assert trong scene.js) |
| D2 | Trung bình cộng = 48 : 2 = 24 | Tính từ D1 (assert) |
| D3 | Chi = 24 + 4 = 28 viên | Tính từ D2 (assert) |
| D4 | Thử lại: 20 + 24 + 28 = 72; 72 : 3 = 24 ✓. Chi đưa 4 viên cho An: An 24, Bình 24, Chi 24 | Tính từ D3 (assert) |
| D5 | Bài thử sức (số luyện tập, không phải dữ kiện): An 30, Bình 26, Chi hơn TBC 2 viên → TBC 29, Chi 31 (không hiện đáp án) | Cùng cách giải, assert trong scene.js |

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Đề | "Bi của Chi"; cột bi An 20, Bình 24, Chi "?"; "Chi = TBC + 4" (giải thích TBC); "Chi có ? viên"; 3 chấm | L1–L3: đề F1 |
| 2. TBC = chia đều | Đường kẻ đứt "TBC"; hộp "?" của Chi tới đường kẻ, 4 viên vàng nằm trên; 4 viên bay sang An → 3 cột bằng nhau; "20 + 24 + 4 = 2 × TBC" | L4–L7 |
| 3. Tìm TBC | "20 + 24 + 4 = 48", "48 : 2 = 24 = TBC" (đường kẻ ghi 24), hộp Chi đầy 24 viên + 4 vàng; "Chi: 24 + 4 = 28" khoanh | L8–L10: D1–D3 |
| 4. Thử lại | "20 + 24 + 28 = 72", "72 : 3 = 24 ✓"; 4 viên vàng của Chi sang An, cả ba 24; "Mỗi bạn 24 viên" | L11–L13: D4 |
| 5. Thử sức | "Đến lượt bạn!"; An 30, Bình 26, "Chi = TBC + 2", "Chi có ? viên", "Bình luận đáp án nhé!", đếm ngược 3-2-1 | L14–L16: D5 |
