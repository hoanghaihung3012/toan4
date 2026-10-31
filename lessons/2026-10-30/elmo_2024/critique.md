# Critique: ELMO 2024 câu 41-50 (10 scene, khoảng 584 giây)

## Đã kiểm tra
- **Sync:** mọi scene báo 0 cửa sổ lệch quá 1 khung hình.
- **Khớp nối giữa scene:** mean 0.000 ở cả chín chỗ nối.
- **Key pose:** đã xem lại từng scene (khung đề, khung lời giải, khung đáp số); mọi `console.assert` của code đều qua.
- **Sau đề:** 5 giây suy nghĩ với ba chấm, rồi "Sau đây là cách giải."
- **Dữ kiện:** bảng nguồn trong story.md; số liệu trên bảng đều do code tính.

## Còn yếu (do người dùng quyết)
1. **Câu 45:** đáp án 15 do tự tính (đếm hợp các mảnh, một chương trình vét cạn cũng ra 15); cần đối chiếu số hình trong ảnh "Đáp án chi tiết".
2. **Câu 44, 48:** các hình là bản vẽ lại đơn giản hóa; số viên (câu 44) và kết quả xoay (câu 48) khớp đề và đáp án, vị trí từng nét chưa đối chiếu với ảnh gốc.
3. **Câu 48:** cách đọc mũi tên là "xoay 1/4 vòng theo chiều kim đồng hồ" (suy ra từ các lựa chọn: chỉ cách đọc này cho đúng một đáp án sai).
4. **Nhịp:** câu 41 dài nhất (104 giây) vì có hai nhóm số; câu 42 ngắn nhất (37 giây). Các cảnh 44-47 và 49 có phần lớn bảng đứng yên trong vài giây khi giọng đọc nối ý.
5. **Chữ trên bảng:** dòng đề ở cỡ 42-50, hơi nhỏ trên điện thoại; xem video trên TV hoặc máy tính thì đủ rõ.
6. **Đọc "A, B, C, D" trong câu 49, 50:** giọng Edge TTS đọc tên chữ cái, nghe ổn nhưng hơi máy.

## Sự cố khi dựng
Dịch vụ Edge TTS miễn phí đôi khi từ chối một dòng (câu 43 dòng có dấu hai chấm kiểu "…là hàng đầu: a cộng b…"); đã viết lại dòng đó, nội dung giữ nguyên. Các dòng khác chỉ cần chạy lại.
