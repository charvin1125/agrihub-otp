// // import { Link } from "react-router-dom";

// // const OrderSuccess = () => {
// //   return (
// //     <div className="container text-center mt-5">
// //       <h2 className="text-success">Order Placed Successfully!</h2>
// //       <p>Your order has been placed. We will contact you soon.</p>
// //       <Link to="/" className="btn btn-primary">Back to Home</Link>
// //     </div>
// //   );
// // };

// // export default OrderSuccess;
// import { Link as RouterLink } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   Box,
//   Grow,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { styled } from "@mui/material/styles";

// // Custom styled components
// const StyledCard = styled(Card)(({ theme }) => ({
//   maxWidth: 500,
//   margin: "0 auto",
//   borderRadius: 16,
//   boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//   background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: 25,
//   padding: "10px 30px",
//   background: "linear-gradient(45deg, #28a745, #20c997)",
//   "&:hover": {
//     background: "linear-gradient(45deg, #218838, #1abc9c)",
//     transform: "scale(1.05)",
//     boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
//   },
//   transition: "all 0.3s ease-in-out",
// }));

// const OrderSuccess = () => {
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const childVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 5,
//         background: "#f5f5f5",
//       }}
//     >
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <Grow in={true} timeout={800}>
//           <StyledCard>
//             <CardContent sx={{ p: 5, textAlign: "center" }}>
//               {/* Success Icon */}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 260, damping: 20 }}
//               >
//                 <CheckCircleOutlineIcon
//                   sx={{ fontSize: 80, color: "#28a745", mb: 3 }}
//                 />
//               </motion.div>

//               <motion.div variants={childVariants}>
//                 <Typography
//                   variant="h4"
//                   component="h2"
//                   color="success.main"
//                   gutterBottom
//                   sx={{ fontWeight: 600 }}
//                 >
//                   Order Placed Successfully!
//                 </Typography>
//               </motion.div>

//               <motion.div variants={childVariants}>
//                 <Typography
//                   variant="body1"
//                   color="text.secondary"
//                   sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
//                 >
//                   Your order has been successfully placed. Our team will contact
//                   you soon with further details. Thank you for choosing My Agrihub!
//                 </Typography>
//               </motion.div>

//               <motion.div variants={childVariants}>
//                 <StyledButton
//                   component={RouterLink}
//                   to="/"
//                   variant="contained"
//                   size="large"
//                   sx={{ color: "white" }}
//                 >
//                   Back to Home
//                 </StyledButton>
//               </motion.div>
//             </CardContent>
//           </StyledCard>
//         </Grow>
//       </motion.div>

//       {/* Optional confetti effect */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           overflow: "hidden",
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       >
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             style={{
//               position: "absolute",
//               width: 8,
//               height: 8,
//               backgroundColor: "#28a745",
//               borderRadius: "50%",
//               left: `${Math.random() * 100}%`,
//               top: "-10px",
//             }}
//             animate={{
//               y: "100vh",
//               rotate: Math.random() * 360,
//             }}
//             transition={{
//               duration: Math.random() * 2 + 2,
//               repeat: Infinity,
//               delay: Math.random() * 2,
//             }}
//           />
//         ))}
//       </Box>
//     </Container>
//   );
// };

// export default OrderSuccess;
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const theme = createTheme({
  palette: {
    primary: { main: "#2E7D32" },
    secondary: { main: "#81C784" },
    background: { default: "#F7F9F7", paper: "#FFFFFF" },
    text: { primary: "#1A1A1A", secondary: "#616161" },
  },
  typography: { fontFamily: "'Winky Sans', sans-serif" },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F7F9F7 100%)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1.1rem",
          padding: "12px 28px",
          background: "linear-gradient(45deg, #2E7D32, #81C784)",
          "&:hover": {
            background: "linear-gradient(45deg, #1B5E20, #66BB6A)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          },
          transition: "all 0.3s ease",
        },
      },
    },
  },
});

const OrderSuccess = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const rippleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 2, opacity: 0.3, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [1, 0],
      scale: [0, 1],
      x: () => Math.random() * 200 - 100,
      y: () => Math.random() * 200 - 100,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 5,
          bgcolor: "background.default",
        }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Card sx={{ maxWidth: 600 }}>
            <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: "center" }}>
              <Box sx={{ position: "relative", mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "primary.main" }} />
                </motion.div>
                <motion.div
                  variants={rippleVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "#81C784",
                    transform: "translate(-50%, -50%)",
                    zIndex: -1,
                  }}
                />
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={particleVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      backgroundColor: "#2E7D32",
                      borderRadius: "50%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </Box>

              <motion.div variants={childVariants}>
                <Typography
                  variant="h3"
                  component="h2"
                  color="primary.main"
                  gutterBottom
                  sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}
                >
                  Order Confirmed!
                </Typography>
              </motion.div>

              <motion.div variants={childVariants}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 5, maxWidth: 450, mx: "auto", fontSize: { xs: "1rem", sm: "1.1rem" } }}
                >
                  Your order has been successfully placed. Our team will reach out soon with further details. Thank you for shopping with AgriHub!
                </Typography>
              </motion.div>

              <motion.div variants={childVariants}>
                <Button
                  component={RouterLink}
                  to="/"
                  variant="contained"
                  size="large"
                  sx={{ color: "#FFFFFF" }}
                >
                  Return to Home
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default OrderSuccess;