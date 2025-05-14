import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery, Image } from 'src/database/entities';
import { Repository } from 'typeorm';
import { MapDataResponseDto } from '../mapData';
import { ImageService } from 'src/images/image.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
    @InjectRepository(Folder) private folderRepository: Repository<Folder>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly ImageService: ImageService,
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
    const newGallery = this.galleryRepository.create({
      name,
      parent,
      account,
      showMapInGallery: true,
    });

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
    coverImageId,
    showMapInGallery,
    showImagesOnParentFolderMaps,
  }: {
    id: number;
    name?: string;
    parentId?: number;
    accountId: number;
    coverImageId?: number;
    showMapInGallery?: boolean;
    showImagesOnParentFolderMaps?: boolean;
  }) {
    const gallery = await this.getGalleryById({ id, accountId });

    if (name) {
      gallery.name = name;
    }

    if (parentId) {
      const newParent = await this.folderRepository.findOneOrFail({
        where: { id: parentId, account: { id: accountId } },
      });
      gallery.parent = newParent;
    }

    if (coverImageId) {
      const newCoverImage = await this.imageRepository.findOneOrFail({
        where: { id: coverImageId, account: { id: accountId } },
      });
      gallery.coverImage = newCoverImage;
    }

    if (showMapInGallery !== undefined) {
      gallery.showMapInGallery = showMapInGallery;
    }

    if (showImagesOnParentFolderMaps !== undefined) {
      gallery.showImagesOnParentFolderMaps = showImagesOnParentFolderMaps;
    }

    return this.galleryRepository.save(gallery);
  }

  async getMapDataByGalleryId(
    accountId: number,
    galleryId: number,
  ): Promise<MapDataResponseDto[]> {
    const mapData = this.ImageService.getMapData(accountId, [galleryId]);
    return mapData;
  }
}
