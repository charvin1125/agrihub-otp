// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Grid,
//   IconButton,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MenuIcon from "@mui/icons-material/Menu";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     category: "",
//     brand: "",
//     variants: [],
//     images: [],
//   });
//   const [variant, setVariant] = useState({
//     size: "",
//     batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//   });
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//     },
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         if (res.data && res.data.isAdmin) {
//           setUser(res.data);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/login");
//       }
//     };
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
//   }, [navigate]);

//   useEffect(() => {
//     if (user) {
//       const fetchData = async () => {
//         try {
//           const [categoryRes, brandRes, productRes] = await Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//           ]);
//           setCategories(categoryRes.data || []);
//           setBrands(brandRes.data || []);
//           setProducts(productRes.data || []);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [user]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     localStorage.setItem("theme", !darkMode ? "dark" : "light");
//   };

//   const handleVariantAdd = () => {
//     const batch = variant.batches[0];
//     if (
//       variant.size &&
//       batch.batchNumber &&
//       batch.costPrice &&
//       batch.sellingPrice &&
//       batch.stock >= 0 &&
//       batch.gst !== ""
//     ) {
//       setProduct((prev) => ({
//         ...prev,
//         variants: [...prev.variants, { ...variant }],
//       }));
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });
//     } else {
//       alert("Please fill all variant and batch details.");
//     }
//   };

//   const handleVariantDelete = (index) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index),
//     }));
//   };

//   const handleVariantEdit = (index) => {
//     const editVariant = product.variants[index];
//     setVariant(editVariant);
//     handleVariantDelete(index);
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     if (index === mainImageIndex) setMainImageIndex(-1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (images.length === 0) {
//       alert("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       alert("Please select a main image");
//       return;
//     }
//     if (product.variants.length === 0) {
//       alert("Please add at least one variant with batch details");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("description", product.description);
//     formData.append("category", product.category);
//     formData.append("brand", product.brand);
//     formData.append("variants", JSON.stringify(product.variants));

//     images.forEach((image, index) => {
//       formData.append("images", image);
//       formData.append("isMain", index === mainImageIndex);
//     });

//     try {
//       await axios.post("http://localhost:5000/api/product/add", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Product added successfully!");
//       setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
//       setImages([]);
//       setMainImageIndex(-1);
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });

//       const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("Failed to add product");
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!user) return null;

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
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//               Add New Product
//             </Typography>
//           </Box>

//           <Card>
//             <CardContent>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Product Name"
//                       value={product.name}
//                       onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Description"
//                       value={product.description}
//                       onChange={(e) => setProduct({ ...product, description: e.target.value })}
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>Category</InputLabel>
//                       <Select
//                         value={product.category}
//                         onChange={(e) => setProduct({ ...product, category: e.target.value })}
//                         label="Category"
//                         required
//                       >
//                         <MenuItem value="">Select Category</MenuItem>
//                         {categories.map((cat) => (
//                           <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>Brand</InputLabel>
//                       <Select
//                         value={product.brand}
//                         onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                         label="Brand"
//                         required
//                       >
//                         <MenuItem value="">Select Brand</MenuItem>
//                         {brands.map((br) => (
//                           <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Divider sx={{ my: 2 }} />
//                     <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                       Product Images
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       type="file"
//                       inputProps={{ multiple: true }}
//                       onChange={handleImageChange}
//                       InputLabelProps={{ shrink: true }}
//                       label="Upload Images"
//                     />
//                     {images.length > 0 && (
//                       <Box sx={{ mt: 2 }}>
//                         {images.map((image, index) => (
//                           <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                             <Typography>{image.name}</Typography>
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

//                   <Grid item xs={12}>
//                     <Divider sx={{ my: 2 }} />
//                     <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                       Add Variants
//                     </Typography>
//                     <Grid container spacing={1} alignItems="center">
//                       <Grid item xs={12} sm={2}>
//                         <TextField
//                           fullWidth
//                           label="Size"
//                           value={variant.size}
//                           onChange={(e) => setVariant({ ...variant, size: e.target.value })}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={2}>
//                         <TextField
//                           fullWidth
//                           label="Batch Number"
//                           value={variant.batches[0].batchNumber}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={2}>
//                         <TextField
//                           fullWidth
//                           label="Cost Price"
//                           type="number"
//                           value={variant.batches[0].costPrice}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], costPrice: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={2}>
//                         <TextField
//                           fullWidth
//                           label="Selling Price"
//                           type="number"
//                           value={variant.batches[0].sellingPrice}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={1}>
//                         <TextField
//                           fullWidth
//                           label="Discount (%)"
//                           type="number"
//                           value={variant.batches[0].discount}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], discount: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={1}>
//                         <TextField
//                           fullWidth
//                           label="Stock"
//                           type="number"
//                           value={variant.batches[0].stock}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], stock: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={1}>
//                         <TextField
//                           fullWidth
//                           label="GST (%)"
//                           type="number"
//                           value={variant.batches[0].gst}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], gst: e.target.value }],
//                             })
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={6} sm={1}>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           startIcon={<AddIcon />}
//                           onClick={handleVariantAdd}
//                           fullWidth
//                         >
//                           Add
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </Grid>

