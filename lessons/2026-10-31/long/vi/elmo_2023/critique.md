# Critique: ELMO 2023 câu 41-50 (10 scene)

## Đã kiểm tra
- **Sync:** mọi scene báo 0 cửa sổ lệch quá 1 khung hình và 0 cửa sổ bắt đầu trước khi xóa xong.
- **Khớp nối giữa scene:** mean 0.000 ở cả chín chỗ nối.
- **Key pose:** đã xem lại đề, lời giải từng bước và đáp số của mọi scene; mọi `console.assert` qua (một lần assert của câu 49 báo sai đã được sửa: gương ở D thấy 18 + 181 + 81 = 280, không phải 199).
- **Sau đề:** 5 giây suy nghĩ với ba chấm, rồi "Sau đây là cách giải."
- **Mở đầu/kết thúc:** chỉ giới thiệu đề ELMO 2023; kết ngay sau đáp án câu 50, không giới thiệu kênh hay cảm ơn.
- **Đọc không tiếng:** câu 41 có người đọc độc lập kể lại đúng; câu 42-50 tự xem lại bảng key pose và contact sheet (người đọc độc lập không trả về kết quả nên chưa có kết luận độc lập).
- **Dữ kiện:** bảng nguồn trong story.md; số liệu trên bảng do code tính.

## Còn yếu (do người dùng quyết)
1. Đáp số 41-47 và 49-50 đã đối chiếu với ảnh đáp án "Sol" của đề: khớp cả kết quả và cách giải. Câu 48 (B) không có trong "Sol" nên chỉ là tự tính từ quy luật.
2. Câu 49: đáp án D phụ thuộc cách hiểu "gương che phần bên phải và phản chiếu phần bên trái" (suy ra từ hình; B ra 1881 vượt 1000 nên bị loại).
3. Câu 44: quy luật "A ở chính giữa B và C" suy ra từ 4 hàng của đề; khớp cả hàng Có và hàng Không.
4. Hình vẽ lại: hai cân (câu 42), vết mực (câu 43), ngôi sao (câu 46), các hình 3 × 3 (câu 48), chữ số 7 đoạn (câu 49), bia (câu 50); số lượng và vị trí chính đã đối chiếu với ảnh đề.
5. Nhịp: câu 44, 45, 48 dài nhất (70-76 giây); bảng đứng yên vài giây ở đầu các beat lời giải khi giọng đọc nối ý.
6. Giọng Edge TTS đọc tên chữ cái A, B, C, a, b, c hơi máy.
