// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Menu,
//   MenuItem,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Badge,
//   Button,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import CloseIcon from "@mui/icons-material/Close";
// import Logo from "../img/logo-1-removebg.png";

// const NAVBAR_START = "#B3D8A8";
// const NAVBAR_END = "#3D8D7A";

// const NavigationBar = () => {
//   const [user, setUser] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery("(max-width:600px)");

//   const updateCartCount = () => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartCount(storedCart.length);
//   };

//   useEffect(() => {
//     updateCartCount();

//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users/profile", {
//           withCredentials: true,
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Fetch user error:", error.response?.data || error.message);
//         setUser(null);
//       }
//     };
//     fetchUser();

//     window.addEventListener("cartUpdated", updateCartCount);
//     return () => window.removeEventListener("cartUpdated", updateCartCount);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
//       setUser(null);
//       localStorage.removeItem("cart");
//       setCartCount(0);
//       handleMenuClose();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data || error.message);
//       alert("Logout failed: " + (error.response?.data.message || "Unknown error"));
//     }
//   };

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const toggleDrawer = (open) => () => setMobileOpen(open);

//   const theme = createTheme({
//     palette: {
//       mode: "light",
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: "#FFFFFF", paper: "#FFF" },
//       text: { primary: "#1A1A1A", secondary: "#616161" },
//     },
//     components: {
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             background: `linear-gradient(135deg, ${NAVBAR_START} 0%, ${NAVBAR_END} 100%)`,
//             boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "16px",
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
//             padding: { xs: "8px 16px", md: "10px 24px" },
//             color: "#1A1A1A",
//             backgroundColor: "rgba(255,255,255,0.1)",
//             "&:hover": {
//               backgroundColor: "#81C784",
//               color: "#FFF",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiDrawer: {
//         styleOverrides: {
//           paper: {
//             background: `linear-gradient(180deg, ${NAVBAR_START} 0%, #E8F5E9 100%)`,
//             color: "#1A1A1A",
//             width: { xs: "80vw", sm: "320px" },
//             borderRadius: "0 16px 16px 0",
//             boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
//           },
//         },
//       },
//       MuiMenuItem: {
//         styleOverrides: {
//           root: {
//             fontFamily: "'Poppins', sans-serif",
//             fontSize: "1rem",
//             padding: "10px 20px",
//             color: "#1A1A1A",
//             "&:hover": {
//               backgroundColor: "#E8F5E9",
//               color: "#2E7D32",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiIconButton: {
//         styleOverrides: {
//           root: {
//             color: "#1A1A1A",
//             "&:hover": {
//               backgroundColor: "rgba(129,199,132,0.2)",
//             },
//           },
//         },
//       },
//     },
//     typography: {
//       fontFamily: "'Poppins', sans-serif",
//     },
//   });

//   const menuItems = [
//     { text: "Home", path: "/" },
//     { text: "Services", path: "/services" },
//     { text: "Products", path: "/products" },
//     { text: "About", path: "/about" },
//     { text: "Contact", path: "/contact" },
//   ];

//   const drawerContent = (
//     <Box
//       sx={{
//         width: { xs: "80vw", sm: "320px" },
//         height: "100%",
//         p: { xs: 2, sm: 3 },
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: { xs: 2, sm: 3 },
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: 700, color: "#2E7D32", fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
//         >
//           AgriHub
//         </Typography>
//         <IconButton onClick={toggleDrawer(false)}>
//           <CloseIcon sx={{ fontSize: "2rem", color: "#2E7D32" }} />
//         </IconButton>
//       </Box>

