export class UI {
  constructor(store) {
    this.store = store;
    
    this.stage = document.getElementById("stage");
    this.stageOverlay = document.getElementById("stageOverlay");
    this.hotspots = document.getElementById("hotspots");

    this.nameBox = document.getElementById("nameBox");
    this.textBox = document.getElementById("textBox");
    this.choices = document.getElementById("choices");
    this.inventory = document.getElementById("inventory");

    this.logModal = document.getElementById("logModal");
    this.logBody = document.getElementById("logBody");
    this.btnLog = document.getElementById("btnLog");
    this.btnSkip = document.getElementById("btnSkip");
    this.btnCloseLog = document.getElementById("btnCloseLog");
    this.lifeBar = document.getElementById("lifeBar");

    this.btnNotebook = document.getElementById("btnNotebook");
    this.notebook = document.getElementById("notebook");
    this.notebookContent = document.getElementById("notebookContent");   
    this.lifeBar = document.getElementById("lifeBar");
     
    // ✅ 수첩 DOM이 없으면 죽지 않게 가드
    if (this.btnNotebook && this.notebook) {
      this.btnNotebook.onclick = () => {
        this.notebook.classList.toggle("hidden");
        this.renderNotebook?.();
      };
    }

    // ✅ 수첩 닫기 버튼(선택)
    this.btnCloseNotebook = document.getElementById("btnCloseNotebook");
    if (this.btnCloseNotebook && this.notebook) {
      this.btnCloseNotebook.onclick = () => {
        this.notebook.classList.add("hidden");
      };
    }

    this.progressBar = document.getElementById("progressBar");
    this.progressText = document.getElementById("progressText");
    this.btnComplete = document.getElementById("btnComplete");

    this.dialogueEl = document.getElementById("dialogue");

    this.dialogueEl.addEventListener("click", (e) => {
    // 선택지/태그 버튼 클릭은 advance 처리 금지
      if (e.target.closest(".choiceBtn")) return;
      if (e.target.closest(".actionTag")) return;
      this.advance();
    });

    this._advanceResolver = null;

    this.actionTags = document.getElementById("actionTags");

    // 없으면 생성(지금은 index.html에 이미 있으니 보통 여기 안 탐)
    if (!this.actionTags) {
      this.actionTags = document.createElement("div");
      this.actionTags.id = "actionTags";
      this.actionTags.className = "actionTags";
      this.textBox.insertAdjacentElement("afterend", this.actionTags);
    }

    // ===== typewriter 상태 =====
    this.isTyping = false;
    this._fullText = "";
    this._typingTimer = null;
    this._typingResolve = null;

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") this.advance();
    });
    this.textBox.addEventListener("click", () => this.advance());
    this.nameBox.addEventListener("click", () => this.advance());

    this.renderInventory();
  }

  finishTyping() {
    if (!this.isTyping) return;

    this.isTyping = false;

    if (this._typingTimer) {
      clearTimeout(this._typingTimer); // ✅ clearInterval -> clearTimeout
      this._typingTimer = null;
    }

    this.textBox.textContent = this._fullText;

    // ✅ typeText()가 기다리는 Promise를 즉시 종료
    if (this._typingResolve) {
      const r = this._typingResolve;
      this._typingResolve = null;
      r();
    }
  }

  async typeText(text, { cps = 45 } = {}) {
    this.isTyping = true;
    this._fullText = text;
    this.textBox.textContent = "";

    // ✅ cps -> ms per char
    const msPerChar = Math.max(10, Math.round(1000 / cps));
    let i = 0;

    // 기존 구조 유지: finishTyping()에서 resolve를 호출할 수 있게 저장
    return new Promise((resolve) => {
      this._typingResolve = resolve;

      // ✅ setInterval 대신 setTimeout + 절대시간 스케줄링
      const start = performance.now();

      const tick = () => {
        // finishTyping()이 호출되어 이미 끝났다면 중단
        if (!this.isTyping) return;

        i++;
        this.textBox.textContent = text.slice(0, i);

        if (i >= text.length) {
          this._typingTimer = null;
          this.isTyping = false;

          const r = this._typingResolve;
          this._typingResolve = null;
          r?.();
          return;
        }

        // ✅ 다음 글자 출력 시점 = start + (i+1)*msPerChar
        const target = start + (i + 1) * msPerChar;
        const now = performance.now();
        const delay = Math.max(0, Math.round(target - now));

        this._typingTimer = setTimeout(tick, delay);
      };

      // 첫 틱 예약
      this._typingTimer = setTimeout(tick, msPerChar);
    });
  }


  showProgressBar(show) {
    if (!this.progressBar) return;
    this.progressBar.classList.toggle("hidden", !show);
  }

  setInvestigationProgress({ done, total }) {
    if (this.progressText) {
      const remain = Math.max(0, total - done);
      this.progressText.textContent = `남은 조사: ${remain} / ${total}`;
    }
  }

  setCompleteEnabled(enabled) {
    if (!this.btnComplete) return;
    this.btnComplete.disabled = !enabled;
  }

  bindGlobalButtons() {
    this.btnLog.addEventListener("click", () => this.openLog());
    this.btnCloseLog.addEventListener("click", () => this.closeLog());
    this.btnSkip.addEventListener("click", () => this.advance());
  }

  setStageBackground(bg) {
    this.stage.style.background = bg;
  }

  clearOverlay() {
    this.stageOverlay.innerHTML = "";
  }

  addOverlayElement(el) {
    this.stageOverlay.appendChild(el);
  }

  clearHotspots() {
    this.hotspots.innerHTML = "";
  }

  addHotspot({ id, x, y, w, h, label, onClick }) {
    const btn = document.createElement("button");
    btn.className = "hotspot";
    if (btn.className) btn.classList.add(btn.className);

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.width = `${w}px`;
    btn.style.height = `${h}px`;
    btn.dataset.id = id;
    btn.textContent = label;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick?.();
    });
    this.hotspots.appendChild(btn);
    return btn;
  }

  disableHotspot(id) {
    const el = this.hotspots.querySelector(`[data-id="${id}"]`);
    if (el) el.classList.add("disabled");
  }

