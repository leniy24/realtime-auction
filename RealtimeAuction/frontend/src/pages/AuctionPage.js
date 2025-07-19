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
    <div className="loading-container">
      <div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading auction...</p>
      </div>
    </div>
  );

  const isAuctionOver = new Date(auction.endTime) < new Date();

  return (
    <main>
      <Link 
          to="/" 
          className="back-link"
        >
          <FaArrowLeft />
          <span>Back to Auctions</span>
        </Link>
        
        <div className="auction-detail">
          <div className="auction-detail-grid">
            <div className="auction-detail-image">
              <img 
                src={auction.imageUrl} 
                alt={auction.title} 
              />
            </div>
            
            <div className="auction-detail-content">
              <div style={{marginBottom: '24px'}}>
                <h1 className="auction-detail-title">{auction.title}</h1>
                <div className="auction-detail-seller">
                  <FaUser className="mr-2" />
                  <span>Sold by: <span style={{color: '#4ecdc4', fontWeight: '600'}}>{auction.seller?.username || 'Unknown'}</span></span>
                </div>
                <p className="auction-detail-description">{auction.description}</p>
              </div>
              
              <div className="bid-section">
                <div className="bid-grid">
                  <div>
                    <p className="bid-label-large">Current Bid</p>
                    <p className="bid-amount-large">₹{auction.currentBid.toLocaleString()}</p>
                    {auction.highestBidder && (
                      <p className="highest-bidder">
                        by {auction.highestBidder.username}
                      </p>
                    )}
                  </div>
                  <div className="time-remaining">
                    <p className="bid-label-large">Time Left</p>
                    <div className="time-display">
                      <FaClock style={{color: isAuctionOver ? '#ff6b6b' : '#ffd700'}} />
                      <p className="time-value" style={{color: isAuctionOver ? '#ff6b6b' : '#ffd700'}}>
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
              
              {!isAuctionOver ? (
                <div>
                  {!user && (
                    <div style={{background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '24px'}}>
                      <p style={{color: '#ffc107', fontSize: '0.9rem'}}>
                        <Link to="/login" style={{textDecoration: 'underline', color: '#ffc107'}}>Login</Link> to place a bid
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleBidSubmit}>
                    <div className="form-group">
                      <label className="form-label">
                        Your Bid Amount (₹)
                      </label>
                      <div className="bid-form">
                        <div className="bid-input-container">
                          <div className="input-container">
                            <FaGavel className="input-icon" />
                            <input 
                              type="number" 
                              value={bidAmount} 
                              onChange={(e) => setBidAmount(e.target.value)} 
                              placeholder={`Minimum: ₹${auction.currentBid + 1}`} 
                              className="form-input" 
                              min={auction.currentBid + 1}
                              required 
                              disabled={!user || loading} 
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={!user || loading}
                          style={{opacity: (!user || loading) ? 0.5 : 1, cursor: (!user || loading) ? 'not-allowed' : 'pointer'}}
                        >
                          {loading ? (
                            <div className="loading-spinner" style={{width: '20px', height: '20px', margin: 0}}></div>
                          ) : (
                            'Place Bid'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="winner-section">
                  <FaTrophy className="winner-icon" />
                  <h3 className="winner-title">Auction Ended</h3>
                  <p className="winner-info">
                    Winner: <span style={{color: '#4ecdc4', fontWeight: '600'}}>
                      {auction.highestBidder?.username || 'No bids placed'}
                    </span>
                  </p>
                  <p className="final-bid">
                    Final bid: <span style={{color: '#4ecdc4', fontWeight: '600'}}>₹{auction.currentBid.toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
    </main>
  );
};

export default AuctionPage;