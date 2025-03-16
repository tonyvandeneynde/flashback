import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ImageService } from './image.service';
import { AuthModule } from 'src/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag, User, Image, Account, Gallery } from 'src/database/entities';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Image, Tag, Account, Gallery]),
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
