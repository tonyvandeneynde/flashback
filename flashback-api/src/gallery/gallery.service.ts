import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Folder, Gallery, Image } from 'src/database/entities';
import { IsNull, Not, Repository } from 'typeorm';
import { MapDataDto } from '../dto';
import axios from 'axios';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
    @InjectRepository(Folder) private folderRepository: Repository<Folder>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
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

  async getMapDataByGalleryId(
    accountId: number,
    galleryId: number,
  ): Promise<MapDataDto[]> {
    const images = await this.imageRepository.find({
      where: {
        deletedAt: IsNull(),
        latitude: Not(IsNull()),
        longitude: Not(IsNull()),
        thumbnailPath: Not(IsNull()),
        gallery: { id: galleryId },
        account: { id: accountId },
      },
    });

    const mapData = await Promise.all(
      images.map(async (image) => {
        const filenames = [image.mediumPath];

        const presignedUrl = await axios.post<{
          downloadUrls: { downloadUrl: string }[];
        }>(`${process.env.STORAGE_SERVICE_URL}/download/link`, { filenames });

        const downloadUrls = presignedUrl.data.downloadUrls;

        return {
          id: image.id,
          latitude: image.latitude!,
          longitude: image.longitude!,
          imageUrl: downloadUrls[0].downloadUrl,
          galleryId: galleryId,
        };
      }),
    );

    return mapData;
  }
}
