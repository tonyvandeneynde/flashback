import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
  ) {}

  async createGallery({
    name,
    parent,
    account,
  }: {
    name: string;
    parent: Folder;
    account: Account;
  }): Promise<Gallery> {
    const newGallery = this.galleryRepository.create({ name, parent, account });

    return this.galleryRepository.save(newGallery);
  }

  async deleteGallery({ id, accountId }: { id: number; accountId: number }) {
    return this.galleryRepository.softDelete({
      id,
      account: { id: accountId },
    });
  }
}
