const CANVASES = {
  portrait: { width: 1080, height: 1920, fps: 30 },
  landscape: { width: 1920, height: 1080, fps: 30 },
};

export function canvasFor(profile = 'portrait') {
  if (!Object.hasOwn(CANVASES, profile)) throw new Error(`unknown canvas profile: ${profile}`);
  return { ...CANVASES[profile] };
}