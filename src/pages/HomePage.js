import React, { useState, useEffect } from "react";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
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
import { motion, useScroll, useTransform } from "framer-motion";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import CloudIcon from "@mui/icons-material/Cloud";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BugReportIcon from "@mui/icons-material/BugReport";
import BuildIcon from "@mui/icons-material/Build";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import SlideImg1 from "../img/hero.jpg";
import SlideImg2 from "../img/slide-4.jpg";
import SlideImg3 from "../img/slide-5.avif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: { main: "#388E3C" },
      secondary: { main: "#4CAF50" },
      background: { default: "#F9F9F9", paper: "#fff" },
      text: { primary: "#212121", secondary: "#555555" },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            padding: "10px 20px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#2E7D32",
            },
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

  const slides = [
    { title: "Welcome to AgriHub", description: "Empowering farmers with smart solutions.", image: SlideImg1 },
    { title: "", description: "", image: SlideImg2 },
    { title: "", description: "", image: SlideImg3 },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const { scrollY } = useScroll();
  const scrollStart = 500;
  const scrollEnd = 1500;
  const slogan1X = useTransform(scrollY, [scrollStart, scrollEnd], [0, 200]);
  const slogan2X = useTransform(scrollY, [scrollStart, scrollEnd], [0, -200]);

  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const storedNewProducts = localStorage.getItem("newProducts");
    if (storedNewProducts) {
      const products = JSON.parse(storedNewProducts);
      setNewProducts(products);
      checkNewProductNotifications(products);
    }
  }, []);

  const checkNewProductNotifications = (products) => {
    const now = new Date();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    products.forEach((product) => {
      const addedDate = new Date(product.id);
      const timeSinceAdded = now - addedDate;

      if (timeSinceAdded <= twoDaysInMs) {
        const daysLeft = Math.ceil((twoDaysInMs - timeSinceAdded) / (24 * 60 * 60 * 1000));
        toast.success(
          `New Product: ${product.name}! Available for ${daysLeft} day(s).`,
          {
            toastId: `new-product-${product.id}`,
            autoClose: 7000,
          }
        );
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box sx={{ height: { xs: 56, sm: 64, md: 70 } }} />

        {/* Carousel */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 4, md: 6 }, mx: { xs: 0, md: 2 } }}
        >
          <Carousel fade interval={4000} controls={true} indicators={true}>
            {slides.map((slide, index) => (
              <Carousel.Item key={index}>
                <Box
                  sx={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: { xs: "400px", md: "600px" },
                    borderRadius: { xs: 0, md: "20px" },
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.45)",
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      zIndex: 2,
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#fff",
                        mb: 2,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                        maxWidth: "600px",
                      }}
                    >
                      {slide.description}
                    </Typography>
                  </Box>
                </Box>
              </Carousel.Item>
            ))}
          </Carousel>
        </Box>

        {/* Features Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "primary.main",
                mb: 8,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Our Features
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  title: "Crop Management",
                  desc: "Plan, track, and optimize your crops with precision.",
                  icon: <AgricultureIcon />,
                  link: "/crop-management",
                },
                { title: "Weather Updates", desc: "Real-time forecasts for better planning.", icon: <CloudIcon /> },
                { title: "Market Insights", desc: "Stay ahead with market trends.", icon: <TrendingUpIcon />, link: "/market-insights" },
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ bgcolor: "#E8F5E9", p: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <IconButton sx={{ color: "primary.main", fontSize: "3.5rem", mb: 2 }}>{feature.icon}</IconButton>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>{feature.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>{feature.desc}</Typography>
                      {feature.link && (
                        <Button variant="contained" color="primary" onClick={() => navigate(feature.link)}>
                          Explore
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Original Slogan Section */}
        <Box sx={{ py: 6, bgcolor: "#F9F9F9", overflow: "hidden" }}>
          <motion.div
            style={{ x: slogan1X, position: "relative", left: "20px" }}
            initial={{ x: 0 }}
            animate={{ transition: { type: "spring", stiffness: 50 } }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                color: "transparent",
                WebkitTextStroke: "1.5px #000000",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "4rem" },
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                padding: "15px 20px",
                backgroundColor: "#388E3C",
                borderRadius: "10px",
                display: "inline-block",
                boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
                width: "calc(100% - 20px)",
                marginRight: "auto",
              }}
            >
              --- BUILD THE AGRIHUB ------
            </Typography>
          </motion.div>
          <motion.div
            style={{ x: slogan2X, position: "relative", right: "20px" }}
            initial={{ x: 0 }}
            animate={{ transition: { type: "spring", stiffness: 50 } }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                color: "#388E3C",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "4rem" },
                mt: 6,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                padding: "15px 20px",
                backgroundColor: "#F9F9F9",
                borderRadius: "10px",
                display: "inline-block",
                boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
                width: "calc(100% - 20px)",
                marginLeft: "auto",
              }}
            >
              ONE STOP - FARMING - SOLUTION
            </Typography>
          </motion.div>
        </Box>

        {/* Services Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "primary.main",
                mb: 8,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Our Services
            </Typography>
            <Grid container spacing={4}>
              {[
                { title: "Consultation", desc: "Expert farming guidance.", icon: <SupportAgentIcon /> },
                { title: "Disease Detection", desc: "AI-driven crop health monitoring.", icon: <BugReportIcon /> },
                { title: "Equipment", desc: "Modern farming tools.", icon: <BuildIcon /> },
              ].map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ bgcolor: "#fff", p: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <IconButton sx={{ color: "primary.main", fontSize: "3.5rem", mb: 2 }}>{service.icon}</IconButton>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>{service.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{service.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 6, md: 10 }, bgcolor: "#F9F9F9" }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: "primary.main",
                mb: 8,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              What Farmers Say
            </Typography>
            <Grid container spacing={4}>
              {[
                { quote: "Transformed my farm's productivity!", author: "Rajesh Kumar" },
                { quote: "Saved my crops with timely alerts.", author: "Sunita Devi" },
                { quote: "Boosted my profits significantly.", author: "Anil Sharma" },
              ].map((testimonial, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ bgcolor: "#E8F5E9", p: 2 }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, fontStyle: "italic" }}>
                        "{testimonial.quote}"
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 600 }}>
                        - {testimonial.author}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={7000} hideProgressBar={false} />

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;