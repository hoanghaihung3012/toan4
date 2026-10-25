# Critique: que_diem_en (Figure 99: how many matchsticks?)

Bản tiếng Anh dùng lại cảnh của `que_diem` (đã duyệt). Chỉ đổi lời đọc và chữ trên bảng.

## Kết quả các vòng kiểm tra
1. **Key pose:** cùng bố cục với bản Việt (dải so sánh VI/EN 8 beat). Bản Việt không đổi sau khi tách `TEXT`/`FIT`: diff 0.000 trên cả 8 beat.
   - Lỗi tìm thấy và đã sửa: "6 sticks" / "Figure 2" đè lên mũi tên cong "+5" ở beat 3–4. Bản tiếng Anh dời cột nhãn sang trái 50 px, chữ "sticks" cỡ 70.
   - Gạch chân tiêu đề kéo dài tới 330 px cho "Question 7".
2. **Sound-off:** một subagent mới chỉ xem contact sheet (0,5 s/khung) và kể lại đúng cả câu chuyện: mỗi nhà thêm 5 que, 1 + 5 × 99 = 496 (B), hình 10 = 51. Kết luận: "READS WITHOUT SOUND: yes". Chữ tiếng Anh đọc tự nhiên.
3. **Sync:** 29 cửa sổ neo theo từ, 0 cửa sổ lệch quá 1 khung.
4. **Fact check:** mọi số trên bảng và trong lời đọc (6, 11, 16, +5, 1 + 5 × 3 = 16, 5 × 99 = 495, 496, A 563 / B 496 / C 586, 1 + 5 × 10 = 51) khớp với `lessons/que_diem/story.md` (F1–F2, D1–D7). `console.assert` trong scene vẫn chạy. Không thêm dữ kiện mới.
5. **Kỹ thuật:** 65,033 s (bản Việt 62,07 s, tốc độ +10%), 48 kHz stereo, true peak −1,5 dBFS. Khoảng lặng > 1,2 s: 3 lần lau bảng (≈1,7–2,1 s) và 3,3 s đếm ngược 3-2-1 (cố ý).
6. **Director's review:**
   - Đã sửa: (1) chữ đè mũi tên "+5"; (2) "Figure 99" bị Edge TTS gộp thành một từ nên neo vào đầu câu; (3) đổi câu móc thành "Figure 99: how many matchsticks?" để chữ "Figure 99" hiện trước rồi mới tới "?", đúng thứ tự lời nói.
   - Còn yếu (giữ nguyên vì bố cục bản Việt đã duyệt, anh quyết): tia sáng quanh "?" ở beat 1 và quanh "51" ở beat 8 chạm vào chữ "sticks"; "shared", số đếm 1–6 và dòng đáp án A/B/C hơi nhỏ trên điện thoại; 36–40 s chỉ có dấu ✓ hiện thêm.
