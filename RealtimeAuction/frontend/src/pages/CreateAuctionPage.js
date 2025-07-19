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
    <div style={{minHeight: '100vh', padding: '40px 20px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="form-container">
          <div className="form-header">
            <FaPlus className="form-icon" />
            <h2 className="form-title">List a New Item</h2>
            <p className="form-subtitle">Create an auction for your item</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">
                Item Title
              </label>
              <div className="input-container">
                <FaFileAlt className="input-icon" />
                <input 
                  type="text" 
                  name="title" 
                  value={title} 
                  onChange={onChange} 
                  className="form-input" 
                  placeholder="Enter item title"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <textarea 
                name="description" 
                value={description} 
                onChange={onChange} 
                className="form-input form-textarea" 
                placeholder="Describe your item in detail..."
                required 
              />
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Starting Bid (₹)
                </label>
                <div className="input-container">
                  <FaDollarSign className="input-icon" />
                  <input 
                    type="number" 
                    name="startingBid" 
                    value={startingBid} 
                    onChange={onChange} 
                    className="form-input" 
                    min="1" 
                    placeholder="100"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Auction End Time
                </label>
                <div className="input-container">
                  <FaClock className="input-icon" />
                  <input 
                    type="datetime-local" 
                    name="endTime" 
                    value={endTime} 
                    onChange={onChange} 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Image URL
              </label>
              <div className="input-container">
                <FaImage className="input-icon" />
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={imageUrl} 
                  onChange={onChange} 
                  className="form-input" 
                  placeholder="https://example.com/image.jpg"
                  required 
                />
              </div>
              {imageUrl && (
                <div style={{marginTop: '16px'}}>
                  <p style={{fontSize: '0.9rem', color: '#b0b0b0', marginBottom: '8px'}}>Preview:</p>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)'}}
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
              className="btn btn-primary"
              style={{width: '100%', justifyContent: 'center', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              {loading ? (
                <div className="loading-spinner" style={{width: '20px', height: '20px', margin: 0}}></div>
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