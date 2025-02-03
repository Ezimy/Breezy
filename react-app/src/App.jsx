import React, { useState, useEffect } from "react";
import CurrentDate from "./components/CurrentDate";

function App() {
  const [city, setCity] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [geoLocation, setGeoLocation] = useState([0, 0]); // [lat, lon]
  // const backendUrl = 'https://breezy-1073093010663.northamerica-northeast2.run.app';
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

  // Fetch weather data by geolocation
  async function fetchWeather() {
    try {
        if (geoLocation?.length === 2 && geoLocation[0] && geoLocation[1]) {
            const weatherUrl = `/getWeather?lat=${geoLocation[0]}&lon=${geoLocation[1]}`;
            const weatherResponse = await fetch(weatherUrl);
            
            if (!weatherResponse.ok) {
                throw new Error(`API error: ${weatherResponse.statusText}`);
            }

            const weatherData = await weatherResponse.json();
            setWeather(weatherData);
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
      const geoUrl = `/getGeolocation?city=${city}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      setGeoLocation([geoData[0].lat, geoData[0].lon]);
      if (geoData.length === 0) {
        throw new Error("Location not found");
      }
    } catch (err) {
      console.log("Error fetching geolocation", err);
    }
  }

  // Event handler for search input
  const handleSearch = () => {
    setCity(searchValue);
  };

  // Fetch user's location on component mount
  useEffect(() => {
    if (geoLocation[0] === 0 && geoLocation[1] === 0) {
      getLocation();
    }
  }, []);

  // Fetch weather whenever geoLocation updates
  useEffect(() => {
    if (geoLocation[0] !== 0 && geoLocation[1] !== 0) {
      fetchWeather();
    }
  }, [geoLocation]);

  // Fetch geolocation by city whenever city updates
  useEffect(() => {
    if (city) {
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
        <div>
          <div className="date-weather">
            <CurrentDate />
            <div>
              {weather?.name ? `${weather.name}${city ? `, ${city}` : ""}` : "No name"}
            </div>
            <div>
              <h1>{weather?.main?.temp ? `${weather.main.temp}°C` : "Loading..."}</h1>
              {weather?.main && (
                <div>
                  <p>High: {weather.main.temp_max}°C</p>
                  <p>Low: {weather.main.temp_min}°C</p>
                </div>
              )}
            </div>
            <div>
              {weather?.weather?.[0] && (
                <>
                  <h1>{weather.weather[0].main}</h1>
                  <p>
                    {weather.weather[0].description.charAt(0).toUpperCase() +
                      weather.weather[0].description.slice(1)}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="Weather icon"
                  />
                </>
              )}
            </div>
          </div>
          <div className="feels-humidity">
            <div>
              <p>{weather?.main?.feels_like ? `Feels Like: ${weather.main.feels_like}°C` : ""}</p>
            </div>
            <div>
              <p>{weather?.main?.humidity ? `Humidity: ${weather.main.humidity}%` : ""}</p>
            </div>
            <div>
              <p>{weather?.wind?.speed ? `Wind Speed: ${weather.wind.speed} km/h` : ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
