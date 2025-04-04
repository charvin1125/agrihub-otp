// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import LowStockNotification from "../components/LowStockNotification";
// import {
//   Badge,
//   IconButton,
//   Tooltip,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Divider,
//   Avatar,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuIcon from "@mui/icons-material/Menu";
// import StarIcon from "@mui/icons-material/Star";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip as ChartTooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   ChartTooltip,
//   Legend,
//   ArcElement
// );

// const AdminDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [lowStockCount, setLowStockCount] = useState(0); // Updated to track count from LowStockNotification
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [showLowStockCard, setShowLowStockCard] = useState(false);
//   const [loadingStock, setLoadingStock] = useState(true);

//   const [stockByBrandData, setStockByBrandData] = useState({
//     labels: [],
//     datasets: [{ data: [], backgroundColor: [] }],
//   });
//   const [orderData, setOrderData] = useState({
//     labels: [],
//     datasets: [{ label: "Orders", data: [], borderColor: "#42a5f5", fill: false }],
//   });
//   const [salesData, setSalesData] = useState({
//     labels: ["Online", "Offline"],
//     datasets: [{ data: [], backgroundColor: ["#66bb6a", "#ef5350"] }],
//   });

//   const navigate = useNavigate();

//   const latestReviews = [
//     { product: "Organic Fertilizer", rating: 4.5, review: "Great product, improved my crop yield!", reviewer: "Amit Patel", date: "2025-03-05", avatar: "https://i.pravatar.cc/40?img=1" },
//     { product: "Pesticide Spray", rating: 3.8, review: "Effective but a bit pricey.", reviewer: "Priya Sharma", date: "2025-03-04", avatar: "https://i.pravatar.cc/40?img=2" },
//     { product: "Drip Irrigation Kit", rating: 4.9, review: "Best investment for my farm!", reviewer: "Rahul Desai", date: "2025-03-03", avatar: "https://i.pravatar.cc/40?img=3" },
//     { product: "Soil Enhancer", rating: 4.2, review: "Good quality, easy to use.", reviewer: "Neha Gupta", date: "2025-03-02", avatar: "https://i.pravatar.cc/40?img=4" },
//     { product: "Seed Pack", rating: 3.5, review: "Decent germination rate.", reviewer: "Vikram Singh", date: "2025-03-01", avatar: "https://i.pravatar.cc/40?img=5" },
//   ];

