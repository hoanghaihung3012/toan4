# Review scene mẫu, chưa phải video đầy đủ

## Phạm vi
1920 x 1080, 30 fps, 81,4 giây. Đọc đầy đủ đề bài 1 rồi chỉ giải câu a.
Chờ người dùng duyệt scene trước khi làm full. Không xuất bản hoặc mở PR ở giai đoạn này.

## Hình và kiểm chứng
- Nền ngang sáng hơn, giảm vignette xuống 0,18; profile dọc không đổi.
- Key pose bảng đề có đủ dữ kiện 45.000 đồng, câu a tới19, câu b3.375.000 đồng và câu hỏi số nhà.
- Bảng đề không chứa đáp số. sample.test.mjs kiểm tra điều này trong Chrome, đồng thời kiểm tra kích thước16:9.
- Trước sửa nhịp, key pose sau voice khớp reference tuyệt đối (mean0, max0); sau sửa có thay đổi chủ đích: tăng cỡ nhãn30 lên34, thêm đường nối nhóm và nới hàng nhà.
- Số nhà và phép tính trong scene: năm biển một chữ số + năm biển hai chữ số =15 chữ số; 15 x45.000=675.000 đồng. So với ảnh nguồn người dùng và facts.test.mjs đều đúng.
- 11 dòng lời đọc đều là đọc lại dữ kiện bài1 hoặc giải thích phép tính trên; không thêm năm thi, lớp thi hay dữ kiện ngoài đề.

## Review không tiếng và đạo diễn
Hai lần đọc contact sheet 2fps bởi subagent độc lập: đều hiểu đúng đề trước giải, phép tính và đáp số; không thấy lộ đáp án sớm.
Ba điểm yếu ban đầu đã sửa:
1. Bảng trống lâu sau lau: biển bắt đầu xuất hiện khoảng35giây, sau lau khoảng1giây, không đợi tới43giây.
2. Phép tính viết quá chậm: đổi sang viết cụm1,4giây, giữ phép tính hoàn chỉnh khi lời giải tiếp tục.
3. Chữ nhỏ và khó nối nhóm: tăng nhãn, thêm mũi tên nhóm–phép tính, nới hàng để đường vàng không cắt mái.
Đáp số đầy đủ xuất hiện khoảng74giây và giữ tới81,4giây. Nhịp giữa còn chậm khi xem tắt tiếng, chủ đích ưu tiên người nghe giải thích; sẽ lấy phản hồi người dùng trước khi nhân rộng.

## Đồng bộ và tiếng
- Sync cuối:16 cửa sổ neo từ,0 lệch quá1frame.
- WAV stereo48kHz. Lần đo trước đổi tail: true peak -1,5dBFS, loudness -15,8LUFS; lời đọc không đổi, chỉ thêm0,9giây giữ cuối.
- Các khoảng lặng >1,2giây: đầu0–1,69giây để đề hiện;30,20–34,99giây gồm nghỉ đọc đề và lau bảng;79,42–81,40giây giữ đáp số. Đều có chủ đích.
- Chưa xuất MP4 nên chưa có kiểm tra codec, thời lượng mux hoặc freeze của MP4.

## Chỉnh sửa viết đề
Theo phản hồi mới, bỏ hiệu ứng hiện đủ đề rồi gạch chân. Chữ xuất hiện từng ký tự tiếng Việt theo timing của lời đọc; dấu đi cùng chữ.
Hai dòng câu b được neo riêng trước và sau từ “Hỏi”. Không đổi giọng đọc, thời lượng81,4giây hoặc phần lời giải.
Test Chrome kiểm tra trước, giữa và sau một dòng; test riêng kiểm tra ký tự có dấu tổ hợp.
Subagent xem writing_sheet0..4 ở2fps: không thấy dòng sau hiện sớm, chữ vỡ dấu hay gạch chân thân đề; đề hiện đủ từ30,5giây.

## Chờ duyệt
Người dùng duyệt nền sáng, thời gian đọc đề, nhịp giải và giọng đọc trước khi dựng toàn bộ ba bài.