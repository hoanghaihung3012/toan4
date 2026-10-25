# Critique: son_khoi_lap_phuong_en (Paint the cubes: how many squares?)

Bản tiếng Anh dùng lại cảnh của `son_khoi_lap_phuong` (đã duyệt). Chỉ đổi lời đọc và chữ trên bảng.

## Kết quả các vòng kiểm tra
1. **Key pose:** cùng bố cục với bản Việt (dải so sánh VI/EN 8 beat). Bản Việt không đổi sau khi tách `TEXT`/`FIT`: diff 0.000 trên cả 8 beat.
   - Lỗi tìm thấy và đã sửa: nhãn "bottom" (dài hơn "dưới") đè lên mũi tên hướng lên ở beat 2–6. Bản tiếng Anh dời nhãn sang phải 45 px.
2. **Sound-off:** một subagent mới chỉ xem contact sheet (0,5 s/khung) và kể lại đúng: 6 hướng nhìn 8/8, 9/9, 4/4, 16 + 18 + 8 = 42, không sơn đáy 42 − 8 = 34. Kết luận: **yes**.
   - Góp ý về chữ tiếng Anh: "no paint" nghe gượng. Đã đổi thành "not painted". "Your turn!", "? squares" đọc tự nhiên.
3. **Sync:** 36 cửa sổ neo theo từ, 0 cửa sổ lệch quá 1 khung. Đã kiểm tra danh sách từ của cả 16 câu: không có cặp số/từ nào bị Edge TTS gộp.
4. **Fact check:** mọi số trên bảng và trong lời đọc (13 khối không nói ra; 8, 8, 9, 9, 4, 4; 3, 3, 2, 1; 1 và 3; 16, 18, 8, 42; 42 − 8 = 34) khớp `lessons/son_khoi_lap_phuong/story.md` (F1–F2, D1–D7). "including the bottom" lấy từ đề gốc tiếng Anh (F1). `console.assert` trong scene vẫn chạy. Không thêm dữ kiện mới.
5. **Kỹ thuật (voice.wav):** 56,1 s (bản Việt 54,07 s, tốc độ +6%), 48 kHz stereo, true peak −1,5 dBFS. Khoảng lặng > 1,2 s: lau bảng trước thử thách (1,8 s) và đếm ngược 3-2-1 (3,3 s), đều cố ý.
6. **Director's review:**
   - Đã sửa: (1) "bottom" đè mũi tên; (2) câu L6 ban đầu nói "the base" trong khi bảng ghi "bottom", đổi thành "From the bottom, there are also 8 squares" cho khớp chữ; (3) "no paint" → "not painted".
   - Còn yếu (giữ nguyên vì bố cục bản Việt đã duyệt, anh quyết): câu hỏi ở móc câu chưa có chữ "paint" trên bảng (cọ sơn tới 13,5 s mới xuất hiện); "1 2 3 4 bị gạch" hơi khó hiểu khi tắt tiếng; trong lưới 6 hình, nhãn "front"/"right" nằm giữa hai hàng.
