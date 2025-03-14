import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { REPOS } from 'src/database/constants';
import { Account, User } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    @Inject(REPOS.User)
    private readonly imageRepository: Repository<User>,
    @Inject(REPOS.Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
  }

  async getTokens(code: string) {
    const { tokens } = await this.client.getToken({
      code,
    });

    return tokens;
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return payload;
  }

  async signInWithGoogle(code: string) {
    const credentials = await this.getTokens(code);
    const { jwt } = await this.getUserJwtWithIdToken(
      credentials.id_token || '',
    );
    return { bearerToken: jwt, refreshToken: credentials.refresh_token };
  }

  async getUserJwtWithIdToken(id_token: string) {
    const payload = await this.verifyGoogleToken(id_token);
    if (!payload) {
      throw new Error('Invalid Google token');
    }

    const googleUser = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    const existingUser = await this.imageRepository.findOne({
      where: { email: googleUser.email },
      relations: ['account'],
    });

    if (!existingUser) {
      throw new Error('Unauthorized');
    }

    const jwt = this.jwtService.sign({
      accountId: existingUser.account.id,
      email: existingUser.email,
    });
    return { jwt };
  }

  async refreshToken(refreshToken: string) {
    const user = new UserRefreshClient(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
    );

    const { credentials } = await user.refreshAccessToken();
    const { jwt } = await this.getUserJwtWithIdToken(
      credentials.id_token || '',
    );
    return {
      bearerToken: jwt,
      refreshToken: credentials.refresh_token || refreshToken,
    };
  }
}
