import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,
  Chip,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [filterStatus, setFilterStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/list", {
          withCredentials: true,
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 403) navigate("/"); // Redirect if not admin
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus, statusHistory: response.data.order.statusHistory }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status");
    }
  };

  const handlePayDues = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/pay-dues/${orderId}`,
        { status: "Paid", duesPaidDate: new Date() },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: "Paid",
                  isDue: false,
                  duesPaidDate: response.data.order.duesPaidDate,
                  statusHistory: response.data.order.statusHistory,
                }
              : order
          )
        );
        alert("Dues cleared successfully!");
      }
    } catch (error) {
      console.error("Error paying dues:", error);
      alert("Failed to clear dues");
    }
  };

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
      text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
    },
    components: {
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
          root: {
            borderRadius: 8,
            textTransform: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
          },
        },
      },
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
    },
  });

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : "N/A";
  };

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
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            bgcolor: "background.default",
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
            transition: "width 0.3s ease",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
            >
              Manage Orders
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Filter by Status"
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Total Orders: {filteredOrders.length}
                  </Typography>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Status</TableCell>
                        <TableCell>Dues Paid Date</TableCell>
                        <TableCell>Status History</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            <Typography variant="body1" sx={{ color: "text.secondary", py: 2 }}>
                              No orders found matching the selected filter.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <TableRow
                            key={order._id}
                            sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}
                          >
                            <TableCell sx={{ color: "text.primary" }}>{order._id}</TableCell>
                            <TableCell sx={{ color: "text.primary" }}>{order.name}</TableCell>
                            <TableCell sx={{ color: "text.primary" }}>
                              ₹{order.totalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ color: "text.primary" }}>{order.paymentMethod}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={
                                  order.status === "Completed"
                                    ? "success"
                                    : order.status === "Cancelled"
                                    ? "error"
                                    : "primary"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.isDue ? "Due" : "Cleared"}
                                color={order.isDue ? "error" : "success"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ color: "text.primary" }}>{formatDate(order.duesPaidDate)}</TableCell>
                            <TableCell sx={{ color: "text.primary" }}>
                              {order.statusHistory?.length > 0 ? (
                                order.statusHistory.map((history, index) => (
                                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                    {history.status} by {history.updatedBy?.firstName || "Unknown"} on{" "}
                                    {formatDate(history.timestamp)}
                                  </Typography>
                                ))
                              ) : (
                                "No history"
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                <FormControl sx={{ minWidth: 120 }}>
                                  <Select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    size="small"
                                    sx={{ borderRadius: "8px" }}
                                  >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                  </Select>
                                </FormControl>
                                {order.isDue && (
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handlePayDues(order._id)}
                                    sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
                                  >
                                    Pay Dues
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageOrders;