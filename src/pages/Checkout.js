// import { useState, useEffect } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Breadcrumbs,
//   InputAdornment,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import NavigationBar from "../components/Navbar";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AgricultureIcon from "@mui/icons-material/Agriculture";
// import PaymentIcon from "@mui/icons-material/Payment";
// import HomeIcon from "@mui/icons-material/Home";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { motion } from "framer-motion";

// const Checkout = () => {
//   const [cart, setCart] = useState([]);
//   const [user, setUser] = useState(null);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [address, setAddress] = useState("");
//   const [crop, setCrop] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Pay Later");
//   const [loading, setLoading] = useState(false);
//   const [darkMode] = useState(localStorage.getItem("theme") === "dark");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users/profile", { withCredentials: true });
//         setUser(response.data);

//         const savedDataKey = `savedCustomerData_${response.data.username}`;
//         const savedData = JSON.parse(localStorage.getItem(savedDataKey)) || {};
//         setCustomerName(savedData.customerName || response.data.firstName || "");
//         setPhone(savedData.phone || response.data.mobile || "");
//         setPincode(savedData.pincode || "");
//         setAddress(savedData.address || "");
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         navigate("/login");
//       }
//     };

//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     console.log("Checkout cart loaded:", JSON.stringify(storedCart, null, 2)); // Enhanced debug log
//     setCart(storedCart);

//     fetchUserProfile();
//   }, [navigate]);

//   const totalAmount = cart.reduce((sum, item) => {
//     const price = parseFloat(item.price) || 0;
//     const quantity = parseInt(item.quantity, 10) || 1;
//     const gstRate = parseFloat(item.gst) ? parseFloat(item.gst) / 100 : 0;
//     return sum + price * quantity * (1 + gstRate);
//   }, 0).toFixed(2);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleOrder = async () => {
//     if (!customerName.trim() || !phone.trim() || !pincode.trim() || !address.trim() || !crop.trim()) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     const orderData = {
//       name: customerName.trim(),
//       phone: phone.trim(),
//       address: address.trim(),
//       pincode: pincode.trim(),
//       crop: crop.trim(),
//       paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart: cart.map((item) => ({
//         productId: item.productId,
//         variantId: item.variantId,
//         batchId: item.batchId,
//         name: item.name,
//         size: item.size || "N/A",
//         price: parseFloat(item.price),
//         quantity: parseInt(item.quantity, 10) || 1,
//         gst: parseFloat(item.gst) || 0,
//         totalWithGST: parseFloat(item.totalWithGST) || (parseFloat(item.price) * (1 + (parseFloat(item.gst) || 0) / 100) * (parseInt(item.quantity, 10) || 1)),
//       })),
//     };

//     console.log("Order data being sent to backend:", JSON.stringify(orderData, null, 2)); // Enhanced debug log

//     try {
//       if (paymentMethod === "Pay Later" || paymentMethod === "Cash") {
//         const response = await axios.post("http://localhost:5000/api/orders/place", orderData, { withCredentials: true });
//         console.log("Backend response:", JSON.stringify(response.data, null, 2)); // Debug log
//         if (response.data.success) {
//           alert("Order placed successfully!");
//           const savedDataKey = `savedCustomerData_${user.username}`;
//           localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
//           localStorage.removeItem("cart");
//           setCart([]);
//           navigate("/order-success");
//         } else {
//           alert(response.data.message || "Order failed. Try again.");
//         }
//       } else if (paymentMethod === "Card") {
//         const scriptLoaded = await loadRazorpayScript();
//         if (!scriptLoaded) {
//           alert("Failed to load Razorpay SDK. Please check your internet connection.");
//           setLoading(false);
//           return;
//         }

//         const orderResponse = await axios.post(
//           "http://localhost:5000/api/orders/create-razorpay-order",
//           { amount: totalAmount * 100 },
//           { withCredentials: true }
//         );
//         console.log("Razorpay order response:", JSON.stringify(orderResponse.data, null, 2)); // Debug log
//         if (!orderResponse.data.success) {
//           throw new Error(orderResponse.data.message || "Failed to create Razorpay order");
//         }
//         const { id: orderId, currency } = orderResponse.data;

