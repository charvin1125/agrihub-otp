import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Card,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Icon for Add Stock
import "./styles/manageproduct.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
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
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setProducts((prev) =>
      [...prev].sort((a, b) => {
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
      })
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.oldestBatch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            fontWeight: "bold",
            backgroundColor: darkMode ? "#388E3C" : "#66BB6A",
            color: "#fff",
          },
          body: { padding: { xs: "8px", sm: "10px" } },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
          },
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 2, sm: 3 }, flexWrap: "wrap", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
            >
              Manage Products
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/add-product"
                sx={{ px: { xs: 2, sm: 3 }, py: 1, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
              >
                + Add New Product
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/add-stock"
                startIcon={<AddCircleIcon />}
                sx={{ px: { xs: 2, sm: 3 }, py: 1, bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
              >
                Add Stock
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <TextField
              variant="outlined"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </IconButton>
                ),
              }}
              sx={{ width: { xs: "100%", sm: "400px" } }}
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <TableContainer component={Paper}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress color="primary" size={60} />
                </Box>
              ) : (
                <>
                  <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="product table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                          Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell onClick={() => handleSort("categoryName")} sx={{ cursor: "pointer", display: { xs: "none", sm: "table-cell" } }}>
                          Category {sortField === "categoryName" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell onClick={() => handleSort("brandName")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
                          Brand {sortField === "brandName" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell onClick={() => handleSort("oldestBatch.batchNumber")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
                          Oldest Batch {sortField === "oldestBatch.batchNumber" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell onClick={() => handleSort("oldestBatch.sellingPrice")} sx={{ cursor: "pointer", display: { xs: "none", md: "table-cell" } }}>
                          Price {sortField === "oldestBatch.sellingPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell onClick={() => handleSort("totalStock")} sx={{ cursor: "pointer", display: { xs: "none", sm: "table-cell" } }}>
                          Total Stock {sortField === "totalStock" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((product) => (
                            <TableRow
                              key={product._id}
                              sx={{
                                "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5", transition: "background-color 0.2s" },
                              }}
                            >
                              <TableCell>
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
                              <TableCell sx={{ color: "text.primary" }}>{product.name}</TableCell>
                              <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                                {product.categoryName}
                              </TableCell>
                              <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
                                {product.brandName}
                              </TableCell>
                              <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
                                {product.oldestBatch.batchNumber}
                              </TableCell>
                              <TableCell sx={{ color: "text.primary", display: { xs: "none", md: "table-cell" } }}>
                                ₹{product.oldestBatch.sellingPrice.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: "text.primary", display: { xs: "none", sm: "table-cell" } }}>
                                {product.totalStock}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      component={Link}
                                      to={`/edit-product/${product._id}`}
                                      color="primary"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton onClick={() => handleDelete(product._id)} color="secondary">
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ color: "text.primary" }}>
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredProducts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: isMobile ? "0.75rem" : "0.875rem" } }}
                  />
                </>
              )}
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageProducts;