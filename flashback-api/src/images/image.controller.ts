import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Image } from 'src/database/entities/image';
import { StorageService } from 'src/storage/storage.service';
import * as ExifParser from 'exif-parser';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/auth';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImageService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  async getAllImages(
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.getAllImages(req.user.accountId);
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
  async getImagesByIds(
    @Body('ids') ids: number[],
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.getImagesByIds(ids, req.user.accountId);
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
  async deleteImages(
    @Body('ids') ids: number[],
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.deleteImages(ids, req.user.accountId);
  }

  @Get('deleted')
  async getDeletedImages(
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.getDeletedImages(req.user.accountId);
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
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.addTagToImage(
      imageId,
      tagName,
      req.user.accountId,
    );
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
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.removeTagFromImage(
      imageId,
      tagName,
      req.user.accountId,
    );
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
      image.name = file.originalname;
      image.originalPath = originalPath;
      image.mediumPath = mediumPath;
      image.thumbnailPath = thumbnailPath;

      // Extract EXIF metadata
      const buffer = file.buffer;
      const parser = ExifParser.create(buffer);
      const result = parser.parse();

      if (result.tags) {
        image.date = new Date(result.tags.CreateDate * 1000);
        image.latitude = result.tags.GPSLatitude;
        image.longitude = result.tags.GPSLongitude;
      }

      await this.imageService.save(image);

      return {
        name: file.originalname,
        originalPath,
        mediumPath,
        thumbnailPath,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  }
}
