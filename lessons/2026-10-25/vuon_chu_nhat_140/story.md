# Khu vườn hình chữ nhật: chu vi 140 m, tính diện tích — dữ kiện + kịch bản

9:16 (TikTok), 63,9 s, bảng xanh, khu vườn (cỏ + hàng rào gỗ) và thanh gỗ vẽ bằng code (SVG). Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8 %).
Ý chính: **nửa chu vi = dài + rộng = 70 m**; **3 lần rộng = 2 lần dài** nên chia đoạn chung thành 6 phần: **rộng 2 phần, dài 3 phần**; 5 phần = 70 m → 1 phần 14 m → dài 42 m, rộng 28 m → **diện tích 1176 m²**.

## Nguồn: ảnh câu hỏi (cột "Câu hỏi hình", Google Sheet, dòng STT 19), chép lại
Ảnh: `source/question.png`.
> "Chu vi của một khu vườn hình chữ nhật là 140 m. Biết rằng 3 lần chiều rộng thì bằng 2 lần chiều dài. Tính diện tích của khu vườn đó theo đơn vị m²."

## Dữ kiện
| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Khu vườn hình chữ nhật, chu vi 140 m | Ảnh đề |
| F2 | 3 lần chiều rộng bằng 2 lần chiều dài | Ảnh đề |
| F3 | Hỏi diện tích (m²) | Ảnh đề |
| D1 | Chu vi = 2 × (dài + rộng), nên dài + rộng = 140 : 2 = 70 m | F1, công thức chu vi hình chữ nhật |
| D2 | 3 × rộng = 2 × dài: chia đoạn đó thành 6 phần bằng nhau → rộng = 2 phần, dài = 3 phần | F2 |
| D3 | dài + rộng = 5 phần = 70 m → 1 phần = 70 : 5 = 14 m | D1, D2 |
| D4 | dài = 14 × 3 = 42 m; rộng = 14 × 2 = 28 m | D3 |
| D5 | Diện tích = 42 × 28 = 1176 m². Thử lại: 3 × 28 = 84 = 2 × 42; (42 + 28) × 2 = 140 | D4 |
| D6 | Bài thử sức (số luyện tập, không phải dữ kiện): chu vi 100 m, cùng điều kiện → 30 × 20 = 600 m² (không hiện đáp án) | Cùng cách giải, assert trong scene.js |

`console.assert` ở đầu scene.js kiểm tra 70, 6 phần, 14, 42, 28, 1176, 84 = 84, chu vi 140, bài thử sức 600; hình vẽ khu vườn ở cảnh diện tích đúng tỉ lệ 42 × 28.

## Hướng TikTok
- Móc câu: khu vườn có "dài ?" "rộng ?", vòng chu vi vàng, "Diện tích = ? m²", 3 chấm suy nghĩ.
- Nửa vòng rào: thanh dài (gỗ kem) và thanh rộng (gỗ bạc hà) bay xuống nằm nối nhau = 70 m.
- 3 thanh rộng dài bằng 2 thanh dài, chia 6 phần: rộng 2 phần, dài 3 phần.
- Kết: diện tích 1176 m² khoanh vàng, thử lại 84 = 84 ✓, rồi thử sức chu vi 100 m + 3-2-1.

## Kịch bản
| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Đề | "Khu vườn hình chữ nhật", vườn cỏ + rào gỗ, "dài ?" "rộng ?", vòng chu vi vàng, "Chu vi = 140 m", "3 × rộng = 2 × dài", "Diện tích = ? m²", 3 chấm | "Khu vườn hình chữ nhật có chu vi 140 mét. 3 lần chiều rộng bằng 2 lần chiều dài. Tính diện tích khu vườn nhé!" |
| 2. Nửa chu vi | Khăn lau. "Chu vi 140 m", vườn nhỏ, vòng trắng cả rào, vàng nửa rào (đáy + cạnh phải); 2 thanh bay xuống nối nhau "dài" "rộng"; "140 : 2 = 70", ngoặc "70 m" | "Chu vi là cả vòng rào. Nửa vòng rào là một chiều dài cộng một chiều rộng. 140 chia 2 bằng 70 mét." |
| 3. Tỉ lệ | "3 × rộng": 3 thanh bạc hà; "2 × dài": 2 thanh kem, hai hàng dài bằng nhau; 5 vạch chia 6 phần; "2 phần" / "3 phần" | "3 lần chiều rộng dài bằng 2 lần chiều dài. Chia đoạn này thành 6 phần bằng nhau. Chiều rộng là 2 phần, chiều dài là 3 phần." |
| 4. Tìm dài, rộng | Thanh 70 m chia 5 phần, mỗi phần "14"; "5 phần = 70 m", "1 phần = 70 : 5 = 14 m", "dài = 14 × 3 = 42 m", "rộng = 14 × 2 = 28 m" | "Vậy dài cộng rộng là 5 phần, bằng 70 mét. Một phần là 70 chia 5, bằng 14 mét. Chiều dài: 14 nhân 3 bằng 42 mét. Chiều rộng: 14 nhân 2 bằng 28 mét." |
| 5. Diện tích | Khăn lau. "Diện tích", vườn 42 m × 28 m, cỏ phủ dần, "Diện tích = 42 × 28", "= 1176 m²" khoanh; "3 × 28 = 84", "2 × 42 = 84" ✓ | "Diện tích khu vườn là 42 nhân 28. Bằng 1176 mét vuông! Thử lại: 3 lần 28 là 84, 2 lần 42 cũng là 84. Đúng rồi!" |
| 6. Thử sức | Khăn lau. "Đến lượt bạn!", vườn, "Chu vi = 100 m", "3 × rộng = 2 × dài", "Diện tích = ? m²", 3-2-1, "Bình luận đáp án nhé!" | "Đến lượt bạn: chu vi 100 mét, 3 lần chiều rộng vẫn bằng 2 lần chiều dài. Diện tích là bao nhiêu? Bình luận nhé!" |
