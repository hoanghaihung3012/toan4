# ELMO 2025: Giải câu 31-40 (khối 4)

Mười scene, mỗi scene một câu.

**Câu 32 (đã làm lại từ ảnh đề `questions/32.png`):** scene2 vẽ lại bốn nhóm bằng phấn từ bảng chiều cao đọc trên hình 3D và hình "Mặt trên", đếm từng cột (kể cả khối bị che) rồi cộng: A = 12, B = 8, C = 10, D = 11. Nhiều nhất A (12), ít nhất B (8), tổng 20, trùng đáp án chính thức.

**Mở đầu:** "Xin chào các bạn. Chào mừng các bạn đến với kênh Học cùng Phượng. Hôm nay chúng ta cùng giải đề thi ELMO năm 2025." Trước mỗi đề, đọc số câu trước.

**Kết thúc:** "Cảm ơn các bạn đã theo dõi. Hãy theo dõi kênh Học cùng Phượng để đón xem những video tiếp theo." (nằm ở scene cuối, scene10).

**Cách làm (scene1, 3-8):** thẻ gỗ và chữ phấn; mọi con số trên bảng đều tính trong `scene.js` và kiểm bằng `console.assert`; đề đọc và viết nguyên văn; "Sau đây là cách giải." là beat riêng; kết thúc mỗi câu bằng đáp số lớn màu vàng.

## Nguồn và kiểm tra dữ kiện

