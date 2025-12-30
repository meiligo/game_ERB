// js/scenes/S03_checkpoint.js
export class S03_Checkpoint {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.showProgressBar(false);
    this.ui.clearHotspots();

    const clues = this.store.inventory;
    const has = (id) => clues.some(c => c.id === id);

    await this.ui.say("SYSTEM (AI 에코)", `Layer 1 데이터 수집 완료. 획득한 단서: ${clues.length}개.`);

    const listText = clues.length
      ? clues.map((c, i) => `${i + 1}. ${c.title}`).join("\n")
      : "없음";
    await this.ui.say("SYSTEM (AI 에코)", `[보유 단서 목록]\n${listText}`);

    const playerName = this.store.getFlag("playerName", "PLAYER");

    const must = ["driver_memo", "packed_bundle", "mud_footprint", "unused_umbrella"];
    const allMust = must.every(has);

    const lineA = [];
    if (has("driver_memo")) lineA.push("마차는 기다려줬고(메모장)");
    if (has("packed_bundle")) lineA.push("그는 갈 준비도 마쳤어(짐보따리)");

    const lineB = [];
    if (has("mud_footprint")) lineB.push("마차 앞까지 갔다가(발자국)");
    if (has("unused_umbrella")) lineB.push("비를 쫄딱 맞으며 그냥 돌아왔어(우산)");

    const fakeCount = clues.filter(c => c.type === "fake").length;

    let monologue = `정리해 보자.\n`;
    if (lineA.length) monologue += `${lineA.join(", ")}.\n`;
    if (lineB.length) monologue += `${lineB.join(", ")}.\n`;

    if (allMust) {
      monologue += `물리적인 방해는 없었어. 이건... 마음의 문제야.\n`;
      if (fakeCount > 0) monologue += `\n오히려 판단을 흐리는 단서도 있는 것 같아..`;
      await this.ui.say(playerName, monologue, { cps: 45, wait: true });

      await this.ui.say(
        "SYSTEM (AI 에코)",
        "귀문(鬼門)을 개방합니다. 감정소장들을 만나 1차 분석을 진행하십시오."
      );

      // ✅ 여기 중요: S04가 아니라 S04_GateHub로
      await this.scenes.goto("S04");
      return;
    }

    // ✅ true 단서 부족 → 다시 조사
    monologue += `...아직 확실한 단서가 부족해.\n`;
    await this.ui.say(playerName, monologue, { cps: 45, wait: true });

    await this.ui.say(playerName, "다시 조사해보자.");

    // ✅ 초기화: 인벤토리 + 조사 플래그(resolved/inspected)
    // ✅ S06(L2)에서 획득한 단서만 제거
    this.store.removeItemsByLayer("L2");

    // ✅ S06 조사 플래그만 초기화
    this.store.clearFlagsByPrefix("L2:inspected:");
    this.store.clearFlagsByPrefix("L2:resolved:"); // 쓰고 있다면

    this.ui.renderInventory();
    
    await this.scenes.goto("S02");
  }
}
