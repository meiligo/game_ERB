export class S01_Intro {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.showProgressBar(false);
    this.ui.clearHotspots();

    // 검정 시작 -> 연출
    this.ui.setStageBackground("#000");
    this.ui.clearOverlay();
    await this.ui.playIntroFX({ totalMs: 1700 });

    // 메인 홀(임시 배경)
    this.ui.setStageBackground("linear-gradient(135deg, #0b1a26, #101826 55%, #1a2b3a)");

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("SYSTEM (AI 에코)", `시스템 부팅... 감정 데이터 동기화 32%... 78%... 완료.\n관리자 ID 식별: [${playerName}]. 접속을 환영합니다.`);
    await this.ui.say(playerName, "이곳이... 감정반향연구소? 정말로 AI가 날 여기로 불렀단 말이지...");

    await this.ui.say("SYSTEM (AI 에코)",
      "시간이 없습니다. 1906년 타임라인에서 치명적인 '데이터 괴사'가 감지되었습니다.\n지금부터 브리핑을 시작합니다. 전방의 홀로그램을 주시하십시오."
    );

    await this.ui.say("SYSTEM (AI 에코)",
      "사건 파일명: <멈춰버린 마차>.\n1906년 4월, 풍해역 인근.\n독립 의군 자금 전달책이 마차에 탑승하지 않았습니다.\n이로 인해 마차는 빈 수레로 출발했고, 검문소 돌파 중 전복.\n탑승객 전원 사망. 역사 데이터 30%가 소실되었습니다."
    );

    await this.ui.say("SYSTEM (AI 에코)",
      "임무: 그가 마차에 타지 않은 '감정적 원인'을 찾아 제거하십시오."
    );

    await this.ui.say(playerName, "그러니까... 타기 싫어서 안 탄 건지, 못 탄 건지, 그걸 알아내라는 거군.");
    await this.ui.say("SYSTEM (AI 에코)",
      "[기억의 파편실]을 개방합니다. 시뮬레이션 공간으로 이동하여 데이터를 수집하십시오.\n주의: 사건과 무관한 '노이즈(함정)'가 섞여 있습니다."
    );

    await this.scenes.goto("S02");
  }
}
