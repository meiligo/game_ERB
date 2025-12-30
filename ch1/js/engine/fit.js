export function fitAppToViewport({ baseW, baseH }) {
  const scale = Math.min(
    window.innerWidth / baseW,
    window.innerHeight / baseH,
    1
  );
  document.documentElement.style.setProperty("--app-scale", String(scale));
}
