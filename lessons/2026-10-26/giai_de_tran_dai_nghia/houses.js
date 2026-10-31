export const boards = [
  {
    id: 'houses1',
    title: 'Số nhà hay chữ số?',
    subtitle: 'a) Số lẻ từ 1 đến 19',
    diagram: { type: 'houses', labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'] },
    steps: [
      {
        text: '1, 3, 5, 7, 9',
        speech: 'Số nhà lẻ bắt đầu từ một: một, ba, năm, bảy, chín; mỗi nhà tiếp theo tăng thêm hai.',
      },
      {
        text: '11, 13, 15, 17, 19',
        speech: 'Tiếp theo: mười một, mười ba, mười lăm, mười bảy, mười chín; câu a tính cả số mười chín.',
      },
      {
        text: 'Số 9: 1 chữ số',
        speech: 'Tiền tính theo từng chữ số, không phải số nhà; biển số chín chỉ cần có một chữ số.',
        anchor: 'chín',
      },
      {
        text: 'Số 19: 2 chữ số',
        speech: 'Biển mười chín cần hai chữ số: một và chín; phải đếm chữ số trước rồi mới tính tiền.',
        anchor: 'hai',
      },
    ],
  },
  {
    id: 'houses2',
    title: 'a) Tính tiền làm biển',
    subtitle: 'Mỗi chữ số: 45.000 đồng',
    diagram: { type: 'houses', labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'] },
    steps: [
      {
        text: '5 × 1 = 5 chữ số',
        speech: 'Nhóm từ một đến chín có năm nhà, mỗi biển một chữ số; cả nhóm cần năm chữ số.',
        anchor: 'Nhóm',
      },
      {
        text: '5 × 2 = 10 chữ số',
        speech: 'Từ mười một đến mười chín có năm nhà, mỗi biển hai chữ số, nên cần mười chữ số.',
      },
      {
        text: '5 + 10 = 15 chữ số',
        speech: 'Gộp hai nhóm, năm cộng mười bằng mười lăm chữ số; dùng số này để tính tiền làm biển.',
        anchor: 'Gộp',
      },
      {
        text: '15 × 45.000 = 675.000 đồng',
        speech: 'Lấy mười lăm nhân bốn mươi lăm nghìn đồng, được sáu trăm bảy mươi lăm nghìn đồng làm biển.',
        anchor: 'nhân',
      },
    ],
  },
  {
    id: 'houses3',
    title: 'b) Từ tiền ra chữ số',
    subtitle: 'Đã trả: 3.375.000 đồng',
    diagram: { type: 'houses', labels: ['1', '3', '5', '7', '9'] },
    steps: [
      {
        text: 'Tìm số chữ số đã làm',
        speech: 'Câu b trả ba triệu ba trăm bảy mươi lăm nghìn đồng; cần tìm số nhà được làm biển.',
      },
      {
        text: '3.375.000 : 45.000 = 75',
        speech: 'Tổng tiền chia bốn mươi lăm nghìn đồng, là giá mỗi chữ số, được bảy mươi lăm chữ số.',
        anchor: 'chia',
      },
      {
        text: '75 chữ số, chưa phải số nhà',
        speech: 'Chú ý, bảy mươi lăm là số chữ số, chưa phải số nhà, vì các biển dài khác nhau.',
        anchor: 'Chú',
      },
      {
        text: '1 đến 9: 5 nhà, 5 chữ số',
        speech: 'Năm nhà đầu là một, ba, năm, bảy, chín; dùng năm chữ số, phải tách riêng nhóm này ra.',
      },
    ],
  },
  {
    id: 'houses4',
    title: 'b) Đếm số nhà',
    subtitle: 'Tách nhóm biển một chữ số',
    diagram: { type: 'houses', labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'] },
    steps: [
      {
        text: '75 - 5 = 70 chữ số',
        speech: 'Trừ năm chữ số của nhóm đầu khỏi bảy mươi lăm, còn bảy mươi chữ số cho nhóm sau.',
        anchor: 'Trừ',
      },
      {
        text: '70 : 2 = 35 nhà',
        speech: 'Với biển hai chữ số, lấy bảy mươi chia hai, được ba mươi lăm nhà; lát nữa kiểm tra.',
        anchor: 'chia',
      },
      {
        text: '5 + 35 = 40 nhà',
        speech: 'Cộng năm nhà đầu với ba mươi lăm nhà sau, được bốn mươi nhà đã được làm biển số.',
        anchor: 'Cộng',
      },
      {
        text: '40 nhà, không phải 79 nhà',
        speech: 'Đáp số bốn mươi nhà; đừng nhầm số trên biển cuối với số lượng nhà trong dãy số lẻ.',
      },
    ],
  },
  {
    id: 'houses5',
    title: 'Kiểm tra đáp số',
    subtitle: '40 nhà; biển cuối mang số 79',
    diagram: { type: 'houses', labels: ['1', '3', '5', '77', '79'] },
    steps: [
      {
        text: '40 × 2 - 1 = 79',
        speech: 'Bốn mươi nhân hai trừ một bằng bảy mươi chín; biển cuối vẫn chỉ có đúng hai chữ số.',
        anchor: 'nhân',
      },
      {
        text: '5 + 35 × 2 = 75 chữ số',
        speech: 'Kiểm tra: năm chữ số đầu cộng ba mươi lăm nhân hai, được đúng bảy mươi lăm chữ số.',
        anchor: 'Kiểm',
      },
      {
        text: '75 × 45.000 = 3.375.000 đồng',
        speech: 'Nhân với giá mỗi chữ số, được ba triệu ba trăm bảy mươi lăm nghìn đồng, khớp tiền đề cho.',
      },
      {
        text: 'a) 675.000 đồng; b) 40 nhà',
        speech: 'Vậy câu a: sáu trăm bảy mươi lăm nghìn đồng; câu b: bốn mươi nhà, biển cuối bảy mươi chín.',
        anchor: 'Vậy',
      },
    ],
  },
];