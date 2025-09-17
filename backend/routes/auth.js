const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const secret = process.env.JWT_SECRET || 'change_this_super_secret';

// Signup (Normal User)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    // Password policy: 8-16 chars, at least one uppercase and one special char
    if (!/^.*(?=.{8,16}$)(?=.*[A-Z])(?=.*\W).*$/.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role: 'NORMAL_USER' });
    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login (all roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update password
const { authMiddleware } = require('../middleware/auth');
router.post('/update-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });
    const ok = await bcrypt.compare(oldPassword, req.user.password);
    if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
    if (!/^.*(?=.{8,16}$)(?=.*[A-Z])(?=.*\W).*$/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    req.user.password = hashed;
    await req.user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
