import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { Repository, TreeRepository } from 'typeorm';
import { GalleryService } from '../gallery/gallery.service';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Folder)
    private folderTreeRepository: TreeRepository<Folder>,
    private readonly GalleryService: GalleryService,
  ) {}

  async createFolder({
    name,
    accountId,
    parentId,
  }: {
    name: string;
    accountId: number;
    parentId?: number;
  }): Promise<Folder> {
    const folder = this.folderTreeRepository.create({ name });

    if (parentId) {
      const parentFolder = await this.folderTreeRepository.findOneOrFail({
        relations: ['parent'],
        where: { id: parentId },
      });
      folder.parent = parentFolder;
    }

    const account = await this.accountRepository.findOneOrFail({
      where: { id: accountId },
    });

    folder.account = account;

    return this.folderTreeRepository.save(folder);
  }

  async getAllFolders(): Promise<Folder[]> {
    return this.folderTreeRepository.findTrees({ relations: ['galleries'] });
  }

  async getFolderPath(id: number): Promise<Folder> {
    const folder = await this.folderTreeRepository.findOneOrFail({
      where: { id },
    });

    const ancestorTree =
      await this.folderTreeRepository.findAncestorsTree(folder);

    if (!ancestorTree) {
      throw new NotFoundException(
        `Ancestor tree for folder with id ${id} not found`,
      );
    }
    return ancestorTree;
  }

  async getFolderById({
    id,
    accountId,
  }: {
    id: number;
    accountId: number;
  }): Promise<Folder> {
    return await this.folderTreeRepository.findOneOrFail({
      relations: ['galleries'],
      where: { id, account: { id: accountId } },
    });
  }

  async deleteFolderWithSubFoldersAndGalleries({
    id,
    accountId,
  }: {
    id: number;
    accountId: number;
  }): Promise<void> {
    const folder = await this.getFolderById({ id, accountId });

    const descendants = await this.folderTreeRepository.findDescendants(folder);
    this.folderTreeRepository.remove(descendants);
  }

  async addNewGalleryToFolder({
    galleryName,
    folderId,
    accountId,
  }: {
    galleryName: string;
    folderId: number;
    accountId: number;
  }): Promise<Gallery> {
    const folder = await this.folderTreeRepository.findOneOrFail({
      relations: ['account'],
      where: { id: folderId, account: { id: accountId } },
    });

    const newGallery = await this.GalleryService.createGallery({
      name: galleryName,
      parent: folder,
      account: folder.account,
    });

    return newGallery;
  }
}
