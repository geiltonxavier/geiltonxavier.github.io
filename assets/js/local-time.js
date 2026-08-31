(function () {
  const timeNode = document.querySelector("[data-local-time]");
  if (!timeNode) return;

  function formatLocalTime(date) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short"
    }).format(date).replace(/GMT.*/, "").trim();
  }

  function updateTime() {
    const now = new Date();
    timeNode.textContent = formatLocalTime(now);
  }

  updateTime();
  window.setInterval(updateTime, 30000);
})();
