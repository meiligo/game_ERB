// js/scenes/S08_room_han.js
export class S08_Han {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;

    // ✅ 방마다 독립 목숨
    this.LIFE_KEY = "S08_Han";
    this.MAX_LIVES = 3;
  }

  initLivesUI() {
    const cur = this.store.getLives(this.LIFE_KEY);
    if (cur == null) this.store.setLives(this.LIFE_KEY, this.MAX_LIVES);

    this.ui.showLivesUI(this.MAX_LIVES);
    this.ui.createLivesUI(this.MAX_LIVES);
    this.ui.updateLivesUI(this.store.getLives(this.LIFE_KEY));
  }

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
        sub: "기회를 모두 소진했습니다. 해당 논파 방을 처음부터 다시 시작합니다.",
      });

      // ✅ 방 초기화
      this.store.setLives(this.LIFE_KEY, this.MAX_LIVES);
      this.ui.updateLivesUI(this.MAX_LIVES);

      this.store.setFlag("break:han", false);

      await this.scenes.goto("S08_Han");
      return false;
    }

    return true;
  }

  async pickTwo(requiredIds, ownerName) {
    const picked = new Set();

    while (picked.size < 2) {
      await this.ui.say(
        "SYSTEM (AI 에코)",
        `(인벤토리에서 증거를 선택하시오) (${picked.size}/2)`,
        { wait: false }
      );

      const id = await this.ui.waitInventoryPick();
      if (!id) continue;

      if (picked.has(id)) {
        await this.ui.say("SYSTEM (AI 에코)", "(이미 제시한 증거입니다)", { wait: false, noLog: true });
        continue;
      }

    // ✅ 오답이면 목숨 -1 + 초기화
      if (!requiredIds.includes(id)) {
        // 👈 여기에 소장 대사 넣기 (추천 위치)
        await this.ui.say(ownerName, "…그건 두려움의 흔적일 뿐이야. 분노의 증거는 아니지.", {
            wait: false
        });

        const ok = await this.loseLife({
            reasonText: `${ownerName}의 오판을 깨뜨리지 못했습니다.`,
        });
        if (!ok) return false;

        picked.clear();
        await this.ui.say(
            "SYSTEM (AI 에코)",
            "(논파 실패: 증거 선택을 초기화합니다)",
            { wait: false, noLog: true }
        );
        continue;
      }    

      picked.add(id);

      const it = (this.store.inventory ?? []).find((x) => x.id === id);
      await this.ui.say("SYSTEM (AI 에코)", `(${it?.title ?? id}을(를) 제시했다)`, { wait: false, noLog: true });
    }

    return true;
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
    this.ui.setStageBackground("#000");

    this.initLivesUI();

    if (this.store.getFlag("break:han", false)) {
      await this.ui.say("SYSTEM", "한(恨) 논파는 이미 완료되었습니다.", { wait: false });
      this.ui.hideLivesUI();
      return this.scenes.goto("S04");
    }

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("한 소장", "무서워서 숨은 거야... 공포에 질려서...");
    await this.ui.say(playerName, "겁쟁이가 아닙니다. 그는 끝까지 싸우려 했습니다.");

    // ✅ 정답 2개: 반쯤 뽑힌 단도 + 벽의 핏자국
    const ok = await this.pickTwo(["dagger_halfdrawn", "bloodstain_wall"], "한 소장");
    if (!ok) return;

    await this.ui.say("한 소장", "칼을... 뽑으려 했어?");
    await this.ui.say(
      playerName,
      "보십시오. 벽을 주먹으로 쳐서 피가 났습니다.\n공포에 질려 숨은 게 아니라, 나가지 못하는 자신의 상황에 분노한 겁니다.\n스스로를 책망하며 괴로워한 거라고요!"
    );
    await this.ui.say("한 소장", "…그렇군. 저 핏자국은 두려움이 아니야..\n내가 그 슬픔의 색을 잘못 읽었어. 미안하다... ");

    this.store.setFlag("break:han", true);

    this.ui.hideLivesUI();
    return this.afterBreak();
  }
}
