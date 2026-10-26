# Critique: ai_an_banh_en (Who ate the cake?)

Bản tiếng Anh dùng lại cảnh của `ai_an_banh` (đã duyệt). Chỉ đổi lời đọc, chữ trên bảng và tên (Alex, Ben, Cindy, Dan như đề gốc). Dài 52,2 s (bản Việt 49,3 s), 5 beat, `en-US-AvaNeural` +6%.

## Kết quả các vòng kiểm tra
1. **Key pose:** cùng bố cục với bản Việt (dải so sánh VI/EN 5 beat). Bản Việt không đổi sau khi tách `TEXT`/`FIT`: diff 0.000 trên cả 5 beat.
2. **Sound-off:** một subagent mới chỉ xem contact sheet (0,5 s/khung) kể lại đúng cả câu chuyện: Ben và Dan mâu thuẫn → "1 is true, 1 is false" → Alex, Cindy nói dối → gạch "didn't" → "Cindy ate the cake!" → kiểm tra (Ben LIE, Dan TRUE, ✓) → thử sức "Only 1 is lying". Kết luận: "READS WITHOUT SOUND: yes". Tiếng Anh đọc tự nhiên.
   - Subagent cũng nhắc: chữ nhỏ trên sheet thu nhỏ, khung 0 s trống, dòng "Ben or Dan…" nằm trên "1 is true…" dù viết sau, tem TRUE sát mép trái. Đều là bố cục bản Việt đã duyệt, giữ nguyên (xem key pose cỡ thật: tem nằm trọn trong khung).
3. **Sync:** 18 cửa sổ neo theo từ, 0 cửa sổ lệch quá 1 khung.
4. **Fact check:** 4 câu nói, luật "chỉ 1 bạn nói thật", lập luận và đáp án Cindy khớp `lessons/ai_an_banh/story.md` (F1–F3, D1–D5), đổi tên theo bảng trong `story.md`. `console.assert` (thử mọi người ăn bánh, đáp án duy nhất) vẫn chạy. Không thêm dữ kiện mới.
5. **Kỹ thuật:** voice.wav 52,167 s, 48 kHz stereo, true peak −2,3 dBFS. Khoảng lặng > 1,2 s: 13,3–16,6 s (ba chấm suy nghĩ), 42,2–44,0 s (lau bảng), 49,1–52,2 s (đếm ngược 3-2-1). Đều cố ý.
6. **Director's review:**
   - Đã sửa: (1) "Cindy ate the cake!" dài hơn bản Việt, chạm chiếc bánh vừa rơi xuống → dời trái, cỡ 72; (2) vòng tròn quanh "Cindy" chạm chữ "ate" → giãn khoảng cách (FIT.ansGap); (3) dòng thử sức ban đầu đọc thành "Only 1 one is lying" → sửa thành "Only 1 is lying".
   - Còn yếu (giữ vì bố cục bản Việt đã duyệt, anh/chị quyết): vòng khoanh "didn't" khá sát chữ "I"; giữa 13–16 s chỉ có ba chấm suy nghĩ.

## MP4 cuối (`final/2026-10-25/who_ate_the_cake.mp4`)
52,167 s, H.264 + AAC 48 kHz stereo, true peak −2,3 dBFS. Khoảng lặng giống voice.wav (đều cố ý). `freezedetect` (n=0.001, d=4): 12,9–17,3 s (4,5 s) là đoạn ba chấm suy nghĩ sau câu đề: chấm nhỏ nên máy coi như đứng hình; tính là một đoạn giữ hình hơi lâu (giống bản Việt).
