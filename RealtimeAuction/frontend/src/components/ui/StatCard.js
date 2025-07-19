import React from 'react';

const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;