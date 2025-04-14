import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/auth';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  async getAllImages(
    @Request() req: { user: { accountId: number; email: string } },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.imageService.getAllImages(req.user.accountId, page, limit);
  }

  @Get('by-gallery')
  async getImagesByGalleryId(
    @Query('galleryId') galleryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.getImagesByGalleryId(
      req.user.accountId,
      galleryId,
      page,
      limit,
    );
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

  @Put('update')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        parentId: { type: 'number' },
        name: { type: 'string' },
      },
    },
  })
  async updateImages(
    @Body('ids') ids: number[],
    @Body('parentId') parentId: number,
    @Body('name') name: string,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    return this.imageService.updateImages({
      ids,
      parentId,
      name,
      accountId: req.user.accountId,
    });
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
        galleryId: { type: 'number' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('galleryId') galleryId: number,
    @Body('uploadId') uploadId: string,
    @Request() req: { user: { accountId: number; email: string } },
  ) {
    const { accountId, email } = req.user;

    this.imageService.uploadImages(
      files,
      accountId,
      email,
      galleryId,
      uploadId,
    );
  }
}
