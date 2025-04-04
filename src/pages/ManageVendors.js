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
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MenuIcon from "@mui/icons-material/Menu";
// import "./styles/vendor.css"; // Keep if you want additional custom styles

// const ManageVendors = () => {
//   const [vendor, setVendor] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });
//   const [vendors, setVendors] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     fetchVendors();
//     fetchUser();

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

//   const fetchVendors = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true });
//       setVendors(response.data);
//     } catch (error) {
//       alert("Failed to fetch vendors");
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//       setUser(response.data);
//       if (!response.data.isAdmin) navigate("/"); // Redirect non-admins
//     } catch (error) {
//       console.log("User not logged in");
//       navigate("/login");
//     }
//   };

//   const handleChange = (e) => {
//     setVendor({ ...vendor, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.isAdmin) {
//       alert("Unauthorized: Admin access only");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
//         alert("Vendor updated successfully!");
//         setIsEditing(false);
//         setEditId(null);
//       } else {
//         await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
//         alert("Vendor added successfully!");
//       }
//       setVendor({ name: "", email: "", phone: "", address: "" });
//       fetchVendors();
//     } catch (error) {
//       alert(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   const handleEdit = (id, currentVendor) => {
//     setVendor(currentVendor);
//     setEditId(id);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id) => {
//     if (!user?.isAdmin) {
//       alert("Only admins can perform this action");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this vendor?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/vendor/${id}`, { withCredentials: true });
//         alert("Vendor deleted successfully!");
//         fetchVendors();
//       } catch (error) {
//         alert("Failed to delete vendor");
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
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
//               Manage Vendors
//             </Typography>
//           </Box>

//           {/* Vendor Form */}
//           {user?.isAdmin ? (
//             <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
//                   {isEditing ? "Edit Vendor" : "Add New Vendor"}
//                 </Typography>
//                 <form onSubmit={handleSubmit}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Company Name"
//                         name="name"
//                         value={vendor.name}
//                         onChange={handleChange}
//                         required
//                         variant="outlined"
//                         size={isMobile ? "small" : "medium"}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Email"
//                         name="email"
//                         type="email"
//                         value={vendor.email}
//                         onChange={handleChange}
//                         required
//                         variant="outlined"
//                         size={isMobile ? "small" : "medium"}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Phone"
//                         name="phone"
//                         value={vendor.phone}
//                         onChange={handleChange}
//                         required
//                         variant="outlined"
//                         size={isMobile ? "small" : "medium"}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Address"
//                         name="address"
//                         value={vendor.address}
//                         onChange={handleChange}
//                         multiline
//                         rows={isMobile ? 2 : 3}
//                         variant="outlined"
//                         size={isMobile ? "small" : "medium"}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         fullWidth={isMobile}
//                         sx={{ mt: 2, py: 1, fontWeight: "bold", bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                       >
//                         {isEditing ? "Update Vendor" : "Add Vendor"}
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </form>
//               </CardContent>
//             </Card>
//           ) : (
//             <Typography variant="body1" sx={{ color: "secondary.main", mb: 2 }}>
//               You do not have permission to manage vendors.
//             </Typography>
//           )}

//           {/* Vendor List */}
//           <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
//             Vendor List
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="vendor table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Name</TableCell>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Email</TableCell>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>Phone</TableCell>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary", display: { xs: "none", md: "table-cell" } }}>Address</TableCell>
//                   {user?.isAdmin && (
//                     <TableCell sx={{ fontWeight: "bold", color: "text.primary" }} align="right">
//                       Actions
//                     </TableCell>
//                   )}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {vendors.map((v) => (
//                   <TableRow key={v._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
//                     <TableCell sx={{ color: "text.primary" }}>{v.name}</TableCell>
//                     <TableCell sx={{ color: "text.primary" }}>{v.email}</TableCell>
//                     <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
//                     <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
//                     {user?.isAdmin && (
//                       <TableCell align="right">
//                         <IconButton onClick={() => handleEdit(v._id, v)} color="primary">
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(v._id)} color="secondary">
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageVendors;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
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
//   InputAdornment,
//   Checkbox,
//   Container,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";

// const ManageVendors = () => {
//   const [vendor, setVendor] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });
//   const [vendors, setVendors] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [selectedVendors, setSelectedVendors] = useState([]); // For checkbox selection
//   const sidebarWidth = 260; // Sidebar width in pixels
//   const navigate = useNavigate();

//   // Fetch initial data and handle resize
//   useEffect(() => {
//     fetchVendors();
//     fetchUser();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false); // Close sidebar on mobile
//       else setSidebarOpen(true); // Open sidebar on desktop
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchVendors = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true });
//       setVendors(response.data);
//     } catch (error) {
//       alert("Failed to fetch vendors");
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//       setUser(response.data);
//       if (!response.data.isAdmin) navigate("/"); // Redirect non-admins
//     } catch (error) {
//       console.log("User not logged in");
//       navigate("/login");
//     }
//   };

