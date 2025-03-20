import { Inject, Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';

import { Account, Gallery, Image, Tag, User } from '../database/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
  ) {}

  async save(
    fileDetails: Image,
    accountId: number,
    email: string,
    galleryId: number,
  ) {
    const account = await this.accountRepository.findOneOrFail({
      where: { id: accountId },
    });
    const user = await this.userRepository.findOneOrFail({ where: { email } });

    const gallery = await this.galleryRepository.findOneOrFail({
      where: { id: galleryId, account: { id: accountId } },
    });

    fileDetails.addedByUser = user;
    fileDetails.account = account;
    fileDetails.gallery = gallery;
    return this.imageRepository.save(fileDetails);
  }

  async getAllImages(accountId: number, page: number, limit: number) {
    const [images, total] = await this.imageRepository.findAndCount({
      where: { deletedAt: IsNull(), account: { id: accountId } },
      relations: ['tags'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: images,
      total,
      page,
      limit,
    };
  }

  async getImagesByGalleryId(
    accountId: number,
    galleryId: number,
    page: number,
    limit: number,
  ) {
    const [images, total] = await this.imageRepository.findAndCount({
      where: {
        deletedAt: IsNull(),
        gallery: { id: galleryId },
        account: { id: accountId },
      },
      relations: ['tags'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: images,
      total,
      page,
      limit,
    };
  }

  async getImagesByIds(ids: number[], accountId: number) {
    return this.imageRepository.find({
      where: { id: In(ids), deletedAt: IsNull(), account: { id: accountId } },
      relations: ['tags'],
    });
  }

  async updateImages({
    ids,
    name,
    parentId,
    accountId,
  }: {
    ids: number[];
    name: string;
    parentId: number;
    accountId: number;
  }) {
    const images = await this.imageRepository.find({
      where: { id: In(ids), account: { id: accountId } },
    });

    images.forEach((image) => {
      if (name) {
        image.name = name;
      }

      if (parentId) {
        image.gallery = { id: parentId } as Gallery;
      }
    });

    return this.imageRepository.save(images);
  }

  async deleteImages(ids: number[], accountId: number) {
    const images = await this.imageRepository.find({
      where: { id: In(ids), account: { id: accountId } },
    });

    const imageIds = images.map((image) => image.id);

    return this.imageRepository.softDelete(imageIds);
  }

  async getDeletedImages(accountId: number) {
    return this.imageRepository.find({
      where: { deletedAt: Not(IsNull()), account: { id: accountId } },
      withDeleted: true,
      relations: ['tags'],
    });
  }

  async addTagToImage(
    imageId: number,
    tagName: string,
    accountId: number,
  ): Promise<Image | null> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId, account: { id: accountId } },
      relations: ['tags'],
    });
    let tag = await this.tagRepository.findOne({ where: { name: tagName } });

    // Create tag if it doesn't exist
    if (!tag) {
      tag = this.tagRepository.create({ name: tagName });
      await this.tagRepository.save(tag);
    }

    if (!image) return null;

    image.tags.push(tag);
    return this.imageRepository.save(image);
  }

  async removeTagFromImage(
    imageId: number,
    tagName: string,
    accountId: number,
  ): Promise<Image | null> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId, account: { id: accountId } },
      relations: ['tags'],
    });
    if (!image) return null;

    image.tags = image.tags.filter((tag) => tag.name !== tagName);
    return this.imageRepository.save(image);
  }

  async getAllTags() {
    return this.tagRepository.find();
  }
}
