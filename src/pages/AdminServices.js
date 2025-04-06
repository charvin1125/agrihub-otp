// //pages/AdminServices.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MenuIcon from "@mui/icons-material/Menu";

// const AdminServices = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [service, setService] = useState({
//     name: "",
//     description: "",
//     pricePer100SqFt: "",
//     image: null,
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   // Fetch services and user
//   useEffect(() => {
//     fetchServices();

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

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const [servicesRes, userRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/services/list", { withCredentials: true }),
//         axios.get("http://localhost:5000/api/users/me", { withCredentials: true }),
//       ]);
//       if (userRes.data && !userRes.data.isAdmin) {
//         navigate("/"); // Redirect non-admins
//       }
//       setServices(servicesRes.data || []);
//     } catch (error) {
//       console.error("Error fetching services or user:", error);
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setService({ ...service, image: files[0] });
//     } else {
//       setService({ ...service, [name]: value });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", service.name);
//     formData.append("description", service.description);
//     formData.append("pricePer100SqFt", service.pricePer100SqFt);
//     if (service.image) formData.append("image", service.image);

//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/services/update/${editId}`, formData, {
//           withCredentials: true,
//         });
//         alert("Service updated successfully!");
//       } else {
//         await axios.post("http://localhost:5000/api/services/add", formData, {
//           withCredentials: true,
//         });
//         alert("Service added successfully!");
//       }
//       setService({ name: "", description: "", pricePer100SqFt: "", image: null });
//       setIsEditing(false);
//       setEditId(null);
//       fetchServices();
//     } catch (error) {
//       console.error("Error submitting service:", error);
//       alert("Failed to save service");
//     }
//   };

//   // Handle edit
//   const handleEdit = (serviceItem) => {
//     setService({
//       name: serviceItem.name,
//       description: serviceItem.description,
//       pricePer100SqFt: serviceItem.pricePer100SqFt,
//       image: null, // Image won't be pre-loaded; admin must re-upload if changing
//     });
//     setEditId(serviceItem._id);
//     setIsEditing(true);
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this service?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/services/delete/${id}`, { withCredentials: true });
//         alert("Service deleted successfully!");
//         fetchServices();
//       } catch (error) {
//         console.error("Error deleting service:", error);
//         alert("Failed to delete service");
//       }
//     }
//   };

//   // Theme toggler
//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   // MUI Theme Configuration with Green Theme
//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" }, // Green shades for agriculture theme
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" }, // Lighter green for secondary
//       background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
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
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: darkMode ? "#388E3C" : "#A5D6A7", // Light green in light theme
//             color: darkMode ? "#fff" : "#212121", // Black in light theme
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
//             },
//           },
//         },
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress size={60} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

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
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 4 },
//             bgcolor: "background.default",
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
//               Manage Services
//             </Typography>
//           </Box>

//           {/* Service Form */}
//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 {isEditing ? "Edit Service" : "Add New Service"}
//               </Typography>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Service Name"
//                       name="name"
//                       value={service.name}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Price per 100 Sq Ft"
//                       name="pricePer100SqFt"
//                       type="number"
//                       value={service.pricePer100SqFt}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       inputProps={{ min: 0 }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Description"
//                       name="description"
//                       value={service.description}
//                       onChange={handleChange}
//                       multiline
//                       rows={isMobile ? 2 : 3}
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       type="file"
//                       name="image"
//                       onChange={handleChange}
//                       InputLabelProps={{ shrink: true }}
//                       label="Service Image"
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth={isMobile}
//                       sx={{ mt: 2, py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                     >
//                       {isEditing ? "Update Service" : "Add Service"}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Services List */}
//           <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
//             Services List
//           </Typography>
//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="services table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell align="right">Price per 100 Sq Ft</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Description</TableCell>
//                       <TableCell align="right">Image</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {services.length > 0 ? (
//                       services.map((serviceItem) => (
//                         <TableRow key={serviceItem._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
//                           <TableCell sx={{ color: "text.primary" }}>{serviceItem.name}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>
//                             ₹{serviceItem.pricePer100SqFt}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             {serviceItem.description}
//                           </TableCell>
//                           <TableCell align="right">
//                             {serviceItem.image ? (
//                               <img
//                                 src={`http://localhost:5000/${serviceItem.image}`}
//                                 alt={serviceItem.name}
//                                 style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, objectFit: "cover", borderRadius: "4px" }}
//                               />
//                             ) : (
//                               "No Image"
//                             )}
//                           </TableCell>
//                           <TableCell align="right">
//                             <IconButton onClick={() => handleEdit(serviceItem)} color="primary">
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => handleDelete(serviceItem._id)} color="secondary">
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={5} align="center" sx={{ color: "text.secondary" }}>
//                           No services found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AdminServices;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress,
//   Breadcrumbs,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeIcon from "@mui/icons-material/Home";
// import BuildIcon from "@mui/icons-material/Build";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminServices = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [service, setService] = useState({
//     name: "",
//     description: "",
//     pricePer100SqFt: "",
//     image: null,
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   // Fetch services and user
//   useEffect(() => {
//     fetchServices();

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

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const [servicesRes, userRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/services/list", { withCredentials: true }),
//         axios.get("http://localhost:5000/api/users/me", { withCredentials: true }),
//       ]);
//       if (userRes.data && !userRes.data.isAdmin) {
//         navigate("/"); // Redirect non-admins
//       }
//       setServices(servicesRes.data || []);
//     } catch (error) {
//       console.error("Error fetching services or user:", error);
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setService({ ...service, image: files[0] });
//     } else {
//       setService({ ...service, [name]: value });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", service.name);
//     formData.append("description", service.description);
//     formData.append("pricePer100SqFt", service.pricePer100SqFt);
//     if (service.image) formData.append("image", service.image);

//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/services/update/${editId}`, formData, {
//           withCredentials: true,
//         });
//         toast.success("Service updated successfully!", { position: "top-center" });
//       } else {
//         await axios.post("http://localhost:5000/api/services/add", formData, {
//           withCredentials: true,
//         });
//         toast.success("Service added successfully!", { position: "top-center" });
//       }
//       setService({ name: "", description: "", pricePer100SqFt: "", image: null });
//       setIsEditing(false);
//       setEditId(null);
//       fetchServices();
//     } catch (error) {
//       console.error("Error submitting service:", error);
//       toast.error("Failed to save service", { position: "top-center" });
//     }
//   };

//   // Handle edit
//   const handleEdit = (serviceItem) => {
//     setService({
//       name: serviceItem.name,
//       description: serviceItem.description,
//       pricePer100SqFt: serviceItem.pricePer100SqFt,
//       image: null, // Image won't be pre-loaded; admin must re-upload if changing
//     });
//     setEditId(serviceItem._id);
//     setIsEditing(true);
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this service?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/services/delete/${id}`, { withCredentials: true });
//         toast.success("Service deleted successfully!", { position: "top-center" });
//         fetchServices();
//       } catch (error) {
//         console.error("Error deleting service:", error);
//         toast.error("Failed to delete service", { position: "top-center" });
//       }
//     }
//   };

//   // Handle CSV export
//   const handleExportCSV = () => {
//     const headers = ["Name", "Description", "Price per 100 Sq Ft", "Image"];
//     const csvRows = [
//       headers.join(","), // Header row
//       ...services.map((serviceItem) => {
//         const row = [
//           `"${serviceItem.name || "N/A"}"`,
//           `"${serviceItem.description || "N/A"}"`,
//           serviceItem.pricePer100SqFt || 0,
//           `"${serviceItem.image ? `http://localhost:5000/${serviceItem.image}` : "No Image"}"`,
//         ];
//         return row.join(",");
//       }),
//     ];

//     const csv = csvRows.join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "services.csv";
//     a.click();
//     window.URL.revokeObjectURL(url); // Clean up the URL object
//     toast.success("Services exported to CSV successfully!", { position: "top-center" });
//   };

//   // Theme toggler
//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   // MUI Theme Configuration with Green Theme (aligned with Category/Vendor)
//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" }, // Green shades for agriculture theme
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" }, // Lighter green for secondary
//       background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
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
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: darkMode ? "#2E7D32" : "#388E3C", // Darker green in dark mode, primary green in light mode
//             color: "#fff", // White text in both modes for contrast
//             fontWeight: "bold",
//           },
//           body: { padding: { xs: "8px", sm: "12px" } },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9", // Light green background for inputs
//               borderRadius: "8px",
//               "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
//               "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
//             },
//           },
//         },
//       },
//       MuiIconButton: {
//         styleOverrides: {
//           root: {
//             color: darkMode ? "#A5D6A7" : "#4CAF50",
//             "&:hover": { color: darkMode ? "#81C784" : "#388E3C" },
//           },
//         },
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress size={60} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

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
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 4 },
//             bgcolor: "background.default",
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           {/* Header with Breadcrumbs */}
//           <Box sx={{ mb: { xs: 2, sm: 4 } }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 justifyContent: "space-between",
//                 alignItems: { xs: "flex-start", sm: "center" },
//                 gap: 2,
//                 mb: 1,
//               }}
//             >
//               {isMobile && (
//                 <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                   <MenuIcon />
//                 </IconButton>
//               )}
//               <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}>
//                 Manage Services
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleExportCSV}
//                 startIcon={<PictureAsPdfIcon />}
//                 sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//               >
//                 Export CSV
//               </Button>
//             </Box>
//             <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: "#4CAF50" }}>
//               <Link
//                 to="/admin-dashboard"
//                 style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
//               >
//                 <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
//                 Dashboard
//               </Link>
//               <Typography color="#4CAF50" sx={{ display: "flex", alignItems: "center" }}>
//                 <BuildIcon sx={{ mr: 0.5 }} fontSize="small" />
//                 Manage Services
//               </Typography>
//             </Breadcrumbs>
//           </Box>

//           {/* Service Form */}
//           <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
//                 {isEditing ? "Edit Service" : "Add New Service"}
//               </Typography>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Service Name"
//                       name="name"
//                       value={service.name}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Price per 100 Sq Ft"
//                       name="pricePer100SqFt"
//                       type="number"
//                       value={service.pricePer100SqFt}
//                       onChange={handleChange}
//                       required
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       inputProps={{ min: 0 }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Description"
//                       name="description"
//                       value={service.description}
//                       onChange={handleChange}
//                       multiline
//                       rows={isMobile ? 2 : 3}
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       type="file"
//                       name="image"
//                       onChange={handleChange}
//                       InputLabelProps={{ shrink: true }}
//                       label="Service Image"
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth={isMobile}
//                       sx={{ mt: 2, py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                     >
//                       {isEditing ? "Update Service" : "Add Service"}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Services List */}
//           <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
//             Services List
//           </Typography>
//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="services table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell align="right">Price per 100 Sq Ft</TableCell>
//                       <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Description</TableCell>
//                       <TableCell align="right">Image</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {services.length > 0 ? (
//                       services.map((serviceItem) => (
//                         <TableRow key={serviceItem._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                           <TableCell sx={{ color: "text.primary" }}>{serviceItem.name}</TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary" }}>
//                             ₹{serviceItem.pricePer100SqFt}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                             {serviceItem.description}
//                           </TableCell>
//                           <TableCell align="right">
//                             {serviceItem.image ? (
//                               <img
//                                 src={`http://localhost:5000/${serviceItem.image}`}
//                                 alt={serviceItem.name}
//                                 style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, objectFit: "cover", borderRadius: "4px" }}
//                               />
//                             ) : (
//                               "No Image"
//                             )}
//                           </TableCell>
//                           <TableCell align="right">
//                             <IconButton onClick={() => handleEdit(serviceItem)} color="primary">
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => handleDelete(serviceItem._id)} color="secondary">
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={5} align="center" sx={{ color: "text.secondary" }}>
//                           No services found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>

