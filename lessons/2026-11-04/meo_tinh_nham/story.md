# Top 4 mẹo tính nhẩm siêu tốc (lớp 4)

Style v2 (thử nghiệm): hook trong 3 s đầu, mỗi mẹo một ví dụ ngắn, đề chỉ một dòng, kết bằng câu hỏi không đáp án. Giọng đọc: Vbee (`hn_female_ngochuyen_full_48k-fhg`, tốc độ 1.1). Không có tên người; không có đề dài nên không cần câu "Sau đây là cách giải".

## Facts and sources
| # | Fact | Source |
|---|---|---|
| F1 | Nhân với 11 (số có hai chữ số, tổng hai chữ số < 10): tách hai chữ số, viết tổng vào giữa. 43 × 11 = 4 \| 4+3 \| 3 = 473 | 43 × 11 = 43 × 10 + 43 = 430 + 43 = 473 |
| F2 | Số tận cùng là 5 nhân với chính nó: (chữ số hàng chục × số liền sau) rồi viết 25. 35 × 35: 3 × 4 = 12 → 1225 | (10a + 5)² = 100a(a+1) + 25; 35 × 35 = 1225 |
| F3 | Nhân với 9 = nhân 10 rồi trừ đi số đó. 24 × 9 = 240 − 24 = 216 | 9 = 10 − 1; 24 × 9 = 216 |
| F4 | Chia cho 5 = nhân 2 rồi chia 10. 85 : 5 = 170 : 10 = 17 | 2 : 10 = 1 : 5; 85 : 5 = 17 |
| F5 | Câu hỏi cuối: 52 × 11 (đáp án 572 chỉ có trong code assert, không hiện) | F1 |

Mọi phép tính được `console.assert` ở đầu `scene.js`.

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 hook | "4 mẹo tính nhẩm", "43 × 11" thật to, đồng hồ bấm giờ, kim chạy một vòng, "2 giây" | "43 nhân 11. Bạn tính mất bao lâu? Mình chỉ cần 2 giây!" |
| 2 | Mẹo 1/4: ô 4 _ 3, 4+3=7, số 7 nhảy vào giữa, 43 × 11 = 473 | mẹo nhân 11 |
| 3 | Mẹo 2/4: 35 × 35, 3 × 4 = 12, khối 12 + khối 25, = 1225 | mẹo số tận cùng 5 |
| 4 | Mẹo 3/4: 24 × 9, 9 = 10 − 1, 24 × 10 = 240, 240 − 24 = 216 | mẹo nhân 9 |
| 5 | Mẹo 4/4: 85 : 5, 85 × 2 = 170, 170 : 10 = 17 | mẹo chia 5 |
| 6 | "Đến lượt bạn!", 52 × 11 = ?, đếm 3-2-1, "Bình luận đáp án nhé!" (không đáp án) | "Còn 52 nhân 11 thì sao? Bạn tính mất mấy giây? Bình luận đáp án nhé!" |
