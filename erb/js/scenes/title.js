// js/scenes/title.js
import { showOverlay, hideOverlay } from "../dom.js";

export class TITLE {
  constructor(sm) {
    this.sm = sm;
  }

  async enter() {
    // 🔥 기본 UI 전부 숨김
    const nextBtn = document.getElementById("nextBtn");
    const sidePanel = document.getElementById("sidePanel");
    const dialogue = document.getElementById("dialogue");

    if (nextBtn) nextBtn.style.display = "none";
    if (sidePanel) sidePanel.style.display = "none";
    if (dialogue) dialogue.style.display = "none";

    showOverlay(`
      <div class="title-screen">
        <div class="title-panel">
          <h1 class="title-logo">감정 연구소</h1>

          <div class="title-menu">
            <button id="btnStart">게임 시작</button>
            <button disabled>이어하기</button>
            <button disabled>설정</button>
          </div>

          <div class="title-footer">PROJECT : ERB</div>
        </div>
      </div>
    `);

    document.getElementById("btnStart").onclick = () => {
      hideOverlay();
      this.sm.goto("P0");
    };
  }

  exit() {
    hideOverlay();

    // 🔥 다음 씬을 위해 다시 복구
    const nextBtn = document.getElementById("nextBtn");
    const sidePanel = document.getElementById("sidePanel");
    const dialogue = document.getElementById("dialogue");

    if (nextBtn) nextBtn.style.display = "";
    if (sidePanel) sidePanel.style.display = "";
    if (dialogue) dialogue.style.display = "";
  }
}