//         const options = {
//           key: "rzp_test_fwA1F6rg7iQI8x", // Replace with your Razorpay Key ID
//           amount: totalAmount * 100,
//           currency,
//           name: "AgriHub",
//           description: "Purchase of agricultural products",
//           order_id: orderId,
//           handler: async (response) => {
//             try {
//               const verifyResponse = await axios.post(
//                 "http://localhost:5000/api/orders/verify-razorpay-payment",
//                 {
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                   orderData,
//                 },
//                 { withCredentials: true }
//               );
//               console.log("Payment verification response:", JSON.stringify(verifyResponse.data, null, 2)); // Debug log
//               if (verifyResponse.data.success) {
//                 alert("Payment successful! Order placed.");
//                 const savedDataKey = `savedCustomerData_${user.username}`;
//                 localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
//                 localStorage.removeItem("cart");
//                 setCart([]);
//                 navigate("/order-success");
//               } else {
//                 alert(verifyResponse.data.message || "Payment verification failed.");
//               }
//             } catch (error) {
//               console.error("Payment verification error:", error.response ? error.response.data : error.message);
//               alert("Failed to verify payment. Check console for details.");
//             }
//           },
//           prefill: { name: customerName, contact: phone },
//           theme: { color: darkMode ? "#66BB6A" : "#388E3C" },
//         };

//         const razorpayCheckout = new window.Razorpay(options);
//         razorpayCheckout.open();
//       }
//     } catch (error) {
//       console.error("Error placing order:", error.response ? error.response.data : error.message);
//       alert(`Failed to place order: ${error.response?.data?.message || error.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//       background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "12px",
//             boxShadow: darkMode ? "0 4px 20px rgba(255,255,255,0.1)" : "0 4px 20px rgba(0,0,0,0.1)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             "&:hover": { transform: "translateY(-5px)", boxShadow: darkMode ? "0 6px 24px rgba(255,255,255,0.2)" : "0 6px 24px rgba(0,0,0,0.15)" },
//             bgcolor: darkMode ? "#263238" : "#fff",
//           },
//         },
//       },
//       MuiButton: { styleOverrides: { root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 } } },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
//               borderRadius: "8px",
//               "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
//               "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
//             },
//           },
//         },
//       },
//       MuiSelect: { styleOverrides: { root: { bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9", borderRadius: "8px" } } },
//     },
//   });

//   const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
//         <NavigationBar />
//         <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 4 }, pt: { xs: 10, sm: 12 } }}>
//           <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, color: "text.secondary" }}>
//             <RouterLink to="/" style={{ color: darkMode ? "#A5D6A7" : "#388E3C", textDecoration: "none", display: "flex", alignItems: "center" }}>
//               <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Home
//             </RouterLink>
//             <RouterLink to="/cart" style={{ color: darkMode ? "#A5D6A7" : "#388E3C", textDecoration: "none", display: "flex", alignItems: "center" }}>
//               <ShoppingCartIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Cart
//             </RouterLink>
//             <Typography sx={{ color: "text.primary" }}>Checkout</Typography>
//           </Breadcrumbs>

//           <Typography variant="h4" sx={{ color: "primary.main", mb: 3, textAlign: "center", fontWeight: "bold" }}>
//             Checkout
//           </Typography>

//           <Card>
//             <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
//               <form>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     variant="outlined"
//                     required
//                     InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Phone Number"
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     variant="outlined"
//                     required
//                     InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Pincode"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     variant="outlined"
//                     required
//                     InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     variant="outlined"
//                     required
//                     multiline
//                     rows={3}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="For Which Crop Are You Buying?"
//                     value={crop}
//                     onChange={(e) => setCrop(e.target.value)}
//                     variant="outlined"
//                     required
//                     InputProps={{ startAdornment: <InputAdornment position="start"><AgricultureIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <FormControl fullWidth>
//                     <InputLabel>Payment Method</InputLabel>
//                     <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} label="Payment Method" required>
//                       <MenuItem value="Pay Later">Pay Later</MenuItem>
//                       <MenuItem value="Card">Card (Razorpay)</MenuItem>
//                       <MenuItem value="Cash">Cash</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Divider sx={{ my: 3, bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

