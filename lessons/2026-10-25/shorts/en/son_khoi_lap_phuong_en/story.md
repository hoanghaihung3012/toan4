# Paint the cubes: how many squares? (bản tiếng Anh)

Bản tiếng Anh của bài `son_khoi_lap_phuong`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +6%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/son_khoi_lap_phuong/story.md` (F1–F2, D1–D7). Đề gốc vốn bằng tiếng Anh ("If you paint the following structure including its bottom, what is the total number of squares you will get to paint?", F1). Không thêm số liệu mới.

## Cách làm
- `lessons/son_khoi_lap_phuong/scene.js` export `TEXT` (mọi chữ trên bảng) và `FIT` (`labelDx`: dịch nhãn mũi tên theo từ). `scene.js` ở đây import `scenes` + `TEXT` + `FIT` của bài gốc và ghi đè bằng tiếng Anh.
- "bottom" rộng hơn "dưới" nên đè lên mũi tên hướng lên: bản tiếng Anh dời nhãn sang phải 45 px (bản Việt giữ 0).
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT`/`FIT` khác 0.000 trên cả 8 beat; voice/timing/audio không đụng tới.

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| trên / dưới / trước / sau / phải / trái | top / bottom / front / back / right / left |
| mặt đáy | bottom (như đề gốc: "including its bottom") |
| ô vuông | squares |
| Đến lượt bạn! | Your turn! |
| không sơn | not painted |
| ? ô | ? squares |
| 1 2 3 4; 8, 9, 4; 8 + 8 = 16; 9 + 9 = 18; 4 + 4 = 8; 16 + 18 + 8 = 42; 42 − 8 = 34; 3-2-1 | giữ nguyên (số và ký hiệu) |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Móc câu | "Paint this whole shape, including the bottom. How many squares will you paint?" | "Sơn hết khối hình này, kể cả mặt đáy. Sẽ sơn được bao nhiêu ô vuông?" |
| 2. Cách làm | "Don't count every cube. Look from 6 sides: top, bottom, front, back, left, right." | "Đừng đếm từng khối. Hãy nhìn từ 6 phía: trên, dưới, trước, sau, trái, phải." |
| 3. Trên / dưới | "From the top, there are 8 squares. From the bottom, there are also 8 squares." | "Nhìn từ trên xuống, có 8 ô. Nhìn từ dưới lên, mặt đáy cũng có 8 ô." |
| 4. Trước / sau | "From the front: 3, 3, 2, 1. That's 9 squares. The back also has 9 squares." | "Nhìn từ phía trước: 3, 3, 2, 1. Có 9 ô. Phía sau cũng có 9 ô." |
| 5. Phải / trái | "From the right: 1 and 3, that's 4 squares. The left also has 4 squares." | "Nhìn từ bên phải: 1 và 3, có 4 ô. Bên trái cũng có 4 ô." |
| 6. Cộng | "Let's add them up: 8 plus 8 makes 16. 9 plus 9 makes 18. 4 plus 4 makes 8. 16 plus 18 plus 8 makes 42 squares!" | "Cộng lại nhé: 8 cộng 8 bằng 16. 9 cộng 9 bằng 18. 4 cộng 4 bằng 8. 16 cộng 18 cộng 8, bằng 42 ô vuông!" |
| 7. Thử thách | "Your turn: if you don't paint the bottom, how many squares? Comment below!" | "Đến lượt bạn: nếu không sơn mặt đáy thì được bao nhiêu ô? Bình luận nhé!" |
| 8. Đáp án | "Answer: 42 minus 8 makes 34 squares!" | "Đáp án: 42 trừ 8, bằng 34 ô!" |
