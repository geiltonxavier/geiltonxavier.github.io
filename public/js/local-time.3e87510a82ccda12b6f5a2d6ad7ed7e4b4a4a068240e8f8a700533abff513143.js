(function () {
  const formatLocalTime = (date) => new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short"
  }).format(date).replace(/GMT.*/, "").trim();

  const weatherClasses = {
    clear: "weather-clear",
    cloudy: "weather-cloudy",
    rain: "weather-rain",
    snow: "weather-snow",
    fog: "weather-fog",
    storm: "weather-storm",
    night: "weather-night"
  };

  const getWeatherClass = (code, isNight) => {
    if (isNight) return weatherClasses.night;

    if ([0].includes(code)) return weatherClasses.clear;
    if ([1, 2, 3].includes(code)) return weatherClasses.cloudy;
    if ([45, 48].includes(code)) return weatherClasses.fog;
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return weatherClasses.rain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return weatherClasses.snow;
    if ([95, 96, 99].includes(code)) return weatherClasses.storm;

    return weatherClasses.cloudy;
  };

  const setAmbientWeather = (temperature, code, hour) => {
    const body = document.body;
    if (!body) return;

    Object.keys(weatherClasses).forEach((key) => {
      body.classList.remove(weatherClasses[key]);
    });

    const isNight = hour >= 18 || hour < 6;
    body.classList.add(getWeatherClass(code, isNight));

    body.style.setProperty("--ambient-temp", temperature >= 25 ? "1" : temperature <= 10 ? "-1" : "0");
  };

  const init = () => {
    const timeNode = document.querySelector("[data-local-time]");
    const weatherNode = document.querySelector("[data-local-weather]");

    if (!timeNode || timeNode.dataset.bound === "true") return;

    timeNode.dataset.bound = "true";

    const updateTime = () => {
      const now = new Date();
      timeNode.textContent = formatLocalTime(now);
    };

    const fetchLocalTemperature = async () => {
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
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto&forecast_days=1`,
          { headers: { Accept: "application/json" } }
        );

        if (!weatherResponse.ok) {
          weatherNode.textContent = "";
          return;
        }

        const weatherData = await weatherResponse.json();
        const temperature = weatherData?.current?.temperature_2m;
        const code = weatherData?.current?.weather_code;
        const hour = new Date().getHours();

        if (typeof temperature !== "number") {
          weatherNode.textContent = "";
          return;
        }

        weatherNode.textContent = `${Math.round(temperature)}°C`;
        setAmbientWeather(Math.round(temperature), Number(code), hour);
      } catch (error) {
        weatherNode.textContent = "";
      }
    };

    updateTime();
    fetchLocalTemperature();
    window.setInterval(updateTime, 30000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("pageshow", init);
})();