//                 <Box sx={{ textAlign: "center" }}>
//                   <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
//                     Total Amount: <span style={{ color: darkMode ? "#81C784" : "#388E3C" }}>₹{totalAmount}</span>
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleOrder}
//                     disabled={loading || cart.length === 0}
//                     sx={{ py: 1.5, fontSize: "1.1rem", width: { xs: "100%", sm: "50%" }, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                   >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
//                   </Button>
//                 </Box>
//               </form>
//             </CardContent>
//           </Card>
//         </Box>

//         <Box sx={{ py: 4, bgcolor: darkMode ? "#1A3C34" : "#E8F5E9", textAlign: "center" }}>
//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             © {new Date().getFullYear()} AgriHub. All rights reserved.
//           </Typography>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Checkout;
// import { useState, useEffect } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Breadcrumbs,
//   InputAdornment,
//   Tooltip,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { motion } from "framer-motion";
// import NavigationBar from "../components/Navbar";
// import Footer from "../components/Footer";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AgricultureIcon from "@mui/icons-material/Agriculture";
// import PaymentIcon from "@mui/icons-material/Payment";
// import HomeIcon from "@mui/icons-material/Home";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Checkout = () => {
//   const [cart, setCart] = useState([]);
//   const [user, setUser] = useState(null);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [address, setAddress] = useState("");
//   const [crop, setCrop] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [darkMode] = useState(localStorage.getItem("theme") === "dark");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users/profile", { withCredentials: true });
//         setUser(response.data);
//         const savedDataKey = `savedCustomerData_${response.data.username}`;
//         const savedData = JSON.parse(localStorage.getItem(savedDataKey)) || {};
//         setCustomerName(savedData.customerName || response.data.firstName || "");
//         setPhone(savedData.phone || response.data.mobile || "");
//         setPincode(savedData.pincode || "");
//         setAddress(savedData.address || "");
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         toast.error("Please log in to proceed.", { autoClose: 2000 });
//         navigate("/login");
//       }
//     };

//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//     if (storedCart.length === 0) {
//       toast.warn("Your cart is empty!", { autoClose: 2000 });
//       navigate("/cart");
//     }
//     fetchUserProfile();
//   }, [navigate]);

//   const totalAmount = cart.reduce((sum, item) => {
//     const price = parseFloat(item.price) || 0;
//     const quantity = parseInt(item.quantity, 10) || 1;
//     const gstRate = parseFloat(item.gst) ? parseFloat(item.gst) / 100 : 0;
//     return sum + price * quantity * (1 + gstRate);
//   }, 0).toFixed(2);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleOrder = async () => {
//     if (!customerName.trim() || !phone.trim() || !pincode.trim() || !address.trim() || !crop.trim() || !paymentMethod) {
//       toast.error("Please fill all required fields.", { autoClose: 2000 });
//       return;
//     }

//     if (!/^\d{10}$/.test(phone)) {
//       toast.error("Phone number must be 10 digits.", { autoClose: 2000 });
//       return;
//     }

//     if (!/^\d{6}$/.test(pincode)) {
//       toast.error("Pincode must be 6 digits.", { autoClose: 2000 });
//       return;
//     }

//     setLoading(true);
//     const orderData = {
//       name: customerName.trim(),
//       phone: phone.trim(),
//       address: address.trim(),
//       pincode: pincode.trim(),
//       crop: crop.trim(),
//       paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart: cart.map((item) => ({
//         productId: item.productId,
//         variantId: item.variantId,
//         batchId: item.batchId,
//         name: item.name,
//         size: item.size || "N/A",
//         price: parseFloat(item.price),
//         quantity: parseInt(item.quantity, 10) || 1,
//         gst: parseFloat(item.gst) || 0,
//         totalWithGST: parseFloat(item.totalWithGST) || (parseFloat(item.price) * (1 + (parseFloat(item.gst) || 0) / 100) * (parseInt(item.quantity, 10) || 1)),
//       })),
//     };

//     try {
//       if (paymentMethod === "Cash On Delivery") {
//         const response = await axios.post("http://localhost:5000/api/orders/place", orderData, { withCredentials: true });
//         if (response.data.success) {
//           toast.success("Order placed successfully!", { autoClose: 2000 });
//           const savedDataKey = `savedCustomerData_${user.username}`;
//           localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
//           localStorage.removeItem("cart");
//           setCart([]);
//           navigate("/order-success");
//         } else {
//           toast.error(response.data.message || "Order failed. Try again.", { autoClose: 2000 });
//         }
//       } else if (paymentMethod === "UPI" || paymentMethod === "Net Banking" || paymentMethod === "Card") {
//         const scriptLoaded = await loadRazorpayScript();
//         if (!scriptLoaded) {
//           toast.error("Failed to load payment gateway. Check your connection.", { autoClose: 2000 });
//           setLoading(false);
//           return;
//         }

//         const orderResponse = await axios.post(
//           "http://localhost:5000/api/orders/create-razorpay-order",
//           { amount: totalAmount * 100 },
//           { withCredentials: true }
//         );
//         if (!orderResponse.data.success) {
//           throw new Error(orderResponse.data.message || "Failed to create payment order");
//         }
//         const { id: orderId, currency } = orderResponse.data;

//         const options = {
//           key: "rzp_test_fwA1F6rg7iQI8x", // Replace with your Razorpay Key ID
//           amount: totalAmount * 100,
//           currency,
//           name: "AgriHub",
//           description: "Purchase of agricultural products",
//           order_id: orderId,
//           handler: async (response) => {
//             try {
//               const verifyResponse = await axios.post(
//                 "http://localhost:5000/api/orders/verify-razorpay-payment",
//                 {
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                   orderData,
//                 },
//                 { withCredentials: true }
//               );
//               if (verifyResponse.data.success) {
//                 toast.success("Payment successful! Order placed.", { autoClose: 2000 });
//                 const savedDataKey = `savedCustomerData_${user.username}`;
//                 localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
//                 localStorage.removeItem("cart");
//                 setCart([]);
//                 navigate("/order-success");
//               } else {
//                 toast.error(verifyResponse.data.message || "Payment verification failed.", { autoClose: 2000 });
//               }
//             } catch (error) {
//               toast.error("Failed to verify payment. Please try again.", { autoClose: 2000 });
//             }
//           },
//           prefill: { name: customerName, contact: phone },
//           theme: { color: darkMode ? "#66BB6A" : "#2E7D32" },
//           method: {
//             upi: paymentMethod === "UPI",
//             netbanking: paymentMethod === "Net Banking",
//             card: paymentMethod === "Card",
//           },
//         };

