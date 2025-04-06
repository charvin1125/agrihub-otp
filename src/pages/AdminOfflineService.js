// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Added for redirect
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Divider,
//   Grid,
//   Paper,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";

// const AdminOfflineService = () => {
//   const navigate = useNavigate(); // Added for navigation
//   const [services, setServices] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [farmAddress, setFarmAddress] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [crop, setCrop] = useState("");
//   const [medicineName, setMedicineName] = useState("");
//   const [problem, setProblem] = useState("");
//   const [expectedDate, setExpectedDate] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
//   const [error, setError] = useState(""); // Added for error feedback

//   const filteredServices = services.filter((s) =>
//     s.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchServices();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]); // Added navigate to dependencies

//   const fetchServices = async () => {
//     setLoading(true);
//     setError(""); // Reset error state
//     try {
//       // Use the public endpoint from Services.js; adjust if admin endpoint differs
//       const res = await axios.get("http://localhost:5000/api/services/list", {
//         withCredentials: true, // Keep this if admin auth is required
//       });
//       console.log("Fetched services:", res.data); // Debug log
//       setServices(res.data || []);
//     } catch (error) {
//       console.error("Error fetching services:", error.response?.data || error.message);
//       setServices([]);
//       setError("Failed to load services. Please ensure you’re logged in as an admin.");
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         navigate("/admin/login"); // Redirect to admin login on auth failure
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCustomerDetails = async (phoneNumber) => {
//     if (!/^\d{10}$/.test(phoneNumber)) return;
//     setIsFetchingCustomer(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/bookings/customer/${phoneNumber}`, { withCredentials: true });
//       const bookings = res.data.bookings;
//       if (bookings && bookings.length > 0) {
//         const latestBooking = bookings[0];
//         setCustomerName(latestBooking.customerName || "");
//         setFarmAddress(latestBooking.farmAddress || "");
//         setPincode(latestBooking.pincode || "");
//         setCrop(latestBooking.crop || "");
//         setMedicineName(latestBooking.medicineName || "");
//         setProblem(latestBooking.problem || "");
//         setExpectedDate(latestBooking.expectedDate ? new Date(latestBooking.expectedDate).toISOString().split("T")[0] : "");
//         setRemarks(latestBooking.remarks || "");
//       }
//     } catch (error) {
//       console.error("Error fetching customer details:", error.response?.data || error.message);
//       if (error.response?.status === 404) {
//         setCustomerName("");
//         setFarmAddress("");
//         setPincode("");
//         setCrop("");
//         setMedicineName("");
//         setProblem("");
//         setExpectedDate("");
//         setRemarks("");
//       }
//     } finally {
//       setIsFetchingCustomer(false);
//     }
//   };

//   useEffect(() => {
//     if (phone.length === 10) {
//       fetchCustomerDetails(phone);
//     } else {
//       setCustomerName("");
//       setFarmAddress("");
//       setPincode("");
//       setCrop("");
//       setMedicineName("");
//       setProblem("");
//       setExpectedDate("");
//       setRemarks("");
//     }
//   }, [phone]);

//   useEffect(() => {
//     const total = selectedServices.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
//     setTotalAmount(total.toFixed(2));
//   }, [selectedServices]);

//   const handleServiceSelect = (service, areaInSqFt) => {
//     if (!areaInSqFt || isNaN(areaInSqFt) || areaInSqFt <= 0) return;

//     const totalPrice = (parseFloat(areaInSqFt) / 100) * service.pricePer100SqFt;

//     setSelectedServices((prevServices) => {
//       const existingIndex = prevServices.findIndex((s) => s.serviceId === service._id);
//       if (existingIndex !== -1) {
//         const updatedServices = [...prevServices];
//         updatedServices[existingIndex].areaInSqFt = areaInSqFt;
//         updatedServices[existingIndex].totalPrice = totalPrice;
//         return updatedServices;
//       } else {
//         return [
//           ...prevServices,
//           {
//             serviceId: service._id,
//             name: service.name || "Unknown Service",
//             pricePer100SqFt: service.pricePer100SqFt || 0,
//             areaInSqFt,
//             totalPrice,
//           },
//         ];
//       }
//     });
//   };

//   const handleRemoveService = (serviceId) => {
//     setSelectedServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
//   };

//   const handleBookService = async () => {
//     if (
//       !customerName ||
//       !phone ||
//       !farmAddress ||
//       !pincode ||
//       !crop ||
//       !medicineName ||
//       !problem ||
//       !expectedDate ||
//       selectedServices.length === 0
//     ) {
//       alert("Please fill all required fields and select at least one service.");
//       return;
//     }

//     try {
//       const bookingPromises = selectedServices.map(async (item) => {
//         const bookingData = {
//           userId: "admin-offline", // Replace with actual admin ID if available
//           serviceId: item.serviceId,
//           serviceName: item.name,
//           customerName,
//           contactNumber: phone,
//           crop,
//           medicineName,
//           areaInSqFt: item.areaInSqFt,
//           farmAddress,
//           pincode,
//           problem,
//           expectedDate,
//           remarks,
//           totalPrice: item.totalPrice,
//         };

//         return axios.post("http://localhost:5000/api/book-service", bookingData, { withCredentials: true });
//       });

//       const responses = await Promise.all(bookingPromises);
//       const allSuccessful = responses.every((res) => res.data.bookingId);

//       if (allSuccessful) {
//         alert("Services booked successfully!");
//         setSelectedServices([]);
//         setTotalAmount(0);
//         setCustomerName("");
//         setPhone("");
//         setFarmAddress("");
//         setPincode("");
//         setCrop("");
//         setMedicineName("");
//         setProblem("");
//         setExpectedDate("");
//         setRemarks("");
//         setPaymentMethod("Cash");
//         navigate("/admin/dashboard"); // Redirect to admin dashboard
//       } else {
//         alert("Some bookings failed. Check console for details.");
//         console.log("Failed responses:", responses.filter((res) => !res.data.bookingId));
//       }
//     } catch (error) {
//       console.error("Error booking offline services:", error.response?.data || error.message);
//       alert("Failed to book services. Check console for details.");
//     }
//   };

//   const handlePreview = () => setPreviewOpen(true);

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
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
//             color: "#fff",
//             fontWeight: "bold",
//           },
//           body: { padding: { xs: "8px", sm: "12px" } },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
//         },
//       },
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
//       MuiSelect: {
//         styleOverrides: {
//           root: {
//             bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
//             borderRadius: "8px",
//           },
//         },
//       },
//     },
//   });

//   const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress size={60} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         <Sidebar
//           darkMode={darkMode}
//           toggleDarkMode={toggleDarkMode}
//           isMobile={isMobile}
//           open={sidebarOpen}
//           setOpen={setSidebarOpen}
//         />
//         <Box
//           component={motion.section}
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 4 },
//             bgcolor: "background.default",
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
//               Offline Service Booking
//             </Typography>
//           </Box>

