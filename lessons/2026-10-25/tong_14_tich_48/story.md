# Tìm hiệu hai số có tổng 14, tích 48 — dữ kiện + kịch bản

9:16 (TikTok), khoảng 53 s, bảng xanh + ô gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8%).
Ý chính: **giữ tổng 14, thử từng cặp và nhân** → 1×13, 2×12, 3×11, 4×10, 5×9 đều chưa ra 48; **6 × 8 = 48** → hai số là 6 và 8 → **hiệu 8 − 6 = 2**.
Không có số câu trên màn hình và trong lời đọc (yêu cầu của người dùng).

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề: "Cho hai số có tổng là 14 và tích là 48. Hỏi hiệu số giữa hai số này là bao nhiêu?" kèm □ + △ = 14, □ × △ = 48 | Ảnh đề bài người dùng gửi |
| D1 | Hai số là 6 và 8: 6 + 8 = 14, 6 × 8 = 48; hiệu 8 − 6 = 2 | Tính từ F1 (assert trong scene.js) |
| D2 | Các cặp có tổng 14 (số nhỏ trước): 1×13 = 13, 2×12 = 24, 3×11 = 33, 4×10 = 40, 5×9 = 45, 6×8 = 48 — chỉ cặp 6, 8 cho tích 48 (7×7 = 49) | Tính từ F1 |
| D3 | Thử thách: tổng 13, tích 40 → 5 và 8 (cặp duy nhất: 1×12, 2×11, 3×10, 4×9, 5×8 = 40, 6×7 = 42); hiệu 8 − 5 = 3 | Tự đặt theo cùng dạng, tính lại và assert trong scene.js |

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Tìm hiệu hai số". □ và △ bật lên; "□ + △ = 14", "□ × △ = 48"; "Hiệu = ?" với dấu ? vàng; 3 chấm suy nghĩ. | "Hai số có tổng là 14 và tích là 48. Hiệu của chúng là bao nhiêu?" |
| 2. Thử từng cặp | Khăn lau. Nhắc đề nhỏ ở trên; bảng cột □ (ô kem), △ (ô xanh), "tích". Sáu hàng hiện lần lượt: 1 × 13 = 13 ✗ … 5 × 9 = 45 ✗, 6 × 8 = 48 khoanh vàng ✓. | "Mẹo: tách 14 thành hai số, rồi nhân thử! 1 nhân 13 là 13. … 6 nhân 8 là 48. Đúng rồi!" |
| 3. Đáp án | Khăn lau. Đề viết lại; ô 6 vào □, ô 8 vào △; mỗi phép tính nhún và được ✓; "Hiệu = 8 − 6 = 2", khoanh 2. | "Vậy hai số là 6 và 8. 6 cộng 8 bằng 14, 6 nhân 8 bằng 48. Hiệu là 8 trừ 6, bằng 2!" |
| 4. Thử thách | Khăn lau. "Đến lượt bạn!", "Bình luận đáp án nhé!", □ + △ = 13, □ × △ = 40, "Hiệu = ?", đếm ngược 3-2-1. | "Đến lượt bạn: tổng là 13, tích là 40. Hiệu là bao nhiêu? Bình luận đáp án nhé!" |
| 5. Đáp án thử thách | 5 vào □, 8 vào △, ✓ ✓, "Hiệu = 8 − 5 = 3", khoanh 3. | "Đáp án: hai số là 5 và 8. Hiệu là 8 trừ 5, bằng 3!" |