//         const razorpayCheckout = new window.Razorpay(options);
//         razorpayCheckout.open();
//       }
//     } catch (error) {
//       console.error("Error placing order:", error.response ? error.response.data : error.message);
//       toast.error(`Failed to place order: ${error.response?.data?.message || error.message || "Unknown error"}`, { autoClose: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#2E7D32" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#81C784" },
//       background: { default: darkMode ? "#121212" : "#F7F9F7", paper: darkMode ? "#1e1e1e" : "#FFFFFF" },
//       text: { primary: darkMode ? "#E0E0E0" : "#1A1A1A", secondary: darkMode ? "#B0B0B0" : "#616161" },
//     },
//     typography: { fontFamily: "sans-serif" },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "24px",
//             boxShadow: darkMode ? "0 8px 30px rgba(255,255,255,0.1)" : "0 8px 30px rgba(0,0,0,0.1)",
//             transition: "all 0.4s ease",
//             "&:hover": { transform: "translateY(-10px)", boxShadow: darkMode ? "0 14px 40px rgba(255,255,255,0.15)" : "0 14px 40px rgba(0,0,0,0.15)" },
//             background: darkMode ? "linear-gradient(180deg, #1e1e1e 70%, #121212 100%)" : "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "16px",
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
//             padding: { xs: "12px 24px", sm: "14px 28px" },
//             "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "12px",
//               "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
//               "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#2E7D32" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#2E7D32" },
//               "&.Mui-error fieldset": { borderColor: "#D32F2F" },
//             },
//             "& .MuiInputBase-input": {
//               padding: { xs: "12px", sm: "14px" },
//               fontSize: { xs: "1rem", sm: "1.1rem" },
//             },
//             "& .MuiInputLabel-root": {
//               fontSize: { xs: "1rem", sm: "1.1rem" },
//             },
//           },
//         },
//       },
//       MuiSelect: {
//         styleOverrides: {
//           root: {
//             borderRadius: "12px",
//             "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
//             "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#81C784" : "#2E7D32" },
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#66BB6A" : "#2E7D32" },
//             "& .MuiSelect-select": { padding: { xs: "12px", sm: "14px" } },
//           },
//         },
//       },
//       MuiBreadcrumbs: {
//         styleOverrides: {
//           root: {
//             fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
//             "& a": {
//               display: "flex",
//               alignItems: "center",
//               textDecoration: "none",
//               color: darkMode ? "#A5D6A7" : "#2E7D32",
//               "&:hover": { color: darkMode ? "#81C784" : "#81C784", textDecoration: "underline" },
//             },
//           },
//         },
//       },
//     },
//   });

//   const fadeIn = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box
//           component={motion.section}
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           sx={{ maxWidth: 1100, mx: "auto", p: { xs: 3, sm: 5 }, pt: { xs: 12, sm: 14 }, flexGrow: 1 }}
//         >
//           <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
//             <RouterLink to="/">
//               <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Home
//             </RouterLink>
//             <RouterLink to="/cart">
//               <ShoppingCartIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Cart
//             </RouterLink>
//             <Typography sx={{ color: "text.primary" }}>Checkout</Typography>
//           </Breadcrumbs>

//           <Typography
//             variant="h3"
//             sx={{ color: "primary.main", mb: 5, textAlign: "center", fontWeight: 700, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
//           >
//             Finalize Your Purchase
//           </Typography>

//           <Card>
//             <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
//               <form>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     variant="outlined"
//                     required
//                     error={!customerName.trim()}
//                     helperText={!customerName.trim() ? "Name is required" : ""}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Phone Number"
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                     variant="outlined"
//                     required
//                     error={!phone.trim() || !/^\d{10}$/.test(phone)}
//                     helperText={!phone.trim() ? "Phone number is required" : !/^\d{10}$/.test(phone) ? "Enter a valid 10-digit number" : ""}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Pincode"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
//                     variant="outlined"
//                     required
//                     error={!pincode.trim() || !/^\d{6}$/.test(pincode)}
//                     helperText={!pincode.trim() ? "Pincode is required" : !/^\d{6}$/.test(pincode) ? "Enter a valid 6-digit pincode" : ""}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Delivery Address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     variant="outlined"
//                     required
//                     multiline
//                     rows={4}
//                     error={!address.trim()}
//                     helperText={!address.trim() ? "Address is required" : ""}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Crop/Product Purpose"
//                     value={crop}
//                     onChange={(e) => setCrop(e.target.value)}
//                     variant="outlined"
//                     required
//                     error={!crop.trim()}
//                     helperText={!crop.trim() ? "Please specify the crop or purpose" : ""}
//                     InputProps={{ startAdornment: <InputAdornment position="start"><AgricultureIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
//                   />
//                   <FormControl fullWidth required error={!paymentMethod}>
//                     <InputLabel>Payment Method</InputLabel>
//                     <Select
//                       value={paymentMethod}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       label="Payment Method"
//                       startAdornment={<InputAdornment position="start"><PaymentIcon sx={{ color: "primary.main" }} /></InputAdornment>}
//                     >
//                       <MenuItem value="Card">Credit/Debit Card</MenuItem>
//                       <MenuItem value="UPI">UPI</MenuItem>
//                       <MenuItem value="Net Banking">Net Banking</MenuItem>
//                       <MenuItem value="Cash On Delivery">Cash On Delivery</MenuItem>
//                     </Select>
//                     {!paymentMethod && <Typography variant="caption" color="error" sx={{ mt: 1 }}>Please select a payment method</Typography>}
//                   </FormControl>
//                 </Box>

