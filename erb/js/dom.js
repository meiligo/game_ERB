export const els = {
  app: () => document.getElementById("app"),
  overlay: () => document.getElementById("overlay"),
  speaker: () => document.getElementById("speaker"),
  text: () => document.getElementById("text"),
  nextBtn: () => document.getElementById("nextBtn"),
  skipBtn: () => document.getElementById("skipBtn"),
  objects: () => document.getElementById("objects"),
};

/* =========================
   기본 텍스트
========================= */
export function showText(s, t) {
  if (els.speaker()) els.speaker().textContent = s || "";
  if (els.text()) els.text().textContent = t || "";
}

/* =========================
   Overlay
========================= */
export function showOverlay(html) {
  const o = els.overlay();
  if (!o) return;
  o.innerHTML = html;
  o.classList.add("active");
}

export function hideOverlay() {
  const o = els.overlay();
  if (!o) return;
  o.classList.remove("active");
  o.innerHTML = "";
}

/* =========================
   UI 제어
========================= */
export function clearObjects() {
  const objects = els.objects();
  if (objects) objects.innerHTML = "";
}

export function setNextText(label) {
  const btn = els.nextBtn();
  if (btn) btn.textContent = label;
}

export function setSkipVisible(visible) {
  const btn = els.skipBtn();
  if (!btn) return;
  btn.style.display = visible ? "inline-flex" : "none";
}

/* =========================
   ⏱️ 대기 함수 (🔥 핵심)
========================= */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
