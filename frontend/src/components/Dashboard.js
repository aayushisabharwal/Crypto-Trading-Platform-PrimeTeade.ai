import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Dashboard.css';

function Dashboard({ user, token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/trades/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Role: {user?.role?.toUpperCase()}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Trades</h3>
          <div className="stat-value">{stats?.totalTrades || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Volume</h3>
          <div className="stat-value">${stats?.totalVolume?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <h3>Average Price</h3>
          <div className="stat-value">${stats?.avgPrice?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <h3>Buy/Sell Ratio</h3>
          <div className="stat-value">
            {stats?.buyCount || 0} / {stats?.sellCount || 0}
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/trades" className="action-btn">View All Trades</a>
          <a href="/trades?action=create" className="action-btn primary">Create New Trade</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;