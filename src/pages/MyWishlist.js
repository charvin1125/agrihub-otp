import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/Navbar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [darkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const fetchWishlist = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/users/wishlist", { withCredentials: true });
          setWishlist(response.data.wishlist || []);
        } catch (error) {
          console.error("Error fetching wishlist:", error); // This logs the AxiosError
          toast.error("Failed to load wishlist. Please log in.");
        } finally {
          setLoading(false);
        }
      };
    fetchWishlist();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/wishlist/remove",
        { productId },
        { withCredentials: true }
      );
      setWishlist(wishlist.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
      background: { default: darkMode ? "#121212" : "#f5f5f5", paper: darkMode ? "#1e1e1e" : "#fff" },
      text: { primary: darkMode ? "#E0E0E0" : "#212121", secondary: darkMode ? "#B0B0B0" : "#757575" },
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
            bgcolor: darkMode ? "#263238" : "#fff",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        },
      },
      MuiButton: {
        styleOverrides: { root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 } },
      },
    },
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress size={60} sx={{ color: darkMode ? "#66BB6A" : "#388E3C" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <NavigationBar />
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ py: { xs: 6, sm: 8 }, textAlign: "center", bgcolor: darkMode ? "#1A3C34" : "#E8F5E9" }}
        >
          <Container maxWidth="md">
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{ fontWeight: "bold", color: darkMode ? "#FFF" : "#388E3C", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
            >
              My Wishlist
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: darkMode ? "#E0E0E0" : "#757575", mb: 4, fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              Your favorite products
            </Typography>
          </Container>
        </Box>

        <Box component={motion.section} initial="hidden" animate="visible" variants={fadeIn} sx={{ py: { xs: 6, sm: 8 } }}>
          <Container maxWidth="lg">
            {wishlist.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                Your wishlist is empty.
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {wishlist.map((product) => {
                  const variantPrices = product.variants.map((variant) => {
                    const latestBatch = variant.batches
                      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))[0];
                    return latestBatch ? latestBatch.sellingPrice : Infinity;
                  });
                  const minPrice =
                    variantPrices.length > 0 ? Math.min(...variantPrices.filter((p) => p !== Infinity)) : "N/A";
                  const maxPrice =
                    variantPrices.length > 1 ? Math.max(...variantPrices.filter((p) => p !== Infinity)) : null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <Card sx={{ maxWidth: 345, mx: "auto", position: "relative" }}>
                        <CardMedia
                          component="img"
                          image={
                            product.images.find((img) => img.isMain)?.url
                              ? `http://localhost:5000/${product.images.find((img) => img.isMain).url}`
                              : "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={product.name}
                          sx={{
                            height: 200,
                            width: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                          }}
                        />
                        <IconButton
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <CardContent sx={{ flexGrow: 1, p: 3, textAlign: "center" }}>
                          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                            {product.category?.name || "Unknown Category"} | {product.brand?.name || "Unknown Brand"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? "#81C784" : "#388E3C", fontWeight: "medium", mb: 2 }}>
                            Price: ₹{minPrice === "N/A" ? "N/A" : minPrice}{maxPrice && ` - ₹${maxPrice}`}
                          </Typography>
                          <Button
                            component={Link}
                            to={`/products/${product._id}`}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
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

        <Box sx={{ py: 4, bgcolor: darkMode ? "#1A3C34" : "#E8F5E9", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} AgriHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MyWishlist;