require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const Auction = require('./models/Auction');

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auctions', require('./routes/auctions'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// WebSocket Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined auction room ${auctionId}`);
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
    console.log(`User ${socket.id} left auction room ${auctionId}`);
  });

  socket.on('placeBid', async ({ auctionId, bidAmount, userId }) => {
    try {
      const auction = await Auction.findById(auctionId);
      if (!auction || auction.isFinished) {
        return socket.emit('error', { message: 'Auction has ended or does not exist.' });
      }
      if (bidAmount <= auction.currentBid) {
        return socket.emit('error', { message: 'Bid must be higher than the current bid.' });
      }

      auction.currentBid = bidAmount;
      auction.highestBidder = userId;
      await auction.save();

      const updatedAuction = await Auction.findById(auctionId)
        .populate('highestBidder', 'username');
      
      io.to(auctionId).emit('bidUpdate', updatedAuction);

    } catch (error) {
      console.error('Error placing bid:', error);
      socket.emit('error', { message: 'An error occurred while placing the bid.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setInterval(async () => {
  const now = new Date();
  const auctions = await Auction.find({ endTime: { $lte: now }, isFinished: false });
  for (const auction of auctions) {
    auction.isFinished = true;
    await auction.save();
    io.emit('auctionEnded', { auctionId: auction._id, winner: auction.highestBidder });
  }
}, 10000);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));