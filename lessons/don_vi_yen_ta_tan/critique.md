# Yến, tạ, tấn: các vòng kiểm tra + nhận xét

Độ dài 75,0 s, 8 cảnh, giọng vi-VN-HoaiMyNeural (+8%).

## 1. Key pose
Bộ key pose tham chiếu chụp ở bước dựng cảnh (`out/keyposes_ref`). Sau khi sửa theo vòng 2 và 6, `inspect.mjs diff`:
beat3, beat4, beat5, beat8 = 0.000. Khác có chủ ý: beat1/beat2 (thẻ "2 ?" to hơn 25 %), beat6 (nhãn "×10" to hơn),
beat7 (thêm dòng "3 × 10 = 30", giãn hàng). Bộ mới đã soi lại từng khung.
Ghi chú: phiên làm việc này không có công cụ tạo ảnh, nên storyboard là chính các key pose dựng bằng code (tự kiểm tra beat 1 trước rồi mới làm các beat còn lại).

## 2. Đọc khi tắt tiếng (subagent mới, chỉ xem contact sheet 2 fps)
Kể lại đúng cả 8 cảnh và đọc ra đủ: 1 yến = 10 kg; 1 tạ = 10 yến = 100 kg; 1 tấn = 10 tạ = 1000 kg; ×10 mỗi bậc; 5 yến = 50 kg; 3 tấn = 30 tạ; 2 tấn 85 kg = 2085 kg; thử thách 4 tạ 60 kg. **Kết luận: có, theo dõi được.**
Góp ý đã sửa: thẻ "2 kg / 2 tạ / 2 tấn" quá nhỏ → to hơn 25 %; không đếm được 10 quả cân nhỏ → thêm số đếm 1…10 màu vàng nảy lên mỗi lần một quả rơi; nhãn ×10 nhỏ → to hơn; "3 tấn = 30 tạ" thiếu dòng giải → thêm "3 × 10 = 30".
Chưa sửa: vì sao 2 tấn = 2000 kg (dòng 1 tấn = 1000 kg đã bị lau ở cảnh trước) → hiện chỉ có "2 tấn" nhấp nháy vàng khi đọc "2 tấn là 2000 ki-lô-gam" và dòng hồng "2000 + 85".

## 3. Đồng bộ
`synccheck`: 24 cửa sổ neo theo từ, 0 lệch quá 1 khung.

## 4. Kiểm tra dữ kiện
| Chữ trên bảng / lời đọc | Nguồn |
|---|---|
| Gà 2 kg, bò 2 tạ, voi 2 tấn | F2 (SGK Toán 4 tr.23 Bài 1) |
| 1 yến = 10 kg; 1 tạ = 10 yến = 100 kg; 1 tấn = 10 tạ = 1000 kg | F1 (Wikipedia, giá trị hiện nay) |
| "mỗi bậc gấp 10 lần", "đổi lớn sang bé, mỗi bậc nhân 10" | D1 (suy từ F1) |
| 5 yến = 50 kg, 3 tấn = 30 tạ, 2 tấn 85 kg = 2085 kg, 5 × 10, 3 × 10, 2000 + 85 | F3 + D2 (assert trong scene.js) |
| 4 tạ 60 kg = ? kg (không nói đáp án 460) | F3 / D3 |
Không có dữ kiện nào ngoài bảng này. Cân đĩa và quả cân là hình minh hoạ, không mang số liệu riêng.

## 5. Kỹ thuật (WAV giọng đọc)
48 kHz stereo, 75,033 s, true peak −3,5 dBFS. Khoảng lặng > 1,2 s: 5,2–7,4 s (3 chấm suy nghĩ, có chủ ý), các chỗ chuyển cảnh có khăn lau (~1,9–2,4 s); 71,4–75,0 s (đếm ngược 3-2-1, có chủ ý). MP4 `final/2026-10-25/don_vi_yen_ta_tan.mp4`: 1080×1920, 75,03 s, AAC 48 kHz stereo, true peak −3,5 dBFS, freezedetect (4 s) không có đoạn đứng hình, các khoảng lặng như trên.

## 6. Đạo diễn tự chấm (xem 2 lượt)
Lượt 1, ba lỗi nặng nhất (đã sửa):
1. Mở đầu 0–1 s bảng trống, câu hỏi chỉ hiện ở giây 4,5 → câu "Cùng nặng 2?" viết ngay từ đầu, sáng vàng + phóng to khi đọc "Sao lại thế được?".
2. 7–9,5 s bảng đứng yên khi đọc "Vì đơn vị khác nhau" → ba thẻ lần lượt nhún lên đúng câu đó.
3. Cảnh đổi đơn vị 59–62 s đứng yên khi đọc "2 tấn là 2000 ki-lô-gam" → "2 tấn" sáng vàng, "2000" viết đúng lúc đọc, "+ 85" viết khi đọc "thêm 85".
Lượt 2, còn yếu (để chị quyết):
- Cảnh 7 và 8 chỉ có chữ phấn, nửa dưới bảng còn trống; có thể thêm hình quả cân nhỏ minh hoạ.
- Mỗi lần chuyển cảnh có ~2 s không lời (khăn lau), giống các clip trước.
- Thử thách không nói đáp án (460 kg) để người xem bình luận, như clip "Xếp táo vào rổ".
