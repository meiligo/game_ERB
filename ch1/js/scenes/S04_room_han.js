// js/scenes/S04_room_han.js
import { selectEvidence } from "./evidenceSelect.js";

export class S04_Han {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#000");

    await this.ui.say("한 소장", "...비 냄새가 나.");

    await selectEvidence(this.ui, this.store, "unused_umbrella", "한 소장");

    const playerName = this.store.getFlag("playerName", "PLAYER");
    await this.ui.say(
      playerName,
      "비가 왔는데 우산을 쓰지 않았습니다.\n비를 맞으며 돌아온 것 같아요."
    );

    await this.ui.say(
      "한 소장",
      "우산을 펼 힘조차 없었던 거야... 공포에 질려서.\n" +
      "누군가 그를 지켜보고 있었어. 보이지 않는 감시...\n" +
      "그는 도망친 거야. 무서워서.\n" +
      "이건 [공포와 억압]이야."
    );

    await this.ui.say(playerName, "공포라... 하지만 마차 앞까지 갔던 사람이 갑자기 공포를 느꼈다?");

    this.store.setFlag("visited:han", true);
    await this.exit();
  }

  async exit() {
    await this.ui.choose("SYSTEM", "이동할 장소를 선택하십시오.", [
      { label: "돌아가기", value: "back" }
    ]);

    const a = this.store.getFlag("visited:heung", false);
    const b = this.store.getFlag("visited:chemaeon", false);
    const c = this.store.getFlag("visited:han", false);

    if (a && b && c) {
      await this.scenes.goto("S05");
    } else {
      await this.scenes.goto("S04");
    }
  }

}
