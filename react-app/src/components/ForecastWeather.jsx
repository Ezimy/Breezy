import React from 'react'

const ForecastWeather = (forecastWeather) => {
      const renderForecast = () => {
        const forecastElements = [];
        for (let i = 0; i < 8; i++) {
            forecastElements.push(<p>{forecastWeather.list[i].dt_txt}</p>);
            forecastElements.push(<p key={i}>{(forecastWeather.list[i].main.temp - 273.15).toFixed(1)}°C</p>);
        }
        return forecastElements;
    };

    return <div>{renderForecast()}</div>;
}

export default ForecastWeather
