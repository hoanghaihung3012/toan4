// Empty scene: only the board from web/theme.js. Copy this file to start a new lesson.
// Contract: beatN(ctx, p) where p[key] is progress 0..1 from timing.json; a key the beat's
// timing does not list defaults to 1, so beatN(ctx, {}) draws the key pose.
//   ctx.chalk(50|60|100) -> ChalkLayer (text, line, poly, rect, loop, arrow, dashed)
//   ctx.objects()        -> div for wooden tiles: tile(objs, x, y, ch, kind, {scale, squash})
//   ctx.fx               -> top layer (eraser)

function board(ctx, p) {} // eslint-disable-line no-unused-vars

export const scenes = { board };
