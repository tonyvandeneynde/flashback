import amqp from "amqplib/callback_api";
import sharp from "sharp";
import b2ServiceInstance from "./b2Service";

const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds

const processMessage = async (msg: amqp.Message, ch: amqp.ConfirmChannel) => {
  if (!msg) return;

  const { file } = JSON.parse(msg.content.toString()) as {
    uploadId: string;
    file: {
      filename: string;
      mediumFilename: string;
      thumbnailFilename: string;
      buffer: { data: string };
      mimetype: string;
    };
  };

  const startedMessage = {
    ...JSON.parse(msg.content.toString()),
    status: "processing",
  };
  ch.sendToQueue(
    "image_uploads_callback",
    Buffer.from(JSON.stringify(startedMessage))
  );

  try {
    const originalBuffer = Buffer.from(file.buffer.data, "base64");
    const mediumBuffer = await sharp(originalBuffer)
      .resize(800)
      .keepExif()
      .toBuffer();
    const thumbnailBuffer = await sharp(originalBuffer)
      .resize(200)
      .keepExif()
      .toBuffer();

    const uploadTasks = [
      {
        filename: file.filename,
        buffer: originalBuffer,
        mimetype: file.mimetype,
      },
      {
        filename: file.mediumFilename,
        buffer: mediumBuffer,
        mimetype: file.mimetype,
      },
      {
        filename: file.thumbnailFilename,
        buffer: thumbnailBuffer,
        mimetype: file.mimetype,
      },
    ];

    for (const file of uploadTasks) {
      await b2ServiceInstance.uploadFile(file);
    }

    console.log(`File uploaded successfully: ${file.filename}`);

    // Send acknowledgment message to the callback queue so it can save the image data to the database
    const successMessage = {
      ...JSON.parse(msg.content.toString()),
      status: "success",
    };
    ch.sendToQueue(
      "image_uploads_callback",
      Buffer.from(JSON.stringify(successMessage))
    );

    ch.ack(msg);
  } catch (err) {
    console.error(`Error uploading file: ${file.filename}`, err);

    // Send acknowledgment message to the callback queue with status 'fail'
    const failMessage = {
      ...JSON.parse(msg.content.toString()),
      status: "fail",
    };
    ch.sendToQueue(
      "image_uploads_callback",
      Buffer.from(JSON.stringify(failMessage))
    );

    ch.ack(msg);
  }
};

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
      ch.prefetch(3);

      ch.consume("image_uploads", async (msg) => {
        if (!msg) return;
        try {
          await processMessage(msg, ch);
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
