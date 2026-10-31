# Giải 3 bài toán Trần Đại Nghĩa

## Nguồn
Ảnh đề người dùng gửi ngày 26/10/2026. Tên Trần Đại Nghĩa do người dùng cung cấp.
Ảnh không ghi trường, lớp hay năm thi: không tự gán các thông tin đó. Đây là lời giải ba bài trong ảnh, không khẳng định toàn bộ đề.
Video YouTube dài tiếng Việt, khung ngang 1920 x 1080 (16:9) theo yêu cầu mới nhất. Hình vẽ bằng code, không đưa ảnh đề lên màn hình.

## Duyệt từng bước
Yêu cầu mới nhất của người dùng: duyệt một frame trước, rồi mới làm một scene mẫu; scene được duyệt mới sản xuất full.
Người dùng nhận xét frame khá ổn, yêu cầu nền sáng hơn và mỗi bài phải hiện đề trước khi giải.
Đã tăng sáng riêng profile ngang và tạo một scene mẫu 81,4 giây: đề bài 1 đầy đủ, sau đó giải riêng câu a.
Đề được viết từng chữ theo lời đọc, từng dòng nối tiếp; không hiện hết trước rồi gạch chân. Hai dòng câu b dùng hai neo riêng.
Đề được giữ thêm 3 giây sau lời đọc trước khi lau sang giải; không hiện đáp án trong bảng đề.
Đã có lời đọc Edge TTS, đang chờ duyệt scene; chưa làm full, xuất MP4, đăng Pages hay mở PR.
Các đề bài 1, 2, 3 nằm trong problems.js; khi dựng full phải đưa bảng đề tương ứng trước từng chương lời giải.

## Kiểm chứng
| Bài | Dữ kiện từ ảnh | Kết quả suy ra |
| --- | --- | --- |
| 1a | Nhà lẻ từ1; 45.000 đồng/chữ số; 1 đến19 | 5 chữ số ở1..9, 10 chữ số ở11..19; 15 x45.000=675.000 đồng |
| 1b | Chi phí3.375.000 đồng | 75 chữ số; (75-5):2=35 nhà hai chữ số; tổng40 nhà; cuối79 nên hợp lệ |
| 2 | SHS,HCS,CTS,HTS,THC; thẻ345,436,?,456,646 | S6,H4,C5,T3; mất536; thử đủ10.000 cách gán được duy nhất một nghiệm |
| 3 | A chuyển1/3; B chuyển gấp3 lần A lúc này; A chuyển5; cuối35 | Ngược35+5=40; 40:4=10; 10:2 x3=15. Xuôi15,10,40,35 |

Bài2: bốn chữ phải tạo đủ bốn chữ số3,4,5,6 nên các chữ mang số khác nhau. Không giả định điều này trước khi chứng minh.
Bài3: gấp ba là số người chuyển sang, tính trên đội A ngay sau lần một; vì thế sau nhận có bốn phần.
Mọi số mới trên bảng là kết quả tính từ dữ kiện trên, được kiểm tra bằng facts.test.mjs.

## Storyboard
| Chương | Hình | Cách giảng |
| --- | --- | --- |
| Bài1 | Biển nhà chia nhóm một/hai chữ số, phép tính theo hàng | Đếm chữ số, tính tiền, đảo từ tiền về số nhà, thử lại |
| Bài2 | Năm biển phòng và thẻ số, màu cho chữ trùng | Đủ bốn số, mẫu lặp646, thẻ345, suy ra536, ghép kiểm tra |
| Bài3 | Thanh phần đội A và chiều chuyển giữa A/B | Đọc đúng chuyển người, giải ngược35 về15, chạy kiểm tra xuôi |
| Kết | Ba đáp số có đơn vị | Tổng kết phương pháp, không lời kêu gọi Shorts |

## Công việc
- [x] Kiểm chứng đề và lời giải độc lập.
- [x] Một frame mẫu 16:9 của bài 1a; đã nhận phản hồi và tăng sáng nền.
- [x] Một scene mẫu có đề và lời đọc, chờ người dùng duyệt.
- [ ] Sản xuất đủ ba chương sau khi scene được duyệt.
- [ ] Lời đọc, timing, sync và đối chiếu nguồn.
- [ ] Xem không tiếng, đạo diễn, kỹ thuật.
- [ ] Pages, MP4, PR, thông báo Zalo.