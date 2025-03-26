import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"; // Install with: npm install html2canvas
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";
import { motion } from "framer-motion";
import Logo from "../img/logo-1-removebg.png"; // Adjust path as needed
import Seal from "../img/Seal.png"; // Adjust path as needed

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const invoiceRef = useRef(); // Ref to capture the invoice content

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/my-orders`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const selectedOrder = response.data.orders.find((o) => o._id === orderId);
          setOrder(selectedOrder || null);
        }
      } catch (error) {
        console.error("Error fetching order:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [orderId]);

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate total with GST for an item
  const calculateTotalWithGST = (item) => {
    const gstRate = item.gst ? item.gst / 100 : 0;
    return (item.price * (1 + gstRate) * item.quantity).toFixed(2);
  };

  // Calculate grand total with GST
  const calculateGrandTotalWithGST = (cart) => {
    return cart.reduce((sum, item) => sum + parseFloat(calculateTotalWithGST(item)), 0).toFixed(2);
  };

  // Generate PDF from HTML content
  const handleDownloadPDF = () => {
    if (!order || !invoiceRef.current) return;

    const input = invoiceRef.current;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${order._id}.pdf`);
      console.log("PDF downloaded successfully:", `invoice_${order._id}.pdf`);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
    });
  };

  // Theme configuration (Light Theme Only)
  const theme = createTheme({
    palette: {
      primary: { main: "#388E3C" },
      secondary: { main: "#4CAF50" },
      background: { default: "#f5f5f5", paper: "#fff" },
      text: { primary: "#212121", secondary: "#757575" },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: "bold", backgroundColor: "#A5D6A7", color: "#212121", padding: "12px" },
          body: { padding: "10px" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none", fontSize: { xs: "0.9rem", md: "1rem" }, py: 1, px: 2 },
        },
      },
    },
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress size={60} sx={{ color: "#388E3C" }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: "center", mt: 5, bgcolor: "background.default" }}>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Order not found.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, bgcolor: "#F9F9F9" }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
            <Link to="/" style={{ color: "#388E3C", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }} /> Home
            </Link>
            <Typography sx={{ color: "primary.main" }}>Invoice</Typography>
          </Breadcrumbs>
        </Box>

        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{ maxWidth: 900, mx: "auto", mt: { xs: 2, md: 4 }, bgcolor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {/* Invoice Content to Capture */}
          <Box ref={invoiceRef} sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={Logo}
                  alt="AgriHub Logo"
                  style={{ height: isMobile ? 50 : 70, width: "auto", marginRight: 2 }}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/70?text=Logo")}
                />
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Invoice
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                Order ID: {order._id}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                Customer Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Name:</strong> {order.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Phone:</strong> {order.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Address:</strong> {order.address || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Pincode:</strong> {order.pincode || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Crop:</strong> {order.crop || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Purchase Type:</strong> {order.purchaseType || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Status:</strong> {order.status}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                Payment Details
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                <strong>Total Amount (with GST):</strong> ₹{calculateGrandTotalWithGST(order.cart)}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                <strong>Is Due:</strong> {order.isDue ? "Yes" : "No"}
              </Typography>
            </Box>

            <Divider sx={{ my: 3, bgcolor: "rgba(0, 0, 0, 0.1)" }} />
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
              Items
            </Typography>
            <TableContainer component={Paper} sx={{ border: "1px solid #ddd" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">GST (%)</TableCell>
                    <TableCell align="right">Total (with GST)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.cart.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          {item.size || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          ₹{item.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          {item.gst || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary" }}>
                          ₹{calculateTotalWithGST(item)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell colSpan={5} align="right">
                      <Typography variant={isMobile ? "subtitle1" : "subtitle1"} sx={{ fontWeight: "bold", color: "text.primary" }}>
                        Grand Total (with GST):
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant={isMobile ? "subtitle1" : "subtitle1"} sx={{ fontWeight: "bold", color: "text.primary" }}>
                        ₹{calculateGrandTotalWithGST(order.cart)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} align="right" sx={{ pt: 2 }}>
                      <img
                        src={Seal}
                        alt="AgriHub Seal"
                        style={{ height: isMobile ? 80 : 120, width: "auto" }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Download Button Outside Captured Content */}
          <Box sx={{ mt: { xs: 2, md: 3 }, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPDF}
              sx={{ px: { xs: 2, md: 4 }, py: { xs: 0.5, md: 1 }, bgcolor: "#388E3C", "&:hover": { bgcolor: "#4CAF50" } }}
            >
              Download PDF
            </Button>
          </Box>

          <Box sx={{ py: 4, bgcolor: "#E8F5E9", textAlign: "center", mt: 4 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              © {new Date().getFullYear()} AgriHub. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Invoice;