// Preview fit: scale the fixed-size stage (1080x1920 or 1920x1080) into the box it sits in, centred.
// The stage keeps its real size for drawing and only a transform shrinks it, so the box (#view, which
// the page layout sizes to the visible window minus the controls) is what the page is measured by.
// Phones: follows the URL bar showing/hiding, rotation and split screen, so the controls never fall
// off screen and the page never grows wider than the phone (which made mobile browsers zoom out).
export function fitStage(stage, box, width, height) {
  box ||= document.body; // a page written before #view existed
  const fit = () => {
    const { width: bw, height: bh } = box.getBoundingClientRect();
    if (!bw || !bh) return;
    const s = Math.min(bw / width, bh / height);
    stage.style.transform = `translate(${(bw - width * s) / 2}px, ${(bh - height * s) / 2}px) scale(${s})`;
  };
  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(box);
  addEventListener('resize', fit);
  addEventListener('orientationchange', () => setTimeout(fit, 250));
  window.visualViewport?.addEventListener('resize', fit);
  return fit;
}
