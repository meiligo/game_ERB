import { clearObjects, showText } from "../dom.js";

export class P7 {
  constructor(sm) {
    this.sm = sm;
  }

  enter() {
    /* =========================
       1. 모든 화면 강제 초기화
    ========================= */
    clearObjects();

    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";

    const stage = document.getElementById("stage");
    stage.innerHTML = "";
    stage.style.background = "#000";

    /* =========================
       2. 내레이션 순차 출력
    ========================= */
    showText("내레이션", "나는 선택한 적이 없었다.");

    setTimeout(() => {
      showText("내레이션", "하지만");
    }, 1500);

    setTimeout(() => {
      showText("내레이션", "이미 기록 속에 들어가 있었다.");
    }, 2700);

    /* =========================
       3. 타이틀 직전 — 침묵
    ========================= */
    setTimeout(() => {
      // ✅ 내레이션 완전 제거
      showText("", "");
    }, 4200);

    /* =========================
       4. 타이틀 등장
    ========================= */
    setTimeout(() => {
      stage.insertAdjacentHTML("beforeend", `
        <div class="ending-title">
          <div class="ending-main">PROJECT: TRACE</div>
          <div class="ending-sub">잔향의 연구소</div>
        </div>
      `);
    }, 4800);
  }

  exit() {}
}