//   useEffect(() => {
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

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         if (res.data && res.data.isAdmin) {
//           setUser(res.data);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/");
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   useEffect(() => {
//     const fetchDashboardStats = async () => {
//       try {
//         const [usersRes, revenueRes, ordersRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/dashboard/total-users", { withCredentials: true }),
//           axios.get("http://localhost:5000/api/dashboard/total-revenue", { withCredentials: true }),
//           axios.get("http://localhost:5000/api/dashboard/total-orders", { withCredentials: true }),
//         ]);
//         setTotalUsers(usersRes.data.totalUsers);
//         setTotalRevenue(revenueRes.data.totalRevenue);
//         setTotalOrders(ordersRes.data.totalOrders);
//       } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//       }
//     };
//     fetchDashboardStats();
//   }, []);

//   // Updated Stock by Brand Fetch with Batch Aggregation
//   useEffect(() => {
//     const fetchStockByBrand = async () => {
//       try {
//         setLoadingStock(true);

//         const [productRes, brandRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//           axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//         ]);

//         const brandMap = brandRes.data.reduce((acc, brand) => {
//           acc[brand._id] = brand.name;
//           return acc;
//         }, {});

//         const stockByBrand = productRes.data.reduce((acc, product) => {
//           const brandId = typeof product.brand === "object" && product.brand?._id ? product.brand._id : product.brand;
//           const brandName = brandMap[brandId] || "Unknown Brand";
          
//           const totalStock = product.variants.reduce((variantSum, variant) => {
//             return variantSum + variant.batches.reduce((batchSum, batch) => batchSum + (batch.stock || 0), 0);
//           }, 0);

//           acc[brandName] = (acc[brandName] || 0) + totalStock;
//           return acc;
//         }, {});

//         const labels = Object.keys(stockByBrand);
//         const data = Object.values(stockByBrand);

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         const gradientColors = labels.map((_, i) => {
//           const gradient = ctx.createLinearGradient(0, 0, 0, 500);
//           gradient.addColorStop(0, ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][i % 5]);
//           gradient.addColorStop(1, darkMode ? "#424242" : "#E0E0E0");
//           return gradient;
//         });

//         setStockByBrandData({
//           labels,
//           datasets: [{
//             data,
//             backgroundColor: gradientColors,
//             borderWidth: 2,
//             borderColor: "#fff",
//           }],
//         });
//       } catch (error) {
//         console.error("Error fetching stock by brand:", error);
//         setStockByBrandData({
//           labels: [],
//           datasets: [{ data: [], backgroundColor: [] }],
//         });
//       } finally {
//         setLoadingStock(false);
//       }
//     };
//     fetchStockByBrand();
//   }, [darkMode]);

//   useEffect(() => {
//     const fetchOrderStats = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/orders/stats", { withCredentials: true });
//         const labels = res.data.map((d) => `Month ${d.month}`);
//         const data = res.data.map((d) => d.count);

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         const gradient = ctx.createLinearGradient(0, 0, 0, 500);
//         gradient.addColorStop(0, "#42a5f5");
//         gradient.addColorStop(1, darkMode ? "#0288d1" : "#81d4fa");

//         setOrderData({
//           labels,
//           datasets: [
//             {
//               label: "Orders",
//               data,
//               borderColor: gradient,
//               backgroundColor: gradient,
//               fill: true,
//               tension: 0.4,
//               pointBackgroundColor: "#fff",
//               pointBorderColor: "#42a5f5",
//               pointBorderWidth: 2,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching order stats:", error);
//       }
//     };
//     fetchOrderStats();
//   }, [darkMode]);

//   useEffect(() => {
//     const fetchSalesDistribution = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/orders/sales", { withCredentials: true });
//         const data = [
//           res.data.find((d) => d._id === "Online")?.total || 0,
//           res.data.find((d) => d._id === "Offline")?.total || 0,
//         ];

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         const onlineGradient = ctx.createLinearGradient(0, 0, 0, 500);
//         onlineGradient.addColorStop(0, "#66bb6a");
//         onlineGradient.addColorStop(1, darkMode ? "#388e3c" : "#a5d6a7");
//         const offlineGradient = ctx.createLinearGradient(0, 0, 0, 500);
//         offlineGradient.addColorStop(0, "#ef5350");
//         offlineGradient.addColorStop(1, darkMode ? "#d81b60" : "#ffcdd2");

//         setSalesData({
//           labels: ["Online", "Offline"],
//           datasets: [
//             {
//               data,
//               backgroundColor: [onlineGradient, offlineGradient],
//               borderWidth: 2,
//               borderColor: "#fff",
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching sales distribution:", error);
//       }
//     };
//     fetchSalesDistribution();
//   }, [darkMode]);

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

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: theme.palette.text.primary,
//           font: { size: isMobile ? 14 : 16, weight: "bold" },
//           padding: 20,
//         },
//       },
//       title: {
//         display: true,
//         color: theme.palette.text.primary,
//         font: { size: isMobile ? 18 : 24, weight: "bold" },
//         padding: { top: 10, bottom: 20 },
//       },
//       tooltip: {
//         backgroundColor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
//         titleColor: darkMode ? "#fff" : "#000",
//         bodyColor: darkMode ? "#ddd" : "#333",
//         borderColor: theme.palette.primary.main,
//         borderWidth: 1,
//         cornerRadius: 8,
//       },
//     },
//     animation: {
//       duration: 1500,
//       easing: "easeOutCubic",
//     },
//     scales: {
//       x: {
//         ticks: { color: theme.palette.text.secondary, font: { size: isMobile ? 12 : 14 } },
//         grid: { display: false },
//       },
//       y: {
//         ticks: { color: theme.palette.text.secondary, font: { size: isMobile ? 12 : 14 } },
//         grid: { color: darkMode ? "#424242" : "#e0e0e0" },
//       },
//     },
//   };

//   // Callback to update low stock count from LowStockNotification
//   const handleLowStockCountUpdate = (count) => {
//     setLowStockCount(count);
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
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
//               Admin Dashboard
//             </Typography>
//             <Tooltip title="Low Stock Alerts">
//               <IconButton
//                 color="inherit"
//                 onClick={() => setShowLowStockCard(!showLowStockCard)}
//                 sx={{ color: "text.primary" }}
//               >
//                 <Badge badgeContent={lowStockCount} color="error">
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>
//             </Tooltip>
//           </Box>

//           <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
//             {[
//               { title: "Total Users", value: totalUsers, color: darkMode ? "#0288d1" : "#42a5f5" },
//               { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: darkMode ? "#d81b60" : "#f06292" },
//               { title: "Total Orders", value: totalOrders, color: darkMode ? "#388e3c" : "#66bb6a" },
//             ].map((stat, index) => (
//               <Grid item xs={12} sm={4} key={index}>
//                 <Card sx={{ bgcolor: stat.color, color: "#fff", transition: "all 0.3s ease" }}>
//                   <CardContent>
//                     <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold" }}>{stat.title}</Typography>
//                     <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 1 }}>{stat.value}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           {showLowStockCard && (
//             <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
//               <Grid item xs={12}>
//                 <Card>
//                   <CardContent>
//                     <LowStockNotification 
//                       darkMode={darkMode} 
//                       onLowStockCountUpdate={handleLowStockCountUpdate} // Pass callback
//                     />
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           )}

//           <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
//             {[
//               { title: "Manage Vendors", desc: "View, add, and update Vendors.", to: "/manage-vendors", color: "#1976d2" },
//               { title: "Manage Category", desc: "View, add, and update Category.", to: "/manage-category", color: "#0288d1" },
//               { title: "Manage Products", desc: "View, add, and update products.", to: "/manage-products", color: "#42a5f5" },
//               { title: "Customer Orders", desc: "View and manage customer orders.", to: "/customer-order", color: "#66bb6a" },
//             ].map((item, index) => (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <Card sx={{ bgcolor: item.color, color: "#fff" }}>
//                   <CardContent>
//                     <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold" }}>{item.title}</Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>{item.desc}</Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button component={Link} to={item.to} size="small" sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
//                       Go to {item.title.split(" ")[1]}
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
//             <Grid item xs={12} md={6}>
//               <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
//                 <CardContent sx={{ height: isMobile ? 300 : 400 }}>
//                   {loadingStock ? (
//                     <Typography>Loading...</Typography>
//                   ) : stockByBrandData.labels.length > 0 && stockByBrandData.datasets[0].data.length > 0 ? (
//                     <Pie
//                       data={stockByBrandData}
//                       options={{
//                         ...chartOptions,
//                         plugins: { ...chartOptions.plugins, title: { text: "Stock by Brand" } },
//                         elements: { arc: { borderWidth: 2 } },
//                       }}
//                     />
//                   ) : (
//                     <Typography>No stock data available</Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
//                 <CardContent sx={{ height: isMobile ? 300 : 400 }}>
//                   <Line
//                     data={orderData}
//                     options={{
//                       ...chartOptions,
//                       plugins: { ...chartOptions.plugins, title: { text: "Monthly Orders" } },
//                       scales: { y: { beginAtZero: true } },
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
//                 <CardContent sx={{ height: isMobile ? 300 : 400 }}>
//                   <Bar
//                     data={salesData}
//                     options={{
//                       ...chartOptions,
//                       plugins: { ...chartOptions.plugins, title: { text: "Sales Distribution" } },
//                       scales: { y: { beginAtZero: true } },
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
//                 <CardContent>
//                   <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 3, textAlign: "center" }}>
//                     Latest Product Reviews
//                   </Typography>
//                   <Divider sx={{ mb: 3, bgcolor: theme.palette.primary.main, height: 2 }} />
//                   {latestReviews.map((review, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         mb: 2,
//                         p: 2,
//                         borderRadius: "12px",
//                         bgcolor: darkMode ? "#2e2e2e" : "#f9f9f9",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           bgcolor: darkMode ? "#424242" : "#e8f5e9",
//                           transform: "scale(1.02)",
//                           boxShadow: darkMode ? "0 4px 15px rgba(255,255,255,0.1)" : "0 4px 15px rgba(0,0,0,0.1)",
//                         },
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                         <Avatar src={review.avatar} alt={review.reviewer} sx={{ width: 50, height: 50, mr: 2 }} />
//                         <Box sx={{ flexGrow: 1 }}>
//                           <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
//                             {review.product}
//                           </Typography>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <StarIcon sx={{ color: "#FFD700", mr: 0.5 }} />
//                             <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "bold" }}>
//                               {review.rating}/5
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontStyle: "italic" }}>
//                         "{review.review}"
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "right" }}>
//                         - {review.reviewer} | {new Date(review.date).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import LowStockNotification from "../components/LowStockNotification";
import {
  Badge,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showLowStockCard, setShowLowStockCard] = useState(false);
  const [loadingStock, setLoadingStock] = useState(true);

  const [stockByBrandData, setStockByBrandData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [orderData, setOrderData] = useState({
    labels: [],
    datasets: [{ label: "Orders", data: [], borderColor: "#42a5f5", fill: false }],
  });
  const [salesData, setSalesData] = useState({
    labels: ["Online", "Offline"],
    datasets: [{ data: [], backgroundColor: ["#66bb6a", "#ef5350"] }],
  });

  const navigate = useNavigate();

  const latestReviews = [
    { product: "Organic Fertilizer", rating: 4.5, review: "Great product, improved my crop yield!", reviewer: "Amit Patel", date: "2025-03-05", avatar: "https://i.pravatar.cc/40?img=1" },
    { product: "Pesticide Spray", rating: 3.8, review: "Effective but a bit pricey.", reviewer: "Priya Sharma", date: "2025-03-04", avatar: "https://i.pravatar.cc/40?img=2" },
    { product: "Drip Irrigation Kit", rating: 4.9, review: "Best investment for my farm!", reviewer: "Rahul Desai", date: "2025-03-03", avatar: "https://i.pravatar.cc/40?img=3" },
    { product: "Soil Enhancer", rating: 4.2, review: "Good quality, easy to use.", reviewer: "Neha Gupta", date: "2025-03-02", avatar: "https://i.pravatar.cc/40?img=4" },
    { product: "Seed Pack", rating: 3.5, review: "Decent germination rate.", reviewer: "Vikram Singh", date: "2025-03-01", avatar: "https://i.pravatar.cc/40?img=5" },
  ];

  // ... (keeping all useEffect hooks unchanged) ...

  useEffect(() => {
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        if (res.data && res.data.isAdmin) {
          setUser(res.data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [usersRes, revenueRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/dashboard/total-users", { withCredentials: true }),
          axios.get("http://localhost:5000/api/dashboard/total-revenue", { withCredentials: true }),
          axios.get("http://localhost:5000/api/dashboard/total-orders", { withCredentials: true }),
        ]);
        setTotalUsers(usersRes.data.totalUsers);
        setTotalRevenue(revenueRes.data.totalRevenue);
        setTotalOrders(ordersRes.data.totalOrders);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchStockByBrand = async () => {
      try {
        setLoadingStock(true);
        const [productRes, brandRes] = await Promise.all([
          axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
          axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
        ]);

        const brandMap = brandRes.data.reduce((acc, brand) => {
          acc[brand._id] = brand.name;
          return acc;
        }, {});

        const stockByBrand = productRes.data.reduce((acc, product) => {
          const brandId = typeof product.brand === "object" && product.brand?._id ? product.brand._id : product.brand;
          const brandName = brandMap[brandId] || "Unknown Brand";
          
          const totalStock = product.variants.reduce((variantSum, variant) => {
            return variantSum + variant.batches.reduce((batchSum, batch) => batchSum + (batch.stock || 0), 0);
          }, 0);

          acc[brandName] = (acc[brandName] || 0) + totalStock;
          return acc;
        }, {});

        const labels = Object.keys(stockByBrand);
        const data = Object.values(stockByBrand);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const gradientColors = labels.map((_, i) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 500);
          gradient.addColorStop(0, ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][i % 5]);
          gradient.addColorStop(1, darkMode ? "#424242" : "#E0E0E0");
          return gradient;
        });

        setStockByBrandData({
          labels,
          datasets: [{
            data,
            backgroundColor: gradientColors,
            borderWidth: 2,
            borderColor: "#fff",
          }],
        });
      } catch (error) {
        console.error("Error fetching stock by brand:", error);
        setStockByBrandData({
          labels: [],
          datasets: [{ data: [], backgroundColor: [] }],
        });
      } finally {
        setLoadingStock(false);
      }
    };
    fetchStockByBrand();
  }, [darkMode]);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/stats", { withCredentials: true });
        const labels = res.data.map((d) => `Month ${d.month}`);
        const data = res.data.map((d) => d.count);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, "#42a5f5");
        gradient.addColorStop(1, darkMode ? "#0288d1" : "#81d4fa");

        setOrderData({
          labels,
          datasets: [
            {
              label: "Orders",
              data,
              borderColor: gradient,
              backgroundColor: gradient,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#42a5f5",
              pointBorderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching order stats:", error);
      }
    };
    fetchOrderStats();
  }, [darkMode]);

  useEffect(() => {
    const fetchSalesDistribution = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/sales", { withCredentials: true });
        const data = [
          res.data.find((d) => d._id === "Online")?.total || 0,
          res.data.find((d) => d._id === "Offline")?.total || 0,
        ];

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const onlineGradient = ctx.createLinearGradient(0, 0, 0, 500);
        onlineGradient.addColorStop(0, "#66bb6a");
        onlineGradient.addColorStop(1, darkMode ? "#388e3c" : "#a5d6a7");
        const offlineGradient = ctx.createLinearGradient(0, 0, 0, 500);
        offlineGradient.addColorStop(0, "#ef5350");
        offlineGradient.addColorStop(1, darkMode ? "#d81b60" : "#ffcdd2");

        setSalesData({
          labels: ["Online", "Offline"],
          datasets: [
            {
              data,
              backgroundColor: [onlineGradient, offlineGradient],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales distribution:", error);
      }
    };
    fetchSalesDistribution();
  }, [darkMode]);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme.palette.text.primary,
          font: { size: isMobile ? 14 : 16, weight: "bold" },
          padding: 20,
        },
      },
      title: {
        display: true,
        color: theme.palette.text.primary,
        font: { size: isMobile ? 18 : 24, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#ddd" : "#333",
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutCubic",
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary, font: { size: isMobile ? 12 : 14 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: theme.palette.text.secondary, font: { size: isMobile ? 12 : 14 } },
        grid: { color: darkMode ? "#424242" : "#e0e0e0" },
      },
    },
  };

  const handleLowStockCountUpdate = (count) => {
    setLowStockCount(count);
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
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
              Admin Dashboard
            </Typography>
            <Tooltip title="Low Stock Alerts">
              <IconButton
                color="inherit"
                onClick={() => setShowLowStockCard(!showLowStockCard)}
                sx={{ color: "text.primary" }}
              >
                <Badge badgeContent={lowStockCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          {/* <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
            {[
              { title: "Total Users", value: totalUsers, color: darkMode ? "#0288d1" : "#42a5f5" },
              { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: darkMode ? "#d81b60" : "#f06292" },
              { title: "Total Orders", value: totalOrders, color: darkMode ? "#388e3c" : "#66bb6a" },
            ].map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ bgcolor: stat.color, color: "#fff", transition: "all 0.3s ease" }}>
                  <CardContent>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold" }}>{stat.title}</Typography>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 1 }}>{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}
          <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
  {[
    { 
      title: "Total Users", 
      value: totalUsers, 
      icon: <PeopleIcon sx={{ fontSize: 40 }} />, 
      gradient: "linear-gradient(135deg, #0288d1 0%, #42a5f5 100%)" 
    },
    { 
      title: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />, 
      gradient: "linear-gradient(135deg, #d81b60 0%, #f06292 100%)" 
    },
    { 
      title: "Total Orders", 
      value: totalOrders, 
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />, 
      gradient: "linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)" 
    },
  ].map((stat, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Card
        sx={{
          background: stat.gradient,
          color: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: darkMode 
              ? "0 8px 30px rgba(255,255,255,0.2)" 
              : "0 8px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
          <Box sx={{ mr: 2 }}>{stat.icon}</Box>
          <Box>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}
            >
              {stat.title}
            </Typography>
            <Typography 
              variant={isMobile ? "h5" : "h3"} 
              sx={{ mt: 1, fontWeight: "bold", lineHeight: 1.2 }}
            >
              {stat.value}
            </Typography>
          </Box>
        </CardContent>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 70%)",
            zIndex: 0,
            opacity: 0.3,
          }}
        />
      </Card>
    </Grid>
  ))}
</Grid>

          {showLowStockCard && (
            <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <LowStockNotification 
                      darkMode={darkMode} 
                      onLowStockCountUpdate={handleLowStockCountUpdate}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
            {[
              { title: "Offline Product Purchase", desc: "Manage offline product purchases.", to: "/offline-order", color: "#1976d2" },
              { title: "Offline Service Booking", desc: "Manage offline service bookings.", to: "/offline-service", color: "#0288d1" },
              { title: "Customer Orders", desc: "View and manage customer orders.", to: "/customer-order", color: "#66bb6a" },
              { title: "Service Booking", desc: "View and manage service bookings.", to: "/admin-service-bookings", color: "#42a5f5" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ bgcolor: item.color, color: "#fff" }}>
                  <CardContent>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold" }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{item.desc}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={Link} to={item.to} size="small" sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                      Go to {item.title.split(" ")[0]}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Rest of the component remains unchanged */}
          <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
                <CardContent sx={{ height: isMobile ? 300 : 400 }}>
                  {loadingStock ? (
                    <Typography>Loading...</Typography>
                  ) : stockByBrandData.labels.length > 0 && stockByBrandData.datasets[0].data.length > 0 ? (
                    <Pie
                      data={stockByBrandData}
                      options={{
                        ...chartOptions,
                        plugins: { ...chartOptions.plugins, title: { text: "Stock by Brand" } },
                        elements: { arc: { borderWidth: 2 } },
                      }}
                    />
                  ) : (
                    <Typography>No stock data available</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
                <CardContent sx={{ height: isMobile ? 300 : 400 }}>
                  <Line
                    data={orderData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { text: "Monthly Orders" } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
                <CardContent sx={{ height: isMobile ? 300 : 400 }}>
                  <Bar
                    data={salesData}
                    options={{
                      ...chartOptions,
                      plugins: { ...chartOptions.plugins, title: { text: "Sales Distribution" } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff", p: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 3, textAlign: "center" }}>
                    Latest Product Reviews
                  </Typography>
                  <Divider sx={{ mb: 3, bgcolor: theme.palette.primary.main, height: 2 }} />
                  {latestReviews.map((review, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: darkMode ? "#2e2e2e" : "#f9f9f9",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: darkMode ? "#424242" : "#e8f5e9",
                          transform: "scale(1.02)",
                          boxShadow: darkMode ? "0 4px 15px rgba(255,255,255,0.1)" : "0 4px 15px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar src={review.avatar} alt={review.reviewer} sx={{ width: 50, height: 50, mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            {review.product}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <StarIcon sx={{ color: "#FFD700", mr: 0.5 }} />
                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "bold" }}>
                              {review.rating}/5
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontStyle: "italic" }}>
                        "{review.review}"
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "right" }}>
                        - {review.reviewer} | {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;