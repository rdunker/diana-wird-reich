//// MESSAGES

const counterEl = document.getElementById("counter");
const rateInput = document.getElementById("rate");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");

const messageEl = document.getElementById("message");

let startTime = null;
let elapsedBeforePause = 0;
let interval = null;
let messageInterval = null;

const MESSAGE_DURATION = 60 * 1000; // 1 minute
const FIRST_MESSAGE_DELAY = 10 * 1000; // 10 seconds
const MESSAGE_FREQUENCY = 2 * 60 * 1000; // every 2 minutes

// Message list
const messages = [
  "Füttere die Robben! 🦭",
  "Die Frisch-Fisch AG ist stolz auf dich. 🐟",
  "🚨🚨🚨🚨🚨",
  "Die Urlaubskasse freut sich 💰",
  "💲 Ka-tsching Ka-tsching 💲",
  "Frank verdient bestimmt nicht so viel.",
  "C3 gibt dir einen Flug nach Mexico aus 💲",
  "Katzenfutter ist teuer 🐈‍⬛",
];

let messageIndex = 0;
let lastMessageTime = null;

function formatEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.add("show");

  // Remove after MESSAGE_DURATION
  setTimeout(() => {
    messageEl.classList.remove("show");
  }, MESSAGE_DURATION);
}

let lastMessage = null;

function getRandomMessage() {
  let message;
  do {
    message = messages[Math.floor(Math.random() * messages.length)];
  } while (message === lastMessage);

  lastMessage = message;
  return message;
}

//// COUNTER

function startCounter() {
  if (interval) return;

  const ratePerHour = parseFloat(rateInput.value);
  const ratePerMs = ratePerHour / 3600000;

  startTime = Date.now() - elapsedBeforePause;

  // Counter update
  interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const money = elapsed * ratePerMs;
    counterEl.textContent = formatEuro(money);

    // Handle messages
    const elapsedTime = Date.now() - startTime;

    // First message after 10s
    if (elapsedTime >= FIRST_MESSAGE_DELAY && lastMessageTime === null) {
      showMessage(getRandomMessage());
      lastMessageTime = Date.now();
      messageIndex++;
    }

    // Subsequent messages every 2 min
    if (
      lastMessageTime !== null &&
      Date.now() - lastMessageTime >= MESSAGE_FREQUENCY
    ) {
      showMessage(getRandomMessage());
      lastMessageTime = Date.now();
      messageIndex++;
    }
  }, 100);
}

function pauseCounter() {
  if (!interval) return;

  clearInterval(interval);
  interval = null;
  elapsedBeforePause = Date.now() - startTime;
}

function stopCounter() {
  clearInterval(interval);
  interval = null;
  startTime = null;
  elapsedBeforePause = 0;
  counterEl.textContent = "0,00 €";
  lastMessageTime = null;
  messageIndex = 0;
}

startBtn.addEventListener("click", startCounter);
pauseBtn.addEventListener("click", pauseCounter);
stopBtn.addEventListener("click", stopCounter);


//// SEALS
const seal1 = new Image();
seal1.src = "img/seal1_1.png";
const seal2 = new Image();
seal2.src = "img/seal1_2.png";

const activeSeals = [];

function spawnSeal() {
  const imgEl = document.createElement("img");
  imgEl.classList.add("seal");
  imgEl.src = seal1.src;
  document.body.appendChild(imgEl);

  const seal = {
    imgEl,
    frame1: seal1,
    frame2: seal2,
    currentFrame: 1,
    x: Math.random() < 0.5 ? 0 : window.innerWidth - 48, // start left or right
    y: Math.random() * (window.innerHeight - 100) + 50, // random line
    speed: 1 + Math.random(), // pixels per frame
    direction: Math.random() < 0.5 ? 1 : -1,
    frameTimer: 0
  };

  // Initial mirroring
  seal.imgEl.style.transform = seal.direction === -1 ? "scaleX(-1)" : "scaleX(1)";

  activeSeals.push(seal);
}

// Spawn first seal after 10 seconds
setTimeout(spawnSeal, FIRST_MESSAGE_DELAY);

// Spawn a new seal every 1 minute
setInterval(spawnSeal, 60 * 1000);

// ===== Animation Loop =====
let lastTime = performance.now();
function animate(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update seals
  activeSeals.forEach(seal => {
    // Move seal
    seal.x += seal.speed * seal.direction;

    // Reverse direction if hitting edges
    if (seal.x <= 0) {
      seal.direction = 1;
      seal.imgEl.style.transform = "scaleX(1)";
    }
    if (seal.x >= window.innerWidth - 48) {
      seal.direction = -1;
      seal.imgEl.style.transform = "scaleX(-1)";
    }

    // Swap frames for crawling effect every 200 ms
    seal.frameTimer += deltaTime;
    if (seal.frameTimer > 200) {
      seal.currentFrame = seal.currentFrame === 1 ? 2 : 1;
      seal.imgEl.src = seal.currentFrame === 1 ? seal.frame1.src : seal.frame2.src;
      seal.frameTimer = 0;
    }

    // Update position
    seal.imgEl.style.left = seal.x + "px";
    seal.imgEl.style.top = seal.y + "px";
  });

  // Update money counter
  if (interval) {
    const elapsed = Date.now() - startTime;
    const ratePerHour = parseFloat(rateInput.value);
    const ratePerMs = ratePerHour / 3600000;
    const money = elapsed * ratePerMs;
    counterEl.textContent = formatEuro(money);

    // Handle messages
    const elapsedTime = Date.now() - startTime;

    // First message after 10s
    if (elapsedTime >= FIRST_MESSAGE_DELAY && lastMessageTime === null) {
      showMessage(getRandomMessage());
      lastMessageTime = Date.now();
      messageIndex++;
    }

    // Subsequent messages every 2 min
    if (
      lastMessageTime !== null &&
      Date.now() - lastMessageTime >= MESSAGE_FREQUENCY
    ) {
      showMessage(getRandomMessage());
      lastMessageTime = Date.now();
      messageIndex++;
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// CONTROLS
function startCounter() {
  if (interval) return;
  startTime = Date.now() - elapsedBeforePause;
  interval = true;
}

function pauseCounter() {
  if (!interval) return;
  interval = null;
  elapsedBeforePause = Date.now() - startTime;
}

function stopCounter() {
  interval = null;
  startTime = null;
  elapsedBeforePause = 0;
  counterEl.textContent = "0,00 €";
  lastMessageTime = null;
  messageIndex = 0;
}

startBtn.addEventListener("click", startCounter);
pauseBtn.addEventListener("click", pauseCounter);
stopBtn.addEventListener("click", stopCounter);


// BACKGROUND SELECTION

const backgroundEl = document.getElementById("background");
const backgroundSelect = document.getElementById("backgroundSelect");

// set default background
backgroundEl.style.backgroundImage = "url('img/beach_world.jpg')";

backgroundSelect.addEventListener("change", () => {
  const selectedImage = backgroundSelect.value;
  backgroundEl.style.backgroundImage = `url('${selectedImage}')`;
});
