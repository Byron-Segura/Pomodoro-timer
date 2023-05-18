const d = document;
let $countdown = d.querySelector(".countdown");
const $phases = d.querySelector(".phases-buttons");
const $start = d.querySelector(".start-btn");
const $message = d.querySelector(".message");
const $audio = d.querySelector(".audio");
const $clickSound = d.querySelector(".click-sound");
let interval;

const timeValues = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  intervalLongBreak: 4,
  sessions: 0,
};

$start.addEventListener("click", () => {
  $clickSound.play();
  let start = $start.textContent;
  if (start === "Start") {
    startTimer();
  } else {
    stopTimer();
  }
});

$phases.addEventListener("click", handlePhase);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = ("0" + Math.floor(total / 60)).slice(-2);
  const seconds = ("0" + (total % 60)).slice(-2);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timeValues.timeRemaining;
  const endTime = Date.parse(new Date()) + total * 1000;

  if (timeValues.phase === "pomodoro") timeValues.sessions++;

  $start.textContent = "Stop";

  interval = setInterval(() => {
    timeValues.timeRemaining = getRemainingTime(endTime);
    updateClock();

    total = timeValues.timeRemaining.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timeValues.phase) {
        case "pomodoro":
          if (timeValues.sessions % timeValues.intervalLongBreak === 0) {
            switchPhase("longBreak");
          } else {
            switchPhase("shortBreak");
          }
          break;
        default:
          switchPhase("pomodoro");
      }

      $audio.play();

      startTimer();
    }
  }, 500);
}

function stopTimer() {
  clearInterval(interval);
  $start.textContent = "Start";
}

function updateClock() {
  const { timeRemaining } = timeValues;

  const minutes = timeRemaining.minutes;
  const seconds = timeRemaining.seconds;

  $countdown.innerHTML = `<p>${minutes}:${seconds}</p>`;
}

function switchPhase(phase) {
  timeValues.phase = phase;
  timeValues.timeRemaining = {
    total: timeValues[phase] * 60,
    minutes: timeValues[phase],
    seconds: 0,
  };

  $countdown.innerHTML = `<p>${("0" + timeValues.timeRemaining.minutes).slice(
    -2
  )}:00</p>`;

  $message.innerHTML =
    timeValues.phase === "pomodoro"
      ? "<h2>Time to focus!!</h2>"
      : "<h2>Time for a Break!!</h2>";

  d.querySelectorAll("button[data-phase]").forEach((e) =>
    e.classList.remove("focus")
  );
  d.querySelector(`[data-phase="${phase}"]`).classList.add("focus");
}

function handlePhase(e) {
  const { phase } = e.target.dataset;

  if (!phase) return;

  switchPhase(phase);
  stopTimer();
}

d.addEventListener("DOMContentLoaded", () => {
  switchPhase("pomodoro");
});
