# Dấu hiệu chia hết cho 2, 5, 9, 3 (Toán 4). Gate 1: dữ kiện + kịch bản

9:16 (TikTok), khoảng 65–75 s, bảng xanh + khối gỗ (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Ý chính: **2 và 5 → nhìn chữ số tận cùng. 9 và 3 → cộng các chữ số.**

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Các số có chữ số tận cùng là 0; 2; 4; 6; 8 thì chia hết cho 2. Tận cùng 1; 3; 5; 7; 9 thì không chia hết cho 2. Số chia hết cho 2 là số chẵn, không chia hết cho 2 là số lẻ. | VietJack, Toán 4 trang 95 "Dấu hiệu chia hết cho 2", phần Lý thuyết: vietjack.com/giai-toan-lop-4/dau-hieu-chia-het-cho-2.jsp |
| F2 | Ví dụ: 98 tận cùng là 8 nên chia hết cho 2. 1995 tận cùng là 5 nên không chia hết cho 2, là số lẻ. | như F1 (ví dụ Lý thuyết + Dạng 1) |
| F3 | Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5; không tận cùng 0 hoặc 5 thì không chia hết cho 5. Ví dụ: 4005 tận cùng 5 → chia hết cho 5; 2021 tận cùng 1 → không chia hết cho 5. | VietJack, Toán 4 trang 96 "Dấu hiệu chia hết cho 5": vietjack.com/giai-toan-lop-4/dau-hieu-chia-het-cho-5.jsp |
| F4 | Những số chia hết cho cả 2 và 5 thì có chữ số tận cùng bằng 0. Ví dụ: 660. | như F3 (Dạng 2, Ví dụ 1) |
| F5 | Các số có tổng các chữ số chia hết cho 9 thì chia hết cho 9 (và ngược lại). Ví dụ: 906 có tổng 9 + 0 + 6 = 15; 15 không chia hết cho 9 nên 906 không chia hết cho 9. 3015 nằm trong danh sách ví dụ. | VietJack, Toán 4 trang 97 "Dấu hiệu chia hết cho 9": vietjack.com/giai-toan-lop-4/dau-hieu-chia-het-cho-9.jsp |
| F6 | Các số có tổng các chữ số chia hết cho 3 thì chia hết cho 3 (và ngược lại). | VietJack, Toán 4 trang 98 "Dấu hiệu chia hết cho 3": vietjack.com/giai-toan-lop-4/dau-hieu-chia-het-cho-3.jsp |
| D1 | 3015: 3 + 0 + 1 + 5 = 9 → chia hết cho 9 (3015 = 9 × 335). | Tính từ F5 |
| D2 | 906: tổng 15, 15 chia hết cho 3 → 906 chia hết cho 3 (906 = 3 × 302). Cùng số với F5, để thấy khác nhau giữa 9 và 3. | Tính từ F5 + F6 |
| D3 | 660: tận cùng 0 → chia hết cho 2 và 5; 6 + 6 + 0 = 12 → chia hết cho 3, không chia hết cho 9. | Tính từ F1, F3, F5, F6 (số 660 lấy ở F4) |

Kiểm tra số (đã chạy bằng code): 98 % 2 = 0 · 1995 % 2 = 1 · 4005 % 5 = 0 · 2021 % 5 = 1 · 906: tổng 15, % 9 = 6, % 3 = 0 · 3015: tổng 9, % 9 = 0 · 660: tổng 12, % 2 = % 5 = % 3 = 0, % 9 = 3.

## Kịch bản (9 cảnh)

Số luôn là **khối gỗ** (như các bài trước). Dấu ✓ (xanh lá) và ✗ (đỏ) vẽ bằng nét phấn, không dùng chữ. Chữ trên bảng chỉ: tiêu đề, dãy chữ số, phép cộng.

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Mở bài ~5 s | Tiêu đề phấn "Dấu hiệu chia hết". Bốn ô tròn phấn bật lên: 2, 5, 9, 3. Hai ô 2, 5 gạch chân vàng, hai ô 9, 3 gạch chân hồng (báo trước hai nhóm). | "Không cần làm phép chia, vẫn biết một số có chia hết cho 2, 5, 9 hay 3." |
| 2. Chia hết cho 2 ~11 s | Tiêu đề "chia hết cho 2". Hàng phấn vàng "0 2 4 6 8". Khối 9 8 bật lên; khối cuối "8" nhún, nhấc lên, khoanh vàng; mũi tên cong tới chữ 8 trong hàng → ✓, phấn "số chẵn". Khối 1 9 9 5: khối "5" nhấc lên, không có trong hàng → ✗, phấn "số lẻ". | "Chia hết cho 2: chỉ nhìn chữ số tận cùng. Tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2. 98 tận cùng là 8, chia hết cho 2, là số chẵn. 1995 tận cùng là 5, không chia hết cho 2, là số lẻ." |
| 3. Chia hết cho 5 ~8 s | Khăn lau xoá. Tiêu đề "chia hết cho 5". Hàng phấn "0 5". Khối 4005: "5" nhấc lên → ✓. Khối 2021: "1" nhấc lên → ✗. | "Chia hết cho 5: tận cùng là 0 hoặc 5. 4005 chia hết cho 5. 2021 tận cùng là 1, không chia hết cho 5." |
| 4. Cả 2 và 5 ~6 s | Hai hàng "0 2 4 6 8" và "0 5" xếp chồng; chữ 0 ở cả hai hàng cùng được khoanh vàng, mũi tên nối. Khối 660 với "0" cuối được khoanh → ✓ ✓. | "Vừa chia hết cho 2, vừa chia hết cho 5 thì tận cùng là 0, như số 660." |
| 5. Chia hết cho 9 ~12 s | Khăn lau. Tiêu đề "chia hết cho 9". Khối 9 0 6; ba khối bay cong xuống thành phép cộng phấn "9 + 0 + 6 = 15". 15 khoanh, so với 9 → ✗. Sau đó khối 3 0 1 5 → "3 + 0 + 1 + 5 = 9" → ✓. | "Chia hết cho 9 thì cộng các chữ số. 906: 9 cộng 0 cộng 6 bằng 15. 15 không chia hết cho 9, nên 906 không chia hết cho 9. 3015: tổng các chữ số là 9, nên 3015 chia hết cho 9." |
| 6. Chia hết cho 3 ~8 s | Tiêu đề lau đổi thành "chia hết cho 3" (chỉ lau dải tiêu đề). Dòng "9 + 0 + 6 = 15" vẫn trên bảng; ✗ cũ bị lau, 15 khoanh lại → ✓ xanh. | "Chia hết cho 3 cũng cộng các chữ số. Vẫn số 906, tổng là 15. 15 chia hết cho 3, nên 906 chia hết cho 3." |
| 7. Ghi nhớ ~6 s | Khăn lau. Khung hai cột: trái "2 · 5" + khối có chữ số cuối khoanh vàng ("tận cùng"); phải "9 · 3" + dấu "+" giữa các khối ("cộng các chữ số"). | "Nhớ nhé: 2 và 5 nhìn chữ số tận cùng. 9 và 3 cộng các chữ số." |
| 8. Thử sức ~6 s (có 2–3 s im lặng) | Khăn lau. Khối 6 6 0 ở giữa. Bên dưới bốn ô 2, 5, 9, 3 có ô trống "?". Ba chấm phấn vàng bật lần lượt. | "Thử nhé: 660 chia hết cho số nào?" |
| 9. Lời giải ~10 s | Khối "0" nhấc lên → ô 2 ✓, ô 5 ✓. Khối bay xuống "6 + 6 + 0 = 12" → ô 3 ✓, ô 9 ✗. | "Tận cùng là 0: chia hết cho 2 và 5. Tổng các chữ số là 12: chia hết cho 3, nhưng không chia hết cho 9." |

## Ghi chú tạo hình
- Chữ số tận cùng luôn là khối được "nhấc lên" (nhún, bay cong lên 40 px, khoanh vàng) – đây là động tác lặp lại để nhận ra nhóm 2/5.
- Nhóm 9/3: khối bay cong xuống thành phép cộng phấn – động tác thứ hai của bài.
- ✓ và ✗ vẽ bằng nét phấn (Pangolin không chắc có glyph), cỡ ≥ 70 px.
- Mọi bố cục nằm trong vùng an toàn TikTok (tránh y < 255, cột phải x > 880 từ y 1160, chú thích y > 1610).
