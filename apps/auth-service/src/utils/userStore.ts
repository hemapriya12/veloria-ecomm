import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/product-db";

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: "seller" | "user";
  createdAt: string;
  avatar?: string | null;
  storeName?: string | null;
  bio?: string | null;
  phone?: string | null;
  website?: string | null;
};

const toStoredUser = (user: any): StoredUser => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
});

export const getUsers = async (): Promise<StoredUser[]> => {
  const users = await prisma.user.findMany();
  return users.map(toStoredUser);
};

export const getUserById = async (id: string): Promise<StoredUser | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toStoredUser(user) : null;
};

export const getUserByEmail = async (email: string): Promise<StoredUser | null> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ? toStoredUser(user) : null;
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
}): Promise<StoredUser> => {
  const existing = await getUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role,
    },
  });
  return toStoredUser(user);
};

export const updateUser = async (
  id: string,
  updates: Partial<Pick<StoredUser, "firstName" | "lastName" | "avatar" | "storeName" | "bio" | "phone" | "website">>
): Promise<StoredUser> => {
  const user = await prisma.user.update({ where: { id }, data: updates });
  return toStoredUser(user);
};

export const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");
  await prisma.user.update({
    where: { id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};

export const ensureAdminUser = async (): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;

  const existing = await getUserByEmail(adminEmail);
  if (existing) return;

  await createUser({
    firstName: process.env.ADMIN_FIRST_NAME ?? "Admin",
    lastName: process.env.ADMIN_LAST_NAME ?? "User",
    email: adminEmail,
    password: adminPassword,
    role: "seller",
  });
  console.log("Admin user created");
};
