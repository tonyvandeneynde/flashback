import { Injectable, Logger } from '@nestjs/common';
import amqp from 'amqplib';
import sharp from 'sharp';
import { B2Service } from '../b2/b2.service';
import { RabbitMQService } from '../rabbitMQ/rabbitMQ.service';

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

@Injectable()
export class ImageProcessingService {
  private channel: amqp.Channel;
  private readonly logger = new Logger(ImageProcessingService.name);
  private readonly exchange = 'image_upload_status_exchange';

  constructor(
    private readonly b2Service: B2Service,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  onModuleInit = async () => {
    this.channel = await this.rabbitMQService.getChannel();
  };

  // Parse the message content
  private parseMessage(msg: amqp.Message): UploadMessage {
    return JSON.parse(msg.content.toString()) as UploadMessage;
  }

  // Publish messages with dynamic routing keys
  private publishMessage(
    channel: amqp.Channel,
    routingKey: string,
    message: UploadMessage,
    status: string,
  ) {
    const updatedMessage = { ...message, status };
    channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(updatedMessage)),
    );
  }

  // Resize an image
  private async resizeImage(
    buffer: Buffer,
    options: { width: number; height: number; fit: 'cover' | 'outside' },
  ): Promise<Buffer> {
    return sharp(buffer).resize(options).keepExif().toBuffer();
  }

  // Prepare upload tasks. Create original, medium, and thumbnail versions of the image.
  private async prepareUploadTasks(
    file: File,
  ): Promise<{ filename: string; buffer: Buffer; mimetype: string }[]> {
    const originalBuffer = Buffer.from(file.buffer.data, 'base64');

    const mediumBuffer = await this.resizeImage(originalBuffer, {
      width: 500,
      height: 500,
      fit: 'outside',
    });

    const thumbnailBuffer = await this.resizeImage(originalBuffer, {
      width: 150,
      height: 150,
      fit: 'cover',
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
    error: Error,
  ) {
    this.logger.error(
      `Error processing upload: ${message.file.filename}`,
      error.stack,
    );
    this.publishMessage(channel, 'image.upload.update', message, 'fail');
  }

  // Process the upload message
  public async processUploadMessage(msg: amqp.Message) {
    if (!msg) return;

    const message = this.parseMessage(msg);
    const { file } = message;

    // Publish processing status
    this.publishMessage(
      this.channel,
      'image.upload.update',
      message,
      'processing',
    );

    try {
      // Prepare upload tasks
      const uploadTasks = await this.prepareUploadTasks(file);

      // Upload files
      await Promise.all(
        uploadTasks.map((task) => this.b2Service.uploadFile(task)),
      );

      this.logger.log(`File uploaded successfully: ${file.filename}`);

      // Publish success status
      this.publishMessage(
        this.channel,
        'image.upload.success',
        message,
        'success',
      );
    } catch (err) {
      this.handleError(this.channel, message, err as Error);
    }
  }
}
