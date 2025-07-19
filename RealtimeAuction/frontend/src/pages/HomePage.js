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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading auctions...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Live Auctions</h1>
        <p className="text-gray-400">Discover amazing items and place your bids in real-time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Auctions" value={stats.total} icon={<FaGavel />} iconColor="#60a5fa" />
        <StatCard title="Active" value={stats.active} icon={<FaClock />} iconColor="#4ade80" />
        <StatCard title="Ending Soon" value={stats.endingSoon} icon={<FaExclamationTriangle />} iconColor="#facc15" />
        <StatCard title="You're Winning" value={stats.winning} icon={<FaTrophy />} iconColor="#34d399" />
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({stats.total})
          </button>
          <button 
            onClick={() => setFilter('ending')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              filter === 'ending' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Ending Soon ({stats.endingSoon})
          </button>
          {user && (
            <button 
              onClick={() => setFilter('winning')} 
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === 'winning' 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Winning ({stats.winning})
            </button>
          )}
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <FaGavel className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No auctions found</h3>
          <p className="text-gray-500">Try adjusting your filter or check back later for new auctions.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAuctions.map(auction => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
      )}
    </div>
  );
};

export default HomePage;