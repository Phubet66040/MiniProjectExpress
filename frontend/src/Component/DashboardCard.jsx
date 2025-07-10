import React from 'react';
import '../Css/DashboardCard.css';

const DashboardCard = ({ title, value, icon, bgColor }) => {
    return (
        <div className={`dashboard-card ${bgColor}`}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-value">{value}</p>
            </div>
        </div>
    );
};

export default DashboardCard;
