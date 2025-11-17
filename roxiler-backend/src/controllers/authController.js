const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashed,
        role: "user",
      },
    });

    res.json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });

    const token = generateToken(user.id, user.role);

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
