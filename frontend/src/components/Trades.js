import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Trades.css';

function Trades({ token, user }) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [formData, setFormData] = useState({
    symbol: 'BTCUSDT',
    type: 'buy',
    quantity: '',
    price: '',
    orderType: 'market'
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/trades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTrades(data.data);
      }
    } catch (error) {
      toast.error('Error fetching trades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTrade 
      ? `http://localhost:5000/api/v1/trades/${editingTrade._id}`
      : 'http://localhost:5000/api/v1/trades';
    
    const method = editingTrade ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(editingTrade ? 'Trade updated!' : 'Trade created!');
        setShowForm(false);
        setEditingTrade(null);
        setFormData({
          symbol: 'BTCUSDT',
          type: 'buy',
          quantity: '',
          price: '',
          orderType: 'market'
        });
        fetchTrades();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Network error');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/trades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Trade deleted successfully');
        fetchTrades();
      }
    } catch (error) {
      toast.error('Error deleting trade');
      console.error(error);
    }
  };

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setFormData({
      symbol: trade.symbol,
      type: trade.type,
      quantity: trade.quantity,
      price: trade.price,
      orderType: trade.orderType
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="trades-container">Loading...</div>;

  return (
    <div className="trades-container">
      <div className="trades-header">
        <h1>Your Trades</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'New Trade'}
        </button>
      </div>

      {showForm && (
        <div className="trade-form">
          <h2>{editingTrade ? 'Edit Trade' : 'Create New Trade'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Symbol</label>
                <select name="symbol" value={formData.symbol} onChange={handleChange} required>
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="BNBUSDT">BNB/USDT</option>
                  <option value="ADAUSDT">ADA/USDT</option>
                  <option value="SOLUSDT">SOL/USDT</option>
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.0001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (USDT)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Order Type</label>
              <select name="orderType" value={formData.orderType} onChange={handleChange}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop-loss">Stop Loss</option>
              </select>
            </div>
            <button type="submit" className="btn-submit">
              {editingTrade ? 'Update Trade' : 'Create Trade'}
            </button>
          </form>
        </div>
      )}

      <div className="trades-list">
        {trades.length === 0 ? (
          <p className="no-trades">No trades found. Create your first trade!</p>
        ) : (
          <table className="trades-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price (USDT)</th>
                <th>Total (USDT)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade._id}>
                  <td>{trade.symbol}</td>
                  <td className={`type-${trade.type}`}>{trade.type.toUpperCase()}</td>
                  <td>{trade.quantity}</td>
                  <td>${trade.price.toFixed(2)}</td>
                  <td>${(trade.quantity * trade.price).toFixed(2)}</td>
                  <td>
                    <span className={`status-${trade.status}`}>{trade.status}</span>
                  </td>
                  <td>{new Date(trade.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(trade)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(trade._id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Trades;