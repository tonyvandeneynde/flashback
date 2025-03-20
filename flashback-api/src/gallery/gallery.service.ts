import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
    @InjectRepository(Folder) private folderRepository: Repository<Folder>,
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

  async getGalleryById({ id, accountId }: { id: number; accountId: number }) {
    return this.galleryRepository.findOneOrFail({
      where: { id, account: { id: accountId } },
    });
  }

  async updateGallery({
    id,
    name,
    parentId,
    accountId,
  }: {
    id: number;
    name?: string;
    parentId?: number;
    accountId: number;
  }) {
    const gallery = await this.getGalleryById({ id, accountId });

    if (name) {
      gallery.name = name;
    }

    if (parentId) {
      const parent = await this.folderRepository.findOneOrFail({
        where: { id: parentId, account: { id: accountId } },
      });
      gallery.parent = parent;
    }

    return this.galleryRepository.save(gallery);
  }
}
