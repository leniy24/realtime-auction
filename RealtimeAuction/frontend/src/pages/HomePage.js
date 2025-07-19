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

  if (loading) return <p className="container">Loading auctions...</p>;

  return (
    <div className="container">
      <div className="stats-grid">
        <StatCard title="Total Auctions" value={stats.total} icon={<FaGavel />} iconColor="#60a5fa" />
        <StatCard title="Active" value={stats.active} icon={<FaClock />} iconColor="#4ade80" />
        <StatCard title="Ending Soon" value={stats.endingSoon} icon={<FaExclamationTriangle />} iconColor="#facc15" />
        <StatCard title="You're Winning" value={stats.winning} icon={<FaTrophy />} iconColor="#34d399" />
      </div>

      <div className="filter-tabs">
        <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>All ({stats.total})</button>
        <button onClick={() => setFilter('ending')} className={`filter-btn ${filter === 'ending' ? 'active' : ''}`}>Ending Soon ({stats.endingSoon})</button>
        {user && <button onClick={() => setFilter('winning')} className={`filter-btn ${filter === 'winning' ? 'active' : ''}`}>Winning ({stats.winning})</button>}
      </div>

      <div className="auction-grid">
        {filteredAuctions.map(auction => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;