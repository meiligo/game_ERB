export class S07_Reconstruction {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  has(id){ return (this.store.inventory ?? []).some(it => it.id === id); }

  async onEnter() {
    this.ui.hideLivesUI();
    const inv = this.store.inventory ?? [];
    const fakeCount = inv.filter(it => it.type === "fake").length;
    this.ui.showProgressBar(false);
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("linear-gradient(135deg, #0f141a, #070a0e)");

    const clues = this.store.inventory;
    const has = (id) => clues.some(c => c.id === id);

    await this.ui.say("SYSTEM (AI 에코)", `Layer 2 데이터 수집 완료. 핵심 단서 추가 확보.\n총 단서 수 : ${clues.length}개.`);

    const listText = clues.length
      ? clues.map((c, i) => `${i + 1}. ${c.title}`).join("\n")
      : "없음";
    await this.ui.say("SYSTEM (AI 에코)", `[최종 인벤토리]\n${listText}`);
    

    const playerName = this.store.getFlag("playerName", "PLAYER");

    // 필요한 것만 조립(먹은 것만 말하되, 너가 요구한 “결론 문장”은 고정으로)
    const parts = [];
    if (this.has("cipher_table")) parts.push("그는 독립군 요원이었고(암호표)");
    if (this.has("burned_blood_oath")) parts.push("목숨을 걸 각오도 했어(혈서)");
    if (this.has("dagger_halfdrawn")) parts.push("싸우고 싶었고(단도)");
    if (this.has("packed_bundle")) parts.push("준비도 마쳤지만(짐보따리)");
    if (this.has("torn_letter")) parts.push("누군가의 만류(편지)에 확신이 흔들린 거야");
    if (this.has("mud_footprint")) parts.push("마차 앞까지 갔다가(발자국)");
    if (this.has("bloodstain_wall")) parts.push("괴로워하며 벽을 치고(핏자국)");
    if (this.has("broken_watch")) parts.push("시계를 깼어(시계)");

    const must = ["cipher_table", "burned_blood_oath", "dagger_halfdrawn", "packed_bundle", "torn_letter", "mud_footprint", "bloodstain_wall", "broken_watch"];
    const allMust = must.every(has);
    let mono = `정리해 보자.\n`;

    if (parts.length > 0) {
      mono += parts.join(".\n") + ".\n\n";
    }
    
    if (allMust) {
      mono += "모든 조각이 모였어.\n";
      mono += "이건 공포도, 체면도, 장난도 아니야. '확신'의 부재야.";
      if (fakeCount > 0) mono += `\n오히려 판단을 흐리는 단서도 있는 것 같아..`;
      await this.ui.say(playerName, mono, { cps: 45, wait: true });

      await this.ui.say(
        "SYSTEM (AI 에코)",
        "모든 소장과의 재접속 권한이 부여됩니다.\n이제 그들의 오판을 논리로 [파괴(Break)]하십시오."
      );

      this.store.setFlag("phase", "break");
      await this.scenes.goto("S04");
            
      return;
    }

    // ✅ true 단서 부족 → 다시 조사
    mono += `...아직 확실한 단서가 부족해.\n`;
    await this.ui.say(playerName, mono, { cps: 45, wait: true });

    await this.ui.say(playerName, "다시 조사해보자.");

    // ✅ S06(L2)에서 획득한 단서만 제거
    this.store.removeItemsByLayer("L2");

    // ✅ S06 조사 플래그만 초기화
    this.store.clearFlagsByPrefix("L2:inspected:");
    this.store.clearFlagsByPrefix("L2:resolved:"); // 쓰고 있다면

    this.ui.renderInventory();

    await this.scenes.goto("S06");
  }
}
