# Đặt gương ở đâu? (18 + 18): dữ kiện + kịch bản

9:16 (TikTok), 53,5 s, bảng xanh + chữ số 7 đoạn bằng gỗ vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8 %).
Ý chính: **mắt ở bên trái nên thấy phần bên trái gương + hình lật của nó**. Thử 4 chỗ: A → 181, B → 1881 (quá 1000, loại), C → 18 + 81 = 99, D → 18 + 181 + 81 = **280**. Lớn nhất mà không quá 1000 là 280 → **đặt gương ở D**.

## Nguồn: ảnh câu hỏi (cột "Câu hỏi hình" trong Google Sheet), chép lại
Ảnh: `source/question.png`. Chữ trong ảnh (tiếng Anh):
> "Where should you place the mirror to get the largest calculated number, not exceeding 1000. [4.3 points]"

Hình: phép tính "18+18" viết bằng chữ số 7 đoạn, một con mắt ở bên trái, 4 đường nét đứt: Ⓐ qua giữa số 8 thứ nhất, Ⓑ giữa "18" và "+", Ⓒ qua giữa dấu "+", Ⓓ qua giữa số 8 thứ hai.
Không tìm thấy trang web đăng đề này, nên mọi con số lấy từ ảnh và phép tính dưới đây. Số điểm "[4.3 points]" không đưa vào clip.

## Dữ kiện
| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Bảng hiện "18 + 18" (chữ số 7 đoạn), mắt ở bên trái | Ảnh đề |
| F2 | 4 chỗ đặt gương A, B, C, D (vị trí như trên) | Ảnh đề |
| F3 | Yêu cầu: kết quả phép tính lớn nhất, không quá 1000 | Ảnh đề |
| D1 | Số 1, số 8 và dấu + vẽ kiểu 7 đoạn đối xứng trái–phải, lật qua gương vẫn như cũ | Hình trong ảnh đề |
| D2 | Mắt bên trái nhìn vào gương: thấy phần bên trái đường gương + hình lật của phần đó (thứ tự đảo ngược) | Cách gương phẳng phản chiếu |
| D3 | A: còn "1" và nửa trái số 8 → nửa 8 + hình lật = số 8 đủ → **181** | D1, D2 |
| D4 | B: còn "18" → "18" + "81" = **1881** > 1000, loại | D1, D2, F3 |
| D5 | C: còn "18" và nửa dấu + → "18 + 81" = **99** | D1, D2 |
| D6 | D: còn "18 + 1" và nửa số 8 → "18 + 181 + 81" = 18 + 181 + 81 = **280** | D1, D2 |
| D7 | Các kết quả không quá 1000: 99 < 181 < 280 → lớn nhất 280 → **D** | D3–D6, F3 |

`console.assert` trong scene.js dựng lại chuỗi nhìn thấy cho từng chỗ (181, 1881, 18+81, 18+181+81), tính tổng (181, 1881, 99, 280), chọn D, và đếm thanh gỗ sau khi cắt + lật để chắc hình vẽ khớp đúng các chữ số đó.

## Hướng TikTok
- Móc câu 2 giây đầu: "18 + 18", con mắt, dấu "?" vàng to, "lớn nhất, không quá 1000".
- Đếm ngược 3-2-1 để người xem tự đoán trước.
- Mỗi chỗ đặt gương là một hàng: phần gỗ kem là phần thật, phần xanh bạc hà là hình trong gương, mở ra từ tấm gương.
- B bị gạch đỏ "> 1000"; cuối cùng so sánh "99 < 181 < 280", khoanh 280, tích ✓ ở D.

## Kịch bản
| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | "Đặt gương ở đâu?", 18 + 18 dựng từng thanh, con mắt, "?" vàng, "lớn nhất, không quá 1000", 4 đường A B C D; đếm ngược 3-2-1. | "Đặt gương ở đâu để kết quả lớn nhất, mà không quá 1000? Có 4 chỗ: A, B, C hay D? Đoán trước nhé!" |
| 2. Quy tắc + A | Đường nhìn từ mắt; tấm gương rơi vào A; hàng A: "1" + nửa 8 hiện ra, gương rơi, hình lật mở ra → 181; khoanh số 8; "= 181". | "Mắt nhìn từ bên trái, nên chỉ thấy phần bên trái gương, và hình lật của nó. Đặt ở A: nửa số 8 lật lại thành số 8. Ta được 181." |
| 3. B | Gương nhảy sang B; hàng B: 18 + 81 → 1881; khoanh "81"; "= 1881" đỏ, gạch, "> 1000". | "Đặt ở B: 18 lật thành 81. Ta được 1881. Lớn hơn 1000, loại!" |
| 4. C | Gương nhảy sang C; hàng C: 18 + 81; khoanh dấu +; "= 99". | "Đặt ở C: dấu cộng lật lại vẫn là dấu cộng. 18 cộng 81 bằng 99." |
| 5. D | Gương nhảy sang D; hàng D: 18 + 181 + 81 mở ra; "= 280". | "Đặt ở D: ta được 18 cộng 181 cộng 81. Bằng 280." |
| 6. Kết | "99 < 181 < 280"; "1000" nhún; khoanh "= 280"; khoanh D + ✓; gương lóe sáng. | "So sánh 181, 99 và 280. Lớn nhất mà không quá 1000 là 280. Vậy đặt gương ở D! Bạn đoán đúng không? Bình luận nhé!" |
