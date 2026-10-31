export const boards = [
  {
    id: 'teams1',
    title: 'Đi ngược từ kết quả',
    subtitle: 'A chuyển 5 người sang B lần cuối',
    diagram: { type: 'teams', labels: ['A', 'B', '35', '40'] },
    steps: [
      {
        text: 'Cuối cùng: A có 35 người',
        speech: 'Cuối cùng đội A còn ba mươi lăm người. Ta đi ngược từng lần chuyển để tìm số người ban đầu.',
        anchor: 'ngược',
      },
      {
        text: 'Ngược: B trả A 5 người',
        speech: 'Lần cuối A chuyển năm người sang B. Muốn trở lại lúc trước, ta đưa năm người ấy về đội A.',
        anchor: 'về',
      },
      {
        text: '35 + 5 = 40 người',
        speech: 'Ba mươi lăm cộng năm bằng bốn mươi. Vậy ngay trước lần chuyển cuối, đội A có bốn mươi người.',
        anchor: 'cộng',
      },
    ],
  },
  {
    id: 'teams2',
    title: 'Nhận ba, thành bốn',
    subtitle: 'B chuyển gấp 3 số người A đang có',
    diagram: { type: 'teams', labels: ['A', 'B', '1 + 3', '40'], parts: 4 },
    steps: [
      {
        text: 'A đang có: 1 phần',
        speech: 'Xét lần chuyển thứ hai. Lấy số người đội A đang có trước khi nhận làm một phần bằng nhau.',
        anchor: 'phần',
      },
      {
        text: 'B chuyển A: 3 phần',
        speech: 'Đội B chuyển sang A số người gấp ba lần phần ấy. A giữ phần cũ và nhận thêm ba phần.',
        anchor: 'thêm',
      },
      {
        text: '1 + 3 = 4; 40 : 4 = 10',
        speech: 'Tổng là bốn phần, không phải ba. Bốn mươi chia bốn bằng mười người, nên không lấy bốn mươi chia ba.',
        anchor: 'bốn',
      },
    ],
  },
  {
    id: 'teams3',
    title: 'Khôi phục ba phần',
    subtitle: 'Lần đầu A chuyển đi một phần ba',
    diagram: { type: 'teams', labels: ['A', 'B', '10', '15'] },
    steps: [
      {
        text: 'Chuyển 1/3; A giữ 2/3',
        speech: 'Bây giờ xét lần đầu. A chuyển một phần ba số người sang B, nên A còn giữ hai phần ba.',
        anchor: 'giữ',
      },
      {
        text: '2 phần = 10 người',
        speech: 'Mười người vừa tìm được chính là số người A còn sau lần đầu, tương ứng với hai phần bằng nhau.',
        anchor: 'hai',
      },
      {
        text: '1 phần: 10 : 2 = 5 người',
        speech: 'Hai phần có mười người thì một phần có năm người. Ta lấy mười chia hai, không chia cho ba.',
        anchor: 'chia',
      },
      {
        text: 'Ban đầu: 5 × 3 = 15 người',
        speech: 'Ban đầu đội A có đủ ba phần. Năm nhân ba bằng mười lăm, vậy đội A có mười lăm người.',
        anchor: 'nhân',
      },
    ],
  },
  {
    id: 'teams4',
    title: 'Nối các bước ngược',
    subtitle: 'Theo dõi riêng số người của A',
    diagram: { type: 'teams', labels: ['35', '40', '10', '15'] },
    steps: [
      {
        text: '35 + 5 = 40',
        speech: 'Đọc lại chiều ngược: từ ba mươi lăm, cộng trả năm người để được bốn mươi người trước lần chuyển cuối.',
        anchor: 'ngược',
      },
      {
        text: '40 : 4 = 10',
        speech: 'Tiếp theo chia bốn vì A đã có một phần và nhận thêm ba phần. Ta trở về mười người.',
        anchor: 'bốn',
      },
      {
        text: '10 : 2 × 3 = 15',
        speech: 'Cuối cùng lấy mười chia hai rồi nhân ba để khôi phục ban đầu. Không cần biết tổng người đội B.',
        anchor: 'khôi',
      },
    ],
  },
  {
    id: 'teams5',
    title: 'Kiểm tra chiều xuôi',
    subtitle: 'A ban đầu có 15 người',
    diagram: { type: 'teams', labels: ['15', '10', '40', '35'] },
    steps: [
      {
        text: 'A sang B: 15 : 3 = 5',
        speech: 'Thử lại từ mười lăm người. Lần đầu A chuyển một phần ba, tức năm người, sang B và còn mười người.',
        anchor: 'đầu',
      },
      {
        text: 'B sang A: 10 × 3 = 30',
        speech: 'Lần hai, A đang có mười người. B chuyển sang A gấp ba số ấy, tức ba mươi người, không phải bốn mươi.',
        anchor: 'ba',
      },
      {
        text: 'A nhận: 10 + 30 = 40',
        speech: 'Mười người sẵn có cộng ba mươi người vừa nhận bằng bốn mươi người. Đây mới là số người của A.',
        anchor: 'cộng',
      },
      {
        text: '40 - 5 = 35; ban đầu A: 15',
        speech: 'Lần cuối A chuyển năm người sang B, còn ba mươi lăm, đúng đề bài. Đáp số ban đầu là mười lăm người.',
        anchor: 'đúng',
      },
    ],
  },
];