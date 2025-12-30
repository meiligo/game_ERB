export class S00_Title {
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
    base.textContent = "[Chapter 1. 마차는 왜 멈췄는가]";
    base.style.color = "#e9f1ff";
    base.style.fontSize = "44px";
    base.style.letterSpacing = "0.18em";
    base.style.fontWeight = "650";
    base.style.fontFamily = "serif";
    base.style.textShadow = "0 0 18px rgba(120,160,255,.35)";

    // 글리치 레이어 1 (cyan)
    const g1 = document.createElement("div");
    g1.textContent = "[Chapter 1. 마차는 왜 멈췄는가]";
    g1.style.position = "absolute";
    g1.style.left = "0";
    g1.style.top = "0";
    g1.style.color = "rgba(120,220,255,.9)";
    g1.style.mixBlendMode = "screen";
    g1.style.opacity = "0.0";
    g1.style.pointerEvents = "none";

    // 글리치 레이어 2 (magenta)
    const g2 = document.createElement("div");
    g2.textContent = "[Chapter 1. 마차는 왜 멈췄는가]";
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


    box.appendChild(titleWrap);
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
    this.ui.showProgressBar(false);
    this.ui.setStageBackground("#000");
    this.ui.clearHotspots();

    await this.showProjectTraceTitle({ holdMs: 2600 });

    await this.scenes.goto("S01");
  }
}
