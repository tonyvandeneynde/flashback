import { Module } from '@nestjs/common';
import { ImagesController } from './images/image.controller';
import { AuthController, AuthModule } from './auth';
import { ImageModule } from './images/image.module';
import { StorageModule } from './storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { FolderSubscriber, FolderModule, FoldersController } from './folders';
import { GalleryModule } from './gallery';
import { RabbitMQService } from './rabbitMQ';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ImageModule,
    StorageModule,
    FolderModule,
    GalleryModule,
  ],
  controllers: [ImagesController, AuthController, FoldersController],
  providers: [FolderSubscriber, RabbitMQService],
})
export class AppModule {}
