import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { LinkModule } from './link/link.module';
import { LinkController } from './link/link.controller';
import { B2Service } from './b2/b2.service';

@Module({
  imports: [LinkModule, UploadModule],
  controllers: [LinkController],
  providers: [B2Service],
})
export class AppModule {}
