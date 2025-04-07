  // import { useState, useEffect } from "react";
  // import axios from "axios";
  // import {
  //   Box,
  //   Typography,
  //   Table,
  //   TableBody,
  //   TableCell,
  //   TableContainer,
  //   TableHead,
  //   TableRow,
  //   Paper,
  //   Pagination,
  //   Button,
  // } from "@mui/material";
  // import { jsPDF } from "jspdf";
  
  // const LowStockNotification = ({ darkMode, onLowStockCountUpdate }) => {
  //   const [lowStockProducts, setLowStockProducts] = useState([]);
  //   const [page, setPage] = useState(1);
  //   const itemsPerPage = 5;
  
  //   // Fetch low stock products on mount
  //   useEffect(() => {
  //     axios
  //       .get("http://localhost:5000/api/product/low-stock", { withCredentials: true })
  //       .then((res) => {
  //         const lowStockItems = res.data
  //           .flatMap((product) =>
  //             product.variants.flatMap((variant) =>
  //               variant.batches
  //                 .filter((batch) => batch.stock < 10)
  //                 .map((batch) => ({
  //                   productId: product._id,
  //                   name: product.name,
  //                   size: variant.size,
  //                   batchNumber: batch.batchNumber,
  //                   stock: batch.stock,
  //                 }))
  //             )
  //           )
  //           .sort((a, b) => a.stock - b.stock);
  
  //         setLowStockProducts(lowStockItems);
  //         if (onLowStockCountUpdate) {
  //           onLowStockCountUpdate(lowStockItems.length); // Update count in parent
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching low stock products:", err);
  //         if (onLowStockCountUpdate) {
  //           onLowStockCountUpdate(0); // Reset count on error
  //         }
  //       });
  //   }, [onLowStockCountUpdate]);
  
  //   // Calculate paginated items
  //   const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);
  //   const paginatedItems = lowStockProducts.slice(
  //     (page - 1) * itemsPerPage,
  //     page * itemsPerPage
  //   );
  
  //   // Generate PDF report for all low stock products with batch details
  //   const generateReport = () => {
  //     const doc = new jsPDF();
  //     doc.setFontSize(18);
  //     doc.text("Low Stock Report", 20, 20);
  //     doc.setFontSize(12);
  //     doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 30);
  
  //     let yPos = 50;
  //     lowStockProducts.forEach((item, index) => {
  //       doc.text(
  //         `${index + 1}. ${item.name} (Size: ${item.size}, Batch: ${
  //           item.batchNumber
  //         }) - Stock: ${item.stock}`,
  //         20,
  //         yPos
  //       );
  //       yPos += 10;
  //       if (yPos > 280) {
  //         doc.addPage();
  //         yPos = 20;
  //       }
  //     });
  
  //     doc.save("low-stock-report.pdf");
  //   };
  
  //   return (
  //     <Box>
  //       {lowStockProducts.length > 0 ? (
  //         <Box
  //           sx={{
  //             p: 2,
  //             bgcolor: darkMode ? "#263238" : "#E8F5E9",
  //             borderRadius: "12px",
  //           }}
  //         >
  //           <Typography
  //             variant="h6"
  //             sx={{ mb: 2, color: darkMode ? "#E0E0E0" : "#212121" }}
  //           >
  //             ⚠️ Low Stock Alert ({lowStockProducts.length} items)
  //           </Typography>
  //           <TableContainer
  //             component={Paper}
  //             sx={{ bgcolor: darkMode ? "#1e1e1e" : "#fff" }}
  //           >
  //             <Table>
  //               <TableHead>
  //                 <TableRow>
  //                   <TableCell
  //                     sx={{
  //                       color: darkMode ? "#FFF" : "#212121",
  //                       bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
  //                     }}
  //                   >
  //                     Product Name
  //                   </TableCell>
  //                   <TableCell
  //                     sx={{
  //                       color: darkMode ? "#FFF" : "#212121",
  //                       bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
  //                     }}
  //                   >
  //                     Size
  //                   </TableCell>
  //                   <TableCell
  //                     sx={{
  //                       color: darkMode ? "#FFF" : "#212121",
  //                       bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
  //                     }}
  //                   >
  //                     Batch Number
  //                   </TableCell>
  //                   <TableCell
  //                     sx={{
  //                       color: darkMode ? "#FFF" : "#212121",
  //                       bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
  //                     }}
  //                     align="right"
  //                   >
  //                     Stock
  //                   </TableCell>
  //                 </TableRow>
  //               </TableHead>
  //               <TableBody>
  //                 {paginatedItems.map((item) => (
  //                   <TableRow
  //                     key={`${item.productId}-${item.size}-${item.batchNumber}`}
  //                     sx={{ "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#f5f5f5" } }}
  //                   >
  //                     <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
  //                       {item.name}
  //                     </TableCell>
  //                     <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
  //                       {item.size}
  //                     </TableCell>
  //                     <TableCell sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
  //                       {item.batchNumber}
  //                     </TableCell>
  //                     <TableCell
  //                       sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}
  //                       align="right"
  //                     >
  //                       {item.stock}
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
  //             <Pagination
  //               count={totalPages}
  //               page={page}
  //               onChange={(e, value) => setPage(value)}
  //               color="primary"
  //               sx={{
  //                 "& .MuiPaginationItem-root": {
  //                   color: darkMode ? "#E0E0E0" : "#212121",
  //                 },
  //               }}
  //             />
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               onClick={generateReport}
  //               sx={{
  //                 bgcolor: darkMode ? "#66BB6A" : "#388E3C",
  //                 "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" },
  //               }}
  //             >
  //               Generate Report
  //             </Button>
  //           </Box>
  //         </Box>
  //       ) : (
  //         <Typography sx={{ color: darkMode ? "#E0E0E0" : "#212121" }}>
  //           No low stock products at this time.
  //         </Typography>
  //       )}
  //     </Box>
  //   );
  // };
  
  // export default LowStockNotification;
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
import autoTable from "jspdf-autotable";

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

  // Generate improved PDF report using autoTable
  const generateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(darkMode ? "#66BB6A" : "#388E3C");
    doc.text("Low Stock Report - AgriHub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Low Stock Items: ${lowStockProducts.length}`, 14, 40);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [["Product Name", "Size", "Batch Number", "Stock"]],
      body: lowStockProducts.map((item) => [
        item.name,
        item.size,
        item.batchNumber,
        item.stock,
      ]),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: darkMode ? [224, 224, 224] : [33, 33, 33], // Match UI text color
      },
      headStyles: {
        fillColor: darkMode ? [102, 187, 106] : [56, 142, 60], // Green header
        textColor: [33, 33, 33], // Black text
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: darkMode ? [46, 46, 46] : [245, 245, 245], // Subtle row alternation
      },
      margin: { top: 50 },
    });

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save("low-stock-report.pdf");
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Product Name", "Size", "Batch Number", "Stock"];
    const csvRows = [
      headers.join(","),
      ...lowStockProducts.map((item) =>
        [`"${item.name}"`, `"${item.size}"`, `"${item.batchNumber}"`, item.stock].join(",")
      ),
    ];
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "low-stock-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
                      fontWeight: "bold",
                    }}
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#FFF" : "#212121",
                      bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      fontWeight: "bold",
                    }}
                  >
                    Size
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#FFF" : "#212121",
                      bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      fontWeight: "bold",
                    }}
                  >
                    Batch Number
                  </TableCell>
                  <TableCell
                    sx={{
                      color: darkMode ? "#FFF" : "#212121",
                      bgcolor: darkMode ? "#388E3C" : "#A5D6A7",
                      fontWeight: "bold",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateReport}
                sx={{
                  bgcolor: darkMode ? "#66BB6A" : "#388E3C",
                  "&:hover": { bgcolor: darkMode ? "#81C784" : "#4CAF50" },
                }}
              >
                Generate PDF Report
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={exportToCSV}
                sx={{
                  borderColor: darkMode ? "#66BB6A" : "#388E3C",
                  color: darkMode ? "#66BB6A" : "#388E3C",
                  "&:hover": {
                    borderColor: darkMode ? "#81C784" : "#4CAF50",
                    bgcolor: darkMode ? "rgba(129, 199, 132, 0.1)" : "rgba(76, 175, 80, 0.1)",
                  },
                }}
              >
                Export to CSV
              </Button>
            </Box>
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