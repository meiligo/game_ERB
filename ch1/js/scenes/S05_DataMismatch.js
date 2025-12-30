export class S05_DataMismatch {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("linear-gradient(135deg, #0f141a, #070a0e)");

    const ownerName = this.store.getFlag("roomOwnerName", "연락책"); // 방 주인 이름 (원하면 S04에서 세팅)

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "⚠️ 경고: 데이터 불일치 발생.\n" +
      "[흥 소장: 단순 변심 (게으름)]\n" +
      "[체면 소장: 자존심 손상 (오만)]\n" +
      "[한 소장: 극심한 공포 (무력감)]\n" +
      "세 소장의 해석이 모두 모순됩니다. 현재 정보로는 사건 해결이 불가능합니다."
    );

    const playerName = this.store.getFlag("playerName", "PLAYER");
    await this.ui.say(playerName, "역시... 겉으로 보이는 것만으로는 알 수 없어. 더 깊이 파봐야 해. 그 방 안에 뭔가 더 있었을 거야.");

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "[딥 다이브(Deep Dive)] 프로토콜 승인.\n" +
      `기억의 파편실 Layer 2를 개방합니다. (${ownerName}의 은신처: 은폐 데이터 복구)\n` +
      "은폐된 데이터를 복구하십시오."
    );

    await this.scenes.goto("S06");
  }
}
