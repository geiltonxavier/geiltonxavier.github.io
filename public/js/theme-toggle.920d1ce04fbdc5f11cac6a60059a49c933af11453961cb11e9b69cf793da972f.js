(function () {
  const KEY = "color-theme";

  function current() {
    return document.body.classList.contains("dark") ? "dark" : "light";
  }

  function syncButtons(theme) {
    const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      const icon = btn.querySelector("[data-theme-toggle-icon]");
      if (icon) icon.textContent = theme === "dark" ? "\u2600" : "\u263e";
    });
  }

  function apply(theme) {
    document.body.classList.remove("auto", "light", "dark");
    document.body.classList.add(theme);
    syncButtons(theme);
  }

  function init() {
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {}
    apply(saved === "dark" ? "dark" : "light");
  }

  document.addEventListener("click", function (event) {
    const btn = event.target instanceof Element ? event.target.closest("[data-theme-toggle]") : null;
    if (!btn) return;
    event.preventDefault();
    const next = current() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    apply(next);
  });

  document.addEventListener("spa:navigated", function () {
    syncButtons(current());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
