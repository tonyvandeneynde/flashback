import { Module } from '@nestjs/common';
import { ImagesController } from './images/image.controller';
import { AuthController, AuthModule } from './auth';
import { ImageModule } from './images/image.module';
import { StorageModule } from './storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { FolderSubscriber, FolderModule, FoldersController } from './folders';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ImageModule,
    StorageModule,
    FolderModule,
  ],
  controllers: [ImagesController, AuthController, FoldersController],
  providers: [FolderSubscriber],
})
export class AppModule {}
