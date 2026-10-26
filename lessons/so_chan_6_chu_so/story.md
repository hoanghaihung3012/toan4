# Số chẵn có 6 chữ số khác nhau: dữ kiện + kịch bản

9:16 (TikTok), bảng xanh, 10 thẻ số gỗ 0–9 và 6 ô trống, tất cả vẽ bằng code. Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: số chẵn ↔ **hàng đơn vị là 0, 2, 4, 6, 8**; **hàng đầu khác 0**. Chữ số 0 dính đến cả hai điều kiện nên chia 2 trường hợp, chọn hàng đơn vị trước rồi đến hàng đầu:
- Đơn vị là 0: 9 × 8 × 7 × 6 × 5 = **15 120**.
- Đơn vị là 2, 4, 6, 8 (4 cách): hàng đầu bỏ 0 và chữ số hàng đơn vị → 8 cách; rồi 8, 7, 6, 5 → 8 × 8 × 7 × 6 × 5 × 4 = **53 760**.
- Tổng **15 120 + 53 760 = 68 880 số**.

## Nguồn: Google Sheet, cột "Câu hỏi chữ", dòng STT 5 (chép nguyên văn)
> "Có bao nhiêu số tự nhiên có 6 chữ số khác nhau là số chẵn?"

## Dữ kiện
| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Số tự nhiên có 6 chữ số, các chữ số khác nhau | Đề |
| F2 | Là số chẵn; hỏi có bao nhiêu số | Đề |
| K1 | Chữ số là 0–9; số có 6 chữ số thì chữ số đầu khác 0 | Kiến thức lớp 4 (cấu tạo số) |
| K2 | Số chẵn là số có chữ số tận cùng 0, 2, 4, 6, 8 | Kiến thức lớp 4 (dấu hiệu chia hết cho 2) |
| D1 | Đơn vị 0: hàng đầu 9 cách (1–9), rồi 8, 7, 6, 5 → 15 120 | quy tắc nhân |
| D2 | Đơn vị 2/4/6/8: 4 cách; hàng đầu 10 − 2 = 8 cách (bỏ 0 và chữ số đơn vị); rồi 8, 7, 6, 5 → 53 760 | quy tắc nhân |
| D3 | 15 120 + 53 760 = 68 880 | D1 + D2 |
| D4 | Ví dụ: 123 456 (được); số bắt đầu bằng 0 như 012 346 không phải số có 6 chữ số | K1, K2 |
| D5 | Thử sức (số luyện tập, không phải dữ kiện): số lẻ có 6 chữ số khác nhau → 5 × 8 × 8 × 7 × 6 × 5 = 67 200 (không hiện đáp án) | cùng cách giải |

Kiểm tra: liệt kê toàn bộ chỉnh hợp 6 chữ số khác nhau (Python itertools và assert trong scene.js): chẵn 68 880, đơn vị 0 là 15 120, lẻ 67 200, chẵn + lẻ = 136 080 = 9 × 9 × 8 × 7 × 6 × 5.

## Cảnh
| Beat | Bảng (đọc được khi tắt tiếng) | Lời |
|---|---|---|
| 1 | 10 thẻ 0–9; "Số có 6 chữ số khác nhau", "là số chẵn"; 6 ô "?"; 123 456 ✓; 012 346 ✗ (khoanh 0) "0 không đứng đầu"; "Có bao nhiêu số?"; 3 chấm | L1–L4 |
| 2 | Thẻ 0 2 4 6 8 nhảy + chấm vàng; "chẵn" trên ô cuối, "≠ 0" trên ô đầu; "Hàng đơn vị: 0, 2, 4, 6, 8", "Hàng đầu: khác 0"; tách 2 hộp ① đơn vị 0, ② đơn vị 2, 4, 6, 8 | L5–L7 |
| 3 | Khăn lau. ① Thẻ 0 bay vào ô cuối; số cách 1, 9, 8, 7, 6, 5 dưới các ô; 9 × 8 × 7 × 6 × 5 = 15 120 (khoanh) | L8–L11 |
| 4 | Khăn lau. ② thẻ 2 4 6 8 nhảy; số cách 4, 8, 8, 7, 6, 5; "Hàng đầu: bỏ 0 và chữ số cuối"; 8 × 8 × 7 × 6 × 5 × 4 = 53 760 | L12–L15 |
| 5 | Khăn lau. Phép cộng cột 15 120 + 53 760 = 68 880 (viết từ phải sang); "Có 68 880 số!" | L16–L17 |
| 6 | Khăn lau cả bảng. "Đến lượt bạn!", "là số lẻ", 3-2-1, "Bình luận đáp án nhé!" | L18–L19 |