// ✅ 스테이지 DOM을 잡는 헬퍼 (너 프로젝트에서 맞는 selector 1개만 남겨도 됨)
getStageEl() {
  return (
    this.stage ||
    document.querySelector("#stage") ||
    document.querySelector(".stage") ||
    document.querySelector("#stageArea") ||
    document.querySelector(".stageArea")
  );
}

// ✅ 조사 파트 시작할 때 호출: 하트 UI 생성 + 표시
showLivesUI(max = 3) {
  const stage = this.getStageEl();
  if (!stage) return;

  stage.classList.add("hasLivesUI");

  // 이미 만들어져 있으면 그냥 표시만
  if (!this.livesWrap) {
    const wrap = document.createElement("div");
    wrap.className = "livesWrap";

    for (let i = 0; i < max; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      wrap.appendChild(heart);
    }

    stage.appendChild(wrap);
    this.livesWrap = wrap;
    this.livesMax = max;
  }

  this.livesWrap.style.display = "flex";
}

// ✅ 조사 파트 끝나면 호출: 하트 UI 숨김(삭제 말고 숨김)
hideLivesUI() {
  if (this.livesWrap) this.livesWrap.style.display = "none";
}

// ✅ 하트 갱신
updateLivesUI(current) {
  if (!this.livesWrap) return;
  const hearts = [...this.livesWrap.children];

  hearts.forEach((h, i) => {
    // 잔여 효과 제거(선택)
    h.classList.remove("heartPop");

    // ✅ i=0,1은 살아있고 i>=2만 dead (current=2일 때)
    h.classList.toggle("dead", i >= current);
  });
}


