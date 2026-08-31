(function () {
  const init = () => {
    const timeNode = document.querySelector("[data-local-time]");
    const weatherNode = document.querySelector("[data-local-weather]");

    if (!timeNode) return false;

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

    async function fetchLocalTemperature() {
      if (!weatherNode) return;

      try {
        const ipResponse = await fetch("https://ipapi.co/json/", {
          headers: { Accept: "application/json" }
        });

        if (!ipResponse.ok) {
          weatherNode.textContent = "";
          return;
        }

        const ipData = await ipResponse.json();
        const latitude = Number(ipData?.latitude);
        const longitude = Number(ipData?.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          weatherNode.textContent = "";
          return;
        }

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto&forecast_days=1`,
          { headers: { Accept: "application/json" } }
        );

        if (!weatherResponse.ok) {
          weatherNode.textContent = "";
          return;
        }

        const weatherData = await weatherResponse.json();
        const temperature = weatherData?.current?.temperature_2m;

        if (typeof temperature !== "number") {
          weatherNode.textContent = "";
          return;
        }

        weatherNode.textContent = `${Math.round(temperature)}°C`;
      } catch (error) {
        weatherNode.textContent = "";
      }
    }

    updateTime();
    fetchLocalTemperature();

    if (!timeNode.dataset.clockInterval) {
      timeNode.dataset.clockInterval = String(window.setInterval(updateTime, 30000));
    }

    return true;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("pageshow", () => {
    init();
  });
})();