| Câu | Dữ kiện | Kiểm tra | Nguồn |
|---|---|---|---|
| 31 | Thẻ 1, 2, 4, 7, +, ×; mỗi thẻ dùng tối đa một lần; hai thẻ số không đứng cạnh nhau | n thẻ số cần n-1 thẻ phép toán, chỉ có 2 thẻ phép toán nên dùng 2 hoặc 3 số. Hai số: 6 cặp × 2 phép = 12 phép tính, 11 kết quả (1+7 và 2×4 cùng bằng 8). Ba số: 4 cách chọn số đứng riêng × 3 cặp nhân = 12 phép tính, 7 kết quả (6, 9, 11, 15, 18, 29, 30); mới: 15, 18, 29, 30. Tổng 11 + 4 = 15. | Ảnh câu 31 do người dùng cung cấp; đáp án 15 khớp đáp án chính thức (xem câu 37). Đếm "kết quả khác nhau", đúng với đáp án chính thức. |
| 32 | Bốn nhóm khối A-D: số khối 12, 8, 10, 11; nhiều nhất A, ít nhất B; 12 + 8 = 20 | Chiều cao từng cột đọc từ ảnh đề (`questions/32.png`): A = 2+1+1+3+3+1+1, B = 1+1+1+2+3, C = 1+1+3+1+3+1, D = 1+1+2+2+3+2. Khối bị che (3, 0, 2, 3) và các tổng được kiểm bằng `console.assert` trong scene2; kết quả 20 khớp đáp án chính thức. Nhãn A-D do video đặt để gọi tên nhóm. | Đáp án chính thức "2025 Answer MO" (ELMO khối 4, câu 32, [Scribd](https://www.scribd.com/document/1042285241/2025-Answer-MO)); đề gốc khối 4, [Scribd](https://www.scribd.com/document/1068475626/2025-Elmo-Official-Test-Paper-g4). |
| 33 | 4 phần mất 2 phút; cắt 30 khúc, mỗi khúc 3 phần, cùng tốc độ | 4 phần cần 3 nhát nên 3 nhát = 2 phút. 3 phần cần 2 nhát; 30 × 2 = 60 nhát; 60 : 3 = 20 nhóm; 20 × 2 = 40 phút. Kiểm chéo: 60 × 2/3 = 40. | Ảnh câu 33; đáp án 40 khớp đáp án chính thức. |
| 34 | Bảng 3×3 dùng 1-9 đúng một lần; ô cho sẵn 7, 6 (hàng trên), 8 (giữa), 4 (góc dưới trái); tổng hàng 2a, a+1, a; tổng cột a+1, 2a, a | Tổng 1..9 = 45 = 2a + (a+1) + a = 4a + 1 nên a = 11. Hàng tổng 22, 12, 11; cột 12, 22, 11. Điền lần lượt 9, 1, 5, 2, 3 (mỗi bước chỉ còn một ô trống); cột 3: 6+3+2 = 11. | Ảnh câu 34; đáp án 11 khớp đáp án chính thức. |
| 35 | Bia 10, 7, 5, 3; ba mũi (được lặp vùng); tổng < 20 | Liệt kê mọi bộ ba: không có vòng 10 cho 9, 11, 13, 15, 17, 19; đúng một vòng 10 cho 16, 18; hai vòng 10 trở lên tổng ít nhất 10+10+3 = 23. 10, 12, 14 không thể có. Có 8 tổng. | Ảnh câu 35; đáp án 8 khớp đáp án chính thức. |
| 36 | Đặt 7, 12, 14, 19 vào bốn đầu mút; hai đường cùng qua tâm 25 | Hai cặp đầu mút cùng tổng; tổng 52 nên mỗi cặp 26; chỉ ghép 7+19 và 12+14. Mỗi đường 26 + 25 = 51. | Ảnh câu 36; đáp án 51 khớp đáp án chính thức. |
| 37 | Ba hình đầu 7, 15, 23 chấm (kiểm bằng cách đếm chấm dựng ra); hình "ngôi nhà" 7 điểm cố định, 8 cạnh | Mỗi hình sau thêm 1 chấm trên mỗi cạnh nên tăng 8: 7, 15, 23, 31, 39. Hình 4 và 5 được vẽ ra, đếm bằng code ra 31 và 39. | Ảnh câu 37; đáp án 39 đối chiếu "2025 Answer MO" (ELMO khối 4 câu 37, scribd.com/document/1042285241). Tài liệu này cũng xác nhận câu 31 (15), 33 (40), 34 (11), 35 (8), 36 (51) và cho thấy câu 32 là 20. |
| 38 | Lưới chấm 5×5; hình ví dụ và 4 lựa chọn A-D; hỏi hình nào cùng diện tích với ví dụ | Đếm trực tiếp chấm trên viền B và chấm bên trong I (ví dụ 8/6, A 12/7, B 8/5, C 14/2, D 6/7); diện tích = I + B : 2 - 1 = 9, 12, 8, 8, 9, kiểm chéo bằng công thức Shoelace. Chỉ D bằng ví dụ. | Đáp án D lấy từ "2025 Answer MO" (cùng tài liệu trên, câu 38). **Các hình là bản vẽ lại đơn giản hóa trên cùng lưới chấm, không phải sao chép đề gốc; cần đối chiếu với ảnh câu 38 nếu muốn khớp hình gốc.** |
| 39 | Nhóm hình nào tuân theo quy luật biến đổi giống hình ví dụ (hình xoắn ốc vuông và ảnh biến đổi); bốn lựa chọn A-D | Quy luật của ví dụ là **xoay rồi lật** (ảnh lời giải do người dùng cung cấp: hình → Rotation → Reflection). Mũi tên nhóm C hướng lên sau khi xoay 90° rồi lật qua trục ngang thì hướng sang phải. | Ảnh câu 39 và ảnh lời giải do người dùng cung cấp; đáp án C theo "2025 Answer MO" (khối 4, câu 39, scribd.com/document/1042285241). **Các hình là bản vẽ lại đơn giản hóa, chưa đối chiếu từng nét với ảnh gốc; chỉ nhóm C được kiểm chứng bằng phép biến đổi, các nhóm A, B, D không được nêu lý do loại trừ.** |
| 40 | Lưới 4 hàng × 6 cột (hàng 1: 2, 75, 64, 88, 74, 20; hàng 2: 83, 42, 16, 29, 65, 27; hàng 3: 38, 56, 47, 92, 49, 11; hàng 4: 55, 31, 73, 13, 58, 94); bắt đầu từ số 2; đi theo ô có số chia 9 dư 2; lối ra A-D bên phải mỗi hàng | Các số chia 9 dư 2 trong lưới là 2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92 (cách nhau 9). Đi sang ô kề cạnh từ ô 2: 2, 83, 38, 56, 47, 92, 29, 65, 74, 20, ra lối A. Ô 11 cũng dư 2 nhưng các ô kề (27, 49, 94) không nên không đi tới được. Đường đi và đáp án do code dò (BFS) và đối chiếu với ảnh lời giải. | Ảnh câu 40 và ảnh lời giải do người dùng cung cấp; đáp án A khớp "2025 Answer MO" (khối 4, câu 40). |

## Các bước giải trên bảng

| Câu | Bảng (chữ và hình) | Lời đọc |
|---|---|---|
| 31 | Sáu thẻ rơi xuống bảng; hàng thẻ 2, 3, 4 số với ô phép toán còn thiếu (dấu ✗ ở hàng 4 số); bảng 6 cặp cộng/nhân, hai phép bằng 8 khoanh đỏ "trùng"; dải 11 thẻ kết quả; bảng 4 × 3 phép tính ba số; 4 kết quả mới bay vào 4 ô trống; 11 + 4 = 15 | Đọc nguyên văn đề; giữa hai số phải có thẻ phép toán nên chỉ dùng 2 hoặc 3 số; liệt kê 12 phép tính hai số và 12 phép tính ba số; đếm kết quả khác nhau. |
| 33 | Khúc gỗ 4 phần bị cắt từng nhát (đánh số 1, 2, 3); khúc 3 phần 2 nhát; lưới 30 khúc nhỏ; 20 ô nhóm 3 nhát đổi thành 20 ô "2 phút"; 20 × 2 = 40 phút | 4 phần cần 3 nhát mất 2 phút; 30 × 2 = 60 nhát; 60 : 3 = 20 nhóm, mỗi nhóm 2 phút. |
| 34 | Bảng 3×3 thẻ gỗ với tổng hàng/cột bằng a; chín thẻ 1-9 tổng 45; 2a + (a+1) + a = 4a + 1; 4a + 1 = 45; a = 11; điền từng ô (khung vàng quanh hàng hoặc cột đang dùng) | Tổng cả bảng 45; 4a + 1 = 45 nên a = 11; mỗi bước chỉ còn một ô; kiểm tra cột còn lại. |
| 35 | Bia và ba ô mũi tên "< 20"; dải tổng 9-19, ô sáng dần kèm ví dụ (3+3+3...); chú thích 3 trường hợp; dấu ✗ ở 10, 12, 14 | Chia theo số mũi trúng vòng 10; có 8 tổng. |
| 36 | Hình chữ thập 5 vòng tròn, đường ngang vàng, đường dọc xanh; bốn thẻ 7, 12, 14, 19 bay vào bốn đầu mút; 52 : 2 = 26; 26 + 25 = 51 | Hai đường cùng qua 25 nên hai cặp đầu mút bằng nhau; chỉ ghép 7+19 và 12+14. |
| 37 | Năm hình "ngôi nhà"; 7 điểm cố định màu vàng; thẻ 7, 15, 23 rồi 31, 39 với cung "+8"; hình 4 và 5 vẽ ra để kiểm tra; khoanh 39 | 7 điểm cố định, 8 cạnh, mỗi hình sau thêm 1 chấm mỗi cạnh nên tăng 8. |
| 38 | Hình ví dụ lớn, chấm viền hồng và chấm trong vàng hiện lần lượt kèm bộ đếm B, I; công thức; bốn hình A-D đếm lần lượt với dấu ✓ cho D và ✗ cho A, B, C; Đáp án: D | Đếm chấm, tính diện tích từng hình, so với 9. |
