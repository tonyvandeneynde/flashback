import amqp from "amqplib/callback_api";
import sharp from "sharp";
import b2ServiceInstance from "./b2Service";

interface File {
  filename: string;
  mediumFilename: string;
  thumbnailFilename: string;
  buffer: { data: string };
  mimetype: string;
}

interface UploadMessage {
  uploadId: string;
  file: File;
  status?: string;
}

// Helper function to parse the message content
const parseMessage = (msg: amqp.Message): UploadMessage => {
  return JSON.parse(msg.content.toString()) as UploadMessage;
};

// Helper function to publish messages with dynamic routing keys
const publishMessage = (
  ch: amqp.Channel,
  exchange: string,
  routingKey: string,
  message: UploadMessage,
  status: string
) => {
  const updatedMessage = { ...message, status };
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(updatedMessage)));
};

// Helper function to resize an image
const resizeImage = async (
  buffer: Buffer,
  options: { width: number; height: number; fit: "cover" | "outside" }
): Promise<Buffer> => {
  return sharp(buffer).resize(options).keepExif().toBuffer();
};

// Helper function to prepare upload tasks
const prepareUploadTasks = async (
  file: File
): Promise<{ filename: string; buffer: Buffer; mimetype: string }[]> => {
  const originalBuffer = Buffer.from(file.buffer.data, "base64");

  const mediumBuffer = await resizeImage(originalBuffer, {
    width: 500,
    height: 500,
    fit: "outside",
  });

  const thumbnailBuffer = await resizeImage(originalBuffer, {
    width: 150,
    height: 150,
    fit: "cover",
  });

  return [
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
};

// Helper function to handle errors
const handleError = (
  ch: amqp.Channel,
  exchange: string,
  message: UploadMessage,
  error: Error
) => {
  console.error(`Error processing upload: ${message.file.filename}`, error);
  publishMessage(ch, exchange, "image.upload.update", message, "fail");
};

// Main function to process the upload message
export const processUploadMessage = async (
  msg: amqp.Message,
  ch: amqp.Channel
) => {
  if (!msg) return;

  const message = parseMessage(msg);
  const { file } = message;

  // Publish processing status
  publishMessage(
    ch,
    "image_upload_status_exchange",
    "image.upload.update",
    message,
    "processing"
  );

  try {
    // Prepare upload tasks
    const uploadTasks = await prepareUploadTasks(file);

    // Upload files
    await Promise.all(
      uploadTasks.map((task) => b2ServiceInstance.uploadFile(task))
    );

    console.log(`File uploaded successfully: ${file.filename}`);

    // Publish success status
    publishMessage(
      ch,
      "image_upload_status_exchange",
      "image.upload.success",
      message,
      "success"
    );

    ch.ack(msg);
  } catch (err) {
    handleError(ch, "image_upload_status_exchange", message, err as Error);
    ch.ack(msg);
  }
};
