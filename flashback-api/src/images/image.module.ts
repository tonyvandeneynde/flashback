import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ImageService } from './image.service';
import { AuthModule } from 'src/auth';
import { RabbitMQService } from 'src/rabbitMQ';
import { ImageGateway } from './image.gateway';
import { ImageUploadProgressConsumerService } from './image-upload-progress-consumer.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    ImageService,
    RabbitMQService,
    ImageUploadProgressConsumerService,
    ImageGateway,
  ],
  exports: [ImageService],
})
export class ImageModule {}
