// src/Components/Home/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">🛒 MicroService App</div>
        <ul className="navbar-links">
          {token ? (
            <>
              <li><Link to="/product">Products</Link></li>
                 <li><Link to="/health">Health Food Suggestion</Link></li>
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
             <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>

      <div className="home-content">
        <h1>Welcome to the MicroService App!</h1>
        <p>Explore products, manage orders, and complete secure payments.</p>
      </div>
      <img src="/Gemini_Generated_Image_m3a8oqm3a8oqm3a8.png" alt="" />
    </div>
  );
};

export default Home;
