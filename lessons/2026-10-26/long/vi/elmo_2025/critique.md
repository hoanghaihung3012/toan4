# Nhận xét đạo diễn

## Đã kiểm tra

- Key pose toàn bộ scene1-10 đã render (có lời chào ở scene1, lời cảm ơn ở scene10); các key pose câu 31, 32, 34-38 được rà trực quan, câu 39-40 kiểm bằng hộp bao (không chữ chồng, không tràn khung). Scene3, scene9, scene10 cũng được kiểm bố cục theo hộp bao ở từng beat.
- Đáp án và phép tính của scene1, scene3-8, scene10 được kiểm trong mã bằng `console.assert` (câu 40: code tự dò đường BFS ra 2, 83, 38, 56, 47, 92, 29, 65, 74, 20 và lối A); scene2 dùng đáp án 20 và scene9 dùng đáp án C từ key ELMO chính thức.
- Số câu được đọc trước mỗi đề; lời chào/giới thiệu ELMO 2025 ở đầu scene1; lời cảm ơn và nhắc theo dõi kênh Học cùng Phượng ở cuối scene10.
- `npm run sync -- elmo_2025`: mọi scene có 0 mốc lệch quá 1 frame.
- `npm run scenes -- elmo_2025 --seams`: tất cả seam 0.000 mean diff.
- Contact sheet 2 fps đã tạo cho từng scene. Một subagent trả lời sai nội dung ở nhiều scene (lẫn với bài toán khác), nên báo cáo đó không được dùng làm kết quả đọc tắt tiếng. Rà trực tiếp key pose cho thấy lời chào, các bước chính và đáp số đọc được; cần một người đọc độc lập đáng tin cậy rà cả contact sheet trước khi coi vòng này hoàn tất.
- MP4 cuối dùng JPEG q96 làm frame trung gian: benchmark scene1 5 s nhanh khoảng 4× so với PNG (SSIM 0.9899). Đã xuất 10 MP4 scene và MP4 gộp 569.353 s, 1920×1080/30 fps, AAC stereo 48 kHz, -16.1 LUFS, true peak -1.5 dBFS; ffmpeg giải mã không báo lỗi.

## Còn yếu

- Câu 32 hiện nêu đúng tổng 20 theo đáp án chính thức nhưng chưa trình bày số lượng từng nhóm hoặc cách đếm. Bản đề đã tìm thấy trực tuyến, nhưng viewer không cho trích xuất rõ hình khối trên trang câu 32. Không dùng các số đếm sai của bản cũ.
- Hình câu 38 và câu 39 được vẽ lại đơn giản hóa, không phải bản sao hình gốc. Câu 38: đáp án D và diện tích được kiểm bằng đếm điểm lưới và công thức Shoelace. Câu 39: chỉ nhóm C được kiểm bằng phép xoay rồi lật; nhóm A, B, D không nêu lý do loại (nhóm A cũng khớp phép biến đổi trong bản vẽ lại, nên chưa khẳng định được vì sao loại).
- `npm test`: 69/70 qua. Test còn lại ở `tests/paths.test.mjs` do các file `.DS_Store` sẵn có trong `final/`; không xóa file đó.
- `freezedetect` (ngưỡng 4 s) báo các đoạn giữ hình: scene1 74.23–81.07; scene4 27.87–32.57, 43.07–50.13, 71.80–77.43; scene5 20.03–26.13, 42.97–47.67; scene6 9.70–14.63, 37.93–42.13; scene7 16.67–24.90; scene8 24.47–28.57, 33.53–38.43, 41.27–45.80, 49.07–53.50, 56.73–61.13; scene10 19.90–32.27, 40.57–46.90, 46.90–54.47, 54.47–61.60. Đây là các hold hình cần chỉnh trước khi gọi bản này là bản phát hành cuối.