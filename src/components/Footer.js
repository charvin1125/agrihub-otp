import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../img/logo-1-removebg.png"; // Same logo as navbar
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import GavelIcon from "@mui/icons-material/Gavel";
import PolicyIcon from "@mui/icons-material/Policy";

const FOOTER_START = "#B3D8A8"; // Matching navbar soft green
const FOOTER_END = "#3D8D7A";   // Matching navbar teal

const Footer = () => {
  const theme = createTheme({
    palette: {
      primary: { main: "#2E7D32" }, // Updated to match navbar green
      secondary: { main: "#81C784" },
      text: { primary: "#1A1A1A", secondary: "#616161" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: "#1A1A1A",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              color: "#2E7D32",
              textDecoration: "underline",
            },
            transition: "color 0.3s ease",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="footer"
        sx={{
          background: `linear-gradient(135deg, ${FOOTER_START} 0%, ${FOOTER_END} 100%)`,
          color: "text.primary",
          py: { xs: 4, sm: 5, md: 6 },
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {/* Logo and Description */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                <img
                  src={Logo}
                  alt="AgriHub Logo"
                  style={{
                    height: { xs: "40px", sm: "50px", md: "60px" },
                    width: "auto",
                    maxHeight: "60px",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/60?text=Logo")}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "300px",
                  mx: { xs: "auto", md: 0 },
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                AgriHub - Your one-stop solution for agricultural products and services. Connecting farmers and customers since 2023.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: { xs: "center", md: "flex-start" } }}>
                <Link component={RouterLink} to="/">
                  <HomeIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Home
                </Link>
                <Link component={RouterLink} to="/products">
                  <ShoppingCartIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Products
                </Link>
                <Link component={RouterLink} to="/services">
                  <BuildIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Services
                </Link>
                <Link component={RouterLink} to="/track-order">
                  <TrackChangesIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Track Order
                </Link>
              </Box>
            </Grid>

            {/* Company */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: { xs: "center", md: "flex-start" } }}>
                <Link component={RouterLink} to="/about">
                  <InfoIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> About Us
                </Link>
                <Link component={RouterLink} to="/contact">
                  <ContactMailIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Contact Us
                </Link>
                <Link component={RouterLink} to="/terms">
                  <GavelIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Terms & Conditions
                </Link>
                <Link component={RouterLink} to="/privacy">
                  <PolicyIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> Privacy Policy
                </Link>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: { xs: "center", md: "flex-start" } }}>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  <EmailIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> support@agrihub.com
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  <PhoneIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> +1 (555) 123-4567
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  <LocationOnIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} /> 123 Farm Road, Agri City, AC 12345
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 3, md: 4 }, bgcolor: "rgba(255,255,255,0.3)" }} />

          {/* Copyright */}
          <Typography
            variant="body2"
            align="center"
            sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" }, color: "text.secondary" }}
          >
            © {new Date().getFullYear()} AgriHub. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;