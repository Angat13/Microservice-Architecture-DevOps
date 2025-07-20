import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notification.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='notification-container'>
      <h2>Your Past Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className='order-card'>
            <p><strong>Username:</strong> {order.username || 'N/A'}</p>
            <p><strong>Product:</strong> {order.product || 'No product'}</p>
            <p><strong>Status:</strong> {order.paid ? 'Paid' : 'Pending'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
