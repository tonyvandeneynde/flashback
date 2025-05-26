import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { connectionOptions } from './ormconfig';
import { Account, Folder, Image, Tag, User, Gallery } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => connectionOptions,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Folder, Image, Tag, User, Account, Gallery]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
