import { Module } from '@nestjs/common';
import { B2Service } from './b2.service';

@Module({
  imports: [],
  providers: [B2Service],
  exports: [B2Service],
})
export class B2Module {}
