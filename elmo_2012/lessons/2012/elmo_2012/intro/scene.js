import { CHALK } from '../../../../shared/web/js/chalk.js';
import { THEME } from '../../../../shared/web/theme.js';
import { clamp01, easeInQuad, easeOutCubic, spring, stagger, pop } from '../../../../shared/web/js/ease.js';
import { g, dropPose, dust, hopY, hopSquash, burst, sparks } from '../../../../shared/web/js/fx.js';
import { tile, TILE_W, TILE_H, GAP } from '../../../../shared/web/js/tiles.js';

const WORDS = ['HỌC', 'CÙNG', 'PHƯỢNG'];
const PORTRAIT = new Image();
PORTRAIT.src = new URL('../phuong.jpg', import.meta.url).href;
PORTRAIT.alt = 'Phượng';
Object.assign(PORTRAIT.style, {
	position: 'absolute', top: '48px', right: '48px', width: '190px', height: '190px',
	objectFit: 'cover', border: `6px solid ${CHALK.white}`, boxSizing: 'border-box',
	boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
});
await PORTRAIT.decode();

const SYMBOLS = [
	['plus', CHALK.pink], ['divide', CHALK.blue], ['times', CHALK.green],
	['minus', CHALK.yellow], ['equal', CHALK.white], ['plus', CHALK.blue],
];
const SYMBOL_POSITIONS = [[200, 200], [1585, 380], [240, 860], [1690, 880], [960, 990], [110, 680]];

function sign(layer, symbol, x, y, radius, color, progress, seed) {
	const options = { color, width: 11, t: progress, seed };
	if (symbol === 'plus') {
		layer.line([x - radius, y], [x + radius, y], options);
		layer.line([x, y - radius], [x, y + radius], { ...options, seed: seed + 1 });
	} else if (symbol === 'minus') {
		layer.line([x - radius, y], [x + radius, y], options);
	} else if (symbol === 'times') {
		layer.line([x - radius * 0.8, y - radius * 0.8], [x + radius * 0.8, y + radius * 0.8], options);
		layer.line([x + radius * 0.8, y - radius * 0.8], [x - radius * 0.8, y + radius * 0.8], { ...options, seed: seed + 1 });
	} else if (symbol === 'divide') {
		layer.line([x - radius, y], [x + radius, y], options);
		layer.dot(x, y - radius * 0.62, 8, { color, t: progress });
		layer.dot(x, y + radius * 0.62, 8, { color, t: progress });
	} else {
		layer.line([x - radius, y - radius * 0.35], [x + radius, y - radius * 0.35], options);
		layer.line([x - radius, y + radius * 0.35], [x + radius, y + radius * 0.35], { ...options, seed: seed + 1 });
	}
}

function board(ctx, progress) {
	const layer = ctx.chalk(60);
	const idle = g(progress, 'idle');
	SYMBOLS.forEach(([symbol, color], index) => {
		const entrance = stagger(g(progress, 'signs'), index, SYMBOLS.length, 0.4);
		const scale = pop(entrance).scale;
		if (scale <= 0) return;
		const [x, y] = SYMBOL_POSITIONS[index];
		const bob = 14 * Math.sin(2 * Math.PI * (idle * 2 + index / SYMBOLS.length));
		sign(layer, symbol, x, y + bob, 58 * scale, color, clamp01(entrance * 2.2), 40 + index * 5);
	});

	const center = THEME.canvas.width / 2;
	const hello = g(progress, 'hello');
	const helloWidth = layer.text('Xin chào!', center, 215, {
		size: 108, color: CHALK.yellow, align: 'center',
		t: easeOutCubic(hello * 1.6), scale: spring(hello, 3.2, 6),
	});
	const greetingUnderline = easeOutCubic(g(progress, 'hu'));
	if (greetingUnderline > 0) {
		layer.poly([[center - helloWidth / 2, 249], [center - helloWidth / 6, 257],
			[center + helloWidth / 6, 243], [center + helloWidth / 2, 253]],
		{ color: CHALK.pink, width: 8, t: greetingUnderline, seed: 61, amp: 0.8 });
	}

	const scale = 1.02;
	const pitch = (TILE_W + GAP) * scale;
	const wordGap = 0.7 * pitch;
	const wordWidth = (word) => word.length * pitch - GAP * scale;
	const width = WORDS.reduce((sum, word) => sum + wordWidth(word), 0) + wordGap * 2;
	let position = center - width / 2;
	const rows = WORDS.map((word) => {
		const row = { word, x: position + TILE_W * scale / 2 };
		position += wordWidth(word) + wordGap;
		return row;
	});
	const objects = ctx.objects();
	const tileChalk = ctx.chalk(60);
	const count = WORDS.join('').length;
	let tileIndex = 0;
	rows.forEach(({ word, x }, wordIndex) => {
		[...word].forEach((letter, index) => {
			const entrance = stagger(g(progress, `w${wordIndex + 1}`), index, word.length, 0.5);
			const hop = clamp01(stagger(g(progress, 'wave'), tileIndex, count, 0.35));
			const pose = dropPose(entrance, 500, 110);
			tileIndex += 1;
			if (!pose) return;
			const tileX = x + index * pitch;
			const near = 1 + 0.45 * (1 - easeInQuad(clamp01(entrance / 0.55)));
			tile(objects, tileX, pose.y + hopY(hop, 52), letter, wordIndex === 2 ? 'dec' : 'int', {
				scale: scale * near, squash: pose.squash * hopSquash(hop),
			});
			dust(tileChalk, tileX, 500 + TILE_H * scale * 0.5, clamp01((entrance - 0.55) / 0.45),
				100 + wordIndex * 31 + index * 7, scale);
		});
	});

	const finishing = ctx.chalk(60);
	const underline = g(progress, 'under');
	if (underline > 0) {
		const x0 = rows[2].x - 20;
		const x1 = rows[2].x + 6 * pitch + 20;
		const y = 500 + TILE_H * scale * 0.5 + 38;
		const points = Array.from({ length: 41 }, (_, index) => {
			const fraction = index / 40;
			return [x0 + (x1 - x0) * fraction, y + 9 * Math.sin(fraction * Math.PI * 3)];
		});
		finishing.poly(points, { color: CHALK.yellow, width: 9, t: easeOutCubic(underline), seed: 77, amp: 0.8 });
		sparks(finishing, x1 + 40, 500, 14, 38, clamp01((underline - 0.3) / 0.5), { n: 6, seed: 300 });
		sparks(finishing, x0 - 40, 500, 14, 38, clamp01((underline - 0.45) / 0.5), { n: 6, seed: 320, color: CHALK.pink });
		burst(finishing, (x0 + x1) / 2, 500, 300, clamp01((underline - 0.1) / 0.9), { n: 12, seed: 340 });
	}
	const slogan = g(progress, 'slogan');
	finishing.text('Cùng học toán thật vui nhé!', center, 820, {
		size: 82, color: CHALK.white, align: 'center', t: easeOutCubic(slogan), scale: spring(slogan, 3.2, 6),
	});
	ctx.objects().append(PORTRAIT);
}

export const scenes = { main: board, clear() {} };
