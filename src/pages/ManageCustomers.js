// // src/components/admin/ManageCustomers.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Button, Container, Alert } from "react-bootstrap"; 

// const ManageCustomers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/users/customers", {
//         withCredentials: true // For session-based auth
//       });
//       setCustomers(response.data.customers);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching customers");
//       setLoading(false);
//     }
//   };

//   // Optional: Add delete functionality
//   const handleDelete = async (customerId) => {
//     if (window.confirm("Are you sure you want to delete this customer?")) {
//       try {
//         // You'd need to add a delete endpoint in your backend
//         await axios.delete(`http://localhost:5000/api/users/${customerId}`, {
//           withCredentials: true
//         });
//         setCustomers(customers.filter(customer => customer._id !== customerId));
//       } catch (err) {
//         setError(err.response?.data?.message || "Error deleting customer");
//       }
//     }
//   };

//   if (loading) return <Container>Loading...</Container>;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container className="mt-4">
//       <h2>Manage Customers</h2>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Mobile</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer._id}>
//               <td>{customer.username}</td>
//               <td>{customer.firstName}</td>
//               <td>{customer.lastName}</td>
//               <td>{customer.mobile}</td>
//               <td>
//                 {/* Add more actions as needed */}
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDelete(customer._id)}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default ManageCustomers;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ManageCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users/customers", { withCredentials: true });
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const handleResize = () => {
      const mobileView = window.innerWidth < 600;
      setIsMobile(mobileView);
      if (mobileView) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle view details
  const handleOpenDetails = (customer) => {
    setSelectedCustomer(customer);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => setOpenDetails(false);

  // Handle delete customer
  const handleOpenDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setCustomerToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${customerToDelete._id}`, { withCredentials: true });
      setCustomers(customers.filter((c) => c._id !== customerToDelete._id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Export customers to CSV
  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Mobile", "Admin Status"];
    const csvRows = [
      headers.join(","),
      ...customers.map((c) =>
        [`"${c.firstName}"`, `"${c.lastName}"`, `"${c.mobile}"`, c.isAdmin ? "Yes" : "No"].join(",")
      ),
    ];
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // DataGrid columns
  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      sortable: true,
      minWidth: isMobile ? 100 : 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      sortable: true,
      minWidth: isMobile ? 100 : 150,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      sortable: true,
      minWidth: isMobile ? 120 : 150,
    },
    {
      field: "isAdmin",
      headerName: "Admin Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Admin" : "Customer"}
          color={params.value ? "error" : "success"}
          size={isMobile ? "small" : "medium"}
          sx={{ borderRadius: "8px" }}
        />
      ),
      sortable: true,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            size={isMobile ? "small" : "medium"}
            startIcon={<VisibilityIcon />}
            onClick={() => handleOpenDetails(params.row)}
            sx={{ borderRadius: "10px" }}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="error"
            size={isMobile ? "small" : "medium"}
            startIcon={<DeleteIcon />}
            onClick={() => handleOpenDeleteDialog(params.row)}
            sx={{ borderRadius: "10px" }}
          >
            Delete
          </Button>
        </Box>
      ),
      minWidth: isMobile ? 180 : 220,
    },
  ];

  // Theme configuration
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
            borderRadius: "20px",
            boxShadow: darkMode ? "0 10px 30px rgba(255,255,255,0.05)" : "0 10px 30px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: darkMode ? "0 14px 40px rgba(255,255,255,0.15)" : "0 14px 40px rgba(0,0,0,0.12)",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            backgroundColor: darkMode ? "#1e1e1e" : "#fff",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: darkMode ? "#2E7D32" : "#388E3C",
              color: "#212121", // Black header text
              fontWeight: "bold",
              borderBottom: `2px solid ${darkMode ? "#A5D6A7" : "#4CAF50"}`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${darkMode ? "#424242" : "#E0E0E0"}`,
              "&:hover": { backgroundColor: darkMode ? "#2E7D32" : "#F1F8E9" },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            padding: "10px 20px",
            "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
            transition: "all 0.3s ease",
            fontWeight: "medium",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: "8px", fontWeight: "medium", padding: "2px 8px" },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: { transition: "color 0.3s ease" },
          h4: { fontWeight: 700, letterSpacing: "0.5px" },
        },
      },
    },
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

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
          {/* Header with Breadcrumbs */}
          <Box sx={{ mb: { xs: 3, sm: 5 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 2,
              }}
            >
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "text.primary" }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "#212121" }}>
                Manage Customers
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportCSV}
                startIcon={<DownloadIcon />}
                disabled={customers.length === 0}
                sx={{ bgcolor: darkMode ? "#66BB6A" : "#388E3C", "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" } }}
              >
                Export CSV
              </Button>
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
                <PeopleIcon sx={{ mr: 0.5 }} fontSize="small" />
                Manage Customers
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Customers Table */}
          <Card sx={{ bgcolor: darkMode ? "#263238" : "#E8F5E9" }}>
            <CardContent>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress size={60} sx={{ color: "primary.main" }} />
                </Box>
              ) : customers.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
                    No customers found.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: "auto", width: "100%" }}>
                  <DataGrid
                    rows={customers}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 }, // 10 customers per page
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                    disableSelectionOnClick
                    sortingOrder={["asc", "desc"]}
                    sx={{ "& .MuiDataGrid-cell": { fontSize: isMobile ? "0.75rem" : "0.875rem" } }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Customer Details Dialog */}
          <Dialog
            open={openDetails}
            onClose={handleCloseDetails}
            maxWidth="sm"
            fullWidth
            sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}
          >
            <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>
              Customer Details
            </DialogTitle>
            <DialogContent dividers>
              {selectedCustomer && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>First Name:</strong> {selectedCustomer.firstName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Last Name:</strong> {selectedCustomer.lastName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Mobile:</strong> {selectedCustomer.mobile}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: "text.primary" }}>
                    <strong>Admin Status:</strong> {selectedCustomer.isAdmin ? "Admin" : "Customer"}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDetails}
                color="primary"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "#66BB6A" : "#388E3C",
                  color: darkMode ? "#66BB6A" : "#388E3C",
                  "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            maxWidth="xs"
            fullWidth
            sx={{ "& .MuiDialog-paper": { bgcolor: darkMode ? "#263238" : "#E8F5E9" } }}
          >
            <DialogTitle sx={{ bgcolor: darkMode ? "#2E7D32" : "#388E3C", color: "#fff" }}>
              Confirm Deletion
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Are you sure you want to delete{" "}
                <strong>
                  {customerToDelete?.firstName} {customerToDelete?.lastName}
                </strong>
                ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDeleteDialog}
                color="primary"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "#66BB6A" : "#388E3C",
                  color: darkMode ? "#66BB6A" : "#388E3C",
                  "&:hover": { borderColor: darkMode ? "#81C784" : "#4CAF50", color: darkMode ? "#81C784" : "#4CAF50" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCustomer}
                color="error"
                variant="contained"
                sx={{ bgcolor: "#D32F2F", "&:hover": { bgcolor: "#EF5350" } }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageCustomer;