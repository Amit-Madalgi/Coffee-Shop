const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPass });
    await user.save();
    res.json({ msg: "✅ Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error" });
  }
  //console.log(req.body);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "✅ Login successful", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error" });
  }
});

module.exports = router;