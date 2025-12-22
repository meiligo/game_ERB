import { showText, clearObjects } from "../dom.js";

export class P2 {
  constructor(sm) {
    this.sm = sm;
    this.clicked = new Set();
  }

  async enter() {
    clearObjects();

    showText("내레이션", "…내가 왜 이걸 보고 있지?");

    const overlay = document.getElementById("overlay");
    overlay.classList.add("active");

    overlay.innerHTML = `
      <div class="fakeBrowser">
        <div class="browserTop">
          <div class="browserDots">
            <span class="red"></span>
            <span class="yellow"></span>
            <span class="green"></span>
          </div>
          <div class="addressBar">
            https://archive.erb-research.org/session/unknown
          </div>
        </div>

        <div class="tabBar">
          <div class="tabBtn" data-id="t1">조선 후기 집단 정서 변화 연구</div>
          <div class="tabBtn" data-id="t2">정서 파동의 시간 잔존성</div>
          <div class="tabBtn" data-id="t3">집단 감정 기록 실험 — 1943</div>
          <div class="tabBtn locked" data-id="t4">ERB 내부 문서</div>
        </div>

        <div class="browserBody" id="browserBody">
          <p>열려 있는 탭 중 하나를 선택하십시오.</p>
        </div>
      </div>
    `;

    const contents = {
      t1: `<h3>조선 후기 집단 정서 변화 연구</h3><p>기록은 불완전하다. 그러나 변화는 분명히 감지된다.</p>`,
      t2: `<h3>정서 파동의 시간 잔존성</h3><p>감정은 사라지지 않는다. 단지 지연될 뿐이다.</p>`,
      t3: `<h3>집단 감정 기록 실험 — 1943</h3><p>피험자들은 이미 결과를 알고 있었다.</p>`,
      t4: `<h3>접근 권한 없음</h3><p>이 문서를 열 수 없습니다.</p>`
    };

    const tabs = overlay.querySelectorAll(".tabBtn");
    const body = overlay.querySelector("#browserBody");

    tabs.forEach(tab => {
      tab.onclick = () => {
        if (tab.classList.contains("locked")) return;

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const id = tab.dataset.id;
        body.innerHTML = contents[id];
        this.clicked.add(id);

        if (this.clicked.size >= 3) {
          showText("시스템", "이 문서는 이미 열람한 기록이 있습니다.");
          setTimeout(() => {
            overlay.classList.remove("active");
            this.sm.goto("P3");
          }, 1200);
        }
      };
    });
  }

  exit() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";
  }
}
