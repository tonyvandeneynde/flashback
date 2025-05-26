import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from 'src/rabbitMQ/rabbitMQ.service';
import { ImageProcessingService } from './image-processing.service';

@Injectable()
export class UploadService implements OnModuleInit {
  private channel: amqp.Channel;

  private readonly exchangeName = 'image_upload_exchange';
  private readonly queueName = 'image_uploads';
  private readonly routingKey = 'upload';

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly processImageService: ImageProcessingService,
  ) {}

  onModuleInit = async () => {
    this.channel = await this.rabbitMQService.getChannel();

    await this.setupExchangesAndQueues();

    this.consumeMessages(this.queueName);
  };

  private async setupExchangesAndQueues() {
    if (!this.channel) {
      console.error('No RabbitMQ channel available.');
      return;
    }

    await this.channel.assertExchange(this.exchangeName, 'direct', {
      durable: true,
    });
    await this.channel.assertQueue(this.queueName, { durable: true });
    await this.channel.bindQueue(
      this.queueName,
      this.exchangeName,
      this.routingKey,
    );

    console.log(
      `Exchange, queue, and bindings for upload set up successfully.`,
    );
  }

  private consumeMessages = (queue: string) => {
    this.channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            await this.processImageService.processUploadMessage(msg);

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
}