//       <List sx={{ flexGrow: 1 }}>
//         {menuItems.map((item) => (
//           <ListItem
//             key={item.text}
//             button
//             component={Link}
//             to={item.path}
//             onClick={toggleDrawer(false)}
//             sx={{
//               py: { xs: 1.5, sm: 2 },
//               mb: 1,
//               borderRadius: "12px",
//               "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//               transition: "all 0.3s ease",
//             }}
//           >
//             <ListItemText
//               primary={item.text}
//               primaryTypographyProps={{
//                 fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                 fontWeight: 500,
//               }}
//             />
//           </ListItem>
//         ))}
//         {user ? (
//           <>
//             {user.isAdmin && (
//               <ListItem
//                 button
//                 component={Link}
//                 to="/admin-dashboard"
//                 onClick={toggleDrawer(false)}
//                 sx={{
//                   py: { xs: 1.5, sm: 2 },
//                   mb: 1,
//                   borderRadius: "12px",
//                   "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <ListItemText
//                   primary="Admin Dashboard"
//                   primaryTypographyProps={{
//                     fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                     fontWeight: 500,
//                   }}
//                 />
//               </ListItem>
//             )}
//             <ListItem
//               button
//               component={Link}
//               to="/cart"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ShoppingCartIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
//               <ListItemText
//                 primary={`Cart (${cartCount})`}
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//             <ListItem
//               button
//               onClick={handleLogout}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Logout"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//           </>
//         ) : (
//           <>
//             <ListItem
//               button
//               component={Link}
//               to="/login"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Login"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//             <ListItem
//               button
//               component={Link}
//               to="/register"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Register"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <AppBar position="fixed">
//         <Toolbar
//           sx={{
//             py: { xs: 1.5, sm: 2, md: 2.5 }, // Increased height
//             px: { xs: 2, sm: 3 },
//             justifyContent: "space-between",
//             alignItems: "center",
//             minHeight: { xs: 70, sm: 80, md: 90 }, // Larger navbar
//           }}
//         >
//           {/* Mobile Menu Icon */}
//           {isMobile && (
//             <IconButton
//               edge="start"
//               onClick={toggleDrawer(true)}
//               sx={{ mr: 1, p: 0.75 }}
//             >
//               <MenuIcon sx={{ fontSize: { xs: "2rem", sm: "2.25rem" }, color: "#1A1A1A" }} />
//             </IconButton>
//           )}

//           {/* Logo */}
//           <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
//             <Link to="/">
//               <img
//                 src={Logo}
//                 alt="AgriHub Logo"
//                 style={{
//                   height: isMobile ? "40px" : "50px", // Increased logo size
//                   width: "auto",
//                   maxHeight: "80px",
//                   transition: "transform 0.3s ease",
//                 }}
//                 onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                 onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=Logo")}
//               />
//             </Link>
//           </Box>

//           {/* Desktop Navigation */}
//           {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: { sm: 2, md: 3 },
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             >
//               {menuItems.map((item) => (
//                 <Button
//                   key={item.text}
//                   component={Link}
//                   to={item.path}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//               {user?.isAdmin && (
//                 <Button component={Link} to="/admin-dashboard">
//                   Admin
//                 </Button>
//               )}
//               <IconButton
//                 component={Link}
//                 to="/cart"
//                 sx={{ p: 1 }}
//               >
//                 <Badge badgeContent={cartCount} color="error">
//                   <ShoppingCartIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 onClick={handleMenuOpen}
//                 sx={{ p: 1 }}
//               >
//                 <AccountCircleIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
//               </IconButton>
//             </Box>
//           )}

