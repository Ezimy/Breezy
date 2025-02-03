const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("react-app/dist"));
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
app.get("/getGeolocation", async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
          return res.status(400).json({ error: "City is required" });
        }
    
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);
      } catch (error) {
        console.error("Error fetching geolocation:", error.message);
        res.status(500).json({ error: "Failed to fetch geolocation data" });
      }
});

app.get("/getWeather", async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
          return res.status(400).json({ error: "Latitude and Longitude are required" });
        }
    
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        res.json(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
      }
});