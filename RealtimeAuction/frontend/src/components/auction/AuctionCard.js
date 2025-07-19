import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const AuctionCard = ({ auction }) => {
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });

  return (
    <Link to={`/auctions/${auction._id}`} className="auction-card">
      <img src={auction.imageUrl} alt={auction.title} className="auction-card-image" />
      <div className="auction-card-content">
        <h3>{auction.title}</h3>
        <p className="seller">Sold by: {auction.seller.username}</p>
        <div className="auction-card-details">
          <div>
            <p>Current Bid</p>
            <p className="price">₹{auction.currentBid}</p>
          </div>
          <div className="time">
            <p>Ends</p>
            <p>{timeLeft}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;