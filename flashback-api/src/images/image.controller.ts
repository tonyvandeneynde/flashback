import {
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/auth';
import { AccountId } from 'src/auth/decorators/accountId.decorator';
import { UpdateImagesDto } from './update-images.dto';
import { UploadImagesDto } from './upload-images.dto';
import { PaginationDto } from './pagination.dto';
import { GetImagesDto } from './get-images.dto';
import { IMAGE_ROUTES } from './image.routes';

@UseGuards(JwtAuthGuard)
@Controller(IMAGE_ROUTES.BASE)
export class ImagesController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @ApiOperation({ summary: 'Get images' })
  async getImages(
    @Query() queryDto: GetImagesDto,
    @Query() paginationDto: PaginationDto,
    @AccountId() accountId: number,
  ) {
    const { galleryId, status } = queryDto;
    const { page, limit } = paginationDto;

    if (!galleryId) {
      return this.imageService.getAllImages(accountId, page, limit);
    }
    if (status === 'deleted') {
      return this.imageService.getDeletedImages(accountId);
    }

    return this.imageService.getImagesByGalleryId(
      accountId,
      galleryId,
      page,
      limit,
    );
  }

  @Get(IMAGE_ROUTES.TAGS)
  @ApiOperation({ summary: 'Get all tags' })
  async getAllTags() {
    return this.imageService.getAllTags();
  }

  @Post()
  @ApiOperation({ summary: 'Upload images' })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        galleryId: { type: 'number' },
        uploadId: { type: 'string' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadImagesDto: UploadImagesDto,
    @Request() req: { user: { email: string } },
    @AccountId() accountId: number,
  ) {
    const { galleryId, uploadId } = uploadImagesDto;
    const { email } = req.user;

    await this.imageService.uploadImages(
      files,
      accountId,
      email,
      galleryId,
      uploadId,
    );
  }

  @Put()
  @ApiOperation({ summary: 'Update images' })
  async updateImages(
    @Body() updateImagesDto: UpdateImagesDto,
    @AccountId() accountId: number,
  ) {
    const { ids, parentId, name } = updateImagesDto;

    return this.imageService.updateImages({
      ids,
      parentId,
      name,
      accountId: accountId,
    });
  }

  @Delete()
  @ApiOperation({ summary: 'Delete images by IDs' })
  async deleteImages(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
    @AccountId() accountId: number,
  ) {
    return this.imageService.deleteImages(ids, accountId);
  }
}
