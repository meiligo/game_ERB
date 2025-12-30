export class S08_Heung {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;

    // ✅ [추가] 이 방의 목숨 키(방마다 다름)
    this.LIFE_KEY = "S08_Heung";
    this.MAX_LIVES = 3;
  }

  // ✅ [추가] 방 진입 시 목숨 UI 준비
  initLivesUI() {
    if (this.store.getLives(this.LIFE_KEY) == null) {
      this.store.setLives(this.LIFE_KEY, this.MAX_LIVES);
    }
    this.ui.showLivesUI(this.MAX_LIVES);
    this.ui.createLivesUI(this.MAX_LIVES);
    this.ui.updateLivesUI(this.store.getLives(this.LIFE_KEY));
  }

  // ✅ [추가] 목숨 감소 공통 처리
  async loseLife({ reasonText = "잘못된 증거 제시. 기회 -1" } = {}) {
    this.store.decLives(this.LIFE_KEY);
    const left = this.store.getLives(this.LIFE_KEY);

    this.ui.playLifeLostFX();
    this.ui.updateLivesUI(left);

    await this.ui.say(
      "SYSTEM (AI 에코)",
      `${reasonText}\n(남은 기회: ${left}/${this.MAX_LIVES})`,
      { noLog: true }
    );

    if (left <= 0) {
      await this.ui.showGameOverOverlay({
        title: "GAME OVER",
        sub: "기회를 모두 소진했습니다. 해당 해당 방을 처음부터 다시 시작합니다."
      });

      // ✅ 방 초기화: 목숨 리셋 + (필요하면) 방 관련 플래그 정리
      this.store.setLives(this.LIFE_KEY, this.MAX_LIVES);
      this.ui.updateLivesUI(this.MAX_LIVES);

      // 이 방 논파 성공 플래그는 당연히 false 상태 유지(혹시 있을까봐)
      this.store.setFlag("break:heung", false);

      // ✅ 같은 방으로 재진입(처음부터)
      await this.scenes.goto("S08_Heung");
      return false; // 계속 진행 중단
    }

    return true;
  }

  async pickUntil(expectedId, ownerName) {
    const playerName = this.store.getFlag("playerName", "PLAYER");

    while (true) {
      await this.ui.say("SYSTEM (AI 에코)", "(인벤토리에서 증거를 선택하시오)", { wait: false });
      const picked = await this.ui.waitInventoryPick();

      if (!picked) continue;

      if (picked === expectedId) return true;

      // ✅ [변경] 오답이면 목숨 -1
      const ok = await this.loseLife({
        reasonText: `${ownerName}를 설득시키기에 충분하지 않습니다.`
      });
      if (!ok) return false;

      const it = (this.store.inventory ?? []).find(x => x.id === picked);
      const shown = it?.title ?? picked;
      await this.ui.say(ownerName, `${shown}? 에이~ 그걸로 설득될 줄 알았어?`, { wait: false });
    }
  }

  async afterBreak() {
    const a = this.store.getFlag("break:heung", false);
    const b = this.store.getFlag("break:chemaeon", false);
    const c = this.store.getFlag("break:han", false);

    // ✅ 3개 다 논파 완료되면 상위 구역 해금
    if (a && b && c) {
        this.store.setFlag("phase", "truth");
    }

    // ✅ 허브로 복귀 (return 붙이는 게 안전)
    this.ui.hideLivesUI();
    return this.scenes.goto("S04");
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#2b0033");

    // ✅ [추가] 이 방 목숨 UI 초기화
    this.initLivesUI();

    if (this.store.getFlag("break:heung", false)) {
      await this.ui.say("SYSTEM", "흥(興) 논파는 이미 완료되었습니다.", { wait: false });
      return this.scenes.goto("S04");
    }

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("흥 소장", "아 또 왔어? 아까 말했잖아. 걔는 그냥 재미없어서 안 간 거라니까? 단순 변심!");
    await this.ui.say(playerName, "단순 변심? 재미? 이 사람의 각오를 모욕하지 마십시오.");

    // ✅ 정답: burned_blood_oath (네 S06 인벤 id 그대로)
    const ok = await this.pickUntil("burned_blood_oath", "흥 소장");
    if (!ok) return; // GAME OVER로 재진입되었을 수 있음

    await this.ui.say("흥 소장", "이게 뭔데... 윽, 피 냄새!");
    await this.ui.say(playerName, "피로 쓴 맹세입니다... 흥이나 재미 따위로 안 갈 사람이 아닙니다!");
    await this.ui.say("흥 소장", "...피로 맹세를 했다고? 쳇, 진짜였네. 장난이 아니었어.\n알았어, 알았다고! 내가 틀렸어. 걔는 진지했어!");

    this.store.setFlag("break:heung", true);

    // ✅ 방 종료 시 하트 숨김(선택)
    this.ui.hideLivesUI();

    return this.afterBreak();
  }
}
