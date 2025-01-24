const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
  },
});

const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Function to fetch cryptocurrency data
const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
    return null;
  }
};

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send crypto data every 10 seconds
  const interval = setInterval(async () => {
    const cryptoData = await fetchCryptoData();
    if (cryptoData) {
      socket.emit("cryptoUpdate", cryptoData);
    }
  }, 10000);

  // Clean up on disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Crypto Notifications Backend is running.");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
