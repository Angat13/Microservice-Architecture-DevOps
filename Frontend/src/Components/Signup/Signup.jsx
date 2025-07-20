import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      setResponse(data);

      // Show toast notification
      if (data.message === "Signup successful") {
        toast.success("✅ Signup successful!");
      } else if (data.message === "User already exists") {
        toast.info("ℹ️ User already exists!");
      }

      // Redirect if signup is successful or user already exists
      if (toast.success === "Signup successful" || toast.info === "User already exists") {
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('❌ Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={handleSignup}>Signup</button>

      {response?.message && (
        <p className={response.message === "Signup successful" ? "success" : "error"}>
          {response.message}
        </p>
      )}

      {response?.error && (
        <p className="error">{response.error}</p>
      )}
    </div>
  );
};

export default Signup;
