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
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;


app.use(cors());


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


io.on("connection", (socket) => {
  console.log("New client connected");


  const interval = setInterval(async () => {
    const cryptoData = await fetchCryptoData();
    if (cryptoData) {
      socket.emit("cryptoUpdate", cryptoData);
    }
  }, 10000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


app.get("/", (req, res) => {
  res.send("Crypto Notifications Backend is running.");
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