//   const handleChange = (e) => {
//     setVendor({ ...vendor, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.isAdmin) {
//       alert("Unauthorized: Admin access only");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
//         alert("Vendor updated successfully!");
//         setIsEditing(false);
//         setEditId(null);
//       } else {
//         await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
//         alert("Vendor added successfully!");
//       }
//       setVendor({ name: "", email: "", phone: "", address: "" });
//       fetchVendors();
//     } catch (error) {
//       alert(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   const handleEdit = (id, currentVendor) => {
//     setVendor(currentVendor);
//     setEditId(id);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id) => {
//     if (!user?.isAdmin) {
//       alert("Only admins can perform this action");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this vendor?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/vendor/${id}`, { withCredentials: true });
//         alert("Vendor deleted successfully!");
//         fetchVendors();
//       } catch (error) {
//         alert("Failed to delete vendor");
//       }
//     }
//   };

//   // Checkbox selection handlers
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedVendors(vendors.map((v) => v._id));
//     } else {
//       setSelectedVendors([]);
//     }
//   };

//   const handleSelectVendor = (id) => {
//     setSelectedVendors((prev) =>
//       prev.includes(id) ? prev.filter((vendorId) => vendorId !== id) : [...prev, id]
//     );
//   };

//   // Theme toggler
//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   // MUI Theme Configuration to match the product page design
//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: "#1976D2" }, // Blue for buttons like "Add products"
//       secondary: { main: "#FF5252" }, // Red for negative sales or delete actions
//       background: { default: darkMode ? "#121212" : "#F5F7FA", paper: darkMode ? "#1e1e1e" : "#fff" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             fontWeight: "bold",
//             color: darkMode ? "#b0b0b0" : "#757575",
//             borderBottom: `1px solid ${darkMode ? "#333" : "#E0E0E0"}`,
//           },
//           body: {
//             color: darkMode ? "#e0e0e0" : "#212121",
//             borderBottom: `1px solid ${darkMode ? "#333" : "#E0E0E0"}`,
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "8px",
//             textTransform: "none",
//             fontWeight: "500",
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
//               "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#1976D2" },
//             },
//           },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         {/* Sidebar */}
//         <Sidebar
//           darkMode={darkMode}
//           toggleDarkMode={toggleDarkMode}
//           isMobile={isMobile}
//           open={sidebarOpen}
//           setOpen={setSidebarOpen}
//         />
//         {/* Main Content */}
//         <Box
//           sx={{
//             flexGrow: 1,
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? sidebarWidth : 0}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           {/* Admin Navbar */}
//           <AdminNavbar
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             isMobile={isMobile}
//             sidebarWidth={sidebarOpen && !isMobile ? sidebarWidth : 0} // Pass dynamic sidebar width
//           />
//           <Box
//             component="main"
//             sx={{
//               flexGrow: 1,
//               p: { xs: 2, sm: 3 },
//               mt: 8, // Add margin-top to account for the fixed navbar height
//               bgcolor: "background.default",
//               minHeight: "100vh",
//             }}
//           >
//             <Container maxWidth="lg">
//               {/* Header */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                   Vendors
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<FileDownloadIcon />}
//                     sx={{ borderRadius: "20px", textTransform: "none", color: "text.primary", borderColor: "text.secondary" }}
//                   >
//                     Export
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     sx={{ borderRadius: "20px", textTransform: "none" }}
//                     onClick={() => {
//                       setVendor({ name: "", email: "", phone: "", address: "" });
//                       setIsEditing(false);
//                       setEditId(null);
//                     }}
//                   >
//                     Add vendors
//                   </Button>
//                 </Box>
//               </Box>

//               {/* Search Bar and Filter */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
//                 <TextField
//                   placeholder="Search vendors..."
//                   variant="outlined"
//                   size="small"
//                   sx={{ flexGrow: 1, borderRadius: "20px" }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 <Button
//                   variant="outlined"
//                   startIcon={<FilterListIcon />}
//                   sx={{ borderRadius: "20px", textTransform: "none", color: "text.primary", borderColor: "text.secondary" }}
//                 >
//                   Filter
//                 </Button>
//               </Box>

