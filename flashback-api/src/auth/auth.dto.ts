import { ApiProperty } from '@nestjs/swagger';

export class GetMeResponseDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
  })
  email: string;
}

export class GoogleAuthRequestDto {
  @ApiProperty({
    example: '4/0AX4XfWgVx...',
    description: 'Authorization code from Google',
  })
  code: string;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token for the user',
  })
  bearerToken: string | null | undefined;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token for the user',
  })
  refreshToken: string | null | undefined;
}

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token to generate a new access token',
  })
  refreshToken: string;
}
