import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Breadcrumbs,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavigationBar from "../components/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PaymentIcon from "@mui/icons-material/Payment";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [crop, setCrop] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay Later");
  const [loading, setLoading] = useState(false);
  const [darkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", { withCredentials: true });
        setUser(response.data);

        const savedDataKey = `savedCustomerData_${response.data.username}`;
        const savedData = JSON.parse(localStorage.getItem(savedDataKey)) || {};
        setCustomerName(savedData.customerName || response.data.firstName || "");
        setPhone(savedData.phone || response.data.mobile || "");
        setPincode(savedData.pincode || "");
        setAddress(savedData.address || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      }
    };

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Checkout cart loaded:", JSON.stringify(storedCart, null, 2)); // Enhanced debug log
    setCart(storedCart);

    fetchUserProfile();
  }, [navigate]);

  const totalAmount = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity, 10) || 1;
    const gstRate = parseFloat(item.gst) ? parseFloat(item.gst) / 100 : 0;
    return sum + price * quantity * (1 + gstRate);
  }, 0).toFixed(2);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrder = async () => {
    if (!customerName.trim() || !phone.trim() || !pincode.trim() || !address.trim() || !crop.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const orderData = {
      name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      crop: crop.trim(),
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      cart: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        batchId: item.batchId,
        name: item.name,
        size: item.size || "N/A",
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10) || 1,
        gst: parseFloat(item.gst) || 0,
        totalWithGST: parseFloat(item.totalWithGST) || (parseFloat(item.price) * (1 + (parseFloat(item.gst) || 0) / 100) * (parseInt(item.quantity, 10) || 1)),
      })),
    };

    console.log("Order data being sent to backend:", JSON.stringify(orderData, null, 2)); // Enhanced debug log

    try {
      if (paymentMethod === "Pay Later" || paymentMethod === "Cash") {
        const response = await axios.post("http://localhost:5000/api/orders/place", orderData, { withCredentials: true });
        console.log("Backend response:", JSON.stringify(response.data, null, 2)); // Debug log
        if (response.data.success) {
          alert("Order placed successfully!");
          const savedDataKey = `savedCustomerData_${user.username}`;
          localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
          localStorage.removeItem("cart");
          setCart([]);
          navigate("/order-success");
        } else {
          alert(response.data.message || "Order failed. Try again.");
        }
      } else if (paymentMethod === "Card") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay SDK. Please check your internet connection.");
          setLoading(false);
          return;
        }

        const orderResponse = await axios.post(
          "http://localhost:5000/api/orders/create-razorpay-order",
          { amount: totalAmount * 100 },
          { withCredentials: true }
        );
        console.log("Razorpay order response:", JSON.stringify(orderResponse.data, null, 2)); // Debug log
        if (!orderResponse.data.success) {
          throw new Error(orderResponse.data.message || "Failed to create Razorpay order");
        }
        const { id: orderId, currency } = orderResponse.data;

        const options = {
          key: "rzp_test_fwA1F6rg7iQI8x", // Replace with your Razorpay Key ID
          amount: totalAmount * 100,
          currency,
          name: "AgriHub",
          description: "Purchase of agricultural products",
          order_id: orderId,
          handler: async (response) => {
            try {
              const verifyResponse = await axios.post(
                "http://localhost:5000/api/orders/verify-razorpay-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData,
                },
                { withCredentials: true }
              );
              console.log("Payment verification response:", JSON.stringify(verifyResponse.data, null, 2)); // Debug log
              if (verifyResponse.data.success) {
                alert("Payment successful! Order placed.");
                const savedDataKey = `savedCustomerData_${user.username}`;
                localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/order-success");
              } else {
                alert(verifyResponse.data.message || "Payment verification failed.");
              }
            } catch (error) {
              console.error("Payment verification error:", error.response ? error.response.data : error.message);
              alert("Failed to verify payment. Check console for details.");
            }
          },
          prefill: { name: customerName, contact: phone },
          theme: { color: darkMode ? "#66BB6A" : "#388E3C" },
        };

        const razorpayCheckout = new window.Razorpay(options);
        razorpayCheckout.open();
      }
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
      alert(`Failed to place order: ${error.response?.data?.message || error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: darkMode ? "0 4px 20px rgba(255,255,255,0.1)" : "0 4px 20px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: darkMode ? "0 6px 24px rgba(255,255,255,0.2)" : "0 6px 24px rgba(0,0,0,0.15)" },
            bgcolor: darkMode ? "#263238" : "#fff",
          },
        },
      },
      MuiButton: { styleOverrides: { root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 } } },
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
      MuiSelect: { styleOverrides: { root: { bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9", borderRadius: "8px" } } },
    },
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavigationBar />
        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 4 }, pt: { xs: 10, sm: 12 } }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, color: "text.secondary" }}>
            <RouterLink to="/" style={{ color: darkMode ? "#A5D6A7" : "#388E3C", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Home
            </RouterLink>
            <RouterLink to="/cart" style={{ color: darkMode ? "#A5D6A7" : "#388E3C", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <ShoppingCartIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Cart
            </RouterLink>
            <Typography sx={{ color: "text.primary" }}>Checkout</Typography>
          </Breadcrumbs>

          <Typography variant="h4" sx={{ color: "primary.main", mb: 3, textAlign: "center", fontWeight: "bold" }}>
            Checkout
          </Typography>

          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    variant="outlined"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth
                    label="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    variant="outlined"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                    required
                    multiline
                    rows={3}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth
                    label="For Which Crop Are You Buying?"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    variant="outlined"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><AgricultureIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} label="Payment Method" required>
                      <MenuItem value="Pay Later">Pay Later</MenuItem>
                      <MenuItem value="Card">Card (Razorpay)</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ my: 3, bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
                    Total Amount: <span style={{ color: darkMode ? "#81C784" : "#388E3C" }}>₹{totalAmount}</span>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOrder}
                    disabled={loading || cart.length === 0}
                    sx={{ py: 1.5, fontSize: "1.1rem", width: { xs: "100%", sm: "50%" }, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ py: 4, bgcolor: darkMode ? "#1A3C34" : "#E8F5E9", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} AgriHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Checkout;