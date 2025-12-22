import {
  showText,
  setSkipVisible,
  setNextText,
  clearObjects,
  wait
} from "../dom.js";

export class P0 {
  constructor(sm) {
    this.sm = sm;
  }

  async enter() {
    /* =========================
       UI 완전 초기화
    ========================= */
    clearObjects();

    setSkipVisible(false);
    setNextText("");

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
      nextBtn.style.display = "none";
      nextBtn.onclick = null;
    }

    /* =========================
       시스템 부팅 연출
    ========================= */
    showText("시스템", "감정 연구소 기록 시스템");
    await wait(700);

    showText("시스템", "기록 접근을 초기화합니다…");
    await wait(800);

    showText("시스템", "데이터 무결성 확인 중…");
    await wait(700);

    showText("시스템", "경고: 잔존 감정 데이터 감지");
    await wait(900);

    showText(
      "시스템",
      "일부 기록이\n이미 열람된 흔적을 발견했습니다."
    );
    await wait(1100);

    showText(
      "시스템",
      "부분 복구 모드로 진행합니다."
    );
    await wait(1000);

    /* =========================
       🔥 다음 틱에서 씬 전환
    ========================= */
    setTimeout(() => {
      this.sm.goto("P1");
    }, 0);
  }

  exit() {}
}