//           {/* Mobile Icons */}
//           {isMobile && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//               <IconButton
//                 component={Link}
//                 to="/cart"
//                 sx={{ p: 0.75 }}
//               >
//                 <Badge badgeContent={cartCount} color="error">
//                   <ShoppingCartIcon sx={{ fontSize: "1.75rem" }} />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 onClick={handleMenuOpen}
//                 sx={{ p: 0.75 }}
//               >
//                 <AccountCircleIcon sx={{ fontSize: "1.75rem" }} />
//               </IconButton>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{
//           "& .MuiPaper-root": {
//             bgcolor: "#FFF",
//             borderRadius: "16px",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
//             minWidth: "200px",
//           },
//         }}
//       >
//         {user ? (
//           [
//             <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>
//               Profile {user.isAdmin ? "(Admin)" : ""}
//             </MenuItem>,
//             <MenuItem key="bookings" component={Link} to="/my-bookings" onClick={handleMenuClose}>
//               My Bookings
//             </MenuItem>,
//             <MenuItem key="track-order" component={Link} to="/order-tracking" onClick={handleMenuClose}>
//               Track Order
//             </MenuItem>,
//             <MenuItem key="my-previousbill" component={Link} to="/previous-bills" onClick={handleMenuClose}>
//               My Previous Order
//             </MenuItem>,
//             user.isAdmin && (
//               <MenuItem key="admin" component={Link} to="/admin-dashboard" onClick={handleMenuClose}>
//                 Admin Dashboard
//               </MenuItem>
//             ),
//             <MenuItem key="logout" onClick={handleLogout}>
//               Logout
//             </MenuItem>,
//           ]
//         ) : (
//           [
//             <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
//               Login
//             </MenuItem>,
//             <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>
//               Register
//             </MenuItem>,
//           ]
//         )}
//       </Menu>

//       {/* Mobile Drawer */}
//       <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
//         {drawerContent}
//       </Drawer>

//       {/* Spacer */}
//       <Box sx={{ height: { xs: 70, sm: 80, md: 90 } }} />
//     </ThemeProvider>
//   );
// };

// export default NavigationBar;
// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Menu,
//   MenuItem,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Badge,
//   Button,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import CloseIcon from "@mui/icons-material/Close";
// import Logo from "../img/logo-1-removebg.png";

// const NAVBAR_START = "#B3D8A8";
// const NAVBAR_END = "#3D8D7A";

// const NavigationBar = () => {
//   const [user, setUser] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery("(max-width:600px)");

//   const updateCartCount = () => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartCount(storedCart.length);
//   };

//   useEffect(() => {
//     updateCartCount();

//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users/profile", {
//           withCredentials: true,
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Fetch user error:", error.response?.data || error.message);
//         setUser(null);
//       }
//     };
//     fetchUser();

//     window.addEventListener("cartUpdated", updateCartCount);
//     return () => window.removeEventListener("cartUpdated", updateCartCount);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
//       setUser(null);
//       localStorage.removeItem("cart");
//       setCartCount(0);
//       handleMenuClose();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data || error.message);
//       alert("Logout failed: " + (error.response?.data.message || "Unknown error"));
//     }
//   };

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const toggleDrawer = (open) => () => setMobileOpen(open);

//   const theme = createTheme({
//     palette: {
//       mode: "light",
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: "#FFFFFF", paper: "#FFF" },
//       text: { primary: "#1A1A1A", secondary: "#616161" },
//     },
//     components: {
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             background: `linear-gradient(135deg, ${NAVBAR_START} 0%, ${NAVBAR_END} 100%)`,
//             boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "16px",
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
//             padding: { xs: "8px 16px", md: "10px 24px" },
//             color: "#1A1A1A",
//             backgroundColor: "rgba(255,255,255,0.1)",
//             "&:hover": {
//               backgroundColor: "#81C784",
//               color: "#FFF",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiDrawer: {
//         styleOverrides: {
//           paper: {
//             background: `linear-gradient(180deg, ${NAVBAR_START} 0%, #E8F5E9 100%)`,
//             color: "#1A1A1A",
//             width: { xs: "80vw", sm: "320px" },
//             borderRadius: "0 16px 16px 0",
//             boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
//           },
//         },
//       },
//       MuiMenuItem: {
//         styleOverrides: {
//           root: {
//             fontFamily: "'Poppins', sans-serif",
//             fontSize: "1rem",
//             padding: "10px 20px",
//             color: "#1A1A1A",
//             "&:hover": {
//               backgroundColor: "#E8F5E9",
//               color: "#2E7D32",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiIconButton: {
//         styleOverrides: {
//           root: {
//             color: "#1A1A1A",
//             "&:hover": {
//               backgroundColor: "rgba(129,199,132,0.2)",
//             },
//           },
//         },
//       },
//     },
//     typography: {
//       fontFamily: "'Poppins', sans-serif",
//     },
//   });

