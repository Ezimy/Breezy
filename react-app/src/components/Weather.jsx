import React from "react";
import countryCodeLookup from "country-code-lookup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWater, faWind, faSnowflake, faDroplet, faSun } from "@fortawesome/free-solid-svg-icons";
const Weather = ({weather, city}) => {
  const getCountryName = (countryCode) => {
    const country = countryCodeLookup.byIso(countryCode.toUpperCase());
    return country ? country.country : "Country code not found";
  };
  function getWindDirection(degree) {
    if (degree >= 337.5 || degree < 22.5) return 'North (N)';
    if (degree >= 22.5 && degree < 67.5) return 'Northeast (NE)';
    if (degree >= 67.5 && degree < 112.5) return 'East (E)';
    if (degree >= 112.5 && degree < 157.5) return 'Southeast (SE)';
    if (degree >= 157.5 && degree < 202.5) return 'South (S)';
    if (degree >= 202.5 && degree < 247.5) return 'Southwest (SW)';
    if (degree >= 247.5 && degree < 292.5) return 'West (W)';
    if (degree >= 292.5 && degree < 337.5) return 'Northwest (NW)';
  }
  return (
    <div className="weather">
        <div className="weather-overview">
            <h1>{getCountryName(weather.sys.country)}</h1>
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
                <h1>
                    {weather.main.temp}
                </h1>
            </div>
        </div>
        <div className="weather-details">
          <div className="temp-details">
              <p>High: {weather.main.temp_max}°C</p>
              <p>Low: {weather.main.temp_min}°C</p>
              <p>Feels Like: {weather.main.feels_like}°C</p>
          </div>
          <div className="wind">
            <FontAwesomeIcon icon={faWind} />
            <p>
              Wind Speed: {weather.wind.speed} km/h
            </p>
            <p>
              Gusts: {weather.wind.gust} km/h
            </p>
            <p>Wind Direction: {getWindDirection(weather.wind.deg)}</p>
          </div>
          <div className="humidity-precipitation">
              <div>
                <FontAwesomeIcon icon={faWater} />
                <p>
                  Humidity: {weather.main.humidity}%
                </p>
              </div>
              {weather.rain?.["1h"] && (
                <div>
                  <FontAwesomeIcon icon={faDroplet}/>
                  <p>Precipitation: {weather.rain["1h"]} mm/h</p>
                </div>
              )}
              
              {weather.snow?.["1h"] && (
                <div>
                  <FontAwesomeIcon icon={faSnowflake}/>
                  <p>Precipitation: {weather.snow["1h"]} mm/h</p>
                </div>
              )}

              {!weather.rain?.["1h"] && !weather.snow?.["1h"] && (
                <div>
                  <FontAwesomeIcon icon={faSun}/>
                  <p>Precipitation: 0 mm/h</p>
                </div>
              )}
          </div>
        </div>
    </div>
  );
};

export default Weather;