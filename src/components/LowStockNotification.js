  import { useState, useEffect } from "react";
  import axios from "axios";
  import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Button,
  } from "@mui/material";
  import { jsPDF } from "jspdf";
  
  const LowStockNotification = ({ darkMode, onLowStockCountUpdate }) => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
  
    // Fetch low stock products on mount
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/product/low-stock", { withCredentials: true })
        .then((res) => {
          const lowStockItems = res.data
            .flatMap((product) =>
              product.variants.flatMap((variant) =>
                variant.batches
                  .filter((batch) => batch.stock < 10)
                  .map((batch) => ({
                    productId: product._id,
                    name: product.name,
                    size: variant.size,
                    batchNumber: batch.batchNumber,
                    stock: batch.stock,
                  }))
              )
            )
            .sort((a, b) => a.stock - b.stock);
  
          setLowStockProducts(lowStockItems);
          if (onLowStockCountUpdate) {
            onLowStockCountUpdate(lowStockItems.length); // Update count in parent
          }
        })
        .catch((err) => {
          console.error("Error fetching low stock products:", err);
          if (onLowStockCountUpdate) {
            onLowStockCountUpdate(0); // Reset count on error
          }
        });
    }, [onLowStockCountUpdate]);
  
    // Calculate paginated items
    const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);
    const paginatedItems = lowStockProducts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  
    // Generate PDF report for all low stock products with batch details
    const generateReport = () => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Low Stock Report", 20, 20);
      doc.setFontSize(12);
      doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 30);
  
      let yPos = 50;
      lowStockProducts.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.name} (Size: ${item.size}, Batch: ${
            item.batchNumber
          }) - Stock: ${item.stock}`,
          20,
          yPos
        );
        yPos += 10;
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
  
      doc.save("low-stock-report.pdf");
    };
  
    return (
      <Box>
        {lowStockProducts.length > 0 ? (
          <Box
            sx={{
              p: 2,
              bgcolor: darkMode ? "#263238" : "#E8F5E9",
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: darkMode ? "#E0E0E0" : "#212121" }}
            >
              ⚠️ Low Stock Alert ({lowStockProducts.length} items)
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: darkMode ? "#FFF" : "#212121",
                        bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: darkMode ? "#FFF" : "#212121",
                        bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      }}
                    >
                      Size
                    </TableCell>
                    <TableCell
                      sx={{
                        color: darkMode ? "#FFF" : "#212121",
                        bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      }}
                    >
                      Batch Number
                    </TableCell>
                    <TableCell
                      sx={{
                        color: darkMode ? "#FFF" : "#212121",
                        bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      }}
                      align="right"
                    >
                      Stock
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow
                      key={`${item.productId}-${item.size}-${item.batchNumber}`}
                      sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}
                    >
                      <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
                        {item.size}
                      </TableCell>
                      <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
                        {item.batchNumber}
                      </TableCell>
                      <TableCell
                        sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}
                        align="right"
                      >
                        {item.stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: darkMode ? "#E0E0E0" : "#212121",
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={generateReport}
                sx={{
                  bgcolor: darkMode ? "#66BB6A" : "#388E3C",
                  "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" },
                }}
              >
                Generate Report
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
            No low stock products at this time.
          </Typography>
        )}
      </Box>
    );
  };
  
  export default LowStockNotification;