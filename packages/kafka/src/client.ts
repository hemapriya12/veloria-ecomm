import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
  const broker = process.env.UPSTASH_KAFKA_BROKER;
  const username = process.env.UPSTASH_KAFKA_USERNAME;
  const password = process.env.UPSTASH_KAFKA_PASSWORD;

  if (broker && username && password) {
    return new Kafka({
      clientId: service,
      brokers: [broker],
      ssl: true,
      sasl: {
        mechanism: "scram-sha-256",
        username,
        password,
      },
    });
  }

  // fallback for local development
  return new Kafka({
    clientId: service,
    brokers: ["localhost:9094", "localhost:9095"],
  });
};
