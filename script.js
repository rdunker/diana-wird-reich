const counterEl = document.getElementById("counter");
const rateInput = document.getElementById("rate");
const startButton = document.getElementById("start");

let startTime = null;
let interval = null;

function formatEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

startButton.addEventListener("click", () => {
  if (interval) return; // prevent multiple starts

  const ratePerHour = parseFloat(rateInput.value);
  const ratePerMs = ratePerHour / 3600000;

  startTime = Date.now();

  interval = setInterval(() => {
    const elapsedMs = Date.now() - startTime;
    const money = elapsedMs * ratePerMs;
    counterEl.textContent = formatEuro(money);
  }, 100);
});
