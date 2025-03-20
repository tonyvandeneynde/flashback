import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { GalleryService } from 'src/gallery/gallery.service';
import { GalleryModule } from 'src/gallery';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    GalleryModule,
    TypeOrmModule.forFeature([Folder, Account, Gallery]),
  ],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
