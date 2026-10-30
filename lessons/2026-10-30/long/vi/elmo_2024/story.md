# ELMO 2024: Giải câu 41-50 (khối 4)

Mỗi scene một câu; các câu được thêm dần khi người dùng gửi ảnh từng câu. Đã có: câu 41, 42.

**Mở đầu (scene1):** "Xin chào các bạn. Chào mừng các bạn đến với kênh Học cùng Phượng. Hôm nay chúng ta cùng giải đề thi ELMO năm 2024." Trước mỗi đề, đọc số câu.

**Kết thúc (scene cuối):** lời cảm ơn và kêu gọi "đăng ký kênh" (dùng "đăng ký", không dùng "theo dõi").

**Cách làm:** thẻ gỗ và chữ phấn; mọi con số trên bảng tính trong `scene.js` và kiểm bằng `console.assert`; đề đọc và viết nguyên văn (bỏ phần ghi điểm "[x điểm]"); sau đề có 5 giây im lặng suy nghĩ; "Sau đây là cách giải." là beat riêng; kết thúc mỗi câu bằng đáp số lớn màu vàng.

## Nguồn và kiểm tra dữ kiện

| Câu | Dữ kiện | Kiểm tra | Nguồn |
|---|---|---|---|
| 41 | Các số lẻ từ 10 đến 500 đọc xuôi hay ngược đều giống nhau | Số 2 chữ số dạng aa, lẻ: 11, 33, 55, 77, 99 (5 số). Số 3 chữ số dạng aba, lẻ nên a lẻ; a = 5, 7, 9 cho số từ 505 trở lên, lớn hơn 500; a = 1 hoặc 3, b tùy ý 0-9: 2 × 10 = 20 số. Tổng 5 + 20 = 25. Code liệt kê 10..500 cũng ra đúng 25 số. | Ảnh câu 41 và "Đáp án chi tiết" do người dùng cung cấp (5 + 10 × 2 = 25). |
| 42 | 4 thẻ 1, 2, 3, 4; số có 2 chữ số khác nhau | Mỗi thẻ dùng một lần: 4 cách chọn chữ số hàng chục, 3 cách chọn hàng đơn vị, 12 số: 12, 13, 14, 21, 23, 24, 31, 32, 34, 41, 42, 43. Việc mỗi thẻ chỉ dùng một lần suy từ danh sách trong đáp án chính thức (không có 11, 22, 33, 44). | Ảnh câu 42 và "Đáp án chi tiết" do người dùng cung cấp (danh sách 12 số). |

## Các bước giải trên bảng

| Câu | Bảng | Lời đọc |
|---|---|---|
| 41 | Hai thẻ 10 và 500; ví dụ 131 với mũi tên đọc xuôi và ngược; hàng 11-99 gạch chéo số chẵn; dạng a b a, thẻ 1, 3, 5, 7, 9 gạch 5, 7, 9 kèm "505 > 500"; hai dạng 1_1 và 3_3 với ô giữa chạy 0-9; 5 + 10 × 2 = 25 | Hai hoặc ba chữ số; chữ số đầu bằng chữ số cuối; số lẻ nên đầu lẻ; không vượt 500 nên đầu là 1 hoặc 3; mỗi dạng 10 số. |
| 42 | Bốn thẻ 1-4 rơi xuống; bốn hàng, mỗi hàng một thẻ hàng chục và ba số tạo được, hàng 1 khoanh vàng; "4 cách", "3 cách"; 4 × 3 = 12 | Chọn hàng chục 4 cách; hàng đơn vị 3 cách vì mỗi thẻ dùng một lần; 4 nhân 3 bằng 12. |
