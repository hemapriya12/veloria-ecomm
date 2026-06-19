import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../utils/userStore.js";
import { producer } from "../utils/kafka.js";

const router: Router = Router();

const sanitizeUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    producer.send("user.created", {
      value: {
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });

    return res.status(201).json(sanitizeUser(user));
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unable to create user." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    },
    process.env.NEXTAUTH_SECRET || "secret",
    { expiresIn: "7d" },
  );

  return res.status(200).json({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    token,
  });
});

export default router;
