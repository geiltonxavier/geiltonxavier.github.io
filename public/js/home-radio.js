(function () {
  let navigationInProgress = false;

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

    document.addEventListener("click", function (event) {
      const link = event.target.closest("a");
      if (!link || !isInternalPageLink(link)) return;

      event.preventDefault();
      navigate(link.href, true);
    });

    window.addEventListener("popstate", function () {
      navigate(window.location.href, false);
    });
  }

    function isInternalPageLink(link) {
      return link.origin === window.location.origin
        && link.pathname !== window.location.pathname
        && !link.hash
        && link.target !== "_blank"
        && link.hasAttribute("href")
        && !link.href.startsWith("mailto:");
    }

    async function navigate(url, addHistoryEntry) {
      if (navigationInProgress) return;
      navigationInProgress = true;

      try {
        const response = await fetch(url, { headers: { "X-Requested-With": "partial-navigation" } });
        if (!response.ok) throw new Error("Navigation failed");

        const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html");
        const currentMain = document.querySelector("[data-page-content]");
        const nextMain = nextDocument.querySelector("[data-page-content]");
        if (!currentMain || !nextMain) throw new Error("Page content not found");

        currentMain.replaceChildren(...nextMain.childNodes);
        document.title = nextDocument.title;
        document.documentElement.lang = nextDocument.documentElement.lang;

        const currentHeader = document.querySelector("body > .content > header");
        const nextHeader = nextDocument.querySelector("body > .content > header");
        if (currentHeader && nextHeader) currentHeader.replaceChildren(...nextHeader.childNodes);

        if (addHistoryEntry) window.history.pushState({}, "", url);
        window.scrollTo(0, 0);
        currentMain.focus({ preventScroll: true });
      } catch (error) {
        window.location.href = url;
      } finally {
        navigationInProgress = false;
      }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
