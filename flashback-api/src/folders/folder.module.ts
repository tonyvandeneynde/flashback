import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { FolderService } from './folder.service';
import { GalleryModule } from 'src/gallery';
import { ImageService } from 'src/images/image.service';
import { RabbitMQService } from 'src/rabbitMQ';

@Module({
  imports: [DatabaseModule, AuthModule, GalleryModule],
  providers: [FolderService, ImageService, RabbitMQService],
  exports: [FolderService],
})
export class FolderModule {}