// ✅ 목숨 감소 연출: 하트 팡 + 스테이지 흔들림
playLifeLostFX() {
  // 하트 “팡”
  if (this.livesWrap) {
    const hearts = [...this.livesWrap.children];
    const alive = hearts.filter(h => !h.classList.contains("dead"));
    const target = alive[alive.length - 1];  
    if (target) {
      target.classList.remove("heartPop");
      void target.offsetWidth;
      target.classList.add("heartPop");

      // ✅ heartPop 끝나면 제거해서 다시 heartBeat가 보이게
      setTimeout(() => {
        target.classList.remove("heartPop");
      }, 380);
    }
  }

  // 화면 흔들림
  const stage = this.getStageEl();
  if (stage) {
    stage.classList.remove("stageShake");
    void stage.offsetWidth;
    stage.classList.add("stageShake");
    setTimeout(() => stage.classList.remove("stageShake"), 420);
  }
}

  async showGameOverOverlay({
    title = "SYSTEM FAILURE",
    sub = "PROCESS HALTED",
    holdMs = 1900,
  } = {}) {
    // 기존 오버레이가 있다면 정리(있어도 되고 없어도 됨)
    this.clearOverlay?.();

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "rgba(0, 0, 0, 0.92)";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 260ms ease";

    // 블루 스캔라인(가로 줄)
    const scan = document.createElement("div");
    scan.style.position = "absolute";
    scan.style.left = "0";
    scan.style.top = "0";
    scan.style.width = "100%";
    scan.style.height = "100%";
    scan.style.background =
      "repeating-linear-gradient(0deg, rgba(140,190,255,.14) 0px, rgba(140,190,255,.06) 1px, rgba(0,0,0,0) 3px)";
    scan.style.opacity = "0.35";
    scan.style.mixBlendMode = "screen";
    scan.style.pointerEvents = "none";
    overlay.appendChild(scan);

    // 은은한 블루 비네팅
    const vignette = document.createElement("div");
    vignette.style.position = "absolute";
    vignette.style.left = "0";
    vignette.style.top = "0";
    vignette.style.width = "100%";
    vignette.style.height = "100%";
    vignette.style.background =
      "radial-gradient(circle at center, rgba(50,120,255,.0) 0%, rgba(50,120,255,.06) 55%, rgba(50,120,255,.22) 100%)";
    vignette.style.pointerEvents = "none";
    overlay.appendChild(vignette);

    // 글리치 노이즈(살짝)
    const noise = document.createElement("div");
    noise.style.position = "absolute";
    noise.style.left = "0";
    noise.style.top = "0";
    noise.style.width = "100%";
    noise.style.height = "100%";
    noise.style.backgroundImage =
      "repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0px, rgba(255,255,255,.01) 1px, rgba(0,0,0,0) 3px)";
    noise.style.opacity = "0.18";
    noise.style.mixBlendMode = "overlay";
    noise.style.pointerEvents = "none";
    overlay.appendChild(noise);

    // 중앙 패널
    const panel = document.createElement("div");
    panel.style.position = "relative";
    panel.style.textAlign = "center";
    panel.style.padding = "22px 26px";
    panel.style.borderRadius = "16px";
    panel.style.border = "1px solid rgba(120,180,255,.22)";
    panel.style.background = "rgba(20, 35, 70, 0.16)";
    panel.style.backdropFilter = "blur(10px)";
    panel.style.boxShadow = "0 18px 80px rgba(0,0,0,.55)";
    panel.style.transform = "translateY(10px) scale(.985)";
    panel.style.opacity = "0";
    panel.style.transition = "transform 260ms ease, opacity 260ms ease";

    const h1 = document.createElement("div");
    h1.textContent = title;
    h1.style.fontSize = "38px";
    h1.style.letterSpacing = "0.18em";
    h1.style.fontWeight = "700";
    h1.style.color = "rgba(210,235,255,.96)";
    h1.style.textShadow = "0 0 18px rgba(80,150,255,.25)";
    h1.style.marginBottom = "10px";

    const p = document.createElement("div");
    p.textContent = sub;
    p.style.fontSize = "13px";
    p.style.letterSpacing = "0.14em";
    p.style.opacity = "0.82";
    p.style.lineHeight = "1.6";
    p.style.whiteSpace = "pre-line";
    p.style.color = "rgba(210,235,255,.82)";

    // 작은 “REBOOTING…” 라인
    const reboot = document.createElement("div");
    reboot.textContent = "REBOOTING…";
    reboot.style.marginTop = "14px";
    reboot.style.fontSize = "11px";
    reboot.style.letterSpacing = "0.26em";
    reboot.style.opacity = "0.65";
    reboot.style.color = "rgba(180,220,255,.75)";

    panel.appendChild(h1);
    panel.appendChild(p);
    panel.appendChild(reboot);
    overlay.appendChild(panel);

    // 깜빡임/글리치 효과(짧게)
    let glitchTimer = null;
    const glitchOnce = () => {
      // 살짝 흔들림 + 라인 강조
      panel.style.transform = "translateY(0) translateX(-2px) scale(1)";
      scan.style.opacity = "0.55";
      setTimeout(() => {
        panel.style.transform = "translateY(0) translateX(2px) scale(1)";
      }, 60);
      setTimeout(() => {
        panel.style.transform = "translateY(0) translateX(0) scale(1)";
        scan.style.opacity = "0.35";
      }, 120);

      // 글자 깜빡
      h1.style.opacity = "0.55";
      setTimeout(() => (h1.style.opacity = "1"), 90);
    };

    // 추가 애니메이션: scanline이 위아래로 미세 이동
    let scanPos = 0;
    let rafId = null;
    const scanAnim = () => {
      scanPos = (scanPos + 0.6) % 6; // 0~6px
      scan.style.transform = `translateY(${scanPos}px)`;
      rafId = requestAnimationFrame(scanAnim);
    };

    // 부착
    this.addOverlayElement?.(overlay);

    // 페이드 인
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0) scale(1)";
    });

    // 애니 시작
    rafId = requestAnimationFrame(scanAnim);
    glitchTimer = setInterval(() => {
      if (Math.random() < 0.55) glitchOnce();
    }, 220);

    // 유지
    await new Promise((res) => setTimeout(res, holdMs));

    // 정리
    if (glitchTimer) clearInterval(glitchTimer);
    if (rafId) cancelAnimationFrame(rafId);

    // 페이드 아웃
    overlay.style.opacity = "0";
    panel.style.opacity = "0";
    panel.style.transform = "translateY(10px) scale(.985)";
    await new Promise((res) => setTimeout(res, 320));
    overlay.remove();
  }


  // // ✅ GAME OVER 오버레이 (스테이지 중앙 / 페이드 + 글리치)
  // async showGameOverOverlay({ title = "GAME OVER", sub = "조사를 처음부터 다시 시작합니다..." } = {}) {
  //   const stage = this.getStageEl();
  //   if (!stage) return;

  //   stage.querySelector(".gameOverOverlay")?.remove();

  //   const ov = document.createElement("div");
  //   ov.className = "gameOverOverlay";
  //   ov.innerHTML = `
  //     <div class="goInner">
  //       <div class="goTitle" data-text="${escapeHtml(title)}">${escapeHtml(title)}</div>
  //       <div class="goSub">${escapeHtml(sub)}</div>
  //     </div>
  //     <div class="goNoise"></div>
  //   `;
  //   stage.appendChild(ov);

  //   requestAnimationFrame(() => ov.classList.add("show"));

  //   await new Promise(r => setTimeout(r, 1400)); // 보여주는 시간
  //   ov.classList.remove("show");
  //   await new Promise(r => setTimeout(r, 250));
  //   ov.remove();
  // }

  showLifeBar(on) {
    if (!this.lifeBar) return;
    this.lifeBar.style.display = on ? "flex" : "none";
  }

  setLives(cur, max = 3) {
    if (!this.lifeBar) return;

    this.lifeBar.innerHTML = "";
    for (let i = 0; i < max; i++) {
      const s = document.createElement("span");
      s.className = "heart" + (i < cur ? " on" : "");
      s.textContent = "♥";
      this.lifeBar.appendChild(s);
    }
  }

