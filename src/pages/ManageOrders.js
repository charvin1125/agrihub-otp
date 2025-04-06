// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   TextField,
//   Chip,
//   IconButton,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../components/Sidebar";

// const ManageOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/orders/list", {
//           withCredentials: true,
//         });
//         setOrders(response.data.orders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         if (error.response?.status === 403) navigate("/"); // Redirect if not admin
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/orders/update-status/${orderId}`,
//         { status: newStatus },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setOrders(
//           orders.map((order) =>
//             order._id === orderId
//               ? { ...order, status: newStatus, statusHistory: response.data.order.statusHistory }
//               : order
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Failed to update status");
//     }
//   };

//   const handlePayDues = async (orderId) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/orders/pay-dues/${orderId}`,
//         { status: "Paid", duesPaidDate: new Date() },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setOrders(
//           orders.map((order) =>
//             order._id === orderId
//               ? {
//                   ...order,
//                   status: "Paid",
//                   isDue: false,
//                   duesPaidDate: response.data.order.duesPaidDate,
//                   statusHistory: response.data.order.statusHistory,
//                 }
//               : order
//           )
//         );
//         alert("Dues cleared successfully!");
//       }
//     } catch (error) {
//       console.error("Error paying dues:", error);
//       alert("Failed to clear dues");
//     }
//   };

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
//       text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: darkMode ? "#388E3C" : "#A5D6A7",
//             color: darkMode ? "#fff" : "#212121",
//             fontWeight: "bold",
//           },
//           body: { padding: { xs: "8px", sm: "12px" } },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 8,
//             textTransform: "none",
//             "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
//           },
//         },
//       },
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
//     },
//   });

//   const filteredOrders = filterStatus
//     ? orders.filter((order) => order.status === filterStatus)
//     : orders;

//   const formatDate = (date) => {
//     return date ? new Date(date).toLocaleString() : "N/A";
//   };

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
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 3 },
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
//             <Typography
//               variant={isMobile ? "h5" : "h4"}
//               sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
//             >
//               Manage Orders
//             </Typography>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
//               <CircularProgress color="primary" size={60} />
//             </Box>
//           ) : (
//             <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//               <CardContent>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//                   <FormControl sx={{ minWidth: 200 }}>
//                     <InputLabel>Filter by Status</InputLabel>
//                     <Select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       label="Filter by Status"
//                       sx={{ borderRadius: "8px" }}
//                     >
//                       <MenuItem value="">All</MenuItem>
//                       <MenuItem value="Pending">Pending</MenuItem>
//                       <MenuItem value="Paid">Paid</MenuItem>
//                       <MenuItem value="Shipped">Shipped</MenuItem>
//                       <MenuItem value="Completed">Completed</MenuItem>
//                       <MenuItem value="Cancelled">Cancelled</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Total Orders: {filteredOrders.length}
//                   </Typography>
//                 </Box>