//           {/* Error Message */}
//           {error && (
//             <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: "center" }}>
//               {error}
//             </Typography>
//           )}

//           {/* Customer Details */}
//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Customer Details
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                     disabled={isFetchingCustomer}
//                     InputProps={{
//                       endAdornment: isFetchingCustomer ? <CircularProgress size={20} /> : null,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Customer Name"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Farm Address"
//                     value={farmAddress}
//                     onChange={(e) => setFarmAddress(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Pincode"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Crop"
//                     value={crop}
//                     onChange={(e) => setCrop(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Medicine Name"
//                     value={medicineName}
//                     onChange={(e) => setMedicineName(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Problem"
//                     value={problem}
//                     onChange={(e) => setProblem(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Expected Date"
//                     type="date"
//                     value={expectedDate}
//                     onChange={(e) => setExpectedDate(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     InputLabelProps={{ shrink: true }}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Remarks"
//                     value={remarks}
//                     onChange={(e) => setRemarks(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControl fullWidth>
//                     <InputLabel>Payment Method</InputLabel>
//                     <Select
//                       value={paymentMethod}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       label="Payment Method"
//                       size={isMobile ? "small" : "medium"}
//                     >
//                       <MenuItem value="Cash">Cash</MenuItem>
//                       <MenuItem value="Card">Card</MenuItem>
//                       <MenuItem value="Pay Later">Pay Later</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           {/* Service Selection */}
//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Service Selection
//               </Typography>
//               <TextField
//                 label="Search Services"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 variant="outlined"
//                 sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
//                 size={isMobile ? "small" : "medium"}
//               />
//               {services.length === 0 ? (
//                 <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
//                   No services available.
//                 </Typography>
//               ) : (
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="service selection table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell align="right">Price (per 100 Sq Ft)</TableCell>
//                         <TableCell align="right">Area (Sq Ft)</TableCell>
//                         <TableCell align="right">Total Price</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredServices.map((service) => {
//                         const existingItem = selectedServices.find((s) => s.serviceId === service._id);
//                         return (
//                           <TableRow key={service._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                             <TableCell sx={{ color: "text.primary" }}>{service.name || "N/A"}</TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary" }}>
//                               ₹{(service.pricePer100SqFt || 0).toFixed(2)}
//                             </TableCell>
//                             <TableCell align="right">
//                               <TextField
//                                 type="number"
//                                 inputProps={{ min: 1 }}
//                                 value={existingItem ? existingItem.areaInSqFt : ""}
//                                 onChange={(e) => handleServiceSelect(service, parseInt(e.target.value, 10))}
//                                 variant="outlined"
//                                 size={isMobile ? "small" : "medium"}
//                                 sx={{ width: isMobile ? "80px" : "100px" }}
//                               />
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary" }}>
//                               ₹{(existingItem ? existingItem.totalPrice : 0).toFixed(2)}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </CardContent>
//           </Card>

