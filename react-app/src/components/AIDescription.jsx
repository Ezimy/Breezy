import React, { useState, useEffect } from "react";
import logo from "/Google_Gemini_logo.png";

const AIDescription = ({ weather, city, state }) => {
  const backendUrl = "https://backend-1073093010663.us-east1.run.app";
  const [weatherInformation, setWeatherInformation] = useState("");
  const [description, setDescription] = useState("");

  // Function to create weather information string
  useEffect(() => {
    if (!weather || !city) return; // Ensure weather and city are available

    const weatherText = `
      Country: ${weather.sys.country},
      City: ${city},
      ${state ? `State: ${state},` : ""}
      Temp: ${weather.main.temp}°C,
      High: ${weather.main.temp_max}°C,
      Low: ${weather.main.temp_min}°C,
      Feels: ${weather.main.feels_like}°C,
      Wind Speed: ${weather.wind.speed} m/s,
      Wind Gust: ${weather.wind.gust ? weather.wind.gust + " m/s" : "N/A"},
      Wind Direction: ${weather.wind.deg}°,
      Humidity: ${weather.main.humidity}%,
      Precipitation: ${
        weather.snow
          ? `Snow: ${weather.snow["1h"] || weather.snow["3h"]} mm`
          : weather.rain
          ? `Rain: ${weather.rain["1h"] || weather.rain["3h"]} mm`
          : "No Precipitation"
      },
      Pressure: ${weather.main.pressure} hPa
    `;

    setWeatherInformation(weatherText);
  }, [weather, city, state]);

  // Fetch AI description after weatherInformation is set
  useEffect(() => {
    if (!weatherInformation) return; // Prevent API call with empty data

    const fetchDescription = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/getAIDescription?weather=${weatherInformation}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch AI description");
        }
        const text = await response.text();
        setDescription(text);
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };

    fetchDescription();
  }, [weatherInformation]); // Now fetch only when weatherInformation updates

  return (
    <div className="ai-description">
      {description && <p>{description}</p>}
      <div className="flex items-center justify-end gap-2">
        <p className="ai-footer">Generated By</p>
        <img src={logo} alt="gemini-logo" className="-mt-3" />
      </div>
    </div>
  );
};

export default AIDescription;
