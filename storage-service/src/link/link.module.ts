import { Module } from '@nestjs/common';
import { B2Service } from 'src/b2/b2.service';

@Module({
  imports: [],
  providers: [B2Service],
  exports: [],
})
export class LinkModule {}
