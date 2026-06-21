import http from "http";
import sendMail from "./utils/mailer";
import { createConsumer, createKafkaClient } from "@repo/kafka";

// minimal health check server so Render knows the process is alive
http.createServer((_, res) => res.end("ok")).listen(8004);

const kafka = createKafkaClient("email-service");
const consumer = createConsumer(kafka, "email-service");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Welcome to E-commerce App",
              text: `Welcome ${username}. You account has been created!`,
            });
          }
        },
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Order has been created",
              text: `Hello! Your order: Amount: ${amount/100}, Status: ${status}`,
            });
          }
        },
      },
    ]);
  } catch (error) {
    console.warn("[Email service] Kafka unavailable — running without it:", (error as any)?.message);
  }
};

// keep process alive even if Kafka is unavailable
process.on("SIGTERM", () => process.exit(0));

start();