//                 <Divider sx={{ my: 5, bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

//                 <Box sx={{ textAlign: "center" }}>
//                   <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: "text.primary", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
//                     Total: <span style={{ color: darkMode ? "#81C784" : "#2E7D32" }}>₹{totalAmount}</span>
//                   </Typography>
//                   <Tooltip title={cart.length === 0 ? "Your cart is empty" : ""}>
//                     <span>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleOrder}
//                         disabled={loading || cart.length === 0}
//                         sx={{ py: 2, fontSize: "1.2rem", width: { xs: "100%", sm: "70%", md: "50%" }, bgcolor: darkMode ? "#66BB6A" : "#2E7D32", "&:hover": { bgcolor: darkMode ? "#81C784" : "#81C784" } }}
//                       >
//                         {loading ? <CircularProgress size={28} color="inherit" /> : "Confirm Order"}
//                       </Button>
//                     </span>
//                   </Tooltip>
//                 </Box>
//               </form>
//             </CardContent>
//           </Card>
//         </Box>
//         <Footer />
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Checkout;
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
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [crop, setCrop] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
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
        toast.error("Please log in to proceed.", { autoClose: 2000 });
        navigate("/login");
      }
    };

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    if (storedCart.length === 0) {
      toast.warn("Your cart is empty!", { autoClose: 2000 });
      navigate("/cart");
    }
    fetchUserProfile();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
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
    if (!customerName.trim() || !phone.trim() || !pincode.trim() || !address.trim() || !crop.trim() || !paymentMethod) {
      toast.error("Please fill all required fields.", { autoClose: 2000 });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits.", { autoClose: 2000 });
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be 6 digits.", { autoClose: 2000 });
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
        totalWithGST: parseFloat(item.price) * (1 + (parseFloat(item.gst) || 0) / 100) * (parseInt(item.quantity, 10) || 1),
      })),
    };

    try {
      if (paymentMethod === "Cash On Delivery") {
        const response = await axios.post("http://localhost:5000/api/orders/place", orderData, { withCredentials: true });
        if (response.data.success) {
          toast.success("Order placed successfully!", { autoClose: 2000 });
          const savedDataKey = `savedCustomerData_${user.username}`;
          localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
          localStorage.removeItem("cart");
          setCart([]);
          navigate("/order-success");
        } else {
          toast.error(response.data.message || "Order failed. Try again.", { autoClose: 2000 });
        }
      } else if (["UPI", "Net Banking", "Card"].includes(paymentMethod)) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Failed to load payment gateway. Check your connection.", { autoClose: 2000 });
          setLoading(false);
          return;
        }

        const orderResponse = await axios.post(
          "http://localhost:5000/api/orders/create-razorpay-order",
          { amount: totalAmount * 100 },
          { withCredentials: true }
        );
        if (!orderResponse.data.success) {
          throw new Error(orderResponse.data.message || "Failed to create payment order");
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
              if (verifyResponse.data.success) {
                toast.success("Payment successful! Order placed.", { autoClose: 2000 });
                const savedDataKey = `savedCustomerData_${user.username}`;
                localStorage.setItem(savedDataKey, JSON.stringify({ customerName, phone, pincode, address }));
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/order-success");
              } else {
                toast.error(verifyResponse.data.message || "Payment verification failed.", { autoClose: 2000 });
              }
            } catch (error) {
              toast.error("Failed to verify payment. Please try again.", { autoClose: 2000 });
            }
          },
          prefill: { name: customerName, contact: phone },
          theme: { color: "#2E7D32" },
          method: {
            upi: paymentMethod === "UPI",
            netbanking: paymentMethod === "Net Banking",
            card: paymentMethod === "Card",
          },
        };

        const razorpayCheckout = new window.Razorpay(options);
        razorpayCheckout.on("payment.failed", () => {
          toast.error("Payment failed. Please try again.", { autoClose: 2000 });
        });
        razorpayCheckout.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(`Failed to place order: ${error.response?.data?.message || error.message || "Unknown error"}`, { autoClose: 3000 });
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
    typography: { fontFamily: "'Poppins', sans-serif" },
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
            background: "#E8F5E9",
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
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#81C784" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2E7D32" },
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
            "& li": { color: "#2E7D32" },
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />

        {/* Header with Breadcrumbs */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 4, sm: 5 }, bgcolor: "#E8F5E9", textAlign: "center" }}
        >
          <Container maxWidth="lg">
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: { xs: 2, sm: 3 }, justifyContent: "center", display: "flex" }}
            >
              <RouterLink to="/">
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                Home
              </RouterLink>
              <RouterLink to="/cart">
                <ShoppingCartIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                Cart
              </RouterLink>
              <Typography color="text.primary">Checkout</Typography>
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
              Finalize Your Purchase
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
              Complete the details below to place your order.
            </Typography>
          </Container>
        </Box>

        {/* Checkout Form */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 4, sm: 6 }, flexGrow: 1 }}
        >
          <Container maxWidth="md">
            <Card>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ mb: 3, color: "text.primary", fontWeight: 700 }}
                >
                  Order Details
                </Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      variant="outlined"
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!customerName.trim()}
                      helperText={!customerName.trim() ? "Name is required" : ""}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      variant="outlined"
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!phone.trim() || !/^\d{10}$/.test(phone)}
                      helperText={!phone.trim() ? "Phone number is required" : !/^\d{10}$/.test(phone) ? "Enter a valid 10-digit number" : ""}
                    />
                    <TextField
                      fullWidth
                      label="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      variant="outlined"
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!pincode.trim() || !/^\d{6}$/.test(pincode)}
                      helperText={!pincode.trim() ? "Pincode is required" : !/^\d{6}$/.test(pincode) ? "Enter a valid 6-digit pincode" : ""}
                    />
                    <TextField
                      fullWidth
                      label="Delivery Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      variant="outlined"
                      required
                      multiline
                      rows={isMobile ? 2 : 3}
                      size={isMobile ? "small" : "medium"}
                      error={!address.trim()}
                      helperText={!address.trim() ? "Address is required" : ""}
                    />
                    <TextField
                      fullWidth
                      label="Crop/Product Purpose"
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      variant="outlined"
                      required
                      size={isMobile ? "small" : "medium"}
                      error={!crop.trim()}
                      helperText={!crop.trim() ? "Please specify the crop or purpose" : ""}
                    />
                    <FormControl fullWidth required error={!paymentMethod}>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        label="Payment Method"
                        size={isMobile ? "small" : "medium"}
                      >
                        <MenuItem value="Card">Credit/Debit Card</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="Net Banking">Net Banking</MenuItem>
                        <MenuItem value="Cash On Delivery">Cash On Delivery</MenuItem>
                      </Select>
                      {!paymentMethod && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          Please select a payment method
                        </Typography>
                      )}
                    </FormControl>

                    <Divider sx={{ my: 3, bgcolor: "rgba(0, 0, 0, 0.1)" }} />

                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}
                    >
                      Total: ₹{totalAmount}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOrder}
                      disabled={loading || cart.length === 0}
                      fullWidth={isMobile}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm Order"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Box>

        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Box>
    </ThemeProvider>
  );
};

export default Checkout;