//               {/* Vendor Form */}
//               {user?.isAdmin && (isEditing || !editId) && (
//                 <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: "background.paper", boxShadow: "none", border: "1px solid #E0E0E0" }}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
//                       {isEditing ? "Edit Vendor" : "Add New Vendor"}
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Company Name"
//                             name="name"
//                             value={vendor.name}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             type="email"
//                             value={vendor.email}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Phone"
//                             name="phone"
//                             value={vendor.phone}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Address"
//                             name="address"
//                             value={vendor.address}
//                             onChange={handleChange}
//                             multiline
//                             rows={isMobile ? 2 : 3}
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             fullWidth={isMobile}
//                             sx={{ mt: 2, py: 1, borderRadius: "20px", textTransform: "none" }}
//                           >
//                             {isEditing ? "Update Vendor" : "Add Vendor"}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </form>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Vendor List */}
//               <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #E0E0E0" }}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="vendor table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         <Checkbox
//                           checked={selectedVendors.length === vendors.length && vendors.length > 0}
//                           onChange={handleSelectAll}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>VENDORS</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>EMAIL</TableCell>
//                       <TableCell sx={{ fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>
//                         MOBILE NUMBER
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold", display: { xs: "none", md: "table-cell" } }}>
//                         ADDRESS
//                       </TableCell>
//                       {user?.isAdmin && (
//                         <TableCell sx={{ fontWeight: "bold" }} align="right">
//                           ACTIONS
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {vendors.map((v) => (
//                       <TableRow key={v._id}>
//                         <TableCell>
//                           <Checkbox
//                             checked={selectedVendors.includes(v._id)}
//                             onChange={() => handleSelectVendor(v._id)}
//                           />
//                         </TableCell>
//                         <TableCell>{v.name}</TableCell>
//                         <TableCell>{v.email}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
//                         {user?.isAdmin && (
//                           <TableCell align="right">
//                             <IconButton onClick={() => handleEdit(v._id, v)} color="primary">
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => handleDelete(v._id)} color="secondary">
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Container>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageVendors;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
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
//   InputAdornment,
//   Checkbox,
//   Container,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SearchIcon from "@mui/icons-material/Search";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ManageVendors = () => {
//   const [vendor, setVendor] = useState({ name: "", email: "", phone: "", address: "" });
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [vendorToDelete, setVendorToDelete] = useState(null);
//   const sidebarWidth = 260;
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchVendors();
//     fetchUser();
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

//   const fetchVendors = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true });
//       setVendors(response.data);
//       setFilteredVendors(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch vendors");
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//       setUser(response.data);
//       if (!response.data.isAdmin) navigate("/");
//     } catch (error) {
//       console.log("User not logged in");
//       navigate("/login");
//     }
//   };

//   const handleChange = (e) => {
//     setVendor({ ...vendor, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.isAdmin) {
//       toast.error("Unauthorized: Admin access only");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
//         toast.success("Vendor updated successfully!");
//         setIsEditing(false);
//         setEditId(null);
//       } else {
//         await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
//         toast.success("Vendor added successfully!");
//       }
//       setVendor({ name: "", email: "", phone: "", address: "" });
//       fetchVendors();
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   const handleEdit = (id, currentVendor) => {
//     setVendor(currentVendor);
//     setEditId(id);
//     setIsEditing(true);
//   };

//   const handleDelete = async () => {
//     if (!user?.isAdmin) {
//       toast.error("Only admins can perform this action");
//       return;
//     }
//     try {
//       await axios.delete(`http://localhost:5000/api/vendor/${vendorToDelete}`, { withCredentials: true });
//       toast.success("Vendor deleted successfully!");
//       fetchVendors();
//       setDeleteDialogOpen(false);
//       setVendorToDelete(null);
//     } catch (error) {
//       toast.error("Failed to delete vendor");
//     }
//   };

//   const openDeleteDialog = (id) => {
//     setVendorToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setVendorToDelete(null);
//   };

//   const handleExport = () => {
//     const csvContent = filteredVendors.map(v => `${v.name},${v.email},${v.phone},${v.address}`).join("\n");
//     const blob = new Blob([`Name,Email,Phone,Address\n${csvContent}`], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "vendors.csv";
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedVendors(currentVendors.map((v) => v._id));
//     } else {
//       setSelectedVendors([]);
//     }
//   };

//   const handleSelectVendor = (id) => {
//     setSelectedVendors((prev) =>
//       prev.includes(id) ? prev.filter((vendorId) => vendorId !== id) : [...prev, id]
//     );
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   const handleSort = (field) => {
//     const isAsc = sortField === field && sortDirection === "asc";
//     setSortField(field);
//     setSortDirection(isAsc ? "desc" : "asc");
//     const sortedVendors = [...filteredVendors].sort((a, b) => {
//       if (a[field] < b[field]) return isAsc ? 1 : -1;
//       if (a[field] > b[field]) return isAsc ? -1 : 1;
//       return 0;
//     });
//     setFilteredVendors(sortedVendors);
//     setCurrentPage(1);
//   };

//   const handleSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     const filtered = vendors.filter(
//       (v) =>
//         v.name.toLowerCase().includes(searchTerm) ||
//         v.email.toLowerCase().includes(searchTerm) ||
//         v.phone.toLowerCase().includes(searchTerm) ||
//         v.address.toLowerCase().includes(searchTerm)
//     );
//     setFilteredVendors(filtered);
//     setCurrentPage(1);
//   };

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVendors = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(event.target.value);
//     setCurrentPage(1);
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: "#4CAF50" },
//       secondary: { main: "#FF5252" },
//       background: { default: darkMode ? "#121212" : "#F5F7FA", paper: darkMode ? "#1e1e1e" : "#FFFFFF" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             fontFamily: "Roboto, sans-serif",
//             fontWeight: "bold",
//             color: darkMode ? "#b0b0b0" : "#757575",
//             borderBottom: `1px solid ${darkMode ? "#333" : "#E0E0E0"}`,
//           },
//           body: {
//             color: darkMode ? "#e0e0e0" : "#212121",
//             borderBottom: `1px solid ${darkMode ? "#333" : "#E0E0E0"}`,
//             "&:hover": { backgroundColor: "#E8F5E9" },
//           },
//         },
//       },
//       MuiTableRow: {
//         styleOverrides: {
//           root: {
//             "&:hover": { backgroundColor: "#E8F5E9" },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "10px",
//             textTransform: "none",
//             fontWeight: "500",
//           },
//           outlined: {
//             borderColor: "#4CAF50",
//             color: "#4CAF50",
//             "&:hover": { borderColor: "#388E3C", color: "#388E3C" },
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
//               "&:hover fieldset": { borderColor: "#388E3C" },
//               "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
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
//           sx={{
//             flexGrow: 1,
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? sidebarWidth : 0}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           <AdminNavbar
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             isMobile={isMobile}
//             sidebarWidth={sidebarOpen && !isMobile ? sidebarWidth : 0}
//           />
//           <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
//             <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
//               {/* Header */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                   Vendors
//                 </Typography>
//                 <Button
//                   variant="outlined"
//                   startIcon={<FileDownloadIcon />}
//                   onClick={handleExport}
//                   sx={{ borderRadius: "20px", textTransform: "none" }}
//                 >
//                   Export
//                 </Button>
//               </Box>

//               {/* Search Bar */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
//                 <TextField
//                   placeholder="Search vendors..."
//                   variant="outlined"
//                   size="small"
//                   sx={{ flexGrow: 1, borderRadius: "20px" }}
//                   onChange={handleSearch}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>

//               {/* Vendor Form */}
//               {user?.isAdmin && (isEditing || !editId) && (
//                 <Card sx={{ mb: 4, bgcolor: "background.paper", boxShadow: "none", border: "1px solid #E0E0E0" }}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
//                       {isEditing ? "Edit Vendor" : "Add New Vendor"}
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Company Name"
//                             name="name"
//                             value={vendor.name}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             type="email"
//                             value={vendor.email}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Phone"
//                             name="phone"
//                             value={vendor.phone}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Address"
//                             name="address"
//                             value={vendor.address}
//                             onChange={handleChange}
//                             multiline
//                             rows={isMobile ? 2 : 3}
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             fullWidth={isMobile}
//                             sx={{ mt: 2, py: 1, borderRadius: "10px", textTransform: "none" }}
//                           >
//                             {isEditing ? "Update Vendor" : "Add Vendor"}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </form>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Vendor List */}
//               <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #E0E0E0", bgcolor: "#F7F7F7" }}>
//                 <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="vendor table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedVendors.length === currentVendors.length && currentVendors.length > 0}
//                           onChange={handleSelectAll}
//                         />
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
//                         VENDORS {sortField === "name" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("email")} sx={{ cursor: "pointer" }}>
//                         EMAIL {sortField === "email" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("phone")} sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}>
//                         MOBILE NUMBER {sortField === "phone" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("address")} sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}>
//                         ADDRESS {sortField === "address" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       {user?.isAdmin && <TableCell align="right">ACTIONS</TableCell>}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {currentVendors.map((v) => (
//                       <TableRow key={v._id}>
//                         <TableCell>
//                           <Checkbox
//                             checked={selectedVendors.includes(v._id)}
//                             onChange={() => handleSelectVendor(v._id)}
//                           />
//                         </TableCell>
//                         <TableCell>{v.name}</TableCell>
//                         <TableCell>{v.email}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
//                         {user?.isAdmin && (
//                           <TableCell align="right">
//                             <IconButton onClick={() => handleEdit(v._id, v)} color="primary">
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => openDeleteDialog(v._id)} color="secondary">
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>

//                 {/* Pagination */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//                   <FormControl sx={{ minWidth: 120 }}>
//                     <InputLabel>Items per page</InputLabel>
//                     <Select
//                       value={itemsPerPage}
//                       onChange={handleItemsPerPageChange}
//                       label="Items per page"
//                     >
//                       <MenuItem value={5}>5</MenuItem>
//                       <MenuItem value={10}>10</MenuItem>
//                       <MenuItem value={25}>25</MenuItem>
//                       <MenuItem value={50}>50</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <IconButton
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     >
//                       <ChevronLeftIcon />
//                     </IconButton>
//                     <Typography>
//                       Page {currentPage} of {totalPages}
//                     </Typography>
//                     <IconButton
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     >
//                       <ChevronRightIcon />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               </TableContainer>
//             </Container>

//             {/* Delete Confirmation Dialog */}
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={closeDeleteDialog}
//               PaperProps={{
//                 sx: { borderRadius: "10px" },
//               }}
//               sx={{
//                 backdropFilter: "blur(5px)", // Blurs the background
//               }}
//             >
//               <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <Typography>Are you sure you want to delete this vendor?</Typography>
//               </DialogContent>
//               <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                 <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleDelete} variant="contained" color="secondary">
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>

//             {/* Toast Container */}
//             <ToastContainer
//               position="top-right"
//               autoClose={3000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick
//               rtl={false}
//               pauseOnFocusLoss
//               draggable
//               pauseOnHover
//             />
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageVendors;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
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
//   InputAdornment,
//   Checkbox,
//   Container,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SearchIcon from "@mui/icons-material/Search";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ManageVendors = () => {
//   const [vendor, setVendor] = useState({ name: "", email: "", phone: "", address: "" });
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [vendorToDelete, setVendorToDelete] = useState(null);
//   const sidebarWidth = 260;
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchVendors();
//     fetchUser();
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

//   const fetchVendors = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true });
//       setVendors(response.data);
//       setFilteredVendors(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch vendors");
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//       setUser(response.data);
//       if (!response.data.isAdmin) navigate("/");
//     } catch (error) {
//       console.log("User not logged in");
//       navigate("/login");
//     }
//   };

//   const handleChange = (e) => {
//     setVendor({ ...vendor, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.isAdmin) {
//       toast.error("Unauthorized: Admin access only");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
//         toast.success("Vendor updated successfully!");
//         setIsEditing(false);
//         setEditId(null);
//       } else {
//         await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
//         toast.success("Vendor added successfully!");
//       }
//       setVendor({ name: "", email: "", phone: "", address: "" });
//       fetchVendors();
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   const handleEdit = (id, currentVendor) => {
//     setVendor(currentVendor);
//     setEditId(id);
//     setIsEditing(true);
//   };

//   const handleDelete = async () => {
//     if (!user?.isAdmin) {
//       toast.error("Only admins can perform this action");
//       return;
//     }
//     try {
//       await axios.delete(`http://localhost:5000/api/vendor/${vendorToDelete}`, { withCredentials: true });
//       toast.success("Vendor deleted successfully!");
//       fetchVendors();
//       setDeleteDialogOpen(false);
//       setVendorToDelete(null);
//     } catch (error) {
//       toast.error("Failed to delete vendor");
//     }
//   };

//   const openDeleteDialog = (id) => {
//     setVendorToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setVendorToDelete(null);
//   };

//   const handleExport = () => {
//     const csvContent = filteredVendors.map(v => `${v.name},${v.email},${v.phone},${v.address}`).join("\n");
//     const blob = new Blob([`Name,Email,Phone,Address\n${csvContent}`], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "vendors.csv";
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedVendors(currentVendors.map((v) => v._id));
//     } else {
//       setSelectedVendors([]);
//     }
//   };

//   const handleSelectVendor = (id) => {
//     setSelectedVendors((prev) =>
//       prev.includes(id) ? prev.filter((vendorId) => vendorId !== id) : [...prev, id]
//     );
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   const handleSort = (field) => {
//     const isAsc = sortField === field && sortDirection === "asc";
//     setSortField(field);
//     setSortDirection(isAsc ? "desc" : "asc");
//     const sortedVendors = [...filteredVendors].sort((a, b) => {
//       if (a[field] < b[field]) return isAsc ? 1 : -1;
//       if (a[field] > b[field]) return isAsc ? -1 : 1;
//       return 0;
//     });
//     setFilteredVendors(sortedVendors);
//     setCurrentPage(1);
//   };

//   const handleSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     const filtered = vendors.filter(
//       (v) =>
//         v.name.toLowerCase().includes(searchTerm) ||
//         v.email.toLowerCase().includes(searchTerm) ||
//         v.phone.toLowerCase().includes(searchTerm) ||
//         v.address.toLowerCase().includes(searchTerm)
//     );
//     setFilteredVendors(filtered);
//     setCurrentPage(1);
//   };

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVendors = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(event.target.value);
//     setCurrentPage(1);
//   };

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: "#4CAF50" },
//       secondary: { main: "#FF5252" },
//       background: { default: darkMode ? "#121212" : "#F5F7FA", paper: darkMode ? "#1e1e1e" : "#FFFFFF" },
//       text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             fontFamily: "Roboto, sans-serif",
//             fontWeight: "500",
//             fontSize: "12px",
//             color: darkMode ? "#b0b0b0" : "#757575",
//             textTransform: "uppercase",
//             padding: "12px 16px",
//             borderBottom: "none", // Remove border-bottom for header
//           },
//           body: {
//             fontFamily: "Roboto, sans-serif",
//             fontSize: "14px",
//             color: darkMode ? "#e0e0e0" : "#212121",
//             padding: "12px 16px",
//             borderBottom: "none", // Remove border-bottom for body cells
//           },
//         },
//       },
//       MuiTableRow: {
//         styleOverrides: {
//           root: {
//             "&:hover": {
//               backgroundColor: "#E8F5E9", // Hover effect
//             },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "10px",
//             textTransform: "none",
//             fontWeight: "500",
//           },
//           outlined: {
//             borderColor: "#4CAF50",
//             color: "#4CAF50",
//             "&:hover": { borderColor: "#388E3C", color: "#388E3C" },
//           },
//           contained: {
//             backgroundColor: "#4CAF50",
//             color: "#FFFFFF",
//             "&:hover": { backgroundColor: "#388E3C" },
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "20px",
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
//               "&:hover fieldset": { borderColor: "#388E3C" },
//               "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//             },
//           },
//         },
//       },
//       MuiIconButton: {
//         styleOverrides: {
//           root: {
//             color: "#757575",
//             "&:hover": {
//               color: "#4CAF50",
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
//           sx={{
//             flexGrow: 1,
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? sidebarWidth : 0}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           <AdminNavbar
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             isMobile={isMobile}
//             sidebarWidth={sidebarOpen && !isMobile ? sidebarWidth : 0}
//           />
//           <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
//             <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
//               {/* Header */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                   Vendors
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<FileDownloadIcon />}
//                     onClick={handleExport}
//                     sx={{ borderRadius: "20px", textTransform: "none" }}
//                   >
//                     Export
//                   </Button>
//                   <Button
//                     variant="contained"
//                     startIcon={<FileDownloadIcon />}
//                     onClick={() => navigate("/add-vendor")} // Assuming you have a route to add vendors
//                     sx={{ borderRadius: "20px", textTransform: "none" }}
//                   >
//                     Add Vendor
//                   </Button>
//                 </Box>
//               </Box>

