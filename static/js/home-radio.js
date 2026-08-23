(function () {
  function initRadio(radio) {
    const audio = radio.querySelector("[data-radio-audio]");
    const toggle = radio.querySelector("[data-radio-toggle]");
    const state = radio.querySelector("[data-radio-state]");
    const error = radio.querySelector("[data-radio-error]");

    if (!audio || !toggle || !state || !error) return;

    const playLabel = radio.dataset.playLabel || "Play indie radio";
    const pauseLabel = radio.dataset.pauseLabel || "Pause indie radio";
    const unavailableLabel = radio.dataset.unavailableLabel || "The radio is temporarily unavailable.";

    function setState(isPlaying) {
      radio.dataset.state = isPlaying ? "playing" : "paused";
      toggle.dataset.state = isPlaying ? "playing" : "paused";
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute("aria-label", isPlaying ? pauseLabel : playLabel);
      state.textContent = isPlaying ? "Pause" : "Play";
    }

    function showError() {
      audio.pause();
      setState(false);
      error.textContent = unavailableLabel;
      error.hidden = false;
    }

    function clearError() {
      error.textContent = "";
      error.hidden = true;
    }

    toggle.addEventListener("click", function () {
      if (audio.paused) {
        clearError();
        audio.play().catch(showError);
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      setState(true);
    });

    audio.addEventListener("pause", function () {
      setState(false);
    });

    audio.addEventListener("ended", function () {
      setState(false);
    });

    audio.addEventListener("error", showError);
    setState(false);
  }

  function init() {
    document.querySelectorAll("[data-home-radio]").forEach(initRadio);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
