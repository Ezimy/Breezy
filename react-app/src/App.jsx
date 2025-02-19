import React, { useState, useEffect, useRef, useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import CurrentDate from "./components/CurrentDate";
import LocationDate from "./components/LocationDate";
import ForecastWeather from "./components/ForecastWeather";
import Weather from "./components/Weather";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { LocationContext } from "./context/LocationContext";

function App() {
  const hasMountedGeoLocation = useRef(false);
  const hasMountedCity = useRef(false);
  const { city, setCity, state, setState } = useContext(LocationContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [geoLocation, setGeoLocation] = useState([null, null]); // [lat, lon]
  const [forecastWeather, setForecastWeather] = useState(null);
  const [geoLocationOptions, setGeoLocationOptions] = useState([]);
  const backendUrl = "http://localhost:8080";

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
  async function fetchGeoLocationBySearchQuery() {
    try {
      const geoUrl = `${backendUrl}/getGeolocation?city=${searchQuery}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error("Location not found");
      }
      const geoData = await geoResponse.json();

      const uniqueGeoData = [];
      const seenNames = new Set();

      for (const location of geoData) {
        const locationKey = `${location.name}-${location.state}-${location.country}`;
        if (!seenNames.has(locationKey)) {
          uniqueGeoData.push(location);
          seenNames.add(locationKey);
        }
      }
      setGeoLocationOptions(uniqueGeoData);
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
        setForecastWeather(weatherData);
      } else {
        console.warn("Invalid geolocation data");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  }
  // Event handler for search input
  const handleSearch = () => {
    setSearchQuery(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
    setState("");
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch weather whenever geoLocation updates (but skip first render)
  useEffect(() => {
    if (!hasMountedGeoLocation.current) {
      hasMountedGeoLocation.current = true; // Mark it as mounted
      return; // Skip execution on mount
    }

    if (geoLocation !== null) {
      fetchWeather();
      fetchForecastWeather();
    }
  }, [geoLocation]);

  // Fetch geolocation by city whenever city updates (but skip first render)
  useEffect(() => {
    if (!hasMountedCity.current) {
      hasMountedCity.current = true;
      return;
    }

    if (city !== "No City In useState Yet") {
      fetchGeoLocationBySearchQuery();
    }
  }, [searchQuery]);
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
      <div className="app">
        <div className="app-container">
          <Header />
          <div className="flex-1">
            {weather?
            (<div className="dates justify-between">
              <div>
                <p>Local</p>
                <CurrentDate />
              </div>
              <div>
                <p>
                  {city} {state ? `, ${state}` : ""}
                  {weather && weather.sys.country
                    ? `, ${weather.sys.country}`
                    : ""}
                </p>
                {weather ? (
                  <LocationDate timezoneOffset={weather.timezone} />
                ) : (
                  ""
                )}
              </div>
            </div>)
            :
            (<div className="dates justify-center">
              <div>
                <p>Local</p>
                <CurrentDate />
              </div>
              <div>
                <p>
                  {city} {state ? `, ${state}` : ""}
                  {weather && weather.sys.country
                    ? `, ${weather.sys.country}`
                    : ""}
                </p>
              </div>
            </div>)
            }
            <Autocomplete
              onChange={(event, newValue) => {
                if (newValue) {
                  const { lat, lon, state } = newValue;
                  setGeoLocation([lat, lon]);
                  setState(state);
                }
              }}
              onInputChange={(event, newInputValue) =>
                setSearchValue(newInputValue)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              options={geoLocationOptions}
              getOptionLabel={(option) => {
                const values = [
                  option.name,
                  option.state,
                  option.country,
                ].filter((value) => value != null);
                return values.join(", ");
              }}
              value={
                geoLocationOptions.find(
                  (opt) =>
                    opt.lat === geoLocation[0] &&
                    opt.lon === geoLocation[1] &&
                    opt.state === opt.state
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter a Location"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                    input: { color: "white" },
                  }}
                />
              )}
              sx={{
                width: "100%",
                "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator":
                  {
                    color: "white",
                  },
              }}
            />

            {weather ? (
              <Weather
                weather={weather}
                geoLocation={geoLocation}
              />
            ) : (
              ""
            )}
            {forecastWeather ? (
              <ForecastWeather {...forecastWeather} />
            ) : (
              ""
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
