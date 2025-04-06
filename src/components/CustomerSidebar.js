// // CustomerSidebar.js
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
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
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import BuildIcon from "@mui/icons-material/Build";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// const CustomerSidebar = ({ darkMode, isMobile, open, setOpen, onLogout }) => {
//   const location = useLocation();

//   const menuItems = [
//     { text: "Profile", icon: <PersonIcon />, path: "/customer-dashboard/profile" },
//     { text: "Track Order", icon: <TrackChangesIcon />, path: "/customer-dashboard/track-order" },
//     { text: "My Orders", icon: <ShoppingCartIcon />, path: "/customer-dashboard/my-orders" },
//     { text: "My Services", icon: <BuildIcon />, path: "/customer-dashboard/my-services" },
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
//         },
//       }}
//     >
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
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF" }}>
//             Customer Portal
//           </Typography>
//         )}
//         {!isMobile && (
//           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//         )}
//       </Box>

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
//               },
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
//             {open && (
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   color: location.pathname === item.path ? (darkMode ? "#FFF" : "#1976d2") : darkMode ? "#E0E0E0" : "#212121",
//                 }}
//               />
//             )}
//           </ListItemButton>
//         ))}
//       </List>

//       <Box sx={{ mt: "auto" }}>
//         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//         <ListItemButton
//           onClick={onLogout}
//           sx={{
//             minHeight: 50,
//             justifyContent: open ? "initial" : "center",
//             px: 2.5,
//             "&:hover": { 
//               bgcolor: darkMode ? "#0F3460" : "#BBDEFB" 
//             },
//           }}
//         >
//           <ListItemIcon 
//             sx={{ 
//               minWidth: open ? 40 : 0, 
//               color: darkMode ? "#E94560" : "#757575" 
//             }}
//           >
//             <ExitToAppIcon />
//           </ListItemIcon>
//           {open && (
//             <ListItemText
//               primary="Logout"
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}
//             />
//           )}
//         </ListItemButton>
//       </Box>
//     </Drawer>
//   );
// };

// export default CustomerSidebar;
// CustomerSidebar.js
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
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
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import BuildIcon from "@mui/icons-material/Build";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// const CustomerSidebar = ({ darkMode = false, isMobile, open, setOpen, onLogout }) => {
//   const location = useLocation();

//   const menuItems = [
//     { text: "Profile", icon: <PersonIcon />, path: "/customer-dashboard/profile" },
//     { text: "Track Order", icon: <TrackChangesIcon />, path: "/customer-dashboard/track-order" },
//     { text: "My Orders", icon: <ShoppingCartIcon />, path: "/customer-dashboard/my-orders" },
//     { text: "My Services", icon: <BuildIcon />, path: "/customer-dashboard/my-services" },
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
//         },
//       }}
//     >
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
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF" }}>
//             Customer Portal
//           </Typography>
//         )}
//         {!isMobile && (
//           <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//         )}
//       </Box>

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
//               },
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
//             {open && (
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   color: location.pathname === item.path ? (darkMode ? "#FFF" : "#1976d2") : darkMode ? "#E0E0E0" : "#212121",
//                 }}
//               />
//             )}
//           </ListItemButton>
//         ))}
//       </List>

//       <Box sx={{ mt: "auto" }}>
//         <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
//         <ListItemButton
//           onClick={onLogout}
//           sx={{
//             minHeight: 50,
//             justifyContent: open ? "initial" : "center",
//             px: 2.5,
//             "&:hover": {
//               bgcolor: darkMode ? "#0F3460" : "#BBDEFB",
//             },
//           }}
//         >
//           <ListItemIcon
//             sx={{
//               minWidth: open ? 40 : 0,
//               color: darkMode ? "#E94560" : "#757575",
//             }}
//           >
//             <ExitToAppIcon />
//           </ListItemIcon>
//           {open && (
//             <ListItemText
//               primary="Logout"
//               sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}
//             />
//           )}
//         </ListItemButton>
//       </Box>
//     </Drawer>
//   );
// };

// export default CustomerSidebar;
// CustomerSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Added for Dashboard
import PersonIcon from "@mui/icons-material/Person";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import HomeIcon from "@mui/icons-material/Home"; // Added for Home
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CustomerSidebar = ({ darkMode = false, isMobile, open, setOpen, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/customer-dashboard" },
    { text: "Profile", icon: <PersonIcon />, path: "/customer-dashboard/profile" },
    { text: "Track Order", icon: <TrackChangesIcon />, path: "/customer-dashboard/track-order" },
    { text: "My Orders", icon: <ShoppingCartIcon />, path: "/customer-dashboard/my-orders" },
    { text: "My Services", icon: <BuildIcon />, path: "/customer-dashboard/my-bookings" },
    { text: "Home", icon: <HomeIcon />, path: "/" },
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
          transition: "width 0.3s ease-in-out",
          background: darkMode
            ? "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)"
            : "#F5F7FA", // Light background matching Admin
          color: darkMode ? "#E0E0E0" : "#212121",
          borderRight: "1px solid #E0E0E0",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: "12px 16px",
          backgroundColor: darkMode ? "#0F3460" : "#4CAF50", // Green header like Admin
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF" }}>
            Customer Portal
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

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
              borderRadius: location.pathname === item.path ? "0.5rem" : "0", // Match Admin
              bgcolor: location.pathname === item.path ? "#0caf601a" : "transparent", // Green tint for active
              "&:hover": {
                bgcolor: "#0caf601a", // Hover effect like Admin
                "& .MuiListItemIcon was": { color: "#0caf60" },
                transition: "background-color 0.3s ease-in-out",
              },
              transition: "background-color 0.3s ease-in-out",
              margin: "4px 8px", // Match Admin spacing
              width: location.pathname === item.path ? "calc(100% - 8px)" : "auto", // Match Admin active width
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 0,
                color: location.pathname === item.path ? "#0caf60" : darkMode ? "#E94560" : "#757575", // Green for active
              }}
            >
              {item.icon}
            </ListItemIcon>
            <Collapse in={open} orientation="horizontal" timeout="auto">
              <ListItemText
                primary={item.text}
                sx={{
                  color: location.pathname === item.path ? "#0caf60" : darkMode ? "#E0E0E0" : "#212121", // Green for active
                  "& .MuiTypography-root": {
                    fontWeight: location.pathname === item.path ? 600 : 500, // Bold for active
                    fontSize: "14px",
                  },
                }}
              />
            </Collapse>
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ bgcolor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
        <ListItemButton
          onClick={onLogout}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            "&:hover": {
              bgcolor: darkMode ? "#0F3460" : "#0caf601a", // Hover effect like Admin
            },
            transition: "background-color 0.3s ease-in-out",
            margin: "4px 8px", // Match Admin spacing
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: open ? 40 : 0,
              color: darkMode ? "#E94560" : "#757575",
            }}
          >
            <ExitToAppIcon />
          </ListItemIcon>
          <Collapse in={open} orientation="horizontal" timeout="auto">
            <ListItemText
              primary="Logout"
              sx={{
                color: darkMode ? "#E0E0E0" : "#212121",
                "& .MuiTypography-root": { fontWeight: 500 },
              }}
            />
          </Collapse>
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default CustomerSidebar;