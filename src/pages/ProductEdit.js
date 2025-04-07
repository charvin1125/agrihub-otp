// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Divider,
//   CircularProgress,
//   Grid,
//   IconButton,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MenuIcon from "@mui/icons-material/Menu";

// const EditProduct = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [newImages, setNewImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/product/${id}`, { withCredentials: true });
//         const fetchedProduct = res.data;
//         setProduct({
//           ...fetchedProduct,
//           category: fetchedProduct.category._id || fetchedProduct.category,
//           brand: fetchedProduct.brand._id || fetchedProduct.brand,
//         });
//         setImages(fetchedProduct.images || []);
//         const mainIdx = fetchedProduct.images.findIndex((img) => img.isMain);
//         setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     const fetchOptions = async () => {
//       try {
//         const [categoryRes, brandRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//           axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//         ]);
//         setCategories(categoryRes.data || []);
//         setBrands(brandRes.data || []);
//       } catch (error) {
//         console.error("Error fetching options:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//     fetchOptions();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [id]);

//   const handleInputChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const handleVariantChange = (variantIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleBatchChange = (variantIndex, batchIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches[batchIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleAddVariant = () => {
//     setProduct({
//       ...product,
//       variants: [...product.variants, { size: "", batches: [] }],
//     });
//   };