//   const menuItems = [
//     { text: "Home", path: "/" },
//     { text: "Services", path: "/services" },
//     { text: "Products", path: "/products" },
//     { text: "About", path: "/about" },
//     { text: "Contact", path: "/contact" },
//   ];

//   const drawerContent = (
//     <Box
//       sx={{
//         width: { xs: "80vw", sm: "320px" },
//         height: "100%",
//         p: { xs: 2, sm: 3 },
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: { xs: 2, sm: 3 },
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: 700, color: "#2E7D32", fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
//         >
//           AgriHub
//         </Typography>
//         <IconButton onClick={toggleDrawer(false)}>
//           <CloseIcon sx={{ fontSize: "2rem", color: "#2E7D32" }} />
//         </IconButton>
//       </Box>

//       <List sx={{ flexGrow: 1 }}>
//         {menuItems.map((item) => (
//           <ListItem
//             key={item.text}
//             button
//             component={Link}
//             to={item.path}
//             onClick={toggleDrawer(false)}
//             sx={{
//               py: { xs: 1.5, sm: 2 },
//               mb: 1,
//               borderRadius: "12px",
//               "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//               transition: "all 0.3s ease",
//             }}
//           >
//             <ListItemText
//               primary={item.text}
//               primaryTypographyProps={{
//                 fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                 fontWeight: 500,
//               }}
//             />
//           </ListItem>
//         ))}
//         {user ? (
//           <>
//             <ListItem
//               button
//               component={Link}
//               to="/customer-dashboard"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="My Dashboard"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//             {user.isAdmin && (
//               <ListItem
//                 button
//                 component={Link}
//                 to="/admin-dashboard"
//                 onClick={toggleDrawer(false)}
//                 sx={{
//                   py: { xs: 1.5, sm: 2 },
//                   mb: 1,
//                   borderRadius: "12px",
//                   "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <ListItemText
//                   primary="Admin Dashboard"
//                   primaryTypographyProps={{
//                     fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                     fontWeight: 500,
//                   }}
//                 />
//               </ListItem>
//             )}
//             <ListItem
//               button
//               component={Link}
//               to="/cart"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ShoppingCartIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
//               <ListItemText
//                 primary={`Cart (${cartCount})`}
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//             <ListItem
//               button
//               onClick={handleLogout}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Logout"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//           </>
//         ) : (
//           <>
//             <ListItem
//               button
//               component={Link}
//               to="/login"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Login"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//             <ListItem
//               button
//               component={Link}
//               to="/register"
//               onClick={toggleDrawer(false)}
//               sx={{
//                 py: { xs: 1.5, sm: 2 },
//                 mb: 1,
//                 borderRadius: "12px",
//                 "&:hover": { bgcolor: "#81C784", color: "#FFF" },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <ListItemText
//                 primary="Register"
//                 primaryTypographyProps={{
//                   fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                   fontWeight: 500,
//                 }}
//               />
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <AppBar position="fixed">
//         <Toolbar
//           sx={{
//             py: { xs: 1.5, sm: 2, md: 2.5 },
//             px: { xs: 2, sm: 3 },
//             justifyContent: "space-between",
//             alignItems: "center",
//             minHeight: { xs: 70, sm: 80, md: 90 },
//           }}
//         >
//           {isMobile && (
//             <IconButton
//               edge="start"
//               onClick={toggleDrawer(true)}
//               sx={{ mr: 1, p: 0.75 }}
//             >
//               <MenuIcon sx={{ fontSize: { xs: "2rem", sm: "2.25rem" }, color: "#1A1A1A" }} />
//             </IconButton>
//           )}

