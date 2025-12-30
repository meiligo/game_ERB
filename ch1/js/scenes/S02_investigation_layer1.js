export class S02_InvestigationLayer1 {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
    this.busy = false;
    this.items = [
      {
        id: "wheel_scratch",
        label: "바퀴 흠집",
        truth: false,
        inv: { id: "wheel_scratch", title: "바퀴 흠집", tag: "낡았지만 문제 없음", type: "fake" },
        useless: true,
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "오래된 마찰 흔적. 주행 안전성 테스트 결과: 정상."',
        player: "흠집이 좀 있긴 한데... 이 정도로 마차가 못 갈 리는 없어. 이건 그냥 낡은 거야.",
      },
      {
        id: "mud_footprint",
        label: "진흙 발자국",
        truth: true,
        inv: { id: "mud_footprint", title: "진흙 발자국", tag: "마차 앞까지 접근 후 되돌아감", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "마차 전방 1m 지점까지 접근 후, 180도 회전하여 되돌아감. 보폭이 불규칙함."',
        player: "잠깐, 이건 중요해. 아예 안 온 게 아니야. 마차 앞까지 왔다가... 갑자기 맘을 바꿔서 돌아갔어. 왜지?",
      },
      {
        id: "driver_memo",
        label: "마부 메모",
        truth: true,
        inv: { id: "driver_memo", title: "마부의 메모장", tag: "출발 시간 위에 '대기' 덧씀", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "출발 예정 시간 \'오시(11시~13시)\' 위에 검은 줄. 옆에 \'대기\'라고 덧쓴 자국."',
        player: "마부는 기다려줬어. 마차가 먼저 떠나버려서 놓친 게 아니란 소리야.",
      },
      {
        id: "passenger_list",
        label: "승객 명단",
        truth: false,
        inv: { id: "passenger_list", title: "승객 명단", tag: "승객은 모두 일반인임", type: "fake" },
        useless: true,
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "탑승객 신원 조회: 인근 시장 상인 3명. 위협 요소 0%."',
        player: "암살자가 타고 있었던 건 아니야. 그냥 평범한 사람들... 이것도 사건 원인은 아니겠어.",
      },
      {
        id: "coin_bundle",
        label: "엽전 꾸러미",
        truth: false,
        inv: { id: "coin_bundle", title: "엽전 꾸러미", tag: "여비 및 체류비로 충분", type: "fake" },
        useless: true,
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "화폐 가치 환산 결과, 한성까지의 여비 및 체류비로 충분함."',
        player: "돈이 없어서 못 간 건 아니네. 오히려 차고 넘쳐. 가난이 원인은 아니야.",
      },
      {
        id: "packed_bundle",
        label: "짐보따리",
        truth: true,
        inv: { id: "packed_bundle", title: "싸 놓은 짐보따리", tag: "장거리 이동 물품 완비", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "의복, 건량 등 장거리 이동 물품 완비. 착용 흔적 없음."',
        player: "떠날 준비를 완벽하게 해놨어. 즉흥적으로 안 가기로 한 게 아니야. 가려고 했어... 분명히.",
      },
      {
        id: "unused_umbrella",
        label: "우산",
        truth: true,
        inv: { id: "unused_umbrella", title: "펴지 않은 우산", tag: "비가 왔는데 사용 흔적 0%", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "당일 강수량 30mm였으나 우산 내부 건조. 사용 흔적 0%."',
        player: "비가 왔는데 우산을 안 썼다... 비를 맞으면서까지 급하게 돌아온 건가? 뭔가 이상해.",
      },
      {
        id: "herbal_medicine",
        label: "탕약",
        truth: false,
        inv: { id: "herbal_medicine", title: "탕약", tag: "단순 소화제", type: "fake" },
        useless: true,
        speaker: "SYSTEM (AI 에코)",
        analysis: '분석: "감초, 생강. 단순 소화제. 독성 반응 없음."',
        player: "그냥 체해서 먹은 약이잖아. 사약도 아니고, 이걸 먹고 뻗었을 리는 없어.",
      },
    ];

    const S02_IDS = [
      "wheel_scratch","mud_footprint","driver_memo","passenger_list",
      "coin_bundle","packed_bundle","unused_umbrella","herb_medicine"
    ];

    this.placements = [
      { x: 140, y: 130, w: 220, h: 120 },
      { x: 420, y: 420, w: 220, h: 120 },
      { x: 760, y: 420, w: 220, h: 120 },
      { x: 980, y: 160, w: 220, h: 120 },
      { x: 220, y: 520, w: 220, h: 120 },
      { x: 520, y: 520, w: 220, h: 120 },
      { x: 820, y: 520, w: 220, h: 120 },
      { x: 540, y: 160, w: 220, h: 120 },
    ];
  }

  isAllResolved() {
    return this.items.every(it => this.store.getFlag(`resolved:${it.id}`, false));
  }

  countResolved() {
    return this.items.filter(it => this.store.getFlag(`resolved:${it.id}`, false)).length;
  }

  updateProgressUI() {
    const done = this.countResolved();
    const total = this.items.length;

    this.ui.setInvestigationProgress({ done, total });
    this.ui.setCompleteEnabled(done === total);
  }

  async showCompleteButton() {
    // 이미 한 번 띄웠으면 중복 방지
    if (this.store.getFlag("layer1CompleteShown")) return;
    this.store.setFlag("layer1CompleteShown", true);

    // 조사 끝났으니 핫스팟은 계속 잠금
    this.ui.setHotspotsEnabled(false);

    await this.ui.say("SYSTEM (AI 에코)", "표면 조사 완료. 아래 버튼을 눌러 중간 점검으로 이동하십시오.", { wait: false });

    // choices 영역에 버튼 1개만 띄우기 (ui.choose 재사용)
    const v = await this.ui.choose("SYSTEM (AI 에코)", "이동할까요?", [
      { label: "조사 완료", value: "go" },
    ]);

    if (v === "go") {
      await this.scenes.goto("S03");
    }
  }

  async onEnter() {
    this.ui.showLivesUI(3);
    this.ui.updateLivesUI(this.store.getFlag("lives:S02", 3)); // S06은 "lives:S06"

    this.ui.createLivesUI(3);
    this.ui.updateLivesUI(this.store.getLives("S02"));

    // ✅ S02 목숨(기회) 3 (없으면 세팅)
    if (this.store.getLives("S02") == null) {
      this.store.setLives("S02", 3);
    }
    this.busy = false;                 // ✅ 혹시 남아있을 busy 리셋
    this.ui.setHotspotsEnabled(true);  // ✅ pointer-events 강제 복구

    this.ui.showProgressBar(true);
    this.updateProgressUI();
    this.ui.clearOverlay();
    this.ui.setStageBackground("linear-gradient(135deg, #1d5a73, #0f2a39)");
    this.ui.clearHotspots();

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say(
      playerName,
      "여기가 1906년의 데이터 속인가... 마치 덜 만들어진 게임 세상 같네.\n" +
      "일단 눈에 보이는 것부터 뒤져보자. 왜 안 탔는지 이유가 있을 거야."
    );

    // 🔹 핫스팟 생성
    this.items.forEach((it, idx) => {
      const p = this.placements[idx];
      this.ui.addHotspot({
        id: it.id,
        ...p,
        label: it.label,
        onClick: () => this.inspect(it),
      });
    });

    // 🔽 🔽 🔽 여기 추가 🔽 🔽 🔽
    // ✅ 진행 UI 초기화
    this.totalCount = this.items.length;
    this.updateProgressUI();

    // ✅ 조사 완료 버튼 클릭 → S03 이동
    if (this.ui.btnComplete) {
      this.ui.btnComplete.onclick = async () => {
        if (!this.isAllResolved()) return;
        await this.scenes.goto("S03");
      };
    }
    // 🔼 🔼 🔼 여기까지 🔼 🔼 🔼

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "표면 단서 8개가 활성화되었습니다.\n오브젝트를 클릭하여 조사하십시오."
    );
  }

  async resetS02({ gameOver = false } = {}) {
    this.busy = false;
    this.ui.setHotspotsEnabled(true);
    this.store.setLives("S02", 3);
    this.ui.updateLivesUI(3);

    this.store.removeItemsByLayer("L1");
    for (const it of this.items) {
      this.store.setFlag(`resolved:${it.id}`, false);
      this.store.setFlag(`inspected:${it.id}`, false);
    }

    this.store.setLives("S02", 3);

    this.ui.renderInventory();
    this.ui.showProgressBar(true);

    if (gameOver) {
      await this.ui.say("SYSTEM (AI 에코)", "불필요한 정보가 많아 표면 조사를 처음부터 다시 시작합니다.");
    }

    this.ui.clearOverlay();
    this.ui.clearHotspots();
    this.ui.setHotspotsEnabled(true);

    await this.scenes.goto("S02");
  }

  async inspect(item) {
    if (this.busy) return; // ✅ 다른 아이템 클릭 방지
    if (this.store.getFlag(`inspected:${item.id}`)) return;

    this.busy = true;
    this.ui.setHotspotsEnabled(false);
    
    if (this.store.getFlag(`inspected:${item.id}`)) return;

    this.ui.disableHotspot(item.id);

    const playerName = this.store.getFlag("playerName", "PLAYER");

    await this.ui.say(item.speaker, item.analysis);

    // ✅ 플레이어 대사는 버튼 띄우려고 wait:false
    await this.ui.say(playerName, item.player, { wait: false });

    // ✅ 모든 단서에 동일 버튼 제공
    const picked = await this.ui.waitTag([
      { id: "get", label: `인벤토리 획득`, variant: "good" },
      { id: "discard", label: "단서 폐기", variant: "danger" },
    ]);

    if (picked === "get" && item.inv) {
      this.store.addItem({
        ...item.inv,
        layer: "L1",
        analysis: item.analysis ?? "" // 수첩 분석용
      });

      this.ui.renderInventory();

      if (item.inv.type === "fake") {
        this.store.decLives("S02");
        this.ui.updateLivesUI(this.store.getLives("S02"));

        this.ui.playLifeLostFX();
        const left = this.store.getLives("S02");
        this.ui.updateLivesUI(left);

        this.lives -= 1;

        await this.ui.say(
          "SYSTEM (AI 에코)",
          `불필요한 정보 획득 감지. 기회 -1\n(남은 기회: ${left}/3)`,
          { noLog: true }
        );

        if (left <= 0) {
                await this.ui.showGameOverOverlay({
            title: "GAME OVER",
            sub: "기회를 모두 소진했습니다. 해당 방을 처음부터 다시 시작합니다."
          });
          await this.resetS02({ gameOver: true });
          return;
        }
      } else {
        await this.ui.say("SYSTEM (AI 에코)", "인벤토리에 저장되었습니다.", { noLog: true });
      }
    }


    if (picked === "discard") {
      await this.ui.say(
        "SYSTEM (AI 에코)",
        "단서를 폐기했습니다.",
        { noLog: true }
      );
    }

    // ✅ 여기서 "조사 완료"로 표시
    this.store.setFlag(`resolved:${item.id}`, true);
    this.updateProgressUI();

    // 조사 종료 처리
    this.busy = false;
    this.ui.setHotspotsEnabled(true);

  }
}
