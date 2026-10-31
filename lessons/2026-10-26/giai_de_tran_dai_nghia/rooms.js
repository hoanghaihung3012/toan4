export const boards = [
  {
    id: 'rooms1',
    title: 'Năm nhãn, một thẻ thiếu',
    subtitle: 'Các thẻ chưa được ghép với nhãn',
    diagram: {
      type: 'rooms',
      labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'],
    },
    steps: [
      {
        text: 'SHS · HCS · CTS · HTS · THC',
        speech: 'Ta có năm nhãn như trên bảng. Mỗi chữ luôn thay cho cùng một chữ số, dù xuất hiện ở nhãn nào.',
      },
      {
        text: '345 · 436 · ??? · 456 · 646',
        speech: 'Các thẻ đã biết là ba trăm bốn mươi lăm, bốn trăm ba mươi sáu, bốn trăm năm mươi sáu, sáu trăm bốn mươi sáu.',
      },
      {
        text: 'Thẻ rời, chưa ghép nhãn',
        speech: 'Còn một thẻ chưa biết số. Các thẻ đang để rời, chưa ghép với nhãn; ta cần tìm thẻ thiếu và kiểm tra cách ghép.',
      },
    ],
  },
  {
    id: 'rooms2',
    title: 'Bốn chữ, bốn chữ số',
    subtitle: 'Khác nhau là điều suy ra',
    diagram: {
      type: 'rooms',
      labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'],
    },
    steps: [
      {
        text: 'Các thẻ có đủ 3, 4, 5, 6',
        speech: 'Trong các thẻ đã biết, ta thấy đủ bốn chữ số: ba, bốn, năm, sáu. Chúng đều phải do bốn chữ trên nhãn tạo ra.',
      },
      {
        text: 'Bốn chữ phải khác chữ số',
        speech: 'Chỉ có bốn chữ mà phải cung cấp đủ bốn chữ số ấy, nên mỗi chữ nhận một chữ số khác nhau, không thể trùng.',
      },
      {
        text: 'Chỉ SHS có chữ lặp',
        speech: 'Bây giờ chú ý chữ lặp ở nhãn đầu: chữ đầu và chữ cuối giống nhau. Bốn nhãn còn lại đều gồm ba chữ khác nhau.',
        anchor: 'lặp',
      },
    ],
  },
  {
    id: 'rooms3',
    title: 'Ghép thẻ có chữ số lặp',
    subtitle: 'SHS = 646',
    diagram: {
      type: 'rooms',
      labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'],
    },
    steps: [
      {
        text: '646 chỉ có thể là SHS',
        speech: 'Thẻ sáu trăm bốn mươi sáu có hai chữ số sáu lặp lại. Nó chỉ có thể ghép với nhãn có chữ đầu trùng chữ cuối.',
        anchor: 'lặp',
      },
      {
        text: 'S = 6; H = 4',
        speech: 'Vậy nhãn đầu mang số sáu trăm bốn mươi sáu. Chữ đầu và cuối nhận số sáu, còn chữ ở giữa nhận số bốn.',
      },
      {
        text: 'C và T nhận 3 và 5',
        speech: 'Ta đã dùng số sáu và số bốn. Hai chữ còn lại phải nhận số ba và số năm; cần xác định đúng thứ tự.',
      },
    ],
  },
  {
    id: 'rooms4',
    title: 'Tìm nhãn tận cùng năm',
    subtitle: 'THC = 345; T = 3; C = 5',
    diagram: {
      type: 'rooms',
      labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'],
    },
    steps: [
      {
        text: 'Bốn nhãn đầu tận cùng S = 6',
        speech: 'Bốn nhãn đầu đều kết thúc bằng cùng một chữ, đã biết là sáu. Vì vậy, cả bốn số ấy đều tận cùng bằng sáu.',
      },
      {
        text: 'Chỉ THC có thể tận cùng 5',
        speech: 'Thẻ ba trăm bốn mươi lăm tận cùng bằng năm, nên chỉ ghép được với nhãn cuối. Không nhãn nào khác có thể nhận thẻ này.',
        anchor: 'tận',
      },
      {
        text: 'THC = 345 ⇒ T = 3; C = 5',
        speech: 'Đọc nhãn cuối theo thứ tự chữ và số: chữ đầu nhận ba, chữ giữa nhận bốn, chữ cuối nhận năm. Vậy đủ cả bốn chữ.',
      },
    ],
  },
  {
    id: 'rooms5',
    title: 'Thẻ thiếu là 536',
    subtitle: 'Thay số và kiểm tra đủ năm nhãn',
    diagram: {
      type: 'rooms',
      labels: ['SHS', 'HCS', 'CTS', 'HTS', 'THC'],
      values: ['646', '456', '536', '436', '345'],
    },
    steps: [
      {
        text: 'CTS = 536',
        speech: 'Thay lần lượt năm, ba, sáu vào nhãn thứ ba, ta được năm trăm ba mươi sáu. Đây chính là thẻ thiếu cần tìm.',
        anchor: 'thiếu',
      },
      {
        text: 'SHS = 646; HCS = 456',
        speech: 'Kiểm tra lại: nhãn đầu là sáu trăm bốn mươi sáu; nhãn thứ hai là bốn trăm năm mươi sáu, đều đúng với các thẻ.',
      },
      {
        text: 'HTS = 436; THC = 345',
        speech: 'Nhãn thứ tư là bốn trăm ba mươi sáu, nhãn cuối là ba trăm bốn mươi lăm. Mỗi chữ đã được xác định, nên lời giải duy nhất.',
      },
    ],
  },
];