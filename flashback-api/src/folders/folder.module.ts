import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { GalleryService } from 'src/gallery/gallery.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forFeature([Folder, Account, Gallery]),
  ],
  providers: [FolderService, GalleryService],
  exports: [FolderService],
})
export class FolderModule {}
