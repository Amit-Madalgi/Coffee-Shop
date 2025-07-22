const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');
const authRoutes = require('./authHandler');
const Contact = require('./contactModel'); // ⬅️ NEW: Contact model

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ⬅️ For form data

// Serve static files
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/favicon_io', express.static(path.join(__dirname, '../favicon_io')));
app.use('/js', express.static(__dirname));
app.use('/static', express.static(path.join(__dirname, '../static')));

// HTML Routes
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, '../static/index.html')));
app.get('/signin', (req, res) => res.sendFile(path.join(__dirname, '../static/signin.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../static/signup.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, '../static/cart.html')));

// Auth API
app.use('/api/auth', authRoutes);

// ✅ Contact form handler
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(200).json({ msg: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

// ... at the top with other imports
const Order = require('./orderModel'); // ⬅️ IMPORT THE NEW ORDER MODEL

// ... (your existing app setup, middleware, and other routes) ...

// ✅ NEW: API ENDPOINT TO PLACE AN ORDER
app.post('/api/orders/place', async (req, res) => {
    // We expect the request body to contain the cart items
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ msg: "Cannot place an order with an empty cart." });
    }

    try {
        // Create a new order document using the data from the request
        const newOrder = new Order({
            items: cartItems
        });

        // Save the new order to the database
        await newOrder.save();

        // Send a success response
        res.status(201).json({ msg: "Order placed and saved successfully!" });

    } catch (err) {
        console.error("Error saving order to database:", err);
        res.status(500).json({ msg: "Server error. Please try again later." });
    }
});

// ... (your app.listen call) ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/signin`));
