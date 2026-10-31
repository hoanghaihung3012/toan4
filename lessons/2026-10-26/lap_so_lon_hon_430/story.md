# Lập số có 3 chữ số khác nhau, lớn hơn 430: dữ kiện + kịch bản

9:16 (TikTok), bảng xanh, 5 thẻ số gỗ 1, 3, 4, 6, 8 và 3 ô trống (trăm, chục, đơn vị), tất cả vẽ bằng code. Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8 %).
Ý chính: **xét chữ số hàng trăm trước**. Hàng trăm 1 hoặc 3 → nhỏ hơn 430, loại. Hàng trăm 6 hoặc 8 → luôn lớn hơn 430: **2 × 4 × 3 = 24 số**. Hàng trăm 4 → hàng chục phải là 3, 6 hoặc 8 (41_ nhỏ hơn 430): **1 × 3 × 3 = 9 số**. Tổng **24 + 9 = 33 số**.

## Nguồn: Google Sheet, cột "Câu hỏi chữ", dòng STT 4 (chép nguyên văn)
> "Từ các chữ số 1, 3, 4, 6, 8, có thể lập được bao nhiêu số có 3 chữ số khác nhau và lớn hơn 430"

## Dữ kiện
| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Các chữ số 1, 3, 4, 6, 8 | Đề |
| F2 | Số có 3 chữ số khác nhau | Đề |
| F3 | Lớn hơn 430; hỏi có bao nhiêu số | Đề |
| D1 | Hàng trăm 1 hoặc 3: số ≤ 386 < 430, loại | F1–F3 |
| D2 | Hàng trăm 6 hoặc 8: số ≥ 613 > 430. Hàng trăm 2 cách, hàng chục 4 cách (4 chữ số còn lại), hàng đơn vị 3 cách → 2 × 4 × 3 = 24 | quy tắc nhân |
| D3 | Hàng trăm 4: hàng chục 1 → 41_ < 430, loại. Hàng chục 3, 6, 8 (3 cách): 43_ (431, 436, 438), 46_, 48_ đều > 430. Hàng đơn vị 3 cách → 1 × 3 × 3 = 9 | F1–F3 |
| D4 | Tổng 24 + 9 = 33 số | D2 + D3 |
| D5 | Ví dụ ở đầu bài: 618 (được), 413 (không được, nhỏ hơn 430) | thử trực tiếp |
| D6 | Thử sức (số luyện tập, không phải dữ kiện): cùng 5 chữ số, lớn hơn 640 → 12 + 6 = 18 số (không hiện đáp án) | cùng cách giải, assert trong scene.js |

`scene.js` liệt kê **mọi** số có 3 chữ số khác nhau từ 1, 3, 4, 6, 8 (60 số), đếm số lớn hơn 430 (33), và assert từng trường hợp (24, 9, hàng chục 1 bị loại, 618 ✓, 413 ✗, thử sức 18).

## Hướng TikTok
- Móc câu (0–2 s): 5 thẻ số rơi xuống bảng, "lớn hơn 430" màu vàng, 3 ô trống có dấu "?".
- Ví dụ ✓/✗: 618 ✓, 413 ✗ (< 430), rồi "Có bao nhiêu số?" + 3 chấm suy nghĩ.
- Xét hàng trăm: 5 dòng 1_ _ ✗, 3_ _ ✗, 4_ _ ?, 6_ _ ✓, 8_ _ ✓.
- Trường hợp 1 và 2 với thẻ nhỏ đếm số cách dưới từng ô, phép nhân, khoanh kết quả.
- Kết: 24 + 9 = 33, "Có 33 số!", rồi thử sức "lớn hơn 640" + 3-2-1 + "Bình luận đáp án nhé!".

## Cảnh
| Beat | Bảng (đọc được khi tắt tiếng) | Lời |
|---|---|---|
| 1 | 5 thẻ 1 3 4 6 8; "Số có 3 chữ số khác nhau", "lớn hơn 430"; ô trăm/chục/đơn vị có "?"; 618 ✓, 413 ✗ < 430; "Có bao nhiêu số?"; 3 chấm | L1–L5 |
| 2 | Khoanh "trăm"; 5 dòng: 1 _ _ < 430 ✗, 3 _ _ < 430 ✗, 4 _ _ xét tiếp ?, 6 _ _ > 430 ✓, 8 _ _ > 430 ✓ | L6–L9 |
| 3 | Khăn lau phần dưới. ① Hàng trăm: 6 hoặc 8; thẻ nhỏ 6, 8 / 4 ô / 3 ô; "2 cách", "4 cách", "3 cách"; 2 × 4 × 3 = 24 (khoanh) | L10–L13 |
| 4 | Khăn lau. ② Hàng trăm: 4; thẻ 4 rơi vào ô trăm; thẻ nhỏ 1 3 6 8, gạch 1; "4 1 _ < 430 ✗"; "1 cách", "3 cách", "3 cách"; 1 × 3 × 3 = 9 (khoanh) | L14–L18 |
| 5 | Khăn lau ô và phần dưới. "Hàng trăm 6, 8: 24 số", "Hàng trăm 4: 9 số"; 24 + 9 = 33; "Có 33 số!" | L19–L20 |
| 6 | Khăn lau cả bảng. "Đến lượt bạn!", 5 thẻ, "lớn hơn 640", "Có bao nhiêu số?", 3-2-1, "Bình luận đáp án nhé!" | L21–L22 |
