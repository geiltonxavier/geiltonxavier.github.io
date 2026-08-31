(function () {
  let navigationInProgress = false;

  function initRadio(radio) {
    const audio = radio.querySelector("[data-radio-audio]");
    const toggle = radio.querySelector("[data-radio-toggle]");
    const state = radio.querySelector("[data-radio-state]");
    const track = radio.querySelector("[data-radio-track]");
    const copy = radio.querySelector("[data-radio-copy]");
    const copyFeedback = radio.querySelector("[data-radio-copy-feedback]");
    const cover = radio.querySelector("[data-radio-cover]");
    const progressBar = radio.querySelector("[data-radio-progress-bar]");
    const error = radio.querySelector("[data-radio-error]");

    if (!audio || !toggle || !track || !copy || !copyFeedback || !error) return;

    const playLabel = radio.dataset.playLabel || "Play indie radio";
    const pauseLabel = radio.dataset.pauseLabel || "Pause indie radio";
    const unavailableLabel = radio.dataset.unavailableLabel || "The radio is temporarily unavailable.";
    const copyLabel = radio.dataset.copyLabel || "Copy track";
    const copiedLabel = radio.dataset.copiedLabel || "Track copied";

    function renderTrackText(rawText) {
      const source = (rawText || "").trim();
      const separator = " - ";
      const hasSeparator = source.includes(separator);
      const artist = hasSeparator ? source.split(separator)[0].trim() : "";
      const title = hasSeparator ? source.split(separator).slice(1).join(separator).trim() : source;

      track.innerHTML = "";

      if (artist) {
        const artistNode = document.createElement("span");
        artistNode.className = "radio-track-artist";
        artistNode.textContent = artist;
        track.appendChild(artistNode);
      }

      if (title) {
        const titleNode = document.createElement("span");
        titleNode.className = "radio-track-title";
        titleNode.textContent = title;
        track.appendChild(titleNode);
      }

      if (!artist && !title) {
        track.textContent = "";
      }

      copy.disabled = !source;
    }

    async function updateTrack() {
      try {
        const response = await fetch("https://somafm.com/songs/indiepop.json");
        if (!response.ok) throw new Error("Track metadata unavailable");

        const data = await response.json();
        const currentSong = data.songs && data.songs[0];
        if (currentSong && currentSong.artist && currentSong.title) {
          renderTrackText(`${currentSong.artist} - ${currentSong.title}`);
          if (cover) {
            if (currentSong.albumArt) {
              cover.src = currentSong.albumArt;
              cover.hidden = false;
              cover.alt = `${currentSong.artist} - ${currentSong.title}`;
            } else {
              cover.removeAttribute("src");
              cover.hidden = true;
              cover.alt = "";
            }
          }
        }
      } catch (metadataError) {
        renderTrackText("");
        if (cover) {
          cover.removeAttribute("src");
          cover.hidden = true;
          cover.alt = "";
        }
      }
    }

    async function copyTrack() {
      const trackText = (track.textContent || "").trim();
      if (!trackText) return;

      try {
        await navigator.clipboard.writeText(trackText);
      } catch (clipboardError) {
        const fallback = document.createElement("textarea");
        fallback.value = trackText;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
      }

      copyFeedback.textContent = copiedLabel;
      window.setTimeout(function () {
        copyFeedback.textContent = "";
      }, 1800);
    }

    function updateProgress() {
      if (!progressBar) return;
      if (!audio.duration || Number.isNaN(audio.duration)) {
        progressBar.style.width = "0%";
        return;
      }
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    function setState(isPlaying) {
      radio.dataset.state = isPlaying ? "playing" : "paused";
      toggle.dataset.state = isPlaying ? "playing" : "paused";
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute("aria-label", isPlaying ? pauseLabel : playLabel);
      if (state) {
        state.textContent = isPlaying ? "Pause" : "Play";
      }
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

    copy.setAttribute("aria-label", copyLabel);
    copy.addEventListener("click", copyTrack);

    audio.addEventListener("play", function () {
      setState(true);
    });

    audio.addEventListener("pause", function () {
      setState(false);
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", function () {
      progressBar && (progressBar.style.width = "0%");
      setState(false);
    });

    audio.addEventListener("error", showError);
    setState(false);
    updateProgress();
    updateTrack();
    window.setInterval(updateTrack, 30000);
  }

  function init() {
    document.querySelectorAll("[data-home-radio]").forEach(initRadio);

    document.addEventListener("click", function (event) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
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
      && !link.href.startsWith("mailto:")
      && !link.hasAttribute("download")
      && !link.closest("[data-no-spa]");
  }

  async function navigate(url, addHistoryEntry) {
    if (navigationInProgress) return;
    navigationInProgress = true;

    try {
      const response = await fetch(url, {
        credentials: "same-origin",
        headers: { "X-Requested-With": "partial-navigation" }
      });
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