//           <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
//             <Link to="/">
//               <img
//                 src={Logo}
//                 alt="AgriHub Logo"
//                 style={{
//                   height: isMobile ? "40px" : "50px",
//                   width: "auto",
//                   maxHeight: "80px",
//                   transition: "transform 0.3s ease",
//                 }}
//                 onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                 onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=Logo")}
//               />
//             </Link>
//           </Box>

//           {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: { sm: 2, md: 3 },
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             >
//               {menuItems.map((item) => (
//                 <Button
//                   key={item.text}
//                   component={Link}
//                   to={item.path}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//               {user && (
//                 <Button component={Link} to="/customer-dashboard">
//                   My Dashboard
//                 </Button>
//               )}
//               {user?.isAdmin && (
//                 <Button component={Link} to="/admin-dashboard">
//                   Admin
//                 </Button>
//               )}
//               <IconButton
//                 component={Link}
//                 to="/cart"
//                 sx={{ p: 1 }}
//               >
//                 <Badge badgeContent={cartCount} color="error">
//                   <ShoppingCartIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 onClick={handleMenuOpen}
//                 sx={{ p: 1 }}
//               >
//                 <AccountCircleIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
//               </IconButton>
//             </Box>
//           )}

//           {isMobile && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//               <IconButton
//                 component={Link}
//                 to="/cart"
//                 sx={{ p: 0.75 }}
//               >
//                 <Badge badgeContent={cartCount} color="error">
//                   <ShoppingCartIcon sx={{ fontSize: "1.75rem" }} />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 onClick={handleMenuOpen}
//                 sx={{ p: 0.75 }}
//               >
//                 <AccountCircleIcon sx={{ fontSize: "1.75rem" }} />
//               </IconButton>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{
//           "& .MuiPaper-root": {
//             bgcolor: "#FFF",
//             borderRadius: "16px",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
//             minWidth: "200px",
//           },
//         }}
//       >
//         {user ? (
//           [
//             <MenuItem key="dashboard" component={Link} to="/customer-dashboard" onClick={handleMenuClose}>
//               My Dashboard
//             </MenuItem>,
//             <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>
//               Profile {user.isAdmin ? "(Admin)" : ""}
//             </MenuItem>,
//             <MenuItem key="bookings" component={Link} to="/my-bookings" onClick={handleMenuClose}>
//               My Bookings
//             </MenuItem>,
//             <MenuItem key="track-order" component={Link} to="/order-tracking" onClick={handleMenuClose}>
//               Track Order
//             </MenuItem>,
//             <MenuItem key="my-previousbill" component={Link} to="/previous-bills" onClick={handleMenuClose}>
//               My Previous Order
//             </MenuItem>,
//             user.isAdmin && (
//               <MenuItem key="admin" component={Link} to="/admin-dashboard" onClick={handleMenuClose}>
//                 Admin Dashboard
//               </MenuItem>
//             ),
//             <MenuItem key="logout" onClick={handleLogout}>
//               Logout
//             </MenuItem>,
//           ]
//         ) : (
//           [
//             <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
//               Login
//             </MenuItem>,
//             <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>
//               Register
//             </MenuItem>,
//           ]
//         )}
//       </Menu>

//       <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
//         {drawerContent}
//       </Drawer>

//       <Box sx={{ height: { xs: 70, sm: 80, md: 90 } }} />
//     </ThemeProvider>
//   );
// };

