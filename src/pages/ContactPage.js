import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import NavigationBar from "../components/Navbar"; // Assuming you have a Navbar component
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";

const ContactPage = () => {
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#757575" },
              "&:hover fieldset": { borderColor: "#212121" },
            },
          },
        },
      },
    },
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (mock submission)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Form submitted:", formData); // Replace with actual API call
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
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
          sx={{ py: { xs: 6, sm: 8 }, textAlign: "center" }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 2,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Have questions or need assistance? Reach out to the AgriHub team—we’re here to help you grow smarter!
            </Typography>
          </Container>
        </Box>

        {/* Contact Form and Details Section */}
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, sm: 8 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* Contact Form */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#E8F5E9" }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
                      Send Us a Message
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={4}
                        required
                        size="small"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<SendIcon />}
                        sx={{ mt: 2, py: 1.5, bgcolor: "#388E3C", "&:hover": { bgcolor: "#4CAF50" } }}
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
                      Get in Touch
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <IconButton sx={{ color: "#388E3C", mr: 2 }}>
                        <EmailIcon />
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                          Email
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          support@agrihub.com
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <IconButton sx={{ color: "#388E3C", mr: 2 }}>
                        <PhoneIcon />
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                          Phone
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton sx={{ color: "#388E3C", mr: 2 }}>
                        <LocationOnIcon />
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                          Address
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          123 Agrihub,Bardoli,India
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Map Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 6, sm: 8 }, bgcolor: "#E8F5E9" }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "text.primary",
                mb: 4,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Find Us
            </Typography>
            {/* Google Maps iframe - Replace with your actual location */}
            <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.997819144149!2d73.10831561486545!3d21.125998985948277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05d5b5f5b5f5b%3A0x5b5b5b5b5b5b5b5b!2sBardoli%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1698769876543!5m2!1sen!2sin"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="AgriHub Location"
              ></iframe>
            </Box>
          </Container>
        </Box>

        {/* Back to Home Button */}
        <Box sx={{ py: 4, textAlign: "center" }}>
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

export default ContactPage;