//           {/* Toast Container */}
//           <ToastContainer
//             position="top-center"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme={darkMode ? "dark" : "light"}
//           />
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AdminServices;
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    name: "",
    description: "",
    pricePer100SqFt: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Fetch services and user
  useEffect(() => {
    fetchServices();

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

  const fetchServices = async () => {
    setLoading(true);
    try {
      const [servicesRes, userRes] = await Promise.all([
        axios.get("http://localhost:5000/api/services/list", { withCredentials: true }),
        axios.get("http://localhost:5000/api/users/me", { withCredentials: true }),
      ]);
      if (userRes.data && !userRes.data.isAdmin) {
        navigate("/"); // Redirect non-admins
      }
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error("Error fetching services or user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setService({ ...service, image: files[0] });
    } else {
      setService({ ...service, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", service.name);
    formData.append("description", service.description);
    formData.append("pricePer100SqFt", service.pricePer100SqFt);
    if (service.image) formData.append("image", service.image);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/services/update/${editId}`, formData, {
          withCredentials: true,
        });
        toast.success(`Service "${service.name}" updated successfully!`, { position: "top-center" });
      } else {
        await axios.post("http://localhost:5000/api/services/add", formData, {
          withCredentials: true,
        });
        toast.success(`Service "${service.name}" added successfully!`, { position: "top-center" });
      }
      setService({ name: "", description: "", pricePer100SqFt: "", image: null });
      setIsEditing(false);
      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error("Error submitting service:", error);
      toast.error(`Failed to ${isEditing ? "update" : "add"} service "${service.name}"`, { position: "top-center" });
    }
  };

  // Handle edit
  const handleEdit = (serviceItem) => {
    setService({
      name: serviceItem.name,
      description: serviceItem.description,
      pricePer100SqFt: serviceItem.pricePer100SqFt,
      image: null, // Image won't be pre-loaded; admin must re-upload if changing
    });
    setEditId(serviceItem._id);
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const serviceToDelete = services.find((s) => s._id === id);
    if (window.confirm(`Are you sure you want to delete the service "${serviceToDelete.name}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/services/delete/${id}`, { withCredentials: true });
        toast.success(`Service "${serviceToDelete.name}" deleted successfully!`, { position: "top-center" });
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error(`Failed to delete service "${serviceToDelete.name}"`, { position: "top-center" });
      }
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ["Name", "Description", "Price per 100 Sq Ft", "Image"];
    const csvRows = [
      headers.join(","), // Header row
      ...services.map((serviceItem) => {
        const row = [
          `"${serviceItem.name || "N/A"}"`,
          `"${serviceItem.description || "N/A"}"`,
          serviceItem.pricePer100SqFt || 0,
          `"${serviceItem.image ? `http://localhost:5000/${serviceItem.image}` : "No Image"}"`,
        ];
        return row.join(",");
      }),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "services.csv";
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
    toast.success("Services exported to CSV successfully!", { position: "top-center" });
  };

  // Handle PDF report generation
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Services Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableData = services.map((serviceItem) => [
      serviceItem.name || "N/A",
      serviceItem.description || "N/A",
      serviceItem.pricePer100SqFt || 0,
      serviceItem.image ? `http://localhost:5000/${serviceItem.image}` : "No Image",
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Name", "Description", "Price per 100 Sq Ft", "Image"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
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

    doc.save("services_report.pdf");
    toast.success("Services report generated successfully!", { position: "top-center" });
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
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
            color: "#fff",
            fontWeight: "bold",
          },
          body: { padding: { xs: "8px", sm: "12px" } },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: darkMode ? "#A5D6A7" : "#4CAF50",
            "&:hover": { color: darkMode ? "#81C784" : "#388E3C" },
          },
        },
      },
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

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
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            bgcolor: "background.default",
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
            transition: "width 0.3s ease",
          }}
        >
          {/* Header with Breadcrumbs */}
          <Box sx={{ mb: { xs: 2, sm: 4 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 1,
              }}
            >
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "#212121", flexGrow: 1 }}>
                Manage Services
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportCSV}
                  startIcon={<PictureAsPdfIcon />}
                  sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateReport}
                  startIcon={<PictureAsPdfIcon />}
                  sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
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
                <BuildIcon sx={{ mr: 0.5 }} fontSize="small" />
                Manage Services
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Service Form */}
          <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, color: "text.primary" }}>
                {isEditing ? "Edit Service" : "Add New Service"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Service Name"
                      name="name"
                      value={service.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price per 100 Sq Ft"
                      name="pricePer100SqFt"
                      type="number"
                      value={service.pricePer100SqFt}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={service.description}
                      onChange={handleChange}
                      multiline
                      rows={isMobile ? 2 : 3}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      name="image"
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      label="Service Image"
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
                      sx={{ mt: 2, py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                    >
                      {isEditing ? "Update Service" : "Add Service"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Services List */}
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
            Services List
          </Typography>
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="services table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Price per 100 Sq Ft</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Description</TableCell>
                      <TableCell align="right">Image</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.length > 0 ? (
                      services.map((serviceItem) => (
                        <TableRow key={serviceItem._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                          <TableCell sx={{ color: "text.primary" }}>{serviceItem.name}</TableCell>
                          <TableCell align="right" sx={{ color: "text.primary" }}>
                            ₹{serviceItem.pricePer100SqFt}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                            {serviceItem.description}
                          </TableCell>
                          <TableCell align="right">
                            {serviceItem.image ? (
                              <img
                                src={`http://localhost:5000/${serviceItem.image}`}
                                alt={serviceItem.name}
                                style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, objectFit: "cover", borderRadius: "4px" }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleEdit(serviceItem)} color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(serviceItem._id)} color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ color: "text.secondary" }}>
                          No services found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Toast Container */}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "dark" : "light"}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminServices;