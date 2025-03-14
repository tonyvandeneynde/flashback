import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ImageService } from './image.service';
import { AuthModule } from 'src/auth';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
