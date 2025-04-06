// // CustomerDashboard.js
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import CustomerSidebar from "../components/CustomerSidebar";
// import {
//   Box,
//   Typography,
//   Breadcrumbs,
//   Link,
//   IconButton,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// const CustomerDashboard = () => {
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();
//   const location = useLocation();

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
//         if (!res.data || res.data.isAdmin) {
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/login");
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
//     },
//   });

//   const getBreadcrumbs = () => {
//     const path = location.pathname.split("/").filter((x) => x);
//     return (
//       <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
//         <Link underline="hover" color="inherit" onClick={() => navigate("/customer-dashboard")}>
//           Dashboard
//         </Link>
//         {path.length > 1 && (
//           <Typography color="text.primary">
//             {path[path.length - 1].replace("-", " ").toUpperCase()}
//           </Typography>
//         )}
//       </Breadcrumbs>
//     );
//   };

//   const renderContent = () => {
//     switch (location.pathname) {
//       case "/customer-dashboard/profile":
//         return (
//           <Card>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>Profile</Typography>
//               <Typography>View and edit your personal information here.</Typography>
//               {/* Add profile form/content here */}
//             </CardContent>
//           </Card>
//         );
//       case "/customer-dashboard/track-order":
//         return (
//           <Card>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>Track Order</Typography>
//               <Typography>Track your current orders here.</Typography>
//               {/* Add order tracking content here */}
//             </CardContent>
//           </Card>
//         );
//       case "/customer-dashboard/my-orders":
//         return (
//           <Card>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>My Orders</Typography>
//               <Typography>View your order history here.</Typography>
//               {/* Add orders list here */}
//             </CardContent>
//           </Card>
//         );
//       case "/customer-dashboard/my-services":
//         return (
//           <Card>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>My Services</Typography>
//               <Typography>View your booked services here.</Typography>
//               {/* Add services list here */}
//             </CardContent>
//           </Card>
//         );
//       default:
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h5" gutterBottom>Welcome to Your Dashboard</Typography>
//                   <Typography>Use the sidebar to navigate through your options.</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         );
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         <CustomerSidebar
//           darkMode={darkMode}
//           isMobile={isMobile}
//           open={sidebarOpen}
//           setOpen={setSidebarOpen}
//           onLogout={handleLogout}
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
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ flexGrow: 1 }}>
//               Customer Dashboard
//             </Typography>
//           </Box>
          
//           {getBreadcrumbs()}
          
//           {renderContent()}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default CustomerDashboard;
// CustomerDashboard.js
// CustomerDashboard.js
// CustomerDashboard.js
// CustomerDashboard.js
// CustomerDashboard.js
// import React, { useState } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { Box, Typography, useMediaQuery } from "@mui/material";
// import CustomerSidebar from "../components/CustomerSidebar"; // Adjust path as needed
// import ProfilePage from "../pages/ProfilePage";
// import MyOrder from "../components/MyOrder";
// import OrderTracking from "../pages/OrderTracking";
// import ServiceBooking from "../pages/ServiceBooking";

// const CustomerDashboard = () => {
//   const [open, setOpen] = useState(true);
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const location = useLocation();

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
//       {/* Sidebar */}
//       <CustomerSidebar isMobile={isMobile} open={open} setOpen={setOpen} />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
//           ml: isMobile ? 0 : open ? "260px" : "70px",
//           transition: "margin-left 0.3s ease-in-out",
//           bgcolor: "#F5F7FA",
//           minHeight: "100vh",
//           width: isMobile ? "100%" : `calc(100% - ${open ? "260px" : "70px"})`,
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3, // Space between elements
//         }}
//       >
//         {/* Page Title */}
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#1976d2",
//             mb: 2,
//             fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//           }}
//         >
//           {location.pathname.includes("profile") && "My Profile"}
//           {location.pathname.includes("previous-orders") && "My Previous Orders"}
//           {location.pathname.includes("order-tracking") && "Order Tracking"}
//           {location.pathname.includes("service-booking") && "Service Booking"}
//           {location.pathname === "/customer-dashboard/" && "Dashboard Overview"}
//         </Typography>

