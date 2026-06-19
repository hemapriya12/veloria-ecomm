import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  return res.json({
    message: "Order service is authenticated!",
    userId: req.userId,
  });
});

app.use("/", orderRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error!" });
});

process.on("unhandledRejection", (reason) => {
  console.warn("[Order service] Unhandled rejection (likely Kafka):", (reason as any)?.message ?? reason);
});

const start = async () => {
  await connectOrderDB();

  app.listen(8001, () => {
    console.log("Order service is running on port 8001");
  });

  try {
    await Promise.all([producer.connect(), consumer.connect()]);
    await runKafkaSubscriptions();
    console.log("Kafka connected");
  } catch (err) {
    console.warn("[Order service] Kafka unavailable — running without it:", (err as any)?.message);
  }
};
start();
