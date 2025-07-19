import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateAuctionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    endTime: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { title, description, startingBid, endTime, imageUrl } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (new Date(endTime) <= new Date()) {
      setError('End date must be in the future.');
      return;
    }
    try {
      // Send the form data to the backend API
      const res = await api.post('/auctions', formData);
      // Navigate to the newly created auction's page
      navigate(`/auctions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create auction. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>List a New Item</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={title} onChange={onChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label>Starting Bid (₹)</label>
          <input type="number" name="startingBid" value={startingBid} onChange={onChange} className="form-input" min="1" required />
        </div>
        <div className="form-group">
          <label>Auction End Time</label>
          <input type="datetime-local" name="endTime" value={endTime} onChange={onChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="url" name="imageUrl" value={imageUrl} onChange={onChange} className="form-input" required />
        </div>
        <button type="submit" className="btn btn-primary">List Item</button>
      </form>
    </div>
  );
};

export default CreateAuctionPage;