//         {/* Content */}
//         <Box sx={{ flexGrow: 1 }}>
//           <Routes>
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="previous-orders" element={<MyOrder />} />
//             <Route path="order-tracking" element={<OrderTracking />} />
//             <Route path="service-booking" element={<ServiceBooking />} />
//             <Route path="/" element={<Typography variant="body1">Welcome to your dashboard! Select an option from the sidebar to get started.</Typography>} />
//           </Routes>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CustomerDashboard;
// CustomerDashboard.js
// import React, { useState } from "react";
// import { Routes, Route, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
// import { Box, Typography, useMediaQuery } from "@mui/material";
// import CustomerSidebar from "../components/CustomerSidebar";
// import ProfilePage from "../pages/ProfilePage";
// import MyOrder from "../components/MyOrder";
// import OrderTracking from "../pages/OrderTracking";
// import ServiceBooking from "../pages/ServiceBooking";
// import axios from "axios"; // Add axios for logout

// const CustomerDashboard = () => {
//   const [open, setOpen] = useState(true);
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const location = useLocation();
//   const navigate = useNavigate(); // For navigation after logout

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         localStorage.removeItem("user");
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
//       <CustomerSidebar
//         isMobile={isMobile}
//         open={open}
//         setOpen={setOpen}
//         onLogout={handleLogout} // Pass logout function
//       />
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, sm: 3, md: 4 },
//           ml: isMobile ? 0 : open ? "260px" : "70px",
//           transition: "margin-left 0.3s ease-in-out",
//           bgcolor: "#F5F7FA",
//           minHeight: "100vh",
//           width: isMobile ? "100%" : `calc(100% - ${open ? "260px" : "70px"})`,
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#1976d2",
//             mb: 2,
//             fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//           }}
//         >
//           {location.pathname.includes("profile") && "My Profile"}
//           {location.pathname.includes("my-orders") && "My Orders"} // Update path to match sidebar
//           {location.pathname.includes("track-order") && "Order Tracking"} // Update path
//           {location.pathname.includes("my-services") && "Service Booking"} // Update path
//           {location.pathname === "/customer-dashboard" && "Dashboard Overview"}
//         </Typography>
//         <Box sx={{ flexGrow: 1 }}>
//           <Routes>
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="my-orders" element={<MyOrder />} /> {/* Match sidebar path */}
//             <Route path="track-order" element={<OrderTracking />} /> {/* Match sidebar path */}
//             <Route path="my-services" element={<ServiceBooking />} /> {/* Match sidebar path */}
//             <Route path="/" element={<Typography variant="body1">Welcome to your dashboard! Select an option from the sidebar to get started.</Typography>} />
//           </Routes>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CustomerDashboard;
// CustomerDashboard.js
// CustomerDashboard.js
// import React, { useState } from "react";
// import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { Box, Typography, useMediaQuery } from "@mui/material";
// import CustomerSidebar from "../components/CustomerSidebar";
// import ProfilePage from "../pages/ProfilePage";
// import MyOrder from "../components/MyOrder";
// import OrderTracking from "../pages/OrderTracking";
// import ServiceBooking from "../pages/ServiceBooking";
// import axios from "axios";

// const CustomerDashboard = () => {
//   const [open, setOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false); // Add darkMode state if needed
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         localStorage.removeItem("user");
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const sidebarWidth = open ? 260 : 70; // Define sidebar width

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
//       {/* Sidebar */}
//       <CustomerSidebar
//         darkMode={darkMode}
//         isMobile={isMobile}
//         open={open}
//         setOpen={setOpen}
//         onLogout={handleLogout}
//       />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, sm: 3, md: 4 },
//           // Remove margin-left and rely on flexbox to position content
//           bgcolor: darkMode ? "#121212" : "#F5F7FA",
//           color: darkMode ? "#E0E0E0" : "#212121",
//           minHeight: "100vh",
//           width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`, // Ensure width accounts for sidebar
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//           transition: "width 0.3s ease-in-out", // Smooth transition for width
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: darkMode ? "#E94560" : "#1976d2",
//             mb: 2,
//             fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//           }}
//         >
//           {location.pathname === "/customer-dashboard/profile" && "My Profile"}
//           {location.pathname === "/customer-dashboard/my-orders" && "My Orders"}
//           {location.pathname === "/customer-dashboard/track-order" && "Order Tracking"}
//           {location.pathname === "/customer-dashboard/my-services" && "Service Booking"}
//           {location.pathname === "/customer-dashboard" && "Dashboard Overview"}
//         </Typography>
//         <Box sx={{ flexGrow: 1 }}>
//           <Routes>
//             <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
//             <Route path="my-orders" element={<MyOrder />} />
//             <Route path="track-order" element={<OrderTracking />} />
//             <Route path="my-services" element={<ServiceBooking />} />
//             <Route
//               path="/"
//               element={<Typography variant="body1">Welcome to your dashboard! Select an option from the sidebar to get started.</Typography>}
//             />
//           </Routes>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CustomerDashboard;
// CustomerDashboard.js
// import React, { useState } from "react";
// import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { Box, Typography, useMediaQuery } from "@mui/material";
// import CustomerSidebar from "../components/CustomerSidebar";
// import ProfilePage from "../pages/ProfilePage";
// import MyOrder from "../components/MyOrder";
// import OrderTracking from "../pages/OrderTracking";
// import axios from "axios";
// import UserBookings from "../pages/UserBookings";

