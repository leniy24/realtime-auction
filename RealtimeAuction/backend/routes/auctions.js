const express = require('express');
const router = express.Router();
const { getAuctions, getAuctionById, createAuction } = require('../controllers/auctionController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/auctions
// @desc    Get all active auctions
// @access  Public
router.get('/', getAuctions);

// @route   GET api/auctions/:id
// @desc    Get a single auction by ID
// @access  Public
router.get('/:id', getAuctionById);

// @route   POST api/auctions
// @desc    Create a new auction item
// @access  Private (requires login)
router.post('/', authMiddleware, createAuction);

module.exports = router;