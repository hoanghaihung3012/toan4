# Câu 7: Hình thứ 99 có bao nhiêu que diêm? — dữ kiện + kịch bản

9:16 (TikTok), khoảng 55–65 s, bảng xanh + que diêm gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: **đếm hình 1, thấy mỗi ngôi nhà thêm vào chỉ cần 5 que (vì bức tường ở giữa dùng chung)** → **số que = 1 + 5 × số nhà** → hình 99: 1 + 5 × 99 = **496** (đáp án **B**).

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề: "Câu 7. Hỏi có bao nhiêu que diêm trong hình thứ 99?" Hình 1, 2, 3 là dãy ngôi nhà (hình vuông + mái tam giác) ghép que diêm, hình n có n ngôi nhà nằm cạnh nhau | Ảnh đề bài người dùng gửi |
| F2 | Đáp án cho sẵn: A. 563 que diêm, B. 496 que diêm, C. 586 que diêm | Ảnh đề bài người dùng gửi |
| D1 | Hình 1: hình vuông 4 que + mái 2 que = 6 que | Đếm trên ảnh (F1) |
| D2 | Hình 2: 2 hình vuông chung 1 cạnh = 7 que, 2 mái = 4 que → 11 que = 6 + 5 | Đếm trên ảnh (F1) |
| D3 | Hình 3: 3 hình vuông = 10 que, 3 mái = 6 que → 16 que = 11 + 5 | Đếm trên ảnh (F1) |
| D4 | Mỗi nhà thêm vào cần 5 que: sàn, nóc, tường phải, 2 que mái; tường trái của nhà mới là tường phải của nhà trước (dùng chung) | Từ D1–D3 |
| D5 | Số que hình n = 1 (tường trái đầu tiên) + 5 × n. Kiểm tra: n = 1, 2, 3 → 6, 11, 16 ✓ | Từ D4 |
| D6 | Hình 99: 5 × 99 = 495; 495 + 1 = 496 → **B** | Tính từ D5 |
| D7 | Thử thách: hình 10 = 1 + 5 × 10 = 51 que | Tính từ D5 |

Không tìm được trang web đăng nguyên đề này (tìm "que diêm" "hình thứ 99" 496 không ra kết quả), nên mọi con số đều lấy từ ảnh đề và phép tính ở trên. `console.assert` ở đầu scene.js đếm lại que trong hình vẽ (6, 11, 16) và kiểm tra 1 + 5 × 99 = 496, 1 + 5 × 10 = 51.

## Hướng TikTok
- Móc câu 2 giây đầu: dãy nhà que diêm mọc ra liên tục chạy ra mép bảng, chữ "Hình 99" + dấu "?" vàng to.
- Que mới thêm có màu gỗ xanh bạc hà (như phần "di chuyển" ở các bài trước): tắt tiếng vẫn thấy mỗi lần chỉ thêm 5 que.
- Bức tường dùng chung được khoanh vàng.
- Cột đếm bên phải: 6 → 11 → 16 với mũi tên cong "+5".
- Kết: chọn B (A, C bị gạch đỏ), rồi thử thách "hình 10?" + đếm ngược 3-2-1, đáp án 51.

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Câu 7". Dãy nhà que diêm mọc ra liên tục, "…". "Hình 99" + "?" vàng to + "que diêm?". | "Hình thứ 99 có bao nhiêu que diêm? Đếm từng que thì mệt lắm. Xem mẹo nhé!" |
| 2. Hình 1 | Khăn lau. Nhà 1 dựng từng que, mỗi que hiện số đếm 1…6. "Hình 1" · "6 que". | "Hình 1 là một ngôi nhà. Đếm nhé: 1, 2, 3, 4, 5, 6. Có 6 que." |
| 3. Hình 2 | Hình 2 dưới: nhà cũ (gỗ), 5 que xanh mới bay vào; khoanh vàng bức tường giữa. Mũi tên "+5" từ 6 xuống "11 que". | "Hình 2 thêm một ngôi nhà. Bức tường ở giữa dùng chung, nên chỉ cần thêm 5 que. 6 cộng 5 bằng 11." |
| 4. Hình 3 | Hình 3: thêm 5 que xanh; "+5" → "16 que". Hai chữ "+5" được khoanh. | "Hình 3 thêm 5 que nữa. 11 cộng 5 bằng 16. Cứ thêm một nhà là thêm 5 que." |
| 5. Quy luật | Khăn lau. Hình 3 to: tường trái khoanh vàng "1"; mỗi nhà 5 que xanh nhún lên lần lượt, ngoặc "5" dưới mỗi nhà. "Hình 3: 1 + 5 × 3 = 16" ✓. | "Mỗi ngôi nhà cần 5 que, cộng thêm 1 que tường đầu tiên. Hình 3: 1 cộng 5 nhân 3 bằng 16. Đúng rồi!" |
| 6. Hình 99 | "Hình 99: 1 + 5 × 99", "= 1 + 495", "= 496 que" (vàng). Ba đáp án A 563 ✗, B 496 khoanh ✓, C 586 ✗. | "Vậy hình 99 có 1 cộng 5 nhân 99. 5 nhân 99 bằng 495. Cộng 1, được 496 que. Chọn đáp án B!" |
| 7. Thử thách | Khăn lau. "Đến lượt bạn!", 10 nhà nhỏ mọc ra, "Hình 10: ? que", đồng hồ đếm 3-2-1. | "Đến lượt bạn: hình 10 có bao nhiêu que diêm? Bình luận đáp án nhé!" |
| 8. Đáp án | "?" co lại, "1 + 5 × 10 = 51" (51 khoanh vàng). | "Đáp án: 1 cộng 5 nhân 10, bằng 51 que!" |
