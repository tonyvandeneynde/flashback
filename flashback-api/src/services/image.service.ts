import { Inject, Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';

import { REPOS } from '../database/constants';
import { Image } from '../database/entities';

@Injectable()
export class ImageService {
  constructor(
    @Inject(REPOS.Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async save(fileDetails: Image) {
    return this.imageRepository.save(fileDetails);
  }

  async getAllImages() {
    return this.imageRepository.find({ where: { deletedAt: IsNull() } });
  }

  async getImagesByIds(ids: number[]) {
    return this.imageRepository.find({
      where: { id: In(ids), deletedAt: IsNull() },
    });
  }

  async deleteImages(ids: number[]) {
    return this.imageRepository.softDelete(ids);
  }

  async getDeletedImages() {
    return this.imageRepository.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
  }
}
