// src/controllers/storeOwnerController.js
const prisma = require("../lib/prisma");

exports.getMyStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!store)
      return res.status(404).json({ msg: "No store found for this owner" });

    const avg =
      store.ratings.length > 0
        ? store.ratings.reduce((a, b) => a + b.rating, 0) /
          store.ratings.length
        : 0;

    res.json({
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating: avg,
      ratings: store.ratings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
