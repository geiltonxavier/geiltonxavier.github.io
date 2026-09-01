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
      const ipNode = document.querySelector("[data-copy-ip]");

      const setupCopyIp = (ip) => {
        if (!ipNode || !ip || ipNode.dataset.bound === "true") return;
        ipNode.dataset.bound = "true";
        ipNode.hidden = false;

        const idleLabel = ipNode.dataset.label || "Copy IP";
        const copiedLabel = ipNode.dataset.copiedLabel || "Copied";
        const iconNode = ipNode.querySelector("[data-copy-ip-icon]");
        const idleIcon = iconNode ? iconNode.textContent : "";
        ipNode.setAttribute("aria-label", idleLabel + ": " + ip);
        ipNode.setAttribute("title", ip);

        ipNode.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(ip);
          } catch (clipboardError) {
            const fallback = document.createElement("textarea");
            fallback.value = ip;
            fallback.setAttribute("readonly", "");
            fallback.style.position = "fixed";
            fallback.style.opacity = "0";
            document.body.appendChild(fallback);
            fallback.select();
            document.execCommand("copy");
            fallback.remove();
          }

          if (iconNode) iconNode.textContent = "✓";
          ipNode.setAttribute("aria-label", copiedLabel + ": " + ip);
          window.setTimeout(() => {
            if (iconNode) iconNode.textContent = idleIcon;
            ipNode.setAttribute("aria-label", idleLabel + ": " + ip);
          }, 1600);
        });
      };

      const resolveCoordinates = async () => {
        const providers = [
          {
            url: "https://ipapi.co/json/",
            parse: (data) => ({ latitude: Number(data?.latitude), longitude: Number(data?.longitude), ip: data?.ip })
          },
          {
            url: "https://ipwho.is/",
            parse: (data) => ({ latitude: Number(data?.latitude), longitude: Number(data?.longitude), ip: data?.ip })
          },
          {
            url: "https://freeipapi.com/api/json",
            parse: (data) => ({ latitude: Number(data?.latitude), longitude: Number(data?.longitude), ip: data?.ipAddress })
          }
        ];

        for (const provider of providers) {
          try {
            const response = await fetch(provider.url, { headers: { Accept: "application/json" } });
            if (!response.ok) continue;

            const data = await response.json();
            const { latitude, longitude, ip } = provider.parse(data);
            if (ip) setupCopyIp(String(ip));
            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
              return { latitude, longitude };
            }
          } catch (providerError) {
            /* try the next provider */
          }
        }

        return null;
      };

      if (!weatherNode) return;

      try {
        const coordinates = await resolveCoordinates();
        if (!coordinates) {
          weatherNode.textContent = "";
          return;
        }

        const { latitude, longitude } = coordinates;

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
  document.addEventListener("spa:navigated", init);
})();