createLivesUI(max = 3) {
  this.livesWrap?.remove();

  const wrap = document.createElement("div");
  wrap.className = "livesWrap";

  for (let i = 0; i < max; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    wrap.appendChild(heart);
  }

  // ✅ 여기만 변경: body가 아니라 stage에 붙이기
  const stage = this.getStageEl();
  if (stage) {
    stage.classList.add("hasLivesUI");
    stage.appendChild(wrap);
  } else {
    // stage를 못 찾으면 fallback
    document.body.appendChild(wrap);
  }

  this.livesWrap = wrap;
  this.livesMax = max;
}

updateLivesUI(current) {
  if (!this.livesWrap) return;
  const hearts = [...this.livesWrap.children];
  hearts.forEach((h, i) => {
    h.classList.toggle("dead", i >= current);
  });
}

  // =========================
  // [추가] Center 선택지(귀문 메뉴)
  // =========================
  chooseCenter(titleText, options) {
    this.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "centerChoiceWrap";

    const title = document.createElement("div");
    title.className = "centerChoiceTitle";
    title.textContent = titleText;

    const list = document.createElement("div");
    list.className = "centerChoiceList";

    wrap.appendChild(title);
    wrap.appendChild(list);

    this.addOverlayElement?.(wrap);

    return new Promise((resolve) => {
      options.forEach((opt) => {
        const b = document.createElement("button");
        b.className = "centerChoiceBtn";
        b.textContent = opt.label;

        if (opt.disabled) {
          b.disabled = true;
          b.classList.add("isDisabled");
        }

        b.addEventListener("click", () => {
          wrap.remove();
          resolve(opt.value);
        });

        list.appendChild(b);
      });
    });
  }

  // =========================
  // [추가] 인벤토리 기반 증거 선택 오버레이
  // - 방에서 "(증거로 보일 아이템을 선택하시오)" 출력 후 사용
  // - resolve: 선택된 item.id or null
  // =========================
  chooseEvidenceFromInventory({ title = "증거로 보일 아이템을 선택하시오" } = {}) {
    this.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "evidencePicker";

    const titleEl = document.createElement("div");
    titleEl.className = "evidenceTitle";
    titleEl.textContent = title;

    const list = document.createElement("div");
    list.className = "evidenceList";

    const footer = document.createElement("div");
    footer.className = "evidenceFooter";

    const cancel = document.createElement("button");
    cancel.className = "evidenceCancel";
    cancel.textContent = "취소";

    footer.appendChild(cancel);
    wrap.appendChild(titleEl);
    wrap.appendChild(list);
    wrap.appendChild(footer);

    this.addOverlayElement?.(wrap);

    const inv = this.store?.inventory ?? [];

    return new Promise((resolve) => {
      if (inv.length === 0) {
        const empty = document.createElement("div");
        empty.className = "evidenceEmpty";
        empty.textContent = "(인벤토리에 증거가 없습니다)";
        list.appendChild(empty);
      } else {
        inv.forEach((it) => {
          const b = document.createElement("button");
          b.className = "evidenceBtn";
          b.innerHTML = `
            <div class="evName">${escapeHtml(it.title ?? it.id ?? "")}</div>
            <div class="evTag">${escapeHtml(it.tag ?? "")}</div>
            <div class="evAnalysis">${escapeHtml(it.analysis ?? "")}</div>
          `;
          b.onclick = () => {
            wrap.remove();
            resolve(it.id);
          };
          list.appendChild(b);
        });
      }

      cancel.onclick = () => {
        wrap.remove();
        resolve(null);
      };
    });
  }

  // =========================
  // [추가] 수첩 모달(증거 정리)
  // - inventory 기반: title/tag/analysis 보여줌
  // =========================
  openNotebook() {
    this.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "notebookModal";

    const header = document.createElement("div");
    header.className = "notebookHeader";

    const title = document.createElement("div");
    title.className = "notebookTitle";
    title.textContent = "수첩 (증거 정리)";

    const close = document.createElement("button");
    close.className = "notebookClose";
    close.textContent = "닫기";

    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement("div");
    body.className = "notebookBody";

    wrap.appendChild(header);
    wrap.appendChild(body);

    this.addOverlayElement?.(wrap);

    const inv = this.store?.inventory ?? [];
    if (inv.length === 0) {
      body.innerHTML = `<div class="notebookEmpty">(기록된 증거가 없습니다)</div>`;
    } else {
      body.innerHTML = inv.map(it => `
        <div class="noteCard">
          <div class="noteName">${escapeHtml(it.title ?? it.id ?? "")}</div>
          <div class="noteTag">${escapeHtml(it.tag ?? "")}</div>
          <div class="noteAnalysis">${escapeHtml(it.analysis ?? "")}</div>
        </div>
      `).join("");
    }

    close.onclick = () => wrap.remove();
  }

  renderInventory() {
    this.inventory.innerHTML = "";
    for (const it of this.store.inventory) {
      const card = document.createElement("div");
      card.className = "invItem";
      card.innerHTML = `
        <div class="invItemTitle">${escapeHtml(it.title)}</div>
        <div class="invItemTag ${it.type === "fake" ? "fakeTag" : ""}">
          ${escapeHtml(it.tag ?? "")}
        </div>
      `;
      card.addEventListener("click", (e) => {
        e.stopPropagation(); // advance 방지
        this.nameBox.textContent = "INVENTORY";
        this.textBox.textContent =
          `${it.title}\n${it.analysis ?? ""}\n${it.tag ?? ""}`;
      });

      this.inventory.appendChild(card);
    }
    this.renderNotebook?.();
  }

  renderNotebook() {
    if (!this.notebookContent) return;

    this.notebookContent.innerHTML = "";
    const inv = this.store?.inventory ?? [];

    if (inv.length === 0) {
      const div = document.createElement("div");
      div.className = "notebookEntry";
      div.textContent = "• (기록된 증거가 없습니다)";
      this.notebookContent.appendChild(div);
      return;
    }

    inv.forEach(it => {
      const div = document.createElement("div");
      div.className = "notebookEntry";
      div.innerHTML = `
        <div class="t">${escapeHtml(it.title ?? it.id ?? "")}</div>
        <div class="a">${escapeHtml(it.analysis ?? "")}</div>
        <div class="tag">${escapeHtml(it.tag ?? "")}</div>
      `;
      this.notebookContent.appendChild(div);
    });
  }

  // ✅ 인벤토리 카드 클릭을 1회 기다렸다가 item.id를 resolve
  waitInventoryPick() {
    return new Promise((resolve) => {
      const cards = Array.from(this.inventory?.querySelectorAll(".invItem") ?? []);
      if (cards.length === 0) return resolve(null);

      const handlers = [];

      cards.forEach((card, idx) => {
        const it = this.store.inventory[idx];
        const h = (e) => {
          e.stopPropagation();
          cleanup();
          resolve(it?.id ?? null);
        };
        handlers.push([card, h]);
        card.addEventListener("click", h, { once: true });
      });

      const cleanup = () => {
        handlers.forEach(([el, fn]) => el.removeEventListener("click", fn));
      };
    });
  }

  // ✅ [추가] 인벤토리에서 증거 선택(센터 오버레이)
  chooseEvidenceFromInventory() {
    this.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "evidencePicker";

    const title = document.createElement("div");
    title.className = "evidenceTitle";
    title.textContent = "증거 선택";

    const list = document.createElement("div");
    list.className = "evidenceList";

    const footer = document.createElement("div");
    footer.className = "evidenceFooter";

    const cancel = document.createElement("button");
    cancel.className = "evidenceCancel";
    cancel.textContent = "취소";

    footer.appendChild(cancel);
    wrap.appendChild(title);
    wrap.appendChild(list);
    wrap.appendChild(footer);

    this.addOverlayElement?.(wrap);

    const inv = this.store?.inventory ?? [];

    return new Promise((resolve) => {
      if (inv.length === 0) {
        const empty = document.createElement("div");
        empty.className = "evidenceEmpty";
        empty.textContent = "(인벤토리에 증거가 없습니다)";
        list.appendChild(empty);
      } else {
        inv.forEach(it => {
          const b = document.createElement("button");
          b.className = "evidenceBtn";
          b.innerHTML = `
            <div class="evName">${escapeHtml(it.title ?? it.id ?? "")}</div>
            <div class="evTag">${escapeHtml(it.tag ?? "")}</div>
          `;
          b.onclick = () => {
            wrap.remove();
            resolve(it.id);
          };
          list.appendChild(b);
        });
      }

      cancel.onclick = () => {
        wrap.remove();
        resolve(null);
      };
    });
  }

    // ✅ [추가] Break Mode 전용: 인벤토리에서 "여러 개" 증거 선택
  // - maxPick: 최대 선택 개수 (예: 1~3)
  // - minPick: 최소 선택 개수 (예: required가 2개면 2)
  // resolve: 선택된 item.id 배열
  chooseEvidenceMultiFromInventory({
    title = "증거를 선택하십시오",
    minPick = 1,
    maxPick = 2,
    confirmLabel = "제시한다",
    cancelLabel = "취소",
  } = {}) {
    this.clearOverlay?.();

    const wrap = document.createElement("div");
    wrap.className = "evidencePicker";

    const titleEl = document.createElement("div");
    titleEl.className = "evidenceTitle";
    titleEl.textContent = `${title} (${minPick}~${maxPick}개)`;

    const list = document.createElement("div");
    list.className = "evidenceList";

    const footer = document.createElement("div");
    footer.className = "evidenceFooter";

    const info = document.createElement("div");
    info.className = "evidenceInfo";
    info.textContent = "선택: 0개";

    const btnCancel = document.createElement("button");
    btnCancel.className = "evidenceCancel";
    btnCancel.textContent = cancelLabel;

    const btnOk = document.createElement("button");
    btnOk.className = "evidenceOk";
    btnOk.textContent = confirmLabel;
    btnOk.disabled = true;

    footer.appendChild(info);
    footer.appendChild(btnCancel);
    footer.appendChild(btnOk);

    wrap.appendChild(titleEl);
    wrap.appendChild(list);
    wrap.appendChild(footer);

    this.addOverlayElement?.(wrap);

    const inv = this.store?.inventory ?? [];
    const picked = new Set();

    const refresh = () => {
      info.textContent = `선택: ${picked.size}개`;
      btnOk.disabled = !(picked.size >= minPick && picked.size <= maxPick);
    };

    return new Promise((resolve) => {
      if (inv.length === 0) {
        const empty = document.createElement("div");
        empty.className = "evidenceEmpty";
        empty.textContent = "(인벤토리에 증거가 없습니다)";
        list.appendChild(empty);
        refresh();
      } else {
        inv.forEach((it) => {
          const b = document.createElement("button");
          b.className = "evidenceBtn";
          b.innerHTML = `
            <div class="evName">${escapeHtml(it.title ?? it.id ?? "")}</div>
            <div class="evTag">${escapeHtml(it.tag ?? "")}</div>
            <div class="evAnalysis">${escapeHtml(it.analysis ?? "")}</div>
          `;

          b.addEventListener("click", () => {
            const id = it.id;

            // toggle
            if (picked.has(id)) {
              picked.delete(id);
              b.classList.remove("picked");
            } else {
              if (picked.size >= maxPick) return; // 최대 선택 제한
              picked.add(id);
              b.classList.add("picked");
            }
            refresh();
          });

          list.appendChild(b);
        });

        refresh();
      }

      btnCancel.onclick = () => {
        wrap.remove();
        resolve([]);
      };

      btnOk.onclick = () => {
        wrap.remove();
        resolve([...picked]);
      };
    });
  }


  setHotspotsEnabled(enabled) {
    this.hotspots.style.pointerEvents = enabled ? "auto" : "none";
  }

  openLog() {
    this.logBody.innerHTML = this.store.log
      .map(l => `<div style="margin-bottom:10px;"><b>${escapeHtml(l.speaker)}</b>: ${escapeHtml(l.text)}</div>`)
      .join("");
    this.logModal.classList.remove("hidden");
  }

  closeLog() {
    this.logModal.classList.add("hidden");
  }

  async say(speaker, text, { noLog = false, cps = 45, wait = true } = {}) {
    this.nameBox.textContent = speaker;
    this.choices.innerHTML = "";
    if (this.actionTags) this.actionTags.innerHTML = "";

    if (!noLog) this.store.addLog(speaker, text);

    // ✅ 추가: 방금 남은 클릭/스페이스로 finishTyping 되는 것 방지
    this._ignoreAdvanceUntil = performance.now() + 120;

    if (typeof this.typeText === "function") {
      await this.typeText(text, { cps });
    } else {
      this.textBox.textContent = text;
    }

    if (wait) {
      await this.waitAdvance();
    }
  }

  async choose(speaker, text, options) {
    this.nameBox.textContent = speaker;
    this.textBox.textContent = text;
    this.store.addLog(speaker, text);

    this.choices.innerHTML = "";
    return new Promise((resolve) => {
      options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "choiceBtn";
        b.textContent = opt.label;
        b.addEventListener("click", () => {
          this.choices.innerHTML = "";
          resolve(opt.value);
        });
        this.choices.appendChild(b);
      });
    });
  }

    // ✅ 액션 태그(버튼) 표시 후 클릭 대기
  waitTag(tags) {
    if (!this.actionTags) {
      console.warn("actionTags DOM not found. Did you add #actionTags to index.html?");
      return Promise.resolve(null);
    }

    this.actionTags.innerHTML = "";

    return new Promise((resolve) => {
      tags.forEach(t => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `actionTag ${t.variant ?? ""}`.trim();
        b.textContent = t.label;

        b.addEventListener("click", (e) => {
          e.stopPropagation(); // advance로 안 넘어가게
          this.actionTags.innerHTML = "";
          resolve(t.id);
        });

        this.actionTags.appendChild(b);
      });
    });
  }

  waitAdvance() {
    return new Promise((resolve) => {
      this._advanceResolver = resolve;
    });
  }

  advance() {
    if (this._ignoreAdvanceUntil && performance.now() < this._ignoreAdvanceUntil) return;
    // 1) 타이핑 중이면: 즉시 전체 텍스트 출력(넘기지 않음)
    if (this.isTyping) {
      this.finishTyping();
      return;
    }

    // 2) 타이핑 중 아니면: 다음 대사로 진행
    if (this._advanceResolver) {
      const r = this._advanceResolver;
      this._advanceResolver = null;
      r();
    }
  }

  async showChapterTitle(titleText, { holdMs = 900, fadeMs = 1100 } = {}) {
    this.clearOverlay();
    const layer = document.createElement("div");
    layer.className = "overlayTitle";
    layer.textContent = titleText;
    this.addOverlayElement(layer);

    await sleep(holdMs);
    layer.classList.add("fadeOut");
    await sleep(fadeMs);

    layer.remove();
  }

  buildIntroFXLayers() {
    this.clearOverlay();

    // ✅ (1) 실제 0/1 비: 캔버스
    const canvas = document.createElement("canvas");
    canvas.className = "fxLayer codeRainCanvas";
    canvas.width = this.stage.clientWidth;
    canvas.height = this.stage.clientHeight;

    // 리사이즈(스케일 상태에서도 stage 내부 픽셀 기준으로 맞춤)
    const resize = () => {
      canvas.width = this.stage.clientWidth;
      canvas.height = this.stage.clientHeight;
    };
    window.addEventListener("resize", resize);

    // 매트릭스 레인 시작 (속도/폰트 크기 조절 가능)
    this._matrixRain?.stop?.();
    this._matrixRain = new MatrixRain({
      width: canvas.width,
      height: canvas.height,
      fontSize: 18,
      speed: 0.9, // 0.7~1.3 사이 취향대로
    });
    this._matrixRain.start(canvas);

    // ✅ (2) 붉은 노이즈
    const noise = document.createElement("div");
    noise.className = "fxLayer redNoise";

    // ✅ (3) 살문(녹색 격자)
    const sal = document.createElement("div");
    sal.className = "fxLayer salmunCSS";

    this.addOverlayElement(canvas);
    this.addOverlayElement(noise);
    this.addOverlayElement(sal);
  }

  async playIntroFX({
    rainMs = 1400,        // 0/1 비만 떨어지는 시간
    noiseMs = 550,        // 빨간 노이즈 번쩍
    salmunRevealMs = 900, // 살문 나타나는 시간
    salmunHoldMs = 500,   // 살문 유지
    salmunFadeMs = 1100,  // 살문 페이드아웃
  } = {}) {
    this.buildIntroFXLayers();

    // 1) 코드비만
    this.stageOverlay.classList.add("fxCodeOnly");
    await sleep(rainMs);

    // 2) 빨간 노이즈(코드비 위에서 변환 순간)
    this.stageOverlay.classList.add("fxNoiseBurst");
    await sleep(noiseMs);
    this.stageOverlay.classList.remove("fxNoiseBurst");

    // 3) 살문 생성(이 순간에 코드비 멈추고 제거)
    this.stageOverlay.classList.add("fxSalmunOn");

    // 코드비 정지 + 제거
    this._matrixRain?.stop?.();
    const canvas = this.stageOverlay.querySelector(".codeRainCanvas");
    if (canvas) canvas.remove();

    await sleep(salmunRevealMs);

    // 4) 살문 잠깐 유지
    await sleep(salmunHoldMs);

    // 5) 살문 페이드아웃 후 배경 등장
    this.stageOverlay.classList.add("fxFadeOut");
    await sleep(salmunFadeMs);

    // 정리
    this.stageOverlay.classList.remove("fxFadeOut", "fxSalmunOn", "fxCodeOnly");
    this.clearOverlay();
  }
}

