// import React, { useState, useEffect } from "react";
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
//   Chip,
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
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import RemoveIcon from "@mui/icons-material/Remove";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";

// const AdminOfflinePurchase = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [referenceName, setReferenceName] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [crop, setCrop] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [selectedBatchIds, setSelectedBatchIds] = useState({});
//   const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

//   const filteredProducts = products.filter((p) =>
//     p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchProducts();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       const fetchedProducts = res.data || [];
//       setProducts(fetchedProducts);

//       const initialBatchIds = {};
//       fetchedProducts.forEach((product) => {
//         (product.variants || []).forEach((variant) => {
//           const sortedBatches = getSortedBatches(variant);
//           if (sortedBatches.length > 0) {
//             initialBatchIds[variant._id] = sortedBatches[0]._id;
//           }
//         });
//       });
//       setSelectedBatchIds(initialBatchIds);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Updated fetchCustomerDetails to match the backend response structure
//   const fetchCustomerDetails = async (phoneNumber) => {
//     if (!/^\d{10}$/.test(phoneNumber)) return;
//     setIsFetchingCustomer(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/orders/customer/${phoneNumber}`, { withCredentials: true });
//       console.log("API Response:", res.data); // Debug log
//       const orders = res.data.orders; // Access the 'orders' array
//       if (orders && orders.length > 0) {
//         const latestOrder = orders[0]; // Take the first order (assuming sorted by createdAt descending)
//         setCustomerName(latestOrder.name || "");
//         setAddress(latestOrder.address || "");
//         setPincode(latestOrder.pincode || "");
//         setReferenceName(latestOrder.referenceName || "");
//         setCrop(latestOrder.crop || "");
//         setRemarks(latestOrder.remarks || "");
//         console.log("Setting customer data:", { // Debug log
//           customerName: latestOrder.name,
//           address: latestOrder.address,
//           pincode: latestOrder.pincode,
//           referenceName: latestOrder.referenceName,
//           crop: latestOrder.crop,
//           remarks: latestOrder.remarks,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching customer details:", error.response?.data || error.message);
//       if (error.response?.status === 404) {
//         setCustomerName("");
//         setAddress("");
//         setPincode("");
//         setReferenceName("");
//         setCrop("");
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
//       setAddress("");
//       setPincode("");
//       setReferenceName("");
//       setCrop("");
//       setRemarks("");
//     }
//   }, [phone]);

//   useEffect(() => {
//     const total = selectedProducts.reduce((sum, item) => sum + (item.totalWithGST || 0), 0);
//     setTotalAmount(total.toFixed(2));
//   }, [selectedProducts]);

//   const getSortedBatches = (variant) => {
//     return (variant.batches || [])
//       .filter((batch) => batch.stock > 0)
//       .sort((a, b) => a.batchNumber.localeCompare(b.batchNumber));
//   };

//   const handleProductSelect = (product, variant, batchId, quantity) => {
//     const batch = variant.batches.find((b) => b._id === batchId);
//     if (!batch || quantity <= 0 || isNaN(quantity) || quantity > batch.stock) return;

//     const gstRate = batch.gst / 100;
//     const priceWithGST = batch.sellingPrice * (1 + gstRate) * quantity;

//     setSelectedProducts((prevProducts) => {
//       const existingIndex = prevProducts.findIndex((p) => p.batchId === batch._id);
//       if (existingIndex !== -1) {
//         const updatedProducts = [...prevProducts];
//         updatedProducts[existingIndex].quantity = quantity;
//         updatedProducts[existingIndex].totalWithGST = priceWithGST;
//         return updatedProducts;
//       } else {
//         return [
//           ...prevProducts,
//           {
//             productId: product._id,
//             variantId: variant._id,
//             batchId: batch._id,
//             name: product.name || "Unknown Product",
//             size: variant.size || "N/A",
//             batchNumber: batch.batchNumber || "N/A",
//             price: batch.sellingPrice || 0,
//             gst: batch.gst || 0,
//             stock: batch.stock || 0,
//             quantity,
//             totalWithGST: priceWithGST,
//           },
//         ];
//       }
//     });
//   };

