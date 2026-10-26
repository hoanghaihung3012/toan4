# Hai ngăn sách: dữ kiện + kịch bản

9:16 (TikTok), bảng xanh, sách vẽ bằng code (SVG, mỗi cuốn là một gáy sách 8 px). Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8%), 69,4 s.
Dạng toán: tổng – hiệu có chuyển bớt. Ý chính: chuyển sách giữa hai ngăn không làm đổi tổng, nên sau khi chuyển dùng
tổng 160 và hiệu 8 để tìm ngăn 1, rồi cộng lại 15 cuốn đã chuyển. Không có số câu trên màn hình và trong lời đọc.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | "Hai ngăn sách có tất cả 160 cuốn sách. Nếu chuyển 15 cuốn sách từ ngăn thứ nhất sang ngăn thứ hai thì ngăn thứ nhất vẫn nhiều hơn ngăn thứ hai là 8 cuốn sách. Hỏi lúc đầu ngăn thứ nhất có bao nhiêu cuốn sách?" | Google Sheet "Toán lớp 4 - AI", cột "Câu hỏi chữ", dòng STT 17 |
| D1 | Chuyển sách giữa hai ngăn thì tổng không đổi: sau khi chuyển vẫn 160 cuốn | Suy ra từ F1 |
| D2 | Sau khi chuyển: ngăn 1 = (160 + 8) : 2 = 168 : 2 = 84; ngăn 2 = 84 − 8 = 76 | Tính từ F1, D1 (assert trong scene.js) |
| D3 | Lúc đầu ngăn 1 = 84 + 15 = 99 cuốn | Tính từ D2 (assert) |
| D4 | Thử lại: ngăn 2 lúc đầu = 160 − 99 = 61; chuyển 15: 84 và 76; 84 − 76 = 8 ✓ | Tính từ D3 (assert) |
| D5 | Bài thử sức (số luyện tập, không phải dữ kiện): 120 cuốn, chuyển 10, ngăn 1 vẫn hơn 6 → lúc đầu 73 (không hiện đáp án) | Cùng cách giải, assert trong scene.js |

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Đề | "Hai ngăn sách"; tủ 2 ngăn, "Ngăn 1: ?", "Ngăn 2: ?"; "Tổng: 160 cuốn"; bó 15 cuốn bay từ ngăn 1 xuống ngăn 2 (−15/+15); khung vàng 8 cuốn thừa + "hơn 8"; "Sau khi chuyển 15: ngăn 1 hơn 8"; "Lúc đầu ngăn 1 có ? cuốn"; 3 chấm | L1–L4: F1 |
| 2. Sau khi chuyển | "Tổng vẫn 160 cuốn"; 8 cuốn vàng (thêm vào ngăn 2) + "+8"; "Thêm 8: hai ngăn bằng nhau"; "160 + 8 = 168", "168 : 2 = 84" khoanh; "Ngăn 1: 84" | L5–L8: D1–D2 |
| 3. Lúc đầu | khung quanh 15 cuốn ở ngăn 2 bay về ngăn 1 (+15); "84 + 15 = 99" khoanh; "Lúc đầu ngăn 1 có 99 cuốn" | L9–L11: D3 |
| 4. Thử lại | "160 − 99 = 61"; bó 15 cuốn chuyển lại → 84 và 76; "84 − 76 = 8 ✓"; "Đúng rồi!" | L12–L14: D4 |
| 5. Thử sức | "Đến lượt bạn!"; tổng 120, chuyển 10, "Sau khi chuyển 10: ngăn 1 hơn 6", "Lúc đầu ngăn 1 có ? cuốn", "Bình luận đáp án nhé!", đếm ngược 3-2-1 | L15–L17: D5 |
