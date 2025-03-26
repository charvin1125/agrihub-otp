import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";

const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    variants: [],
    images: [],
  });
  const [variant, setVariant] = useState({
    size: "",
    batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
  });
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(-1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
        if (res.data && res.data.isAdmin) {
          setUser(res.data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
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
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [categoryRes, brandRes, productRes] = await Promise.all([
            axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
            axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
            axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
          ]);
          setCategories(categoryRes.data || []);
          setBrands(brandRes.data || []);
          setProducts(productRes.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleVariantAdd = () => {
    const batch = variant.batches[0];
    if (
      variant.size &&
      batch.batchNumber &&
      batch.costPrice &&
      batch.sellingPrice &&
      batch.stock >= 0 &&
      batch.gst !== ""
    ) {
      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...variant }],
      }));
      setVariant({
        size: "",
        batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
      });
    } else {
      alert("Please fill all variant and batch details.");
    }
  };

  const handleVariantDelete = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantEdit = (index) => {
    const editVariant = product.variants[index];
    setVariant(editVariant);
    handleVariantDelete(index);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleMainImageSelect = (index) => {
    setMainImageIndex(index);
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === mainImageIndex) setMainImageIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    if (mainImageIndex === -1) {
      alert("Please select a main image");
      return;
    }
    if (product.variants.length === 0) {
      alert("Please add at least one variant with batch details");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("variants", JSON.stringify(product.variants));

    images.forEach((image, index) => {
      formData.append("images", image);
      formData.append("isMain", index === mainImageIndex);
    });

    try {
      await axios.post("http://localhost:5000/api/product/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
      setImages([]);
      setMainImageIndex(-1);
      setVariant({
        size: "",
        batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
      });

      const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return null;

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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Add New Product
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={product.description}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        label="Category"
                        required
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Brand</InputLabel>
                      <Select
                        value={product.brand}
                        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                        label="Brand"
                        required
                      >
                        <MenuItem value="">Select Brand</MenuItem>
                        {brands.map((br) => (
                          <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Product Images
                    </Typography>
                    <TextField
                      fullWidth
                      type="file"
                      inputProps={{ multiple: true }}
                      onChange={handleImageChange}
                      InputLabelProps={{ shrink: true }}
                      label="Upload Images"
                    />
                    {images.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {images.map((image, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Typography>{image.name}</Typography>
                            <Button
                              onClick={() => handleMainImageSelect(index)}
                              color={index === mainImageIndex ? "primary" : "inherit"}
                              sx={{ ml: 2 }}
                            >
                              {index === mainImageIndex ? "Main" : "Set as Main"}
                            </Button>
                            <IconButton onClick={() => handleImageRemove(index)} color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Add Variants
                    </Typography>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Size"
                          value={variant.size}
                          onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Batch Number"
                          value={variant.batches[0].batchNumber}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          label="Cost Price"
                          type="number"
                          value={variant.batches[0].costPrice}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], costPrice: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          label="Selling Price"
                          type="number"
                          value={variant.batches[0].sellingPrice}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={1}>
                        <TextField
                          fullWidth
                          label="Discount (%)"
                          type="number"
                          value={variant.batches[0].discount}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], discount: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={1}>
                        <TextField
                          fullWidth
                          label="Stock"
                          type="number"
                          value={variant.batches[0].stock}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], stock: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={1}>
                        <TextField
                          fullWidth
                          label="GST (%)"
                          type="number"
                          value={variant.batches[0].gst}
                          onChange={(e) =>
                            setVariant({
                              ...variant,
                              batches: [{ ...variant.batches[0], gst: e.target.value }],
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={handleVariantAdd}
                          fullWidth
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  {product.variants.length > 0 && (
                    <Grid item xs={12}>
                      <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Size</TableCell>
                              <TableCell>Batch Number</TableCell>
                              <TableCell align="right">Cost Price</TableCell>
                              <TableCell align="right">Selling Price</TableCell>
                              <TableCell align="right">Discount (%)</TableCell>
                              <TableCell align="right">Stock</TableCell>
                              <TableCell align="right">GST (%)</TableCell>
                              <TableCell align="right">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.variants.map((v, index) => (
                              <TableRow key={index}>
                                <TableCell>{v.size}</TableCell>
                                <TableCell>{v.batches[0].batchNumber}</TableCell>
                                <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
                                <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
                                <TableCell align="right">{v.batches[0].discount}</TableCell>
                                <TableCell align="right">{v.batches[0].stock}</TableCell>
                                <TableCell align="right">{v.batches[0].gst}</TableCell>
                                <TableCell align="right">
                                  <IconButton onClick={() => handleVariantEdit(index)} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Product
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AddProduct;