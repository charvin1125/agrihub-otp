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
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Icon for market trends
import NavigationBar from "./Navbar"; // Assuming you have a Navbar component
import Chatbot from "./Chatbot"; // Assuming you have a Chatbot component
import { ToastContainer, toast } from "react-toastify"; // For alerts
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const MarketInsights = () => {
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

  // Mock market data (replace with real API data if available)
  const marketData = {
    Wheat: { price: 25, trend: "Up", demand: "High", tip: "Sell soon as prices are peaking." },
    Barley: { price: 20, trend: "Stable", demand: "Moderate", tip: "Hold for potential price increase." },
    Peas: { price: 30, trend: "Down", demand: "Low", tip: "Consider alternative markets." },
    Corn: { price: 18, trend: "Up", demand: "High", tip: "Good time to sell." },
    Rice: { price: 22, trend: "Stable", demand: "Moderate", tip: "Monitor export demand." },
    Sunflowers: { price: 35, trend: "Up", demand: "High", tip: "Sell now for maximum profit." },
    Pumpkin: { price: 15, trend: "Down", demand: "Low", tip: "Wait for seasonal demand spike." },
    Potatoes: { price: 12, trend: "Stable", demand: "Moderate", tip: "Stable market, sell as needed." },
    Carrots: { price: 14, trend: "Down", demand: "Low", tip: "Look for local buyers." },
    Kale: { price: 28, trend: "Up", demand: "High", tip: "Capitalize on health food trend." },
    Spinach: { price: 25, trend: "Stable", demand: "Moderate", tip: "Consistent demand, sell steadily." },
    Garlic: { price: 40, trend: "Up", demand: "High", tip: "High value crop, sell now." },
  };

  // State management
  const [plannedCrops, setPlannedCrops] = useState([]);
  const [marketInsights, setMarketInsights] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // Load crops from localStorage and fetch market insights
  useEffect(() => {
    const savedCrops = localStorage.getItem("plannedCrops");
    if (savedCrops) {
      const crops = JSON.parse(savedCrops);
      setPlannedCrops(crops);
      fetchMarketInsights(crops);
    }
  }, []);

  // Mock function to fetch market insights (replace with real API call)
  const fetchMarketInsights = async (crops) => {
    setLoadingMarket(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const insights = crops.map((crop) => ({
        ...crop,
        market: marketData[crop.name] || { price: "N/A", trend: "Unknown", demand: "Unknown", tip: "No data available." },
      }));
      setMarketInsights(insights);
      checkMarketAlerts(insights);
    } catch (error) {
      console.error("Error fetching market insights:", error);
      setMarketInsights(null);
    }
    setLoadingMarket(false);
  };

  // Check for market alerts
  const checkMarketAlerts = (insights) => {
    insights.forEach((crop) => {
      if (crop.market.trend === "Up" && crop.market.demand === "High") {
        toast.success(`Market Alert for ${crop.name}: Prices are up (${crop.market.price}/unit) with high demand! ${crop.market.tip}`, {
          toastId: `market-${crop.id}`,
        });
      } else if (crop.market.trend === "Down" && crop.market.demand === "Low") {
        toast.warn(`Market Alert for ${crop.name}: Prices are down (${crop.market.price}/unit) with low demand. ${crop.market.tip}`, {
          toastId: `market-${crop.id}`,
        });
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
              Market Insights
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Stay informed about market trends for your crops.
            </Typography>
          </Container>
        </Box>

        {/* Market Trends Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Your Crop Market Trends
            </Typography>
            {plannedCrops.length > 0 ? (
              loadingMarket ? (
                <CircularProgress />
              ) : marketInsights ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Crop Name</TableCell>
                      <TableCell>Current Price (per unit)</TableCell>
                      <TableCell>Trend</TableCell>
                      <TableCell>Demand</TableCell>
                      <TableCell>Market Tip</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marketInsights.map((crop) => (
                      <TableRow key={crop.id}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell>{crop.market.price === "N/A" ? "N/A" : `$${crop.market.price}`}</TableCell>
                        <TableCell>{crop.market.trend}</TableCell>
                        <TableCell>{crop.market.demand}</TableCell>
                        <TableCell>{crop.market.tip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                  Unable to load market insights. Please try again later.
                </Typography>
              )
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                No crops planned yet. Add crops in Crop Planning to see market insights here!
              </Typography>
            )}
          </Container>
        </Box>

        {/* General Market Tips Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6, bgcolor: "#E8F5E9" }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              General Market Tips
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Monitor Trends
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Keep an eye on price trends to sell at peak times.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Diversify Crops
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Grow a mix of crops to spread risk across markets.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Local Markets
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Explore local buyers for better prices and lower transport costs.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
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

export default MarketInsights;