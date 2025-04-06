// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Container,
//   Paper,
//   Button,
//   CircularProgress,
//   TextField,
//   IconButton,
//   TableSortLabel,
//   TablePagination,
//   Breadcrumbs,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import SearchIcon from "@mui/icons-material/Search";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import HomeIcon from "@mui/icons-material/Home";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import NavigationBar from "../components/Navbar";
// import Footer from "../components/Footer";

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/orders/my-orders", {
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           setOrders(response.data.orders);
//           setFilteredOrders(response.data.orders);
//         } else {
//           toast.error(response.data.message || "Failed to fetch orders");
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         toast.error("Something went wrong while fetching your orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();

//     const handleResize = () => setIsMobile(window.innerWidth < 600);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleViewOrder = (orderId) => {
//     navigate(`/invoice/${orderId}`);
//   };

//   const handleTrackOrder = () => {
//     navigate("/order-tracking");
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = orders.filter(
//       (order) =>
//         order._id.toLowerCase().includes(query) ||
//         order.crop.toLowerCase().includes(query) ||
//         order.status.toLowerCase().includes(query) ||
//         order.paymentMethod.toLowerCase().includes(query) ||
//         order.purchaseType.toLowerCase().includes(query)
//     );
//     setFilteredOrders(filtered);
//     setPage(0); // Reset to first page on search
//   };

//   const handleSort = (field) => {
//     const isAsc = sortField === field && sortOrder === "asc";
//     setSortOrder(isAsc ? "desc" : "asc");
//     setSortField(field);

//     const sorted = [...filteredOrders].sort((a, b) => {
//       if (field === "createdAt") {
//         return isAsc
//           ? new Date(a[field]) - new Date(b[field])
//           : new Date(b[field]) - new Date(a[field]);
//       } else if (field === "totalAmount") {
//         return isAsc ? a[field] - b[field] : b[field] - a[field];
//       } else {
//         return isAsc
//           ? a[field].localeCompare(b[field])
//           : b[field].localeCompare(a[field]);
//       }
//     });
//     setFilteredOrders(sorted);
//   };

//   const theme = createTheme({
//     palette: {
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: "#F7F9F7", paper: "#FFFFFF" },
//       text: { primary: "#1A1A1A", secondary: "#616161" },
//     },
//     typography: {
//       fontFamily: "'Poppins', sans-serif",
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: "#2E7D32",
//             color: "#FFFFFF",
//             fontWeight: 600,
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
//             padding: { xs: "8px", sm: "10px", md: "14px" },
//             whiteSpace: "nowrap",
//           },
//           body: {
//             padding: { xs: "8px", sm: "10px", md: "14px" },
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "14px",
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
//             padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" },
//             "&:hover": {
//               boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "14px",
//               "& fieldset": { borderColor: "#81C784" },
//               "&:hover fieldset": { borderColor: "#2E7D32" },
//               "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
//             },
//             "& .MuiInputBase-input": {
//               padding: { xs: "10px", sm: "12px", md: "14px" },
//               fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
//             },
//           },
//         },
//       },
//       MuiTableContainer: {
//         styleOverrides: {
//           root: {
//             borderRadius: "20px",
//             boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//             background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
//           },
//         },
//       },
//       MuiBreadcrumbs: {
//         styleOverrides: {
//           root: {
//             fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
//             "& a": {
//               display: "flex",
//               alignItems: "center",
//               textDecoration: "none",
//               color: "primary.main",
//               "&:hover": { textDecoration: "underline" },
//             },
//           },
//           separator: { color: "text.secondary" },
//         },
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress size={40} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#FFFFFF" }}>
//           <Container maxWidth="lg">
//             <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//               <RouterLink to="/">
//                 <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.25rem" } }} /> Home
//               </RouterLink>
//               <Typography color="text.primary">My Orders</Typography>
//             </Breadcrumbs>
//           </Container>
//         </Box>
//         <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 3, sm: 5 }, flexGrow: 1 }}>
//           <Typography
//             variant={isMobile ? "h5" : "h4"}
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//               color: "primary.main",
//               fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
//               background: "linear-gradient(45deg, #2E7D32, #81C784)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             My Orders
//           </Typography>

//           {/* Search Bar and Track Order Button */}
//           <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
//             <TextField
//               variant="outlined"
//               placeholder="Search orders..."
//               value={searchQuery}
//               onChange={handleSearch}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton>
//                     <SearchIcon sx={{ color: "primary.main" }} />
//                   </IconButton>
//                 ),
//               }}
//               sx={{ width: { xs: "100%", sm: "400px" } }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<TrackChangesIcon />}
//               onClick={handleTrackOrder}
//               sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, width: { xs: "100%", sm: "auto" } }}
//             >
//               Track Orders
//             </Button>
//           </Box>

//           {/* Orders Table */}
//           <TableContainer component={Paper}>
//             {filteredOrders.length === 0 ? (
//               <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
//                 <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
//                   No orders found.
//                 </Typography>
//               </Box>
//             ) : (
//               <>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
//                   <TableHead>
//                     <TableRow>
//                       {[
//                         { label: "Date", field: "createdAt" },
//                         { label: "Order ID", field: "_id" },
//                         { label: "Crop", field: "crop" },
//                         { label: "Status", field: "status" },
//                         { label: "Payment", field: "paymentMethod" },
//                         { label: "Type", field: "purchaseType" },
//                         { label: "Total", field: "totalAmount" },
//                         { label: "Actions", field: null },
//                       ].map(({ label, field }) => (
//                         <TableCell key={label}>
//                           {field ? (
//                             <TableSortLabel
//                               active={sortField === field}
//                               direction={sortField === field ? sortOrder : "asc"}
//                               onClick={() => handleSort(field)}
//                             >
//                               {label}
//                             </TableSortLabel>
//                           ) : (
//                             label
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
//                       <TableRow
//                         key={order._id}
//                         sx={{
//                           "&:hover": { backgroundColor: "#F1F8E9", transition: "background-color 0.2s" },
//                         }}
//                       >
//                         <TableCell>{formatDate(order.createdAt)}</TableCell>
//                         <TableCell sx={{ maxWidth: { xs: 100, sm: 150 }, overflow: "hidden", textOverflow: "ellipsis" }}>
//                           {order._id}
//                         </TableCell>
//                         <TableCell>{order.crop}</TableCell>
//                         <TableCell>
//                           <Box
//                             sx={{
//                               bgcolor:
//                                 order.status === "Completed"
//                                   ? "#81C784"
//                                   : order.status === "Pending"
//                                   ? "#FFB300"
//                                   : "#EF5350",
//                               color: "#FFFFFF",
//                               borderRadius: "10px",
//                               textAlign: "center",
//                               py: 0.5,
//                               fontSize: { xs: "0.7rem", sm: "0.8rem" },
//                             }}
//                           >
//                             {order.status}
//                           </Box>
//                         </TableCell>
//                         <TableCell>{order.paymentMethod}</TableCell>
//                         <TableCell>{order.purchaseType}</TableCell>
//                         <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<VisibilityIcon />}
//                             onClick={() => handleViewOrder(order._id)}
//                             sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}
//                           >
//                             View
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25]}
//                   component="div"
//                   count={filteredOrders.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={(e, newPage) => setPage(newPage)}
//                   onRowsPerPageChange={(e) => {
//                     setRowsPerPage(parseInt(e.target.value, 10));
//                     setPage(0);
//                   }}
//                   sx={{ "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: { xs: "0.75rem", sm: "0.85rem" } } }}
//                 />
//               </>
//             )}
//           </TableContainer>
//         </Box>
//         <Footer />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default MyOrder;
// Components/MyOrder.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  CircularProgress,
  TextField,
  IconButton,
  TableSortLabel,
  TablePagination,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const MyOrder = ({ darkMode = false }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/my-orders", {
          withCredentials: true,
        });

        if (response.data.success) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
        } else {
          toast.error(response.data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  const handleTrackOrder = () => {
    navigate("/customer-dashboard/track-order"); // Update to stay within dashboard
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(query) ||
        order.crop.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query) ||
        order.purchaseType.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);

    const sorted = [...filteredOrders].sort((a, b) => {
      if (field === "createdAt") {
        return isAsc
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      } else if (field === "totalAmount") {
        return isAsc ? a[field] - b[field] : b[field] - a[field];
      } else {
        return isAsc
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });
    setFilteredOrders(sorted);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: darkMode ? "#121212" : "#F7F9F7", paper: darkMode ? "#1E1E1E" : "#FFFFFF" },
      text: { primary: darkMode ? "#E0E0E0" : "#1A1A1A", secondary: darkMode ? "#B0B0B0" : "#616161" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkMode ? "#0F3460" : "#2E7D32",
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
            padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" },
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              "& fieldset": { borderColor: darkMode ? "#E94560" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#FF6F61" : "#2E7D32" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#FF6F61" : "#2E7D32" },
            },
            "& .MuiInputBase-input": {
              padding: { xs: "10px", sm: "12px", md: "14px" },
              fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
            background: darkMode
              ? "linear-gradient(180deg, #1E1E1E 70%, #121212 100%)"
              : "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={40} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", overflowX: "hidden", p: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <RouterLink to="/customer-dashboard">
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.25rem" } }} /> Dashboard
          </RouterLink>
          <Typography color="text.primary">My Orders</Typography>
        </Breadcrumbs>

        {/* Search Bar and Track Order Button */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon sx={{ color: "primary.main" }} />
                </IconButton>
              ),
            }}
            sx={{ width: { xs: "100%", sm: "400px" } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<TrackChangesIcon />}
            onClick={handleTrackOrder}
            sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, width: { xs: "100%", sm: "auto" } }}
          >
            Track Orders
          </Button>
        </Box>

        {/* Orders Table */}
        <TableContainer component={Paper}>
          {filteredOrders.length === 0 ? (
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                No orders found.
              </Typography>
            </Box>
          ) : (
            <>
              <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                <TableHead>
                  <TableRow>
                    {[
                      { label: "Date", field: "createdAt" },
                      { label: "Order ID", field: "_id" },
                      { label: "Crop", field: "crop" },
                      { label: "Status", field: "status" },
                      { label: "Payment", field: "paymentMethod" },
                      { label: "Type", field: "purchaseType" },
                      { label: "Total", field: "totalAmount" },
                      { label: "Actions", field: null },
                    ].map(({ label, field }) => (
                      <TableCell key={label}>
                        {field ? (
                          <TableSortLabel
                            active={sortField === field}
                            direction={sortField === field ? sortOrder : "asc"}
                            onClick={() => handleSort(field)}
                          >
                            {label}
                          </TableSortLabel>
                        ) : (
                          label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                    <TableRow
                      key={order._id}
                      sx={{
                        "&:hover": { backgroundColor: darkMode ? "#2A2A2A" : "#F1F8E9", transition: "background-color 0.2s" },
                      }}
                    >
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell sx={{ maxWidth: { xs: 100, sm: 150 }, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {order._id}
                      </TableCell>
                      <TableCell>{order.crop}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            bgcolor:
                              order.status === "Completed"
                                ? "#81C784"
                                : order.status === "Pending"
                                ? "#FFB300"
                                : "#EF5350",
                            color: "#FFFFFF",
                            borderRadius: "10px",
                            textAlign: "center",
                            py: 0.5,
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          }}
                        >
                          {order.status}
                        </Box>
                      </TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{order.purchaseType}</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewOrder(order._id)}
                          sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{ "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: { xs: "0.75rem", sm: "0.85rem" } } }}
              />
            </>
          )}
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default MyOrder;