//   const handleBatchChange = (variantId, batchId) => {
//     setSelectedBatchIds((prev) => ({
//       ...prev,
//       [variantId]: batchId,
//     }));
//     const existingItem = selectedProducts.find((p) => p.variantId === variantId);
//     if (existingItem) {
//       const product = products.find((p) => p._id === existingItem.productId);
//       const variant = product.variants.find((v) => v._id === variantId);
//       handleProductSelect(product, variant, batchId, existingItem.quantity);
//     }
//   };

//   const handleRemoveProduct = (batchId) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.batchId !== batchId));
//   };

//   const handlePurchase = async () => {
//     if (!customerName || !phone || !address || !pincode || !crop || selectedProducts.length === 0) {
//       alert("Please fill all required fields and select at least one product.");
//       return;
//     }

//     const orderData = {
//       name: customerName,
//       phone,
//       address,
//       pincode,
//       referenceName,
//       remarks,
//       crop,
//       paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart: selectedProducts.map((item) => ({
//         productId: item.productId,
//         variantId: item.variantId,
//         batchId: item.batchId,
//         name: item.name,
//         size: item.size,
//         price: item.price,
//         quantity: item.quantity,
//         gst: item.gst,
//         totalWithGST: item.totalWithGST,
//       })),
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/orders/offline",
//         orderData,
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         alert("Purchase successful!");
//         setSelectedProducts([]);
//         setTotalAmount(0);
//         setCustomerName("");
//         setPhone("");
//         setAddress("");
//         setPincode("");
//         setReferenceName("");
//         setRemarks("");
//         setCrop("");
//         setPaymentMethod("Cash");
//         fetchProducts();
//       } else {
//         alert(response.data.message || "Purchase failed. Try again.");
//       }
//     } catch (error) {
//       console.error("Error placing offline order:", error.response?.data || error.message);
//       alert("Failed to place order. Check console for details.");
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
//               Offline Purchase
//             </Typography>
//           </Box>

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
//                     label="Address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
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
//                     onChange={(e) => setPincode(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Reference Name"
//                     value={referenceName}
//                     onChange={(e) => setReferenceName(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
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

//           {/* Product Selection */}
//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Product Selection
//               </Typography>
//               <TextField
//                 label="Search Products"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 variant="outlined"
//                 sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
//                 size={isMobile ? "small" : "medium"}
//               />
//               <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="product selection table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Size</TableCell>
//                       <TableCell align="right">Batch</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>GST (%)</TableCell>
//                       <TableCell align="right">Stock</TableCell>
//                       <TableCell align="right">Quantity</TableCell>
//                       <TableCell align="right">Total (with GST)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredProducts.map((product) =>
//                       (product.variants || []).map((variant) => {
//                         const sortedBatches = getSortedBatches(variant);
//                         if (sortedBatches.length === 0) return null;

//                         const selectedBatchId = selectedBatchIds[variant._id] || sortedBatches[0]._id;
//                         const selectedBatch = sortedBatches.find((b) => b._id === selectedBatchId) || sortedBatches[0];
//                         const existingItem = selectedProducts.find((p) => p.batchId === selectedBatch._id);

//                         return (
//                           <TableRow key={`${variant._id}-${selectedBatch._id}`} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                             <TableCell sx={{ color: "text.primary" }}>{product.name || "N/A"}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
//                             <TableCell align="right">
//                               <FormControl fullWidth>
//                                 <InputLabel>Batch</InputLabel>
//                                 <Select
//                                   value={selectedBatchId}
//                                   onChange={(e) => handleBatchChange(variant._id, e.target.value)}
//                                   label="Batch"
//                                   size={isMobile ? "small" : "medium"}
//                                   sx={{ minWidth: { xs: "100px", sm: "150px" } }}
//                                 >
//                                   {sortedBatches.map((batch) => (
//                                     <MenuItem key={batch._id} value={batch._id}>
//                                       {batch.batchNumber} (Stock: {batch.stock})
//                                     </MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                               ₹{(selectedBatch.sellingPrice || 0).toFixed(2)}
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
//                               {selectedBatch.gst || 0}
//                             </TableCell>
//                             <TableCell align="right">
//                               <Chip
//                                 label={`${selectedBatch.stock || 0}`}
//                                 color={selectedBatch.stock <= 5 ? "error" : "success"}
//                                 size={isMobile ? "small" : "medium"}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <TextField
//                                 type="number"
//                                 inputProps={{ min: 1, max: selectedBatch.stock || 0 }}
//                                 value={existingItem ? existingItem.quantity : ""}
//                                 onChange={(e) => handleProductSelect(product, variant, selectedBatchId, parseInt(e.target.value, 10))}
//                                 disabled={selectedBatch.stock === 0}
//                                 variant="outlined"
//                                 size={isMobile ? "small" : "medium"}
//                                 sx={{ width: isMobile ? "60px" : "80px" }}
//                               />
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary" }}>
//                               ₹{(existingItem ? existingItem.totalWithGST : 0).toFixed(2)}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>

//           {/* Selected Products and Total */}
//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Selected Products
//               </Typography>
//               {selectedProducts.length > 0 ? (
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="selected products table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell>Size</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Batch</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
//                         <TableCell align="right">Quantity</TableCell>
//                         <TableCell align="right">Total (with GST)</TableCell>
//                         <TableCell align="right">Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedProducts.map((item) => (
//                         <TableRow key={item.batchId} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                           <TableCell sx={{ color: "text.primary" }}>{item.name || "N/A"}</TableCell>
//                           <TableCell sx={{ color: "text.primary" }}>{item.size || "N/A"}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             {item.batchNumber || "N/A"}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             ₹{(item.price || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>{item.quantity || 0}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>₹{(item.totalWithGST || 0).toFixed(2)}</TableCell>
//                           <TableCell align="right">
//                             <IconButton
//                               color="secondary"
//                               onClick={() => handleRemoveProduct(item.batchId)}
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
//                   No products selected yet.
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
//                     startIcon={<AddShoppingCartIcon />}
//                     onClick={handlePurchase}
//                     disabled={selectedProducts.length === 0}
//                     sx={{ py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Complete Purchase
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={handlePreview}
//                     disabled={selectedProducts.length === 0}
//                     sx={{ py: 1, borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Preview Receipt
//                   </Button>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>

//           {/* Receipt Preview Dialog */}
//           <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#fff" } }}>
//             <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>Receipt Preview</DialogTitle>
//             <DialogContent sx={{ pt: 2 }}>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Name:</strong> {customerName}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Phone:</strong> {phone}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Address:</strong> {address}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Pincode:</strong> {pincode}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Reference Name:</strong> {referenceName || "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Remarks:</strong> {remarks || "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Crop:</strong> {crop}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Payment Method:</strong> {paymentMethod}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}><strong>Total:</strong> ₹{totalAmount}</Typography>
//               {selectedProducts.map((item) => (
//                 <Typography key={item.batchId} variant="body2" sx={{ color: "text.primary" }}>
//                   {item.name || "N/A"} ({item.size || "N/A"}, Batch: {item.batchNumber || "N/A"}) - {item.quantity || 0} pcs: ₹{(item.totalWithGST || 0).toFixed(2)}
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

// export default AdminOfflinePurchase;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
//   Chip,
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
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import RemoveIcon from "@mui/icons-material/Remove";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";

// const AdminOfflinePurchase = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [referenceName, setReferenceName] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [crop, setCrop] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [selectedBatchIds, setSelectedBatchIds] = useState({});
//   const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

//   const filteredProducts = products.filter((p) =>
//     p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     fetchProducts();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       const fetchedProducts = res.data || [];
//       setProducts(fetchedProducts);

//       const initialBatchIds = {};
//       fetchedProducts.forEach((product) => {
//         (product.variants || []).forEach((variant) => {
//           const sortedBatches = getSortedBatches(variant);
//           if (sortedBatches.length > 0) {
//             initialBatchIds[variant._id] = sortedBatches[0]._id;
//           }
//         });
//       });
//       setSelectedBatchIds(initialBatchIds);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCustomerDetails = async (phoneNumber) => {
//     if (!/^\d{10}$/.test(phoneNumber)) return;
//     setIsFetchingCustomer(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/orders/customer/${phoneNumber}`, { withCredentials: true });
//       const orders = res.data.orders;
//       if (orders && orders.length > 0) {
//         const latestOrder = orders[0];
//         setCustomerName(latestOrder.name || "");
//         setAddress(latestOrder.address || "");
//         setPincode(latestOrder.pincode || "");
//         setReferenceName(latestOrder.referenceName || "");
//         setCrop(latestOrder.crop || "");
//         setRemarks(latestOrder.remarks || "");
//       }
//     } catch (error) {
//       console.error("Error fetching customer details:", error.response?.data || error.message);
//       if (error.response?.status === 404) {
//         setCustomerName("");
//         setAddress("");
//         setPincode("");
//         setReferenceName("");
//         setCrop("");
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
//       setAddress("");
//       setPincode("");
//       setReferenceName("");
//       setCrop("");
//       setRemarks("");
//     }
//   }, [phone]);

