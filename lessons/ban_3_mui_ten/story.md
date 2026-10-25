# Bắn 3 mũi tên: có bao nhiêu tổng điểm khác nhau? — dữ kiện + kịch bản

9:16 (TikTok), khoảng 51 s, bảng xanh + bia bắn cung và mũi tên vẽ bằng code. Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8 %). Không ghi số câu và không đưa nhãn "[4.3 points]" vào clip (theo yêu cầu).
Ý chính: **bắt đầu từ tổng nhỏ nhất, mỗi lần đưa 1 mũi tên vào vòng trong thì tổng thêm 2**: 3, 5, 7, 9, 11, 13, 15 → **7 tổng điểm khác nhau**.

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | Đề (tiếng Anh): "Gloria shot three arrows and they all hit the target below. How many different total scores could she have?" | Ảnh đề bài người dùng gửi |
| F2 | Bia có 3 vòng ghi điểm 5 (trong cùng), 3, 1 (ngoài cùng); bia đặt trên giá | Ảnh đề bài người dùng gửi |
| F3 | Đáp án mong đợi 7 | Ghi chú kèm yêu cầu (đã tự kiểm tra lại, D1) |
| D1 | Mọi tổng của 3 số trong {1, 3, 5}: 3, 5, 7, 9, 11, 13, 15 → 7 tổng | Tính; `totalsOf(3)` + `console.assert` trong scene.js |
| D2 | Bậc thang 1+1+1, 1+1+3, 1+3+3, 3+3+3, 3+3+5, 3+5+5, 5+5+5; mỗi bước thêm 2 | Tính từ F2; assert |
| D3 | Ví dụ 5 + 3 + 1 = 9; 1 + 1 + 5 = 7 trùng với 1 + 3 + 3 = 7 | Tính; assert |
| D4 | Thử thách 4 mũi tên: 4, 6, 8, …, 20 → 9 tổng | Tính; `totalsOf(4)` + assert |

Không tìm trang web đăng nguyên đề; mọi con số lấy từ ảnh đề + phép tính, kiểm tra lại bằng `console.assert` đầu scene.js.

## Kịch bản

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | 3 mũi tên bay vòng cung cắm vào bia (vòng trúng sáng lên). "3 mũi tên". "5 + 3 + 1 = 9" (số tô màu theo vòng). "? tổng điểm khác nhau". | "Gloria bắn 3 mũi tên, cả 3 đều trúng bia. Ví dụ: 5 cộng 3 cộng 1 bằng 9 điểm. Có thể được bao nhiêu tổng điểm khác nhau?" |
| 2. Nhỏ nhất | Khăn lau phần dưới. Cả 3 mũi tên nhảy ra vòng 1. "1 + 1 + 1 = 3". | "Thấp nhất: cả 3 mũi tên trúng vòng 1. 1 cộng 1 cộng 1 bằng 3." |
| 3. Bậc thang | Mỗi lần 1 mũi tên nhảy vào vòng trong, thêm 1 hàng và 1 mũi tên cong "+2": 5, 7, 9, 11, 13, 15. | "Đưa 1 mũi tên vào vòng trong: tổng thêm 2. Được 5. Rồi 7. 9. 11. 13. Cao nhất: 5 cộng 5 cộng 5 bằng 15." |
| 4. Trùng | Mũi tên về 1, 1, 5. "1 + 1 + 5 = 7", khoanh 2 số 7, "trùng!" đỏ. | "Còn 1 cộng 1 cộng 5 thì sao? Cũng bằng 7. Trùng rồi!" |
| 5. Đáp án | Khăn lau phần trên. Đánh số ①–⑦ cạnh 7 hàng; "7" to khoanh vàng, "tổng điểm khác nhau". | "Từ 3 đến 15, mỗi lần thêm 2. Có tất cả 7 tổng điểm khác nhau!" |
| 6. Thử thách | Khăn lau. "Đến lượt bạn!", bia + 4 mũi tên, "4 mũi tên", "? tổng", đồng hồ 3-2-1. | "Đến lượt bạn: nếu bắn 4 mũi tên thì có bao nhiêu tổng điểm? Bình luận nhé!" |
| 7. Đáp án thử thách | "4 6 8 10 12 14 16 18 20" hiện lần lượt, "9 tổng" khoanh vàng. | "Đáp án: từ 4 đến 20, mỗi lần thêm 2, có 9 tổng điểm!" |
