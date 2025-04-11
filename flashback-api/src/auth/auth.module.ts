import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jtw.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from 'src/database/entities';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Account]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AccountService],
  exports: [AuthService],
})
export class AuthModule {}
