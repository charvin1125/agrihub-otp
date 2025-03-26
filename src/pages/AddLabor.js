import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";

const AddLabor = () => {
  const [labors, setLabors] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [availability, setAvailability] = useState(true);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    fetchLabors();

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

  const fetchLabors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/labor/list", { withCredentials: true });
      setLabors(res.data);
    } catch (error) {
      console.error("Error fetching labors:", error);
    }
  };

  const handleAddOrEditLabor = async () => {
    if (!name || !mobile) {
      alert("Please provide name and mobile number");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Mobile number must be a 10-digit number");
      return;
    }

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/labor/edit/${editId}`,
          { name, mobile, availability },
          { withCredentials: true }
        );
        setLabors(labors.map((labor) => (labor._id === editId ? res.data.labor : labor)));
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/labor/add",
          { name, mobile, availability },
          { withCredentials: true }
        );
        setLabors([...labors, res.data.labor]);
      }
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving labor:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save labor");
    }
  };

  const handleDeleteLabor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this labor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/labor/delete/${id}`, { withCredentials: true });
      setLabors(labors.filter((labor) => labor._id !== id));
    } catch (error) {
      console.error("Error deleting labor:", error);
      alert("Failed to delete labor");
    }
  };

  const handleEditClick = (labor) => {
    setEditId(labor._id);
    setName(labor.name);
    setMobile(labor.mobile);
    setAvailability(labor.availability);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setMobile("");
    setAvailability(true);
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkMode ? "#388E3C" : "#A5D6A7",
            color: darkMode ? "#fff" : "#212121",
            fontWeight: "bold",
          },
          body: { padding: { xs: "8px", sm: "12px" } },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#757575" },
              "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#212121" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
            >
              Manage Labor
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(true)}
            sx={{ mb: 3, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
          >
            Add Labor
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labors.map((labor) => (
                  <TableRow key={labor._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
                    <TableCell sx={{ color: "text.primary" }}>{labor.name}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{labor.mobile}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{labor.availability ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditClick(labor)} sx={{ color: "primary.main" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteLabor(labor._id)} sx={{ color: "error.main" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Labor Dialog */}
          <Dialog open={dialogOpen} onClose={() => { resetForm(); setDialogOpen(false); }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#388E3C" : "#66BB6A", color: "#fff" }}>
              {editId ? "Edit Labor" : "Add Labor"}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <TextField
                label="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                helperText="Enter a 10-digit mobile number"
              />
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ color: "text.primary" }}>Available:</Typography>
                <Switch
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  color="primary"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
              <Button onClick={() => { resetForm(); setDialogOpen(false); }} color="primary" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleAddOrEditLabor}
                color="primary"
                variant="contained"
                sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
              >
                {editId ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AddLabor;