//   useEffect(() => {
//     const total = selectedProducts.reduce((sum, item) => sum + (item.totalWithGST || 0), 0);
//     setTotalAmount(total.toFixed(2));
//   }, [selectedProducts]);

//   const getSortedBatches = (variant) => {
//     return (variant.batches || [])
//       .filter((batch) => batch.stock > 0)
//       .sort((a, b) => a.batchNumber.localeCompare(b.batchNumber));
//   };

//   const handleProductSelect = (product, variant, batchId, quantity) => {
//     const batch = variant.batches.find((b) => b._id === batchId);
//     if (!batch || quantity <= 0 || isNaN(quantity) || quantity > batch.stock) return;

//     const gstRate = batch.gst / 100;
//     const priceWithGST = batch.sellingPrice * (1 + gstRate) * quantity;

//     setSelectedProducts((prevProducts) => {
//       const existingIndex = prevProducts.findIndex((p) => p.batchId === batch._id);
//       if (existingIndex !== -1) {
//         const updatedProducts = [...prevProducts];
//         updatedProducts[existingIndex].quantity = quantity;
//         updatedProducts[existingIndex].totalWithGST = priceWithGST;
//         return updatedProducts;
//       } else {
//         return [
//           ...prevProducts,
//           {
//             productId: product._id,
//             variantId: variant._id,
//             batchId: batch._id,
//             name: product.name || "Unknown Product",
//             size: variant.size || "N/A",
//             batchNumber: batch.batchNumber || "N/A",
//             price: batch.sellingPrice || 0,
//             gst: batch.gst || 0,
//             stock: batch.stock || 0,
//             quantity,
//             totalWithGST: priceWithGST,
//           },
//         ];
//       }
//     });
//   };

//   const handleBatchChange = (variantId, batchId) => {
//     setSelectedBatchIds((prev) => ({
//       ...prev,
//       [variantId]: batchId,
//     }));
//     const existingItem = selectedProducts.find((p) => p.variantId === variantId);
//     if (existingItem) {
//       const product = products.find((p) => p._id === existingItem.productId);
//       const variant = product.variants.find((v) => v._id === variantId);
//       handleProductSelect(product, variant, batchId, existingItem.quantity);
//     }
//   };

//   const handleRemoveProduct = (batchId) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.batchId !== batchId));
//   };

//   const handlePurchase = async () => {
//     if (!customerName || !phone || !address || !pincode || !crop || selectedProducts.length === 0) {
//       alert("Please fill all required fields and select at least one product.");
//       return;
//     }

//     const orderData = {
//       name: customerName,
//       phone,
//       address,
//       pincode,
//       referenceName,
//       remarks,
//       crop,
//       paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart: selectedProducts.map((item) => ({
//         productId: item.productId,
//         variantId: item.variantId,
//         batchId: item.batchId,
//         name: item.name,
//         size: item.size,
//         price: item.price,
//         quantity: item.quantity,
//         gst: item.gst,
//         totalWithGST: item.totalWithGST,
//       })),
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/orders/offline",
//         orderData,
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         alert("Purchase successful!");
//         const orderId = response.data.order._id; // Assuming backend returns order with _id
//         setSelectedProducts([]);
//         setTotalAmount(0);
//         setCustomerName("");
//         setPhone("");
//         setAddress("");
//         setPincode("");
//         setReferenceName("");
//         setRemarks("");
//         setCrop("");
//         setPaymentMethod("Cash");
//         fetchProducts();
//         navigate(`/invoice/${orderId}`); // Redirect to Invoice page
//       } else {
//         alert(response.data.message || "Purchase failed. Try again.");
//       }
//     } catch (error) {
//       console.error("Error placing offline order:", error.response?.data || error.message);
//       alert("Failed to place order. Check console for details.");
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
//               Offline Purchase
//             </Typography>
//           </Box>

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
//                     label="Address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
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
//                     onChange={(e) => setPincode(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Reference Name"
//                     value={referenceName}
//                     onChange={(e) => setReferenceName(e.target.value)}
//                     variant="outlined"
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
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

