import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetMeResponseDto,
  GoogleAuthRequestDto,
  RefreshTokenRequestDto,
  TokenResponseDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: GetMeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  @UseGuards(JwtAuthGuard)
  async getAllFolders(
    @Request() req: { user: { email: string } },
  ): Promise<GetMeResponseDto | null> {
    const email = req.user.email;

    if (!email) {
      throw new Error('Account not found');
    }

    return this.authService.getMe(email);
  }

  @Post('google')
  @ApiOperation({ summary: 'Sign in with Google' })
  @ApiResponse({
    status: 201,
    description: 'User signed in successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Google authorization code',
  })
  async googleAuth(
    @Body() body: GoogleAuthRequestDto,
  ): Promise<TokenResponseDto> {
    const result = await this.authService.signInWithGoogle(body.code);
    return result;
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid refresh token',
  })
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<TokenResponseDto> {
    const result = await this.authService.refreshToken(body.refreshToken);
    return result;
  }
}
