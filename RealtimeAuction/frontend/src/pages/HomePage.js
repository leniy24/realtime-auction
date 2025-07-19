import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import AuctionCard from '../components/auction/AuctionCard';
import StatCard from '../components/ui/StatCard';
import { FaGavel, FaClock, FaExclamationTriangle, FaTrophy } from 'react-icons/fa';

const HomePage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/auctions').then(res => {
      setAuctions(res.data);
    }).catch(err => {
      console.error("Failed to fetch auctions", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const endingSoonAuctions = auctions.filter(a => (new Date(a.endTime) - now) / (1000 * 60 * 60) <= 24);
    const winningAuctions = auctions.filter(a => a.highestBidder?._id === user?._id);
    return {
      total: auctions.length,
      active: auctions.length,
      endingSoon: endingSoonAuctions.length,
      winning: user ? winningAuctions.length : 0,
    };
  }, [auctions, user]);

  const filteredAuctions = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case 'ending':
        return auctions.filter(a => (new Date(a.endTime) - now) / (1000 * 60 * 60) <= 24);
      case 'winning':
        return user ? auctions.filter(a => a.highestBidder?._id === user?._id) : [];
      default:
        return auctions;
    }
  }, [auctions, filter, user]);

  if (loading) return (
    <div className="loading-container">
      <div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading auctions...</p>
      </div>
    </div>
  );

  return (
    <main>
      <div className="page-header">
        <h1>Live Auctions</h1>
        <p>Discover amazing items and place your bids in real-time</p>
      </div>
      
      <div className="stats-grid">
        <StatCard title="Total Auctions" value={stats.total} icon={<FaGavel />} iconColor="#60a5fa" />
        <StatCard title="Active" value={stats.active} icon={<FaClock />} iconColor="#4ade80" />
        <StatCard title="Ending Soon" value={stats.endingSoon} icon={<FaExclamationTriangle />} iconColor="#facc15" />
        <StatCard title="You're Winning" value={stats.winning} icon={<FaTrophy />} iconColor="#34d399" />
      </div>

      <div className="filter-container">
        <div className="filter-tabs">
          <button 
            onClick={() => setFilter('all')} 
            className={`filter-tab ${
              filter === 'all' 
                ? 'active' 
                : ''
            }`}
          >
            All ({stats.total})
          </button>
          <button 
            onClick={() => setFilter('ending')} 
            className={`filter-tab ${
              filter === 'ending' 
                ? 'active' 
                : ''
            }`}
          >
            Ending Soon ({stats.endingSoon})
          </button>
          {user && (
            <button 
              onClick={() => setFilter('winning')} 
              className={`filter-tab ${
                filter === 'winning' 
                  ? 'active' 
                  : ''
              }`}
            >
              Winning ({stats.winning})
            </button>
          )}
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="empty-state">
          <FaGavel className="empty-icon" />
          <h3 className="empty-title">No auctions found</h3>
          <p className="empty-description">Try adjusting your filter or check back later for new auctions.</p>
        </div>
      ) : (
      <div className="auction-grid">
        {filteredAuctions.map(auction => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
      )}
    </main>
  );
};

export default HomePage;