// Listen for messages on the 'image_uploads_callback' queue
// They were send from the storage service after an image processing was started or successfully uploaded or failed to upload.
// Save the image data to the database

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from '../rabbitMQ';
import { ImageService, Message } from './image.service';
import { ImageGateway } from './image.gateway';

enum UploadStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  PROCESSING = 'processing',
}

type CallbackMessage = Message & {
  status: UploadStatus;
};

@Injectable()
export class ImageUploadProgressConsumerService implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly imageService: ImageService,
    private readonly imageGateway: ImageGateway,
  ) {}

  onModuleInit = async () => {
    this.channel = await this.rabbitMQService.getChannel();

    await this.setupExchangesAndQueues();

    this.consumeMessages(
      'image_upload_status_success',
      this.handleSuccessMessage.bind(this),
    );

    this.consumeMessages(
      'image_upload_status_update',
      this.handleFailMessage.bind(this),
    );
  };

  private async setupExchangesAndQueues() {
    await this.channel.assertExchange('image_upload_status_exchange', 'topic', {
      durable: true,
    });

    await this.channel.assertQueue('image_upload_status_success', {
      durable: true,
    });
    await this.channel.bindQueue(
      'image_upload_status_success',
      'image_upload_status_exchange',
      'image.upload.success',
    );

    await this.channel.assertQueue('image_upload_status_update', {
      durable: true,
    });
    await this.channel.bindQueue(
      'image_upload_status_update',
      'image_upload_status_exchange',
      'image.upload.update',
    );
  }

  private consumeMessages = (
    queue: string,
    handler: (msg: CallbackMessage) => Promise<void>,
  ) => {
    this.channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            const parsedMessage = JSON.parse(
              msg.content.toString(),
            ) as CallbackMessage;

            await handler(parsedMessage);

            this.channel.ack(msg);
          } catch (error) {
            console.error(
              `Error processing message from queue ${queue}:`,
              error,
            );
            this.channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false },
    );
  };

  private handleSuccessMessage = async (msg: CallbackMessage) => {
    const { image, accountId, email, galleryId, uploadId, status } = msg;

    // Save image data to the database
    await this.imageService.save(image, accountId, email, galleryId);
    console.log(`Success: Image ${image.name} saved successfully.`);

    // Notify the client about the upload status
    this.imageGateway.sendUploadStatus(uploadId, image.name, status);
  };

  private async handleFailMessage(msg: CallbackMessage) {
    const { image, uploadId, status } = msg;

    console.error(`Fail: Image ${image.name} failed to upload.`);

    // Notify the client about the upload failure
    this.imageGateway.sendUploadStatus(uploadId, image.name, status);
  }
}