// export default NavigationBar;
import React, { useEffect, useState } from "react";
import '../fonts/fonts.css'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../img/logo-1-removebg.png";

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
  };

  useEffect(() => {
    updateCartCount();

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Fetch user error:", error.response?.data || error.message);
        setUser(null);
      }
    };
    fetchUser();

    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("cart");
      setCartCount(0);
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      alert("Logout failed: " + (error.response?.data.message || "Unknown error"));
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: "#FFFFFF", paper: "#FFF" },
      text: { primary: "#1A1A1A", secondary: "#616161" },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "#FBFFE4",
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "1.1rem", // Reduced from 1.2rem
            fontFamily: "'Winky Sans', sans-serif", // Changed to Winky Sans
            padding: { xs: "8px 16px", md: "10px 24px" },
            color: "#1A1A1A",
            backgroundColor: "transparent",
            position: "relative",
            overflow: "hidden",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 0,
              height: "2px",
              backgroundColor: "#2E7D32",
              transition: "width 0.3s ease-in-out",
            },
            "&:hover": {
              backgroundColor: "transparent",
              color: "#2E7D32",
              "&:after": {
                width: "100%",
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: "#FBFFE4",
            color: "#1A1A1A",
            width: { xs: "80vw", sm: "320px" },
            borderRadius: "0 16px 16px 0",
            boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: "'Winky Sans', sans-serif", // Changed to Winky Sans
            fontSize: "1.1rem", // Reduced from 1.2rem
            fontWeight: 500,
            padding: "10px 20px",
            color: "#1A1A1A",
            backgroundColor: "transparent",
            position: "relative",
            overflow: "hidden",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 0,
              height: "2px",
              backgroundColor: "#2E7D32",
              transition: "width 0.3s ease-in-out",
            },
            "&:hover": {
              backgroundColor: "transparent",
              color: "#2E7D32",
              "&:after": {
                width: "100%",
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "#1A1A1A",
            "&:hover": {
              backgroundColor: "rgba(129,199,132,0.2)",
            },
          },
        },
      },
    },
    typography: {
      fontFamily: "'Winky Sans', sans-serif", // Changed to Winky Sans
    },
  });

  const menuItems = [
    { text: "Services", path: "/services" },
    { text: "Products", path: "/products" },
    { text: "About", path: "/about" },
    { text: "Contact", path: "/contact" },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: { xs: "80vw", sm: "320px" },
        height: "100%",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#2E7D32", fontSize: { xs: "1.5rem", sm: "1.75rem" }, fontFamily: "'Winky Sans', sans-serif" }}
        >
          AgriHub
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon sx={{ fontSize: "2rem", color: "#2E7D32" }} />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={Link}
            to={item.path}
            onClick={toggleDrawer(false)}
            sx={{
              py: { xs: 1.5, sm: 2 },
              mb: 1,
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 0,
                height: "2px",
                backgroundColor: "#2E7D32",
                transition: "width 0.3s ease-in-out",
              },
              "&:hover": {
                bgcolor: "transparent",
                color: "#2E7D32",
                "&:after": {
                  width: "100%",
                },
              },
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "1.1rem", // Reduced from 1.2rem
                fontWeight: 500,
                fontFamily: "'Winky Sans', sans-serif", // Changed to Winky Sans
              }}
            />
          </ListItem>
        ))}
        {user ? (
          <>
            <ListItem
              button
              component={Link}
              to="/customer-dashboard"
              onClick={toggleDrawer(false)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: "2px",
                  backgroundColor: "#2E7D32",
                  transition: "width 0.3s ease-in-out",
                },
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#2E7D32",
                  "&:after": {
                    width: "100%",
                  },
                },
              }}
            >
              <ListItemText
                primary="My Dashboard"
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  fontFamily: "'Winky Sans', sans-serif",
                }}
              />
            </ListItem>
            {user.isAdmin && (
              <ListItem
                button
                component={Link}
                to="/admin-dashboard"
                onClick={toggleDrawer(false)}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  mb: 1,
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: "2px",
                    backgroundColor: "#2E7D32",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "#2E7D32",
                    "&:after": {
                      width: "100%",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    fontFamily: "'Winky Sans', sans-serif",
                  }}
                />
              </ListItem>
            )}
            <ListItem
              button
              component={Link}
              to="/cart"
              onClick={toggleDrawer(false)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <ShoppingBagIcon sx={{ mr: 1, fontSize: "1.5rem" }} />
              <ListItemText
                primary={`Cart (${cartCount})`}
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  fontFamily: "'Winky Sans', sans-serif",
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                py: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: "2px",
                  backgroundColor: "#2E7D32",
                  transition: "width 0.3s ease-in-out",
                },
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#2E7D32",
                  "&:after": {
                    width: "100%",
                  },
                },
              }}
            >
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  fontFamily: "'Winky Sans', sans-serif",
                }}
              />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={toggleDrawer(false)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: "2px",
                  backgroundColor: "#2E7D32",
                  transition: "width 0.3s ease-in-out",
                },
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#2E7D32",
                  "&:after": {
                    width: "100%",
                  },
                },
              }}
            >
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  fontFamily: "'Winky Sans', sans-serif",
                }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={toggleDrawer(false)}
              sx={{
                py: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: "2px",
                  backgroundColor: "#2E7D32",
                  transition: "width 0.3s ease-in-out",
                },
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#2E7D32",
                  "&:after": {
                    width: "100%",
                  },
                },
              }}
            >
              <ListItemText
                primary="Register"
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  fontFamily: "'Winky Sans', sans-serif",
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            py: { xs: 1.5, sm: 2, md: 2.5 },
            px: { xs: 2, sm: 3 },
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 70, sm: 80, md: 90 },
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1, p: 0.75 }}
            >
              <MenuIcon sx={{ fontSize: { xs: "2rem", sm: "2.25rem" }, color: "#1A1A1A" }} />
            </IconButton>
          )}

          {/* Left Section - Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Link to="/">
              <img
                src={Logo}
                alt="AgriHub Logo"
                style={{
                  height: isMobile ? "40px" : "50px",
                  width: "auto",
                  maxHeight: "80px",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=Logo")}
              />
            </Link>
          </Box>

          {/* Center Section - Menu Items */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { sm: 2, md: 3 },
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                >
                  {item.text}
                </Button>
              ))}
              {user && (
                <Button component={Link} to="/customer-dashboard">
                  My Dashboard
                </Button>
              )}
              {user?.isAdmin && (
                <Button component={Link} to="/admin-dashboard">
                  Admin
                </Button>
              )}
            </Box>
          )}

          {/* Right Section - Icons */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ p: 1 }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingBagIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 1 }}
              >
                <AccountCircleIcon sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }} />
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ p: 0.75 }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingBagIcon sx={{ fontSize: "1.75rem" }} />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0.75 }}
              >
                <AccountCircleIcon sx={{ fontSize: "1.75rem" }} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#FBFFE4",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            minWidth: "200px",
          },
        }}
      >
        {user ? (
          [
            <MenuItem key="dashboard" component={Link} to="/customer-dashboard" onClick={handleMenuClose}>
              My Dashboard
            </MenuItem>,
            <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>
              Profile {user.isAdmin ? "(Admin)" : ""}
            </MenuItem>,
            <MenuItem key="bookings" component={Link} to="/my-bookings" onClick={handleMenuClose}>
              My Bookings
            </MenuItem>,
            <MenuItem key="track-order" component={Link} to="/order-tracking" onClick={handleMenuClose}>
              Track Order
            </MenuItem>,
            <MenuItem key="my-previousbill" component={Link} to="/previous-bills" onClick={handleMenuClose}>
              My Previous Order
            </MenuItem>,
            user.isAdmin && (
              <MenuItem key="admin" component={Link} to="/admin-dashboard" onClick={handleMenuClose}>
                Admin Dashboard
              </MenuItem>
            ),
            <MenuItem key="logout" onClick={handleLogout}>
              Logout
            </MenuItem>,
          ]
        ) : (
          [
            <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>,
            <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>
              Register
            </MenuItem>,
          ]
        )}
      </Menu>

      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Box sx={{ height: { xs: 70, sm: 80, md: 90 } }} />
    </ThemeProvider>
  );
};

export default NavigationBar;