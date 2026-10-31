const segmenter = new Intl.Segmenter('vi', { granularity: 'grapheme' });

export function writtenText(text, progress) {
  const letters = Array.from(segmenter.segment(text), ({ segment }) => segment);
  const visible = Math.ceil(Math.max(0, Math.min(1, progress)) * letters.length);
  return letters.slice(0, visible).join('');
}