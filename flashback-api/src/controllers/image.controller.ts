import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Image } from 'src/database/entities/image';
import { ImageService } from '../services';
import { StorageService } from 'src/services/storage.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImageService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  async getAllImages() {
    return this.imageService.getAllImages();
  }

  @Post('get-by-ids')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  async getImagesByIds(@Body('ids') ids: number[]) {
    return this.imageService.getImagesByIds(ids);
  }

  @Post('delete')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  async deleteImages(@Body('ids') ids: number[]) {
    return this.imageService.deleteImages(ids);
  }

  @Get('deleted')
  async getDeletedImages() {
    return this.imageService.getDeletedImages();
  }

  @Post('add-tag')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageId: { type: 'number' },
        tagName: { type: 'string' },
      },
    },
  })
  async addTagToImage(
    @Body('imageId') imageId: number,
    @Body('tagName') tagName: string,
  ) {
    return this.imageService.addTagToImage(imageId, tagName);
  }

  @Post('remove-tag')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageId: { type: 'number' },
        tagName: { type: 'string' },
      },
    },
  })
  async removeTagFromImage(
    @Body('imageId') imageId: number,
    @Body('tagName') tagName: string,
  ) {
    return this.imageService.removeTagFromImage(imageId, tagName);
  }

  @Get('tags')
  async getAllTags() {
    return this.imageService.getAllTags();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadPromises = files.map(async (file) => {
      const { originalPath, mediumPath, thumbnailPath } =
        await this.storageService.storeFile(file);

      const image = new Image();
      image.filename = file.originalname;
      image.originalPath = originalPath;
      image.mediumPath = mediumPath;
      image.thumbnailPath = thumbnailPath;

      await this.imageService.save(image);

      return {
        filename: file.originalname,
        originalPath,
        mediumPath,
        thumbnailPath,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  }
}
