// js/scenes/S04_GateHub.js
export class S04_GateHub {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async onEnter() {
    this.ui.hideLivesUI();
    this.ui.clearHotspots();
    this.ui.setStageBackground("#000");
    this.ui.clearOverlay();

    const phase = this.store.getFlag("phase", "surface");

    // 진행 체크용
    const vHeung = this.store.getFlag("visited:heung", false);
    const vChe  = this.store.getFlag("visited:chemaeon", false);
    const vHan  = this.store.getFlag("visited:han", false);

    const bHeung = this.store.getFlag("break:heung", false);
    const bChe  = this.store.getFlag("break:chemaeon", false);
    const bHan  = this.store.getFlag("break:han", false);

    const vJeong = this.store.getFlag("visited:jeong", false);
    const vOgi   = this.store.getFlag("visited:ogi", false);

    // 안내
    if (phase === "surface") {
      await this.ui.say("SYSTEM (AI 에코)",
        "귀문 이동 프로토콜 활성화.\n표면 단서를 바탕으로 소장들의 견해를 청취하십시오.",
        { wait: false }
      );
    } else if (phase === "break") {
      await this.ui.say("SYSTEM (AI 에코)",
        "논파 모드(Break Mode) 활성화.\n심층 단서를 제시하여 오판을 제거하십시오.",
        { wait: false }
      );
    } else { // truth
      await this.ui.say("SYSTEM (AI 에코)",
        "상위 감정 구역 개방.\n[정(情)]과 [의지(意志)]를 탐색하십시오.",
        { wait: false }
      );
    }

    // 메뉴 구성
    let menu = [];

    if (phase === "surface") {
      menu = [
        { label: `흥(興) ${vHeung ? "✓" : ""}`, value: "S04_Heung" },
        { label: `체면(體面) ${vChe ? "✓" : ""}`, value: "S04_Chemaeon" },
        { label: `한(恨) ${vHan ? "✓" : ""}`, value: "S04_Han" },
        { label: "정(情) (잠김)", value: null, disabled: true },
        { label: "ogi(意志) (잠김)", value: null, disabled: true },
      ];
    }

    if (phase === "break") {
      menu = [
        { label: `⚔ 흥(興) 논파 ${bHeung ? "✓" : ""}`, value: "S08_Heung" },
        { label: `⚔ 체면(體面) 논파 ${bChe ? "✓" : ""}`, value: "S08_Chemaeon" },
        { label: `⚔ 한(恨) 논파 ${bHan ? "✓" : ""}`, value: "S08_Han" },
        { label: "정(情) (잠김)", value: null, disabled: true },
        { label: "의지(意志) (잠김)", value: null, disabled: true },
      ];
    }

    if (phase === "truth") {
      menu = [
        { label: `정(情) ${vJeong ? "✓" : ""}`, value: "S04_Jeong" },
        { label: `의지(意志) ${vOgi ? "✓" : ""}`, value: "S04_Ogi" },
      ];

      if (vJeong && vOgi) {
        menu.push({ label: "➡ 메인홀로 이동", value: "S09" });
      }
    }

    const choice = await this.ui.chooseCenter("이동할 귀문을 선택하십시오.", menu);
    if (choice) await this.scenes.goto(choice);
  }
}
