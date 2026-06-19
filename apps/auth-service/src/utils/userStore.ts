import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: "seller" | "user";
  createdAt: string;
  avatar?: string;
  storeName?: string;
  bio?: string;
  phone?: string;
  website?: string;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const storagePath = join(__dirname, "..", "..", "users.json");

async function readFile() {
  try {
    const raw = await fs.readFile(storagePath, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch (error) {
    return [];
  }
}

async function writeFile(users: StoredUser[]) {
  await fs.writeFile(storagePath, JSON.stringify(users, null, 2), "utf-8");
}

export const getUsers = async () => readFile();
export const getUserById = async (id: string) => {
  const users = await readFile();
  return users.find((user) => user.id === id);
};

export const getUserByEmail = async (email: string) => {
  const users = await readFile();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  role = "user",
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "seller" | "user";
}) => {
  const users = await readFile();
  const existing = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    throw new Error("User already exists");
  }

  const user = {
    id: randomUUID(),
    firstName,
    lastName,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeFile(users);
  return user;
};

export const updateUser = async (
  id: string,
  updates: Partial<Pick<StoredUser, "firstName" | "lastName" | "avatar" | "storeName" | "bio" | "phone" | "website">>
) => {
  const users = await readFile();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx]!, ...updates };
  await writeFile(users);
  return users[idx]!;
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const users = await readFile();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await writeFile(users);
};

export const deleteUser = async (id: string) => {
  const users = await readFile();
  const filtered = users.filter((user) => user.id !== id);
  await writeFile(filtered);
  return filtered.length !== users.length;
};

export const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return;
  }

  const existing = await getUserByEmail(adminEmail);
  if (existing) {
    return;
  }

  await createUser({
    firstName: process.env.ADMIN_FIRST_NAME ?? "Admin",
    lastName: process.env.ADMIN_LAST_NAME ?? "User",
    email: adminEmail,
    password: adminPassword,
    role: "seller",
  });
};
