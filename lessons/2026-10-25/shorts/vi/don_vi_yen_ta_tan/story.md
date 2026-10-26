# Yến, tạ, tấn (Toán 4): dữ kiện + kịch bản

9:16 (TikTok), bảng xanh + đồ vật vẽ bằng code (style đã duyệt). Lời đọc Edge TTS (vi-VN-HoaiMyNeural).
Bài khái niệm (không phải một bài toán đố): giới thiệu ba đơn vị đo khối lượng yến, tạ, tấn,
quan hệ với ki-lô-gam và giữa chúng với nhau, ví dụ thực tế và vài ví dụ đổi đơn vị.
Ý chính: **kg → yến → tạ → tấn, mỗi bậc gấp 10 lần.** Hình ảnh lặp lại: **cân đĩa thăng bằng**
(10 quả cân nhỏ một bên = 1 quả cân lớn bên kia).

## Dữ kiện và nguồn

| # | Dữ kiện | Nguồn |
|---|---|---|
| F1 | yến = 10 kg; tạ = 10 yến = 100 kg; tấn = 10 tạ = 1000 kg (cột "Giá trị hiện nay" / "Chuyển đổi hiện nay": "yến … 10 kg … 10 cân", "tạ … 100 kg … 10 yến", "tấn … 1000 kg … 10 tạ", "cân … 1 kg") | Wikipedia "Hệ đo lường cổ Việt Nam", mục Khối lượng: vi.wikipedia.org/wiki/Hệ_đo_lường_cổ_Việt_Nam |
| F2 | "Viết "2kg" hoặc "2 tạ" hoặc "2 tấn" vào chỗ chấm cho thích hợp": Con bò cân nặng 2 tạ; Con gà nặng 2kg; Con voi cân nặng 2 tấn | SGK Toán 4 (sách cũ) trang 23, bài "Yến, tạ, tấn", Bài 1; lời giải VietJack: vietjack.com/giai-toan-lop-4/yen-ta-tan.jsp |
| F3 | Bài 2 "Viết số thích hợp vào chỗ chấm": 5 yến = 50 kg; 3 tấn = 30 tạ; 2 tấn 85 kg = 2085 kg; 4 tạ 60 kg = 460 kg | SGK Toán 4 (sách cũ) trang 23, Bài 2; lời giải VietJack: vietjack.com/giai-toan-lop-4/bai-2-trang-23-sgk-toan-4.jsp (đề bài đọc nguyên văn; đáp án đọc qua bản tóm tắt của trang, nên đã tính lại bằng code từ F1) |
| D1 | Mỗi bậc kg → yến → tạ → tấn gấp 10 lần; đổi từ đơn vị lớn sang đơn vị bé liền sau thì nhân 10 | Từ F1 (assert) |
| D2 | 5 yến = 5 × 10 kg = 50 kg; 3 tấn = 3 × 10 tạ = 30 tạ; 2 tấn = 2000 kg, 2000 + 85 = 2085 kg | Từ F1, khớp F3 (assert) |
| D3 | Thử thách: 4 tạ 60 kg = 460 kg (4 × 100 + 60) — **không nói đáp án** trong clip | F3, tính lại từ F1 (assert) |

Không dùng ví dụ "bao gạo", "xe tải"… vì không có nguồn cho cân nặng cụ thể. Ví dụ thực tế duy nhất là gà / bò / voi của F2.

## Kịch bản (8 beat, ~65 s)

| Cảnh | Trên bảng (đọc được khi tắt tiếng) | Lời đọc |
|---|---|---|
| 1. Móc câu | Gà nhỏ, bò vừa, voi to bật lên lần lượt; dưới mỗi con một thẻ gỗ "2 ?". Phấn vàng trên cùng "Cùng nặng 2?" + 3 chấm suy nghĩ | "Con gà nặng 2, con bò nặng 2, con voi cũng nặng 2. Sao lại thế được?" |
| 2. Giải móc câu | "?" trên thẻ co lại, đơn vị bật vào: "2 kg", "2 tạ", "2 tấn" (theo nhịp đọc). Tiêu đề phấn dưới cùng "Yến · Tạ · Tấn" | "Vì đơn vị khác nhau: gà 2 ki-lô-gam, bò 2 tạ, voi 2 tấn. Cùng tìm hiểu yến, tạ, tấn nhé!" |
| 3. Yến | Khăn lau. Cân đĩa. 10 quả cân "kg" (kem) rơi lần lượt vào đĩa trái, đòn cân nghiêng dần; nhãn "10 kg". Quả cân "1 yến" (bạc hà) rơi vào đĩa phải, cân bật về thăng bằng, dấu "=" giữa. Phấn "1 yến = 10 kg" | "10 quả cân 1 ki-lô-gam ở bên này. Bên kia là 1 yến. Cân thăng bằng! Vậy 1 yến bằng 10 ki-lô-gam." |
| 4. Tạ | Khăn lau. Cùng cân. 10 quả cân "yến" (bạc hà) vào đĩa trái, "1 tạ" (xanh dương) vào đĩa phải → thăng bằng. "1 tạ = 10 yến", "= 100 kg" | "Giờ là 10 yến. Bên kia, 1 tạ. Thăng bằng! 1 tạ bằng 10 yến, tức là 100 ki-lô-gam." |
| 5. Tấn | Khăn lau. 10 quả cân "tạ" (xanh) vào đĩa trái, "1 tấn" (hồng) vào đĩa phải → thăng bằng. "1 tấn = 10 tạ", "= 1000 kg" | "10 tạ thì sao? Đúng bằng 1 tấn! 1 tấn bằng 10 tạ, tức là 1000 ki-lô-gam." |
| 6. Bậc thang | Khăn lau. Bốn quả cân to dần trên bậc thang: kg, yến, tạ, tấn; cung phấn "×10" nhảy qua từng bậc | "Ki-lô-gam, yến, tạ, tấn: mỗi bậc gấp 10 lần. Đổi từ lớn sang bé, mỗi bậc nhân 10." |
| 7. Đổi đơn vị | Khăn lau. Ba dòng, mỗi dòng "? " rồi đáp án bật vào + ✓: "5 yến = 50 kg", "3 tấn = 30 tạ", "2 tấn 85 kg = 2085 kg" (có dòng nhỏ "2000 + 85") | "5 yến bằng bao nhiêu ki-lô-gam? 5 nhân 10, bằng 50 ki-lô-gam. 3 tấn bằng mấy tạ? 30 tạ. Còn 2 tấn 85 ki-lô-gam? 2 tấn là 2000 ki-lô-gam, thêm 85, được 2085 ki-lô-gam." |
| 8. Thử thách | Khăn lau. "Đến lượt bạn!", "4 tạ 60 kg = ? kg", "Bình luận đáp án nhé!", đếm ngược 3-2-1 | "Đến lượt bạn: 4 tạ 60 ki-lô-gam bằng bao nhiêu ki-lô-gam? Bình luận đáp án nhé!" |

## Ghi chú tạo hình
- Màu quả cân cố định cho cả bài: kg = kem, yến = bạc hà, tạ = xanh dương, tấn = hồng. Quả cân nhỏ trong đĩa trái mang màu của đơn vị nhỏ (đã thấy ở cảnh trước), không cần chữ nhỏ.
- Cân đĩa: đòn cân nghiêng theo lò xo (spring) khi mỗi quả cân rơi xuống, bật về ngang khi quả cân lớn đặt vào bên kia (vượt quá một chút rồi dừng).
- Chữ trên quả cân ≥ 60 px; chữ phấn ≥ 84 px. Mọi bố cục trong vùng an toàn TikTok.
