import amqp from "amqplib/callback_api";
import sharp from "sharp";
import b2ServiceInstance from "./b2Service";

// Process the upload file message
export const processUploadMessage = async (
  msg: amqp.Message,
  ch: amqp.ConfirmChannel
) => {
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

  // Send progress update to API (now in processing state)
  const startedMessage = {
    ...JSON.parse(msg.content.toString()),
    status: "processing",
  };
  ch.sendToQueue(
    "image_uploads_callback",
    Buffer.from(JSON.stringify(startedMessage))
  );

  try {
    // Create different sizes of the image
    const originalBuffer = Buffer.from(file.buffer.data, "base64");
    const mediumBuffer = await sharp(originalBuffer)
      .resize({ fit: "outside", width: 500, height: 500 })
      .keepExif()
      .toBuffer();
    const thumbnailBuffer = await sharp(originalBuffer)
      .resize({ fit: "cover", width: 150, height: 150 })
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
