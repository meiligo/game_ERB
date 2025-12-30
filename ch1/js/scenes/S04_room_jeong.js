export class S04_Jeong {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#1b2b1f");

    if (this.store.getFlag("phase", "surface") !== "truth") {
      await this.ui.say("SYSTEM", "아직 접근할 수 없는 구역입니다.", { wait: false });
      return this.scenes.goto("S04");
    }

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say("정 소장",
      "어서 와요, 관리자님.\n이 시계를 보니 마음이 너무 아파요.\n시간은 계속 가는데, 발은 떨어지지 않고…"
    );
    await this.ui.say(playerName, "그가 멈춘 진짜 이유가 뭘까요?");
    await this.ui.say("정 소장",
      "그에겐 말리는 사람보다…\n'네가 가는 길이 맞아. 우린 널 믿어.'라고 말해줄 사람이 필요했어요.\n버팀목이 없었던 거죠."
    );

    this.store.setFlag("visited:jeong", true);
    await this.scenes.goto("S04");
  }
}
