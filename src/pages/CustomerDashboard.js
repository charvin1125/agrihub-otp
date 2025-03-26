// CustomerDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CustomerSidebar from "../components/CustomerSidebar";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CustomerDashboard = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();
  const location = useLocation();

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
        if (!res.data || res.data.isAdmin) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
      text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
    },
  });

  const getBreadcrumbs = () => {
    const path = location.pathname.split("/").filter((x) => x);
    return (
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/customer-dashboard")}>
          Dashboard
        </Link>
        {path.length > 1 && (
          <Typography color="text.primary">
            {path[path.length - 1].replace("-", " ").toUpperCase()}
          </Typography>
        )}
      </Breadcrumbs>
    );
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/customer-dashboard/profile":
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Profile</Typography>
              <Typography>View and edit your personal information here.</Typography>
              {/* Add profile form/content here */}
            </CardContent>
          </Card>
        );
      case "/customer-dashboard/track-order":
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Track Order</Typography>
              <Typography>Track your current orders here.</Typography>
              {/* Add order tracking content here */}
            </CardContent>
          </Card>
        );
      case "/customer-dashboard/my-orders":
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>My Orders</Typography>
              <Typography>View your order history here.</Typography>
              {/* Add orders list here */}
            </CardContent>
          </Card>
        );
      case "/customer-dashboard/my-services":
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>My Services</Typography>
              <Typography>View your booked services here.</Typography>
              {/* Add services list here */}
            </CardContent>
          </Card>
        );
      default:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Welcome to Your Dashboard</Typography>
                  <Typography>Use the sidebar to navigate through your options.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CustomerSidebar
          darkMode={darkMode}
          isMobile={isMobile}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          onLogout={handleLogout}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ flexGrow: 1 }}>
              Customer Dashboard
            </Typography>
          </Box>
          
          {getBreadcrumbs()}
          
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDashboard;