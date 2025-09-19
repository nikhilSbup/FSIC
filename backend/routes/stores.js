const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const { authMiddleware } = require("../middleware/auth");
const { Op, fn, col } = require("sequelize");

// List stores with optional search by name/address
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { address: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const stores = await Store.findAll({ where });
    const userId = req.user.id;

    const out = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findOne({
          attributes: [[fn("AVG", col("score")), "avg"]],
          where: { storeId: s.id },
        });

        const userRating = await Rating.findOne({
          where: { storeId: s.id, userId },
        });

        return {
          id: s.id,
          name: s.name,
          address: s.address,
          email: s.email,
          averageRating: avg?.dataValues?.avg
            ? parseFloat(avg.dataValues.avg).toFixed(2)
            : null,
          userRating: userRating ? userRating.score : null,
        };
      })
    );

    res.json(out);
  } catch (err) {
    console.error("Error fetching stores:", err); // ✅ add log
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
