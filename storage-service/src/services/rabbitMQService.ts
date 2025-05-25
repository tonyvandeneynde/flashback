import amqp, { Connection, ConfirmChannel } from "amqplib/callback_api";
import { processUploadMessage } from "./uploadService";

const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: ConfirmChannel | null = null;
  private retries = 0;

  private readonly exchangeName = "image_upload_exchange";
  private readonly queueName = "image_uploads";
  private readonly routingKey = "upload";

  public async initialize(): Promise<void> {
    this.connect();
  }

  private connect(): void {
    amqp.connect(process.env.RABBITMQ_URL || "", (err, conn) => {
      if (err) {
        console.error(`RabbitMQ connection failed: ${err.message}`);
        if (this.retries < MAX_RETRIES) {
          this.retries++;
          console.log(
            `Retrying connection in ${RETRY_DELAY / 1000} seconds... (${
              this.retries
            }/${MAX_RETRIES})`
          );
          setTimeout(() => this.connect(), RETRY_DELAY);
        } else {
          console.error("Max retries reached. Could not connect to RabbitMQ.");
        }
        return;
      }

      console.log("Connected to RabbitMQ successfully.");
      this.connection = conn;
      this.retries = 0; // Reset retries on successful connection

      this.setupChannel();

      conn.on("error", (err) => {
        console.error(`RabbitMQ connection error: ${err.message}`);
      });

      conn.on("close", () => {
        console.log("RabbitMQ connection closed. Attempting to reconnect...");
        this.connect();
      });
    });
  }

  private setupChannel(): void {
    if (!this.connection) {
      console.error("No RabbitMQ connection available.");
      return;
    }

    this.connection.createConfirmChannel(async (err, channel) => {
      if (err) {
        console.error(`Failed to create channel: ${err.message}`);
        this.connection?.close();
        return;
      }

      console.log("Channel created successfully.");
      this.channel = channel;

      await this.setupExchangeAndQueue();

      channel.prefetch(2); // Limit the number of unacknowledged messages to 2

      channel.consume(this.queueName, async (msg) => {
        if (!msg) return;
        try {
          await processUploadMessage(msg, channel);
        } catch (error: any) {
          console.error(`Error processing message: ${error.message}`);
        }
      });

      channel.on("error", (err) => {
        console.error(`Channel error: ${err.message}`);
      });

      channel.on("close", () => {
        console.log("Channel closed. Recreating channel...");
        this.setupChannel();
      });
    });
  }

  private async setupExchangeAndQueue(): Promise<void> {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    await this.channel.assertExchange(this.exchangeName, "direct", {
      durable: true,
    });
    await this.channel.assertQueue(this.queueName, { durable: true });
    await this.channel.bindQueue(
      this.queueName,
      this.exchangeName,
      this.routingKey
    );

    console.log(`Exchange, queue, and bindings set up successfully.`);
  }
}
