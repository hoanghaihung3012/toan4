# Đề-xi-mét vuông, mét vuông, mi-li-mét vuông — dữ kiện + kịch bản

9:16 (TikTok), khoảng 114 s, bảng xanh + ô gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8 %).
Bài khái niệm Toán 4 (KNTT Bài 18): mỗi đơn vị là diện tích một hình vuông có cạnh 1 đơn vị độ dài; **chia cạnh thành 10 phần → 10 × 10 = 100 ô** nên mỗi đơn vị gấp 100 lần đơn vị bé hơn tiếp liền. Có ví dụ đời sống (mặt bàn, nền phòng), 4 ví dụ đổi đơn vị và một câu đố cuối.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | "Đề-xi-mét vuông là diện tích của hình vuông có cạnh dài 1 dm", viết 1 dm²; hình vuông cạnh 1 dm gồm 100 hình vuông 1 cm² | [hoatieu.vn giáo án Toán 4 KNTT Bài 18](https://hoatieu.vn/giao-an-toan-4-kntt-bai-18-240261); "1dm² = 100cm²" [monkey.edu.vn](https://monkey.edu.vn/ba-me-can-biet/giao-duc/kien-thuc-co-ban/mi-li-met-vuong-bang-don-vi-do-dien-tich); "1dm = 10cm → 1dm² = 100cm²" [vjol.info](https://www.vjol.info/1m-vuong-bang-bao-nhieu-dm-vuong) |
| F2 | "Mét vuông là diện tích của hình vuông có cạnh dài 1m. Mét vuông viết tắt là m²." "Hình vuông 1m² gồm 100 hình vuông 1dm². 1m² = 100dm²" | [giaibaitap123.com SGK Toán 4 Mét vuông](https://giaibaitap123.com/sgk-toan-4/met-vuong/) |
| F3 | "Mi-li-mét vuông là diện tích của hình vuông có cạnh dài 1mm", viết mm²; "1cm² = 100mm²"; "hình vuông 1cm² gồm 100 hình vuông 1mm²" | [hoc247.net](https://hoc247.net/toan-lop-5/mi-li-met-vuong-bang-don-vi-do-dien-tich-l342.html), [monkey.edu.vn](https://monkey.edu.vn/ba-me-can-biet/giao-duc/kien-thuc-co-ban/mi-li-met-vuong-bang-don-vi-do-dien-tich) |
| F4 | Mỗi đơn vị đo diện tích gấp 100 lần đơn vị bé hơn tiếp liền; lớn → bé nhân 100, bé → lớn chia 100 | [hoc247.net](https://hoc247.net/toan-lop-5/mi-li-met-vuong-bang-don-vi-do-dien-tich-l342.html) (bảng đơn vị), [monkey.edu.vn](https://monkey.edu.vn/ba-me-can-biet/giao-duc/kien-thuc-co-ban/mi-li-met-vuong-bang-don-vi-do-dien-tich) ("…nhân số đó với 100", "…chia số đó cho 100") |
| F5 | 1 dm = 10 cm, 1 m = 10 dm, 1 cm = 10 mm (cạnh chia 10 phần) | [vjol.info](https://www.vjol.info/1m-vuong-bang-bao-nhieu-dm-vuong) |
| F6 | "một mặt bàn học kích thước 12dm × 6dm = 72dm²" | [vjol.info](https://www.vjol.info/1m-vuong-bang-bao-nhieu-dm-vuong) |
| F7 | "Để lát nền một căn phòng, người ta đã dùng vừa hết 150 viên gạch hình vuông có cạnh 40cm": 40 × 40 = 1600 cm²; 1600 × 150 = 240000 cm² = 24 m² | [hoc247.net](https://hoc247.net/toan-lop-5/mi-li-met-vuong-bang-don-vi-do-dien-tich-l342.html) (SGK Bài 4); 1 m² = 10 000 cm² cùng trang |
| F8 | 8 dm² = 800 cm²; 500 dm² = 5 m²; 800 mm² = 8 cm²; 2 m² 30 dm² = 230 dm² | [monkey.edu.vn](https://monkey.edu.vn/ba-me-can-biet/giao-duc/kien-thuc-co-ban/mi-li-met-vuong-bang-don-vi-do-dien-tich) (8 dm²), [vjol.info](https://www.vjol.info/1m-vuong-bang-bao-nhieu-dm-vuong) (500 dm², 2 m² 30 dm²), [hoc247.net](https://hoc247.net/toan-lop-5/mi-li-met-vuong-bang-don-vi-do-dien-tich-l342.html) (800 mm²) |
| F9 | Thử thách: 3 cm² 5 mm² = 300 mm² + 5 mm² = 305 mm² | [hoc247.net](https://hoc247.net/toan-lop-5/mi-li-met-vuong-bang-don-vi-do-dien-tich-l342.html) (Luyện tập Bài 2) |

Trang SGK gốc (loigiaihay, vietjack) không tải được nội dung từ máy cloud, nên các câu trên lấy từ những trang thay thế đã đọc được. Mọi phép tính được `console.assert` lại trong `scene.js`. Không có số nào ngoài bảng trên.

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Đơn vị đo diện tích". Tấm gỗ lớn "1 m²" cạnh ô nhỏ xíu "1 dm²" (đúng tỉ lệ cạnh 10 : 1). "1 m² = ? dm²". | "1 mét vuông bằng bao nhiêu đề-xi-mét vuông? Cùng xem nhé!" |
| 2. dm² | Khăn lau. Tấm gỗ cạnh "1 dm" (thước hai cạnh), "1 dm²". Vạch 10 phần, kẻ lưới 10 × 10. Một ô xanh "1 cm²", hàng trên và cột phải tô xanh. "10 × 10 = 100", "1 dm² = 100 cm²" khoanh. | "Đây là hình vuông có cạnh 1 đề-xi-mét. Diện tích của nó là 1 đề-xi-mét vuông. Chia mỗi cạnh thành 10 xăng-ti-mét. Mỗi ô nhỏ là 1 xăng-ti-mét vuông. Một hàng có 10 ô, và có 10 hàng. Vậy 1 đề-xi-mét vuông bằng 100 xăng-ti-mét vuông." |
| 3. m² | Khăn lau. Khung cạnh "1 m", "1 m²". 100 ô gỗ rơi vào từng hàng, một ô xanh "1 dm²". "1 m² = 100 dm²" (trả lời câu móc). | "Hình vuông cạnh 1 mét có diện tích 1 mét vuông. Nó gồm 100 ô vuông 1 đề-xi-mét vuông. Vậy 1 mét vuông bằng 100 đề-xi-mét vuông!" |
| 4. mm² | Khăn lau. Ô "1 cm²" nhỏ, kính lúp, phóng to thành hình vuông cạnh "1 cm"; lưới 10 × 10; ô xanh "1 mm²". "1 cm² = 100 mm²". | "Còn đây là 1 xăng-ti-mét vuông. Phóng to lên nhé! Chia mỗi cạnh thành 10 mi-li-mét. Mỗi ô nhỏ là hình vuông cạnh 1 mi-li-mét. Diện tích của nó là 1 mi-li-mét vuông. 1 xăng-ti-mét vuông bằng 100 mi-li-mét vuông." |
| 5. Bậc thang | Khăn lau. 4 khối m², dm², cm², mm² (lớn → bé); mũi tên "× 100" đi xuống, ": 100" đi lên. Khối nhún theo chiều đổi. | "Mỗi đơn vị gấp 100 lần đơn vị bé hơn tiếp liền. Đổi từ lớn sang bé thì nhân 100. Từ bé sang lớn thì chia 100." |
| 6. Đời sống | Khăn lau. Bàn học "12 dm" × "6 dm", "12 × 6 = 72 dm²". Viên gạch "40 cm" × 150 viên, "1 viên: 40 × 40 = 1600 cm²", "1600 × 150 = 240 000 cm²", "Nền phòng: 24 m²". | "Mặt bàn học dài 12 đề-xi-mét, rộng 6 đề-xi-mét. Diện tích là 72 đề-xi-mét vuông. Một căn phòng lát vừa hết 150 viên gạch vuông cạnh 40 xăng-ti-mét. Mỗi viên 1600 xăng-ti-mét vuông. 150 viên là 240000 xăng-ti-mét vuông. Tức là nền phòng rộng 24 mét vuông." |
| 7–8. Thử đổi | Khăn lau. "Thử đổi nhé!" 4 dòng: dấu "?" → đáp án vàng, nhãn "× 100" / ": 100" / "200 + 30", dấu ✓ xanh. | "Thử đổi nhé! 8 đề-xi-mét vuông, nhân 100, được 800 xăng-ti-mét vuông. 500 đề-xi-mét vuông, chia 100, được 5 mét vuông. 800 mi-li-mét vuông, chia 100, được 8 xăng-ti-mét vuông. 2 mét vuông 30 đề-xi-mét vuông là 200 cộng 30, bằng 230 đề-xi-mét vuông." |
| 9. Thử thách | Khăn lau. "Đến lượt bạn!" "3 cm² 5 mm² = ? mm²", đồng hồ 3-2-1. | "Đến lượt bạn: 3 xăng-ti-mét vuông 5 mi-li-mét vuông bằng bao nhiêu mi-li-mét vuông? Bình luận đáp án nhé!" |
| 10. Đáp án | "3 cm² = 300 mm²", "300 + 5 = 305" khoanh, 305 vào chỗ "?". | "Đáp án: 3 xăng-ti-mét vuông là 300 mi-li-mét vuông. 300 cộng 5 bằng 305 mi-li-mét vuông!" |
