import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

const getToken = (req: Request): string | null => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.replace("Bearer ", "");
};

const verifyToken = (token: string): Record<string, unknown> =>
  jwt.verify(token, process.env.NEXTAUTH_SECRET ?? "secret") as Record<string, unknown>;

export const shouldBeUser = (req: any, res: any, next: any): void => {
  const token = getToken(req);
  if (!token) { res.status(401).json({ message: "You are not logged in!" }); return; }
  try {
    const payload = verifyToken(token);
    req.userId = payload.id as string;
    req.role   = payload.role as string;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const shouldBeAdmin = (req: any, res: any, next: any): void => {
  const token = getToken(req);
  if (!token) { res.status(401).json({ message: "You are not logged in!" }); return; }
  try {
    const payload = verifyToken(token);
    if (payload.role !== "seller") { res.status(403).json({ message: "Unauthorized!" }); return; }
    req.userId = payload.id as string;
    req.role   = payload.role as string;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
