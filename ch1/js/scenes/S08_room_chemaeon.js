// js/scenes/S08_room_chemaeon.js
export class S08_Chemaeon {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;

    // ✅ 방마다 독립 목숨
    this.LIFE_KEY = "S08_Chemaeon";
    this.MAX_LIVES = 3;
  }

  // ✅ 방 진입 시 목숨 UI 준비
  initLivesUI() {
    // getLives()가 undefined/null일 수 있으니 방어
    const cur = this.store.getLives(this.LIFE_KEY);
    if (cur == null) this.store.setLives(this.LIFE_KEY, this.MAX_LIVES);

    this.ui.showLivesUI(this.MAX_LIVES);
    this.ui.createLivesUI(this.MAX_LIVES);
    this.ui.updateLivesUI(this.store.getLives(this.LIFE_KEY));
  }

  // ✅ 목숨 감소 + GAME OVER 처리
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

      this.store.setFlag("break:chemaeon", false);

      // ✅ 같은 방 재시작
      await this.scenes.goto("S08_Chemaeon");
      return false;
    }

    return true;
  }

  // ✅ 2개 증거를 '정답 리스트'만으로 채워야 성공
  // - 중간에 오답 나오면: 목숨 -1 + 선택 초기화(0/2부터)
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

      // 같은 거 두 번 클릭 방지
      if (picked.has(id)) {
        await this.ui.say("SYSTEM (AI 에코)", "(이미 제시한 증거입니다)", { wait: false, noLog: true });
        continue;
      }

      // ✅ 오답이면 목숨 -1 + 초기화
      if (!requiredIds.includes(id)) {
        // 👈 여기에 소장 대사 넣기 (추천 위치)
        await this.ui.say(ownerName, "체면이란 걸 조금이라도 생각했다면, 그런 증거는 안 내밀었겠지.", {
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

      // 선택 피드백(선택 사항)
      const it = (this.store.inventory ?? []).find((x) => x.id === id);
      await this.ui.say("SYSTEM (AI 에코)", `(${it?.title ?? id}을(를) 제시했다)`, { wait: false, noLog: true });
    }

    // picked에 requiredIds 2개가 모두 들어있음
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
    this.ui.setStageBackground("#111");

    // ✅ 목숨 UI
    this.initLivesUI();

    // 이미 완료면 허브로
    if (this.store.getFlag("break:chemaeon", false)) {
      await this.ui.say("SYSTEM", "체면(體面) 논파는 이미 완료되었습니다.", { wait: false });
      this.ui.hideLivesUI();
      return this.scenes.goto("S04");
    }

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("체면 소장", "마차 꼴을 보라니까. 양반 체면에...");
    await this.ui.say(playerName, "체면 따질 상황이 아니었습니다. 그는 목숨이 걸린 요원이었습니다.");

    // ✅ 정답 2개: 암호표 + 찢긴 편지
    const ok = await this.pickTwo(["cipher_table", "torn_letter"], "체면 소장");
    if (!ok) return; // GAME OVER로 재진입했을 수 있음

    await this.ui.say("체면 소장", "저건... 군사 암호표? 그럼 그가 단순한 선비가 아니었단 말인가?");
    await this.ui.say(
      playerName,
      "그리고 이 편지를 보세요. '무모하다'는 만류.\n그는 남의 시선이 아니라, 임무 실패로 대의를 그르칠까 봐 고뇌한 겁니다.\n겉치레가 아닙니다!"
    );
    await this.ui.say("체면 소장", "허... 나라의 명운을 짊어진 자를... 내가 겉치레꾼으로 매도했군. \n부끄럽구려. 내 판단을 철회하겠네.");

    this.store.setFlag("break:chemaeon", true);

    this.ui.hideLivesUI();

    return this.afterBreak();
  }
}
