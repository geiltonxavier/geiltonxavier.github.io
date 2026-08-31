(function () {
  const defaultDurations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const widget = document.querySelector("[data-pomodoro]");
  if (!widget) return;

  const display = widget.querySelector("[data-pomodoro-display]");
  const collapsedTime = widget.querySelector("[data-pomodoro-collapsed-time]");
  const collapsedState = widget.querySelector("[data-pomodoro-collapsed-state]");
  const toggle = widget.querySelector("[data-pomodoro-toggle]");
  const label = widget.querySelector("[data-pomodoro-label]");

  let currentMode = "pomodoro";
  let remainingSeconds = defaultDurations[currentMode];
  let isRunning = false;
  let isOpen = true;
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

  function updateToggleText() {
    if (!toggle) return;
    toggle.textContent = isRunning ? "Pause" : "Start";
  }

  function updateCollapsedSummary() {
    if (collapsedTime) {
      collapsedTime.textContent = formatTime(remainingSeconds);
    }

    if (collapsedState) {
      if (isRunning) {
        collapsedState.textContent = "Running";
      } else if (remainingSeconds === defaultDurations[currentMode]) {
        collapsedState.textContent = "Ready";
      } else {
        collapsedState.textContent = "Paused";
      }
    }
  }

  function updateDisplay() {
    if (display) {
      display.textContent = formatTime(remainingSeconds);
    }

    updateCollapsedSummary();
  }

  function updateWidgetState() {
    widget.classList.toggle("is-collapsed", !isOpen);
    widget.dataset.open = String(isOpen);
    widget.setAttribute("data-open", String(isOpen));
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
      } else {
        startTimer();
      }
    });
  }

  updateLabel();
  updateToggleText();
  updateWidgetState();
  updateDisplay();
})();
