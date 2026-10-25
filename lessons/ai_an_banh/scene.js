// Ai đã ăn chiếc bánh? Bốn bạn, chỉ 1 bạn nói thật. Facts: lessons/ai_an_banh/story.md.
// beatN(ctx, p): every key in p is a progress 0..1 from timing.json; a key that the
// beat's timing does not list defaults to 1, so beatN(ctx, {}) is the key pose.
import { CHALK, measure } from '../../shared/web/js/chalk.js';
import { THEME } from '../../shared/web/theme.js';
import { clamp01, stagger, pop } from '../../shared/web/js/ease.js';
import { row, flight } from '../../shared/web/js/parts.js';
import { g, burst, mark, hopY, thinkingDots, countdown, popLabel } from '../../shared/web/js/fx.js';
import { propSvg, cake, nameTag, stamp, impact } from './props.js';

// --- facts (story.md F1–F3), checked by trying every eater -----------------------------------
const KIDS = ['Alex', 'Ben', 'Cindy', 'Dan'];
const QUOTES = ['“Ben đã ăn bánh.”', '“Dan đã ăn bánh.”', '“Tớ không ăn bánh.”', '“Ben đang nói dối đấy.”'];
// what each kid says, as a test of "who ate" (Dan's sentence is: Ben's sentence is false)
const says = [
  (e) => e === 'Ben',
  (e) => e === 'Dan',
  (e) => e !== 'Cindy',
  (e) => !(e === 'Dan'),
];
const truths = (e) => says.map((f) => f(e));
const count = (e, v) => truths(e).filter((x) => x === v).length;
const ANSWER = KIDS.filter((e) => count(e, true) === 1);
console.assert(ANSWER.length === 1 && ANSWER[0] === 'Cindy', 'only 1 truth: Cindy ate (unique)');
console.assert(truths('Cindy').join() === 'false,false,false,true', 'Alex, Ben, Cindy lie; Dan tells the truth');
console.assert(KIDS.every((e) => truths(e)[1] !== truths(e)[3]), 'Ben and Dan always disagree: exactly one is true');
// practice problem (answer not shown): only 1 kid lies
const CH = KIDS.filter((e) => count(e, false) === 1);
console.assert(CH.length === 1 && CH[0] === 'Ben', 'challenge: only 1 lie -> Ben ate (not shown)');

// --- layout ----------------------------------------------------------------------------------
const T = THEME.layout.title;
const ROWS = [600, 785, 970, 1155];
const STAMP_X = 128, TAG_X = 335, QX = 452, QS = 58;
const RULE_Y = 435;
const CAKE0 = [905, 245], CAKE1 = [895, 1500];
const LINK_Y = 1310, ONE_Y = 1405, ANS_Y = 1545;
const qEnd = QUOTES.map((q) => QX + measure(q, QS));
console.assert(Math.max(...qEnd) < 1035, 'quotes stay inside the content box');

function heading(L, s, t, color = CHALK.white) {
  const w = L.text(s, T.x, T.y, { size: T.size, t, color });
  L.line([T.x, T.y + 22], [T.x + w, T.y + 22], { width: T.underlineWidth, t, seed: 5 });
}
// beat order of boards that continue without an eraser
function stateOf(order, beat, p) {
  const idx = order.indexOf(beat);
  return (b, k) => {
    const i = order.indexOf(b);
    if (i < idx) return 1;
    if (i > idx) return 0;
    return g(p, k);
  };
}
const rowKeys = ['rA', 'rB', 'rC', 'rD'];

// the four kids: tag pops in, then the quote is written
function kids(svg, L, prog, pulse = [0, 0, 0, 0]) {
  ROWS.forEach((y, i) => {
    const u = prog[i];
    const { scale, squash } = pop(clamp01(u * 2.2));
    nameTag(svg, TAG_X, y, KIDS[i], { scale, squash, dy: hopY(pulse[i], 22) });
    L.text(QUOTES[i], QX, y + 20, { size: QS, t: clamp01(u * 1.6 - 0.4) });
  });
}
function rule(L, t, word, color, seed) {
  return row(L, ['Chỉ', { s: '1', color: CHALK.yellow, size: 84 }, 'bạn nói', { s: word, color }], 540, RULE_Y, { size: 70, t, seed, gap: 0.28 });
}

