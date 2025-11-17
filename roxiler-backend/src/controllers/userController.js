// src/controllers/userController.js
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// -----------------------------------------------------
// GET stores list (public OR logged-in)
// Includes: averageRating + userRating (if token present)
// -----------------------------------------------------
exports.getStoreList = async (req, res) => {
  try {
    let userId = null;

    // get userId from token if available
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      userId = null;
    }

    const stores = await prisma.store.findMany({
      include: {
        ratings: { include: { user: true } },
        owner: true,
      },
    });

    const response = stores.map((s) => {
      const avg =
        s.ratings.length > 0
          ? s.ratings.reduce((a, b) => a + b.rating, 0) / s.ratings.length
          : 0;

      let userRating = null;
      if (userId) {
        const found = s.ratings.find((r) => r.userId === Number(userId));
        if (found) {
          userRating = {
            id: found.id,
            rating: found.rating,
            improvement: found.improvement,
          };
        }
      }

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        owner: s.owner,
        averageRating: avg,
        userRating,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------
// Submit OR Update rating
// -----------------------------------------------------
exports.rateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating, improvement } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ msg: "Rating must be in range 1–5" });

    const existing = await prisma.rating.findFirst({
      where: { userId, storeId: Number(storeId) },
    });

    if (existing) {
      const updated = await prisma.rating.update({
        where: { id: existing.id },
        data: { rating, improvement },
      });
      return res.json({ msg: "Rating updated", updated });
    }

    const created = await prisma.rating.create({
      data: {
        userId,
        storeId: Number(storeId),
        rating,
        improvement,
      },
    });

    res.json({ msg: "Rating submitted", created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------
// Change password (user / store-owner)
// -----------------------------------------------------
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ msg: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
