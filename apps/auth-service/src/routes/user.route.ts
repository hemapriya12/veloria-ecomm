import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../utils/userStore.js";
import { producer } from "../utils/kafka.js";

const router: Router = Router();

const sanitizeUser = (user: any) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  avatar: user.avatar,
  storeName: user.storeName,
  bio: user.bio,
  phone: user.phone,
  website: user.website,
});

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.status(200).json(users.map(sanitizeUser));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(sanitizeUser(user));
});

router.post("/", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
      role: role === "seller" ? "seller" : "user",
    });

    producer.send("user.created", {
      value: {
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });

    res.status(201).json(sanitizeUser(user));
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Unable to create user" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, avatar, storeName, bio, phone, website } = req.body;
  try {
    const updated = await updateUser(id, { firstName, lastName, avatar, storeName, bio, phone, website });
    res.status(200).json(sanitizeUser(updated));
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Unable to update user" });
  }
});

router.post("/:id/change-password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required" });
  }
  try {
    await changePassword(id, currentPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Unable to change password" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteUser(id);
  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ id });
});

export default router;
