import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  Folder,
  Gallery,
  Image,
  Tag,
  User,
} from 'src/database/entities';
import { GalleryService } from './gallery.service';
import { ImageService } from 'src/images/image.service';
import { RabbitMQService } from 'src/rabbitMQ';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forFeature([Account, Gallery, Folder, Image, User, Tag]),
  ],
  providers: [GalleryService, ImageService, RabbitMQService],
  exports: [GalleryService],
})
export class GalleryModule {}
