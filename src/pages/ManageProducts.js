// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   TextField,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   Card,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SearchIcon from "@mui/icons-material/Search";
// import MenuIcon from "@mui/icons-material/Menu";
// import AddCircleIcon from "@mui/icons-material/AddCircle"; // Icon for Add Stock
// import "./styles/manageproduct.css";

// const ManageProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortField, setSortField] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();

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

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       console.log("Raw product response:", productRes.data);

//       const updatedProducts = productRes.data.map((product) => {
//         const totalStock = product.variants.reduce(
//           (sum, variant) => sum + variant.batches.reduce((batchSum, batch) => batchSum + (batch.stock || 0), 0),
//           0
//         );
//         const oldestBatch = product.variants
//           .flatMap((variant) => variant.batches)
//           .filter((batch) => batch.stock > 0)
//           .sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate))[0];

//         return {
//           ...product,
//           categoryName: product.category?.name || "Unknown Category",
//           brandName: product.brand?.name || "Unknown Brand",
//           mainImage: product.images.find((img) => img.isMain)?.url || product.images[0]?.url || "",
//           totalStock,
//           oldestBatch: oldestBatch || { batchNumber: "N/A", sellingPrice: 0, stock: 0 },
//         };
//       });

//       setProducts(updatedProducts || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
//         setProducts(products.filter((product) => product._id !== id));
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   const handleSort = (field) => {
//     const isAsc = sortField === field && sortOrder === "asc";
//     setSortOrder(isAsc ? "desc" : "asc");
//     setSortField(field);
//     setProducts((prev) =>
//       [...prev].sort((a, b) => {
//         if (field === "name" || field === "categoryName" || field === "brandName") {
//           return isAsc ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field]);
//         } else if (field === "oldestBatch.batchNumber") {
//           return isAsc
//             ? b.oldestBatch.batchNumber.localeCompare(a.oldestBatch.batchNumber)
//             : a.oldestBatch.batchNumber.localeCompare(b.oldestBatch.batchNumber);
//         } else if (field === "totalStock" || field === "oldestBatch.sellingPrice") {
//           const aValue = field === "totalStock" ? a.totalStock : a.oldestBatch.sellingPrice;
//           const bValue = field === "totalStock" ? b.totalStock : b.oldestBatch.sellingPrice;
//           return isAsc ? bValue - aValue : aValue - bValue;
//         }
//         return 0;
//       })
//     );
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.oldestBatch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
//   );

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
//             fontWeight: "bold",
//             backgroundColor: darkMode ? "#388E3C" : "#66BB6A",
//             color: "#fff",
//           },
//           body: { padding: { xs: "8px", sm: "10px" } },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "8px",
//             textTransform: "none",
//             "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
//           },
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
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 3 }, flexWrap: "wrap", gap: 2 }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography
//               variant={isMobile ? "h5" : "h4"}
//               sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
//             >
//               Manage Products
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component={Link}
//                 to="/add-product"
//                 sx={{ px: { xs: 2, sm: 3 }, py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//               >
//                 + Add New Product
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 component={Link}
//                 to="/add-stock"
//                 startIcon={<AddCircleIcon />}
//                 sx={{ px: { xs: 2, sm: 3 }, py: 1, bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//               >
//                 Add Stock
//               </Button>
//             </Box>
//           </Box>

//           <Box sx={{ mb: { xs: 2, sm: 3 } }}>
//             <TextField
//               variant="outlined"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton>
//                     <SearchIcon sx={{ color: "text.secondary" }} />
//                   </IconButton>
//                 ),
//               }}
//               sx={{ width: { xs: "100%", sm: "400px" } }}
//               size={isMobile ? "small" : "medium"}
//             />
//           </Box>

