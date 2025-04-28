const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');

// App setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins, or specify your frontend domain
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());

// Route for health check
app.get('/', (req, res) => {
  res.send('Crypto Notification Server is running 🚀');
});

// Fetch crypto prices
const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum',
          vs_currencies: 'usd'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error.message);
    return null;
  }
};

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected! 🔥');

  const sendUpdates = async () => {
    const data = await fetchCryptoPrices();
    if (data) {
      socket.emit('cryptoUpdate', data);
    }
  };

  // Send updates every 10 seconds
  const interval = setInterval(sendUpdates, 10000);

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected ❌');
    clearInterval(interval);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
