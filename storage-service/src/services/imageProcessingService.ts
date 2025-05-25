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

class ImageProcessingService {
  private readonly exchange = "image_upload_status_exchange";

  // Parse the message content
  private parseMessage(msg: amqp.Message): UploadMessage {
    return JSON.parse(msg.content.toString()) as UploadMessage;
  }

  // Publish messages with dynamic routing keys
  private publishMessage(
    channel: amqp.Channel,
    routingKey: string,
    message: UploadMessage,
    status: string
  ) {
    const updatedMessage = { ...message, status };
    channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(updatedMessage))
    );
  }

  // Resize an image
  private async resizeImage(
    buffer: Buffer,
    options: { width: number; height: number; fit: "cover" | "outside" }
  ): Promise<Buffer> {
    return sharp(buffer).resize(options).toBuffer();
  }

  // Prepare upload tasks
  private async prepareUploadTasks(
    file: File
  ): Promise<{ filename: string; buffer: Buffer; mimetype: string }[]> {
    const originalBuffer = Buffer.from(file.buffer.data, "base64");

    const mediumBuffer = await this.resizeImage(originalBuffer, {
      width: 500,
      height: 500,
      fit: "outside",
    });

    const thumbnailBuffer = await this.resizeImage(originalBuffer, {
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
  }

  // Handle errors
  private handleError(
    channel: amqp.Channel,
    message: UploadMessage,
    error: Error
  ) {
    console.error(`Error processing upload: ${message.file.filename}`, error);
    this.publishMessage(channel, "image.upload.update", message, "fail");
  }

  // Process the upload message
  public async processUploadMessage(msg: amqp.Message, channel: amqp.Channel) {
    if (!msg) return;

    const message = this.parseMessage(msg);
    const { file } = message;

    // Publish processing status
    this.publishMessage(channel, "image.upload.update", message, "processing");

    try {
      // Prepare upload tasks
      const uploadTasks = await this.prepareUploadTasks(file);

      // Upload files
      await Promise.all(
        uploadTasks.map((task) => b2ServiceInstance.uploadFile(task))
      );

      console.log(`File uploaded successfully: ${file.filename}`);

      // Publish success status
      this.publishMessage(channel, "image.upload.success", message, "success");

      channel.ack(msg);
    } catch (err) {
      this.handleError(channel, message, err as Error);
      channel.ack(msg);
    }
  }
}

export default ImageProcessingService;
