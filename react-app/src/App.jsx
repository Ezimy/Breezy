import React, { useState, useEffect, useRef } from "react";
import CurrentDate from "./components/CurrentDate";
import LocationDate from "./components/LocationDate";
import ForecastWeather from "./components/ForecastWeather";
import Weather from "./components/Weather";
function App() {
  const hasMountedGeoLocation = useRef(false);
  const hasMountedCity = useRef(false);
  const [city, setCity] = useState("No City In useState Yet");
  const [searchValue, setSearchValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [geoLocation, setGeoLocation] = useState([null, null]); // [lat, lon]
  const [forecastWeather, setForecastWeather] = useState(null);
  const backendUrl = "http://localhost:8080";

  // Use JS navigator.geolocation to get device location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setGeoLocation([lat, lon]);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  };
  //Fetch city data by geolocation
  async function fetchCityByGeolocation() {
    try {
      if (geoLocation?.length === 2 && geoLocation[0] && geoLocation[1]) {
        const url = `${backendUrl}/getCityByGeolocation?lat=${geoLocation[0]}&lon=${geoLocation[1]}`;
        const cityResponse = await fetch(url);

        if (!cityResponse.ok) {
          throw new Error(`API error: ${cityResponse.statusText}`);
        }

        const cityData = await cityResponse.json();
        setCity(cityData[0].name);
      } else {
        console.warn("Invalid geolocation data");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  }
  // Fetch weather data by geolocation
  async function fetchWeather() {
    try {
      if (geoLocation?.length === 2 && geoLocation[0] && geoLocation[1]) {
        const weatherUrl = `${backendUrl}/getWeather?lat=${geoLocation[0]}&lon=${geoLocation[1]}`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          throw new Error(`API error: ${weatherResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
        console.log(weatherData)
      } else {
        console.warn("Invalid geolocation data");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  }

  //fetch geolation with city using openweathermap api
  async function fetchGeoLocationByCity() {
    try {
      const geoUrl = `${backendUrl}/getGeolocation?city=${city}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse) {
        throw new Error("Location not found");
      }
      const geoData = await geoResponse.json();
      setGeoLocation([geoData[0].lat, geoData[0].lon]);
    } catch (err) {
      console.log("Error fetching geolocation", err);
    }
  }

  //fetch hourly weather with geolocation using openweathermapapi
  async function fetchForecastWeather() {
    try {
      if (geoLocation?.length === 2 && geoLocation[0] && geoLocation[1]) {
        const weatherUrl = `${backendUrl}/getForecastWeather?lat=${geoLocation[0]}&lon=${geoLocation[1]}`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          throw new Error(`API error: ${weatherResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        // console.log(weatherData);
        setForecastWeather(weatherData);
      } else {
        console.warn("Invalid geolocation data");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  }
  // Event handler for search input
  const handleSearch = () => {
    setCity(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch weather whenever geoLocation updates (but skip first render)
  useEffect(() => {
    if (!hasMountedGeoLocation.current) {
      hasMountedGeoLocation.current = true; // Mark it as mounted
      return; // Skip execution on mount
    }

    if (geoLocation !== null) {
      fetchWeather();
      fetchCityByGeolocation();
      fetchForecastWeather();
    }
  }, [geoLocation]);

  // Fetch geolocation by city whenever city updates (but skip first render)
  useEffect(() => {
    if (!hasMountedCity.current) {
      hasMountedCity.current = true;
      return;
    }

    if (city !== "No City In useState Yet") {
      fetchGeoLocationByCity();
    }
  }, [city]);
  // Function to determine background class based on weather condition
  function getBackgroundClass(weatherCondition) {
    if (!weatherCondition) return "bg-default";

    switch (weatherCondition) {
      case "Thunderstorm":
        return "bg-thunderstorm";
      case "Drizzle":
        return "bg-drizzle";
      case "Rain":
        return "bg-rain";
      case "Snow":
        return "bg-snow";
      case "Mist":
        return "bg-mist";
      case "Smoke":
        return "bg-smoke";
      case "Haze":
        return "bg-haze";
      case "Dust":
        return "bg-dust";
      case "Fog":
        return "bg-fog";
      case "Sand":
        return "bg-sand";
      case "Ash":
        return "bg-ash";
      case "Squall":
        return "bg-squall";
      case "Tornado":
        return "bg-tornado";
      case "Clear":
        return "bg-clear";
      case "Clouds":
        return "bg-clouds";
      default:
        return "bg-default";
    }
  }

  return (
    <div className={`${getBackgroundClass(weather?.weather?.[0]?.main)}`}>
      <div className="appContainer">
        <div className="bg-black/25 p-16">
          <div className="dates">
              <div>
                <p>Local</p>
                <CurrentDate />
              </div>
              <div>
                <p>{city}</p>
                {weather ? (
                  <LocationDate timezoneOffset={weather.timezone}/>
                ) : (
                  "Loading Time"
                )}
              </div>
          </div>
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            type="text"
            placeholder="Enter location"
            className="search"
          />
          {weather ? <Weather weather={weather} city={city}/> : 'Loading Weather'}
          {forecastWeather ? <ForecastWeather {...forecastWeather} /> : "Forecast Loading"}
        </div>
      </div>
    </div>
  );
}

export default App;
