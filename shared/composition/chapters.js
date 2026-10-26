export function composeChapters(chapters, { scene = './scene.js', audio } = {}) {
  if (!Array.isArray(chapters) || chapters.length === 0) throw new Error('at least one chapter is required');
  const fps = chapters[0].timing.fps;
  if (!Number.isInteger(fps) || fps <= 0) throw new Error('chapter fps must be a positive integer');
  const scenes = {};
  const beats = [];
  const sections = [];
  const audioSegments = [];
  const ids = new Set();
  let frames = 0;
  for (const chapter of chapters) {
    const { id, timing, scenes: localScenes } = chapter;
    if (!/^[a-z][a-z0-9_]*$/.test(id) || ids.has(id)) throw new Error(`invalid or duplicate chapter id: ${id}`);
    ids.add(id);
    if (timing.fps !== fps) throw new Error(`${id}: all chapters must use the same fps`);
    if (!Number.isFinite(timing.duration) || timing.duration <= 0) throw new Error(`${id}: invalid duration`);
    if (!Array.isArray(timing.beats) || timing.beats.length === 0) throw new Error(`${id}: no beats`);
    const durationFrames = Math.round(timing.duration * fps);
    if (durationFrames < 1 || Math.abs(durationFrames / fps - timing.duration) > 0.001) {
      throw new Error(`${id}: duration must end on a frame boundary`);
    }
    const offset = frames / fps;
    const localIds = new Set(timing.beats.map((beat) => beat.id));
    if (localIds.size !== timing.beats.length) throw new Error(`${id}: duplicate beat ids`);
    let previousEnd = 0;
    for (const beat of timing.beats) {
      if (!Number.isFinite(beat.start) || !Number.isFinite(beat.end)
          || Math.abs(beat.start - previousEnd) > 0.001 || beat.end <= beat.start
          || beat.end > timing.duration + 0.001) throw new Error(`${id}: invalid beat range: ${beat.id}`);
      if (typeof localScenes[beat.id] !== 'function') throw new Error(`${id}: missing scene: ${beat.id}`);
      if (beat.prev && !localIds.has(beat.prev)) throw new Error(`${id}: unknown previous beat: ${beat.prev}`);
      const windows = {};
      for (const [key, window] of Object.entries(beat.windows || {})) {
        const [start, end, ...rest] = window;
        if (!Number.isFinite(start) || !Number.isFinite(end) || end < start
            || start < beat.start - 0.001 || end > beat.end + 0.001) {
          throw new Error(`${id}: invalid window: ${beat.id}.${key}`);
        }
        windows[key] = [start + offset, end + offset, ...rest];
      }
      const name = `${id}.${beat.id}`;
      scenes[name] = localScenes[beat.id];
      beats.push({ ...beat, id: name, start: beat.start + offset, end: beat.end + offset,
        ...(beat.prev ? { prev: `${id}.${beat.prev}` } : {}), windows });
      previousEnd = beat.end;
    }
    if (Math.abs(previousEnd - timing.duration) > 0.001) throw new Error(`${id}: beats must cover the chapter`);
    frames += durationFrames;
    sections.push({ id, start: offset, end: frames / fps });
    if (timing.audio) audioSegments.push({ id, source: timing.audio, start: offset, duration: durationFrames / fps });
  }
  if (audioSegments.length && !audio) throw new Error('narrated chapters require a combined audio URL');
  return {
    scenes,
    timing: { scene, fps, duration: frames / fps, draft: chapters.some((chapter) => chapter.timing.draft),
      ...(audio ? { audio } : {}), beats, sections },
    audioSegments,
  };
}