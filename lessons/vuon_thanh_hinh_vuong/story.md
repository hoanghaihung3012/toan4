# Mảnh vườn thành hình vuông: chu vi 120 m, tính diện tích — dữ kiện + kịch bản

9:16 (TikTok), 59,8 s, bảng xanh, khu vườn (cỏ + hàng rào gỗ) và thanh gỗ vẽ bằng code. Lời đọc Edge TTS (vi-VN-HoaiMyNeural, +8%).

## Source (verbatim, Google Sheet "Câu hỏi chữ")
> Một mảnh vườn hình chữ nhật có chu vi là 120m. Nếu người ta tăng chiều rộng thêm 10m và giảm chiều dài đi 10m thì mảnh vườn đó trở thành một hình vuông. Hãy tính diện tích của mảnh vườn hình chữ nhật ban đầu.

## Facts
| # | Fact | Source |
|---|---|---|
| F1 | Chu vi 120 m, hình chữ nhật | Source |
| F2 | Rộng + 10 m, dài − 10 m → hình vuông | Source |
| F3 | Question: diện tích ban đầu | Source |

## Derived (asserted in scene.js)
| # | Step | Value |
|---|---|---|
| D1 | dài + rộng = 120 : 2 | 60 m |
| D2 | dài − 10 = rộng + 10, so dài − rộng = 10 + 10 | 20 m |
| D3 | dài = (60 + 20) : 2; rộng = 60 − 40 | 40 m; 20 m |
| D4 | Diện tích 40 × 20 | 800 m² |
| D5 | Check: 40 − 10 = 30 = 20 + 10; 2 × (40 + 20) = 120 | ✓ |
| D6 | Practice: chu vi 100 m, same rule → 35 × 15 = 525 m² (answer not shown) | computed |

## Scenes
| Beat | Board (sound off) | Voice |
|---|---|---|
| 1 | Garden, "dài ?", "rộng ?", yellow loop (chu vi), "+10 m" / "−10 m" with dashed square "hình vuông", "Chu vi = 120 m", "Diện tích = ? m²", thinking dots | L1–L3 |
| 2 | Eraser; half fence flies into a bar dài + rộng; 120 : 2 = 60; brace "tổng 60 m" | L4–L5 |
| 3 | dài over rộng; 10 m cut off dài, 10 m added to rộng, equal; gap "20 m"; dài − rộng = 10 + 10 = 20 m | L6–L7 |
| 4 | dài = (60 + 20) : 2 = 40 m; rộng = 60 − 40 = 20 m | L8–L10 |
| 5 | Eraser; garden 40 m × 20 m; 40 × 20 = 800 m²; 40 − 10 = 30, 20 + 10 = 30 ✓ hình vuông | L11–L12 |
| 6 | Eraser; "Đến lượt bạn!", chu vi 100 m, same rule, 3-2-1, "Bình luận đáp án nhé!" | L13–L14 |
