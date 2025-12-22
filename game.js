// 🔹 시작 화면 배경 캔버스
const bgCanvas = document.getElementById("startBgCanvas");
const bgCtx = bgCanvas.getContext("2d");

// 🔹 게임 메인 캔버스
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔹 시작 화면 배경 리사이즈
function resizeBg() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBg);
resizeBg();

// 🔹 노이즈 + 감정 파동 라인 생성
let t = 0;
function drawStartBackground() {
    t += 0.01;
    const w = bgCanvas.width;
    const h = bgCanvas.height;

    // 전체 화면 반투명 블러 느낌
    bgCtx.fillStyle = "rgba(0,0,0,0.25)";
    bgCtx.fillRect(0, 0, w, h);

    // 파동 라인
    bgCtx.lineWidth = 2;
    bgCtx.strokeStyle = "rgba(255,255,255,0.2)";

    bgCtx.beginPath();
    for (let x = 0; x < w; x += 10) {   // ✅ fot → for 수정
        let y = h / 2 + Math.sin(x * 0.01 + t) * 40;
        bgCtx.lineTo(x, y);
    }
    bgCtx.stroke();

    // 파동 원형 효과
    for (let i = 0; i < 5; i++) {
        let radius = 80 + Math.sin(t * 2 + i) * 20;
        bgCtx.beginPath();
        bgCtx.arc(w / 2, h / 2, radius + i * 30, 0, Math.PI * 2);
        // ✅ 템플릿 리터럴 오타 수정
        bgCtx.strokeStyle = "rgba(255,255,255,0.05)";
        bgCtx.stroke();
    }

    requestAnimationFrame(drawStartBackground);
}

drawStartBackground();


// 🔹 기준 해상도
const baseWidth = 1920;
const baseHeight = 1080;

let scale = 1;

// 🔹 플레이어 예시
let player = {
    x: 960,
    y: 540,
    size: 50
};

// 🔹 메인 게임 캔버스 리사이즈
function resizeScreen() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    scale = Math.min(w / baseWidth, h / baseHeight);
}

window.addEventListener("resize", resizeScreen);
resizeScreen();

// 🔹 게임 상태
let gameRunning = false;

// 🔹 시작 화면 요소
const startScreen = document.getElementById("startScreen");

// 🔥 시작 화면 페이드 인 (로드 후 100ms 뒤에 실행)
window.onload = () => {
    setTimeout(() => {
        startScreen.style.opacity = "1";
    }, 100);
};

// 🔹 버튼 기능
document.getElementById("startBtn").addEventListener("click", () => {
    fadeOutStartScreen(startGame);
});

document.getElementById("continueBtn").addEventListener("click", () => {
    alert("아직 구현되지 않았습니다.");
});

document.getElementById("settingsBtn").addEventListener("click", () => {
    alert("설정 메뉴는 추후 추가 예정입니다.");
});

document.getElementById("exitBtn").addEventListener("click", () => {
    alert("웹 게임은 종료할 수 없습니다 😆");
});

// 🔥 페이드아웃 함수
function fadeOutStartScreen(callback) {
    startScreen.style.opacity = "0"; // 투명하게

    // transition 끝날 때까지 기다렸다가 콜백 실행
    setTimeout(() => {
        startScreen.style.display = "none";
        callback();  // 게임 시작 함수 호출
    }, 1500); // CSS transition 과 동일(1.5초)
}

// 🔹 게임 시작
function startGame() {
    gameRunning = true;
    update();
}

// 🔹 플레이어 그리기
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(
        player.x * scale,
        player.y * scale,
        player.size * scale,
        player.size * scale
    );
}

// 🔹 메인 루프
function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();

    requestAnimationFrame(update);
}
