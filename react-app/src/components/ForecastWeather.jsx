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
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const getDayFromTimestamp = (dt_txt) => {
    const date = new Date(dt_txt);
    return dayNames[date.getDay()];
  };
  const getDateFromTimestamp = (dt_txt) => {
    const date = new Date(dt_txt)
    return monthNames[date.getMonth()] + " " + date.getDate()
  }
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
  const getPrecipitation = (listEntry) => {
    const snow = listEntry.snow?.["3h"] || 0;
    const rain = listEntry.rain?.["3h"] || 0;
    return snow + rain;
  };
  const renderForecast = () => {
    const forecastElements = [];
    for (let i = 0; i < forecastWeather.list.length; i++) {
      forecastElements.push(
        <div key={i + "forecast"} className="forecast-entry">
          <p>{getDayFromTimestamp(forecastWeather.list[i].dt_txt)}</p>
          <p>{getDateFromTimestamp(forecastWeather.list[i].dt_txt)}</p>
          <p>{formatTime(forecastWeather.list[i].dt_txt).time}</p>
          <p>{formatTime(forecastWeather.list[i].dt_txt).period}</p>
          <div className="flex justify-center items-center w-[80px] h-[80px]">
            <img
              src={`https://openweathermap.org/img/wn/${forecastWeather.list[i].weather[0].icon}@2x.png`}
              alt="weather-icon"
              className="w-[72px] h-[72px] object-contain"
            />
          </div>
          <p className="ppt-value">
            ppt: {getPrecipitation(forecastWeather.list[i])} mm/h
          </p>
        </div>
      );
    }
    return forecastElements;
  };

  return (
  <div className="forecast">
    <h1>5 Day / 3 Hour Forecast</h1>
    <div className="forecast-container">
      {renderForecast()}
    </div>
  </div>
  )
};

export default ForecastWeather;
