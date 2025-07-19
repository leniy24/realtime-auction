import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaClock, FaUser } from 'react-icons/fa';

const AuctionCard = ({ auction }) => {
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });

  return (
    <Link to={`/auctions/${auction._id}`} className="auction-card">
      <div className="auction-image">
        <img 
          src={auction.imageUrl} 
          alt={auction.title} 
          alt={auction.title}
        />
      </div>
      <div className="auction-content">
        <h3 className="auction-title">{auction.title}</h3>
        <div className="auction-seller">
          <FaUser className="mr-2" />
          <span>Sold by: {auction.seller.username}</span>
        </div>
        <div className="auction-footer">
          <div className="bid-info">
            <p className="bid-label">Current Bid</p>
            <p className="bid-amount">₹{auction.currentBid.toLocaleString()}</p>
          </div>
          <div className="time-info">
            <div className="time-left">
              <FaClock className="mr-1" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;