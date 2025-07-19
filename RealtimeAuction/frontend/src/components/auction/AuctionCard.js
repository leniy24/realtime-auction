import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaClock, FaUser } from 'react-icons/fa';

const AuctionCard = ({ auction }) => {
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });

  return (
    <Link to={`/auctions/${auction._id}`} className="card group">
      <div className="relative overflow-hidden">
        <img 
          src={auction.imageUrl} 
          alt={auction.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{auction.title}</h3>
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <FaUser className="mr-2" />
          <span>Sold by: {auction.seller.username}</span>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-gray-400 text-sm">Current Bid</p>
            <p className="text-2xl font-bold text-primary-400">₹{auction.currentBid.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-red-400 text-sm">
              <FaClock className="mr-1" />
              <span className="font-semibold">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;