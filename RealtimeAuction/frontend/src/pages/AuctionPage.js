import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import io from 'socket.io-client';
import { FaUser, FaClock, FaGavel, FaTrophy, FaArrowLeft } from 'react-icons/fa';

const socket = io('http://localhost:4000');

const AuctionPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (auction) {
      const difference = +new Date(auction.endTime) - +new Date();
      if (difference > 0) {
        const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Auction Ended');
      }
    }
  }, [auction]);

  useEffect(() => {
    api.get(`/auctions/${id}`).then(res => setAuction(res.data)).catch(() => setError('Auction not found.'));
    
    socket.emit('joinAuction', id);
    socket.on('bidUpdate', (updatedAuction) => (updatedAuction._id === id) && setAuction(updatedAuction));
    socket.on('error', (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    });

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      socket.emit('leaveAuction', id);
      socket.off('bidUpdate');
      socket.off('error');
      clearInterval(timer);
    };
  }, [id, calculateTimeLeft]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (!user) return setError('You must be logged in to place a bid.');
    if (!bidAmount || parseInt(bidAmount, 10) <= auction.currentBid) return setError('Your bid must be higher than the current bid.');
    
    setLoading(true);
    socket.emit('placeBid', { auctionId: id, bidAmount: parseInt(bidAmount, 10), userId: user._id });
    setBidAmount('');
    setError('');
    setLoading(false);
  };

  if (!auction) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading auction...</p>
      </div>
    </div>
  );

  const isAuctionOver = new Date(auction.endTime) < new Date();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft />
          <span>Back to Auctions</span>
        </Link>
        
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative">
              <img 
                src={auction.imageUrl} 
                alt={auction.title} 
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
            </div>
            
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-4">{auction.title}</h1>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaUser className="mr-2" />
                  <span>Sold by: <span className="text-primary-400 font-semibold">{auction.seller?.username || 'Unknown'}</span></span>
                </div>
                <p className="text-gray-300 leading-relaxed">{auction.description}</p>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-600">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Bid</p>
                    <p className="text-3xl font-bold text-primary-400">₹{auction.currentBid.toLocaleString()}</p>
                    {auction.highestBidder && (
                      <p className="text-sm text-gray-500 mt-1">
                        by {auction.highestBidder.username}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Time Left</p>
                    <div className="flex items-center justify-end space-x-2">
                      <FaClock className={`${isAuctionOver ? 'text-red-400' : 'text-yellow-400'}`} />
                      <p className={`text-xl font-bold ${isAuctionOver ? 'text-red-400' : 'text-yellow-400'}`}>
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {!isAuctionOver ? (
                <div>
                  {!user && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                      <p className="text-yellow-400 text-sm">
                        <Link to="/login" className="underline">Login</Link> to place a bid
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Bid Amount (₹)
                      </label>
                      <div className="flex space-x-3">
                        <div className="flex-1 relative">
                          <FaGavel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="number" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(e.target.value)} 
                            placeholder={`Minimum: ₹${auction.currentBid + 1}`} 
                            className="form-input pl-10" 
                            min={auction.currentBid + 1}
                            required 
                            disabled={!user || loading} 
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed" 
                          disabled={!user || loading}
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            'Place Bid'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-600 text-center">
                  <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Auction Ended</h3>
                  <p className="text-gray-300">
                    Winner: <span className="text-primary-400 font-semibold">
                      {auction.highestBidder?.username || 'No bids placed'}
                    </span>
                  </p>
                  <p className="text-gray-400 mt-1">
                    Final bid: <span className="text-primary-400 font-semibold">₹{auction.currentBid.toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;