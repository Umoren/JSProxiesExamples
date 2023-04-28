async function fetchWeatherData(city) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    "New York": { temperature: 75, condition: "Sunny" },
    "San Francisco": { temperature: 68, condition: "Cloudy" },
    Tokyo: { temperature: 60, condition: "Rainy" },
  };

  return data[city] || { error: "City not found" };
}

function createMemoizationProxy(fetchFn, ttl) {
  const cache = new Map();

  return new Proxy(fetchFn, {
    async apply(target, thisArg, args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        const cachedData = cache.get(key);

        if (Date.now() - cachedData.timestamp < ttl) {
          console.log("Cache hit:", key);
          return cachedData.data;
        } else {
          console.log("Cache expired:", key);
          cache.delete(key);
        }
      }

      const data = await Reflect.apply(target, thisArg, args);
      cache.set(key, { data, timestamp: Date.now() });
      console.log("Cache set:", key);
      return data;
    },
  });
}

const memoizedFetchWeatherData = createMemoizationProxy(
  fetchWeatherData,
  10000
);

document.getElementById("fetch-weather").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value;
  const weatherResult = document.getElementById("weather-result");

  if (!city) {
    weatherResult.textContent = "Please enter a city name";
    return;
  }

  const weatherData = await memoizedFetchWeatherData(city);

  if (weatherData.error) {
    weatherResult.textContent = weatherData.error;
  } else {
    weatherResult.textContent = `Temperature: ${weatherData.temperature}°F, Condition: ${weatherData.condition}`;
  }
});
