  // import React, { useEffect, useState } from "react";
  // import { Link, useNavigate, useLocation } from "react-router-dom";
  // import axios from "axios";
  // import {
  //   Drawer,
  //   List,
  //   ListItemButton,
  //   ListItemIcon,
  //   ListItemText,
  //   Divider,
  //   IconButton,
  //   Typography,
  //   Box,
  //   Avatar,
  //   Collapse,
  // } from "@mui/material";
  // import DashboardIcon from "@mui/icons-material/Dashboard";
  // import StorefrontIcon from "@mui/icons-material/Storefront";
  // import CategoryIcon from "@mui/icons-material/Category";
  // import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
  // import PeopleIcon from "@mui/icons-material/People";
  // import LocalOfferIcon from "@mui/icons-material/LocalOffer";
  // import ExitToAppIcon from "@mui/icons-material/ExitToApp";
  // import MenuIcon from "@mui/icons-material/Menu";
  // import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  // import InventoryIcon from "@mui/icons-material/Inventory";
  // import ReceiptIcon from "@mui/icons-material/Receipt";
  // import StoreIcon from "@mui/icons-material/Store";
  // import BuildIcon from "@mui/icons-material/Build"; // Icon for Services
  // import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
  // import Brightness4Icon from "@mui/icons-material/Brightness4";
  // import Brightness7Icon from "@mui/icons-material/Brightness7";
  // import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; // Icon for Manage Orders
  // import WorkIcon from "@mui/icons-material/Work"; // Icon for Manage Labor
  // import "./styles/Sidebar.css";

  // const Sidebar = ({ darkMode, toggleDarkMode, onToggleSidebar, isMobile, open, setOpen }) => {
  //   const [user, setUser] = useState(null);
  //   const navigate = useNavigate();
  //   const location = useLocation();

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       try {
  //         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
  //         setUser(res.data);
  //         localStorage.setItem("user", JSON.stringify(res.data));
  //       } catch (error) {
  //         console.error("Error fetching user:", error);
  //         setUser(null);
  //         localStorage.removeItem("user");
  //       }
  //     };
  //     fetchUser();
  //   }, []);

  //   const handleLogout = () => {
  //     axios
  //       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
  //       .then(() => {
  //         const savedDataKey = `savedCustomerData_${user?.username}`;
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("cart");
  //         localStorage.removeItem(savedDataKey);
  //         setUser(null);
  //         navigate("/login");
  //       })
  //       .catch((error) => console.error("Logout failed:", error));
  //   };

  //   const menuItems = [
  //     { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
  //     { text: "Manage Vendors", icon: <StorefrontIcon />, path: "/manage-vendors" },
  //     { text: "Manage Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
  //     { text: "Manage Category", icon: <CategoryIcon />, path: "/manage-category" },
  //     { text: "Manage Customers", icon: <PeopleIcon />, path: "/manage-customers" },
  //     { text: "Manage Promotions", icon: <LocalOfferIcon />, path: "/manage-promotions" },
  //     { text: "Inventory Management", icon: <InventoryIcon />, path: "/manage-inventory" },
  //     { text: "Customer Orders", icon: <ReceiptIcon />, path: "/customer-order" },
  //     { text: "Offline Purchase", icon: <StoreIcon />, path: "/offline-order" },
  //     { text: "Services", icon: <BuildIcon />, path: "/manage-service" },
  //     { text: "Service Bookings", icon: <AssignmentTurnedInIcon />, path: "/admin-service-bookings" },
  //     { text: "Manage Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" }, // New: Manage Orders
  //     { text: "Offline Service", icon: <BuildIcon />, path: "/offline-service" }, // New: Offline Service
  //     { text: "Manage Labor", icon: <WorkIcon />, path: "/add-labor" }, // New: Manage Labor
  //   ];

  //   return (
  //     <Drawer
  //       variant={isMobile ? "temporary" : "permanent"}
  //       open={isMobile ? open : true}
  //       onClose={() => isMobile && setOpen(false)}
  //       sx={{
  //         width: open ? 260 : 70,
  //         flexShrink: 0,
  //         "& .MuiDrawer-paper": {
  //           width: open ? 260 : 70,
  //           boxSizing: "border-box",
  //           transition: "width 0.3s ease",
  //           background: darkMode
  //             ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
  //             : "linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)",
  //           color: darkMode ? "#E0E0E0" : "#212121",
  //           borderRight: "none",
  //           zIndex: 1200,
  //         },
  //       }}
  //     >
  //       {/* Header Section */}
  //       <Box
  //         sx={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: open ? "space-between" : "center",
  //           padding: "12px 16px",
  //           backgroundColor: darkMode ? "#0F3460" : "#1976d2",
  //         }}
  //       >
  //         {open && (
  //           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
  //             AgriHub Admin
  //           </Typography>
  //         )}
  //         {!isMobile && (
  //           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
  //             {open ? <ChevronLeftIcon /> : <MenuIcon />}
  //           </IconButton>
  //         )}
  //       </Box>

  //       {/* User Profile */}
  //       {open && user && (
  //         <Box sx={{ padding: "16px", textAlign: "center", bgcolor: darkMode ? "#16213E" : "#E0E0E0" }}>
  //           <Avatar
  //             sx={{
  //               bgcolor: "#4CAF50",
  //               margin: "0 auto",
  //               width: 50,
  //               height: 50,
  //               border: `2px solid ${darkMode ? "#E94560" : "#1976d2"}`,
  //             }}
  //           >
  //             {user.username?.charAt(0) || "U"}
  //           </Avatar>
  //           <Typography variant="body1" sx={{ mt: 1, color: darkMode ? "#FFF" : "#212121", fontWeight: "medium" }}>
  //             {user.username || "Admin"}
  //           </Typography>
  //           <Typography variant="caption" sx={{ color: darkMode ? "#B0B0B0" : "#757575" }}>
  //             {user.email || "admin@agrihub.com"}
  //           </Typography>
  //         </Box>
  //       )}
  //       <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

  //       {/* Menu Items */}
  //       <List>
  //         {menuItems.map((item) => (
  //           <ListItemButton
  //             key={item.text}
  //             component={Link}
  //             to={item.path}
  //             onClick={() => isMobile && setOpen(false)} // Close sidebar on mobile after click
  //             sx={{
  //               minHeight: 50,
  //               justifyContent: open ? "initial" : "center",
  //               px: 2.5,
  //               bgcolor: location.pathname === item.path ? (darkMode ? "#0F3460" : "#BBDEFB") : "transparent",
  //               "&:hover": {
  //                 bgcolor: darkMode ? "#0F3460" : "#BBDEFB",
  //                 "& .MuiListItemIcon-root": { color: darkMode ? "#FFF" : "#1976d2" },
  //               },
  //               transition: "background-color 0.2s ease",
  //             }}
  //           >
  //             <ListItemIcon
  //               sx={{
  //                 minWidth: open ? 40 : 0,
  //                 color: location.pathname === item.path ? (darkMode ? "#E94560" : "#1976d2") : darkMode ? "#E94560" : "#757575",
  //               }}
  //             >
  //               {item.icon}
  //             </ListItemIcon>
  //             <Collapse in={open} orientation="horizontal">
  //               <ListItemText
  //                 primary={item.text}
  //                 sx={{
  //                   color: location.pathname === item.path ? (darkMode ? "#FFF" : "#1976d2") : darkMode ? "#E0E0E0" : "#212121",
  //                   "& .MuiTypography-root": { fontWeight: 500 },
  //                 }}
  //               />
  //             </Collapse>
  //           </ListItemButton>
  //         ))}
  //       </List>

  //       {/* Theme Toggle and Logout */}
  //       <Box sx={{ mt: "auto" }}>
  //         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
  //         {open && (
  //           <ListItemButton onClick={toggleDarkMode} sx={{ justifyContent: "initial", px: 2.5 }}>
  //             <ListItemIcon sx={{ minWidth: 40, color: darkMode ? "#E94560" : "#757575" }}>
  //               {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
  //             </ListItemIcon>
  //             <ListItemText
  //               primary={darkMode ? "Light Mode" : "Dark Mode"}
  //               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
  //             />
  //           </ListItemButton>
  //         )}
  //         <ListItemButton
  //           onClick={handleLogout}
  //           sx={{
  //             justifyContent: open ? "initial" : "center",
  //             "&:hover": { bgcolor: darkMode ? "#0F3460" : "#BBDEFB" },
  //             transition: "background-color 0.2s ease",
  //           }}
  //         >
  //           <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: darkMode ? "#E94560" : "#757575" }}>
  //             <ExitToAppIcon />
  //           </ListItemIcon>
  //           <Collapse in={open} orientation="horizontal">
  //             <ListItemText
  //               primary="Logout"
  //               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
  //             />
  //           </Collapse>
  //         </ListItemButton>
  //       </Box>
  //     </Drawer>
  //   );
  // };

  // export default Sidebar;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   IconButton,
//   Typography,
//   Box,
//   Avatar,
//   Collapse,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PeopleIcon from "@mui/icons-material/People";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import BuildIcon from "@mui/icons-material/Build";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import WorkIcon from "@mui/icons-material/Work";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import MenuIcon from "@mui/icons-material/Menu";
// import CategoryIcon from "@mui/icons-material/Category";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import "./styles/Sidebar.css";

// const Sidebar = ({ darkMode, toggleDarkMode, onToggleSidebar, isMobile, open, setOpen }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         setUser(res.data);
//         localStorage.setItem("user", JSON.stringify(res.data));
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//         localStorage.removeItem("user");
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         const savedDataKey = `savedCustomerData_${user?.username}`;
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("cart");
//         localStorage.removeItem(savedDataKey);
//         setUser(null);
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const menuItems = [
//     { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
//     { text: "Manage Vendor", icon: <StorefrontIcon />, path: "/manage-vendors" },
//     { text: "Manage Category", icon: <CategoryIcon />, path: "/manage-category  " },
//     { text: "Manage Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
//     { text: "Manage Customers", icon: <PeopleIcon />, path: "/manage-customers" },
//     { text: "Manage Inventory", icon: <InventoryIcon />, path: "/manage-inventory" },
//     { text: "Manage Services", icon: <BuildIcon />, path: "/manage-service" },
//     { text: "Manage Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" },
//     { text: "Manage Labor", icon: <WorkIcon />, path: "/add-labor" },
//   ];

//   return (
//     <Drawer
//       variant={isMobile ? "temporary" : "permanent"}
//       open={isMobile ? open : true}
//       onClose={() => isMobile && setOpen(false)}
//       sx={{
//         width: open ? 260 : 70,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: open ? 260 : 70,
//           boxSizing: "border-box",
//           transition: "width 0.3s ease",
//           background: darkMode
//             ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
//             : "linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)",
//           color: darkMode ? "#E0E0E0" : "#212121",
//           borderRight: "none",
//           zIndex: 1200,
//         },
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: open ? "space-between" : "center",
//           padding: "12px 16px",
//           backgroundColor: darkMode ? "#0F3460" : "#1976d2",
//         }}
//       >
//         {open && (
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
//             AgriHub Admin
//           </Typography>
//         )}
//         {!isMobile && (
//           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//         )}
//       </Box>

//       {/* User Profile */}
//       {open && user && (
//         <Box sx={{ padding: "16px", textAlign: "center", bgcolor: darkMode ? "#16213E" : "#E0E0E0" }}>
//           <Avatar
//             sx={{
//               bgcolor: "#4CAF50",
//               margin: "0 auto",
//               width: 50,
//               height: 50,
//               border: `2px solid ${darkMode ? "#E94560" : "#1976d2"}`,
//             }}
//           >
//             {user.username?.charAt(0) || "U"}
//           </Avatar>
//           <Typography variant="body1" sx={{ mt: 1, color: darkMode ? "#FFF" : "#212121", fontWeight: "medium" }}>
//             {user.username || "Admin"}
//           </Typography>
//           <Typography variant="caption" sx={{ color: darkMode ? "#B0B0B0" : "#757575" }}>
//             {user.email || "admin@agrihub.com"}
//           </Typography>
//         </Box>
//       )}
//       <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

//       {/* Menu Items */}
//       <List>
//         {menuItems.map((item) => (
//           <ListItemButton
//             key={item.text}
//             component={Link}
//             to={item.path}
//             onClick={() => isMobile && setOpen(false)}
//             sx={{
//               minHeight: 50,
//               justifyContent: open ? "initial" : "center",
//               px: 2.5,
//               bgcolor: location.pathname === item.path ? (darkMode ? "#0F3460" : "#BBDEFB") : "transparent",
//               "&:hover": {
//                 bgcolor: darkMode ? "#0F3460" : "#BBDEFB",
//                 "& .MuiListItemIcon-root": { color: darkMode ? "#FFF" : "#1976d2" },
//               },
//               transition: "background-color 0.2s ease",
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: open ? 40 : 0,
//                 color: location.pathname === item.path ? (darkMode ? "#E94560" : "#1976d2") : darkMode ? "#E94560" : "#757575",
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             <Collapse in={open} orientation="horizontal">
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   color: location.pathname === item.path ? (darkMode ? "#FFF" : "#1976d2") : darkMode ? "#E0E0E0" : "#212121",
//                   "& .MuiTypography-root": { fontWeight: 500 },
//                 }}
//               />
//             </Collapse>
//           </ListItemButton>
//         ))}
//       </List>

//       {/* Theme Toggle and Logout */}
//       <Box sx={{ mt: "auto" }}>
//         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//         {open && (
//           <ListItemButton onClick={toggleDarkMode} sx={{ justifyContent: "initial", px: 2.5 }}>
//             <ListItemIcon sx={{ minWidth: 40, color: darkMode ? "#E94560" : "#757575" }}>
//               {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//             </ListItemIcon>
//             <ListItemText
//               primary={darkMode ? "Light Mode" : "Dark Mode"}
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </ListItemButton>
//         )}
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             justifyContent: open ? "initial" : "center",
//             "&:hover": { bgcolor: darkMode ? "#0F3460" : "#BBDEFB" },
//             transition: "background-color 0.2s ease",
//           }}
//         >
//           <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: darkMode ? "#E94560" : "#757575" }}>
//             <ExitToAppIcon />
//           </ListItemIcon>
//           <Collapse in={open} orientation="horizontal">
//             <ListItemText
//               primary="Logout"
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </Collapse>
//         </ListItemButton>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   IconButton,
//   Typography,
//   Box,
//   Avatar,
//   Collapse,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PeopleIcon from "@mui/icons-material/People";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import BuildIcon from "@mui/icons-material/Build";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import WorkIcon from "@mui/icons-material/Work";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import MenuIcon from "@mui/icons-material/Menu";
// import CategoryIcon from "@mui/icons-material/Category";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import "./styles/Sidebar.css";

// const Sidebar = ({ darkMode, toggleDarkMode, onToggleSidebar, isMobile, open, setOpen }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         setUser(res.data);
//         localStorage.setItem("user", JSON.stringify(res.data));
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//         localStorage.removeItem("user");
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         const savedDataKey = `savedCustomerData_${user?.username}`;
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("cart");
//         localStorage.removeItem(savedDataKey);
//         setUser(null);
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const menuItems = [
//     { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
//     { text: "Manage Vendor", icon: <StorefrontIcon />, path: "/manage-vendors" },
//     { text: "Manage Category", icon: <CategoryIcon />, path: "/manage-category" },
//     { text: "Manage Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
//     { text: "Manage Customers", icon: <PeopleIcon />, path: "/manage-customers" },
//     { text: "Manage Inventory", icon: <InventoryIcon />, path: "/manage-inventory" },
//     { text: "Manage Services", icon: <BuildIcon />, path: "/manage-service" },
//     { text: "Manage Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" },
//     { text: "Manage Labor", icon: <WorkIcon />, path: "/add-labor" },
//   ];

//   return (
//     <Drawer
//       variant={isMobile ? "temporary" : "permanent"}
//       open={isMobile ? open : true}
//       onClose={() => isMobile && setOpen(false)}
//       sx={{
//         width: open ? 260 : 70,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: open ? 260 : 70,
//           boxSizing: "border-box",
//           transition: "width 0.3s ease",
//           background: darkMode
//             ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
//             : "linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)",
//           color: darkMode ? "#E0E0E0" : "#212121",
//           borderRight: "none",
//           zIndex: 1200,
//         },
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: open ? "space-between" : "center",
//           padding: "12px 16px",
//           backgroundColor: darkMode ? "#0F3460" : "#4CAF50", // Changed from #1976d2 to #4CAF50
//         }}
//       >
//         {open && (
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
//             AgriHub Admin
//           </Typography>
//         )}
//         {!isMobile && (
//           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//         )}
//       </Box>

//       {/* User Profile */}
//       {open && user && (
//         <Box sx={{ padding: "16px", textAlign: "center", bgcolor: darkMode ? "#16213E" : "#E0E0E0" }}>
//           <Avatar
//             sx={{
//               bgcolor: "#4CAF50",
//               margin: "0 auto",
//               width: 50,
//               height: 50,
//               border: `2px solid ${darkMode ? "#E94560" : "#4CAF50"}`, // Changed from #1976d2 to #4CAF50
//             }}
//           >
//             {user.username?.charAt(0) || "U"}
//           </Avatar>
//           <Typography variant="body1" sx={{ mt: 1, color: darkMode ? "#FFF" : "#212121", fontWeight: "medium" }}>
//             {user.username || "Admin"}
//           </Typography>
//           <Typography variant="caption" sx={{ color: darkMode ? "#B0B0B0" : "#757575" }}>
//             {user.email || "admin@agrihub.com"}
//           </Typography>
//         </Box>
//       )}
//       <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

//       {/* Menu Items */}
//       <List>
//         {menuItems.map((item) => (
//           <ListItemButton
//             key={item.text}
//             component={Link}
//             to={item.path}
//             onClick={() => isMobile && setOpen(false)}
//             sx={{
//               minHeight: 50,
//               justifyContent: open ? "initial" : "center",
//               px: 2.5,
//               bgcolor: location.pathname === item.path ? (darkMode ? "#0F3460" : "#C8E6C9") : "transparent", // Changed from #BBDEFB to #C8E6C9 (light green)
//               "&:hover": {
//                 bgcolor: darkMode ? "#0F3460" : "#C8E6C9", // Changed from #BBDEFB to #C8E6C9
//                 "& .MuiListItemIcon-root": { color: darkMode ? "#FFF" : "#4CAF50" }, // Changed from #1976d2 to #4CAF50
//               },
//               transition: "background-color 0.2s ease",
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: open ? 40 : 0,
//                 color: location.pathname === item.path ? (darkMode ? "#E94560" : "#4CAF50") : darkMode ? "#E94560" : "#757575", // Changed from #1976d2 to #4CAF50
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             <Collapse in={open} orientation="horizontal">
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   color: location.pathname === item.path ? (darkMode ? "#FFF" : "#4CAF50") : darkMode ? "#E0E0E0" : "#212121", // Changed from #1976d2 to #4CAF50
//                   "& .MuiTypography-root": { fontWeight: 500 },
//                 }}
//               />
//             </Collapse>
//           </ListItemButton>
//         ))}
//       </List>

//       {/* Theme Toggle and Logout */}
//       <Box sx={{ mt: "auto" }}>
//         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//         {open && (
//           <ListItemButton onClick={toggleDarkMode} sx={{ justifyContent: "initial", px: 2.5 }}>
//             <ListItemIcon sx={{ minWidth: 40, color: darkMode ? "#E94560" : "#757575" }}>
//               {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//             </ListItemIcon>
//             <ListItemText
//               primary={darkMode ? "Light Mode" : "Dark Mode"}
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </ListItemButton>
//         )}
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             justifyContent: open ? "initial" : "center",
//             "&:hover": { bgcolor: darkMode ? "#0F3460" : "#C8E6C9" }, // Changed from #BBDEFB to #C8E6C9
//             transition: "background-color 0.2s ease",
//           }}
//         >
//           <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: darkMode ? "#E94560" : "#757575" }}>
//             <ExitToAppIcon />
//           </ListItemIcon>
//           <Collapse in={open} orientation="horizontal">
//             <ListItemText
//               primary="Logout"
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </Collapse>
//         </ListItemButton>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   IconButton,
//   Typography,
//   Box,
//   Avatar,
//   Collapse,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PeopleIcon from "@mui/icons-material/People";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import HelpIcon from "@mui/icons-material/Help";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import EmailIcon from "@mui/icons-material/Email";
// import ChatIcon from "@mui/icons-material/Chat";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // Icon for AI
// import "./styles/Sidebar.css";

// const Sidebar = ({ darkMode, toggleDarkMode, onToggleSidebar, isMobile, open, setOpen }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         setUser(res.data);
//         localStorage.setItem("user", JSON.stringify(res.data));
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//         localStorage.removeItem("user");
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     axios
//       .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
//       .then(() => {
//         const savedDataKey = `savedCustomerData_${user?.username}`;
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("cart");
//         localStorage.removeItem(savedDataKey);
//         setUser(null);
//         navigate("/login");
//       })
//       .catch((error) => console.error("Logout failed:", error));
//   };

//   const menuItems = [
//     { text: "AI", icon: <AutoAwesomeIcon />, path: "/ai" },
//     { text: "Projects", icon: <StorefrontIcon />, path: "/projects" },
//     { text: "Customer", icon: <PeopleIcon />, path: "/manage-customers" },
//     { text: "Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
//     { text: "Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" },
//     { text: "Account", icon: <InventoryIcon />, path: "/account" },
//     { text: "Help Center", icon: <HelpIcon />, path: "/help-center" },
//     { text: "Calendar", icon: <CalendarTodayIcon />, path: "/calendar" },
//     { text: "File Manager", icon: <EmailIcon />, path: "/file-manager" },
//     { text: "Mail", icon: <EmailIcon />, path: "/mail" },
//     { text: "Chat", icon: <ChatIcon />, path: "/chat" },
//   ];

//   return (
//     <Drawer
//       variant={isMobile ? "temporary" : "permanent"}
//       open={isMobile ? open : true}
//       onClose={() => isMobile && setOpen(false)}
//       sx={{
//         width: open ? 260 : 70,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: open ? 260 : 70,
//           boxSizing: "border-box",
//           transition: "width 0.3s ease-in-out", // Smooth transition for width
//           background: darkMode
//             ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
//             : "#F5F7FA", // Light background similar to the image
//           color: darkMode ? "#E0E0E0" : "#212121",
//           borderRight: "1px solid #E0E0E0",
//           zIndex: 1200,
//         },
//       }}
//       ModalProps={{
//         keepMounted: true, // Better performance on mobile
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: open ? "space-between" : "center",
//           padding: "12px 16px",
//           backgroundColor: darkMode ? "#0F3460" : "#4CAF50", // Green header
//           borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         {open && (
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
//             AgriHub Admin
//           </Typography>
//         )}
//         {!isMobile && (
//           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//         )}
//       </Box>

//       {/* User Profile */}
//       {open && user && (
//         <Box sx={{ padding: "16px", textAlign: "center", bgcolor: darkMode ? "#16213E" : "#E8F5E9" }}>
//           <Avatar
//             sx={{
//               bgcolor: "#4CAF50",
//               margin: "0 auto",
//               width: 50,
//               height: 50,
//               border: `2px solid ${darkMode ? "#E94560" : "#4CAF50"}`,
//             }}
//           >
//             {user.username?.charAt(0) || "U"}
//           </Avatar>
//           <Typography variant="body1" sx={{ mt: 1, color: darkMode ? "#FFF" : "#212121", fontWeight: "medium" }}>
//             {user.username || "Admin"}
//           </Typography>
//           <Typography variant="caption" sx={{ color: darkMode ? "#B0B0B0" : "#757575" }}>
//             {user.email || "admin@agrihub.com"}
//           </Typography>
//         </Box>
//       )}
//       <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

//       {/* Menu Items */}
//       <List>
//         {menuItems.map((item) => (
//           <ListItemButton
//             key={item.text}
//             component={Link}
//             to={item.path}
//             onClick={() => isMobile && setOpen(false)}
//             sx={{
//               minHeight: 48,
//               justifyContent: open ? "initial" : "center",
//               px: 2.5,
//               borderRadius: location.pathname === item.path ? "8px" : "0", // Rounded corners for active item
//               bgcolor: location.pathname === item.path ? "#E8F5E9" : "transparent", // Light green background for active
//               "&:hover": {
//                 bgcolor: "#E8F5E9",
//                 "& .MuiListItemIcon-root": { color: "#4CAF50" },
//                 transition: "background-color 0.3s ease-in-out", // Smooth transition for hover
//               },
//               transition: "background-color 0.3s ease-in-out", // Smooth transition for active state
//               margin: "4px 8px", // Margin to create space around items
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: open ? 40 : 0,
//                 color: location.pathname === item.path ? "#4CAF50" : "#757575", // Green icon for active
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             <Collapse in={open} orientation="horizontal" timeout="auto">
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   color: location.pathname === item.path ? "#4CAF50" : "#212121", // Green text for active
//                   "& .MuiTypography-root": { fontWeight: 500, fontSize: "14px" },
//                 }}
//               />
//             </Collapse>
//           </ListItemButton>
//         ))}
//       </List>

//       {/* Theme Toggle and Logout */}
//       <Box sx={{ mt: "auto" }}>
//         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//         {open && (
//           <ListItemButton onClick={toggleDarkMode} sx={{ justifyContent: "initial", px: 2.5, margin: "4px 8px" }}>
//             <ListItemIcon sx={{ minWidth: 40, color: darkMode ? "#E94560" : "#757575" }}>
//               {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//             </ListItemIcon>
//             <ListItemText
//               primary={darkMode ? "Light Mode" : "Dark Mode"}
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </ListItemButton>
//         )}
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             justifyContent: open ? "initial" : "center",
//             "&:hover": { bgcolor: darkMode ? "#0F3460" : "#E8F5E9" },
//             transition: "background-color 0.3s ease-in-out",
//             margin: "4px 8px",
//           }}
//         >
//           <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: darkMode ? "#E94560" : "#757575" }}>
//             <ExitToAppIcon />
//           </ListItemIcon>
//           <Collapse in={open} orientation="horizontal" timeout="auto">
//             <ListItemText
//               primary="Logout"
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
//             />
//           </Collapse>
//         </ListItemButton>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Box,
  Avatar,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WorkIcon from "@mui/icons-material/Work";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./styles/Sidebar.css";

const Sidebar = ({ darkMode, toggleDarkMode, onToggleSidebar, isMobile, open, setOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
      .then(() => {
        const savedDataKey = `savedCustomerData_${user?.username}`;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        localStorage.removeItem(savedDataKey);
        setUser(null);
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
    { text: "Manage Vendor", icon: <StorefrontIcon />, path: "/manage-vendors" },
    { text: "Manage Category", icon: <CategoryIcon />, path: "/manage-category" },
    { text: "Manage Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
    { text: "Manage Customers", icon: <PeopleIcon />, path: "/manage-customers" },
    { text: "Manage Inventory", icon: <InventoryIcon />, path: "/manage-inventory" },
    { text: "Manage Services", icon: <BuildIcon />, path: "/manage-service" },
    { text: "Manage Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" },
    { text: "Manage Labor", icon: <WorkIcon />, path: "/add-labor" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={() => isMobile && setOpen(false)}
      sx={{
        width: open ? 260 : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 260 : 70,
          boxSizing: "border-box",
          transition: "width 0.3s ease-in-out", // Smooth transition for width
          background: darkMode
            ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
            : "#F5F7FA", // Light background
          color: darkMode ? "#E0E0E0" : "#212121",
          borderRight: "1px solid #E0E0E0",
          zIndex: 1200,
        },
      }}
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: "12px 16px",
          backgroundColor: darkMode ? "#0F3460" : "#4CAF50", // Green header
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
            AgriHub Admin
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      {/* User Profile */}
      {open && user && (
        <Box sx={{ padding: "16px", textAlign: "center", bgcolor: darkMode ? "#16213E" : "#E8F5E9" }}>
          <Avatar
            sx={{
              bgcolor: "#4CAF50",
              margin: "0 auto",
              width: 50,
              height: 50,
              border: `2px solid ${darkMode ? "#E94560" : "#4CAF50"}`,
            }}
          >
            {user.username?.charAt(0) || "U"}
          </Avatar>
          <Typography variant="body1" sx={{ mt: 1, color: darkMode ? "#FFF" : "#212121", fontWeight: "medium" }}>
            {user.username || "Admin"}
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? "#B0B0B0" : "#757575" }}>
            {user.email || "admin@agrihub.com"}
          </Typography>
        </Box>
      )}
      <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => isMobile && setOpen(false)}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              borderRadius: location.pathname === item.path ? "0.5rem" : "0", // Border radius 0.5rem for active item
              bgcolor: location.pathname === item.path ? "#0caf601a" : "transparent", // Background color for active
              "&:hover": {
                bgcolor: "#0caf601a",
                "& .MuiListItemIcon-root": { color: "#0caf60" },
                transition: "background-color 0.3s ease-in-out", // Smooth transition for hover
              },
              transition: "background-color 0.3s ease-in-out", // Smooth transition for active state
              margin: "4px 8px", // Margin to create space around items
              width: location.pathname === item.path ? "calc(100% - 8px)" : "auto", // Slightly increase width for active item
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 0,
                color: location.pathname === item.path ? "#0caf60" : "#757575", // Text/icon color for active
              }}
            >
              {item.icon}
            </ListItemIcon>
            <Collapse in={open} orientation="horizontal" timeout="auto">
              <ListItemText
                primary={item.text}
                sx={{
                  color: location.pathname === item.path ? "#0caf60" : "#212121", // Text color for active
                  "& .MuiTypography-root": { 
                    fontWeight: location.pathname === item.path ? 600 : 500, // Increase font weight for active
                    fontSize: "14px",
                  },
                }}
              />
            </Collapse>
          </ListItemButton>
        ))}
      </List>

      {/* Theme Toggle and Logout */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
        {open && (
          <ListItemButton onClick={toggleDarkMode} sx={{ justifyContent: "initial", px: 2.5, margin: "4px 8px" }}>
            <ListItemIcon sx={{ minWidth: 40, color: darkMode ? "#E94560" : "#757575" }}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText
              primary={darkMode ? "Light Mode" : "Dark Mode"}
              sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
            />
          </ListItemButton>
        )}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            justifyContent: open ? "initial" : "center",
            "&:hover": { bgcolor: darkMode ? "#0F3460" : "#0caf601a" },
            transition: "background-color 0.3s ease-in-out",
            margin: "4px 8px",
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: darkMode ? "#E94560" : "#757575" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <Collapse in={open} orientation="horizontal" timeout="auto">
            <ListItemText
              primary="Logout"
              sx={{ color: darkMode ? "#E0E0E0" : "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
            />
          </Collapse>
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;