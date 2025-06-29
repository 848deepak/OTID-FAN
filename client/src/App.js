import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import VerifyIdentity from './components/otid/VerifyIdentity';
import ReportFraud from './components/fraud/ReportFraud';
import LookupOtid from './components/fraud/LookupOtid';
import Dashboard from './components/pages/Dashboard';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set auth token header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        const res = await axios.get('/api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Load user data
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Error logging in'
      };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Load user data
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Error registering'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Private route component
  const PrivateRoute = ({ children }) => {
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        logout={logout} 
      />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Register register={register} />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login login={login} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard user={user} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/verify-identity" 
            element={
              <PrivateRoute>
                <VerifyIdentity user={user} />
              </PrivateRoute>
            } 
          />
          <Route path="/report-fraud" element={<ReportFraud />} />
          <Route path="/lookup-otid" element={<LookupOtid />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;