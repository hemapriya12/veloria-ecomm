import express from "express";
import cors from "cors";
import sessionRoute from "./routes/session.route.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";
import webhookRoute from "./routes/webhooks.route.js";

const app = express();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3002")
  .split(",").map((o) => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
}));

// Raw body needed for Stripe webhook signature verification
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/sessions", sessionRoute);
app.use("/webhooks", webhookRoute);

process.on("unhandledRejection", (reason) => {
  console.warn("[Payment service] Unhandled rejection (likely Kafka):", (reason as any)?.message ?? reason);
});

const start = async () => {
  app.listen(8002, () => {
    console.log(`Payment service is running on port 8002`);
  });

  try {
    await Promise.all([producer.connect(), consumer.connect()]);
    await runKafkaSubscriptions();
    console.log("Kafka connected");
  } catch (error) {
    console.warn("[Payment service] Kafka unavailable — running without it:", (error as any)?.message);
  }
};
start();
