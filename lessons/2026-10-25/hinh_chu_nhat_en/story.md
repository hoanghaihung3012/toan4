# Figure 6: how many rectangles? (bản tiếng Anh)

Bản tiếng Anh của bài `hinh_chu_nhat`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +6%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/hinh_chu_nhat/story.md` (F1–F2, D1–D4). Không thêm số liệu mới.

## Cách làm
- `lessons/hinh_chu_nhat/scene.js` export `TEXT` (mọi chữ trên bảng) và `FIT` (gạch chân tiêu đề, cỡ nhãn "Hình 1/2/3" ở cảnh mở đầu, cỡ và vị trí dòng "Hình 10 ="). `scene.js` ở đây import `scenes` + `TEXT` + `FIT` của bài gốc và ghi đè bằng tiếng Anh.
- "Figure 1 Figure 2" ở cảnh mở đầu gần chạm nhau, nên bản tiếng Anh dùng cỡ 56 (bản Việt giữ 66); dòng "Figure 10 = ?" dời trái 30 px; gạch chân "Question 8" dài 330 px.
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT`/`FIT` khác 0.000 trên cả 8 beat; voice/timing/audio không đụng tới.
- Edge TTS gộp "Figure 6", "Figure 1", "figure 10"… thành MỘT từ, nên không neo vào số sau "figure".

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| Câu 8 | Question 8 |
| Hình 1 / 2 / 3 / 6 / 10 | Figure 1 / 2 / 3 / 6 / 10 |
| hình chữ nhật | rectangles |
| = 1 hình chữ nhật | = 1 rectangle |
| 1 hình | 1 rectangle |
| Đến lượt bạn! | Your turn! |
| 11 (5 cặp) | 11 (5 pairs) |
| 2 + 1 = 3; 3 + 2 + 1 = 6; 6 5 4 3 2 1; 7; 7 × 3 = 21; A. 21, B. 15, C. 24; 1 + 2 + … + 10; = 11 × 5 = 55; ?; 3-2-1 | giữ nguyên (số và ký hiệu) |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Móc câu | "Figure 6: how many rectangles? Spot the pattern and it's easy!" | "Hình 6 có bao nhiêu hình chữ nhật? Nhìn quy luật là ra ngay!" |
| 2. Hình 1, 2 | "Each cell is one rectangle. Let's count row by row. Figure 1 has 1 rectangle. Figure 2: bottom row 2, top row 1. That's 3 in all." | "Mỗi ô là một hình chữ nhật. Đếm từng hàng nhé. Hình 1 có 1 hình. Hình 2: hàng dưới 2, hàng trên 1. Tất cả 3 hình." |
| 3. Hình 3 + quy luật | "Figure 3: 3, 2, 1. That's 6 in all. Each new figure adds a row at the bottom, 1 cell longer." | "Hình 3: 3, 2, 1. Tất cả 6 hình. Mỗi hình mới thêm một hàng ở dưới, dài hơn 1 ô." |
| 4. Hình 6 | "So figure 6 has 6 rows: 6, 5, 4, 3, 2, 1." | "Vậy hình 6 có 6 hàng: 6, 5, 4, 3, 2, 1." |
| 5. Cộng nhanh | "Quick add: pair 6 with 1, 5 with 2, 4 with 3. Each pair makes 7. 3 pairs is 7 times 3, which makes 21." | "Cộng nhanh: ghép 6 với 1, 5 với 2, 4 với 3. Cặp nào cũng bằng 7. 3 cặp là 7 nhân 3, bằng 21." |
| 6. Đáp án | "Figure 6 has 21 rectangles. Pick answer A!" | "Hình 6 có 21 hình chữ nhật. Chọn đáp án A!" |
| 7. Thử thách | "Your turn: figure 10. How many rectangles? Comment your answer!" | "Đến lượt bạn: hình 10 có bao nhiêu hình chữ nhật? Bình luận đáp án nhé!" |
| 8. Đáp án | "Answer: 5 pairs, each makes 11. 11 times 5 makes 55 rectangles!" | "Đáp án: 5 cặp, mỗi cặp bằng 11. 11 nhân 5 bằng 55 hình!" |
