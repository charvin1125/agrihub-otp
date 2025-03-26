import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar"; // Adjust path if needed
import { motion } from "framer-motion";

const AdminAllBookedServices = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/all", {
          withCredentials: true,
        });
        console.log("Fetched bookings:", res.data); // Debug log
        setBookings(res.data || []);
        setFilteredBookings(res.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data || error.message);
        setBookings([]);
        setFilteredBookings([]);
        setError("Failed to load bookings. Please ensure you’re logged in as an admin.");
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        (booking.customerName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (booking.contactNumber || "").includes(searchQuery)
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
      background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
      text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: darkMode ? "0 4px 20px rgba(255,255,255,0.1)" : "0 4px 20px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: darkMode ? "0 6px 24px rgba(255,255,255,0.2)" : "0 6px 24px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
            color: "#fff",
            fontWeight: "bold",
          },
          body: {
            padding: { xs: "8px", sm: "12px" },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
            },
          },
        },
      },
    },
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMobile={isMobile}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            bgcolor: "background.default",
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
            transition: "width 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 2, sm: 4 },
            }}
          >
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                flexGrow: 1,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              All Booked Services
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {/* Search Bar */}
          <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#fff" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Search by Customer Name or Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
            <CardContent>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ mb: 2, color: "text.primary" }}
              >
                Booked Services List
              </Typography>
              {filteredBookings.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  No bookings found.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="booked services table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Crop</TableCell>
                        <TableCell>Medicine</TableCell>
                        <TableCell align="right">Area (Sq Ft)</TableCell>
                        <TableCell>Farm Address</TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          Pincode
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          Problem
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          Expected Date
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                          Remarks
                        </TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          Labor Name
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                          Service Date
                        </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                          Created At
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow
                          key={booking._id}
                          sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}
                        >
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking._id || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.serviceName || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.customerName || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.contactNumber || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.crop || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.medicineName || "N/A"}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            {booking.areaInSqFt || 0}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.farmAddress || "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", sm: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.pincode || "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", md: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.problem || "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", md: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.expectedDate
                              ? new Date(booking.expectedDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", lg: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.remarks || "N/A"}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{(booking.totalPrice || 0).toFixed(2)}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", md: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.laborId?.name || "Not Assigned"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", lg: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.serviceDate
                              ? new Date(booking.serviceDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "text.primary" }}>
                            {booking.status || "Pending"}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: "none", lg: "table-cell" },
                              color: "text.primary",
                            }}
                          >
                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminAllBookedServices;