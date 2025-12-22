// js/states/p1_video.js
import { clearObjects, showText, setNextText } from "../dom.js";

export class P1 {
  constructor(sm) {
    this.sm = sm;
  }

  enter() {
    clearObjects();
    showText("", "");
    setNextText("");

    const overlay = document.getElementById("overlay");
    overlay.classList.add("active");

    overlay.innerHTML = `
      <div class="p1-video-wrap">
        <video id="introVideo" autoplay muted playsinline>
          <source src="./assets/video/검정화면영상.mp4" type="video/mp4" />
        </video>
        <div class="video-skip">클릭하여 건너뛰기</div>
      </div>
    `;

    const video = document.getElementById("introVideo");

    // 영상 끝나면 다음 상태
    video.onended = () => {
      this.finish();
    };

    // 클릭 스킵
    overlay.querySelector(".video-skip").onclick = () => {
      this.finish();
    };
  }

  finish() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";
    this.sm.goto("P2");
  }

  exit() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    overlay.innerHTML = "";
  }
}
