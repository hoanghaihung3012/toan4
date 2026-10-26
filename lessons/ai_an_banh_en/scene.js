// English variant of lessons/ai_an_banh: the same scenes, facts and asserts, English board text
// and the source problem's English names. Voice and timing are this folder's own (voice.json -> timing.json, audio/).
import { scenes, TEXT, FIT } from '../ai_an_banh/scene.js';

Object.assign(TEXT, {
  title: 'Who ate the cake?',
  kids: ['Alex', 'Ben', 'Cindy', 'Dan'],
  quotes: ['“Ben ate the cake.”', '“Dan ate the cake.”', '“I didn’t eat it.”', '“Ben is lying.”'],
  liePre: '“Ben is ', lieWord: 'lying',
  notPre: '“I ', notWord: 'didn’t',
  ruleTruth: ['Only', 'tells the', 'truth'],
  ruleLie: ['Only', 'is', 'lying'],
  one: ['1 is', 'true,', '1 is', 'false'],
  link: ['or', 'tells the truth'],
  ans: 'ate the cake!',
  lie: 'LIE', truth: 'TRUE',
  yourTurn: 'Your turn!',
  ask: 'Who ate it?',
  comment: 'Comment your answer!',
});

// "Cindy ate the cake!" is longer than "Chi đã ăn bánh!": move it left and shrink it so it clears the landed cake
Object.assign(FIT, { ansX: 420, ansSize: 72, ansGap: 0.75 });

export { scenes };
