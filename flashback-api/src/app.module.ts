import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ImagesController } from './images/image.controller';
import { AuthController, AuthModule } from './auth';
import { ImageModule } from './images/image.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [DatabaseModule, AuthModule, ImageModule, StorageModule],
  controllers: [ImagesController, AuthController],
  providers: [],
})
export class AppModule {}
