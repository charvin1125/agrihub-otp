// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";

// const ServiceBooking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     contactNumber: "",
//     crop: "",
//     medicineName: "",
//     areaInSqFt: "",
//     farmAddress: "",
//     pincode: "",
//     problem: "",        // New field
//     expectedDate: "",   // New field
//     remarks: "",        // New field
//   });

//   const service = location.state?.service || {};

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         setUser(res.data);
//         setFormData((prev) => ({
//           ...prev,
//           customerName: res.data.name || "",
//           contactNumber: res.data.mobile || "",
//         }));
//       } catch (error) {
//         console.error("Error fetching user:", error.response?.data || error.message);
//         navigate("/login");
//       }
//     };
//     fetchUser();

//     const handleResize = () => setIsMobile(window.innerWidth < 600);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       alert("Please log in to book a service.");
//       navigate("/login");
//       return;
//     }
//     setLoading(true);

//     const bookingData = {
//       userId: user._id,
//       serviceId: service._id,
//       serviceName: service.name,
//       customerName: formData.customerName,
//       contactNumber: formData.contactNumber,
//       crop: formData.crop,
//       medicineName: formData.medicineName,
//       areaInSqFt: parseFloat(formData.areaInSqFt),
//       farmAddress: formData.farmAddress,
//       pincode: formData.pincode,
//       problem: formData.problem,           // New field
//       expectedDate: formData.expectedDate, // New field
//       remarks: formData.remarks,           // New field
//       totalPrice: service.pricePer100SqFt
//         ? (parseFloat(formData.areaInSqFt) / 100) * service.pricePer100SqFt
//         : 0,
//     };

//     console.log("Booking Data:", bookingData);

//     try {
//       const res = await axios.post("http://localhost:5000/api/book-service", bookingData, {
//         withCredentials: true,
//       });
//       alert("Service booked successfully! Booking ID: " + res.data.bookingId);
//       navigate("/services");
//     } catch (error) {
//       console.error("Booking Error:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Failed to book service. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//       background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "12px",
//             boxShadow: darkMode ? "0 4px 20px rgba(255,255,255,0.1)" : "0 4px 20px rgba(0,0,0,0.1)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-5px)",
//               boxShadow: darkMode ? "0 6px 24px rgba(255,255,255,0.2)" : "0 6px 24px rgba(0,0,0,0.15)",
//             },
//           },
//         },
//       },
//       MuiButton: { styleOverrides: { root: { borderRadius: "8px", textTransform: "none" } } },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#757575" },
//               "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#212121" },
//             },
//           },
//         },
//       },
//     },
//   });

//   const totalPrice = service.pricePer100SqFt
//     ? (parseFloat(formData.areaInSqFt || 0) / 100) * service.pricePer100SqFt
//     : 0;

//   if (!service._id) {
//     return (
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, sm: 4 }, textAlign: "center" }}>
//         <Typography variant="h6" sx={{ color: "text.primary" }}>
//           No service selected. Please go back to the services page.
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate("/services")}
//           sx={{ mt: 2, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//         >
//           Back to Services
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         <Box
//           sx={{
//             p: { xs: 2, sm: 4 },
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             bgcolor: darkMode ? "#1e1e1e" : "#E8F5E9",
//           }}
//         >
//           <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//             Book {service.name || "Service"}
//           </Typography>
//           <IconButton onClick={toggleDarkMode} sx={{ color: "text.primary" }}>
//             {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//           </IconButton>
//         </Box>

//         <Box sx={{ p: { xs: 2, sm: 4 } }}>
//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
//                 Service Booking Form
//               </Typography>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Customer Name"
//                       name="customerName"
//                       value={formData.customerName}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Contact Number"
//                       name="contactNumber"
//                       value={formData.contactNumber}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Crop"
//                       name="crop"
//                       value={formData.crop}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Medicine Name"
//                       name="medicineName"
//                       value={formData.medicineName}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Area (in Sq. Feet)"
//                       name="areaInSqFt"
//                       type="number"
//                       value={formData.areaInSqFt}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       inputProps={{ min: 1 }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Pincode"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Farm Address"
//                       name="farmAddress"
//                       value={formData.farmAddress}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       multiline
//                       rows={isMobile ? 2 : 3}
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Problem"
//                       name="problem"
//                       value={formData.problem}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       multiline
//                       rows={isMobile ? 2 : 3}
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Expected Date"
//                       name="expectedDate"
//                       type="date"
//                       value={formData.expectedDate}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Remarks"
//                       name="remarks"
//                       value={formData.remarks}
//                       onChange={handleChange}
//                       variant="outlined"
//                       multiline
//                       rows={isMobile ? 2 : 3}
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
//                       <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)} (Based on ₹{service.pricePer100SqFt} per 100 Sq Ft)
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth={isMobile}
//                       disabled={loading || !user}
//                       sx={{ py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                     >
//                       {loading ? <CircularProgress size={24} color="inherit" /> : "Book Now"}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>
//         </Box>