// --- beats 1–4: one board --------------------------------------------------------------------
const ORDER = ['beat1', 'beat2', 'beat3', 'beat4'];

function mainBoard(ctx, beat, p) {
  const St = stateOf(ORDER, beat, p);
  const svg = propSvg(ctx.objects());
  const L = ctx.chalk(60);
  heading(L, 'Ai đã ăn bánh?', St('beat1', 'title'));
  const ruleX = rule(L, St('beat1', 'rule'), 'thật', CHALK.green, 10);
  kids(svg, L, rowKeys.map((k) => St('beat1', k)),
    [St('beat4', 'pA'), St('beat4', 'pB'), St('beat4', 'pC'), St('beat4', 'pD')]);
  thinkingDots(L, 540, 1200, St('beat1', 'dots'), { gap: 80, r: 16 });

  // beat 2: Ben and Dan disagree -> exactly one of them tells the truth
  const loopRow = (i, t, seed) => {
    const l = TAG_X - 98, r = qEnd[i] + 16;
    L.loop((l + r) / 2, ROWS[i] + 2, (r - l) / 2 + 12, 70, { color: CHALK.yellow, width: 6, t, seed });
  };
  loopRow(1, St('beat2', 'lb'), 20);
  loopRow(3, St('beat2', 'ld'), 21);
  // Dan's sentence is about Ben's: a two-headed bracket joins them (stamps cover it later)
  const vs = St('beat2', 'vs');
  const bx = 66, b0 = ROWS[1], b1 = ROWS[3];
  L.poly([[TAG_X - 112, b0], [bx, b0 + 26], [bx, b1 - 26], [TAG_X - 112, b1]], { color: CHALK.yellow, width: 8, t: vs, seed: 26, amp: 0.8 });
  const ht = clamp01(vs * 4 - 3);
  for (const [y, dir] of [[b0, 1], [b1, -1]]) {
    const p = [TAG_X - 112, y];
    const a = Math.atan2(-26 * dir, TAG_X - 112 - bx);
    [-1, 1].forEach((sg) => L.line(p, [p[0] - 28 * Math.cos(a + sg * 0.5), p[1] - 28 * Math.sin(a + sg * 0.5)], { color: CHALK.yellow, width: 8, t: ht, seed: 27 + sg }));
  }
  // "dối" in Dan's quote points at Ben: underline it
  const dX = QX + measure('“Ben đang nói ', QS), dW = measure('dối', QS);
  L.line([dX, ROWS[3] + 36], [dX + dW, ROWS[3] + 36], { color: CHALK.red, width: 7, t: St('beat2', 'neg'), seed: 22 });
  const bW = measure('“Ben', QS) - measure('“', QS), bX = QX + measure('“', QS);
  L.line([bX, ROWS[3] + 36], [bX + bW, ROWS[3] + 36], { color: CHALK.yellow, width: 7, t: St('beat2', 'neg'), seed: 23 });
  row(L, ['1 câu', { s: 'đúng,', color: CHALK.green }, '1 câu', { s: 'sai', color: CHALK.red }], 540, ONE_Y,
    { size: 64, t: St('beat2', 'one'), seed: 25, gap: 0.25 });
  row(L, [{ s: 'Ben', color: CHALK.yellow }, 'hoặc', { s: 'Dan', color: CHALK.yellow }, 'nói thật'], 540, LINK_Y,
    { size: 72, t: St('beat2', 'link'), seed: 30, gap: 0.3 });

  // beat 3: Alex and Cindy lie; Cindy's "không" is false -> Cindy ate
  const sA = St('beat3', 'sA'), sC = St('beat3', 'sC');
  // back to the rule: only 1 truth-teller, and it is Ben or Dan
  const back = St('beat3', 'back');
  L.line([ruleX[0] - 70, RULE_Y + 22], [ruleX[3] + 70, RULE_Y + 22], { color: CHALK.yellow, width: 7, t: back, seed: 35 });
  const kX = QX + measure('“Tớ ', QS), kW = measure('không', QS);
  const strike = St('beat3', 'strike');
  L.loop(kX + kW / 2, ROWS[2] + 2, kW / 2 + 22, 46, { color: CHALK.red, width: 7, t: clamp01(strike * 2), seed: 42 });
  L.line([kX - 8, ROWS[2] - 12], [kX + kW + 8, ROWS[2] - 4], { color: CHALK.red, width: 9, t: clamp01(strike * 2 - 1), seed: 40 });
  const fly = St('beat3', 'fly');
  const ans = St('beat3', 'ans');
  const ax = row(L, [{ s: 'Cindy', color: CHALK.yellow }, 'đã ăn bánh!'], 470, ANS_Y, { size: 80, t: ans, seed: 50, gap: 0.5 });
  L.loop(ax[0], ANS_Y - 26, 130, 66, { color: CHALK.yellow, width: 7, t: clamp01(ans * 2 - 1), seed: 51 });

  // beat 4: check, Ben lies and Dan tells the truth: exactly 1 truth
  const sB = St('beat4', 'sB'), sD = St('beat4', 'sD');
  const ok = St('beat4', 'ok');
  L.loop(ruleX[1], RULE_Y - 26, 50, 62, { color: CHALK.yellow, width: 7, t: ok, seed: 60 });
  mark(L, true, ruleX[3] + 140, RULE_Y - 24, ok, { size: 84, seed: 61 });

  // stamps and the cake go on top
  const top = propSvg(ctx.objects());
  const L2 = ctx.chalk(60);
  [[sA, 0, 'DỐI', CHALK.red], [sB, 1, 'DỐI', CHALK.red], [sC, 2, 'DỐI', CHALK.red], [sD, 3, 'THẬT', CHALK.green]].forEach(([u, i, w, c]) => {
    stamp(top, STAMP_X, ROWS[i], w, c, u);
    burst(L2, STAMP_X, ROWS[i], 70, impact(u), { color: CHALK.white, n: 8, seed: 70 + i });
  });
  const cp = pop(clamp01(St('beat1', 'cake')));
  if (fly <= 0) {
    cake(top, CAKE0[0], CAKE0[1], { scale: cp.scale * 0.8, squash: cp.squash });
  } else {
    const f = flight(CAKE0, CAKE1, fly, 260);
    const s = 0.8 + 0.2 * f.v;
    cake(top, f.x, f.y, { scale: s, squash: f.squash, rot: 14 * Math.sin(Math.PI * f.v) });
    burst(L2, CAKE1[0], CAKE1[1] + 40, 110, clamp01((fly - 0.85) / 0.15), { seed: 80 });
  }
}
const beat1 = (ctx, p) => mainBoard(ctx, 'beat1', p);
const beat2 = (ctx, p) => mainBoard(ctx, 'beat2', p);
const beat3 = (ctx, p) => mainBoard(ctx, 'beat3', p);
const beat4 = (ctx, p) => mainBoard(ctx, 'beat4', p);

// --- beat 5: the practice problem ------------------------------------------------------------
function beat5(ctx, p) {
  const svg = propSvg(ctx.objects());
  const L = ctx.chalk(60);
  heading(L, 'Đến lượt bạn!', g(p, 'title'), CHALK.yellow);
  rule(L, g(p, 'rule'), 'dối', CHALK.red, 90);
  const rows = g(p, 'rows');
  kids(svg, L, ROWS.map((_, i) => stagger(rows, i, 4, 0.55)));
  const cp = pop(clamp01(g(p, 'cake')));
  cake(svg, CAKE0[0], CAKE0[1], { scale: cp.scale * 0.8, squash: cp.squash });
  popLabel(L, 'Ai ăn bánh?', 540, LINK_Y - 10, g(p, 'ask'), { size: 80 });
  countdown(L, 540, 1440, g(p, 'count'), { size: 170 });
  row(L, ['Bình luận đáp án nhé!'], 540, 1590, { size: 72, t: g(p, 'cmt'), seed: 95 });
}

export const scenes = { beat1, beat2, beat3, beat4, beat5 };
