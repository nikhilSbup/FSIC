const express = require("express");
const router = express.Router();
const { User, Store, Rating } = require("../models");
const { authMiddleware, requireRole } = require("../middleware/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");

router.use(authMiddleware);
router.use(requireRole("SYSTEM_ADMIN"));

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role: role || "NORMAL_USER",
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: "Email already registered" });
    }

    let updatedData = { name, email, address, role };
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    await user.update(updatedData);
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create store
router.post("/stores", async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name) return res.status(400).json({ message: "Store name is required" });
    const store = await Store.create({ name, email, address, ownerId });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update store
router.put("/stores/:id", async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.update({ name, email, address, ownerId });
    res.json({ message: "Store updated successfully", store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List users
router.get("/users", async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;
    const users = await User.findAll({
      where,
      order: [[sortBy, order]],
      attributes: ["id", "name", "email", "address", "role"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List stores with ratings
router.get("/stores", async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC" } = req.query;
    const stores = await Store.findAll({ order: [[sortBy, order]] });

    const out = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findOne({
          attributes: [[Sequelize.fn("AVG", Sequelize.col("score")), "avg"]],
          where: { storeId: s.id },
        });
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          address: s.address,
          rating: avg?.dataValues?.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null,
        };
      })
    );

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
