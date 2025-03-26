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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationBar from "./Navbar"; // Assuming you have a Navbar component
import Chatbot from "./Chatbot"; // Assuming you have a Chatbot component
import { ToastContainer, toast } from "react-toastify"; // For alerts
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const PestAlerts = () => {
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

  // Pest and disease data with prevention tips
  const pestData = {
    Wheat: {
      pests: [
        { name: "Aphids", risk: "Transmits viruses", prevention: "Use resistant varieties, apply neem oil." },
        { name: "Hessian Fly", risk: "Damages stems", prevention: "Delay planting, use crop rotation." },
      ],
    },
    Barley: {
      pests: [
        { name: "Barley Yellow Dwarf Virus", risk: "Spread by aphids", prevention: "Control aphid populations, use resistant cultivars." },
      ],
    },
    Peas: {
      pests: [
        { name: "Pea Weevil", risk: "Eats seeds", prevention: "Use traps, harvest early." },
      ],
    },
    Corn: {
      pests: [
        { name: "Corn Rootworm", risk: "Root damage", prevention: "Rotate crops, use Bt corn." },
      ],
    },
    Rice: {
      pests: [
        { name: "Rice Blast", risk: "Fungal disease", prevention: "Improve drainage, apply fungicides." },
      ],
    },
    Sunflowers: {
      pests: [
        { name: "Sunflower Moth", risk: "Eats seeds", prevention: "Use pheromone traps, apply insecticides." },
      ],
    },
    Pumpkin: {
      pests: [
        { name: "Powdery Mildew", risk: "Fungal growth", prevention: "Ensure air circulation, use sulfur-based fungicides." },
      ],
    },
    Potatoes: {
      pests: [
        { name: "Colorado Potato Beetle", risk: "Leaf damage", prevention: "Use row covers, apply spinosad." },
      ],
    },
    Carrots: {
      pests: [
        { name: "Carrot Rust Fly", risk: "Root damage", prevention: "Use floating row covers, rotate crops." },
      ],
    },
    Kale: {
      pests: [
        { name: "Cabbage Worms", risk: "Leaf damage", prevention: "Use Bacillus thuringiensis (Bt), hand-pick worms." },
      ],
    },
    Spinach: {
      pests: [
        { name: "Leaf Miners", risk: "Tunnels in leaves", prevention: "Remove affected leaves, use sticky traps." },
      ],
    },
    Garlic: {
      pests: [
        { name: "Onion Thrips", risk: "Leaf damage", prevention: "Use reflective mulch, apply insecticidal soap." },
      ],
    },
  };

  // State management
  const [plannedCrops, setPlannedCrops] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load crops from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem("plannedCrops");
    if (savedCrops) {
      const crops = JSON.parse(savedCrops);
      setPlannedCrops(crops);
      checkPestAlerts(crops);
    }
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

  // Check for pest and disease alerts
  const checkPestAlerts = (crops) => {
    const today = new Date();
    crops.forEach((crop) => {
      const plantingDate = new Date(crop.plantingDate);
      const harvestDate = new Date(crop.harvestDate);
      const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
      const daysToHarvest = Math.floor((harvestDate - today) / (1000 * 60 * 60 * 24));

      const cropPests = pestData[crop.name]?.pests || [];
      cropPests.forEach((pest) => {
        // Early warning (within 30 days of planting)
        if (daysSincePlanting >= 0 && daysSincePlanting <= 30) {
          toast.warn(`Pest Alert for ${crop.name}: Watch for ${pest.name}. Risk: ${pest.risk}. Prevention: ${pest.prevention}`, {
            toastId: `pest-early-${crop.id}-${pest.name}`,
          });
        }
        // Mid-growth warning (halfway through growth)
        const totalDays = (harvestDate - plantingDate) / (1000 * 60 * 60 * 24);
        if (daysSincePlanting >= totalDays / 2 - 5 && daysSincePlanting <= totalDays / 2 + 5) {
          toast.info(`Mid-Growth Alert for ${crop.name}: Check for ${pest.name}. Prevention: ${pest.prevention}`, {
            toastId: `pest-mid-${crop.id}-${pest.name}`,
          });
        }
        // Pre-harvest warning (10 days before harvest)
        if (daysToHarvest >= 0 && daysToHarvest <= 10) {
          toast.warn(`Pre-Harvest Alert for ${crop.name}: ${pest.name} risk increases. Prevention: ${pest.prevention}`, {
            toastId: `pest-harvest-${crop.id}-${pest.name}`,
          });
        }
      });
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
              Pest & Disease Alerts
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Get real-time notifications and prevention tips for pest and disease risks.
            </Typography>
          </Container>
        </Box>

        {/* Pest Alerts Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              Your Crop Pest Alerts
            </Typography>
            {plannedCrops.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Crop Name</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Potential Pests</TableCell>
                    <TableCell>Risk</TableCell>
                    <TableCell>Prevention Tips</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plannedCrops.map((crop) => {
                    const progress = getTimelineProgress(crop.plantingDate, crop.harvestDate);
                    const cropPests = pestData[crop.name]?.pests || [];
                    return cropPests.map((pest, index) => (
                      <TableRow key={`${crop.id}-${pest.name}`}>
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={cropPests.length}>{crop.name}</TableCell>
                            <TableCell rowSpan={cropPests.length}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress.percent}
                                  sx={{ width: "100px", mr: 2 }}
                                />
                                <Typography variant="body2">{progress.status}</Typography>
                              </Box>
                            </TableCell>
                          </>
                        )}
                        <TableCell>{pest.name}</TableCell>
                        <TableCell>{pest.risk}</TableCell>
                        <TableCell>{pest.prevention}</TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                No crops planned yet. Add crops in Crop Planning to see pest alerts here!
              </Typography>
            )}
          </Container>
        </Box>

        {/* Prevention Tips Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: 6, bgcolor: "#E8F5E9" }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              General Prevention Tips
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Crop Rotation
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Rotate crops annually to disrupt pest life cycles and reduce soil-borne diseases.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Resistant Varieties
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Choose pest- and disease-resistant crop varieties for better protection.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
                      Monitoring
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Regularly scout fields and use traps to detect pests early.
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

export default PestAlerts;