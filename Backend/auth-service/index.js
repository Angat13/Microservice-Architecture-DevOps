const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());

// ===== Enable CORS for React Frontend =====
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== MongoDB Schemas & Models =====
const UserSchema = new mongoose.Schema({ username: { type: String, unique: true }, password: String });
const PaymentSchema = new mongoose.Schema({ username: String, amount: Number });
const FeedbackSchema = new mongoose.Schema({ username: String, message: String });
const NotificationSchema = new mongoose.Schema({ username: String, note: String });
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String, // "Veg", "Non-Veg", "Vegan"
  suitableFor: [String] // e.g. ["Diabetic", "Gluten-Free", "Low BP"]
});

const OrderSchema = new mongoose.Schema({
  username: String,
  product: String,
  paid: { type: Boolean, default: false },
  firstName: String,
  lastName: String,
  address: String
});



const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Product = mongoose.model('Product', ProductSchema);

// ===== JWT Secret =====
const SECRET = process.env.JWT_SECRET || 'supersecret';

// ===== Middleware: Token Verification =====



function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("🔐 Header:", authHeader);
  const token = authHeader?.split(' ')[1];
  console.log("🔑 Token:", token);
  console.log("🧬 JWT_SECRET:", SECRET); // Add this line

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.error("🚫 JWT Error:", err.message); // Add this
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}



// ===== Auth Routes =====
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'User already exists' });
    await User.create({ username, password });
    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ username }, SECRET, { expiresIn: '6h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});





// ===== Profile Route =====
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

// ===== Product Routes =====
app.get('/products', async (req, res) => {
  try {
    const productList = await Product.find();
    res.json(productList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

app.post('/products', verifyToken, async (req, res) => {
  const { name, price, description, image } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Product name and price are required' });

  try {
    const newProduct = await Product.create({ name, price, description, image });
    res.json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product', details: err.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});






// ===== Payment Integration with Python =====


app.post('/make-payment', verifyToken, async (req, res) => {
  try {
    const incomingToken = req.headers.authorization?.split(' ')[1];
    const response = await axios.post('http://localhost:5002/pay', {}, {
      headers: {
        Authorization: `Bearer ${incomingToken}`
      }
    });

    res.json({
      fromNode: 'Request sent to Python microservice',
      paymentServiceResponse: response.data
    });

  } catch (err) {
    console.error("🔥 Error calling Python payment service:", err.response?.data || err.message);

    // Send back the actual error status and message
    return res.status(err.response?.status || 500).json({
      error: 'Failed to process payment',
      details: err.response?.data || err.message
    });
  }
});



// ===== Feedback Service =====
app.post('/feedback', verifyToken, async (req, res) => {
  const { message } = req.body;
  try {
    await Feedback.create({ username: req.user.username, message });
    res.json({ message: 'Feedback received' });
  } catch (err) {
    res.status(500).json({ error: 'Feedback failed', details: err.message });
  }
});

// ===== Notification Service =====
// app.post('/notify', verifyToken, async (req, res) => {
//   const { note } = req.body;
//   try {
//     await Notification.create({ username: req.user.username, note });
//     res.json({ message: 'Notification sent' });
//   } catch (err) {
//     res.status(500).json({ error: 'Notification failed', details: err.message });
//   }
// });


app.get('/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ username: req.user.username }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// ===== Default Route =====
app.get('/', (req, res) => {
  res.json("Auth & Product Service is running 🚀");
});

// ===== Start Server =====
app.listen(5000, () => console.log('🟢 Auth & Product Service running on port 5000'));
