import React, { useState, useEffect } from "react";
import countryCodeLookup from "country-code-lookup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWater, faWind, faSnowflake, faDroplet, faSun, faGauge, faArrowUp, faArrowDown 
} from "@fortawesome/free-solid-svg-icons";

const Weather = ({ weather, geoLocation, state }) => {
  const backendUrl = "http://localhost:8080";
  const [city, setCity] = useState("");

  useEffect(() => {
    async function fetchCity() {
      try {
        if (geoLocation?.length === 2 && geoLocation[0] && geoLocation[1]) {
          const url = `${backendUrl}/getCityByGeolocation?lat=${geoLocation[0]}&lon=${geoLocation[1]}`;
          const cityResponse = await fetch(url);

          if (!cityResponse.ok) {
            throw new Error(`API error: ${cityResponse.statusText}`);
          }

          const cityData = await cityResponse.json();
          setCity(cityData[0]?.name || "Unknown City");
        } else {
          console.warn("Invalid geolocation data");
        }
      } catch (err) {
        console.error("Error fetching city:", err);
        setCity("Error fetching city");
      }
    }
    fetchCity();
  }, [geoLocation]);

  const getCountryName = (countryCode) => {
    const country = countryCodeLookup.byIso(countryCode.toUpperCase());
    return country ? country.country : "Country code not found";
  };

  function getWindDirection(degree) {
    if (degree >= 337.5 || degree < 22.5) return "North (N)";
    if (degree >= 22.5 && degree < 67.5) return "Northeast (NE)";
    if (degree >= 67.5 && degree < 112.5) return "East (E)";
    if (degree >= 112.5 && degree < 157.5) return "Southeast (SE)";
    if (degree >= 157.5 && degree < 202.5) return "South (S)";
    if (degree >= 202.5 && degree < 247.5) return "Southwest (SW)";
    if (degree >= 247.5 && degree < 292.5) return "West (W)";
    if (degree >= 292.5 && degree < 337.5) return "Northwest (NW)";
  }

  return (
    <div className="weather">
      <div className="weather-overview">
        <h1>{getCountryName(weather.sys.country)}</h1>
        <p>{state}</p>
        <p>{city}</p>
        <div className="flex flex-row space-x-3 items-center justify-center h-full">
          <div className="flex flex-row gap-1">
            <div>
              <h1>{weather.weather[0].main}</h1>
              <p>
                {weather.weather[0].description.charAt(0).toUpperCase() +
                  weather.weather[0].description.slice(1)}
              </p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
          </div>
          <h1>{weather.main.temp}°C</h1>
        </div>
      </div>
      <div className="weather-details">
        <div className="temp-details">
          <p>High: {weather.main.temp_max}°C <FontAwesomeIcon icon={faArrowUp} /></p>
          <p>Low: {weather.main.temp_min}°C <FontAwesomeIcon icon={faArrowDown} /></p>
          <p>Feels Like: {weather.main.feels_like}°C</p>
        </div>
        <div className="wind">
          <div className="wind-title">
            <p>Wind</p>
            <FontAwesomeIcon icon={faWind} />
          </div>
          <div className="wind-details">
            <p>Speed: {weather.wind.speed} km/h</p>
            <p>Gusts: {weather.wind.gust} km/h</p>
            <p>Direction: {getWindDirection(weather.wind.deg)}</p>
          </div>
        </div>
        <div className="humidity-precipitation">
          <div>
            <p>Humidity</p>
            <div className="label">
              <FontAwesomeIcon icon={faWater} />
              <p>{weather.main.humidity}%</p>
            </div>
          </div>
          {weather.rain?.["1h"] && (
            <div className="precipitation">
              <p>Precipitation</p>
              <div className="label">
                <FontAwesomeIcon icon={faDroplet} />
                <p>{weather.rain["1h"]} mm/h</p>
              </div>
            </div>
          )}
          {weather.snow?.["1h"] && (
            <div className="precipitation">
              <p>Precipitation</p>
              <div className="label">
                <FontAwesomeIcon icon={faSnowflake} />
                <p>{weather.snow["1h"]} mm/h</p>
              </div>
            </div>
          )}
          {!weather.rain?.["1h"] && !weather.snow?.["1h"] && (
            <div className="precipitation">
              <p>Precipitation</p>
              <div className="label">
                <FontAwesomeIcon icon={faSun} />
                <p>0 mm/h</p>
              </div>
            </div>
          )}
          <div>
            <p>Pressure</p>
            <div className="label">
              <FontAwesomeIcon icon={faGauge} />
              <p>{(weather.main.pressure * 0.1).toFixed(1)} kPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
