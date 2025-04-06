// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Switch,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "../components/Sidebar";

// const AddLabor = () => {
//   const [labors, setLabors] = useState([]);
//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [editId, setEditId] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   useEffect(() => {
//     fetchLabors();

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

//   const fetchLabors = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/labor/list", { withCredentials: true });
//       setLabors(res.data);
//     } catch (error) {
//       console.error("Error fetching labors:", error);
//     }
//   };

//   const handleAddOrEditLabor = async () => {
//     if (!name || !mobile) {
//       alert("Please provide name and mobile number");
//       return;
//     }

//     if (!/^[0-9]{10}$/.test(mobile)) {
//       alert("Mobile number must be a 10-digit number");
//       return;
//     }

//     try {
//       if (editId) {
//         const res = await axios.put(
//           `http://localhost:5000/api/labor/edit/${editId}`,
//           { name, mobile, availability },
//           { withCredentials: true }
//         );
//         setLabors(labors.map((labor) => (labor._id === editId ? res.data.labor : labor)));
//       } else {
//         const res = await axios.post(
//           "http://localhost:5000/api/labor/add",
//           { name, mobile, availability },
//           { withCredentials: true }
//         );
//         setLabors([...labors, res.data.labor]);
//       }
//       resetForm();
//       setDialogOpen(false);
//     } catch (error) {
//       console.error("Error saving labor:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Failed to save labor");
//     }
//   };

//   const handleDeleteLabor = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this labor?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/labor/delete/${id}`, { withCredentials: true });
//       setLabors(labors.filter((labor) => labor._id !== id));
//     } catch (error) {
//       console.error("Error deleting labor:", error);
//       alert("Failed to delete labor");
//     }
//   };

//   const handleEditClick = (labor) => {
//     setEditId(labor._id);
//     setName(labor.name);
//     setMobile(labor.mobile);
//     setAvailability(labor.availability);
//     setDialogOpen(true);
//   };

//   const resetForm = () => {
//     setEditId(null);
//     setName("");
//     setMobile("");
//     setAvailability(true);
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
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
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
//           root: { borderRadius: "8px", textTransform: "none" },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#757575" },
//               "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#212121" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
//             },
//           },
//         },
//       },
//     },
//   });

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
//               sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
//             >
//               Manage Labor
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setDialogOpen(true)}
//             sx={{ mb: 3, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//           >
//             Add Labor
//           </Button>

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Availability</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {labors.map((labor) => (
//                   <TableRow key={labor._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
//                     <TableCell sx={{ color: "text.primary" }}>{labor.name}</TableCell>
//                     <TableCell sx={{ color: "text.primary" }}>{labor.mobile}</TableCell>
//                     <TableCell sx={{ color: "text.primary" }}>{labor.availability ? "Yes" : "No"}</TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => handleEditClick(labor)} sx={{ color: "primary.main" }}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton onClick={() => handleDeleteLabor(labor._id)} sx={{ color: "error.main" }}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Add/Edit Labor Dialog */}
//           <Dialog open={dialogOpen} onClose={() => { resetForm(); setDialogOpen(false); }}>
//             <DialogTitle sx={{ bgcolor: darkMode ? "#388E3C" : "#66BB6A", color: "#fff" }}>
//               {editId ? "Edit Labor" : "Add Labor"}
//             </DialogTitle>
//             <DialogContent sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//               <TextField
//                 label="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 fullWidth
//                 margin="normal"
//                 required
//                 variant="outlined"
//                 sx={{ mt: 2 }}
//               />
//               <TextField
//                 label="Mobile Number"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 fullWidth
//                 margin="normal"
//                 required
//                 variant="outlined"
//                 inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
//                 helperText="Enter a 10-digit mobile number"
//               />
//               <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//                 <Typography sx={{ color: "text.primary" }}>Available:</Typography>
//                 <Switch
//                   checked={availability}
//                   onChange={(e) => setAvailability(e.target.checked)}
//                   color="primary"
//                 />
//               </Box>
//             </DialogContent>
//             <DialogActions sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//               <Button onClick={() => { resetForm(); setDialogOpen(false); }} color="primary" variant="outlined">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAddOrEditLabor}
//                 color="primary"
//                 variant="contained"
//                 sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//               >
//                 {editId ? "Update" : "Add"}
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AddLabor;
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
  Breadcrumbs,
  Pagination,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

const ManageLabor = () => {
  const [labors, setLabors] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [availability, setAvailability] = useState(true);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed number of rows per page

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
      // Sort labors by _id descending (latest first)
      const sortedLabors = res.data.sort((a, b) => b._id.localeCompare(a._id));
      setLabors(sortedLabors);
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
        setLabors([res.data.labor, ...labors]); // Add new labor at the top
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

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Labor Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableData = paginatedLabors.map((labor) => [
      labor.name,
      labor.mobile,
      labor.availability ? "Yes" : "No",
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Name", "Mobile Number", "Availability"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save("labor_report.pdf");
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Mobile Number", "Availability"];
    const csvRows = [
      headers.join(","),
      ...labors.map((labor) =>
        [`"${labor.name}"`, labor.mobile, labor.availability ? "Yes" : "No"].join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "labors.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "12px",
            boxShadow: darkMode
              ? "0 10px 30px rgba(255,255,255,0.05)"
              : "0 10px 30px rgba(0,0,0,0.08)",
          },
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
      MuiTypography: {
        styleOverrides: {
          root: { transition: "color 0.3s ease" },
          h4: { fontWeight: 700, letterSpacing: "0.5px" },
          h5: { fontWeight: 700, letterSpacing: "0.5px" },
        },
      },
    },
  });

  const paginatedLabors = labors.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(labors.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
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
                Manage Labor
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportCSV}
                  startIcon={<DownloadIcon />}
                  sx={{
                    bgcolor: darkMode ? "#66BB6A" : "#388E3C",
                    "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" },
                  }}
                >
                  Export CSV
                </Button>
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
                <PeopleIcon sx={{ mr: 0.5 }} fontSize="small" />
                Manage Labor
              </Typography>
            </Breadcrumbs>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(true)}
            sx={{
              mb: 4,
              bgcolor: darkMode ? "#66BB6A" : "#388E3C",
              "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" },
            }}
          >
            Add Labor
          </Button>

          <TableContainer component={Paper} sx={{ borderRadius: "12px", overflowX: "auto" }}>
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
                {paginatedLabors.map((labor) => (
                  <TableRow
                    key={labor._id}
                    sx={{
                      "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" },
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <TableCell sx={{ color: "text.primary" }}>{labor.name}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{labor.mobile}</TableCell>
                    <TableCell sx={{ color: "text.primary" }}>{labor.availability ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(labor)}
                        sx={{ color: darkMode ? "#A5D6A7" : "#4CAF50" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteLabor(labor._id)}
                        sx={{ color: darkMode ? "#EF5350" : "#D32F2F" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedLabors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" sx={{ color: "text.secondary", py: 4 }}>
                        No laborers found.
                      </Typography>
                    </TableCell>
                  </TableRow>
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

          {/* Add/Edit Labor Dialog */}
          <Dialog open={dialogOpen} onClose={() => { resetForm(); setDialogOpen(false); }}>
            <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>
              {editId ? "Edit Labor" : "Add Labor"}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9", pt: 2 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
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
                <Typography sx={{ color: "text.primary", mr: 2 }}>Available:</Typography>
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

export default ManageLabor;