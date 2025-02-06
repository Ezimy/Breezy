import React, { useState, useEffect } from "react";
import CurrentDate from "./components/CurrentDate";
import countryCodeLookup from "country-code-lookup";
import LocationDate from "./components/LocationDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWater,faWind } from "@fortawesome/free-solid-svg-icons";
import ForecastWeather from "./components/ForecastWeather";
function App() {
  const [city, setCity] = useState("No City In useState Yet");
  const [searchValue, setSearchValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [geoLocation, setGeoLocation] = useState([0,0]); // [lat, lon]
  const [forecastWeather, setForecastWeather] = useState(null)
  const backendUrl = 'http://localhost:8080';

  const getCountryName = (countryCode) => {
    const country = countryCodeLookup.byIso(countryCode.toUpperCase());
    return country ? country.country : "Country code not found";
  }
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
            setCity(cityData[0].name)
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
      const geoData = await geoResponse.json();
      setGeoLocation([geoData[0].lat, geoData[0].lon]);
      if (geoData.length === 0) {
        throw new Error("Location not found");
      }
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
          console.log(weatherData)
          setForecastWeather(weatherData)
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
    fetchCityByGeolocation()
  }, [geoLocation]);

  // Fetch geolocation by city whenever city updates
  useEffect(() => {
    if (city) {
      fetchGeoLocationByCity();
    }
  }, [city]);
  fetchForecastWeather();
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
            <div className="dates">
              <div>
                <p>Local time/date:</p>
                <CurrentDate />
              </div>
              <div>
                <p>Time/date in {city}</p>
                {weather? <LocationDate timezoneOffset={weather.timezone} city={city}/> : "Loading Time"}
              </div>
            </div>
            {forecastWeather? <ForecastWeather {...forecastWeather}/> : 'Forecast Loading'}
            <div>
              <h1>{weather? `${getCountryName(weather.sys.country)}` : ""}</h1>
              {weather?.name ? `${city ? `${city}` : ""}` : "No City name"}
            </div>
            <div>
              <h1>{weather?.main?.temp ? `${weather.main.temp}°C` : "Loading..."}</h1>
              {weather?.main && (
                <div>
                  <p>High: {weather.main.temp_max}°C</p>
                  <p>Low: {weather.main.temp_min}°C</p>
                  <p>Feels Like: {weather.main.feels_like}°C</p>
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
          <div className="humidity-wind">
            <div>
              <FontAwesomeIcon icon={faWater}/>
              <p>{weather?.main?.humidity ? `Humidity: ${weather.main.humidity}%` : ""}</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faWind}/>
              <p>{weather?.wind?.speed ? `Wind Speed: ${weather.wind.speed} km/h` : ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
