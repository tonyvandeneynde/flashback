import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { GalleryService } from './gallery.service';
import { ImageService } from 'src/images/image.service';
import { RabbitMQService } from 'src/rabbitMQ';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [GalleryService, ImageService, RabbitMQService],
  exports: [GalleryService],
})
export class GalleryModule {}