//               {/* Search Bar */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
//                 <TextField
//                   placeholder="Search vendors..."
//                   variant="outlined"
//                   size="small"
//                   sx={{ flexGrow: 1, borderRadius: "20px" }}
//                   onChange={handleSearch}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 <Button
//                   variant="outlined"
//                   startIcon={<FileDownloadIcon />}
//                   sx={{ borderRadius: "20px", textTransform: "none" }}
//                 >
//                   Filter
//                 </Button>
//               </Box>

//               {/* Vendor Form */}
//               {user?.isAdmin && (isEditing || !editId) && (
//                 <Card sx={{ mb: 4, bgcolor: "background.paper", boxShadow: "none", border: "1px solid #E0E0E0" }}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
//                       {isEditing ? "Edit Vendor" : "Add New Vendor"}
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Company Name"
//                             name="name"
//                             value={vendor.name}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             type="email"
//                             value={vendor.email}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Phone"
//                             name="phone"
//                             value={vendor.phone}
//                             onChange={handleChange}
//                             required
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             fullWidth
//                             label="Address"
//                             name="address"
//                             value={vendor.address}
//                             onChange={handleChange}
//                             multiline
//                             rows={isMobile ? 2 : 3}
//                             variant="outlined"
//                             size={isMobile ? "small" : "medium"}
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             fullWidth={isMobile}
//                             sx={{ mt: 2, py: 1, borderRadius: "10px", textTransform: "none" }}
//                           >
//                             {isEditing ? "Update Vendor" : "Add Vendor"}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </form>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Vendor List */}
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
//                   border: "none",
//                   bgcolor: "#FFFFFF", // White background
//                   borderRadius: "8px",
//                 }}
//               >
//                 <Table
//                   sx={{
//                     minWidth: { xs: 300, sm: 650 },
//                     borderCollapse: "separate",
//                     borderSpacing: "0 8px", // Add spacing between rows
//                   }}
//                   aria-label="vendor table"
//                 >
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedVendors.length === currentVendors.length && currentVendors.length > 0}
//                           onChange={handleSelectAll}
//                         />
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
//                         VENDORS{" "}
//                         {sortField === "name" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell onClick={() => handleSort("email")} sx={{ cursor: "pointer" }}>
//                         EMAIL{" "}
//                         {sortField === "email" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell
//                         onClick={() => handleSort("phone")}
//                         sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}
//                       >
//                         MOBILE NUMBER{" "}
//                         {sortField === "phone" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       <TableCell
//                         onClick={() => handleSort("address")}
//                         sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}
//                       >
//                         ADDRESS{" "}
//                         {sortField === "address" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
//                       </TableCell>
//                       {user?.isAdmin && <TableCell align="right">ACTIONS</TableCell>}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {currentVendors.map((v) => (
//                       <TableRow key={v._id}>
//                         <TableCell>
//                           <Checkbox
//                             checked={selectedVendors.includes(v._id)}
//                             onChange={() => handleSelectVendor(v._id)}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                             {/* Placeholder for image */}
//                             <Box
//                               sx={{
//                                 width: 40,
//                                 height: 40,
//                                 bgcolor: "#E0E0E0",
//                                 borderRadius: "4px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 color: "#757575",
//                                 fontSize: "12px",
//                               }}
//                             >
//                               No Image
//                             </Box>
//                             <Box>
//                               <Typography variant="body2" sx={{ fontWeight: "500" }}>
//                                 {v.name}
//                               </Typography>
//                               <Typography variant="caption" sx={{ color: "#757575" }}>
//                                 ID: {v._id.slice(0, 8)}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell>{v.email}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
//                         {user?.isAdmin && (
//                           <TableCell align="right">
//                             <IconButton onClick={() => handleEdit(v._id, v)} color="inherit">
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => openDeleteDialog(v._id)} color="inherit">
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Pagination */}
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 2 }}>
//                 <FormControl sx={{ minWidth: 120 }}>
//                   <InputLabel>Items per page</InputLabel>
//                   <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Items per page">
//                     <MenuItem value={5}>5</MenuItem>
//                     <MenuItem value={10}>10</MenuItem>
//                     <MenuItem value={25}>25</MenuItem>
//                     <MenuItem value={50}>50</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//                     <ChevronLeftIcon />
//                   </IconButton>
//                   <Typography>
//                     Page {currentPage} of {totalPages}
//                   </Typography>
//                   <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//                     <ChevronRightIcon />
//                   </IconButton>
//                 </Box>
//               </Box>
//             </Container>

