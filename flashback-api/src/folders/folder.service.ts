import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery } from 'src/database/entities';
import { Repository, TreeRepository, UpdateResult } from 'typeorm';
import { GalleryService } from '../gallery/gallery.service';
import { ImageService } from 'src/images/image.service';
import { MapDataResponseDto } from 'src/mapData';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Folder)
    private folderTreeRepository: TreeRepository<Folder>,
    private readonly GalleryService: GalleryService,
    private readonly ImageService: ImageService,
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
    folder.galleries = [];
    folder.subfolders = [];

    return this.folderTreeRepository.save(folder);
  }

  async getAllFolders(accountId: number): Promise<Folder[]> {
    let root = await this.folderTreeRepository.findOne({
      where: { account: { id: accountId }, parent: undefined },
      relations: ['galleries', 'galleries.coverImage', 'account'],
    });

    if (!root) {
      // Create the root folder if it doesn't exist
      root = await this.createFolder({
        accountId,
        name: 'Site Homepage',
        parentId: undefined,
      });
    }

    const folderTree = await this.folderTreeRepository.findDescendantsTree(
      root,
      { relations: ['galleries', 'galleries.coverImage', 'account'] },
    );

    // Resolve cover image names into presigned URLs recursively
    await this.resolveCoverImages([folderTree], accountId);

    return [folderTree];
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

  async getFolderDescendants(id: number): Promise<Folder[]> {
    const folder = await this.folderTreeRepository.findOneOrFail({
      where: { id },
    });

    const descendants = await this.folderTreeRepository.findDescendants(
      folder,
      { relations: ['galleries'] },
    );

    return descendants;
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

  // Get all map data of images from descending galleries of the folder
  async getMapData(
    accountId: number,
    folderId: number,
  ): Promise<MapDataResponseDto[]> {
    const descendantFolders = await this.getFolderDescendants(folderId);

    const descendingGalleries = descendantFolders.reduce(
      (acc: Gallery[], folder: Folder) => {
        const galleriesToShowInFolderMap = folder.galleries.filter(
          (gallery) => gallery.showImagesOnParentFolderMaps,
        );
        return [...acc, ...galleriesToShowInFolderMap];
      },
      [],
    );

    const descendingGalleriesIds = descendingGalleries.map(
      (gallery) => gallery.id,
    );

    const mapData = await this.ImageService.getMapData(
      accountId,
      descendingGalleriesIds,
    );

    return mapData;
  }

  async updateFolder({
    id,
    accountId,
    name,
    parentId,
    showMapInFolder,
  }: {
    id: number;
    accountId: number;
    name?: string;
    parentId?: number;
    showMapInFolder?: boolean;
  }): Promise<Folder> {
    const folder = await this.getFolderById({ id, accountId });
    if (name) {
      folder.name = name;
    }

    if (parentId !== undefined) {
      const parentFolder = await this.getFolderById({
        id: parentId,
        accountId,
      });
      folder.parent = parentFolder;
    }

    if (showMapInFolder !== undefined) {
      folder.showMapInFolder = showMapInFolder;
    }

    return this.folderTreeRepository.save(folder);
  }

  async deleteFolderWithSubFoldersAndGalleries({
    id,
    accountId,
  }: {
    id: number;
    accountId: number;
  }): Promise<Folder[]> {
    const folder = await this.getFolderById({ id, accountId });

    const descendants = await this.folderTreeRepository.findDescendants(folder);
    return this.folderTreeRepository.remove(descendants);
  }

  async deleteGallery({
    id,
    accountId,
  }: {
    id: number;
    accountId: number;
  }): Promise<UpdateResult> {
    return await this.GalleryService.deleteGallery({ id, accountId });
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

  private async resolveCoverImages(
    folders: Folder[],
    accountId: number,
  ): Promise<void> {
    for (const folder of folders) {
      for (const gallery of folder.galleries) {
        if (gallery.coverImage) {
          const resolvedImages = await this.ImageService.getImagesByIds(
            [gallery.coverImage.id],
            accountId,
          );

          const resolvedCoverImage = resolvedImages[0];

          gallery.coverImage.originalPath =
            resolvedCoverImage.originalPath || '';
          gallery.coverImage.mediumPath = resolvedCoverImage.mediumPath || '';
          gallery.coverImage.thumbnailPath =
            resolvedCoverImage.thumbnailPath || '';
        }
      }

      // Recursively resolve cover images for subfolders
      if (folder.subfolders && folder.subfolders.length > 0) {
        await this.resolveCoverImages(folder.subfolders, accountId);
      }
    }
  }
}
