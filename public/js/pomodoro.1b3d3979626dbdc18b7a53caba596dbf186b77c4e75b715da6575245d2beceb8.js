(function () {
  const defaultDurations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const widget = document.querySelector("[data-pomodoro]");
  if (!widget) return;

  const display = widget.querySelector("[data-pomodoro-display]");
  const toggle = widget.querySelector("[data-pomodoro-toggle]");
  const modeButtons = widget.querySelectorAll("[data-pomodoro-mode]");
  const label = widget.querySelector("[data-pomodoro-label]");

  let currentMode = "pomodoro";
  let remainingSeconds = defaultDurations[currentMode];
  let isRunning = false;
  let timerId = null;

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateLabel() {
    const labels = {
      pomodoro: "POMODORO",
      short: "SHORT BREAK",
      long: "LONG BREAK",
    };

    if (label) {
      label.textContent = labels[currentMode];
    }
  }

  function updateButtons() {
    modeButtons.forEach((button) => {
      const isActive = button.dataset.pomodoroMode === currentMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateDisplay() {
    display.textContent = formatTime(remainingSeconds);
  }

  function resetTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    remainingSeconds = defaultDurations[currentMode];
    isRunning = false;
    toggle.textContent = "Start";
    updateDisplay();
  }

  function finishCycle() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    isRunning = false;
    toggle.textContent = "Start";
    if (navigator.vibrate) {
      navigator.vibrate([120, 80, 120]);
    }
  }

  function tick() {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      updateDisplay();
      return;
    }

    finishCycle();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    toggle.textContent = "Pause";
    timerId = window.setInterval(tick, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    toggle.textContent = "Start";
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function setMode(mode) {
    currentMode = mode;
    pauseTimer();
    remainingSeconds = defaultDurations[currentMode];
    updateLabel();
    updateButtons();
    updateDisplay();
  }

  toggle.addEventListener("click", function () {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setMode(button.dataset.pomodoroMode);
    });
  });

  updateLabel();
  updateButtons();
  updateDisplay();
})();
