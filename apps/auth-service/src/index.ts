import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";
import { producer } from "./utils/kafka.js";
import { ensureAdminUser } from "./utils/userStore.js";

const app = express();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3002,http://localhost:3003")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(authRoute);

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users", shouldBeAdmin, userRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const start = async () => {
  await ensureAdminUser();

  app.listen(8003, () => {
    console.log("Auth service is running on 8003");
  });

  try {
    await producer.connect();
    console.log("Kafka connected");
  } catch (error) {
    console.warn("[Auth service] Kafka unavailable — running without it:", (error as any)?.message);
  }
};

start();
