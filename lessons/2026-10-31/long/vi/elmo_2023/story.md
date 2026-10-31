# ELMO 2023: Giải câu 41-50 (khối 4)

Mỗi scene một câu; các câu được thêm dần khi người dùng gửi ảnh từng câu. Hiện có scene1-5 (câu 41-45); các câu 46-50 sẽ thêm sau, cùng định dạng với ELMO 2024.

**Mở đầu (scene1):** "Xin chào các bạn. Chào mừng các bạn đến với kênh Học cùng Phượng. Hôm nay chúng ta cùng giải đề thi ELMO năm 2023." Trước mỗi đề, đọc số câu.

**Cách làm:** chữ phấn và vòng tròn phấn; mọi con số trên bảng tính trong `scene.js` và kiểm bằng `console.assert`; đề đọc và viết theo ảnh (đề gốc tiếng Anh dịch sang tiếng Việt, bỏ phần ghi điểm "[2.3 points]"); sau đề có 5 giây im lặng suy nghĩ; "Sau đây là cách giải." là beat riêng; kết thúc bằng đáp số màu vàng khoanh tròn.

## Nguồn và kiểm tra dữ kiện

| Câu | Dữ kiện | Kiểm tra | Nguồn |
|---|---|---|---|
| 41 | Hình chữ thập: A ở trên, 12 bên trái, 9 bên phải, 5 ở dưới, B ở giữa; tổng mỗi đường bằng 32; hỏi A - B | Đường ngang 12 + B + 9 = 32 nên B = 32 - 12 - 9 = 11. Đường dọc A + B + 5 = 32 nên A = 32 - 11 - 5 = 16. A - B = 16 - 11 = 5. Kiểm: 12 + 11 + 9 = 32 và 16 + 11 + 5 = 32. Code `console.assert` các phép tính. | Ảnh câu 41 do người dùng cung cấp. **Đáp số 5 do tự tính; chưa có ảnh "Đáp án chi tiết" để đối chiếu.** |
| 42 | 3 táo nặng bằng 2 lê; 10 quýt nặng bằng 3 lê; hỏi bao nhiêu quýt nặng bằng 18 táo | 18 : 3 = 6 nhóm 3 táo; mỗi nhóm bằng 2 lê nên 6 × 2 = 12 lê; 12 : 3 = 4 nhóm 3 lê; mỗi nhóm bằng 10 quýt nên 4 × 10 = 40 quýt. Code `console.assert` các phép tính. | Ảnh câu 42 (hai cân: 3 táo = 2 lê; 10 quýt = 3 lê). **Đáp số 40 do tự tính; chưa có ảnh "Đáp án chi tiết".** |
| 43 | Lịch bị mực che, chỉ thấy ngày 4 ở cột Chủ nhật (hàng 2); hỏi ngày của thứ Tư cuối cùng trong tháng | 4 là Chủ nhật nên thứ Tư gần nhất là 4 + 3 = 7; rồi 14, 21, 28; thứ Tư kế tiếp là 35, lớn hơn 31 (một tháng có nhiều nhất 31 ngày) nên không có. Đáp số 28 đúng với mọi tháng 28-31 ngày. | Ảnh câu 43 (ô "4" nằm dưới cột Sun). **Đáp số 28 do tự tính; chưa có ảnh "Đáp án chi tiết".** |
| 44 | Bảng A, B, C và Quyết định: (3, 1, 5) Có; (4, 3, 5) Có; (5, 2, 5) Không; (8, 8, 8) Có; (10, 6, ?) Có | Theo thứ tự B, A, C các hàng Có cách đều: 1, 3, 5 (hơn 2); 3, 4, 5 (hơn 1); 8, 8, 8 (hơn 0). Hàng Không: 2, 5, 5 hơn 3 rồi hơn 0, không đều. Hàng cuối: 6, 10, ? hơn 4 nên ? = 10 + 4 = 14. Code kiểm quy luật cho cả 4 hàng. | Ảnh câu 44. **Quy luật "A ở chính giữa B và C" do tự suy ra từ 4 hàng, đáp số 14 chưa có ảnh "Đáp án chi tiết" để đối chiếu.** |
| 45 | Bảng 4 × 4 các chữ a, b, c; tổng hàng 13, 14, 11, 12; tổng cột 10, 11, 12, ngôi sao | Cột 1 (a, a, b, b) = 10 nên a + b = 5. Cột 2 (a, a, a, b) = 11 = 5 + 2a nên a = 3, b = 2. Hàng 2 (a, a, a, c) = 14 nên c = 14 - 9 = 5. Ngôi sao = cột 4 (c, c, c, b) = 15 + 2 = 17. Code kiểm cả 4 hàng và 3 cột khớp. | Ảnh câu 45. **Đáp số 17 do tự tính (mọi hàng, cột đã kiểm); chưa có ảnh "Đáp án chi tiết".** |

## Các bước giải trên bảng

| Câu | Bảng | Lời đọc |
|---|---|---|
| 41 | Đề bên trái, hình chữ thập bên phải; lời giải: hình bên trái, khung vàng quanh đường ngang rồi đường dọc, phép tính bên phải, số 11 và 16 thay chữ B và A; A - B = 16 - 11 = 5 khoanh vàng | Đường ngang tìm B; đường dọc tìm A; trừ hai số. |
| 42 | Hai cân (3 táo = 2 lê, 10 quýt = 3 lê); 18 táo chia 6 nhóm 3, mỗi nhóm một mũi tên xuống 2 lê, 6 × 2 = 12 lê; 12 lê chia 4 nhóm 3, mỗi nhóm xuống tháp 10 quýt, 4 × 10 = 40; 18 táo = 12 lê = 40 quýt | Chia 18 táo thành nhóm 3; đổi sang lê; chia lê thành nhóm 3; đổi sang quýt. |
| 43 | Lịch có vết mực; lịch mở ra, ô 4 khoanh hồng, các ngày thứ Tư 7, 14, 21, 28 màu vàng cùng phép cộng ở bên phải; 28 + 7 = 35 gạch đỏ kèm 35 > 31; ô 28 khoanh vàng | 4 là Chủ nhật; cộng 7 mỗi lần; 35 vượt quá 31 ngày. |
| 44 | Đề bên trái, bảng bên phải; lời giải: bảng bên trái, bên phải từng hàng B → A → C với mũi tên +hiệu, ✓ cho hàng Có, ✗ cho hàng Không; hàng cuối 6 → 10 → 14 khoanh vàng | Xếp theo B, A, C; xem hai hiệu có bằng nhau không; hàng cuối thêm 4 nữa. |
| 45 | Đề bên trái, bảng 4 × 4 bên phải; lời giải: khung vàng cột 1, cột 2 và phép tính, a = 3, b = 2; khung hàng 2, c = 5; khung cột 4, ngôi sao = 5 + 5 + 5 + 2 = 17 khoanh vàng | Hai cột đầu cho a và b; hàng 2 cho c; cột cuối cho ngôi sao. |
