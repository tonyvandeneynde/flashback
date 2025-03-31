import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/database/entities';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getAllFolders(
    @Request() req: { user: { email: string } },
  ): Promise<User | null> {
    const email = req.user.email;

    if (!email) {
      throw new Error('Account not found');
    }

    return this.authService.getMe(email);
  }

  @Post('google')
  async googleAuth(@Body('code') code: string) {
    const result = await this.authService.signInWithGoogle(code);
    return result;
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return result;
  }
}
