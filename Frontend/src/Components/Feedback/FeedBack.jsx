import React, { useState } from 'react';
import axios from 'axios';
import "./FeedBack.css"

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // adjust if you're using context
      const res = await axios.post('http://localhost:5000/feedback', { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('Failed to send feedback');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className='feedback-container'>
      <h2>Submit Feedback</h2>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSubmit}>Send</button>
      <p>{status}</p>
    </div>
  );
};

export default Feedback;
