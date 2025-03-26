import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "weather-icons-react";

const WeatherUpdates = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=8de7852c0d7824f9c8d89ff302db0672`
        );
        const data = await response.json();
        
        if (data.cod !== 200) {
          throw new Error(data.message);
        }
        
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return <WiDaySunny size={64} color="#f39c12" />;
      case "Clouds":
        return <WiCloud size={64} color="#7f8c8d" />;
      case "Rain":
        return <WiRain size={64} color="#3498db" />;
      case "Snow":
        return <WiSnow size={64} color="#ecf0f1" />;
      case "Thunderstorm":
        return <WiThunderstorm size={64} color="#e74c3c" />;
      default:
        return <WiCloud size={64} color="#7f8c8d" />;
    }
  };

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Real-Time Weather Updates</Typography>

      {loading ? (
        <CircularProgress color="success" />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : weather && weather.weather ? (
        <Card sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 5, borderRadius: "16px", textAlign: "center" }}>
          {getWeatherIcon(weather.weather[0]?.main)}
          <CardContent>
            <Typography variant="h5" fontWeight="bold">{weather.name}</Typography>
            <Typography variant="h6">{weather.weather[0]?.description}</Typography>
            <Typography variant="h4" color="primary">{weather.main.temp}°C</Typography>
            <Typography color="text.secondary">Humidity: {weather.main.humidity}%</Typography>
            <Typography color="text.secondary">Wind Speed: {weather.wind.speed} m/s</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography color="error">No weather data available.</Typography>
      )}
    </Container>
  );
};

export default WeatherUpdates;
