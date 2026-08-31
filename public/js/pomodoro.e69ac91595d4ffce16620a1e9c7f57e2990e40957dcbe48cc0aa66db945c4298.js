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
  const expandToggle = widget.querySelector("[data-pomodoro-expand-toggle]");
  const modeButtons = widget.querySelectorAll("[data-pomodoro-mode]");
  const label = widget.querySelector("[data-pomodoro-label]");

  let currentMode = "pomodoro";
  let remainingSeconds = defaultDurations[currentMode];
  let isRunning = false;
  let isExpanded = false;
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
    widget.classList.toggle("is-expanded", isExpanded);
    widget.dataset.open = String(isExpanded);
    widget.setAttribute("data-open", String(isExpanded));

    if (expandToggle) {
      expandToggle.textContent = isExpanded ? "▴" : "▾";
      expandToggle.setAttribute("aria-expanded", String(isExpanded));
    }
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
    });
  }

  if (expandToggle) {
    expandToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      isExpanded = !isExpanded;
      updateWidgetState();
    });
  }

  widget.addEventListener("click", function (event) {
    if (event.target.closest("button")) return;
    isExpanded = !isExpanded;
    updateWidgetState();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const nextMode = button.dataset.pomodoroMode;
      if (!nextMode) return;
      currentMode = nextMode;
      remainingSeconds = defaultDurations[currentMode];
      isRunning = false;
      updateLabel();
      modeButtons.forEach((item) => {
        const active = item.dataset.pomodoroMode === currentMode;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateToggleText();
      updateDisplay();
    });
  });

  updateLabel();
  updateToggleText();
  updateWidgetState();
  updateDisplay();
})();
