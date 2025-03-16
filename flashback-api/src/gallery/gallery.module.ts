import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from 'src/database/entities';
import { GalleryService } from './gallery.service';

@Module({
  imports: [DatabaseModule, AuthModule, TypeOrmModule.forFeature([Gallery])],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
