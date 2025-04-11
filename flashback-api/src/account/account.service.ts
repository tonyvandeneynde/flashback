import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, User } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createNewUserAndAccount(user: {
    email: string;
    name: string;
    picture: string;
  }): Promise<User> {
    const newAccount = this.accountRepository.create();

    await this.accountRepository.save(newAccount);

    const newUser = this.userRepository.create({
      ...user,
      account: newAccount,
    });

    return this.userRepository.save(newUser);
  }
}
