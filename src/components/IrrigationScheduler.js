import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpacityIcon from "@mui/icons-material/Opacity"; // Icon for irrigation
import NavigationBar from "./Navbar"; // Assuming you have a Navbar component
import Chatbot from "./Chatbot"; // Assuming you have a Chatbot component
import { ToastContainer, toast } from "react-toastify"; // For alerts
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const IrrigationScheduler = () => {
  const navigate = useNavigate();

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#388E3C" },
      secondary: { main: "#4CAF50" },
      background: { default: "#f5f5f5", paper: "#fff" },
      text: { primary: "#212121", secondary: "#757575" },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none" },
        },
      },
    },
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Predefined water needs mapping (in liters per day per square meter)
  const waterNeeds = {
    Low: 2, // e.g., Kale, Garlic
    Moderate: 4, // e.g., Wheat, Peas
    High: 6, // e.g., Corn, Rice
  };

  // State management
  const [plannedCrops, setPlannedCrops] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Load crops from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem("plannedCrops");
    if (savedCrops) {
      const crops = JSON.parse(savedCrops);
      setPlannedCrops(crops);
      checkIrrigationAlerts(crops);
    }
  }, []);

  // Fetch weather data (OpenWeatherMap API)
  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?q=Surat&appid=8de7852c0d7824f9c8d89ff302db0672&units=metric"
        );
        const data = await response.json();
        setWeatherData(data.list.slice(0, 5)); // Next 5 days forecast
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeatherData(null);
      }
      setLoadingWeather(false);
    };
    fetchWeather();
  }, []);

  // Calculate timeline progress
  const getTimelineProgress = (plantingDate, harvestDate) => {
    const now = new Date();
    const start = new Date(plantingDate);
    const end = new Date(harvestDate);
    if (now < start) return { status: "Not Started", percent: 0 };
    if (now > end) return { status: "Completed", percent: 100 };
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - start) / (1000 * 60 * 60 * 24);
    const percent = Math.min((daysPassed / totalDays) * 100, 100).toFixed(0);
    return { status: `${percent}%`, percent: parseInt(percent) };
  };

  // Calculate irrigation schedule based on weather and water needs
  const getIrrigationSchedule = (crop, weather) => {
    const baseWaterNeed = waterNeeds[crop.waterNeeds] || 4; // Default to Moderate if undefined
    const today = new Date();
    const schedule = [];

    if (!weather) return "Weather data unavailable";

    weather.forEach((day) => {
      const forecastDate = new Date(day.dt * 1000);
      const daysFromNow = Math.floor((forecastDate - today) / (1000 * 60 * 60 * 24));
      const precipitation = day.rain ? day.rain["3h"] || 0 : 0; // Rain in mm (3-hour forecast)
      const temp = day.main.temp; // Temperature in °C

      // Adjust water need based on temperature (higher temp = more water)
      let adjustedWaterNeed = baseWaterNeed;
      if (temp > 30) adjustedWaterNeed += 1; // Hot weather increases need
      else if (temp < 15) adjustedWaterNeed -= 1; // Cool weather reduces need

      // Subtract precipitation (assuming 1 mm rain = 1 L/m²)
      const waterToAdd = Math.max(adjustedWaterNeed - precipitation, 0);

      schedule.push({
        date: forecastDate.toLocaleDateString(),
        water: waterToAdd > 0 ? `${waterToAdd.toFixed(1)} L/m²` : "No irrigation needed (rain sufficient)",
      });
    });

    return schedule;
  };

  // Check for irrigation alerts
  const checkIrrigationAlerts = (crops) => {
    const today = new Date();
    crops.forEach((crop) => {
      const progress = getTimelineProgress(crop.plantingDate, crop.harvestDate);
      if (progress.percent > 0 && progress.percent < 100) { // Only active crops
        const schedule = getIrrigationSchedule(crop, weatherData);
        if (Array.isArray(schedule) && schedule[0]?.water.includes("L/m²")) {
          toast.info(`Irrigation Alert for ${crop.name}: Water today with ${schedule[0].water}!`, {
            toastId: `irrigation-${crop.id}`,
          });
        }
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavigationBar />
        <Box sx={{ height: { xs: 56, sm: 64, md: 70 } }} />

        {/* Header Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: 6, textAlign: "center" }}
        >
          <Container maxWidth="lg">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/crop-planning")}
              sx={{ mb: 4, color: "#388E3C", borderColor: "#388E3C" }}
            >
              Back to Crop Planning
            </Button>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
              Irrigation Scheduler
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Plan watering based on weather forecasts and crop water needs to save resources.
            </Typography>
          </Container>
        </Box>

        {/* Irrigation Schedule Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Your Irrigation Schedule
            </Typography>
            {plannedCrops.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Crop Name</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Water Needs</TableCell>
                    <TableCell>Next 5 Days Irrigation Plan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plannedCrops.map((crop) => {
                    const progress = getTimelineProgress(crop.plantingDate, crop.harvestDate);
                    const schedule = getIrrigationSchedule(crop, weatherData);
                    return (
                      <TableRow key={crop.id}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress.percent}
                              sx={{ width: "100px", mr: 2 }}
                            />
                            <Typography variant="body2">{progress.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{crop.waterNeeds}</TableCell>
                        <TableCell>
                          {loadingWeather ? (
                            <CircularProgress size={20} />
                          ) : schedule === "Weather data unavailable" ? (
                            schedule
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: "20px" }}>
                              {schedule.map((day, index) => (
                                <li key={index}>{`${day.date}: ${day.water}`}</li>
                              ))}
                            </ul>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                No crops planned yet. Add crops in Crop Planning to see irrigation schedules here!
              </Typography>
            )}
          </Container>
        </Box>

        {/* Weather Forecast Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6, bgcolor: "#E8F5E9" }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              5-Day Weather Forecast
            </Typography>
            {loadingWeather ? (
              <CircularProgress />
            ) : weatherData ? (
              <Grid container spacing={2}>
                {weatherData.map((day, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1">
                          {new Date(day.dt * 1000).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Temp: {day.main.temp}°C
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Rain: {day.rain ? `${day.rain["3h"]} mm` : "0 mm"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Unable to load weather data. Please try again later.
              </Typography>
            )}
          </Container>
        </Box>

        {/* Chatbot Toggle */}
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#45a049" },
          }}
        >
          {isChatOpen ? "Close Chat" : "Chat with AgriBot"}
        </Button>
        {isChatOpen && <Chatbot crops={plannedCrops} />}

        {/* Toast Container for Alerts */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

        {/* Footer */}
        <Box sx={{ py: 4, bgcolor: "#E8F5E9", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} AgriHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default IrrigationScheduler;