import React from "react";

const ForecastWeather = (forecastWeather) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDayFromTimestamp = (dt_txt) => {
    const date = new Date(dt_txt);
    return dayNames[date.getDay()];
  };
  const formatTime = (dt_txt) => {
    const date = new Date(dt_txt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return {
      time: `${hours}:${formattedMinutes}`,
      period: `${amPm}`,
    };
  };

  const renderForecast = () => {
    const forecastElements = [];
    for (let i = 0; i < forecastWeather.list.length; i++) {
      forecastElements.push(
        <div key={i + "forecast"} className="forecast-entry">
          <p>{getDayFromTimestamp(forecastWeather.list[i].dt_txt)}</p>
          <p>{formatTime(forecastWeather.list[i].dt_txt).time}</p>
          <p>{formatTime(forecastWeather.list[i].dt_txt).period}</p>
          <img
            src={`https://openweathermap.org/img/wn/${forecastWeather.list[i].weather[0].icon}@2x.png`}
            alt="weather-icon"
          />
          <p>{(forecastWeather.list[i].main.temp - 273.15).toFixed(1)}°C</p>
        </div>
      );
    }
    return forecastElements;
  };

  return <div className="forecast-container">{renderForecast()}</div>;
};

export default ForecastWeather;
