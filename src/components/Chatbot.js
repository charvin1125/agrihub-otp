// import React, { useState } from "react";
// import { Box, TextField, Button, Typography, Paper } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import axios from "axios";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   // Function to send message to Ollama API
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message to chat
//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       // Send request to Ollama API
//       const response = await axios.post("http://localhost:11434/api/generate", {
//         model: "tinyllama", // Use tinyllama instead of llama2
//         prompt: input,
//         stream: false,
//       });
      

//       // Add bot response to chat
//       const botMessage = { sender: "bot", text: response.data.response };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Error communicating with Ollama:", error);
//       const errorMessage = { sender: "bot", text: "Sorry, something went wrong. Try again later." };
//       setMessages((prev) => [...prev, errorMessage]);
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         position: "fixed",
//         bottom: "80px",
//         right: "20px",
//         width: { xs: "90%", sm: "400px" },
//         height: "500px",
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "#fff",
//         borderRadius: "12px",
//         overflow: "hidden",
//       }}
//     >
//       {/* Chat Header */}
//       <Box sx={{ bgcolor: "#4CAF50", p: 2, color: "white" }}>
//         <Typography variant="h6">AgriBot</Typography>
//       </Box>

//       {/* Chat Messages */}
//       <Box
//         sx={{
//           flex: 1,
//           p: 2,
//           overflowY: "auto",
//           bgcolor: "#f5f5f5",
//         }}
//       >
//         {messages.map((msg, index) => (
//           <Box
//             key={index}
//             sx={{
//               mb: 2,
//               textAlign: msg.sender === "user" ? "right" : "left",
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{
//                 display: "inline-block",
//                 p: 1,
//                 bgcolor: msg.sender === "user" ? "#388E3C" : "#E8F5E9",
//                 color: msg.sender === "user" ? "white" : "text.primary",
//                 borderRadius: "8px",
//                 maxWidth: "70%",
//               }}
//             >
//               {msg.text}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       {/* Input Area */}
//       <Box sx={{ p: 2, display: "flex", alignItems: "center", borderTop: "1px solid #ddd" }}>
//         <TextField
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask AgriBot anything..."
//           variant="outlined"
//           size="small"
//           fullWidth
//           sx={{ mr: 1 }}
//         />
//         <Button
//           onClick={sendMessage}
//           variant="contained"
//           sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45a049" } }}
//         >
//           <SendIcon />
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default Chatbot;
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API Key
const API_KEY = "AIzaSyCjjzn3M43vON3dQOuHF7ZlmTvYsRHiemA";
const genAI = new GoogleGenerativeAI(API_KEY);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat(); // Use chat for better interaction
      const result = await chat.sendMessage(input);
      const textResponse = result.response.text();

      setMessages((prev) => [...prev, { sender: "bot", text: textResponse }]);
    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Try again later." },
      ]);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: { xs: "90%", sm: "400px" },
        height: "500px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ bgcolor: "#4CAF50", p: 2, color: "white" }}>
        <Typography variant="h6">AgriBot (Powered by Gemini AI)</Typography>
      </Box>

      <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f5f5f5" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "inline-block",
                p: 1,
                bgcolor: msg.sender === "user" ? "#388E3C" : "#E8F5E9",
                color: msg.sender === "user" ? "white" : "text.primary",
                borderRadius: "8px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, display: "flex", alignItems: "center", borderTop: "1px solid #ddd" }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AgriBot anything..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mr: 1 }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45a049" } }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatbot;