//   const handleAddBatch = (variantIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches.push({
//       batchNumber: "",
//       costPrice: 0,
//       sellingPrice: 0,
//       discount: 0,
//       stock: 0,
//       gst: 0,
//       addedDate: new Date().toISOString(),
//     });
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleDeleteVariant = (variantIndex) => {
//     setProduct({
//       ...product,
//       variants: product.variants.filter((_, i) => i !== variantIndex),
//     });
//   };

//   const handleDeleteBatch = (variantIndex, batchIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches = updatedVariants[variantIndex].batches.filter(
//       (_, i) => i !== batchIndex
//     );
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     if (index < images.length) {
//       setImages((prev) => prev.filter((_, i) => i !== index));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     } else {
//       const newIndex = index - images.length;
//       setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (images.length + newImages.length === 0) {
//       alert("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       alert("Please select a main image");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", product.name);
//       formData.append("description", product.description);
//       formData.append("category", product.category);
//       formData.append("brand", product.brand);
//       formData.append("variants", JSON.stringify(product.variants));

//       images.forEach((image, index) => {
//         formData.append("images", image.url);
//         formData.append("isMain", index === mainImageIndex);
//       });

//       newImages.forEach((image, index) => {
//         formData.append("images", image);
//         formData.append("isMain", index + images.length === mainImageIndex);
//       });

//       await axios.put(`http://localhost:5000/api/product/update/${id}`, formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Product updated successfully!");
//       navigate("/manage-products");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       alert("Failed to update product");
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
//         alert("Product deleted successfully!");
//         navigate("/manage-products");
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         alert("Failed to delete product");
//       }
//     }
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
//               "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#757575" },
//               "&:hover fieldset": { borderColor: darkMode ? "#e0e0e0" : "#212121" },
//               "&.Mui-focused fieldset": { borderColor: darkMode ? "#66BB6A" : "#388E3C" },
//             },
//           },
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
//     },
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!product) return <Typography>Loading...</Typography>;

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
//             <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
//               Edit Product
//             </Typography>
//           </Box>

//           <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
//             <CardContent>
//               <form onSubmit={handleUpdate}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Product Name"
//                       name="name"
//                       value={product.name}
//                       onChange={handleInputChange}
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Description"
//                       name="description"
//                       value={product.description}
//                       onChange={handleInputChange}
//                       variant="outlined"
//                       multiline
//                       rows={isMobile ? 3 : 4}
//                       size={isMobile ? "small" : "medium"}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>Category</InputLabel>
//                       <Select
//                         name="category"
//                         value={product.category}
//                         onChange={handleInputChange}
//                         label="Category"
//                         size={isMobile ? "small" : "medium"}
//                         required
//                       >
//                         <MenuItem value="">Select Category</MenuItem>
//                         {categories.map((cat) => (
//                           <MenuItem key={cat._id} value={cat._id}>
//                             {cat.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>Brand</InputLabel>
//                       <Select
//                         name="brand"
//                         value={product.brand}
//                         onChange={handleInputChange}
//                         label="Brand"
//                         size={isMobile ? "small" : "medium"}
//                         required
//                       >
//                         <MenuItem value="">Select Brand</MenuItem>
//                         {brands.map((br) => (
//                           <MenuItem key={br._id} value={br._id}>
//                             {br.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Image Section */}
//                   <Grid item xs={12}>
//                     <Divider sx={{ my: { xs: 2, sm: 3 } }} />
//                     <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
//                       Product Images
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="file"
//                       inputProps={{ multiple: true }}
//                       onChange={handleImageChange}
//                       InputLabelProps={{ shrink: true }}
//                       label="Upload New Images"
//                       variant="outlined"
//                       size={isMobile ? "small" : "medium"}
//                     />
//                     {(images.length > 0 || newImages.length > 0) && (
//                       <Box sx={{ mt: 2 }}>
//                         {[...images, ...newImages].map((image, index) => (
//                           <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                             <Typography>{typeof image === "string" ? image : image.url || image.name}</Typography>
//                             <Button
//                               onClick={() => handleMainImageSelect(index)}
//                               color={index === mainImageIndex ? "primary" : "inherit"}
//                               sx={{ ml: 2 }}
//                             >
//                               {index === mainImageIndex ? "Main" : "Set as Main"}
//                             </Button>
//                             <IconButton onClick={() => handleImageRemove(index)} color="secondary">
//                               <DeleteIcon />
//                             </IconButton>
//                           </Box>
//                         ))}
//                       </Box>
//                     )}
//                   </Grid>

//                   {/* Updated Variants Section */}
//                   <Grid item xs={12}>
//                     <Divider sx={{ my: { xs: 2, sm: 3 } }} />
//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                       <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                         Product Variants
//                       </Typography>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         startIcon={<AddIcon />}
//                         onClick={handleAddVariant}
//                         sx={{ borderRadius: "8px", textTransform: "none" }}
//                       >
//                         Add Variant
//                       </Button>
//                     </Box>

//                     {product.variants.length === 0 ? (
//                       <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
//                         No variants available. Add a variant to start.
//                       </Typography>
//                     ) : (
//                       product.variants.map((variant, variantIndex) => (
//                         <Card
//                           key={variantIndex}
//                           sx={{
//                             mb: 3,
//                             p: 2,
//                             bgcolor: darkMode ? "#1e1e1e" : "#fff",
//                             border: `1px solid ${darkMode ? "#b0b0b0" : "#e0e0e0"}`,
//                             borderRadius: "12px",
//                             boxShadow: "none",
//                           }}
//                         >
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                             <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
//                               Variant {variantIndex + 1}
//                             </Typography>
//                             <IconButton
//                               onClick={() => handleDeleteVariant(variantIndex)}
//                               color="secondary"
//                               sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//                             >
//                               <DeleteIcon sx={{ color: darkMode ? "#121212" : "#fff" }} />
//                             </IconButton>
//                           </Box>

//                           <Grid container spacing={2}>
//                             <Grid item xs={12} sm={4}>
//                               <TextField
//                                 fullWidth
//                                 label="Size"
//                                 value={variant.size}
//                                 onChange={(e) => handleVariantChange(variantIndex, "size", e.target.value)}
//                                 variant="outlined"
//                                 size={isMobile ? "small" : "medium"}
//                                 required
//                               />
//                             </Grid>
//                           </Grid>

//                           {/* Batches Section */}
//                           <Divider sx={{ my: 2 }} />
//                           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                             <Typography variant="body1" sx={{ fontWeight: "medium", color: "text.primary" }}>
//                               Batches
//                             </Typography>
//                             <Button
//                               variant="outlined"
//                               color="primary"
//                               startIcon={<AddIcon />}
//                               onClick={() => handleAddBatch(variantIndex)}
//                               sx={{ borderRadius: "8px", textTransform: "none" }}
//                             >
//                               Add Batch
//                             </Button>
//                           </Box>

//                           {variant.batches.length === 0 ? (
//                             <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 1 }}>
//                               No batches added yet.
//                             </Typography>
//                           ) : (
//                             variant.batches.map((batch, batchIndex) => (
//                               <Box
//                                 key={batch._id || batchIndex}
//                                 sx={{
//                                   mb: 2,
//                                   p: 2,
//                                   bgcolor: darkMode ? "#2c2c2c" : "#f9f9f9",
//                                   borderRadius: "8px",
//                                   border: `1px dashed ${darkMode ? "#b0b0b0" : "#e0e0e0"}`,
//                                 }}
//                               >
//                                 <Grid container spacing={1} alignItems="center">
//                                   <Grid item xs={12} sm={2}>
//                                     <TextField
//                                       fullWidth
//                                       label="Batch Number"
//                                       value={batch.batchNumber}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "batchNumber", e.target.value)}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={2}>
//                                     <TextField
//                                       fullWidth
//                                       label="Cost Price"
//                                       type="number"
//                                       value={batch.costPrice}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "costPrice", Number(e.target.value))}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={2}>
//                                     <TextField
//                                       fullWidth
//                                       label="Selling Price"
//                                       type="number"
//                                       value={batch.sellingPrice}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "sellingPrice", Number(e.target.value))}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={1}>
//                                     <TextField
//                                       fullWidth
//                                       label="Discount (%)"
//                                       type="number"
//                                       value={batch.discount}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "discount", Number(e.target.value))}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={2}>
//                                     <TextField
//                                       fullWidth
//                                       label="Stock"
//                                       type="number"
//                                       value={batch.stock}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "stock", Number(e.target.value))}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={1}>
//                                     <TextField
//                                       fullWidth
//                                       label="GST (%)"
//                                       type="number"
//                                       value={batch.gst}
//                                       onChange={(e) => handleBatchChange(variantIndex, batchIndex, "gst", Number(e.target.value))}
//                                       variant="outlined"
//                                       size={isMobile ? "small" : "medium"}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={6} sm={2}>
//                                     <IconButton
//                                       onClick={() => handleDeleteBatch(variantIndex, batchIndex)}
//                                       color="secondary"
//                                       sx={{ bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//                                     >
//                                       <DeleteIcon sx={{ color: darkMode ? "#121212" : "#fff" }} />
//                                     </IconButton>
//                                   </Grid>
//                                 </Grid>
//                               </Box>
//                             ))
//                           )}
//                         </Card>
//                       ))
//                     )}
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth
//                       sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: "1rem", sm: "1.1rem" }, bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
//                     >
//                       Update Product
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       variant="contained"
//                       color="secondary"
//                       onClick={handleDelete}
//                       fullWidth
//                       sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: "1rem", sm: "1.1rem" }, bgcolor: darkMode ? "#A5D6A7" : "#4CAF50", "&:hover": { bgcolor: darkMode ? "#81C784" : "#388E3C" } }}
//                     >
//                       Delete Product
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EditProduct;
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Divider,
//   CircularProgress,
//   Grid,
//   IconButton,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditProduct = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [newImages, setNewImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Add error state
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const sidebarWidth = 260;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch product and options concurrently
//         const [productRes, optionsRes] = await Promise.all([
//           axios.get(`http://localhost:5000/api/product/${id}`, { withCredentials: true }),
//           Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//           ]),
//         ]);

//         // Handle product data
//         const fetchedProduct = productRes.data;
//         console.log("Fetched product:", fetchedProduct); // Debug log
//         setProduct({
//           ...fetchedProduct,
//           category: fetchedProduct.category?._id || fetchedProduct.category,
//           brand: fetchedProduct.brand?._id || fetchedProduct.brand,
//         });
//         setImages(fetchedProduct.images || []);
//         const mainIdx = fetchedProduct.images.findIndex((img) => img.isMain);
//         setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);

//         // Handle categories and brands
//         const [categoryRes, brandRes] = optionsRes;
//         setCategories(categoryRes.data || []);
//         setBrands(brandRes.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to load product data. Please try again.");
//         toast.error("Failed to load product data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [id]);

//   const handleInputChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const handleVariantChange = (variantIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleBatchChange = (variantIndex, batchIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches[batchIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleAddVariant = () => {
//     setProduct({
//       ...product,
//       variants: [...product.variants, { size: "", batches: [] }],
//     });
//   };

//   const handleAddBatch = (variantIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches.push({
//       batchNumber: "",
//       costPrice: 0,
//       sellingPrice: 0,
//       discount: 0,
//       stock: 0,
//       gst: 0,
//       addedDate: new Date().toISOString(),
//     });
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleDeleteVariant = (variantIndex) => {
//     setProduct({
//       ...product,
//       variants: product.variants.filter((_, i) => i !== variantIndex),
//     });
//   };

//   const handleDeleteBatch = (variantIndex, batchIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches = updatedVariants[variantIndex].batches.filter(
//       (_, i) => i !== batchIndex
//     );
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     if (index < images.length) {
//       setImages((prev) => prev.filter((_, i) => i !== index));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     } else {
//       const newIndex = index - images.length;
//       setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (images.length + newImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       toast.error("Please select a main image");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", product.name);
//       formData.append("description", product.description);
//       formData.append("category", product.category);
//       formData.append("brand", product.brand);
//       formData.append("variants", JSON.stringify(product.variants));

//       images.forEach((image, index) => {
//         formData.append("images", image.url);
//         formData.append("isMain", index === mainImageIndex);
//       });

//       newImages.forEach((image, index) => {
//         formData.append("images", image);
//         formData.append("isMain", index + images.length === mainImageIndex);
//       });

//       const response = await axios.put(`http://localhost:5000/api/product/update/${id}`, formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Update response:", response.data); // Debug log
//       toast.success("Product updated successfully!");
//       navigate("/manage-products");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       toast.error("Failed to update product");
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteDialogOpen(false);
//     try {
//       await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
//       toast.success("Product deleted successfully!");
//       navigate("/manage-products");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       toast.error("Failed to delete product");
//     }
//   };

//   const openDeleteDialog = () => {
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
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
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "12px",
//             boxShadow: "none",
//             border: "1px solid #E0E0E0",
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

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (!product) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <Typography>Product not found</Typography>
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
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                   Edit Product
//                 </Typography>
//               </Box>

//               <Card sx={{ bgcolor: "background.paper", mb: 4 }}>
//                 <CardContent>
//                   <form onSubmit={handleUpdate}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Product Name"
//                           name="name"
//                           value={product.name || ""}
//                           onChange={handleInputChange}
//                           variant="outlined"
//                           size={isMobile ? "small" : "medium"}
//                           required
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Description"
//                           name="description"
//                           value={product.description || ""}
//                           onChange={handleInputChange}
//                           variant="outlined"
//                           multiline
//                           rows={isMobile ? 3 : 4}
//                           size={isMobile ? "small" : "medium"}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                           <InputLabel>Category</InputLabel>
//                           <Select
//                             name="category"
//                             value={product.category || ""}
//                             onChange={handleInputChange}
//                             label="Category"
//                             size={isMobile ? "small" : "medium"}
//                             required
//                           >
//                             <MenuItem value="">Select Category</MenuItem>
//                             {categories.map((cat) => (
//                               <MenuItem key={cat._id} value={cat._id}>
//                                 {cat.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                           <InputLabel>Brand</InputLabel>
//                           <Select
//                             name="brand"
//                             value={product.brand || ""}
//                             onChange={handleInputChange}
//                             label="Brand"
//                             size={isMobile ? "small" : "medium"}
//                             required
//                           >
//                             <MenuItem value="">Select Brand</MenuItem>
//                             {brands.map((br) => (
//                               <MenuItem key={br._id} value={br._id}>
//                                 {br.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </Grid>

//                       {/* Image Section */}
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                         <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
//                           Product Images
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="file"
//                           inputProps={{ multiple: true }}
//                           onChange={handleImageChange}
//                           InputLabelProps={{ shrink: true }}
//                           label="Upload New Images"
//                           variant="outlined"
//                           size={isMobile ? "small" : "medium"}
//                         />
//                         {(images.length > 0 || newImages.length > 0) && (
//                           <Box sx={{ mt: 2 }}>
//                             {[...images, ...newImages].map((image, index) => (
//                               <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                                 <Typography>{typeof image === "string" ? image : image.url || image.name}</Typography>
//                                 <Button
//                                   onClick={() => handleMainImageSelect(index)}
//                                   color={index === mainImageIndex ? "primary" : "inherit"}
//                                   sx={{ ml: 2 }}
//                                 >
//                                   {index === mainImageIndex ? "Main" : "Set as Main"}
//                                 </Button>
//                                 <IconButton onClick={() => handleImageRemove(index)} color="inherit">
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Box>
//                             ))}
//                           </Box>
//                         )}
//                       </Grid>

//                       {/* Variants Section */}
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                           <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                             Product Variants
//                           </Typography>
//                           <Button
//                             variant="outlined"
//                             color="primary"
//                             startIcon={<AddIcon />}
//                             onClick={handleAddVariant}
//                             sx={{ borderRadius: "20px", textTransform: "none" }}
//                           >
//                             Add Variant
//                           </Button>
//                         </Box>

//                         {product.variants.length === 0 ? (
//                           <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
//                             No variants available. Add a variant to start.
//                           </Typography>
//                         ) : (
//                           product.variants.map((variant, variantIndex) => (
//                             <Card
//                               key={variantIndex}
//                               sx={{ mb: 3, p: 2, bgcolor: "background.paper", border: "1px solid #E0E0E0", borderRadius: "12px" }}
//                             >
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
//                                   Variant {variantIndex + 1}
//                                 </Typography>
//                                 <IconButton onClick={() => handleDeleteVariant(variantIndex)} color="inherit">
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Box>

//                               <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                   <TextField
//                                     fullWidth
//                                     label="Size"
//                                     value={variant.size || ""}
//                                     onChange={(e) => handleVariantChange(variantIndex, "size", e.target.value)}
//                                     variant="outlined"
//                                     size={isMobile ? "small" : "medium"}
//                                     required
//                                   />
//                                 </Grid>
//                               </Grid>

//                               {/* Batches Section */}
//                               <Divider sx={{ my: 2 }} />
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                 <Typography variant="body1" sx={{ fontWeight: "medium", color: "text.primary" }}>
//                                   Batches
//                                 </Typography>
//                                 <Button
//                                   variant="outlined"
//                                   color="primary"
//                                   startIcon={<AddIcon />}
//                                   onClick={() => handleAddBatch(variantIndex)}
//                                   sx={{ borderRadius: "20px", textTransform: "none" }}
//                                 >
//                                   Add Batch
//                                 </Button>
//                               </Box>

//                               {variant.batches.length === 0 ? (
//                                 <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 1 }}>
//                                   No batches added yet.
//                                 </Typography>
//                               ) : (
//                                 variant.batches.map((batch, batchIndex) => (
//                                   <Box
//                                     key={batch._id || batchIndex}
//                                     sx={{ mb: 2, p: 2, bgcolor: "#F5F7FA", borderRadius: "8px", border: "1px dashed #E0E0E0" }}
//                                   >
//                                     <Grid container spacing={1} alignItems="center">
//                                       <Grid item xs={12} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Batch Number"
//                                           value={batch.batchNumber || ""}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "batchNumber", e.target.value)}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Cost Price"
//                                           type="number"
//                                           value={batch.costPrice || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "costPrice", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Selling Price"
//                                           type="number"
//                                           value={batch.sellingPrice || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "sellingPrice", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={1}>
//                                         <TextField
//                                           fullWidth
//                                           label="Discount (%)"
//                                           type="number"
//                                           value={batch.discount || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "discount", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Stock"
//                                           type="number"
//                                           value={batch.stock || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "stock", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={1}>
//                                         <TextField
//                                           fullWidth
//                                           label=" GST (%)"
//                                           type="number"
//                                           value={batch.gst || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "gst", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <IconButton
//                                           onClick={() => handleDeleteBatch(variantIndex, batchIndex)}
//                                           color="inherit"
//                                         >
//                                           <DeleteIcon />
//                                         </IconButton>
//                                       </Grid>
//                                     </Grid>
//                                   </Box>
//                                 ))
//                               )}
//                             </Card>
//                           ))
//                         )}
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           color="primary"
//                           fullWidth
//                           sx={{ py: 1.5, fontSize: "1.1rem" }}
//                         >
//                           Update Product
//                         </Button>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Button
//                           variant="contained"
//                           color="secondary"
//                           onClick={openDeleteDialog}
//                           fullWidth
//                           sx={{ py: 1.5, fontSize: "1.1rem" }}
//                         >
//                           Delete Product
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </form>
//                 </CardContent>
//               </Card>

//               {/* Delete Confirmation Dialog */}
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={closeDeleteDialog}
//                 PaperProps={{ sx: { borderRadius: "10px" } }}
//                 sx={{ backdropFilter: "blur(5px)" }}
//               >
//                 <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                   <Typography>Are you sure you want to delete this product?</Typography>
//                 </DialogContent>
//                 <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                   <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={handleDelete} variant="contained" color="secondary">
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               {/* Toast Container */}
//               <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//               />
//             </Container>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EditProduct;
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Divider,
//   CircularProgress,
//   Grid,
//   IconButton,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditProduct = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [newImages, setNewImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [errors, setErrors] = useState({});
//   const sidebarWidth = 260;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [productRes, optionsRes] = await Promise.all([
//           axios.get(`http://localhost:5000/api/product/${id}`, { withCredentials: true }),
//           Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//           ]),
//         ]);

//         const fetchedProduct = productRes.data;
//         console.log("Fetched product:", fetchedProduct);
//         setProduct({
//           ...fetchedProduct,
//           category: fetchedProduct.category?._id || fetchedProduct.category,
//           brand: fetchedProduct.brand?._id || fetchedProduct.brand,
//         });
//         setImages(fetchedProduct.images || []);
//         const mainIdx = fetchedProduct.images.findIndex((img) => img.isMain);
//         setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);

//         const [categoryRes, brandRes] = optionsRes;
//         setCategories(categoryRes.data || []);
//         setBrands(brandRes.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to load product data. Please try again.");
//         toast.error("Failed to load product data", { position: "top-center" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const handleResize = () => {
//       const mobile = window.innerWidth < 600;
//       setIsMobile(mobile);
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [id]);

//   const handleInputChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleVariantChange = (variantIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//     setErrors({ ...errors, [`variant${variantIndex}`]: "" });
//   };

//   const handleBatchChange = (variantIndex, batchIndex, key, value) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches[batchIndex][key] = value;
//     setProduct({ ...product, variants: updatedVariants });
//     setErrors({ ...errors, [`batch${variantIndex}_${batchIndex}`]: "" });
//   };

//   const handleAddVariant = () => {
//     setProduct({
//       ...product,
//       variants: [...product.variants, { size: "", batches: [] }],
//     });
//   };

//   const handleAddBatch = (variantIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches.push({
//       batchNumber: "",
//       costPrice: 0,
//       sellingPrice: 0,
//       discount: 0,
//       stock: 0,
//       gst: 0,
//       addedDate: new Date().toISOString(),
//     });
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleDeleteVariant = (variantIndex) => {
//     setProduct({
//       ...product,
//       variants: product.variants.filter((_, i) => i !== variantIndex),
//     });
//   };

//   const handleDeleteBatch = (variantIndex, batchIndex) => {
//     const updatedVariants = [...product.variants];
//     updatedVariants[variantIndex].batches = updatedVariants[variantIndex].batches.filter(
//       (_, i) => i !== batchIndex
//     );
//     setProduct({ ...product, variants: updatedVariants });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewImages((prev) => [...prev, ...files]);
//     setErrors({ ...errors, images: "" });
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//     setErrors({ ...errors, mainImage: "" });
//   };

//   const handleImageRemove = (index) => {
//     if (index < images.length) {
//       setImages((prev) => prev.filter((_, i) => i !== index));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     } else {
//       const newIndex = index - images.length;
//       setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
//       if (index === mainImageIndex) setMainImageIndex(-1);
//     }
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!product.name.trim()) tempErrors.name = "Product name is required";
//     if (!product.category) tempErrors.category = "Category is required";
//     if (!product.brand) tempErrors.brand = "Brand is required";
//     if (images.length + newImages.length === 0) tempErrors.images = "At least one image is required";
//     if (mainImageIndex === -1 && (images.length + newImages.length > 0)) tempErrors.mainImage = "Please select a main image";
//     if (product.variants.length === 0) tempErrors.variants = "At least one variant is required";

//     product.variants.forEach((variant, variantIndex) => {
//       if (!variant.size.trim()) tempErrors[`variant${variantIndex}`] = `Size is required for Variant ${variantIndex + 1}`;
//       variant.batches.forEach((batch, batchIndex) => {
//         if (!batch.batchNumber.trim()) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Batch number is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
//         if (!batch.costPrice || batch.costPrice <= 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid cost price is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
//         if (!batch.sellingPrice || batch.sellingPrice <= 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid selling price is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
//         if (batch.stock < 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Stock cannot be negative for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
//         if (!batch.gst || batch.gst < 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid GST percentage is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
//       });
//     });

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const formData = new FormData();
//       formData.append("name", product.name);
//       formData.append("description", product.description);
//       formData.append("category", product.category);
//       formData.append("brand", product.brand);
//       formData.append("variants", JSON.stringify(product.variants));

//       images.forEach((image, index) => {
//         formData.append("images", image.url);
//         formData.append("isMain", index === mainImageIndex);
//       });

//       newImages.forEach((image, index) => {
//         formData.append("images", image);
//         formData.append("isMain", index + images.length === mainImageIndex);
//       });

//       const response = await axios.put(`http://localhost:5000/api/product/update/${id}`, formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Update response:", response.data);
//       toast.success("Product updated successfully!", { position: "top-center" });
//       navigate("/manage-products");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       toast.error("Failed to update product", { position: "top-center" });
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteDialogOpen(false);
//     try {
//       await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
//       toast.success("Product deleted successfully!", { position: "top-center" });
//       navigate("/manage-products");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       toast.error("Failed to delete product", { position: "top-center" });
//     }
//   };

//   const openDeleteDialog = () => {
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
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
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "10px",
//             boxShadow: "none",
//             border: "1px solid #E0E0E0",
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
//       MuiSelect: {
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
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "8px",
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

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (!product) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <Typography>Product not found</Typography>
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
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                   Edit Product
//                 </Typography>
//               </Box>

//               <Card sx={{ bgcolor: "background.paper", mb: 4 }}>
//                 <CardContent>
//                   <form onSubmit={handleUpdate}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Product Name"
//                           name="name"
//                           value={product.name || ""}
//                           onChange={handleInputChange}
//                           variant="outlined"
//                           size={isMobile ? "small" : "medium"}
//                           required
//                           error={!!errors.name}
//                           helperText={errors.name}
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Description"
//                           name="description"
//                           value={product.description || ""}
//                           onChange={handleInputChange}
//                           variant="outlined"
//                           multiline
//                           rows={isMobile ? 3 : 4}
//                           size={isMobile ? "small" : "medium"}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                           <InputLabel>Category</InputLabel>
//                           <Select
//                             name="category"
//                             value={product.category || ""}
//                             onChange={handleInputChange}
//                             label="Category"
//                             size={isMobile ? "small" : "medium"}
//                             required
//                             error={!!errors.category}
//                           >
//                             <MenuItem value="">Select Category</MenuItem>
//                             {categories.map((cat) => (
//                               <MenuItem key={cat._id} value={cat._id}>
//                                 {cat.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                           {errors.category && <Typography color="error">{errors.category}</Typography>}
//                         </FormControl>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                           <InputLabel>Brand</InputLabel>
//                           <Select
//                             name="brand"
//                             value={product.brand || ""}
//                             onChange={handleInputChange}
//                             label="Brand"
//                             size={isMobile ? "small" : "medium"}
//                             required
//                             error={!!errors.brand}
//                           >
//                             <MenuItem value="">Select Brand</MenuItem>
//                             {brands.map((br) => (
//                               <MenuItem key={br._id} value={br._id}>
//                                 {br.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                           {errors.brand && <Typography color="error">{errors.brand}</Typography>}
//                         </FormControl>
//                       </Grid>

//                       {/* Image Section */}
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                         <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
//                           Product Images
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="file"
//                           inputProps={{ multiple: true }}
//                           onChange={handleImageChange}
//                           InputLabelProps={{ shrink: true }}
//                           label="Upload New Images"
//                           variant="outlined"
//                           size={isMobile ? "small" : "medium"}
//                         />
//                         {errors.images && (
//                           <Typography color="error" sx={{ mt: 1 }}>
//                             {errors.images}
//                           </Typography>
//                         )}
//                         {(images.length > 0 || newImages.length > 0) && (
//                           <Box sx={{ mt: 2 }}>
//                             {[...images, ...newImages].map((image, index) => (
//                               <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                                 <Typography>{typeof image === "string" ? image : image.url || image.name}</Typography>
//                                 <Button
//                                   onClick={() => handleMainImageSelect(index)}
//                                   color={index === mainImageIndex ? "primary" : "inherit"}
//                                   sx={{ ml: 2 }}
//                                 >
//                                   {index === mainImageIndex ? "Main" : "Set as Main"}
//                                 </Button>
//                                 <IconButton onClick={() => handleImageRemove(index)} color="inherit">
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Box>
//                             ))}
//                             {errors.mainImage && (
//                               <Typography color="error" sx={{ mt: 1 }}>
//                                 {errors.mainImage}
//                               </Typography>
//                             )}
//                           </Box>
//                         )}
//                       </Grid>

//                       {/* Variants Section */}
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                           <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
//                             Product Variants
//                           </Typography>
//                           <Button
//                             variant="outlined"
//                             color="primary"
//                             startIcon={<AddIcon />}
//                             onClick={handleAddVariant}
//                             sx={{ borderRadius: "8px", textTransform: "none" }}
//                           >
//                             Add Variant
//                           </Button>
//                         </Box>
//                         {errors.variants && (
//                           <Typography color="error" sx={{ mb: 2 }}>
//                             {errors.variants}
//                           </Typography>
//                         )}

//                         {product.variants.length === 0 ? (
//                           <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
//                             No variants available. Add a variant to start.
//                           </Typography>
//                         ) : (
//                           product.variants.map((variant, variantIndex) => (
//                             <Card
//                               key={variantIndex}
//                               sx={{ mb: 3, p: 2, bgcolor: "background.paper", border: "1px solid #E0E0E0", borderRadius: "10px" }}
//                             >
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
//                                   Variant {variantIndex + 1}
//                                 </Typography>
//                                 <IconButton onClick={() => handleDeleteVariant(variantIndex)} color="inherit">
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Box>

//                               <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                   <TextField
//                                     fullWidth
//                                     label="Size"
//                                     value={variant.size || ""}
//                                     onChange={(e) => handleVariantChange(variantIndex, "size", e.target.value)}
//                                     variant="outlined"
//                                     size={isMobile ? "small" : "medium"}
//                                     required
//                                     error={!!errors[`variant${variantIndex}`]}
//                                     helperText={errors[`variant${variantIndex}`]}
//                                   />
//                                 </Grid>
//                               </Grid>

//                               {/* Batches Section */}
//                               <Divider sx={{ my: 2 }} />
//                               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                 <Typography variant="body1" sx={{ fontWeight: "medium", color: "text.primary" }}>
//                                   Batches
//                                 </Typography>
//                                 <Button
//                                   variant="outlined"
//                                   color="primary"
//                                   startIcon={<AddIcon />}
//                                   onClick={() => handleAddBatch(variantIndex)}
//                                   sx={{ borderRadius: "8px", textTransform: "none" }}
//                                 >
//                                   Add Batch
//                                 </Button>
//                               </Box>

//                               {variant.batches.length === 0 ? (
//                                 <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 1 }}>
//                                   No batches added yet.
//                                 </Typography>
//                               ) : (
//                                 variant.batches.map((batch, batchIndex) => (
//                                   <Box
//                                     key={batch._id || batchIndex}
//                                     sx={{ mb: 2, p: 2, bgcolor: "#F5F7FA", borderRadius: "8px", border: "1px dashed #E0E0E0" }}
//                                   >
//                                     <Grid container spacing={1} alignItems="center">
//                                       <Grid item xs={12} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Batch Number"
//                                           value={batch.batchNumber || ""}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "batchNumber", e.target.value)}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                           required
//                                           error={!!errors[`batch${variantIndex}_${batchIndex}`]}
//                                           helperText={errors[`batch${variantIndex}_${batchIndex}`]}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Cost Price"
//                                           type="number"
//                                           value={batch.costPrice || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "costPrice", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                           required
//                                           error={!!errors[`batch${variantIndex}_${batchIndex}`]}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Selling Price"
//                                           type="number"
//                                           value={batch.sellingPrice || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "sellingPrice", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                           required
//                                           error={!!errors[`batch${variantIndex}_${batchIndex}`]}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={1}>
//                                         <TextField
//                                           fullWidth
//                                           label="Discount (%)"
//                                           type="number"
//                                           value={batch.discount || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "discount", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <TextField
//                                           fullWidth
//                                           label="Stock"
//                                           type="number"
//                                           value={batch.stock || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "stock", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                           required
//                                           error={!!errors[`batch${variantIndex}_${batchIndex}`]}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={1}>
//                                         <TextField
//                                           fullWidth
//                                           label="GST (%)"
//                                           type="number"
//                                           value={batch.gst || 0}
//                                           onChange={(e) => handleBatchChange(variantIndex, batchIndex, "gst", Number(e.target.value))}
//                                           variant="outlined"
//                                           size={isMobile ? "small" : "medium"}
//                                           required
//                                           error={!!errors[`batch${variantIndex}_${batchIndex}`]}
//                                         />
//                                       </Grid>
//                                       <Grid item xs={6} sm={2}>
//                                         <IconButton
//                                           onClick={() => handleDeleteBatch(variantIndex, batchIndex)}
//                                           color="inherit"
//                                         >
//                                           <DeleteIcon />
//                                         </IconButton>
//                                       </Grid>
//                                     </Grid>
//                                   </Box>
//                                 ))
//                               )}
//                             </Card>
//                           ))
//                         )}
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           color="primary"
//                           fullWidth
//                           sx={{ py: 1.5, fontSize: "1.1rem" }}
//                         >
//                           Update Product
//                         </Button>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Button
//                           variant="contained"
//                           color="secondary"
//                           onClick={openDeleteDialog}
//                           fullWidth
//                           sx={{ py: 1.5, fontSize: "1.1rem" }}
//                         >
//                           Delete Product
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </form>
//                 </CardContent>
//               </Card>

//               {/* Delete Confirmation Dialog */}
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={closeDeleteDialog}
//                 PaperProps={{ sx: { borderRadius: "10px" } }}
//                 sx={{ backdropFilter: "blur(5px)" }}
//               >
//                 <DialogTitle sx={{ textAlign: "center" }}>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                   <Typography>Are you sure you want to delete this product?</Typography>
//                 </DialogContent>
//                 <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                   <Button onClick={closeDeleteDialog} variant="outlined" color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={handleDelete} variant="contained" color="secondary">
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               {/* Toast Container */}
//               <ToastContainer
//                 position="top-center"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme={darkMode ? "dark" : "light"}
//               />
//             </Container>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EditProduct;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
// import AdminNavbar from "../components/AdminNavbar";
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
  Grid,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(-1);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const sidebarWidth = 260;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, optionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/product/${id}`, { withCredentials: true }),
          Promise.all([
            axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
            axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
          ]),
        ]);

        const fetchedProduct = productRes.data;
        console.log("Fetched product:", fetchedProduct);
        setProduct({
          ...fetchedProduct,
          category: fetchedProduct.category?._id || fetchedProduct.category,
          brand: fetchedProduct.brand?._id || fetchedProduct.brand,
        });
        setImages(fetchedProduct.images || []);
        const mainIdx = fetchedProduct.images.findIndex((img) => img.isMain);
        setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);

        const [categoryRes, brandRes] = optionsRes;
        setCategories(categoryRes.data || []);
        setBrands(brandRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load product data. Please try again.");
        toast.error("Failed to load product data", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleVariantChange = (variantIndex, key, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex][key] = value;
    setProduct({ ...product, variants: updatedVariants });
    setErrors({ ...errors, [`variant${variantIndex}`]: "" });
  };

  const handleBatchChange = (variantIndex, batchIndex, key, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].batches[batchIndex][key] = value;
    setProduct({ ...product, variants: updatedVariants });
    setErrors({ ...errors, [`batch${variantIndex}_${batchIndex}`]: "" });
  };

  const handleAddVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { size: "", batches: [] }],
    });
  };

  const handleAddBatch = (variantIndex) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].batches.push({
      batchNumber: "",
      costPrice: 0,
      sellingPrice: 0,
      discount: 0,
      stock: 0,
      gst: 0,
      addedDate: new Date().toISOString(),
    });
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleDeleteVariant = (variantIndex) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== variantIndex),
    });
  };

  const handleDeleteBatch = (variantIndex, batchIndex) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].batches = updatedVariants[variantIndex].batches.filter(
      (_, i) => i !== batchIndex
    );
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setErrors({ ...errors, images: "" });
  };

  const handleMainImageSelect = (index) => {
    setMainImageIndex(index);
    setErrors({ ...errors, mainImage: "" });
  };

  const handleImageRemove = (index) => {
    if (index < images.length) {
      setImages((prev) => prev.filter((_, i) => i !== index));
      if (index === mainImageIndex) setMainImageIndex(-1);
    } else {
      const newIndex = index - images.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
      if (index === mainImageIndex) setMainImageIndex(-1);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!product.name.trim()) tempErrors.name = "Product name is required";
    if (!product.category) tempErrors.category = "Category is required";
    if (!product.brand) tempErrors.brand = "Brand is required";
    if (images.length + newImages.length === 0) tempErrors.images = "At least one image is required";
    if (mainImageIndex === -1 && (images.length + newImages.length > 0)) tempErrors.mainImage = "Please select a main image";
    if (product.variants.length === 0) tempErrors.variants = "At least one variant is required";

    product.variants.forEach((variant, variantIndex) => {
      if (!variant.size.trim()) tempErrors[`variant${variantIndex}`] = `Size is required for Variant ${variantIndex + 1}`;
      variant.batches.forEach((batch, batchIndex) => {
        if (!batch.batchNumber.trim()) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Batch number is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
        if (!batch.costPrice || batch.costPrice <= 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid cost price is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
        if (!batch.sellingPrice || batch.sellingPrice <= 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid selling price is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
        if (batch.stock < 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Stock cannot be negative for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
        if (!batch.gst || batch.gst < 0) tempErrors[`batch${variantIndex}_${batchIndex}`] = `Valid GST percentage is required for Batch ${batchIndex + 1} in Variant ${variantIndex + 1}`;
      });
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("brand", product.brand);
      formData.append("variants", JSON.stringify(product.variants));

      images.forEach((image, index) => {
        formData.append("images", image.url);
        formData.append("isMain", index === mainImageIndex);
      });

      newImages.forEach((image, index) => {
        formData.append("images", image);
        formData.append("isMain", index + images.length === mainImageIndex);
      });

      const response = await axios.put(`http://localhost:5000/api/product/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Update response:", response.data);
      toast.success("Product updated successfully!", { position: "top-center" });
      navigate("/manage-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", { position: "top-center" });
    }
  };

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${id}`, { withCredentials: true });
      toast.success("Product deleted successfully!", { position: "top-center" });
      navigate("/manage-products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", { position: "top-center" });
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
              "&:hover fieldset": { borderColor: "#388E3C" },
              "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#b0b0b0" : "#E0E0E0" },
              "&:hover fieldset": { borderColor: "#388E3C" },
              "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Product not found</Typography>
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
            width: { xs: "100%", sm: `calc(100% - ${sidebarOpen && !isMobile ? sidebarWidth : 0}px)` },
            transition: "width 0.3s ease",
          }}
        >
          {/* <AdminNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobile={isMobile}
            sidebarWidth={sidebarOpen && !isMobile ? sidebarWidth : 0}
          /> */}
          <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
              {/* Header with Breadcrumbs */}
              <Box sx={{ mb: 3 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}>
                  Edit Product
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: "#4CAF50" }}>
                  <Link
                    to="/admin-dashboard"
                    style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
                  >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Dashboard
                  </Link>
                  <Link
                    to="/manage-products"
                    style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
                  >
                    <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Manage Products
                  </Link>
                  <Typography color="#4CAF50" sx={{ display: "flex", alignItems: "center" }}>
                    <EditIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Edit Product
                  </Typography>
                </Breadcrumbs>
              </Box>

              <Card sx={{ bgcolor: "background.paper", mb: 4 }}>
                <CardContent>
                  <form onSubmit={handleUpdate}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Product Name"
                          name="name"
                          value={product.name || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                          required
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={product.description || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          multiline
                          rows={isMobile ? 3 : 4}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            name="category"
                            value={product.category || ""}
                            onChange={handleInputChange}
                            label="Category"
                            size={isMobile ? "small" : "medium"}
                            required
                            error={!!errors.category}
                          >
                            <MenuItem value="">Select Category</MenuItem>
                            {categories.map((cat) => (
                              <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.category && <Typography color="error">{errors.category}</Typography>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Brand</InputLabel>
                          <Select
                            name="brand"
                            value={product.brand || ""}
                            onChange={handleInputChange}
                            label="Brand"
                            size={isMobile ? "small" : "medium"}
                            required
                            error={!!errors.brand}
                          >
                            <MenuItem value="">Select Brand</MenuItem>
                            {brands.map((br) => (
                              <MenuItem key={br._id} value={br._id}>
                                {br.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.brand && <Typography color="error">{errors.brand}</Typography>}
                        </FormControl>
                      </Grid>

                      {/* Image Section */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                          Product Images
                        </Typography>
                        <TextField
                          fullWidth
                          type="file"
                          inputProps={{ multiple: true }}
                          onChange={handleImageChange}
                          InputLabelProps={{ shrink: true }}
                          label="Upload New Images"
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                        {errors.images && (
                          <Typography color="error" sx={{ mt: 1 }}>
                            {errors.images}
                          </Typography>
                        )}
                        {(images.length > 0 || newImages.length > 0) && (
                          <Box sx={{ mt: 2 }}>
                            {[...images, ...newImages].map((image, index) => (
                              <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <Typography>{typeof image === "string" ? image : image.url || image.name}</Typography>
                                <Button
                                  onClick={() => handleMainImageSelect(index)}
                                  color={index === mainImageIndex ? "primary" : "inherit"}
                                  sx={{ ml: 2 }}
                                >
                                  {index === mainImageIndex ? "Main" : "Set as Main"}
                                </Button>
                                <IconButton onClick={() => handleImageRemove(index)} color="inherit">
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ))}
                            {errors.mainImage && (
                              <Typography color="error" sx={{ mt: 1 }}>
                                {errors.mainImage}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Grid>

                      {/* Variants Section */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Product Variants
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddVariant}
                            sx={{ borderRadius: "8px", textTransform: "none" }}
                          >
                            Add Variant
                          </Button>
                        </Box>
                        {errors.variants && (
                          <Typography color="error" sx={{ mb: 2 }}>
                            {errors.variants}
                          </Typography>
                        )}

                        {product.variants.length === 0 ? (
                          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
                            No variants available. Add a variant to start.
                          </Typography>
                        ) : (
                          product.variants.map((variant, variantIndex) => (
                            <Card
                              key={variantIndex}
                              sx={{ mb: 3, p: 2, bgcolor: "background.paper", border: "1px solid #E0E0E0", borderRadius: "10px" }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                  Variant {variantIndex + 1}
                                </Typography>
                                <IconButton onClick={() => handleDeleteVariant(variantIndex)} color="inherit">
                                  <DeleteIcon />
                                </IconButton>
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Size"
                                    value={variant.size || ""}
                                    onChange={(e) => handleVariantChange(variantIndex, "size", e.target.value)}
                                    variant="outlined"
                                    size={isMobile ? "small" : "medium"}
                                    required
                                    error={!!errors[`variant${variantIndex}`]}
                                    helperText={errors[`variant${variantIndex}`]}
                                  />
                                </Grid>
                              </Grid>

                              {/* Batches Section */}
                              <Divider sx={{ my: 2 }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: "medium", color: "text.primary" }}>
                                  Batches
                                </Typography>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddBatch(variantIndex)}
                                  sx={{ borderRadius: "8px", textTransform: "none" }}
                                >
                                  Add Batch
                                </Button>
                              </Box>

                              {variant.batches.length === 0 ? (
                                <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 1 }}>
                                  No batches added yet.
                                </Typography>
                              ) : (
                                variant.batches.map((batch, batchIndex) => (
                                  <Box
                                    key={batch._id || batchIndex}
                                    sx={{ mb: 2, p: 2, bgcolor: "#F5F7FA", borderRadius: "8px", border: "1px dashed #E0E0E0" }}
                                  >
                                    <Grid container spacing={1} alignItems="center">
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Batch Number"
                                          value={batch.batchNumber || ""}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "batchNumber", e.target.value)}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                          required
                                          error={!!errors[`batch${variantIndex}_${batchIndex}`]}
                                          helperText={errors[`batch${variantIndex}_${batchIndex}`]}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Cost Price"
                                          type="number"
                                          value={batch.costPrice || 0}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "costPrice", Number(e.target.value))}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                          required
                                          error={!!errors[`batch${variantIndex}_${batchIndex}`]}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Selling Price"
                                          type="number"
                                          value={batch.sellingPrice || 0}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "sellingPrice", Number(e.target.value))}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                          required
                                          error={!!errors[`batch${variantIndex}_${batchIndex}`]}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={1}>
                                        <TextField
                                          fullWidth
                                          label="Discount (%)"
                                          type="number"
                                          value={batch.discount || 0}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "discount", Number(e.target.value))}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Stock"
                                          type="number"
                                          value={batch.stock || 0}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "stock", Number(e.target.value))}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                          required
                                          error={!!errors[`batch${variantIndex}_${batchIndex}`]}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={1}>
                                        <TextField
                                          fullWidth
                                          label="GST (%)"
                                          type="number"
                                          value={batch.gst || 0}
                                          onChange={(e) => handleBatchChange(variantIndex, batchIndex, "gst", Number(e.target.value))}
                                          variant="outlined"
                                          size={isMobile ? "small" : "medium"}
                                          required
                                          error={!!errors[`batch${variantIndex}_${batchIndex}`]}
                                        />
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <IconButton
                                          onClick={() => handleDeleteBatch(variantIndex, batchIndex)}
                                          color="inherit"
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                ))
                              )}
                            </Card>
                          ))
                        )}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ py: 1.5, fontSize: "1.1rem" }}
                        >
                          Update Product
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={openDeleteDialog}
                          fullWidth
                          sx={{ py: 1.5, fontSize: "1.1rem" }}
                        >
                          Delete Product
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                PaperProps={{ sx: { borderRadius: "10px" } }}
                sx={{ backdropFilter: "blur(5px)" }}
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
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EditProduct;