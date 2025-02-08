import React from "react";
import countryCodeLookup from "country-code-lookup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWater, faWind } from "@fortawesome/free-solid-svg-icons";
const Weather = ({weather, city}) => {
  const getCountryName = (countryCode) => {
    const country = countryCodeLookup.byIso(countryCode.toUpperCase());
    return country ? country.country : "Country code not found";
  };
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
          <div className="humidity-wind">
            <div>
              <FontAwesomeIcon icon={faWater} />
              <p>
                Humidity: {weather.main.humidity}%
              </p>
            </div>
            <div>
              <FontAwesomeIcon icon={faWind} />
              <p>
                Wind Speed: {weather.wind.speed} km/h
              </p>
              <p>
                Gusts: {weather.wind.gust} km/h
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Weather;