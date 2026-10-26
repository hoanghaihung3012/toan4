# Critique: hinh_chu_nhat_en (Figure 6: how many rectangles?)

Bản tiếng Anh dùng lại cảnh của `hinh_chu_nhat` (đã duyệt). Chỉ đổi lời đọc và chữ trên bảng.

## Kết quả các vòng kiểm tra
1. **Key pose:** cùng bố cục với bản Việt (dải so sánh VI/EN 8 beat). Bản Việt không đổi sau khi tách `TEXT`/`FIT`: diff 0.000 trên cả 8 beat (đo lại sau mỗi lần sửa `FIT`).
   - Lỗi tìm thấy và đã sửa: nhãn "Figure 1" và "Figure 2" ở cảnh mở đầu gần chạm nhau → cỡ 56 cho bản tiếng Anh; "Figure 10 = ?" lệch phải → dời trái 30 px; gạch chân tiêu đề 330 px cho "Question 8".
2. **Sound-off:** một subagent mới chỉ xem contact sheet (0,5 s/khung) và kể lại đúng cả câu chuyện: hình n có 1 + 2 + … + n hình, ghép cặp → 7 × 3 = 21 (A), hình 10 = 11 × 5 = 55. Kết luận: "READS WITHOUT SOUND: yes". Chữ tiếng Anh đọc tự nhiên; không có chữ đè nhau.
3. **Sync:** 32 cửa sổ neo theo từ, 0 cửa sổ lệch quá 1 khung.
4. **Fact check:** mọi số trên bảng và trong lời đọc (1, 3, 6; 2 + 1 = 3; 3 + 2 + 1 = 6; 6…1; 6+1 = 5+2 = 4+3 = 7; 7 × 3 = 21; A 21 / B 15 / C 24; 1 + … + 10; 5 cặp × 11 = 55) khớp với `lessons/hinh_chu_nhat/story.md` (F1–F2, D1–D4). `console.assert` trong scene vẫn chạy. Không thêm dữ kiện mới.
5. **Kỹ thuật:** 63,033 s (bản Việt ≈ 60 s), 48 kHz stereo, true peak −1,5 dBFS. Khoảng lặng > 1,2 s: 3 lần lau bảng (1,6–2,0 s), 3,4 s đếm ngược 3-2-1 (cố ý) và 1,2 s giữ đáp án cuối.
6. **Director's review:**
   - Đã sửa: (1) nhãn "Figure 1/2" sát nhau; (2) "Figure N" bị Edge TTS gộp một từ nên neo vào đầu câu hoặc chính con số đứng sau; (3) câu thử thách đổi thành "Your turn: figure 10. How many rectangles?" để "Figure 10" hiện trước "?", đúng thứ tự lời nói.
   - Còn yếu (giữ nguyên vì bố cục bản Việt đã duyệt, anh quyết): nhãn hình nhỏ, số đếm cạnh hàng và "11 (5 pairs)" hơi nhỏ trên điện thoại; cảnh "= 1 rectangle" (7–11 s) bảng còn trống; đáp án A/B/C chỉ hiện ở 43 s; tia sáng quanh "21" chạm số 7 giữa.