//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Product Selection
//               </Typography>
//               <TextField
//                 label="Search Products"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 variant="outlined"
//                 sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
//                 size={isMobile ? "small" : "medium"}
//               />
//               <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="product selection table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Size</TableCell>
//                       <TableCell align="right">Batch</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>GST (%)</TableCell>
//                       <TableCell align="right">Stock</TableCell>
//                       <TableCell align="right">Quantity</TableCell>
//                       <TableCell align="right">Total (with GST)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredProducts.map((product) =>
//                       (product.variants || []).map((variant) => {
//                         const sortedBatches = getSortedBatches(variant);
//                         if (sortedBatches.length === 0) return null;

//                         const selectedBatchId = selectedBatchIds[variant._id] || sortedBatches[0]._id;
//                         const selectedBatch = sortedBatches.find((b) => b._id === selectedBatchId) || sortedBatches[0];
//                         const existingItem = selectedProducts.find((p) => p.batchId === selectedBatch._id);

//                         return (
//                           <TableRow key={`${variant._id}-${selectedBatch._id}`} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                             <TableCell sx={{ color: "text.primary" }}>{product.name || "N/A"}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
//                             <TableCell align="right">
//                               <FormControl fullWidth>
//                                 <InputLabel>Batch</InputLabel>
//                                 <Select
//                                   value={selectedBatchId}
//                                   onChange={(e) => handleBatchChange(variant._id, e.target.value)}
//                                   label="Batch"
//                                   size={isMobile ? "small" : "medium"}
//                                   sx={{ minWidth: { xs: "100px", sm: "150px" } }}
//                                 >
//                                   {sortedBatches.map((batch) => (
//                                     <MenuItem key={batch._id} value={batch._id}>
//                                       {batch.batchNumber} (Stock: {batch.stock})
//                                     </MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                               ₹{(selectedBatch.sellingPrice || 0).toFixed(2)}
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
//                               {selectedBatch.gst || 0}
//                             </TableCell>
//                             <TableCell align="right">
//                               <Chip
//                                 label={`${selectedBatch.stock || 0}`}
//                                 color={selectedBatch.stock <= 5 ? "error" : "success"}
//                                 size={isMobile ? "small" : "medium"}
//                               />
//                             </TableCell>
//                             <TableCell align="right">
//                               <TextField
//                                 type="number"
//                                 inputProps={{ min: 1, max: selectedBatch.stock || 0 }}
//                                 value={existingItem ? existingItem.quantity : ""}
//                                 onChange={(e) => handleProductSelect(product, variant, selectedBatchId, parseInt(e.target.value, 10))}
//                                 disabled={selectedBatch.stock === 0}
//                                 variant="outlined"
//                                 size={isMobile ? "small" : "medium"}
//                                 sx={{ width: isMobile ? "60px" : "80px" }}
//                               />
//                             </TableCell>
//                             <TableCell align="right" sx={{ color: "text.primary" }}>
//                               ₹{(existingItem ? existingItem.totalWithGST : 0).toFixed(2)}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>

//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 Selected Products
//               </Typography>
//               {selectedProducts.length > 0 ? (
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="selected products table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell>Size</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Batch</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
//                         <TableCell align="right">Quantity</TableCell>
//                         <TableCell align="right">Total (with GST)</TableCell>
//                         <TableCell align="right">Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedProducts.map((item) => (
//                         <TableRow key={item.batchId} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                           <TableCell sx={{ color: "text.primary" }}>{item.name || "N/A"}</TableCell>
//                           <TableCell sx={{ color: "text.primary" }}>{item.size || "N/A"}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             {item.batchNumber || "N/A"}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             ₹{(item.price || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>{item.quantity || 0}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>₹{(item.totalWithGST || 0).toFixed(2)}</TableCell>
//                           <TableCell align="right">
//                             <IconButton
//                               color="secondary"
//                               onClick={() => handleRemoveProduct(item.batchId)}
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
//                   No products selected yet.
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
//                     startIcon={<AddShoppingCartIcon />}
//                     onClick={handlePurchase}
//                     disabled={selectedProducts.length === 0}
//                     sx={{ py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Complete Purchase
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={handlePreview}
//                     disabled={selectedProducts.length === 0}
//                     sx={{ py: 1, borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
//                   >
//                     Preview Receipt
//                   </Button>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>

