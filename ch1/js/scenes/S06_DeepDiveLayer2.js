export class S06_DeepDiveLayer2 {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;

    this.busy = false;
    // 12개 (진실 6, 함정 6)
    this.items = [
      // 함정 6
      {
        id: "danggi_red",
        label: "붉은 댕기",
        truth: false,
        inv: { id: "danggi_red", title: "기생의 붉은 댕기", tag: "사건과 무관", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "여성용 장신구. 제작 연도 5년 전. 옛 연인의 물건으로 추정."',
        player: "이건 그냥 추억의 물건이야. 이번 사건이랑은 너무 동떨어져 있어."
      },
      {
        id: "jp_phrasebook",
        label: "회화 교본",
        truth: false,
        inv: { id: "jp_phrasebook", title: "일본어 회화 교본", tag: "학습 진도 10% 미만", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "기초 회화 서적. 학습 진도 10% 미만."',
        player: "밀정이나 배신자라고 의심하기엔 너무 기초적인 책이야. 그냥 공부 좀 하려던 거네."
      },
      {
        id: "broken_bowl_cat",
        label: "깨진 밥그릇",
        truth: false,
        inv: { id: "broken_bowl_cat", title: "깨진 밥그릇과 고양이 털", tag: "고양이 DNA", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "파손된 식기. 주변에서 고양이 DNA 검출."',
        player: "부부싸움이나 난동 흔적인 줄 알았는데, 고양이가 깬 거였어."
      },
      {
        id: "parents_letter",
        label: "부모님 서신",
        truth: false,
        inv: { id: "parents_letter", title: "부모님의 서신", tag: "평범한 안부", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "내용: \'날이 추우니 건강 조심하거라\'. 일상적 안부."',
        player: "가족 걱정 때문에 못 간 건가 싶지만, 내용이 너무 평범해. 결정적 원인은 아냐."
      },
      {
        id: "sealed_bottle",
        label: "미개봉 술병",
        truth: false,
        inv: { id: "sealed_bottle", title: "탁자 위 미개봉 술병", tag: "섭취 흔적 없음", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "밀봉 상태 양호. 알코올 섭취 흔적 없음."',
        player: "술 마시고 뻗은 것도 아니야. 맨정신으로 괴로워했던 거지."
      },
      {
        id: "old_map",
        label: "낡은 지도",
        truth: false,
        inv: { id: "old_map", title: "낡은 지도", tag: "한성 경로 평탄", type: "fake" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "목적지 \'한성\'에 표기. 경로는 평탄함."',
        player: "길을 몰라서 못 간 건 아니야."
      },

      // 결정적 단서 6
      {
        id: "dagger_halfdrawn",
        label: "단도",
        truth: true,
        inv: { id: "dagger_halfdrawn", title: "반쯤 뽑힌 단도", tag: "싸울 의지의 흔적", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "칼날에 지문 다수 검출. 뽑았다 넣었다를 반복한 마찰흔 존재."',
        player: "칼을 뽑으려 했어. 싸울 의지가 있었다는 거야! 무서워서 도망친 게 아니야."
      },
      {
        id: "torn_letter",
        label: "찢긴 편지",
        truth: true,
        inv: { id: "torn_letter", title: "찢겨진 편지", tag: "만류의 흔적", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "필적 대조 결과 타인. 내용 복원: \'...자네의 선택은 무모해...\'"',
        player: "누군가 말렸어. '무모하다'는 말이 그의 마음을 흔든 거야."
      },
      {
        id: "bloodstain_wall",
        label: "핏자국",
        truth: true,
        inv: { id: "bloodstain_wall", title: "벽의 핏자국", tag: "자기 분노의 폭발", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "타격에 의한 혈흔. 주먹 뼈와 일치하는 함몰 흔적."',
        player: "벽을 쳤어... 얼마나 분하고 답답했으면. 이건 자신에 대한 분노야."
      },
      {
        id: "cipher_table",
        label: "암호표",
        truth: true,
        inv: { id: "cipher_table", title: "독립 의군 암호표", tag: "군사 기밀 1급", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "특수 암호 해독표. 군사 기밀 등급: 1급."',
        player: "이 사람은 단순한 양반이 아니었어. 독립군 자금책... 목숨이 걸린 임무였어."
      },
      {
        id: "broken_watch",
        label: "회중시계",
        truth: true,
        inv: { id: "broken_watch", title: "깨진 회중시계", tag: "오시 15분 정지", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "외부 충격으로 파손. 멈춘 시각: 오시 15분 (마차 출발 직후)."',
        player: "마차가 떠나는 시간에 맞춰 시계를 던져버렸어. 가고 싶었지만, 결국 못 간 자신을 원망하면서."
      },
      {
        id: "burned_blood_oath",
        label: "혈서",
        truth: true,
        inv: { id: "burned_blood_oath", title: "불타다 만 혈서", tag: "국권 회복 맹세", type: "truth" },
        speaker: "SYSTEM (AI 에코)",
        analysis: 'AI 분석: "혈액 반응 양성. \'국권 회복\' 문구 식별 가능."',
        player: "피로 쓴 맹세... 그는 진심이었어. 장난이나 흥 따위로 치부할 일이 아니야."
      }
    ];

        // ✅ S06에서만 얻는 단서들(진실 6 + 함정 6) id 목록
    const S06_IDS = [
      "danggi_red","jp_phrasebook","broken_bowl_cat","parents_letter","sealed_bottle","old_map",
      "dagger_halfdrawn","torn_letter","bloodstain_wall","cipher_table","broken_watch","burned_blood_oath"
    ];


    // 대충 배치(너 UI 핫스팟 방식대로)
    this.placements = [
      { x: 140, y: 130, w: 120, h: 90 },
      { x: 420, y: 420, w: 120, h: 90 },
      { x: 760, y: 420, w: 120, h: 90 },
      { x: 980, y: 160, w: 120, h: 90 },
      { x: 220, y: 520, w: 120, h: 90 },
      { x: 520, y: 520, w: 120, h: 90 },
      { x: 820, y: 520, w: 120, h: 90 },
      { x: 340, y: 260, w: 120, h: 90 },
      { x: 220, y: 130, w: 120, h: 90 },
      { x: 660, y: 320, w: 120, h: 90 },
      { x: 160, y: 320, w: 120, h: 90 },
      { x: 560, y: 320, w: 120, h: 90 },
    ];
  }

  countResolved() {
    return this.items.filter(it => this.store.getFlag(`L2:inspected:${it.id}`, false)).length;
  }

  isAllResolved() {
    return this.countResolved() === this.items.length;
  }

  updateProgressUI() {
    const done = this.countResolved();
    const total = this.items.length;

    // ✅ UI가 없을 수도 있으니 optional로
    this.ui.setInvestigationProgress?.({ done, total });
    this.ui.setCompleteEnabled?.(done === total);
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
      await this.scenes.goto("S07");
    }
  }

  async onEnter() {
    this.ui.showLivesUI(3);
    this.ui.updateLivesUI(this.store.getFlag("lives:S06", 3));

    this.ui.createLivesUI(3);
    this.ui.updateLivesUI(this.store.getLives("S06"));

    // ✅ S06 목숨(기회) 3 (없으면 세팅)
    if (this.store.getLives("S06") == null) {
      this.store.setLives("S06", 3);
    }

    this.ui.showProgressBar(true);
    this.updateProgressUI();
    this.ui.clearOverlay();
    this.busy = false;                 
    this.ui.setHotspotsEnabled(true);
    this.ui.clearHotspots();
    this.ui.setStageBackground("linear-gradient(135deg, #220000, #0b0b0b)");

    // “붉은 윤곽선” 느낌(핫스팟 자체를 빨갛게 보이게 하고 싶으면 CSS로)
    // 여기선 안내만
    await this.ui.say(
      "SYSTEM (AI 에코)",
      "정밀 탐색 모드 시작.\n결정적인 단서 6개를 확보하고, 거짓 데이터(함정)를 폐기하십시오."
    );

    this.items.forEach((it, idx) => {
      const p = this.placements[idx];
      this.ui.addHotspot({
        id: it.id,
        ...p,
        label: it.label,
        className: "hotspot deepHotspot",
        onClick: () => this.inspect(it),
      });
    });

    // 🔽 🔽 🔽 여기 추가 🔽 🔽 🔽
    // ✅ 진행 UI 초기화
    this.totalCount = this.items.length;
    this.updateProgressUI();

    if (this.ui.btnComplete) {
      this.ui.btnComplete.onclick = async () => {
        if (!this.isAllResolved()) return;
        await this.scenes.goto("S07");
      };
    }
  }

  async resetS06({ gameOver = false } = {}) {
    // ✅ L2에서 얻은 인벤토리만 제거 (S02(L1)은 유지!)
    this.busy = false;
    this.ui.setHotspotsEnabled(true);
    this.store.setLives("S06", 3);
    this.ui.updateLivesUI(3);

    this.store.removeItemsByLayer("L2");

    // ✅ L2 관련 플래그만 제거
    for (const it of this.items) {
      this.store.setFlag(`L2:inspected:${it.id}`, false);
      // 네 코드가 resolved를 쓰면 이것도 같이:
      this.store.setFlag(`resolved:${it.id}`, false);
      // inspected를 쓰면 이것도 같이:
      this.store.setFlag(`inspected:${it.id}`, false);
    }

    // ✅ 목숨 초기화
    this.store.setLives("S06", 3);

    // UI 갱신
    this.ui.renderInventory();
    this.ui.showProgressBar(true);

    if (gameOver) {
      await this.ui.say("SYSTEM (AI 에코)", "불필요한 정보가 많아 심층 조사를 처음부터 다시 시작합니다.");
    }

    // ✅ S06 처음부터 재진입
    this.ui.clearOverlay();
    this.ui.clearHotspots();
    this.ui.setHotspotsEnabled(true);
    await this.scenes.goto("S06");
  }

  async inspect(item) {
    if (this.busy) return;
    if (this.store.getFlag(`L2:inspected:${item.id}`)) return;
    if (this.store.getFlag(`inspected:${item.id}`)) return; // ✅ 여기로 옮김

    this.busy = true;
    this.ui.setHotspotsEnabled(false);

    try {
      this.ui.disableHotspot(item.id);

      const playerName = this.store.getFlag("playerName", "PLAYER");

      await this.ui.say(item.speaker, item.analysis);
      await this.ui.say(playerName, item.player, { wait: false });

      const picked = await this.ui.waitTag([
        { id: "get", label: `인벤토리 획득`, variant: "good" },
        { id: "discard", label: "단서 폐기", variant: "danger" },
      ]);

      if (picked === "get" && item.inv) {
        // ✅ S06에서 먹은 건 layer=L2로 표시 (초기화 때 L2만 지우려고)
        this.store.addItem({
          ...item.inv,
          layer: "L2",
          analysis: item.analysis ?? ""
        });

        this.ui.renderInventory();

        // ✅ 가짜 단서 “획득”이면 목숨 -1
        if (item.inv.type === "fake") {
          this.store.decLives("S06");
          this.ui.updateLivesUI(this.store.getLives("S06"));

          this.ui.playLifeLostFX();
          const left = this.store.getLives("S06");
          this.ui.updateLivesUI(left);

          this.lives -= 1;

          await this.ui.say(
            "SYSTEM (AI 에코)",
            `불필요한 정보 획득 감지. 기회 -1\n(남은 기회: ${left}/3)`,
            { noLog: true }
          );

          // ✅ 목숨 0 → GAME OVER → S06만 초기화 (S02 단서는 유지)
          if (left <= 0) {
            await this.ui.showGameOverOverlay({
              title: "GAME OVER",
              sub: "기회를 모두 소진했습니다. 해당 해당 방을 처음부터 다시 시작합니다."
            });
            await this.resetS06({ gameOver: true });
            return;
          }
        } else {
          await this.ui.say("SYSTEM (AI 에코)", "인벤토리에 저장되었습니다.", { noLog: true });
        }
      }

      if (picked === "discard") {
        await this.ui.say("SYSTEM (AI 에코)", "단서를 폐기했습니다.", { noLog: true });
      }

      this.store.setFlag(`L2:inspected:${item.id}`, true);
      this.updateProgressUI?.(); // ✅ 안전 호출
    } finally {
      this.busy = false;
      this.ui.setHotspotsEnabled(true);
    }
    if (this.isAllResolved()) {
      if (this.isAllResolved()) {
        this.ui.setCompleteEnabled?.(true);
      }
    }
  }
}