//         <Box sx={{ p: 2, bgcolor: darkMode ? "#1e1e1e" : "#E8F5E9", textAlign: "center" }}>
//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             © {new Date().getFullYear()} AgriHub. All rights reserved.
//           </Typography>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ServiceBooking;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Container,
  CardContent,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavigationBar from "../components/Navbar";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const ServiceBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    crop: "",
    medicineName: "",
    areaInSqFt: "",
    farmAddress: "",
    pincode: "",
    problem: "",
    expectedDate: "",
    remarks: "",
  });

  const service = location.state?.service || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        setUser(res.data);
        setFormData((prev) => ({
          ...prev,
          customerName: res.data.name || "",
          contactNumber: res.data.mobile || "",
        }));
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
        navigate("/login");
      }
    };
    fetchUser();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to book a service.");
      navigate("/login");
      return;
    }
    setLoading(true);

    const bookingData = {
      userId: user._id,
      serviceId: service._id,
      serviceName: service.name,
      customerName: formData.customerName,
      contactNumber: formData.contactNumber,
      crop: formData.crop,
      medicineName: formData.medicineName,
      areaInSqFt: parseFloat(formData.areaInSqFt),
      farmAddress: formData.farmAddress,
      pincode: formData.pincode,
      problem: formData.problem,
      expectedDate: formData.expectedDate,
      remarks: formData.remarks,
      totalPrice: service.pricePer100SqFt
        ? (parseFloat(formData.areaInSqFt) / 100) * service.pricePer100SqFt
        : 0,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/book-service", bookingData, {
        withCredentials: true,
      });
      alert("Service booked successfully! Booking ID: " + res.data.bookingId);
      navigate("/services");
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: "#F7F9F7", paper: "#FFFFFF" },
      text: { primary: "#1A1A1A", secondary: "#616161" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            textTransform: "none",
            padding: "10px 20px",
            fontWeight: 600,
            backgroundColor: "#2E7D32",
            color: "#FFF",
            "&:hover": {
              backgroundColor: "#81C784",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "#81C784" },
              "&:hover fieldset": { borderColor: "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
            },
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            "& a": {
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#2E7D32",
              "&:hover": { textDecoration: "underline" },
            },
            "& li": {
              color: "#2E7D32",
            },
          },
          separator: { color: "#2E7D32" },
        },
      },
    },
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const totalPrice = service.pricePer100SqFt
    ? (parseFloat(formData.areaInSqFt || 0) / 100) * service.pricePer100SqFt
    : 0;

  if (!service._id) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, sm: 4 }, textAlign: "center" }}>
          <NavigationBar />
          <Typography variant="h6" sx={{ color: "text.primary", mt: 4 }}>
            No service selected. Please go back to the services page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/services")}
            sx={{ mt: 2 }}
          >
            Back to Services
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />

        {/* Header Section with Breadcrumbs */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            py: { xs: 4, sm: 5 },
            bgcolor: "#E8F5E9",
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: { xs: 2, sm: 3 }, justifyContent: "center", display: "flex" }}
            >
              <Link to="/">
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                Home
              </Link>
              <Link to="/services">Services</Link>
              <Typography color="text.primary">Book Service</Typography>
            </Breadcrumbs>
            <Typography
              variant={isMobile ? "h4" : "h2"}
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 1.5,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              Book {service.name || "Service"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.2rem" },
                fontWeight: 400,
              }}
            >
              Fill out the details below to schedule your service appointment.
            </Typography>
          </Container>
        </Box>

        {/* Booking Form */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 4, sm: 6 }, flexGrow: 1 }}
        >
          <Container maxWidth="md">
            <Card sx={{ bgcolor: "#E8F5E9" }}>
              <CardContent>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ mb: 3, color: "text.primary", fontWeight: 700 }}
                >
                  Service Booking Form
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Customer Name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Crop"
                        name="crop"
                        value={formData.crop}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Medicine Name"
                        name="medicineName"
                        value={formData.medicineName}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Area (in Sq. Feet)"
                        name="areaInSqFt"
                        type="number"
                        value={formData.areaInSqFt}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Farm Address"
                        name="farmAddress"
                        value={formData.farmAddress}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        multiline
                        rows={isMobile ? 2 : 3}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Problem"
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        multiline
                        rows={isMobile ? "small" : "medium"}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expected Date"
                        name="expectedDate"
                        type="date"
                        value={formData.expectedDate}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={isMobile ? 2 : 3}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ mb: 2, color: "primary.main", fontWeight: 700 }}
                      >
                        <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)} (Based on ₹{service.pricePer100SqFt} per 100 Sq Ft)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth={isMobile}
                        disabled={loading || !user}
                        sx={{ py: 1 }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Book Now"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ServiceBooking;