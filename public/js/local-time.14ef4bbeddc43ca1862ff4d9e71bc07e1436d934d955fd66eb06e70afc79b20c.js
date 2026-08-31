(function () {
  const timeNode = document.querySelector("[data-local-time]");
  const weatherNode = document.querySelector("[data-local-weather]");

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

  async function fetchLocalTemperature() {
    if (!weatherNode || !navigator.geolocation) return;

    const getPosition = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30 * 60 * 1000
      });
    });

    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto&forecast_days=1`
      );

      if (!response.ok) {
        weatherNode.textContent = "";
        return;
      }

      const data = await response.json();
      const temperature = data?.current?.temperature_2m;
      if (typeof temperature !== "number") {
        weatherNode.textContent = "";
        return;
      }

      const celsius = Math.round(temperature);
      weatherNode.textContent = `${celsius}°C`;
    } catch (error) {
      weatherNode.textContent = "";
    }
  }

  updateTime();
  fetchLocalTemperature();
  window.setInterval(updateTime, 30000);
})();