class MatrixRain {
  constructor({ width, height, fontSize = 18, speed = 1.0 }) {
    this.w = width;
    this.h = height;
    this.fontSize = fontSize;
    this.cols = Math.floor(width / fontSize);
    this.drops = Array(this.cols).fill(0).map(() => Math.random() * height / fontSize);
    this.speed = speed;

    this._raf = 0;
    this._running = false;
    this._t = 0;
  }

  start(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this._running = true;
    this._loop();
  }

  stop() {
    this._running = false;
    cancelAnimationFrame(this._raf);
  }

  _loop = () => {
    if (!this._running) return;
    this._raf = requestAnimationFrame(this._loop);
    this._draw();
  };

  _draw() {
    const ctx = this.ctx;
    const { w, h, fontSize } = this;

    // 잔상 남기기(검은 반투명 덮기)
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace`;

    // 밝은 헤드 + 옅은 몸통 느낌
    for (let i = 0; i < this.cols; i++) {
      const x = i * fontSize;
      const y = this.drops[i] * fontSize;

      // 문자 랜덤 0/1
      const char = Math.random() > 0.5 ? "0" : "1";

      // 헤드 밝게(거의 흰색), 아래는 녹색
      ctx.fillStyle = "rgba(190, 255, 220, 0.95)";
      ctx.fillText(char, x, y);

      // 다음 위치
      this.drops[i] += this.speed;

      // 바닥에 닿으면 랜덤으로 리셋
      if (y > h && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
    }
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(s) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

