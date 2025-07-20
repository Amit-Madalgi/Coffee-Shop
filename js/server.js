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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/signin`));