// const CustomerDashboard = () => {
//   const [open, setOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false); // Add darkMode state if needed
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         localStorage.removeItem("user");
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const sidebarWidth = open ? 260 : 70;

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         minHeight: "100vh",
//         width: "100vw",
//         overflowX: "hidden", // Prevent horizontal scroll on parent
//       }}
//     >
//       {/* Sidebar */}
//       <CustomerSidebar
//         darkMode={darkMode}
//         isMobile={isMobile}
//         open={open}
//         setOpen={setOpen}
//         onLogout={handleLogout}
//       />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, sm: 3, md: 4 },
//           bgcolor: darkMode ? "#121212" : "#F5F7FA",
//           color: darkMode ? "#E0E0E0" : "#212121",
//           minHeight: "100vh",
//           width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
//           overflowX: "hidden", // Prevent horizontal scroll in main content
//           overflowY: "auto", // Allow vertical scroll if needed
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//           transition: "width 0.3s ease-in-out",
//           boxSizing: "border-box", // Ensure padding doesn’t cause overflow
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: darkMode ? "#E94560" : "#1976d2",
//             mb: 2,
//             fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//           }}
//         >
//           {location.pathname === "/customer-dashboard/profile" && "My Profile"}
//           {location.pathname === "/customer-dashboard/my-orders" && "My Orders"}
//           {location.pathname === "/customer-dashboard/track-order" && "Order Tracking"}
//           {location.pathname === "/customer-dashboard/my-bookings" && "Service Booking"}
//           {location.pathname === "/customer-dashboard" && "Dashboard Overview"}
//         </Typography>
//         <Box sx={{ flexGrow: 1, width: "100%", overflowX: "hidden" }}>

// <Routes>
//   <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
//   <Route path="my-orders" element={<MyOrder darkMode={darkMode} />} />
//   <Route path="track-order" element={<OrderTracking darkMode={darkMode} />} />
//   <Route path="my-bookings" element={<UserBookings darkMode={darkMode} />} />
//   <Route
//     path="/"
//     element={<Typography variant="body1">Welcome to your dashboard! Select an option from the sidebar to get started.</Typography>}
//   />
// </Routes>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CustomerDashboard;
// CustomerDashboard.js
// import React, { useState, useEffect } from "react";
// import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   useMediaQuery,
//   Card,
//   CardContent,
//   Button,
//   Grid,
//   CircularProgress,
// } from "@mui/material";
// import CustomerSidebar from "../components/CustomerSidebar";
// import ProfilePage from "../pages/ProfilePage";
// import MyOrder from "../components/MyOrder";
// import OrderTracking from "../pages/OrderTracking";
// import UserBookings from "../pages/UserBookings";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import CloudIcon from "@mui/icons-material/Cloud";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// const CustomerDashboard = () => {
//   const [open, setOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [user, setUser] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [loadingWeather, setLoadingWeather] = useState(true);
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const sidebarWidth = open ? 260 : 70;

//   // Fetch user data
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         setUser(res.data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Fetch weather data (using OpenWeatherMap as an example)
//   useEffect(() => {
//     const fetchWeather = async () => {
//       setLoadingWeather(true);
//       try {
//         // Assuming user's pincode is available in user data; replace with actual logic
//         const pincode = user?.pincode || "400001"; // Default to Mumbai if no pincode
//         const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
//         const res = await axios.get(
//           `https://api.openweathermap.org/data/2.5/weather?zip=${pincode},IN&appid=${apiKey}&units=metric`
//         );
//         setWeather(res.data);
//       } catch (error) {
//         console.error("Error fetching weather:", error);
//         setWeather(null);
//       } finally {
//         setLoadingWeather(false);
//       }
//     };
//     if (user) fetchWeather();
//   }, [user]);

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         localStorage.removeItem("user");
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: darkMode ? "#121212" : "#F5F7FA", paper: darkMode ? "#1E1E1E" : "#FFFFFF" },
//       text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#616161" },
//     },
//     typography: { fontFamily: "'Poppins', sans-serif" },
//   });

//   const DashboardOverview = () => (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
//       {/* Greeting */}
//       <Typography
//         variant="h5"
//         sx={{
//           fontWeight: 700,
//           color: "primary.main",
//           background: "linear-gradient(45deg, #2E7D32, #81C784)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Hello, {user?.firstName || "User"}! Welcome to Your AgriHub Dashboard
//       </Typography>

//       {/* Weather Information */}
//       <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//         <CardContent>
//           <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
//             Weather Today
//           </Typography>
//           {loadingWeather ? (
//             <CircularProgress size={24} sx={{ color: "primary.main" }} />
//           ) : weather ? (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <CloudIcon sx={{ fontSize: 40, color: "secondary.main" }} />
//               <Box>
//                 <Typography variant="body1">
//                   {weather.name}: {weather.main.temp}°C, {weather.weather[0].description}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
//                 </Typography>
//               </Box>
//             </Box>
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               Unable to fetch weather data. Please check your location settings.
//             </Typography>
//           )}
//         </CardContent>
//       </Card>

//       {/* Buy Agricultural Medicines & Tools */}
//       <Box>
//         <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
//           Buy Agricultural Medicines & Tools
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={4}>
//             <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Medicines
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Explore pesticides, fertilizers, and more.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<ShoppingCartIcon />}
//                   onClick={() => navigate("/products/medicines")}
//                   fullWidth
//                 >
//                   Shop Now
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Tools
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                   Find the best tools for your farming needs.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<ShoppingCartIcon />}
//                   onClick={() => navigate("/products/tools")}
//                   fullWidth
//                 >
//                   Shop Now
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Latest Agricultural News, Schemes, and Subsidies */}
//       <Box>
//         <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
//           Latest Updates
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Agricultural News
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   New irrigation techniques boost crop yield by 20% in recent trials.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Government Schemes
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   PM Kisan Scheme: Next installment announced for December 2025.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                   Subsidy Updates
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   50% subsidy on solar pumps extended to small farmers.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           display: "flex",
//           minHeight: "100vh",
//           width: "100vw",
//           overflowX: "hidden",
//         }}
//       >
//         <CustomerSidebar
//           darkMode={darkMode}
//           isMobile={isMobile}
//           open={open}
//           setOpen={setOpen}
//           onLogout={handleLogout}
//         />
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 3, md: 4 },
//             bgcolor: "background.default",
//             color: "text.primary",
//             minHeight: "100vh",
//             width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
//             overflowX: "hidden",
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: 3,
//             transition: "width 0.3s ease-in-out",
//             boxSizing: "border-box",
//           }}
//         >
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: "bold",
//               color: "primary.main",
//               mb: 2,
//               fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//             }}
//           >
//             {location.pathname === "/customer-dashboard/profile" && "My Profile"}
//             {location.pathname === "/customer-dashboard/my-orders" && "My Orders"}
//             {location.pathname === "/customer-dashboard/track-order" && "Order Tracking"}
//             {location.pathname === "/customer-dashboard/my-bookings" && "Service Booking"}
//             {location.pathname === "/customer-dashboard" && "Dashboard Overview"}
//           </Typography>
//           <Box sx={{ flexGrow: 1, width: "100%", overflowX: "hidden" }}>
//             <Routes>
//               <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
//               <Route path="my-orders" element={<MyOrder darkMode={darkMode} />} />
//               <Route path="track-order" element={<OrderTracking darkMode={darkMode} />} />
//               <Route path="my-bookings" element={<UserBookings darkMode={darkMode} />} />
//               <Route path="/" element={<DashboardOverview />} />
//             </Routes>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useMediaQuery,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Container,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import CustomerSidebar from "../components/CustomerSidebar";
import ProfilePage from "../pages/ProfilePage";
import MyOrder from "../components/MyOrder";
import OrderTracking from "../pages/OrderTracking";
import UserBookings from "../pages/UserBookings";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloudIcon from "@mui/icons-material/Cloud";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const CustomerDashboard = () => {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [totalDues, setTotalDues] = useState(0);
  const [loadingDues, setLoadingDues] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarWidth = open ? 260 : 70;

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        // const pincode = user?.pincode || "400001";
        // const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Bardoli&units=metric&appid=8de7852c0d7824f9c8d89ff302db0672`
        );
        setWeather(res.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeather(null);
      } finally {
        setLoadingWeather(false);
      }
    };
    if (user) fetchWeather();
  }, [user]);

  // Fetch total dues
  useEffect(() => {
    const fetchTotalDues = async () => {
      setLoadingDues(true);
      try {
        const mobile = user?.mobile; // Assuming mobile is part of user data
        if (!mobile) throw new Error("Mobile number not found");
        const response = await axios.get(`http://localhost:5000/api/orders/customer/${mobile}`, {
          withCredentials: true,
        });
        setTotalDues(response.data.totalDues || 0);
      } catch (error) {
        console.error("Error fetching total dues:", error);
        setTotalDues(0);
      } finally {
        setLoadingDues(false);
      }
    };
    if (user) fetchTotalDues();
  }, [user]);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: darkMode ? "#0D1B2A" : "#F0F4F8", paper: darkMode ? "#1E1E1E" : "#FFFFFF" },
      text: { primary: darkMode ? "#E0E0E0" : "#1A1A1A", secondary: darkMode ? "#B0B0B0" : "#616161" },
    },
    typography: { fontFamily: "'Poppins', sans-serif" },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            },
            background: darkMode
              ? "linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F7F9F7 100%)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            padding: "10px 20px",
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontWeight: 600,
          },
        },
      },
    },
  });

  const DashboardOverview = () => (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Greeting with User Name */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #2E7D32, #81C784)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Hello, {user?.firstName || "User"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome to Your AgriHub Dashboard
          </Typography>
        </Box>

        {/* Total Dues */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
              Your Outstanding Dues
            </Typography>
            {loadingDues ? (
              <CircularProgress size={24} sx={{ color: "primary.main" }} />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MonetizationOnIcon sx={{ fontSize: 40, color: totalDues > 0 ? "#EF5350" : "secondary.main" }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: totalDues > 0 ? "#EF5350" : "text.primary" }}>
                    ₹{totalDues.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalDues > 0 ? "Pending payment" : "All dues cleared!"}
                  </Typography>
                </Box>
                {totalDues > 0 && (
                  <Chip
                    label="View Orders"
                    color="error"
                    onClick={() => navigate("/customer-dashboard/my-orders")}
                    sx={{ ml: "auto" }}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Weather Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
              Today’s Weather
            </Typography>
            {loadingWeather ? (
              <CircularProgress size={24} sx={{ color: "primary.main" }} />
            ) : weather ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CloudIcon sx={{ fontSize: 40, color: "secondary.main" }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {weather.name}: {weather.main.temp}°C, {weather.weather[0].description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Weather data unavailable.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Buy Agricultural Medicines & Tools */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
            Shop Agricultural Products
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: "Medicines", desc: "Pesticides, fertilizers, and more.", path: "/products" },
              { title: "Tools", desc: "Top-quality farming tools.", path: "/products" },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <AgricultureIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.desc}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate(item.path)}
                        sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" } }}
                      >
                        Shop Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Latest Updates */}
        <Box>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
            Latest Updates
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: "Agricultural News",
                content: "New irrigation techniques boost crop yield by 20%.",
                icon: <AnnouncementIcon />,
              },
              {
                title: "Government Schemes",
                content: "PM Kisan Scheme: Next installment in Dec 2025.",
                icon: <AnnouncementIcon />,
              },
              {
                title: "Subsidy Updates",
                content: "50% subsidy on solar pumps extended.",
                icon: <AnnouncementIcon />,
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        {React.cloneElement(item.icon, { sx: { color: "secondary.main" } })}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden", bgcolor: "background.default" }}>
        <CustomerSidebar
          darkMode={darkMode}
          isMobile={isMobile}
          open={open}
          setOpen={setOpen}
          onLogout={handleLogout}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
            minHeight: "100vh",
            overflowX: "hidden",
            overflowY: "auto",
            transition: "width 0.3s ease-in-out",
            boxSizing: "border-box",
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mb: 3,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                background: "linear-gradient(45deg, #2E7D32, #81C784)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {location.pathname === "/customer-dashboard/profile" && "My Profile"}
              {location.pathname === "/customer-dashboard/my-orders" && "My Orders"}
              {location.pathname === "/customer-dashboard/track-order" && "Order Tracking"}
              {location.pathname === "/customer-dashboard/my-bookings" && "Service Booking"}
              {location.pathname === "/customer-dashboard" && "Dashboard Overview"}
            </Typography>
            <Box sx={{ flexGrow: 1, width: "100%", overflowX: "hidden" }}>
              <Routes>
                <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
                <Route path="my-orders" element={<MyOrder darkMode={darkMode} />} />
                <Route path="track-order" element={<OrderTracking darkMode={darkMode} />} />
                <Route path="my-bookings" element={<UserBookings darkMode={darkMode} />} />
                <Route path="/" element={<DashboardOverview />} />
              </Routes>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDashboard;