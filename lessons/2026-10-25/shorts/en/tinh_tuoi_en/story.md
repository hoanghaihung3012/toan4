# Age puzzles (bản tiếng Anh)

Bản tiếng Anh của bài `tinh_tuoi`: cùng câu chuyện, cùng cảnh, cùng dữ kiện; chỉ đổi lời đọc (Edge TTS `en-US-AvaNeural`, +12%) và chữ trên bảng.
Dữ kiện, nguồn và kịch bản gốc: `lessons/tinh_tuoi/story.md` (F1, F2, D1–D5; đề từ Google Sheet "Toán lớp 4 - AI"). Không thêm số liệu mới.
"Con" ở đề F1 không nói trai hay gái nên lời đọc nói "child"; đề F2 là "con gái" nên lời đọc nói "daughter". Trên bảng cả hai là "Kid".
MP4 cuối: `final/2026-10-25/age_puzzles.mp4`.

## Chữ trên bảng
| Tiếng Việt | English |
|---|---|
| Tính tuổi | Age puzzles |
| Nay: Bố + Con = 48 | Now: Dad + Kid = 48 |
| 4 năm trước: | 4 years ago: |
| Bố = 4 × Con | Dad = 4 × Kid |
| Nay bố = ? | Dad now = ? |
| Lùi về 4 năm trước | Go back 4 years |
| Tổng khi đó: | Total then: |
| 4 năm trước | 4 years ago |
| 5 phần / 2 phần | 5 parts / 2 parts |
| Con: / Bố: / Mẹ: | Kid: / Dad: / Mom: |
| Nay bố: | Dad now: |
| Thử: | Check: |
| Sau mấy năm? | How many years? |
| Mẹ: 35 tuổi / Con: 7 tuổi | Mom: 35 years / Kid: 7 years |
| Sau ? năm nữa: | In ? years: |
| Mẹ = 3 × Con | Mom = 3 × Kid |
| Mẹ hơn con bao nhiêu? | How much older is Mom? |
| Sau 1/2/3 năm | After 1 year / 2 years / 3 years |
| Hiệu không đổi! | Gap never changes! |
| Khi mẹ gấp 3 lần con | When Mom is 3 times Kid |
| 7 năm | 7 years |
| Nhớ 2 mẹo | Remember 2 tips |
| 1. Mỗi năm, ai cũng / thêm 1 tuổi | 1. Every year, everyone / is 1 year older |
| 2. Hiệu số tuổi / không bao giờ đổi | 2. The age gap / never changes |
| Thấy hay thì bình luận nhé! | Liked it? Leave a comment! |

Bố cục giữ nguyên bài tiếng Việt. Ba chỉnh nhỏ qua `FIT` (mặc định = giá trị tiếng Việt, diff key pose tiếng Việt 0.000): dòng "Now: Dad + Kid = 48" cỡ 112 (thay 128) và nhãn tên thanh gỗ ×0.8 để "Mom" không lọt vào vùng bị cắt ở mép trái; "Gap never changes!" cỡ 100; gạch chân "Remember 2 tips" dài hơn, "+1" dịch phải.

## Lời đọc
| Câu | English | Bản gốc |
|---|---|---|
| beat1 L1 | "Right now, a dad and his child's ages add up to 48." | "Hiện nay, tổng số tuổi của hai bố con là 48 tuổi." |
| beat1 L2 | "4 years ago, Dad was 4 times as old as the child." | "4 năm trước, tuổi bố gấp 4 lần tuổi con." |
| beat1 L3 | "How old is Dad now?" | "Hỏi hiện nay bố bao nhiêu tuổi?" |
| beat2 L4 | "4 years ago, Dad loses 4 years," | "4 năm trước, bố bớt 4 tuổi," |
| beat2 L5 | "and the child loses 4 too." | "con cũng bớt 4 tuổi." |
| beat2 L6 | "So the total then was 48 minus 4 minus 4, which makes 40." | "Vậy tổng tuổi khi đó là 48 trừ 4 trừ 4, bằng 40." |
| beat3 L7 | "4 years ago: the child is 1 part, Dad is 4 parts." | "Vẽ sơ đồ 4 năm trước: con 1 phần, bố 4 phần." |
| beat3 L8 | "That is 5 parts, which makes 40." | "Tổng là 5 phần, bằng 40 tuổi." |
| beat3 L9 | "One part is 40 divided by 5, which makes 8." | "Một phần là 40 chia 5, bằng 8." |
| beat3 L10 | "That was the child's age then." | "Đó là tuổi con khi ấy." |
| beat3 L11 | "Dad was 8 times 4, which makes 32." | "Bố khi ấy 8 nhân 4, bằng 32 tuổi." |
| beat3 L12 | "So now Dad is 32 plus 4, which makes 36!" | "Vậy hiện nay bố 32 cộng 4, bằng 36 tuổi!" |
| beat3 L31 | "Check: the child is now 12, and 36 plus 12 makes 48. Correct!" | "Thử lại: con nay 12 tuổi, 36 cộng 12 bằng 48. Đúng!" |
| beat4 L13 | "Now, Mom is 35 and her daughter is 7." | "Hiện nay mẹ 35 tuổi và con gái 7 tuổi." |
| beat4 L14 | "In how many years" | "Hỏi sau bao nhiêu năm nữa," |
| beat4 L15 | "will Mom be 3 times as old as her daughter?" | "thì tuổi mẹ sẽ gấp 3 lần tuổi con?" |
| beat5 L16 | "Mom is older by 35 minus 7, which makes 28." | "Mẹ hơn con 35 trừ 7, bằng 28 tuổi." |
| beat5 L17 | "Every year, Mom gets 1 year older, and so does her daughter." | "Mỗi năm, mẹ thêm 1 tuổi, con cũng thêm 1 tuổi." |
| beat5 L18 | "So Mom is still older by 28." | "Nên mẹ vẫn hơn con 28 tuổi." |
| beat5 L19 | "The age gap never changes!" | "Hiệu số tuổi không bao giờ đổi!" |
| beat6 L20 | "When Mom is 3 times her daughter's age:" | "Vẽ sơ đồ lúc mẹ gấp 3 lần con:" |
| beat6 L21 | "the daughter is 1 part, Mom is 3 parts." | "con 1 phần, mẹ 3 phần." |
| beat6 L22 | "Mom has 2 parts more: the gap of 28." | "Mẹ hơn con 2 phần, chính là 28 tuổi." |
| beat6 L23 | "One part is 28 divided by 2, which makes 14." | "Một phần là 28 chia 2, bằng 14." |
| beat6 L24 | "Then the daughter is 14." | "Lúc đó con 14 tuổi." |
| beat6 L25 | "So 14 minus 7 makes 7 years from now!" | "Vậy sau 14 trừ 7, bằng 7 năm nữa!" |
| beat6 L26 | "Check: Mom will be 35 plus 7, that is 42, exactly 3 times 14." | "Thử lại: mẹ 35 cộng 7, bằng 42 tuổi, đúng bằng 3 lần 14." |
| beat7 L27 | "Remember 2 tips!" | "Nhớ 2 mẹo nhé!" |
| beat7 L28 | "One: every year, everyone is 1 year older." | "Một: mỗi năm, ai cũng thêm 1 tuổi." |
| beat7 L29 | "Two: the age gap never changes." | "Hai: hiệu số tuổi không bao giờ đổi." |
| beat7 L30 | "If you liked it, leave a comment!" | "Thấy hay thì bình luận nhé!" |
