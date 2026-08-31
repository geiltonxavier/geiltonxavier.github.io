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
  const collapseToggle = widget.querySelector("[data-pomodoro-collapse]");
  const expandToggle = widget.querySelector("[data-pomodoro-expand]");
  const modeButtons = widget.querySelectorAll("[data-pomodoro-mode]");
  const label = widget.querySelector("[data-pomodoro-label]");

  let currentMode = "pomodoro";
  let remainingSeconds = defaultDurations[currentMode];
  let isRunning = false;
  let isOpen = widget.dataset.open === "true";
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

    if (collapseToggle) {
      collapseToggle.textContent = isOpen ? "−" : "+";
      collapseToggle.setAttribute("aria-label", isOpen ? "Hide Pomodoro timer" : "Show Pomodoro timer");
    }

    if (expandToggle) {
      expandToggle.textContent = isOpen ? "Hide" : "Open";
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

  function setMode(mode) {
    currentMode = mode;
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    remainingSeconds = defaultDurations[currentMode];
    isRunning = false;
    updateLabel();
    updateButtons();
    updateToggleText();
    updateDisplay();
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

  if (collapseToggle) {
    collapseToggle.addEventListener("click", function () {
      isOpen = !isOpen;
      updateWidgetState();
    });
  }

  if (expandToggle) {
    expandToggle.addEventListener("click", function () {
      isOpen = true;
      updateWidgetState();
    });
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setMode(button.dataset.pomodoroMode);
    });
  });

  updateLabel();
  updateButtons();
  updateToggleText();
  updateWidgetState();
  updateDisplay();
})();
