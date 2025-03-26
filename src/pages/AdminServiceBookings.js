import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";

const AdminServiceBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Fetch bookings and labors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        console.log("User Data:", userRes.data);
        if (!userRes.data.isAdmin) {
          console.log("Redirecting non-admin to /");
          navigate("/");
          return;
        }

        const [bookingsRes, laborsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/all", { withCredentials: true }),
          axios.get("http://localhost:5000/api/labors/list", { withCredentials: true }),
        ]);
        setBookings(
          bookingsRes.data.map((booking) => ({
            ...booking,
            laborId: booking.laborId || "",
            serviceDate: booking.serviceDate || "",
          })) || []
        );
        setLabors(laborsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

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

  // Handle labor and date changes
  const handleLaborChange = (bookingId, laborId) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b._id === bookingId ? { ...b, laborId: laborId || "" } : b
      );
      console.log("Updated Labor for Booking:", updated.find((b) => b._id === bookingId));
      return updated;
    });
  };

  const handleDateChange = (bookingId, serviceDate) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b._id === bookingId ? { ...b, serviceDate: serviceDate || "" } : b
      );
      console.log("Updated Date for Booking:", updated.find((b) => b._id === bookingId));
      return updated;
    });
  };

  // Handle labor assignment and date approval
  const handleApprove = async (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    console.log("Approving Booking:", {
      bookingId,
      laborId: booking.laborId,
      serviceDate: booking.serviceDate,
    });

    if (!booking.laborId || !booking.serviceDate) {
      alert("Please select a laborer and set a service date before approving.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/bookings/approve/${bookingId}`,
        { laborId: booking.laborId, serviceDate: booking.serviceDate },
        { withCredentials: true }
      );
      console.log("Approval Response:", response.data);
      alert("Booking approved successfully!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "Approved" } : b
        )
      );
    } catch (error) {
      console.error("Error approving booking:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to approve booking");
    }
  };

  // Theme toggler
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // MUI Theme Configuration with Green Theme
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
            backgroundColor: darkMode ? "#388E3C" : "#A5D6A7",
            color: darkMode ? "#fff" : "#212121",
            fontWeight: "bold",
          },
          body: { padding: { xs: "8px", sm: "12px" } },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none" },
        },
      },
    },
  });

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
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            bgcolor: "background.default",
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
            transition: "width 0.3s ease",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
              Service Bookings
            </Typography>
          </Box>

          {/* Bookings List */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
                All Booked Services
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="bookings table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Service</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Crop</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Area (Sq Ft)</TableCell>
                      <TableCell align="right">Total Price</TableCell>
                      <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>Remarks</TableCell> {/* New Column */}
                      <TableCell align="right">Labor</TableCell>
                      <TableCell align="right">Service Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ color: "text.secondary" }}>
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
                          <TableCell sx={{ color: "text.primary" }}>{booking.customerName}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{booking.contactNumber}</TableCell>
                          <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>{booking.serviceName}</TableCell>
                          <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>{booking.crop}</TableCell>
                          <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>{booking.areaInSqFt}</TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>₹{booking.totalPrice.toFixed(2)}</TableCell>
                          <TableCell sx={{ color: "text.primary", display: { xs: "none", lg: "table-cell" } }}>
                            {booking.remarks || "N/A"}
                          </TableCell> {/* New Field Display */}
                          <TableCell align="right">
                            <Select
                              value={booking.laborId || ""}
                              onChange={(e) => handleLaborChange(booking._id, e.target.value)}
                              displayEmpty
                              size={isMobile ? "small" : "medium"}
                              sx={{ minWidth: isMobile ? 80 : 120, bgcolor: "background.paper" }}
                            >
                              <MenuItem value="">Select Labor</MenuItem>
                              {labors.map((labor) => (
                                <MenuItem key={labor._id} value={labor._id} disabled={!labor.availability}>
                                  {labor.name} {labor.availability ? "" : "(Busy)"}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="date"
                              value={booking.serviceDate || ""}
                              onChange={(e) => handleDateChange(booking._id, e.target.value)}
                              size={isMobile ? "small" : "medium"}
                              sx={{ minWidth: isMobile ? 100 : 120 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {booking.status === "Approved" ? (
                              <IconButton color="primary" disabled>
                                <CheckCircleIcon />
                              </IconButton>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleApprove(booking._id)}
                                disabled={!booking.laborId || !booking.serviceDate}
                                sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminServiceBookings;