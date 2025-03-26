// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Added useNavigate import
// import NavigationBar from "../components/Navbar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   InputAdornment,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LockIcon from "@mui/icons-material/Lock";
// import "./styles/RegistrationPage.css";

// const RegistrationPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     mobile: "",
//     securityQuestion: "",
//     securityAnswer: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); // Added useNavigate hook

//   const securityQuestions = [
//     "What is your mother's maiden name?",
//     "What was the name of your first pet?",
//     "What city were you born in?",
//     "What is your favorite book?",
//     "What was your childhood nickname?",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!/^\d{10}$/.test(formData.mobile)) {
//       setMessage("Mobile number must be 10 digits.");
//       return;
//     }
//     // Rest of the submit logic
  
//     setMessage("");
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/api/users/register", formData);
//       setMessage(`Success! Username: ${response.data.username}`);
//       setFormData({
//         firstName: "",
//         lastName: "",
//         mobile: "",
//         securityQuestion: "",
//         securityAnswer: "",
//       });
//     } catch (error) {
//       setMessage(error.response?.data?.error || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to login page
//   const handleLogin = () => {
//     navigate("/login");
//   };

//   // Theme configuration
//   const theme = createTheme({
//     palette: {
//       primary: { main: "#4CAF50" }, // Green for AgriHub
//       secondary: { main: "#FF5722" }, // Orange accent
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
//       MuiFormControl: {
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

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             pt: 8, // Adjust for navbar
//             px: 2,
//           }}
//         >
//           <Card sx={{ maxWidth: 550, width: "100%" }}>
//             <CardContent sx={{ p: 4 }}>
//               <Typography
//                 variant="h4"
//                 sx={{ textAlign: "center", color: "primary.main", mb: 1 }}
//               >
//                 Join AgriHub
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
//               >
//                 Create your account
//               </Typography>

//               <form onSubmit={handleSubmit}>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
//                   <TextField
//                     fullWidth
//                     label="First Name"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PersonIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Last Name"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PersonIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                   <TextField
//                     fullWidth
//                     label="Mobile"
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PhoneIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                   <FormControl fullWidth>
//                     <InputLabel>Security Question</InputLabel>
//                     <Select
//                       name="securityQuestion"
//                       value={formData.securityQuestion}
//                       onChange={handleChange}
//                       label="Security Question"
//                       required
//                     >
//                       <MenuItem value="">Select a question</MenuItem>
//                       {securityQuestions.map((question, index) => (
//                         <MenuItem key={index} value={question}>
//                           {question}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <TextField
//                     fullWidth
//                     label="Security Answer"
//                     name="securityAnswer"
//                     value={formData.securityAnswer}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <LockIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     disabled={loading}
//                     sx={{ py: 1.5, fontSize: "1.1rem" }}
//                   >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
//                   </Button>
//                 </Box>
//               </form>

//               {message && (
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: message.includes("Success") ? "success.main" : "secondary.main",
//                     textAlign: "center",
//                     mt: 2,
//                   }}
//                 >
//                   {message}
//                 </Typography>
//               )}

//               <Divider sx={{ my: 3 }} />

//               <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
//                 Already have an account?{" "}
//                 <Button
//                   onClick={handleLogin}
//                   sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}
//                 >
//                   Login
//                 </Button>
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default RegistrationPage;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import "./styles/RegistrationPage.css";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

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
      await axios.post("http://localhost:5000/api/users/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
      });
      setMessage("OTP sent to your mobile.");
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users/verify-register-otp", {
        mobile: formData.mobile,
        otp: formData.otp,
      });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 8, px: 2 }}>
          <Card sx={{ maxWidth: 550, width: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ textAlign: "center", color: "primary.main", mb: 1 }}>
                Join AgriHub
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
                Create your account
              </Typography>

              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
                    />
                    <TextField
                      fullWidth
                      label="Mobile"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "primary.main" }} /></InputAdornment> }}
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
                  </Box>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      required
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
                  </Box>
                </form>
              )}

              {message && (
                <Typography
                  variant="body2"
                  sx={{ color: message.includes("successful") ? "success.main" : "secondary.main", textAlign: "center", mt: 2 }}
                >
                  {message}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                Already have an account?{" "}
                <Button onClick={handleLogin} sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}>
                  Login
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RegistrationPage;