//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Order ID</TableCell>
//                         <TableCell>Customer</TableCell>
//                         <TableCell>Total Amount</TableCell>
//                         <TableCell>Payment Method</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Due Status</TableCell>
//                         <TableCell>Dues Paid Date</TableCell>
//                         <TableCell>Status History</TableCell>
//                         <TableCell align="right">Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredOrders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={9} align="center">
//                             <Typography variant="body1" sx={{ color: "text.secondary", py: 2 }}>
//                               No orders found matching the selected filter.
//                             </Typography>
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredOrders.map((order) => (
//                           <TableRow
//                             key={order._id}
//                             sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}
//                           >
//                             <TableCell sx={{ color: "text.primary" }}>{order._id}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{order.name}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>
//                               ₹{order.totalAmount.toLocaleString()}
//                             </TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{order.paymentMethod}</TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={order.status}
//                                 color={
//                                   order.status === "Completed"
//                                     ? "success"
//                                     : order.status === "Cancelled"
//                                     ? "error"
//                                     : "primary"
//                                 }
//                                 size="small"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={order.isDue ? "Due" : "Cleared"}
//                                 color={order.isDue ? "error" : "success"}
//                                 size="small"
//                               />
//                             </TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{formatDate(order.duesPaidDate)}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>
//                               {order.statusHistory?.length > 0 ? (
//                                 order.statusHistory.map((history, index) => (
//                                   <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
//                                     {history.status} by {history.updatedBy?.firstName || "Unknown"} on{" "}
//                                     {formatDate(history.timestamp)}
//                                   </Typography>
//                                 ))
//                               ) : (
//                                 "No history"
//                               )}
//                             </TableCell>
//                             <TableCell align="right">
//                               <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
//                                 <FormControl sx={{ minWidth: 120 }}>
//                                   <Select
//                                     value={order.status}
//                                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                     size="small"
//                                     sx={{ borderRadius: "8px" }}
//                                   >
//                                     <MenuItem value="Pending">Pending</MenuItem>
//                                     <MenuItem value="Paid">Paid</MenuItem>
//                                     <MenuItem value="Shipped">Shipped</MenuItem>
//                                     <MenuItem value="Completed">Completed</MenuItem>
//                                     <MenuItem value="Cancelled">Cancelled</MenuItem>
//                                   </Select>
//                                 </FormControl>
//                                 {order.isDue && (
//                                   <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     size="small"
//                                     onClick={() => handlePayDues(order._id)}
//                                     sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//                                   >
//                                     Pay Dues
//                                   </Button>
//                                 )}
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageOrders;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   TextField,
//   Chip,
//   IconButton,
//   Card,
//   CardContent,
//   Breadcrumbs,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeIcon from "@mui/icons-material/Home";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import Sidebar from "../components/Sidebar";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { motion } from "framer-motion";

// const ManageOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/orders/list", {
//           withCredentials: true,
//         });
//         setOrders(response.data.orders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         if (error.response?.status === 403) navigate("/"); // Redirect if not admin
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/orders/update-status/${orderId}`,
//         { status: newStatus },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setOrders(
//           orders.map((order) =>
//             order._id === orderId
//               ? { ...order, status: newStatus, statusHistory: response.data.order.statusHistory }
//               : order
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Failed to update status");
//     }
//   };

//   const handlePayDues = async (orderId) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/orders/pay-dues/${orderId}`,
//         { status: "Paid", duesPaidDate: new Date() },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setOrders(
//           orders.map((order) =>
//             order._id === orderId
//               ? {
//                   ...order,
//                   status: "Paid",
//                   isDue: false,
//                   duesPaidDate: response.data.order.duesPaidDate,
//                   statusHistory: response.data.order.statusHistory,
//                 }
//               : order
//           )
//         );
//         alert("Dues cleared successfully!");
//       }
//     } catch (error) {
//       console.error("Error paying dues:", error);
//       alert("Failed to clear dues");
//     }
//   };

//   const handleGenerateReport = () => {
//     const doc = new jsPDF();
//     const date = new Date().toLocaleDateString();

//     doc.setFontSize(18);
//     doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
//     doc.text("Orders Report - AgriHub", 14, 20);
//     doc.setFontSize(12);
//     doc.setTextColor(100);
//     doc.text(`Generated on: ${date}`, 14, 30);

//     const tableData = filteredOrders.map((order) => [
//       order._id,
//       order.name || "N/A",
//       `₹${order.totalAmount.toLocaleString()}`,
//       order.paymentMethod || "N/A",
//       order.status,
//       order.isDue ? "Due" : "Cleared",
//       order.duesPaidDate ? new Date(order.duesPaidDate).toLocaleString() : "N/A",
//       order.statusHistory?.length > 0
//         ? order.statusHistory.map((h) => `${h.status} (${new Date(h.timestamp).toLocaleString()})`).join(", ")
//         : "No history",
//     ]);

//     doc.autoTable({
//       startY: 40,
//       head: [
//         [
//           "Order ID",
//           "Customer",
//           "Total Amount",
//           "Payment Method",
//           "Status",
//           "Due Status",
//           "Dues Paid Date",
//           "Status History",
//         ],
//       ],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
//       headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       columnStyles: { 7: { cellWidth: 40 } }, // Wider column for Status History
//     });

//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setTextColor(150);
//       doc.text(`Page ${i} of ${pageCount}`, 180, 290);
//     }

//     doc.save("orders_report.pdf");
//   };

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
//       text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
//             color: "#fff",
//             fontWeight: "bold",
//             padding: "12px",
//             borderBottom: `2px solid ${darkMode ? "#A5D6A7" : "#4CAF50"}`,
//           },
//           body: {
//             padding: { xs: "10px", sm: "14px" },
//             borderBottom: `1px solid ${darkMode ? "#424242" : "#E0E0E0"}`,
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 8,
//             textTransform: "none",
//             padding: "8px 16px",
//             "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "16px",
//             boxShadow: darkMode
//               ? "0 8px 24px rgba(255,255,255,0.05)"
//               : "0 8px 24px rgba(0,0,0,0.1)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-5px)",
//               boxShadow: darkMode
//                 ? "0 12px 32px rgba(255,255,255,0.15)"
//                 : "0 12px 32px rgba(0,0,0,0.15)",
//             },
//           },
//         },
//       },
//       MuiSelect: {
//         styleOverrides: {
//           root: {
//             borderRadius: "8px",
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: darkMode ? "#A5D6A7" : "#81C784",
//             },
//             "&:hover .MuiOutlinedInput-notchedOutline": {
//               borderColor: darkMode ? "#81C784" : "#4CAF50",
//             },
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: darkMode ? "#66BB6A" : "#388E3C",
//             },
//           },
//         },
//       },
//       MuiChip: {
//         styleOverrides: {
//           root: {
//             borderRadius: "6px",
//             fontWeight: "medium",
//           },
//         },
//       },
//       MuiTypography: {
//         styleOverrides: {
//           root: {
//             transition: "color 0.3s ease",
//           },
//         },
//       },
//     },
//   });

//   const filteredOrders = filterStatus
//     ? orders.filter((order) => order.status === filterStatus)
//     : orders;

//   const formatDate = (date) => {
//     return date ? new Date(date).toLocaleString() : "N/A";
//   };

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

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
//           {/* Header with Breadcrumbs */}
//           <Box sx={{ mb: { xs: 2, sm: 4 } }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 justifyContent: "space-between",
//                 alignItems: { xs: "flex-start", sm: "center" },
//                 gap: 2,
//                 mb: 1,
//               }}
//             >
//               {isMobile && (
//                 <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                   <MenuIcon />
//                 </IconButton>
//               )}
//               <Typography
//                 variant={isMobile ? "h5" : "h4"}
//                 sx={{ fontWeight: "bold", color: "#212121" }}
//               >
//                 Manage Orders
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleGenerateReport}
//                 startIcon={<PictureAsPdfIcon />}
//                 sx={{
//                   bgcolor: darkMode ? "#A5D6A7" : "#4CAF50",
//                   "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" },
//                 }}
//               >
//                 Generate Report
//               </Button>
//             </Box>
//             <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: "#4CAF50" }}>
//               <Link
//                 to="/admin-dashboard"
//                 style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
//               >
//                 <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
//                 Dashboard
//               </Link>
//               <Typography color="#4CAF50" sx={{ display: "flex", alignItems: "center" }}>
//                 <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="small" />
//                 Manage Orders
//               </Typography>
//             </Breadcrumbs>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
//               <CircularProgress color="primary" size={60} />
//             </Box>
//           ) : (
//             <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9", overflow: "hidden" }}>
//               <CardContent>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     justifyContent: "space-between",
//                     alignItems: { xs: "flex-start", sm: "center" },
//                     mb: 3,
//                     gap: 2,
//                   }}
//                 >
//                   <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
//                     <InputLabel>Filter by Status</InputLabel>
//                     <Select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       label="Filter by Status"
//                       sx={{ bgcolor: darkMode ? "#424242" : "#fff" }}
//                     >
//                       <MenuItem value="">All</MenuItem>
//                       <MenuItem value="Pending">Pending</MenuItem>
//                       <MenuItem value="Paid">Paid</MenuItem>
//                       <MenuItem value="Shipped">Shipped</MenuItem>
//                       <MenuItem value="Completed">Completed</MenuItem>
//                       <MenuItem value="Cancelled">Cancelled</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Total Orders: {filteredOrders.length}
//                   </Typography>
//                 </Box>

//                 <TableContainer component={Paper} sx={{ borderRadius: "12px", overflowX: "auto" }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Order ID</TableCell>
//                         <TableCell>Customer</TableCell>
//                         <TableCell>Total Amount</TableCell>
//                         <TableCell>Payment Method</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Due Status</TableCell>
//                         <TableCell>Dues Paid Date</TableCell>
//                         <TableCell>Status History</TableCell>
//                         <TableCell align="right">Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredOrders.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={9} align="center">
//                             <Typography variant="body1" sx={{ color: "text.secondary", py: 3 }}>
//                               No orders found matching the selected filter.
//                             </Typography>
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredOrders.map((order) => (
//                           <TableRow
//                             key={order._id}
//                             sx={{
//                               "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" },
//                               transition: "background-color 0.3s ease",
//                             }}
//                           >
//                             <TableCell sx={{ color: "text.primary", fontFamily: "monospace" }}>{order._id}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{order.name}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>
//                               ₹{order.totalAmount.toLocaleString()}
//                             </TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{order.paymentMethod}</TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={order.status}
//                                 color={
//                                   order.status === "Completed"
//                                     ? "success"
//                                     : order.status === "Cancelled"
//                                     ? "error"
//                                     : "primary"
//                                 }
//                                 size="small"
//                                 sx={{ fontWeight: "medium" }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={order.isDue ? "Due" : "Cleared"}
//                                 color={order.isDue ? "error" : "success"}
//                                 size="small"
//                                 sx={{ fontWeight: "medium" }}
//                               />
//                             </TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>{formatDate(order.duesPaidDate)}</TableCell>
//                             <TableCell sx={{ color: "text.primary" }}>
//                               {order.statusHistory?.length > 0 ? (
//                                 order.statusHistory.map((history, index) => (
//                                   <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
//                                     {history.status} by {history.updatedBy?.firstName || "Unknown"} on{" "}
//                                     {formatDate(history.timestamp)}
//                                   </Typography>
//                                 ))
//                               ) : (
//                                 "No history"
//                               )}
//                             </TableCell>
//                             <TableCell align="right">
//                               <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
//                                 <FormControl sx={{ minWidth: 120 }}>
//                                   <Select
//                                     value={order.status}
//                                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                     size="small"
//                                     sx={{ bgcolor: darkMode ? "#424242" : "#fff" }}
//                                   >
//                                     <MenuItem value="Pending">Pending</MenuItem>
//                                     <MenuItem value="Paid">Paid</MenuItem>
//                                     <MenuItem value="Shipped">Shipped</MenuItem>
//                                     <MenuItem value="Completed">Completed</MenuItem>
//                                     <MenuItem value="Cancelled">Cancelled</MenuItem>
//                                   </Select>
//                                 </FormControl>
//                                 {order.isDue && (
//                                   <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     size="small"
//                                     onClick={() => handlePayDues(order._id)}
//                                     sx={{
//                                       bgcolor: darkMode ? "#A5D6A7" : "#4CAF50",
//                                       "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" },
//                                     }}
//                                   >
//                                     Pay Dues
//                                   </Button>
//                                 )}
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageOrders;
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Chip,
  IconButton,
  Card,
  CardContent,
  Breadcrumbs,
  Pagination,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [filterStatus, setFilterStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed number of rows per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/list", {
          withCredentials: true,
        });
        // Sort orders by creation date (assuming createdAt exists) or _id descending
        const sortedOrders = response.data.orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : a._id;
          const dateB = b.createdAt ? new Date(b.createdAt) : b._id;
          return dateB - dateA; // Latest first
        });
        setOrders(sortedOrders);
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

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Orders Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableData = filteredOrders.map((order) => [
      order._id,
      order.name || "N/A",
      `₹${order.totalAmount.toLocaleString()}`,
      order.paymentMethod || "N/A",
      order.status,
      order.isDue ? "Due" : "Cleared",
      order.duesPaidDate ? new Date(order.duesPaidDate).toLocaleString() : "N/A",
      order.statusHistory?.length > 0
        ? order.statusHistory.map((h) => `${h.status} (${new Date(h.timestamp).toLocaleString()})`).join(", ")
        : "No history",
    ]);

    doc.autoTable({
      startY: 40,
      head: [
        [
          "Order ID",
          "Customer",
          "Total Amount",
          "Payment Method",
          "Status",
          "Due Status",
          "Dues Paid Date",
          "Status History",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: { 7: { cellWidth: 40 } },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save("orders_report.pdf");
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: darkMode
              ? "0 10px 30px rgba(255,255,255,0.05)"
              : "0 10px 30px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: darkMode
                ? "0 14px 40px rgba(255,255,255,0.15)"
                : "0 14px 40px rgba(0,0,0,0.12)",
            },
            overflow: "hidden",
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
            backgroundColor: darkMode ? "#424242" : "#fff",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontWeight: "medium",
            padding: "2px 8px",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            transition: "color 0.3s ease",
          },
          h4: { fontWeight: 700, letterSpacing: "0.5px" },
          h5: { fontWeight: 700, letterSpacing: "0.5px" },
          body2: { fontSize: "0.95rem" },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": {
              color: darkMode ? "#A5D6A7" : "#4CAF50",
              "&:hover": { backgroundColor: darkMode ? "#2E7D32" : "#E8F5E9" },
              "&.Mui-selected": {
                backgroundColor: darkMode ? "#66BB6A" : "#388E3C",
                color: "#fff",
              },
            },
          },
        },
      },
    },
  });

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : "N/A";
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
                Manage Orders
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateReport}
                startIcon={<PictureAsPdfIcon />}
                sx={{
                  bgcolor: darkMode ? "#A5D6A7" : "#4CAF50",
                  "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" },
                }}
              >
                Generate Report
              </Button>
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
                Manage Orders
              </Typography>
            </Breadcrumbs>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9", overflow: "hidden" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 4,
                    gap: 2,
                  }}
                >
                  <FormControl sx={{ minWidth: { xs: "100%", sm: 220 } }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Filter by Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "medium" }}>
                    Total Orders: {filteredOrders.length}
                  </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ borderRadius: "12px", overflowX: "auto" }}>
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
                      {paginatedOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            <Typography variant="body1" sx={{ color: "text.secondary", py: 4 }}>
                              No orders found matching the selected filter.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedOrders.map((order) => (
                          <TableRow
                            key={order._id}
                            sx={{
                              "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" },
                              transition: "background-color 0.3s ease",
                            }}
                          >
                            <TableCell sx={{ color: "text.primary", fontFamily: "monospace" }}>{order._id}</TableCell>
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
                              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                                <FormControl sx={{ minWidth: 130 }}>
                                  <Select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    size="small"
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
                                    sx={{
                                      bgcolor: darkMode ? "#A5D6A7" : "#4CAF50",
                                      "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" },
                                    }}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageOrders;