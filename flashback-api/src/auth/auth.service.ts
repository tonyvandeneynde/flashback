import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { AccountService } from 'src/account/account.service';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private readonly accountService: AccountService,
    @InjectRepository(User) private userRepository: Repository<User>,
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

    let existingUser = await this.userRepository.findOne({
      where: { email: googleUser.email },
      relations: ['account'],
    });

    if (!existingUser) {
      if (!googleUser.email || !googleUser.name || !googleUser.picture) {
        throw new Error('Unauthorized');
      }

      const newUser = await this.accountService.createNewUserAndAccount({
        email: googleUser.email!,
        name: googleUser.name!,
        picture: googleUser.picture!,
      });

      existingUser = newUser;
    } else {
      existingUser.name = googleUser.name || existingUser?.name || '';
      existingUser.picture = googleUser.picture || existingUser?.picture || '';
      await this.userRepository.save(existingUser);
    }

    const jwt = this.jwtService.sign({
      accountId: existingUser.account.id,
      email: existingUser.email,
      name: existingUser.name,
      picture: existingUser.picture,
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

  async getMe(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log('user:', user);
    return user;
  }
}
