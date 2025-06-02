const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { username, password, shopNames } = req.body;
  if (
    !username ||
    !password ||
    !shopNames ||
    shopNames.length < 3 ||
    shopNames.length > 4
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        message:
          "Password must be 8+ characters with a number and special character",
      });
  }
  try {
    const db = getDB();
    const users = db.collection("users");
    const shops = db.collection("shops");

    const existingUser = await users.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    for (const name of shopNames) {
      const existingShop = await shops.findOne({ name });
      if (existingShop)
        return res
          .status(400)
          .json({ message: `Shop name ${name} already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await shops.insertMany(shopNames.map((name) => ({ name })));
    await users.insertOne({ username, password: hashedPassword, shopNames });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  const { username, password, rememberMe } = req.body;
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const expiresIn = rememberMe ? '7d' : '30m';
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn });
    res.json({ message: 'Login successful', token, shopNames: user.shopNames });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDB();
    const user = await db.collection('users').findOne({ username: decoded.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username, shopNames: user.shopNames });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout (optional, handled client-side)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});


module.exports = router;
