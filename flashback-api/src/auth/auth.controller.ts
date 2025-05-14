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
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get user information' })
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
  @ApiOperation({ summary: 'Sign in with Google' })
  async googleAuth(@Body('code') code: string) {
    const result = await this.authService.signInWithGoogle(code);
    return result;
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return result;
  }
}
