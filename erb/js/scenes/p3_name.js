import { clearObjects, showText } from "../dom.js";

export class P3 {
  constructor(sm) {
    this.sm = sm;
  }

  enter() {
    clearObjects();

    showText(
      "시스템",
      "식별자를 입력하십시오."
    );

    const overlay = document.getElementById("overlay");
    overlay.classList.add("active");

    overlay.innerHTML = `
      <div class="p3-name-wrap">
        <div class="p3-panel">
          <div class="p3-title">IDENTIFICATION REQUIRED</div>
          <input
            id="playerNameInput"
            type="text"
            maxlength="12"
            placeholder="이름 입력"
            autocomplete="off"
          />
          <div class="p3-hint">
            이 기록은 수정할 수 없습니다.
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById("playerNameInput");
    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim() !== "") {
        this.submitName(input.value.trim());
      }
    });
  }

  submitName(name) {
    localStorage.setItem("playerName", name);

    showText(
      "시스템",
      `기록 대상 확인됨: ${name}`
    );

    const panel = document.querySelector(".p3-panel");
    panel.classList.add("locked");

    setTimeout(() => {
      showText("시스템", "관찰을 시작합니다.");
    }, 900);

    setTimeout(() => {
      const overlay = document.getElementById("overlay");
      overlay.classList.remove("active");
      overlay.innerHTML = "";
      this.sm.goto("P4"); // 다음 파트
    }, 2000);
  }

  exit() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";
  }
}