//           {/* Selected Services and Total */}
//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Selected Services
//               </Typography>
//               {selectedServices.length > 0 ? (
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="selected services table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell align="right">Price (per 100 Sq Ft)</TableCell>
//                         <TableCell align="right">Area (Sq Ft)</TableCell>
//                         <TableCell align="right">Total Price</TableCell>
//                         <TableCell align="right">Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedServices.map((item) => (
//                         <TableRow key={item.serviceId} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                           <TableCell sx={{ color: "text.primary" }}>{item.name || "N/A"}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>
//                             ₹{(item.pricePer100SqFt || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>{item.areaInSqFt || 0}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>
//                             ₹{(item.totalPrice || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell align="right">
//                             <IconButton
//                               color="secondary"
//                               onClick={() => handleRemoveService(item.serviceId)}
//                               sx={{ color: darkMode ? "#E57373" : "#D32F2F" }}
//                             >
//                               <RemoveIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ) : (
//                 <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
//                   No services selected yet.
//                 </Typography>
//               )}
//               <Divider sx={{ my: 2, bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   flexDirection: { xs: "column", sm: "row" },
//                   gap: 2,
//                 }}
//               >
//                 <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", color: "primary.main" }}>
//                   Total Amount: ₹{totalAmount}
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<AddIcon />}
//                     onClick={handleBookService}
//                     disabled={selectedServices.length === 0}
//                     sx={{ py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Book Services
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={handlePreview}
//                     disabled={selectedServices.length === 0}
//                     sx={{ py: 1, borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Preview Booking
//                   </Button>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>

