# ELMO 2023: Giải câu 41-50 (khối 4)

Mỗi scene một câu; các câu được thêm dần khi người dùng gửi ảnh từng câu. Hiện có scene1 (câu 41); các câu 42-50 sẽ thêm sau, cùng định dạng với ELMO 2024.

**Mở đầu (scene1):** "Xin chào các bạn. Chào mừng các bạn đến với kênh Học cùng Phượng. Hôm nay chúng ta cùng giải đề thi ELMO năm 2023." Trước mỗi đề, đọc số câu.

**Cách làm:** chữ phấn và vòng tròn phấn; mọi con số trên bảng tính trong `scene.js` và kiểm bằng `console.assert`; đề đọc và viết theo ảnh (đề gốc tiếng Anh dịch sang tiếng Việt, bỏ phần ghi điểm "[2.3 points]"); sau đề có 5 giây im lặng suy nghĩ; "Sau đây là cách giải." là beat riêng; kết thúc bằng đáp số màu vàng khoanh tròn.

## Nguồn và kiểm tra dữ kiện

| Câu | Dữ kiện | Kiểm tra | Nguồn |
|---|---|---|---|
| 41 | Hình chữ thập: A ở trên, 12 bên trái, 9 bên phải, 5 ở dưới, B ở giữa; tổng mỗi đường bằng 32; hỏi A - B | Đường ngang 12 + B + 9 = 32 nên B = 32 - 12 - 9 = 11. Đường dọc A + B + 5 = 32 nên A = 32 - 11 - 5 = 16. A - B = 16 - 11 = 5. Kiểm: 12 + 11 + 9 = 32 và 16 + 11 + 5 = 32. Code `console.assert` các phép tính. | Ảnh câu 41 do người dùng cung cấp. **Đáp số 5 do tự tính; chưa có ảnh "Đáp án chi tiết" để đối chiếu.** |

## Các bước giải trên bảng

| Câu | Bảng | Lời đọc |
|---|---|---|
| 41 | Đề bên trái, hình chữ thập bên phải; lời giải: hình bên trái, khung vàng quanh đường ngang rồi đường dọc, phép tính bên phải, số 11 và 16 thay chữ B và A; A - B = 16 - 11 = 5 khoanh vàng | Đường ngang tìm B; đường dọc tìm A; trừ hai số. |
