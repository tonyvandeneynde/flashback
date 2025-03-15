import { Inject, Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';

import { REPOS } from '../database/constants';
import { Account, Image, Tag, User } from '../database/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    // @Inject(REPOS.Image)
    // private readonly imageRepository: Repository<Image>,
    // @Inject(REPOS.Tag)
    // private readonly tagRepository: Repository<Tag>,
    // @Inject(REPOS.User)
    // private readonly userRepository: Repository<User>,
    // @Inject(REPOS.Account)
    // private readonly accountRepository: Repository<Account>,
  ) {}

  async save(fileDetails: Image, accountId: number, email: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !account) return null;

    fileDetails.addedByUser = user;
    fileDetails.account = account;
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

  async getImagesByIds(ids: number[], accountId: number) {
    return this.imageRepository.find({
      where: { id: In(ids), deletedAt: IsNull(), account: { id: accountId } },
      relations: ['tags'],
    });
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
