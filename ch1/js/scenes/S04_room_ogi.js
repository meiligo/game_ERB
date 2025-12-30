export class S04_Ogi {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#0b0f18");

    if (this.store.getFlag("phase", "surface") !== "truth") {
      await this.ui.say("SYSTEM", "아직 접근할 수 없는 구역입니다.", { wait: false });
      return this.scenes.goto("S04");
    }

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("의지 소장", "왔나. 모든 잡음(오판)을 걷어냈군.");
    await this.ui.say(playerName, "모든 단서가 당신을 가리키고 있습니다.");
    await this.ui.say("의지 소장",
      "가고 싶었고(단도), 준비도 마쳤다(짐).\n하지만 만류(편지)에 마지막 확신이 흔들렸지.\n부족했던 건 단 하나."
    );
    await this.ui.say(playerName, "확신. 그리고 [의지]입니다.");
    await this.ui.say("의지 소장",
      "'네 선택은 틀리지 않았다. 끝까지 가라.'\n그 한마디의 확신. 그 [의지]가 1% 부족해서 마차는 멈춘 거다."
    );

    this.store.setFlag("visited:ogi", true);
    await this.scenes.goto("S04");
  }
}
