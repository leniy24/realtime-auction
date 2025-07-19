import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaImage, FaDollarSign, FaClock, FaFileAlt } from 'react-icons/fa';

const CreateAuctionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    endTime: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, description, startingBid, endTime, imageUrl } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (new Date(endTime) <= new Date()) {
      setError('End date must be in the future.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auctions', formData);
      navigate(`/auctions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <FaPlus className="text-4xl text-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">List a New Item</h2>
            <p className="text-gray-400 mt-2">Create an auction for your item</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Title
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="title" 
                  value={title} 
                  onChange={onChange} 
                  className="form-input pl-10" 
                  placeholder="Enter item title"
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea 
                name="description" 
                value={description} 
                onChange={onChange} 
                className="form-input min-h-[120px] resize-none" 
                placeholder="Describe your item in detail..."
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Starting Bid (₹)
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    name="startingBid" 
                    value={startingBid} 
                    onChange={onChange} 
                    className="form-input pl-10" 
                    min="1" 
                    placeholder="100"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auction End Time
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="datetime-local" 
                    name="endTime" 
                    value={endTime} 
                    onChange={onChange} 
                    className="form-input pl-10" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <div className="relative">
                <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={imageUrl} 
                  onChange={onChange} 
                  className="form-input pl-10" 
                  placeholder="https://example.com/image.jpg"
                  required 
                />
              </div>
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPlus />
                  <span>Create Auction</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionPage;