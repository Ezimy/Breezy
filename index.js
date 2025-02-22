const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("react-app/dist"));
require("dotenv").config();
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const port = process.env.PORT || 8080;

app.use(cors());

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
//get weather
app.get("/getWeather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});
//Call 5 day / 3 hour forecast data
app.get("/getForecastWeather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching hourly weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch hourly weather data" });
  }
});
//get city from geolocation
app.get("/getCityByGeolocation", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching city:", error.message);
    res.status(500).json({ error: "Failed to fetch city data" });
  }
});
//get geolocation
app.get("/getGeolocation", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching geolocation:", error.message);
    res.status(500).json({ error: "Failed to fetch geolocation data" });
  }
});
// Get AI Description
app.get("/getAIDescription", async (req, res) => {
  try {
    const { weather } = req.query;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a brief description of weather with clothing recomendations according to ${weather} keep it under 500 characters, use metric system. Don't mention time of day in description.`;
    const result = await model.generateContent(prompt);

    res.send(result.response.text()); // Fixed AI response handling
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
