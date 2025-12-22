import { showText } from "../dom.js";

export class P5 {
  constructor(sm) {
    this.sm = sm;
  }

  enter() {
    const overlay = document.getElementById("overlay");

    const spawnPopup = () => {
      overlay.insertAdjacentHTML("beforeend", `
        <div class="p5-wrap">
          <div class="p5-popup">
            <div class="p5-title">[팝업]</div>
            <div class="p5-desc">
              해당 기록은<br />
              열람을 중단할 수 있습니다.
            </div>
            <div class="p5-buttons">
              <button id="p5-close">닫는다</button>
              <button id="p5-continue">계속 읽는다</button>
            </div>
          </div>
        </div>
      `);

      const popup = document.querySelector(".p5-wrap");
      const btnClose = document.getElementById("p5-close");
      const btnContinue = document.getElementById("p5-continue");

      showText("시스템", "선택을 기다리는 중…");

      /* ❌ 닫는다 → 다시 열린다 */
      btnClose.onclick = () => {
        showText("시스템", "열람을 종료합니다…");
        popup.classList.add("fade-out");

        setTimeout(() => {
          popup.remove();

          showText("시스템", "기록이 다시 열립니다.");

          // ⭕ 같은 씬에서 팝업만 다시 생성
          setTimeout(() => {
            spawnPopup();
          }, 800);

        }, 1200);
      };

            /* ⭕ 계속 읽는다 → P6 */
      btnContinue.onclick = () => {
        showText("시스템", "열람을 계속합니다.");

        const popup = document.querySelector(".p5-wrap");
        popup.classList.add("fade-out");

        setTimeout(() => {
          popup.remove();

          /* =========================
            🔥 여기서 게임 화면 초기화
          ========================= */

          // 1. overlay 완전 정리
          const overlay = document.getElementById("overlay");
          overlay.innerHTML = "";
          overlay.classList.remove("active");

          // 2. stage 정리
          const stage = document.getElementById("stage");
          stage.innerHTML = "";
          stage.style.background = "#000";

          // 3. dialogue는 유지 (내레이션 흐름 때문에)
          // clearObjects()는 P6에서 처리

          // 👉 이제 다음 씬
          this.sm.goto("P6");

        }, 1200);
      };

    };

    // 최초 팝업 생성
    spawnPopup();
  }

  exit() {
    const popup = document.querySelector(".p5-wrap");
    if (popup) popup.remove();
  }
}
