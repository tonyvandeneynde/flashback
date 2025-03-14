import { Inject, Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';

import { REPOS } from '../database/constants';
import { Image, Tag } from '../database/entities';

@Injectable()
export class ImageService {
  constructor(
    @Inject(REPOS.Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(REPOS.Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async save(fileDetails: Image, accountId: number, email: string) {
    fileDetails.accountId = accountId;
    fileDetails.addedByUser = email;

    return this.imageRepository.save(fileDetails);
  }

  async getAllImages(accountId: number, page: number, limit: number) {
    const [images, total] = await this.imageRepository.findAndCount({
      where: { deletedAt: IsNull(), accountId },
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
      where: { id: In(ids), deletedAt: IsNull(), accountId },
      relations: ['tags'],
    });
  }

  async deleteImages(ids: number[], accountId: number) {
    const images = await this.imageRepository.find({
      where: { id: In(ids), accountId },
    });

    const imageIds = images.map((image) => image.id);

    return this.imageRepository.softDelete(imageIds);
  }

  async getDeletedImages(accountId: number) {
    return this.imageRepository.find({
      where: { deletedAt: Not(IsNull()), accountId },
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
      where: { id: imageId, accountId },
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
      where: { id: imageId, accountId },
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
