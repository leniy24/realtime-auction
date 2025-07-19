const Auction = require('../models/Auction');

// GET all active auctions
exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ isFinished: false })
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .sort({ endTime: 1 });
    res.json(auctions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET a single auction by its ID
exports.getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate('seller', 'username')
            .populate('highestBidder', 'username');
        if (!auction) {
            return res.status(404).json({ msg: 'Auction not found' });
        }
        res.json(auction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// CREATE a new auction
exports.createAuction = async (req, res) => {
  const { title, description, startingBid, endTime, imageUrl } = req.body;

  // Basic validation
  if (!title || !description || !startingBid || !endTime || !imageUrl) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const newAuction = new Auction({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      endTime,
      imageUrl,
      seller: req.user.id // From authMiddleware
    });

    const auction = await newAuction.save();
    res.json(auction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};