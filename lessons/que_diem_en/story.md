# Figure 99: how many matchsticks? (bản tiếng Anh)

Bản tiếng Anh của bài `que_diem`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +10%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/que_diem/story.md` (F1–F2, D1–D7). Không thêm số liệu mới.

## Cách làm
- `lessons/que_diem/scene.js` export `TEXT` (mọi chữ trên bảng) và `FIT` (độ dài gạch chân tiêu đề, dịch nhãn cột đếm, cỡ chữ "que"). `scene.js` ở đây import `scenes` + `TEXT` + `FIT` của bài gốc và ghi đè bằng tiếng Anh.
- "6 sticks" dài hơn "6 que" nên đụng mũi tên cong "+5": bản tiếng Anh dời nhãn sang trái 50 px và chữ "sticks" cỡ 70 (bản Việt giữ nguyên 0 / 80).
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT`/`FIT` khác 0.000 trên cả 8 beat; voice/timing/audio không đụng tới.
- Edge TTS tiếng Anh: "Figure 99", "figure 10", "Figure 1" về thành MỘT từ, nên không neo vào số sau "figure" (neo vào đầu câu hoặc từ trước đó).

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| Câu 7 | Question 7 |
| Hình 1 / 2 / 3 / 10 / 99 | Figure 1 / 2 / 3 / 10 / 99 |
| que | sticks |
| dùng chung | shared |
| Đến lượt bạn! | Your turn! |
| 1, 2, 3, …; +5; 1 + 5 × 3 = 16; = 1 + 495; = 496; A. 563, B. 496, C. 586; 1 + 5 × 10 = 51 | giữ nguyên (số và ký hiệu) |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Móc câu | "Figure 99: how many matchsticks? Counting one by one is tiring. Here's a trick!" | "Hình thứ 99 có bao nhiêu que diêm? Đếm từng que thì mệt lắm. Xem mẹo nhé!" |
| 2. Hình 1 | "Figure 1 is one house. Let's count: 1, 2, 3, 4, 5, 6. That's 6 sticks." | "Hình 1 là một ngôi nhà. Đếm nhé: 1, 2, 3, 4, 5, 6. Có 6 que." |
| 3. Hình 2 | "Figure 2 adds one more house. The middle wall is shared, so we only add 5 sticks. 6 plus 5 makes 11." | "Hình 2 thêm một ngôi nhà. Bức tường ở giữa dùng chung, nên chỉ cần thêm 5 que. 6 cộng 5 bằng 11." |
| 4. Hình 3 | "Figure 3 adds 5 more. 11 plus 5 makes 16. Each new house adds 5 sticks." | "Hình 3 thêm 5 que nữa. 11 cộng 5 bằng 16. Cứ thêm một nhà là thêm 5 que." |
| 5. Quy luật | "Each house needs 5 sticks, plus 1 stick for the first wall. Figure 3: 1 plus 5 times 3 makes 16. Correct!" | "Mỗi ngôi nhà cần 5 que, cộng thêm 1 que tường đầu tiên. Hình 3: 1 cộng 5 nhân 3 bằng 16. Đúng rồi!" |
| 6. Hình 99 | "So figure 99 has 1 plus 5 times 99. 5 times 99 makes 495. Plus 1 gives 496 sticks. Pick answer B!" | "Vậy hình 99 có 1 cộng 5 nhân 99. 5 nhân 99 bằng 495. Cộng 1, được 496 que. Chọn đáp án B!" |
| 7. Thử thách | "Your turn: figure 10. How many matchsticks? Comment your answer!" | "Đến lượt bạn: hình 10 có bao nhiêu que diêm? Bình luận đáp án nhé!" |
| 8. Đáp án | "Answer: 1 plus 5 times 10 makes 51 sticks!" | "Đáp án: 1 cộng 5 nhân 10, bằng 51 que!" |
