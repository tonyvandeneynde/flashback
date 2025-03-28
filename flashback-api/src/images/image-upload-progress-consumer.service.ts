// Listen for messages on the 'image_uploads_callback' queue
// The were send from the storage service after an image was successfully uploaded
// Save the image data to the database

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from '../rabbitMQ';
import { ImageService, Message } from './image.service';
import { ImageGateway } from './image.gateway';

type CallbackMessage = Message & {
  status: 'success' | 'fail';
};

@Injectable()
export class ImageUploadProgressConsumerService implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly imageService: ImageService,
    private readonly imageGateway: ImageGateway,
  ) {}

  async onModuleInit() {
    this.channel = await this.rabbitMQService.getChannel();
    await this.channel.assertQueue('image_uploads_callback', { durable: true });
    this.consumeMessages();
  }

  private consumeMessages() {
    this.channel.consume(
      'image_uploads_callback',
      async (msg) => {
        if (msg) {
          const { image, accountId, email, galleryId, status, uploadId } =
            JSON.parse(msg.content.toString()) as CallbackMessage;
          if (status === 'success') {
            await this.imageService.save(image, accountId, email, galleryId);
          }
          console.log(`Ack received for image ${image.name}: ${status}`);
          this.imageGateway.sendUploadStatus(uploadId, image.name, status);
          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }
}
