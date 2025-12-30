// js/scenes/S04_room_chemaeon.js
import { selectTwoEvidenceAnyOrder } from "./evidenceSelect.js";


export class S04_Chemaeon {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#111");

    await this.ui.say("체면 소장", "자네가 그 관리자로군. 옷매무새가 그게 뭔가. 쯧.");

    // ✅ (진흙 발자국과 메모장을 보여주며) — 순서 무관, 둘 다 선택해야 통과
    await selectTwoEvidenceAnyOrder(
      this.ui,
      this.store,
      ["mud_footprint", "driver_memo"],
      "체면 소장"
    );

    const playerName = this.store.getFlag("playerName", "PLAYER");
    await this.ui.say(
      playerName,
      "그는 마차 앞까지 갔다가 되돌아왔습니다.\n마부는 기다리고 있었는데도요. 왜 그랬을까요?"
    );


    await this.ui.say(
      "체면 소장",
      "허허, 답은 뻔하지 않나.\n" +
      "양반이 타기엔 너무 낡고 초라해. 게다가 흙탕물까지 튀었겠지.\n" +
      "그는 생각했을 걸세. '내 체면에 이런 걸 타고 가다니, 남우세스럽다.'\n" +
      "그래서 발길을 돌린 게야. 이건 [격식과 체면]의 문제네."
    );

    await this.ui.say(playerName, "고작 체면 때문에 마차를 안 탔다고? 뭔가 석연치 않아.");

    this.store.setFlag("visited:chemaeon", true);
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
