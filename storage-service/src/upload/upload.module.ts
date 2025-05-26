import { Module } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitMQ/rabbitMQ.service';
import { UploadService } from './upload.service';
import { B2Module } from 'src/b2/b2.module';
import { ImageProcessingService } from './image-processing.service';

@Module({
  imports: [B2Module],
  providers: [RabbitMQService, UploadService, ImageProcessingService],
  exports: [],
})
export class UploadModule {}
