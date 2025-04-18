import amqp from "amqplib/callback_api";
import { processUploadMessage } from "./uploadService";

const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds

// RabbitMQ connection
export const initializeRabbitMQ = async (retries = 0): Promise<void> => {
  amqp.connect(process.env.RABBITMQ_URL || "", (err, conn) => {
    if (err) {
      console.error(`RabbitMQ connection failed: ${err.message}`);
      if (retries < MAX_RETRIES) {
        console.log(
          `Retrying connection in ${RETRY_DELAY / 1000} seconds... (${
            retries + 1
          }/${MAX_RETRIES})`
        );
        setTimeout(() => initializeRabbitMQ(retries + 1), RETRY_DELAY);
      } else {
        console.error("Max retries reached. Could not connect to RabbitMQ.");
      }
      return;
    }

    console.log("Connected to RabbitMQ successfully.");
    conn.createConfirmChannel((err, ch) => {
      if (err) {
        console.error(`Failed to create channel: ${err.message}`);
        conn.close();
        return;
      }

      ch.assertQueue("image_uploads", { durable: true });

      // Limit the number of unacknowledged messages to 2
      ch.prefetch(2);

      ch.consume("image_uploads", async (msg) => {
        if (!msg) return;
        try {
          await processUploadMessage(msg, ch);
        } catch (error: any) {
          console.error(`Error processing message: ${error.message}`);
        }
      });
    });

    conn.on("error", (err) => {
      console.error(`RabbitMQ connection error: ${err.message}`);
    });

    conn.on("close", () => {
      console.log("RabbitMQ connection closed. Attempting to reconnect...");
      initializeRabbitMQ();
    });
  });
};
