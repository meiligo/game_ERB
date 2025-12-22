import { clearObjects, showText } from "../dom.js";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class P6 {
  constructor(sm) {
    this.sm = sm;
  }

  async enter() {
    console.log("P6 ENTER");

    clearObjects();

    const stage = document.getElementById("stage");
    stage.style.background = "#000";

    // 혹시 남아 있으면 제거
    document.getElementById("p6Dark")?.remove();

    stage.insertAdjacentHTML("beforeend", `
      <div class="p6-dark" id="p6Dark">
        <div class="phone" id="p6Phone">
          <div class="phone-screen">
            <div class="phone-header">알림</div>
            <div class="notification">
              <div class="sender">[발신자 없음]</div>
              <div class="message">
                열람 기록 확인.<br/>
                대면 확인이 필요합니다.<br/><br/>
                장소: 감정반향연구소<br/>
                시간: 오늘
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    const phone = document.getElementById("p6Phone");

    // 깜빡임
    for (let i = 0; i < 3; i++) {
      stage.style.filter = "invert(1)";
      await wait(80);
      stage.style.filter = "invert(0)";
      await wait(120);
    }

    // 진동
    phone.classList.add("shake");
    await wait(900);
    phone.classList.remove("shake");

    // 내레이션 (여기까지는 정상)
    showText("내레이션", "진동음이 방 안을 울렸다.");
    await wait(1600);

    showText("내레이션", "이건 면접이 아니다.");
    await wait(1400);

    showText("내레이션", "확인이다.");

    // 🔴 여기서 바로 goto 하면 안 됨
    // ✅ 반드시 충분한 여유 후에 전환
    setTimeout(() => {
      console.log("P6 → P7");
      this.sm.goto("P7");
    }, 2200);
  }

  exit() {
    document.getElementById("p6Dark")?.remove();
  }
}
