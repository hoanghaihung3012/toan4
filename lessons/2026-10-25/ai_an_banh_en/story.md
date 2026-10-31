# Who ate the cake? (bản tiếng Anh)

Bản tiếng Anh của bài `ai_an_banh`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +6%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/ai_an_banh/story.md` (F1–F3, D1–D5). Không thêm số liệu mới.

## Tên (quy tắc: bài tiếng Anh dùng tên tiếng Anh)
Bản tiếng Anh dùng lại đúng tên trong đề gốc.

| Đề gốc | Bản Việt | Bản Anh |
|---|---|---|
| Alex | An | Alex |
| Ben | Bảo | Ben |
| Cindy | Chi | Cindy |
| Dan | Dũng | Dan |

Đáp án: Cindy (bản Việt: Chi). Thử sức: chỉ 1 bạn nói dối → Ben (không hiện).

## Cách làm
- `../../vi/ai_an_banh/scene.js` export `createScenes({ text, layout })`. `scene.js` ở đây tạo một bộ scene riêng với chữ và bố cục tiếng Anh, không sửa cấu hình dùng chung của bản Việt. Logic kiểm tra (`console.assert`) vẫn chạy trên bản gốc.
- "Cindy ate the cake!" dài hơn "Chi đã ăn bánh!" nên chạm bánh và vòng tròn chạm chữ "ate": bản Anh dời dòng sang trái (x 420), cỡ 72, khoảng cách 0,75 (bản Việt giữ 470 / 80 / 0,5).
- Bản tiếng Việt không đổi: key pose trước/sau khi tách `TEXT`/`FIT` khác 0.000 trên cả 5 beat; voice/timing/audio không đụng tới.

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| Ai đã ăn bánh? | Who ate the cake? |
| Chỉ 1 bạn nói thật | Only 1 tells the truth |
| An / Bảo / Chi / Dũng | Alex / Ben / Cindy / Dan |
| "Bảo đã ăn bánh." | "Ben ate the cake." |
| "Dũng đã ăn bánh." | "Dan ate the cake." |
| "Tớ không ăn bánh." (khoanh "không") | "I didn't eat it." (khoanh "didn't") |
| "Bảo đang nói dối đấy." (gạch "dối") | "Ben is lying." (gạch "lying") |
| Bảo hoặc Dũng nói thật | Ben or Dan tells the truth |
| 1 câu đúng, 1 câu sai | 1 is true, 1 is false |
| DỐI / THẬT | LIE / TRUE |
| Chi đã ăn bánh! | Cindy ate the cake! |
| Đến lượt bạn! | Your turn! |
| Chỉ 1 bạn nói dối | Only 1 is lying |
| Ai ăn bánh? | Who ate it? |
| Bình luận đáp án nhé! | Comment your answer! |

## Lời đọc (theo cảnh)
| Cảnh | Lời đọc tiếng Anh | Bản gốc |
|---|---|---|
| 1. Đề | "Who ate the cake? Only 1 kid tells the truth. The other 3 are lying. Alex: Ben ate the cake. Ben: Dan ate the cake. Cindy: I didn't eat it. Dan: Ben is lying." | "Ai đã ăn chiếc bánh? Chỉ có 1 bạn nói thật, 3 bạn kia nói dối. An: Bảo đã ăn bánh. Bảo: Dũng đã ăn bánh. Chi: Tớ không ăn bánh. Dũng: Bảo đang nói dối đấy." |
| 2. Bảo/Dũng | "Look at Ben and Dan. Dan says Ben is lying, so their sentences are opposites: one is true, one is false. So Ben or Dan tells the truth." | "Để ý Bảo và Dũng. Dũng nói Bảo nói dối, nên 2 câu này ngược nhau: 1 câu đúng, 1 câu sai. Vậy bạn nói thật là Bảo hoặc Dũng." |
| 3. Đáp án | "So Alex and Cindy are both lying. Cindy is lying, so: I didn't eat it, is false. So Cindy ate the cake!" | "Còn An và Chi đều nói dối. Chi nói dối, nên câu: tớ không ăn bánh, là sai. Vậy Chi đã ăn bánh!" |
| 4. Thử lại | "Let's check! Alex false, Ben false, Cindy false. Only Dan tells the truth. Exactly 1 tells the truth!" | "Thử lại nhé! An sai, Bảo sai, Chi sai. Chỉ Dũng nói thật. Đúng 1 bạn nói thật!" |
| 5. Thử sức | "Your turn: what if only 1 kid is lying? Who ate the cake? Comment your answer!" | "Đến lượt bạn: nếu chỉ có 1 bạn nói dối thì sao? Ai đã ăn bánh? Bình luận nhé!" |
