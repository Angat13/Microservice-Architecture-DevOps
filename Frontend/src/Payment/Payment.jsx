import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // <-- Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import './Payment.css';

const OrderPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();  // <-- Initialize navigate

  const handlePayment = async () => {
    if (!firstName || !lastName || !address) {
      toast.warning("Please fill all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5002/api/pay",
        {
          firstName,
          lastName,
          address,
          product: "Burger",  // Ideally, pass the selected product dynamically
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Payment Successful!");
      
      // Redirect to orders page after a short delay (optional)
      setTimeout(() => {
        navigate('/orders');  // <-- Change '/orders' to your actual order page route
      }, 3000);

    } catch (err) {
      console.error(err);
      toast.error("❌ Payment Failed! Please try again.");
    }
  };

  return (
    <div className='payment-container'>
      <h2>Payment Details</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      /><br />
      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      /><br />
      <button onClick={handlePayment}>Pay</button>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default OrderPage;