//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <TableContainer component={Paper}>
//               {loading ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//                   <CircularProgress color="primary" size={60} />
//                 </Box>
//               ) : (
//                 <>
//                   <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="product table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Image</TableCell>
//                         <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
//                           Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort("categoryName")} sx={{ cursor: "pointer", display: { xs: "none", sm: "table-cell" } }}>
//                           Category {sortField === "categoryName" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort("brandName")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
//                           Brand {sortField === "brandName" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort("oldestBatch.batchNumber")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
//                           Oldest Batch {sortField === "oldestBatch.batchNumber" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort("oldestBatch.sellingPrice")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
//                           Price {sortField === "oldestBatch.sellingPrice" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort("totalStock")} sx={{ cursor: "pointer", display: { xs: "none", sm: "table-cell" } }}>
//                           Total Stock {sortField === "totalStock" && (sortOrder === "asc" ? "↑" : "↓")}
//                         </TableCell>
//                         <TableCell align="right">Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts
//                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                           .map((product) => (
//                             <TableRow
//                               key={product._id}
//                               sx={{
//                                 "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5", transition: "background-color 0.2s" },
//                               }}
//                             >
//                               <TableCell>
//                                 {product.mainImage ? (
//                                   <img
//                                     src={`http://localhost:5000/${product.mainImage}`}
//                                     alt={product.name}
//                                     style={{
//                                       height: isMobile ? 40 : 50,
//                                       width: isMobile ? 40 : 50,
//                                       objectFit: "cover",
//                                       borderRadius: "4px",
//                                     }}
//                                   />
//                                 ) : (
//                                   <Typography>No Image</Typography>
//                                 )}
//                               </TableCell>
//                               <TableCell sx={{ color: "text.primary" }}>{product.name}</TableCell>
//                               <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                                 {product.categoryName}
//                               </TableCell>
//                               <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
//                                 {product.brandName}
//                               </TableCell>
//                               <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
//                                 {product.oldestBatch.batchNumber}
//                               </TableCell>
//                               <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
//                                 ₹{product.oldestBatch.sellingPrice.toFixed(2)}
//                               </TableCell>
//                               <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
//                                 {product.totalStock}
//                               </TableCell>
//                               <TableCell align="right">
//                                 <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
//                                   <Tooltip title="Edit">
//                                     <IconButton
//                                       component={Link}
//                                       to={`/edit-product/${product._id}`}
//                                       color="primary"
//                                     >
//                                       <EditIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                   <Tooltip title="Delete">
//                                     <IconButton onClick={() => handleDelete(product._id)} color="secondary">
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </Tooltip>
//                                 </Box>
//                               </TableCell>
//                             </TableRow>
//                           ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={8} align="center" sx={{ color: "text.primary" }}>
//                             No products found
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                   <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredProducts.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     sx={{ "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: isMobile ? "0.75rem" : "0.875rem" } }}
//                   />
//                 </>
//               )}
//             </TableContainer>
//           </Card>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageProducts;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Tooltip,
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
  CircularProgress,
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/manageproduct.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Add state for filtered products
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const sidebarWidth = 260;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
      console.log("Raw product response:", productRes.data);

      const updatedProducts = productRes.data.map((product) => {
        const totalStock = product.variants.reduce(
          (sum, variant) => sum + variant.batches.reduce((batchSum, batch) => batchSum + (batch.stock || 0), 0),
          0
        );
        const oldestBatch = product.variants
          .flatMap((variant) => variant.batches)
          .filter((batch) => batch.stock > 0)
          .sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate))[0];

        return {
          ...product,
          categoryName: product.category?.name || "Unknown Category",
          brandName: product.brand?.name || "Unknown Brand",
          mainImage: product.images.find((img) => img.isMain)?.url || product.images[0]?.url || "",
          totalStock,
          oldestBatch: oldestBatch || { batchNumber: "N/A", sellingPrice: 0, stock: 0 },
        };
      });

      setProducts(updatedProducts || []);
      setFilteredProducts(updatedProducts || []); // Initialize filtered products
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${productToDelete}`, { withCredentials: true });
      setProducts(products.filter((product) => product._id !== productToDelete));
      setFilteredProducts(filteredProducts.filter((product) => product._id !== productToDelete));
      toast.success("Product deleted successfully!");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const openDeleteDialog = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (field === "name" || field === "categoryName" || field === "brandName") {
        return isAsc ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field]);
      } else if (field === "oldestBatch.batchNumber") {
        return isAsc
          ? b.oldestBatch.batchNumber.localeCompare(a.oldestBatch.batchNumber)
          : a.oldestBatch.batchNumber.localeCompare(b.oldestBatch.batchNumber);
      } else if (field === "totalStock" || field === "oldestBatch.sellingPrice") {
        const aValue = field === "totalStock" ? a.totalStock : a.oldestBatch.sellingPrice;
        const bValue = field === "totalStock" ? b.totalStock : b.oldestBatch.sellingPrice;
        return isAsc ? bValue - aValue : aValue - bValue;
      }
      return 0;
    });
    setFilteredProducts(sortedProducts);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(currentProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm) ||
        product.brandName.toLowerCase().includes(searchTerm) ||
        product.oldestBatch.batchNumber.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
    setPage(0); // Reset to first page on search
  };

  const handleExport = () => {
    const csvContent = filteredProducts
      .map((p) =>
        `${p.name},${p.categoryName},${p.brandName},${p.oldestBatch.batchNumber},${p.oldestBatch.sellingPrice},${p.totalStock}`
      )
      .join("\n");
    const blob = new Blob([`Name,Category,Brand,Oldest Batch,Price,Total Stock\n${csvContent}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const currentProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            borderBottom: "none",
          },
          body: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            color: darkMode ? "#e0e0e0" : "#212121",
            padding: "12px 16px",
            borderBottom: "none",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#E8F5E9",
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
                  Products
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
                    component={Link}
                    to="/add-product"
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleIcon />}
                    component={Link}
                    to="/add-stock"
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Add Stock
                  </Button>
                </Box>
              </Box>

              {/* Search Bar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
                <TextField
                  placeholder="Search products..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearch}
                  sx={{ flexGrow: 1, borderRadius: "20px" }}
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

              {/* Product List */}
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  bgcolor: "#FFFFFF",
                  borderRadius: "8px",
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress color="primary" size={60} />
                  </Box>
                ) : (
                  <Table
                    sx={{
                      minWidth: { xs: 300, sm: 650 },
                      borderCollapse: "separate",
                      borderSpacing: "0 8px",
                    }}
                    aria-label="product table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                          NAME{" "}
                          {sortField === "name" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          IMAGE
                        </TableCell>
                        <TableCell
                          onClick={() => handleSort("categoryName")}
                          sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}
                        >
                          CATEGORY{" "}
                          {sortField === "categoryName" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell
                          onClick={() => handleSort("brandName")}
                          sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}
                        >
                          BRAND{" "}
                          {sortField === "brandName" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell
                          onClick={() => handleSort("oldestBatch.batchNumber")}
                          sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}
                        >
                          OLDEST BATCH{" "}
                          {sortField === "oldestBatch.batchNumber" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell
                          onClick={() => handleSort("oldestBatch.sellingPrice")}
                          sx={{ display: { xs: "none", md: "table-cell" }, cursor: "pointer" }}
                        >
                          PRICE{" "}
                          {sortField === "oldestBatch.sellingPrice" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell
                          onClick={() => handleSort("totalStock")}
                          sx={{ display: { xs: "none", sm: "table-cell" }, cursor: "pointer" }}
                        >
                          TOTAL STOCK{" "}
                          {sortField === "totalStock" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                        </TableCell>
                        <TableCell align="right">ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => handleSelectProduct(product._id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: "500" }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#757575" }}>
                                  ID: {product._id.slice(0, 8)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                              {product.mainImage ? (
                                <img
                                  src={`http://localhost:5000/${product.mainImage}`}
                                  alt={product.name}
                                  style={{
                                    height: isMobile ? 40 : 50,
                                    width: isMobile ? 40 : 50,
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                              ) : (
                                <Typography>No Image</Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{product.categoryName}</TableCell>
                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{product.brandName}</TableCell>
                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{product.oldestBatch.batchNumber}</TableCell>
                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                              ₹{product.oldestBatch.sellingPrice.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{product.totalStock}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    component={Link}
                                    to={`/edit-product/${product._id}`}
                                    color="inherit"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton onClick={() => openDeleteDialog(product._id)} color="inherit">
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ color: "text.primary" }}>
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Items per page</InputLabel>
                  <Select value={rowsPerPage} onChange={handleRowsPerPageChange} label="Items per page">
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography>
                    Page {page + 1} of {totalPages}
                  </Typography>
                  <IconButton onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
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
                backdropFilter: "blur(5px)",
              }}
            >
              <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete this product?</Typography>
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

export default ManageProducts;