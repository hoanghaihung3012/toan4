# Tìm số tiếp theo của dãy 1, 4, 10, 22, 46, … (Toán tư duy)

9:16 (TikTok), khoảng 50 s, bảng xanh + khối gỗ (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: **đừng nhìn các số, hãy nhìn bước nhảy giữa chúng.** Bước nhảy 3, 6, 12, 24 cứ gấp đôi → bước tiếp theo 48 → 46 + 48 = 94.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề: "Tìm số tiếp theo của dãy: 1, 4, 10, 22, 46 …" | Người dùng đưa |
| F2 | 4 − 1 = 3, 10 − 4 = 6, 22 − 10 = 12, 46 − 22 = 24; 6 gấp đôi 3, 12 gấp đôi 6, 24 gấp đôi 12; số gấp đôi 24 là 48; số tiếp theo 46 + 48 = 94. Đáp số 94. | hoidap247.com/cau-hoi/7460602 ("Tìm số tiếp theo của dãy số: 1, 4, 10, 22, 46, ?") |
| F3 | Dãy đầy đủ 1; 4; 10; 22; 46; 94; 190, vì các bước tăng lần lượt 3, 6, 12, 24, 48, 96. | olm.vn/cau-hoi/tim-so-con-thieu-trong-day-so-sau-1-4-10-22-46-190-giai-thich-cach-lam.6267407599347 (trả lời ngày 21/5/2022) |
| D1 | Cách thứ hai (kiểm tra): mỗi số = số trước × 2 + 2. 1×2+2 = 4, 4×2+2 = 10, 10×2+2 = 22, 22×2+2 = 46, 46×2+2 = 94. Khớp F2. | Tính lại từ F1–F3 (assert trong scene.js) |
| D2 | Thử thách: số sau 94 là 190 (48 × 2 = 96; 94 + 96 = 190). | F3, tính lại trong scene.js |

Kiểm tra số (`console.assert` ở đầu `scene.js`): hiệu liên tiếp [3, 6, 12, 24, 48, 96], mỗi hiệu = hiệu trước × 2; a(n+1) = 2·a(n) + 2 cho cả dãy 1 … 190.

## Hướng "cuốn"
- **Móc câu 2 giây đầu:** năm khối gỗ 1, 4, 10, 22, 46 rơi "bịch" theo nhịp đọc, ô trống nét đứt với "?" vàng, ba chấm suy nghĩ.
- **Mẹo một câu:** "Đừng nhìn số, hãy nhìn bước nhảy!" – các khối gỗ nhún nhảy lần lượt.
- **Hình ảnh chính:** cầu nhảy phấn vàng nối hai khối liền nhau, trên đỉnh ghi +3, +6, +12, +24. Phía trên là các cung hồng "×2" nối các bước nhảy → thấy ngay quy luật gấp đôi.
- **Kiểm tra kiểu "dây chuyền":** cách thứ hai "× 2 + 2": kết quả mỗi hàng hoá thành khối gỗ bay xuống làm đầu vào hàng sau. Hai cách cùng ra 94.
- **Thử thách cuối:** "Sau 94 là số nào?" đếm ngược 3–2–1, mời bình luận, rồi giải (190).
- Âm thanh: chỉ giọng Edge TTS.

## Kịch bản (7 cảnh)

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | Khối 1, 4, 10, 22, 46 rơi xuống theo lời đọc; ô trống nét đứt + "?" vàng. Phấn: "Số tiếp theo là gì?" Ba chấm vàng. | "1, 4, 10, 22, 46. Số tiếp theo là gì?" |
| 2. Bước nhảy | Các khối nhún lần lượt. Cầu vàng 1→4 "+3", 4→10 "+6", 10→22 "+12", 22→46 "+24". | "Mẹo nè: đừng nhìn số, hãy nhìn bước nhảy! 1 lên 4, nhảy 3. 4 lên 10, nhảy 6. Rồi nhảy 12, nhảy 24!" |
| 3. Quy luật | Các nhãn bước nhảy nhún. Cung hồng "×2" nối +3→+6→+12→+24. | "Thấy gì không? 3 gấp đôi là 6, 6 gấp đôi là 12, 12 gấp đôi là 24!" |
| 4. Đáp án | Cầu 46 → ô trống; cung "×2" mới → "+48". Phấn "24 × 2 = 48", "46 + 48 = 94". Khối 94 mọc trong ô, khoanh vàng, ✓. | "Vậy bước tiếp theo: 24 gấp đôi là 48. 46 cộng 48 bằng 94!" |
| 5. Kiểm tra | Khăn lau. "Cách 2: × 2 + 2". Năm hàng: khối gỗ đầu vào, phấn "× 2 + 2 =" kết quả vàng; kết quả bay xuống làm khối của hàng sau. Hàng cuối 46 → 94 khoanh + ✓, khối 94 to bật lên. | "Thử lại bằng cách khác: nhân 2 rồi cộng 2. 1 nhân 2 cộng 2 bằng 4. 4 thành 10, 10 thành 22, 22 thành 46. Và 46 nhân 2 cộng 2 bằng 94! Hai cách, cùng ra 94!" |
| 6. Thử thách | Khăn lau. "Đến lượt bạn!" Khối 22, 46, 94 + ô "?"; cầu +24, +48. Phấn hồng "Bình luận nhé!". Đếm ngược 3, 2, 1. | "Đến lượt bạn: sau 94 là số nào? Bình luận đáp án nhé!" |
| 7. Lời giải | Cung "×2" → "+96", cầu 94 → ô. "48 × 2 = 96", "94 + 96 = 190". Khối 190 vào ô, ✓. | "Đáp án: 48 gấp đôi là 96. 94 cộng 96 bằng 190!" |

## Ghi chú tạo hình
- Một số = một khối gỗ (rộng theo số chữ số) để cả dãy vừa một hàng.
- Cầu nhảy luôn vàng (bước cộng), cung "×2" luôn hồng (quy luật): hai màu, hai ý.
- Ô trống: nét đứt xanh lá + "?" vàng; đáp án mọc vào bằng lò xo sau khi "?" co lại.
- Bố cục trong hộp content của THEME.safeArea (x 70–1035, y 145–1600).
- Hiệu ứng dùng chung (rơi, bụi phấn, ✓, nhún, lau một dải) ở `shared/web/js/fx.js` để bài sau dùng lại.
