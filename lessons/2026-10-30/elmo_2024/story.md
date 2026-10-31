# ELMO 2024: Giải câu 41-50 (khối 4)

Mỗi scene một câu; các câu được thêm dần khi người dùng gửi ảnh từng câu. Đủ 10 scene: câu 41-50.

**Mở đầu (scene1):** "Xin chào các bạn. Chào mừng các bạn đến với kênh Học cùng Phượng. Hôm nay chúng ta cùng giải đề thi ELMO năm 2024." Trước mỗi đề, đọc số câu.

**Kết thúc (scene10, beat outro):** "Cảm ơn các bạn đã xem video. Hãy đăng ký kênh Học cùng Phượng để đón xem những video tiếp theo." (dùng "đăng ký", không dùng "theo dõi").

**Cách làm:** thẻ gỗ và chữ phấn; mọi con số trên bảng tính trong `scene.js` và kiểm bằng `console.assert`; đề đọc và viết nguyên văn (bỏ phần ghi điểm "[x điểm]"); sau đề có 5 giây im lặng suy nghĩ; "Sau đây là cách giải." là beat riêng; kết thúc mỗi câu bằng đáp số lớn màu vàng.

## Nguồn và kiểm tra dữ kiện

| Câu | Dữ kiện | Kiểm tra | Nguồn |
|---|---|---|---|
| 41 | Các số lẻ từ 10 đến 500 đọc xuôi hay ngược đều giống nhau | Số 2 chữ số dạng aa, lẻ: 11, 33, 55, 77, 99 (5 số). Số 3 chữ số dạng aba, lẻ nên a lẻ; a = 5, 7, 9 cho số từ 505 trở lên, lớn hơn 500; a = 1 hoặc 3, b tùy ý 0-9: 2 × 10 = 20 số. Tổng 5 + 20 = 25. Code liệt kê 10..500 cũng ra đúng 25 số. | Ảnh câu 41 và "Đáp án chi tiết" do người dùng cung cấp (5 + 10 × 2 = 25). |
| 42 | 4 thẻ 1, 2, 3, 4; số có 2 chữ số khác nhau | Mỗi thẻ dùng một lần: 4 cách chọn chữ số hàng chục, 3 cách chọn hàng đơn vị, 12 số: 12, 13, 14, 21, 23, 24, 31, 32, 34, 41, 42, 43. Việc mỗi thẻ chỉ dùng một lần suy từ danh sách trong đáp án chính thức (không có 11, 22, 33, 44). | Ảnh câu 42 và "Đáp án chi tiết" do người dùng cung cấp (danh sách 12 số). |
| 43 | Bảng 3 × 3 chữ cái a b c / a b b / c c c; tổng hàng: ▲, 21, 18; tổng cột: ●, 22, 20 | Hàng 3: c + c + c = 18 nên c = 6. Cột 2: b + b + c = 22 nên b = 8. Hàng 2: a + b + b = 21 nên a = 5. ▲ = a + b + c = 19 (hàng 1), ● = a + a + c = 16 (cột 1); tổng 35. Kiểm cột 3: c + b + c = 20. | Ảnh câu 43 và "Đáp án chi tiết" do người dùng cung cấp (▲ + ● = 35). |
| 44 | Hình thứ n gồm n × n viên đá; hình 1-4 có (đen, trắng) = (1, 0), (1, 3), (6, 3), (6, 10); hình 6 hỏi trắng nhiều hơn đen bao nhiêu | Mỗi hình thêm một lớp chữ L gồm 2n - 1 viên (1, 3, 5, 7, 9, 11); lớp lẻ đen, lớp chẵn trắng. Đen: 1 + 5 + 9 = 15; trắng: 3 + 7 + 11 = 21; 21 - 15 = 6. Code dựng hình 1-5 và khớp số đen/trắng của đề và đáp án (hình 5: 15 đen, 10 trắng). | Ảnh câu 44 và "Đáp án chi tiết" do người dùng cung cấp (21 - 15 = 6). **Hình trên bảng là bản vẽ lại (lớp chữ L ở hàng trên và cột phải), số viên khớp đề; chưa đối chiếu vị trí từng viên với ảnh gốc.** |
| 45 | Hình chữ nhật chia 3 ô bằng 2 đường thẳng đứng, một đường chéo từ giữa cạnh trái tới góc dưới phải; đếm hình tứ giác | Code đếm 15 (cộng hợp các mảnh, bỏ hình có 3 đỉnh): hình chữ nhật 3 + 2 + 1 = 6; phần trên đường chéo 6; phần dưới đường chéo 3 (các phần chứa ô cuối là tam giác nên loại). 6 + 6 + 3 = 15. Một chương trình riêng vét cạn mọi tập mảnh cũng ra 15. | Ảnh câu 45 do người dùng cung cấp; **đáp án 15 do tự tính, ảnh "Đáp án chi tiết" chỉ có hình các tứ giác, không có số: nên đối chiếu số hình trong ảnh đáp án.** |
| 46 | Tổng 14, tích 48; hỏi hiệu | Các cặp có tích 48: 1×48, 2×24, 3×16, 4×12, 6×8 với tổng 49, 26, 19, 16, 14; chỉ 6 và 8 có tổng 14; 8 - 6 = 2. | Ảnh câu 46 và "Đáp án chi tiết" (8 - 6 = 2). |
| 47 | Hai vòng tròn không kề nhau trong ô sáu ngăn (ô bốn ngăn có 3 trường hợp) | Vòng thứ nhất ở ngăn 1, 2, 3, 4 có 4, 3, 2, 1 cách đặt vòng thứ hai về bên phải; tổng 10. Kiểm chéo: 15 cặp - 5 cặp kề nhau = 10. Ô bốn ngăn cho 3 trường hợp, khớp đề. | Ảnh câu 47; đáp án 10 khớp số hình trong "Đáp án chi tiết" (4 + 3 + 2 + 1). |
| 48 | Bốn lựa chọn A-D, mỗi lựa chọn là một lưới 2 × 2 xoay theo mũi tên; hỏi hình nào KHÔNG đúng | Mũi tên được đọc là xoay 1/4 vòng theo chiều kim đồng hồ (ô (r, c) sang (c, 1 - r), tam giác quay đỉnh lên thành sang phải). A, C, D đúng; B vẫn quay đỉnh lên nên sai. Chỉ cách đọc này cho đúng một lựa chọn sai. | Ảnh câu 48; đáp án B khớp hình trong "Đáp án chi tiết" (tam giác ở góc trên phải thành tam giác quay sang phải ở góc dưới phải). **Hình trên bảng là bản vẽ lại đơn giản hóa.** |
| 49 | Lịch tháng 5 bị mực che, thấy ngày 1 là thứ Tư, ngày 5 và 11; hỏi ngày cuối là thứ mấy | Ngày 1 thứ Tư nên 8, 15, 22, 29 là thứ Tư; tháng 5 có 31 ngày nên 30 thứ Năm, 31 thứ Sáu; đáp án C. Code kiểm cột của 5 (Chủ nhật) và 11 (thứ Bảy). | Ảnh câu 49 và "Đáp án chi tiết" (tháng 5 có 31 ngày; lịch có 31 ở cột T6). |
| 50 | Dây A bằng một nửa tổng B và C; 2D = 3C; một nửa D bằng B; hỏi dây dài thứ hai | Chọn D = 12 phần: C = 24 : 3 = 8, B = 6, A = (6 + 8) : 2 = 7; thứ tự D > C > A > B; dài thứ hai là C. | Ảnh câu 50 và "Đáp án chi tiết" (D > C > A > B). |

