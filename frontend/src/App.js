import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Trades from './components/Trades';
import Navbar from './components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Fetch user data
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Toaster position="top-right" />
      {token && <Navbar user={user} logout={logout} />}
      <Routes>
        <Route path="/login" element={
          !token ? <Login setToken={setToken} setUser={setUser} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/register" element={
          !token ? <Register setToken={setToken} setUser={setUser} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard user={user} token={token} /> : <Navigate to="/login" />
        } />
        <Route path="/trades" element={
          token ? <Trades token={token} user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;