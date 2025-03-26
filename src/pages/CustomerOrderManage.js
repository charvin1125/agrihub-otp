import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const CustomerOrderManage = () => {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState([]);
  const [unfilteredOrders, setUnfilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openBill, setOpenBill] = useState(false);
  const [totalDues, setTotalDues] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Fetch orders by mobile with populated userId
  const fetchOrders = async () => {
    if (!mobile || mobile.length < 10) {
      toast.warning("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/customer/${mobile}`, { withCredentials: true });
      const sortedOrders = response.data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log("Fetched orders:", sortedOrders); // Debug log
      setOrders(sortedOrders);
      setUnfilteredOrders(sortedOrders);
      setTotalDues(response.data.totalDues);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
      setUnfilteredOrders([]);
      setTotalDues(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle view details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  // Handle view bill
  const handleOpenBill = (order) => {
    console.log("Selected order for bill:", order); // Debug log
    setSelectedOrder(order);
    setOpenBill(true);
  };

  const handleCloseDetails = () => setOpenDetails(false);
  const handleCloseBill = () => setOpenBill(false);

  // Handle due toggle
  const handleDueToggle = async (orderId, currentDueStatus) => {
    try {
      const newStatus = currentDueStatus ? "Paid" : "Pending";
      const response = await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedOrders = orders.map((order) =>
          order._id === orderId
            ? { ...order, isDue: !currentDueStatus, status: newStatus, statusHistory: response.data.order.statusHistory }
            : order
        );
        setOrders(updatedOrders);
        setUnfilteredOrders(updatedOrders);
        const newTotalDues = updatedOrders
          .filter((order) => order.isDue)
          .reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalDues(newTotalDues);
        toast.success(`Order ${orderId} updated successfully`);
      }
    } catch (error) {
      console.error("Error toggling due status:", error);
      toast.error("Failed to update due status");
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle export to CSV
  const handleExport = () => {
    const csv =
      "Order Date,Total Amount,Payment Method,Status,Crop,Purchase Type,Products,Due Status\n" +
      orders
        .map((o) =>
          `${formatDate(o.createdAt)},₹${o.totalAmount},${o.paymentMethod},${o.status},${o.crop || "N/A"},${
            o.purchaseType || "N/A"
          },${o.cart.map((i) => `${i.productId?.name || "Unknown"}:${i.quantity}`).join(";")},${o.isDue ? "Due" : "Cleared"}`
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${mobile}.csv`;
    a.click();
  };

  // Handle download bill as PDF
  const handleDownloadBill = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Bill", 20, 20);
    doc.setFontSize(12);

    if (selectedOrder) {
      doc.text(`Order ID: ${selectedOrder._id}`, 20, 40);
      doc.text(`Customer Name: ${selectedOrder.name}`, 20, 50);
      doc.text(`Phone: ${selectedOrder.phone}`, 20, 60);
      doc.text(`Address: ${selectedOrder.address}`, 20, 70);
      doc.text(`Pincode: ${selectedOrder.pincode}`, 20, 80);
      doc.text(`Crop: ${selectedOrder.crop || "N/A"}`, 20, 90);
      doc.text(`Payment Method: ${selectedOrder.paymentMethod}`, 20, 100);
      doc.text(`Total Amount: ₹${selectedOrder.totalAmount.toLocaleString()}`, 20, 110);
      doc.text(`Order Date: ${formatDate(selectedOrder.createdAt)}`, 20, 120);
      doc.text(`Status: ${selectedOrder.status}`, 20, 130);
      doc.text(`Due Status: ${selectedOrder.isDue ? "Due" : "Cleared"}`, 20, 140);
      doc.text(`Purchase Type: ${selectedOrder.purchaseType}`, 20, 150);

      if (selectedOrder.purchaseType === "Offline" && selectedOrder.userId) {
        const adminName = `${selectedOrder.userId.firstName} ${selectedOrder.userId.lastName || ""}`.trim();
        doc.text(`Ordered By: ${adminName}`, 20, 160);
        doc.text("Products:", 20, 170);
        selectedOrder.cart.forEach((item, index) => {
          doc.text(
            `- ${item.productId?.name || "Unknown"}: ${item.quantity} pcs, ₹${item.totalWithGST.toLocaleString()}`,
            30,
            180 + index * 10
          );
        });
      } else {
        doc.text("Products:", 20, 160);
        selectedOrder.cart.forEach((item, index) => {
          doc.text(
            `- ${item.productId?.name || "Unknown"}: ${item.quantity} pcs, ₹${item.totalWithGST.toLocaleString()}`,
            30,
            170 + index * 10
          );
        });
      }

      doc.save(`bill_${selectedOrder._id}.pdf`);
    }
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    if (value === "All") {
      setOrders(unfilteredOrders);
    } else {
      setOrders(unfilteredOrders.filter((o) => o.status === value));
    }
  };

  // Responsive setup
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 600;
      setIsMobile(mobileView);
      if (mobileView) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme toggler
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // DataGrid columns
  const columns = [
    {
      field: "createdAt",
      headerName: "Order Date",
      flex: 1,
      renderCell: (params) => formatDate(params.value),
      sortable: true,
      minWidth: isMobile ? 120 : 150,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
      sortable: true,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Type",
      flex: 1,
      sortable: true,
      minWidth: isMobile ? 100 : 120,
      hide: isMobile,
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Completed" ? "success" : params.value === "Cancelled" ? "error" : "warning"}
          size={isMobile ? "small" : "medium"}
        />
      ),
      sortable: true,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "isDue",
      headerName: "Due Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Due" : "Cleared"}
          color={params.value ? "error" : "success"}
          size={isMobile ? "small" : "medium"}
        />
      ),
      sortable: true,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            size={isMobile ? "small" : "medium"}
            startIcon={<VisibilityIcon />}
            onClick={() => handleOpenDetails(params.row)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size={isMobile ? "small" : "medium"}
            startIcon={<DownloadIcon />}
            onClick={() => handleOpenBill(params.row)}
          >
            Bill
          </Button>
          <Button
            variant="contained"
            color={params.row.isDue ? "secondary" : "primary"}
            size={isMobile ? "small" : "medium"}
            onClick={() => handleDueToggle(params.row._id, params.row.isDue)}
          >
            {params.row.isDue ? "Clear Due" : "Set Due"}
          </Button>
        </Box>
      ),
      minWidth: isMobile ? 220 : 300,
    },
  ];

  // MUI Theme Configuration
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
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          },
          columnHeaders: {
            backgroundColor: darkMode ? "#388E3C" : "#A5D6A7",
            color: darkMode ? "#fff" : "#212121",
          },
          cell: { color: darkMode ? "#e0e0e0" : "#212121" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none" },
        },
      },
    },
  });

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
          <Box
            sx={{
              mb: { xs: 2, sm: 4 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1 }}>
              Customer Order Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
              <TextField
                label="Customer Mobile Number"
                variant="outlined"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={fetchOrders}>
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </IconButton>
                  ),
                }}
                sx={{ width: { xs: "100%", sm: "400px" }, bgcolor: "background.paper" }}
                size={isMobile ? "small" : "medium"}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={fetchOrders}
                disabled={loading}
                sx={{ px: { xs: 2, sm: 4 }, py: 1 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Search Orders"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExport}
                disabled={orders.length === 0}
              >
                Export Orders
              </Button>
            </Box>
          </Box>

          {/* Orders Table */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              {totalDues > 0 && (
                <Chip
                  label={`Total Outstanding Dues: ₹${totalDues.toLocaleString()}`}
                  color="error"
                  sx={{ mb: 2, fontSize: "1rem", py: 2 }}
                />
              )}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress size={60} sx={{ color: "primary.main" }} />
                </Box>
              ) : orders.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
                    No orders found for this mobile number.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: "auto", width: "100%" }}>
                  <FormControl sx={{ mb: 2, minWidth: { xs: "100%", sm: 200 } }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                      label="Filter by Status"
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <DataGrid
                    rows={orders}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    autoHeight
                    disableSelectionOnClick
                    sortingOrder={["asc", "desc"]}
                    sx={{ "& .MuiDataGrid-cell": { fontSize: isMobile ? "0.75rem" : "0.875rem" } }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#388E3C" : "#66BB6A", color: "#fff" }}>
              Order Details
            </DialogTitle>
            <DialogContent dividers>
              {selectedOrder && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Order Status:</strong> {selectedOrder.status}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Due Status:</strong> {selectedOrder.isDue ? "Due" : "Cleared"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Crop:</strong> {selectedOrder.crop || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Purchase Type:</strong> {selectedOrder.purchaseType || "N/A"}
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: darkMode ? "#b0b0b0" : "#757575" }} />
                  <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ mb: 1, color: "text.primary" }}>
                    Products:
                  </Typography>
                  {selectedOrder.cart.map((item) => (
                    <Typography key={item._id} variant="body2" sx={{ ml: 2, color: "text.primary" }}>
                      - {item.productId?.name || "Unknown"} ({item.quantity} pcs, ₹{item.totalWithGST.toLocaleString()})
                    </Typography>
                  ))}
                  <Divider sx={{ my: 2, bgcolor: darkMode ? "#b0b0b0" : "#757575" }} />
                  <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ mb: 1, color: "text.primary" }}>
                    Status History:
                  </Typography>
                  {selectedOrder.statusHistory?.map((history, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 2, color: "text.primary" }}>
                      - {history.status} on {formatDate(history.timestamp)} by {history.updatedBy?.firstName || "System"}
                    </Typography>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="primary" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Bill Dialog */}
          <Dialog open={openBill} onClose={handleCloseBill} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#388E3C" : "#66BB6A", color: "#fff" }}>
              Order Bill
            </DialogTitle>
            <DialogContent dividers>
              {selectedOrder && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Customer Name:</strong> {selectedOrder.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Address:</strong> {selectedOrder.address}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Pincode:</strong> {selectedOrder.pincode}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Crop:</strong> {selectedOrder.crop || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Status:</strong> {selectedOrder.status}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Due Status:</strong> {selectedOrder.isDue ? "Due" : "Cleared"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Purchase Type:</strong> {selectedOrder.purchaseType}
                  </Typography>
                  {selectedOrder.purchaseType === "Offline" && selectedOrder.userId ? (
                    <>
                      <Divider sx={{ my: 2, bgcolor: darkMode ? "#b0b0b0" : "#757575" }} />
                      <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ mb: 1, color: "text.primary" }}>
                        Ordered By:
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2, color: "text.primary" }}>
                        - {selectedOrder.userId.firstName} {selectedOrder.userId.lastName || ""}
                      </Typography>
                    </>
                  ) : null}
                  <Divider sx={{ my: 2, bgcolor: darkMode ? "#b0b0b0" : "#757575" }} />
                  <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ mb: 1, color: "text.primary" }}>
                    Products:
                  </Typography>
                  {selectedOrder.cart.map((item) => (
                    <Typography key={item._id} variant="body2" sx={{ ml: 2, color: "text.primary" }}>
                      - {item.productId?.name || "Unknown"} ({item.quantity} pcs, ₹{item.totalWithGST.toLocaleString()})
                    </Typography>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDownloadBill}
                color="primary"
                variant="contained"
                startIcon={<DownloadIcon />}
                disabled={!selectedOrder}
              >
                Download PDF
              </Button>
              <Button onClick={handleCloseBill} color="primary" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerOrderManage;