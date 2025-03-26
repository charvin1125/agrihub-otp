// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import NavigationBar from "../components/Navbar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   CircularProgress,
//   Divider,
//   Card,
//   CardContent,
//   InputAdornment,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import PersonIcon from "@mui/icons-material/Person";
// import LockIcon from "@mui/icons-material/Lock";
// import PhoneIcon from "@mui/icons-material/Phone";
// import "./styles/LoginPage.css";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [forgotOpen, setForgotOpen] = useState(false);
//   const [forgotData, setForgotData] = useState({
//     mobile: "",
//     securityQuestion: "",
//     securityAnswer: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [forgotMessage, setForgotMessage] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const navigate = useNavigate();

//   const securityQuestions = [
//     "What is your mother's maiden name?",
//     "What was the name of your first pet?",
//     "What city were you born in?",
//     "What is your favorite book?",
//     "What was your childhood nickname?",
//   ];

//   // Check if the user is already logged in
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/users/profile", { withCredentials: true })
//       .then((response) => {
//         if (response.data) {
//           navigate(response.data.isAdmin ? "/admin-dashboard" : "/profile");
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/users/login", formData, { withCredentials: true });
//       const response = await axios.get("http://localhost:5000/api/users/profile", { withCredentials: true });

//       if (response.data.isAdmin) {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/profile");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotChange = (e) => {
//     const { name, value } = e.target;
//     setForgotData({ ...forgotData, [name]: value });
//   };

//   const handleForgotSubmit = async (e) => {
//     e.preventDefault();
//     setForgotMessage("");
//     setForgotLoading(true);

//     if (forgotData.newPassword !== forgotData.confirmPassword) {
//       setForgotMessage("New password and confirm password do not match.");
//       setForgotLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/users/forgot-password", forgotData);
//       setForgotMessage(response.data.message || "Password reset successful! Please login.");
//       setForgotData({
//         mobile: "",
//         securityQuestion: "",
//         securityAnswer: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setForgotOpen(false);
//     } catch (error) {
//       setForgotMessage(error.response?.data?.error || "Failed to reset password.");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // Navigate to registration page
//   const handleSignUp = () => {
//     navigate("/register");
//   };

//   // Theme configuration
//   const theme = createTheme({
//     palette: {
//       primary: { main: "#4CAF50" },
//       secondary: { main: "#FF5722" },
//       background: { default: "#F5F7FA" },
//     },
//     typography: {
//       fontFamily: "'Roboto', sans-serif",
//       h4: { fontWeight: 700 },
//       body1: { fontSize: "1rem" },
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "16px",
//             boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
//             background: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "8px",
//             textTransform: "none",
//             padding: "12px 24px",
//             "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               "&:hover fieldset": { borderColor: "#4CAF50" },
//               "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           bgcolor: "background.default",
//         }}
//       >
//         <CircularProgress size={60} sx={{ color: "primary.main" }} />
//         <Typography sx={{ ml: 2, color: "text.secondary" }}>Checking session...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             pt: 8,
//             px: 2,
//           }}
//         >
//           <Card sx={{ maxWidth: 450, width: "100%" }}>
//             <CardContent sx={{ p: 4 }}>
//               <Typography variant="h4" sx={{ textAlign: "center", color: "primary.main", mb: 1 }}>
//                 Welcome Back
//               </Typography>
//               <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
//                 Login to AgriHub
//               </Typography>

//               <form onSubmit={handleSubmit}>
//                 <TextField
//                   fullWidth
//                   label="Username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   variant="outlined"
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PersonIcon sx={{ color: "primary.main" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ mb: 3 }}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   variant="outlined"
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockIcon sx={{ color: "primary.main" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ mb: 3 }}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   disabled={loading}
//                   sx={{ py: 1.5, fontSize: "1.1rem" }}
//                 >
//                   {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
//                 </Button>
//               </form>

//               {message && (
//                 <Typography
//                   variant="body2"
//                   sx={{ color: "secondary.main", textAlign: "center", mt: 2 }}
//                 >
//                   {message}
//                 </Typography>
//               )}

//               <Divider sx={{ my: 3 }} />

//               <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
//                 <Button
//                   onClick={() => setForgotOpen(true)}
//                   sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}
//                 >
//                   Forgot Password?
//                 </Button>{" "}
//                 | Don’t have an account?{" "}
//                 <Button
//                   onClick={handleSignUp}
//                   sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}
//                 >
//                   Sign up
//                 </Button>
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>

//         {/* Forgot Password Dialog */}
//         <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="sm" fullWidth>
//           <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
//             Forgot Password
//           </DialogTitle>
//           <DialogContent sx={{ pt: 2 }}>
//             <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
//               Verify your identity to reset your password.
//             </Typography>
//             <TextField
//               fullWidth
//               label="Mobile Number"
//               name="mobile"
//               value={forgotData.mobile}
//               onChange={handleForgotChange}
//               variant="outlined"
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PhoneIcon sx={{ color: "primary.main" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 2 }}
//             />
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel>Security Question</InputLabel>
//               <Select
//                 name="securityQuestion"
//                 value={forgotData.securityQuestion}
//                 onChange={handleForgotChange}
//                 label="Security Question"
//                 required
//               >
//                 <MenuItem value="">Select a question</MenuItem>
//                 {securityQuestions.map((question, index) => (
//                   <MenuItem key={index} value={question}>
//                     {question}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               fullWidth
//               label="Security Answer"
//               name="securityAnswer"
//               value={forgotData.securityAnswer}
//               onChange={handleForgotChange}
//               variant="outlined"
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="New Password"
//               name="newPassword"
//               type="password"
//               value={forgotData.newPassword}
//               onChange={handleForgotChange}
//               variant="outlined"
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="Confirm New Password"
//               name="confirmPassword"
//               type="password"
//               value={forgotData.confirmPassword}
//               onChange={handleForgotChange}
//               variant="outlined"
//               required
//               sx={{ mb: 2 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={handleForgotSubmit}
//               disabled={forgotLoading}
//               sx={{ py: 1.5 }}
//             >
//               {forgotLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
//             </Button>
//             {forgotMessage && (
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: forgotMessage.includes("successful") ? "success.main" : "secondary.main",
//                   textAlign: "center",
//                   mt: 2,
//                 }}
//               >
//                 {forgotMessage}
//               </Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setForgotOpen(false)} color="secondary">
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhoneIcon from "@mui/icons-material/Phone";
import "./styles/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ mobile: "", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/profile", { withCredentials: true })
      .then((response) => {
        if (response.data) {
          navigate(response.data.isAdmin ? "/admin-dashboard" : "/profile");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobile)) {
      setMessage("Mobile number must be 10 digits.");
      return;
    }

    setMessage("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/login", { mobile: formData.mobile }, { withCredentials: true });
      setMessage("OTP sent to your mobile.");
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-login-otp",
        { mobile: formData.mobile, otp: formData.otp },
        { withCredentials: true }
      );
      navigate(response.data.user.isAdmin ? "/admin-dashboard" : "/profile");
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const theme = createTheme({
    palette: { primary: { main: "#4CAF50" }, secondary: { main: "#FF5722" }, background: { default: "#F5F7FA" } },
    typography: { fontFamily: "'Roboto', sans-serif", h4: { fontWeight: 700 } },
    components: {
      MuiCard: { styleOverrides: { root: { borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" } } },
      MuiButton: { styleOverrides: { root: { borderRadius: "8px", textTransform: "none", padding: "12px 24px" } } },
      MuiTextField: { styleOverrides: { root: { "& .MuiOutlinedInput-root": { borderRadius: "8px" } } } },
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
        <Typography sx={{ ml: 2, color: "text.secondary" }}>Checking session...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 8, px: 2 }}>
          <Card sx={{ maxWidth: 450, width: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ textAlign: "center", color: "primary.main", mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
                Login to AgriHub
              </Typography>

              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                  </Button>
                </form>
              )}

              {message && (
                <Typography variant="body2" sx={{ color: "secondary.main", textAlign: "center", mt: 2 }}>
                  {message}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                Don’t have an account?{" "}
                <Button onClick={handleSignUp} sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}>
                  Sign up
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;