//             {/* Delete Confirmation Dialog */}
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={closeDeleteDialog}
//               PaperProps={{
//                 sx: { borderRadius: "10px" },
//               }}
//               sx={{
//                 backdropFilter: "blur(5px)", // Blurs the background
//               }}
//             >
//               <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <Typography>Are you sure you want to delete this vendor?</Typography>
//               </DialogContent>
//               <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                 <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleDelete} variant="contained" color="secondary">
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>

//             {/* Toast Container */}
//             <ToastContainer
//               position="top-right"
//               autoClose={3000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick
//               rtl={false}
//               pauseOnFocusLoss
//               draggable
//               pauseOnHover
//             />
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageVendors;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
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
  InputAdornment,
  Checkbox,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageVendors = () => {
  const [vendor, setVendor] = useState({ name: "", email: "", phone: "", address: "" });
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const sidebarWidth = 260;
  const navigate = useNavigate();

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
      setFilteredVendors(response.data);
    } catch (error) {
      toast.error("Failed to fetch vendors");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
      setUser(response.data);
      if (!response.data.isAdmin) navigate("/");
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
      toast.error("Unauthorized: Admin access only");
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/vendor/${editId}`, vendor, { withCredentials: true });
        toast.success("Vendor updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/vendor/add", vendor, { withCredentials: true });
        toast.success("Vendor added successfully!");
      }
      setVendor({ name: "", email: "", phone: "", address: "" });
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (id, currentVendor) => {
    setVendor(currentVendor);
    setEditId(id);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!user?.isAdmin) {
      toast.error("Only admins can perform this action");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/vendor/${vendorToDelete}`, { withCredentials: true });
      toast.success("Vendor deleted successfully!");
      fetchVendors();
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      toast.error("Failed to delete vendor");
    }
  };

  const openDeleteDialog = (id) => {
    setVendorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  const handleExport = () => {
    const csvContent = filteredVendors.map(v => `${v.name},${v.email},${v.phone},${v.address}`).join("\n");
    const blob = new Blob([`Name,Email,Phone,Address\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedVendors(currentVendors.map((v) => v._id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleSelectVendor = (id) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((vendorId) => vendorId !== id) : [...prev, id]
    );
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortField(field);
    setSortDirection(isAsc ? "desc" : "asc");
    const sortedVendors = [...filteredVendors].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? 1 : -1;
      if (a[field] > b[field]) return isAsc ? -1 : 1;
      return 0;
    });
    setFilteredVendors(sortedVendors);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm) ||
        v.email.toLowerCase().includes(searchTerm) ||
        v.phone.toLowerCase().includes(searchTerm) ||
        v.address.toLowerCase().includes(searchTerm)
    );
    setFilteredVendors(filtered);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#4CAF50" },
      secondary: { main: "#FF5252" },
      background: { default: darkMode ? "#121212" : "#F5F7FA", paper: darkMode ? "#1e1e1e" : "#FFFFFF" },
      text: { primary: darkMode ? "#e0e0e0" : "#212121", secondary: darkMode ? "#b0b0b0" : "#757575" },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontFamily: "Roboto, sans-serif",
            fontWeight: "500",
            fontSize: "12px",
            color: darkMode ? "#b0b0b0" : "#757575",
            textTransform: "uppercase",
            padding: "12px 16px",
            borderBottom: "none", // Remove border-bottom for header
          },
          body: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            color: darkMode ? "#e0e0e0" : "#212121",
            padding: "12px 16px",
            borderBottom: "none", // Remove border-bottom for body cells
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#E8F5E9", // Hover effect
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: "500",
          },
          outlined: {
            borderColor: "#4CAF50",
            color: "#4CAF50",
            "&:hover": { borderColor: "#388E3C", color: "#388E3C" },
          },
          contained: {
            backgroundColor: "#4CAF50",
            color: "#FFFFFF",
            "&:hover": { backgroundColor: "#388E3C" },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
              "&:hover fieldset": { borderColor: "#388E3C" },
              "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "#757575",
            "&:hover": {
              color: "#4CAF50",
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
          sx={{
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? sidebarWidth : 0}px)` },
            transition: "width 0.3s ease",
          }}
        >
          <AdminNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobile={isMobile}
            sidebarWidth={sidebarOpen && !isMobile ? sidebarWidth : 0}
          />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
                  Vendors
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExport}
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Export
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => navigate("/add-vendor")} // Assuming you have a route to add vendors
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Add Vendor
                  </Button>
                </Box>
              </Box>

              {/* Search Bar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
                <TextField
                  placeholder="Search vendors..."
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, borderRadius: "20px" }}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                >
                  Filter
                </Button>
              </Box>

              {/* Vendor Form */}
              {user?.isAdmin && (isEditing || !editId) && (
                <Card sx={{ mb: 4, bgcolor: "background.paper", boxShadow: "none", border: "1px solid #E0E0E0" }}>
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
                            sx={{ mt: 2, py: 1, borderRadius: "10px", textTransform: "none" }}
                          >
                            {isEditing ? "Update Vendor" : "Add Vendor"}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Vendor List */}
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                  border: "none",
                  bgcolor: "#FFFFFF", // White background
                  borderRadius: "8px",
                }}
              >
                <Table
                  sx={{
                    minWidth: { xs: 300, sm: 650 },
                    borderCollapse: "separate",
                    borderSpacing: "0 8px", // Add spacing between rows
                  }}
                  aria-label="vendor table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectedVendors.length === currentVendors.length && currentVendors.length > 0}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                        VENDORS{" "}
                        {sortField === "name" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      <TableCell onClick={() => handleSort("email")} sx={{ cursor: "pointer" }}>
                        EMAIL{" "}
                        {sortField === "email" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("phone")}
                        sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}
                      >
                        MOBILE NUMBER{" "}
                        {sortField === "phone" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("address")}
                        sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}
                      >
                        ADDRESS{" "}
                        {sortField === "address" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      {user?.isAdmin && <TableCell align="right">ACTIONS</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentVendors.map((v) => (
                      <TableRow key={v._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedVendors.includes(v._id)}
                            onChange={() => handleSelectVendor(v._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: "500" }}>
                              {v.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#757575" }}>
                              ID: {v._id.slice(0, 8)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{v.email}</TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{v.phone}</TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{v.address}</TableCell>
                        {user?.isAdmin && (
                          <TableCell align="right">
                            <IconButton onClick={() => handleEdit(v._id, v)} color="inherit">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => openDeleteDialog(v._id)} color="inherit">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Items per page</InputLabel>
                  <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Items per page">
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography>
                    Page {currentPage} of {totalPages}
                  </Typography>
                  <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={closeDeleteDialog}
              PaperProps={{
                sx: { borderRadius: "10px" },
              }}
              sx={{
                backdropFilter: "blur(5px)", // Blurs the background
              }}
            >
              <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete this vendor?</Typography>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} variant="contained" color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageVendors;