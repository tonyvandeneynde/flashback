import amqp from "amqplib/callback_api";
import { authorizeAccount, getUploadUrl, uploadFile } from "./b2Service";
import { Server } from "socket.io";

async function processMessage(msg: amqp.Message, ch: amqp.Channel) {
  if (!msg) return;

  const { uploadId, files } = JSON.parse(msg.content.toString()) as {
    uploadId: string;
    files: { filename: string; buffer: { data: string }; mimetype: string }[];
  };

  try {
    const auth = await authorizeAccount();
    const uploadUrlData = await getUploadUrl(auth);

    for (const file of files) {
      try {
        const uploadResponse = await uploadFile(uploadUrlData, file);
        console.log(
          `File uploaded successfully: ${file.filename}`,
          uploadResponse
        );
      } catch (err) {
        console.error(`Error uploading file: ${file.filename}`, err);
      }
    }

    ch.ack(msg);
  } catch (err) {
    console.error("Error processing message:", err);
  }
}

// RabbitMQ connection
export const initializeRabbitMQ = (io: Server) => {
  amqp.connect(process.env.RABBITMQ_URL || "", (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      ch.assertQueue("image_uploads", { durable: true });

      ch.consume(
        "image_uploads",
        async (msg) => {
          if (!msg) return;
          await processMessage(msg, ch);
        },
        { noAck: false }
      );
    });
  });
};
