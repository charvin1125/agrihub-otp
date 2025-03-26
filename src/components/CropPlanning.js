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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BugReportIcon from "@mui/icons-material/BugReport"; // Icon for Pest Alerts
import NavigationBar from "./Navbar"; // Assuming you have a Navbar component
import Chatbot from "./Chatbot"; // Assuming you have a Chatbot component
import { CSVLink } from "react-csv"; // For exporting to CSV
import { ToastContainer, toast } from "react-toastify"; // For alerts
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import OpacityIcon from "@mui/icons-material/Opacity";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const CropPlanning = () => {
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

  // Predefined crop data for automatic planning
  const cropData = {
    Wheat: { season: "Spring", soilType: "Loam", waterNeeds: "Moderate", growthDays: 120, fertilizeDays: 30 },
    Barley: { season: "Spring", soilType: "Sandy", waterNeeds: "Low", growthDays: 100, fertilizeDays: 25 },
    Peas: { season: "Spring", soilType: "Clay", waterNeeds: "Moderate", growthDays: 90, fertilizeDays: 20 },
    Corn: { season: "Summer", soilType: "Loam", waterNeeds: "High", growthDays: 100, fertilizeDays: 30 },
    Rice: { season: "Summer", soilType: "Clay", waterNeeds: "High", growthDays: 150, fertilizeDays: 40 },
    Sunflowers: { season: "Summer", soilType: "Sandy", waterNeeds: "Moderate", growthDays: 110, fertilizeDays: 25 },
    Pumpkin: { season: "Fall", soilType: "Loam", waterNeeds: "Moderate", growthDays: 100, fertilizeDays: 30 },
    Potatoes: { season: "Fall", soilType: "Sandy", waterNeeds: "Moderate", growthDays: 90, fertilizeDays: 20 },
    Carrots: { season: "Fall", soilType: "Sandy", waterNeeds: "Low", growthDays: 80, fertilizeDays: 15 },
    Kale: { season: "Winter", soilType: "Loam", waterNeeds: "Low", growthDays: 60, fertilizeDays: 15 },
    Spinach: { season: "Winter", soilType: "Clay", waterNeeds: "Moderate", growthDays: 50, fertilizeDays: 10 },
    Garlic: { season: "Winter", soilType: "Loam", waterNeeds: "Low", growthDays: 180, fertilizeDays: 45 },
  };

  // State management
  const [plannedCrops, setPlannedCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({
    name: "",
    season: "Spring",
    plantingDate: "",
    harvestDate: "",
    soilType: "Loam",
    waterNeeds: "Moderate",
  });
  const [weatherData, setWeatherData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Seasonal recommendations with advanced data
  const seasonalCrops = {
    Spring: { crops: ["Wheat", "Barley", "Peas"], optimalTemp: "15-25°C", water: "Moderate" },
    Summer: { crops: ["Corn", "Rice", "Sunflowers"], optimalTemp: "25-35°C", water: "High" },
    Fall: { crops: ["Pumpkin", "Potatoes", "Carrots"], optimalTemp: "10-20°C", water: "Low" },
    Winter: { crops: ["Kale", "Spinach", "Garlic"], optimalTemp: "0-15°C", water: "Low" },
  };

  // Load crops from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem("plannedCrops");
    if (savedCrops) setPlannedCrops(JSON.parse(savedCrops));
  }, []);

  // Save crops to localStorage and check for alerts
  useEffect(() => {
    localStorage.setItem("plannedCrops", JSON.stringify(plannedCrops));
    checkMilestoneAlerts();
  }, [plannedCrops]);

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

  // Automatically fill fields when crop name changes
  const handleCropNameChange = (e) => {
    const cropName = e.target.value;
    const cropInfo = cropData[cropName] || {};
    const plantingDate = newCrop.plantingDate || new Date().toISOString().split("T")[0];
    const harvestDate = cropInfo.growthDays
      ? new Date(new Date(plantingDate).getTime() + cropInfo.growthDays * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : "";

    setNewCrop({
      ...newCrop,
      name: cropName,
      season: cropInfo.season || "Spring",
      plantingDate,
      harvestDate,
      soilType: cropInfo.soilType || "Loam",
      waterNeeds: cropInfo.waterNeeds || "Moderate",
    });
  };

  // Handle adding a new crop
  const handleAddCrop = () => {
    if (!newCrop.name || !newCrop.plantingDate || !newCrop.harvestDate) {
      alert("Please fill in all required fields.");
      return;
    }
    if (new Date(newCrop.plantingDate) >= new Date(newCrop.harvestDate)) {
      alert("Harvest date must be after planting date.");
      return;
    }
    setPlannedCrops([...plannedCrops, { id: Date.now(), ...newCrop }]);
    setNewCrop({ name: "", season: "Spring", plantingDate: "", harvestDate: "", soilType: "Loam", waterNeeds: "Moderate" });
  };

  // Handle deleting a crop
  const handleDeleteCrop = (id) => {
    setPlannedCrops(plannedCrops.filter((crop) => crop.id !== id));
  };

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

  // Check for milestone alerts (fertilization and harvesting)
  const checkMilestoneAlerts = () => {
    const today = new Date();
    plannedCrops.forEach((crop) => {
      const plantingDate = new Date(crop.plantingDate);
      const harvestDate = new Date(crop.harvestDate);
      const fertilizeDays = cropData[crop.name]?.fertilizeDays || 30; // Default to 30 days if not specified
      const fertilizeDate = new Date(plantingDate.getTime() + fertilizeDays * 24 * 60 * 60 * 1000);

      const daysToFertilize = Math.floor((fertilizeDate - today) / (1000 * 60 * 60 * 24));
      const daysToHarvest = Math.floor((harvestDate - today) / (1000 * 60 * 60 * 24));

      // Fertilization alert (1 day before or on the day)
      if (daysToFertilize >= 0 && daysToFertilize <= 1) {
        toast.info(`Fertilization time for ${crop.name} is approaching (${daysToFertilize} days left)!`, {
          toastId: `fertilize-${crop.id}`, // Prevent duplicate alerts
        });
      }

      // Harvesting alert (3 days before or on the day)
      if (daysToHarvest >= 0 && daysToHarvest <= 3) {
        toast.warn(`Harvest time for ${crop.name} is near (${daysToHarvest} days left)!`, {
          toastId: `harvest-${crop.id}`, // Prevent duplicate alerts
        });
      }
    });
  };

  // CSV export data
  const csvData = plannedCrops.map((crop) => ({
    Name: crop.name,
    Season: crop.season,
    "Planting Date": crop.plantingDate,
    "Harvest Date": crop.harvestDate,
    "Soil Type": crop.soilType,
    "Water Needs": crop.waterNeeds,
    Progress: getTimelineProgress(crop.plantingDate, crop.harvestDate).status,
  }));

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
              onClick={() => navigate("/crop-management")}
              sx={{ mb: 4, color: "#388E3C", borderColor: "#388E3C" }}
            >
              Back to Crop Management
            </Button>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
              Crop Planning
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Automatically plan your crops with progress tracking and milestone alerts.
            </Typography>
          </Container>
        </Box>

        {/* Add New Crop Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6, bgcolor: "#F9F9F9" }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Add New Crop Plan
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Crop Name</InputLabel>
                  <Select value={newCrop.name} onChange={handleCropNameChange} label="Crop Name">
                    <MenuItem value="">Select Crop</MenuItem>
                    {Object.keys(cropData).map((crop) => (
                      <MenuItem key={crop} value={crop}>
                        {crop}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Season"
                  value={newCrop.season}
                  onChange={(e) => setNewCrop({ ...newCrop, season: e.target.value })}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Planting Date"
                  InputLabelProps={{ shrink: true }}
                  value={newCrop.plantingDate}
                  onChange={(e) => {
                    const plantingDate = e.target.value;
                    const cropInfo = cropData[newCrop.name] || {};
                    const harvestDate = cropInfo.growthDays
                      ? new Date(new Date(plantingDate).getTime() + cropInfo.growthDays * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      : newCrop.harvestDate;
                    setNewCrop({ ...newCrop, plantingDate, harvestDate });
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Harvest Date"
                  InputLabelProps={{ shrink: true }}
                  value={newCrop.harvestDate}
                  onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Soil Type"
                  value={newCrop.soilType}
                  onChange={(e) => setNewCrop({ ...newCrop, soilType: e.target.value })}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField
                  fullWidth
                  label="Water Needs"
                  value={newCrop.waterNeeds}
                  onChange={(e) => setNewCrop({ ...newCrop, waterNeeds: e.target.value })}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCrop}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Planned Crops Timeline */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Your Crop Timeline
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {plannedCrops.length > 0 && (
                  <CSVLink data={csvData} filename="crop_plan.csv">
                    <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ color: "#388E3C", borderColor: "#388E3C" }}>
                      Export CSV
                    </Button>
                  </CSVLink>
                )}
                <Button
                  variant="outlined"
                  startIcon={<BugReportIcon />}
                  onClick={() => navigate("/pest-alerts")}
                  sx={{ color: "#388E3C", borderColor: "#388E3C" }}
                >
                  Pest Alerts
                </Button>
                <Button
    variant="outlined"
    startIcon={<OpacityIcon />}
    onClick={() => navigate("/irrigation")}
    sx={{ color: "#388E3C", borderColor: "#388E3C" }}
  >
    Irrigation Scheduler
  </Button>
  <Button
    variant="outlined"
    startIcon={<TrendingUpIcon />}
    onClick={() => navigate("/market-insights")}
    sx={{ color: "#388E3C", borderColor: "#388E3C" }}
  >
    Market Insights
  </Button>
              </Box>
            </Box>
            {plannedCrops.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Crop Name</TableCell>
                    <TableCell>Season</TableCell>
                    <TableCell>Planting Date</TableCell>
                    <TableCell>Harvest Date</TableCell>
                    <TableCell>Soil Type</TableCell>
                    <TableCell>Water Needs</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plannedCrops.map((crop) => {
                    const progress = getTimelineProgress(crop.plantingDate, crop.harvestDate);
                    return (
                      <TableRow key={crop.id}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell>{crop.season}</TableCell>
                        <TableCell>{crop.plantingDate}</TableCell>
                        <TableCell>{crop.harvestDate}</TableCell>
                        <TableCell>{crop.soilType}</TableCell>
                        <TableCell>{crop.waterNeeds}</TableCell>
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
                        <TableCell>
                          <IconButton onClick={() => handleDeleteCrop(crop.id)} sx={{ color: "#d32f2f" }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                No crops planned yet. Add a crop to get started!
              </Typography>
            )}
          </Container>
        </Box>

        {/* Weather Forecast */}
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
                          {day.weather[0].description}
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

        {/* Seasonal Recommendations */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Seasonal Crop Recommendations
            </Typography>
            <Grid container spacing={4}>
              {Object.entries(seasonalCrops).map(([season, data]) => (
                <Grid item xs={12} sm={6} md={3} key={season}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                        {season}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Crops: {data.crops.join(", ")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Optimal Temp: {data.optimalTemp}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Water Needs: {data.water}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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

export default CropPlanning;