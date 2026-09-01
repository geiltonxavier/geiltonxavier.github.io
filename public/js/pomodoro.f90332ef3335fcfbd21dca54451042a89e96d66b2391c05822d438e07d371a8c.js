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
  const modeToggle = widget.querySelector("[data-pomodoro-mode-toggle]");

  const modeSequence = ["pomodoro", "short", "long"];

  let currentMode = "pomodoro";
  let remainingSeconds = defaultDurations[currentMode];
  let isRunning = false;
  let timerId = null;

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateModeText() {
    if (modeToggle) {
      modeToggle.textContent = currentMode;
    }
  }

  function cycleMode() {
    const currentIndex = modeSequence.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modeSequence.length;
    currentMode = modeSequence[nextIndex];
    remainingSeconds = defaultDurations[currentMode];
    isRunning = false;
    updateModeText();
    updateToggleText();
    updateDisplay();
    updateWidgetState();
  }

  function updateToggleText() {
    if (!toggle) return;
    if (isRunning) {
      toggle.textContent = "Pause";
      return;
    }

    if (remainingSeconds < defaultDurations[currentMode]) {
      toggle.textContent = "Reset";
      return;
    }

    toggle.textContent = "Start";
  }

  function updateDisplay() {
    if (display) {
      display.textContent = formatTime(remainingSeconds);
    }
  }

  function updateWidgetState() {
    widget.classList.toggle("is-running", isRunning);
    widget.dataset.open = String(isRunning);
    widget.setAttribute("data-open", String(isRunning));
  }

  function finishCycle() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    isRunning = false;
    updateToggleText();
    updateDisplay();

    if (navigator.vibrate) {
      navigator.vibrate([120, 80, 120]);
    }
  }

  function resetTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    remainingSeconds = defaultDurations[currentMode];
    isRunning = false;
    updateToggleText();
    updateDisplay();
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
    updateToggleText();
    updateDisplay();
    timerId = window.setInterval(tick, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    updateToggleText();
    updateDisplay();

    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (isRunning) {
        pauseTimer();
      } else if (remainingSeconds < defaultDurations[currentMode]) {
        resetTimer();
      } else {
        startTimer();
      }
      updateWidgetState();
    });
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      cycleMode();
    });
  }

  updateModeText();
  updateToggleText();
  updateWidgetState();
  updateDisplay();
})();
