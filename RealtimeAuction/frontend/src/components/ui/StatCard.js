import React from 'react';

const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="text-4xl mb-2" style={{ color: iconColor }}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;