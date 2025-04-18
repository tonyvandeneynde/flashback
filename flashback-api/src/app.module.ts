import { Module } from '@nestjs/common';
import { ImagesController } from './images/image.controller';
import { AuthController, AuthModule } from './auth';
import { ImageModule } from './images/image.module';
import { DatabaseModule } from './database/database.module';
import { FolderSubscriber, FolderModule, FoldersController } from './folders';
import { GalleryModule } from './gallery';
import { RabbitMQService } from './rabbitMQ';
import { GalleryController } from './gallery/gallery.controller';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ImageModule,
    FolderModule,
    GalleryModule,
  ],
  controllers: [
    ImagesController,
    AuthController,
    FoldersController,
    GalleryController,
  ],
  providers: [FolderSubscriber, RabbitMQService],
})
export class AppModule {}