//           {/* Booking Preview Dialog */}
//           <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#fff" } }}>
//             <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>Booking Preview</DialogTitle>
//             <DialogContent sx={{ pt: 2 }}>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Name:</strong> {customerName}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Phone:</strong> {phone}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Farm Address:</strong> {farmAddress}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Pincode:</strong> {pincode}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Crop:</strong> {crop}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Medicine Name:</strong> {medicineName}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Problem:</strong> {problem}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Expected Date:</strong> {expectedDate ? new Date(expectedDate).toLocaleDateString() : "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Remarks:</strong> {remarks || "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Payment Method:</strong> {paymentMethod}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}><strong>Total:</strong> ₹{totalAmount}</Typography>
//               {selectedServices.map((item) => (
//                 <Typography key={item.serviceId} variant="body2" sx={{ color: "text.primary" }}>
//                   {item.name || "N/A"} - {item.areaInSqFt || 0} Sq Ft: ₹{(item.totalPrice || 0).toFixed(2)}
//                 </Typography>
//               ))}
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 onClick={() => setPreviewOpen(false)}
//                 color="primary"
//                 variant="outlined"
//                 sx={{ borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" } }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AdminOfflineService;
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminOfflineService = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [crop, setCrop] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [problem, setProblem] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
  const [error, setError] = useState("");

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchServices();

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

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/services/list", { withCredentials: true });
      setServices(res.data || []);
    } catch (error) {
      console.error("Error fetching services:", error.response?.data || error.message);
      setServices([]);
      setError("Failed to load services. Please ensure you’re logged in as an admin.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (phoneNumber) => {
    if (!/^\d{10}$/.test(phoneNumber)) return;
    setIsFetchingCustomer(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/customer/${phoneNumber}`, { withCredentials: true });
      const bookings = res.data.bookings;
      if (bookings && bookings.length > 0) {
        const latestBooking = bookings[0];
        setCustomerName(latestBooking.customerName || "");
        setFarmAddress(latestBooking.farmAddress || "");
        setPincode(latestBooking.pincode || "");
        setCrop(latestBooking.crop || "");
        setMedicineName(latestBooking.medicineName || "");
        setProblem(latestBooking.problem || "");
        setExpectedDate(latestBooking.expectedDate ? new Date(latestBooking.expectedDate).toISOString().split("T")[0] : "");
        setRemarks(latestBooking.remarks || "");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        setCustomerName("");
        setFarmAddress("");
        setPincode("");
        setCrop("");
        setMedicineName("");
        setProblem("");
        setExpectedDate("");
        setRemarks("");
      }
    } finally {
      setIsFetchingCustomer(false);
    }
  };

  useEffect(() => {
    if (phone.length === 10) {
      fetchCustomerDetails(phone);
    } else {
      setCustomerName("");
      setFarmAddress("");
      setPincode("");
      setCrop("");
      setMedicineName("");
      setProblem("");
      setExpectedDate("");
      setRemarks("");
    }
  }, [phone]);

  useEffect(() => {
    const total = selectedServices.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setTotalAmount(total.toFixed(2));
  }, [selectedServices]);

  const handleAddService = (service) => {
    const initialArea = 100; // Default area in Sq Ft
    const totalPrice = (initialArea / 100) * service.pricePer100SqFt;

    setSelectedServices((prevServices) => {
      const existingIndex = prevServices.findIndex((s) => s.serviceId === service._id);
      if (existingIndex !== -1) {
        const updatedServices = [...prevServices];
        updatedServices[existingIndex].areaInSqFt += 100;
        updatedServices[existingIndex].totalPrice = (updatedServices[existingIndex].areaInSqFt / 100) * service.pricePer100SqFt;
        return updatedServices;
      } else {
        return [
          ...prevServices,
          {
            serviceId: service._id,
            name: service.name || "Unknown Service",
            pricePer100SqFt: service.pricePer100SqFt || 0,
            areaInSqFt: initialArea,
            totalPrice,
          },
        ];
      }
    });
  };

  const handleAreaChange = (serviceId, increment) => {
    setSelectedServices((prev) =>
      prev.map((item) => {
        if (item.serviceId === serviceId) {
          const newArea = Math.max(0, item.areaInSqFt + (increment * 100));
          const newTotalPrice = (newArea / 100) * item.pricePer100SqFt;
          return { ...item, areaInSqFt: newArea, totalPrice: newTotalPrice };
        }
        return item;
      }).filter((item) => item.areaInSqFt > 0)
    );
  };

  const handleBookService = async () => {
    if (
      !customerName ||
      !phone ||
      !farmAddress ||
      !pincode ||
      !crop ||
      !medicineName ||
      !problem ||
      !expectedDate ||
      selectedServices.length === 0
    ) {
      alert("Please fill all required fields and select at least one service.");
      return;
    }

    try {
      const bookingPromises = selectedServices.map(async (item) => {
        const bookingData = {
          userId: "admin-offline",
          serviceId: item.serviceId,
          serviceName: item.name,
          customerName,
          contactNumber: phone,
          crop,
          medicineName,
          areaInSqFt: item.areaInSqFt,
          farmAddress,
          pincode,
          problem,
          expectedDate,
          remarks,
          totalPrice: item.totalPrice,
          paymentMethod,
        };

        return axios.post("http://localhost:5000/api/book-service", bookingData, { withCredentials: true });
      });

      const responses = await Promise.all(bookingPromises);
      const allSuccessful = responses.every((res) => res.data.bookingId);

      if (allSuccessful) {
        alert("Services booked successfully!");
        setSelectedServices([]);
        setTotalAmount(0);
        setCustomerName("");
        setPhone("");
        setFarmAddress("");
        setPincode("");
        setCrop("");
        setMedicineName("");
        setProblem("");
        setExpectedDate("");
        setRemarks("");
        setPaymentMethod("Cash");
        navigate("/admin/dashboard");
      } else {
        alert("Some bookings failed. Check console for details.");
        console.log("Failed responses:", responses.filter((res) => !res.data.bookingId));
      }
    } catch (error) {
      console.error("Error booking offline services:", error.response?.data || error.message);
      alert("Failed to book services. Check console for details.");
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Offline Service Booking Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [["Customer Details"]],
      body: [
        [`Name: ${customerName}`],
        [`Phone: ${phone}`],
        [`Farm Address: ${farmAddress}`],
        [`Pincode: ${pincode}`],
        [`Crop: ${crop}`],
        [`Medicine Name: ${medicineName}`],
        [`Problem: ${problem}`],
        [`Expected Date: ${expectedDate ? new Date(expectedDate).toLocaleDateString() : "N/A"}`],
        [`Remarks: ${remarks || "N/A"}`],
        [`Payment Method: ${paymentMethod}`],
        [`Total Amount: ₹${totalAmount}`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Name", "Price (per 100 Sq Ft)", "Area (Sq Ft)", "Total Price"]],
      body: selectedServices.map((item) => [
        item.name,
        `₹${item.pricePer100SqFt.toFixed(2)}`,
        item.areaInSqFt,
        `₹${item.totalPrice.toFixed(2)}`,
      ]),
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save("offline_service_booking_report.pdf");
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Price (per 100 Sq Ft)", "Area (Sq Ft)", "Total Price"];
    const csvRows = [
      headers.join(","),
      ...selectedServices.map((item) =>
        [`"${item.name}"`, item.pricePer100SqFt, item.areaInSqFt, item.totalPrice].join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "offline_service_bookings.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
      text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: darkMode ? "0 10px 30px rgba(255,255,255,0.05)" : "0 10px 30px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: darkMode ? "0 14px 40px rgba(255,255,255,0.15)" : "0 14px 40px rgba(0,0,0,0.12)",
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
            padding: "14px",
            borderBottom: `2px solid ${darkMode ? "#A5D6A7" : "#4CAF50"}`,
            letterSpacing: "0.5px",
          },
          body: {
            padding: { xs: "12px", sm: "16px" },
            borderBottom: `1px solid ${darkMode ? "#424242" : "#E0E0E0"}`,
            fontSize: "0.9rem",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            padding: "10px 20px",
            "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
            transition: "all 0.3s ease",
            fontWeight: "medium",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#A5D6A7" : "#81C784",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#81C784" : "#4CAF50",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#66BB6A" : "#388E3C",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: { transition: "color 0.3s ease" },
          h4: { fontWeight: 700, letterSpacing: "0.5px" },
          h5: { fontWeight: 700, letterSpacing: "0.5px" },
        },
      },
    },
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

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
          {/* Header with Breadcrumbs */}
          <Box sx={{ mb: { xs: 3, sm: 5 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 2,
              }}
            >
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "#212121" }}>
                Offline Service Booking
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportCSV}
                  startIcon={<DownloadIcon />}
                  disabled={selectedServices.length === 0}
                  sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateReport}
                  startIcon={<PictureAsPdfIcon />}
                  disabled={selectedServices.length === 0}
                  sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
                >
                  Generate Report
                </Button>
              </Box>
            </Box>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: "#4CAF50" }}>
              <Link
                to="/admin-dashboard"
                style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Dashboard
              </Link>
              <Typography color="#4CAF50" sx={{ display: "flex", alignItems: "center" }}>
                <BuildIcon sx={{ mr: 0.5 }} fontSize="small" />
                Offline Service Booking
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Error Message */}
          {error && (
            <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {/* Customer Details */}
          <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                Customer Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                    disabled={isFetchingCustomer}
                    InputProps={{
                      endAdornment: isFetchingCustomer ? <CircularProgress size={20} /> : null,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Farm Address"
                    value={farmAddress}
                    onChange={(e) => setFarmAddress(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Crop"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Medicine Name"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Problem"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Expected Date"
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      label="Payment Method"
                      size={isMobile ? "small" : "medium"}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Pay Later">Pay Later</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Selected Services */}
          <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                Selected Services
              </Typography>
              {selectedServices.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="selected services table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price (per 100 Sq Ft)</TableCell>
                        <TableCell align="right">Area (Sq Ft)</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedServices.map((item) => (
                        <TableRow key={item.serviceId} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                          <TableCell sx={{ color: "text.primary" }}>{item.name || "N/A"}</TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{(item.pricePer100SqFt || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                              <IconButton
                                onClick={() => handleAreaChange(item.serviceId, -1)}
                                disabled={item.areaInSqFt <= 100}
                                sx={{ color: darkMode ? "#A5D6A7" : "#4CAF50" }}
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                              <Typography sx={{ mx: 1, color: "text.primary" }}>{item.areaInSqFt}</Typography>
                              <IconButton
                                onClick={() => handleAreaChange(item.serviceId, 1)}
                                sx={{ color: darkMode ? "#A5D6A7" : "#4CAF50" }}
                              >
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{(item.totalPrice || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => handleAreaChange(item.serviceId, -Math.ceil(item.areaInSqFt / 100))}
                              sx={{ color: darkMode ? "#EF5350" : "#D32F2F" }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                  No services selected yet.
                </Typography>
              )}
              <Divider sx={{ my: 2, bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Total Amount: ₹{totalAmount}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleBookService}
                    disabled={selectedServices.length === 0}
                    sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
                  >
                    Book Services
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setPreviewOpen(true)}
                    disabled={selectedServices.length === 0}
                    sx={{ borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
                  >
                    Preview Booking
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                Service Selection
              </Typography>
              <TextField
                label="Search Services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
                size={isMobile ? "small" : "medium"}
              />
              {services.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                  No services available.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="service selection table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price (per 100 Sq Ft)</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                          <TableCell sx={{ color: "text.primary" }}>{service.name || "N/A"}</TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{(service.pricePer100SqFt || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<AddIcon />}
                              onClick={() => handleAddService(service)}
                              size={isMobile ? "small" : "medium"}
                              sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Booking Preview Dialog */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>Booking Preview</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Name:</strong> {customerName}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Phone:</strong> {phone}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Farm Address:</strong> {farmAddress}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Pincode:</strong> {pincode}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Crop:</strong> {crop}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Medicine Name:</strong> {medicineName}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Problem:</strong> {problem}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Expected Date:</strong> {expectedDate ? new Date(expectedDate).toLocaleDateString() : "N/A"}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Remarks:</strong> {remarks || "N/A"}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Payment Method:</strong> {paymentMethod}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}><strong>Total:</strong> ₹{totalAmount}</Typography>
              {selectedServices.map((item) => (
                <Typography key={item.serviceId} variant="body2" sx={{ color: "text.primary" }}>
                  {item.name || "N/A"} - {item.areaInSqFt || 0} Sq Ft: ₹{(item.totalPrice || 0).toFixed(2)}
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setPreviewOpen(false)}
                color="primary"
                variant="outlined"
                sx={{ borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" } }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminOfflineService;