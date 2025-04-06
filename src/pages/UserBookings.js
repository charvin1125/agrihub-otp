// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Container,
//   CircularProgress,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Breadcrumbs,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import HomeIcon from "@mui/icons-material/Home";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import NavigationBar from "../components/Navbar";
// import Footer from "../components/Footer";

// const UserBookings = () => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openInvoice, setOpenInvoice] = useState(false);
//   const invoiceRef = useRef();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("http://localhost:5000/api/my-bookings", { withCredentials: true });
//         setBookings(res.data || []);
//       } catch (error) {
//         console.error("Error fetching bookings:", error.response?.data || error.message);
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();

//     const handleResize = () => setIsMobile(window.innerWidth < 600);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleViewInvoice = (booking) => {
//     setSelectedBooking(booking);
//     setOpenInvoice(true);
//   };

//   const handleTrackBookings = () => {
//     navigate("/booking-tracking"); // Adjust route as needed
//   };

//   const generateInvoicePDF = () => {
//     if (!selectedBooking || !invoiceRef.current) return;

//     const input = invoiceRef.current;

//     html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       const pageWidth = 210;
//       const pageHeight = 297;
//       const margin = 15;
//       const contentWidth = pageWidth - 2 * margin;
//       const imgHeight = (canvas.height * contentWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = margin;

//       pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
//       heightLeft -= (pageHeight - 2 * margin);

//       while (heightLeft > 0) {
//         pdf.addPage();
//         position = heightLeft - imgHeight + margin;
//         pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
//         heightLeft -= (pageHeight - 2 * margin);
//       }

//       pdf.save(`invoice_${selectedBooking._id}.pdf`);
//     }).catch((error) => {
//       console.error("Error generating PDF:", error);
//     });
//   };

//   const theme = createTheme({
//     palette: {
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: "#F7F9F7", paper: "#FFFFFF" },
//       text: { primary: "#1A1A1A", secondary: "#616161" },
//     },
//     typography: {
//       fontFamily: "'Poppins', sans-serif",
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "20px",
//             boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//             transition: "all 0.4s ease",
//             "&:hover": {
//               transform: "translateY(-8px)",
//               boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
//             },
//             background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
//           },
//         },
//       },
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: "#2E7D32",
//             color: "#FFFFFF",
//             fontWeight: 600,
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
//             padding: { xs: "8px", sm: "10px", md: "14px" },
//             whiteSpace: "nowrap",
//           },
//           body: {
//             padding: { xs: "8px", sm: "10px", md: "14px" },
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "14px",
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
//             padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" },
//             "&:hover": {
//               boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiTableContainer: {
//         styleOverrides: {
//           root: {
//             borderRadius: "20px",
//             boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//             background: "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
//           },
//         },
//       },
//       MuiDialog: {
//         styleOverrides: {
//           paper: {
//             borderRadius: "20px",
//             boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
//           },
//         },
//       },
//       MuiBreadcrumbs: {
//         styleOverrides: {
//           root: {
//             fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
//             "& a": {
//               display: "flex",
//               alignItems: "center",
//               textDecoration: "none",
//               color: "primary.main",
//               "&:hover": { textDecoration: "underline" },
//             },
//           },
//           separator: { color: "text.secondary" },
//         },
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
//         <CircularProgress size={40} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#FFFFFF" }}>
//           <Container maxWidth="lg">
//             <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//               <RouterLink to="/">
//                 <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.25rem" } }} /> Home
//               </RouterLink>
//               <Typography color="text.primary">My Bookings</Typography>
//             </Breadcrumbs>
//           </Container>
//         </Box>
//         <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 3, sm: 5 }, flexGrow: 1 }}>
//           <Typography
//             variant={isMobile ? "h5" : "h4"}
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//               color: "primary.main",
//               fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
//               background: "linear-gradient(45deg, #2E7D32, #81C784)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             My Bookings
//           </Typography>

//           <Card>
//             <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
//                 <Typography variant={isMobile ? "h6" : "h5"} sx={{ color: "primary.main", fontWeight: 600, mb: { xs: 1, sm: 0 } }}>
//                   Your Booked Services
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<TrackChangesIcon />}
//                   onClick={handleTrackBookings}
//                   sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, width: { xs: "100%", sm: "auto" } }}
//                 >
//                   Track Bookings
//                 </Button>
//               </Box>
//               {bookings.length === 0 ? (
//                 <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", fontSize: { xs: "1rem", md: "1.25rem" } }}>
//                   No bookings found.
//                 </Typography>
//               ) : (
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: { xs: 300, sm: 750 } }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Service</TableCell>
//                         <TableCell>Crop</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Area (Sq Ft)</TableCell>
//                         <TableCell align="right">Total Price</TableCell>
//                         <TableCell align="right">Status</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>Labor</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>Labor Mobile</TableCell>
//                         <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Service Date</TableCell>
//                         <TableCell align="right">Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {bookings.map((booking) => (
//                         <TableRow key={booking._id} sx={{ "&:hover": { bgcolor: "#F1F8E9" } }}>
//                           <TableCell sx={{ minWidth: { xs: 150, sm: 200 } }}>
//                             <Box>
//                               <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary", fontWeight: 500 }}>
//                                 {booking.serviceName}
//                               </Typography>
//                               {isMobile && (
//                                 <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
//                                   Area: {booking.areaInSqFt} Sq Ft | {booking.status}
//                                 </Typography>
//                               )}
//                             </Box>
//                           </TableCell>
//                           <TableCell>{booking.crop}</TableCell>
//                           <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>{booking.areaInSqFt}</TableCell>
//                           <TableCell align="right">₹{booking.totalPrice.toFixed(2)}</TableCell>
//                           <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
//                             <Box
//                               sx={{
//                                 bgcolor:
//                                   booking.status === "Completed"
//                                     ? "#81C784"
//                                     : booking.status === "Pending"
//                                     ? "#FFB300"
//                                     : "#EF5350",
//                                 color: "#FFFFFF",
//                                 borderRadius: "10px",
//                                 textAlign: "center",
//                                 py: 0.5,
//                                 fontSize: { xs: "0.7rem", sm: "0.8rem" },
//                               }}
//                             >
//                               {booking.status}
//                             </Box>
//                           </TableCell>
//                           <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>{booking.laborId?.name || "Not Assigned"}</TableCell>
//                           <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>{booking.laborId?.mobile || "N/A"}</TableCell>
//                           <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
//                             {booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString() : "Not Set"}
//                           </TableCell>
//                           <TableCell align="right">
//                             <IconButton
//                               onClick={() => handleViewInvoice(booking)}
//                               sx={{ color: "#2E7D32", "&:hover": { color: "#81C784" } }}
//                             >
//                               <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </CardContent>
//           </Card>
//         </Box>

//         {/* Invoice Dialog */}
//         <Dialog open={openInvoice} onClose={() => setOpenInvoice(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
//           <DialogTitle sx={{ bgcolor: "#2E7D32", color: "#FFFFFF", textAlign: "center", fontWeight: 600 }}>
//             Invoice - {selectedBooking?.serviceName || "Service"}
//           </DialogTitle>
//           <DialogContent sx={{ bgcolor: "#F7F9F7", p: { xs: 2, sm: 3 } }}>
//             {selectedBooking && (
//               <Box
//                 ref={invoiceRef}
//                 sx={{
//                   bgcolor: "#FFFFFF",
//                   p: 3,
//                   borderRadius: "10px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   maxWidth: "500px",
//                   mx: "auto",
//                 }}
//               >
//                 <Box sx={{ textAlign: "center", mb: 3 }}>
//                   <Typography variant="h4" sx={{ color: "#2E7D32", fontWeight: 700 }}>
//                     AgriHub
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Your Trusted Farming Partner
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Email: support@agrihub.com | Phone: +91 123-456-7890
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
//                   <Box sx={{ mb: { xs: 1, sm: 0 } }}>
//                     <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Invoice ID:</strong> {selectedBooking._id}</Typography>
//                     <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
//                   </Box>
//                   <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
//                     <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Customer:</strong> {selectedBooking.customerName}</Typography>
//                     <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Contact:</strong> {selectedBooking.contactNumber}</Typography>
//                   </Box>
//                 </Box>

//                 <TableContainer component={Paper} sx={{ mb: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ bgcolor: "#81C784" }}>
//                         <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}><strong>Description</strong></TableCell>
//                         <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}><strong>Details</strong></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>Service</TableCell>
//                         <TableCell>{selectedBooking.serviceName}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Crop</TableCell>
//                         <TableCell>{selectedBooking.crop}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Area</TableCell>
//                         <TableCell>{selectedBooking.areaInSqFt} Sq Ft</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Farm Address</TableCell>
//                         <TableCell>{selectedBooking.farmAddress}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Pincode</TableCell>
//                         <TableCell>{selectedBooking.pincode}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Labor</TableCell>
//                         <TableCell>{selectedBooking.laborId?.name || "Not Assigned"}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Labor Mobile</TableCell>
//                         <TableCell>{selectedBooking.laborId?.mobile || "N/A"}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Service Date</TableCell>
//                         <TableCell>{selectedBooking.serviceDate ? new Date(selectedBooking.serviceDate).toLocaleDateString() : "Not Set"}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Status</TableCell>
//                         <TableCell>{selectedBooking.status}</TableCell>
//                       </TableRow>
//                       <TableRow sx={{ bgcolor: "#F1F8E9" }}>
//                         <TableCell><strong>Total Amount</strong></TableCell>
//                         <TableCell><strong>₹{selectedBooking.totalPrice.toFixed(2)}</strong></TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <Box sx={{ textAlign: "center", mt: 3 }}>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Thank you for choosing AgriHub!
//                   </Typography>
//                 </Box>
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ bgcolor: "#FFFFFF", p: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={generateInvoicePDF}
//               sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" } }}
//             >
//               Download Invoice
//             </Button>
//             <Button
//               onClick={() => setOpenInvoice(false)}
//               color="primary"
//               variant="outlined"
//               sx={{ borderColor: "#2E7D32", color: "#2E7D32", "&:hover": { borderColor: "#81C784", color: "#81C784" } }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Footer />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default UserBookings;
// UserBookings.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const UserBookings = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/my-bookings", { withCredentials: true });
        setBookings(res.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error.response?.data || error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleViewInvoice = (booking) => {
    setSelectedBooking(booking);
    setOpenInvoice(true);
  };

  const handleTrackBookings = () => {
    navigate("/customer-dashboard/booking-tracking"); // Updated to stay within dashboard
  };

  const generateInvoicePDF = () => {
    if (!selectedBooking || !invoiceRef.current) return;

    const input = invoiceRef.current;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
      heightLeft -= pageHeight - 2 * margin;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;
      }

      pdf.save(`invoice_${selectedBooking._id}.pdf`);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#2E7D32" },
      secondary: { main: "#81C784" },
      background: { default: darkMode ? "#121212" : "#F7F9F7", paper: darkMode ? "#1E1E1E" : "#FFFFFF" },
      text: { primary: darkMode ? "#E0E0E0" : "#1A1A1A", secondary: darkMode ? "#B0B0B0" : "#616161" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
            },
            background: darkMode
              ? "linear-gradient(180deg, #1E1E1E 70%, #121212 100%)"
              : "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkMode ? "#0F3460" : "#2E7D32",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
            padding: { xs: "8px", sm: "10px", md: "14px" },
            whiteSpace: "nowrap",
          },
          body: {
            padding: { xs: "8px", sm: "10px", md: "14px" },
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
            padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" },
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
            background: darkMode
              ? "linear-gradient(180deg, #1E1E1E 70%, #121212 100%)"
              : "linear-gradient(180deg, #FFFFFF 70%, #F7F9F7 100%)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "20px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
            backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={40} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", overflowX: "hidden", p: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <RouterLink to="/customer-dashboard">
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "1rem", md: "1.25rem" } }} /> Dashboard
          </RouterLink>
          <Typography color="text.primary">My Bookings</Typography>
        </Breadcrumbs>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "primary.main",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            background: "linear-gradient(45deg, #2E7D32, #81C784)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Bookings
        </Typography>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ color: "primary.main", fontWeight: 600, mb: { xs: 1, sm: 0 } }}>
                Your Booked Services
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<TrackChangesIcon />}
                onClick={handleTrackBookings}
                sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" }, width: { xs: "100%", sm: "auto" } }}
              >
                Track Bookings
              </Button>
            </Box>
            {bookings.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", fontSize: { xs: "1rem", md: "1.25rem" } }}>
                No bookings found.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: { xs: 300, sm: 750 } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Crop</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Area (Sq Ft)</TableCell>
                      <TableCell align="right">Total Price</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>Labor</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>Labor Mobile</TableCell>
                      <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>Service Date</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id} sx={{ "&:hover": { bgcolor: darkMode ? "#2A2A2A" : "#F1F8E9" } }}>
                        <TableCell sx={{ minWidth: { xs: 150, sm: 200 } }}>
                        
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ color: "text.primary", fontWeight: 500 }}>
                              {booking.serviceName}
                            </Typography>
                            {isMobile && (
                              <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                                Area: {booking.areaInSqFt} Sq Ft | {booking.status}
                              </Typography>
                            )}
                          </TableCell>
                        <TableCell>{booking.crop}</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>{booking.areaInSqFt}</TableCell>
                        <TableCell align="right">₹{booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          <Box
                            sx={{
                              bgcolor:
                                booking.status === "Completed"
                                  ? "#81C784"
                                  : booking.status === "Pending"
                                  ? "#FFB300"
                                  : "#EF5350",
                              color: "#FFFFFF",
                              borderRadius: "10px",
                              textAlign: "center",
                              py: 0.5,
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            }}
                          >
                            {booking.status}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>{booking.laborId?.name || "Not Assigned"}</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>{booking.laborId?.mobile || "N/A"}</TableCell>
                        <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          {booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString() : "Not Set"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleViewInvoice(booking)}
                            sx={{ color: "#2E7D32", "&:hover": { color: "#81C784" } }}
                          >
                            <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Invoice Dialog */}
        <Dialog open={openInvoice} onClose={() => setOpenInvoice(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
          <DialogTitle sx={{ bgcolor: darkMode ? "#0F3460" : "#2E7D32", color: "#FFFFFF", textAlign: "center", fontWeight: 600 }}>
            Invoice - {selectedBooking?.serviceName || "Service"}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: darkMode ? "#121212" : "#F7F9F7", p: { xs: 2, sm: 3 } }}>
            {selectedBooking && (
              <Box
                ref={invoiceRef}
                sx={{
                  bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF",
                  p: 3,
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  maxWidth: "500px",
                  mx: "auto",
                }}
              >
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography variant="h4" sx={{ color: "#2E7D32", fontWeight: 700 }}>
                    AgriHub
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Your Trusted Farming Partner
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Email: support@agrihub.com | Phone: +91 123-456-7890
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Invoice ID:</strong> {selectedBooking._id}</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Customer:</strong> {selectedBooking.customerName}</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}><strong>Contact:</strong> {selectedBooking.contactNumber}</Typography>
                  </Box>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: darkMode ? "#0F3460" : "#81C784" }}>
                        <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}><strong>Description</strong></TableCell>
                        <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>{selectedBooking.serviceName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Crop</TableCell>
                        <TableCell>{selectedBooking.crop}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Area</TableCell>
                        <TableCell>{selectedBooking.areaInSqFt} Sq Ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Farm Address</TableCell>
                        <TableCell>{selectedBooking.farmAddress}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pincode</TableCell>
                        <TableCell>{selectedBooking.pincode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Labor</TableCell>
                        <TableCell>{selectedBooking.laborId?.name || "Not Assigned"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Labor Mobile</TableCell>
                        <TableCell>{selectedBooking.laborId?.mobile || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Service Date</TableCell>
                        <TableCell>{selectedBooking.serviceDate ? new Date(selectedBooking.serviceDate).toLocaleDateString() : "Not Set"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>{selectedBooking.status}</TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: darkMode ? "#2A2A2A" : "#F1F8E9" }}>
                        <TableCell><strong>Total Amount</strong></TableCell>
                        <TableCell><strong>₹{selectedBooking.totalPrice.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Thank you for choosing AgriHub!
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: darkMode ? "#1E1E1E" : "#FFFFFF", p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={generateInvoicePDF}
              sx={{ bgcolor: "#2E7D32", "&:hover": { bgcolor: "#81C784" } }}
            >
              Download Invoice
            </Button>
            <Button
              onClick={() => setOpenInvoice(false)}
              color="primary"
              variant="outlined"
              sx={{ borderColor: "#2E7D32", color: "#2E7D32", "&:hover": { borderColor: "#81C784", color: "#81C784" } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UserBookings;