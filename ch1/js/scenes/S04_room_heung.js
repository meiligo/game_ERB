// js/scenes/S04_room_heung.js
import { selectEvidence } from "./evidenceSelect.js";

export class S04_Heung {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#2b0033");

    await this.ui.say(
      "흥 소장",
      "아, 뭐야? 뉴비 관리자? 시끄러운데 왜 왔어?\n아~ 그 '마차 사건'?"
    );

    // ✅ (짐보따리를 보여주며) → 증거 선택이 먼저
    await selectEvidence(this.ui, this.store, "packed_bundle", "흥 소장");

    const playerName = this.store.getFlag("playerName", "PLAYER");
    await this.ui.say(
      playerName,
      "이걸 보세요. 짐은 다 싸놨는데 출발을 안 했습니다.\n갈 생각은 있었던 것 같은데..."
    );

    await this.ui.say(
      "흥 소장",
      "아이고, 순진하긴.\n" +
      "짐 다 싸놓고 막상 현관 나가려니 귀찮아진 거지.\n" +
      "그날 날씨도 우중충했다며? '아, 흥 안 나네…' 하고 드러누운 거야.\n" +
      "이건 [단순 변심]이야. 재미없는 사건이라고."
    );

    await this.ui.say(playerName, "단순 변심이라... 그렇게 보기엔 짐을 너무 꼼꼼히 쌌는데.");

    this.store.setFlag("visited:heung", true);
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
