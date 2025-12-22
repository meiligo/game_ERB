/* =========================
   전역 게임 상태 저장소
   - 씬 간 데이터 공유용
   - UI / DOM / Scene 호출 ❌
========================= */

export const GameState = {
  // 전체 공통
  system: {
    started: false,      // 게임 시작 여부
  },

  // 프롤로그 전용
  prologue: {
    // P2
    tabInteracted: false, // 브라우저 탭을 한 번이라도 눌렀는지

    // P3
    playerName: null,     // 입력한 이름

    // P5 (선택지용)
    choice: null,         // 선택 결과 저장
  },
};
