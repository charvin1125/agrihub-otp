import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  TextField,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const initializedCart = storedCart.map((item) => ({
      ...item,
      size: item.size || item.variantSize || "N/A",
      totalWithGST: item.totalWithGST || calculateTotalWithGST(item),
      productId: item.productId,
      variantId: item.variantId,
      batchId: item.batchId,
    }));
    setCartItems(initializedCart);

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.totalWithGST || 0), 0);
    setTotalAmount(total.toFixed(2));
  }, [cartItems]);

  const calculateTotalWithGST = (item) => {
    const gstRate = item.gst ? item.gst / 100 : 0;
    return (item.price || 0) * (1 + gstRate) * (item.quantity || 1);
  };

  const handleUpdateQuantity = (batchId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.batchId === batchId) {
        const quantity = Math.max(1, Math.min(newQuantity || 1, item.stock || Infinity));
        const totalWithGST = calculateTotalWithGST({ ...item, quantity });
        return { ...item, quantity, totalWithGST };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemoveItem = (batchId) => {
    const updatedCart = cartItems.filter((item) => item.batchId !== batchId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
            },
            background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#2E7D32",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
            padding: { xs: "8px", sm: "10px", md: "14px" },
            whiteSpace: "nowrap",
          },
          body: {
            padding: { xs: "8px", sm: "10px", md: "14px" },
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "#81C784" },
              "&:hover fieldset": { borderColor: "#2E7D32" },
              "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
            },
            "& .MuiInputBase-input": {
              padding: { xs: "6px", sm: "8px", md: "10px" },
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link to="/">
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }} /> Home
              </Link>
              <Typography color="text.primary">Cart</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 3, sm: 5 }, flexGrow: 1 }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              color: "primary.main",
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
            }}
          >
            Your Cart
          </Typography>

          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              {cartItems.length === 0 ? (
                <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4, md: 6 } }}>
                  <ShoppingCartIcon sx={{ fontSize: { xs: 40, sm: 50, md: 70 }, color: "text.secondary", mb: 2 }} />
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ color: "text.secondary", mb: 2, fontWeight: 500 }}>
                    Your cart is empty
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/products")}
                    sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" } }}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Size</TableCell>
                          <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>Price</TableCell>
                          <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>GST (%)</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="center" sx={{ width: { xs: "40px", sm: "60px" } }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow
                            key={item.batchId}
                            sx={{
                              "&:hover": { bgcolor: "#F1F8E9" },
                              transition: "background-color 0.3s ease",
                            }}
                          >
                            <TableCell sx={{ minWidth: { xs: 150, sm: 200 } }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                {item.image && (
                                  <img
                                    src={`http://localhost:5000/${item.image}`}
                                    alt={item.name}
                                    style={{
                                      width: isMobile ? 30 : 50,
                                      height: isMobile ? 30 : 50,
                                      borderRadius: "6px",
                                      marginRight: isMobile ? 1 : 1.5,
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => (e.target.style.display = "none")}
                                  />
                                )}
                                <Box>
                                  <Typography
                                    variant={isMobile ? "body2" : "body1"}
                                    sx={{ color: "text.primary", fontWeight: 500 }}
                                  >
                                    {item.name || "Unknown Product"}
                                  </Typography>
                                  {isMobile && (
                                    <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                                      Size: {item.size || "N/A"} | ₹{(item.price || 0).toFixed(2)}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {item.size || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>
                              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                                ₹{(item.price || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>
                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {item.gst || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 0.5, sm: 1 } }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.batchId, (item.quantity || 1) - 1)}
                                  disabled={(item.quantity || 1) <= 1}
                                  sx={{ color: "#2E7D32", padding: { xs: "2px", sm: "4px" } }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <TextField
                                  type="number"
                                  value={item.quantity || 1}
                                  onChange={(e) => handleUpdateQuantity(item.batchId, parseInt(e.target.value, 10))}
                                  variant="outlined"
                                  size="small"
                                  sx={{ width: { xs: "40px", sm: "50px", md: "60px" } }}
                                  inputProps={{ min: 1, max: item.stock || Infinity }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.batchId, (item.quantity || 1) + 1)}
                                  disabled={(item.quantity || 1) >= (item.stock || Infinity)}
                                  sx={{ color: "#2E7D32", padding: { xs: "2px", sm: "4px" } }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                                ₹{(item.totalWithGST || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => handleRemoveItem(item.batchId)}
                                sx={{ color: "#D32F2F", "&:hover": { color: "#FF6655" }, padding: { xs: "2px", sm: "4px" } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: { xs: 2, sm: 3 }, bgcolor: "rgba(0, 0, 0, 0.1)" }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "center", sm: "center" },
                      gap: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        mb: { xs: 1, sm: 0 },
                        fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                      }}
                    >
                      Total: ₹{totalAmount}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleCheckout}
                      sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, width: { xs: "100%", sm: "auto" } }}
                    >
                      Proceed to Checkout
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Cart;