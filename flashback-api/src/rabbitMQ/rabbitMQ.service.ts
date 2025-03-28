import {
  Injectable,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy, OnApplicationShutdown {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    console.log('connect:', process.env.RABBITMQ_URL);
    if (this.connection) return;

    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL ?? '');
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.connection = null;
      });
      this.connection.on('close', () => {
        console.error('RabbitMQ connection closed');
        this.connection = null;
      });

      this.channel = await this.connection.createChannel();
      this.channel.on('error', (err) => {
        console.error('RabbitMQ channel error:', err);
        this.channel = null;
      });
      this.channel.on('close', () => {
        console.error('RabbitMQ channel closed');
        this.channel = null;
      });

      console.log('RabbitMQ connected and channel created');
    } catch (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      this.connection = null;
      this.channel = null;
    }
  }

  async getChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) {
      throw new Error('Failed to create RabbitMQ channel');
    }
    return this.channel;
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  async onModuleDestroy() {
    await this.close();
  }

  async onApplicationShutdown(signal: string) {
    console.log(`Received shutdown signal: ${signal}`);
    await this.close();
  }
}
