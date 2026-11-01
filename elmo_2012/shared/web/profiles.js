const CANVASES = {
  landscape: { width: 1920, height: 1080, fps: 30 },
};

export function canvasFor(profile = 'landscape') {
  if (!Object.hasOwn(CANVASES, profile)) throw new Error(`unknown canvas profile: ${profile}`);
  return { ...CANVASES[profile] };
}