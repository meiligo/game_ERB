import { showText } from "../dom.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class P4 {
  constructor(sm) {
    this.sm = sm;
  }

  async enter() {
    const overlay = document.getElementById("overlay");
    overlay.classList.add("active");

    // P3에서 입력한 이름
    const playerName = localStorage.getItem("playerName") || "OOO";

    // browserBody 있나 확인
    let body = overlay.querySelector("#browserBody");

    // 없으면 fakeBrowser 복구
    if (!body) {
      overlay.innerHTML = `
        <div class="fakeBrowser">
          <div class="browserTop">
            <div class="browserDots">
              <span class="red"></span>
              <span class="yellow"></span>
              <span class="green"></span>
            </div>
            <div class="addressBar">
              https://archive.erb-research.org/internal/document
            </div>
          </div>

          <div class="tabBar">
            <div class="tabBtn active">ERB 내부 문서</div>
          </div>

          <div class="browserBody" id="browserBody"></div>
        </div>
      `;

      body = overlay.querySelector("#browserBody");
    }

    // 문서 내용 삽입
    body.innerHTML = `
      <h3>ERB 내부 문서 — 열람 기록</h3>

      <div class="docBlock">
        <p><strong>열람자:</strong> ${playerName}</p>
        <p><strong>열람 시점:</strong> 기록 불명</p>
        <p><strong>정서 파동 영향도:</strong> 측정 불가</p>
      </div>
    `;

    // 하단 내레이션 (순차 출력)
    showText("내레이션", "이 문서는… 처음부터 나를 알고 있었다.");

    setTimeout(() => {
    showText("내레이션", "이상했다.");
    }, 1000);

    setTimeout(() => {
    showText(
        "내레이션",
        "내가 입력한 이름이 오래된 논문 속에 이미 들어가 있었다."
    );
    }, 2000);

    setTimeout(() => {
    this.sm.goto("P5");
    }, 4000);

  }

  exit() {
    // overlay 유지 (P5에서도 같은 웹 화면 사용)
  }
}
