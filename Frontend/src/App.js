import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Profile from './Profile/Profile';
import Payment from './Payment/Payment';
import Admin from "./Admin/Admin.jsx"
import Product from './Product/Product.jsx';
import Home from './Home/Home.jsx';
import Feedback from './Components/Feedback/FeedBack.jsx';
import OrderHistory from './Components/Notification/Notification.jsx';
import HealthFoodSuggest from './Health/Health.jsx';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product" element={<Product />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/health" element={<HealthFoodSuggest />} />
        <Route path="/notification" element={<OrderHistory />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
