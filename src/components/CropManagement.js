import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Container,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import TerrainIcon from "@mui/icons-material/Terrain";
import WaterIcon from "@mui/icons-material/Water";
import BugReportIcon from "@mui/icons-material/BugReport";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CropManagement = () => {
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: { main: "#2E7D32" }, // Modern dark green
      secondary: { main: "#81C784" }, // Softer green accent
      background: { default: "#FFFFFF", paper: "#FFFFFF" }, // Clean white background
      text: { primary: "#1A1A1A", secondary: "#757575" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif", // Modern, friendly font
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            textTransform: "none",
            padding: { xs: "8px 18px", md: "10px 24px" },
            fontWeight: 600,
            fontSize: { xs: "0.9rem", md: "1rem" },
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": { borderWidth: 1 },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            lineHeight: 1.6,
          },
        },
      },
    },
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } 
    },
  };

  const tools = [
    { 
      title: "Crop Planning", 
      desc: "Easily plan your planting seasons.", 
      icon: <AgricultureIcon />, 
      link: "/crop-planning" 
    },
    { 
      title: "Soil Health", 
      desc: "Monitor soil with ease.", 
      icon: <TerrainIcon />, 
      link: "/soil-health" 
    },
    { 
      title: "Irrigation", 
      desc: "Smart watering made simple.", 
      icon: <WaterIcon />, 
      link: "/irrigation" 
    },
    { 
      title: "Pest Alerts", 
      desc: "Protect crops effortlessly.", 
      icon: <BugReportIcon />, 
      link: "/pest-alerts" 
    },
    { 
      title: "Yield Forecast", 
      desc: "Plan profits confidently.", 
      icon: <TrendingUpIcon />, 
      link: "/yield-forecast" 
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          bgcolor: "background.default", 
          minHeight: "100vh", 
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <Container maxWidth="lg">
          {/* Back Button */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{ 
                color: "primary.main", 
                borderColor: "primary.main",
                bgcolor: "rgba(46, 125, 50, 0.03)",
                "&:hover": {
                  bgcolor: "rgba(46, 125, 50, 0.1)",
                  borderColor: "primary.dark",
                },
              }}
            >
              Back to Home
            </Button>
          </Box>

          {/* Header */}
          <Box 
            component={motion.div} 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                letterSpacing: "-0.2px",
              }}
            >
              Crop Management
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 400,
              }}
            >
              Simplify your farming with intuitive tools built for today’s growers.
            </Typography>
          </Box>

          {/* Tools Grid */}
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            {tools.map((tool, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    bgcolor: "paper", 
                    p: { xs: 2, md: 3 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <IconButton 
                      sx={{ 
                        color: "primary.main", 
                        fontSize: { xs: "2rem", md: "2.5rem" }, 
                        mb: 2,
                        bgcolor: "rgba(46, 125, 50, 0.04)",
                        p: 1.5,
                        borderRadius: "12px",
                        "&:hover": { bgcolor: "rgba(46, 125, 50, 0.1)" },
                      }}
                    >
                      {tool.icon}
                    </IconButton>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: "text.primary", 
                        fontWeight: 600, 
                        mb: 1,
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                      }}
                    >
                      {tool.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "text.secondary",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {tool.desc}
                    </Typography>
                  </CardContent>
                  <Box sx={{ textAlign: "center", pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(tool.link)}
                      sx={{ 
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "primary.dark" },
                        px: { xs: 2.5, md: 3 },
                      }}
                    >
                      Try Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Call to Action */}
          <Box 
            sx={{ 
              mt: { xs: 6, md: 8 }, 
              textAlign: "center",
              py: { xs: 4, md: 5 },
              px: { xs: 2, md: 4 },
              bgcolor: "secondary.main",
              borderRadius: "16px",
              color: "#fff",
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: "1.5rem", md: "1.8rem" },
              }}
            >
              Start Farming Smarter
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                maxWidth: "450px", 
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                opacity: 0.9,
              }}
            >
              Get access to tools that make crop management a breeze.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ 
                bgcolor: "#fff",
                color: "primary.main",
                "&:hover": { bgcolor: "#f5f5f5" },
                px: { xs: 3, md: 4 },
                py: 1,
              }}
            >
              Join Now
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CropManagement;