## Các bước giải trên bảng

| Câu | Bảng | Lời đọc |
|---|---|---|
| 41 | Hai thẻ 10 và 500; ví dụ 131 với mũi tên đọc xuôi và ngược; hàng 11-99 gạch chéo số chẵn; dạng a b a, thẻ 1, 3, 5, 7, 9 gạch 5, 7, 9 kèm "505 > 500"; hai dạng 1_1 và 3_3 với ô giữa chạy 0-9; 5 + 10 × 2 = 25 | Hai hoặc ba chữ số; chữ số đầu bằng chữ số cuối; số lẻ nên đầu lẻ; không vượt 500 nên đầu là 1 hoặc 3; mỗi dạng 10 số. |
| 42 | Bốn thẻ 1-4 rơi xuống; bốn hàng, mỗi hàng một thẻ hàng chục và ba số tạo được, hàng 1 khoanh vàng; "4 cách", "3 cách"; 4 × 3 = 12 | Chọn hàng chục 4 cách; hàng đơn vị 3 cách vì mỗi thẻ dùng một lần; 4 nhân 3 bằng 12. |
| 43 | Đề bên trái, bảng a b c bên phải; bảng lớn dần thay chữ bằng số (c = 6, b = 8, a = 5) với khung vàng quanh hàng hoặc cột đang dùng; ▲ = 19, ● = 16, ▲ + ● = 19 + 16 = 35 | Hàng cuối tìm c; cột giữa tìm b; hàng giữa tìm a; ▲ là hàng đầu, ● là cột đầu. |
| 44 | Năm khung hình 1-4 và "...?"; sáu hình với lớp chữ L, số viên mỗi lớp 1, 3, 5, 7, 9, 11; hình 6 lớn với 1 + 5 + 9 = 15, 3 + 7 + 11 = 21, 21 - 15 = 6 | Mỗi hình thêm một lớp chữ L; lớp lẻ đen, lớp chẵn trắng; đếm đen, đếm trắng, lấy hiệu. |
| 45 | Hình chữ nhật lớn với đường chéo; ba hàng hình nhỏ khoanh vàng (6 hình chữ nhật, 6 phần trên đường chéo, 3 phần dưới) và 3 tam giác gạch đỏ; 6 + 6 + 3 = 15 | Đếm theo ba nhóm; phần dưới của ô cuối là tam giác nên không tính. |
| 46 | □ + △ = 14 và □ × △ = 48; năm hàng cặp có tích 48 kèm tổng, ✗ bốn hàng, ✓ hàng 6 × 8; 8 - 6 = 2 | Liệt kê cặp có tích 48, cộng từng cặp, chọn tổng 14. |
| 47 | Ba ô bốn ngăn ví dụ; bốn hàng ô sáu ngăn (4, 3, 2, 1 trường hợp) vòng đầu tô vàng; 4 + 3 + 2 + 1 = 10 | Chọn ngăn cho vòng thứ nhất rồi đếm chỗ cho vòng thứ hai bên phải. |
| 48 | Bốn thẻ A-D (lưới, mũi tên xoay, lưới kết quả); ✓ A, C, D; hình B tách riêng: hình đã cho, xoay đúng (tam giác sang phải), hình B (✗); Đáp án: B | Xoay 1/4 vòng theo chiều kim đồng hồ; thử từng hình. |
| 49 | Lịch tháng 5 với vết mực và bốn đáp án; lịch mở ra, cột T4 tô vàng 1, 8, 15, 22, 29, rồi 30 (thứ Năm), 31 (thứ Sáu); khoanh C | Ngày 1 là thứ Tư; mỗi tuần 7 ngày; tháng có 31 ngày. |
| 50 | Đề (bốn dòng) và A B C D; bốn hàng khối gỗ D 12, C 8, B 6, A 7 kèm phép tính; xếp hạng 1, 2, 4, 3; Đáp án: C; màn kết cảm ơn và đăng ký kênh | Chọn D = 12 phần rồi suy ra các dây khác; xếp từ dài đến ngắn. |