//           <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#fff" } }}>
//             <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>Receipt Preview</DialogTitle>
//             <DialogContent sx={{ pt: 2 }}>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Name:</strong> {customerName}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Phone:</strong> {phone}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Address:</strong> {address}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Pincode:</strong> {pincode}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Reference Name:</strong> {referenceName || "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Remarks:</strong> {remarks || "N/A"}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Crop:</strong> {crop}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Payment Method:</strong> {paymentMethod}</Typography>
//               <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}><strong>Total:</strong> ₹{totalAmount}</Typography>
//               {selectedProducts.map((item) => (
//                 <Typography key={item.batchId} variant="body2" sx={{ color: "text.primary" }}>
//                   {item.name || "N/A"} ({item.size || "N/A"}, Batch: {item.batchNumber || "N/A"}) - {item.quantity || 0} pcs: ₹{(item.totalWithGST || 0).toFixed(2)}
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

// export default AdminOfflinePurchase;
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
  Chip,
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminOfflinePurchase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [crop, setCrop] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [selectedBatchIds, setSelectedBatchIds] = useState({});
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();

    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
      const fetchedProducts = res.data || [];
      setProducts(fetchedProducts);

      const initialBatchIds = {};
      fetchedProducts.forEach((product) => {
        (product.variants || []).forEach((variant) => {
          const sortedBatches = getSortedBatches(variant);
          if (sortedBatches.length > 0) {
            initialBatchIds[variant._id] = sortedBatches[0]._id;
          }
        });
      });
      setSelectedBatchIds(initialBatchIds);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (phoneNumber) => {
    if (!/^\d{10}$/.test(phoneNumber)) return;
    setIsFetchingCustomer(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/customer/${phoneNumber}`, { withCredentials: true });
      const orders = res.data.orders;
      if (orders && orders.length > 0) {
        const latestOrder = orders[0];
        setCustomerName(latestOrder.name || "");
        setAddress(latestOrder.address || "");
        setPincode(latestOrder.pincode || "");
        setReferenceName(latestOrder.referenceName || "");
        setCrop(latestOrder.crop || "");
        setRemarks(latestOrder.remarks || "");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        setCustomerName("");
        setAddress("");
        setPincode("");
        setReferenceName("");
        setCrop("");
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
      setAddress("");
      setPincode("");
      setReferenceName("");
      setCrop("");
      setRemarks("");
    }
  }, [phone]);

  useEffect(() => {
    const total = selectedProducts.reduce((sum, item) => sum + (item.totalWithGST || 0), 0);
    setTotalAmount(total.toFixed(2));
  }, [selectedProducts]);

  const getSortedBatches = (variant) => {
    return (variant.batches || [])
      .filter((batch) => batch.stock > 0)
      .sort((a, b) => a.batchNumber.localeCompare(b.batchNumber));
  };

  const handleAddToCart = (product, variant, batchId) => {
    const batch = variant.batches.find((b) => b._id === batchId);
    if (!batch || batch.stock <= 0) return;

    const gstRate = batch.gst / 100;
    const initialQuantity = 1;
    const priceWithGST = batch.sellingPrice * (1 + gstRate) * initialQuantity;

    setSelectedProducts((prevProducts) => {
      const existingIndex = prevProducts.findIndex((p) => p.batchId === batch._id);
      if (existingIndex !== -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingIndex].quantity += 1;
        updatedProducts[existingIndex].totalWithGST = updatedProducts[existingIndex].price * (1 + gstRate) * updatedProducts[existingIndex].quantity;
        return updatedProducts;
      } else {
        return [
          ...prevProducts,
          {
            productId: product._id,
            variantId: variant._id,
            batchId: batch._id,
            name: product.name || "Unknown Product",
            size: variant.size || "N/A",
            batchNumber: batch.batchNumber || "N/A",
            price: batch.sellingPrice || 0,
            gst: batch.gst || 0,
            stock: batch.stock || 0,
            quantity: initialQuantity,
            totalWithGST: priceWithGST,
          },
        ];
      }
    });
  };

  const handleBatchChange = (variantId, batchId) => {
    setSelectedBatchIds((prev) => ({
      ...prev,
      [variantId]: batchId,
    }));
    const existingItem = selectedProducts.find((p) => p.variantId === variantId);
    if (existingItem) {
      const product = products.find((p) => p._id === existingItem.productId);
      const variant = product.variants.find((v) => v._id === variantId);
      const batch = variant.batches.find((b) => b._id === batchId);
      const gstRate = batch.gst / 100;
      const priceWithGST = batch.sellingPrice * (1 + gstRate) * existingItem.quantity;
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.batchId === existingItem.batchId
            ? { ...p, batchId: batch._id, batchNumber: batch.batchNumber, price: batch.sellingPrice, totalWithGST: priceWithGST }
            : p
        )
      );
    }
  };

  const handleQuantityChange = (batchId, increment) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item.batchId === batchId) {
          const newQuantity = Math.max(0, Math.min(item.stock, item.quantity + increment));
          const gstRate = item.gst / 100;
          const newTotalWithGST = item.price * (1 + gstRate) * newQuantity;
          return { ...item, quantity: newQuantity, totalWithGST: newTotalWithGST };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const handlePurchase = async () => {
    if (!customerName || !phone || !address || !pincode || !crop || selectedProducts.length === 0) {
      alert("Please fill all required fields and select at least one product.");
      return;
    }

    const orderData = {
      name: customerName,
      phone,
      address,
      pincode,
      referenceName,
      remarks,
      crop,
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      cart: selectedProducts.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        batchId: item.batchId,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        gst: item.gst,
        totalWithGST: item.totalWithGST,
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders/offline", orderData, { withCredentials: true });
      if (response.data.success) {
        alert("Purchase successful!");
        const orderId = response.data.order._id;
        setSelectedProducts([]);
        setTotalAmount(0);
        setCustomerName("");
        setPhone("");
        setAddress("");
        setPincode("");
        setReferenceName("");
        setRemarks("");
        setCrop("");
        setPaymentMethod("Cash");
        fetchProducts();
        navigate(`/invoice/${orderId}`);
      } else {
        alert(response.data.message || "Purchase failed. Try again.");
      }
    } catch (error) {
      console.error("Error placing offline order:", error.response?.data || error.message);
      alert("Failed to place order. Check console for details.");
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Offline Purchase Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [["Customer Details"]],
      body: [
        [`Name: ${customerName}`],
        [`Phone: ${phone}`],
        [`Address: ${address}`],
        [`Pincode: ${pincode}`],
        [`Reference Name: ${referenceName || "N/A"}`],
        [`Remarks: ${remarks || "N/A"}`],
        [`Crop: ${crop}`],
        [`Payment Method: ${paymentMethod}`],
        [`Total Amount: ₹${totalAmount}`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Name", "Size", "Batch", "Price", "Quantity", "Total (with GST)"]],
      body: selectedProducts.map((item) => [
        item.name,
        item.size,
        item.batchNumber,
        `₹${item.price.toFixed(2)}`,
        item.quantity,
        `₹${item.totalWithGST.toFixed(2)}`,
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

    doc.save("offline_purchase_report.pdf");
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Size", "Batch", "Price", "Quantity", "Total (with GST)"];
    const csvRows = [
      headers.join(","),
      ...selectedProducts.map((item) =>
        [`"${item.name}"`, item.size, item.batchNumber, item.price, item.quantity, item.totalWithGST].join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "offline_purchase.csv";
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
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: "8px", fontWeight: "medium", padding: "2px 8px" },
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
                Offline Purchase
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportCSV}
                  startIcon={<DownloadIcon />}
                  disabled={selectedProducts.length === 0}
                  sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateReport}
                  startIcon={<PictureAsPdfIcon />}
                  disabled={selectedProducts.length === 0}
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
                <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="small" />
                Offline Purchase
              </Typography>
            </Breadcrumbs>
          </Box>

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
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                    onChange={(e) => setPincode(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Reference Name"
                    value={referenceName}
                    onChange={(e) => setReferenceName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size={isMobile ? "small" : "medium"}
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

          {/* Selected Products */}
          <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                Selected Products
              </Typography>
              {selectedProducts.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="selected products table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Batch</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total (with GST)</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProducts.map((item) => (
                        <TableRow key={item.batchId} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                          <TableCell sx={{ color: "text.primary" }}>{item.name || "N/A"}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{item.size || "N/A"}</TableCell>
                          <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                            {item.batchNumber || "N/A"}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                            ₹{(item.price || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                              <IconButton
                                onClick={() => handleQuantityChange(item.batchId, -1)}
                                disabled={item.quantity <= 1}
                                sx={{ color: darkMode ? "#A5D6A7" : "#4CAF50" }}
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                              <Typography sx={{ mx: 1, color: "text.primary" }}>{item.quantity}</Typography>
                              <IconButton
                                onClick={() => handleQuantityChange(item.batchId, 1)}
                                disabled={item.quantity >= item.stock}
                                sx={{ color: darkMode ? "#A5D6A7" : "#4CAF50" }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{(item.totalWithGST || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => handleQuantityChange(item.batchId, -item.quantity)}
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
                  No products selected yet.
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
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handlePurchase}
                    disabled={selectedProducts.length === 0}
                    sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
                  >
                    Complete Purchase
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setPreviewOpen(true)}
                    disabled={selectedProducts.length === 0}
                    sx={{ borderColor: darkMode ? "#66BB6A" : "#388E3C", color: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" }, width: { xs: "100%", sm: "auto" } }}
                  >
                    Preview Receipt
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                Product Selection
              </Typography>
              <TextField
                label="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
                size={isMobile ? "small" : "medium"}
              />
              <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="product selection table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell align="right">Batch</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Price</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>GST (%)</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) =>
                      (product.variants || []).map((variant) => {
                        const sortedBatches = getSortedBatches(variant);
                        if (sortedBatches.length === 0) return null;

                        const selectedBatchId = selectedBatchIds[variant._id] || sortedBatches[0]._id;
                        const selectedBatch = sortedBatches.find((b) => b._id === selectedBatchId) || sortedBatches[0];

                        return (
                          <TableRow key={`${variant._id}-${selectedBatch._id}`} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                            <TableCell sx={{ color: "text.primary" }}>{product.name || "N/A"}</TableCell>
                            <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
                            <TableCell align="right">
                              <FormControl fullWidth>
                                <InputLabel>Batch</InputLabel>
                                <Select
                                  value={selectedBatchId}
                                  onChange={(e) => handleBatchChange(variant._id, e.target.value)}
                                  label="Batch"
                                  size={isMobile ? "small" : "medium"}
                                  sx={{ minWidth: { xs: "100px", sm: "150px" } }}
                                >
                                  {sortedBatches.map((batch) => (
                                    <MenuItem key={batch._id} value={batch._id}>
                                      {batch.batchNumber} (Stock: {batch.stock})
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                              ₹{(selectedBatch.sellingPrice || 0).toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
                              {selectedBatch.gst || 0}
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={`${selectedBatch.stock || 0}`}
                                color={selectedBatch.stock <= 5 ? "error" : "success"}
                                size={isMobile ? "small" : "medium"}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={() => handleAddToCart(product, variant, selectedBatchId)}
                                disabled={selectedBatch.stock === 0}
                                size={isMobile ? "small" : "medium"}
                                sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
                              >
                                Add
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Preview Dialog */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>Receipt Preview</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Name:</strong> {customerName}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Phone:</strong> {phone}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Address:</strong> {address}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Pincode:</strong> {pincode}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Reference Name:</strong> {referenceName || "N/A"}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Remarks:</strong> {remarks || "N/A"}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Crop:</strong> {crop}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Payment Method:</strong> {paymentMethod}</Typography>
              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}><strong>Total:</strong> ₹{totalAmount}</Typography>
              {selectedProducts.map((item) => (
                <Typography key={item.batchId} variant="body2" sx={{ color: "text.primary" }}>
                  {item.name || "N/A"} ({item.size || "N/A"}, Batch: {item.batchNumber || "N/A"}) - {item.quantity || 0} pcs: ₹{(item.totalWithGST || 0).toFixed(2)}
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

export default AdminOfflinePurchase;