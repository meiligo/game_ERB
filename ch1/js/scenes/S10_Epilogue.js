// js/scenes/S10_Epilogue.js
export class S10_Epilogue {
  constructor({ ui, store, scenes }) {
    this.ui = ui;
    this.store = store;
    this.scenes = scenes;
  }

  async showProjectTraceTitle({ holdMs = 2600 } = {}) {
    this.ui.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.left = "0";
    wrap.style.top = "0";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    wrap.style.background = "black";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "center";
    wrap.style.zIndex = "9999";
    wrap.style.opacity = "0";
    wrap.style.transition = "opacity 0.55s ease";

    // 컨테이너(중앙 정렬)
    const box = document.createElement("div");
    box.style.position = "relative";
    box.style.textAlign = "center";
    box.style.transform = "translateY(6px)";
    box.style.opacity = "0";
    box.style.transition = "transform 0.55s ease, opacity 0.55s ease";

    // ===== 메인 타이틀(글리치) =====
    const titleWrap = document.createElement("div");
    titleWrap.style.position = "relative";
    titleWrap.style.display = "inline-block";
    titleWrap.style.userSelect = "none";

    // 베이스 텍스트
    const base = document.createElement("div");
    base.textContent = "[Project TRACE]";
    base.style.color = "#e9f1ff";
    base.style.fontSize = "44px";
    base.style.letterSpacing = "0.18em";
    base.style.fontWeight = "650";
    base.style.fontFamily = "serif";
    base.style.textShadow = "0 0 18px rgba(120,160,255,.35)";

    // 글리치 레이어 1 (cyan)
    const g1 = document.createElement("div");
    g1.textContent = "[Project TRACE]";
    g1.style.position = "absolute";
    g1.style.left = "0";
    g1.style.top = "0";
    g1.style.color = "rgba(120,220,255,.9)";
    g1.style.mixBlendMode = "screen";
    g1.style.opacity = "0.0";
    g1.style.pointerEvents = "none";

    // 글리치 레이어 2 (magenta)
    const g2 = document.createElement("div");
    g2.textContent = "[Project TRACE]";
    g2.style.position = "absolute";
    g2.style.left = "0";
    g2.style.top = "0";
    g2.style.color = "rgba(255,120,220,.75)";
    g2.style.mixBlendMode = "screen";
    g2.style.opacity = "0.0";
    g2.style.pointerEvents = "none";

    titleWrap.appendChild(base);
    titleWrap.appendChild(g1);
    titleWrap.appendChild(g2);

    // ===== 서브 텍스트 =====
    const sub = document.createElement("div");
    sub.textContent = "[Chapter 1 Complete]";
    sub.style.marginTop = "14px";
    sub.style.color = "rgba(233,241,255,.72)";
    sub.style.fontSize = "14px";
    sub.style.letterSpacing = "0.22em";
    sub.style.fontWeight = "500";
    sub.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial";

    box.appendChild(titleWrap);
    box.appendChild(sub);
    wrap.appendChild(box);

    this.ui.addOverlayElement?.(wrap);

    // 페이드 인
    requestAnimationFrame(() => {
        wrap.style.opacity = "1";
        box.style.opacity = "1";
        box.style.transform = "translateY(0)";
    });

    // ===== 글리치/깜빡임 루프 =====
    //  - 일정 시간 동안 랜덤하게 흔들림/레이어 켜짐/클립 효과 흉내
    const start = performance.now();
    let rafId = null;

    const glitchTick = () => {
        const t = performance.now() - start;

        // 가끔씩만 글리치 발생
        const spike = Math.random() < 0.18; // 빈도
        const blink = Math.random() < 0.06; // 베이스 깜빡임

        // 베이스 살짝 깜빡
        base.style.opacity = blink ? "0.45" : "1";

        if (spike) {
        // 레이어 순간 점등 + 위치 흔들림
        const dx1 = (Math.random() * 10 - 5).toFixed(1);
        const dy1 = (Math.random() * 6 - 3).toFixed(1);
        const dx2 = (Math.random() * 12 - 6).toFixed(1);
        const dy2 = (Math.random() * 6 - 3).toFixed(1);

        g1.style.opacity = (0.35 + Math.random() * 0.35).toFixed(2);
        g2.style.opacity = (0.25 + Math.random() * 0.35).toFixed(2);

        g1.style.transform = `translate(${dx1}px, ${dy1}px)`;
        g2.style.transform = `translate(${dx2}px, ${dy2}px)`;

        // “슬라이스” 느낌: clip-path를 짧게 바꿔줌 (지원 안 되면 무시돼도 OK)
        const top = Math.floor(Math.random() * 70);
        const h = 10 + Math.floor(Math.random() * 18);
        const bottom = Math.min(100, top + h);
        const clip = `inset(${top}% 0 ${100 - bottom}% 0)`;
        g1.style.clipPath = clip;
        g2.style.clipPath = `inset(${Math.max(0, top - 4)}% 0 ${Math.max(0, 100 - bottom - 4)}% 0)`;

        // 짧게 켰다가 끔
        setTimeout(() => {
            g1.style.opacity = "0";
            g2.style.opacity = "0";
            g1.style.transform = "translate(0,0)";
            g2.style.transform = "translate(0,0)";
            g1.style.clipPath = "inset(0 0 0 0)";
            g2.style.clipPath = "inset(0 0 0 0)";
        }, 70 + Math.random() * 90);
        }

        // holdMs 동안 유지
        if (t < holdMs) {
        rafId = requestAnimationFrame(glitchTick);
        }
    };

    rafId = requestAnimationFrame(glitchTick);

    // 유지 시간 대기
    await new Promise((res) => setTimeout(res, holdMs));

    // RAF 중단
    if (rafId) cancelAnimationFrame(rafId);

    // 페이드 아웃
    wrap.style.opacity = "0";
    box.style.opacity = "0";

    await new Promise((res) => setTimeout(res, 650));
    wrap.remove();
  }


  async onEnter() {
    this.ui.hideLivesUI();
    this.ui.clearHotspots();
    this.ui.clearOverlay();
    this.ui.setStageBackground("#000");

    // 안전장치: 의지 엔딩이 아니면 되돌림
    if (this.store.getFlag("final:emotion", "") !== "ogi") {
      await this.ui.say("SYSTEM (AI 에코)", "잘못된 접근입니다. 메인 홀로 되돌립니다.", { wait: false });
      return this.scenes.goto("S09");
    }

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "타임라인 수정 확인.\n마차 출발 성공. 독립 자금 전달 완료.\n역사 데이터 복구율 100%. Chapter 1 클리어.",
      { wait: false }
    );

    await this.ui.say("한 소장", "비록 저 길의 끝이 죽음일지라도... 그는 후회하지 않을 거야. 스스로 선택했으니까.");
    await this.ui.say("체면 소장", "그의 뒷모습... 아주 당당하더군. 아름다웠어.");
    await this.ui.say("의지 소장", "잘했다, 관리자. 네가 그의 등을 밀어준 거야.");

    const playerName = this.store.getFlag("playerName", "PLAYER");
    await this.ui.say(playerName, "휴... 감정 하나가 역사를 이렇게 바꾸는구나.");

    await this.ui.say(
      "SYSTEM (AI 에코)",
      "수고하셨습니다. 하지만 아직 안심하긴 이릅니다.\n다음 왜곡 지점 좌표 생성 중...\n1592년. 부산포 인근. 또 다른 감정의 비명이 들립니다.",
      { wait: false }
    );

    await this.showProjectTraceTitle({ holdMs: 2600 });

    // 이동 선택
    const next = await this.ui.chooseCenter("다음으로", [
      { label: "타이틀로", value: "S00" },
      { label: "메인 홀 다시보기", value: "S09" },
      { label: "허브(S04)로", value: "S04" },
    ]);

    return this.scenes.goto(next || "S00");
  }
}
