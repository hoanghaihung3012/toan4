# Three arrows: how many different totals? (bản tiếng Anh)

Bản tiếng Anh của bài `ban_3_mui_ten`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +10%) và chữ trên bảng. Tên file MP4: `three_arrows`.
Dữ kiện, nguồn và kịch bản gốc: `lessons/ban_3_mui_ten/story.md` (F1–F3, D1–D4). Không thêm số liệu mới. Đề gốc vốn bằng tiếng Anh (F1: "Gloria shot three arrows and they all hit the target below. How many different total scores could she have?"), lời đọc bám theo câu đó.

## Cách làm
- `lessons/ban_3_mui_ten/scene.js` export `TEXT` (mọi chữ trên bảng). `scene.js` ở đây import `scenes` + `TEXT` của bài gốc và ghi đè bằng tiếng Anh. Không cần `FIT`: mọi chữ tiếng Anh ngắn bằng hoặc ngắn hơn bản Việt, trừ "? totals" (cỡ 150, căn giữa, vẫn còn rộng chỗ).
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT` khác 0.000 trên cả 7 beat; voice/timing/audio không đụng tới.
- Kết quả nói bằng "makes" (tránh lỗi Edge TTS gộp "equals 9" thành một từ); danh sách từ của cả 19 câu đã kiểm, số nào cũng là từ riêng.

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| 3 mũi tên | 3 arrows |
| tổng điểm khác nhau | different totals |
| trùng! | repeat! |
| Đến lượt bạn! | Your turn! |
| 4 mũi tên | 4 arrows |
| ? tổng | ? totals |
| 9 tổng | 9 totals |
| 5 + 3 + 1 = 9; bậc thang 1+1+1 = 3 … 5+5+5 = 15; +2; ①–⑦; 7; 4 6 8 … 20; đồng hồ 3-2-1; số trên bia 5 / 3 / 1 | giữ nguyên (số và ký hiệu) |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Móc câu | "Gloria shoots 3 arrows, and all 3 hit the target. For example: 5 plus 3 plus 1 makes 9 points. How many different total scores can she get?" | "Gloria bắn 3 mũi tên, cả 3 đều trúng bia. Ví dụ: 5 cộng 3 cộng 1 bằng 9 điểm. Có thể được bao nhiêu tổng điểm khác nhau?" |
| 2. Nhỏ nhất | "Lowest: all 3 arrows hit ring 1. 1 plus 1 plus 1 makes 3." | "Thấp nhất: cả 3 mũi tên trúng vòng 1. 1 cộng 1 cộng 1 bằng 3." |
| 3. Bậc thang | "Move 1 arrow one ring in: the total goes up 2. Now 5. Then 7. 9. 11. 13. Highest: 5 plus 5 plus 5 makes 15." | "Đưa 1 mũi tên vào vòng trong: tổng thêm 2. Được 5. Rồi 7. 9. 11. 13. Cao nhất: 5 cộng 5 cộng 5 bằng 15." |
| 4. Trùng | "What about 1 plus 1 plus 5? It makes 7 too. A repeat!" | "Còn 1 cộng 1 cộng 5 thì sao? Cũng bằng 7. Trùng rồi!" |
| 5. Đáp án | "From 3 to 15, adding 2 each time. So there are 7 different totals!" | "Từ 3 đến 15, mỗi lần thêm 2. Có tất cả 7 tổng điểm khác nhau!" |
| 6. Thử thách | "Your turn: if she shoots 4 arrows, how many totals can she get? Comment below!" | "Đến lượt bạn: nếu bắn 4 mũi tên thì có bao nhiêu tổng điểm? Bình luận nhé!" |
| 7. Đáp án thử thách | "Answer: from 4 to 20, adding 2 each time, there are 9 totals!" | "Đáp án: từ 4 đến 20, mỗi lần thêm 2, có 9 tổng điểm!" |
