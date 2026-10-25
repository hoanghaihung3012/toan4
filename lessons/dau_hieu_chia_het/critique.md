# Dấu hiệu chia hết cho 2, 5, 9, 3. Gate 4: kiểm tra + nhận xét

Video: `out/dau_hieu_chia_het.mp4` (1080×1920, 30 fps). Timing: `lessons/dau_hieu_chia_het/timing.json` (dựng từ `lessons/dau_hieu_chia_het/voice.json`).

## Vòng 4. Kiểm tra dữ kiện (mọi chữ trên bảng và mọi câu đọc)

Nguồn: F1–F6, D1–D3 trong `story.md` (VietJack Toán 4 tr. 95–98). Số học đã `console.assert` trong `lessons/dau_hieu_chia_het/scene.js` (không có assert nào lỗi khi render).

| Trên bảng / lời đọc | Nguồn |
|---|---|
| "3015 có chia hết cho 9 không? Không cần đặt tính, có mẹo!" · bảng: 3015, "chia hết cho 9", "?" | câu hỏi; trả lời ở D1 |
| "Mẹo cho cả 2, 5, 9 và 3 luôn nè." · bảng: "Dấu hiệu chia hết", 2 5 9 3, "chữ số cuối", "cộng chữ số" | F1, F3, F5, F6 |
| "Chia hết cho 2? Nhìn chữ số cuối: 0, 2, 4, 6, 8 là được!" · "0 2 4 6 8" | F1 |
| "98, có, số chẵn!" · 98 ✓ "chẵn" | F1, F2 |
| "1995, không, số lẻ!" · 1995 ✗ "lẻ" | F1, F2 |
| "Chia hết cho 5? Chữ số cuối là 0 hoặc 5." · "0 5" | F3 |
| "4005, có!" / "2021, không!" | F3 |
| "Cả 2 và 5? Tận cùng là 0, như 660." · 660 ✓ | F4 |
| "Còn 9 thì cộng các chữ số." | F5 |
| "3015: 3 cộng 0 cộng 1 cộng 5 bằng 9. Chia hết cho 9!" · 3+0+1+5 = 9 ✓ | D1 (3015 = 9 × 335) |
| "Còn 906, tổng 15, không chia hết cho 9." · 9+0+6 = 15 ✗ | F5 |
| "Nhưng với 3 thì sao? 15 chia hết cho 3, nên 906 chia hết cho 3!" · 15 ✓ | F6, D2 (906 = 3 × 302) |
| "Đến lượt bạn: 660 chia hết cho những số nào? Bình luận đáp án nhé!" · 2 5 9 3 "?" , 3-2-1 | D3 |
| "Đáp án: tận cùng là 0, nên chia hết cho 2 và 5." · 2 ✓ 5 ✓ | F4, D3 |
| "Tổng các chữ số là 12: chia hết cho 3, không chia hết cho 9!" · 6+6+0 = 12, 3 ✓ 9 ✗ | F5, F6, D3 (660 = 3 × 220; 660 : 9 dư 3) |

Không có câu hay chữ nào ngoài bảng này. Không cắt gì.

## Vòng 1. Key pose
`capture.mjs --keyposes` trên timing có audio, `inspect.mjs diff` với bộ đã duyệt (`out/chiahet_kp`):
beat 1, 3, 4, 5, 8: mean 0. Beat 2, 6, 7, 9 khác **có chủ đích** (sửa sau vòng 2 và 6): chữ "chữ số cuối / cộng chữ số" to hơn (beat 2), "?" rồi ✓ cạnh 3015 (beat 6, 7), vòng khoanh 12 (beat 9). Bộ mới: `out/chiahet_kp_final`.

## Vòng 2. Đọc không tiếng (subagent mới, chỉ xem sheet 2 khung/giây)
Kể lại đúng cả 9 cảnh, đúng 4 dấu hiệu và đúng đáp án 660 (chia hết cho 2, 5, 3; không cho 9). **Kết luận: đọc được.** Điểm nó báo và cách xử lý:
- Câu móc 3015 không thấy được "trả lời" → **đã sửa**: "?" vàng hiện lại cạnh 3015 ở cảnh chia hết cho 9, co lại và thành ✓.
- Lúc đổi 9 → 3, dấu ✗ cạnh 15 còn nằm dưới tiêu đề "3" → **đã sửa**: lau ✗ trước, rồi mới lau và viết lại tiêu đề.
- Chữ "chữ số cuối / cộng chữ số" nhỏ → **đã sửa**: 72 → 84 px.
- Hàng "0 5" dễ tưởng là thêm vào hàng chẵn; vòng khoanh 0 chung hơi mảnh → **chưa sửa** (để bạn quyết).
- Đếm ngược + "?" đứng ~5 s → cố ý (thời gian để người xem nghĩ).
- Không có bảng tóm tắt cuối → chưa thêm (kịch bản bản 2 đã bỏ cảnh tóm tắt cho nhanh).

## Vòng 3. Đồng bộ
`synccheck.mjs`: 45 cửa sổ gắn với từ, 0 cửa sổ lệch quá 1 khung hình.

## Vòng 6. Nhận xét đạo diễn
Lượt 1 (xem sheet 2 khung/giây, thẳng thắn):
1. **Bảng đứng yên khi giọng đang nói** – beat 3 (~2 s "Nhìn chữ số cuối"), beat 4 (~2 s "Chữ số cuối là"), beat 5 (~2 s "Tận cùng là"), beat 6 (2 s "Còn 9 thì cộng"), sau đếm ngược (~1,5 s).
2. **Câu móc không được "đóng"**: 3015 quay lại nhưng không có khoảnh khắc "đây là đáp án câu hỏi đầu".
3. **Đổi 9 → 3 dễ đọc sai**: ✗ còn trên bảng khi tiêu đề đã là 3.
4. Khối 906 rơi từ cao, cắt ngang hàng phép cộng phía trên.
5. Ở lời giải, "12" không được nhấn – xa các ô 9 và 3.

Đã sửa: (1) neo lại các cửa sổ vào từ sớm hơn ("Nhìn", "Chữ", "Tận", "thì", "Đáp"); (2) "?" → ✓ cạnh 3015; (3) đổi thứ tự lau; thêm (4) rơi ngắn 170/220 px và (5) khoanh vàng số 12.

Lượt 2 (xem lại sheet mới): không còn chỗ nào bảng đứng yên > 2 s khi đang có giọng, trừ khoảng 40–42 s (~1,8 s: "Còn 9 thì cộng các chữ số" trong lúc 3015 vừa rơi xong).

## Vẫn còn yếu (bạn quyết)
- **Dài 72 s**, không phải ~50 s như kế hoạch: đọc số 4 chữ số tiếng Việt dài. Muốn ngắn hơn thì bỏ một ví dụ (vd. 2021 hoặc 906 ở cảnh 9).
- Hàng "0 5" xanh dương đặt dưới hàng "0 2 4 6 8" có thể bị hiểu là thêm vào hàng chẵn.
- Mũi tên từ khối 5 (4005) lên chữ 5 xanh dương rất ngắn.
- Lúc tách khối để cộng, khối mới đè lên khối gốc một thoáng.
- Không có nhạc nền (luật dự án: chỉ Edge TTS).
- Lời giải 660: các khối bay xuống phép cộng đi ngang qua chữ "chia hết cho" và các ô 2 5 9 3 (khoảng 68 s).
