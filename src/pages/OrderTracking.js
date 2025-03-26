import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Stepper,
  Container,
  Step,
  StepLabel,
  Chip,
  Fade,
  Grow,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ShoppingCart as OrderPlacedIcon,
  LocalShipping as ShippedIcon,
  Home as DeliveredIcon,
  Cancel as CancelledIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/my-orders", { withCredentials: true });
        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setError("Invalid response from server.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

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
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
            },
            background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
            overflow: "hidden",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            padding: { xs: "8px 16px", sm: "10px 18px", md: "12px 24px" },
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            padding: { xs: "2px 6px", sm: "4px 8px" },
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            "& .MuiStepIcon-root": {
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: "#81C784",
            },
            "& .MuiStepIcon-active": { color: "#2E7D32" },
            "& .MuiStepIcon-completed": { color: "#2E7D32" },
            "& .MuiStepLabel-label": {
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              fontWeight: 500,
            },
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
            "& a": {
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            },
          },
          separator: { color: "text.secondary" },
        },
      },
    },
  });

  const getTrackingStep = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return 0;
      case "paid": return 1;
      case "shipped": return 1;
      case "completed": return 2;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const getStatusChip = (status) => {
    let color, label;
    switch (status?.toLowerCase()) {
      case "pending":
        color = "warning";
        label = "Order Placed";
        break;
      case "paid":
        color = "info";
        label = "Paid";
        break;
      case "shipped":
        color = "info";
        label = "Shipped";
        break;
      case "completed":
        color = "success";
        label = "Delivered";
        break;
      case "cancelled":
        color = "error";
        label = "Cancelled";
        break;
      default:
        color = "default";
        label = status || "Unknown";
    }
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <RouterLink to="/">
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.25rem" } }} /> Home
              </RouterLink>
              <Typography color="text.primary">Order Tracking</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 3, sm: 5 }, flexGrow: 1 }}>
          <Fade in timeout={1000}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                mb: 4,
                color: "primary.main",
                textAlign: "center",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                background: "linear-gradient(45deg, #2E7D32, #81C784)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Track Your Orders
            </Typography>
          </Fade>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress size={40} sx={{ color: "primary.main" }} />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: "center", color: "error.main", mt: 5, fontSize: { xs: "1rem", md: "1.25rem" } }}>
              {error}
            </Typography>
          ) : orders.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 5, fontSize: { xs: "1rem", md: "1.25rem" } }}>
              No orders found.
            </Typography>
          ) : (
            orders.map((order, index) => {
              const step = getTrackingStep(order.status);
              return (
                <Grow in timeout={500 * (index + 1)} key={order._id}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                            mb: { xs: 1, sm: 0 },
                          }}
                        >
                          Order #{order._id.slice(-6)}
                        </Typography>
                        {getStatusChip(order.status)}
                      </Box>
                      <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" }, mb: 1 }}>
                        Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" }, mb: 2 }}>
                        Purchase Type: {order.purchaseType || "N/A"}
                      </Typography>

                      {/* Tracking Progress */}
                      {order.status !== "Cancelled" ? (
                        <Box sx={{ mt: 2, mb: 3 }}>
                          <Stepper activeStep={step} alternativeLabel sx={{ maxWidth: { xs: 300, sm: 600 }, mx: "auto" }}>
                            <Step>
                              <StepLabel StepIconComponent={OrderPlacedIcon}>Order Placed</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel StepIconComponent={ShippedIcon}>Shipped</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel StepIconComponent={DeliveredIcon}>Delivered</StepLabel>
                            </Step>
                          </Stepper>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>
                          <CancelledIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: "error.main", mb: 1 }} />
                          <Typography sx={{ color: "error.main", fontWeight: 500, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                            Order Cancelled
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2, bgcolor: "rgba(0, 0, 0, 0.1)" }} />
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 1, color: "text.primary", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}
                      >
                        Order Details
                      </Typography>
                      <List dense sx={{ bgcolor: "#F7F9F7", borderRadius: "10px", p: 1 }}>
                        {(order.cart || []).map((item, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              py: { xs: 1, sm: 1.5 },
                              borderBottom: idx < order.cart.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                            }}
                          >
                            <ListItemText
                              primary={`${item.name || "Unknown Item"} (${item.size || "N/A"})`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Qty: {item.quantity || 0} | Price: ₹{item.price?.toLocaleString() || 0}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Total (with GST): ₹{item.totalWithGST?.toLocaleString() || "N/A"}
                                  </Typography>
                                </>
                              }
                              primaryTypographyProps={{ fontWeight: 500, color: "text.primary", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                              secondaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          <strong>Delivery:</strong> {order.address || "N/A"}, {order.pincode || "N/A"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          <strong>Crop:</strong> {order.crop || "N/A"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          <strong>Payment:</strong> {order.paymentMethod || "N/A"} {order.isDue ? "(Due)" : ""}
                        </Typography>
                        {order.razorpayOrderId && (
                          <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                            <strong>Razorpay Order ID:</strong> {order.razorpayOrderId}
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mt: 1,
                          }}
                        >
                          Total Amount: ₹{order.totalAmount?.toLocaleString() || "N/A"}
                        </Typography>
                      </Box>

                      {/* Status History */}
                      {order.statusHistory?.length > 0 && (
                        <>
                          <Divider sx={{ my: 2, bgcolor: "rgba(0, 0, 0, 0.1)" }} />
                          <Typography
                            variant="subtitle1"
                            sx={{ mb: 1, color: "text.primary", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}
                          >
                            Status History
                          </Typography>
                          <List dense sx={{ bgcolor: "#F7F9F7", borderRadius: "10px", p: 1 }}>
                            {order.statusHistory.map((history, idx) => (
                              <ListItem key={idx} sx={{ py: 1 }}>
                                <ListItemText
                                  primary={`${history.status}`}
                                  secondary={`${new Date(history.timestamp).toLocaleString()} - Updated by ${history.updatedBy?.firstName || "System"}`}
                                  primaryTypographyProps={{ fontWeight: 500, color: "text.primary", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                                  secondaryTypographyProps={{ color: "text.secondary", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grow>
              );
            })
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ display: "block", mx: "auto", mt: 4, bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" } }}
          >
            Back to Home
          </Button>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default OrderTracking;