//                   {product.variants.length > 0 && (
//                     <Grid item xs={12}>
//                       <TableContainer component={Paper} sx={{ mt: 2 }}>
//                         <Table>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>Size</TableCell>
//                               <TableCell>Batch Number</TableCell>
//                               <TableCell align="right">Cost Price</TableCell>
//                               <TableCell align="right">Selling Price</TableCell>
//                               <TableCell align="right">Discount (%)</TableCell>
//                               <TableCell align="right">Stock</TableCell>
//                               <TableCell align="right">GST (%)</TableCell>
//                               <TableCell align="right">Action</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {product.variants.map((v, index) => (
//                               <TableRow key={index}>
//                                 <TableCell>{v.size}</TableCell>
//                                 <TableCell>{v.batches[0].batchNumber}</TableCell>
//                                 <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
//                                 <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
//                                 <TableCell align="right">{v.batches[0].discount}</TableCell>
//                                 <TableCell align="right">{v.batches[0].stock}</TableCell>
//                                 <TableCell align="right">{v.batches[0].gst}</TableCell>
//                                 <TableCell align="right">
//                                   <IconButton onClick={() => handleVariantEdit(index)} color="primary">
//                                     <EditIcon />
//                                   </IconButton>
//                                   <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
//                                     <DeleteIcon />
//                                   </IconButton>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Grid>
//                   )}

//                   <Grid item xs={12}>
//                     <Button type="submit" variant="contained" color="primary" fullWidth>
//                       Add Product
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

// export default AddProduct;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Grid,
//   IconButton,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MenuIcon from "@mui/icons-material/Menu";
// import ReactQuill from "react-quill"; // For rich text editor
// import "react-quill/dist/quill.snow.css"; // Import Quill styles

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     category: "",
//     brand: "",
//     variants: [],
//     images: [],
//   });
//   const [variant, setVariant] = useState({
//     size: "",
//     batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//   });
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//     },
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         if (res.data && res.data.isAdmin) {
//           setUser(res.data);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/login");
//       }
//     };
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
//   }, [navigate]);

//   useEffect(() => {
//     if (user) {
//       const fetchData = async () => {
//         try {
//           const [categoryRes, brandRes, productRes] = await Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//           ]);
//           setCategories(categoryRes.data || []);
//           setBrands(brandRes.data || []);
//           setProducts(productRes.data || []);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [user]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     localStorage.setItem("theme", !darkMode ? "dark" : "light");
//   };

//   const handleVariantAdd = () => {
//     const batch = variant.batches[0];
//     if (
//       variant.size &&
//       batch.batchNumber &&
//       batch.costPrice &&
//       batch.sellingPrice &&
//       batch.stock >= 0 &&
//       batch.gst !== ""
//     ) {
//       setProduct((prev) => ({
//         ...prev,
//         variants: [...prev.variants, { ...variant }],
//       }));
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });
//     } else {
//       alert("Please fill all variant and batch details.");
//     }
//   };

//   const handleVariantDelete = (index) => {
//     setProduct(
//       (prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index),
//     }));
//   };

//   const handleVariantEdit = (index) => {
//     const editVariant = product.variants[index];
//     setVariant(editVariant);
//     handleVariantDelete(index);
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     if (index === mainImageIndex) setMainImageIndex(-1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (images.length === 0) {
//       alert("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       alert("Please select a main image");
//       return;
//     }
//     if (product.variants.length === 0) {
//       alert("Please add at least one variant with batch details");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("description", product.description);
//     formData.append("category", product.category);
//     formData.append("brand", product.brand);
//     formData.append("variants", JSON.stringify(product.variants));

//     images.forEach((image, index) => {
//       formData.append("images", image);
//       formData.append("isMain", index === mainImageIndex);
//     });

//     try {
//       await axios.post("http://localhost:5000/api/product/add", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Product added successfully!");
//       setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
//       setImages([]);
//       setMainImageIndex(-1);
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });

//       const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("Failed to add product");
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!user) return null;

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
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//               Create product
//             </Typography>
//             <Box>
//               <Button variant="outlined" color="error" sx={{ mr: 2 }}>
//                 Discard
//               </Button>
//               <Button variant="contained" color="success" type="submit" form="product-form">
//                 Create
//               </Button>
//             </Box>
//           </Box>

//           <Card>
//             <CardContent>
//               <form id="product-form" onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   {/* First Row: Basic Information and Product Image */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Basic Information
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         label="Product name"
//                         value={product.name}
//                         onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                         required
//                         sx={{ mb: 2 }}
//                       />
//                       <TextField
//                         fullWidth
//                         label="Product code"
//                         value={product.code || ""}
//                         onChange={(e) => setProduct({ ...product, code: e.target.value })}
//                         sx={{ mb: 2 }}
//                       />
//                       <ReactQuill
//                         value={product.description}
//                         onChange={(value) => setProduct({ ...product, description: value })}
//                         modules={{
//                           toolbar: [
//                             [{ header: [1, 2, false] }],
//                             ["bold", "italic", "underline", "strike", "blockquote"],
//                             [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
//                             ["link", "image"],
//                             ["clean"],
//                           ],
//                         }}
//                         placeholder="Description"
//                         sx={{ mb: 2 }}
//                       />
//                     </Box>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Pricing
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         label="Price"
//                         type="number"
//                         value={variant.batches[0].sellingPrice}
//                         onChange={(e) =>
//                           setVariant({
//                             ...variant,
//                             batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                           })
//                         }
//                         sx={{ mb: 2 }}
//                       />
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, height: "100%" }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Product Image
//                       </Typography>
//                       <Typography sx={{ mb: 2 }}>
//                         Choose a product photo or simply drag and drop up to 5 photos here.
//                       </Typography>
//                       <Box
//                         sx={{
//                           border: "2px dashed #ccc",
//                           borderRadius: 1,
//                           p: 4,
//                           textAlign: "center",
//                           mb: 2,
//                           height: "200px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <input
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           onChange={handleImageChange}
//                           style={{ display: "none" }}
//                           id="image-upload"
//                         />
//                         <label htmlFor="image-upload">
//                           <Box>
//                             <Typography>Drop your image here, or</Typography>
//                             <Button variant="text" component="span" color="primary">
//                               Click to browse
//                             </Button>
//                           </Box>
//                         </label>
//                       </Box>
//                       <Typography sx={{ fontSize: "0.8rem", color: "#757575" }}>
//                         Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is restricted to a
//                         maximum of 500Kb.
//                       </Typography>
//                       {images.length > 0 && (
//                         <Box sx={{ mt: 2 }}>
//                           {images.map((image, index) => (
//                             <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                               <Typography>{image.name}</Typography>
//                               <Button
//                                 onClick={() => handleMainImageSelect(index)}
//                                 color={index === mainImageIndex ? "primary" : "inherit"}
//                                 sx={{ ml: 2 }}
//                               >
//                                 {index === mainImageIndex ? "Main" : "Set as Main"}
//                               </Button>
//                               <IconButton onClick={() => handleImageRemove(index)} color="secondary">
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Box>
//                           ))}
//                         </Box>
//                       )}
//                     </Box>
//                   </Grid>

//                   {/* Second Row: Attribute and Add Variants */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Attribute
//                       </Typography>
//                       <FormControl fullWidth sx={{ mb: 2 }}>
//                         <InputLabel>Category</InputLabel>
//                         <Select
//                           value={product.category}
//                           onChange={(e) => setProduct({ ...product, category: e.target.value })}
//                           label="Category"
//                           required
//                         >
//                           <MenuItem value="">Select...</MenuItem>
//                           {categories.map((cat) => (
//                             <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                       <FormControl fullWidth sx={{ mb: 2 }}>
//                         <InputLabel>Tags</InputLabel>
//                         <Select
//                           multiple
//                           value={product.tags || []}
//                           onChange={(e) => setProduct({ ...product, tags: e.target.value })}
//                           label="Tags"
//                           renderValue={(selected) => selected.join(", ")}
//                         >
//                           <MenuItem value="tag1">Tag 1</MenuItem>
//                           <MenuItem value="tag2">Tag 2</MenuItem>
//                           <MenuItem value="tag3">Tag 3</MenuItem>
//                         </Select>
//                       </FormControl>
//                       <TextField
//                         fullWidth
//                         label="Brand"
//                         value={product.brand}
//                         onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                         sx={{ mb: 2 }}
//                       />
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Add Variants
//                       </Typography>
//                       <Grid container spacing={1} alignItems="center">
//                         <Grid item xs={12} sm={2}>
//                           <TextField
//                             fullWidth
//                             label="Size"
//                             value={variant.size}
//                             onChange={(e) => setVariant({ ...variant, size: e.target.value })}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={2}>
//                           <TextField
//                             fullWidth
//                             label="Batch Number"
//                             value={variant.batches[0].batchNumber}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={2}>
//                           <TextField
//                             fullWidth
//                             label="Cost Price"
//                             type="number"
//                             value={variant.batches[0].costPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], costPrice: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={2}>
//                           <TextField
//                             fullWidth
//                             label="Selling Price"
//                             type="number"
//                             value={variant.batches[0].sellingPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={1}>
//                           <TextField
//                             fullWidth
//                             label="Discount (%)"
//                             type="number"
//                             value={variant.batches[0].discount}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], discount: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={1}>
//                           <TextField
//                             fullWidth
//                             label="Stock"
//                             type="number"
//                             value={variant.batches[0].stock}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], stock: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={1}>
//                           <TextField
//                             fullWidth
//                             label="GST (%)"
//                             type="number"
//                             value={variant.batches[0].gst}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], gst: e.target.value }],
//                               })
//                             }
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={1}>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<AddIcon />}
//                             onClick={handleVariantAdd}
//                             fullWidth
//                           >
//                             Add
//                           </Button>
//                         </Grid>
//                       </Grid>
//                       {product.variants.length > 0 && (
//                         <TableContainer component={Paper} sx={{ mt: 2 }}>
//                           <Table>
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell>Size</TableCell>
//                                 <TableCell>Batch Number</TableCell>
//                                 <TableCell align="right">Cost Price</TableCell>
//                                 <TableCell align="right">Selling Price</TableCell>
//                                 <TableCell align="right">Discount (%)</TableCell>
//                                 <TableCell align="right">Stock</TableCell>
//                                 <TableCell align="right">GST (%)</TableCell>
//                                 <TableCell align="right">Action</TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {product.variants.map((v, index) => (
//                                 <TableRow key={index}>
//                                   <TableCell>{v.size}</TableCell>
//                                   <TableCell>{v.batches[0].batchNumber}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
//                                   <TableCell align="right">{v.batches[0].discount}</TableCell>
//                                   <TableCell align="right">{v.batches[0].stock}</TableCell>
//                                   <TableCell align="right">{v.batches[0].gst}</TableCell>
//                                   <TableCell align="right">
//                                     <IconButton onClick={() => handleVariantEdit(index)} color="primary">
//                                       <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       )}
//                     </Box>
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

// export default AddProduct;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MenuIcon from "@mui/icons-material/Menu";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     category: "",
//     brand: "",
//     variants: [],
//     images: [],
//   });
//   const [variant, setVariant] = useState({
//     size: "",
//     batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//   });
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//     },
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         if (res.data && res.data.isAdmin) {
//           setUser(res.data);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/login");
//       }
//     };
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
//   }, [navigate]);

//   useEffect(() => {
//     if (user) {
//       const fetchData = async () => {
//         try {
//           const [categoryRes, brandRes, productRes] = await Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//           ]);
//           setCategories(categoryRes.data || []);
//           setBrands(brandRes.data || []);
//           setProducts(productRes.data || []);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [user]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     localStorage.setItem("theme", !darkMode ? "dark" : "light");
//   };

//   const handleVariantAdd = () => {
//     const batch = variant.batches[0];
//     if (
//       variant.size &&
//       batch.batchNumber &&
//       batch.costPrice &&
//       batch.sellingPrice &&
//       batch.stock >= 0 &&
//       batch.gst !== ""
//     ) {
//       setProduct((prev) => ({
//         ...prev,
//         variants: [...prev.variants, { ...variant }],
//       }));
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });
//     } else {
//       alert("Please fill all variant and batch details.");
//     }
//   };

//   const handleVariantDelete = (index) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index),
//     }));
//   };

//   const handleVariantEdit = (index) => {
//     const editVariant = product.variants[index];
//     setVariant(editVariant);
//     handleVariantDelete(index);
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     if (index === mainImageIndex) setMainImageIndex(-1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (images.length === 0) {
//       alert("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       alert("Please select a main image");
//       return;
//     }
//     if (product.variants.length === 0) {
//       alert("Please add at least one variant with batch details");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("description", product.description);
//     formData.append("category", product.category);
//     formData.append("brand", product.brand);
//     formData.append("variants", JSON.stringify(product.variants));

//     images.forEach((image, index) => {
//       formData.append("images", image);
//       formData.append("isMain", index === mainImageIndex);
//     });

//     try {
//       await axios.post("http://localhost:5000/api/product/add", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Product added successfully!");
//       setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
//       setImages([]);
//       setMainImageIndex(-1);
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });

//       const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("Failed to add product");
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!user) return null;

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
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <h4 className="fw-bold">Create product</h4>
//             <div>
//               <Button variant="outlined" color="error" className="me-2">
//                 Discard
//               </Button>
//               <Button variant="contained" color="success" type="submit" form="product-form">
//                 Create
//               </Button>
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-body">
//               <form id="product-form" onSubmit={handleSubmit}>
//                 <div className="row">
//                   {/* First Row: Basic Information and Product Image */}
//                   <div className="col-12 col-md-6">
//                     <div className="p-3 border rounded mb-3">
//                       <h6 className="fw-bold mb-3">Basic Information</h6>
//                       <div className="mb-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Product name"
//                           value={product.name}
//                           onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                           required
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <textarea
//                           className="form-control"
//                           placeholder="Description"
//                           value={product.description}
//                           onChange={(e) => setProduct({ ...product, description: e.target.value })}
//                           rows="4"
//                         />
//                       </div>
//                     </div>
//                     <div className="p-3 border rounded">
//                       <h6 className="fw-bold mb-3">Pricing</h6>
//                       <div className="mb-3">
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="Price"
//                           value={variant.batches[0].sellingPrice}
//                           onChange={(e) =>
//                             setVariant({
//                               ...variant,
//                               batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-md-6">
//                     <div className="p-3 border rounded" style={{ minHeight: "100%" }}>
//                       <h6 className="fw-bold mb-3">Product Image</h6>
//                       <p className="mb-3">Choose a product photo or simply drag and drop up to 5 photos here.</p>
//                       <div
//                         className="border border-dashed rounded p-4 text-center mb-3"
//                         style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}
//                       >
//                         <input
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           onChange={handleImageChange}
//                           style={{ display: "none" }}
//                           id="image-upload"
//                         />
//                         <label htmlFor="image-upload" className="text-center">
//                           <p>Drop your image here, or</p>
//                           <Button variant="text" component="span" color="primary">
//                             Click to browse
//                           </Button>
//                         </label>
//                       </div>
//                       <p className="text-muted small">
//                         Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is restricted to a maximum of
//                         500Kb.
//                       </p>
//                       {images.length > 0 && (
//                         <div className="mt-2">
//                           {images.map((image, index) => (
//                             <div key={index} className="d-flex align-items-center mb-1">
//                               <p className="mb-0">{image.name}</p>
//                               <Button
//                                 onClick={() => handleMainImageSelect(index)}
//                                 color={index === mainImageIndex ? "primary" : "inherit"}
//                                 className="ms-2"
//                               >
//                                 {index === mainImageIndex ? "Main" : "Set as Main"}
//                               </Button>
//                               <IconButton onClick={() => handleImageRemove(index)} color="secondary" className="ms-2">
//                                 <DeleteIcon />
//                               </IconButton>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Second Row: Attribute and Add Variants */}
//                   <div className="col-12 col-md-6 mt-3">
//                     <div className="p-3 border rounded">
//                       <h6 className="fw-bold mb-3">Attribute</h6>
//                       <div className="mb-3">
//                         <select
//                           className="form-select"
//                           value={product.category}
//                           onChange={(e) => setProduct({ ...product, category: e.target.value })}
//                           required
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                               {cat.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="mb-3">
//                         <select
//                           className="form-select"
//                           value={product.brand}
//                           onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                           required
//                         >
//                           <option value="">Select Brand</option>
//                           {brands.map((br) => (
//                             <option key={br._id} value={br._id}>
//                               {br.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-md-6 mt-3">
//                     <div className="p-3 border rounded">
//                       <h6 className="fw-bold mb-3">Add Variants</h6>
//                       <div className="row g-3 mb-3">
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Size"
//                             value={variant.size}
//                             onChange={(e) => setVariant({ ...variant, size: e.target.value })}
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Batch Number"
//                             value={variant.batches[0].batchNumber}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Cost Price"
//                             value={variant.batches[0].costPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], costPrice: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Selling Price"
//                             value={variant.batches[0].sellingPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Discount (%)"
//                             value={variant.batches[0].discount}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], discount: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Stock"
//                             value={variant.batches[0].stock}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], stock: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="GST (%)"
//                             value={variant.batches[0].gst}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], gst: e.target.value }],
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="col-12 col-sm-4">
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<AddIcon />}
//                             onClick={handleVariantAdd}
//                             fullWidth
//                           >
//                             Add
//                           </Button>
//                         </div>
//                       </div>
//                       {product.variants.length > 0 && (
//                         <TableContainer component={Paper}>
//                           <Table>
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell>Size</TableCell>
//                                 <TableCell>Batch Number</TableCell>
//                                 <TableCell align="right">Cost Price</TableCell>
//                                 <TableCell align="right">Selling Price</TableCell>
//                                 <TableCell align="right">Discount (%)</TableCell>
//                                 <TableCell align="right">Stock</TableCell>
//                                 <TableCell align="right">GST (%)</TableCell>
//                                 <TableCell align="right">Action</TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {product.variants.map((v, index) => (
//                                 <TableRow key={index}>
//                                   <TableCell>{v.size}</TableCell>
//                                   <TableCell>{v.batches[0].batchNumber}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
//                                   <TableCell align="right">{v.batches[0].discount}</TableCell>
//                                   <TableCell align="right">{v.batches[0].stock}</TableCell>
//                                   <TableCell align="right">{v.batches[0].gst}</TableCell>
//                                   <TableCell align="right">
//                                     <IconButton onClick={() => handleVariantEdit(index)} color="primary">
//                                       <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AddProduct;
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
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
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Grid,
//   IconButton,
//   Icon,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MenuIcon from "@mui/icons-material/Menu";
// import FormatBoldIcon from "@mui/icons-material/FormatBold";
// import FormatItalicIcon from "@mui/icons-material/FormatItalic";
// import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     category: "",
//     brand: "",
//     variants: [],
//     images: [],
//   });
//   const [variant, setVariant] = useState({
//     size: "",
//     batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//   });
//   const [images, setImages] = useState([]);
//   const [mainImageIndex, setMainImageIndex] = useState(-1);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

//   const descriptionRef = useRef(null);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
//       secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
//     },
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users/me", { withCredentials: true });
//         if (res.data && res.data.isAdmin) {
//           setUser(res.data);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         navigate("/login");
//       }
//     };
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
//   }, [navigate]);

//   useEffect(() => {
//     if (user) {
//       const fetchData = async () => {
//         try {
//           const [categoryRes, brandRes, productRes] = await Promise.all([
//             axios.get("http://localhost:5000/api/category/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/vendor/list", { withCredentials: true }),
//             axios.get("http://localhost:5000/api/product/list", { withCredentials: true }),
//           ]);
//           setCategories(categoryRes.data || []);
//           setBrands(brandRes.data || []);
//           setProducts(productRes.data || []);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [user]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     localStorage.setItem("theme", !darkMode ? "dark" : "light");
//   };

//   const handleVariantAdd = () => {
//     const batch = variant.batches[0];
//     if (
//       variant.size &&
//       batch.batchNumber &&
//       batch.costPrice &&
//       batch.sellingPrice &&
//       batch.stock >= 0 &&
//       batch.gst !== ""
//     ) {
//       setProduct((prev) => ({
//         ...prev,
//         variants: [...prev.variants, { ...variant }],
//       }));
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });
//     } else {
//       alert("Please fill all variant and batch details.");
//     }
//   };

//   const handleVariantDelete = (index) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index),
//     }));
//   };

//   const handleVariantEdit = (index) => {
//     const editVariant = product.variants[index];
//     setVariant(editVariant);
//     handleVariantDelete(index);
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages((prev) => [...prev, ...files]);
//   };

//   const handleMainImageSelect = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleImageRemove = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     if (index === mainImageIndex) setMainImageIndex(-1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (images.length === 0) {
//       alert("Please upload at least one image");
//       return;
//     }
//     if (mainImageIndex === -1) {
//       alert("Please select a main image");
//       return;
//     }
//     if (product.variants.length === 0) {
//       alert("Please add at least one variant with batch details");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("description", descriptionRef.current.innerHTML);
//     formData.append("category", product.category);
//     formData.append("brand", product.brand);
//     formData.append("variants", JSON.stringify(product.variants));

//     images.forEach((image, index) => {
//       formData.append("images", image);
//       formData.append("isMain", index === mainImageIndex);
//     });

//     try {
//       await axios.post("http://localhost:5000/api/product/add", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Product added successfully!");
//       setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
//       setImages([]);
//       setMainImageIndex(-1);
//       setVariant({
//         size: "",
//         batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
//       });
//       descriptionRef.current.innerHTML = "";

//       const productRes = await axios.get("http://localhost:5000/api/product/list", { withCredentials: true });
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("Failed to add product");
//     }
//   };

//   const handleFormat = (command, value = null) => {
//     document.execCommand(command, false, value);
//     descriptionRef.current.focus();
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!user) return null;

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
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//             {isMobile && (
//               <IconButton onClick={() => setSidebarOpen(true)}>
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//               Create product
//             </Typography>
//             <Box>
//               <Button variant="outlined" color="error" sx={{ mr: 2 }}>
//                 Discard
//               </Button>
//               <Button variant="contained" color="success" type="submit" form="product-form">
//                 Create
//               </Button>
//             </Box>
//           </Box>

//           <Card>
//             <CardContent>
//               <form id="product-form" onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   {/* First Row: Basic Information and Product Image */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Basic Information
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         label="Product name"
//                         value={product.name}
//                         onChange={(e) => setProduct({ ...product, name: e.target.value })}
//                         required
//                         sx={{
//                           mb: 2,
//                           "& .MuiOutlinedInput-root": {
//                             "&.Mui-focused fieldset": {
//                               borderColor: "green",
//                             },
//                           },
//                         }}
//                       />
//                       <Box sx={{ mb: 2 }}>
//                         <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
//                           <IconButton onClick={() => handleFormat("bold")} size="small">
//                             <FormatBoldIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleFormat("italic")} size="small">
//                             <FormatItalicIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleFormat("underline")} size="small">
//                             <FormatUnderlinedIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleFormat("insertUnorderedList")} size="small">
//                             <FormatListBulletedIcon />
//                           </IconButton>
//                           <IconButton onClick={() => handleFormat("insertOrderedList")} size="small">
//                             <FormatListNumberedIcon />
//                           </IconButton>
//                         </Box>
//                         <div
//                           ref={descriptionRef}
//                           contentEditable
//                           style={{
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "4px",
//                             minHeight: "100px",
//                             padding: "8px",
//                             outline: "none",
//                             "&:focus": {
//                               borderColor: "green",
//                             },
//                           }}
//                           onInput={(e) => setProduct({ ...product, description: e.currentTarget.innerHTML })}
//                           dangerouslySetInnerHTML={{ __html: product.description }}
//                         />
//                       </Box>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, height: "100%" }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Product Image
//                       </Typography>
//                       <Typography sx={{ mb: 2 }}>
//                         Choose a product photo or simply drag and drop up to 5 photos here.
//                       </Typography>
//                       <Box
//                         sx={{
//                           border: "2px dashed #ccc",
//                           borderRadius: 1,
//                           p: 4,
//                           textAlign: "center",
//                           mb: 2,
//                           height: "200px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <input
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           onChange={handleImageChange}
//                           style={{ display: "none" }}
//                           id="image-upload"
//                         />
//                         <label htmlFor="image-upload">
//                           <Box>
//                             <Typography>Drop your image here, or</Typography>
//                             <Button variant="text" component="span" color="primary">
//                               Click to browse
//                             </Button>
//                           </Box>
//                         </label>
//                       </Box>
//                       <Typography sx={{ fontSize: "0.8rem", color: "#757575" }}>
//                         Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is restricted to a
//                         maximum of 500Kb.
//                       </Typography>
//                       {images.length > 0 && (
//                         <Box sx={{ mt: 2 }}>
//                           {images.map((image, index) => (
//                             <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                               <Typography>{image.name}</Typography>
//                               <Button
//                                 onClick={() => handleMainImageSelect(index)}
//                                 color={index === mainImageIndex ? "primary" : "inherit"}
//                                 sx={{ ml: 2 }}
//                               >
//                                 {index === mainImageIndex ? "Main" : "Set as Main"}
//                               </Button>
//                               <IconButton onClick={() => handleImageRemove(index)} color="secondary">
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Box>
//                           ))}
//                         </Box>
//                       )}
//                     </Box>
//                   </Grid>

//                   {/* Second Row: Attribute and Add Variants */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Attribute
//                       </Typography>
//                       <FormControl fullWidth sx={{ mb: 2 }}>
//                         <InputLabel>Category</InputLabel>
//                         <Select
//                           value={product.category}
//                           onChange={(e) => setProduct({ ...product, category: e.target.value })}
//                           label="Category"
//                           required
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "green",
//                               },
//                             },
//                           }}
//                         >
//                           <MenuItem value="">Select Category</MenuItem>
//                           {categories.map((cat) => (
//                             <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                       <FormControl fullWidth sx={{ mb: 2 }}>
//                         <InputLabel>Brand</InputLabel>
//                         <Select
//                           value={product.brand}
//                           onChange={(e) => setProduct({ ...product, brand: e.target.value })}
//                           label="Brand"
//                           required
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "green",
//                               },
//                             },
//                           }}
//                         >
//                           <MenuItem value="">Select Brand</MenuItem>
//                           {brands.map((br) => (
//                             <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//                         Add Variants
//                       </Typography>
//                       <Grid container spacing={2} alignItems="center">
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Size"
//                             value={variant.size}
//                             onChange={(e) => setVariant({ ...variant, size: e.target.value })}
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Batch Number"
//                             value={variant.batches[0].batchNumber}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Cost Price"
//                             type="number"
//                             value={variant.batches[0].costPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], costPrice: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Selling Price"
//                             type="number"
//                             value={variant.batches[0].sellingPrice}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Discount (%)"
//                             type="number"
//                             value={variant.batches[0].discount}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], discount: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="Stock"
//                             type="number"
//                             value={variant.batches[0].stock}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], stock: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <TextField
//                             fullWidth
//                             label="GST (%)"
//                             type="number"
//                             value={variant.batches[0].gst}
//                             onChange={(e) =>
//                               setVariant({
//                                 ...variant,
//                                 batches: [{ ...variant.batches[0], gst: e.target.value }],
//                               })
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "green",
//                                 },
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<AddIcon />}
//                             onClick={handleVariantAdd}
//                             fullWidth
//                           >
//                             Add
//                           </Button>
//                         </Grid>
//                       </Grid>
//                       {product.variants.length > 0 && (
//                         <TableContainer component={Paper} sx={{ mt: 2 }}>
//                           <Table>
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell>Size</TableCell>
//                                 <TableCell>Batch Number</TableCell>
//                                 <TableCell align="right">Cost Price</TableCell>
//                                 <TableCell align="right">Selling Price</TableCell>
//                                 <TableCell align="right">Discount (%)</TableCell>
//                                 <TableCell align="right">Stock</TableCell>
//                                 <TableCell align="right">GST (%)</TableCell>
//                                 <TableCell align="right">Action</TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {product.variants.map((v, index) => (
//                                 <TableRow key={index}>
//                                   <TableCell>{v.size}</TableCell>
//                                   <TableCell>{v.batches[0].batchNumber}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
//                                   <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
//                                   <TableCell align="right">{v.batches[0].discount}</TableCell>
//                                   <TableCell align="right">{v.batches[0].stock}</TableCell>
//                                   <TableCell align="right">{v.batches[0].gst}</TableCell>
//                                   <TableCell align="right">
//                                     <IconButton onClick={() => handleVariantEdit(index)} color="primary">
//                                       <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       )}
//                     </Box>
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

// export default AddProduct;
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
import ReactQuill from "react-quill"; // Import react-quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

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
              Create product
            </Typography>
            <Box>
              <Button variant="outlined" color="error" sx={{ mr: 2 }}>
                Discard
              </Button>
              <Button variant="contained" color="success" type="submit" form="product-form">
                Create
              </Button>
            </Box>
          </Box>

          <Card>
            <CardContent>
              <form id="product-form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* First Row: Basic Information and Product Image */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Basic Information
                      </Typography>
                      <TextField
                        fullWidth
                        label="Product name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "green",
                            },
                          },
                        }}
                      />
                      <ReactQuill
                        value={product.description}
                        onChange={(content) => setProduct({ ...product, description: content })}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline"],
                            [{ list: "bullet" }, { list: "ordered" }],
                          ],
                        }}
                        formats={["header", "bold", "italic", "underline", "list", "bullet", "ordered"]}
                        style={{ height: "150px", marginBottom: "16px" }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, height: "100%" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Product Image
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        Choose a product photo or simply drag and drop up to 5 photos here.
                      </Typography>
                      <Box
                        sx={{
                          border: "2px dashed #ccc",
                          borderRadius: 1,
                          p: 4,
                          textAlign: "center",
                          mb: 2,
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Box>
                            <Typography>Drop your image here, or</Typography>
                            <Button variant="text" component="span" color="primary">
                              Click to browse
                            </Button>
                          </Box>
                        </label>
                      </Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "#757575" }}>
                        Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is restricted to a
                        maximum of 500Kb.
                      </Typography>
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
                    </Box>
                  </Grid>

                  {/* Second Row: Attribute and Add Variants */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Attribute
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={product.category}
                          onChange={(e) => setProduct({ ...product, category: e.target.value })}
                          label="Category"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "green",
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                          value={product.brand}
                          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                          label="Brand"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "green",
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Select Brand</MenuItem>
                          {brands.map((br) => (
                            <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Add Variants
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Size"
                            value={variant.size}
                            onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "green",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                      {product.variants.length > 0 && (
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
                      )}
                    </Box>
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