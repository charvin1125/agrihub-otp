import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import NavigationBar from "../components/Navbar"; // Assuming you have a Navbar component
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import SlideImg1 from "../img/bg.jpg"; // Placeholder: replace with actual images
import SlideImg2 from "../img/Seal.png";
import SlideImg3 from "../img/logo-1-removebg.png";

const AboutPage = () => {
  const navigate = useNavigate();

  // Theme configuration consistent with your green agriculture theme
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

  // Carousel slides for About page
  const slides = [
    { title: "Our Journey", description: "Building a sustainable future for farmers.", image: SlideImg1 },
    { title: "Innovation in Farming", description: "Empowering agriculture with technology.", image: SlideImg2 },
    { title: "Community Focus", description: "Supporting farmers worldwide.", image: SlideImg3 },
  ];

  // Team members data (replace with real team info)
  const teamMembers = [
    { name: "Charvin", role: "Founder & CEO", bio: "Passionate about sustainable farming solutions.", avatar: "/img/john-doe.jpg" },
    { name: "Vibhuti", role: "Co-Founder & CEO", bio: "Expert in agricultural technology and AI.", avatar: "/img/jane-smith.jpg" },
    // { name: "Raj Patel", role: "Head of Operations", bio: "Dedicated to farmer success and logistics.", avatar: "/img/raj-patel.jpg" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavigationBar />
        <Box sx={{ height: { xs: 56, sm: 64, md: 70 } }} />

        {/* Hero Carousel Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            py: { xs: 4, sm: 6, md: 8 },
            mx: { xs: 2, md: 4 },
          }}
        >
          <Carousel fade interval={5000} controls={true} indicators={true}>
            {slides.map((slide, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "400px",
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      zIndex: 1,
                    }}
                  />
                  <Carousel.Caption style={{ zIndex: 2, position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        mb: 2,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#fff",
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                      }}
                    >
                      {slide.description}
                    </Typography>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Box>

        {/* About Us Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, sm: 8 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "text.primary",
                mb: 4,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              About AgriHub
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                mb: 6,
                maxWidth: "800px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              AgriHub is a platform dedicated to revolutionizing agriculture through technology. We provide farmers with tools to manage crops, monitor weather, stay updated on market trends, and adopt sustainable practices, ensuring a prosperous and eco-friendly future.
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/")}
                sx={{ px: 4, py: 1.5 }}
              >
                Back to Home
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Mission & Vision Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 6, sm: 8 }, bgcolor: "#E8F5E9" }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      To empower farmers with innovative tools and knowledge, enhancing productivity while promoting sustainable agriculture practices that benefit both the environment and communities.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      To create a global network of smart farming solutions, where technology and tradition unite to ensure food security and a thriving agricultural ecosystem for future generations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Team Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, sm: 8 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "text.primary",
                mb: 6,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Meet Our Team
            </Typography>
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ textAlign: "center", bgcolor: "#E8F5E9" }}>
                    <CardContent>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                      />
                      <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: "#388E3C", mb: 2 }}>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Footer Section */}
        <Box sx={{ py: 4, bgcolor: "#E8F5E9", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} AgriHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AboutPage;