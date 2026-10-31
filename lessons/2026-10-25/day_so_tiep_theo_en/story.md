# What comes next? 1, 4, 10, 22, 46, … (bản tiếng Anh)

Bản tiếng Anh của bài `day_so_tiep_theo`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +6%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/day_so_tiep_theo/story.md` (F1–F3, D1–D2). Không thêm số liệu mới.

## Cách làm bản ngôn ngữ khác (dùng lại cho bài sau)
- Scene tiếng Việt export `TEXT` (mọi chữ trên bảng). `scene.js` ở đây import `scenes` + `TEXT` của bài gốc và `Object.assign(TEXT, {...})` bằng tiếng Anh. Cảnh, hiệu ứng, assert số liệu dùng chung một mã.
- `voice.json` riêng: cùng beat id và cùng tên window, chỉ đổi lời và từ neo (anchor). `npm run voice -- day_so_tiep_theo_en` dựng `timing.json` + `audio/` riêng.
- `npm run pages` tự chép thêm thư mục bài được import và đặt `<html lang>` theo `voice.json` `lang`.
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT` khác 0.000 trên cả 7 beat; voice/timing không đụng tới.
- Lưu ý Edge TTS tiếng Anh: "48 equals 94" / "2 is 4" bị gộp thành một từ (không neo được) → dùng "makes".

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| Số tiếp theo là gì? | What comes next? |
| Cách 2: × 2 + 2 | Way 2: × 2 + 2 |
| Đến lượt bạn! | Your turn! |
| Bình luận đáp án nhé! | Comment your answer! |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Móc câu | "1, 4, 10, 22, 46. What comes next?" | "1, 4, 10, 22, 46. Số tiếp theo là gì?" |
| 2. Bước nhảy | "Here's a trick: don't look at the numbers, look at the jumps! 1 to 4, jump 3. 4 to 10, jump 6. Then jump 12, jump 24!" | "Mẹo nè: đừng nhìn số, hãy nhìn bước nhảy! …" |
| 3. Quy luật | "Notice anything? 3 doubled is 6, 6 doubled is 12, 12 doubled is 24!" | "Thấy gì không? 3 gấp đôi là 6, …" |
| 4. Đáp án | "So the next jump: 24 doubled is 48. 46 plus 48 makes 94!" | "Vậy bước tiếp theo: 24 gấp đôi là 48. 46 cộng 48 bằng 94!" |
| 5. Kiểm tra | "Let's check it another way: times 2, plus 2. 1 times 2 plus 2 makes 4. 4 makes 10, 10 makes 22, 22 makes 46. And 46 times 2 plus 2 makes 94! Two ways, same answer: 94!" | "Thử lại bằng cách khác: nhân 2 rồi cộng 2. …" |
| 6. Thử thách | "Your turn: what comes after 94? Comment your answer!" | "Đến lượt bạn: sau 94 là số nào? Bình luận đáp án nhé!" |
| 7. Lời giải | "Answer: 48 doubled is 96. 94 plus 96 makes 190!" | "Đáp án: 48 gấp đôi là 96. 94 cộng 96 bằng 190!" |
