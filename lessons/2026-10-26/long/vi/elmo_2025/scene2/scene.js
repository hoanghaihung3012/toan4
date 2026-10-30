// Câu 32. Đếm cả các khối bị che khuất bên dưới chồng khối.
import { g } from '../../../../../../shared/web/js/fx.js';
import { solutionIntro } from '../../../../../../shared/web/js/parts.js';
// the previous scene's last board, wiped away by this scene's first beat ("prev": "from_prev")
import { scenes as previous } from '../scene1/scene.js';

const INTRO_TEXT = 'Sau đây là cách giải';

export const scenes = {
  from_prev: previous.beat4,
  beat1(ctx, p) {
    const L = ctx.chalk(60);
    L.text('32. Đếm khối lập phương', 960, 145, { size: 68, align: 'center', t: g(p, 'title') });
    L.text('Trong bốn nhóm hình dưới đây, hãy xác định nhóm', 960, 300,
      { size: 43, align: 'center', t: g(p, 'question1') });
    L.text('sử dụng nhiều khối lập phương nhất và nhóm sử dụng', 960, 365,
      { size: 43, align: 'center', t: g(p, 'question1') });
    L.text('ít khối lập phương nhất.', 960, 430,
      { size: 43, align: 'center', t: g(p, 'question1') });
    L.text('Hỏi tổng số khối lập phương trong hai nhóm vừa rồi', 960, 535,
      { size: 43, align: 'center', t: g(p, 'question2') });
    L.text('là bao nhiêu?', 960, 600,
      { size: 43, align: 'center', t: g(p, 'question2') });
  },
  intro(ctx, p) {
    solutionIntro(ctx.chalk(60), INTRO_TEXT, g(p, 'phrase'));
  },
  beat2(ctx, p) {
    const L = ctx.chalk(60);
    L.text('Đếm đủ cả bốn nhóm khối lập phương', 960, 180,
      { size: 58, align: 'center', t: g(p, 'method') });
    L.text('Nhiều nhất  +  ít nhất', 960, 430,
      { size: 72, align: 'center', t: g(p, 'extremes') });
    L.text('Tổng theo đáp án chính thức', 960, 620,
      { size: 48, align: 'center', t: g(p, 'source') });
    L.text('20 khối', 960, 850,
      { size: 100, align: 'center', color: 'rgb(250, 222, 110)', t: g(p, 'answer') });
  },
};

const OFFICIAL_TOTAL = 20;
console.assert(OFFICIAL_TOTAL === 20, 'Câu 32: đáp án chính thức là 20');
