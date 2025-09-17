const express = require('express');
const router = express.Router();
const { User, Store, Rating } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Admin-only routes (SYSTEM_ADMIN)
router.use(authMiddleware);
router.use(requireRole('SYSTEM_ADMIN'));

// Stats dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new user (admin)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    // Basic validation - name length already enforced by model
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: role || 'NORMAL_USER' });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List users with filters (name/email/address/role)
router.get('/users', async (req, res) => {
  try {
    const { name, email, address, role, sortBy='name', order='ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: '%' + name + '%' };
    if (email) where.email = { [Op.iLike]: '%' + email + '%' };
    if (address) where.address = { [Op.iLike]: '%' + address + '%' };
    if (role) where.role = role;
    const users = await User.findAll({ where, order: [[sortBy, order]] , attributes: ['id','name','email','address','role'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List stores with rating
router.get('/stores', async (req, res) => {
  try {
    const { sortBy='name', order='ASC' } = req.query;
    const stores = await Store.findAll({ order: [[sortBy, order]] });
    // attach rating
    const out = await Promise.all(stores.map(async s => {
      const avg = await Rating.findOne({ attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avg']], where: { storeId: s.id } });
      return { id: s.id, name: s.name, email: s.email, address: s.address, rating: avg && avg.dataValues && avg.dataValues.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null };
    }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
