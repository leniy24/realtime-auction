import React from 'react';

const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="text-content">
        <p>{title}</p>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;