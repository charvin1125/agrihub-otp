import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          axios.get("http://localhost:5000/api/product/list"),
          axios.get("http://localhost:5000/api/category/list"),
          axios.get("http://localhost:5000/api/vendor/list"),
        ]);

        const categoryMap = categoryRes.data.reduce((acc, category) => {
          acc[category._id] = category.name;
          return acc;
        }, {});
        const brandMap = brandRes.data.reduce((acc, brand) => {
          acc[brand._id] = brand.name;
          return acc;
        }, {});

        const updatedProducts = productRes.data.map((product) => {
          const categoryId =
            typeof product.category === "object" && product.category?._id
              ? product.category._id
              : product.category;
          const brandId =
            typeof product.brand === "object" && product.brand?._id
              ? product.brand._id
              : product.brand;

          return {
            ...product,
            mainImage:
              product.images.find((img) => img.isMain)?.url ||
              product.images[0]?.url ||
              "",
            categoryId,
            brandId,
            categoryName: categoryMap[categoryId] || "Unknown Category",
            brandName: brandMap[brandId] || "Unknown Brand",
          };
        });

        setProducts(updatedProducts || []);
        setCategories(categoryMap);
        setBrands(brandMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter ? product.categoryId === categoryFilter : true) &&
      (brandFilter ? product.brandId === brandFilter : true)
  );

  const theme = createTheme({
    palette: {
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: "#F7F9F7", paper: "#FFFFFF" },
      text: { primary: "#1A1A1A", secondary: "#616161" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "24px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-10px)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
            },
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.9rem", md: "1rem" },
            padding: { xs: "10px 18px", md: "12px 24px" },
            backgroundColor: "#2E7D32",
            color: "#FFF",
            "&:hover": {
              backgroundColor: "#81C784",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: "#FFFFFF",
              "& fieldset": { borderColor: "#81C784" },
              "&:hover fieldset": { borderColor: "#2E7D32" },
              "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: "#FFFFFF",
              "& fieldset": { borderColor: "#81C784" },
              "&:hover fieldset": { borderColor: "#2E7D32" },
              "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
            },
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            "& a": {
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            },
          },
          separator: { color: "text.secondary" },
        },
      },
    },
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress size={60} sx={{ color: "#2E7D32" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />

        {/* Header Section with Breadcrumbs */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            py: { xs: 4, sm: 5 },
            bgcolor: "#E8F5E9",
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: { xs: 2, sm: 3 }, justifyContent: "center", display: "flex" }}
            >
              <Link to="/">
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                Home
              </Link>
              <Typography color="text.primary">Products</Typography>
            </Breadcrumbs>
            <Typography
              variant={isMobile ? "h4" : "h2"}
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 1.5,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              Our Products
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.2rem" },
                fontWeight: 400,
              }}
            >
              Discover premium agricultural products for modern farming.
            </Typography>
          </Container>
        </Box>

        {/* Filter and Search Section */}
        <Box sx={{ py: { xs: 4, sm: 5 }, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant="outlined"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                    ),
                  }}
                  sx={{ "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", md: "1rem" } } }}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, fontWeight: 500 }}>
                    Category
                  </InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {Object.entries(categories).map(([id, name]) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, fontWeight: 500 }}>
                    Brand
                  </InputLabel>
                  <Select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    label="Brand"
                    sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {Object.entries(brands).map(([id, name]) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Products Section */}
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 5, sm: 7 }, flexGrow: 1 }}
        >
          <Container maxWidth="lg">
            {filteredProducts.length === 0 ? (
              <Typography
                variant="h6"
                sx={{ textAlign: "center", color: "text.secondary", py: 4, fontWeight: 500 }}
              >
                No products found. Try adjusting your filters!
              </Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {filteredProducts.map((product) => {
                  const variantPrices = product.variants.map((variant) => {
                    const latestBatch = variant.batches
                      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))[0];
                    return latestBatch ? latestBatch.sellingPrice : Infinity;
                  });
                  const minPrice =
                    variantPrices.length > 0 ? Math.min(...variantPrices.filter((p) => p !== Infinity)) : "N/A";
                  // Assuming size is available in the first variant; adjust if needed
                  const size = product.variants[0]?.size || "N/A";

                  return (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          image={
                            product.mainImage
                              ? `http://localhost:5000/${product.mainImage}`
                              : "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={product.name}
                          sx={{
                            height: { xs: 200, sm: 240, md: 280 },
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            "&:hover": { transform: "scale(1.08)" },
                          }}
                        />
                        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: "center" }}>
                          <Typography
                            variant={isMobile ? "h6" : "h5"}
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              mb: 1,
                              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.75rem" },
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "text.secondary",
                              mb: 1.5,
                              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                              fontWeight: 500,
                            }}
                          >
                            Size: {size}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "primary.main",
                              fontWeight: 700,
                              mb: 2,
                              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                            }}
                          >
                            ₹{minPrice === "N/A" ? "N/A" : minPrice}
                          </Typography>
                          <Button
                            component={Link}
                            to={`/products/${product._id}`}
                            variant="contained"
                            fullWidth
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ProductPage;