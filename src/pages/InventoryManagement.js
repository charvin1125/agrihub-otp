// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import EditIcon from "@mui/icons-material/Edit";
// import SearchIcon from "@mui/icons-material/Search";
// import MenuIcon from "@mui/icons-material/Menu";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const InventoryManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [editProduct, setEditProduct] = useState(null);
//   const [editVariant, setEditVariant] = useState(null);
//   const [editBatch, setEditBatch] = useState(null); // New state for editing a specific batch
//   const [editStock, setEditStock] = useState(0);
//   const [expanded, setExpanded] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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
//     setLoading(true);
//     try {
//       const [productRes, categoryRes, brandRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//         axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//         axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//       ]);

//       console.log("Raw Product Response:", productRes.data);
//       console.log("Raw Category Response:", categoryRes.data);
//       console.log("Raw Brand Response:", brandRes.data);

//       const categories = categoryRes.data.reduce((acc, category) => {
//         acc[category._id] = category.name;
//         return acc;
//       }, {});

//       const brands = brandRes.data.reduce((acc, brand) => {
//         acc[brand._id] = brand.name;
//         return acc;
//       }, {});

//       const updatedProducts = productRes.data.map((product) => {
//         const categoryId = typeof product.category === "object" && product.category?._id
//           ? product.category._id
//           : product.category;
//         const brandId = typeof product.brand === "object" && product.brand?._id
//           ? product.brand._id
//           : product.brand;

//         return {
//           ...product,
//           categoryId,
//           brandId,
//           categoryName: categories[categoryId] || "Unknown Category",
//           brandName: brands[brandId] || "Unknown Brand",
//         };
//       });

//       console.log("Processed Products:", updatedProducts);

//       setProducts(updatedProducts || []);
//       setFilteredProducts(updatedProducts || []);
//     } catch (error) {
//       console.error("❌ Error fetching data:", error);
//       setProducts([]);
//       setFilteredProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = products.filter(
//       (product) =>
//         product.name?.toLowerCase().includes(query) ||
//         product.categoryName?.toLowerCase().includes(query) ||
//         product.brandName?.toLowerCase().includes(query)
//     );
//     setFilteredProducts(filtered);
//   };

//   const handleEditStock = (product, variant, batch) => {
//     setEditProduct(product);
//     setEditVariant(variant);
//     setEditBatch(batch);
//     setEditStock(batch.stock || 0);
//   };

//   const handleUpdateStock = async () => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/products/${editProduct._id}/update-stock`,
//         {
//           variantId: editVariant._id,
//           batchId: editBatch._id,
//           stock: editStock,
//         },
//         { withCredentials: true }
//       );
//       setEditProduct(null);
//       setEditVariant(null);
//       setEditBatch(null);
//       fetchProducts();
//       alert("Stock updated successfully!");
//     } catch (error) {
//       console.error("Failed to update stock:", error);
//       alert("Failed to update stock");
//     }
//   };

//   const handleExportCSV = () => {
//     const csv =
//       "Product Name,Category,Brand,Variants\n" +
//       filteredProducts
//         .map((p) =>
//           `${p.name},${p.categoryName},${p.brandName},${p.variants
//             .map((v) =>
//               v.batches.map((b) => `${v.size} (Batch ${b.batchNumber}): ${b.stock}`).join(";")
//             )
//             .join(";")}`
//         )
//         .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "inventory.csv";
//     a.click();
//   };

//   const handleGenerateReport = () => {
//     const doc = new jsPDF();
//     const date = new Date().toLocaleDateString();

//     doc.setFontSize(18);
//     doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
//     doc.text("Inventory Report - AgriHub", 14, 20);
//     doc.setFontSize(12);
//     doc.setTextColor(100);
//     doc.text(`Generated on: ${date}`, 14, 30);

//     console.log("Filtered Products for Report:", filteredProducts);

//     const tableData = filteredProducts.map((product) => [
//       product.name || "N/A",
//       product.categoryName || "N/A",
//       product.brandName || "N/A",
//       product.variants
//         .map((v) => v.batches.map((b) => `${v.size} (Batch ${b.batchNumber}): ${b.stock || 0}`).join(", "))
//         .join(", "),
//       product.variants.reduce((sum, v) => sum + v.batches.reduce((bSum, b) => bSum + (b.stock || 0), 0), 0),
//     ]);

//     doc.autoTable({
//       startY: 40,
//       head: [["Product Name", "Category", "Brand", "Variants (Size: Batch: Stock)", "Total Stock"]],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 10, cellPadding: 2 },
//       headStyles: { fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], textColor: [255, 255, 255] },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//     });

//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setTextColor(150);
//       doc.text(`Page ${i} of ${pageCount}`, 180, 290);
//     }

//     doc.save("inventory_report.pdf");
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
//               bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
//               borderRadius: "8px",
//               "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
//               "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
//             },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
//         },
//       },
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             fontWeight: "bold",
//             backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
//             color: "#fff",
//           },
//           body: { padding: { xs: "8px", sm: "14px" } },
//         },
//       },
//     },
//   });

//   const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
//   const modalFade = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };

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
//           component={motion.section}
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 4 },
//             bgcolor: "background.default",
//             width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? 260 : 70}px)` },
//             transition: "width 0.3s ease",
//           }}
//         >
//           <Box
//             sx={{
//               mb: { xs: 2, sm: 4 },
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               justifyContent: "space-between",
//               alignItems: { xs: "flex-start", sm: "center" },
//               gap: 2,
//             }}
//           >
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}>
//               Inventory Management
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search inventory..."
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton>
//                       <SearchIcon sx={{ color: "primary.main" }} />
//                     </IconButton>
//                   ),
//                 }}
//                 sx={{ width: { xs: "100%", sm: "300px" } }}
//                 size={isMobile ? "small" : "medium"}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleExportCSV}
//                 startIcon={<PictureAsPdfIcon />}
//                 sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//               >
//                 Export CSV
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleGenerateReport}
//                 startIcon={<PictureAsPdfIcon />}
//                 sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//               >
//                 Generate Report
//               </Button>
//             </Box>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
//               <CircularProgress size={60} sx={{ color: "primary.main" }} />
//             </Box>
//           ) : filteredProducts.length === 0 ? (
//             <Box sx={{ textAlign: "center", mt: 5 }}>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
//                 No products found in inventory.
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={isMobile ? 2 : 3}>
//               {filteredProducts.map((product) => (
//                 <Grid item xs={12} key={product._id}>
//                   <Card component={motion.div} whileHover={{ scale: 1.02 }} sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
//                     <CardContent>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                         <Box
//                           sx={{ cursor: "pointer" }}
//                           onClick={() => setExpanded(expanded === product._id ? null : product._id)}
//                         >
//                           <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                             {product.name || "N/A"} {expanded === product._id ? "▼" : "►"}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Category: {product.categoryName || "N/A"} | Brand: {product.brandName || "N/A"}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       {expanded === product._id && (
//                         <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
//                           <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="variants table">
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell>Size</TableCell>
//                                 <TableCell align="right">Batch Number</TableCell>
//                                 <TableCell align="right">Stock</TableCell>
//                                 <TableCell align="right">Action</TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {product.variants.length > 0 ? (
//                                 product.variants.flatMap((variant) =>
//                                   variant.batches.length > 0 ? (
//                                     variant.batches.map((batch) => (
//                                       <TableRow key={`${variant._id}-${batch._id}`} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
//                                         <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
//                                         <TableCell align="right" sx={{ color: "text.primary" }}>{batch.batchNumber || "N/A"}</TableCell>
//                                         <TableCell align="right">
//                                           <Chip
//                                             label={`${batch.stock || 0} in stock`}
//                                             color={batch.stock <= 5 ? "error" : "success"}
//                                             size={isMobile ? "small" : "medium"}
//                                           />
//                                         </TableCell>
//                                         <TableCell align="right">
//                                           <Tooltip title="Edit Stock">
//                                             <IconButton color="primary" onClick={() => handleEditStock(product, variant, batch)}>
//                                               <EditIcon />
//                                             </IconButton>
//                                           </Tooltip>
//                                         </TableCell>
//                                       </TableRow>
//                                     ))
//                                   ) : (
//                                     <TableRow key={variant._id}>
//                                       <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
//                                       <TableCell colSpan={3} align="center">
//                                         <Typography variant="body2" color="error">
//                                           No batches available
//                                         </Typography>
//                                       </TableCell>
//                                     </TableRow>
//                                   )
//                                 )
//                               ) : (
//                                 <TableRow>
//                                   <TableCell colSpan={4} align="center">
//                                     <Typography variant="body2" color="error">
//                                       No variants available
//                                     </Typography>
//                                   </TableCell>
//                                 </TableRow>
//                               )}
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}

//           {editProduct && editVariant && editBatch && (
//             <Box
//               component={motion.div}
//               initial="hidden"
//               animate="visible"
//               variants={modalFade}
//               sx={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 bgcolor: "rgba(0,0,0,0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 zIndex: 1300,
//               }}
//             >
//               <Card sx={{ p: 3, width: { xs: "90%", sm: "400px" }, borderRadius: "12px", bgcolor: darkMode ? "#263238" : "#fff" }}>
//                 <CardContent>
//                   <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
//                     Update Stock
//                   </Typography>
//                   <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
//                     Product: <b>{editProduct.name || "N/A"}</b> ({editVariant.size || "N/A"}, Batch: {editBatch.batchNumber || "N/A"})
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     type="number"
//                     label="Stock Quantity"
//                     value={editStock}
//                     onChange={(e) => setEditStock(Number(e.target.value))}
//                     variant="outlined"
//                     inputProps={{ min: 0 }}
//                     sx={{ mb: 3 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
//                   <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleUpdateStock}
//                       fullWidth
//                       sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       onClick={() => {
//                         setEditProduct(null);
//                         setEditVariant(null);
//                         setEditBatch(null);
//                       }}
//                       fullWidth
//                       sx={{ borderColor: darkMode ? "#A5D6A7" : "#4CAF50", color: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { borderColor: darkMode ? "#81C784" : "#388E3C" } }}
//                     >
//                       Cancel
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default InventoryManagement;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editVariant, setEditVariant] = useState(null);
  const [editBatch, setEditBatch] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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
    setLoading(true);
    try {
      const [productRes, categoryRes, brandRes] = await Promise.all([
        axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
        axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
        axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
      ]);

      const categories = categoryRes.data.reduce((acc, category) => {
        acc[category._id] = category.name;
        return acc;
      }, {});

      const brands = brandRes.data.reduce((acc, brand) => {
        acc[brand._id] = brand.name;
        return acc;
      }, {});

      const updatedProducts = productRes.data.map((product) => {
        const categoryId = typeof product.category === "object" && product.category?._id
          ? product.category._id
          : product.category;
        const brandId = typeof product.brand === "object" && product.brand?._id
          ? product.brand._id
          : product.brand;

        return {
          ...product,
          categoryId,
          brandId,
          categoryName: categories[categoryId] || "Unknown Category",
          brandName: brands[brandId] || "Unknown Brand",
        };
      });

      setProducts(updatedProducts || []);
      setFilteredProducts(updatedProducts || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.categoryName?.toLowerCase().includes(query) ||
        product.brandName?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleEditStock = (product, variant, batch) => {
    setEditProduct(product);
    setEditVariant(variant);
    setEditBatch(batch);
    setEditStock(batch.stock || 0);
  };

  const handleUpdateStock = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}/update-stock`,
        {
          variantId: editVariant._id,
          batchId: editBatch._id,
          stock: editStock,
        },
        { withCredentials: true }
      );
      setEditProduct(null);
      setEditVariant(null);
      setEditBatch(null);
      fetchProducts();
      alert("Stock updated successfully!");
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Failed to update stock");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Product Name", "Category", "Brand", "Size", "Batch Number", "Stock", "Status"];
    const csvRows = [
      headers.join(","), // Header row
      ...filteredProducts.flatMap((product) =>
        product.variants.flatMap((variant) =>
          variant.batches.map((batch) => {
            const row = [
              `"${product.name || "N/A"}"`,
              `"${product.categoryName || "N/A"}"`,
              `"${product.brandName || "N/A"}"`,
              `"${variant.size || "N/A"}"`,
              `"${batch.batchNumber || "N/A"}"`,
              batch.stock || 0,
              batch.stock <= 5 ? "Low" : "Sufficient",
            ];
            return row.join(",");
          })
        )
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Inventory Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    const tableData = filteredProducts.flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.batches.map((batch) => [
          product.name || "N/A",
          product.categoryName || "N/A",
          product.brandName || "N/A",
          variant.size || "N/A",
          batch.batchNumber || "N/A",
          batch.stock || 0,
          batch.stock <= 5 ? "Low" : "Sufficient",
        ])
      )
    );

    doc.autoTable({
      startY: 40,
      head: [["Product Name", "Category", "Brand", "Size", "Batch Number", "Stock", "Status"]],
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

    doc.save("inventory_report.pdf");
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
              bgcolor: darkMode ? "#E8F5E9" : "#F1F8E9",
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#A5D6A7" : "#81C784" },
              "&:hover fieldset": { borderColor: darkMode ? "#81C784" : "#4CAF50" },
              "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: "bold",
            backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
            color: "#fff",
          },
          body: { padding: { xs: "8px", sm: "14px" } },
        },
      },
    },
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const modalFade = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };

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
          <Box
            sx={{
              mb: { xs: 2, sm: 4 },
            }}
          >
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
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}>
                Inventory Management
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
                <TextField
                  variant="outlined"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <SearchIcon sx={{ color: "primary.main" }} />
                      </IconButton>
                    ),
                  }}
                  sx={{ width: { xs: "100%", sm: "300px" } }}
                  size={isMobile ? "small" : "medium"}
                />
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
                <InventoryIcon sx={{ mr: 0.5 }} fontSize="small" />
                Inventory Management
              </Typography>
            </Breadcrumbs>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress size={60} sx={{ color: "primary.main" }} />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
                No products found in inventory.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} key={product._id}>
                  <Card component={motion.div} whileHover={{ scale: 1.02 }} sx={{ bgcolor: darkMode ? "#263238" : "#fff" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => setExpanded(expanded === product._id ? null : product._id)}
                        >
                          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
                            {product.name || "N/A"} {expanded === product._id ? "▼" : "►"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Category: {product.categoryName || "N/A"} | Brand: {product.brandName || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      {expanded === product._id && (
                        <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
                          <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="variants table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Size</TableCell>
                                <TableCell align="right">Batch Number</TableCell>
                                <TableCell align="right">Stock</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {product.variants.length > 0 ? (
                                product.variants.flatMap((variant) =>
                                  variant.batches.length > 0 ? (
                                    variant.batches.map((batch) => (
                                      <TableRow key={`${variant._id}-${batch._id}`} sx={{ "&:hover": { bgcolor: darkMode ? "#2E7D32" : "#F1F8E9" } }}>
                                        <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
                                        <TableCell align="right" sx={{ color: "text.primary" }}>{batch.batchNumber || "N/A"}</TableCell>
                                        <TableCell align="right">
                                          <Chip
                                            label={`${batch.stock || 0} in stock`}
                                            color={batch.stock <= 5 ? "error" : "success"}
                                            size={isMobile ? "small" : "medium"}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow key={variant._id}>
                                      <TableCell sx={{ color: "text.primary" }}>{variant.size || "N/A"}</TableCell>
                                      <TableCell colSpan={2} align="center">
                                        <Typography variant="body2" color="error">
                                          No batches available
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="error">
                                      No variants available
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {editProduct && editVariant && editBatch && (
            <Box
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={modalFade}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1300,
              }}
            >
              <Card sx={{ p: 3, width: { xs: "90%", sm: "400px" }, borderRadius: "12px", bgcolor: darkMode ? "#263238" : "#fff" }}>
                <CardContent>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
                    Update Stock
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
                    Product: <b>{editProduct.name || "N/A"}</b> ({editVariant.size || "N/A"}, Batch: {editBatch.batchNumber || "N/A"})
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    label="Stock Quantity"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                    sx={{ mb: 3 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateStock}
                      fullWidth
                      sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setEditProduct(null);
                        setEditVariant(null);
                        setEditBatch(null);
                      }}
                      fullWidth
                      sx={{ borderColor: darkMode ? "#A5D6A7" : "#4CAF50", color: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { borderColor: darkMode ? "#81C784" : "#388E3C" } }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default InventoryManagement;