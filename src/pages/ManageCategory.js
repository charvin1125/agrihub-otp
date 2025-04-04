//after add the mobile Responsive 
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
// import "./styles/Category.css"; // Keep if you want additional custom styles

// const ManageCategory = () => {
//   const [category, setCategory] = useState({ name: "", description: "" });
//   const [categories, setCategories] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   // Fetch initial data
//   useEffect(() => {
//     fetchCategories();
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

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/category/list", { withCredentials: true });
//       setCategories(response.data);
//     } catch (error) {
//       alert("Failed to fetch categories");
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
//     setCategory({ ...category, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?.isAdmin) {
//       alert("Unauthorized: Admin access only");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:5000/api/category/${editId}`, category, { withCredentials: true });
//         alert("Category updated successfully!");
//         setIsEditing(false);
//         setEditId(null);
//       } else {
//         await axios.post("http://localhost:5000/api/category/add", category, { withCredentials: true });
//         alert("Category added successfully!");
//       }
//       setCategory({ name: "", description: "" });
//       fetchCategories();
//     } catch (error) {
//       alert(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   const handleEdit = (id, currentCategory) => {
//     setCategory(currentCategory);
//     setEditId(id);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id) => {
//     if (!user?.isAdmin) {
//       alert("Only admins can perform this action");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/category/${id}`, { withCredentials: true });
//         alert("Category deleted successfully!");
//         fetchCategories();
//       } catch (error) {
//         alert("Failed to delete category");
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
//               Manage Categories
//             </Typography>
//           </Box>

//           {/* Category Form */}
//           {user?.isAdmin ? (
//             <Card sx={{ mb: { xs: 2, sm: 4 }, bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
//                   {isEditing ? "Edit Category" : "Add New Category"}
//                 </Typography>
//                 <form onSubmit={handleSubmit}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Category Name"
//                         name="name"
//                         value={category.name}
//                         onChange={handleChange}
//                         required
//                         variant="outlined"
//                         size={isMobile ? "small" : "medium"}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Description"
//                         name="description"
//                         value={category.description}
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
//                         {isEditing ? "Update Category" : "Add Category"}
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </form>
//               </CardContent>
//             </Card>
//           ) : (
//             <Typography variant="body1" sx={{ color: "secondary.main", mb: 2 }}>
//               You do not have permission to manage categories.
//             </Typography>
//           )}

//           {/* Category List */}
//           <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2, color: "text.primary" }}>
//             Category List
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="category table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>Name</TableCell>
//                   <TableCell sx={{ fontWeight: "bold", color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>Description</TableCell>
//                   {user?.isAdmin && (
//                     <TableCell sx={{ fontWeight: "bold", color: "text.primary" }} align="right">
//                       Actions
//                     </TableCell>
//                   )}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {categories.map((c) => (
//                   <TableRow key={c._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}>
//                     <TableCell sx={{ color: "text.primary" }}>{c.name}</TableCell>
//                     <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>{c.description}</TableCell>
//                     {user?.isAdmin && (
//                       <TableCell align="right">
//                         <IconButton onClick={() => handleEdit(c._id, c)} color="primary">
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(c._id)} color="secondary">
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

// export default ManageCategory;
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
import "./styles/Category.css"; // Keep if you want additional custom styles

const ManageCategory = () => {
  const [category, setCategory] = useState({ name: "", description: "" });
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const sidebarWidth = 260;
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category/list", { withCredentials: true });
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
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
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      toast.error("Unauthorized: Admin access only");
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/category/${editId}`, category, { withCredentials: true });
        toast.success("Category updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/category/add", category, { withCredentials: true });
        toast.success("Category added successfully!");
      }
      setCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (id, currentCategory) => {
    setCategory(currentCategory);
    setEditId(id);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!user?.isAdmin) {
      toast.error("Only admins can perform this action");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/category/${categoryToDelete}`, { withCredentials: true });
      toast.success("Category deleted successfully!");
      fetchCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const openDeleteDialog = (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleExport = () => {
    const csvContent = filteredCategories.map(c => `${c.name},${c.description}`).join("\n");
    const blob = new Blob([`Name,Description\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "categories.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCategories(currentCategories.map((c) => c._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
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
    const sortedCategories = [...filteredCategories].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? 1 : -1;
      if (a[field] > b[field]) return isAsc ? -1 : 1;
      return 0;
    });
    setFilteredCategories(sortedCategories);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
      primary: { main: "#4CAF50" }, // Match ManageVendors.js
      secondary: { main: "#FF5252" }, // Match ManageVendors.js
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
              backgroundColor: "#E8F5E9", // Hover effect matching ManageVendors.js
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
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
                  Categories
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
                    onClick={() => navigate("/add-category")} // Assuming a route for adding categories
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Add Category
                  </Button>
                </Box>
              </Box>

              {/* Search Bar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
                <TextField
                  placeholder="Search categories..."
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

              {/* Category Form */}
              {user?.isAdmin && (isEditing || !editId) && (
                <Card sx={{ mb: 4, bgcolor: "background.paper" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                      {isEditing ? "Edit Category" : "Add New Category"}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Category Name"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={category.description}
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
                            {isEditing ? "Update Category" : "Add Category"}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Category List */}
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
                  aria-label="category table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectedCategories.length === currentCategories.length && currentCategories.length > 0}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                        NAME{" "}
                        {sortField === "name" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("description")}
                        sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}
                      >
                        DESCRIPTION{" "}
                        {sortField === "description" && (sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                      </TableCell>
                      {user?.isAdmin && <TableCell align="right">ACTIONS</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentCategories.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCategories.includes(c._id)}
                            onChange={() => handleSelectCategory(c._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: "500" }}>
                              {c.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#757575" }}>
                              ID: {c._id.slice(0, 8)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{c.description}</TableCell>
                        {user?.isAdmin && (
                          <TableCell align="right">
                            <IconButton onClick={() => handleEdit(c._id, c)} color="inherit">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => openDeleteDialog(c._id)} color="inherit">
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
                <Typography>Are you sure you want to delete this category?</Typography>
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

export default ManageCategory;