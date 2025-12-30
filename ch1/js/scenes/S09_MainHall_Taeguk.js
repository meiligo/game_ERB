// js/scenes/S09_MainHall_Taeguk.js
export class S09_MainHall_Taeguk {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;

    // ✅ 여기만 네가 나중에 실제 파일 경로로 바꾸면 됨
    this.CLIP_1_SRC = ""; // 예: "assets/cutscenes/finale_01.mp4"
    this.CLIP_2_SRC = ""; // 예: "assets/cutscenes/finale_02.mp4"
  }

  // 엔딩 조건(원하면 완화 가능)
  isReady() {
    const bHeung = this.store.getFlag("break:heung", false);
    const bChe   = this.store.getFlag("break:chemaeon", false);
    const bHan   = this.store.getFlag("break:han", false);
    const vJeong = this.store.getFlag("visited:jeong", false);
    const vOgi   = this.store.getFlag("visited:ogi", false);
    return bHeung && bChe && bHan && vJeong && vOgi;
  }

  // ✅ 비디오(또는 플레이스홀더) 재생
  async playClip({ src, placeholderText = "VIDEO", holdMs = 1200 } = {}) {
    this.ui.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "cinematicWrap";
    // CSS 없어도 보이게 최소 스타일(인라인)
    wrap.style.position = "absolute";
    wrap.style.left = "0";
    wrap.style.top = "0";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "center";
    wrap.style.background = "rgba(0,0,0,.85)";
    wrap.style.zIndex = "999";

    let doneResolve;
    const done = new Promise((res) => (doneResolve = res));

    if (src && src.trim().length > 0) {
      const v = document.createElement("video");
      v.src = src;
      v.autoplay = true;
      v.controls = false;
      v.muted = false;      // 필요하면 true로
      v.playsInline = true;
      v.style.maxWidth = "96%";
      v.style.maxHeight = "96%";
      v.style.border = "1px solid rgba(255,255,255,.15)";
      v.style.borderRadius = "14px";
      v.style.boxShadow = "0 18px 60px rgba(0,0,0,.55)";

      // 어떤 브라우저에서는 autoplay가 막힐 수 있어서, 클릭 시 재생도 지원
      wrap.addEventListener("click", () => {
        if (v.paused) v.play().catch(() => {});
      });

      v.addEventListener("ended", () => doneResolve());
      v.addEventListener("error", () => doneResolve()); // 파일 없을 때도 진행되게

      wrap.appendChild(v);
    } else {
      // 비디오 src가 아직 없으면 placeholder 보여주고 잠깐 대기 후 진행
      const ph = document.createElement("div");
      ph.textContent = `[${placeholderText}] (영상 파일 경로를 넣으면 실제로 재생됩니다)`;
      ph.style.color = "rgba(233,241,255,.85)";
      ph.style.fontSize = "18px";
      ph.style.padding = "16px 18px";
      ph.style.border = "1px solid rgba(255,255,255,.18)";
      ph.style.borderRadius = "14px";
      ph.style.background = "rgba(255,255,255,.06)";
      ph.style.textAlign = "center";
      wrap.appendChild(ph);

      setTimeout(() => doneResolve(), holdMs);
    }

    this.ui.addOverlayElement?.(wrap);
    await done;
    wrap.remove();
  }

  async onEnter() {
    this.ui.hideLivesUI();
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#05060a"); // 메인 홀 느낌(원하면 바꿔)

    // 조건 미달이면 되돌림
    if (!this.isReady()) {
      await this.ui.say(
        "SYSTEM (AI 에코)",
        "엔딩 구역 접근 조건이 충족되지 않았습니다.\n(논파 3개 + 정/ogi 탐색을 완료해야 합니다.)",
        { wait: false }
      );
      return this.scenes.goto("S04");
    }

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "메인 홀 [태극].\n다섯 소장이 집결했습니다.\n중앙 장치가 붉은 경고등을 뿜어냅니다.",
      { wait: false }
    );

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "역사 데이터 소실 임박 [99%].\n중앙 장치에 감정 코드를 주입하십시오.",
      { wait: false }
    );

    // ✅ 가운데 장치(핫스팟) — stage는 1280x720 기준
    // 필요하면 w/h/x/y 조절해줘!
    this.ui.addHotspot({
      id: "injectDevice",
      x: 1280 / 2 - 140,
      y: 720 / 2 - 80,
      w: 280,
      h: 160,
      label: "중앙 장치",
      onClick: async () => {
        this.ui.clearHotspots();

        const choice = await this.ui.chooseCenter("주입할 감정을 선택하십시오.", [
          { label: "1. 흥", value: "heung" },
          { label: "2. 체면", value: "chemaeon" },
          { label: "3. 한", value: "han" },
          { label: "4. 정", value: "jeong" },
          { label: "5. 의지", value: "ogi" },
        ]);

        if (!choice) {
          // 다시 장치 클릭 가능하게 복귀
          return this.onEnter();
        }

        // X/△ 선택 반응 (원하면 더 추가)
        if (choice === "heung") {
          await this.ui.say("SYSTEM (AI 에코)", "주입 실패.\n흥은 방향을 만들지 못합니다.", { wait: false });
          await this.ui.say("흥 소장", "…야, 이건 나도 인정. 난 마지막 열쇠 아냐.", { wait: false });
          return this.onEnter();
        }
        if (choice === "chemaeon") {
          await this.ui.say("SYSTEM (AI 에코)", "주입 실패.\n체면은 행동을 붙잡습니다.", { wait: false });
          await this.ui.say("체면 소장", "…품격이 모두를 살리진 못하는 법이지.", { wait: false });
          return this.onEnter();
        }
        if (choice === "han") {
          await this.ui.say("SYSTEM (AI 에코)", "주입 실패.\n한은 발걸음을 무겁게 합니다.", { wait: false });
          await this.ui.say("한 소장", "…미안하다. 난 그를 앞으로 보내지 못해.", { wait: false });
          return this.onEnter();
        }
        if (choice === "jeong") {
          await this.ui.say(
            "SYSTEM (AI 에코)",
            "부분 주입.\n정은 마음을 달래지만, 결정을 바꾸진 못합니다.",
            { wait: false }
          );
          await this.ui.say("정 소장", "…위로만으론, 문을 열 수 없어요.", { wait: false });
          return this.onEnter();
        }

        // ✅ 정답: 의지
        const playerName = this.store.getFlag("playerName", "PLAYER");
        await this.ui.say(playerName, "감정 코드 [의지]. 주입합니다!", { wait: false });

        this.store.setFlag("final:emotion", "ogi");

        // ===== 원하는 구조: 비디오 -> 대사 -> 비디오 로 S09 끝 =====
        await this.playClip({ src: this.CLIP_1_SRC, placeholderText: "VIDEO 1" });

        // ✅ 여기서 “남자 대사만” 출력
        await this.ui.say("남자 (1906년)", "늦지... 않았소. 갑시다. 한성으로.");

        await this.playClip({ src: this.CLIP_2_SRC, placeholderText: "VIDEO 2" });

        // S09 종료 → S10(에필로그)
        return this.scenes.goto("S10");
      },
    });
  }
}
