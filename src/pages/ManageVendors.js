import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles/vendor.css"; // Keep if you want additional custom styles

const ManageVendors = () => {
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [vendors, setVendors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    fetchVendors();
    fetchUser();

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

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true });
      setVendors(response.data);
    } catch (error) {
      alert("Failed to fetch vendors");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
      setUser(response.data);
      if (!response.data.isAdmin) navigate("/"); // Redirect non-admins
    } catch (error) {
      console.log("User not logged in");
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      alert("Unauthorized: Admin access only");
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
        alert("Vendor updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
        alert("Vendor added successfully!");
      }
      setVendor({ name: "", email: "", phone: "", address: "" });
      fetchVendors();
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (id, currentVendor) => {
    setVendor(currentVendor);
    setEditId(id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!user?.isAdmin) {
      alert("Only admins can perform this action");
      return;
    }
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vendor/${id}`, { withCredentials: true });
        alert("Vendor deleted successfully!");
        fetchVendors();
      } catch (error) {
        alert("Failed to delete vendor");
      }
    }
  };

  // Theme toggler
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // MUI Theme Configuration with Green Theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" }, // Green shades for agriculture theme
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" }, // Lighter green for secondary
      background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
      text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#757575" },
              "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#212121" },
            },
          },
        },
      },
    },
  });

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
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
              Manage Vendors
            </Typography>
          </Box>

          {/* Vendor Form */}
          {user?.isAdmin ? (
            <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                  {isEditing ? "Edit Vendor" : "Add New Vendor"}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="name"
                        value={vendor.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={vendor.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={vendor.phone}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={vendor.address}
                        onChange={handleChange}
                        multiline
                        rows={isMobile ? 2 : 3}
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth={isMobile}
                        sx={{ mt: 2, py: 1, fontWeight: "bold", bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                      >
                        {isEditing ? "Update Vendor" : "Add Vendor"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" sx={{ color: "secondary.main", mb: 2 }}>
              You do not have permission to manage vendors.
            </Typography>
          )}

          {/* Vendor List */}
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
            Vendor List
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="vendor table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "text.primary", display: { xs: "none", md: "table-cell" } }}>Address</TableCell>
                  {user?.isAdmin && (
                    <TableCell sx={{ fontWeight: "bold", color: "text.primary" }} align="right">
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
                    <TableCell sx={{ color: "text.primary" }}>{v.name}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{v.email}</TableCell>
                    <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
                    <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
                    {user?.isAdmin && (
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(v._id, v)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(v._id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageVendors;