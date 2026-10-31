export const problems = [
  {
    id: 'houses', title: 'Bài 1. Số nhà và chữ số',
    statement: [
      'Dãy nhà A có các số nhà lẻ liên tiếp, bắt đầu từ 1: 1; 3; 5; …',
      'Mỗi số nhà được làm riêng lẻ từng chữ số bằng kim loại.',
      'Chi phí làm mỗi chữ số kim loại là 45.000 đồng.',
    ],
    questions: [
      ['a) Tính chi phí làm các chữ số từ số nhà 1 đến số nhà 19.'],
      ['b) Tổng chi phí cả dãy là 3.375.000 đồng.', 'Dãy nhà A có tất cả bao nhiêu căn nhà?'],
    ],
  },
  {
    id: 'rooms', title: 'Bài 2. Thẻ phòng bị mất',
    statement: [
      'Có 5 phòng khách sạn và 5 thẻ phòng như hình trong đề.',
      'Mỗi chữ trên cửa phòng đại diện cho duy nhất một chữ số trên thẻ.',
      'Có một thẻ phòng bị mất số. Hãy tìm số bị mất trên thẻ phòng.',
    ],
    labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'], cards: ['345', '436', '???', '456', '646'],
  },
  {
    id: 'teams', title: 'Bài 3. Chuyển người giữa hai đội',
    statement: [
      'Đội A và đội B cùng tham gia một trò chơi tập thể.',
      'Trước khi bắt đầu, ban tổ chức cho phép hai đội đổi người với nhau.',
      'Lần thứ nhất: 1/3 số người đội A chuyển sang đội B.',
      'Lần thứ hai: B chuyển sang A gấp 3 lần số người A lúc này.',
      'Lần thứ ba: 5 người đội A chuyển sang đội B.',
    ],
    questions: [['Sau ba lần đổi, đội A có 35 người.', 'Hỏi lúc đầu đội A có bao nhiêu người?']],
  },
];