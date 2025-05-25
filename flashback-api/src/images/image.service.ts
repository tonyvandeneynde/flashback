import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';

import { Account, Gallery, Image, Tag, User } from '../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { createImageFromImageFile } from 'src/utils';
import { RabbitMQService } from 'src/rabbitMQ';
import axios from 'axios';

export interface Message {
  file: {
    filename: string;
    mediumFilename: string;
    thumbnailFilename: string;
    mimetype: string;
    size: number;
    buffer: { data: string };
  };
  image: Image;
  accountId: number;
  email: string;
  galleryId: number;
  uploadId: string;
}

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Gallery) private galleryRepository: Repository<Gallery>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async resolveImageUrls(images: Image[]) {
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const filenames = [
          image.originalPath,
          image.mediumPath,
          image.thumbnailPath,
        ];

        const presignedUrl = await axios.post<{
          downloadUrls: { downloadUrl: string }[];
        }>(`${process.env.STORAGE_SERVICE_URL}/download/link`, { filenames });

        const downloadUrls = presignedUrl.data.downloadUrls;

        return {
          id: image.id,
          name: image.name,
          date: image.date,
          height: image.height,
          width: image.width,
          latitude: image.latitude,
          longitude: image.longitude,
          orientation: image.orientation,
          tags: image.tags,
          originalPath: downloadUrls[0]?.downloadUrl || null,
          mediumPath: downloadUrls[1]?.downloadUrl || null,
          thumbnailPath: downloadUrls[2]?.downloadUrl || null,
        };
      }),
    );

    return imagesWithUrls;
  }

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
      order: { date: 'ASC' },
      relations: ['tags'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const resolvedImages = this.resolveImageUrls(images);

    return {
      data: resolvedImages,
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
      order: { date: 'ASC' },
      relations: ['tags'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const imagesWithUrls = await this.resolveImageUrls(images);

    return {
      data: imagesWithUrls,
      total,
      page,
      limit,
    };
  }

  async getImagesByIds(ids: number[], accountId: number) {
    const images = await this.imageRepository.find({
      where: { id: In(ids), deletedAt: IsNull(), account: { id: accountId } },
      order: { date: 'ASC' },
      relations: ['tags'],
    });

    const imagesWithUrls = await this.resolveImageUrls(images);

    return imagesWithUrls;
  }

  async updateImages({
    ids,
    name,
    parentId,
    accountId,
  }: {
    ids: number[];
    name?: string;
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

  async uploadImages(
    images: Express.Multer.File[],
    accountId: number,
    email: string,
    galleryId: number,
    uploadId: string,
  ) {
    try {
      const channel = await this.rabbitMQService.getChannel();

      images.forEach(async (imageFile) => {
        const image = createImageFromImageFile(imageFile);

        const message: Message = {
          file: {
            filename: image.originalPath,
            mediumFilename: image.mediumPath,
            thumbnailFilename: image.thumbnailPath,
            mimetype: imageFile.mimetype,
            size: imageFile.size,
            buffer: { data: imageFile.buffer.toString('base64') },
          },
          image,
          accountId,
          email,
          galleryId,
          uploadId,
        };

        // Send message to RabbitMQ to be uploaded to storage
        channel.publish(
          'image_upload_exchange',
          'upload',
          Buffer.from(JSON.stringify(message)),
        );

        console.log(`Image ${image.name} upload message sent to queue`);
      });

      return { message: 'Image upload initiated' };
    } catch (err) {
      console.error('Failed to send message to RabbitMQ:', err);
      throw new HttpException(
        'Failed to initiate image upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMapData(accountId: number, galleriesIds: number[]) {
    const images = await this.imageRepository.find({
      where: {
        deletedAt: IsNull(),
        latitude: Not(IsNull()),
        longitude: Not(IsNull()),
        thumbnailPath: Not(IsNull()),
        gallery: { id: In(galleriesIds) },
        account: { id: accountId },
      },
      relations: ['gallery'],
      order: { date: 'ASC' },
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
          galleryId: image.gallery.id,
        };
      }),
    );

    return mapData;
  }
}
