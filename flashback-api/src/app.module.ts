import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ImagesController } from './controllers/image.controller';
import { ImageService } from './services';
import { StorageService } from './services/storage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ImagesController],
  providers: [ImageService, StorageService],
})
export class AppModule {}
