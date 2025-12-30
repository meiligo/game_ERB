(() => {
  // ====== Utils ======
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const esc = (s="") => String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");

  // ====== Auto Scale ======
  function fitApp() {
    const baseW = 1280 + 220;
    const baseH = 1080;
    const scale = Math.min(window.innerWidth / baseW, window.innerHeight / baseH, 1);
    document.documentElement.style.setProperty("--app-scale", String(scale));
  }
  window.addEventListener("resize", fitApp);
  fitApp();

  // ====== Store ======
  const store = {
    inventory: [],
    log: [],
    flags: new Map(),
    addLog(speaker, text){ this.log.push({ speaker, text }); },
    addItem(item){
      if (this.inventory.some(x => x.id === item.id)) return false;
      this.inventory.push(item); return true;
    },
    setFlag(k,v=true){ this.flags.set(k,v); },
    getFlag(k, fallback=false){ return this.flags.has(k) ? this.flags.get(k) : fallback; },
  };

  // ====== UI Elements ======
  const stage = document.getElementById("stage");
  const stageOverlay = document.getElementById("stageOverlay");
  const hotspots = document.getElementById("hotspots");
  const nameBox = document.getElementById("nameBox");
  const textBox = document.getElementById("textBox");
  const choices = document.getElementById("choices");
  const inventory = document.getElementById("inventory");

  const logModal = document.getElementById("logModal");
  const logBody = document.getElementById("logBody");
  const btnLog = document.getElementById("btnLog");
  const btnSkip = document.getElementById("btnSkip");
  const btnCloseLog = document.getElementById("btnCloseLog");

  const nameGate = document.getElementById("nameGate");
  const nameInput = document.getElementById("nameInput");
  const nameConfirm = document.getElementById("nameConfirm");

  // ====== Dialogue Advance ======
  let advanceResolver = null;
  function waitAdvance(){ return new Promise(res => advanceResolver = res); }
  function advance(){
    if (advanceResolver){
      const r = advanceResolver; advanceResolver = null; r();
    }
  }
  window.addEventListener("keydown", (e) => { if (e.code === "Space") advance(); });
  textBox.addEventListener("click", advance);
  nameBox.addEventListener("click", advance);
  btnSkip.addEventListener("click", advance);

  // ====== UI Helpers ======
  function clearOverlay(){ stageOverlay.innerHTML = ""; }
  function addOverlay(el){ stageOverlay.appendChild(el); }
  function clearHotspots(){ hotspots.innerHTML = ""; }

  function setStageBg(bg){ stage.style.background = bg; }

  function renderInventory(){
    inventory.innerHTML = "";
    store.inventory.forEach(it => {
      const card = document.createElement("div");
      card.className = "invItem";
      card.innerHTML = `<div class="invItemTitle">${esc(it.title)}</div><div class="invItemTag">${esc(it.tag||"")}</div>`;
      card.addEventListener("click", async () => {
        await say("INVENTORY", `${it.title}\n${it.tag||""}`, { noLog:true });
      });
      inventory.appendChild(card);
    });
  }

  async function say(speaker, text, { noLog=false } = {}){
    nameBox.textContent = speaker;
    textBox.textContent = text;
    choices.innerHTML = "";
    if (!noLog) store.addLog(speaker, text);
    await waitAdvance();
  }

  function choose(speaker, text, options){
    nameBox.textContent = speaker;
    textBox.textContent = text;
    store.addLog(speaker, text);
    choices.innerHTML = "";
    return new Promise(resolve => {
      options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "choiceBtn";
        b.textContent = opt.label;
        b.addEventListener("click", () => {
          choices.innerHTML = "";
          resolve(opt.value);
        });
        choices.appendChild(b);
      });
    });
  }

  // Log modal
  btnLog.addEventListener("click", () => {
    logBody.innerHTML = store.log.map(l => `<div style="margin-bottom:10px;"><b>${esc(l.speaker)}</b>: ${esc(l.text)}</div>`).join("");
    logModal.classList.remove("hidden");
  });
  btnCloseLog.addEventListener("click", () => logModal.classList.add("hidden"));

  // ====== Title Overlay ======
  async function showTitle(title, holdMs=900, fadeMs=1100){
    clearOverlay();
    const layer = document.createElement("div");
    layer.className = "overlayTitle";
    layer.textContent = title;
    addOverlay(layer);
    await sleep(holdMs);
    layer.classList.add("fadeOut");
    await sleep(fadeMs);
    layer.remove();
  }

  // ====== Intro FX ======
  async function playIntroFX(totalMs=1700){
    clearOverlay();

    const code = document.createElement("div");
    code.className = "fxLayer codeRain";
    const noise = document.createElement("div");
    noise.className = "fxLayer redNoise";
    const sal = document.createElement("div");
    sal.className = "fxLayer salmunCSS";

    addOverlay(code); addOverlay(noise); addOverlay(sal);

    stageOverlay.classList.add("fxIntroPlay");
    await sleep(totalMs);

    // 코드 레이어는 제거하고 살문은 남겨 “공간에 남는 느낌”
    code.remove();
    stageOverlay.classList.remove("fxIntroPlay");
  }

  // ====== Hotspot ======
  function addHotspot({ id, x,y,w,h, label, onClick }){
    const btn = document.createElement("button");
    btn.className = "hotspot";
    btn.style.left = x+"px";
    btn.style.top = y+"px";
    btn.style.width = w+"px";
    btn.style.height = h+"px";
    btn.dataset.id = id;
    btn.textContent = label;
    btn.addEventListener("click", (e) => { e.stopPropagation(); onClick?.(); });
    hotspots.appendChild(btn);
  }
  function disableHotspot(id){
    const el = hotspots.querySelector(`[data-id="${id}"]`);
    if (el) el.classList.add("disabled");
  }

  // ====== Player Name ======
  const NAME_KEY = "TRACE_PLAYER_NAME";
  function getPlayerName(){
    return localStorage.getItem(NAME_KEY) || "";
  }
  async function ensurePlayerName(){
    let name = getPlayerName();
    if (name) { store.setFlag("playerName", name); return; }

    // CH1 단독 실행이면 입력 받기
    nameGate.classList.remove("hidden");
    nameInput.value = "";
    nameInput.focus();

    await new Promise(resolve => {
      const confirm = () => {
        const v = (nameInput.value || "").trim();
        const safe = v.length ? v : "PLAYER";
        localStorage.setItem(NAME_KEY, safe);
        store.setFlag("playerName", safe);
        nameGate.classList.add("hidden");
        resolve();
      };
      nameConfirm.onclick = confirm;
      nameInput.onkeydown = (e) => { if (e.key === "Enter") confirm(); };
    });
  }

  // ====== Scenes ======
  async function scene_S00(){
    setStageBg("#000");
    clearHotspots();
    await showTitle("Chapter 1\n마차는 왜 멈췄는가", 950, 1100);
    await scene_S01();
  }

  async function scene_S01(){
    clearHotspots();
    setStageBg("#000");
    clearOverlay();
    await playIntroFX(1700);

    // 메인 홀 배경(임시)
    setStageBg("linear-gradient(135deg, #0b1a26, #101826 55%, #1a2b3a)");

    const playerName = store.getFlag("playerName", "PLAYER");

    await say("SYSTEM (AI 에코)", `시스템 부팅... 감정 데이터 동기화 32%... 78%... 완료.\n관리자 ID 식별: [${playerName}]. 접속을 환영합니다.`);
    await say(playerName, "이곳이... 감정반향연구소? 정말로 AI가 날 여기로 불렀단 말이지...");

    await say("SYSTEM (AI 에코)",
      "시간이 없습니다. 1906년 타임라인에서 치명적인 '데이터 괴사'가 감지되었습니다.\n지금부터 브리핑을 시작합니다. 전방의 홀로그램을 주시하십시오."
    );

    await say("SYSTEM (AI 에코)",
      "사건 파일명: <멈춰버린 마차>.\n1906년 4월, 풍해역 인근.\n독립 의군 자금 전달책이 마차에 탑승하지 않았습니다.\n이로 인해 마차는 빈 수레로 출발했고, 검문소 돌파 중 전복.\n탑승객 전원 사망. 역사 데이터 30%가 소실되었습니다.\n임무: 그가 마차에 타지 않은 '감정적 원인'을 찾아 제거하십시오."
    );

    await say(playerName, "그러니까... 타기 싫어서 안 탄 건지, 못 탄 건지, 그걸 알아내라는 거군.");
    await say("SYSTEM (AI 에코)",
      "[기억의 파편실]을 개방합니다. 시뮬레이션 공간으로 이동하여 데이터를 수집하십시오.\n주의: 사건과 무관한 '노이즈(함정)'가 섞여 있습니다."
    );

    await scene_S02();
  }

  async function scene_S02(){
    clearOverlay();
    setStageBg("linear-gradient(135deg, #1d5a73, #0f2a39)");
    clearHotspots();

    const playerName = store.getFlag("playerName", "PLAYER");

    await say(playerName,
      "여기가 1906년의 데이터 속인가... 마치 덜 만들어진 게임 세상 같네.\n일단 눈에 보이는 것부터 뒤져보자. 왜 안 탔는지 이유가 있을 거야."
    );

    const items = [
      { id:"wheel", label:"바퀴 흠집", truth:false,
        a:'분석: "오래된 마찰 흔적. 주행 안전성 테스트 결과: 정상."',
        p:"흠집이 좀 있긴 한데... 이 정도로 마차가 못 갈 리는 없어. 이건 그냥 낡은 거야. (단서 폐기)" },
      { id:"mud", label:"진흙 발자국", truth:true, inv:{id:"mud", title:"진흙 발자국", tag:"마차 앞까지 접근 후 되돌아감"},
        a:'분석: "마차 전방 1m 지점까지 접근 후, 180도 회전하여 되돌아감. 보폭 불규칙."',
        p:"잠깐, 이건 중요해. 아예 안 온 게 아니야. 마차 앞까지 왔다가... 돌아갔어. 왜지? (인벤토리 획득)" },
      { id:"memo", label:"마부 메모", truth:true, inv:{id:"memo", title:"마부의 메모장", tag:"출발 시간 위에 '대기' 덧씀"},
        a:'분석: "출발 예정 시간(오시) 위에 검은 줄. 옆에 \'대기\'라고 덧쓴 자국."',
        p:"마부는 기다려줬어. 먼저 떠나서 놓친 게 아니야. (인벤토리 획득)" },
      { id:"list", label:"승객 명단", truth:false,
        a:'분석: "인근 시장 상인 3명. 위협 요소 0%."',
        p:"암살자가 타고 있었던 건 아니야. 평범한 사람들... (단서 폐기)" },
      { id:"coin", label:"엽전 꾸러미", truth:false,
        a:'분석: "한성까지 여비 및 체류비로 충분."',
        p:"돈이 없어서 못 간 건 아니네. (단서 폐기)" },
      { id:"bag", label:"짐보따리", truth:true, inv:{id:"bag", title:"싸 놓은 짐보따리", tag:"장거리 이동 물품 완비"},
        a:'분석: "의복, 건량 등 장거리 이동 물품 완비. 착용 흔적 없음."',
        p:"떠날 준비를 완벽히 해놨어. 즉흥적으로 안 가기로 한 게 아니야. (인벤토리 획득)" },
      { id:"umb", label:"우산", truth:true, inv:{id:"umb", title:"펴지 않은 우산", tag:"비가 왔는데 사용 흔적 0%"},
        a:'분석: "당일 강수량 30mm. 우산 내부 건조. 사용 흔적 0%."',
        p:"비가 왔는데 우산을 안 썼다... 뭔가 이상해. (인벤토리 획득)" },
      { id:"med", label:"탕약", truth:false,
        a:'분석: "감초, 생강. 단순 소화제. 독성 없음."',
        p:"그냥 체해서 먹은 약이잖아. (단서 폐기)" },
    ];

    const placements = [
      { x: 140, y: 130, w: 220, h: 120 },
      { x: 420, y: 420, w: 220, h: 120 },
      { x: 760, y: 420, w: 220, h: 120 },
      { x: 980, y: 160, w: 220, h: 120 },
      { x: 220, y: 520, w: 220, h: 120 },
      { x: 520, y: 520, w: 220, h: 120 },
      { x: 820, y: 520, w: 220, h: 120 },
      { x: 540, y: 160, w: 220, h: 120 },
    ];

    async function inspect(item){
      if (store.getFlag("inspected:"+item.id)) return;
      store.setFlag("inspected:"+item.id, true);
      disableHotspot(item.id);

      await say("SYSTEM (AI 에코)", item.a);
      await say(playerName, item.p);

      if (item.truth && item.inv){
        store.addItem(item.inv);
        renderInventory();
      }

      const done = items.every(it => store.getFlag("inspected:"+it.id));
      if (done){
        await say("SYSTEM (AI 에코)", "Layer 1 데이터 수집 완료.\n획득한 단서: 4개.");
        await say(playerName,
          "정리해 보자.\n" +
          "마차는 기다려줬고(메모장), 그는 갈 준비도 마쳤어(짐보따리).\n" +
          "그런데 마차 앞까지 갔다가(발자국), 비를 쫄딱 맞으며 돌아왔어(우산).\n" +
          "물리적인 방해는 없었어. 이건... 마음의 문제야."
        );

        const v = await choose("SYSTEM (AI 에코)",
          "데모: 여기까지.\n(나중에 S04~S11 이어붙이면 완성!)",
          [{label:"처음부터", value:"restart"}, {label:"그대로 두기", value:"stay"}]
        );
        if (v === "restart") location.reload();
      }
    }

    items.forEach((it, i) => {
      const p = placements[i];
      addHotspot({ id: it.id, ...p, label: it.label, onClick: () => inspect(it) });
    });

    await say("SYSTEM (AI 에코)", "표면 단서 8개가 활성화되었습니다.\n오브젝트를 클릭하여 조사하십시오.");
  }

  // ====== Boot ======
  async function boot(){
    // ✅ 이름 확보(프롤로그 병합 대비: localStorage)
    await ensurePlayerName();

    // ✅ 인벤토리 초기 렌더
    renderInventory();

    // ✅ 진짜 시작
    await scene_S00();
  }

  // 혹시라도 에러 나면 검정 화면만 남지 않도록 표시
  boot().catch(err => {
    console.error(err);
    nameBox.textContent = "ERROR";
    textBox.textContent = "콘솔(F12)에 에러가 있어요.\n" + String(err);
  });
})();
