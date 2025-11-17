// src/controllers/adminController.js
const prisma = require("../lib/prisma");

// ---------------------------------------------
// Admin Dashboard Stats
// ---------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------
// Admin - Add User
// ---------------------------------------------
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const bcrypt = require("bcryptjs");
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        address,
        role,
      },
    });

    res.json({ msg: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------
// Admin - Add Store
// ---------------------------------------------
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: Number(ownerId),
      },
    });

    res.json({ msg: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------
// Admin - List All Users (with filters)
// ---------------------------------------------
exports.listUsers = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 20 } = req.query;
    const where = {};

    if (role) where.role = role;

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
      skip,
      take: Number(limit),
      orderBy: { id: "desc" },
    });

    const total = await prisma.user.count({ where });

    res.json({ data: users, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------
// Admin - Get User Details
// ---------------------------------------------
exports.getUserDetails = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ratings: {
          include: { store: true },
        },
      },
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------
// Admin - List Stores (with filters)
// ---------------------------------------------
exports.listStores = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const where = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      skip,
      take: Number(limit),
      orderBy: { id: "desc" },
    });

    const mapped = stores.map((s) => {
      const avg =
        s.ratings.length > 0
          ? s.ratings.reduce((a, b) => a + b.rating, 0) / s.ratings.length
          : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        owner: s.owner,
        averageRating: avg,
      };
    });

    const total = await prisma.store.count({ where });

    res.json({ data: mapped, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
