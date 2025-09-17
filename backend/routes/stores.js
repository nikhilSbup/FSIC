const express = require('express');
const router = express.Router();
const { Store, Rating, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// List stores with optional search by name/address
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? { name: { [require('sequelize').Op.iLike]: '%' + q + '%' } } : {};
    const stores = await Store.findAll({ where, include: [{ model: Rating }] });
    // augment store with average rating and user's rating if any
    const userId = req.user.id;
    const out = await Promise.all(stores.map(async s => {
      const avg = await Rating.findOne({ attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']] , where: { storeId: s.id } });
      const userRating = await Rating.findOne({ where: { storeId: s.id, userId } });
      return {
        id: s.id, name: s.name, address: s.address, email: s.email,
        averageRating: avg && avg.dataValues && avg.dataValues.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null,
        userRating: userRating ? userRating.score : null
      }
    }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit or update rating for a store (1-5)
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) return res.status(400).json({ message: 'Score must be 1-5' });
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id } });
    if (existing) {
      existing.score = score; existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Rating updated' });
    } else {
      await Rating.create({ score, comment, userId: req.user.id, storeId });
      return res.json({ message: 'Rating created' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Store owner: view list of ratings for their store
router.get('/:id/ratings', authMiddleware, async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    // store owner or admin can view
    if (req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'STORE_OWNER' && req.user.id !== store.ownerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const ratings = await Rating.findAll({ where: { storeId }, include: [{ model: User, attributes: ['id','name','email'] }] });
    const avg = await Rating.findOne({ attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']] , where: { storeId } });
    return res.json({ average: avg && avg.dataValues && avg.dataValues.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null, ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
